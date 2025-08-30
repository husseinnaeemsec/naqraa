import { useState } from "react";
import { ErrorNote, SectionHeader, Success } from "../pages/student/SettingsPage";
import { endpoints } from "../api/routes";
import api from "../api/client";
import { useAppSelector } from "../store/store";
import { TourProvider, useTour } from "@reactour/tour";

const steps = [
    {
        selector: "#send-pin-btn",
        content: "اضغط لإرسال رمز التحقق إلى بريدك الإلكتروني.",
    },
    {
        selector: "#pin-input",
        content: "أدخل رمز التحقق الذي وصلك عبر البريد الإلكتروني.",
    },
    {
        selector: "#new-password-input",
        content: "أدخل كلمة مرور جديدة قوية وسهلة التذكر.",
    },
    {
        selector: "#confirm-password-input",
        content: "قم بتأكيد كلمة المرور الجديدة.",
    },
    {
        selector: "#save-password-btn",
        content: "اضغط هنا لحفظ كلمة المرور الجديدة.",
    },
];

function TourButton() {
    const { setIsOpen } = useTour();
    return (
        <button
            className="flex items-center gap-2 text-emerald-600 font-medium mb-4"
            onClick={() => setIsOpen(true)}
        >
            <i className="fi fi-rr-question text-sm"></i>
            كيفية تغيير كلمة المرور
        </button>
    );
}

export default function ChangePasswordSection() {
    const { user } = useAppSelector((state) => state.auth);

    const [pwdSaved, setPwdSaved] = useState(false);
    const [pwdError, setPwdError] = useState<string | null>(null);
    const [pwdLoading, setPwdLoading] = useState(false);

    const [pinCode, setPinCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pinSent, setPinSent] = useState(false);

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const sendPin = async () => {
        setPwdError(null);
        try {
            await api.post(endpoints.user.requestPasswordChange, { email:user?.email });
            setPinSent(true);
        } catch (err: any) {
            if(err.response){
                setPwdError(err.response.data.error)
            }else{
                setPwdError("تعذر إرسال رمز التحقق");
            }
        }
    };

    const savePassword = async () => {
        setPwdSaved(false);
        setPwdError(null);

        if (!pinCode || !newPassword || !confirmPassword) {
            setPwdError("الرجاء تعبئة جميع الحقول");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwdError("كلمتا المرور غير متطابقتين");
            return;
        }

        setPwdLoading(true);
        try {
            await api.post(endpoints.user.changePassword, {
                email: user?.email,
                pin_code: pinCode,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            setPwdSaved(true);
            setPinCode("");
            setNewPassword("");
            setConfirmPassword("");
            setPinSent(false);
        } catch (err: any) {
            if(err.response){
                console.log(err.response.data)
            }
            setPwdError("تعذر تغيير كلمة المرور");
        } finally {
            setPwdLoading(false);
        }
    };

    return (
        <TourProvider steps={steps}>
            <div id="password" className="bg-white dark:bg-emerald-950 border dark:border-emerald-800 border-emerald-300 rounded-lg p-6 shadow-md">
               <div className="flex items-center justify-between">
                 <SectionHeader
                    icon={<i className="fi fi-rr-lock text-2xl"></i>}
                    title="تغيير كلمة المرور"
                />

                <TourButton />
               </div>

                <div className="space-y-4">
                    {pwdSaved && <Success>تم تغيير كلمة المرور بنجاح</Success>}
                    {pwdError && <ErrorNote>{pwdError}</ErrorNote>}

                    {/* Send PIN */}
                    <div>
                        <button
                            id="send-pin-btn"
                            type="button"
                            onClick={sendPin}
                            disabled={pinSent}
                            className="p-2 px-4 bg-emerald-100 dark:bg-emerald-600 cursor-pointer dark:hover:bg-emerald-700 rounded dashboard-box disabled:opacity-50"
                        >
                            {pinSent ? "تم إرسال الرمز" : "ارسل رمز التحقق"}
                        </button>
                        <p className="mt-2 text-muted text-sm">
                            اضغط على الزر لإرسال رمز التحقق إلى بريدك الإلكتروني
                        </p>
                    </div>

                    {/* PIN Code */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
                            رمز التحقق
                        </label>
                        <input
                            id="pin-input"
                            type="text"
                            value={pinCode}
                            disabled={!pinSent}
                            onChange={(e) => setPinCode(e.target.value)}
                            className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {/* New password */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
                            كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                            <input
                                id="new-password-input"
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                disabled={!pinSent}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                            >
                                <i className="fi fi-rr-eye"></i>
                            </button>
                        </div>
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
                            تأكيد كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                            <input
                                id="confirm-password-input"
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                disabled={!pinSent}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-emerald-300 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                            >
                                <i className="fi fi-rr-eye"></i>
                            </button>
                        </div>
                    </div>

                    {/* Save button */}
                    <button
                        id="save-password-btn"
                        onClick={savePassword}
                        disabled={pwdLoading || !pinSent}
                        className="p-3 disabled:text-slate-500 disabled:cursor-not-allowed px-5 border text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-300 cursor-pointer rounded-md"
                    >
                        {pwdLoading ? "جارٍ التغيير..." : "حفظ كلمة المرور"}
                    </button>
                </div>
            </div>
        </TourProvider>
    );
}
