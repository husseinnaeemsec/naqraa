export default function UsefulResourcesWidget() {
  const resources = [
    { title: "ورقة مفاهيم الجبر", type: "PDF" },
    { title: "فيديو درس الكيمياء", type: "Video" },
    { title: "ملخص اللغة العربية", type: "Document" },
    { title: "تمارين الرياضيات", type: "PDF" },
    { title: "موقع تعلم اللغة الإنجليزية", type: "Link" },
  ];

  const typeColor = (type:string) => {
    switch (type) {
      case "PDF": return "bg-rose-400 text-white";
      case "Video": return "bg-blue-400 text-white";
      case "Document": return "bg-slate-500 text-white";
      case "Link": return "bg-emerald-500 text-white";
      default: return "bg-slate-300 text-slate-800";
    }
  };

  return (
    <div className="w-full bg-white dark:bg-emerald-950 dashboard-box p-4 rounded-xl">
      <h1 className="text-xl font-bold mb-3 dar"> مصادر مقترحة</h1>
      <p> مصادر مقترحة لك بناء على اخر اختبار قمت به </p>
      <div className=" grid md:grid-cols-3 gap-4  pb-2">
        {resources.map((res, idx) => (
          <div key={idx} className="min-w-[200px] flex-shrink-0 p-4 rounded-xl dark:bg-emerald-900 bg-slate-50 shadow-sm hover:shadow-md transition-all">
            <h2 className="font-bold text-slate-800 dark:text-emerald-50">{res.title}</h2>
            <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${typeColor(res.type)}`}>
              {res.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
