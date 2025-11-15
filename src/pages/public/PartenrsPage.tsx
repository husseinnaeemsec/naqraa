import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const PARTNERS_DATA = [
  { id: 1, name: "جامعة بغداد", type: "organizations", description: "شريك رسمي في التدريب", img: "https://via.placeholder.com/100" },
  { id: 2, name: "أحمد علي", type: "teachers", description: "مدرب برمجة Web", img: "https://via.placeholder.com/100" },
];

export default function PartnersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const type = searchParams.get("type") || "all";

  const filtered = PARTNERS_DATA.filter((p) => {
    const matchesType = type === "all" || p.type === type;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">شركاء نقرا</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            نعمل مع مؤسسات تعليمية ومدرسين متميزين لتقديم تجربة تعليمية متكاملة وفعالة للطلاب.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-lg border border-slate-200"
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({ type: "all" })}
              className={`px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-105 ${
                type === "all"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSearchParams({ type: "teachers" })}
              className={`px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-105 ${
                type === "teachers"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              المدرسين
            </button>
            <button
              onClick={() => setSearchParams({ type: "organizations" })}
              className={`px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:scale-105 ${
                type === "organizations"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              المؤسسات
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="ابحث عن شريك..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-900 placeholder-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * p.id }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:-translate-y-2"
              >
                <div className="p-8 text-center">
                  <div className="relative mb-6">
                    <img 
                      src={p.img} 
                      alt={p.name} 
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-slate-100 group-hover:border-emerald-400 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{p.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{p.description}</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                    عرض التفاصيل
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-3 text-center py-16"
            >
              <div className="text-slate-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.168-5.616-2.949" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">لا توجد نتائج</h3>
              <p className="text-slate-500">جرب تغيير الفلاتر أو البحث للعثور على الشركاء المطلوبين</p>
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">تريد أن تصبح شريكاً معنا؟</h2>
          <p className="text-emerald-100 mb-8 text-lg max-w-2xl mx-auto">
            انضم إلى شبكة شركاء نقرا وساعدهم في تطوير التعليم الرقمي. نحن نرحب بالمؤسسات التعليمية والمدرسين المتميزين.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition duration-200 transform hover:scale-105 shadow-lg">
              ابدأ التعاون
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition duration-200 shadow-lg">
              تعرف على شروط الشراكة
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
