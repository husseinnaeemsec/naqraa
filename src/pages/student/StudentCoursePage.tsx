import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { setUserEnrollments } from "../../store/authSlice";
import PageLoader from "../../components/PageLoader";
import { getMedia } from "../../utils/functions";
import { Link } from "react-router-dom";

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
                {enrollments.map((enrollment) => (
                    <div
                        key={enrollment.id}
                        className="bg-white border border-emerald-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={getMedia(enrollment.course.cover)}
                            alt={enrollment.course.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="font-bold text-emerald-800 mb-2">{enrollment.course.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{enrollment.course.description}</p>
                            <div className="flex justify-between items-center">
                                <Link to={`/dashboard/classroom/${enrollment.id}`} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                    بدء التعلم 
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCoursesPage;