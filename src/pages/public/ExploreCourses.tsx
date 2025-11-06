import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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
    <div className="max-w-8xl mx-auto p-6 min-h-screen space-y-5">
      {/* Header & Search */}
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl text-center font-semibold">
          تصفح آخر دوراتنا لجميع المواد الدراسية
        </h1>
        <div className="relative w-full max-w-3xl">

          {loadingCourses && search && (
            <div className="absolute right-3 top-2.5 text-gray-400 text-sm">جاري البحث...</div>
          )}
        </div>
      </div>

      {/* Filters + Courses */}
      <div className="gap-2 mt-10 grid lg:grid-cols-[25%_1fr]">
        {/* Sidebar Filters */}
        <div className="p-4 h-fit sticky top-20 bg-white border rounded-md space-y-2">
          <h1 className="border-b pb-3">ابحث عن دورات تناسب مرحلتك الدراسية</h1>
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex flex-col gap-y-2"> 
              <label htmlFor="grade" className="pb-2 block">
                البحث
              </label>
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                type="text"
                placeholder="مالذي تريد تعلمه ؟"
                className="w-full text-sm  bg-white border p-2 rounded-md"
              />
              <label htmlFor="grade" className="pb-2 block">
                المرحلة الدراسية
              </label>
              <select
                id="grade"
                value={grade || "all"}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm p-1.5 border rounded px-3"
              >
                <option value="all">كل المراحل</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="pb-2 block">
                المادة
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-1.5 text-sm border rounded px-3"
              >
                <option value="all">كل المواد</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {error && (
            <div className="p-4 text-red-600 text-center bg-red-50 border border-red-100 rounded-md mb-4">
              {error}
            </div>
          )}

          {!loadingCourses && !courses.length && !error && (
            <div className="p-4 text-center">لم يتم العثور على أي نتائج</div>
          )}

          <div className="lg:gap-5 gap-2 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
            {loadingCourses && courses.length === 0 && (
              <ResourceLoader className="text-center col-span-12 bg-white p-5 rounded-md shadow" />
            )}
            {!loadingCourses &&
              courses.map((c) => <CourseCard course={c} key={c.id} />)}
          </div>

          {!loadingCourses && courses.length > 0 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
