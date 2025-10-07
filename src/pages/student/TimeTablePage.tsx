import { useAppSelector } from "../../store/store";

export default function TimeTablePage() {
  const timetable = useAppSelector(
    (state) => state.auth.user?.class_room?.timetable
  );

  if (!timetable) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">لا يوجد جدول دروس</p>
      </div>
    );
  }

  // Arabic days of the week
  const daysOfWeek = [
    { en: "Sunday", ar: "الأحد" },
    { en: "Monday", ar: "الاثنين" },
    { en: "Tuesday", ar: "الثلاثاء" },
    { en: "Wednesday", ar: "الأربعاء" },
    { en: "Thursday", ar: "الخميس" },
    { en: "Friday", ar: "الجمعة" },
    { en: "Saturday", ar: "السبت" },
  ];

  // figure out today’s day
  const todayIndex = new Date().getDay(); // 0 = Sunday → 6 = Saturday
  const todayName = daysOfWeek[todayIndex].en;

  // Dummy events for illustration
  const dummyEvents = ["exam", "homework", "project"];

  // Group items by day
  const itemsByDay: Record<string, any[]> = {};
  daysOfWeek.forEach((day) => {
    itemsByDay[day.en] = timetable.items
      .filter((item) => item.day === day.en)
      .map((item) => ({
        ...item,
        events: dummyEvents.filter(() => Math.random() > 0.7),
      }));
  });

  const eventBadges = {
    exam: { label: "اختبار", color: "bg-red-500" },
    homework: { label: "واجب", color: "bg-yellow-400" },
    project: { label: "مشروع", color: "bg-green-500" },
  };

  return (
    <div className="p-4 md:p-6 max-w-full md:max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        جدول الدروس - {timetable.class_room_name}
      </h1>

      {/* Responsive horizontal scroll on smaller screens */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 ">
          {daysOfWeek.map((day) => {
            const isToday = day.en === todayName;
            return (
              <div
                key={day.en}
                className={`rounded-lg shadow p-3 md:p-4 min-w-[150px] ${
                  isToday
                    ? "bg-emerald-100 dark:bg-emerald-700  border-2 border-emerald-500"
                    : "bg-white dark:bg-emerald-900"
                }`}
              >
                <h2
                  className={`text-lg md:text-xl font-semibold mb-3 text-center ${
                    isToday ? "text-emerald-700 dark:text-emerald-50" : ""
                  }`}
                >
                  {day.ar}
                </h2>

                {itemsByDay[day.en].length === 0 ? (
                  <p className="text-gray-400 text-sm text-center">
                    لا توجد حصص
                  </p>
                ) : (
                  itemsByDay[day.en].map((item) => (
                    <div
                      key={item.id}
                      className={`mb-2 p-2 rounded border-r-4 border-emerald-500 bg-emerald-50`}
                    >
                      <p className="font-medium text-sm md:text-base">
                        {item.subject_name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {item.from_time} - {item.to_time}
                      </p>

                      {/* Event badges */}
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {item.events.map((ev) => (
                          <span
                            key={ev}
                            className={`text-white text-[10px] md:text-xs px-2 py-0.5 rounded ${eventBadges[ev].color}`}
                          >
                            {eventBadges[ev].label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
