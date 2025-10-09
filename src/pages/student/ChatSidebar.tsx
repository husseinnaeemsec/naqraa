import { useEffect, useState } from "react";
import { HeroPenSquareIcon, HeroSearchIcon } from "../../components/Icons";
import ChatCard from "./ChatCard";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import type { ChatProps } from "../../../types";




export default function ChatSidebar() {

    const [chats,setChats] = useState<ChatProps[]>([])
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        api.get(endpoints.chat.list)
        .then((res)=>{
            setChats(res.data.results)
        })
        .finally(()=> setLoading(false) )
    },[])

    return (
        <div className="w-full lg:block hidden p-5 bg-white border-r h-full overflow-y-auto">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold"> الرسائل </h1>
                    <button>
                        <HeroPenSquareIcon className="size-5 text-slate-500 hover:text-slate-900 cursor-pointer" />
                    </button>
                </div>
                <div className="mt-5 relative flex items-center z-0">
                    <input placeholder="ابحث عن جهة اتصال" type="search" className="p-1.5 px-3 pr-10 bg-slate-100 w-full rounded-md" id="" />
                    <HeroSearchIcon className="size-5 absolute right-2 text-slate-400" />
                </div>
            </div>
            <div className="mt-5 space-y-2">
                {
                    loading && ( <div className="text-slate-500 h-20 my-auto items-center justify-center flex"> جاري تحميل جهات الاتصال... </div> )
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