import { Link } from "react-router-dom";
import { useAppSelector } from "../store/store";
import { useState, useEffect } from "react";
import api from "../api/client";
import { endpoints } from "../api/routes";
import { Play, BookOpen } from "lucide-react";

interface EnrollmentProgress {
  enrollment_id: number;
  progress_percentage: number;
  completed_lessons: number;
  total_lessons: number;
  last_accessed: string;
}

export default function LastWatchedCourseWidget() {
  const { user } = useAppSelector((state) => state.auth);
  const [progressData, setProgressData] = useState<EnrollmentProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrollment = user?.progress?.last_watched_enrollment;

  useEffect(() => {
    if (enrollment?.id) {
      fetchEnrollmentProgress();
    }
  }, [enrollment?.id]);

  const fetchEnrollmentProgress = async () => {
    if (!enrollment?.id) return;
    
    try {
      setLoading(true);
      // Use the correct enrollment endpoint
      const response = await api.get(endpoints.user.enrollments.getEnrollment(enrollment.id));
      
      // Calculate progress from enrollment data
      const enrollmentData = response.data;
      const sections = enrollmentData?.course?.sections;
      const totalSections = Array.isArray(sections) ? sections.length : 0;
      const completedSections = Array.isArray(enrollmentData?.completed_sections) 
        ? enrollmentData.completed_sections.length 
        : 0;
      const progressPercentage = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
      
      setProgressData({
        enrollment_id: enrollment.id,
        progress_percentage: progressPercentage,
        completed_lessons: completedSections,
        total_lessons: totalSections,
        last_accessed: enrollmentData.last_accessed || new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching enrollment progress:', error);
      setError('Failed to load progress');
      // Use fallback progress if API call fails
      setProgressData({
        enrollment_id: enrollment.id,
        progress_percentage: 0,
        completed_lessons: 0,
        total_lessons: 1,
        last_accessed: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Show empty state if no enrollment
  if (!enrollment) {
    return (
      <div className="h-full max-h-fit">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 w-full p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="relative z-10 space-y-4 text-center">
            <BookOpen className="size-12 text-gray-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-600 dark:text-gray-300">
                لا توجد دورات
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ابدأ رحلتك التعليمية بالتسجيل في دورة جديدة
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all duration-200"
            >
              <BookOpen className="size-4" />
              استكشف الدورات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage with safer defaults
  const progressPercentage = Math.max(0, Math.min(100, progressData?.progress_percentage ?? 0));
  const isCompleted = progressPercentage >= 100;
  const completedLessons = progressData?.completed_lessons ?? 0;
  const totalLessons = Math.max(1, progressData?.total_lessons ?? 1);

  return (
    <div className="h-full max-h-fit">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 dark:from-emerald-800 dark:via-emerald-900 dark:to-emerald-950 w-full p-6 rounded-xl shadow-lg">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            <Play className="size-3" />
            {isCompleted ? 'مكتمل' : 'قيد المتابعة'}
          </div>

          {/* Title + Description */}
          <div className="space-y-2">
            <h1 className="font-bold text-xl lg:text-2xl text-white leading-tight">
              {enrollment.title}
            </h1>
            <p className="text-sm text-emerald-100 leading-relaxed line-clamp-2 opacity-90">
              {enrollment.description}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-100">
              <span>التقدم</span>
              <span>{Math.round(progressPercentage)}% مكتمل</span>
            </div>
            
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            
            <div className="text-xs text-emerald-100 opacity-75">
              {completedLessons} من {totalLessons} دروس
            </div>
          </div>

          {/* Action Button */}
          <Link
            to={`/dashboard/classroom/${enrollment.id}`}
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                جاري التحميل...
              </>
            ) : isCompleted ? (
              <>
                <BookOpen className="size-4" />
                مراجعة الدورة
              </>
            ) : (
              <>
                <Play className="size-4" />
                استمر بالتعلم
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
