import { useEffect, useState } from "react";
import type { Exam } from "../../types";
import { timeBefore } from "../utils/functions";
import api from "../api/client";
import { endpoints } from "../api/routes";

export default function UpcomingExams() {
  // بيانات الامتحانات القادمة
  const [exams,setExams] = useState<Exam[]>([])
  
  useEffect(()=>{
    api.get(endpoints.organization.upcoming_exams).then(res => setExams(res.data))
  },[])

  return (
    <div className="w-full bg-white dark:bg-emerald-950  dashboard-box  p-4 rounded-xl ">
      <h1 className="text-xl font-bold  dark:text-emerald-50">الامتحانات القادمة</h1>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200 pb-2">
        {exams.map((exam, idx) => (
          <div
            key={idx}
            className="min-w-[220px] flex-shrink-0 bg-slate-50 dark:bg-emerald-900 dashboard-box rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="font-bold text-lg text-emerald-700 dark:text-emerald-50">{exam.subject_name}</h2>
            <p className="text-slate-600 dark:text-emerald-100 text-sm">{exam.description}</p>
            <p className="mt-2 font-medium text-slate-800 dark:text-emerald-100"> {timeBefore(exam.date)}</p>
          </div>
        ))}
        {
          !exams.length && (
            <div className="flex items-center justify-center p-2">
              ليس لديك اي امتحانات قريبة
            </div>
          )
        }
      </div>
    </div>
  );
}
