import { useEffect, useRef, useState, useCallback } from "react";
import type { ChatProps, ChatMessageProps } from "../../types";
import ChatMessage from "./ChatMessage";
import api from "../api/client";
import { endpoints } from "../api/routes";
import Spinner from "./Spinner";
import { Virtuoso } from "react-virtuoso";
import { useAppDispatch } from "../store";
import { setActiveUsers } from "../store/chatSlice";
import { updateURLParams } from "../utils/urls";
import PageLoader from "./PageLoader";


export default function ChatMessages({
  chat,
  socket,
}: {
  chat: ChatProps;
  socket: WebSocket | null;
}) {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch()

  const virtuosoRef = useRef<any>(null);

  // ---------------------------
  // 1️⃣ Fetch initial messages
  // ---------------------------
  useEffect(() => {
    if (!chat?.id) return;

    const fetchInitial = async () => {
      try {
        const res = await api.get(endpoints.chat.getMessages(chat.id));
        // Keep chronological order: oldest first
        const results = res.data.results || [];
        setMessages(results);
        setNextPage(updateURLParams(res.data.next,{ page_size:10 }) || null);

        // Scroll to bottom after initial load
        if (results.length > 0) {
          setTimeout(() => {
            virtuosoRef.current?.scrollToIndex({
              index: results.length - 1,
              align: "end",
            });
          }, 50);
        }
      } catch (err: any) {
        if (err.response?.status === 404) setError("لم يتم العثور على المحادثة");
        else setError("حدث خطأ في تحميل الرسائل");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [chat.id]);

  // ---------------------------
  // 2️⃣ Handle new messages (WebSocket)
  // ---------------------------
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (e: MessageEvent) => {
      const data: ChatMessageProps = JSON.parse(e.data);
      if (!data) return;
      // Message data received
      if(data.type === 'initial_data' || data.type === 'active_users_update') {
        dispatch(setActiveUsers(data.active_users || []))
        return;
      }

      setMessages((prev) => {
        const updated = [...prev, data]; // append newest
        // scroll to bottom
        setTimeout(() => {
          virtuosoRef.current?.scrollToIndex({
            index: updated.length - 1,
            align: "end",
            behavior: "smooth",
          });
        }, 50);
        return updated;
      });
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  // ---------------------------
  // 3️⃣ Load older messages (pagination)
  // ---------------------------
  const loadOlderMessages = useCallback(async () => {
    if (!nextPage || loadingOlder || !virtuosoRef.current) return;

    setLoadingOlder(true);
    const scroller = virtuosoRef.current.scrollContainer;
    const prevScrollHeight = scroller?.scrollHeight ?? 0;

    try {
      const res = await api.get(nextPage);
      // prepend older messages
      const results = res.data.results || [];
      setMessages((prev) => [...results, ...prev]);
      setNextPage(updateURLParams(res.data.next,{ page_size:10 }) || null);

      // maintain scroll position
      setTimeout(() => {
        const newScrollHeight = scroller?.scrollHeight ?? 0;
        const diff = newScrollHeight - prevScrollHeight;
        if (scroller) scroller.scrollTop = diff;
      }, 0);
    } catch (err) {
      // Error loading older messages
    } finally {
      setLoadingOlder(false);
    }
  }, [nextPage, loadingOlder]);

  // ---------------------------
  // 4️⃣ Render states
  // ---------------------------
  if (loading)
    return (
      <PageLoader
        message="الرجاء الانتظار ..."
        title="جاري تحميل المحادثات"
      />
    );

  if (error)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold text-rose-500">خطأ</h1>
        <p className="text-slate-500">{error}</p>
      </div>
    );

  // ---------------------------
  // 5️⃣ Main render
  // ---------------------------
  return (
    <div className="flex-1 h-full p-6 pb-0">
      {!messages.length && (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-slate-500">لا توجد رسائل بعد. ابدأ المحادثة الآن!</p>
        </div>
      )}
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: "100%" }}
        data={messages} // oldest → newest
        totalCount={messages.length}
        initialTopMostItemIndex={messages.length - 1} // scroll bottom
        followOutput="auto"
        increaseViewportBy={{ top: 200, bottom: 0 }}
        scrollerRef={(el) => {
          if (!el) return;
          // Scroll listener for near-top loading
          el.addEventListener("scroll", () => {
            if ((el as HTMLElement).scrollTop < 50 && !loadingOlder) {
              loadOlderMessages();
            }
          });
        }}
        components={{
          Header: () =>
            loadingOlder ? (
              <div className="flex justify-center py-2">
                <Spinner />
              </div>
            ) : null,
        }}
        itemContent={(_index, msg) => (
          <div id={`chat_message_${msg.id}`} className="min-h-[20px] my-2">
            <ChatMessage msg={msg} />
          </div>
        )}
      />
    </div>
  );
}
