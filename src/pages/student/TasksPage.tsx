import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, Clock, Search, Calendar, Target, AlertCircle, Check, LayoutGrid, Table, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
// import api from '../../api/client';
// import { endpoints } from '../../api/routes';
import TaskDrawer from './TaskDrawer';
import TaskBottomSheet from './TaskBottomSheet';
import Card from '../../components/ui/CustomCard';
import Button from '../../components/ui/CustomButton';
import PartialLoadError from '../../components/errors/PartialLoadError';
import {  type ErrorType } from '../../utils/errorHandler';
import type { TaskType } from '../../types/productivity';
import api from '../../api/client';
import { endpoints } from '../../api/routes';

export default function TasksPage() {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const isRTL = i18n.language === 'ar' || i18n.language === 'ku';

    // Utility function to safely render and truncate HTML content
    const getTruncatedHTML = (html: string, maxLength: number = 100) => {
        if (!html) return '';
        
        // Sanitize HTML first
        const clean = DOMPurify.sanitize(html, { 
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'a', 'ul', 'ol', 'li'],
            ALLOWED_ATTR: ['href', 'target', 'class']
        });
        
        // Create a temporary element to extract text for length checking
        const temp = document.createElement('div');
        temp.innerHTML = clean;
        const text = temp.textContent || temp.innerText || '';
        
        // If text is short enough, return the clean HTML
        if (text.length <= maxLength) {
            return clean;
        }
        
        // Truncate text and add ellipsis
        const truncatedText = text.substring(0, maxLength) + '...';
        return DOMPurify.sanitize(truncatedText);
    };

    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ErrorType | null>(null);
    

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
    const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
    const [showCompleted, setShowCompleted] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
    const [editingTask, setEditingTask] = useState<TaskType | null>(null);
    const [viewMode, setViewMode] = useState<'card' | 'table'>(
        typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'table' : 'card'
    );


    const handleEditTask = (task: TaskType) => {
        setEditingTask(task);
        setIsDrawerOpen(true);
    };

    const handleTaskClick = (task: TaskType) => {
        setSelectedTask(task);
    };

    useEffect(()=>{
        api.get(endpoints.productivity.tasks.list).then((res)=>{
            setTasks(res.data)
            setIsLoading(false)
        }).catch(err => {
            setError(err);
            setIsLoading(false);
        })
    },[])

    // Handle URL parameters for pre-filling task data from other widgets
    useEffect(() => {
        const shouldOpenDrawer = searchParams.get('openDrawer') === 'true';
        const titleParam = searchParams.get('title');
        const dueDateParam = searchParams.get('dueDate');
        const priorityParam = searchParams.get('priority') as TaskType['priority'];

        if (shouldOpenDrawer && titleParam) {
            // Create a temporary task object for editing
            const tempTask: TaskType = {
                id: 0, // Temporary ID
                name: titleParam,
                description: '',
                status: 'pending',
                priority: priorityParam || 'medium',
                recurring:'daily',
                due_date: dueDateParam || null,
                due_time:null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                category:null,
            };
            
            setEditingTask(tempTask);
            setIsDrawerOpen(true);
            
            // Clear URL parameters after loading
            setSearchParams({})
        }
    }, [searchParams, setSearchParams]);

    // Uncomment this when connecting to API
    // useEffect(() => {
    //     api.get(endpoints.productivity.tasks.list).then(res => setTasks(res.data))
    //     api.get(endpoints.productivity.collections.list).then(res => setCollections(res.data))
    // }, [])

    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'pending' && task.status === 'completed') return false;
        if (filterStatus === 'completed' && task.status !== 'completed') return false;
        if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (!showCompleted && task.status === 'completed') return false;
        return true;
    });

    const completedTasks = filteredTasks.filter(task => task.status === 'completed');
    const pendingTasks = filteredTasks.filter(task => task.status !== 'completed');
    const urgentTasks = pendingTasks.filter(task => task.priority === 'urgent');

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'border-rose-500 dark:border-rose-600';
            case 'high': return 'border-orange-500 dark:border-orange-600';
            case 'medium': return 'border-blue-500 dark:border-blue-600';
            default: return 'border-slate-300 dark:border-slate-600';
        }
    };



    const formatDueDate = (dueDate: string | null) => {
        if (!dueDate) return null;
        const date = new Date(dueDate);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return t('todo_page.today') || 'Today';
        if (diffDays === 1) return t('todo_page.tomorrow') || 'Tomorrow';
        if (diffDays < 0) return t('todo_page.overdue') || 'Overdue';
        if (diffDays <= 7) return `${diffDays} days`;
        return date.toLocaleDateString();
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-emerald-300 font-medium">{t('common.loading')}...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950">
                <div className="max-w-500 mx-auto p-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            {t('todo_page.title')}
                        </h1>
                        <p className="text-slate-600 dark:text-emerald-200/70 mt-1">
                            {t('todo_page.subtitle')}
                        </p>
                    </motion.div>
                    
                    <Card className="p-8">
                        <PartialLoadError
                            errorType={error}
                            onRetry={()=>{}}
                            maxRetries={3}
                        />
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950">
            <div className="max-w-[1600px] mx-auto p-6 space-y-6">
                {/* Modern Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            {t('todo_page.title')}
                        </h1>
                        <p className="text-slate-600 dark:text-emerald-200/70 mt-1">
                            {t('todo_page.subtitle')}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDrawerOpen(true)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl   flex items-center gap-2 font-medium transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        {t('todo_page.new_task')}
                    </motion.button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <Card className="p-6 bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800 ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">{t('todo_page.total_tasks')}</p>
                                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{tasks.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-xl flex items-center justify-center">
                                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border border-amber-200 dark:border-amber-800 ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">{t('todo_page.in_progress')}</p>
                                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1">{pendingTasks.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-200 dark:bg-amber-800 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 border border-emerald-200 dark:border-emerald-800 ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{t('todo_page.completed')}</p>
                                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">{completedTasks.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-200 dark:bg-emerald-800 rounded-xl flex items-center justify-center">
                                <CheckSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-linear-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/30 border border-rose-200 dark:border-rose-800 ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-rose-600 dark:text-rose-400 text-sm font-medium">{t('todo_page.urgent_tasks')}</p>
                                <p className="text-3xl font-bold text-rose-900 dark:text-rose-100 mt-1">{urgentTasks.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-rose-200 dark:bg-rose-800 rounded-xl flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    {/* Search and Controls Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                            <input
                                type="text"
                                placeholder={t('todo_page.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-emerald-900/30 border border-slate-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 dark:text-emerald-50"
                            />
                        </div>

                        <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-4 py-3 bg-white dark:bg-emerald-900/30 border border-slate-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                        <option value="all">{t('todo_page.filter_all')}</option>
                        <option value="pending">{t('todo_page.filter_pending')}</option>
                        <option value="completed">{t('todo_page.filter_completed')}</option>
                    </select>

                    <label className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-emerald-900/30 rounded-xl cursor-pointer border border-slate-200 dark:border-emerald-700">
                        <input
                            type="checkbox"
                            checked={showCompleted}
                            onChange={(e) => setShowCompleted(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-emerald-300">
                            {t('todo_page.show_completed')}
                        </span>
                    </label>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-white dark:bg-emerald-900/30 rounded-xl border border-slate-200 dark:border-emerald-700">
                        <button
                            onClick={() => setViewMode('card')}
                            className={`p-2 rounded-lg transition-all ${
                                viewMode === 'card'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                    : 'text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50'
                            }`}
                            title={t('todo_page.card_view')}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-all ${
                                viewMode === 'table'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                    : 'text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50'
                            }`}
                            title={t('todo_page.table_view')}
                        >
                            <Table className="w-5 h-5" />
                        </button>
                    </div>
                    </div>

                    {/* Collections Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setSelectedCollection(null)}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                                selectedCollection === null
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-white dark:bg-emerald-900/30 text-slate-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 border border-slate-200 dark:border-emerald-700'
                            }`}
                        >
                            {t('todo_page.all_tasks')}
                        </button>
                        
                    </div>
                </motion.div>

                {/* Tasks Display */}
                {filteredTasks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <CheckSquare className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {t('todo_page.no_tasks_found')}
                        </h3>
                        <p className="text-slate-600 dark:text-emerald-200/70 mb-6">
                            {t('todo_page.create_first_task')}
                        </p>
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('todo_page.new_task')}
                        </Button>
                    </motion.div>
                ) : viewMode === 'card' ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                    >
                        {filteredTasks.map((task, index) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleTaskClick(task)}
                                className={`group relative border border-l-4 rounded-xl p-5 transition-all  cursor-pointer bg-white dark:bg-slate-800/50 ${
                                    task.status === 'completed' 
                                        ? 'border-slate-300 dark:border-slate-600 opacity-75'
                                        : `${getPriorityColor(task.priority)}  hover:scale-[1.02]`
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            
                                        }}
                                        className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                            task.status === 'completed'
                                                ? 'bg-emerald-500 border-emerald-500'
                                                : 'border-slate-300 dark:border-emerald-600 hover:border-emerald-500'
                                        }`}
                                    >
                                        {task.status === 'completed' && <Check className="w-4 h-4 text-white" />}
                                    </motion.button>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold text-lg mb-1 truncate ${
                                            task.status === 'completed'
                                                ? 'line-through text-slate-500 dark:text-slate-400'
                                                : 'text-slate-900 dark:text-white'
                                        }`}>
                                            {task.name}
                                        </h3>
                                        
                                        <div className="h-12 mb-3">
                                            {task.description && (
                                                <div 
                                                    className="text-sm text-slate-600 dark:text-slate-400 prose prose-sm max-w-none line-clamp-2"
                                                    dangerouslySetInnerHTML={{ __html: getTruncatedHTML(task.description, 100) }}
                                                />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                                task.priority === 'urgent' ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300' :
                                                task.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' :
                                                task.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                                                'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                            }`}>
                                                {task.priority.toUpperCase()}
                                            </span>

                                                                                            <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium">
                                                </span>


                                                <span className="px-2.5 py-1 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 rounded-lg text-xs font-medium flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {task.recurring}
                                                </span>

                                            {task.due_date && (
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${
                                                    new Date(task.due_date) < new Date()
                                                        ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
                                                        : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                                }`}>
                                                    <Clock className="w-3 h-3" />
                                                    {formatDueDate(task.due_date)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditTask(task);
                                            }}
                                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                            title={t('todo_page.edit_task', 'Edit task')}
                                        >
                                            <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                
                                            }}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                            title={t('todo_page.delete_task', 'Delete task')}
                                        >
                                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Table View */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-emerald-900/20 rounded-xl border border-slate-200 dark:border-emerald-700 overflow-hidden "
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-emerald-50 dark:bg-emerald-900/40 border-b border-emerald-200 dark:border-emerald-700">
                                    <tr>
                                        <th className="px-6 py-4 text-start text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider whitespace-nowrap">
                                            {t('todo_page.status')}
                                        </th>
                                        <th className="px-6 py-4 text-start text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                                            {t('todo_page.task')}
                                        </th>
                                        <th className="px-6 py-4 text-start text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider whitespace-nowrap">
                                            {t('todo_page.priority')}
                                        </th>
                                        <th className="px-6 py-4 text-start text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider whitespace-nowrap">
                                            {t('todo_page.collection')}
                                        </th>
                                        <th className="px-6 py-4 text-start text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider whitespace-nowrap">
                                            {t('todo_page.due_date')}
                                        </th>
                                        <th className="px-6 py-4 text-end text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider whitespace-nowrap">
                                            {t('todo_page.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-emerald-800">
                                    {filteredTasks.map((task, index) => (
                                        <motion.tr
                                            key={task.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            onClick={() => handleTaskClick(task)}
                                            className={`cursor-pointer transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/30 ${
                                                task.status === 'completed' ? 'opacity-60' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4 align-top">
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        
                                                    }}
                                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                        task.status === 'completed'
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : 'border-slate-300 dark:border-emerald-600 hover:border-emerald-500'
                                                    }`}
                                                >
                                                    {task.status === 'completed' && <Check className="w-4 h-4 text-white" />}
                                                </motion.button>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex flex-col">
                                                    <span className={`font-semibold text-sm ${
                                                        task.status === 'completed' 
                                                            ? 'line-through text-slate-500 dark:text-slate-400'
                                                            : 'text-slate-900 dark:text-white'
                                                    }`}>
                                                        {task.name}
                                                    </span>
                                                    {task.description && (
                                                        <div 
                                                            className="text-xs text-slate-500 dark:text-slate-400 mt-1 prose prose-xs max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: getTruncatedHTML(task.description, 80) }}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top whitespace-nowrap">
                                                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                                    task.priority === 'urgent' ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300' :
                                                    task.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' :
                                                    task.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                                                    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-top whitespace-nowrap">

                                                    <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>
                                            </td>
                                            <td className="px-6 py-4 align-top whitespace-nowrap">
                                                {task.due_date ? (
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                                        new Date(task.due_date) < new Date()
                                                            ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
                                                            : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                                    }`}>
                                                        <Clock className="w-3 h-3" />
                                                        {formatDueDate(task.due_date)}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-end align-top">
                                                <div className="flex items-center justify-end gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditTask(task);
                                                        }}
                                                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                                        title={t('todo_page.edit_task', 'Edit task')}
                                                    >
                                                        <Edit2 className="w-4 h-4 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                                        title={t('todo_page.delete_task', 'Delete task')}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-slate-600 dark:text-slate-400  hover:text-red-600 dark:hover:text-red-400" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>

            <TaskDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setEditingTask(null);
                }}
                onSave={(task)=> {
                    console.log(task)
                }}
                editTask={editingTask}
            />

            <TaskBottomSheet
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                collections={[]}
                onEdit={handleEditTask}
                onDelete={()=>{}}
            />
        </div>
    )
}