import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Course, CourseReview, EnrollmentSection, SubscriptionPlan } from "../../../types";
import PageLoader from "../../components/PageLoader";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { HeroBookIcon, HeroClockIcon, HeroStarIcon, HeroUserIcon } from "../../components/Icons";
import { convertMinutes, getMedia } from "../../utils/functions";
import { useAppDispatch, useAppSelector } from "../../store/store";
import NotFoundError from "../../components/errors/NotFoundError";
import { ErrorAlert, SuccessAlert } from "../../components/alerts";
import { setUserEnrollments } from "../../store/authSlice";

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
  const [error, setError] = useState<null | "not_found" | "server_error">(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [coursePlans, setCoursePlans] = useState<SubscriptionPlan[]>([]);
  const [canEnroll, setCanEnroll] = useState<boolean | null>(null);
  const dispatch = useAppDispatch();
  const {enrollments} = useAppSelector(state=>state.auth);

  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // =========================
  // 📘 Fetch Course Details
  // =========================
  useEffect(() => {
    if (!courseSlug) return;

    setError(null);
    setLoading(true);

    api
      .get(endpoints.courses.details(courseSlug))
      .then((res) => {
        const data = res.data;
        setCourse(data);

        const sortedPlans = data.available_in.sort((a: SubscriptionPlan, b: SubscriptionPlan) => a.price - b.price);
        setCoursePlans(sortedPlans);

        const userPlanId = user?.subscription?.plan?.id;
        setCanEnroll(sortedPlans.some((p: SubscriptionPlan) => p.id === userPlanId));
      })
      .catch((e) => {
        if (e.status === 404) setError("not_found");
        else setError("server_error");
      })
      .finally(() => setLoading(false));
  }, [courseSlug, user]);

  // =========================
  // 🎯 Enrollment Check
  // =========================
  useEffect(() => {
    if (!user || !course?.id) return;

    const localEnrollment = user.enrolled_courses?.find((c) => c.course === course.id);
    if (localEnrollment) {
      setIsEnrolled(true);
      setEnrollmentId(localEnrollment.enrollment);
      return;
    }

    api
      .get(endpoints.user.enrollments.status(course.id))
      .then((res) => {
        setIsEnrolled(res.data.enrolled);
        setEnrollmentId(res.data.id);
      })
      .catch(() => setIsEnrolled(false));
  }, [user, course?.id]);



  // =========================
  // 🧭 Enrollment Handler
  // =========================
  async function handleEnrollment() {
    if (!course) return;
    setEnrolling(true);
    try {
      const res = await api.post(endpoints.user.enrollments.enroll(course.id));
      setIsEnrolled(true);
      setEnrollmentId(res.data.id);
      dispatch(setUserEnrollments([...enrollments,res.data]))
      SuccessAlert({
        title: `لقد انضممت إلى ${res.data.course.title}`,
        text: "ابدأ رحلتك التعليمية الآن 🎓",
        confirmText: "الذهاب للدورة",
        cancelText: "متابعة التصفح",
        onConfirm: () => navigate(`/dashboard/classroom/${res.data.id}`),
      });
    } catch {
      ErrorAlert({
        title: "حدث خطأ أثناء التسجيل",
        text: "يرجى المحاولة لاحقًا.",
        confirmText: "موافق",
      });
    } finally {
      setEnrolling(false);
    }
  }

  // =========================
  // 🧩 Next Available Plan
  // =========================
  const nextPlan = useMemo(() => {
    const currentPlanId = user?.subscription?.plan?.id;
    if (!currentPlanId) return coursePlans[0];
    const currentPlan = coursePlans.find((p) => p.id === currentPlanId);
    return coursePlans.find((p) => p.price > (currentPlan?.price || 0)) || null;
  }, [coursePlans, user]);

  // =========================
  // 💎 Enrollment Button
  // =========================
  function renderEnrollButton() {
    if (isEnrolled)
      return (
        <Link to={`/dashboard/classroom/${enrollmentId}`} className="p-2 px-4 bg-emerald-600 text-white rounded-md text-xl">
          متابعة الدورة
        </Link>
      );

    if (course?.available_in.some((p) => p.is_free))
      return (
        <button onClick={handleEnrollment} disabled={enrolling} className="p-2 px-4 bg-emerald-100 rounded-md text-xl">
          {enrolling ? "جاري الانضمام..." : "انضم مجانًا"}
        </button>
      );

    if (canEnroll)
      return (
        <button onClick={handleEnrollment} disabled={enrolling} className="p-2 px-4 bg-emerald-600 text-white rounded-md text-xl">
          {enrolling ? "جاري الانضمام..." : "انضم الآن"}
        </button>
      );

    return nextPlan ? (
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-gray-600">
          هذه الدورة غير متوفرة في خطتك الحالية. قم بالترقية إلى{" "}
          <span className="font-semibold text-emerald-700">{nextPlan.name}</span> بسعر{" "}
          <span className="font-semibold">{nextPlan.price} IQD</span> للوصول إلى هذه الدورة والمزيد.
        </p>
        <Link to={`/upgrade/${nextPlan.id}`} className="bg-emerald-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-emerald-700 transition">
          الترقية الآن
        </Link>
      </div>
    ) : (
      <p className="text-gray-600">لا توجد خطة أعلى متاحة حاليًا، يرجى التواصل مع الدعم.</p>
    );
  }

  // =========================
  // 🧾 Tabs
  // =========================
  function renderTabContent() {
    switch (activeTab) {
      case "curriculum":
        return course?.sections?.length ? (
          <div className="space-y-4">
            {course.sections.map((section) => (
              <div key={section.id} className="border rounded-md p-3 bg-white">
                <h2 className="font-semibold mb-2">{section.title}</h2>
                <ul className="space-y-1">
                  {section.lectures.map((lec) => (
                    <li key={lec.id} className="flex justify-between text-sm border-b last:border-0 py-1">
                      <span>{lec.title}</span>
                      <span className="text-gray-600 text-xs">{convertMinutes(lec.duration, "minute")} دقيقة</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>لا يوجد محتوى دراسي بعد.</p>
        );

      case "instructor":
        return (
          <div className="bg-white p-4 rounded-md space-y-3">
            <div className="flex items-center gap-4">
              <img src={getMedia(course?.instructor.profile_picture || "")} alt="" className="w-16 h-16 rounded-full object-cover border" />
              <div>
                <h2 className="font-semibold text-lg">
                  {course?.instructor.first_name} {course?.instructor.last_name}
                </h2>
                <p className="text-gray-500 text-sm">{course?.instructor.bio || "لا توجد سيرة ذاتية متاحة."}</p>
              </div>
            </div>
          </div>
        );

      case "reviews":
        return course?.reviews?.length ? (
          <div className="space-y-3">
            {course.reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-md p-3 border space-y-1">
                <h3 className="font-medium">{r.user.first_name}</h3>
                <p className="text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                <p className="text-gray-700 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>لا توجد تقييمات بعد.</p>
        );

      default:
        return null;
    }
  }

  // =========================
  // 💡 JSX
  // =========================
  if (loading) return <PageLoader />;
  if (loading || error === "not_found") {
    return (
      <>
        {loading && <PageLoader />}
        {error === "not_found" && <NotFoundError className="w-full h-screen fixed z-[100] bg-white" />}
      </>
    );
  }
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="grid lg:grid-cols-[60%_1fr] gap-6 items-start">
        <div className="space-y-3 lg:order-1 order-2">
          <h1 className="text-3xl font-bold">{course?.title}</h1>
          <p className="text-gray-700 leading-relaxed">{course?.description}</p>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { title: "عدد الطلاب", icon: <HeroUserIcon className="size-5" />, value: course?.enrollments_count },
              { title: "عدد المحاضرات", icon: <HeroBookIcon className="size-5" />, value: course?.lectures_count },
              { title: "المدة", icon: <HeroClockIcon className="size-5" />, value: convertMinutes(course?.duration || 0, "hour") + " ساعة" },
              { title: "التقييمات", icon: <HeroStarIcon className="size-5" />, value: course?.total_reviews },
            ].map((t) => (
              <div key={t.title} className="flex items-center justify-center flex-col bg-white border rounded-lg p-3 text-sm font-medium">
                {t.icon}
                <span>{t.title}</span>
                <span className="text-gray-700">{t.value}</span>
              </div>
            ))}
          </div>

          {/* Enrollment Button */}
          <div className="pt-6 w-full">{renderEnrollButton()}</div>
        </div>

        {/* Course Cover */}
        <div className="w-full flex justify-center lg:order-2 order-1">
          {course?.intro ? (
            <video controls src={getMedia(course.intro)} />
          ) : (
            <img src={getMedia(course?.cover || "")} alt="" className="rounded-lg shadow-md object-cover max-w-xs" />
          )}
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
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === tab.id ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-600 hover:text-black"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>{renderTabContent()}</div>
      </div>

      {/* CTA */}
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
