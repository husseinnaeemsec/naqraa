import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorNote, SectionHeader, Success, Toggle } from "../pages/student/SettingsPage";
import { endpoints } from "../api/routes";
import api from "../api/client";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setUser } from "../store/authSlice";

export default function NotificationsSection() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth)

    // ----- Notifications Section -----
    const [notifSaved, setNotifSaved] = useState(false);
    const [notifError, setNotifError] = useState<string | null>(null);
    const [notifLoading, setNotifLoading] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState<boolean>(user?.profile?.email_notifications ?? true);
    const [pushNotifications, setPushNotifications] = useState<boolean>(user?.profile?.push_notifications ?? true);
    const [studyReminders, setStudyReminders] = useState<boolean>(user?.profile?.study_reminders ?? true);
    const [newsletter_notifications, setNewsletter] = useState<boolean>(user?.profile?.newsletter_notifications ?? false);
    const [reminderFrequency, setReminderFrequency] = useState<string>(user?.profile?.reminder_frequency || "daily");

    const isDirty = ()=>{
        const userData = {
            email_notifications: user?.profile?.email_notifications,
            push_notifications: user?.profile?.push_notifications,
            study_reminders: user?.profile?.study_reminders,
            newsletter_notifications: user?.profile?.newsletter_notifications,
            reminder_frequency: user?.profile?.reminder_frequency,
        }
        const data = {
            email_notifications: emailNotifications,
            push_notifications: pushNotifications,
            study_reminders: studyReminders,
            newsletter_notifications: newsletter_notifications,
            reminder_frequency: reminderFrequency,
        }

        return JSON.stringify(userData) !== JSON.stringify(data);
    }

    const saveNotifications = async () => {
        setNotifSaved(false);
        setNotifError(null);
        setNotifLoading(true);


      

        try {
            const formData = new FormData();
            formData.append("profile.email_notifications", String(emailNotifications));
            formData.append("profile.push_notifications", String(pushNotifications));
            formData.append("profile.study_reminders", String(studyReminders));
            formData.append("profile.newsletter_notifications", String(newsletter_notifications));
            formData.append("profile.reminder_frequency", reminderFrequency);

            const res = await api.post(endpoints.user.profile, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setNotifSaved(true);
            if (res?.data) dispatch(setUser(res.data));
        } catch (err: any) {
            setNotifError(t('settings.notifications.save_error'));
        } finally {
            setNotifLoading(false);
        }
    };


    return (
        <div id="notifications" className="bg-white dark:bg-emerald-950 border dark:border-emerald-800 border-emerald-300 rounded-lg p-6 shadow-md">
            <SectionHeader icon={<i className="fi fi-rr-bell text-2xl"></i>} title={t('settings.notifications.title')} />
            <div className="space-y-4">
                {notifSaved && <Success>{t("settings.notifications.updated_notifications")}</Success>}
                {notifError && <ErrorNote>{notifError}</ErrorNote>}

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            className="npui-switch"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.currentTarget.checked)}
                            id="emailNotifications"
                        />
                        <label htmlFor="emailNotifications">{t("settings.notifications.email_notifications")}</label>
                    </div>

                    <div className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            className="npui-switch"
                            checked={pushNotifications}
                            onChange={(e) => setPushNotifications(e.currentTarget.checked)}
                            id="pushNotifications"
                        />
                        <label htmlFor="pushNotifications">{t("settings.notifications.push_notifications")}</label>
                    </div>

                    <div className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            className="npui-switch"
                            checked={studyReminders}
                            onChange={(e) => setStudyReminders(e.currentTarget.checked)}
                            id="studyReminders"
                        />
                        <label htmlFor="studyReminders">{t("settings.notifications.study_reminders")}</label>
                    </div>

                    <div className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            className="npui-switch"
                            checked={newsletter_notifications}
                            onChange={(e) => setNewsletter(e.currentTarget.checked)}
                            id="newsletter"
                        />
                        <label htmlFor="newsletter">
                            {t("settings.notifications.newsletter")}
                        </label>
                    </div>

                </div>

                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
                    {t("settings.notifications.repeat_reminders")}
                    </label>
                    <select
                        className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={reminderFrequency}
                        onChange={(e) => setReminderFrequency(e.target.value)}
                    >
                        <option value="daily">
                            {t("settings.notifications.repeat_reminders_options.daily")}
                        </option>
                        <option value="weekly">
                            {t("settings.notifications.repeat_reminders_options.weekly")}
                        </option>
                        <option value="monthly">
                            {t("settings.notifications.repeat_reminders_options.monthly")}
                        </option>
                    </select>
                </div>

                <button
                    onClick={saveNotifications}
                    disabled={notifLoading || !isDirty()}
                    className="p-3 disabled:text-slate-500 disabled:cursor-not-allowed px-5 border text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-300 cursor-pointer rounded-md"
                >
                    {notifLoading ? t("saving_changes"): t("save")}
                </button>
            </div>
        </div>
    )
}