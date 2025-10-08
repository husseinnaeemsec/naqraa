import { useEffect, useState } from "react";
import notificationsImage from "../assets/notifications.svg";

export default function NotificationsPopUp() {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setHasPermission(true);
        setLoading(false);
        setShow(false);
        playTestSound();
      } else {
        // Ask for permission if default or denied
        setLoading(false);
        setShow(true);
      }
    } else {
      console.warn("Notifications not supported in this browser");
      setLoading(false);
      setShow(false);
    }
  }, []);

  const askForPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setHasPermission(true);
          new Notification("✅ تم تفعيل الاشعارات", {
            body: "سوف تصلك اخر التحديثات والتنبيهات مباشرة.",
            icon: "/favicon.svg",
          });
          playTestSound();
          setShow(false);
        } else {
          alert("⚠️ يجب تفعيل الاشعارات للاستمرار");
        }
      } catch (error) {
        console.error("Notification error:", error);
      }
    }
  };

  const playTestSound = () => {
    const audio = new Audio("/sounds/notification.mp3"); // replace with your sound
    audio.play().catch((err) => console.warn("Audio playback failed:", err));
  };

  if (loading || !show) return null;

  return (
    <div className="fixed z-50 inset-0 w-full h-full bg-black/30 backdrop-blur-xs flex items-center justify-center">
      <div className="w-full relative z-0 max-w-xl text-center flex flex-col gap-3 items-center justify-center bg-white rounded-md p-4">
        <img src={notificationsImage} alt="" className="max-w-56 object-cover" />
        <h1 className="text-2xl font-bold">تفعيل الاشعارات</h1>
        <p className="max-w-sm text-center">
          الرجاء تفعيل الأشعارات لتصلك التنبيهات الخاصة بمؤسستك التعليمية و اخر
          دوراتنا
        </p>

        <button
          onClick={askForPermission}
          className="p-2 flex items-center gap-2 transition-colors font-semibold cursor-pointer px-4 rounded bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          تفعيل الاشعارات والصوت
        </button>
      </div>
    </div>
  );
}
