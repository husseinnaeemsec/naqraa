import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen, GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import type { Course, Grade } from "../../../types";
import PageLoader from "../../components/PageLoader";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import CourseCard from "../../components/CourseCard";
import ResourceLoader from "../../components/resourceLoader";
import { simpleDebounce } from "../../utils/functions";
import Pagination from "../../components/Paginator";

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
    query_params["page"] = currentPage;

    // reset page if filter changes
    setCurrentPage((prev) => (prev > 1 && (search || subject !== "all" || grade !== "all") ? 1 : prev));

    // choose between debounced (for search) and instant (for filters)
    if (search.trim()) debouncedSearch(query_params);
    else fetchCourses(query_params);
  }, [subject, grade, search, currentPage]);

  // ---------------- Loading state
  if (loadingFilters) return <PageLoader />;

  // ---------------- UI
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-emerald-50 to-white"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Header Section */}
      <motion.div 
        className="bg-white/50 backdrop-blur-sm border-b border-emerald-100"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center space-y-4">
            <motion.h1 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900"
              variants={fadeInUp}
            >
              استكشف مجموعتنا من الدورات التعليمية
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-lg max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              اكتشف آلاف الدورات في جميع المواد الدراسية واختر ما يناسب مستواك التعليمي
            </motion.p>
            
            {/* Mobile Filter Toggle */}
            <motion.button
              className="lg:hidden inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
              onClick={() => setFiltersOpen(!filtersOpen)}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="size-4" />
              {filtersOpen ? 'إخفاء المرشحات' : 'عرض المرشحات'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar Filters */}
          {/* Sidebar Filters */}
          <div className="space-y-4">
            {/* Desktop Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block lg:sticky lg:top-24"
            >
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-6 shadow-lg space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
                  <Filter className="size-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-900">مرشحات البحث</h2>
                </div>

                <div className="space-y-4">
                  {/* Search Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البحث في الدورات
                    </label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        type="text"
                        placeholder="ما الذي تريد تعلمه؟"
                        className="w-full pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80"
                      />
                      {loadingCourses && search && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="size-4 text-emerald-600 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Grade Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <GraduationCap className="inline size-4 mr-1" />
                      المرحلة الدراسية
                    </label>
                    <select
                      value={grade || "all"}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80"
                    >
                      <option value="all">جميع المراحل الدراسية</option>
                      {grades.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BookOpen className="inline size-4 mr-1" />
                      المادة الدراسية
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80"
                    >
                      <option value="all">جميع المواد الدراسية</option>
                      {subjects.map((subj) => (
                        <option key={subj.id} value={subj.id}>
                          {subj.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Filters Summary */}
                {(search || subject !== 'all' || grade !== 'all') && (
                  <motion.div 
                    className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-sm text-emerald-700 font-medium mb-1">المرشحات النشطة:</div>
                    <div className="space-y-1 text-xs text-emerald-600">
                      {search && <div>البحث: "{search}"</div>}
                      {subject !== 'all' && <div>المادة: {subjects.find(s => s.id.toString() === subject)?.name}</div>}
                      {grade !== 'all' && <div>المرحلة: {grades.find(g => g.id.toString() === grade)?.name}</div>}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="lg:hidden"
                >
                  <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-6 shadow-lg space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-2">
                        <Filter className="size-5 text-emerald-600" />
                        <h2 className="text-lg font-semibold text-gray-900">مرشحات البحث</h2>
                      </div>
                      <button
                        onClick={() => setFiltersOpen(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Search Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          البحث في الدورات
                        </label>
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                          <input
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            type="text"
                            placeholder="ما الذي تريد تعلمه؟"
                            className="w-full pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80"
                          />
                          {loadingCourses && search && (
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="size-4 text-emerald-600 animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Grade Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <GraduationCap className="inline size-4 mr-1" />
                          المرحلة الدراسية
                        </label>
                        <select
                          value={grade || "all"}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80"
                        >
                          <option value="all">جميع المراحل الدراسية</option>
                          {grades.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subject Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <BookOpen className="inline size-4 mr-1" />
                          المادة الدراسية
                        </label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80"
                        >
                          <option value="all">جميع المواد الدراسية</option>
                          {subjects.map((subj) => (
                            <option key={subj.id} value={subj.id}>
                              {subj.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Active Filters Summary */}
                    {(search || subject !== 'all' || grade !== 'all') && (
                      <motion.div 
                        className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="text-sm text-emerald-700 font-medium mb-1">المرشحات النشطة:</div>
                        <div className="space-y-1 text-xs text-emerald-600">
                          {search && <div>البحث: "{search}"</div>}
                          {subject !== 'all' && <div>المادة: {subjects.find(s => s.id.toString() === subject)?.name}</div>}
                          {grade !== 'all' && <div>المرحلة: {grades.find(g => g.id.toString() === grade)?.name}</div>}
                        </div>
                      </motion.div>
                    )}
                  </div>
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
                className="flex items-center justify-between border-b border-gray-200 pb-4"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-emerald-600" />
                  <span className="text-lg font-medium text-gray-900">
                    تم العثور على {courses.length} دورة
                  </span>
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
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 animate-pulse shadow-md">
                      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </motion.div>
              ) : !courses.length && !error ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-16"
                >
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="size-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    لم يتم العثور على أي دورات
                  </h3>
                  <p className="text-gray-500">
                    جرب تعديل معايير البحث أو المرشحات للعثور على دورات مناسبة
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="courses"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {courses.map((course) => (
                    <motion.div key={course.id} variants={cardVariants}>
                      <CourseCard course={course} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!loadingCourses && courses.length > 0 && (
              <motion.div variants={fadeInUp} className="flex justify-center pt-8">
                <Pagination
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  totalPages={totalPages}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
