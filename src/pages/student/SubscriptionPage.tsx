import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, X, Crown, Zap, Users, BookOpen, Shield, CreditCard } from "lucide-react";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import Spinner from "../../components/Spinner";

import { type SubscriptionPlan, type Subscription as SubscriptionType } from "../../../types";
import Swal from "sweetalert2";
import { useAppSelector } from "../../store/store";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { user } = useAppSelector((state: any) => state.auth);

  // Get current subscription from user state if available
  useEffect(() => {
    if (user?.subscription) {
      setCurrentSubscription(user.subscription);
    }
  }, [user]);

  useEffect(() => {
    loadData();
    
    // Handle success/cancel from Stripe redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      Swal.fire({
        title: 'تم بنجاح!',
        text: 'تم تفعيل اشتراكك بنجاح. مرحباً بك!',
        icon: 'success',
        confirmButtonText: 'حسنا'
      }).then(() => {
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    } else if (urlParams.get('cancelled') === 'true') {
      Swal.fire({
        title: 'تم إلغاء العملية',
        text: 'تم إلغاء عملية الدفع. يمكنك المحاولة مرة أخرى.',
        icon: 'info',
        confirmButtonText: 'حسنا'
      }).then(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load current subscription status
      try {
        const currentRes = await api.get(endpoints.subscriptions.status);
        if (currentRes.data.has_subscription) {
          setCurrentSubscription(currentRes.data);
        }
      } catch (err: any) {
        console.log("No current subscription:", err.response?.status);
        // No current subscription is fine
      }

      // Load available plans
      try {
        const plansRes = await api.get(endpoints.subscriptions.plans,{ params: { role:user.role} });
        setPlans(plansRes.data || []);
      } catch (err: any) {
        console.error("Error loading plans:", err);
        setError("حدث خطأ في تحميل خطط الاشتراك");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: number) => {
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) return;

    try {
      setProcessingPlan(planId);
      setPaymentLoading(true);
      setError(null);

      // Check if user has an existing subscription and warn about replacement
      const hasExistingSubscription = currentSubscription && currentSubscription.is_active_subscription;
      
      // Handle free plans
      if (selectedPlan.is_free) {
        let confirmationConfig: any = {
          title: 'تأكيد الاشتراك',
          text: `هل تريد تفعيل الخطة المجانية: ${selectedPlan.name_ar || selectedPlan.name}؟`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'نعم، فعّل',
          cancelButtonText: 'إلغاء'
        };

        // Add warning if user has existing subscription
        if (hasExistingSubscription) {
          confirmationConfig = {
            title: '⚠️ تحذير - استبدال الاشتراك',
            html: `
              <div class="text-right">
                <p class="text-red-600 font-bold mb-3">⚠️ تحذير مهم:</p>
                <p class="mb-2">لديك حاليا اشتراك نشط في خطة: <strong>${currentSubscription.plan.name_ar || currentSubscription.plan.name}</strong></p>
                <p class="mb-2">بتفعيل الخطة الجديدة: <strong>${selectedPlan.name_ar || selectedPlan.name}</strong></p>
                <p class="text-red-600 mb-3">سيتم إلغاء اشتراكك الحالي نهائياً واستبداله بالخطة الجديدة</p>
                <p class="text-sm text-gray-600">الأيام المتبقية في اشتراكك الحالي: ${currentSubscription.remaining_days} يوم</p>
              </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، استبدل الاشتراك',
            cancelButtonText: 'إلغاء'
          };
        }

        const result = await Swal.fire(confirmationConfig);

        if (result.isConfirmed) {
          // Create free subscription directly
          const freeResponse = await api.post(endpoints.subscriptions.createCheckout, {
            plan_id: planId
          });
          
          if (freeResponse.data.success) {
            Swal.fire({
              title: 'نجح!',
              text: 'تم تفعيل الخطة المجانية بنجاح!',
              icon: 'success',
              confirmButtonText: 'حسنا'
            });
            await loadData();
          }
        }
        return;
      }

      // Handle paid plans - First show subscription replacement warning if needed
      let confirmationConfig: any = {
        title: 'تأكيد الاشتراك',
        html: `
          <div class="text-right">
            <p><strong>الخطة:</strong> ${selectedPlan.name_ar || selectedPlan.name}</p>
            <p><strong>السعر:</strong> $${selectedPlan.price} / ${selectedPlan.duration_months > 1 ? `${selectedPlan.duration_months} أشهر` : 'شهر'}</p>
            <p class="text-sm text-gray-600 mt-2">سيتم توجيهك إلى صفحة الدفع الآمنة</p>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'متابعة للدفع',
        cancelButtonText: 'إلغاء'
      };

      // Add warning for existing subscription replacement
      if (hasExistingSubscription) {
        confirmationConfig = {
          title: '⚠️ تحذير - استبدال الاشتراك المدفوع',
          html: `
            <div class="text-right">
              <p class="text-red-600 font-bold mb-3">⚠️ تحذير مهم:</p>
              <p class="mb-2">لديك حاليا اشتراك نشط في خطة: <strong>${currentSubscription.plan.name_ar || currentSubscription.plan.name}</strong></p>
              <p class="mb-2">الخطة الجديدة: <strong>${selectedPlan.name_ar || selectedPlan.name}</strong> - $${selectedPlan.price}</p>
              <p class="text-red-600 mb-2">سيتم إلغاء اشتراكك الحالي نهائياً واستبداله بالخطة الجديدة</p>
              <p class="text-orange-600 mb-3">لن يتم استرداد المبلغ المدفوع للخطة الحالية</p>
              <p class="text-sm text-gray-600 border-t pt-2">الأيام المتبقية في اشتراكك الحالي: ${currentSubscription.remaining_days} يوم</p>
              <p class="text-sm text-gray-600 mt-1">سيتم توجيهك إلى صفحة الدفع الآمنة</p>
            </div>
          `,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'نعم، استبدل الاشتراك والدفع',
          cancelButtonText: 'إلغاء'
        };
      }

      const confirmResult = await Swal.fire(confirmationConfig);

      if (!confirmResult.isConfirmed) {
        return;
      }

      // Create Stripe Checkout Session
      const response = await api.post(endpoints.subscriptions.createCheckout, {
        plan_id: planId,
        success_url: `${window.location.origin}/dashboard/subscription?success=true`,
        cancel_url: `${window.location.origin}/dashboard/subscription?cancelled=true`
      });

      const { checkout_url } = response.data;

      // Redirect to Stripe Checkout
      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        throw new Error('Failed to create checkout session');
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "حدث خطأ في معالجة الدفع";
      setError(errorMessage);
      Swal.fire({
        title: 'خطأ!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'حسنا'
      });
    } finally {
      setProcessingPlan(null);
      setPaymentLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return <BookOpen className="w-8 h-8" />;
      case 'pro':
        return <Crown className="w-8 h-8" />;
      case 'enterprise':
        return <Users className="w-8 h-8" />;
      default:
        return <Zap className="w-8 h-8" />;
    }
  };

  if (loading || paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">
            {loading ? 'جاري تحميل البيانات...' : 'جاري تجهيز عملية الدفع...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
          >
            ارتقِ بتجربتك التعليمية
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            اختر الخطة التي تناسب احتياجاتك وأهدافك التعليمية
          </motion.p>
        </div>

        {/* Current Subscription */}
        {currentSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-12 border-l-4 border-emerald-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  الاشتراك الحالي: {currentSubscription.plan.name_ar || currentSubscription.plan.name}
                </h3>
                <p className="text-gray-600">
                  ينتهي في: {new Date(currentSubscription.end_date).toLocaleDateString('ar')}
                </p>
                <p className="text-sm text-gray-500">
                  الحالة: {currentSubscription.is_active_subscription ? 'نشط' : 'غير نشط'}
                </p>
                <p className="text-sm text-gray-500">
                  الأيام المتبقية: {currentSubscription.remaining_days}
                </p>
              </div>
              <div className="text-emerald-600">
                <Shield className="w-8 h-8" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-500 ml-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={`relative bg-white  rounded-2xl border shadow-lg overflow-hidden ${
                plan.is_popular ? 'ring-2 ring-emerald-500 scale-105' : ''
              }`}
            >
              {plan.is_popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-center py-2 text-sm font-medium">
                    الأكثر شعبية
                  </div>
                </div>
              )}

              <div className="p-8 flex mt-5 flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.is_popular ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getPlanIcon(plan.name)}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                  {plan.name_ar || plan.name}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {plan.description_ar || plan.description}
                </p>

                <div className="text-center mb-8">
                  {plan.is_free ? (
                    <span className="text-4xl font-bold text-emerald-600">
                      مجانية
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 mr-2">
                        / {plan.duration_months > 1 ? `${plan.duration_months} أشهر` : 'شهر'}
                      </span>
                    </>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {(plan.features_ar && plan.features_ar.length > 0 ? plan.features_ar : plan.features_list || []).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-500 ml-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.features && plan.features.length > 0 && plan.features.map((feature, featureIndex) => (
                    <li key={`feature-${featureIndex}`} className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-500 ml-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature.name}</span>
                    </li>
                  ))}
                </ul>

                </div>
                {/* Warning indicator for subscription replacement */}
                {currentSubscription && currentSubscription.is_active_subscription && currentSubscription.plan.id !== plan.id && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center text-orange-800 text-sm">
                      <X className="w-4 h-4 ml-2 text-orange-600" />
                      <span>سيتم استبدال اشتراكك الحالي ({currentSubscription.plan.name_ar || currentSubscription.plan.name})</span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={processingPlan === plan.id || (currentSubscription?.plan.id === plan.id)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    currentSubscription?.plan.id === plan.id
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.is_popular
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 transform hover:scale-105'
                      : currentSubscription && currentSubscription.is_active_subscription && currentSubscription.plan.id !== plan.id
                      ? 'bg-orange-600 text-white hover:bg-orange-700 transform hover:scale-105'
                      : 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105'
                  }`}
                >
                  {processingPlan === plan.id ? (
                    <div className="flex items-center justify-center">
                      <Spinner />
                      <span className="mr-2">جاري المعالجة...</span>
                    </div>
                  ) : currentSubscription?.plan.id === plan.id ? (
                    'الخطة الحالية'
                  ) : (
                    <div className="flex items-center justify-center">
                      {currentSubscription && currentSubscription.is_active_subscription && currentSubscription.plan.id !== plan.id ? (
                        <>
                          <X className="w-4 h-4 ml-2" />
                          {plan.is_free ? 'استبدال بخطة مجانية' : 'استبدال الاشتراك'}
                        </>
                      ) : (
                        <>
                          {!plan.is_free && <CreditCard className="w-4 h-4 ml-2" />}
                          {plan.is_free ? 'تفعيل الخطة' : 'اختيار الخطة'}
                        </>
                      )}
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            أسئلة شائعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                هل يمكنني إلغاء الاشتراك في أي وقت؟
              </h3>
              <p className="text-gray-600">
                نعم، يمكنك إلغاء اشتراكك في أي وقت من لوحة التحكم. ستحتفظ بالوصول حتى نهاية فترة الاشتراك.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                هل توجد فترة تجريبية مجانية؟
              </h3>
              <p className="text-gray-600">
                نعم، جميع الخطط تأتي مع فترة تجريبية مجانية لمدة 7 أيام.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}