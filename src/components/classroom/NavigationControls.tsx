import { t } from "i18next";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import {
  setActiveLecture,
  setCompleted,
  setCompletedLectures,
  setCompletedSections,
} from "../../store/enrollmentSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { ErrorAlert, SuccessAlert } from "../alerts";
import { HeroArrowLeftIcon, HeroArrowRightIcon, HeroCheckCircleIcon } from "../Icons";

/**
 * Navigation controls for moving between lectures
 * 
 * Features:
 * - Previous/Next lecture navigation
 * - Complete lecture button
 * - Auto-completion on next when not completed
 * - Quiz validation before proceeding
 * - Progress tracking
 * - Responsive button layout
 */
export default function NavigationControls() {
  const {
    currentLecture,
    lectures,
    completed_quizzes,
    enrollment,
    completed,
    completed_lectures,
  } = useAppSelector((state) => state.enrollment);

  const dispatch = useAppDispatch();

  // Calculate lecture positions
  const currentIndex = lectures.findIndex((l) => l.id === currentLecture?.id);
  const nextLecture = currentIndex >= 0 ? lectures[currentIndex + 1] || null : null;
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] || null : null;
  const isLectureCompleted = completed_lectures.includes(currentLecture?.id || 0);
  const isLastLecture = !nextLecture;

  /**
   * Handle next lecture navigation
   * - Validates quiz completion
   * - Completes current lecture if not completed
   * - Moves to next lecture
   */
  const handleNext = async () => {
    if (!currentLecture || !enrollment) return;

    // Check if all quizzes are completed
    const uncompletedQuizzes = currentLecture.quizzes?.filter(
      (q) => !completed_quizzes.includes(q.id)
    );

    if (uncompletedQuizzes?.length) {
      ErrorAlert({
        title: "لديك اختبارات غير مكتملة",
        text: `الرجاء إكمال جميع اختبارات المحاضرة "${currentLecture.title}" أولاً.`,
      });
      return;
    }

    // Complete lecture if not already completed
    if (!isLectureCompleted) {
      try {
        const res = await api.post(
          endpoints.user.enrollments.completeLecture(enrollment.id, currentLecture.id)
        );

        const data = res.data;
        dispatch(setCompletedLectures(data.completed_lectures));
        dispatch(setCompletedSections(data.completed_sections));

        // Check if course is now completed
        if (data.completed && !completed) {
          SuccessAlert({
            title: "تهانينا! 🎉",
            text: `لقد أكملت جميع محاضرات الدورة: ${enrollment.course.title}`,
          });
          dispatch(setCompleted(true));
        }

        // Move to next lecture if available and course not completed
        if (nextLecture && !data.completed) {
          dispatch(setActiveLecture(nextLecture));
        }
      } catch (e: any) {
        if (e.status === 404 || e.status === 400) {
          ErrorAlert({ 
            title: t("error"), 
            text: e.response?.data?.error || "حدث خطأ أثناء إكمال المحاضرة" 
          });
        } else {
          ErrorAlert({ 
            title: t("error"), 
            text: t("server_error_text") 
          });
        }
      }
    } else if (nextLecture) {
      // Lecture already completed, just navigate
      dispatch(setActiveLecture(nextLecture));
    }
  };

  /**
   * Handle previous lecture navigation
   */
  const handlePrev = () => {
    if (prevLecture) {
      dispatch(setActiveLecture(prevLecture));
    }
  };

  /**
   * Complete current lecture without navigating
   */
  const handleComplete = async () => {
    if (!currentLecture || !enrollment || isLectureCompleted) return;

    try {
      const res = await api.post(
        endpoints.user.enrollments.completeLecture(enrollment.id, currentLecture.id)
      );

      const data = res.data;
      dispatch(setCompletedLectures(data.completed_lectures));
      dispatch(setCompletedSections(data.completed_sections));

      SuccessAlert({
        title: "تم الإكمال",
        text: "تم وضع علامة على المحاضرة كمكتملة",
      });

      // Check if course is completed
      if (data.completed && !completed) {
        SuccessAlert({
          title: "تهانينا! 🎉",
          text: `لقد أكملت جميع محاضرات الدورة: ${enrollment.course.title}`,
        });
        dispatch(setCompleted(true));
      }
    } catch (e: any) {
      ErrorAlert({
        title: t("error"),
        text: e.response?.data?.error || "حدث خطأ أثناء إكمال المحاضرة",
      });
    }
  };

  // Determine button states and labels
  const nextButtonDisabled = !currentLecture || (isLectureCompleted && isLastLecture && completed);
  
  const nextButtonText = (() => {
    if (!currentLecture) return "لا توجد محاضرة";
    if (completed && isLastLecture) return "اكتملت الدورة";
    if (isLectureCompleted && isLastLecture) return "آخر محاضرة";
    if (isLectureCompleted && nextLecture) return "التالي";
    return "إكمال والانتقال";
  })();

  if (!currentLecture) return null;

  return (
    <div className="bg-gradient-to-t from-white via-white to-white/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800/80 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={!prevLecture}
            className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg ${
              prevLecture
                ? "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 hover:shadow-xl hover:scale-105 border-2 border-gray-300 dark:border-gray-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 border-2 border-gray-200 dark:border-gray-700"
            }`}
          >
            <HeroArrowRightIcon className="size-6 sm:size-7" />
            <span className="hidden sm:inline">السابق</span>
          </button>

          {/* Complete Button (only shown if lecture not completed) */}
          {!isLectureCompleted && (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 border-2 border-blue-700"
            >
              <HeroCheckCircleIcon className="size-6 sm:size-7" />
              <span className="hidden sm:inline">وضع علامة كمكتمل</span>
              <span className="sm:hidden">مكتمل</span>
            </button>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={nextButtonDisabled}
            className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg ${
              nextButtonDisabled
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 border-2 border-gray-300 dark:border-gray-700"
                : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white hover:shadow-xl hover:scale-105 border-2 border-emerald-700"
            }`}
          >
            <span>{nextButtonText}</span>
            <HeroArrowLeftIcon className="size-6 sm:size-7" />
          </button>
        </div>

        {/* Progress Info */}
        <div className="mt-4 text-center">
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            <span className="font-bold">المحاضرة {currentIndex + 1}</span>
            <span className="mx-2">من</span>
            <span className="font-bold">{lectures.length}</span>
            {isLectureCompleted && (
              <span className="mr-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm sm:text-base font-semibold">
                <span className="text-lg">✓</span>
                مكتملة
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
