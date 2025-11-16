import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Filter, Grid, List, Plus, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { setUserEnrollments } from "../../store/authSlice";
import PageLoader from "../../components/PageLoader";
import { Link } from "react-router-dom";
import StudentCourseCard from "../../components/StudentCourseCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import useApiErrorHandler from "../../hooks/use-api-error-handler";

// Courses Page Component
const StudentCoursesPage = () => {
    useApiErrorHandler();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'name'>('recent');
    const { enrollments } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const fetchEnrollments = async () => {
            if (enrollments.length > 0) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(endpoints.user.enrollments.list);
                dispatch(setUserEnrollments(res.data.results));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [dispatch, enrollments.length]);

    // Filter and sort enrollments
    const filteredEnrollments = enrollments
        .filter(enrollment => 
            enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.course.title.localeCompare(b.course.title);
                case 'progress':
                    return (b.progress || 0) - (a.progress || 0);
                case 'recent':
                default:
                    return new Date(b.enrollment_date).getTime() - new Date(a.enrollment_date).getTime();
            }
        });

    const inProgressCourses = enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100);
    const completedCourses = enrollments.filter(e => (e.progress || 0) >= 100);

    if (loading) {
        return <PageLoader message="جاري تحميل الدورات الرجاء الانتظار..." />
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950">
            {/* Header */}
            <motion.div 
                className="p-6 pb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300">
                            دوراتي
                        </h1>
                        <p className="text-gray-600 dark:text-emerald-200 mt-1">
                            تابع تقدمك في جميع الدورات المسجل بها
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Link to="/courses/explore">
                            <Button variant="primary" size="sm" icon={<Plus className="size-4" />}>
                                تصفح الدورات
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            <div className="px-6 pb-6 space-y-6">
                {/* Statistics Cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card variant="dashboard" className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                <BookOpen className="size-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{enrollments.length}</div>
                                <div className="text-sm text-emerald-600 dark:text-emerald-400">إجمالي الدورات</div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card variant="dashboard" className="p-4 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-800/30 dark:to-emerald-700/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-200 dark:bg-emerald-800/50 rounded-full">
                                <TrendingUp className="size-5 text-emerald-700" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{inProgressCourses.length}</div>
                                <div className="text-sm text-emerald-700 dark:text-emerald-300">قيد الدراسة</div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card variant="dashboard" className="p-4 bg-gradient-to-r from-emerald-200 to-emerald-300 dark:from-emerald-700/30 dark:to-emerald-600/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-300 dark:bg-emerald-700/50 rounded-full">
                                <BookOpen className="size-5 text-emerald-800" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{completedCourses.length}</div>
                                <div className="text-sm text-emerald-800 dark:text-emerald-200">مكتملة</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {enrollments.length > 0 && (
                    <>
                        {/* Filters and Controls */}
                        <motion.div 
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                                    <input
                                        type="text"
                                        placeholder="ابحث في دوراتك..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Filter className="size-4 text-gray-500" />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="px-3 py-2 border border-gray-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                                    >
                                        <option value="recent">الأحدث</option>
                                        <option value="progress">التقدم</option>
                                        <option value="name">الاسم</option>
                                    </select>
                                </div>
                                
                                <div className="flex border border-gray-300 dark:border-emerald-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-emerald-900'}`}
                                    >
                                        <Grid className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-emerald-900'}`}
                                    >
                                        <List className="size-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Courses Grid/List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {filteredEnrollments.length === 0 ? (
                                <Card variant="dashboard" className="p-12 text-center">
                                    <Search className="size-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-emerald-200 mb-2">
                                        لا توجد نتائج للبحث
                                    </h3>
                                    <p className="text-gray-500 dark:text-emerald-400">
                                        جرب مصطلحات بحث مختلفة
                                    </p>
                                </Card>
                            ) : (
                                <div className={`grid gap-6 ${
                                    viewMode === 'grid' 
                                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                        : 'grid-cols-1'
                                }`}>
                                    {filteredEnrollments.map((enrollment, index) => (
                                        <motion.div
                                            key={enrollment.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <StudentCourseCard enrollment={enrollment} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </>
                )}

                {/* Empty State */}
                {enrollments.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card variant="dashboard" className="p-12 text-center">
                            <BookOpen className="size-16 text-emerald-300 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-emerald-50 mb-3">
                                لم تشترك في أي دورة حتى الآن
                            </h2>
                            <p className="text-gray-600 dark:text-emerald-200 mb-6 max-w-md mx-auto">
                                ابدأ رحلة التعلم واستكشف مجموعتنا الواسعة من الدورات التعليمية المتخصصة
                            </p>
                            <div className="space-y-3">
                                <Link to="/courses/explore">
                                    <Button variant="primary" size="lg" icon={<BookOpen className="size-5" />}>
                                        تصفح الدورات المتاحة
                                    </Button>
                                </Link>
                                <Link to="/courses">
                                    <Button variant="outline" size="md">
                                        عرض جميع الدورات
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default StudentCoursesPage;