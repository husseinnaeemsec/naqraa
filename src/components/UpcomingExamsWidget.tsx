export default function UpcomingExams() {
  // بيانات الامتحانات القادمة
  const exams = [
    { subject: "الرياضيات", date: "١ سبتمبر", note: "الفصل الأول: الجبر و المعادلات" },
    { subject: "اللغة العربية", date: "٣ سبتمبر", note: "النحو والصرف" },
    { subject: "اللغة الإنجليزية", date: "٥ سبتمبر", note: "القواعد والمفردات" },
    { subject: "العلوم", date: "٧ سبتمبر", note: "الكيمياء: الجدول الدوري" },
    { subject: "التاريخ", date: "١٠ سبتمبر", note: "الثورة الفرنسية" },
  ];

  return (
    <div className="w-full bg-white dark:bg-emerald-950  dashboard-box  p-4 rounded-xl ">
      <h1 className="text-xl font-bold mb-3 dark:text-emerald-50">الامتحانات القادمة</h1>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200 pb-2">
        {exams.map((exam, idx) => (
          <div
            key={idx}
            className="min-w-[220px] flex-shrink-0 bg-slate-50 dark:bg-emerald-900 dashboard-box rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="font-bold text-lg text-emerald-700 dark:text-emerald-50">{exam.subject}</h2>
            <p className="text-slate-600 dark:text-emerald-100 text-sm">{exam.note}</p>
            <p className="mt-2 font-medium text-slate-800 dark:text-emerald-100">📅 {exam.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
