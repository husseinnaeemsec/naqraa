import { useState } from "react";
import { HeroSendIcon } from "./Icons";

export default function SendMessagesComponent( { socket } : { socket:WebSocket|null; }  ){
    
    if(!socket) return;
    const [content,setContent] = useState<string>('')
    

    const handleSendMessage = ()=>{
        const text = (content || '').trim()
        if(!text) return;

        socket.send(JSON.stringify({
            message:text,
            type:"chat_message"
        }))

        setContent('');
    }
    

    return (
        <div className="w-full border-t border-r p-4 bg-white sticky bottom-0">
            <div className="flex items-center gap-2">
                <input autoFocus value={content} onKeyDown={(e)=>{ e.key.toLowerCase() === 'enter' ? handleSendMessage() : null }} onChange={(e)=>{ setContent(e.target.value) }}  type="text" placeholder="اكتب رسالتك" className="flex-1 px-3 p-1.5 bg-slate-100 rounded-xl" />
                <button onClick={handleSendMessage} className="size-8 rounded-full flex items-center justify-center bg-emerald-500 text-white">
                    <HeroSendIcon className="size-6 -rotate-[-180deg]" />
                </button>
            </div>

        </div>
    )
}