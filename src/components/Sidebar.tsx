import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { logoutUser } from "../store/authSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { emeraldColors } from "../colors";
import { useTranslation } from "react-i18next";

const Alert = withReactContent(Swal);

interface SidebarLinkProps {
  children: ReactNode;
  link: string;
}

const SidebarLink = ({ link, children }: SidebarLinkProps) => {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const normalize = (path: string) => path.replace(/\/+$/, ""); // remove trailing /
    const currentPath = normalize(location.pathname);
    const targetPath = normalize(link);

    setIsActive(currentPath === targetPath);
  }, [location.pathname, link]);

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
  const {t} = useTranslation();

  const isActive = (path: string) =>
    currentPath === path ||
    (currentPath.startsWith(path) && path.length === currentPath.length);

  const links = [
    { link: "/dashboard/", icon: "fi fi-rr-home", label:t("sidebar.dashboard")},
    { link: "/dashboard/courses/", icon: "fi fi-rr-play-alt", label: t("sidebar.courses") },
    { link: "/dashboard/timetable/", icon: "fi fi-rr-calendar", label: t("sidebar.timetable") },
    { link: "/dashboard/todo/", icon: "fi fi-rr-memo-circle-check", label: t("sidebar.todo") },
    { link: "/dashboard/notifications/", icon: "fi fi-rr-bell", label: t("sidebar.notifications") },
    { link: "/dashboard/org/", icon: "fi fi-rr-building", label: t("sidebar.organization") },
    { link: "/dashboard/exams/", icon: "fi fi-rr-quiz-alt", label: t("sidebar.quizzes") },
    { link: "/dashboard/chat/", icon: "fi fi-rr-messages", label: t("sidebar.chat") },
    { link: "/dashboard/communties/", icon: "fi fi-rr-users-class", label: t("sidebar.community") },
    { link: "/dashboard/files/", icon: "fi fi-rr-folder", label:t("sidebar.files") },
    { link: "/dashboard/settings/", icon: "fi fi-rr-user-gear", label: t("sidebar.settings") },
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
        <ul className="flex flex-col  items-center justify-center gap-y-3 py-5">
          {links.map(({ link, icon, label }) => (
            <li key={link} className="w-full">
              <SidebarLink link={link} >
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
            <span>{t("logout")}</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
