import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import SendMessagesComponent from "./SendMessagesComponent";
import ResourceLoader from "./resourceLoader";
import { type ChatProps } from "../../types";
import api from "../api/client";
import { endpoints, ws_endpoints } from "../api/routes";

export default function Chat() {
  const { t } = useTranslation();
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
        title={t('chat.error')}
        message={t('chat.invalid_chat_id')}
      />
    );
  }

  useEffect(() => {
    let isMounted = true;

    const fetchChat = async () => {
      try {
        const res = await api.get(endpoints.chat.get(chatIdNum));

        if (!res?.data) {
          throw new Error(t('chat.not_found'));
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
            setError(t('chat.connection_failed'));
            setLoading(false);
          }
        };

        socket.onclose = () => {
          console.log("❌ Chat socket closed");
          socketRef.current = null;
          if (isMounted) {
            setError(t('chat.connection_lost'));
            setLoading(false);
          }
        };
      } catch (err: any) {
        console.error("Chat fetch error:", err);
        if (isMounted) {
          setError(t('chat.loading_failed'));
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
    return <ResourceLoader text={t('chat.please_wait')} title={t('chat.loading_chat')} />;
  }

  // ❌ Error
  if (error || !chat) {
    return <ErrorView title={t('chat.error')} message={error || t('chat.not_found')} />;
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
  const { t } = useTranslation();
  
  return (
    <div className="w-full h-full flex items-center gap-2 flex-col justify-center">
      <h1 className="text-2xl text-rose-500 font-semibold">{title}</h1>
      <p className="text-slate-500">{message}</p>
      <button
        onClick={() => window.location.reload() }
        className="p-2 px-3 border rounded-md border-slate-300 cursor-pointer hover:bg-slate-100"
      >
        {t('chat.retry')}
      </button>
    </div>
  );
}
