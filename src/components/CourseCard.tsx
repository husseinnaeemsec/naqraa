import { Link } from "react-router-dom";
import type { Course } from "../../types";
import { getMedia } from "../utils/functions";
import { Star } from "lucide-react";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const truncate = (text: string, maxLength = 80) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Link 
      to={`/courses/${course.slug}/`} 
      className="group block bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 p-4 hover:scale-[1.02] hover:border-emerald-200 h-full"
    >
      <div className="flex flex-col h-full">
        {/* Course Image */}
        <div className="relative overflow-hidden rounded-xl mb-4 flex-shrink-0">
          <div className="w-full h-48">
            <img
              src={getMedia(course.cover)}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Course Content */}
        <div className="flex flex-col flex-grow space-y-3">
          {/* Course Title */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors min-h-[3.5rem]">
              {course.title}
            </h3>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-emerald-700">
                {course.instructor.first_name?.charAt(0)}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium truncate">
              {course.instructor.first_name} {course.instructor.last_name}
            </p>
          </div>

          {/* Short Description */}
          <div className="flex-grow">
            {course.description ? (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[3.75rem]">
                {truncate(course.description, 120)}
              </p>
            ) : (
              <div className="min-h-[3.75rem]" />
            )}
          </div>

          {/* Rating and Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(course.rating || 4)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="text-sm font-medium text-gray-700 mr-2">
                {course.rating?.toFixed(1) ?? "4.0"}
              </span>
            </div>
            
            {/* Course Badge/Level */}
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0">
              دورة
            </div>
          </div>

          {/* Action Indicator */}
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2 flex-shrink-0">
            <span className="text-emerald-600 text-sm font-medium">عرض التفاصيل</span>
            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
