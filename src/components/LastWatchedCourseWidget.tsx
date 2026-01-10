import { Link } from "react-router-dom";
import { PlayCircle, Clock, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./ui/CustomCard";

interface LastWatchedCourseWidgetProps {
    course?: {
        id: number;
        title: string;
        thumbnail?: string;
        progress: number;
        lastWatchedLecture?: string;
        totalLectures: number;
        completedLectures: number;
    };
}

export default function LastWatchedCourseWidget({ course }: LastWatchedCourseWidgetProps) {
    const { t } = useTranslation();

    if (!course) {
        return (
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <PlayCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                        {t('dashboard_index.last_watched_course')}
                    </h3>
                </div>
                <div className="text-center py-8">
                    <BookOpen className="size-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('dashboard_index.no_courses_yet')}
                    </p>
                    <Link 
                        to="/courses/explore" 
                        className="inline-block mt-4 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                    >
                        {t('dashboard_index.explore_courses')}
                    </Link>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 group hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <PlayCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                        {t('dashboard_index.last_watched_course')}
                    </h3>
                </div>
                <Link 
                    to={`/dashboard/courses/${course.id}`}
                    className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                >
                    {t('dashboard_index.continue')}
                </Link>
            </div>

            <Link to={`/dashboard/courses/${course.id}`} className="block">
                {/* Course Thumbnail */}
                {course.thumbnail ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                        <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="size-16 text-white" />
                        </div>
                    </div>
                ) : (
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
                        <BookOpen className="size-16 text-white/80" />
                    </div>
                )}

                {/* Course Info */}
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {course.title}
                </h4>

                {course.lastWatchedLecture && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                        <Clock className="size-4" />
                        {course.lastWatchedLecture}
                    </p>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">
                            {t('dashboard_index.progress')}
                        </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            {course.progress}%
                        </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {course.completedLectures} / {course.totalLectures} {t('dashboard_index.lectures_completed')}
                    </p>
                </div>
            </Link>
        </Card>
    );
}
