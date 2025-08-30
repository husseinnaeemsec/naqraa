export default function RecommendedCoursesWidget() {
  const courses = [
    { title: "الجبر المتقدم", progress: 0 },
    { title: "الكيمياء العضوية", progress: 20 },
    { title: "اللغة الإنجليزية المتوسطة", progress: 0 },
    { title: "التاريخ الحديث", progress: 0 },
  ];

  return (
    <div className="w-full bg-white dark:bg-emerald-950 dashboard-box  p-4 rounded-xl ">
      <h1 className="text-xl font-bold mb-3">دورات موصى بها</h1>
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200 pb-2">
        {courses.map((course, idx) => (
          <div key={idx} className="min-w-[220px] space-y-2 flex-shrink-0 bg-slate-50  dark:bg-emerald-900 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="size-32 bg-white dark:bg-emerald-950 rounded-md w-full"></div>
            <h2 className="font-bold text-slate-800 dark:text-emerald-50">{course.title}</h2>
            <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
            <button className="mt-3 w-full bg-emerald-600 text-white py-1 rounded-md hover:bg-emerald-700 transition-colors">
              ابدأ الدورة
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
