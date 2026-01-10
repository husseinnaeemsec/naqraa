import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, BookOpen, CheckSquare, FileText, AlertCircle, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TimeTableEntry } from '../types/academics';

interface DayDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    dayName: string;
    entries: TimeTableEntry[];
    isToday: boolean;
}

export default function DayDetailsDrawer({ isOpen, onClose, dayName, entries, isToday }: DayDetailsDrawerProps) {
    const { t } = useTranslation();

    const formatTime = (time: string) => time.substring(0, 5);

    // Dummy data for tasks, homework, and exams
    const dummyTasks = [
        { id: 1, title: 'Complete Math Exercise', completed: false, priority: 'high' },
        { id: 2, title: 'Review Chemistry Notes', completed: true, priority: 'medium' },
    ];

    const dummyHomework = [
        { id: 1, subject: 'Arabic', title: 'Essay Writing', dueTime: '11:59 PM', status: 'pending' },
        { id: 2, subject: 'Physics', title: 'Lab Report', dueTime: '06:00 PM', status: 'submitted' },
    ];

    const dummyExams = [
        { id: 1, subject: 'Biology', title: 'Chapter 5 Quiz', time: '09:00 AM', duration: '45 min' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className={`sticky top-0 z-10 ${isToday ? 'bg-emerald-600' : 'bg-gradient-to-r from-emerald-600 to-emerald-700'} text-white p-6`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-6 h-6" />
                                    <h2 className="text-2xl font-bold">{dayName}</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            {isToday && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                                    <Clock className="w-4 h-4" />
                                    {t('timetable_page.today')}
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Lectures Schedule */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {t('timetable_page.lectures_schedule', 'Lectures Schedule')}
                                    </h3>
                                    <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
                                        {entries.length} {t('timetable_page.classes', 'classes')}
                                    </span>
                                </div>

                                {entries.length === 0 ? (
                                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                        <p className="text-slate-500 dark:text-slate-400">
                                            {t('timetable_page.no_classes')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {entries.map((entry, index) => (
                                            <motion.div
                                                key={entry.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-lg border border-emerald-200 dark:border-emerald-800"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-slate-900 dark:text-white">
                                                        {entry.subject}
                                                    </h4>
                                                    <span className="text-xs px-2 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-full">
                                                        {formatTime(entry.from_time)} - {formatTime(entry.to_time)}
                                                    </span>
                                                </div>
                                                
                                                {/* Dummy lecture details */}
                                                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <p className="flex items-center gap-2">
                                                        <span className="font-medium">{t('timetable_page.instructor', 'Instructor')}:</span>
                                                        <span>Dr. Ahmed Mohammed</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="font-medium">{t('timetable_page.room', 'Room')}:</span>
                                                        <span>Room {101 + index}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="font-medium">{t('timetable_page.type', 'Type')}:</span>
                                                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                                                            {index % 2 === 0 ? 'Lecture' : 'Lab'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Tasks */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {t('timetable_page.tasks', 'Tasks')}
                                    </h3>
                                    <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
                                        {dummyTasks.filter(t => !t.completed).length} {t('timetable_page.pending', 'pending')}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {dummyTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`p-3 rounded-lg border ${
                                                task.completed
                                                    ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                                                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    readOnly
                                                    className="w-4 h-4 text-emerald-600 rounded"
                                                />
                                                <span className={`flex-1 text-sm ${
                                                    task.completed
                                                        ? 'line-through text-slate-500 dark:text-slate-400'
                                                        : 'text-slate-900 dark:text-white'
                                                }`}>
                                                    {task.title}
                                                </span>
                                                {task.priority === 'high' && !task.completed && (
                                                    <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                                                        {t('timetable_page.high_priority', 'High')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Homework */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {t('timetable_page.homework', 'Homework')}
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    {dummyHomework.map((hw) => (
                                        <div
                                            key={hw.id}
                                            className={`p-3 rounded-lg border ${
                                                hw.status === 'submitted'
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                                                    : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                                                            {hw.subject}
                                                        </span>
                                                        {hw.status === 'submitted' && (
                                                            <span className="text-xs px-2 py-0.5 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded">
                                                                {t('timetable_page.submitted', 'Submitted')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="font-medium text-sm text-slate-900 dark:text-white">
                                                        {hw.title}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                <span>{t('timetable_page.due', 'Due')}: {hw.dueTime}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Exams */}
                            {dummyExams.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {t('timetable_page.exams', 'Exams')}
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        {dummyExams.map((exam) => (
                                            <div
                                                key={exam.id}
                                                className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded font-medium">
                                                            {exam.subject}
                                                        </span>
                                                        <h4 className="font-bold text-slate-900 dark:text-white mt-2">
                                                            {exam.title}
                                                        </h4>
                                                    </div>
                                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {exam.time}
                                                    </span>
                                                    <span>• {exam.duration}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
