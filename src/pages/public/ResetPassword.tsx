import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLogo } from '../../utils/functions';
import { useAppSelector } from '../../store';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function ResetPasswordPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  // إذا كان المستخدم مسجل دخول، وجهه إلى الإعدادات
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    if (!email) {
      setErrors(['البريد الإلكتروني مطلوب.']);
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(['يرجى إدخال بريد إلكتروني صحيح.']);
      setLoading(false);
      return;
    }

    // TODO: Replace this with actual API call
    // Simulate API call for now
    setTimeout(() => {
      setEmailSent(true);
      setLoading(false);
    }, 2000);

    // Actual implementation would be:
    // api.post(endpoints.user.requestPasswordReset, { email })
    //   .then((res) => {
    //     setEmailSent(true);
    //   })
    //   .catch((e) => {
    //     if (e.response) {
    //       if (e.response.status === 500) {
    //         setErrors(["حصل خطأ في الخادم الرجاء المحاولة في وقت آخر"]);
    //       } else {
    //         setErrors([e.response.data.error || e.response.data.detail || "البريد الإلكتروني غير مسجل"]);
    //       }
    //     } else {
    //       setErrors(["حصل خطأ أثناء عملية إرسال الرابط الرجاء المحاولة في وقت آخر"]);
    //     }
    //   })
    //   .finally(() => setLoading(false));
  };

  // إذا كان المستخدم مسجل دخول، عرض رسالة التوجيه للإعدادات
  if (isAuthenticated) {
    return (
      <div className="bg-emerald-50 dark:bg-dark-emerald w-screen h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-emerald-950 rounded-2xl p-8 dashboard-box max-w-md mx-4">
          <div className="text-center">
            <div className="mb-6">
              <img src={getLogo()} className='size-20 mx-auto' />
            </div>
            <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-200 mb-4">
              أنت مسجل دخول بالفعل
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              لتغيير كلمة المرور، توجه إلى لوحة التحكم ثم الإعدادات
            </p>
            <div className="space-y-3">
              <Link 
                to="/dashboard" 
                className="w-full bg-emerald-500 text-white p-3 rounded hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                الذهاب إلى لوحة التحكم
              </Link>
              <Link 
                to="/dashboard/settings" 
                className="w-full border border-emerald-500 text-emerald-500 p-3 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center justify-center gap-2"
              >
                الإعدادات مباشرة
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 pt-24 pb-20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      <div className="max-w-md mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
          <Link to={'/'} className="text-7xl font-bold font-handjet text-emerald-50 rounded-full flex items-center justify-center">
            <img src={getLogo()} className='size-20' />
          </Link>

          {!emailSent ? (
            <>
              <h1 className="text-4xl text-center mb-2 text-emerald-700 dark:text-emerald-200">
                إعادة تعيين كلمة المرور
              </h1>
              <p className="text-center mb-4 text-gray-600 dark:text-gray-300 max-w-sm">
                أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.
              </p>

              <form className="w-full max-w-sm flex flex-col gap-3" onSubmit={handleResetPassword}>
                {errors.length > 0 && (
                  <div className="bg-red-100 dark:bg-red-900/50 px-3 text-red-700 dark:text-red-50 p-2 rounded">
                    {errors.map((err, i) => <p className='text-center' key={i}>{err}</p>)}
                  </div>
                )}
                
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-emerald-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-500 text-white p-3 rounded hover:bg-emerald-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:hover:bg-emerald-600 transition-colors"
                >
                  {loading ? 'جارٍ الإرسال...' : 'إرسال رابط إعادة التعيين'}
                </button>
                
                <div className="text-center space-y-2">
                  <p className='text-sm text-slate-500'>
                    تذكرت كلمة المرور؟ 
                    <Link className='underline text-emerald-600 dark:text-emerald-400 mr-1' to={'/login'}>
                      تسجيل الدخول
                    </Link>
                  </p>
                  <p className='text-sm text-slate-500'>
                    ليس لديك حساب بعد؟ 
                    <Link className='underline text-emerald-600 dark:text-emerald-400 mr-1' to={'/register'}>
                      إنشاء حساب جديد
                    </Link>
                  </p>
                </div>
              </form>
            </>
          ) : (
            // صفحة تأكيد إرسال البريد
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="w-20 h-20 text-emerald-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">
                تم إرسال الرابط!
              </h1>
              
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p>
                  تم إرسال رابط إعادة تعيين كلمة المرور إلى:
                </p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {email}
                </p>
                <p className="text-sm">
                  يرجى فحص بريدك الإلكتروني واتباع التعليمات لإعادة تعيين كلمة المرور.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  لم تستلم البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها أو المهملات.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                    setErrors([]);
                  }}
                  className="w-full border border-emerald-500 text-emerald-500 p-3 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  إرسال رابط آخر
                </button>
                
                <Link
                  to="/login"
                  className="w-full bg-emerald-500 text-white p-3 rounded hover:bg-emerald-600 transition-colors flex items-center justify-center"
                >
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}