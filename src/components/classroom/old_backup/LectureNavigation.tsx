import { t } from "i18next";
import api from "../../../api/client";
import { endpoints } from "../../../api/routes";
import {
  setActiveLecture,
  setCompleted,
  addCompletedLecture,
  addCompletedSection,
} from "../../../store/enrollmentSlice.tsx";
import { useAppDispatch, useAppSelector } from "../../../store/index.tsx";
import { ErrorAlert, SuccessAlert } from "../../alerts";

export default function LectureNavigation() {
  const {
    currentLecture,
    lectures,
    completed_quizzes,
    enrollment,
    completed,
    completed_lectures,
  } = useAppSelector((state) => state.enrollment);

  const dispatch = useAppDispatch();

  // --- Derivations ---
  const currentIndex = lectures.findIndex((l) => l.id === currentLecture?.id);
  const nextLecture = currentIndex >= 0 ? lectures[currentIndex + 1] || null : null;
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] || null : null;
  const isLectureCompleted = completed_lectures.includes(currentLecture?.id || 0);
  const noNextLecture = !nextLecture;

  // --- Handlers ---
  const handleNext = async () => {
    if (!currentLecture) return;

    const uncompleted_quizzes = currentLecture.quizzes?.filter(
      (q) => !completed_quizzes.includes(q.id)
    );

    if (uncompleted_quizzes?.length) {
      ErrorAlert({
        title: "لديك اختبارات غير مكتملة",
        text: `الرجاء إكمال جميع اختبارات المحاضرة (${currentLecture.title}) أولاً.`,
      });
      return;
    }

    // If lecture is not completed, complete it first
    if (!isLectureCompleted) {
      try {
        const res = await api.post(
          endpoints.user.enrollments.completeLecture(enrollment?.id || 0, currentLecture.id)
        );

        const data = res.data;
        // Update completed lectures and sections
        data.completed_lectures.forEach((lectureId: number) => {
          dispatch(addCompletedLecture(lectureId));
        });
        data.completed_sections.forEach((sectionId: number) => {
          dispatch(addCompletedSection(sectionId));
        });

        if (data.completed && !completed) {
          SuccessAlert({
            title: "أحسنت 👏",
            text: `لقد أكملت جميع فصول الدورة التدريبية: ${enrollment?.course.title}`,
          });
          dispatch(setCompleted(true));
        }

        // Move to next lecture if available
        if (nextLecture && !data.completed) {
          dispatch(setActiveLecture(nextLecture));
        }
      } catch (e: any) {
        if (e.status === 404 || e.status === 400) {
          ErrorAlert({ title: t("error"), text: e.response?.data?.error || "" });
        } else {
          ErrorAlert({ title: t("error"), text: t("server_error_text") });
        }
      }
    } else if (nextLecture) {
      // Lecture already completed — just move to next
      dispatch(setActiveLecture(nextLecture));
    }
  };

  const handlePrev = () => {
    if (prevLecture) dispatch(setActiveLecture(prevLecture));
  };

  // --- Button States ---
  const nextButtonDisabled =
    !currentLecture || (isLectureCompleted && noNextLecture && completed);

  const nextButtonText = (() => {
    if (!currentLecture) return "لا توجد محاضرة نشطة";
    if (isLectureCompleted && noNextLecture && completed)
      return "اكتملت الدورة";
    if (isLectureCompleted && noNextLecture)
      return "اكتملت المحاضرة";
    if (nextLecture){
      if(completed_lectures.find(id => id === nextLecture.id )){
        return 'التالي'
      }else{
        return 'اكمال / التالي'
      }
    };
    return "إكمال المحاضرة";
  })();

  // --- Render ---
  return (
    <div className="p-4 pb-safe">
      <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
        <button
          onClick={handlePrev}
          disabled={!prevLecture}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 max-w-[180px] ${
            prevLecture
              ? "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md hover:shadow-lg"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          السابق
        </button>

        <button
          onClick={handleNext}
          disabled={nextButtonDisabled}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 max-w-[180px] ${
            nextButtonDisabled
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {nextButtonText}
        </button>
      </div>
    </div>
  );
}
