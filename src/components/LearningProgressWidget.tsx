import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Calendar, Target, Zap, Trophy, Clock, BookOpen } from "lucide-react";
import Card from "./ui/CustomCard";
import Button from "./ui/CustomButton";
import { useAppSelector } from "../store/store";
import { Link } from "react-router-dom";

interface LearningGoal {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
  color: string;
}



export default function LearningProgressWidget() {
  const { t } = useTranslation();
  const {user} = useAppSelector(state=>state.auth);
  // Mock data - these would come from the backend
  const currentStreak: number | undefined | null = user?.streak_days;
  const longestStreak: number = 15;
  const todayStudyTime: number = user?.today_study_time || 0;
  const completedLessonsToday: number = user?.completed_courses || 0;




  // Mock data - this would come from the backend
  const mockGoals: LearningGoal[] = [
    {
      id: '1',
      title: t('learning_progress.weekly_study_hours'),
      progress: 12,
      target: 20,
      unit: t('learning_progress.hours'),
      color: 'emerald'
    },
    {
      id: '2',
      title: t('learning_progress.completed_lessons_month'),
      progress: 8,
      target: 15,
      unit: t('learning_progress.lessons'),
      color: 'blue'
    }
  ];

  const streakMotivationMessage = () => {
    if (currentStreak === 0) return t('learning_progress.start_journey');
    if (currentStreak && currentStreak < 7) return t('learning_progress.keep_going');
    if (currentStreak && currentStreak < 30) return t('learning_progress.excellent_progress');
    return t('learning_progress.amazing_learner');
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 75) return "text-emerald-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-500";
  };

              const getProgressBarColor = () => {
    // Always use emerald for consistency
    return 'bg-emerald-500';
  };  return (
    <Card variant="dashboard" className="overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-3">
          <Target className="size-5 text-emerald-600" />
          <h4 className="font-bold text-gray-900 dark:text-emerald-50">{t('learning_progress.title')}</h4>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Learning Streak */}
        <motion.div 
          className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg border border-emerald-200 dark:border-emerald-800"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
              <Zap className="size-6 text-emerald-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{currentStreak}</div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400">
              {t('learning_progress.consecutive_learning_days')}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">
              {streakMotivationMessage()}
            </div>
            
            <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-600 dark:text-emerald-400">{t('learning_progress.longest_streak')}:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">{t('learning_progress.days_count', { count: longestStreak })}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Progress */}
        <div className="space-y-3">
          <h5 className="font-semibold text-gray-900 dark:text-emerald-50 flex items-center gap-2">
            <Calendar className="size-4 text-emerald-600" />
            {t('learning_progress.today_achievement')}
          </h5>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="size-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{todayStudyTime}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">{t('learning_progress.study_hours')}</div>
            </motion.div>
            
            <motion.div 
              className="p-3 bg-emerald-100 dark:bg-emerald-800/20 rounded-lg text-center"
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="size-4 text-emerald-700 mx-auto mb-1" />
              <div className="text-lg font-bold text-emerald-800 dark:text-emerald-200">{completedLessonsToday}</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300">{t('learning_progress.completed_lessons')}</div>
            </motion.div>
          </div>
        </div>

        {/* Learning Goals */}
        <div className="space-y-3">
          <h5 className="font-semibold text-gray-900 dark:text-emerald-50 flex items-center gap-2">
            <Trophy className="size-4 text-emerald-600" />
            {t('learning_progress.learning_goals')}
          </h5>
          
          <div className="space-y-3">
            {mockGoals.map((goal, index) => {
              const percentage = Math.min((goal.progress / goal.target) * 100, 100);
              
              return (
                <motion.div
                  key={goal.id}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-emerald-200">{goal.title}</span>
                    <span className={`font-semibold ${getProgressColor(goal.progress, goal.target)}`}>
                      {goal.progress}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-emerald-900 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${getProgressBarColor()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-emerald-400">
                    {t('learning_progress.completed_percentage', { percentage: percentage.toFixed(0) })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Motivation Action */}
        <motion.div 
          className="pt-4 border-t border-gray-200 dark:border-emerald-800"
          whileHover={{ scale: 1.02 }}
        >
          <Button 
            variant="primary" 
            size="sm" 
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            icon={<Zap className="size-4" />}
          >
            <Link to={'/dashboard/courses'}>
            {t('learning_progress.start_study_session')}
            </Link>
          </Button>
        </motion.div>
      </div>
    </Card>
  );
}