import study from "../assets/book.svg";
import { useAppSelector } from "../store/store";

export default function LastWatchedCourseWidget() {

  const {enrollments} = useAppSelector((state)=> state.auth );
  const enrollment = enrollments.length >0 ? enrollments[0] : null;
    

  return (
    <>
    
    <div className="flex flex-col lg:flex-row gap-4 dark:sketch-bg-emerald-950  sketch-bg-emerald-600 border-emerald-800 w-full   p-4 rounded-xl ">
      {/* Thumbnail */}
      <img
        src={study}
        alt="Course thumbnail"
        className="aspect-square lg:size-48 size-40 mx-auto rounded-lg object-cover "
      />

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 gap-y-3">
        {/* Title + Description */}
        <div className="space-y-2 ">
          <h1 className="font-bold text-xl lg:text-2xl text-emerald-50">
            الرياضيات: أساسيات الجبر
          </h1>
          <p className="text-sm text-emerald-50 leading-relaxed line-clamp-3">
            تعرف على أساسيات الجبر والمتغيرات وتاريخ تطور المعادلات الجبرية
            واستخداماتها في حياتنا اليومية.
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="w-full bg-emerald-200 h-2 rounded-md overflow-hidden">
            <div className="w-[34%] h-full bg-emerald-800 rounded-md"></div>
          </div>
          <p className="text-xs text-emerald-100">34% مكتمل</p>
        </div>

        {/* Action */}
        <button onClick={()=>{ document.querySelector("html")?.classList.toggle("dark") }} className="w-full lg:w-auto px-5 py-2 bg-emerald-50 text-emerald-600 font-medium rounded-md hover:bg-emerald-100 transition-colors">
          استمر بالتعلم
        </button>
      </div>
    </div>
    </>
  );
}
