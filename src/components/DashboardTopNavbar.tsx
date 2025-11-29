import React, { useState } from "react";
import { useNavigate,useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FileText, Calendar, MessageCircle, User, Home, ChevronDown } from "lucide-react";
import type { Notification } from "../../types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getMedia } from "../utils/functions";
import { HeroBellIcon, HeroMenuIcon, HeroXIcon } from "./Icons";
import { toggleSidebar } from "../store/uiSlice";

function UserProfileMenu() {
    const { t } = useTranslation();
    const { user } = useAppSelector(state => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    
    const profileMenuItems = [
        { label: t('dashboard_navbar.profile'), action: () => navigate('/dashboard/settings') },
        { label: t('dashboard_navbar.settings'), action: () => navigate('/dashboard/settings') },
        { label: t('dashboard_navbar.help'), action: () => navigate('/help') },
        { label: t('dashboard_navbar.logout'), action: () => navigate('/logout'), danger: true },
    ];
    
    // Use a ref to get the button position and position the dropdown with a fixed container if needed
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-colors"
            >
                {user?.profile?.profile_picture ? (
                    <img 
                        src={getMedia(user.profile.profile_picture)} 
                        alt={user.first_name} 
                        className="size-8 rounded-full border-2 border-emerald-200 dark:border-emerald-700 object-cover"
                    />
                ) : (
                    <div className="size-8 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
                        <User className="size-4 text-emerald-600 dark:text-emerald-300" />
                    </div>
                )}
                <ChevronDown className={`size-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-xl shadow-lg overflow-hidden z-[9999] max-h-[80vh] overflow-y-auto"
                        
                        style={{ minWidth: '14rem', maxWidth: '90vw' }}
                    >
                        <div className="p-4 border-b border-emerald-100 dark:border-emerald-800">
                            <div className="flex items-center gap-3">
                                {user?.profile?.profile_picture ? (
                                    <img 
                                        src={getMedia(user.profile.profile_picture)} 
                                        alt={user.first_name} 
                                        className="size-10 rounded-full border-2 border-emerald-200 dark:border-emerald-700 object-cover"
                                    />
                                ) : (
                                    <div className="size-10 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
                                        <User className="size-5 text-emerald-600 dark:text-emerald-300" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-emerald-50">
                                        {user?.first_name} {user?.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-emerald-400">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-2">
                            {profileMenuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        item.action();
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-right px-3 py-2 rounded-lg transition-colors ${
                                        item.danger 
                                            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                            : 'text-gray-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800/30'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MobileNavMenu() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    
    const navItems = [
        { to: '/dashboard', icon: Home, label: t('dashboard_navbar.dashboard') },
        { to: '/courses/explore', icon: BookOpen, label: t('dashboard_navbar.courses') },
        { to: '/resources', icon: FileText, label: t('dashboard_navbar.resources') },
        { to: '/dashboard/exams', icon: Calendar, label: t('dashboard_navbar.exams') },
        { to: '/dashboard/community', icon: MessageCircle, label: t('dashboard_navbar.community') },
    ];
    
    return (
        <div className="relative ">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-all duration-200"
            >
                <BookOpen className="size-4" />
                <span className="font-medium">{t('dashboard_navbar.menu')}</span>
                <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute  right-0 top-full mt-2 w-64 bg-white dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-xl shadow-lg overflow-hidden z-50"
                    >
                        <div className="p-2 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-all duration-200 group"
                                    >
                                        <Icon className="size-4 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function NotificationItem({ notification }: { notification: Notification }) {
    const { t } = useTranslation();

    return (
        <div className="flex items-start px-3 gap-2 not-last:border-b pb-2 p-1 ">
            {!notification.profile_picture && (<div className="min-w-8 min-h-8 text-xs rounded-full border flex centred"> {t('dashboard_navbar.notification')} </div>)}
            {notification.profile_picture && (<img src={getMedia(notification.profile_picture)} alt={t('dashboard_navbar.notification')} className="min-w-8 min-h-8 text-xs border bg-white flex centred rounded-full" />)}
            <div>
                <h1 className="font-semibold"> {notification.title} </h1>
                <p className="text-slate-500 text-xs"> {notification.content} </p>
            </div>
        </div>
    )
}

export default function DashboardTopNavbar() {
    const { t } = useTranslation();
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
        <nav className="flex items-center bg-white/80 dark:bg-emerald-900/80 sticky top-0 z-[10] backdrop-blur-md border-b border-emerald-200/50 dark:border-emerald-700/50 h-16 justify-between px-4 shadow-sm">
            <div >
                <button className="lg:hidden block" onClick={()=>{ dispatch(toggleSidebar()) }}> <HeroMenuIcon className="size-6" /> </button>
            </div>
            <div className="hidden md:flex items-center gap-6">
                <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-all duration-200 group"
                >
                    <Home className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{t('dashboard_navbar.dashboard')}</span>
                </Link>
                
                <Link 
                    to="/courses/explore" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-all duration-200 group"
                >
                    <BookOpen className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{t('dashboard_navbar.courses')}</span>
                </Link>
                
                <Link 
                    to="/resources" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-all duration-200 group"
                >
                    <FileText className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{t('dashboard_navbar.resources')}</span>
                </Link>
                
                <Link 
                    to="/dashboard/exams" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-all duration-200 group"
                >
                    <Calendar className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{t('dashboard_navbar.exams')}</span>
                </Link>
                
                <Link 
                    to="/dashboard/community" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-all duration-200 group"
                >
                    <MessageCircle className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{t('dashboard_navbar.community')}</span>
                </Link>
            </div>
            
            <div className="md:hidden relative">
                <MobileNavMenu />
            </div>
            <div className="flex items-center gap-3 relative z-0">
                <UserProfileMenu />
                
                <button onClick={()=>{ setOpen(prev => !prev) }} className="relative z-0 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-colors">
                    {unread.length > 0 && (
                        <motion.div 
                            className="size-5 flex items-center justify-center text-white absolute -top-1 -right-1 bg-rose-500 rounded-full text-xs font-bold"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        > 
                            {unread.length > 9 ? '9+' : unread.length} 
                        </motion.div>
                    )}
                    <HeroBellIcon className="size-6 cursor-pointer text-gray-700 dark:text-emerald-100" />
                </button>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="w-96 max-h-[450px] overflow-y-auto bg-white dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-xl shadow-xl absolute left-0 top-[110%] z-50"
                        >
                            <div className="p-4 border-b border-emerald-100 dark:border-emerald-800 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 sticky top-0 z-10">
                                <h1 className="text-lg font-bold text-gray-900 dark:text-emerald-50 flex items-center gap-2">
                                    <HeroBellIcon className="size-5" />
                                    {t('dashboard_navbar.notifications')}
                                </h1>
                                <button 
                                    onClick={() => setOpen(false)}
                                    className="p-1 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors"
                                > 
                                    <HeroXIcon className="size-5 text-gray-500 dark:text-emerald-400" /> 
                                </button>
                            </div>
                            
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <HeroBellIcon className="size-12 text-gray-300 dark:text-emerald-600 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-emerald-400">{t('dashboard_navbar.no_notifications')}</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-emerald-100 dark:divide-emerald-800">
                                    {notifications.map((n, index) => (
                                        <motion.div 
                                            key={n.id} 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-800/30 transition-colors" 
                                            onClick={handleClick}
                                        > 
                                            <NotificationItem notification={n} /> 
                                        </motion.div>
                                    ))}
                                </ul>
                            )}
                            
                            {notifications.length > 0 && (
                                <div className="sticky bottom-0 p-3 bg-gradient-to-t from-emerald-50 to-transparent dark:from-emerald-900/20 border-t border-emerald-100 dark:border-emerald-800">
                                    <button 
                                        onClick={() => setOpen(false)} 
                                        className="w-full p-2 px-4 border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-emerald-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700 transition-colors font-medium text-gray-700 dark:text-emerald-100"
                                    > 
                                        {t('dashboard_navbar.close')} 
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}