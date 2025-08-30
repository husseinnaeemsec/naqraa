export default function TasksSidebarWidget() {
  const tasks = [
    { title: "واجب الرياضيات", due: "٢ سبتمبر", status: "مكتمل جزئياً" },
    { title: "مشروع العلوم", due: "٤ سبتمبر", status: "لم يبدأ" },
    { title: "مراجعة اللغة العربية", due: "٥ سبتمبر", status: "قيد التقدم" },
  ];

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
    <div className="p-4 bg-slate-100 dark:bg-emerald-950 dark:text-white rounded-xl shadow">
      <h1 className="font-bold text-lg mb-2">المهام</h1>
      <ul className="space-y-2">
        {tasks.map((task, idx) => (
          <li key={idx} className="p-2 bg-slate-200 dark:bg-emerald-900 rounded-md flex justify-between items-center">
            <span>{task.title}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${statusColor(task.status)}`}>{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
