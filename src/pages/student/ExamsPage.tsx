import { useEffect, useState } from "react";
import type { Exam } from "../../../types";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { formatTime, isExpired, timeBefore } from "../../utils/functions";

// Exams Page Component
const ExamsPage = () => {

    const [exams, setExams] = useState<Exam[]>([])

    useEffect(() => {
        api.get(endpoints.organization.exams)
            .then((res) => {
                setExams(res.data.results)
            })
    }, [])

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-emerald-800">الاختبارات</h1>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    جدول الاختبارات
                </button>
            </div>
            <div className="bg-white border border-emerald-300 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold text-emerald-800 mb-6">جدول الاختبارات القادم</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-center">
                        <thead>
                            <tr className="border-b border-emerald-200">
                                <th className="py-3 px-4 font-medium">الاختبار</th>
                                <th className="py-3 px-4 font-medium">الصف</th>
                                <th className="py-3 px-4 font-medium">المادة</th>
                                <th className="py-3 px-4 font-medium">التاريخ</th>
                                <th className="py-3 px-4 font-medium">الوقت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                exams.map((exam) => {
                                    return (
                                        <tr key={exam.id} className="border-b  border-emerald-100 hover:bg-emerald-50 transition-colors">
                                            <td className="py-3 px-4"> {exam.title} </td>
                                            <td className="py-3 px-4"> {exam.class_room_name} </td>
                                            <td className="py-3 px-4"> {exam.subject_name} </td>
                                            <td className="py-3 px-4">
                                                {timeBefore(exam.date)}
                                                { isExpired(exam.date) && (<span className="mr-2 text-xs text-rose-500"> منتهي </span>) }

                                            </td>
                                            <td className="py-3 px-4">
                                                {formatTime(exam.time)}

                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamsPage;