import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  avatar: string|null|undefined;
  online: boolean;
  onBack?: () => void; // optional for mobile back button
}

export default function ChatHeader({ name, avatar, online, onBack }: ChatHeaderProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <div className="w-full  hidden lg:block bg-white border-b border-r sticky top-0 z-10 p-3">
      <div className="flex items-center gap-3">
        {/* Back button (optional) */}
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Back"
          >
            <ArrowLeft
              className={`size-5 text-slate-600 ${isRTL ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {/* Avatar */}
        <img
          src={
            avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
          }
          alt={name}
          className="size-12 rounded-full bg-emerald-500"
        />

        {/* User Info */}
        <div className="flex flex-col">
          <p className="font-semibold text-slate-800">{name}</p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div
              className={`size-2 rounded-full ${
                online ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span>{online ? "متصل" : "غير متصل"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
