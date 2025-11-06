import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Course, CourseReview, EnrollmentSection, SubscriptionPlan } from "../../../types";
import PageLoader from "../../components/PageLoader";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import {
    HeroBookIcon,
    HeroClockIcon,
    HeroStarIcon,
    HeroUserIcon
} from "../../components/Icons";
import { convertMinutes, getMedia } from "../../utils/functions";
import { useAppSelector } from "../../store/store";
import NotFoundError from "../../components/errors/NotFoundError";

interface CourseDetailsProps extends Course {
    enrollments_count: number;
    lectures_count: number;
    duration: number;
    total_reviews: number;
    sections: EnrollmentSection[];
    reviews: CourseReview[];
    intro: string;
}

export default function CourseDetailsPage() {
    const { courseSlug } = useParams();
    const [course, setCourse] = useState<CourseDetailsProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("curriculum");
    const [canEnroll, setCanEnroll] = useState<boolean | null>(null);
    const [error, setError] = useState<null | "not_found" | "server_error">(null)
    const { user } = useAppSelector(state => state.auth);
    const [coursePlans, setCoursePlans] = useState<SubscriptionPlan[]>([]);
    const [enrolling,setEnrolling] = useState(false);

    useEffect(() => {
        if (!courseSlug) return;
        setError(null);
        setLoading(true);

        api
            .get(endpoints.courses.details(courseSlug))
            .then((res) => {
                const data = res.data;
                setCourse(data);

                // Sort plans from lowest to highest price
                const sortedPlans = [...data.available_in].sort(
                    (a: SubscriptionPlan, b: SubscriptionPlan) => a.price - b.price
                );
                setCoursePlans(sortedPlans);

                // Check if user’s plan includes the course
                const userPlanId = user?.subscription?.plan?.id;
                const canAccess =
                    sortedPlans.findIndex((p) => p.id === userPlanId) !== -1;

                setCanEnroll(canAccess);
            })
            .catch((e) => {
                if (e.status === 404) setError("not_found");
                else setError("server_error");
            })
            .finally(() => setLoading(false));
    }, [courseSlug, user]);


    useEffect(() => {
        setCanEnroll(course?.available_in.findIndex(subp => subp.id === user?.subscription?.plan.id) !== -1)
    }, [course])

    if (loading) return <PageLoader />;

    if (error === 'not_found') return <NotFoundError className="w-full h-screen fixed z-[100] bg-white" />


    const tags = [
        {
            title: "عدد الطلاب المنضمين",
            icon: <HeroUserIcon className="size-5" />,
            value: course?.enrollments_count,
        },
        {
            title: "عدد المحاضرات",
            icon: <HeroBookIcon className="size-5" />,
            value: course?.lectures_count,
        },
        {
            title: "مدة الدورة",
            icon: <HeroClockIcon className="size-5" />,
            value: convertMinutes(course?.duration || 0, "hour") + " ساعة",
        },
        {
            title: "التقييمات",
            icon: <HeroStarIcon className="size-5" />,
            value: course?.total_reviews,
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "curriculum":
                return (
                    <div className="space-y-4">
                        {course?.sections?.length ? (
                            course.sections.map((section) => (
                                <div key={section.id} className="border rounded-md p-3 bg-white">
                                    <h2 className="font-semibold mb-2">{section.title}</h2>
                                    <ul className="space-y-1">
                                        {section.lectures.map((lec) => (
                                            <li
                                                key={lec.id}
                                                className="flex justify-between text-sm not-[:last-child]:border-b py-1"
                                            >
                                                <span>{lec.title}</span>
                                                <span className="text-gray-600 text-xs">
                                                    {convertMinutes(lec.duration, "minute")} دقيقة
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p>لا يوجد محتوى دراسي بعد.</p>
                        )}
                    </div>
                );

            case "instructor":
                return (
                    <div className="bg-white p-4 rounded-md space-y-3">
                        <div className="flex items-center gap-4">
                            <img
                                src={getMedia(course?.instructor.profile_picture || "")}
                                alt=""
                                className="w-16 h-16 rounded-full object-cover border"
                            />
                            <div>
                                <h2 className="font-semibold text-lg">
                                    {course?.instructor.first_name} {course?.instructor.last_name}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {"لا توجد سيرة ذاتية متاحة."}
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case "reviews":
                return (
                    <div className="space-y-3">
                        {course?.reviews?.length ? (
                            course.reviews.map((r) => (
                                <div
                                    key={r.id}
                                    className="bg-white rounded-md p-3 border space-y-1"
                                >
                                    <h3 className="font-medium">{r.user.first_name}</h3>
                                    <p className="text-yellow-500">
                                        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                                    </p>
                                    <p className="text-gray-700 text-sm">{r.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p>لا توجد تقييمات بعد.</p>
                        )}
                    </div>
                );


            default:
                return null;
        }
    };


    function getNextAvailablePlan(
        currentPlanId: number | undefined,
        plans: SubscriptionPlan[]
    ) {
        if (!currentPlanId) return plans[0]; // if user has no plan, return cheapest
        const currentPlanIndex = plans.findIndex((p) => p.id === currentPlanId);
        if (currentPlanIndex === -1) return plans[0];

        // Return the next more expensive plan if it exists
        return plans.find((p) => p.price > plans[currentPlanIndex].price) || null;
    }

    function handleEnrollment(){

        if(!course) return ;

        setEnrolling(true);
        api.post(endpoints.user.enrollments.enroll(course?.id))
        .then((res)=>{
            console.log(res.data)
        })
        .catch((e)=> console.log(e) )
        .finally(()=>  setEnrolling(false) )

    }


    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="grid  lg:grid-cols-[60%_1fr] gap-6 items-start">
                {/* Course info */}
                <div className="space-y-3 lg:order-1 order-2">
                    <h1 className="text-3xl font-bold">{course?.title}</h1>
                    <p className="text-gray-700 leading-relaxed">{course?.description}</p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                        {tags.map((t) => (
                            <div
                                key={t.title}
                                className="flex items-center justify-center flex-col bg-white border rounded-lg p-3 text-sm font-medium"
                            >
                                {t.icon}
                                <span>{t.title}</span>
                                <span className="text-gray-700">{t.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6 w-full">
                        {course?.available_in.findIndex((subp) => subp.is_free) !== -1 ? (
                            <button onClick={handleEnrollment} disabled={enrolling} className="p-2 px-4 bg-emerald-100 rounded-md text-xl">
                                { enrolling ? 'جاري الانضمام' : ' انضم مجانا' }
                            </button>
                        ) : canEnroll ? (
                            <button onClick={handleEnrollment} disabled={enrolling} className="p-2 px-4 bg-emerald-600 text-white rounded-md text-xl">
                                { enrolling ? 'جاري الانضمام' : 'انضم الآن' }
                            </button>
                        ) : (
                            (() => {
                                const nextPlan = getNextAvailablePlan(
                                    user?.subscription?.plan?.id,
                                    coursePlans
                                );
                                return nextPlan ? (
                                    <div className="flex flex-col items-start gap-2">
                                        <p className="text-sm text-gray-600">
                                            هذه الدورة غير متوفرة في خطتك الحالية، قم بالترقية إلى خطة{" "}
                                            <span className="font-semibold text-emerald-700">
                                                {nextPlan.name}
                                            </span>{" "}
                                            بسعر <span className="font-semibold">{nextPlan.price} IQD</span>{" "}
                                            للوصول إلى هذه الدورة والمزيد.
                                        </p>
                                        <Link
                                            to={`/upgrade/${nextPlan.id}`}
                                            className="bg-emerald-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-emerald-700 transition"
                                        >
                                            الترقية الآن
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">
                                        لا توجد خطة أعلى متاحة حالياً، يرجى التواصل مع الدعم.
                                    </p>
                                );
                            })()
                        )}
                    </div>


                </div>

                {/* Course cover */}
                <div className="w-full flex justify-center lg:order-2 order-1">
                    {
                        course?.intro && (<video controls src={getMedia(course.intro)}> </video>)
                    }
                    {
                        !course?.intro && (
                            <img
                                src={getMedia(course?.cover || "")}
                                alt=""
                                className="rounded-lg shadow-md object-cover max-w-xs"
                            />
                        )
                    }
                </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
                <div className="flex border-b">
                    {[
                        { id: "curriculum", label: "المحتوى الدراسي" },
                        { id: "instructor", label: "المدرب" },
                        { id: "reviews", label: "التقييمات" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === tab.id
                                ? "border-emerald-600 text-emerald-600"
                                : "border-transparent text-gray-600 hover:text-black"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div>{renderTabContent()}</div>
            </div>
            <div className="bg-emerald-600 text-white rounded-xl shadow-md p-6 mt-10 flex flex-col items-center justify-center text-center space-y-3">
                <h2 className="text-2xl font-bold">ابدأ رحلتك التعليمية اليوم 🎓</h2>
                <p className="text-sm text-emerald-100 max-w-md">
                    سجّل في الدورة الآن وابدأ بتطوير مهاراتك خطوة بخطوة مع أفضل الأساتذة.
                </p>
                <button className="bg-white text-emerald-600 font-semibold px-6 py-2 rounded-md hover:bg-emerald-100 transition">
                    سجّل الآن
                </button>
            </div>

        </div>
    );
}
