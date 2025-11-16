import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, BookOpen, AlertTriangle, Filter, Search, Eye, Download } from "lucide-react";
import { useTranslation } from 'react-i18next';
import type { Exam } from "../../../types";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { formatTime, isExpired, timeBefore } from "../../utils/functions";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import useApiErrorHandler from "../../hooks/use-api-error-handler";

// Exams Page Component
const ExamsPage = () => {
    const { t } = useTranslation();
    useApiErrorHandler();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await api.get(endpoints.organization.exams);
                setExams(res.data.results);
            } catch (error) {
                console.error("Error fetching exams:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchExams();
    }, []);

    const getExamStatus = (examDate: string) => {
        const now = new Date();
        const exam = new Date(examDate);
        const diffInDays = Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays < 0) return { status: 'completed', color: 'gray', text: t('exams_page.status_completed'), icon: '✅' };
        if (diffInDays <= 1) return { status: 'urgent', color: 'red', text: t('exams_page.status_urgent'), icon: '🔴' };
        if (diffInDays <= 3) return { status: 'soon', color: 'orange', text: t('exams_page.status_soon'), icon: '🟠' };
        if (diffInDays <= 7) return { status: 'upcoming', color: 'yellow', text: t('exams_page.status_upcoming'), icon: '🟡' };
        return { status: 'scheduled', color: 'blue', text: t('exams_page.status_scheduled'), icon: '🔵' };
    };

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.subject_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.class_room_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const examStatus = getExamStatus(exam.date);
        const matchesFilter = filter === 'all' || 
                            (filter === 'upcoming' && examStatus.status !== 'completed') ||
                            (filter === 'completed' && examStatus.status === 'completed');
        
        return matchesSearch && matchesFilter;
    });

    const upcomingExams = exams.filter(exam => getExamStatus(exam.date).status !== 'completed');
    const completedExams = exams.filter(exam => getExamStatus(exam.date).status === 'completed');

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
                            {t('exams_page.title')}
                        </h1>
                        <p className="text-gray-600 dark:text-emerald-200 mt-1">
                            {t('exams_page.subtitle')}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" icon={<Download className="size-4" />}>
                            {t('exams_page.download_schedule')}
                        </Button>
                        <Button variant="primary" size="sm" icon={<Calendar className="size-4" />}>
                            {t('exams_page.exam_schedule')}
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
                    <Card variant="dashboard" className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                <BookOpen className="size-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{exams.length}</div>
                                <div className="text-sm text-emerald-600 dark:text-emerald-400">{t('exams_page.total_exams')}</div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card variant="dashboard" className="p-4 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-800/30 dark:to-emerald-700/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-200 dark:bg-emerald-800/50 rounded-full">
                                <Clock className="size-5 text-emerald-700" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{upcomingExams.length}</div>
                                <div className="text-sm text-emerald-700 dark:text-emerald-300">{t('exams_page.upcoming_exams')}</div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card variant="dashboard" className="p-4 bg-gradient-to-r from-emerald-200 to-emerald-300 dark:from-emerald-700/30 dark:to-emerald-600/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-300 dark:bg-emerald-700/50 rounded-full">
                                <Calendar className="size-5 text-emerald-800" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{completedExams.length}</div>
                                <div className="text-sm text-emerald-800 dark:text-emerald-200">{t('exams_page.completed_exams')}</div>
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
                                placeholder={t('exams_page.search_placeholder')}
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
                            <option value="all">{t('exams_page.filter_all')}</option>
                            <option value="upcoming">{t('exams_page.filter_upcoming')}</option>
                            <option value="completed">{t('exams_page.filter_completed')}</option>
                        </select>
                    </div>
                </motion.div>

                {/* Exams Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card variant="dashboard" className="overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-emerald-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                                {t('exams_page.exam_table_title')} ({filteredExams.length})
                            </h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-emerald-900/30">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('exams_page.table_status')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('exams_page.table_exam')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('exams_page.table_subject')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('exams_page.table_class')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('exams_page.table_date')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('exams_page.table_time')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-emerald-300 uppercase tracking-wider">{t('exams_page.table_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-emerald-950 divide-y divide-gray-200 dark:divide-emerald-800">
                                    {filteredExams.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <BookOpen className="size-12 text-gray-400 mb-3" />
                                                    <p className="text-gray-500 dark:text-emerald-400 font-medium">
                                                        {searchTerm ? t('exams_page.no_search_results') : t('exams_page.no_exams')}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredExams.map((exam, index) => {
                                            const status = getExamStatus(exam.date);
                                            
                                            return (
                                                <motion.tr
                                                    key={exam.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-emerald-900/30 transition-colors"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            status.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                            status.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                                            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                            status.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                        }`}>
                                                            <span className="mr-1">{status.icon}</span>
                                                            {status.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-emerald-50">
                                                            {exam.title}
                                                        </div>
                                                        {exam.description && (
                                                            <div className="text-sm text-gray-500 dark:text-emerald-300 truncate max-w-48">
                                                                {exam.description}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-emerald-50">
                                                        {exam.subject_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-emerald-50">
                                                        {exam.class_room_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-emerald-50">
                                                            {timeBefore(exam.date)}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-emerald-300">
                                                            {new Date(exam.date).toLocaleDateString('ar-SA')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-emerald-50">
                                                        {formatTime(exam.time)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Eye className="size-4" />}
                                                        >
                                                            {t('exams_page.view_button')}
                                                        </Button>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
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

export default ExamsPage;