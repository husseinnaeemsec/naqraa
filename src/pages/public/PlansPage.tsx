import { motion } from "framer-motion";
import { HeroCheckIcon, HeroStarIcon, HeroCrownIcon, HeroAcademicCapIcon, HeroBoltIcon, HeroShieldCheckIcon, HeroBuildingOffice2Icon, HeroUserIcon } from "../../components/Icons";
import { useState, useEffect, type ReactElement } from "react";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { type SubscriptionPlan } from "../../../types";
import Spinner from "../../components/Spinner";
import { useAppSelector } from "../../store";
import { useNavigate } from "react-router-dom";
import { WarningAlert } from "../../components/alerts";
import { useTranslation } from "react-i18next";

type UserType = 'user' | 'student' | 'organization';

interface UserTypeOption {
  key: UserType;
  label: string;
  icon: ReactElement;
  description: string;
}

const userTypeOptions: UserTypeOption[] = [
  {
    key: 'user',
    label: 'المعلمون والمبدعون',
    icon: <HeroAcademicCapIcon className="size-5" />,
    description: 'خطط للمعلمين ومنشئي المحتوى التعليمي'
  },
  {
    key: 'student',
    label: 'الطلاب',
    icon: <HeroUserIcon className="size-5" />,
    description: 'خطط مخصصة للطلاب'
  },
  {
    key: 'organization',
    label: 'المؤسسات',
    icon: <HeroBuildingOffice2Icon className="size-5" />,
    description: 'حلول مؤسسية متقدمة'
  }
];

