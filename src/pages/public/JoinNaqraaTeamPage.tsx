import { motion } from 'framer-motion';

const teamRoles = [
  { role: 'مطور Frontend', description: 'تصميم واجهات المستخدم وتجربة سلسة للمنصة.', img: '/assets/frontend.svg' },
  { role: 'مطور Backend', description: 'إدارة السيرفرات وقواعد البيانات وتطوير API متكامل.', img: '/assets/backend.svg' },
  { role: 'مصمم UI/UX', description: 'ابتكار تصميمات جذابة وسهلة الاستخدام للطلاب والمدرسين.', img: '/assets/uiux.svg' },
  { role: 'مسؤول محتوى', description: 'إعداد المحتوى التعليمي، كتابة المقالات والدورات.', img: '/assets/content.svg' },
  { role: 'أخصائي تسويق', description: 'الترويج للمنصة وجذب الطلاب والأساتذة.', img: '/assets/marketing.svg' },
];

export default function JoinNaqraaTeamPage() {
  return (
    <div className="min-h-screen bg-white py-24 px-6 md:px-16 lg:px-32">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">انضم لفريق Naqraa</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            نحن في Naqraa نبحث عن مواهب شغوفة لمساعدتنا في تطوير المنصة وتقديم تجربة تعليمية متميزة للطلاب والأساتذة.
            اختر الدور الذي يناسبك وابدأ رحلتك معنا.
          </p>
        </motion.div>
      </div>

      {/* Team Roles Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {teamRoles.map((role, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 group"
          >
            <div className="flex justify-center mb-4">
              <motion.img 
                src={role.img} 
                alt={role.role}
                whileHover={{ scale: 1.1 }}
                className="w-24 h-24 object-contain transition-transform duration-300"
              />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-emerald-600 transition-colors duration-300">{role.role}</h2>
            <p className="text-slate-600 mb-6 text-center leading-relaxed">{role.description}</p>
            <div className="flex justify-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
              >
                قدم الآن
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Why Join Us Section */}
      <div className="max-w-6xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-emerald-900 rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-6 text-center">لماذا تنضم إلينا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl font-semibold mb-4">بيئة عمل محفزة</h3>
              <p className="text-slate-200 mb-4">
                نؤمن بأن الإبداع يزدهر في بيئة داعمة. نحن نوفر لك الفضاء والموارد التي تحتاجها لإطلاق العنان لإمكاناتك.
              </p>
              <h3 className="text-2xl font-semibold mb-4">مشاريع تعليمية متقدمة</h3>
              <p className="text-slate-200">
                ستعمل على مشاريع حقيقية تؤثر في حياة الطلاب والمعلمين، وتساهم في تحسين التعليم الرقمي في العراق والمنطقة.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-semibold mb-4">تعاون مستمر</h3>
              <p className="text-slate-200 mb-4">
                سنعمل كفريق واحد، نتبادل الأفكار ونتحدى أنفسنا لتحقيق أهدافنا المشتركة في مجال التعليم.
              </p>
              <h3 className="text-2xl font-semibold mb-4">تطوير المهارات</h3>
              <p className="text-slate-200">
                فرص لا مثيل لها للنمو المهني والشخصي من خلال التعلم المستمر والتدريب على أحدث التقنيات.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-6xl mx-auto mt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-emerald-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلتك معنا اليوم!</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            نحن نبحث عن أشخاص متحمسين ومبدعين مثلما أنت. انضم إلى فريق Naqraa وساعدنا في صنع الفرق في التعليم.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition duration-200"
            >
              قدم طلبك الآن
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition duration-200"
            >
              تعرف على الفريق
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
