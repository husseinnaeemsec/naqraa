import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trello, Edit3, MoreVertical, Calendar, User, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/CustomCard";
import Button from "../../components/ui/CustomButton";

// Board Page Component
const BoardPage = () => {
    const { t } = useTranslation();
    const [boards] = useState([
        {
            id: 1,
            name: t('boards.daily_tasks.name'),
            description: t('boards.daily_tasks.description'),
            tasks: 12,
            color: "bg-emerald-500",
            updated: t('boards.daily_tasks.updated')
        },
        {
            id: 2,
            name: t('boards.research_project.name'),
            description: t('boards.research_project.description'),
            tasks: 8,
            color: "bg-blue-500",
            updated: t('boards.research_project.updated')
        },
        {
            id: 3,
            name: t('boards.study_plan.name'),
            description: t('boards.study_plan.description'),
            tasks: 15,
            color: "bg-purple-500",
            updated: t('boards.study_plan.updated')
        }
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 p-6">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Trello className="w-8 h-8 text-emerald-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-50">{t('boards.title')}</h1>
                            <p className="text-gray-600 dark:text-emerald-200/70">{t('boards.subtitle')}</p>
                        </div>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {t('boards.new_board')}
                    </Button>
                </div>
            </motion.div>

            {/* Boards Grid */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
                {boards.map((board, index) => (
                    <motion.div
                        key={board.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (index * 0.1) }}
                    >
                        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="p-6 space-y-4">
                                {/* Board Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${board.color}`}></div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-emerald-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                                            {board.name}
                                        </h3>
                                    </div>
                                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Board Description */}
                                <p className="text-gray-600 dark:text-emerald-200/70 text-sm line-clamp-2">
                                    {board.description}
                                </p>

                                {/* Board Stats */}
                                <div className="flex items-center justify-between pt-2 border-t border-emerald-100 dark:border-emerald-800">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-emerald-400">
                                        <div className="flex items-center gap-1">
                                            <Tag className="w-4 h-4" />
                                            <span>{board.tasks} {t('boards.tasks')}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{board.updated}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="secondary" 
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        {t('boards.open')}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {/* Create New Board Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-dashed border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 dark:hover:border-emerald-500">
                        <div className="p-6 flex flex-col items-center justify-center space-y-4 min-h-[200px]">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                                <Plus className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-gray-900 dark:text-emerald-50 mb-1">
                                    {t('boards.create_new_board')}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-emerald-400">
                                    {t('boards.start_organizing_tasks')}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Sample Kanban Board */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50 flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-emerald-600" />
                            {t('boards.sample_board')}
                        </h2>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm">
                                {t('boards.view')}
                            </Button>
                            <Button variant="secondary" size="sm">
                                {t('boards.edit')}
                            </Button>
                        </div>
                    </div>

                    {/* Kanban Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* To Do Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                <h3 className="font-semibold text-gray-900 dark:text-emerald-50">{t('boards.kanban.todo')}</h3>
                                <span className="bg-gray-100 dark:bg-emerald-900/30 text-gray-600 dark:text-emerald-400 text-xs px-2 py-1 rounded-full">3</span>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-white dark:bg-emerald-950 border border-gray-200 dark:border-emerald-800 rounded-lg shadow-sm">
                                    <h4 className="font-medium text-gray-900 dark:text-emerald-50 text-sm mb-2">{t('boards.kanban.tasks.math_review')}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-emerald-400">
                                        <User className="w-3 h-3" />
                                        <span>{t('boards.kanban.tasks.assigned_to_mohammad')}</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-white dark:bg-emerald-950 border border-gray-200 dark:border-emerald-800 rounded-lg shadow-sm">
                                    <h4 className="font-medium text-gray-900 dark:text-emerald-50 text-sm mb-2">{t('boards.kanban.tasks.write_report')}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-emerald-400">
                                        <Calendar className="w-3 h-3" />
                                        <span>{t('boards.kanban.tasks.due_tomorrow')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* In Progress Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <h3 className="font-semibold text-gray-900 dark:text-emerald-50">{t('boards.kanban.in_progress')}</h3>
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full">2</span>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-white dark:bg-emerald-950 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
                                    <h4 className="font-medium text-gray-900 dark:text-emerald-50 text-sm mb-2">{t('boards.kanban.tasks.solve_exercises')}</h4>
                                    <div className="w-full bg-gray-200 dark:bg-emerald-900/30 rounded-full h-2 mb-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-emerald-400">
                                        <User className="w-3 h-3" />
                                        <span>{t('boards.kanban.tasks.assigned_to_fatima')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Done Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                <h3 className="font-semibold text-gray-900 dark:text-emerald-50">{t('boards.kanban.done')}</h3>
                                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-1 rounded-full">4</span>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm opacity-75">
                                    <h4 className="font-medium text-gray-900 dark:text-emerald-50 text-sm mb-2">{t('boards.kanban.tasks.read_chapter_one')}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-emerald-400">
                                        <Calendar className="w-3 h-3" />
                                        <span>{t('boards.kanban.tasks.completed_two_days_ago')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );

};

export default BoardPage;