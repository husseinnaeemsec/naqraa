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
    <Link to={`/courses/${course.slug}/`} className="space-y-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition p-2">
      <img
        src={getMedia(course.cover)}
        alt={course.title}
        className="w-full object-cover aspect-square rounded-xl"
      />

      <div className="space-y-2 px-1">
        <h1 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {course.title}
        </h1>

        <p className="text-sm text-gray-500">
          By: {course.instructor.first_name} {course.instructor.last_name}
        </p>

        {/* Short Description */}
        {course.description && (
          <p className="text-gray-600 text-sm">
            {truncate(course.description, 90)}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.round(course.rating || 4)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">
            {course.rating?.toFixed(1) ?? "0.0"}
          </span>
        </div>
      </div>
    </Link>
  );
}
