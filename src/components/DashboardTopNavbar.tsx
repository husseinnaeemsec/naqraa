import { useNavigate,useLocation, Link } from "react-router-dom";
import type { Notification } from "../../types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getMedia } from "../utils/functions";
import { HeroBellIcon, HeroMenuIcon, HeroXIcon } from "./Icons";
import { useState } from "react";
import { toggleSidebar } from "../store/uiSlice";

function NotificationItem({ notification }: { notification: Notification }) {

    return (
        <div className="flex items-start px-3 gap-2 not-last:border-b pb-2 p-1 ">
            {!notification.profile_picture && (<div className="min-w-8 min-h-8 text-xs rounded-full border flex centred"> اشعار </div>)}
            {notification.profile_picture && (<img src={getMedia(notification.profile_picture)} alt="اشعار" className="min-w-8 min-h-8 text-xs border bg-white flex centred rounded-full" />)}
            <div>
                <h1 className="font-semibold"> {notification.title} </h1>
                <p className="text-slate-500 text-xs"> {notification.content} </p>
            </div>
        </div>
    )
}

export default function DashboardTopNavbar() {
    const { notifications } = useAppSelector(state => state.auth);
    const unread = notifications.filter(n => n.read === false);
    const [open, setOpen] = useState(false)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    if(location.pathname.startsWith('/dashboard/chat')){
        return <></>;
    }

    const handleClick = () => {
        setOpen(false);
        navigate(`/dashboard/notifications/`);
        
    }



    return (
        <nav className="flex items-center bg-white/50 sticky top-0 z-[10] backdrop-blur-xs border-b h-16 border-r justify-between lg:justify-around px-4 p-3">
            <div >
                <button className="lg:hidden block" onClick={()=>{ dispatch(toggleSidebar()) }}> <HeroMenuIcon className="size-6" /> </button>
            </div>
            <div className="flex items-center gap-2">
                <Link to="/courses/explore"> الدورات  </Link>
            </div>
            <div className="flex items-center gap-2 relative z-0">
                <button onClick={()=>{ setOpen(prev => !prev) }} className="relative z-0">
                    {unread.length > 0 && <div className="size-4 flex centred text-white absolute -top-2 left-0 bg-rose-500 rounded-full text-xs"> {unread.length} </div>}
                    <HeroBellIcon className="size-6 cursor-pointer" />
                </button>
                {
                    open && (
                        <div className="w-96   max-h-[450px] overflow-y-auto bg-white border rounded-md absolute left-0 top-[110%] shadow">
                            <h1 className="text-xl p-3 border-b flex items-center justify-between bg-slate-50 font-semibold sticky top-0 z-0">
                                الاشعارات
                                <button onClick={()=>{ setOpen(false) }}> <HeroXIcon className="size-5 cursor-pointer" /> </button>
                            </h1>
                            <ul className="flex flex-col  space-y-2">
                                {
                                    notifications.map((n) => <div key={n.id} className="cursor-pointer" onClick={handleClick}> <NotificationItem  notification={n} /> </div> )
                                }
                            </ul>
                            <div className="sticky bottom-0 p-2 bg-slate-50 border-t mt-2">
                                <button onClick={()=>{ setOpen(false) }} className="p-2 px-3 border bg-white"> اغلاق  </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </nav>
    )
}