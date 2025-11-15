import { motion } from "framer-motion";

export default function AboutUsPage() {
  return (
    <div className="w-full min-h-screen bg-white text-slate-800 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      {/* Hero Section */}
      <section className="w-full py-24 flex flex-col items-center justify-center text-center relative">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
        >
          عن منصة نقرأ
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-4xl text-lg sm:text-xl md:text-2xl leading-relaxed text-slate-700 mx-auto px-6"
        >
          نقرأ هي منصة تعليمية عراقية تهدف إلى توفير مصادر تعليمية موثوقة، محتوى تفاعلي، ومجتمع يساعد الطلبة على تطوير مهاراتهم وبناء مستقبلهم المهني.
        </motion.p>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-emerald-200 rounded-full opacity-10 animate-pulse"></div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.99l-.707.707M7.5 12h8.5" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">رؤيتنا</h2>
            <p className="text-xl leading-relaxed text-slate-700">
              نسعى إلى بناء بيئة تعليمية ذكية تساعد الطلبة في العراق والعالم العربي على الوصول للمعرفة بسهولة، وتحويل العملية التعليمية إلى تجربة ممتعة وفعّالة.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">مهمتنا</h2>
            <p className="text-xl leading-relaxed text-slate-700">
              توفير الأدوات الذكية، المصادر التعليمية، دعم المشاريع، والمجتمع التفاعلي الذي يساعد الطالب على التعلم، الإبداع، والتميز.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
          >
            ماذا نقدم في منصة نقرأ
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "مصادر تعليمية كاملة",
                desc: "ملخصات، ملازم، كتب رسمية، أسئلة سنوات مع الحلول، كل ما يحتاجه الطالب بصيغة منظمة وسهلة الوصول.",
                icon: "📚"
              },
              {
                title: "محتوى تفاعلي ومرئي",
                desc: "شرح مبسط، فيديوهات قصيرة، أمثلة عملية، وميزات تساعد على الفهم بدلاً من الحفظ.",
                icon: "🎥"
              },
              {
                title: "مجتمع تعليمي فعال",
                desc: "مجموعات، نقاشات، تبادل خبرات، حلول جماعية للمشاكل الدراسية.",
                icon: "👥"
              },
              {
                title: "خدمة مشاريع التخرج",
                desc: "نوفر دعم كامل لمشاريع التخرج البرمجية، أفكار مبتكرة، تصميم وتنفيذ، تدريب عملي، وتسليم احترافي.",
                icon: "💡"
              },
              {
                title: "أدوات الذكاء الاصطناعي",
                desc: "إنشاء اختبارات، تلخيص الدروس، تحليل المحتوى وتقديم مصادر ذكية مخصصة للطالب.",
                icon: "🤖"
              },
              {
                title: "منصة للمنظمات والمؤسسات",
                desc: "إدارة المدارس والجامعات، توزيع المحتوى، متابعة تقدم الطلبة، وغرف تواصل مخصصة.",
                icon: "🏛️"
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="p-8 rounded-2xl shadow-md bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-2"
              >
                <div className="text-4xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                <p className="text-lg text-slate-700 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ending */}
      <section className="py-24 bg-gradient-to-r from-emerald-900 to-teal-800 text-white text-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full"></div>
        </div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
        >
          نحن نؤمن أن التعليم يصنع المستقبل
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-4xl mx-auto text-xl leading-relaxed text-emerald-100 mb-10 px-6"
        >
          هدفنا هو تمكين كل طالب من التعلم، التطور، وبناء مسار مهني قوي يبدأ اليوم.
        </motion.p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-white text-emerald-900 rounded-2xl text-2xl font-bold hover:bg-emerald-50 transition-all duration-200 shadow-lg"
        >
          ابدأ الآن
        </motion.button>
      </section>
    </div>
  );
}
