import { Link } from "react-router-dom";
import type { Enrollment } from "../../types";
import { getMedia } from "../utils/functions";


export default function StudentCourseCard({ enrollment }: { enrollment:Enrollment } ) {
  const { course } = enrollment;

  const getLinkText = ()=>{
    if(enrollment.progress === 100){
        return 'مراجعة'
    }else if(enrollment.progress < 100 && enrollment.progress > 0){
        return 'اكمل التعلم'
    }

    return 'ابدأ التعلم'
  }

  return (
    <div
      key={enrollment.id}
      className="bg-white dark:bg-emerald-900 border border-emerald-300/40 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
    >
      <img
        src={getMedia(course.cover)}
        alt={course.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-bold dark:text-emerald-50 text-emerald-800 mb-2 text-lg line-clamp-2"
          title={course.title}
        >
          {course.title}
        </h3>

        <p
          className="text-sm dark:text-emerald-100 text-gray-600 mb-4 flex-grow line-clamp-3"
          title={course.description}
        >
          {course.description}
        </p>
        <div className="space-y-2 text-xs my-2">
            <div className="flex items-center justify-between">
                مستوى التقدم 
                <span> {enrollment.progress}% </span>
            </div>
            <div className="h-1 bg-slate-200 w-full overflow-hidden rounded">
                <div className="bg-emerald-300 h-full" style={{width:`${enrollment.progress}%`}} ></div>
            </div>
        </div>
        <div className="mt-auto flex ">
          <Link
            to={`/dashboard/classroom/${enrollment.id}`}
            className="px-4 py-2 w-full text-center border-emerald-600  border hover:bg-emerald-600 hover:text-white text-sm font-medium rounded-lg  transition-colors"
          >
            {getLinkText()}
          </Link>
        </div>
      </div>
    </div>
  );
}
