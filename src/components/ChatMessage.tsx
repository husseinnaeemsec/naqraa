import { useTranslation } from "react-i18next";
import type { ChatMessageProps  } from "../../types";
import { timeSince } from "../utils/functions";
import { useAppSelector } from "../store/store";



export default function ChatMessage({ msg ,className }: { msg: ChatMessageProps , className?:string }) {
  if(!msg) return ;
  const { i18n } = useTranslation();
  const {user} = useAppSelector(state=>state.auth)
  const dir = i18n.dir(); // returns "rtl" or "ltr"
  const isRTL = dir === "rtl";

  // Determine flex direction dynamically
  // If Arabic (RTL) → my messages appear on left (like WhatsApp Arabic)
  // If English (LTR) → my messages appear on right
  const isMe = msg.sender.username === user?.username
  const reverse = (isMe && !isRTL) || (!isMe && isRTL) ? "flex-row-reverse" : ""; 

  return (
    <div
      id={`chat_message_${msg.id}`}
      className={`flex gap-3 w-full ${reverse} ${
        isMe ? "self-end" : "self-start"
      } ${className} `}
    >
      {/* Avatar */}
      <img
        src={msg.sender.profile_picture||''}
        alt={msg.sender.first_name}
        className="size-10 rounded-full bg-emerald-500 flex-shrink-0"
      />

      {/* Message bubble */}
      <div
        className={`flex flex-col gap-1 max-w-[70%] ${
          isMe
            ? isRTL
              ? "items-start text-left"
              : "items-end text-right"
            : isRTL
            ? "items-end text-right"
            : "items-start text-left"
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            {msg.sender.first_name} {msg.sender.last_name}
          </p>
          <span>{timeSince(msg.created_at)}</span>
        </div>

        <p
          className={`p-3 rounded-2xl shadow-sm ${
            isMe
              ? "bg-emerald-500 text-white rounded-br-none"
              : "bg-white text-slate-800 rounded-bl-none"
          }`}
        >
          {msg.text}
        </p>


      </div>
    </div>
  );
}
