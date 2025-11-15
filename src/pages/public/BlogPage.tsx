import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: 'أفضل الطرق لتنظيم الدراسة',
    excerpt: 'تعلم كيف تخطط لمذاكرتك بشكل ذكي وتستفيد من وقتك أكثر.',
    date: '2025-11-14',
    category: 'دراسة',
    subject: 'تنظيم الوقت',
    topic: 'التخطيط',
    image: 'https://placehold.co/400x200/10b981/ffffff?text=Study+Planning'
  },
  {
    id: 2,
    title: 'استخدام التكنولوجيا في المشاريع الجامعية',
    excerpt: 'كيف يمكن للتقنيات الحديثة أن تساعدك في مشاريع التخرج.',
    date: '2025-11-10',
    category: 'مشاريع',
    subject: 'تقنية',
    topic: 'الذكاء الاصطناعي',
    image: 'https://placehold.co/400x200/3b82f6/ffffff?text=Tech+Projects'
  },
  {
    id: 3,
    title: 'نصائح للنجاح في الدورات التدريبية',
    excerpt: 'طرق فعالة لتحقيق أقصى استفادة من أي دورة تدريبية.',
    date: '2025-11-05',
    category: 'دورات',
    subject: 'تعليم',
    topic: 'مهارات التعلم',
    image: 'https://placehold.co/400x200/f59e0b/ffffff?text=Learning+Tips'
  },
  {
    id: 4,
    title: 'دليل المبتدئين للبحث الأكاديمي',
    excerpt: 'تعلم أساسيات البحث الأكاديمي وكيفية كتابة أوراق علمية متميزة.',
    date: '2025-10-28',
    category: 'دراسة',
    subject: 'أكاديمي',
    topic: 'البحث العلمي',
    image: 'https://placehold.co/400x200/8b5cf6/ffffff?text=Academic+Research'
  },
  {
    id: 5,
    title: 'أدوات رقمية للمذاكرة الفعالة',
    excerpt: 'اكتشف أفضل الأدوات الرقمية التي يمكن أن تساعدك في تنظيم مذاكرتك.',
    date: '2025-10-20',
    category: 'تقنية',
    subject: 'أدوات',
    topic: 'الإنتاجية',
    image: 'https://placehold.co/400x200/ef4444/ffffff?text=Digital+Tools'
  },
  {
    id: 6,
    title: 'كيف تبني عادات دراسية ناجحة',
    excerpt: 'استراتيجيات عملية لبناء عادات دراسية تدوم طوال حياتك الأكاديمية.',
    date: '2025-10-15',
    category: 'دراسة',
    subject: 'عادات',
    topic: 'التطوير الشخصي',
    image: 'https://placehold.co/400x200/06b6d4/ffffff?text=Study+Habits'
  },
  {
    id: 7,
    title: 'التحضير لامتحانات نهاية الفصل',
    excerpt: 'استراتيجيات فعالة للتحضير والنجاح في امتحانات نهاية الفصل الدراسي.',
    date: '2025-10-08',
    category: 'دراسة',
    subject: 'امتحانات',
    topic: 'التحضير',
    image: 'https://placehold.co/400x200/14b8a6/ffffff?text=Exam+Prep'
  },
  {
    id: 8,
    title: 'كتابة السيرة الذاتية للطلاب',
    excerpt: 'دليل شامل لكتابة سيرة ذاتية احترافية للطلاب والخريجين الجدد.',
    date: '2025-10-01',
    category: 'تطوير',
    subject: 'توظيف',
    topic: 'السيرة الذاتية',
    image: 'https://placehold.co/400x200/f97316/ffffff?text=Resume+Writing'
  }
];

const categories = ['الكل', 'دراسة', 'مشاريع', 'دورات', 'تقنية', 'تطوير'];
const subjects = ['الكل', 'تنظيم الوقت', 'تقنية', 'تعليم', 'أكاديمي', 'أدوات', 'عادات', 'امتحانات', 'توظيف'];
const topics = ['الكل', 'التخطيط', 'الذكاء الاصطناعي', 'مهارات التعلم', 'البحث العلمي', 'الإنتاجية', 'التطوير الشخصي', 'التحضير', 'السيرة الذاتية'];

export default function BlogPage() {
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [filterSubject, setFilterSubject] = useState('الكل');
  const [filterTopic, setFilterTopic] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const filteredPosts = blogPosts.filter(post =>
    (filterCategory === 'الكل' || post.category === filterCategory) &&
    (filterSubject === 'الكل' || post.subject === filterSubject) &&
    (filterTopic === 'الكل' || post.topic === filterTopic)
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterSubject, filterTopic]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></span>
            مقالات ومصادر تعليمية
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">مدونة نقرا</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            اكتشف أحدث المقالات والنصائح التعليمية من مجتمعنا التعليمي
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-12 border border-slate-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="w-full p-4 pr-10 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 text-slate-700 appearance-none font-medium"
              >
                {categories.map((c, idx) => (
                  <option key={idx} value={c} className="font-medium">
                    {c}
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
              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="w-full p-4 pr-10 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 text-slate-700 appearance-none font-medium"
              >
                {subjects.map((s, idx) => (
                  <option key={idx} value={s} className="font-medium">
                    {s}
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
              <select
                value={filterTopic}
                onChange={e => setFilterTopic(e.target.value)}
                className="w-full p-4 pr-10 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 text-slate-700 appearance-none font-medium"
              >
                {topics.map((t, idx) => (
                  <option key={idx} value={t} className="font-medium">
                    {t}
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
        </motion.div>

        {/* Blog Posts Grid - Single Column */}
        {currentPosts.length > 0 ? (
          <div className="space-y-8 mb-12">
            {currentPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6 md:p-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {post.subject}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {post.topic}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <p className="text-slate-500 text-sm mb-6">
                      تاريخ النشر: {formatDate(post.date)}
                    </p>
                    <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                      اقرأ المقال كاملاً
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 mb-12"
          >
            <div className="text-slate-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.168-5.616-2.949" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">لا توجد مقالات مطابقة</h3>
            <p className="text-slate-500">جرب تغيير الفلاتر للعثور على المقالات التي تبحث عنها</p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center gap-2 mb-12"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${currentPage === index + 1
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">انضم إلى مجتمعنا للمدونة</h2>
          <p className="text-emerald-100 mb-8 text-lg max-w-2xl mx-auto">
            شارك أفكارك، اطرح المواضيع، والتفاعل مع الآخرين في مجتمع نقرا التعليمي
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition duration-200 transform hover:scale-105 shadow-lg">
              انضم الآن
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition duration-200 shadow-lg">
              تصفح المجتمع
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
