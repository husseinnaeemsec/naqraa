import LastWatchedCourseWidget from "../../components/LastWatchedCourseWidget";
import StudyHoursChart from "../../components/StudyHoursChartWidget";
import StudentPointsWidget from "../../components/StudentPointsWidget";
import UpcomingExams from "../../components/UpcomingExamsWidget";
import RecentActivityWidget from "../../components/RecentActivityWidget";
import RecommendedCoursesWidget from "../../components/RecommendedCoursesWidget";
import RecommendedQuizzesWidget from "../../components/RecommendedQuizzesWidget";
import TasksWidget from "../../components/TaskWidget";
import UsefulResourcesWidget from "../../components/UsefulResourcesWidget";
import UserProfileWidget from "../../components/UserProfileWidget";
import NotificationWidget from "../../components/NotificationWidget";
import LearningProgressWidget from "../../components/LearningProgressWidget";
import { useAppSelector } from "../../store/store";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Clock } from "lucide-react";



const IndexPage = () => {
    const { user } = useAppSelector((state) => state.auth)

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950">
            {/* Enhanced Header */}
            <motion.div 
                className="relative p-6 pb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl translate-y-16 -translate-x-16"></div>
                
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Sparkles className="size-8 text-emerald-500" />
                        </motion.div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300">
                            مرحباً، <span className="text-gray-900 dark:text-emerald-50">{user?.first_name}</span>
                        </h1>
                    </div>
                    
                    <p className="text-gray-700 dark:text-emerald-100/80 leading-relaxed max-w-2xl">
                        استمر بالتعلم لتحقيق أقصى استفادة من وقتك. في حال احتجت إلى أي{' '}
                        <Link 
                            to={'/support'} 
                            className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline underline-offset-2 decoration-2 transition-colors"
                        > 
                            مساعدة
                        </Link>
                        {' '}لا تنسَ أننا هنا في كل وقت
                    </p>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-emerald-200">
                            <BookOpen className="size-4 text-emerald-600" />
                            <span>{user?.enrolled_courses?.length || 0} دورة مسجل</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-emerald-200">
                            <Clock className="size-4 text-emerald-600" />
                            <span>نشط اليوم</span>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* Enhanced Dashboard Grid with Better Hierarchy */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 pt-0 max-w-[1600px] mx-auto">
                {/* ===== MAIN CONTENT ===== */}
                <div className="xl:col-span-9 space-y-6">
                    {/* TIER 0: Continue Learning - Top Priority */}
                    <motion.section 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-emerald-600 to-emerald-700 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">متابعة التعلم</h2>
                            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium dark:bg-emerald-900/30 dark:text-emerald-300">الأولوية الأولى</span>
                        </div>
                        
                        {user?.progress?.last_watched_enrollment ? (
                            <LastWatchedCourseWidget />
                        ) : (
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-950 p-8 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                                <BookOpen className="size-12 text-emerald-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">ابدأ رحلتك التعليمية</h3>
                                <p className="text-emerald-700 dark:text-emerald-300 mb-4">لم تسجل في أي دورة بعد. استكشف مجموعتنا الواسعة من الدورات</p>
                                <Link to="/courses" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                    <BookOpen className="size-4" />
                                    استكشف الدورات
                                </Link>
                            </div>
                        )}
                    </motion.section>

                    {/* TIER 1: Tasks, Homework & Upcoming Exams */}
                    <motion.section 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">المهام والامتحانات العاجلة</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-1">
                                <TasksWidget />
                            </div>
                            <div className="lg:col-span-1">
                                <UpcomingExams />
                            </div>
                            <div className="lg:col-span-1">
                                <RecentActivityWidget />
                            </div>
                        </div>
                        
                        {/* Recommended Quizzes - Part of TIER 1 */}
                        <div className="mt-4">
                            <RecommendedQuizzesWidget />
                        </div>
                    </motion.section>

                    {/* TIER 2: Performance & Progress */}
                    <motion.section 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">الأداء والتقدم</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {user?.week_study_time && (
                                <StudyHoursChart weekData={user?.week_study_time} />
                            )}
                            <StudentPointsWidget />
                        </div>
                    </motion.section>

                    {/* TIER 3: Resources & Recommendations */}
                    <motion.section 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-emerald-300 to-emerald-400 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">المصادر والتوصيات</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <UsefulResourcesWidget />
                            <RecommendedCoursesWidget />
                        </div>
                    </motion.section>
                </div>

                {/* ===== ENHANCED SIDEBAR ===== */}
                <motion.div 
                    className="xl:col-span-3 space-y-4 sticky top-6 self-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <UserProfileWidget />
                    <LearningProgressWidget />
                    <NotificationWidget />
                </motion.div>
            </div>

        </div>
    );
};

export default IndexPage;
