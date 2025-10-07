import { t } from "i18next";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import {
  setActiveLecture,
  setCompleted,
  setCompletedLectures,
  setCompletedSections,
} from "../../store/enrollmentSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { ErrorAlert, SuccessAlert } from "../alerts";

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
        dispatch(setCompletedLectures(data.completed_lectures));
        dispatch(setCompletedSections(data.completed_sections));

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
    <div className="bg-white dark:bg-emerald-950 lg:sticky lg:bottom-0 lg:border-t p-2 z-20">
      <div className="flex items-center justify-between">
        <button
          onClick={handleNext}
          disabled={nextButtonDisabled}
          className={`px-4 py-2 rounded-md text-white transition-all duration-200 ${
            nextButtonDisabled
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {nextButtonText}
        </button>

        <button
          onClick={handlePrev}
          disabled={!prevLecture}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            prevLecture
              ? "bg-slate-200 dark:bg-slate-700 hover:bg-slate-600"
              : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          السابق
        </button>
      </div>
    </div>
  );
}
