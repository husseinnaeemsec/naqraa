import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface Props {
    show:boolean;
    onClose?:()=> void;
}
export default function TodoForm( {  show, onClose  } : Props ){
    const { t } = useTranslation();



    if(!show){
        return <></>
    }

    const priorities = [
        {
            ar: t('todo_form.priority_low'),
            en:'low',
            color:'text-emerald-600 border-emerald-500 checked:bg-emerald-500'
        },
        {
            ar: t('todo_form.priority_medium'),
            en:'medium',
            color:'text-emerald-600 border-emerald-500 checked:bg-emerald-500'
        },
        {
            ar: t('todo_form.priority_high'),
            en:'high',
            color:'text-emerald-700 border-emerald-600 checked:bg-emerald-600'
        },
        {
            ar: t('todo_form.priority_urgent'),
            en:'urgent',
            color:'text-emerald-800 border-emerald-700 checked:bg-emerald-700'
        },
    ]
    
    return (
        <div 
            className="fixed inset-0 w-full h-full z-50 bg-black/30 flex items-center justify-center backdrop-blur-xs"
            onClick={onClose}
        >
            <div 
                className="max-w-lg bg-white dark:bg-emerald-950 text-sm w-full p-6 rounded-xl space-y-3 shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </button>
                <h1 className="text-lg font-semibold">{t('todo_form.add_new_task')}</h1>
                <input type="text" className="p-2 rounded border w-full" placeholder={t('todo_form.title_placeholder')} />
                <textarea name="" placeholder={t('todo_form.description_placeholder')} id="" className="p-2 rounded border w-full"></textarea>
                <label htmlFor="" className="p-2">{t('todo_form.importance')}</label>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {
                        priorities.map((p)=>{
                            return <input name="praiority" data-label={p.ar} type="radio" className={`radio-btn ${p.color} `} key={p.en} />
                        })
                    }
                </div>
            </div>
        </div>
    )
}