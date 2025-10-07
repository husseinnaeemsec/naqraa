import { useState } from "react";
import { useAppSelector } from "../store/store";
import QuizCard from "./QuizCard";
import type { EnrollmentQuiz } from "../../types";
import QuizBoard from "./QuizBoard";
import { SuccessAlert } from "./alerts";


export default function QuizzesTab() {

    const {currentLecture} = useAppSelector(state => state.enrollment);
    const [startQuiz,setStartQuiz] = useState<EnrollmentQuiz|null>(null)


    if (!currentLecture) {
        return;
    }


    const onComplete = (quiz:EnrollmentQuiz) =>{
        SuccessAlert({
            title:"احسنت",
            text:`لقد اكملت اختبار ${quiz.title} بنجاح , سوف يصلك اشعار بنتيجة الاختبار بعد التصحيح من قبل المعلم `
        });
        setStartQuiz(null);
    }
    return (
        <div key={currentLecture.id} className="gap-2">
            <QuizBoard onComplete={onComplete} onClose={(_quiz)=>{setStartQuiz(null)}} quiz={startQuiz} />
            <h1 className="text-xl font-bold">الاختبارات</h1>
            <div className="mt-5 grid gap-3 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
                {
                currentLecture.quizzes.map((q)=>{
                    return <QuizCard  onQuizStart={(quiz)=>{setStartQuiz(quiz)}}  quiz={q} key={q.id} />
                })
                }
                {
                    !currentLecture.quizzes.length && (
                        <div className="h-40 w-full  flex items-center  justify-center lg:col-span-4 md:col-span-2 ">
                            لا توجد اختبارات لهذه المحاضرة 
                        </div>
                    )
                }
            </div>
        </div>
    )

}