import { useRef, useState } from "react";
import { useAppSelector } from "../../store/store";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import ChangePasswordSection from "../../components/ChangePasswordSection";
import AccountInformationSection from "../../components/AccountInformationSection";
import NotificationsSection from "../../components/NotificationsSection";
import ChangeEmailSection from "../../components/ChangeEmailSection";
import OrganizationSection from "../../components/OrganizationSection";
import { useTranslation } from "react-i18next";
import useApiErrorHandler from "../../hooks/use-api-error-handler";

gsap.registerPlugin(ScrollToPlugin);

// Small helpers
export const SectionHeader = ({ title, icon }: { title: string, icon?: any }) => (
    <h2 className="text-xl  p-2 z-10 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-100/70 mb-6">
        {icon}
        {title}
    </h2>
);

export const Success = ({ children }: { children: React.ReactNode }) => (
    <div className="p-3 px-5 dark:bg-emerald-700 bg-emerald-50 rounded-md border dark:border-emerald-600 border-emerald-500">
        <p>{children}</p>
    </div>
);

export const ErrorNote = ({ children }: { children: React.ReactNode }) => (
    <div className="p-3 px-5 dark:bg-rose-950 text-rose-500 bg-rose-50 rounded-md border dark:border-rose-600 border-rose-500">
        <p>{children}</p>
    </div>
);

export const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
            type="checkbox"
            className="peer sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        <span className="w-11 h-6 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center transition-all duration-200 peer-checked:bg-emerald-600">
            <span className="w-5 h-5 rounded-full bg-white shadow translate-x-0 peer-checked:translate-x-5 transition-all duration-200 ml-0.5" />
        </span>
        <span className="text-emerald-800 dark:text-emerald-100/70">{label}</span>
    </label>
);

// Settings Page Component
const SettingsPage = () => {
    useApiErrorHandler();
    const { user } = useAppSelector((state) => state.auth)
    const { t } = useTranslation();


    const tabs = [
        {
            text: t("settings.account_info.title"),
            link: '#account_information',
            icon: <i className="fi fi-rr-user"></i>
        },
        {
            text: t("settings.notifications.title"),
            link: '#notifications',
            icon: <i className="fi fi-rr-bell"></i>

        },
        {
            text: t("settings.change_password.title"),
            link: '#password',
            icon: <i className="fi fi-rr-lock"></i>
        },
        {
            text: t("settings.change_email.title"),
            link: '#email',
            icon: <i className="fi fi-rr-envelope"></i>
        },
        {
            text: t("settings.your_orgnization"),
            link: '#organization',
            icon: <i className="fi fi-rr-building"></i>
        }
    ]
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState<string>("#account_information");


    const handleScroll = (hash: string) => {
        const scroller = scrollerRef.current ?? window;          // fallback to window if you remove overflow-y-auto later
        const targetEl = document.querySelector(hash) as HTMLElement | null;
        if (!targetEl) return;

        gsap.to(scroller, {
            duration: 0.8,
            scrollTo: {
                y: targetEl,
                offsetY: 20
            },
            ease: "power2.out",
        });
    };


    return (
        <div ref={scrollerRef} className="grid grid-cols-1 lg:grid-cols-12  gap-5 overflow-y-auto h-nav pb-20 p-6 mx-auto">
            <div className="flex justify-between lg:col-span-12   items-center">
                <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-100/70">{t("settings.label")}</h1>
            </div>
            <aside className="max-h-fit h-20 lg:h-fit overflow-x-auto z-10  lg:col-span-2 gap-3 mb-5 lg:mb-0 items-center lg:items-start  dark:bg-emerald-950 rounded-md bg-white sticky top-0 p-3 flex lg:flex-col">
                {
                    tabs.map((tab) => {
                        return (
                            <button onClick={() => { handleScroll(tab.link); setActiveSection(tab.link) }} key={tab.link} className={`p-2 flex items-center gap-2 lg:min-w-full  border min-w-fit lg:text-base text-xs h-fit text-right rounded-md ${activeSection === tab.link ? 'dark:bg-emerald-700 bg-emerald-100 border-transparent ' : 'dark:bg-transparent  bg-white dashboard-box dark:hover:bg-emerald-800  hover:bg-emerald-50'} `}>
                                {tab.icon}{tab.text}
                            </button>
                        )
                    })
                }
            </aside>
            <div className="space-y-8 lg:col-span-10 pb-10">
                {/* ===== Account Info / Profile ===== */}
                <AccountInformationSection />

                {/* ===== Notifications ===== */}
                <NotificationsSection />

                {/* ===== Change Password ===== */}
                <ChangePasswordSection />

                {/* ===== Change Email ===== */}
                <ChangeEmailSection />

                {/* ===== Organization Settings (Naqraa) ===== */}
                <OrganizationSection />
            </div>
        </div>
    );
};

export default SettingsPage;
