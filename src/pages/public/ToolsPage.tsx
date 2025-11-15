import { motion, useScroll, useTransform } from "framer-motion";
import { HeroChartIcon, HeroCommandLineIcon, HeroComputerIcon, HeroFileIcon, HeroTranslateIcon, HeroVideoIcon } from "../../components/Icons";
import projectImage from '../../assets/final-projects.svg';

const sections = [
  {
    title: "الدورات التدريبية",
    content: "تابع التعلم بشكل منظم وذكي عبر نظام كورسات متكامل.",
    details: [
      "حفظ نقطة التوقف في الفيديو تلقائياً.",
      "اختبارات قصيرة لتعزيز الفهم بعد كل درس.",
      "ملاحظات مرتبطة بالزمن داخل الفيديو.",
      "مناقشات مباشرة مع المدرسين وزملاء المساق.",
    ],
    icon: <HeroVideoIcon className="size-8" />
  },
  {
    title: "الموارد والملخصات",
    content: "مكتبة منظمة للملخصات، الملازم، وأوراق الامتحان مع حلول.",
    details: [
      "بحث ذكي ومصنف حسب المقررات والمراحل.",
      "تحميل ومشاركة الملفات بسهولة.",
      "نظام تقييم للمصادر من الطلاب والأساتذة.",
    ],
    icon: <HeroFileIcon className="size-8" />
  },
  {
    title: "تتبع أداء الطالب",
    content: "لوحة تحكم لمتابعة التقدّم، الوقت المستغرق، ونقاط الضعف.",
    details: [
      "تقارير زمنية ومخططات تقدمية لكل مادة.",
      "مقارنة الأداء مع مجموعتك أو المتوسط العام.",
      "اقتراح برامج دراسية لتحسين النقاط الضعيفة.",
    ],
    icon: <HeroChartIcon className="size-8" />
  },
  {
    title: "الأبحاث العلمية والترجمات",
    content: "أدوات للكتابة العلمية، التنسيق، والترجمة بسرعة ودقة.",
    details: [
      "دعم المعادلات وصيغ الاقتباس الأكاديمي.",
      "خدمات ترجمة مبدئية ومراجعة بشرية اختيارية.",
      "مشاركة وطلب مراجعات من أساتذة مختصين.",
    ],
    icon: <HeroTranslateIcon className="size-8" />
  },
  {
    title: "ورشات العمل والندوات",
    content: "ورش تفاعلية وشهادات مشاركة معتمدة.",
    details: [
      "ورش عمل تطبيقية يقدمها مختصون.",
      "سجل الفيديوهات وأداة إعادة المشاهدة.",
      "شهادات حضور قابلة للطباعة.",
    ],
    icon: <HeroCommandLineIcon className="size-8" />
  },
  {
    title: "الدورات المهنية",
    content: "دورات عملية تؤهلك لسوق العمل مع مشاريع تطبيقية.",
    details: [
      "مشاريع عملية للتدريب Hands-on.",
      "متابعة من مدرب وتقييم مستمر.",
      "شهادات إتمام ومراجع للتوظيف.",
    ],
    icon: <HeroComputerIcon className="size-8" />
  },
];

export default function NaqraaFeatures() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Pre-content: service highlight for Final Projects */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              خدمة مشاريع التخرج — Naqraa Final Projects Lab
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              في نقرأ نوفر للطلاب مساحة متكاملة لتنفيذ مشاريع التخرج (ويب، موبايل، ذكاء اصطناعي، Embedded). نقدم دعم برمجي وتقني
              خطوة بخطوة من توليد الأفكار إلى التسليم النهائي والعرض أمام اللجنة.
            </p>

            <ul className="space-y-3">
              {[
                "دعم فني وبرمجي: Frontend, Backend, Mobile, AI.",
                "قوالب جاهزة، ملفات Docker، وبيئات تطوير مُعَدّة.",
                "مراجعة أكاديمية: إرشاد كتابة بحث، عرض، وREADME احترافي.",
                "تدريب على عرض المشروع والتحضير للجنة الامتحان."
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                  <span className="text-slate-700 text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 mt-6">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                اطلب دعم الآن
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2 flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={projectImage} 
                alt="Final Projects Lab" 
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Features list */}
        <div className="mt-16 sm:mt-24 space-y-8">
          <motion.div 
            className="text-center"
            style={{ opacity, y }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">الميزات الرئيسية</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              اكتشف كيف يمكن لمنصة نقرأ أن تُحدث فرقاً في تجربتك التعليمية
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mt-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-slate-300 transition-all duration-300 shadow-md hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  delay: index * 0.1
                }}
              >
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl p-4 w-16 h-16 flex items-center justify-center flex-shrink-0">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                      {section.title}
                    </h3>
                    <p className="text-slate-600 mb-5 leading-relaxed">
                      {section.content}
                    </p>
                    
                    <ul className="space-y-3">
                      {section.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                          <span className="text-slate-700 leading-relaxed">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
