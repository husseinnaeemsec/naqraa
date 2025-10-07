import { useEffect } from "react";
import type { EnrollmentQuiz } from "../../types"
import { useAppSelector } from "../store/store";
import { CheckCircle } from "lucide-react";

interface Props {
    quiz: EnrollmentQuiz;
    onQuizStart?: (quiz: EnrollmentQuiz) => void;
    onQuizClose?: (quiz: EnrollmentQuiz) => void;
}
export default function QuizCard({ quiz, onQuizStart, onQuizClose }: Props) {
    const { completed_quizzes } = useAppSelector(state => state.enrollment);
    const isAnswered = completed_quizzes.findIndex(qid => qid === quiz.id) != -1;

    useEffect(() => {
        console.log(completed_quizzes, quiz.id)
    }, [])

    return (
        <div className="flex flex-col gap-2 border p-2 rounded border-slate-300">
            <p className="text-lg font-semibold"> {quiz.title} </p>
            <div className="p-2 space-y-1 text-sm">
                <p> عدد الاسئلة : {quiz.questions.length} </p>
                {isAnswered &&
                 (
                 <p className="text-center bg-emerald-50 p-2 justify-center mt-4 px-3 text-emerald-500 flex items-center gap-2">
                    <CheckCircle className="size-4" />
                    مكتمل
                </p>
                )
                }

            </div>
            {!isAnswered && (<button onClick={() => { onQuizStart && onQuizStart(quiz) }} className="p-2 rounded w-full border hover:bg-emerald-600 hover:text-white transition-colors border-emerald-600 text-emerald-600">بدأ الاختبار</button>)}
        </div>
    )
}
