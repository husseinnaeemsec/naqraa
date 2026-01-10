import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DayNavigationProps {
  days: Array<{ key: number; label: string }>;
  selectedDay: number;
  onDayChange: (dayKey: number) => void;
  todayKey: number;
}

export default function DayNavigation({ 
  days, 
  selectedDay, 
  onDayChange, 
  todayKey 
}: DayNavigationProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar' || i18n.language === 'ku';

  const currentIndex = days.findIndex(d => d.key === selectedDay);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onDayChange(days[currentIndex - 1].key);
    }
  };

  const handleNext = () => {
    if (currentIndex < days.length - 1) {
      onDayChange(days[currentIndex + 1].key);
    }
  };

  return (
    <div className="bg-white dark:bg-emerald-900/30 rounded-xl shadow-md border border-emerald-100 dark:border-emerald-800 p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Previous button */}
        <button
          onClick={isRTL ? handleNext : handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label={t('timetable_page.previous_day', 'Previous day')}
        >
          {isRTL ? (
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-emerald-200" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-emerald-200" />
          )}
        </button>

        {/* Days grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2 justify-center min-w-max">
            {days.map((day) => {
              const isSelected = day.key === selectedDay;
              const isToday = day.key === todayKey;
              
              return (
                <motion.button
                  key={day.key}
                  onClick={() => onDayChange(day.key)}
                  className={`relative px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : isToday
                      ? 'bg-emerald-100 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800'
                      : 'bg-gray-100 dark:bg-emerald-900/20 text-gray-700 dark:text-emerald-200 hover:bg-gray-200 dark:hover:bg-emerald-900/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{day.label}</span>
                  
                  {/* Today indicator */}
                  {isToday && !isSelected && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-emerald-900" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={isRTL ? handlePrevious : handleNext}
          disabled={currentIndex === days.length - 1}
          className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label={t('timetable_page.next_day', 'Next day')}
        >
          {isRTL ? (
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-emerald-200" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-emerald-200" />
          )}
        </button>
      </div>

      {/* Mobile swipe hint */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500 dark:text-emerald-400/70">
          {t('timetable_page.swipe_hint', 'Swipe or use arrows to navigate between days')}
        </p>
      </div>
    </div>
  );
}
