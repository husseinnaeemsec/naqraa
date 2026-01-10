import { useAppSelector } from "../store/store";
import type { ChatProps } from "../../types";
import { useEffect, useState } from "react";



export default function ChatHeader({  chat }: { chat:ChatProps}) {
  const {active_users} = useAppSelector(state=>state.chat);
  const [online,setOnline] = useState(false);

  useEffect(()=>{
    setOnline(active_users.includes(chat.user_id))
  },[active_users])

  return (
    <div className="w-full  hidden lg:block bg-white border-b border-r sticky top-0 z-10 p-3">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <img
          src={
            chat.user_avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
          }
          alt={chat.chat_name}
          className="size-12 rounded-full bg-emerald-500"
        />

        {/* User Info */}
        <div className="flex flex-col">
          <p className="font-semibold text-slate-800">{chat.chat_name}</p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div
              className={`size-2 rounded-full ${
                online ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span>{online ? "متصل" : "غير متصل"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
