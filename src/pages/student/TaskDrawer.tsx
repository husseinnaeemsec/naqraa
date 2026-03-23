import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import type { TaskType } from '../../types/productivity';

interface TaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (task: Partial<TaskType>) => void;
    editTask?: TaskType | null;
}

export default function TaskDrawer({ isOpen, onClose, onSave, editTask }: TaskDrawerProps) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.language === 'ku';

    const [name, setTitle] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
    const [dueDate, setDueDate] = useState('');

    // Store initial values for dirty checking
    const [initialValues, setInitialValues] = useState({
        name: '',
        description: '',
        priority: 'medium' as TaskType['priority'],
        dueDate: ''
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4 border border-slate-200 dark:border-emerald-700 rounded-lg',
                dir: isRTL ? 'rtl' : 'ltr',
            },
        },
    });

    // Load task data when editing
    useEffect(() => {
        if (editTask && isOpen) {
            setTitle(editTask.name);
            setPriority(editTask.priority);
            
            // Safely parse due date
            let parsedDueDate = '';
            if (editTask.due_date) {
                try {
                    const date = new Date(editTask.due_date);
                    if (!isNaN(date.getTime())) {
                        parsedDueDate = date.toISOString().slice(0, 16);
                    }
                } catch {
                    // Invalid date, leave empty
                }
            }
            setDueDate(parsedDueDate);
            editor?.commands.setContent(editTask.description || '');
            
            // Set initial values for comparison
            setInitialValues({
                name: editTask.name,
                description: editTask.description || '',
                priority: editTask.priority,
                dueDate: parsedDueDate
            });
        } else if (!editTask && isOpen) {
            // Reset for new task
            setInitialValues({
                name: '',
                description: '',
                priority: 'medium',
                dueDate: ''
            });
        }
    }, [editTask, isOpen, editor]);

    // Check if data is dirty
    const isDirty = () => {
        const currentDescription = editor?.getHTML() || '';
        return (
            name !== initialValues.name ||
            currentDescription !== initialValues.description ||
            priority !== initialValues.priority ||
            dueDate !== initialValues.dueDate
        );
    };

    const handleSave = () => {
        if (!name.trim()) return;

        const taskData: Partial<TaskType> = {
            name,
            description: editor?.getHTML() || '',
            priority,
            due_date: dueDate || null,
            status: editTask?.status  || 'pending',
        };

        // Add id only if editing an existing task (not a temporary task with id 0)
        if (editTask && editTask.id !== 0) {
            taskData.id = editTask.id;
        }

        onSave?.(taskData);
        handleClose();
    };

    const handleClose = () => {
        setTitle('');
        setPriority('medium');
        setDueDate('');
        editor?.commands.setContent('');
        onClose();
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
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: isRTL ? '100%' : '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: isRTL ? '100%' : '-100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-full md:w-125 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto`}
                    >
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {editTask && editTask.id !== 0 ? t('todo_form.edit_task') : t('todo_page.new_task')}
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>

                            {/* Task Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('todo_form.title_placeholder')}
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={t('todo_form.title_placeholder')}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* Rich Text Editor */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('todo_form.description_placeholder')}
                                </label>
                                <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                                    {/* Toolbar */}
                                    <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                        <button
                                            onClick={() => editor?.chain().focus().toggleBold().run()}
                                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                                editor?.isActive('bold')
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                                    : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <strong>B</strong>
                                        </button>
                                        <button
                                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                                editor?.isActive('italic')
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                                    : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <em>I</em>
                                        </button>
                                        <button
                                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                                editor?.isActive('bulletList')
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                                    : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            •
                                        </button>
                                        <button
                                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                                editor?.isActive('orderedList')
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                                    : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            1.
                                        </button>
                                    </div>
                                    <EditorContent editor={editor} />
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('todo_form.importance')}
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPriority(p)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                priority === p
                                                    ? p === 'urgent' ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500' :
                                                      p === 'high' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500' :
                                                      p === 'medium' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500' :
                                                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-2 ring-slate-500'
                                                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            {t(`todo_form.priority_${p}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>



                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('todo_form.due_date')}
                                </label>
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                    lang={isRTL ? 'ar' : 'en'}
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                                >
                                    {t('todo_form.cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!name.trim() || (!!editTask && editTask.id !== 0 && !isDirty())}
                                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                                >
                                    {editTask && editTask.id !== 0 ? t('todo_form.update_task') : t('todo_page.new_task')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
