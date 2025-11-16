import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, Clock, Filter, Search, Calendar, Target, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TodoBanner from './TodoBanner';
import TodoTabs from './TodoTabs';
import { type Task, type TaskCollection } from '../../../types';
import api from '../../api/client';
import { endpoints } from '../../api/routes';
import TaskItem from './TaskItem';
import TodoForm from './TodoForm';
import InProgressTasks from './InProgressTasks';
import CompletedTasks from './CompletedTasks';
import TasksTable from './TasksTable';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function TodoPage() {
    const { t } = useTranslation();

    const [tasks, setTasks] = useState<Task[]>([])
    const [collections, setCollections] = useState<TaskCollection[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

    useEffect(() => {
        api.get(endpoints.productivity.tasks.list).then(res => setTasks(res.data))
        api.get(endpoints.productivity.collections.list).then(res => setCollections(res.data))
    }, [])

    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    const urgentTasks = tasks.filter(task => !task.completed && task.priority === 'high');

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 pb-4"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <CheckSquare className="w-8 h-8 text-emerald-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-50">{t('todo_page.title')}</h1>
                            <p className="text-gray-600 dark:text-emerald-200/70">{t('todo_page.subtitle')}</p>
                        </div>
                    </div>
                    <Button 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus className="w-4 h-4" />
                        {t('todo_page.new_task')}
                    </Button>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-6 px-6 pb-6">
                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-4 sticky top-6">
                        <TodoTabs collections={collections} tasks={tasks} />
                    </Card>
                </motion.div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                        <Card className="p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                    <Target className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-emerald-50">{tasks.length}</p>
                                    <p className="text-sm text-gray-600 dark:text-emerald-200/70">{t('todo_page.total_tasks')}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-emerald-50">{pendingTasks.length}</p>
                                    <p className="text-sm text-gray-600 dark:text-emerald-200/70">{t('todo_page.in_progress')}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <CheckSquare className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-emerald-50">{completedTasks.length}</p>
                                    <p className="text-sm text-gray-600 dark:text-emerald-200/70">{t('todo_page.completed')}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Search and Filter */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder={t('todo_page.search_placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="px-3 py-2 border border-gray-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                            >
                                <option value="all">{t('todo_page.filter_all')}</option>
                                <option value="pending">{t('todo_page.filter_pending')}</option>
                                <option value="completed">{t('todo_page.filter_completed')}</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* Tasks Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {!tasks.length ? (
                            <Card className="p-8">
                                <div className="text-center">
                                    <CheckSquare className="w-16 h-16 text-gray-300 dark:text-emerald-700 mx-auto mb-4" />
                                    <TodoBanner />
                                    <Button 
                                        className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
                                        onClick={() => setShowForm(true)}
                                    >
                                        {t('todo_page.start_adding_task')}
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                {/* Urgent Tasks */}
                                {urgentTasks.length > 0 && (
                                    <Card className="p-6 border-l-4 border-red-500">
                                        <div className="flex items-center gap-2 mb-4">
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-emerald-50">
                                                {t('todo_page.urgent_tasks')} ({urgentTasks.length})
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            {urgentTasks.map((task, index) => (
                                                <motion.div
                                                    key={task.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <TaskItem task={task} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </Card>
                                )}

                                {/* All Tasks */}
                                <Card className="overflow-hidden">
                                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-emerald-800">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-emerald-50">
                                            {t('todo_page.all_tasks')} ({tasks.length})
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <TasksTable tasks={tasks} searchTerm={searchTerm} filterStatus={filterStatus} />
                                    </div>
                                </Card>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <TodoForm show={showForm} onClose={() => setShowForm(false)} />
        </div>
    )
}