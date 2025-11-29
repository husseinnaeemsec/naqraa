import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, BookOpen, Filter, Search, Eye, Plus } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/CustomCard";
import Button from "../../components/ui/CustomButton";

// ----- Types -----
interface Quiz {
    id: number;
    title: string;
    subject: string;
    course: string;
    created_at: string;
    recommended: boolean;
}

const dummyQuizzes: Quiz[] = [
    { id: 1, title: "Math Basics", subject: "Math", course: "Algebra 101", created_at: "2025-11-01T10:00:00Z", recommended: true },
    { id: 2, title: "Physics Force", subject: "Physics", course: "Physics 101", created_at: "2025-10-20T10:00:00Z", recommended: false },
    { id: 3, title: "Advanced Algebra", subject: "Math", course: "Algebra 102", created_at: "2025-10-25T10:00:00Z", recommended: true },
];

const subjects = ["Math", "Physics", "Chemistry", "Biology"];

// Quizzes Page Component
const QuizzesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'recommended'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setQuizzes(dummyQuizzes);
            setLoading(false);
        }, 500);
    }, []);

    const filteredQuizzes = quizzes.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              q.course.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || (filter === 'recommended' && q.recommended);

        const matchesSubject = selectedSubject ? q.subject === selectedSubject : true;

        return matchesSearch && matchesFilter && matchesSubject;
    });

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-emerald-800 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-emerald-800 rounded"></div>
                </div>
            </div>
        );
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
                            {t('quizzes_page.title', 'الاختبارات')}
                        </h1>
                        <p className="text-gray-600 dark:text-emerald-200 mt-1">
                            {t('quizzes_page.subtitle', 'هنا يمكنك العثور على الاختبارات التي قمت بتأديتها من الدورات ومصادر اخرى')}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            size="sm"
                            icon={<Plus className="size-4" />}
                            onClick={() => setSelectedSubject('')}
                        >
                            {t('quizzes_page.create_quiz', 'اختبار جديد')}
                        </Button>
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
                    <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                <BookOpen className="size-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{quizzes.length}</div>
                                <div className="text-sm text-emerald-600 dark:text-emerald-400">{t('quizzes_page.total_quizzes', 'Total Quizzes')}</div>
                            </div>
                        </div>
                    </Card>

                    <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-200 dark:bg-emerald-800/50 rounded-full">
                                <Calendar className="size-5 text-emerald-700" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{quizzes.filter(q => q.recommended).length}</div>
                                <div className="text-sm text-emerald-700 dark:text-emerald-300">{t('quizzes_page.recommended_quizzes', 'Recommended Quizzes')}</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Filters and Search */}
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
                                placeholder={t('quizzes_page.search_placeholder', 'Search quizzes...')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Filter className="size-4 text-gray-500" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                        >
                            <option value="all">{t('quizzes_page.filter_all', 'All')}</option>
                            <option value="recommended">{t('quizzes_page.filter_recommended', 'Recommended')}</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="size-4 text-gray-500" />
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                        >
                            <option value="">{t('quizzes_page.filter_subject', 'All Subjects')}</option>
                            {subjects.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Quizzes Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card variant="dashboard" className="overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-emerald-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                                {t('quizzes_page.table_title', 'Available Quizzes')} ({filteredQuizzes.length})
                            </h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-emerald-900/30">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('quizzes_page.table_title_col', 'Quiz')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('quizzes_page.table_subject_col', 'Subject')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('quizzes_page.table_course_col', 'Course')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('quizzes_page.table_created_col', 'Created')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('quizzes_page.table_actions_col', 'Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-emerald-950 divide-y divide-gray-200 dark:divide-emerald-800">
                                    {filteredQuizzes.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <BookOpen className="size-12 text-gray-400 mb-3" />
                                                    <p className="text-gray-500 dark:text-emerald-400 font-medium">
                                                        {searchTerm ? t('quizzes_page.no_search_results', 'No quizzes found') : t('quizzes_page.no_quizzes', 'No quizzes available')}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredQuizzes.map((quiz, index) => (
                                            <motion.tr
                                                key={quiz.id}
                                                className="hover:bg-gray-50 dark:hover:bg-emerald-900/30 transition-colors"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-emerald-50">{quiz.title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-emerald-50">{quiz.subject}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-emerald-50">{quiz.course}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-emerald-400">{new Date(quiz.created_at).toLocaleDateString('ar-SA')}</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<Eye className="size-4" />}
                                                        onClick={() => navigate(`/dashboard/quizzes/${quiz.id}`)}
                                                    >
                                                        {t('quizzes_page.view_button', 'View')}
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default QuizzesPage;
