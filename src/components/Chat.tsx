import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import SendMessagesComponent from "./SendMessagesComponent";
import ResourceLoader from "./resourceLoader";
import { type ChatProps } from "../../types";
import api from "../api/client";
import { endpoints, ws_endpoints } from "../api/routes";

export default function Chat() {
  const { chatId } = useParams();
  const [chat, setChat] = useState<ChatProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatIdNum = Number(chatId);
  const socketRef = useRef<WebSocket | null>(null);

  // 🧩 Handle invalid chat ID
  if (isNaN(chatIdNum)) {
    return (
      <ErrorView
        title="خطأ"
        message="معرف المحادثة غير صالح"
      />
    );
  }

  useEffect(() => {
    let isMounted = true;

    const fetchChat = async () => {
      try {
        const res = await api.get(endpoints.chat.get(chatIdNum));

        if (!res?.data) {
          throw new Error("لم يتم العثور على المحادثة");
        }

        if (!isMounted) return;

        setChat(res.data);

        // 🔌 Connect WebSocket
        const socket = new WebSocket(ws_endpoints.chat(chatIdNum));

        socket.onopen = () => {
          if (!isMounted) return;
          console.log("✅ Connected to chat:", chatIdNum);
          socketRef.current = socket;
          setLoading(false);
        };

        socket.onerror = (err) => {
          console.error("⚠️ WebSocket error:", err);
          socketRef.current = null;
          if (isMounted) {
            setError("فشل الاتصال بالخادم");
            setLoading(false);
          }
        };

        socket.onclose = () => {
          console.log("❌ Chat socket closed");
          socketRef.current = null;
          if (isMounted) {
            setError("تم قطع الاتصال بالخادم");
            setLoading(false);
          }
        };
      } catch (err: any) {
        console.error("Chat fetch error:", err);
        if (isMounted) {
          setError("تعذر تحميل المحادثة");
          setLoading(false);
        }
      }
    };

    fetchChat();

    return () => {
      isMounted = false;
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [chatIdNum]);

  // ⏳ Loading
  if (loading) {
    return <ResourceLoader text="الرجاء الانتظار ..." title="جاري تحميل المحادثة" />;
  }

  // ❌ Error
  if (error || !chat) {
    return <ErrorView title="خطأ" message={error || "لم يتم العثور على المحادثة"} />;
  }

  // ✅ Connected and ready
  return (
    <div className="w-full h-full overflow-y-auto flex flex-col">
      <ChatHeader
      chat={chat}
      />
      <ChatMessages socket={socketRef.current} chat={chat} />
      <SendMessagesComponent socket={socketRef.current} />
    </div>
  );
}

function ErrorView({ title, message }: { title: string; message: string }) {
  return (
    <div className="w-full h-full flex items-center gap-2 flex-col justify-center">
      <h1 className="text-2xl text-rose-500 font-semibold">{title}</h1>
      <p className="text-slate-500">{message}</p>
      <button
        onClick={() => window.location.reload() }
        className="p-2 px-3 border rounded-md border-slate-300 cursor-pointer hover:bg-slate-100"
      >
        اعادة المحاولة 
      </button>
    </div>
  );
}