const additionalFeatures = [
  {
    title: "ضمان استرداد الأموال",
    description: "نضمن لك استرداد كامل خلال 30 يوماً من تاريخ الاشتراك",
    icon: <HeroShieldCheckIcon className="size-6" />
  },
  {
    title: "تحديثات مجانية",
    description: "احصل على كل المحتوى والميزات الجديدة تلقائياً",
    icon: <HeroCheckIcon className="size-6" />
  },
  {
    title: "دعم على مدار الساعة",
    description: "فريق الدعم متاح 24/7 لمساعدتك في أي وقت",
    icon: <HeroStarIcon className="size-6" />
  }
];

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  
  // Set default user type based on authenticated user's role, fallback to 'user'
  const getDefaultUserType = (): UserType => {
    if (isAuthenticated && user?.role) {
      // Map user roles to plan types
      switch (user.role) {
        case 'student':
          return 'student';
        case 'teacher':
        case 'user':
        default:
          return 'user';
      }
    }
    return 'user'; // Default fallback
  };

  const [selectedUserType, setSelectedUserType] = useState<UserType>(getDefaultUserType());
  const navigate = useNavigate();

  // Update selected user type when authentication state changes
  useEffect(() => {
    setSelectedUserType(getDefaultUserType());
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    loadPlans(selectedUserType);
  }, [selectedUserType]);

  const loadPlans = async (userType: UserType = 'user') => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoints.subscriptions.plans, {
        params: { role: userType }
      });
      setPlans(response.data || []);
    } catch (err: any) {
      console.error("Error loading plans:", err);
      setError("حدث خطأ في تحميل خطط الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = (userType: UserType) => {
    setSelectedUserType(userType);
    // Clear any role error when changing user type
    setRoleError(null);
    // Scroll to top to show the updated plans
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubscription = (plan: SubscriptionPlan) => {
    // Clear any previous role error
    setRoleError(null);
    
    // If this is the user's current plan, redirect to subscription management
    if (isCurrentPlan(plan)) {
      navigate('/dashboard/subscription');
      return;
    }
    
    if (!isAuthenticated) {
      // Show SweetAlert for login requirement
      WarningAlert({
        title: t('subscription_page.login_required_title'),
        text: t('subscription_page.login_required_message'),
        confirmText: t('subscription_page.login_button'),
        cancelText: t('subscription_page.cancel_button'),
        onConfirm: () => {
          navigate('/login?next=/plans');
        }
      });
      return;
    }

    // Check if plan role matches user role
    const userRole = user?.role;
    const planRole = plan.role;

    // Check if user can subscribe to this plan
    if (planRole !== userRole) {
      // Show error message for role mismatch
      setRoleError(`هذه الخطة مخصصة للـ${getPlanRoleLabel(planRole)}. يرجى تبديل نوع الحساب أو اختيار خطة مناسبة لنوع حسابك.`);
      // Scroll to top to show the error message
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    // If plan matches user type, redirect to subscription management
    navigate('/dashboard/subscription');
  };

  const getPlanRoleLabel = (role: string) => {
    switch (role) {
      case 'user':
        return 'معلمين ومبدعين';
      case 'student':
        return 'طلاب';
      case 'organization':
        return 'مؤسسات';
      default:
        return 'معلمين ومبدعين';
    }
  };



  const isCurrentPlan = (plan: SubscriptionPlan) => {
    if (!isAuthenticated || !user?.subscription) {
      return false;
    }
    return user.subscription.plan.id === plan.id && user.subscription.is_active_subscription;
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('free') || name.includes('مجان')) {
      return <HeroAcademicCapIcon className="size-8" />;
    } else if (name.includes('pro') || name.includes('مهني')) {
      return <HeroBoltIcon className="size-8" />;
    } else if (name.includes('enterprise') || name.includes('مؤسس')) {
      return <HeroCrownIcon className="size-8" />;
    } else {
      return <HeroStarIcon className="size-8" />;
    }
  };

  const getPlanColorScheme = (plan: SubscriptionPlan, index: number) => {
    if (plan.is_free) {
      return {
        color: "from-slate-500 to-slate-600",
        bgColor: "from-slate-50 to-slate-100"
      };
    } else if (plan.is_popular) {
      return {
        color: "from-emerald-500 to-teal-500",
        bgColor: "from-emerald-50 to-teal-50"
      };
    } else {
      const colors = [
        { color: "from-blue-500 to-indigo-500", bgColor: "from-blue-50 to-indigo-50" },
        { color: "from-purple-500 to-pink-500", bgColor: "from-purple-50 to-pink-50" },
        { color: "from-orange-500 to-red-500", bgColor: "from-orange-50 to-red-50" },
      ];
      return colors[index % colors.length];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-slate-600">جاري تحميل الخطط...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => loadPlans(selectedUserType)}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-10 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            اختر الخطة المناسبة <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">لأهدافك</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            ابدأ رحلتك التعليمية اليوم مع خطط مرنة تناسب احتياجاتك وميزانيتك
          </p>
          
          {/* User Account Type Indicator */}
          {isAuthenticated && user && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <HeroUserIcon className="size-4" />
              <span>حسابك الحالي: {getPlanRoleLabel(user.role)}</span>
            </div>
          )}

          {/* Role Error Message */}
          {roleError && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-800 font-medium">{roleError}</p>
                <button
                  onClick={() => setRoleError(null)}
                  className="mr-auto text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* User Type Selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 gap-1">
              {userTypeOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleUserTypeChange(option.key)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    selectedUserType === option.key
                      ? 'bg-white text-emerald-600 shadow-md transform scale-105'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                  title={option.description}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Dynamic Plans Section */}
        <div className="mb-16">
          {/* Section Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-emerald-600">
                {selectedUserType === 'user' && <HeroAcademicCapIcon className="size-8" />}
                {selectedUserType === 'student' && <HeroUserIcon className="size-8" />}
                {selectedUserType === 'organization' && <HeroBuildingOffice2Icon className="size-8" />}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {
                  selectedUserType === 'user' ? 'خطط المعلمين والمبدعين' :
                  selectedUserType === 'student' ? 'خطط الطلاب' :
                  'خطط المؤسسات'
                }
              </h2>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-4">
              {
                selectedUserType === 'user' ? 'اختر الخطة المناسبة لك كمعلم أو مبدع محتوى واستمتع بأدوات تعليمية متقدمة' :
                selectedUserType === 'student' ? 'ابدأ رحلتك التعليمية مع خطط مصممة خصيصاً للطلاب' :
                'حلول تعليمية متقدمة للمؤسسات التعليمية'
              }
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-6"></div>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan, index) => {
                      const colorScheme = getPlanColorScheme(plan, index);
                      const planIcon = getPlanIcon(plan.name);
                      const planName = plan.name_ar || plan.name;
                      const planDescription = plan.description_ar || plan.description;
                      const features = plan.features_ar && plan.features_ar.length > 0 
                        ? plan.features_ar 
                        : plan.features_list || [];
                      const period = plan.duration_months > 1 
                        ? `${plan.duration_months} أشهر` 
                        : 'شهر';
            
            return (
              <motion.div
                key={plan.id}
                className={`relative bg-white border-2 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl transform hover:scale-105 ${
                  isCurrentPlan(plan)
                    ? 'border-blue-500 shadow-xl bg-blue-50/30'
                    : plan.is_popular 
                      ? 'border-emerald-500 shadow-xl' 
                      : 'border-slate-200 hover:border-slate-300 shadow-md'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  delay: index * 0.1
                }}
              >
                {/* Popular Badge */}
                {plan.is_popular && !isCurrentPlan(plan) && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      الأكثر شعبية
                    </div>
                  </div>
                )}
                
                {/* Current Plan Badge */}
                {isCurrentPlan(plan) && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <HeroCheckIcon className="size-4" />
                      خطتك الحالية
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colorScheme.bgColor} mb-4`}>
                    <div className={`text-transparent bg-gradient-to-r ${colorScheme.color} bg-clip-text`}>
                      {planIcon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {planName}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {planDescription}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    {plan.is_free ? (
                      <span className="text-4xl font-bold text-emerald-600">
                        مجانية
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-slate-900">
                          {plan.price}
                        </span>
                        <span className="text-slate-600">$</span>
                      </>
                    )}
                  </div>
                  {!plan.is_free && (
                    <span className="text-slate-500 text-sm">
                      / {period}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${colorScheme.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <HeroCheckIcon className="size-3 text-white" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.features && plan.features.length > 0 && plan.features.map((feature, featureIndex) => (
                    <li key={`obj-feature-${featureIndex}`} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${colorScheme.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <HeroCheckIcon className="size-3 text-white" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button 
                  onClick={() => handleSubscription(plan)}
                  className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                    isCurrentPlan(plan)
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-default'
                      : plan.is_popular
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg'
                        : `bg-gradient-to-r ${colorScheme.color} text-white hover:opacity-90 shadow-md`
                  }`}
                  disabled={isCurrentPlan(plan)}
                >
                  {isCurrentPlan(plan) 
                    ? 'خطتك الحالية' 
                    : plan.is_free 
                      ? 'ابدأ مجاناً' 
                      : 'اشترك الآن'
                  }
                </button>
              </motion.div>
            );
          })}
          </div>
        </div>

        {/* Additional Features Section */}
        <motion.div
          className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 sm:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              مزايا إضافية مع كل الخطط
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              استمتع بهذه المزايا الحصرية مع أي خطة تختارها
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1
                }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-4">
                  <div className="text-emerald-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ or Contact Section */}
        <motion.div
          className="text-center mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold mb-4">
            هل لديك أسئلة حول الخطط؟
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            فريق المبيعات جاهز لمساعدتك في اختيار الخطة المثالية لاحتياجاتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all duration-200 transform hover:scale-105">
              تواصل معنا
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-200 transform hover:scale-105">
              اطلب عرض توضيحي
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}