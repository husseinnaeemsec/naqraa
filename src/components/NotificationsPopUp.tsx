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
      } else if (Notification.permission === "denied") {
        setHasPermission(false);
        setLoading(false);
        setShow(false); // don’t keep showing if they denied
      } else {
        // permission = default
        setLoading(false);
        setShow(true);
      }
    } else {
      setLoading(false);
      setShow(false); // notifications not supported
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
            icon: "/logo192.png",
          });
        }
        setShow(false);
      } catch (error) {
        console.error("Notification error:", error);
        setShow(false);
      }
    }
  };

  if (loading || !show) return null;

  return (
    <div className="fixed z-50 inset-0 w-full h-full bg-black/30 backdrop-blur-xs flex items-center justify-center">
      <div className="w-full relative z-0 max-w-xl text-center flex flex-col gap-3 items-center justify-center bg-white rounded-md p-4">
        {/* Close button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-5 right-5 hover:bg-slate-200 rounded cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        <img src={notificationsImage} alt="" className="max-w-56 object-cover" />
        <h1 className="text-2xl font-bold">تفعيل الاشعارات</h1>
        <p className="max-w-sm">
          الرجاء تفعيل الأشعارات لتصلك التنبيهات الخاصة بمؤسستك التعليمية و اخر
          دوراتنا
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={askForPermission}
            className="p-2 flex items-center gap-2 transition-colors font-semibold cursor-pointer px-4 rounded bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            تفعيل الاشعارات
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
              />
            </svg>
          </button>
          <button
            onClick={() => setShow(false)}
            className="p-2 px-4 hover:bg-rose-600 bg-rose-500 transition-colors text-white rounded"
          >
            الغاء
          </button>
        </div>


      </div>
    </div>
  );
}
