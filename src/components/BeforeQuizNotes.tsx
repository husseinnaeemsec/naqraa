import { useTranslation } from "react-i18next";

export default function BeforeQuizNotes( { setShowNotes } : { setShowNotes:(value:boolean)=> void } ) {
    const { t } = useTranslation();

    return (
        <div className="p-6 max-w-3xl w-full space-y-5 dark:bg-emerald-800 bg-white border-2 border-b-4 border-l-4 rounded-xl shadow">
            <h1 className="text-amber-600 dark:text-amber-400 text-2xl font-bold">{t('quiz_notes.title')}</h1>
            <ol className="space-y-3 list-decimal pr-4">
                <li className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="bg-sky-100 flex items-center gap-2 p-2 border-2 border-sky-700 text-sky-800 border-b-4 border-l-4 rounded-md">
                        <i className="text-base fi fi-rr-globe"></i>
                        {t('quiz_notes.stable_internet')}
                    </span>
                </li>
                <li className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-base">{t('quiz_notes.when_clicking')}</span>
                    <button className="w-fit p-2 bg-emerald-100 text-emerald-900 border-2 border-b-4 border-l-4 rounded-md">
                        {t('quiz_notes.start_quiz')}
                    </button>
                    <span className="bg-rose-100 p-2 border-2 border-rose-700 text-rose-800 border-b-4 border-l-4 rounded-md">
                        {t('quiz_notes.no_leaving')}
                    </span>
                </li>
                <li className="text-sm flex flex-wrap gap-2">
                    <span>{t('quiz_notes.no_going_back')}</span>
                    <span className="bg-yellow-100 p-1 border-2 border-yellow-700 text-yellow-800 border-b-4 border-l-4 rounded-md">
                        {t('quiz_notes.answer_carefully')}
                    </span>
                </li>
                <li className="text-sm flex flex-wrap gap-2">
                    <span>{t('quiz_notes.time_tracking')}</span>
                    <span className="bg-emerald-100 p-1 border-2 border-emerald-700 text-emerald-900 border-b-4 border-l-4 rounded-md">
                        {t('quiz_notes.no_rush')}
                    </span>
                </li>
                <li className="text-sm flex flex-wrap gap-2">
                    <span>{t('quiz_notes.leaving_fails')}</span>
                    <span className="bg-rose-100 p-1 border-2 border-rose-700 text-rose-800 border-b-4 border-l-4 rounded-md">
                        {t('quiz_notes.no_cheating')}
                    </span>
                </li>
            </ol>
            <button
                onClick={() => setShowNotes(false)}
                className="w-full p-3 bg-emerald-100 text-emerald-900 font-bold border-2 border-b-4 border-l-4 rounded-md hover:bg-emerald-200"
            >
                {t('quiz_notes.understood')}
            </button>
        </div>
    )
}
