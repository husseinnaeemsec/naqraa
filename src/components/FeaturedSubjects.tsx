import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import ResourceLoader from './resourceLoader';
import type { Subject } from '../../types';
import api from '../api/client';
import { endpoints } from '../api/routes';
import { Link } from 'react-router-dom';






export default function FeaturedSubjects() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get(endpoints.content.subjects);
        setSubjects(res.data);
      } catch (error) {
        // Error handling could be added here
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="px-4 md:px-6 lg:px-8">
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-8 rounded-2xl shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ResourceLoader title={t('featured_subjects.loading')} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t('featured_subjects.title')}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            {t('featured_subjects.subtitle')}
          </p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/courses/explore/" 
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            <span>{t('featured_subjects.view_all')}</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Subjects Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {subjects.map((subject) => (
          <motion.div
            key={subject.id}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02, 
              y: -5,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="group"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-emerald-200">
              {/* Subject Content */}
              <div className="space-y-4 flex-1">
                {/* Subject Image */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center overflow-hidden group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                    {subject.image ? (
                      <img
                        src={subject.image}
                        alt={subject.name}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg md:text-xl">
                          {subject.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject Info */}
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {subject.description || t('featured_subjects.default_description')}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <motion.div className="mt-6">
                <Link 
                  to={`/courses/explore/?subject=${subject.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 px-4 py-3 rounded-xl font-medium transition-all duration-200 group-hover:shadow-md"
                >
                  <span>تصفح الدورات</span>
                  <ExternalLink className="size-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {subjects.length === 0 && !loading && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-gray-400 mb-4">
            <ExternalLink className="size-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            لا توجد مواد متاحة حالياً
          </h3>
          <p className="text-gray-500">
            سيتم إضافة المزيد من المواد قريباً
          </p>
        </motion.div>
      )}
    </div>
  );
}