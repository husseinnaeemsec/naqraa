import { Link } from "react-router-dom";
import { getLogo } from "../utils/functions";

export default function StudentNavbar() {
  return (
    <nav className="student-navbar bg-white p-2 px-5 border-b border-r border-emerald-200 flex items-center justify-between">
      {/* Logo */}
      <Link
        to={"/"}
        className="rounded-md flex items-center gap-2 p-0 justify-center"
      >
        <img src={getLogo()} className="size-16" alt="Logo" />
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8 font-medium ">
        <Link to="/courses" className="hover:text-emerald-600 dark:hover:text-emerald-300">
          الدورات
        </Link>
        <Link to="/support" className="hover:text-emerald-600 dark:hover:text-emerald-300">
          الدعم
        </Link>
        <Link to="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-300">
          اتصل بنا
        </Link>
        <Link to="/about" className="hover:text-emerald-600 dark:hover:text-emerald-300">
          حول
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-5 hidden md:block">
        <input
          type="text"
          placeholder="ابحث عن دورة أو مورد..."
          className="w-full rounded-xl border border-emerald-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-5 text-xl text-emerald-700">
        <button className="relative">
          <i className="fi fi-rr-envelope"></i>
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>
        <button className="relative">
          <i className="fi fi-rr-bell"></i>
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            5
          </span>
        </button>
      </div>
    </nav>
  );
}
