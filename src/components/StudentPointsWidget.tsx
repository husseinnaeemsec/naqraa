import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Star, Trophy, TrendingUp, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/client';

interface StudentPoints {
  total_points: number;
  earned_this_week: number;
  earned_this_month: number;
  rank?: number;
  contribution_breakdown: {
    exam_contributions: number;
    article_contributions: number;
    resource_contributions: number;
  };
}

export default function StudentPointsWidget() {
  const [points, setPoints] = useState<StudentPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentPoints();
  }, []);

  const fetchStudentPoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<StudentPoints>('/api/users/points/');
      setPoints(response.data);
    } catch (err: any) {
      console.error('Error fetching student points:', err);
      // Set fallback data if API fails but not due to auth issues
      if (err.response?.status !== 401) {
        setError('فشل في تحميل النقاط');
        setPoints({
          total_points: 0,
          earned_this_week: 0,
          earned_this_month: 0,
          contribution_breakdown: {
            exam_contributions: 0,
            article_contributions: 0,
            resource_contributions: 0
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-emerald-200 dark:bg-emerald-800 rounded w-1/2"></div>
            <div className="h-8 bg-emerald-200 dark:bg-emerald-800 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
              <div className="h-3 bg-emerald-200 dark:bg-emerald-800 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !points) {
    return (
      <Card className="w-full bg-white dark:bg-emerald-950 border border-red-200 dark:border-red-800 shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 dark:text-red-400 space-y-2">
            <Trophy className="size-8 mx-auto opacity-50" />
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchStudentPoints}
              className="text-xs text-emerald-600 hover:text-emerald-700 underline"
            >
              إعادة المحاولة
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-emerald-50 flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Star className="size-5 text-emerald-500 fill-emerald-500" />
          </motion.div>
          نقاط المساهمة
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Total Points */}
        <div className="text-center space-y-2">
          <motion.div
            className="text-3xl font-bold text-emerald-600 dark:text-emerald-400"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {points?.total_points?.toLocaleString() || '0'}
          </motion.div>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">إجمالي النقاط</p>
        </div>

        {/* Recent Earnings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-lg text-center border border-emerald-100 dark:border-emerald-800/50">
            <div className="flex items-center justify-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 mb-1">
              <TrendingUp className="size-3" />
              هذا الأسبوع
            </div>
            <div className="font-semibold text-emerald-800 dark:text-emerald-200">
              +{points?.earned_this_week || 0}
            </div>
          </div>
          
          <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-lg text-center border border-emerald-100 dark:border-emerald-800/50">
            <div className="flex items-center justify-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 mb-1">
              <TrendingUp className="size-3" />
              هذا الشهر
            </div>
            <div className="font-semibold text-emerald-800 dark:text-emerald-200">
              +{points?.earned_this_month || 0}
            </div>
          </div>
        </div>

        {/* Contribution Breakdown */}
        {points?.contribution_breakdown && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">مصادر النقاط:</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>مساهمات الامتحانات</span>
                <span>{points.contribution_breakdown.exam_contributions}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>مساهمات المقالات</span>
                <span>{points.contribution_breakdown.article_contributions}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>مساهمات الموارد</span>
                <span>{points.contribution_breakdown.resource_contributions}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Gift className="size-4" />
            استبدال النقاط
          </button>
        </div>
      </CardContent>
    </Card>
  );
}