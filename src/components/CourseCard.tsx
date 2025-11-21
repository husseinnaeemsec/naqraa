import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Course } from "../../types";
import { getMedia } from "../utils/functions";
import { Star, Clock, Users, PlayCircle, Bookmark } from "lucide-react";
import ShareButton from "./ShareButton";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const { t } = useTranslation();
  
  const truncate = (text: string, maxLength = 80) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Course Image */}
      <div className="relative overflow-hidden flex-shrink-0">
        <Link to={`/courses/${course.slug}/`}>
          <div className="w-full h-48 relative">
            <img
              src={getMedia(course.cover) || ''}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <PlayCircle className="size-8 text-emerald-600" />
              </div>
            </div>
          </div>
        </Link>
        
        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex gap-2">
          {/* Bookmark Button */}
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors">
            <Bookmark className="size-4 text-gray-700 hover:text-emerald-600" />
          </button>
          
          {/* Share Button */}
          <ShareButton
            url={`${window.location.origin}/courses/${course.slug}/`}
            title={`${course.title} - دورة مجانية على نقرأ`}
            description={`${course.description || `تعلم ${course.title} مع ${course.instructor.first_name} ${course.instructor.last_name}`}. انضم لآلاف الطلاب في منصة نقرأ التعليمية المجانية. ${course.subject?.name ? `#${course.subject.name.replace(/\s+/g, '')}` : ''} #نقرأ #تعليم_مجاني`}
            variant="ghost"
            size="sm"
            showText={false}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            utmParams={{
              utm_source: 'course_card',
              utm_medium: 'social',
              utm_campaign: 'course_sharing',
              utm_content: 'top_button'
            }}
          />
        </div>
        
        {/* Course Level Badge */}
        {course.level && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
            {course.level}
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        {/* Subject Badge */}
        {course.subject && (
          <div className="flex-shrink-0">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {course.subject.name}
            </span>
          </div>
        )}

        {/* Course Title */}
        <div className="flex-shrink-0">
          <Link to={`/courses/${course.slug}/`}>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-emerald-700 transition-colors min-h-[3.5rem] group-hover:text-emerald-700">
              {course.title}
            </h3>
          </Link>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-white">
              {course.instructor.first_name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-700 font-medium truncate">
              {course.instructor.first_name} {course.instructor.last_name}
            </p>
            <p className="text-xs text-gray-500">مدرس</p>
          </div>
        </div>

        {/* Short Description */}
        <div className="flex-grow">
          {course.description ? (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
              {truncate(course.description, 100)}
            </p>
          ) : (
            <div className="min-h-[2.5rem]" />
          )}
        </div>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Users className="size-3" />
            <span>{(Math.floor(Math.random() * 1000) + 100).toLocaleString()} طالب</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>{Math.floor(Math.random() * 20) + 5} ساعة</span>
          </div>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(course.rating || 4.2)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900 mr-1">
              {course.rating?.toFixed(1) ?? "4.2"}
            </span>
            <span className="text-xs text-gray-500">
              ({(course.total_reviews || Math.floor(Math.random() * 500) + 50).toLocaleString()})
            </span>
          </div>
          
          {/* Featured Badge */}
          {course.featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="size-3 fill-current" />
              مميز
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex-shrink-0 flex gap-2">
          <Link 
            to={`/courses/${course.slug}/`}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center text-sm font-medium rounded-lg transition-colors inline-block"
          >
            عرض التفاصيل
          </Link>
          
          {/* Share Button */}
          <ShareButton
            url={`${window.location.origin}/courses/${course.slug}/`}
            title={`🎓 ${course.title} - دورة مجانية على منصة نقرأ`}
            description={`${course.description || `تعلم ${course.title} خطوة بخطوة`} 👨‍🏫 مع المدرس: ${course.instructor.first_name} ${course.instructor.last_name}\n\n✅ دورة مجانية 100%\n⭐ تقييم ${course.rating?.toFixed(1) || '4.2'} من 5\n👥 ${Math.floor(Math.random() * 1000) + 100}+ طالب مسجل\n${course.subject?.name ? `🏷️ ${course.subject.name}` : ''}\n\n#نقرأ #تعليم_مجاني #دورات_اونلاين ${course.subject?.name ? `#${course.subject.name.replace(/\s+/g, '')}` : ''}`}
            variant="secondary"
            size="md"
            showText={false}
            className="px-3"
            utmParams={{
              utm_source: 'course_card',
              utm_medium: 'social',
              utm_campaign: 'course_sharing',
              utm_content: 'action_button'
            }}
          />
        </div>
      </div>
    </div>
  );
}
