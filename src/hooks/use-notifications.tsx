import { useEffect, useState, useRef } from "react";

interface NotificationMessage {
  title: string;
  content: string;
  timestamp: string;
}

export default function useNotifications() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/api/notifications/");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket opened");
      setReady(true);
      setLoading(false);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [data, ...prev]);
      } catch (err) {
        console.error("❌ Error parsing WS message", err);
      }
    };

    socket.onclose = () => {
      console.log("⚠️ WebSocket closed");
      setReady(false);
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error", err);
      setReady(false);
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, []);

  // Function to send messages if needed
  const sendMessage = (msg: object) => {
    if (socketRef.current && ready) {
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  return {
    ready,
    loading,
    messages,
    sendMessage,
  };
}
