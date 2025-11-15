import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen bg-white text-slate-800 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10" />

      {/* Hero Section */}
      <section className="w-full py-24 flex flex-col items-center justify-center text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
        >
          الشروط والأحكام
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-3xl text-lg sm:text-xl md:text-2xl leading-relaxed text-slate-700 mx-auto px-6"
        >
          باستخدامك لمنصة نقرأ، فإنك توافق على الامتثال لهذه الشروط. يرجى قراءة الوثيقة بعناية لضمان الفهم الكامل لحقوقك والتزاماتك.
        </motion.p>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-200 rounded-full opacity-10 animate-pulse" />
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 space-y-14">
          {[
            {
              title: "1. قبول الشروط",
              desc: "باستخدامك لمنصة نقرأ، فإنك تقر بأنك قرأت وفهمت ووافقت على الالتزام بجميع الشروط والسياسات. إذا كنت لا توافق على أي جزء، يرجى التوقف عن استخدام المنصة فورًا."
            },
            {
              title: "2. إنشاء الحساب",
              desc: "عند إنشاء حساب، يجب تقديم معلومات صحيحة ودقيقة. المستخدم مسؤول عن الحفاظ على سرية بياناته وعدم مشاركة كلمة المرور مع أي طرف آخر."
            },
            {
              title: "3. المحتوى والمسؤولية",
              desc: "يتحمل المستخدم كامل المسؤولية عن المحتوى الذي يتم نشره داخل المنصة، وتحظر أي مواد مسيئة أو مخالفة للقوانين أو منتهكة لحقوق الملكية الفكرية."
            },
            {
              title: "4. حقوق الملكية الفكرية",
              desc: "جميع المواد المنشورة على المنصة محمية بحقوق الملكية الفكرية ولا يجوز نسخها أو إعادة توزيعها بدون إذن رسمي مكتوب من إدارة نقرأ."
            },
            {
              title: "5. الاشتراكات والدفع",
              desc: "بعض الخدمات تتطلب اشتراكًا مدفوعًا. الرسوم غير قابلة للاسترجاع إلا في الحالات الخاصة التي تحددها الإدارة. يحق للمنصة تعديل الأسعار مع إخطار المستخدمين."
            },
            {
              title: "6. الخصوصية وحماية البيانات",
              desc: "تلتزم نقرأ بحماية بيانات المستخدمين وفق سياسة الخصوصية الخاصة بنا، ويعتبر استمرار استخدام الخدمة موافقة على المعالجة." 
            },
            {
              title: "7. إيقاف الحساب",
              desc: "يحق للمنصة تعليق أو حذف حساب المستخدم إذا خالف الشروط أو أساء الاستخدام. ويمكن للمستخدم طلب حذف حسابه في أي وقت."
            },
            {
              title: "8. التعديلات على الشروط",
              desc: "يحق لنا تعديل هذه الشروط في أي وقت، وستصبح سارية فور نشرها. استمرار الاستخدام يعني الموافقة على التعديلات."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <h2 className="text-3xl font-bold mb-4 text-slate-900">{item.title}</h2>
              <p className="text-lg leading-relaxed text-slate-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ending */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 to-teal-800 text-white text-center relative">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
        >
          شكراً لاستخدامك منصة نقرأ
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-4xl mx-auto text-xl leading-relaxed text-emerald-100 mb-10 px-6"
        >
          هدفنا هو توفير بيئة تعليمية مريحة وآمنة تساعدك على التعلم والتطور.
        </motion.p>
      </section>
    </div>
  );
}