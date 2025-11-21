import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Eye, Trash2, Settings, X, User, BookOpen, Calendar, MessageSquare } from "lucide-react";
import { useTranslation } from 'react-i18next';
import type { Notification } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../store/store";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { setNotifications } from "../../store/authSlice";
import Card from "../../components/ui/CustomCard";
import Button from "../../components/ui/CustomButton";
import useApiErrorHandler from "../../hooks/use-api-error-handler";

export function NotificationItem({ notification, index }: { notification: Notification; index: number }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const { notifications } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    
    const handleOpen = async () => {
        try {
            const res = await api.post(endpoints.notifications.update(notification.id));
            dispatch(setNotifications([...notifications.filter(n => n.id !== notification.id), res.data]));
        } finally {
            setOpen(true);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'course':
                return <BookOpen className="size-5 text-emerald-600" />;
            case 'exam':
                return <Calendar className="size-5 text-red-600" />;
            case 'message':
                return <MessageSquare className="size-5 text-blue-600" />;
            default:
                return <Bell className="size-5 text-gray-600" />;
        }
    };

    const getTypeStyles = (type: string) => {
        switch (type.toLowerCase()) {
            case 'course':
                return 'bg-emerald-50 dark:bg-emerald-900/20 border-l-emerald-500';
            case 'exam':
                return 'bg-red-50 dark:bg-red-900/20 border-l-red-500';
            case 'message':
                return 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500';
            default:
                return 'bg-gray-50 dark:bg-gray-900/20 border-l-gray-500';
        }
    };

    const formatTime = (timestamp: string) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return t('notifications_page.time_just_now');
        if (diffInHours < 24) return t('notifications_page.time_hours_ago', { hours: diffInHours });
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return t('notifications_page.time_days_ago', { days: diffInDays });
        
        return notificationTime.toLocaleDateString('ar-SA');
    };

    return (
        <>
            <motion.div
                className={`border-l-4 ${getTypeStyles(notification.type)} ${
                    !notification.read ? 'bg-white dark:bg-emerald-950' : 'bg-gray-50 dark:bg-emerald-900/30'
                } hover:bg-gray-50 dark:hover:bg-emerald-900/40 transition-all cursor-pointer group`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={handleOpen}
                whileHover={{ x: 5 }}
            >
                <div className="p-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            {notification.profile_picture ? (
                                <img
                                    src={notification.profile_picture}
                                    alt={notification.sneder}
                                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                    {getNotificationIcon(notification.type)}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className={`font-semibold text-lg ${
                                    !notification.read 
                                        ? 'text-gray-900 dark:text-emerald-50' 
                                        : 'text-gray-700 dark:text-emerald-200'
                                }`}>
                                    {notification.title}
                                    {!notification.read && (
                                        <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                                    )}
                                </h3>
                                
                                <div className="text-sm text-gray-500 dark:text-emerald-400 flex items-center gap-1">
                                    <Bell className="size-3" />
                                    {formatTime(notification.created_at)}
                                </div>
                            </div>
                            
                            {notification.content && (
                                <p className={`mt-1 text-sm ${
                                    !notification.read 
                                        ? 'text-gray-600 dark:text-emerald-300' 
                                        : 'text-gray-500 dark:text-emerald-400'
                                } line-clamp-2`}>
                                    {notification.content}
                                </p>
                            )}
                            
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    notification.type.toLowerCase() === 'course' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                                    notification.type.toLowerCase() === 'exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                                    notification.type.toLowerCase() === 'message' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300'
                                }`}>
                                    {notification.type}
                                </span>
                                {notification.sneder && (
                                    <span className="text-xs text-gray-500 dark:text-emerald-400">
                                        {t('notifications_page.from')} {notification.sneder}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            className="bg-white dark:bg-emerald-950 rounded-xl shadow-2xl max-w-md w-full p-6 border dark:border-emerald-800"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                                    {notification.title}
                                </h2>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-emerald-900 rounded-full transition-colors"
                                >
                                    <X className="size-5 text-gray-500" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <p className="text-gray-700 dark:text-emerald-200 leading-relaxed">
                                    {notification.content}
                                </p>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-emerald-400">
                                    <Bell className="size-4" />
                                    <span>{formatTime(notification.created_at)}</span>
                                    {notification.sneder && (
                                        <>
                                            <span>•</span>
                                            <span>{t('notifications_page.from')} {notification.sneder}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setOpen(false)}
                                >
                                    {t('notifications_page.close')}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function NotificationsPage() {
    const { t } = useTranslation();
    useApiErrorHandler();
    const [activeTab, setActiveTab] = useState("all");
    const { notifications } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    
    const tabs = [
        { title: t('notifications_page.tab_all'), id: "all", icon: Bell },
        { title: t('notifications_page.tab_unread'), id: "unread", icon: Eye },
        { title: t('notifications_page.tab_read'), id: "read", icon: Check },
    ];

    const unread_count = notifications.filter(n => n.read === false).length;
    
    // Filter notifications based on active tab
    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "all") return true;
        if (activeTab === "unread") return !n.read;
        if (activeTab === "read") return n.read;
        return true;
    });

    const markAllAsRead = async () => {
        // This would call an API to mark all notifications as read
        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
        dispatch(setNotifications(updatedNotifications));
    };

    const clearAllNotifications = async () => {
        // This would call an API to clear all notifications
        dispatch(setNotifications([]));
    };

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
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300 flex items-center gap-3">
                            <Bell className="size-8 text-emerald-600" />
                            {t('notifications_page.title')}
                            {unread_count > 0 && (
                                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                                    {unread_count}
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-600 dark:text-emerald-200 mt-1">
                            {t('notifications_page.subtitle')}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {notifications.length > 0 && (
                            <>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={markAllAsRead}
                                    icon={<Check className="size-4" />}
                                >
                                    {t('notifications_page.mark_all_read')}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={clearAllNotifications}
                                    icon={<Trash2 className="size-4" />}
                                >
                                    {t('notifications_page.clear_all')}
                                </Button>
                            </>
                        )}
                        <Button variant="primary" size="sm" icon={<Settings className="size-4" />}>
                            {t('notifications_page.settings')}
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="px-6 pb-6 space-y-6">
                {/* Statistics */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                <Bell className="size-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{notifications.length}</div>
                                <div className="text-sm text-emerald-600 dark:text-emerald-400">{t('notifications_page.total_notifications')}</div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-200 dark:bg-emerald-800/50 rounded-full">
                                <Eye className="size-5 text-emerald-700" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{unread_count}</div>
                                <div className="text-sm text-emerald-700 dark:text-emerald-300">{t('notifications_page.unread')}</div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-300 dark:bg-emerald-700/50 rounded-full">
                                <Check className="size-5 text-emerald-800" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{notifications.length - unread_count}</div>
                                <div className="text-sm text-emerald-800 dark:text-emerald-200">{t('notifications_page.read')}</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Tabs */}
                <motion.div 
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeTab === tab.id
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                                        : "bg-white dark:bg-emerald-950 text-gray-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 border border-gray-200 dark:border-emerald-800"
                                }`}
                            >
                                <Icon className="size-4" />
                                {tab.title}
                                {tab.id === 'unread' && unread_count > 0 && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                        activeTab === tab.id ? 'bg-white/20' : 'bg-red-500 text-white'
                                    }`}>
                                        {unread_count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Notifications List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card variant="dashboard" className="overflow-hidden">
                        {filteredNotifications.length > 0 ? (
                            <div className="divide-y divide-gray-200 dark:divide-emerald-800">
                                {filteredNotifications.map((notification, index) => (
                                    <NotificationItem 
                                        key={notification.id} 
                                        notification={notification} 
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Bell className="size-16 text-gray-300 dark:text-emerald-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-emerald-200 mb-2">
                                        {activeTab === 'unread' ? t('notifications_page.no_unread_notifications') :
                                         activeTab === 'read' ? t('notifications_page.no_read_notifications') :
                                         t('notifications_page.no_notifications')}
                                    </h3>
                                    <p className="text-gray-500 dark:text-emerald-400">
                                        {t('notifications_page.empty_message')}
                                    </p>
                                </motion.div>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
