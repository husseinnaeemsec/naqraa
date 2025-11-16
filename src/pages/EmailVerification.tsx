import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface VerificationResult {
  success: boolean;
  message: string;
  email?: string;
}

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<VerificationResult | null>(null);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setResult({
          success: false,
          message: 'رابط التحقق غير صالح أو مفقود'
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/newsletters/verify/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
            email: email
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setResult({
            success: true,
            message: 'تم تأكيد بريدك الإلكتروني بنجاح! مرحباً بك في نقرا',
            email: email
          });
        } else {
          setResult({
            success: false,
            message: data.message || 'فشل في تأكيد البريد الإلكتروني'
          });
        }
      } catch (error) {
        setResult({
          success: false,
          message: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى'
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, email]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md mx-auto">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-6"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-3xl">📧</span>
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">جاري التحقق...</h2>
            <p className="text-gray-600">يرجى الانتظار بينما نتحقق من بريدك الإلكتروني</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className={`px-8 py-12 text-center text-white ${
              result?.success 
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700' 
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: result?.success ? [0, 10, -10, 0] : 0
              }}
              transition={{ 
                duration: 2, 
                repeat: result?.success ? Infinity : 0,
                repeatDelay: 3 
              }}
              className="text-8xl mb-6"
            >
              {result?.success ? '🎉' : '❌'}
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">
              {result?.success ? 'تم التحقق بنجاح!' : 'فشل التحقق'}
            </h1>
            <p className="text-xl opacity-90">
              {result?.success 
                ? 'مرحباً بك في مجتمع نقرا التعليمي' 
                : 'عذراً، لم نتمكن من التحقق من بريدك الإلكتروني'
              }
            </p>
          </motion.div>

          {/* Content */}
          <div className="p-8">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className={`p-6 rounded-2xl ${
                result?.success 
                  ? 'bg-emerald-50 border-2 border-emerald-200' 
                  : 'bg-red-50 border-2 border-red-200'
              }`}>
                <p className={`text-lg ${
                  result?.success ? 'text-emerald-800' : 'text-red-800'
                }`}>
                  {result?.message}
                </p>
                {result?.email && (
                  <p className="text-sm text-gray-600 mt-2">
                    البريد الإلكتروني: {result.email}
                  </p>
                )}
              </div>
            </motion.div>

            {result?.success ? (
              <>
                {/* Success Content */}
                <motion.div variants={itemVariants} className="space-y-6 mb-8">
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    ماذا بعد؟
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200"
                    >
                      <div className="text-3xl mb-3">📚</div>
                      <h4 className="font-bold text-emerald-800 mb-2">استكشف الدورات</h4>
                      <p className="text-sm text-emerald-700">تصفح مكتبتنا الواسعة من الدورات التعليمية</p>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
                    >
                      <div className="text-3xl mb-3">👥</div>
                      <h4 className="font-bold text-blue-800 mb-2">انضم للمجتمع</h4>
                      <p className="text-sm text-blue-700">تواصل مع الطلاب والمعلمين في مجتمعنا</p>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
                    >
                      <div className="text-3xl mb-3">📈</div>
                      <h4 className="font-bold text-purple-800 mb-2">تتبع تقدمك</h4>
                      <p className="text-sm text-purple-700">راقب إنجازاتك وتطور مهاراتك</p>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200"
                    >
                      <div className="text-3xl mb-3">🎯</div>
                      <h4 className="font-bold text-amber-800 mb-2">حدد أهدافك</h4>
                      <p className="text-sm text-amber-700">ضع أهدافك التعليمية وحقق طموحاتك</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/courses"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
                  >
                    🚀 ابدأ التعلم الآن
                  </Link>
                  <Link
                    to="/dashboard"
                    className="bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
                  >
                    📊 لوحة التحكم
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                {/* Error Content */}
                <motion.div variants={itemVariants} className="space-y-6 mb-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      الأسباب المحتملة:
                    </h3>
                    
                    <div className="space-y-3 text-right">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <span className="text-2xl">⏰</span>
                        <div>
                          <p className="font-medium text-gray-800">انتهت صلاحية الرابط</p>
                          <p className="text-sm text-gray-600">الرابط صالح لمدة 24 ساعة فقط</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🔗</span>
                        <div>
                          <p className="font-medium text-gray-800">رابط غير صحيح</p>
                          <p className="text-sm text-gray-600">قد يكون الرابط معطوب أو غير مكتمل</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="font-medium text-gray-800">تم التحقق مسبقاً</p>
                          <p className="text-sm text-gray-600">قد يكون البريد الإلكتروني مُحقق مسبقاً</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    🔄 إعادة المحاولة
                  </button>
                  <Link
                    to="/"
                    className="bg-white hover:bg-gray-50 text-red-600 border-2 border-red-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
                  >
                    🏠 العودة للرئيسية
                  </Link>
                </motion.div>
              </>
            )}

            {/* Footer Info */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-gray-200 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                <span className="text-2xl">🛡️</span>
                <p className="text-sm">
                  نحن نهتم بأمان وخصوصية بياناتك
                </p>
              </div>
              <div className="flex justify-center gap-6 text-sm text-gray-500">
                <Link to="/privacy" className="hover:text-emerald-600 transition-colors">
                  سياسة الخصوصية
                </Link>
                <Link to="/terms" className="hover:text-emerald-600 transition-colors">
                  شروط الاستخدام
                </Link>
                <Link to="/contact" className="hover:text-emerald-600 transition-colors">
                  تواصل معنا
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}