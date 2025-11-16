import { useAppSelector } from "../../store/store";
import { motion } from "framer-motion";
import { Calendar, Clock, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";

interface EventProps {
  label: string;
  color: string;
  bgColor: string;
}

interface EventsProps {
  exam: EventProps;
  homework: EventProps;
  project: EventProps;
}

export default function TimeTablePage() {
  const { t } = useTranslation();
  const timetable = useAppSelector(
    (state) => state.auth.user?.class_room?.timetable
  );

  if (!timetable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
        >
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-emerald-50">{t('timetable_page.no_timetable')}</h2>
            <p className="text-gray-600 dark:text-emerald-200/70">{t('timetable_page.timetable_will_show')}</p>
          </div>
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            {t('timetable_page.reload')}
          </button>
        </motion.div>
      </div>
    );
  }

  // Days of the week with translations
  const daysOfWeek = [
    { en: "Saturday", ar: t('timetable_page.saturday') },
    { en: "Sunday", ar: t('timetable_page.sunday') },
    { en: "Monday", ar: t('timetable_page.monday') },
    { en: "Tuesday", ar: t('timetable_page.tuesday') },
    { en: "Wednesday", ar: t('timetable_page.wednesday') },
    { en: "Thursday", ar: t('timetable_page.thursday') },
    { en: "Friday", ar: t('timetable_page.friday') },
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



  const eventBadges : EventsProps = {
    exam: { label: t('timetable_page.exam'), color: "bg-red-500" },
    homework: { label: t('timetable_page.homework'), color: "bg-yellow-400" },
    project: { label: t('timetable_page.project'), color: "bg-green-500" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-50">
            {t('timetable_page.title')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-emerald-200/70 text-lg">
          {timetable.class_room_name}
        </p>
      </motion.div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {daysOfWeek.map((day, index) => {
          const isToday = day.en === todayName;
          return (
            <motion.div
              key={day.en}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${day.en === 'Friday' ? 'lg:col-span-2 xl:col-span-1' : ''}`}
            >
              <Card className={`h-full transition-all duration-300 ${
                isToday
                  ? "ring-2 ring-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20"
                  : "hover:shadow-lg"
              }`}>
                {/* Day Header */}
                <div className={`p-4 border-b border-emerald-100 dark:border-emerald-800 ${
                  isToday ? 'bg-emerald-500 text-white' : 'bg-gray-50 dark:bg-emerald-950'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    {isToday && <Clock className="w-4 h-4" />}
                    <h2 className={`text-lg font-bold text-center ${
                      isToday ? 'text-white' : 'text-gray-900 dark:text-emerald-50'
                    }`}>
                      {day.ar}
                    </h2>
                  </div>
                  {isToday && (
                    <p className="text-xs text-center text-emerald-100 mt-1">{t('timetable_page.today')}</p>
                  )}
                </div>

                {/* Classes */}
                <div className="p-4 space-y-3">
                  {itemsByDay[day.en].length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-8 h-8 text-gray-300 dark:text-emerald-700 mx-auto mb-2" />
                      <p className="text-gray-400 dark:text-emerald-400 text-sm">
                        {t('timetable_page.no_classes')}
                      </p>
                    </div>
                  ) : (
                    itemsByDay[day.en].map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                        className="group p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/30 transition-all duration-200 border border-emerald-100 dark:border-emerald-800/50 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-emerald-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                            {item.subject_name}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-emerald-200/70 mb-2">
                          <Clock className="w-3 h-3" />
                          <span>{item.from_time} - {item.to_time}</span>
                        </div>

                        {/* Event badges */}
                        {item.events.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {item.events.map((ev: string) => (
                              <span
                                key={ev}
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  eventBadges[ev].bgColor
                                } ${eventBadges[ev].color}`}
                              >
                                {eventBadges[ev].label}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
