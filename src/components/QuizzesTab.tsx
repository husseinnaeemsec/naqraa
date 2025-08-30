import { useState, type ReactNode } from "react";
import type { EnrollmentLecture } from "../../types";
import QuizBoard from "./QuizBoard";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { emeraldColors } from "../colors";

const QuizStartingAlert = withReactContent(Swal);

interface Props {
    activeLecture: EnrollmentLecture | null
}
export default function QuizzesTab({ activeLecture }: Props) {

    const [showQuiz, setShowQuiz] = useState(false);
    const [activeQuiz,setActiveQuiz] = useState<ReactNode|null>(null);

    const startQuiz = () => {
        QuizStartingAlert.fire({
            title: "هل أنت متأكد؟",
            text: "بمجرد بدأك الاختبار لن تتمكن من اجراء الاختبار مرة أخرى",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "نعم، ابدأ الاختبار",
            cancelButtonText: "إلغاء",
            // Retro style
            background: document.documentElement.classList.contains("dark")
                ? emeraldColors['950']
                : "#ffffff",
            color: document.documentElement.classList.contains("dark")
                ? "#e2e8f0"
                : "#065f46", // dark green for retro feel
            confirmButtonColor: document.documentElement.classList.contains("dark")
                ? "#16a34a"
                : "#16a34a",
            cancelButtonColor: document.documentElement.classList.contains("dark")
                ? "#dc2626"
                : "#ef4444",
            // Additional retro borders
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    "px-4 py-2 rounded-md font-bold border-2 border-b-4 border-l-4 bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
                cancelButton:
                    "px-4 py-2 mr-2 rounded-md font-bold border-2 border-b-4 border-l-4 bg-red-100 text-red-900 hover:bg-red-200",
                title: "text-xl font-bold",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setShowQuiz(true)
            }
        });
    };

    if (!activeLecture) {
        return;
    }

    return (
        <div key={activeLecture.id} className="gap-2">
            {activeQuiz}
            {
                activeLecture.quizzes.map((quiz) => {
                    return (
                        <div
                            key={quiz.id}
                            className="w-64 p-4 rounded-2xl border shadow-sm bg-emerald-50 flex flex-col justify-between hover:shadow-md transition"
                        >
                            {/* Content */}
                            <div className="space-y-3">
                                <h1 className="text-lg font-semibold text-emerald-900">
                                    {quiz.order}. {quiz.title}
                                </h1>
                                <p className="text-sm text-gray-700 line-clamp-3">{quiz.description}</p>

                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <span>عدد الأسئلة:</span>
                                        <strong>{quiz.questions.length}</strong>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>مدة الاختبار:</span>
                                        <strong>20 دقيقة</strong>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>الدرجات:</span>
                                        <strong>50 درجة</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <button onClick={() => { setActiveQuiz(<QuizBoard quiz={quiz} onExist={()=>{ setActiveQuiz(null); }} />) }} className="mt-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
                                بدأ الاختبار
                            </button>
                        </div>

                    )
                })
            }
        </div>
    )

}