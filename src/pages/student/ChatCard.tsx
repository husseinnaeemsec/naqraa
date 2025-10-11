import { useEffect, useState } from "react";
import type { ChatProps } from "../../../types"
import {  timeSince } from "../../utils/functions"
import { Link, useLocation } from "react-router-dom";



export default function ChatCard({ chat }: { chat: ChatProps }) {
    const [hash, setHash] = useState(window.location.hash);
    const [isActive,setIsActive] = useState(false);
    const location = useLocation()

    useEffect(() => {
        if(location.pathname.endsWith("/")){
            if(location.pathname === `/dashboard/chat/${chat.id}/`) setIsActive(true)
        }else if(location.pathname === `/dashboard/chat/${chat.id}`) setIsActive(true)
    }, []);


    return (
        <Link to={`/dashboard/chat/${chat.id}/`} className={` ${isActive ? 'bg-slate-100' :'' }  }  flex gap-2 w-full p-2  rounded-md`}>
            <img src={chat.user_avatar || ""} alt={chat.chat_name} className="size-12 rounded-full bg-emerald-100" />
            {/*  */}
            <div className="flex flex-col  flex-1">
                {/*  */}
                <div className="flex items-center justify-between">
                    <p className="text-semibold"> {chat.chat_name} </p>
                    <span className="text-slate-500 text-xs"> {timeSince(chat.updated_at)} </span>
                </div>
                {/*  */}
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-400"> {chat.last_msg?.text || 'ابدأ  المحادثة'} </p>
                </div>
            </div>
            {/*  */}
        </Link>
    )
}