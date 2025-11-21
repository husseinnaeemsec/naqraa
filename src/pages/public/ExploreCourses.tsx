import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen, GraduationCap, AlertCircle, Loader2, X } from "lucide-react";
import type { Course, Grade } from "../../../types";
import PageLoader from "../../components/PageLoader";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import CourseCard from "../../components/CourseCard";
import { simpleDebounce } from "../../utils/functions";
import Pagination from "../../components/Paginator";
import ShareButton from "../../components/ShareButton";

const PAGE_SIZE = 10; // constant for pagination size

export default function ExploreCourses() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read params from URL
  const initialSearch = searchParams.get("search") || "";
  const initialSubject = searchParams.get("subject") || "all";
  const initialGrade = searchParams.get("grade") || "all";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // State
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [grade, setGrade] = useState<string | number>(initialGrade);
  const [search, setSearch] = useState(initialSearch);
  const [subject, setSubject] = useState(initialSubject);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [totalCourses, setTotalCourses] = useState(0);
  const [gradeSearch, setGradeSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');

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

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4 }
    },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  // ---------------- Fetch filters (grades + subjects)
  useEffect(() => {
    async function fetchFilters() {
      setLoadingFilters(true);
      try {
        const [gradesRes, subjectsRes] = await Promise.all([
          api.get(endpoints.content.grades),
          api.get(endpoints.content.subjects),
        ]);
        setGrades(gradesRes.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        console.error("Error fetching filters:", err);
        setError("حدث خطأ أثناء تحميل المواد والمراحل");
      } finally {
        setLoadingFilters(false);
      }
    }

    fetchFilters();
  }, []);

  // ---------------- Sync filters with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (subject && subject !== "all") params.set("subject", subject);
    if (grade && grade !== "all") params.set("grade", grade.toString());
    if (currentPage > 1) params.set("page", currentPage.toString());
    setSearchParams(params);
  }, [search, subject, grade, currentPage]);

  // ---------------- Fetch courses function
  const fetchCourses = useCallback(async (query_params: any) => {
    setLoadingCourses(true);
    setError(null);
    try {
      const res = await api.get(endpoints.courses.list, { params: query_params });
      setCourses(res.data.results);
      setTotalCourses(res.data.count);
      const total = Math.ceil(res.data.count / PAGE_SIZE);
      setTotalPages(total);
    } catch (e) {
      console.error(e);
      setError("حدث خطأ أثناء تحميل الدورات");
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  // ---------------- Debounced search
  const debouncedSearch = useMemo(
    () =>
      simpleDebounce((query_params: any) => {
        fetchCourses(query_params);
      }, 500),
    [fetchCourses]
  );

  // ---------------- Fetch courses when filters change
  useEffect(() => {
    const query_params: any = {};
    if (subject && subject !== "all") query_params["subject"] = subject;
    if (search) query_params["search"] = search;
    if (grade && grade !== "all") query_params["grade"] = grade;
    if (sortBy !== 'newest') query_params["sort"] = sortBy;
    query_params["page"] = currentPage;

    // reset page if filter changes
    setCurrentPage((prev) => (prev > 1 && (search || subject !== "all" || grade !== "all" || sortBy !== 'newest') ? 1 : prev));

    // choose between debounced (for search) and instant (for filters)
    if (search.trim()) debouncedSearch(query_params);
    else fetchCourses(query_params);
  }, [subject, grade, search, currentPage, sortBy]);

  // ---------------- Loading state
  if (loadingFilters) return <PageLoader />;

  // Helper functions for Udemy-like features
  const clearAllFilters = () => {
    setSearch('');
    setSubject('all');
    setGrade('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (subject !== 'all') count++;
    if (grade !== 'all') count++;
    return count;
  };

  // Popular subjects for quick filtering
  const popularSubjects = subjects.slice(0, 6);

  // Filter grades and subjects based on search
  const filteredGrades = grades.filter(grade => 
    grade.name.toLowerCase().includes(gradeSearch.toLowerCase())
  );
  
  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // ---------------- UI
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
          <div className="text-center space-y-6">
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              variants={fadeInUp}
            >
              تعلم مهارات جديدة في أي وقت وأي مكان
            </motion.h1>
            <motion.p 
              className="text-emerald-100 text-lg md:text-xl max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              اختر من بين آلاف الدورات التعليمية المتاحة واكتسب المهارات التي تحتاجها لتحقيق أهدافك
            </motion.p>
            
            {/* Hero Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  type="text"
                  placeholder="ما الذي تريد تعلمه اليوم؟"
                  className="w-full pr-12 pl-4 bg-white py-4 text-lg rounded-xl border-0 shadow-lg focus:ring-4 focus:ring-white/30 focus:outline-none text-gray-900"
                />
                {loadingCourses && search && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="size-5 text-emerald-600 animate-spin" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Popular Categories */}
            {popularSubjects.length > 0 && (
              <motion.div 
                className="flex flex-wrap justify-center gap-3 pt-4"
                variants={fadeInUp}
              >
                {popularSubjects.map((subj) => (
                  <button
                    key={subj.id}
                    onClick={() => setSubject(subj.id.toString())}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                  >
                    {subj.name}
                  </button>
                ))}
              </motion.div>
            )}
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
                  {totalCourses.toLocaleString()} دورة متاحة
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
                        {subjects.find(s => s.id.toString() === subject)?.name}
                        <button onClick={() => setSubject('all')} className="hover:bg-emerald-200 rounded-full p-0.5">
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    {grade !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                        {grades.find(g => g.id.toString() === grade)?.name}
                        <button onClick={() => setGrade('all')} className="hover:bg-emerald-200 rounded-full p-0.5">
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
                <option value="popular">الأكثر شعبية</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="title">الترتيب الأبجدي</option>
              </select>
              
              {/* Share Button */}
              <ShareButton 
                title="🎓 استكشف الدورات التعليمية - نقرأ"
                description="اكتشف آلاف الدورات التعليمية المجانية في جميع المجالات 📚✨

✅ دورات مجانية 100%
👨‍🏫 مدرسين متخصصين
🏆 شهادات معتمدة
📱 تعلم في أي وقت ومكان
🎯 مهارات عملية ومطلوبة

انضم لآلاف الطلاب واكتسب مهارات جديدة اليوم!

#نقرأ #تعليم_مجاني #دورات_اونلاين #مهارات #تطوير_ذاتي"
                variant="secondary"
                size="md"
                utmParams={{
                  utm_source: 'explore_courses',
                  utm_medium: 'social',
                  utm_campaign: 'courses_discovery',
                  utm_content: 'filter_bar_share'
                }}
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
                  <h2 className="text-lg font-semibold text-gray-900">تصفية النتائج</h2>
                </div>

                <div className="space-y-6">
                  {/* Grade Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <GraduationCap className="inline size-4 mr-1" />
                      المرحلة الدراسية
                    </label>
                    
                    {/* All Grades Option */}
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

                    {/* Search Input for Grades */}
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

                    {/* Scrollable Grades List */}
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
                    
                    {grades.length > 5 && (
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        {filteredGrades.length} من أصل {grades.length} مرحلة
                      </div>
                    )}
                  </div>

                  {/* Subject Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <BookOpen className="inline size-4 mr-1" />
                      المادة الدراسية
                    </label>
                    
                    {/* All Subjects Option */}
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

                    {/* Search Input for Subjects */}
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

                    {/* Scrollable Subjects List */}
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
                    
                    {subjects.length > 5 && (
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        {filteredSubjects.length} من أصل {subjects.length} مادة
                      </div>
                    )}
                  </div>

                  {/* Quick Filter Actions */}
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

            {/* Mobile Sidebar */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                  onClick={() => setFiltersOpen(false)}
                >
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Filter className="size-5 text-emerald-600" />
                        <h2 className="text-lg font-semibold text-gray-900">تصفية النتائج</h2>
                      </div>
                      <button
                        onClick={() => setFiltersOpen(false)}
                        className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="size-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Grade Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          <GraduationCap className="inline size-4 mr-1" />
                          المرحلة الدراسية
                        </label>
                        
                        {/* All Grades Option */}
                        <div className="mb-3">
                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200">
                            <input
                              type="radio"
                              name="grade-mobile"
                              value="all"
                              checked={grade === 'all'}
                              onChange={(e) => setGrade(e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="mr-3 text-sm font-medium text-gray-900">جميع المراحل</span>
                          </label>
                        </div>

                        {/* Search Input for Grades */}
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

                        {/* Scrollable Grades List */}
                        <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                          {filteredGrades.length > 0 ? (
                            filteredGrades.map((g) => (
                              <label key={g.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="radio"
                                  name="grade-mobile"
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
                        
                        {/* All Subjects Option */}
                        <div className="mb-3">
                          <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200">
                            <input
                              type="radio"
                              name="subject-mobile"
                              value="all"
                              checked={subject === 'all'}
                              onChange={(e) => setSubject(e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="mr-3 text-sm font-medium text-gray-900">جميع المواد</span>
                          </label>
                        </div>

                        {/* Search Input for Subjects */}
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

                        {/* Scrollable Subjects List */}
                        <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                          {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subj) => (
                              <label key={subj.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="radio"
                                  name="subject-mobile"
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
                          onClick={() => {
                            clearAllFilters();
                            setFiltersOpen(false);
                          }}
                          className="w-full py-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                        >
                          مسح جميع المرشحات
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Course Results */}
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
            {!loadingCourses && courses.length > 0 && (
              <motion.div 
                className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <BookOpen className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {totalCourses.toLocaleString()} دورة متاحة
                    </h3>
                    <p className="text-sm text-gray-600">
                      عرض {((currentPage - 1) * PAGE_SIZE) + 1} - {Math.min(currentPage * PAGE_SIZE, totalCourses)} من أصل {totalCourses.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">ترتيب حسب:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
                  >
                    <option value="newest">الأحدث</option>
                    <option value="popular">الأكثر شعبية</option>
                    <option value="rating">الأعلى تقييماً</option>
                    <option value="title">الترتيب الأبجدي</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Courses Grid */}
            <AnimatePresence mode="wait">
              {loadingCourses && courses.length === 0 ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
                      <div className="w-full h-48 bg-gray-200 rounded-t-xl"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        <div className="flex justify-between items-center pt-3">
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : !courses.length && !error ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-20 bg-white rounded-xl border border-gray-200"
                >
                  <div className="text-gray-300 mb-6">
                    <BookOpen className="size-20 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                    لم يتم العثور على أي دورات
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    جرب تعديل معايير البحث أو المرشحات للعثور على دورات مناسبة لك
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
                  key="courses"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {courses.map((course, index) => (
                    <motion.div 
                      key={course.id} 
                      variants={cardVariants}
                      custom={index}
                    >
                      <CourseCard course={course} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!loadingCourses && courses.length > 0 && totalPages > 1 && (
              <motion.div 
                variants={fadeInUp} 
                className="flex justify-center pt-8"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={totalPages}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
