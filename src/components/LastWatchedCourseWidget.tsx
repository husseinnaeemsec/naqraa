import { Link } from "react-router-dom";
import { useAppSelector } from "../store/store";
import { getMedia } from "../utils/functions";

export default function LastWatchedCourseWidget() {
  const { user } = useAppSelector((state) => state.auth);

  const enrollment = user?.progress?.last_watched_enrollment;

  if (!enrollment) return null; // don't render if no last watched course


  return (
    <div className="h-full max-h-fit">
      <div className="flex flex-col lg:flex-row gap-4 dark:sketch-bg-emerald-950 h-full max-h-fit sketch-bg-emerald-600 border-emerald-800 w-full p-4 rounded-xl">
        {/* Thumbnail */}
        <img
          src={getMedia(enrollment.cover || '')}
          alt="Course thumbnail"
          className="aspect-square lg:w-48 w-40 mx-auto rounded-lg object-cover"
        />

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 gap-y-3">
          {/* Title + Description */}
          <div className="space-y-2">
            <h1 className="font-bold text-xl lg:text-2xl text-emerald-50">
              {enrollment.title}
            </h1>
            <p className="text-sm text-emerald-50 leading-relaxed line-clamp-3">
              {enrollment.description}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="w-full bg-emerald-200 h-2 rounded-md overflow-hidden">
              <div
                className="h-full bg-emerald-800 rounded-md"
                style={{ width: `${30}%` }}
              />
            </div>
            <p className="text-xs text-emerald-100">{30}% مكتمل</p>
          </div>

          {/* Action */}
          <Link
            to={`/dashboard/classroom/${enrollment.id}`}
            className="w-full text-center lg:w-auto px-5 py-2 bg-emerald-50 text-emerald-600 font-medium rounded-md hover:bg-emerald-100 transition-colors"
          >
            استمر بالتعلم
          </Link>
        </div>
      </div>
    </div>
  );
}
