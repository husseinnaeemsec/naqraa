import type { LectureTab } from "../../types";

interface Props {
    onChange:(tab:string) => void;
    activeTab:string;
}

export default function ClassroomTabs( { onChange , activeTab } : Props  ){


    const tabs = [
        {
            text:'محتوى الدورة',
            tab:'content',
            icon:<i className="fi fi-rr-script"></i>,
        },
        {
            text:'الموارد والمصادر',
            tab:'resources',
            icon:<i className="fi fi-rr-file-edit"></i>
        },
        {
            text:'الاختبارات',
            tab:'quizzes',
            icon:<i className="fi fi-rr-lightbulb-question"></i>
        },
        {
            text:'الملاحظات',
            tab:'notes',
            icon:<i className="fi fi-rr-edit"></i>
        },
        {
            text:'المناقشة',
            tab:'discussion',
            icon:<i className="fi fi-rr-comment"></i>
        }
    ]

    const handleChange = (tab:LectureTab)=>{
        onChange(tab);
    }

    return (
        <div className="flex items-center   dark:bg-emerald-900  bg-slate-50 rounded-md rounded-t-none   pt-2 h-16   overflow-x-auto overflow-hidden">
            {
                tabs.map((tab)=>{
                    return (
                        <button key={tab.tab} onClick={()=>{ handleChange(tab.tab as LectureTab) }}  className={` ${activeTab === tab.tab ? 'font-bold text-emerald-900 dark:text-emerald-50' : 'text-slate-500 dark:text-emerald-50/50'} flex  min-w-fit items-center gap-1 p-2 px-3 `} >
                            {tab.icon}
                            {tab.text}
                        </button>
                    )
                })
            }
        </div>
    )
}