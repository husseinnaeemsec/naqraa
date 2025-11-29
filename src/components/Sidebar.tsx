import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logoutUser } from "../store/auth/authSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { emeraldColors } from "../colors";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { endpoints } from "../api/routes";
import { toggleSidebar } from "../store/uiSlice";
import { HeroXIcon } from "./Icons";

const Alert = withReactContent(Swal);

interface SidebarLinkProps {
  children: ReactNode;
  link: string;
}
const SidebarLink = ({ link, children }: SidebarLinkProps) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  //  Always called, no conditional hook
  useEffect(() => {
    const normalize = (path: string) => path.replace(/\/+$/, ""); // remove trailing /
    const currentPath = normalize(location.pathname);
    const targetPath = normalize(link);
    setIsActive(currentPath === targetPath);
  }, [location.pathname, link]);

  return (
    <Link
      to={link}
      className={`sidebar-link relative z-0 ${isActive ? "active-sidebar-link" : ""}`}
    >
      {children}
    </Link>
  );
};


export default function Sidebar() {
  const { notifications } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch();
  const { showSidebar } = useAppSelector(state => state.ui);
  const { t } = useTranslation();

  const links = [
    { link: "/dashboard/", icon: "fi fi-rr-home", label: t("sidebar.dashboard") },
    { link: "/dashboard/courses/", icon: "fi fi-rr-play-alt", label: t("sidebar.courses") },
    { link: "/dashboard/exams/", icon: "fi fi-rr-quiz-alt", label: t("sidebar.exams") },
    { link: "/dashboard/quizzes/", icon: "fi fi-rr-lightbulb-question", label: t("sidebar.quizzes") },
    { link: "/dashboard/timetable/", icon: "fi fi-rr-calendar", label: t("sidebar.timetable") },
    { link: "/dashboard/attendance/", icon: "fi fi-rr-check-circle", label: t("sidebar.attendance") },
    { link: "/dashboard/homework", icon: "fi fi-rr-memo-circle-check", label: t("sidebar.homework") },
    { link: "/dashboard/notifications/", messages: notifications.filter(n => n.read === false).length, icon: "fi fi-rr-bell", label: t("sidebar.notifications") },
    { link: "/dashboard/org/", icon: "fi fi-rr-building", label: t("sidebar.organization") },
    { link: "/dashboard/subscription/", icon: "fi fi-rr-credit-card", label: t("sidebar.subscription") },
    { link: "/dashboard/communities/", icon: "fi fi-rr-users-class", label: t("sidebar.community") },
    { link: "/dashboard/files/", icon: "fi fi-rr-folder", label: t("sidebar.files") },
    { link: "/dashboard/settings/", icon: "fi fi-rr-user-gear", label: t("sidebar.settings") },

  ];

  const handleLogout = () => {
    Alert.fire({
      title: t('sidebar.logout_confirm_title'),
      text: t('sidebar.logout_confirm_text'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t('sidebar.logout_confirm_yes'),
      cancelButtonText: t('sidebar.logout_confirm_cancel'),
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
        api.post(endpoints.user.logout)
          .then((_res) => {
            dispatch(logoutUser());
            Alert.fire({
              title: t('sidebar.logout_success'),
              icon: "success",
              confirmButtonColor: "#059669",
            });
          })
          .catch((e) => {
            Alert.fire({
              title: t('sidebar.logout_failed'),
              icon: "error",
              confirmButtonColor: "#059669",
            });
          })

      }
    });
  };

  return (
    <aside className={`sidebar ${showSidebar ? "translate-x-0" : "translate-x-full"}  lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <nav className="w-full h-full flex flex-col justify-between">
        <ul className="flex flex-col  items-center justify-center gap-y-3 py-5">
          <div className="flex w-full items-center justify-between self-start mb-4 mt-2 px-2">
            <Link to={'/'} className="flex cursor-pointer gap-2 items-center  px-2">
              <img src={'/favicon.svg'} alt="" className="w-10" />
              <div>
                <p className="text-slate-600"> {t('sidebar.slogan')} </p>
              </div>
            </Link>
            <button className="cursor-pointer lg:hidden block" onClick={() => { dispatch(toggleSidebar()) }}>
              <HeroXIcon className="size-6" />
            </button>
          </div>
          {links.map(({ link, icon, label, messages = 0 }) => (
            <li key={link} className="w-full">
              <SidebarLink link={link}>
                <i className={`${icon} text-xl`} />
                <span>{label}</span>
                {messages > 0 && (
                  <span className="rounded-full absolute right-0 -top-1 text-[10px] bg-rose-500 text-white flex items-center justify-center size-5">
                    {messages >= 100 ? "+99" : messages}
                  </span>
                )}
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
