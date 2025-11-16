import { motion } from 'framer-motion';
import { Search, BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import heroImage from '../../assets/courses-heroimage.svg';
import FeaturedSubjects from '../../components/FeaturedSubjects';


export default function CoursesPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const stats = [
    { icon: BookOpen, value: "1000+", label: "دورة متاحة" },
    { icon: Users, value: "50K+", label: "طالب مسجل" },
    { icon: Award, value: "95%", label: "معدل إكمال" },
    { icon: TrendingUp, value: "24/7", label: "دعم فني" }
  ];

  return (
    <motion.div 
      className="h-full overflow-y-auto bg-gradient-to-b from-emerald-50 to-white"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <motion.header 
        className="relative"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div 
              className="space-y-6 text-center lg:text-right"
              variants={fadeInUp}
            >
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
                variants={fadeInUp}
              >
                <span className="text-emerald-600">نقرأ</span> مهدتلك الطريق
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0"
                variants={fadeInUp}
              >
                تصفح آلاف الدورات في جميع المواد التي تحتاج لدراستها بشكل مجاني تماماً. 
                ابدأ رحلتك التعليمية اليوم واكتسب المهارات التي تحتاجها للنجاح.
              </motion.p>

              {/* Search Form */}
              <motion.form 
                action="/courses/explore" 
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0 pt-4"
                variants={fadeInUp}
              >
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                  <input 
                    placeholder="ابحث عن الدورات والمواد..." 
                    name="search" 
                    type="text" 
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 shadow-sm"
                  />
                </div>
                <motion.button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[120px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="size-4" />
                  ابحث
                </motion.button>
              </motion.form>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              className="flex justify-center lg:justify-end"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={heroImage} 
                alt="استكشف الدورات التعليمية" 
                className="w-full max-w-md lg:max-w-lg xl:max-w-xl drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Stats Section */}
      <motion.section 
        className="py-8 md:py-12 border-y border-gray-100"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            variants={staggerContainer}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={index}
                  className="text-center group"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full mb-3 group-hover:bg-emerald-200 transition-colors">
                    <Icon className="size-6 md:size-8 text-emerald-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Subjects Section */}
      <motion.section 
        className="py-8 md:py-12 lg:py-16"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto">
          <FeaturedSubjects />
        </div>
      </motion.section>
    </motion.div>
  );
}