import { motion } from "framer-motion";
import { HeroBuildingLibraryIcon, HeroCommandLineIcon, HeroWrenchScrewdriverIcon } from "../../components/Icons";
import { useState, type FormEvent } from "react";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { extractErrors } from "../../utils/functions";



export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSent(false);

    if ([form.name, form.email, form.message].some(v => v.trim() === "")) {
      setErrors(["جميع الحقول مطلوبة."]);
      return;
    }

    try {
      setLoading(true);
      await api.post(endpoints.support.contact, form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });

    } catch (error: any) {
      setErrors(extractErrors(error));

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full min-h-screen bg-white text-slate-900 pt-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      {/* Hero */}
      <section className="text-center space-y-6 mb-16 sm:mb-20">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-emerald-700 leading-tight">
          تواصل معنا في نقرا
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
          هل لديك سؤال، اقتراح أو ترغب بالتعاون؟ نحن هنا لدعمك ومساعدتك في كل ما تحتاجه.
        </motion.p>
      </section>

      {/* Contact Form */}
      <section className=" bg-white max-w-4xl mx-auto  rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 shadow-xl mb-16">

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          أرسل رسالة مباشرة
        </motion.h2>

        {/* Alerts */}
        {errors.length > 0 && (
          <div className="bg-rose-500 text-red-50 p-3 rounded-xl mb-4 text-center">
            {errors.map((err, i) => <p key={i}>{err}</p>)}
          </div>
        )}

        {sent && (
          <div className="bg-white text-emerald-500 p-3 rounded-xl mb-4 text-center font-bold">
            تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-6">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="p-4 rounded-xl bg-slate-100 focus:ring-2 ring-emerald-400"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="p-4 rounded-xl bg-slate-100 focus:ring-2 ring-emerald-400"
            />
          </div>

          <textarea
            placeholder="اكتب رسالتك هنا..."
            rows={5}
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="p-4 rounded-xl bg-slate-100 focus:ring-2 ring-emerald-400 resize-none"
          />

          <button
            disabled={loading}
            className={`text-white bg-emerald-700 font-bold py-4 rounded-xl text-lg sm:text-xl transition duration-200
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600 hover:scale-105"}`}>
            {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
          </button>
        </form>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {[
          {
            title: "الدعم الفني",
            desc: "لأي مشاكل تقنية أو استفسارات حسابية، فريقنا هنا لمساعدتك بسرعة.",
            icon: <HeroWrenchScrewdriverIcon className="size-12 text-emerald-900" />,
            email: "support@naqraa.com"
          },
          {
            title: "شراكات وتعاون",
            desc: "تعاون معنا أو ممثل جهة تعليمية؟ تواصل معنا مباشرة.",
            icon: <HeroBuildingLibraryIcon className="size-12 text-emerald-900" />,
            email: "partners@naqraa.com"
          },
          {
            title: "مشاريع التخرج",
            desc: "للحصول على الدعم في مشروع التخرج أو تطوير فكرتك، نحن معك خطوة بخطوة.",
            icon: <HeroCommandLineIcon className="size-12 text-emerald-900" />,
            email: "fp@naqraa.com"
          }
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            className="border border-emerald-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">{c.icon}</div>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 mb-3">{c.title}</h3>
            <p className="text-slate-700 mb-4">{c.desc}</p>
            <p className="text-emerald-600 font-semibold break-all">{c.email}</p>
          </motion.div>
        ))}
      </section>

    </div>
  );
}
