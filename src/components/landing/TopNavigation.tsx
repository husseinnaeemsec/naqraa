import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/store";
import { Menu, X, Search, TriangleAlert, Bell, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMedia } from "../../utils/functions";

export default function TopNavigation() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigationLinks = [
    { to: "/", label: t('navigation.home') },
    { to: "/about", label: t('navigation.about') },
    { to: "/courses", label: t('navigation.courses') },
    { to: "/plans", label: t('navigation.subscriptionPlans') },
    { to: "/features", label: t('navigation.platformFeatures') },
    { to: "/resources", label: t('navigation.resources') },
    { to: "/contact", label: t('navigation.contact') },
  ];

  return (
    <>
        <div>
          {/* Note: tell users that this website is a work in progress */}
          <p className="text-sm   flex items-center gap-2 p-3 bg-amber-50  border-b justify-center border-amber-500 text-amber-800 italic">
            <TriangleAlert className="inline-block mr-1" />
            {t('dashboard_index.work_in_progress',{
              contact:<Link to={'mailto:husseinnaeemsec@gmail.com'}> تواصل مع حسين نعيم </Link>
            })}
            
          </p>
        </div>
      <nav className="flex items-center justify-between h-16 lg:h-20 px-4 md:px-6 lg:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100 ">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.svg" alt="Naqraa Logo" className="w-10 md:w-14 lg:w-16" />
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden lg:block w-full max-w-md mx-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-emerald-500" />
            <input 
              type="search" 
              placeholder="ابحث في المنصة..." 
              className="p-3 w-full pr-10 bg-emerald-50/50 backdrop-blur-sm border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder:text-emerald-400" 
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-700">
          {navigationLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className="hover:text-emerald-600 transition whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {!isAuthenticated ? (
            <>
              <LanguageSwitcher />
              <div className="flex items-center gap-2">
                <Link
                  to="/register"
                  className="p-2 px-3 lg:px-4 rounded text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition whitespace-nowrap"
                >
                  إنشاء حساب
                </Link>
                <Link
                  to="/login"
                  className="p-2 px-3 lg:px-4 rounded text-sm border border-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition whitespace-nowrap"
                >
                  دخول
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Notifications */}
              <div className="relative" ref={notificationsMenuRef}>
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-emerald-50 transition-colors relative"
                  aria-label="الإشعارات"
                >
                  <Bell className="size-5 text-slate-600" />
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-200">
                        <h3 className="font-bold text-slate-900">{t('navigation.notifications')}</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {/* Sample notifications */}
                        <Link
                          to="/dashboard/notifications"
                          className="block p-4 hover:bg-emerald-50 transition-colors border-b border-slate-100"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          <p className="text-sm font-medium text-slate-900">إشعار جديد</p>
                          <p className="text-xs text-slate-500 mt-1">لديك مهمة جديدة يجب إكمالها</p>
                        </Link>
                        <Link
                          to="/dashboard/notifications"
                          className="block p-4 text-center text-sm text-emerald-600 hover:bg-emerald-50 transition-colors font-medium"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          عرض كل الإشعارات
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => {
                    setProfileMenuOpen(!profileMenuOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-emerald-50 transition-colors"
                  aria-label="الملف الشخصي"
                >
                  {user?.profile?.avatar ? (
                    <img
                      src={getMedia(user.profile.avatar)}
                      alt={`${user.first_name} ${user.last_name || ''}`}
                      className="w-8 h-8 rounded-full object-cover border-2 border-emerald-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="size-5 text-emerald-600" />
                    </div>
                  )}
                  <span className="hidden lg:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.first_name} {user?.last_name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-200">
                        <p className="font-bold text-slate-900 truncate">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <LayoutDashboard className="size-4" />
                          <span className="text-sm font-medium">لوحة التحكم</span>
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Settings className="size-4" />
                          <span className="text-sm font-medium">الإعدادات</span>
                        </Link>
                        <Link
                          to="/logout"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors border-t border-slate-100"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <LogOut className="size-4" />
                          <span className="text-sm font-medium">تسجيل الخروج</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Mobile Right Section */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchVisible(!searchVisible)}
            className="p-2 rounded-xl hover:bg-emerald-50 transition-colors"
            aria-label="البحث"
          >
            <Search className="size-5 text-emerald-600" />
          </button>

          {/* Mobile Auth Buttons */}
          {!isAuthenticated && (
            <Link
              to="/login"
              className="text-sm px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium"
            >
              دخول
            </Link>
          )}

          {isAuthenticated && (
            <>
              {/* Mobile Notifications */}
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl hover:bg-emerald-50 transition-colors relative"
                aria-label="الإشعارات"
              >
                <Bell className="size-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Mobile Profile */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-1 rounded-xl hover:bg-emerald-50 transition-colors"
                aria-label="الملف الشخصي"
              >
                {user?.profile?.avatar ? (
                  <img
                    src={getMedia(user.profile.avatar)}
                    alt={`${user.first_name} ${user.last_name || ''}`}
                    className="w-7 h-7 rounded-full object-cover border-2 border-emerald-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="size-4 text-emerald-600" />
                  </div>
                )}
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-emerald-50 transition-colors"
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {mobileMenuOpen ? (
              <X className="size-6 text-emerald-600" />
            ) : (
              <Menu className="size-6 text-emerald-600" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {searchVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-slate-50 border-b border-slate-200 px-4 py-3 sticky top-16 z-40"
          >
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="search" 
                placeholder="ابحث في المنصة..." 
                className="p-3 w-full pr-10 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" 
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-slate-200 sticky top-16 z-40 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Navigation Links */}
              <div className="space-y-1 mb-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              {!isAuthenticated && (
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full p-3 text-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition font-medium"
                  >
                    {t('auth.createNewAccount')}
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full p-3 text-center rounded-lg border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition font-medium"
                  >
                    {t('auth.login')}
                  </Link>
                  <div className="flex justify-center pt-2">
                    <LanguageSwitcher />
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full p-3 rounded-lg border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition font-medium"
                  >
                    <LayoutDashboard className="size-4" />
                    لوحة التحكم
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full p-3 rounded-lg border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition font-medium"
                  >
                    <Settings className="size-4" />
                    الإعدادات
                  </Link>
                  <Link
                    to="/logout"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full p-3 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    <LogOut className="size-4" />
                    تسجيل الخروج
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}