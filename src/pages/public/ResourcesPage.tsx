import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, GraduationCap, FileText, Download, Eye, Star, X, Loader2, AlertCircle } from 'lucide-react';
import finalProjectImage from '../../assets/final-projects.svg';
import api from '../../api/client';
import { endpoints } from '../../api/routes';
import { simpleDebounce } from '../../utils/functions';
import ShareButton from '../../components/ShareButton';
import type { Grade } from '../../../types';

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('all');
  const [grade, setGrade] = useState('all');
  const [resourceType, setResourceType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // API data
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingResources, setLoadingResources] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResources, setTotalResources] = useState(0);

  // Search functionality
  const [gradeSearch, setGradeSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');

  // Filter grades and subjects based on search
  const filteredGrades = grades.filter(g =>
    g.name.toLowerCase().includes(gradeSearch.toLowerCase())
  );

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // Resource types
  const resourceTypes = [
    { id: 'summary', name: 'الملخصات', icon: FileText, color: 'emerald' },
    { id: 'handout', name: 'الملازم', icon: BookOpen, color: 'blue' },
    { id: 'paper', name: 'أوراق البحث', icon: FileText, color: 'purple' },
    { id: 'book', name: 'الكتب', icon: BookOpen, color: 'amber' }
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Helper functions
  const clearAllFilters = () => {
    setSearch('');
    setSubject('all');
    setGrade('all');
    setResourceType('all');
    setSortBy('newest');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (subject !== 'all') count++;
    if (grade !== 'all') count++;
    if (resourceType !== 'all') count++;
    return count;
  };

  // Popular subjects for quick filtering
  // const popularSubjects = subjects.slice(0, 6);

  // URL parameter management
  const updateURL = (params: any) => {
    const searchParams = new URLSearchParams();

    if (params.search && params.search.trim()) {
      searchParams.set('search', params.search);
    }
    if (params.subject && params.subject !== 'all') {
      searchParams.set('subject', params.subject);
    }
    if (params.grade && params.grade !== 'all') {
      searchParams.set('grade', params.grade);
    }
    if (params.resourceType && params.resourceType !== 'all') {
      searchParams.set('type', params.resourceType);
    }
    if (params.sortBy && params.sortBy !== 'newest') {
      searchParams.set('sort', params.sortBy);
    }

    const newURL = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  };

  const loadFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const searchParam = urlParams.get('search');
    const subjectParam = urlParams.get('subject');
    const gradeParam = urlParams.get('grade');
    const typeParam = urlParams.get('type');
    const sortParam = urlParams.get('sort');

    if (searchParam) setSearch(searchParam);
    if (subjectParam) setSubject(subjectParam);
    if (gradeParam) setGrade(gradeParam);
    if (typeParam) setResourceType(typeParam);
    if (sortParam) setSortBy(sortParam);
  };



  // Fetch filters and initial data
  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const [gradesRes, subjectsRes] = await Promise.all([
          api.get(endpoints.content.grades),
          api.get(endpoints.content.subjects),
        ]);
        setGrades(gradesRes.data);
        setSubjects(subjectsRes.data);
        // Fetch initial resources
        fetchResources({});
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
    loadFromURL();
  }, []);

  // Fetch resources function
  const fetchResources = async (params: any) => {
    console.log('Fetching resources with params:', params);
    setLoadingResources(true);
    setError(null);
    try {
      // Mock API call - replace with actual endpoint
      const mockResources = [
        {
          id: 1,
          title: 'ملخص الرياضيات - الصف السادس الابتدائي',
          type: 'summary',
          subject: 'الرياضيات',
          grade: 'السادس الابتدائي',
          downloads: 1250,
          rating: 4.8,
          size: '2.5 MB',
          pages: 45,
          author: 'د. أحمد محمد'
        },
        {
          id: 2,
          title: 'ملزمة الفيزياء - المرحلة الثانوية',
          type: 'handout',
          subject: 'الفيزياء',
          grade: 'الثانوية',
          downloads: 892,
          rating: 4.6,
          size: '8.1 MB',
          pages: 120,
          author: 'أ. فاطمة علي'
        },
        {
          id: 3,
          title: 'بحث في الكيمياء العضوية',
          type: 'paper',
          subject: 'الكيمياء',
          grade: 'الجامعية',
          downloads: 543,
          rating: 4.9,
          size: '1.8 MB',
          pages: 28,
          author: 'د. سارة حسن'
        }
      ];
      setResources(mockResources);
      setTotalResources(mockResources.length);
    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء تحميل المصادر');
    } finally {
      setLoadingResources(false);
    }
  };

  // Debounced search
  const debouncedSearch = useMemo(
    () => simpleDebounce((params: any) => {
      fetchResources(params);
    }, 500),
    []
  );

  // Handle filter changes
  useEffect(() => {
    const params: any = {
      search,
      subject,
      grade,
      resourceType,
      sortBy
    };

    // Update URL with current filters
    updateURL(params);

    // Prepare API params
    const apiParams: any = {};
    if (subject && subject !== 'all') apiParams.subject = subject;
    if (search) apiParams.search = search;
    if (grade && grade !== 'all') apiParams.grade = grade;
    if (resourceType && resourceType !== 'all') apiParams.type = resourceType;
    if (sortBy !== 'newest') apiParams.sort = sortBy;

    if (search.trim()) {
      debouncedSearch(apiParams);
    } else {
      fetchResources(apiParams);
    }
  }, [subject, grade, search, resourceType, sortBy, debouncedSearch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="size-12 animate-spin text-emerald-600 mx-auto" />
          <p className="text-gray-600">جاري تحميل المصادر...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              className="space-y-6"
              variants={fadeInUp}
            >
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                variants={fadeInUp}
              >
                مكتبة المصادر التعليمية
              </motion.h1>
              <motion.p
                className="text-emerald-100 text-lg md:text-xl max-w-3xl"
                variants={fadeInUp}
              >
                اكتشف آلاف المصادر التعليمية المجانية من ملخصات وملازم وكتب وأوراق بحث لجميع المواد والمراحل الدراسية
              </motion.p>

              {/* Hero Search Bar */}
              <motion.div
                className="max-w-2xl"
                variants={fadeInUp}
              >
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    type="text"
                    placeholder="ابحث في المصادر التعليمية..."
                    className="w-full pr-12 pl-4 py-4 text-lg rounded-xl border-0 bg-white shadow-lg focus:ring-4 focus:ring-white/30 focus:outline-none text-gray-900"
                  />
                  {loadingResources && search && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="size-5 text-emerald-600 animate-spin" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Popular Resource Types */}
              {resourceTypes.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-3 pt-4"
                  variants={fadeInUp}
                >
                  {resourceTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setResourceType(type.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                      >
                        <Icon className="size-4" />
                        {type.name}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="flex justify-center lg:justify-end"
              variants={fadeInUp}
            >
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-300/20 rounded-2xl absolute -top-4 -left-4 -z-10"></div>
                <div className="w-64 h-64 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <img src={finalProjectImage} alt="المصادر التعليمية" className="w-48 h-48 object-contain" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8"
          variants={fadeInUp}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Filter Summary */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Filter className="size-5 text-gray-600" />
                <span className="font-medium text-gray-900">
                  {totalResources.toLocaleString()} مصدر متاح
                </span>
              </div>

              {/* Active Filters */}
              {getActiveFiltersCount() > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">المرشحات النشطة:</span>
                  <div className="flex flex-wrap gap-2">
                    {search && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                        البحث: "{search.slice(0, 20)}{search.length > 20 ? '...' : ''}"
                        <button onClick={() => setSearch('')} className="hover:bg-emerald-200 rounded-full p-0.5">
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    {subject !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                        {subjects.find(s => s.id?.toString() === subject)?.name || subject}
                        <button onClick={() => setSubject('all')} className="hover:bg-emerald-200 rounded-full p-0.5">
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    {grade !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                        {grades.find(g => g.id?.toString() === grade)?.name || grade}
                        <button onClick={() => setGrade('all')} className="hover:bg-emerald-200 rounded-full p-0.5">
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    {resourceType !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                        {resourceTypes.find(t => t.id === resourceType)?.name}
                        <button onClick={() => setResourceType('all')} className="hover:bg-emerald-200 rounded-full p-0.5">
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      مسح الكل
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
              >
                <option value="newest">الأحدث</option>
                <option value="popular">الأكثر تحميلاً</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="title">الترتيب الأبجدي</option>
              </select>

              {/* Share Button */}
              <ShareButton
                title="📚 مكتبة المصادر التعليمية - نقرأ"
                description="اكتشف آلاف المصادر التعليمية المجانية من ملخصات وملازم وكتب وأوراق بحث لجميع المواد والمراحل الدراسية 📖✨

✅ مصادر مجانية 100%
📚 ملخصات وملازم شاملة  
🔬 أوراق بحث متخصصة
👥 آلاف الطلاب يستفيدون يومياً
🎯 جميع المواد والمراحل الدراسية

#نقرأ #تعليم_مجاني #مصادر_تعليمية #ملخصات #ملازم #أوراق_بحث"
                variant="secondary"
                utmParams={{
                  utm_source: 'resources_page',
                  utm_medium: 'social',
                  utm_campaign: 'resources_sharing',
                  utm_content: 'header_share_button'
                }}
                size="md"
              />

              {/* Mobile Filter Toggle */}
              <button
                className="lg:hidden inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Filter className="size-4" />
                مرشحات
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-white text-emerald-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {filtersOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setFiltersOpen(false)}
                />

                {/* Mobile Filter Panel */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
                >
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-2">
                        <Filter className="size-5 text-emerald-600" />
                        <h2 className="text-lg font-semibold text-gray-900">تصفية المصادر</h2>
                      </div>
                      <button
                        onClick={() => setFiltersOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="size-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Mobile Filter Content */}
                    <div className="space-y-6">
                      {/* Resource Type Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          <FileText className="inline size-4 mr-1" />
                          نوع المصدر
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="mobileResourceType"
                              value="all"
                              checked={resourceType === 'all'}
                              onChange={(e) => setResourceType(e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="mr-3 text-sm text-gray-700">جميع المصادر</span>
                          </label>
                          {resourceTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <label key={type.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="radio"
                                  name="mobileResourceType"
                                  value={type.id}
                                  checked={resourceType === type.id}
                                  onChange={(e) => setResourceType(e.target.value)}
                                  className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <Icon className="size-4 mr-2 text-gray-500" />
                                <span className="mr-1 text-sm text-gray-700">{type.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Grade Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          <GraduationCap className="inline size-4 mr-1" />
                          المرحلة الدراسية
                        </label>

                        <div className="mb-3">
                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200">
                            <input
                              type="radio"
                              name="mobileGrade"
                              value="all"
                              checked={grade === 'all'}
                              onChange={(e) => setGrade(e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="mr-3 text-sm font-medium text-gray-900">جميع المراحل</span>
                          </label>
                        </div>

                        {grades.length > 5 && (
                          <div className="mb-3">
                            <div className="relative">
                              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="البحث في المراحل..."
                                value={gradeSearch}
                                onChange={(e) => setGradeSearch(e.target.value)}
                                className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                          {filteredGrades.length > 0 ? (
                            filteredGrades.map((g) => (
                              <label key={g.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="radio"
                                  name="mobileGrade"
                                  value={g.id}
                                  checked={grade.toString() === g.id.toString()}
                                  onChange={(e) => setGrade(e.target.value)}
                                  className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="mr-3 text-sm text-gray-700">{g.name}</span>
                              </label>
                            ))
                          ) : (
                            <div className="text-center py-4 text-sm text-gray-500">
                              لا توجد مراحل مطابقة للبحث
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subject Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          <BookOpen className="inline size-4 mr-1" />
                          المادة الدراسية
                        </label>

                        <div className="mb-3">
                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200">
                            <input
                              type="radio"
                              name="mobileSubject"
                              value="all"
                              checked={subject === 'all'}
                              onChange={(e) => setSubject(e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="mr-3 text-sm font-medium text-gray-900">جميع المواد</span>
                          </label>
                        </div>

                        {subjects.length > 5 && (
                          <div className="mb-3">
                            <div className="relative">
                              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="البحث في المواد..."
                                value={subjectSearch}
                                onChange={(e) => setSubjectSearch(e.target.value)}
                                className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                          {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subj) => (
                              <label key={subj.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="radio"
                                  name="mobileSubject"
                                  value={subj.id}
                                  checked={subject.toString() === subj.id.toString()}
                                  onChange={(e) => setSubject(e.target.value)}
                                  className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="mr-3 text-sm text-gray-700">{subj.name}</span>
                              </label>
                            ))
                          ) : (
                            <div className="text-center py-4 text-sm text-gray-500">
                              لا توجد مواد مطابقة للبحث
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Clear Filters Button */}
                      <div className="pt-4 border-t border-gray-200 space-y-3">
                        <button
                          onClick={clearAllFilters}
                          className="w-full py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          مسح جميع المرشحات
                        </button>
                        <button
                          onClick={() => setFiltersOpen(false)}
                          className="w-full py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                          تطبيق المرشحات
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Sidebar Filters */}
          <div className="space-y-4">
            {/* Desktop Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block lg:sticky lg:top-24"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
                  <Filter className="size-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-900">تصفية المصادر</h2>
                </div>

                <div className="space-y-6">
                  {/* Resource Type Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <FileText className="inline size-4 mr-1" />
                      نوع المصدر
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="resourceType"
                          value="all"
                          checked={resourceType === 'all'}
                          onChange={(e) => setResourceType(e.target.value)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="mr-3 text-sm text-gray-700">جميع المصادر</span>
                      </label>
                      {resourceTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <label key={type.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="resourceType"
                              value={type.id}
                              checked={resourceType === type.id}
                              onChange={(e) => setResourceType(e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <Icon className="size-4 mr-2 text-gray-500" />
                            <span className="mr-1 text-sm text-gray-700">{type.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grade Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <GraduationCap className="inline size-4 mr-1" />
                      المرحلة الدراسية
                    </label>

                    <div className="mb-3">
                      <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200">
                        <input
                          type="radio"
                          name="grade"
                          value="all"
                          checked={grade === 'all'}
                          onChange={(e) => setGrade(e.target.value)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="mr-3 text-sm font-medium text-gray-900">جميع المراحل</span>
                      </label>
                    </div>

                    {grades.length > 5 && (
                      <div className="mb-3">
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="البحث في المراحل..."
                            value={gradeSearch}
                            onChange={(e) => setGradeSearch(e.target.value)}
                            className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                      {filteredGrades.length > 0 ? (
                        filteredGrades.map((g) => (
                          <label key={g.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="grade"
                              value={g.id}
                              checked={grade.toString() === g.id.toString()}
                              onChange={(e) => setGrade(e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="mr-3 text-sm text-gray-700">{g.name}</span>
                          </label>
                        ))
                      ) : (
                        <div className="text-center py-4 text-sm text-gray-500">
                          لا توجد مراحل مطابقة للبحث
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subject Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <BookOpen className="inline size-4 mr-1" />
                      المادة الدراسية
                    </label>

                    <div className="mb-3">
                      <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200">
                        <input
                          type="radio"
                          name="subject"
                          value="all"
                          checked={subject === 'all'}
                          onChange={(e) => setSubject(e.target.value)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="mr-3 text-sm font-medium text-gray-900">جميع المواد</span>
                      </label>
                    </div>

                    {subjects.length > 5 && (
                      <div className="mb-3">
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="البحث في المواد..."
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                            className="w-full pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subj) => (
                          <label key={subj.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="subject"
                              value={subj.id}
                              checked={subject.toString() === subj.id.toString()}
                              onChange={(e) => setSubject(e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="mr-3 text-sm text-gray-700">{subj.name}</span>
                          </label>
                        ))
                      ) : (
                        <div className="text-center py-4 text-sm text-gray-500">
                          لا توجد مواد مطابقة للبحث
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={clearAllFilters}
                      className="w-full py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      مسح جميع المرشحات
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Resource Results */}
          <motion.div className="space-y-6" variants={fadeInUp}>
            {/* Error State */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                >
                  <AlertCircle className="size-5 text-red-600" />
                  <span className="text-red-700">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Header */}
            {!loadingResources && resources.length > 0 && (
              <motion.div
                className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FileText className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resources.length} مصدر متاح
                    </h3>
                    <p className="text-sm text-gray-600">
                      تم العثور على مصادر تعليمية متنوعة
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Resources Grid */}
            <AnimatePresence mode="wait">
              {loadingResources ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse p-6">
                      <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : !resources.length && !error ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-20 bg-white rounded-xl border border-gray-200"
                >
                  <div className="text-gray-300 mb-6">
                    <FileText className="size-20 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                    لم يتم العثور على أي مصادر
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    جرب تعديل معايير البحث أو المرشحات للعثور على مصادر مناسبة
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Filter className="size-4" />
                    مسح جميع المرشحات
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="resources"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {resources.map((resource) => {
                    const ResourceIcon = resourceTypes.find(t => t.id === resource.type)?.icon || FileText;
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                      >
                        {/* Resource Header */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                              <ResourceIcon className="size-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                                {resource.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{resource.subject}</span>
                                <span>•</span>
                                <span>{resource.grade}</span>
                              </div>
                            </div>
                          </div>

                          {/* Resource Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Download className="size-4" />
                                <span>{resource.downloads.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                <span>{resource.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>{resource.size}</span>
                              <span>•</span>
                              <span>{resource.pages} صفحة</span>
                            </div>
                          </div>
                        </div>

                        {/* Resource Actions */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-gray-600">
                              بواسطة: <span className="font-medium text-gray-900">{resource.author}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                              <Download className="size-4" />
                              تحميل
                            </button>
                            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
                              <Eye className="size-4" />
                              معاينة
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
