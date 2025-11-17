import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import progressTrackerImg from '../../assets/progress.svg';
import filesFolderImg from '../../assets/files-folder.svg';
import chatImg from '../../assets/chat-img.svg';
import quizImg from '../../assets/quiz.svg';
import mobileNotificationImg from '../../assets/notifications.svg';
import tasksImg from '../../assets/todo-app.svg';


gsap.registerPlugin(ScrollTrigger);

export default function NaqraaAppFeaturesPage() {
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
                        start: "top 85%",
                    },
                }
            );
        });
    }, []);

    return (
        <div className="bg-white">
            <div className="max-w-7xl pb-20 mx-auto text-gray-900" dir="rtl">

                {/* Hero */}
                <section
                    ref={(el) => { 
                        sectionsRef.current[0] = el
                     } }
                    className="container mx-auto px-6 py-20 text-center"
                >
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-6">
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">تطبيق نقــرأ للهواتف الذكية</span>
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto text-slate-600 leading-relaxed">
                        تجربة تعليمية متكاملة بين يديك — محاضرات، ملفات، مهام، محادثات، تتبع تقدم، 
                        إشعارات فورية، والمزيد. الآن يمكنك الوصول لكل الأدوات الدراسية من مكان واحد
                        وفي أي وقت.
                    </p>

                    <div className="flex justify-center gap-4 mt-10">
                        <div className="relative">
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 cursor-not-allowed opacity-75">
                                تحميل التطبيق
                            </button>
                            <div className="absolute -top-2 -right-2">
                                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse transform rotate-12">
                                    قريباً
                                </div>
                            </div>
                        </div>
                        <button className="border border-emerald-600 text-emerald-700 hover:bg-emerald-100 px-8 py-3 rounded-xl text-lg transition-all duration-200">
                            شاهد فيديو استعراض
                        </button>
                    </div>
                </section>

                {/* Sections */}
                <Feature
                    index={1}
                    title="مشاهدة المحاضرات وتتبع التقدم"
                    description="نظام ذكي لحفظ آخر نقطة توقفت عندها، مع إمكانية تحديد الدروس المكتملة وتتبع تقدمك في كل مادة."
                    bullets={[
                        "حفظ وقت التوقف تلقائياً",
                        "تنظيم الدروس حسب الوحدات",
                        "علامة إتمام على كل محاضرة",
                        "مزامنة فورية مع حساب الويب",
                    ]}
                    refList={sectionsRef}
                    image={progressTrackerImg}
                />

                <Feature
                    index={2}
                    title="تحميل الملفات والملخصات"
                    description="كل الملفات الدراسية في مكان واحد مع إمكانية تحميلها أو حفظها داخل التطبيق والمزامنة بين الأجهزة."
                    bullets={[
                        "مكتبة ملفات منظمة وذكية",
                        "فلترة حسب السنة والجامعة والمادة",
                        "مشاركة الملفات بسهولة",
                        "التصفح بدون إنترنت",
                    ]}
                    refList={sectionsRef}
                    image={filesFolderImg}
                />

                <Feature
                    index={3}
                    title="التواصل بين الطلاب والمدرسين"
                    description="نظام محادثات متكامل للمناقشات والتواصل، سواء ضمن المجتمع، الدورات، فرق المشروع، أو الاتصال المباشر."
                    bullets={[
                        "محادثات خاصة وجماعية",
                        "مشاركة صور وملفات وروابط",
                        "محادثات للمساقات والمواد الدراسية",
                        "تنبيهات فورية للرسائل الجديدة",
                    ]}
                    refList={sectionsRef}
                    image={chatImg}
                />

                <Feature
                    index={4}
                    title="الاختبارات والتقييمات"
                    description="اختبارات قصيرة بعد كل درس، نتائج مباشرة، وإحصائيات للأخطاء المتكررة."
                    bullets={[
                        "اختبارات قصيرة MCQ",
                        "نتائج فورية وتحليل أداء",
                        "تقويم للاختبارات القادمة",
                        "ترتيب بين الطلاب",
                    ]}
                    refList={sectionsRef}
                    image={quizImg}
                />

                <Feature
                    index={5}
                    title="إدارة المهام والإنذارات"
                    description="لوحة متابعة للواجبات والمواعيد النهائية مع تذكيرات تلقائية."
                    bullets={[
                        "جدول مهام أسبوعي",
                        "تنبيه قبل الموعد",
                        "إرفاق ملفات وإجابات",
                        "عرض تقدم الفريق والمشاريع",
                    ]}
                    refList={sectionsRef}
                    image={tasksImg}
                />

                <Feature
                    index={6}
                    title="إشعارات فورية"
                    description="لا تفوّت أي تحديث — رسائل، نتائج، امتحانات، ملفات جديدة، أو تحديثات في المحاضرات."
                    bullets={[
                        "يدعم إشعارات النظام",
                        "تكامل مع واتساب والرسائل",
                        "تحكم كامل في نوع الإشعارات",
                    ]}
                    refList={sectionsRef}
                    image={mobileNotificationImg}
                />

                <CTA refList={sectionsRef} />
            </div>
        </div>
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
// Feature Component
function Feature({ index, title, description, bullets, refList, image } : FeatureProps ) {
    return (
        <section
            ref={(el) => {
                refList.current[index] = el
            }}
            className={`container mx-auto px-6 py-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} flex flex-col md:flex-row items-center gap-12 border-b border-slate-100`}
        >
            <div className="md:w-1/2">
                <img 
                    src={image} 
                    alt={title} 
                    className="rounded-2xl   max-h-[500px] object-cover transform hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">{description}</p>
                <ul className="space-y-3 text-slate-800 list-disc ml-6">
                    {bullets.map((b:string, i:number) => (
                        <li key={i} className="text-slate-700">{b}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

// CTA Component
function CTA({ refList } : { refList:React.RefObject<(HTMLElement | null)[]> } ) {
    return (
        <section
            ref={(el) => {
                refList.current[20] = el
            } }
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-20"
        >
            <h2 className="text-3xl font-bold mb-4">انضم إلى آلاف الطلاب الآن 📱</h2>
            <p className="max-w-2xl mx-auto mb-8 text-emerald-100">
                حمّل تطبيق نقــرأ وابدأ رحلتك التعليمية الذكية — تجربة متكاملة تجمع كل ما تحتاجه في مكان واحد.
            </p>

            <div className="relative inline-block">
                <button className="px-10 py-4 bg-white text-emerald-700 font-semibold text-lg rounded-xl hover:bg-emerald-50 transition-all duration-200 transform hover:scale-105 cursor-not-allowed opacity-90">
                    تحميل التطبيق الآن
                </button>
                <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-xl animate-bounce transform -rotate-12">
                        <span className="animate-pulse">قريباً 🚀</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
