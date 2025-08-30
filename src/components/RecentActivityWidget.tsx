export default function RecentActivityWidget() {
  const activities = [
    { text: "شاهدت درس الجبر الأساسي", time: "قبل 2 ساعة" },
    { text: "أكملت اختبار الرياضيات", time: "قبل 5 ساعات" },
    { text: "نشرت سؤال في منتدى العلوم", time: "أمس" },
    { text: "بدأت درس الكيمياء العضوية", time: "أمس" },
    { text: "أكملت الواجب في اللغة الإنجليزية", time: "2 أيام مضت" },
  ];

  return (
    <div className="w-full bg-white dark:bg-emerald-950  dashboard-box p-4 rounded-xl ">
      <h1 className="text-xl font-bold mb-3">النشاط الأخير</h1>
      <ul className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
        {activities.map((act, idx) => (
          <li key={idx} className="p-3 bg-slate-50 dark:bg-emerald-900 rounded-lg shadow-sm flex justify-between items-center">
            <span>{act.text}</span>
            <span className="text-xs text-slate-500 dark:text-emerald-100/60">{act.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
