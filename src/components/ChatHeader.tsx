import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "../store/store";
import type { ChatProps } from "../../types";
import { useEffect, useState } from "react";

interface ChatHeaderProps {
  name: string;
  avatar: string|null|undefined;
  online: boolean;
  onBack?: () => void; // optional for mobile back button
}

export default function ChatHeader({  chat }: { chat:ChatProps}) {
  const { i18n } = useTranslation();
  const {active_users} = useAppSelector(state=>state.chat);
  const [online,setOnline] = useState(false);
  const isRTL = i18n.dir() === "rtl";

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
