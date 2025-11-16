import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterVerificationDemo() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'sent' | 'verified'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('يرجى إدخال بريد إلكتروني صالح');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/newsletters/subscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          wants_course_updates: true,
          wants_new_content: true,
          wants_promotions: true,
          wants_announcements: true,
          source: 'verification_demo'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('sent');
        setMessage(data.message || 'تم إرسال رابط التحقق بنجاح');
      } else {
        setMessage(data.email?.[0] || data.message || 'حدث خطأ أثناء الاشتراك');
      }
    } catch (error) {
      setMessage('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12" dir="rtl">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              نظام تأكيد البريد الإلكتروني 📧
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تجربة تفاعلية لنظام تأكيد البريد الإلكتروني في منصة نقرا التعليمية
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Main Form/Content */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {step === 'form' && (
                  <>
                    {/* Subscription Form */}
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-12 text-white text-center">
                      <div className="text-6xl mb-4">🎯</div>
                      <h2 className="text-3xl font-bold mb-4">اشترك في النشرة الإخبارية</h2>
                      <p className="text-emerald-100 text-lg">
                        احصل على آخر الدورات والمحتويات التعليمية
                      </p>
                    </div>
                    
                    <div className="p-8">
                      <form onSubmit={handleSubscribe} className="space-y-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            البريد الإلكتروني *
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@domain.com"
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 text-lg"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              📮 اشتراك مع التحقق
                            </>
                          )}
                        </button>

                        {message && (
                          <div className="p-4 rounded-xl bg-red-100 text-red-800 border border-red-200">
                            {message}
                          </div>
                        )}
                      </form>
                    </div>
                  </>
                )}

                {step === 'sent' && (
                  <>
                    {/* Email Sent Confirmation */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          repeatDelay: 3 
                        }}
                        className="text-6xl mb-4"
                      >
                        📧
                      </motion.div>
                      <h2 className="text-3xl font-bold mb-4">تم إرسال رابط التحقق!</h2>
                      <p className="text-blue-100 text-lg">
                        تحقق من صندوق البريد الوارد
                      </p>
                    </div>
                    
                    <div className="p-8">
                      <div className="text-center space-y-6">
                        <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
                          <h3 className="text-xl font-bold text-blue-800 mb-3">✅ تم الإرسال بنجاح</h3>
                          <p className="text-blue-700 mb-4">{message}</p>
                          <p className="text-sm text-blue-600">
                            إلى: <strong>{email}</strong>
                          </p>
                        </div>

                        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl">
                          <h4 className="text-lg font-bold text-amber-800 mb-3">⏰ ملاحظة مهمة</h4>
                          <p className="text-amber-700 text-sm leading-relaxed">
                            رابط التحقق صالح لمدة 24 ساعة فقط. إذا لم تجد البريد الإلكتروني، 
                            تحقق من مجلد الرسائل غير المرغوب فيها (Spam).
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setStep('form');
                            setEmail('');
                            setMessage('');
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                        >
                          🔄 إرسال رابط جديد
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Process Flow */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  خطوات التحقق 🔄
                </h3>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    step === 'form' ? 'bg-emerald-100 border-2 border-emerald-300' : 'bg-gray-50'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      step === 'form' ? 'bg-emerald-600' : step === 'sent' || step === 'verified' ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      {step === 'sent' || step === 'verified' ? '✓' : '1'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">إدخال البريد الإلكتروني</h4>
                      <p className="text-sm text-gray-600">املأ النموذج واضغط اشتراك</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    step === 'sent' ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      step === 'sent' ? 'bg-blue-600' : step === 'verified' ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      {step === 'verified' ? '✓' : '2'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">استلام البريد الإلكتروني</h4>
                      <p className="text-sm text-gray-600">تحقق من صندوق البريد الوارد</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    step === 'verified' ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-50'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      step === 'verified' ? 'bg-green-600' : 'bg-gray-400'
                    }`}>
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">النقر على رابط التحقق</h4>
                      <p className="text-sm text-gray-600">اضغط على الزر في البريد الإلكتروني</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    step === 'verified' ? 'bg-emerald-100 border-2 border-emerald-300' : 'bg-gray-50'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      step === 'verified' ? 'bg-emerald-600' : 'bg-gray-400'
                    }`}>
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">اكتمال التحقق</h4>
                      <p className="text-sm text-gray-600">تفعيل الاشتراك وإرسال رسالة ترحيب</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Info */}
              <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  مميزات النظام 🌟
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">تأكيد البريد الإلكتروني الآمن</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">قوالب بريد إلكتروني جميلة</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">متجاوب مع الأجهزة المحمولة</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">تتبع فتح الرسائل</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">إلغاء الاشتراك بنقرة واحدة</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Demo Navigation */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 inline-block">
              <h4 className="text-lg font-bold text-gray-900 mb-4">🎮 تجربة النظام</h4>
              <div className="flex gap-4 justify-center">
                <a
                  href="/newsletter/verify?token=demo&email=test@example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🔗 صفحة التحقق
                </a>
                <a
                  href="/newsletter-demo"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  📋 نموذج كامل
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}