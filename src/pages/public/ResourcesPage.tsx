import { useState } from 'react';
import { motion } from 'framer-motion';
import finalProjectImage from '../../assets/final-projects.svg';

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');

  const grades = [
    { code: 'elementary', display: 'الابتدائية' },
    { code: 'middle', display: 'المتوسطة' },
    { code: 'high', display: 'الثانوية' },
    { code: 'university', display: 'الجامعية' }
  ];

  const subjects = [
    { code: 'math', display: 'الرياضيات' },
    { code: 'science', display: 'العلوم' },
    { code: 'arabic', display: 'اللغة العربية' },
    { code: 'english', display: 'اللغة الإنجليزية' },
    { code: 'history', display: 'التاريخ' },
    { code: 'physics', display: 'الفيزياء' },
    { code: 'chemistry', display: 'الكيمياء' },
    { code: 'biology', display: 'الأحياء' }
  ];

  const sections = [
    {
      title: 'الملخصات',
      content: 'تصفح ملخصات المواد التي تم كتابتها من قبل معلمين متمرسين على المادة',
      gradient: 'from-emerald-50 to-teal-50',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      icon: '📝'
    },
    {
      title: 'الملازم',
      content: 'الآلاف من الملازم المجانية من أمهر الأساتذة في العراق',
      gradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      icon: '📚'
    },
    {
      title: 'أوراق البحث',
      content: 'أوراق بحث مترجمة ومنقحة من طلبة متميزين وأساتذة أصحاب خبرة',
      gradient: 'from-purple-50 to-indigo-50',
      iconBg: 'bg-gradient-to-br from-purple-100 to-indigo-100',
      icon: '📄'
    },
    {
      title: 'الكتب',
      content: 'كتب المواد الرسمية من وزارة التربية والتعليم العراقي',
      gradient: 'from-amber-50 to-orange-50',
      iconBg: 'bg-gradient-to-br from-amber-100 to-orange-100',
      icon: '📖'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // TODO: Implement form submission logic
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      {/* Header Section */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-600 rounded-full ml-2"></span>
              كل ما تحتاجه في مكان واحد
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight space-x-2">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">نقرأ</span>
              <span className="text-slate-700">لكل طالب عراقي</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg">
              وفرنا لك جميع الملفات والموارد التعليمية التي تحتاجها في مكان واحد، 
              من ملخصات وملازم وكتب رسمية وأوراق بحث.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-2xl opacity-20 absolute -top-4 -left-4 -z-10"></div>
              <div className="w-64 h-64 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-6xl">
                <img src={finalProjectImage} />
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Search Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            ابحث عن المصادر حسب مرحلتك الدراسية
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  المرحلة الدراسية
                </label>
                <select
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-4 pr-10 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 text-slate-700 appearance-none"
                >
                  <option value="">اختر المرحلة الدراسية</option>
                  {grades.map((g) => (
                    <option key={g.code} value={g.code}>
                      {g.display}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  المادة الدراسية
                </label>
                <select
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-4 pr-10 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 text-slate-700 appearance-none"
                >
                  <option value="">اختر المادة الدراسية</option>
                  {subjects.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.display}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
            >
              ابحث عن المصادر
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Resources Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-slate-900 mb-16 text-center"
        >
          أنواع المصادر المتاحة
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`bg-gradient-to-br ${section.gradient} rounded-3xl p-8 border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className={`${section.iconBg} w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <div className="text-3xl">{section.icon}</div>
                </div>
                <div className="flex-1 text-center sm:text-right">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 shadow-md"
                >
                  تصفح المصادر
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
