import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function ReportIssuePage() {
  const { t } = useTranslation();
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
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t('report_issue.title')}</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            {t('report_issue.subtitle')}
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('report_issue.success.title')}</h2>
              <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                {t('report_issue.success.message')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSubmitted(false)}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
              >
                {t('report_issue.success.new_report')}
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
                <label className="block text-slate-700 font-semibold mb-3 text-lg">{t('report_issue.form.name_label')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-900 placeholder-slate-500"
                  placeholder={t('report_issue.form.name_placeholder')}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3 text-lg">{t('report_issue.form.email_label')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-900 placeholder-slate-500"
                  placeholder={t('report_issue.form.email_placeholder')}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3 text-lg">{t('report_issue.form.issue_label')}</label>
                <textarea
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border border-slate-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-900 placeholder-slate-500 resize-none"
                  placeholder={t('report_issue.form.issue_placeholder')}
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
                  {t('report_issue.form.submit_button')}
                </motion.button>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
