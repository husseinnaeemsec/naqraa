import { Link } from "react-router-dom";
import { CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./ui/CustomCard";
import { useState, useEffect } from "react";
import type { Task } from "../../types";
import api from "../api/client";
import { endpoints } from "../api/routes";
import { getNewTaskInitialDataQuery } from "../utils/functions";
import { useAppDispatch } from "../store/store";
import { addToast } from "../store/uiSlice";
import Spinner from "./Spinner";

export default function TodaysTasksWidget() {
    const { t } = useTranslation();
    const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();


    
    useEffect(() => {
        async function fetchTodaysTasks() {
            try {
                const response = await api.get(endpoints.productivity.tasks.today);
                setTodaysTasks(response.data);
            } catch (error) {
                console.error("Failed to fetch today's tasks:", error);

            } finally {
                setLoading(false);
            }
        }
        fetchTodaysTasks();
    }, []);

    const getPendingCount = () => todaysTasks.filter(task => !task.completed).length;

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'urgent':
                return 'text-red-600 dark:text-red-400';
            case 'high':
                return 'text-orange-600 dark:text-orange-400';
            case 'medium':
                return 'text-blue-600 dark:text-blue-400';
            default:
                return 'text-slate-600 dark:text-slate-400';
        }
    };

    const formatDueTime = (dueDate: string) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffMs = due.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 0) return t('task_widget.overdue');
        if (diffHours < 24) return t('dashboard_index.due_in_hours', { hours: diffHours });
        return due.toLocaleDateString();
    };

    const handleToggleTask = async (taskId: number) => {
        // Store previous state for rollback
        const previousTasks = [...todaysTasks];
        
        // Optimistically update UI
        setTodaysTasks(tasks => 
            tasks.map(task => 
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
        
        try {
            await api.patch(endpoints.productivity.tasks.toggle(taskId));
            dispatch(addToast({ type: 'success', message: t('dashboard_index.task_toggled') }));

        } catch (error:any) {
            console.error('Failed to toggle task:', error);
            let error_message = t('dashboard_index.task_toggle_failed');
            if(error?.status === 429){
                error_message = t('dashboard_index.too_many_requests');
            }
            console.log(error)
            // Revert on error
            dispatch(addToast({ type: 'error', message: error_message }));
            setTodaysTasks(previousTasks);
        }
    };

    return (
        <Card className="lg:col-span-5 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <CheckCircle2 className="size-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{t('dashboard_index.todays_tasks')}</h3>
                        <p className="text-xs text-slate-500">
                            {loading ? '...' : t('dashboard_index.pending_tasks', { count: getPendingCount() })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link 
                        to={getNewTaskInitialDataQuery()} 
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Plus className="size-4" />
                        {t('todo_page.new_task')}
                    </Link>
                    <Link to="/dashboard/todo" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        {t('dashboard_index.view_all')}
                    </Link>
                </div>
            </div>
            
            <div className="space-y-3">
                {loading ? (
                    // Loading skeleton
                    <Spinner className="border-emerald-500" />
                ) : todaysTasks.length === 0 ? (
                    // Empty state
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3">
                            <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {t('task_widget.no_tasks_today')}
                        </p>
                    </div>
                ) : (
                    // Tasks list
                    todaysTasks.slice(0, 3).map((task) => (
                        <div 
                            key={task.id} 
                            className={`p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group ${
                                task.completed ? 'opacity-60' : ''
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={task.completed}
                                    onChange={() => handleToggleTask(task.id)}
                                    className="mt-1 size-4 text-emerald-600 rounded cursor-pointer" 
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate ${
                                        task.completed 
                                            ? 'line-through text-slate-500 dark:text-slate-400' 
                                            : 'text-slate-900 dark:text-white'
                                    }`}>
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                        {task.collection && (
                                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {/* Collection name would come from collections data */}
                                                Collection #{task.collection}
                                            </span>
                                        )}
                                        {task.due_date && (
                                            <span className={`text-xs flex items-center gap-1 ${
                                                new Date(task.due_date) < new Date() && !task.completed
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-slate-600 dark:text-slate-400'
                                            }`}>
                                                <Clock className="size-3" />
                                                {formatDueTime(task.due_date)}
                                            </span>
                                        )}
                                        {task.priority !== 'low' && (
                                            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority === 'urgent' && <AlertCircle className="size-3 inline mr-1" />}
                                                {task.priority.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {!loading && todaysTasks.length > 3 && (
                <div className="mt-4 text-center">
                    <Link 
                        to="/dashboard/todo" 
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        {t('dashboard_index.view_all')} ({todaysTasks.length})
                    </Link>
                </div>
            )}
        </Card>
    );
}
