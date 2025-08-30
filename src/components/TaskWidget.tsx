export default function TasksWidget() {
  const tasks = [
    { title: "واجب الرياضيات", due: "٢ سبتمبر", status: "مكتمل جزئياً" },
    { title: "مشروع العلوم", due: "٤ سبتمبر", status: "لم يبدأ" },
    { title: "مراجعة اللغة العربية", due: "٥ سبتمبر", status: "قيد التقدم" },
    { title: "واجب اللغة الإنجليزية", due: "٧ سبتمبر", status: "لم يبدأ" },
    { title: "مهمة التاريخ", due: "٩ سبتمبر", status: "مكتمل" },
  ];

  // Helper to pick a color based on status
  const statusColor = (status:string) => {
    switch (status) {
      case "مكتمل": return "bg-emerald-500 text-white";
      case "مكتمل جزئياً": return "bg-yellow-400 text-slate-900";
      case "قيد التقدم": return "bg-blue-400 text-white";
      case "لم يبدأ": return "bg-slate-300 text-slate-700";
      default: return "bg-slate-200 text-slate-700";
    }
  };

  return (
    <div className="w-full bg-white h-full dark:bg-emerald-950  p-4 dashboard-box rounded-xl ">
      <h1 className="text-xl font-bold mb-3 dark:text-emerald-50">المهام والواجبات</h1>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200 pb-2">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className="min-w-[220px] flex-shrink-0 bg-slate-50 dark:bg-emerald-900 dashboard-box rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="font-bold text-lg dark:text-emerald-50 text-slate-800">{task.title}</h2>
            <p className="mt-2 text-slate-600 dark:text-emerald-100 text-sm">📅 تاريخ الاستحقاق: {task.due}</p>
            <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${statusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
