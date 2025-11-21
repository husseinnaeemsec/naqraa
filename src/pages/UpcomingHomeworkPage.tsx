
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../components/ui/CustomCard";
import Button from "../components/ui/CustomButton";
import { ListTodo, Clock, Calendar, BookOpen, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/client";
import { endpoints } from "../api/routes";
import { timeBefore } from "../utils/functions";
import type { HomeWork, HomeWorkResponse } from "../../types";


export default function UpcomingHomeworkPage() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<HomeWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get<HomeWorkResponse>(endpoints.organization.upcoming_homework);
        setTasks(res.data.results);
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getTaskUrgency = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffInDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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

  // Stats for header cards
  const urgentCount = tasks.filter(t => getTaskUrgency(t.date).level === 'urgent').length;

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300">
              {t('upcoming_homework.title')}
            </h1>
            <p className="text-gray-600 dark:text-emerald-200 mt-1">
              {t('upcoming_homework.subtitle')}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="px-6 pb-6 space-y-6">
        {/* Statistics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                <ListTodo className="size-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{tasks.length}</div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400">{t('upcoming_homework.total_homework')}</div>
              </div>
            </div>
          </Card>
          <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{urgentCount}</div>
                <div className="text-sm text-red-600 dark:text-red-400">{t('upcoming_homework.urgent_homework')}</div>
              </div>
            </div>
          </Card>
          <Card variant="dashboard" className="p-4 bg-white border border-slate-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <BookOpen className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{tasks.length - urgentCount}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">{t('upcoming_homework.other_homework')}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Homework List Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="dashboard" className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-emerald-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">
                {t('upcoming_homework.list_title')} ({tasks.length})
              </h2>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="p-6 space-y-4 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-emerald-800 rounded w-1/2"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-emerald-800 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-emerald-800 rounded w-3/4"></div>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListTodo className="size-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-emerald-400 font-medium">{t('upcoming_homework.no_upcoming_homework')}</p>
                    <p className="text-gray-400 dark:text-emerald-500 text-sm mt-1">{t('upcoming_homework.all_caught_up')}</p>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {tasks.map((task, index) => {
                    const urgency = getTaskUrgency(task.date);
                    return (
                      <Link key={task.id || index} to={`/dashboard/homework/${task.id}`}>
                        <motion.div
                          className={`p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${getUrgencyStyles(urgency.color)}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="size-4 flex-shrink-0" />
                                <h4 className="font-bold text-lg truncate">{task.title || t('task_widget.untitled_task')}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  urgency.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                                  urgency.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                                  urgency.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                }`}>
                                  {urgency.text}
                                </span>
                              </div>
                              <p className="text-sm mb-3">
                                {task.subject_name} - {task.class_room_name}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock className="size-3" />
                                  <span className="font-medium">{timeBefore(task.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="size-3" />
                                  <span>{new Date(task.date).toLocaleDateString('ar-SA')}</span>
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
                      </Link>
                    );
                  })}
                </div>
              )}
              {tasks.length > 0 && !loading && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-emerald-800">
                  <Button variant="outline" size="sm" className="w-full">
                    <Link to="/dashboard/homework?upcoming=true">{t('upcoming_homework.view_all')}</Link>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
