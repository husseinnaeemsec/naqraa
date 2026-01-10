import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, CheckCircle2, XCircle, AlertCircle, FileText, Calendar as CalendarIcon, X, CheckSquare, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { TimeTableEntry } from "../types/academics";

interface TimelineViewProps {
  entries: TimeTableEntry[];
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

interface Task {
  id: number;
  title: string;
  subject: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface Exam {
  id: number;
  subject: string;
  title: string;
  time: string;
  duration: string;
  type: 'midterm' | 'final' | 'quiz';
}

export default function TimelineView({ entries, selectedDay, onDaySelect }: TimelineViewProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar' || i18n.language === 'ku';
  const [selectedEntry, setSelectedEntry] = useState<TimeTableEntry | null>(null);

  const daysOfWeek = [
    { key: 1, label: t('timetable_page.sunday'), short: t('timetable_page.sunday_short') },
    { key: 2, label: t('timetable_page.monday'), short: t('timetable_page.monday_short') },
    { key: 3, label: t('timetable_page.tuesday'), short: t('timetable_page.tuesday_short') },
    { key: 4, label: t('timetable_page.wednesday'), short: t('timetable_page.wednesday_short') },
    { key: 5, label: t('timetable_page.thursday'), short: t('timetable_page.thursday_short') },
    { key: 6, label: t('timetable_page.friday'), short: t('timetable_page.friday_short') },
    { key: 7, label: t('timetable_page.saturday'), short: t('timetable_page.saturday_short') },
  ];

  const todayIndex = new Date().getDay();
  const todayKey = todayIndex + 1;

  // Filter entries for selected day
  const dayEntries = entries.filter(e => e.day_number === selectedDay);

  // Dummy data for the selected day
  const dummyTasks: Task[] = [
    {
      id: 1,
      title: 'Complete Chapter 5 Assignment',
      subject: 'Mathematics',
      dueTime: '23:59',
      priority: 'high',
      completed: false,
    },
    {
      id: 2,
      title: 'Read Pages 45-67',
      subject: 'Physics',
      dueTime: '18:00',
      priority: 'medium',
      completed: true,
    },
    {
      id: 3,
      title: 'Lab Report Submission',
      subject: 'Chemistry',
      dueTime: '20:00',
      priority: 'high',
      completed: false,
    },
  ];

  const dummyExams: Exam[] = [
    {
      id: 1,
      subject: 'Mathematics',
      title: 'Midterm Exam',
      time: '10:00',
      duration: '2 hours',
      type: 'midterm',
    },
    {
      id: 2,
      subject: 'Computer Science',
      title: 'Programming Quiz',
      time: '14:00',
      duration: '1 hour',
      type: 'quiz',
    },
  ];

  // Format time
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? t('common.pm') : t('common.am');
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  };

  const examTypeColors = {
    midterm: 'bg-purple-500',
    final: 'bg-red-500',
    quiz: 'bg-blue-500',
  };

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-stretch gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {daysOfWeek.map((day) => {
            const isSelected = day.key === selectedDay;
            const isToday = day.key === todayKey;
            const hasClasses = entries.some(e => e.day_number === day.key);

            return (
              <motion.button
                key={day.key}
                onClick={() => onDaySelect(day.key)}
                className={`relative flex-1 min-w-[80px] px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                    : isToday
                    ? 'bg-white dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700'
                    : 'bg-white/50 dark:bg-emerald-950/30 text-gray-600 dark:text-emerald-200 hover:bg-white dark:hover:bg-emerald-900/20'
                }`}
                whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-xs opacity-80 mb-1">{day.short}</div>
                  <div className="text-sm font-bold">{day.label}</div>
                  {hasClasses && (
                    <div className={`mt-1.5 h-1.5 w-1.5 mx-auto rounded-full ${
                      isSelected ? 'bg-white' : 'bg-emerald-500'
                    }`} />
                  )}
                </div>
                {isToday && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Classes Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                {t('timetable_page.classes_schedule', 'Classes Schedule')}
              </h3>
            </div>

            {dayEntries.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-emerald-950/20 dark:to-gray-900/20 rounded-2xl p-12 text-center border border-gray-200 dark:border-emerald-800/50"
              >
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-emerald-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-emerald-300/70 text-lg font-medium">
                  {t('timetable_page.no_classes')}
                </p>
                <p className="text-gray-400 dark:text-emerald-400/50 text-sm mt-2">
                  {t('timetable_page.enjoy_free_day', 'Enjoy your free day!')}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {dayEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedEntry(entry)}
                    className="group bg-white dark:bg-emerald-900/20 rounded-xl p-4 border border-l-4 border-emerald-500 hover:shadow-lg hover:border-emerald-600 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {entry.subject}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-emerald-300/70">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            {formatTime(entry.from_time)} - {formatTime(entry.to_time)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
                          {entry.day}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Tasks & Exams */}
          <div className="space-y-6">
            {/* Tasks */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white to-blue-50/50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800/50 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-emerald-50">
                  {t('timetable_page.tasks', 'Tasks')}
                </h3>
                <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-semibold">
                  {dummyTasks.filter(t => !t.completed).length} {t('common.pending')}
                </span>
              </div>

              <div className="space-y-3">
                {dummyTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      task.completed
                        ? 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-60'
                        : 'bg-white dark:bg-emerald-950/30 border-blue-200 dark:border-blue-800/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          task.completed
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-emerald-50'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-gray-600 dark:text-emerald-300/70">
                            {task.subject}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                            {t(`common.priority.${task.priority}`)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-emerald-400/70 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.dueTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Exams */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-white to-purple-50/50 dark:from-emerald-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-800/50 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-emerald-50">
                  {t('timetable_page.exams', 'Exams')}
                </h3>
                <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-semibold">
                  {dummyExams.length} {t('common.scheduled')}
                </span>
              </div>

              <div className="space-y-3">
                {dummyExams.map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="p-4 rounded-lg bg-white dark:bg-emerald-950/30 border border-purple-200 dark:border-purple-800/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${examTypeColors[exam.type]} flex items-center justify-center flex-shrink-0`}>
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-emerald-50 text-sm">
                          {exam.subject}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-emerald-300/70 mt-0.5">
                          {exam.title}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-emerald-400/70">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {exam.time}
                          </span>
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                            {exam.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Google-Style Entry Details Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header - Google Style */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  {selectedEntry.subject}
                </h2>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={t('common.close', 'Close')}
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Time Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    {t('timetable_page.time_details', 'Time Details')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          {t('timetable_page.start_time', 'Start Time')}
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatTime(selectedEntry.from_time)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          {t('timetable_page.end_time', 'End Time')}
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatTime(selectedEntry.to_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    {t('timetable_page.assigned_tasks', 'Assigned Tasks')}
                  </h3>
                  <div className="space-y-3">
                    {dummyTasks.slice(0, 2).map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="mt-0.5">
                          {task.completed ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            task.completed
                              ? 'line-through text-gray-500 dark:text-gray-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {task.subject}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                              {t(`common.priority.${task.priority}`)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('common.due', 'Due')}: {task.dueTime}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons - Google Style */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {t('common.close', 'Close')}
                  </button>
                  <button
                    className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    {t('timetable_page.view_details', 'View Details')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
