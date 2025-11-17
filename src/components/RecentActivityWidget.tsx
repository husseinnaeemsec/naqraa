import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import api from '../api/client';
import { Card } from './ui/card';
import { Activity, Book, MessageSquare, FileText, CheckCircle, Clock } from 'lucide-react';
import useApiErrorHandler from '../hooks/use-api-error-handler';

interface UserActivity {
  id: number;
  type: 'lesson_watch' | 'exam_complete' | 'post_create' | 'assignment_submit' | 'course_enroll';
  description: string;
  timestamp: string;
  related_object?: {
    id: number;
    title: string;
    type: string;
  };
}

interface ActivityResponse {
  results: UserActivity[];
  count: number;
}

const activityIcons = {
  lesson_watch: Book,
  exam_complete: CheckCircle,
  post_create: MessageSquare,
  assignment_submit: FileText,
  course_enroll: Activity,
  default: Clock
};





export default function RecentActivityWidget() {
  const { t } = useTranslation();
  useApiErrorHandler();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return t('recent_activity.time_minutes_ago', { count: diffMinutes });
    } else if (diffHours < 24) {
      return t('recent_activity.time_hours_ago', { count: diffHours });
    } else if (diffDays < 7) {
      return t('recent_activity.time_days_ago', { count: diffDays });
    } else {
      return activityTime.toLocaleDateString('ar-SA');
    }
  };

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        // Note: This endpoint might need to be implemented in your backend
        const response = await api.get<ActivityResponse>('/users/activity/?limit=5');
        setActivities(response.data.results);
      } catch (err: any) {
        console.error('Error fetching recent activity:', err);
        
        // Fallback to mock data if endpoint doesn't exist yet
        if (err.response?.status === 404) {
          setActivities([
            {
              id: 1,
              type: 'lesson_watch',
              description: t('recent_activity.mock_lesson_watch'),
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 2,
              type: 'exam_complete',
              description: t('recent_activity.mock_exam_complete'),
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 3,
              type: 'post_create',
              description: t('recent_activity.mock_post_create'),
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 4,
              type: 'course_enroll',
              description: t('recent_activity.mock_course_enroll'),
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]);
        } else {
          setError(t('recent_activity.error_loading'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  if (loading) {
    return (
      <Card className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">{t('recent_activity.title')}</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 dark:bg-emerald-800 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-emerald-800 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-emerald-800 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error && activities.length === 0) {
    return (
      <Card className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">{t('recent_activity.title')}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </Card>
    );
  }

  if (!activities.length) {
    return (
      <Card className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">{t('recent_activity.title')}</h2>
        </div>
        <div className="text-center py-8">
          <Activity className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('recent_activity.no_activity')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="size-6 text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">{t('recent_activity.title')}</h2>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100">
        {activities.map((activity, idx) => {
          const IconComponent = activityIcons[activity.type] || activityIcons.default;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3 p-3 bg-gray-50/50 dark:bg-emerald-900/30 rounded-lg hover:bg-gray-100/50 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
                <IconComponent className="size-4 text-emerald-600 dark:text-emerald-300" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-emerald-50 font-medium leading-relaxed">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
