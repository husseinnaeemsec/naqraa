import { motion } from "framer-motion";
import { Calendar, RefreshCw, Clock, BookOpen, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import type { TimeTable } from "../../types/academics";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import PartialLoadError from "../../components/errors/PartialLoadError";
import { detectErrorType, type ErrorType } from "../../utils/errorHandler";
import TimelineView from "../../components/TimelineView";

export default function TimeTablePage() {
  const { t } = useTranslation();
  
  // State management
  const [timeTable, setTimeTable] = useState<TimeTable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);

  // Calculate today's day key (1=Sunday, 2=Monday, ..., 7=Saturday)
  const todayIndex = new Date().getDay();
  const todayKey = todayIndex + 1;
  const [selectedDay, setSelectedDay] = useState<number>(todayKey);

  // Handle day selection
  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };

  // Fetch organization timetable on mount
  const fetchTimeTable = async () => {
    setIsLoading(true);
    setError(null);
    try{
      const response = await api.get(endpoints.student.timetable.list);
      setTimeTable(response.data);
    } catch (err) {
      console.error('Failed to fetch timetable:', err);
      setError(detectErrorType(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeTable();
  }, []);

  // Calculate statistics
  const totalClasses = timeTable?.entries.length || 0;
  const uniqueDays = new Set(timeTable?.entries.map(e => e.day_number) || []).size;
  
  // Calculate total hours per week
  const totalMinutes = timeTable?.entries.reduce((acc, entry) => {
    const [startHour, startMin] = entry.from_time.split(':').map(Number);
    const [endHour, endMin] = entry.to_time.split(':').map(Number);
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return acc + duration;
  }, 0) || 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                {t('timetable_page.title')}
              </h1>
            </div>
          </motion.div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <PartialLoadError
              errorType={error}
              onRetry={fetchTimeTable}
              maxRetries={3}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('timetable_page.loading', 'Loading Timetable...')}
            </h2>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!timeTable) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] space-y-5"
        >
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="text-center space-y-2 max-w-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('timetable_page.no_timetable')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('timetable_page.no_org_timetable')}</p>
          </div>
          <button 
            onClick={fetchTimeTable}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow"
          >
            <RefreshCw className="w-4 h-4" />
            {t('timetable_page.reload')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* Title Row */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                {t('timetable_page.title')}
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-[52px]">
              {t('timetable_page.org_timetable')}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mb-0.5">
                      {t('timetable_page.total_classes', 'Total Classes')}
                    </p>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                      {totalClasses}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mb-0.5">
                      {t('timetable_page.weekly_hours', 'Weekly Hours')}
                    </p>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                      {totalHours}h {remainingMinutes > 0 ? `${remainingMinutes}m` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mb-0.5">
                      {t('timetable_page.active_days', 'Active Days')}
                    </p>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                      {uniqueDays}/7
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timetable Info Bar */}
          {(timeTable.description || timeTable.enable_reminders) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-xl md:rounded-2xl p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                {timeTable.description && (
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {timeTable.description}
                  </span>
                )}
                {timeTable.enable_reminders && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    {t('timetable_page.reminders_enabled')}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Timeline View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TimelineView
            entries={timeTable.entries}
            selectedDay={selectedDay}
            onDaySelect={handleDaySelect}
          />
        </motion.div>
      </div>
    </div>
  );
}
