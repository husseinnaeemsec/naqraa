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
    { selector: "#send-pin-btn", content: t("settings.change_password.tour.step1") },
    { selector: "#pin-input", content: t("settings.change_password.tour.step2") },
    { selector: "#new-password-input", content: t("settings.change_password.tour.step3") },
    { selector: "#confirm-password-input", content: t("settings.change_password.tour.step4") },
    { selector: "#save-password-btn", content: t("settings.change_password.tour.step5") }
  ];

  const { setIsOpen } = useTour();

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
      await api.post(endpoints.user.requestPasswordChange, { email: user?.email });
      setPinSent(true);
    } catch (err: any) {
      if (err.response) {
        setPwdError(err.response.data.error);
      } else {
        setPwdError(t("settings.change_password.errors.send_failed"));
      }
    }
  };

  const savePassword = async () => {
    setPwdSaved(false);
    setPwdError(null);

    if (!pinCode || !newPassword || !confirmPassword) {
      setPwdError(t("settings.change_password.errors.missing_fields"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError(t("settings.change_password.errors.passwords_mismatch"));
      return;
    }

    setPwdLoading(true);
    try {
      await api.post(endpoints.user.changePassword, {
        email: user?.email,
        pin_code: pinCode,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setPwdSaved(true);
      setPinCode("");
      setNewPassword("");
      setConfirmPassword("");
      setPinSent(false);
    } catch (err: any) {
      setPwdError(t("settings.change_password.errors.save_failed"));
    } finally {
      setPwdLoading(false);
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
          {pwdSaved && <Success>{t("settings.change_password.success")}</Success>}
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
              {pinSent ? t("settings.change_password.pin_sent") : t("settings.change_password.send_pin")}
            </button>
            <p className="mt-2 text-muted text-sm">{t("settings.change_password.send_pin_help")}</p>
          </div>

          {/* PIN Code */}
          <div>
            <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-100/70 mb-2">
              {t("settings.change_password.pin_label")}
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
              {t("settings.change_password.new_password")}
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
              {t("settings.change_password.confirm_password")}
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
            {pwdLoading ? t("settings.change_password.saving") : t("settings.change_password.save_button")}
          </button>
        </div>
      </div>
    </TourProvider>
  );
}
