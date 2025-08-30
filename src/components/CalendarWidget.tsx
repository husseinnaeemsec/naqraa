export default function CalendarWidget() {
  // For simplicity, showing current month with dummy events
  const events = [
    { date: "2 سبتمبر", title: "درس الرياضيات" },
    { date: "4 سبتمبر", title: "اختبار العلوم" },
    { date: "5 سبتمبر", title: "واجب اللغة العربية" },
  ];

  return (
    <div className="p-4 bg-slate-100 dark:bg-emerald-950 dark:text-white rounded-xl shadow h-[30dvh] overflow-y-auto">
      <h1 className="font-bold text-lg mb-2">التقويم</h1>
      <ul className="space-y-2">
        {events.map((event, idx) => (
          <li key={idx} className="p-2 bg-slate-200 dark:bg-emerald-900 rounded-md">
            <strong>{event.date}:</strong> {event.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
