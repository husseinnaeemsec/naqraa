import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Brain, Clock, Trophy, ArrowRight, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/client';

interface RecommendedQuiz {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number; // minutes
  questions_count: number;
  subject: string;
  completion_rate: number;
  recommended_reason: string;
}

interface RecommendedQuizzesResponse {
  results: RecommendedQuiz[];
}

export default function RecommendedQuizzesWidget() {
  const [quizzes, setQuizzes] = useState<RecommendedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendedQuizzes();
  }, []);

  const fetchRecommendedQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<RecommendedQuizzesResponse>('/api/quizzes/recommended/?limit=3');
      setQuizzes(response.data.results);
    } catch (err: any) {
      console.error('Error fetching recommended quizzes:', err);
      if (err.response?.status !== 401) {
        setError('فشل في تحميل الاختبارات المقترحة');
        // Set fallback data
        setQuizzes([
          {
            id: 1,
            title: 'أساسيات الجبر',
            description: 'اختبار شامل في أساسيات الجبر والمعادلات',
            difficulty: 'medium',
            estimated_time: 15,
            questions_count: 10,
            subject: 'الرياضيات',
            completion_rate: 85,
            recommended_reason: 'بناءً على مستواك الحالي'
          },
          {
            id: 2,
            title: 'قواعد اللغة العربية',
            description: 'اختبار في قواعد النحو والصرف',
            difficulty: 'easy',
            estimated_time: 12,
            questions_count: 8,
            subject: 'اللغة العربية',
            completion_rate: 92,
            recommended_reason: 'لتحسين أدائك'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30';
      case 'medium': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'سهل';
      case 'medium': return 'متوسط';
      case 'hard': return 'صعب';
      default: return 'متوسط';
    }
  };

  if (loading) {
    return (
      <Card className="w-full bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-emerald-200 dark:bg-emerald-800 rounded w-1/2"></div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-emerald-200 dark:bg-emerald-800 rounded w-3/4"></div>
                  <div className="h-3 bg-emerald-200 dark:bg-emerald-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && quizzes.length === 0) {
    return (
      <Card className="w-full bg-white dark:bg-emerald-950 border border-red-200 dark:border-red-800 shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 dark:text-red-400 space-y-2">
            <Brain className="size-8 mx-auto opacity-50" />
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchRecommendedQuizzes}
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
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Brain className="size-5 text-emerald-500" />
          </motion.div>
          الاختبارات المقترحة
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {quizzes.slice(0, 3).map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer border border-emerald-100 dark:border-emerald-800/50"
          >
            <Link to={`/dashboard/exams/${quiz.id}`} className="block">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-emerald-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-emerald-200/70 mt-1 line-clamp-2">
                    {quiz.description}
                  </p>
                </div>
                <ArrowRight className="size-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {getDifficultyText(quiz.difficulty)}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Clock className="size-3" />
                    <span>{quiz.estimated_time} د</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                  <Target className="size-3" />
                  <span>{quiz.questions_count} سؤال</span>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                {quiz.recommended_reason}
              </div>
            </Link>
          </motion.div>
        ))}
        
        {quizzes.length === 0 && !loading && (
          <div className="text-center py-6 text-gray-500 dark:text-emerald-400">
            <Brain className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">لا توجد اختبارات مقترحة حالياً</p>
          </div>
        )}
        
        {quizzes.length > 0 && (
          <div className="pt-2">
            <Link
              to="/dashboard/exams"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trophy className="size-4" />
              عرض جميع الاختبارات
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}