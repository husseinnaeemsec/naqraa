import { useEffect, useState } from "react";
import { type Course } from "../../types";
import { useAppSelector } from "../store/store";
import api from "../api/client";
import { endpoints } from "../api/routes";
import { getMedia } from "../utils/functions";
import { Link } from "react-router-dom";



export default function FeaturedCourses() {
  const [courses,setCourses] = useState<Course[]>([]);
  const {user} = useAppSelector(state=>state.auth);
  const [error,setError] = useState("");

  useEffect(()=>{

    const p:any = {}

    if(user?.class_room?.grade){
      p['grade'] = user.class_room.grade.id
    }

    api.get(endpoints.courses.list,{params:p})
    .then((res)=>{
      setCourses(res.data.results)
    })
    .catch((e)=>{
      setError("حصل خطأ اثناء تحميل الدورات التعليمية")
    })

  },[]);

  return (
    <div className="p-6 space-y-5">
        <h1 className="text-2xl md:text-3xl  mb-5 text-center">
          { user?.class_room?.grade ? ( <span> تصفح دورات المرحلة <strong> {user.class_room.grade.name} </strong> </span> ) : "تصفح دوراتنا الجديدة" }
        </h1>
        { error && <div className="p-6 bg-rose-50 border border-rose-500 text-rose-700"> حدث خطأ اثناء البحث </div> }
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
          {
            courses.map((c)=>{
              return (
                <Link to={`/courses/${c.slug}-${c.subject}`} key={c.id} className="p-4 space-y-2 bg-white rounded-md shadow hover:shadow-md hover:scale-105 transition-all border ">
                  <img src={getMedia(c.cover)} className="w-full aspect-square bg-slate-100 rounded-md " />
                  <h1 className="text-xl font-semibold"> {c.title} </h1>
                  <p className="text-slate-500"> {c.description} </p>
                  <p className="flex items-center gap-2">
                  <img src={getMedia(c.instructor.profile_picture)} alt="" className="w-8 h-8 rounded-full" />  
                  {c.instructor.first_name} {c.instructor.last_name}
                  </p>
                </Link>
              )
            })
          }
        </div>

    </div>
  );
}
