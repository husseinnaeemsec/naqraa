import { useState } from "react"
import type { Notification  } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../store/store";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { setNotifications } from "../../store/authSlice";


export function NotificationItem({ notification }: { notification: Notification }) {
    const [open,setOpen] = useState(false);
    const {notifications} = useAppSelector(state=>state.auth);
    const dispatch = useAppDispatch();
    const handleOpen = async ()=>{
        
        try{
            const res = await api.post(endpoints.notifications.update(notification.id));
            dispatch(setNotifications([...notifications.filter(n => n.id !== notification.id),res.data]))
        }finally{
            setOpen(true);
        }
    }
    return (
        <div   className="flex items-center gap-3 p-3 border rounded-md dark:bg-emerald-900 bg-white">
            { open && (
                <div className="fixed inset-0 w-full h-full backdrop-blur-xs flex items-center justify-center z-[100] ">
                    <div onClick={()=>{ setOpen(false) }} className="absolute z-[-1] bg-white/20 w-full h-full backdrop-blur-xs"></div>
                    <div className="max-w-md space-y-2 w-full p-4 bg-white border rounded-md">
                        <h1 className="text-2xl font-semibold"> {notification.title} </h1>
                        <p>{notification.content}</p>
                        <button onClick={()=>{ setOpen(false) }} className="border rounded-md p-2 px-4"> اغلاق </button>
                    </div>
                </div>
            ) }
            
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
            <div className="cursor-pointer" onClick={handleOpen} >
                <h1 className="font-semibold flex gap-1">
                    {notification.title}
                    {!notification.read && <span className="size-[8px] block rounded-full bg-emerald-500"></span> } 
                </h1>
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
    const {notifications} = useAppSelector((state)=> state.auth );
    const unread_count = notifications.filter(n=>n.read === false).length

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
                        {tab.id === 'unread' && unread_count > 0 && ( <span className="text-sm font-bold"> {unread_count} </span> ) }
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
