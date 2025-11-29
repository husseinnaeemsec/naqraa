import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Star, TrendingUp, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../store/store';



export default function StudentPointsWidget() {
  const { t } = useTranslation();
  const {user} = useAppSelector(state=>state.auth)




  return (
    <Card className="w-full bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 shadow-sm">
      <CardHeader className="pt-4">
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-emerald-50 flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Star className="size-5 text-emerald-500 fill-emerald-500" />
          </motion.div>
          {t('student_points.title')}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Total Points */}
        <div className="text-center space-y-2">
          <motion.div
            className="text-3xl font-bold text-emerald-600 dark:text-emerald-400"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {user?.reputation?.total?.toLocaleString() || '0'}
          </motion.div>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">{t('student_points.total_points')}</p>
        </div>

        {/* Recent Earnings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-lg text-center border border-emerald-100 dark:border-emerald-800/50">
            <div className="flex items-center justify-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 mb-1">
              <TrendingUp className="size-3" />
              {t('student_points.this_week')}
            </div>
            <div className="font-semibold text-emerald-800 dark:text-emerald-200">
              +{user?.reputation.this_week || 0}
            </div>
          </div>
          
          <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-lg text-center border border-emerald-100 dark:border-emerald-800/50">
            <div className="flex items-center justify-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 mb-1">
              <TrendingUp className="size-3" />
              {t('student_points.this_month')}
            </div>
            <div className="font-semibold text-emerald-800 dark:text-emerald-200">
              +{user?.reputation.this_month || 0}
            </div>
          </div>
        </div>

        {/* Contribution Breakdown */}
        {user?.reputation && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{t('student_points.sources')}:</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>{t('student_points.contribution')}</span>
                <span>{user.reputation.contribution}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>{t('student_points.interaction')}</span>
                <span>{user.reputation.interaction}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>{t('student_points.achievement')}</span>
                <span>{user.reputation.achievement}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Gift className="size-4" />
            {t('student_points.redeem_points')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}