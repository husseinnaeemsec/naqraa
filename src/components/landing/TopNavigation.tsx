import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { Computer, ComputerIcon } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";

export default function TopNavigation() {

  const { isAuthenticated } = useAppSelector(state => state.auth);



  return (
    <nav className="flex items-center justify-between  h-18  px-6 md:px-12   bg-slate-50/50 backdrop-blur-xs sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Naqraa Logo" className="w-14 md:w-16" />
      </Link>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
        {/* TODO: Add mega menus later */}
        <Link to="/" className="hover:text-emerald-600 transition"> الرئيسية</Link>
        <Link to="/about" className="hover:text-emerald-600 transition">من نحن</Link>
        <Link to="/courses" className="hover:text-emerald-600 transition">الدورات</Link>
        <Link to="/plans" className="hover:text-emerald-600 transition">خطط الاشتراك</Link>
        <Link to="/features" className="hover:text-emerald-600 transition">مميزات المنصة</Link>
        <Link to="/resources" className="hover:text-emerald-600 transition">الموارد</Link>
        <Link to="/contact" className="hover:text-emerald-600 transition">اتصل بنا</Link>
      </div>

      {/* Auth buttons */}
      {!isAuthenticated ? (
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          <div className="flex items-center gap-2">
            <Link
              to="/register"
              className="p-2 px-4 rounded text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition"
            >
              إنشاء حساب
            </Link>

            <Link
              to="/login"
              className="p-2 px-4 rounded text-sm border border-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition"
            >
              دخول
            </Link>
          </div>
        </div>

      ) :
        (
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/"
              className="p-2 px-4 flex items-center gap-2 rounded text-sm border border-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition"
            >
              <ComputerIcon className="size-4" />
              لوحة التحكم
            </Link>
          </div>
        )
      }
    </nav>
  );
}
