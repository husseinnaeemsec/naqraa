import { useEffect, useState } from "react";
import type { HomeWork } from "../../types";
import api from "../api/client";
import { endpoints } from "../api/routes";

export default function TasksWidget() {
  const [tasks, setTasks] = useState<HomeWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get<HomeWork[]>(endpoints.organization.upcoming_homework); 
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-slate-500">جارٍ تحميل المهام...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white h-full dark:bg-emerald-950 p-4 dashboard-box rounded-xl">
      <h1 className="text-xl font-bold mb-3 dark:text-emerald-50">
        المهام والواجبات
      </h1>

      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200 pb-2">
        {tasks.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-300">
            لا توجد مهام حالياً 
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="min-w-[220px] flex-shrink-0 bg-slate-50 dark:bg-emerald-900 dashboard-box rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <h2 className="font-bold text-lg dark:text-emerald-50 text-slate-800">
                {task.title || "مهمة بدون عنوان"}
              </h2>
              <p className="mt-1 text-slate-600 dark:text-emerald-100 text-sm">
                 {task.subject_name} - {task.class_room_name}
              </p>
              <p className="mt-2 text-slate-600 dark:text-emerald-100 text-sm">
                 تاريخ الاستحقاق:{" "}
                {new Date(task.date).toLocaleDateString("ar-EG")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
