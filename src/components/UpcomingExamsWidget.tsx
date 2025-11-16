import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import type { Exam } from "../../types";
import { timeBefore } from "../utils/functions";
import api from "../api/client";
import { endpoints } from "../api/routes";
import Card from "./ui/Card";
import Button from "./ui/Button";
import useApiErrorHandler from "../hooks/use-api-error-handler";

export default function UpcomingExams() {
  const { t } = useTranslation();
  useApiErrorHandler();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get(endpoints.organization.upcoming_exams);
        setExams(res.data.results);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExams();
  }, []);

  const getExamUrgency = (examDate: string) => {
    const now = new Date();
    const exam = new Date(examDate);
    const diffInDays = Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 1) return { level: 'urgent', color: 'red', text: t('upcoming_exams.urgent') };
    if (diffInDays <= 3) return { level: 'soon', color: 'orange', text: t('upcoming_exams.soon') };
    if (diffInDays <= 7) return { level: 'upcoming', color: 'yellow', text: t('upcoming_exams.upcoming') };
    return { level: 'normal', color: 'blue', text: t('upcoming_exams.scheduled') };
  };

  const getUrgencyStyles = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
      case 'orange':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300';
      case 'yellow':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
    }
  };

  if (loading) {
    return (
      <Card variant="dashboard" className="animate-pulse">
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-emerald-800 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-emerald-800 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-emerald-800 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="dashboard" className="overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-emerald-50">{t('upcoming_exams.title')}</h3>
            {exams.length > 0 && (
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium dark:bg-emerald-900/30 dark:text-emerald-300">
                {t('upcoming_exams.exam_count', { count: exams.length })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="p-4">
        {exams.length === 0 ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Calendar className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-emerald-400 font-medium">{t('upcoming_exams.no_exams')}</p>
              <p className="text-gray-400 dark:text-emerald-500 text-sm mt-1">{t('upcoming_exams.no_exams_subtitle')}</p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {exams.map((exam, index) => {
              const urgency = getExamUrgency(exam.date);
              
              return (
                <motion.div
                  key={exam.id || index}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getUrgencyStyles(urgency.color)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="size-4 flex-shrink-0" />
                        <h4 className="font-bold text-lg truncate">{exam.subject_name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          urgency.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                          urgency.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                          urgency.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        }`}>
                          {urgency.text}
                        </span>
                      </div>
                      
                      {exam.description && (
                        <p className="text-sm mb-3 line-clamp-2">{exam.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span className="font-medium">{timeBefore(exam.date)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{new Date(exam.date).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {urgency.level === 'urgent' && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <AlertTriangle className="size-5 text-red-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* Footer Action */}
        {exams.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-emerald-800">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              icon={<ExternalLink className="size-4" />}
            >
              {t('upcoming_exams.view_all')}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
