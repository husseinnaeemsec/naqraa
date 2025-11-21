import { useState } from "react";
import { ErrorNote, SectionHeader, Success } from "../pages/student/SettingsPage";
import { endpoints } from "../api/routes";
import api from "../api/client";
import { useAppSelector } from "../store/store";
import { TourProvider, useTour } from "@reactour/tour";
import { useTranslation } from "react-i18next";

export default function ChangePasswordSection() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const steps = [
    { selector: "#send-reset-btn", content: t("settings.change_password.tour.step1") }
  ];

  const { setIsOpen } = useTour();

  const [loading, setLoading] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);


  const [emailSent, setEmailSent] = useState(false);

  const sendResetEmail = async () => {
    setLoading(true);
    setPwdError(null);
    setPwdSaved(false);
    try {
      await api.post(endpoints.user.requestPasswordChange, { email: user?.email });
      setEmailSent(true);
      setPwdSaved(true);
    } catch (err: any) {
      if (err.response) {
        setPwdError(err.response.data.error);
      } else {
        setPwdError(t("settings.change_password.errors.send_failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TourProvider steps={steps}>
      <div id="password" className="bg-white dark:bg-emerald-950 border dark:border-emerald-800 border-emerald-300 rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between">
          <SectionHeader icon={<i className="fi fi-rr-lock text-2xl"></i>} title={t("settings.change_password.title")} />
          <button
            className="flex items-center gap-2 text-emerald-600 font-medium mb-4"
            onClick={() => setIsOpen(true)}
          >
            <i className="fi fi-rr-question text-sm"></i>
            {t("settings.change_password.tour.button")}
          </button>
        </div>

        <div className="space-y-4">
          {pwdSaved && (
            <Success>
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني ({user?.email}). يرجى التأكد من بريدك واتباع التعليمات.
            </Success>
          )}
          {pwdError && <ErrorNote>{pwdError}</ErrorNote>}

          {/* Current Email Display */}
          <div>
            <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
              البريد الإلكتروني المسجل
            </label>
            <div className="w-full px-4 py-2 bg-slate-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-800 rounded-lg text-slate-700 dark:text-emerald-100">
              {user?.email}
            </div>
          </div>

          {/* Send Reset Email Button */}
          <div>
            <button
              id="send-reset-btn"
              type="button"
              onClick={sendResetEmail}
              disabled={loading}
              className="p-3 px-5 bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-slate-400 disabled:cursor-not-allowed cursor-pointer rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جارٍ الإرسال...
                </>
              ) : (
                <>
                  <i className="fi fi-rr-envelope text-sm"></i>
                  إرسال رابط إعادة تعيين كلمة المرور
                </>
              )}
            </button>
            <p className="mt-2 text-slate-600 dark:text-emerald-100/70 text-sm">
              سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. اتبع التعليمات في البريد لإنشاء كلمة مرور جديدة.
            </p>
          </div>

          {emailSent && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <i className="fi fi-rr-info text-emerald-600 text-lg mt-1"></i>
                <div>
                  <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">
                    تحقق من بريدك الإلكتروني
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    لم تستلم البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها أو المهملات.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TourProvider>
  );
}
