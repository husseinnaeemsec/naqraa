import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { endpoints } from "../api/routes";
import api from "../api/client";
import { setUser } from "../store/authSlice";
import { ErrorNote, SectionHeader, Success } from "../pages/student/SettingsPage";
import { useTranslation } from "react-i18next";

export default function AccountInformationSection() {
    const { user, loadingUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
  // ----- Profile / Basic Info (existing) -----
    const [first_name, setFirstName] = useState(user?.first_name);
    const [last_name, setLastName] = useState(user?.last_name);
    const [errors, setErrors] = useState<string[]>([]);
    const [updated, setUpdated] = useState<boolean>(false);
    const [theme, setTheme] = useState(user?.profile?.theme);
    const [lang, setLang] = useState(user?.profile?.lang);
    const [avatar, setAvatar] = useState<File | null>(null);
    const {t} = useTranslation();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const isDirty = ()=>{
        const userData = {
            first_name: user?.first_name,
            last_name: user?.last_name,
            profile: {
                lang: user?.profile?.lang,
                theme: user?.profile?.theme,
            }
        }
        const data = {
            first_name,
            last_name,
            profile: {
                lang,
                theme,
            }
        }

        return JSON.stringify(userData) !== JSON.stringify(data);
    }

    const updateUserData = () => {
        setErrors([]);
        setUpdated(false);

        if(!isDirty()){
            return;
        }

        if (!first_name || !last_name ) {
            setErrors(["الرجاء التحقق من جميع الحقول قبل ارسال المعلومات"]);
            return;
        }

        // ✅ Create FormData for multipart/form-data
        const formData = new FormData();
        formData.append("first_name", first_name || "");
        formData.append("last_name", last_name || "");
        formData.append("profile.lang", lang || "");
        formData.append("profile.theme", theme || "");

        if (avatar) {
            // Your nested serializer expects: profile.avatar
            formData.append("profile.avatar", avatar);
        }

        api
            .post(endpoints.user.profile, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                setUpdated(true);
                dispatch(setUser(res.data));
            })
            .catch((e) => {
                setErrors(["فشل في حفظ البيانات"]);
            })
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
        }
    };
    return (
        <div id="account_information" className="bg-white  dark:bg-emerald-950 border dark:border-emerald-800 border-emerald-300 rounded-lg p-6 shadow-md">
            <SectionHeader icon={<i className="fi fi-rr-user text-2xl"></i>} title={t('settings.account_info.title')} />
            <div className="space-y-6" >
                {updated && errors.length === 0 && <Success>{t("account_info_saved")}</Success>}
                {errors.map((e, i) => (
                    <ErrorNote key={i}>{e}</ErrorNote>
                ))}

                {/* Profile Picture Upload */}
                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">{t("profile_picture")}</label>
                    <div className="flex items-center gap-4">
                        <img
                            src={avatar ? URL.createObjectURL(avatar) : (user?.profile?.profile_picture as string)}
                            className="w-16 h-16 text-2xl font-bold bg-emerald-100 rounded-full object-cover"
                            alt={user?.first_name?.[0] || "U"}
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            {t("change_profile_picture")}
                        </button>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    </div>
                </div>

                {/* First name */}
                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
                    {t("settings.account_info.first_name")}
                    </label>
                    <input
                        type="text"
                        value={first_name || ""}
                        onChange={(e) => setFirstName(e.currentTarget.value)}
                        className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Last name */}
                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
                    {t("settings.account_info.last_name")}
                    </label>
                    <input
                        type="text"
                        value={last_name || ""}
                        onChange={(e) => setLastName(e.currentTarget.value)}
                        className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Email (display only here; change in its own section) */}
                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
                    {t("settings.account_info.email")}
                    </label>
                    <input
                        type="email"
                        defaultValue={user?.email}
                        disabled
                        className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-200/60 mt-1">لتغيير البريد الإلكتروني استخدم قسم <button  className="underline cursor-pointer font-bold"> "تغيير البريد" </button> أدناه.</p>
                </div>

                {/* Theme */}
                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
                    {t("settings.account_info.theme")}
                    </label>
                    <select
                        className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        onChange={(e) => setTheme(e.currentTarget.value)}
                        value={theme || ""}
                    >
                        <option value="dark">
                            {t("settings.account_info.dark")}
                        </option>
                        <option value="light">
                            {t("settings.account_info.light")}
                        </option>
                    </select>
                </div>

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
                    {t("settings.account_info.language.label")}
                    </label>
                    <select
                        className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        onChange={(e) => setLang(e.currentTarget.value)}
                        value={lang || ""}
                    >
                        <option value="ar">عربي</option>
                        <option value="en">English</option>
                        <option value="ku">كوردي</option>
                    </select>
                </div>

                {/* Save button */}
                <button
                    disabled={loadingUser || !isDirty()}
                    onClick={updateUserData}
                    className="p-3 disabled:text-slate-500 disabled:cursor-not-allowed px-5 border text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-300 cursor-pointer rounded-md"
                >
                    {loadingUser ? t("saving_changes") : t("save")}
                </button>
            </div>
        </div>
    )
}