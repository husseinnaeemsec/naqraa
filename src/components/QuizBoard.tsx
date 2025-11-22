import { useState } from "react";
import type { EnrollmentQuiz } from "../../types";
import QuestionSlider from "./QuizQuesstion";
import api from "../api/client";
import { endpoints } from "../api/routes";
import { ErrorAlert } from "./alerts";
import { useAppDispatch } from "../store/store";
import { setCompletedLectures, setCompletedQuizzes, setCompletedSections } from "../store/enrollmentSlice";
import type { QuizAnswerValue } from "./QuestionRenderer";

// Proper type for quiz answers
type QuizAnswers = Record<number, QuizAnswerValue>;

interface Props {
    quiz: EnrollmentQuiz | null;
    onClose?: (quiz: EnrollmentQuiz) => void;
    onComplete?: (quiz: EnrollmentQuiz) => void;
}

export default function QuizBoard({ quiz, onClose, onComplete }: Props) {
    const [start, setStart] = useState(false);
    const dispatch = useAppDispatch();
    
    if (!quiz) return null;

    const submitAnswers = (answers: QuizAnswers) => {
        if (!answers) return;
        
        api.post(endpoints.user.enrollments.completeQuiz(quiz.id), {
            answers: answers
        })
        .then((res) => {
            const { completed_quizzes, completed_sections, completed_lectures } = res.data;
            dispatch(setCompletedLectures(completed_lectures));
            dispatch(setCompletedQuizzes(completed_quizzes));
            dispatch(setCompletedSections(completed_sections));
            onComplete && onComplete(quiz);
        })
        .catch((e) => {
            if (e.response) {
                ErrorAlert({ 
                    title: "خطأ", 
                    text: e.response.data.error || "حدث خطأ أثناء إرسال الإجابات" 
                });
            }
        });
    };

    return (
        <div className="fixed flex items-center flex-col gap-2 justify-center inset-0  w-full h-full z-50 bg-white ">
            <button onClick={() => { onClose && onClose(quiz) }} className="absolute top-5 right-5 border hover:bg-rose-500 hover:text-rose-50 hover:border-rose-500 border-slate-300 p-1 px-5 rounded"> خروج </button>
            {!start && (
                <div className="max-w-xl text-center w-full  p-4 space-y-3">
                    <h1 className="text-2xl font-semibold"> {quiz.title} </h1>
                    <p className="text-slate-500"> {quiz.description} </p>
                    <button onClick={() => { setStart(true) }} className="p-2 rounded bg-emerald-600 text-white"> بدأ الاختبار </button>
                </div>
            )}
            {start && (
                <div className="max-w-xl w-full p-4 rounded-md bg-emerald-50 border">
                    <QuestionSlider onFinish={submitAnswers} quiz={quiz} />
                </div>
            )}
        </div>
    )
}