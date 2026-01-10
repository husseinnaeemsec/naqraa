import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    BookOpen, 
    MapPin, 
    FileText, 
    AlertCircle,
    CheckCircle,
    Users,
    Bell,
    Download,
    Share2
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import type { Exam } from "../../../types";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { formatTime, timeBefore } from "../../utils/functions";
import Card from "../../components/ui/CustomCard";
import Button from "../../components/ui/CustomButton";
import useApiErrorHandler from "../../hooks/use-api-error-handler";
import <Spinner></Spinner> from "../../components/Spinner";

export default function ExamDetailsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    useApiErrorHandler();
    const { id } = useParams<{ id: string }>();
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExamDetails = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const response = await api.get(endpoints.student.exam(id));
                setExam(response.data);
            } catch (error) {
                console.error("Failed to fetch exam details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExamDetails();
    }, [id]);

    const getDayName = (date: string) => {
        const examDate = new Date(date);
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayKey = dayNames[examDate.getDay()];
        return t(`days.${dayKey}`);
    };

    const getExamStatus = (date: string, time: string) => {
        const examDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        
        if (examDateTime > now) {
            return {
                status: 'upcoming',
                color: 'blue',
                icon: Clock,
                text: t('exam_details.status_upcoming')
            };
        } else if (examDateTime.toDateString() === now.toDateString()) {
            return {
                status: 'today',
                color: 'red',
                icon: AlertCircle,
                text: t('exam_details.status_today')
            };
        } else {
            return {
                status: 'past',
                color: 'gray',
                icon: CheckCircle,
                text: t('exam_details.status_completed')
            };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getTimeUntilExam = (date: string, time: string) => {
        const examDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        const diff = examDateTime.getTime() - now.getTime();
        
        if (diff < 0) return null;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return { days, hours, minutes };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 flex items-center justify-center">
                <Card variant="dashboard" className="p-8 text-center">
                    <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-emerald-50 mb-2">
                        {t('exam_details.not_found')}
                    </h2>
                    <p className="text-gray-600 dark:text-emerald-300 mb-6">
                        {t('exam_details.not_found_message')}
                    </p>
                    <Button variant="primary" onClick={() => navigate('/student/exams')}>
                        {t('exam_details.back_to_exams')}
                    </Button>
                </Card>
            </div>
        );
    }

    const status = getExamStatus(exam.date, exam.time);
    const timeUntil = getTimeUntilExam(exam.date, exam.time);
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
                        icon={<ArrowLeft className="size-4" />}
                        onClick={() => navigate('/student/exams')}
                    >
                        {t('exam_details.back')}
                    </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-50">
                                {exam.title}
                            </h1>
                            <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                                status.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                                status.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300'
                            }`}>
                                <StatusIcon className="size-4" />
                                {status.text}
                            </span>
                        </div>
                        {exam.description && (
                            <p className="text-gray-600 dark:text-emerald-200 text-lg">
                                {exam.description}
                            </p>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" icon={<Bell className="size-4" />}>
                            {t('exam_details.remind_me')}
                        </Button>
                        <Button variant="outline" size="sm" icon={<Share2 className="size-4" />}>
                            {t('exam_details.share')}
                        </Button>
                        <Button variant="primary" size="sm" icon={<Download className="size-4" />}>
                            {t('exam_details.export')}
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="px-6 pb-6 space-y-6">
                {/* Countdown Timer - Only show for upcoming exams */}
                {timeUntil && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card variant="dashboard" className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-4">{t('exam_details.time_remaining')}</h3>
                                <div className="flex items-center justify-center gap-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold">{timeUntil.days}</div>
                                        <div className="text-sm opacity-90">{t('exam_details.days')}</div>
                                    </div>
                                    <div className="text-3xl font-bold">:</div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold">{timeUntil.hours}</div>
                                        <div className="text-sm opacity-90">{t('exam_details.hours')}</div>
                                    </div>
                                    <div className="text-3xl font-bold">:</div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold">{timeUntil.minutes}</div>
                                        <div className="text-sm opacity-90">{t('exam_details.minutes')}</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Exam Information Grid */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card variant="dashboard" className="p-5 bg-white border border-slate-300">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                <Calendar className="size-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-500 dark:text-emerald-400 mb-1">
                                    {t('exam_details.date')}
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-emerald-50">
                                    {getDayName(exam.date)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-emerald-300">
                                    {formatDate(exam.date)}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card variant="dashboard" className="p-5 bg-white border border-slate-300">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                <Clock className="size-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-500 dark:text-emerald-400 mb-1">
                                    {t('exam_details.time')}
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-emerald-50">
                                    {formatTime(exam.time)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-emerald-300">
                                    {timeBefore(exam.date)}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card variant="dashboard" className="p-5 bg-white border border-slate-300">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                                <BookOpen className="size-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-500 dark:text-emerald-400 mb-1">
                                    {t('exam_details.subject')}
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-emerald-50 truncate">
                                    {exam.subject_name}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card variant="dashboard" className="p-5 bg-white border border-slate-300">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                                <Users className="size-5 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-500 dark:text-emerald-400 mb-1">
                                    {t('exam_details.classroom')}
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-emerald-50 truncate">
                                    {exam.class_room_name}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Additional Information */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {/* Exam Details */}
                    <Card variant="dashboard" className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="size-6 text-emerald-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                                {t('exam_details.details_title')}
                            </h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-emerald-400 mb-1">
                                    {t('exam_details.exam_title')}
                                </h3>
                                <p className="text-gray-900 dark:text-emerald-50">
                                    {exam.title}
                                </p>
                            </div>
                            
                            {exam.description && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-emerald-400 mb-1">
                                        {t('exam_details.description')}
                                    </h3>
                                    <p className="text-gray-900 dark:text-emerald-50">
                                        {exam.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Preparation Tips */}
                    <Card variant="dashboard" className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="size-6 text-emerald-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                                {t('exam_details.preparation_tips')}
                            </h2>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <CheckCircle className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-700 dark:text-emerald-200">
                                    {t('exam_details.tip_1')}
                                </p>
                            </div>
                            
                            <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <CheckCircle className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-700 dark:text-emerald-200">
                                    {t('exam_details.tip_2')}
                                </p>
                            </div>
                            
                            <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <CheckCircle className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-700 dark:text-emerald-200">
                                    {t('exam_details.tip_3')}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Card variant="dashboard" className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50 mb-4">
                            {t('exam_details.quick_actions')}
                        </h2>
                        
                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary" icon={<Download className="size-4" />}>
                                {t('exam_details.download_materials')}
                            </Button>
                            <Button variant="outline" icon={<Calendar className="size-4" />}>
                                {t('exam_details.add_to_calendar')}
                            </Button>
                            <Button variant="outline" icon={<Bell className="size-4" />}>
                                {t('exam_details.set_reminder')}
                            </Button>
                            <Button variant="outline" icon={<Share2 className="size-4" />}>
                                {t('exam_details.share_with_friends')}
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
