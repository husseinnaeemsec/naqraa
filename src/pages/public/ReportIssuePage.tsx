import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({ name: '', email: '', issue: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    // هنا يمكن إضافة منطق إرسال البيانات إلى API أو بريد إلكتروني
    // Report submitted successfully
    setSubmitted(true);
    setFormData({ name: '', email: '', issue: '' });
  };

  return (
    <div className="min-h-screen bg-white py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">أبلغ عن مشكلة</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            نحن نقدر ملاحظاتك ونعمل باستمرار على تحسين تجربتك. يرجى وصف المشكلة التي واجهتها.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white shadow-xl rounded-3xl p-8 sm:p-10 md:p-12 border border-slate-200"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">شكراً لتواصلك!</h2>
              <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                تم استلام تقريرك وسنتابع معك قريباً. نحن نقدر ملاحظاتك ونعمل على تحسين تجربتك.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSubmitted(false)}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
              >
                إرسال تقرير جديد
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-3 text-lg">الاسم الكامل</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-900 placeholder-slate-500"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3 text-lg">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-900 placeholder-slate-500"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3 text-lg">وصف المشكلة</label>
                <textarea
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-900 placeholder-slate-500 resize-none"
                  placeholder="وصف المشكلة بالتفصيل..."
                ></textarea>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
                >
                  إرسال التقرير
                </motion.button>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
