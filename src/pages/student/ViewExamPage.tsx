import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    BookOpen,
    MapPin,
    ArrowLeft,
    AlertTriangle,
    FileText,
    Timer,
    CheckCircle,
    Info
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import type { Exam } from "../../../types";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { formatTime, timeBefore } from "../../utils/functions";
import Card from "../../components/ui/CustomCard";
import Button from "../../components/ui/CustomButton";
import useApiErrorHandler from "../../hooks/use-api-error-handler";
import Spinner from "../../components/Spinner";
import ShareButton from "../../components/ShareButton";

const ViewExamPage = () => {
    const { t } = useTranslation();
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    useApiErrorHandler();

    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExam = async () => {
            if (!examId) {
                setError(t('view_exam.invalid_exam_id'));
                setLoading(false);
                return;
            }

            try {
                const res = await api.get(endpoints.organization.getExam(examId));
                setExam(res.data);
            } catch (error: any) {
                console.error("Error fetching exam:", error);
                setError(error.response?.data?.message || t('view_exam.fetch_error'));
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [examId, t]);

    const getDayName = (date: string) => {
        const examDate = new Date(date);
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayKey = dayNames[examDate.getDay()];
        return t(`days.${dayKey}`);
    };

    const getExamStatus = (examDate: string) => {
        const now = new Date();
        const examDateTime = new Date(examDate);
        const diffInDays = Math.ceil((examDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays < 0) return {
            status: 'completed',
            color: 'gray',
            bgColor: 'bg-gray-100 dark:bg-gray-900/30',
            textColor: 'text-gray-800 dark:text-gray-300',
            text: t('view_exam.status_completed'),
            icon: CheckCircle
        };
        if (diffInDays <= 1) return {
            status: 'urgent',
            color: 'red',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-300',
            text: t('view_exam.status_urgent'),
            icon: AlertTriangle
        };
        if (diffInDays <= 3) return {
            status: 'soon',
            color: 'orange',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            textColor: 'text-orange-800 dark:text-orange-300',
            text: t('view_exam.status_soon'),
            icon: Timer
        };
        if (diffInDays <= 7) return {
            status: 'upcoming',
            color: 'yellow',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
            textColor: 'text-yellow-800 dark:text-yellow-300',
            text: t('view_exam.status_upcoming'),
            icon: Clock
        };
        return {
            status: 'scheduled',
            color: 'blue',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            textColor: 'text-blue-800 dark:text-blue-300',
            text: t('view_exam.status_scheduled'),
            icon: Calendar
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 flex items-center justify-center">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-slate-600 dark:text-emerald-200">{t('view_exam.loading')}</p>
                </div>
            </div>
        );
    }

    if (error || !exam) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-emerald-50 mb-2">
                        {t('view_exam.error_title')}
                    </h2>
                    <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/dashboard/exams')}
                        icon={<ArrowLeft className="size-4" />}
                    >
                        {t('view_exam.back_to_exams')}
                    </Button>
                </div>
            </div>
        );
    }

    const status = getExamStatus(exam.date);
    const StatusIcon = status.icon;

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950">
            {/* Header */}
            <motion.div
                className="p-6 pb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard/exams')}
                        icon={<ArrowLeft className="size-4" />}
                    >
                        {t('view_exam.back_to_exams')}
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}>
                                <StatusIcon className="size-4 mr-1.5" />
                                {status.text}
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-50 mb-2">
                            {exam.title}
                        </h1>

                    </div>
                </div>
            </motion.div>

            <div className="px-6 pb-6 space-y-6">
                {/* Exam Details Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {/* Subject Card */}
                    <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                <BookOpen className="size-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-emerald-400">{t('view_exam.subject')}</div>
                                <div className="font-semibold text-gray-900 dark:text-emerald-50">
                                    {exam.subject_name || t('view_exam.no_subject')}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Classroom Card */}
                    <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-200 dark:bg-emerald-800/50 rounded-full">
                                <MapPin className="size-5 text-emerald-700" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-emerald-400">{t('view_exam.classroom')}</div>
                                <div className="font-semibold text-gray-900 dark:text-emerald-50">
                                    {exam.class_room_name || t('view_exam.no_classroom')}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Date Card */}
                    <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-300 dark:bg-emerald-700/50 rounded-full">
                                <Calendar className="size-5 text-emerald-800" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-emerald-400">{t('view_exam.exam_date')}</div>
                                <div className="font-semibold text-gray-900 dark:text-emerald-50">
                                    {getDayName(exam.date)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-emerald-300">
                                    {new Date(exam.date).toLocaleDateString('ar-SA')}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-emerald-300">
                                    {timeBefore(exam.date)}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Time Card */}
                    <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-400 dark:bg-emerald-600/50 rounded-full">
                                <Clock className="size-5 text-emerald-900 dark:text-emerald-100" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-emerald-400">{t('view_exam.exam_time')}</div>
                                <div className="font-semibold text-gray-900 dark:text-emerald-50">
                                    {formatTime(exam.time)}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Exam Information */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Exam Details */}
                    <Card variant="dashboard" className="overflow-visible">
                        <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2">
                                <Info className="size-5 text-emerald-600" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                                    {t('view_exam.exam_details')}
                                </h2>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-emerald-400">
                                    {t('view_exam.exam_title')}
                                </label>
                                <p className="mt-1 text-gray-900 dark:text-emerald-50 font-semibold">
                                    {exam.title}
                                </p>
                            </div>

                            {exam.description && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-emerald-400">
                                        {t('view_exam.description')}
                                    </label>
                                    <p className="mt-1 text-gray-700 dark:text-emerald-100 leading-relaxed">
                                        {exam.description}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-emerald-400">
                                    {t('view_exam.exam_status')}
                                </label>
                                <div className={`mt-1 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}>
                                    <StatusIcon className="size-4 mr-1.5" />
                                    {status.text}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 relative">
                                <label className="text-sm font-medium text-gray-500 dark:text-emerald-400 mb-3 block">
                                    {t('view_exam.actions')}
                                </label>
                                <div className="flex flex-wrap gap-2 relative z-10">
                                    {status.status === 'completed' ? (
                                        <>
                                            <Button variant="outline" size="sm" icon={<CheckCircle className="size-4" />}>
                                                {t('view_exam.exam_completed')}
                                            </Button>
                                            <ShareButton
                                                url={window.location.href}
                                                title={`${t('view_exam.share_exam_title')}: ${exam.title}`}
                                                description={`${t('view_exam.share_exam_description')} ${exam.subject_name || ''} - ${getDayName(exam.date)} ${new Date(exam.date).toLocaleDateString('ar-SA')}`}
                                                variant="secondary"
                                                size="sm"
                                                className="inline-flex items-center gap-2"
                                                utmParams={{
                                                    utm_source: 'exam_page',
                                                    utm_medium: 'share_button',
                                                    utm_campaign: 'exam_sharing',
                                                    utm_content: exam.id?.toString()
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="primary" size="sm" icon={<Calendar className="size-4" />}>
                                                {t('view_exam.add_to_calendar')}
                                            </Button>
                                            <Button variant="outline" size="sm" icon={<FileText className="size-4" />}>
                                                {t('view_exam.download_details')}
                                            </Button>
                                            <ShareButton
                                                url={window.location.href}
                                                title={`${t('view_exam.share_exam_title')}: ${exam.title}`}
                                                description={`${t('view_exam.share_exam_description')} ${exam.subject_name || ''} - ${getDayName(exam.date)} ${new Date(exam.date).toLocaleDateString('ar-SA')}`}
                                                variant="secondary"
                                                size="sm"
                                                className="inline-flex items-center gap-2"
                                                utmParams={{
                                                    utm_source: 'exam_page',
                                                    utm_medium: 'share_button',
                                                    utm_campaign: 'exam_sharing',
                                                    utm_content: exam.id?.toString()
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            {/* Organization Access Note */}
                            <motion.div
                                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.05 }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-800/50 rounded-full flex-shrink-0 mt-0.5">
                                        <Info className="size-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                            {t('view_exam.organization_access_title')}
                                        </p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            {t('view_exam.organization_access_description')}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </Card>

                    {/* Instructions and Notes */}
                    <Card variant="dashboard" className="overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-b border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2">
                                <FileText className="size-5 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-blue-50">
                                    {t('view_exam.instructions')}
                                </h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3 text-gray-700 dark:text-emerald-100">
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{t('view_exam.instruction_1')}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{t('view_exam.instruction_2')}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{t('view_exam.instruction_3')}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{t('view_exam.instruction_4')}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Recommended Resources Section */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {/* Recommended Resources */}
                    <Card variant="dashboard" className="overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-b border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2">
                                <BookOpen className="size-5 text-green-600" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-green-50">
                                    {t('view_exam.recommended_resources')}
                                </h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Resource Item 1 */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg flex-shrink-0">
                                            <FileText className="size-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-green-50 text-sm mb-1">
                                                {t('view_exam.sample_resource_1')}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-green-200">
                                                {t('view_exam.sample_resource_1_desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Resource Item 2 */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg flex-shrink-0">
                                            <BookOpen className="size-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-green-50 text-sm mb-1">
                                                {t('view_exam.sample_resource_2')}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-green-200">
                                                {t('view_exam.sample_resource_2_desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Resource Item 3 */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg flex-shrink-0">
                                            <Clock className="size-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-green-50 text-sm mb-1">
                                                {t('view_exam.sample_resource_3')}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-green-200">
                                                {t('view_exam.sample_resource_3_desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Recommended Articles & Courses */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Articles Section */}
                        <Card variant="dashboard" className="overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-b border-purple-200 dark:border-purple-800">
                                <div className="flex items-center gap-2">
                                    <FileText className="size-5 text-purple-600" />
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-purple-50">
                                        {t('view_exam.recommended_articles')}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Article 1 */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-sm transition-shadow">
                                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex-shrink-0">
                                        <FileText className="size-3 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-purple-50 text-sm mb-1">
                                            {t('view_exam.sample_article_1')}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-purple-200">
                                            {t('view_exam.sample_article_1_desc')}
                                        </p>
                                    </div>
                                </div>

                                {/* Article 2 */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-sm transition-shadow">
                                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex-shrink-0">
                                        <FileText className="size-3 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-purple-50 text-sm mb-1">
                                            {t('view_exam.sample_article_2')}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-purple-200">
                                            {t('view_exam.sample_article_2_desc')}
                                        </p>
                                    </div>
                                </div>

                                {/* Article 3 */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-sm transition-shadow">
                                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex-shrink-0">
                                        <FileText className="size-3 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-purple-50 text-sm mb-1">
                                            {t('view_exam.sample_article_3')}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-purple-200">
                                            {t('view_exam.sample_article_3_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Courses Section */}
                        <Card variant="dashboard" className="overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-b border-orange-200 dark:border-orange-800">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="size-5 text-orange-600" />
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-orange-50">
                                        {t('view_exam.recommended_courses')}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Course 1 */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-sm transition-shadow">
                                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex-shrink-0">
                                        <BookOpen className="size-3 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-orange-50 text-sm mb-1">
                                            {t('view_exam.sample_course_1')}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-orange-200 mb-2">
                                            {t('view_exam.sample_course_1_desc')}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                                                {t('view_exam.course_duration_1')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Course 2 */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-sm transition-shadow">
                                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex-shrink-0">
                                        <BookOpen className="size-3 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-orange-50 text-sm mb-1">
                                            {t('view_exam.sample_course_2')}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-orange-200 mb-2">
                                            {t('view_exam.sample_course_2_desc')}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                                                {t('view_exam.course_duration_2')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Course 3 */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-sm transition-shadow">
                                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex-shrink-0">
                                        <BookOpen className="size-3 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-orange-50 text-sm mb-1">
                                            {t('view_exam.sample_course_3')}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-orange-200 mb-2">
                                            {t('view_exam.sample_course_3_desc')}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                                                {t('view_exam.course_duration_3')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ViewExamPage;