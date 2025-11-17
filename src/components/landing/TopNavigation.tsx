import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/store";
import { ComputerIcon, Menu, X, Search } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNavigation() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

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
            <Link
              to="/dashboard/"
              className="p-2 px-3 lg:px-4 flex items-center gap-2 rounded text-sm border border-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition whitespace-nowrap"
            >
              <ComputerIcon className="size-4" />
              لوحة التحكم
            </Link>
          )}
        </div>

        {/* Mobile Right Section */}
        <div className="flex md:hidden items-center gap-3">
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
            <Link
              to="/dashboard/"
              className="p-1.5 rounded border border-slate-400 hover:border-emerald-500 transition"
              aria-label="لوحة التحكم"
            >
              <ComputerIcon className="size-4" />
            </Link>
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
                <div className="border-t border-slate-200 pt-4">
                  <Link
                    to="/dashboard/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition font-medium"
                  >
                    <ComputerIcon className="size-4" />
                    لوحة التحكم
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