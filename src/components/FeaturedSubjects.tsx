import math from '../assets/maths.svg';
import cheimstry from '../assets/glassware.svg';
import phy from '../assets/atom.svg';
import arabic from '../assets/quran.svg';
import geo from '../assets/globe.svg';
import idea from '../assets/idea.svg';
import english from '../assets/online-lesson.svg';
import art from '../assets/art.svg';
import laptop from '../assets/laptop.svg';
import ribCage from '../assets/rib-cage.svg';
import history from '../assets/sandglass.svg';




const subjects = [
    {
        subject: "الرياضيات",
        description: "تصفح جميع دورات الرياضيات للصف السادس علمي مع مجموعة من الأدوات الرياضية المجانية التي تساعدك على التعلم بفعالية أكثر",
        img: math,
        className: "bg-indigo-100 text-indigo-600"
    },
    {
        subject: "الفيزياء",
        description: "اكتشف دورات الفيزياء التي تشرح المفاهيم المعقدة بطريقة مبسطة مع تجارب وأدوات تفاعلية لتعزيز فهمك العلمي",
        img: phy,
        className: "bg-purple-100 text-purple-600"
    },
    {
        subject: "الكيمياء",
        description: "تعلم الكيمياء بأسلوب ممتع وعملي مع تجارب افتراضية وأدوات تساعدك على استكشاف العناصر والتفاعلات الكيميائية",
        img: cheimstry,
        className: "bg-violet-100 text-violet-600"
    },
    {
        subject: "الأحياء",
        description: "استكشف عالم الأحياء من خلال دورات تفاعلية تساعدك على فهم الجسم والكائنات الحية وبيئتها بشكل ممتع وعملي",
        img: ribCage,
        className: "bg-green-100 text-green-600"
    },
    {
        subject: "اللغة العربية",
        description: "تعمق في قواعد النحو والصرف والبلاغة، مع نصائح وأدوات تساعدك على تطوير مهاراتك اللغوية بشكل فعّال",
        img: arabic,
        className: "bg-stone-100 text-stone-600"
    },
    {
        subject: "اللغة الإنجليزية",
        description: "تعلم الإنجليزية من خلال دورات تفاعلية تغطي المحادثة والقراءة والكتابة بطريقة ممتعة وسهلة التطبيق",
        img: english,
        className: "bg-blue-100 text-blue-600"
    },
    {
        subject: "التاريخ",
        description: "اكتشف التاريخ بطريقة مبتكرة مع دورات تعرض الأحداث العالمية والعربية بأسلوب قصصي شيق يسهل تذكره",
        img: history,
        className: "bg-zinc-100 text-zinc-600"
    },
    {
        subject: "الجغرافيا",
        description: "تعلّم الجغرافيا من خلال خرائط تفاعلية وأدوات تساعدك على فهم العالم والبيئة والمجتمعات بطريقة ممتعة",
        img: geo,
        className: "bg-emerald-100 text-emerald-600"
    },
    {
        subject: "الفن",
        description: "استكشف عالم الفن من خلال دورات تفاعلية تغطي الرسم، التصميم، والنقد الفني بطريقة خلاقة وممتعة",
        img: art,
        className: "bg-pink-100 text-pink-600"
    },
    {
        subject: "البرمجة وعلوم الحاسوب",
        description: "تعلم البرمجة وعلوم الحاسوب بأسلوب عملي مع مشاريع حقيقية وأدوات تساعدك على تطوير مهاراتك التقنية",
        img: laptop,
        className: "bg-blue-100 text-blue-600"
    },
    {
        subject: "التفكير النقدي وحل المشكلات",
        description: "طور مهارات التفكير النقدي وحل المشكلات من خلال تحديات وأنشطة عملية تساعدك على التعامل مع الواقع بذكاء",
        img: idea,
        className: "bg-yellow-100 text-yellow-600"
    }
];



export default function FeaturedSubjects() {



    return (
        <div className="px-4 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-5 text-center">تصفح الدورات لكل مادة</h1>

            <div className="flex gap-4 overflow-x-auto p-2 snap-x snap-mandatory">
                {subjects.map((subject) => (
                    <div
                        key={subject.subject}
                        className="flex-shrink-0 w-64 md:w-72 lg:w-80 bg-emerald-100 rounded-lg p-4 flex flex-col justify-between snap-start"
                    >
                        <div className="space-y-3 flex-1">
                            <img
                                src={subject.img || ''}
                                alt={subject.subject}
                                className="w-32 md:w-40 mx-auto object-contain"
                            />
                            <h2 className="text-xl md:text-2xl font-semibold text-center">{subject.subject}</h2>
                            <p className="text-sm md:text-base text-center">{subject.description}</p>
                        </div>
                        <button className="mt-4 bg-white border border-gray-300 p-2 px-4 md:px-5 rounded-md hover:bg-gray-50 transition-colors">
                            تصفح الدورات
                        </button>
                    </div>
                ))}
            </div>
        </div>

    )
}