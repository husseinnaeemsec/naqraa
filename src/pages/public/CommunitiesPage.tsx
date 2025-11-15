import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const mockCommunities = [
  {
    name: "مجتمع جامعة بغداد — هندسة برمجيات",
    members: 1240,
    desc: "نقاشات، ملفات، مشاريع تخرج، ملخصات، فرص تدريب، وكل جديد في تخصص هندسة البرمجيات.",
    image: "https://placehold.co/400x200/10b981/ffffff?text=Software+Engineering"
  },
  {
    name: "طب الأسنان — جامعة المستنصرية",
    members: 860,
    desc: "مراجع، مناقشات طبية، أسئلة امتحانات OSCE، وشرح عملي بالفيديو.",
    image: "https://placehold.co/400x200/3b82f6/ffffff?text=Dentistry"
  },
  {
    name: "كيمياء — جامعة البصرة",
    members: 450,
    desc: "أسئلة سنوات سابقة، ملخصات مختبر، مناقشة التجارب العلمية.",
    image: "https://placehold.co/400x200/f59e0b/ffffff?text=Chemistry"
  },
  {
    name: "علوم الحاسبات — جامعة الموصل",
    members: 670,
    desc: "تجارب مشاريع، مصادر تعلم، مسابقات برمجية، وأخبار مجال AI.",
    image: "https://placehold.co/400x200/8b5cf6/ffffff?text=Computer+Science"
  },
];

export default function PublicCommunitiesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredCommunities = mockCommunities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const sectionsRef = useRef([]);

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      if (!section) return;
      gsap.fromTo(
        section,
        { opacity: 0, y: 70 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%" },
        }
      );
    });
  }, []);

  return (
    <div className="bg-white text-gray-900" dir="rtl">
      
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      {/* HERO */}
      <section
        ref={(el) => {
          sectionsRef.current[0] = el
        }}
        className="container mx-auto px-6 py-20 text-center"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold text-slate-900 mb-6"
        >
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">مجتمعات نقــرأ التعليمية</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-700 text-lg max-w-2xl mx-auto mt-4 leading-relaxed"
        >
          انضم إلى مجتمع جامعتك أو تخصصك الدراسي — شارك الملفات، المناقشات، الملخصات، 
          وابدأ بالتعلم ضمن بيئة تعليمية تفاعلية تجمع الطلاب والأساتذة في مكان واحد.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center gap-4 mt-10"
        >
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            إنشاء مجتمع جديد
          </button>
          <button className="border border-emerald-600 text-emerald-700 hover:bg-emerald-100 px-8 py-3 rounded-xl text-lg transition-all duration-200 shadow-md">
            تعرّف على المجتمعات
          </button>
        </motion.div>
      </section>

      {/* SEARCH + FILTER */}
      <section
        ref={(el) => {
          sectionsRef.current[1] = el
        }}
        className="container mx-auto px-6 pb-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="ابحث عن مجتمع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-900 placeholder-slate-500"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
          >
            <option value="all">كل المجتمعات</option>
            <option value="university">جامعات</option>
            <option value="college">كليات</option>
            <option value="specialty">تخصصات</option>
          </select>
        </motion.div>
      </section>

      {/* COMMUNITIES LIST */}
      <section className="container mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCommunities.map((c, i) => (
          <motion.article
            key={i}
            ref={(el) => {
              sectionsRef.current[i + 2] = el
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 * i }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
          >
            <img 
              src={c.image} 
              alt={c.name} 
              className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
            />

            <h2 className="text-xl font-bold text-slate-900 mb-3">{c.name}</h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{c.desc}</p>
            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-500 text-sm">{c.members} عضو</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                نشط
              </span>
            </div>

            <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-3 font-medium transition-all duration-200 transform hover:scale-105 shadow-md">
              انضم الآن
            </button>
          </motion.article>
        ))}
      </section>

      {/* CTA */}
      <section
        ref={(el) => {
          sectionsRef.current[50] = el
        }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-20"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold mb-4"
        >
          لا تجد مجتمعك؟
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-2xl mx-auto mb-8 text-emerald-100 text-lg"
        >
          اطلب إنشاء مجتمع جديد وسيتم التواصل معك خلال 24 ساعة.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-white text-emerald-700 font-semibold text-lg rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg"
        >
          اطلب إنشاء مجتمع
        </motion.button>
      </section>
    </div>
  );
}
