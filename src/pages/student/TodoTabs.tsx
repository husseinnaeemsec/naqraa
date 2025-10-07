import { useState } from "react"
import type { Task, TaskCollection } from "../../../types"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../../components/ui/context-menu";
import { t } from "i18next";

interface Props {
    collections: TaskCollection[];
    tasks: Task[];
    onChange?: () => void;
}

export default function TodoTabs({ onChange, tasks, collections }: Props) {

    const [activeTab, setActiveTab] = useState('today')

    const tabs = [
        {
            title: "اليوم",
            id: 'today',
            icon: 'fi fi-rr-cloud-sun'
        },
        {
            title: "تكرار",
            id: "repeat",
            icon: 'fi fi-ss-rotate-reverse'
        }

    ]

    const handleOnChange = (tabId: string) => {

        setActiveTab(tabId);
        onChange ? onChange() : null;

    }

    return (
        <>

            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="w-full p-4 dark:bg-emerald-950 bg-white sticky top-0  z-0   border-x h-dynamic">
                        <small className="text-slate-500 block mb-2"> المهام </small>
                        {
                            tabs.map((tab) => {
                                return <button onClick={() => { handleOnChange(tab.id) }} key={tab.id} className={` w-full flex items-center rounded gap-2 p-1.5  ${activeTab === tab.id ? 'bg-emerald-100 dark:bg-emerald-900' : ''} `}> <i className={`mt-1 ${tab.icon}`}></i>  {tab.title} </button>
                            })
                        }
                        <div className="mt-2"></div>
                        <small className="text-slate-500 block mb-2"> المجموعات </small>

                        {
                            !collections.length && (
                                <button className="p-1.5 text-center flex items-center justify-center w-full border rounded text-sm  gap-2">
                                    <i className="fi fi-rr-plus mt-1 text-xs"></i>
                                    اضافة مجموعة
                                </button>

                            )
                        }
                        {
                            collections.map((collection) => {
                                return <button onClick={() => { handleOnChange('collections') }} className="p-1.5 flex items-center gap-2"> <i className="fi fi-rr-folder-open"></i> {collection.name} </button>
                            })
                        }
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent >

                    <ContextMenuItem dir="rtl">
                        <i className="fi fi-rr-plus text-sm font-extralight mr-2" />
                        {t("add_new_task")}
                    </ContextMenuItem>
                    <ContextMenuItem dir="rtl">
                        <i className="fi fi-rr-folder-open text-sm mr-2" />
                        {t("add_new_collection")}
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </>
    )
}