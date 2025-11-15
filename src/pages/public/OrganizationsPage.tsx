import { motion } from "framer-motion";

export default function OrganizationsPage() {
  const organizations = [
    { id: 1, name: "Future Academy", type: "College", location: "Baghdad", students: 1200, image: "https://placehold.co/400x200/10b981/ffffff?text=Future+Academy" },
    { id: 2, name: "Al-Nahrain High School", type: "School", location: "Baghdad", students: 600, image: "https://placehold.co/400x200/3b82f6/ffffff?text=Al+Nahrain+School" },
    { id: 3, name: "Al-Hikma Institute", type: "Training Center", location: "Basra", students: 350, image: "https://placehold.co/400x200/f59e0b/ffffff?text=Al+Hikma+Institute" },
    { id: 4, name: "Al-Mustaqbal Academy", type: "University", location: "Mosul", students: 3000, image: "https://placehold.co/400x200/8b5cf6/ffffff?text=Al+Mustaqbal+Academy" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">المنظمات التعليمية على منصة نقرأ</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            قائمة المؤسسات المسجلة على نظام نقرأ لإدارة الطلاب، الحضور، الباصات، الإشعارات والتعليم الذكي.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center pt-6"
        >
          <button className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-md">
            الجميع
          </button>
          <button className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all duration-200">
            جامعات
          </button>
          <button className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all duration-200">
            مدارس
          </button>
          <button className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all duration-200">
            معاهد
          </button>
        </motion.div>

        {/* Organizations list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {organizations.map((org) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * org.id }}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
            >
              <img 
                src={org.image} 
                alt={org.name} 
                className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-xl font-bold text-slate-900 mb-3">{org.name}</h2>
              <div className="space-y-2 mb-4">
                <p className="text-slate-700 font-medium flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full ml-2"></span>
                  نوع المؤسسة: {org.type}
                </p>
                <p className="text-slate-700 font-medium flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full ml-2"></span>
                  الموقع: {org.location}
                </p>
                <p className="text-slate-700 font-medium flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full ml-2"></span>
                  عدد الطلاب: {org.students.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button title="يمكنك ارسال طلب انضمام اذا كانت هذه هي المؤسسسة التي انت مسجل فيها" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                الانضمام
              </button>
              <button className="w-full py-3 bg-gradient-to-r  border rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                عرض التفاصيل
              </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">هل ترغب في إضافة مؤسستك؟</h3>
          <p className="text-emerald-100 mb-8 text-lg max-w-2xl mx-auto">
            انضم إلى آلاف المؤسسات التعليمية التي تستخدم منصة نقرأ لتحسين تجربة التعليم.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition duration-200 transform hover:scale-105 shadow-lg">
            تواصل معنا الآن
          </button>
        </motion.div>
      </div>
    </div>
  );
}
