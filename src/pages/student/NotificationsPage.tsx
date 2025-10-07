import { useEffect, useState } from "react"
import type { Notification  } from "../../../types";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { useAppSelector } from "../../store/store";

interface NotificationProps {
    id: number;
    type: 'system' | 'user' | 'org';
    from_user: null | {
        full_name: string;
        avatar: string;
    };
    title: string;
    content: null | string;
    timestamp: string;
    read: boolean;
}

function NotificationItem({ notification }: { notification: Notification }) {
    return (
        <div className=" relative z-0 flex items-center gap-3 p-3 border rounded-md dark:bg-emerald-900 bg-white">
            {!notification.read && <div className="size-[8px] absolute top-2   rounded-full bg-emerald-500"></div> }
            {notification.profile_picture ? (
                <img
                    src={notification.profile_picture||''}
                    alt={notification.sneder}
                    className="w-12 h-12 rounded-full"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                    {notification.type}
                </div>
            )}
            <div>
                <h1 className="font-semibold">{notification.title}</h1>
                {notification.content && <p className="text-slate-500 dark:text-emerald-100/70">{notification.content}</p>}
                <small className="text-slate-400 ">{notification.created_at}</small>
            </div>
        </div>
    );
}

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState("all");

    const tabs = [
        { title: "الكل", id: "all" },
        { title: "غير مقروئة", id: "unread" },
        { title: "مقروئة", id: "read" },
    ];

    // Dummy notifications
    const {notifications} = useAppSelector((state)=> state.auth )

    // Filter notifications based on active tab
    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "all") return true;
        if (activeTab === "unread") return !n.read;
        if (activeTab === "read") return n.read;
        return true;
    });



    return (
        <div className="space-y-8 p-6 mx-auto ">
            <h1 className="text-2xl font-bold text-emerald-800">الأشعارات</h1>
            <div className="mt-3 flex items-center gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`p-1 rounded-md border px-2 ${
                            activeTab === tab.id ? "bg-emerald-500 text-white" : "bg-white dark:bg-emerald-950"
                        }`}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            {/* Tabs content */}
            <div className="grid gap-2 mt-5">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))
                ) : (
                    <p className="text-slate-400 text-center mt-5">لا توجد إشعارات</p>
                )}
            </div>
        </div>
    );
}
