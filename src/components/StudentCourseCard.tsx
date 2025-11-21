import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Play, CheckCircle, Clock, BookOpen, Star, Calendar } from "lucide-react";
import type { Enrollment } from "../../types";
import { getMedia } from "../utils/functions";

export default function StudentCourseCard({ enrollment }: { enrollment: Enrollment }) {
  const { t } = useTranslation();
  const { course } = enrollment;

  const getLinkText = () => {
    if (enrollment.progress === 100) {
      return t('student_course_card.review');
    } else if (enrollment.progress < 100 && enrollment.progress > 0) {
      return t('student_course_card.continue_learning');
    }
    return t('student_course_card.start_learning');
  };

  const getLinkIcon = () => {
    if (enrollment.progress === 100) {
      return <CheckCircle className="size-4" />;
    } else if (enrollment.progress > 0) {
      return <Play className="size-4" />;
    }
    return <BookOpen className="size-4" />;
  };

  const getProgressStatus = () => {
    if (enrollment.progress === 100) {
      return { text: t('student_course_card.completed'), color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
    } else if (enrollment.progress > 0) {
      return { text: t('student_course_card.in_progress'), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    }
    return { text: t('student_course_card.not_started'), color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20' };
  };

  const progressStatus = getProgressStatus();

  return (
    <motion.div
      key={enrollment.id}
      className="group bg-white dark:bg-emerald-900/50 border border-emerald-200/50 dark:border-emerald-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col backdrop-blur-sm"
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        <motion.img
          src={getMedia(course.cover)}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Progress Badge */}
        <div className="absolute top-3 right-3">
          <motion.div
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${progressStatus.bg} ${progressStatus.color} border-white/20`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {progressStatus.text}
          </motion.div>
        </div>

        {/* Play Button Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <div className="bg-white/90 dark:bg-emerald-800/90 p-3 rounded-full shadow-lg backdrop-blur-sm">
            {getLinkIcon()}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3">
          <h3
            className="font-bold dark:text-emerald-50 text-emerald-800 mb-2 text-lg line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors"
            title={course.title}
          >
            {course.title}
          </h3>

          <p
            className="text-sm dark:text-emerald-100/80 text-gray-600 mb-4 flex-grow line-clamp-3 leading-relaxed"
            title={course.description}
          >
            {course.description}
          </p>
        </div>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-emerald-400">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{t('student_course_card.enrolled')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-3" />
            <span>{course.rating || course.average_rating || '4.5'}/5</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-emerald-200 flex items-center gap-2">
              <Clock className="size-4" />
              {t('student_course_card.progress_level')}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {enrollment.progress}%
            </span>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 dark:bg-emerald-800/30 w-full overflow-hidden rounded-full">
              <motion.div
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${enrollment.progress}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            
            {/* Progress Glow Effect */}
            <motion.div
              className="absolute inset-0 h-2 bg-gradient-to-r from-emerald-500/30 to-emerald-400/30 rounded-full blur-sm"
              initial={{ width: 0 }}
              animate={{ width: `${enrollment.progress}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Progress Text */}
          <div className="text-xs text-gray-500 dark:text-emerald-400">
            {enrollment.progress === 100 ? (
              <span className="text-green-600 dark:text-green-400 font-medium">
                ✓ {t('student_course_card.completed_course')}
              </span>
            ) : enrollment.progress > 0 ? (
              <span>
                {t('student_course_card.lessons_progress', { progress: enrollment.progress })}
              </span>
            ) : (
              <span>{t('student_course_card.ready_to_start')}</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Link
            to={`/dashboard/classroom/${enrollment.id}`}
            className="group/button relative w-full"
          >
            <motion.div
              className="px-5 py-3 w-full text-center bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {getLinkIcon()}
              {getLinkText()}
              
              {/* Button Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700"
                style={{ width: '50%' }}
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
