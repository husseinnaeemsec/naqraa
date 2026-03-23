import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, BookOpen, Clock, Star, Play, CheckCircle, Award, 
  User, Heart, Share2, Download, Target,
  ChevronRight, PlayCircle, Lock
} from "lucide-react";
import type { Course, CourseReview, EnrollmentSection, SubscriptionPlan } from "../../../types";
import PageLoader from "../../components/PageLoader";
import api from "../../api/client";
import { endpoints } from "../../api/routes";

import { convertMinutes, getMedia } from "../../utils/functions";
import { useAppDispatch, useAppSelector } from "../../store";
import NotFoundError from "../../components/errors/NotFoundError";
import { ErrorAlert, SuccessAlert } from "../../components/alerts";

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
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const dispatch = useAppDispatch();
  const {enrollments} = useAppSelector(state=>state.auth);

  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  // =========================
  // 🎯 Enrollment Check
  // =========================
  useEffect(() => {
    if (!user || !course?.id) return;

    const localEnrollment = null;
    if (localEnrollment) {
      setIsEnrolled(true);
      setEnrollmentId(localEnrollment?.enrollment);
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
      SuccessAlert({
        title: `لقد انضممت إلى ${res.data.course.title}`,
        text: "ابدأ رحلتك التعليمية الآن 🎓",
        confirmText: "الذهاب للدورة",
        cancelText: "متابعة التصفح",
        onConfirm: () => navigate(`/dashboard/classroom/${res.data.id}`),
      });
    } catch (e:any){
      const error = e?.response?.data?.error || "يرجى المحاولة لاحقًا."
      ErrorAlert({
        title: "حدث خطأ أثناء التسجيل",
        text: error,
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
    return coursePlans[0];
  }, [coursePlans]);



  // =========================
  // 💎 Enrollment Button
  // =========================
  function renderEnrollButton() {
    if (isEnrolled)
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to={`/dashboard/classroom/${enrollmentId}`} 
            className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-200 w-full justify-center"
          >
            <PlayCircle className="size-5" />
            متابعة الدورة
          </Link>
        </motion.div>
      );

    if (course?.included_plans?.some((p) => p.is_free))
      return (
        <motion.button 
          onClick={handleEnrollment} 
          disabled={enrolling}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-200 w-full justify-center disabled:opacity-50"
        >
          {enrolling ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري الانضمام...
            </>
          ) : (
            <>
              <CheckCircle className="size-5" />
              انضم مجانًا
            </>
          )}
        </motion.button>
      );

    if (canEnroll)
      return (
        <motion.button 
          onClick={handleEnrollment} 
          disabled={enrolling}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-200 w-full justify-center disabled:opacity-50"
        >
          {enrolling ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري الانضمام...
            </>
          ) : (
            <>
              <Play className="size-5" />
              انضم الآن
            </>
          )}
        </motion.button>
      );

    return nextPlan ? (
      <motion.div 
        className="bg-gradient-to-r from-orange-50 to-emerald-50 border border-orange-200 rounded-2xl p-6 space-y-4"
        variants={fadeInUp}
      >
        <div className="flex items-center gap-2 text-orange-700 font-medium">
          <Award className="size-5" />
          ترقية مطلوبة
        </div>
        <p className="text-gray-700">
          هذه الدورة متاحة في خطة{" "}
          <span className="font-bold text-emerald-700">{nextPlan.name}</span>{" "}
          بسعر <span className="font-bold text-lg">{nextPlan.price} IQD</span>
        </p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link 
            to={`/upgrade/${nextPlan.id}`} 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-200"
          >
            <Target className="size-4" />
            الترقية الآن
          </Link>
        </motion.div>
      </motion.div>
    ) : (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
        <p className="text-gray-600">تواصل مع الدعم للمزيد من المعلومات</p>
      </div>
    );
  }

  // Toggle section expansion
  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // =========================
  // 🧾 Tabs
  // =========================
  function renderTabContent() {
    switch (activeTab) {
      case "curriculum":
        return course?.sections?.length ? (
          <motion.div 
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {course.sections.map((section, index) => (
              <motion.div 
                key={section.id} 
                variants={slideIn}
                className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden shadow-lg"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                      {index + 1}
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-lg text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">
                        {section.lectures?.length || 0} محاضرة • 
                        {section.lectures?.reduce((sum, lec) => sum + lec.duration, 0)} دقيقة
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSections[section.id] ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="size-5 text-gray-500" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedSections[section.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-emerald-100"
                    >
                      <div className="p-6 pt-4 space-y-3">
                        {section.lectures?.map((lecture, lecIndex) => (
                          <motion.div
                            key={lecture.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: lecIndex * 0.05 }}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                {isEnrolled ? (
                                  <Play className="size-4 text-emerald-700" />
                                ) : (
                                  <Lock className="size-4 text-gray-500" />
                                )}
                              </div>
                              <span className="font-medium text-gray-900">{lecture.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="size-4" />
                              <span>{convertMinutes(lecture.duration, "minute")} دقيقة</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16 bg-white/50 rounded-2xl"
            variants={fadeInUp}
          >
            <BookOpen className="size-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا يوجد محتوى دراسي بعد.</p>
          </motion.div>
        );

      case "instructor":
        return (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-8 shadow-lg"
            variants={fadeInUp}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <img 
                  src={getMedia(course?.instructor.profile_picture || "")} 
                  alt="المدرس" 
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-emerald-100 shadow-lg" 
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Award className="size-4 text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {course?.instructor.first_name} {course?.instructor.last_name}
                  </h3>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <User className="size-4" />
                    مدرس معتمد
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {course?.instructor.bio || "مدرس خبير في مجاله مع سنوات من الخبرة في التدريس والتطوير المهني."}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <Users className="size-6 text-emerald-600 mx-auto mb-2" />
                    <div className="font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">طالب</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <Star className="size-6 text-emerald-600 mx-auto mb-2" />
                    <div className="font-bold text-gray-900">4.9</div>
                    <div className="text-sm text-gray-600">تقييم</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "reviews":
        return course?.reviews?.length ? (
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {course.reviews.map((review) => (
              <motion.div 
                key={review.id} 
                variants={slideIn}
                className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg">
                    {review.user.first_name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{review.user.first_name}</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16 bg-white/50 rounded-2xl"
            variants={fadeInUp}
          >
            <Star className="size-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد تقييمات بعد.</p>
          </motion.div>
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
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-emerald-50 to-white"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <motion.div 
        className="bg-white/50 backdrop-blur-sm border-b border-emerald-100"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
            {/* Course Info */}
            <motion.div className="space-y-6" variants={fadeInUp}>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <BookOpen className="size-5" />
                  <span>دورة تدريبية</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {course?.title}
                </h1>
                
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                  {course?.description}
                </p>
              </div>

              {/* Course Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                variants={staggerContainer}
              >
                {[
                  { 
                    title: "الطلاب", 
                    icon: <Users className="size-6 text-emerald-600" />, 
                    value: course?.enrollments_count || 0,
                    suffix: "طالب"
                  },
                  { 
                    title: "المحاضرات", 
                    icon: <BookOpen className="size-6 text-emerald-600" />, 
                    value: course?.lectures_count || 0,
                    suffix: "محاضرة"
                  },
                  { 
                    title: "المدة", 
                    icon: <Clock className="size-6 text-emerald-600" />, 
                    value: Math.ceil((course?.duration || 0) / 60),
                    suffix: "ساعة"
                  },
                  { 
                    title: "التقييم", 
                    icon: <Star className="size-6 text-emerald-600" />, 
                    value: course?.rating?.toFixed(1) || "4.0",
                    suffix: "/5"
                  },
                ].map((stat) => (
                  <motion.div 
                    key={stat.title}
                    variants={fadeInUp}
                    whileHover={{ y: -2 }}
                    className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.suffix}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stat.title}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Instructor Preview */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-6 shadow-lg"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={getMedia(course?.instructor.profile_picture || "")} 
                    alt="المدرس" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200" 
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {course?.instructor.first_name} {course?.instructor.last_name}
                    </div>
                    <div className="text-sm text-emerald-600 font-medium">المدرس</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Course Media & Enrollment */}
            <motion.div className="space-y-6" variants={fadeInUp}>
              {/* Course Media */}
              <div className="relative">
                {course?.intro ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <video 
                      controls 
                      src={getMedia(course.intro)}
                      className="w-full aspect-video object-cover"
                      poster={getMedia(course.cover || "")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img 
                      src={getMedia(course?.cover || "")} 
                      alt={course?.title}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                        <Play className="size-8 text-emerald-600" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enrollment Card */}
              <motion.div 
                className="bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-2xl p-6 shadow-2xl sticky top-8"
                variants={fadeInUp}
              >
                <div className="space-y-4">
                  {/* Price or Status */}
                  <div className="text-center">
                    {course?.included_plans?.some(p => p.is_free) ? (
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                        <CheckCircle className="size-5" />
                        مجانية
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-emerald-600">
                          {coursePlans[0]?.price} IQD
                        </div>
                        <div className="text-sm text-gray-600">شهرياً</div>
                      </div>
                    )}
                  </div>

                  {/* Enrollment Button */}
                  <div className="space-y-3">
                    {renderEnrollButton()}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      <Heart className="size-4" />
                      <span className="text-sm">حفظ</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      <Share2 className="size-4" />
                      <span className="text-sm">مشاركة</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      <Download className="size-4" />
                      <span className="text-sm">تحميل</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Tabs */}
        <motion.div className="space-y-8" variants={fadeInUp}>
          <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-2 shadow-lg">
            {[
              { id: "curriculum", label: "المحتوى الدراسي", icon: <BookOpen className="size-4" /> },
              { id: "instructor", label: "المدرب", icon: <User className="size-4" /> },
              { id: "reviews", label: "التقييمات", icon: <Star className="size-4" /> },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-emerald-600 text-white shadow-lg" 
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white"
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ابدأ رحلتك التعليمية اليوم 🎓
              </h2>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
                انضم إلى آلاف الطلاب الذين يطورون مهاراتهم معنا. ابدأ التعلم الآن واحصل على شهادة معتمدة.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnrollment}
                className="bg-white text-emerald-700 font-bold px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ابدأ الآن
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-medium px-8 py-4 rounded-2xl hover:bg-white hover:text-emerald-700 transition-all duration-300"
              >
                تعلم المزيد
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
