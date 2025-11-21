import { useEffect, useState , useRef } from "react";
import { HeroPenSquareIcon, HeroSearchIcon } from "../../components/Icons";
import ChatCard from "./ChatCard";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import type { ChatProps } from "../../../types";
import { useTranslation } from 'react-i18next';


export default function ChatSidebar() {
    const { t } = useTranslation();

    const [chats,setChats] = useState<ChatProps[]>([])
    const [loading,setLoading] = useState(true);
    const defaultChatsRef = useRef<ChatProps[]>([]);
    useEffect(() => {
        api.get(endpoints.chat.list)
        .then((res) => {
            setChats(res.data.results);
            defaultChatsRef.current = res.data.results;
        })
        .finally(() => setLoading(false));
    }, []);

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const search = event.currentTarget.value.toLowerCase();

        // If user clears the input, show default chats again
        if (!search.trim()) {
        setChats(defaultChatsRef.current);
        return;
        }

        // Otherwise, filter from the original list
        setChats(
        defaultChatsRef.current.filter((c) =>
            c.chat_name.toLowerCase().includes(search)
        )
        );
    };

    return (
        <div className="w-full lg:block hidden relative z-10 p-5 bg-emerald-50/50 dark:bg-emerald-950 border-r border-emerald-200 dark:border-emerald-800 h-full overflow-y-auto">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-emerald-50">{t('chat_sidebar.messages')}</h1>
                    <button className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg transition-colors">
                        <HeroPenSquareIcon className="size-5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer" />
                    </button>
                </div>
                <div className="mt-5 relative flex items-center z-0">
                    <input 
                        onKeyDown={handleSearch} 
                        placeholder={t('chat_sidebar.search_contacts')} 
                        type="search" 
                        className="p-1.5 px-3 pr-10 bg-white dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-50 placeholder-gray-500 dark:placeholder-emerald-400 w-full rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    />
                    <HeroSearchIcon className="size-5 absolute right-2 text-emerald-500 dark:text-emerald-400" />
                </div>
            </div>
            <div className="mt-5 space-y-2">
                {
                    loading && ( 
                        <div className="text-emerald-600 dark:text-emerald-400 h-20 my-auto items-center justify-center flex"> 
                            {t('chat_sidebar.loading_contacts')}
                        </div> 
                    )
                }
                {
                    chats.map((c)=>{
                        return <ChatCard key={c.id} chat={c}  />
                    })
                }
            </div>
        </div>
    )
}