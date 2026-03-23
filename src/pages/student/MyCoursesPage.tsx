import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle, PlayCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Enrollment } from '../../types/enrollments';
import Card from '../../components/ui/CustomCard';

export default function MyCoursesPage() {
    const { t } = useTranslation();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        
    };

    const getProgress = (enrollment: Enrollment) => {
        if (!enrollment.course) return 0;
        const totalSections = enrollment.course.sections?.length || 0;
        const completedSections = enrollment.completed_sections?.length || 0;
        return totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : enrollment.progress || 0;
    };

    const filteredEnrollments = enrollments.filter(enrollment => {
        const progress = getProgress(enrollment);
        if (filter === 'completed') return progress === 100;
        if (filter === 'in-progress') return progress > 0 && progress < 100;
        return true;
    });

    const stats = {
        total: enrollments.length,
        inProgress: enrollments.filter(e => {
            const progress = getProgress(e);
            return progress > 0 && progress < 100;
        }).length,
        completed: enrollments.filter(e => getProgress(e) === 100).length,
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-emerald-300 font-medium">{t('common.loading')}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950">
            <div className="max-w-400 mx-auto p-6 space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            {t('my_courses.title', 'My Courses')}
                        </h1>
                        <p className="text-slate-600 dark:text-emerald-200/70 mt-1">
                            {t('my_courses.subtitle', 'Continue your learning journey')}
                        </p>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1  md:grid-cols-3 gap-4"
                >
                    <Card className="p-6 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                    {t('my_courses.total_courses', 'Total Courses')}
                                </p>
                                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border border-amber-200 dark:border-amber-800 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                                    {t('my_courses.in_progress', 'In Progress')}
                                </p>
                                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1">{stats.inProgress}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-200 dark:bg-amber-800 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 border border-emerald-200 dark:border-emerald-800 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                    {t('my_courses.completed', 'Completed')}
                                </p>
                                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">{stats.completed}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-200 dark:bg-emerald-800 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3"
                >
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            filter === 'all'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-white dark:bg-emerald-900/30 text-slate-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50'
                        }`}
                    >
                        {t('my_courses.filter_all', 'All')}
                    </button>
                    <button
                        onClick={() => setFilter('in-progress')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            filter === 'in-progress'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-white dark:bg-emerald-900/30 text-slate-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50'
                        }`}
                    >
                        {t('my_courses.filter_in_progress', 'In Progress')}
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            filter === 'completed'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-white dark:bg-emerald-900/30 text-slate-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50'
                        }`}
                    >
                        {t('my_courses.filter_completed', 'Completed')}
                    </button>
                </motion.div>

                {/* Courses Grid */}
                {filteredEnrollments.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {t('my_courses.no_courses', 'No courses found')}
                        </h3>
                        <p className="text-slate-600 dark:text-emerald-200/70 mb-6">
                            {t('my_courses.browse_courses', 'Browse available courses and start learning')}
                        </p>
                        <Link
                            to="/courses"
                            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/30 font-medium transition-all"
                        >
                            {t('my_courses.explore_courses', 'Explore Courses')}
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {filteredEnrollments.map((enrollment, index) => {
                            if (!enrollment.course) return null;
                            
                            const progress = getProgress(enrollment);
                            const isCompleted = progress === 100;
                            const lastWatchedLecture = enrollment.last_watched_lecture;
                            const course = enrollment.course;

                            return (
                                <motion.div
                                    key={enrollment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link to={`/courses/${course.slug}`}>
                                        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-slate-200 dark:border-emerald-800">
                                            {/* Course Thumbnail */}
                                            <div className="relative h-48 overflow-hidden bg-linear-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30">
                                                {course.cover ? (
                                                    <img
                                                        src={course.cover}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <BookOpen className="w-16 h-16 text-emerald-600 dark:text-emerald-400 opacity-50" />
                                                    </div>
                                                )}
                                                {isCompleted && (
                                                    <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        {t('my_courses.completed_badge', 'Completed')}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Course Info */}
                                            <div className="p-5 space-y-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                        {course.title}
                                                    </h3>
                                                    {course.instructor?.full_name && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {course.instructor.full_name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Progress Bar */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            {t('my_courses.progress', 'Progress')}
                                                        </span>
                                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            transition={{ duration: 1, delay: index * 0.1 }}
                                                            className={`h-full rounded-full ${
                                                                isCompleted
                                                                    ? 'bg-linear-to-r from-emerald-500 to-emerald-600'
                                                                    : 'bg-linear-to-r from-blue-500 to-emerald-500'
                                                            }`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Course Stats */}
                                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-1">
                                                        <PlayCircle className="w-4 h-4" />
                                                        <span>{enrollment.completed_lectures?.length || 0} {t('my_courses.lectures', 'lectures')}</span>
                                                    </div>
                                                    {course.sections && course.sections.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{course.sections.length} {t('my_courses.sections', 'sections')}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Last Watched */}
                                                {lastWatchedLecture && !isCompleted && (
                                                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                            {t('my_courses.continue_from', 'Continue from:')}
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                                                            {lastWatchedLecture.title}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Continue Button */}
                                                <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                                                    {isCompleted ? (
                                                        <>
                                                            <TrendingUp className="w-4 h-4" />
                                                            {t('my_courses.review_course', 'Review Course')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PlayCircle className="w-4 h-4" />
                                                            {t('my_courses.continue_learning', 'Continue Learning')}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
