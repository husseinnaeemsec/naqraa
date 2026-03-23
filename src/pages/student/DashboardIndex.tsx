import { useAppSelector } from "../../store";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    Clock, 
    Bell, 
    Target,
    CheckCircle2,
    Zap,
    Award
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TodaysTasksWidget from "../../components/TodaysTasksWidget";
import UpcomingEventsWidget from "../../components/UpcomingEventsWidget";
import QuickActionsWidget from "../../components/QuickActionsWidget";
import StatCard from "../../components/StatCard";
import WeeklyStudyChart from "../../components/WeeklyStudyChart";
import RecentActivityFeed from "../../components/RecentActivityFeed";
import LastWatchedCourseWidget from "../../components/LastWatchedCourseWidget";

const IndexPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAppSelector((state) => state.auth);
    const notifications : { read:boolean }[]  = [];
    const unreadNotifications = notifications.filter((n: { read:boolean }) => !n.read).length;
    const userLang = user?.language || i18n.language || 'en';
    const locale = userLang === 'ar' ? 'ar-SA' : userLang === 'ku' ? 'ku' : 'en-US';

    // Format date based on user language
    const formatDate = (date: Date) => {
        return date.toLocaleDateString(locale, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50/30 to-slate-50 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950">
            {/* Compact Header with Key Metrics */}
            <motion.div 
                className="sticky top-0 z-1 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="max-w-450 mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {t('dashboard_index.welcome_user', { name: user?.first_name || t('dashboard_index.student') })}
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {formatDate(new Date())}
                            </p>
                        </div>
                        
                        {/* Quick Stats Bar */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                    <Target className="size-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard_index.study_streak')}</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white"> 0 days</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard_index.today')}</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {Math.floor((0) / 60)}h { 0 % 60}m
                                    </p>
                                </div>
                            </div>
                            
                            <Link 
                                to="/dashboard/notifications"
                                className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                <Bell className="size-5 text-slate-600 dark:text-slate-400" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Dashboard Grid - Modern Card-Based Layout */}
            <div className="max-w-[1800px] mx-auto p-6 space-y-6">
                
                {/* Priority Tasks Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                    <TodaysTasksWidget />
                    <UpcomingEventsWidget />
                    <QuickActionsWidget />
                </motion.div>

                {/* Performance Metrics Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                >
                    <StatCard
                        label={t('dashboard_index.study_hours')}
                        value={`${Math.floor((0 / 60))}h`}
                        change="+12%"
                        icon={Clock}
                        color="emerald"
                    />
                    <StatCard
                        label={t('dashboard_index.tasks_completed')}
                        value="24"
                        change="+8%"
                        icon={CheckCircle2}
                        color="blue"
                    />
                    <StatCard
                        label={t('dashboard_index.current_streak')}
                        value={t('dashboard_index.days_count', { count: 0 })}
                        change="+2"
                        icon={Zap}
                        color="orange"
                    />
                    <StatCard
                        label={t('dashboard_index.points_earned')}
                        value={0}
                        change="+15%"
                        icon={Award}
                        color="purple"
                    />
                </motion.div>

                {/* Activity & Progress Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                >
                    <LastWatchedCourseWidget />
                    <WeeklyStudyChart />
                    <RecentActivityFeed />
                </motion.div>
            </div>
        </div>
    );
};

export default IndexPage;
