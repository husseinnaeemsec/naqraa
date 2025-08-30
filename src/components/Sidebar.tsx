import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { logoutUser } from "../store/authSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { emeraldColors } from "../colors";

const Alert = withReactContent(Swal);

interface SidebarLinkProps {
  children: ReactNode;
  isActive: boolean;
  link: string;
}

const SidebarLink = ({ link, children, isActive }: SidebarLinkProps) => {
  return (
    <Link
      to={link}
      className={`sidebar-link ${isActive ? "active-sidebar-link" : ""}`}
    >
      {children}
    </Link>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useAppDispatch();

  const isActive = (path: string) =>
    currentPath === path ||
    (currentPath.startsWith(path) && path.length === currentPath.length);

  const links = [
    { link: "/dashboard", icon: "fi fi-rr-home", label: "الرئيسية" },
    { link: "/dashboard/courses", icon: "fi fi-rr-play-alt", label: "الدورات التدريبية" },
    { link: "/dashboard/notifications", icon: "fi fi-rr-bell", label: " الاشعارات" },
    { link: "/dashboard/org", icon: "fi fi-rr-building", label: "المؤسسة" },
    { link: "/dashboard/exams", icon: "fi fi-rr-quiz-alt", label: "الاختبارات" },
    { link: "/dashboard/chat", icon: "fi fi-rr-messages", label: "الدردشة" },
    { link: "/dashboard/community", icon: "fi fi-rr-users-class", label: "المجتمع" },
    { link: "/dashboard/files", icon: "fi fi-rr-folder", label: "الملفات" },
    { link: "/dashboard/settings", icon: "fi fi-rr-user-gear", label: "الإعدادات" },
  ];

  const handleLogout = () => {
    Alert.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم تسجيل خروجك من الحساب",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، تسجيل الخروج",
      cancelButtonText: "إلغاء",
      background: document.documentElement.classList.contains("dark")
        ? emeraldColors['950']
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#e2e8f0"
        : "#0f172a",
      confirmButtonColor: emeraldColors['600'], // emerald-600
      cancelButtonColor: "#ef4444", // red-500
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logoutUser());
        Alert.fire({
          title: "تم تسجيل الخروج",
          icon: "success",
          confirmButtonColor: "#059669",
        });
      }
    });
  };

  return (
    <aside className="sidebar">
      <nav className="w-full h-full flex flex-col justify-between">
        <ul className="flex flex-col items-center justify-center gap-y-3 py-5">
          {links.map(({ link, icon, label }) => (
            <li key={link} className="w-full">
              <SidebarLink link={link} isActive={isActive(link)}>
                <i className={`${icon} text-xl`} />
                <span>{label}</span>
              </SidebarLink>
            </li>
          ))}
        </ul>
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="p-2 w-full dark:text-rose-200 text-rose-900 hover:bg-rose-50 cursor-pointer rounded-md flex items-center gap-2"
          >
            <i className="fi fi-rr-sign-out-alt text-lg"></i>
            <span> تسجيل خروج </span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
