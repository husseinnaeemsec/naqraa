import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Bell, BookOpen, Calendar, Clock, User, X } from "lucide-react";
import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";

interface Notification {
  id: string;
  type: 'course' | 'exam' | 'announcement' | 'community';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Mock notifications data - this would come from the backend
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'course',
    title: 'درس جديد متاح',
    message: 'تم إضافة درس جديد في دورة "البرمجة المتقدمة"',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    actionUrl: '/courses/1/lessons/5'
  },
  {
    id: '2',
    type: 'exam',
    title: 'تذكير بالامتحان',
    message: 'امتحان "أساسيات الرياضيات" غداً الساعة 2:00 م',
    timestamp: '2024-01-14T14:00:00Z',
    read: false,
    actionUrl: '/exams/3'
  },
  {
    id: '3',
    type: 'announcement',
    title: 'إعلان مهم',
    message: 'تحديث في سياسة المنصة',
    timestamp: '2024-01-13T09:15:00Z',
    read: true,
    actionUrl: '/announcements/15'
  },
  {
    id: '4',
    type: 'community',
    title: 'تفاعل جديد',
    message: 'أحمد محمد علق على منشورك في المجتمع',
    timestamp: '2024-01-12T16:45:00Z',
    read: true,
    actionUrl: '/community/posts/42'
  }
];

export default function NotificationWidget() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'course':
        return <BookOpen className="size-4 text-emerald-600" />;
      case 'exam':
        return <Calendar className="size-4 text-red-600" />;
      case 'announcement':
        return <Bell className="size-4 text-blue-600" />;
      case 'community':
        return <User className="size-4 text-purple-600" />;
      default:
        return <Bell className="size-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'course':
        return 'bg-emerald-50 dark:bg-emerald-900/20 border-l-emerald-500';
      case 'exam':
        return 'bg-red-50 dark:bg-red-900/20 border-l-red-500';
      case 'announcement':
        return 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500';
      case 'community':
        return 'bg-purple-50 dark:bg-purple-900/20 border-l-purple-500';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-l-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('notification_widget.time_just_now');
    if (diffInHours < 24) return t('notification_widget.time_hours_ago', { count: diffInHours });
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return t('notification_widget.time_days_ago', { count: diffInDays });
    
    return notificationTime.toLocaleDateString('ar-SA');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Card variant="dashboard" className="overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="size-5 text-emerald-600" />
            <h4 className="font-bold text-gray-900 dark:text-emerald-50">{t('notification_widget.title')}</h4>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-emerald-600 hover:text-emerald-700"
          >
            {showAll ? t('notification_widget.show_less') : t('notification_widget.show_more')}
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {displayedNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-emerald-400">
            <Bell className="size-8 mx-auto mb-2 opacity-50" />
            <p>{t('notification_widget.no_notifications')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-emerald-800">
            {displayedNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                className={`p-4 border-l-4 ${getTypeColor(notification.type)} ${
                  !notification.read ? 'bg-white dark:bg-emerald-950' : 'bg-gray-50 dark:bg-emerald-900/30'
                } hover:bg-gray-50 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer group`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className={`text-sm font-semibold ${
                        !notification.read 
                          ? 'text-gray-900 dark:text-emerald-50' 
                          : 'text-gray-700 dark:text-emerald-200'
                      }`}>
                        {notification.title}
                      </h5>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                        >
                          <X className="size-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    <p className={`text-xs mt-1 ${
                      !notification.read 
                        ? 'text-gray-600 dark:text-emerald-300' 
                        : 'text-gray-500 dark:text-emerald-400'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="size-3 text-gray-400" />
                      <span className="text-xs text-gray-400 dark:text-emerald-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {notifications.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-emerald-900/20 border-t border-gray-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              className="text-emerald-600 hover:text-emerald-700"
            >
              {t('notification_widget.mark_all_read')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications([])}
              className="text-red-600 hover:text-red-700"
            >
              {t('notification_widget.clear_all')}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}