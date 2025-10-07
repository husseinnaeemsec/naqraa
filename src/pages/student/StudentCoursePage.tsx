import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { setUserEnrollments } from "../../store/authSlice";
import PageLoader from "../../components/PageLoader";
import { getMedia } from "../../utils/functions";
import { Link } from "react-router-dom";
import StudentCourseCard from "../../components/StudentCourseCard";

// Courses Page Component
const StudentCoursesPage = () => {

    const dispatch = useAppDispatch();
    const [loading,setLoading] = useState(true);
    const {enrollments} = useAppSelector((state)=> state.auth )


    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await api.get(endpoints.user.enrollments.list);
                dispatch(setUserEnrollments(res.data.results));
            } catch (e) {
                console.error(e);
                
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [dispatch]);


    if(loading){
        return <PageLoader message="جاري تحميل الدورات الرجاء الانتظار..." />
    }


    return (
        <div className="space-y-8  p-6 mx-auto">
            <h1 className="text-2xl font-bold text-emerald-800">المحاضرات</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {
                    enrollments.map((e)=>{
                        return <StudentCourseCard enrollment={e} key={e.id} />
                    })
                }
            </div>
        </div>
    );
};

export default StudentCoursesPage;