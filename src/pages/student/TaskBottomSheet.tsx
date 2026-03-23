import { X, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import type { TaskType } from '../../types/productivity';

interface TaskBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    task: TaskType | null;
    onEdit?: (task: TaskType) => void;
    onDelete?: (taskId: number) => void;
}

export default function TaskBottomSheet({ isOpen, onClose, task, onEdit, onDelete }: TaskBottomSheetProps) {
    if (!task) return null;

    

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300';
            case 'high': return 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300';
            case 'medium': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Bottom Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
                    >
                        {/* Drag Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
                        </div>

                        <div className="p-6 space-y-6 max-w-2xl mx-auto">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                            {task.priority.toUpperCase()}
                                        </span>
                                        {task.status === 'completed' && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                                                COMPLETED
                                            </span>
                                        )}
                                    </div>
                                    <h2 className={`text-2xl font-bold break-words ${
                                        task.status === 'completed'
                                            ? 'line-through text-slate-500 dark:text-slate-400'
                                            : 'text-slate-900 dark:text-white'
                                    }`}>
                                        {task.name}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>

                            {/* Content */}
                            {task.description && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5">
                                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                                        Description
                                    </h3>
                                    <div 
                                        className="prose dark:prose-invert prose-sm max-w-none text-slate-700 dark:text-slate-300 
                                        [&>p]:mb-3 [&>p]:leading-relaxed [&>p]:text-base
                                        [&>ul]:my-3 [&>ul]:space-y-2 [&>ul>li]:leading-relaxed
                                        [&>ol]:my-3 [&>ol]:space-y-2 [&>ol>li]:leading-relaxed
                                        [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:mt-4
                                        [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:mt-3
                                        [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:mt-3
                                        [&>strong]:font-semibold [&>strong]:text-slate-900 [&>strong]:dark:text-white
                                        [&>em]:italic
                                        [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-3"
                                        dangerouslySetInnerHTML={{ 
                                            __html: DOMPurify.sanitize(task.description, {
                                                ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
                                                ALLOWED_ATTR: ['href', 'target', 'class', 'style']
                                            })
                                        }}
                                    />
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="flex items-center gap-3 flex-wrap text-sm">
                                {/* Due Date */}
                                {task.due_date && (
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                        new Date(task.due_date) < new Date()
                                            ? 'bg-rose-50 dark:bg-rose-950/30'
                                            : 'bg-emerald-50 dark:bg-emerald-950/30'
                                    }`}>
                                        <Clock className={`w-4 h-4 flex-shrink-0 ${
                                            new Date(task.due_date) < new Date()
                                                ? 'text-rose-600 dark:text-rose-400'
                                                : 'text-emerald-600 dark:text-emerald-400'
                                        }`} />
                                        <span className={`font-medium ${
                                            new Date(task.due_date) < new Date()
                                                ? 'text-rose-700 dark:text-rose-300'
                                                : 'text-emerald-700 dark:text-emerald-300'
                                        }`}>
                                            {formatDate(task.due_date)}
                                        </span>
                                    </div>
                                )}

                                {/* Created Date */}
                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                                        {formatDate(task.created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button 
                                    onClick={() => {
                                        if (task) {
                                            onEdit?.(task);
                                            onClose();
                                        }
                                    }}
                                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium"
                                >
                                    Edit Task
                                </button>
                                <button 
                                    onClick={() => {
                                        if (task) {
                                            onDelete?.(task.id);
                                            onClose();
                                        }
                                    }}
                                    className="flex-1 px-6 py-3 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
