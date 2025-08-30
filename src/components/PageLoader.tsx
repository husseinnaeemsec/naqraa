import { motion } from "framer-motion";
import loader from "../assets/plug-and-play.svg";

interface Props {
  title?: string;
  message?: string;
  img?: string;
}

export default function PageLoader({ title, message, img }: Props) {
  const defaultTitle = "جاري التحميل";
  const defaultMessage = "الرجاء الانتظار بينما يتم تحميل الموارد";

  return (
    <motion.div
      className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center flex-col bg-white/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* 🔹 صورة اللودر مع حركة bounce */}
        <motion.img
          src={img || loader}
          className="w-full max-w-sm mx-auto"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />

        {/* 🔹 العنوان مع أنيميشن */}
        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {title || defaultTitle}
        </motion.h1>

        {/* 🔹 الرسالة مع fade-in */}
        <motion.p
          className="text-gray-500 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {message || defaultMessage}
        </motion.p>
      </div>
    </motion.div>
  );
}
