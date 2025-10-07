import { t } from "i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalContent = withReactContent(Swal);

interface AlertOptions {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

/* 🔰 Base Alert — internal */
const showAlert = (
  icon: "success" | "error" | "warning" | "info" | "question",
  options: AlertOptions
) => {
  const {
    title,
    text,
    confirmText = t("alert_confirm_button_text"),
    cancelText,
    onConfirm,
    onClose,
  } = options;

  SwalContent.fire({
    icon,
    title,
    text,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    showCancelButton: !!cancelText,
    confirmButtonColor: "#059669", // Emerald 600
    cancelButtonColor: "#6b7280", // Gray 500
    background: "#ecfdf5", // Emerald-50
    color: "#065f46", // Emerald-800
    customClass: {
      popup: "rounded-2xl shadow-lg border border-emerald-200",
      confirmButton: "rounded-md px-4 py-2 font-medium text-white",
      cancelButton:
        "rounded-md px-4 py-2 font-medium text-gray-800 bg-gray-100 hover:bg-gray-200",
      title: "text-lg font-semibold",
    },
  }).then((result) => {
    if (result.isConfirmed && onConfirm) onConfirm();
    if (result.isDismissed && onClose) onClose();
  });
};

/* ✅ Alert variants */
export const EmeraldAlert = (options: AlertOptions) =>
  showAlert("question", options);

export const SuccessAlert = (options: AlertOptions) =>
  showAlert("success", {
    ...options,
    title: options.title || "Success!",
    text: options.text || "Operation completed successfully.",
  });

export const ErrorAlert = (options: AlertOptions) =>
  showAlert("error", {
    ...options,
    title: options.title || "Something went wrong",
    text: options.text || "Please try again later.",
  });

export const WarningAlert = (options: AlertOptions) =>
  showAlert("warning", {
    ...options,
    title: options.title || "Are you sure?",
    text: options.text || "You cannot undo this action.",
    confirmText: options.confirmText || "Yes, continue",
    cancelText: options.cancelText || "Cancel",
  });

export const InfoAlert = (options: AlertOptions) =>
  showAlert("info", options);

export default {
  EmeraldAlert,
  SuccessAlert,
  ErrorAlert,
  WarningAlert,
  InfoAlert,
};
