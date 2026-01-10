import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../store/store';
import { completeSystemTask, removeSystemTask, type SystemTask } from '../store/uiSlice';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { FireIcon, TrophyIcon, CheckCircleIcon, BoltIcon, StarIcon } from '@heroicons/react/24/solid';
import type { FC, SVGProps } from 'react';

export const FloatingTasksMenu = () => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.language === 'ku';
    const systemTasks = useAppSelector((state) => state.ui.systemTasks);
    const dispatch = useAppDispatch();
    const [isExpanded, setIsExpanded] = useState(true);

    // Filter out completed tasks
    const activeTasks = systemTasks.filter((task: SystemTask) => !task.completed);

    if (activeTasks.length === 0) return null;

    const handleComplete = (taskId: string) => {
        dispatch(completeSystemTask(taskId));
        // Remove after animation
        setTimeout(() => {
            dispatch(removeSystemTask(taskId));
        }, 300);
    };

    const handleDismiss = (taskId: string) => {
        dispatch(removeSystemTask(taskId));
    };

    // Map icon strings to icon components
    const getIconComponent = (iconName: string): FC<SVGProps<SVGSVGElement>> => {
        const iconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
            'fire': FireIcon,
            'trophy': TrophyIcon,
            'check-circle': CheckCircleIcon,
            'bolt': BoltIcon,
            'star': StarIcon,
        };
        return iconMap[iconName.toLowerCase()] || CheckCircleIcon;
    };

    // Get icon styling based on icon type
    const getIconStyling = (iconName: string) => {
        const stylingMap: Record<string, { bgColor: string; iconColor: string }> = {
            'fire': { bgColor: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400' },
            'trophy': { bgColor: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
            'check-circle': { bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
            'bolt': { bgColor: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
            'star': { bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600 dark:text-yellow-400' },
        };
        return stylingMap[iconName.toLowerCase()] || { bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' };
    };



    return (
        <div
            className={`fixed bottom-6  z-40 ${isRTL ? 'left-6' : 'right-6'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="w-80 bg-white overflow-hidden rounded-lg shadow-xl border border-emerald-600 dark:border-emerald-700">
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 flex items-center justify-between hover:bg-emerald-100  transition-colors"
                >
                    <span className="font-medium text-sm">
                        {activeTasks.length} {activeTasks.length === 1 ? 'Task' : 'Tasks'}
                    </span>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>

                {/* Tasks List */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="max-h-96 overflow-y-auto">
                                <AnimatePresence mode="popLayout">
                                    {activeTasks.map((task: SystemTask) => {
                                        const IconComponent = getIconComponent(task.icon);
                                        const iconStyle = getIconStyling(task.icon);
                                        
                                        return (
                                            <motion.div
                                                key={task.id}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: isRTL ? -100 : 100 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`flex-shrink-0 w-10 h-10 ${iconStyle.bgColor} rounded-full flex items-center justify-center`}>
                                                            <IconComponent className={`w-5 h-5 ${iconStyle.iconColor}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                                                                {task.title}
                                                            </h4>
                                                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                                {task.description}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <Link
                                                                    to={task.actionLink}
                                                                    onClick={() => handleComplete(task.id)}
                                                                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                                                >
                                                                    Take Action →
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleComplete(task.id)}
                                                                    className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                                                                    title="Mark as complete"
                                                                >
                                                                    <Check size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDismiss(task.id)}
                                                                    className="p-1 text-gray-400 hover:bg-gray-200 rounded transition-colors"
                                                                    title="Dismiss"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
