import type { CurrentLecture } from "../../types";
import parse from 'html-react-parser';

interface Props {
    activeLecture: CurrentLecture | null
}

/**
 * Content Tab - Displays lecture content
 * 
 * Features:
 * - Renders HTML content safely
 * - Shows lecture title and description
 * - Handles empty/missing content gracefully
 */
export default function ContentTab({ activeLecture }: Props) {
    if (!activeLecture) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                <p>الرجاء تحديد محاضرة لعرض المحتوى</p>
            </div>
        );
    }

    const hasContent = activeLecture.content && activeLecture.content.trim() !== '';

    return (
        <div className="space-y-4">
            {/* Lecture Title */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {activeLecture.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>المحاضرة {activeLecture.order}</span>
                    {activeLecture.duration && (
                        <span>• {activeLecture.duration} دقيقة</span>
                    )}
                </div>
            </div>

            {/* Lecture Content */}
            {hasContent ? (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed rich-text">
                        {parse(activeLecture.content)}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                        لا يوجد محتوى نصي لهذه المحاضرة
                    </p>
                </div>
            )}
        </div>
    );
}