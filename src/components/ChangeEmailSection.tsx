import { useState } from "react";
import { ErrorNote, SectionHeader, Success } from "../pages/student/SettingsPage";
import api from "../api/client";
import { endpoints } from "../api/routes";
import { setUser } from "../store/authSlice";
import { useAppDispatch } from "../store/store";


export default function ChangeEmailSection() {

    const dispatch = useAppDispatch()
    // ----- Email Change Section -----
    const [emailSaved, setEmailSaved] = useState(false);
    const [emailErr, setEmailErr] = useState<string | null>(null);
    const [emailLoading, setEmailLoading] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState(""); // if backend requires password confirmation

    const saveEmail = async () => {
        setEmailSaved(false);
        setEmailErr(null);

        if (!newEmail) {
            setEmailErr("يرجى إدخال بريد إلكتروني جديد");
            return;
        }

        setEmailLoading(true);
        try {
            const res = await api.post(endpoints.user.changeEmail, {
                new_email: newEmail,
                password: emailPassword || undefined,
            });
            // Some backends return updated user; if so, update store + local email field
            if (res?.data?.email) {
                // setEmail(res.data.email);
                dispatch(setUser(res.data));
            }
            setEmailSaved(true);
            setNewEmail("");
            setEmailPassword("");
        } catch (err: any) {
            console.error(err);
            setEmailErr("تعذر تغيير البريد الإلكتروني");
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <div id="email" className="bg-white dark:bg-emerald-950 border dark:border-emerald-800 border-emerald-300 rounded-lg p-6 shadow-md">
            <SectionHeader icon={<i className="fi fi-rr-envelope text-2xl"></i>} title="تغيير البريد" />
            <div className="space-y-4">
                {emailSaved && <Success>تم إرسال طلب تغيير البريد (تحقق من بريدك)</Success>}
                {emailErr && <ErrorNote>{emailErr}</ErrorNote>}

                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">البريد الإلكتروني الجديد</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">كلمة المرور (إن لزم التحقق)</label>
                    <input
                        type="password"
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <button
                    onClick={saveEmail}
                    disabled={emailLoading}
                    className="p-3 disabled:text-slate-500 disabled:cursor-not-allowed px-5 border text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-300 cursor-pointer rounded-md"
                >
                    {emailLoading ? "جارٍ الإرسال..." : "حفظ البريد"}
                </button>
            </div>
        </div>
    )
}