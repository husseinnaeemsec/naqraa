import { useState } from "react";
import { ErrorNote, SectionHeader, Success, Toggle } from "../pages/student/SettingsPage";
import { endpoints } from "../api/routes";
import api from "../api/client";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setUser } from "../store/authSlice";

export default function NotificationsSection() {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector((state)=>state.auth)

    // ----- Notifications Section -----
    const [notifSaved, setNotifSaved] = useState(false);
    const [notifError, setNotifError] = useState<string | null>(null);
    const [notifLoading, setNotifLoading] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState<boolean>(user?.profile?.email_notifications ?? true);
    const [pushNotifications, setPushNotifications] = useState<boolean>(user?.profile?.push_notifications ?? true);
    const [studyReminders, setStudyReminders] = useState<boolean>(user?.profile?.study_reminders ?? true);
    const [newsletter_notifications, setNewsletter] = useState<boolean>(user?.profile?.newsletter_notifications ?? false);
    const [reminderFrequency, setReminderFrequency] = useState<string>(user?.profile?.reminder_frequency || "daily");

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
            console.error(err);
            setNotifError("تعذر حفظ إعدادات الإشعارات");
        } finally {
            setNotifLoading(false);
        }
    };


    return (
        <div id="notifications" className="bg-white dark:bg-emerald-950 border dark:border-emerald-800 border-emerald-300 rounded-lg p-6 shadow-md">
            <SectionHeader icon={<i className="fi fi-rr-bell text-2xl"></i>} title="الإشعارات" />
            <div className="space-y-4">
                {notifSaved && <Success>تم حفظ إعدادات الإشعارات</Success>}
                {notifError && <ErrorNote>{notifError}</ErrorNote>}

                <div className="grid md:grid-cols-2 gap-4">
                    <Toggle checked={emailNotifications} onChange={setEmailNotifications} label="إشعارات البريد الإلكتروني" />
                    <Toggle checked={pushNotifications} onChange={setPushNotifications} label="إشعارات المتصفح/التطبيق" />
                    <Toggle checked={studyReminders} onChange={setStudyReminders} label="تذكيرات الدراسة" />
                    <Toggle checked={newsletter_notifications} onChange={setNewsletter} label="النشرة البريدية" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">تكرار التذكير</label>
                    <select
                        className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={reminderFrequency}
                        onChange={(e) => setReminderFrequency(e.target.value)}
                    >
                        <option value="daily">يومي</option>
                        <option value="weekly">أسبوعي</option>
                        <option value="monthly">شهري</option>
                    </select>
                </div>

                <button
                    onClick={saveNotifications}
                    disabled={notifLoading}
                    className="p-3 disabled:text-slate-500 disabled:cursor-not-allowed px-5 border text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-300 cursor-pointer rounded-md"
                >
                    {notifLoading ? "جارٍ الحفظ..." : "حفظ الإشعارات"}
                </button>
            </div>
        </div>
    )
}