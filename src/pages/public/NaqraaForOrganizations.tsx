import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function NaqraaForOrganizationsPage() {
    const sectionsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        sectionsRef.current.forEach((section) => {
            if (!section) return;
            gsap.fromTo(
                section,
                { opacity: 0, y: 80 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                    },
                }
            );
        });
    }, []);

    return (
        <div className="w-full bg-white mx-auto text-gray-900">
            <div className="max-w-7xl mx-auto pb-20">
                {/* Background Decorations */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

                {/* ================= Hero Section ================= */}
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
                        className="text-4xl font-bold text-slate-900 mb-6"
                    >
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Naqraa for Organizations</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg max-w-3xl mx-auto text-slate-600 leading-relaxed"
                    >
                        نظام متكامل لإدارة المدارس، المعاهد، الدورات التدريبية، والنقل المدرسي — في منصة واحدة.
                        يوفر جميع الأدوات التي تحتاجها لإدارة أكاديمية فعّالة وتواصل قوي بين الطلاب، المدرسين، والإدارة.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex items-center justify-center gap-4 mt-10"
                    >
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                            جرّب النظام مجاناً
                        </button>
                        <button className="border border-emerald-600 text-emerald-700 hover:bg-emerald-100 px-8 py-3 rounded-xl text-lg transition-all duration-200 shadow-md">
                            احجز عرض Demo
                        </button>
                    </motion.div>
                </section>

                {/* ================= Feature Sections ================= */}

                <FeatureSection
                    index={1}
                    title="إدارة الباصات والنقل المدرسي"
                    description="تنظيم كامل للباصات، السائقين، المسارات، والطلاب مع إشعارات وصول ومغادرة للأهالي لضمان الأمان والراحة."
                    bullets={[
                        "تحديد مسار كل باص وربطه بالطلاب",
                        "إشعارات وصول/مغادرة لحظة بلحظة",
                        "عرض حالة الباص والمقاعد المتاحة",
                        "تقليل الفوضى وتنظيم حركة النقل",
                    ]}
                    refList={sectionsRef}
                    image="https://placehold.co/600x400/10b981/ffffff?text=School+Transport"
                />

                <FeatureSection
                    index={2}
                    title="نظام الحضور والغياب"
                    description="نظام ذكي لتسجيل حضور الطلاب إلكترونيًا وتحليل بيانات الحضور واتخاذ قرارات دقيقة."
                    bullets={[
                        "تسجيل إلكتروني فوري للحضور",
                        "إحصائيات شاملة لكل مادة",
                        "إنذارات للغياب المتكرر",
                        "رفع تقارير جاهزة للإدارة",
                    ]}
                    refList={sectionsRef}
                    image="https://placehold.co/600x400/3b82f6/ffffff?text=Attendance+System"
                />

                <FeatureSection
                    index={3}
                    title="متابعة أولياء الأمور"
                    description="تواصل مباشر بين المؤسسة والأهالي مع تقارير أداء، إنذارات، تنبيهات ورسائل متابعة مستمرة."
                    bullets={[
                        "تقارير أسبوعية/شهرية تلقائية",
                        "تنبيهات عند انخفاض الأداء",
                        "بروفايل شامل لكل طالب",
                        "قناة تواصل مع المدرسين والإدارة",
                    ]}
                    refList={sectionsRef}
                    image="https://placehold.co/600x400/f59e0b/ffffff?text=Parent+Engagement"
                />

                <FeatureSection
                    index={4}
                    title="التواصل والإشعارات"
                    description="نظام مراسلة احترافي يدعم واتساب، البريد، SMS، والإشعارات الفورية للتواصل الفعّال."
                    bullets={[
                        "دعم WhatsApp Business API",
                        "إرسال رسائل للصفوف أو الطلاب",
                        "تنبيهات الدفع والحضور والفعاليات",
                        "إدارة حملات إعلان مخصصة",
                    ]}
                    refList={sectionsRef}
                    image="https://placehold.co/600x400/8b5cf6/ffffff?text=Communication+Hub"
                />

                <FeatureSection
                    index={5}
                    title="إدارة الطلاب والمعلمين والمحتوى"
                    description="لوحة إدارة مركزية لتتبع معلومات الطلاب، الدورات، الأقسام، الدروس، والمواد الرقمية."
                    bullets={[
                        "إنشاء صفوف وتوزيع الطلاب",
                        "رفع محاضرات وواجبات واختبارات",
                        "تحليل تقدم الطالب",
                        "أرشيف رقمي كامل",
                    ]}
                    refList={sectionsRef}
                    image="https://placehold.co/600x400/ef4444/ffffff?text=Content+Management"
                />

                {/* ================= CTA ================= */}
                <section
                    ref={(el) => {
                        sectionsRef.current[10] = el
                    }}
                    className="text-center py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl mx-6"
                >
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ duration: 0.8 }}
                        className="text-3xl font-bold mb-4"
                    >
                        ابدأ مع نقــرأ اليوم 🎓
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }} 
                        viewport={{ once: true }} 
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="max-w-2xl mx-auto mb-8 text-lg text-emerald-100"
                    >
                        يساعدك Naqraa على بناء منظومة تعليمية قوية ومنظمة ومتصلة. جرّب الآن مجاناً لمدة أسبوع بدون بطاقة دفع.
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 bg-white text-emerald-700 font-semibold text-lg rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg"
                    >
                        إنشاء حساب مؤسسة
                    </motion.button>
                </section>
            </div>
        </div>
    );
}

// Feature Component
function FeatureSection({
    index,
    title,
    description,
    bullets,
    refList,
    image,
} : FeatureProps ) {
    return (
        <motion.section
            ref={(el) => {
                refList.current[index] = el
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className={`container mx-auto px-6 py-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} flex flex-col md:flex-row items-center gap-12`}
        >
            <div className="md:w-1/2">
                <img 
                    src={image} 
                    alt={title} 
                    className="rounded-2xl shadow-lg w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">{description}</p>
                <ul className="space-y-3 text-slate-800 list-disc ml-6">
                    {bullets.map((b, i) => (
                        <li key={i} className="text-slate-700">{b}</li>
                    ))}
                </ul>
            </div>
        </motion.section>
    );
}


interface FeatureProps {

    index:number;
    title:string;
    description:string;
    bullets:string[];
    refList:React.RefObject<(HTMLElement | null)[]> ; 
    image:string;

}