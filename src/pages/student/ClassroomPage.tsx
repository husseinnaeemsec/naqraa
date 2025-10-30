// pages/ClassroomPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { EnrollmentLecture } from "../../../types";
import { useAppDispatch } from "../../store/store";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import ResourceLoader from "../../components/resourceLoader";
import NotFoundError from "../../components/errors/NotFoundError";
import NetworkError from "../../components/errors/NetworkError";
import { setActiveLecture, setEnrollment } from "../../store/enrollmentSlice";
import EnrollmentNavigation from "../../components/enrollment/EnrollmentNavigation";
import CourseContent from "../../components/enrollment/CourseContent";
import { StudySessionTrackerProvider } from "../../context/StudySessionContext";

export default function ClassroomPage() {
  const { enrollment_id } = useParams<{ enrollment_id: string }>();
  const enrollmentIdNum = enrollment_id ? Number(enrollment_id) : null;
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'network_error' | 'not_found' | 'rate_limiting' | null>(null)

  if (!enrollmentIdNum) {
    return (
      <div className="w-full h-dynamic flex items-center justify-center flex-col gap-2">
        <h1 className="text-3xl text-rose-600 font-semibold"> خطأ </h1>
        <p className="text-lg text-rose-900"> معرف الدورة غير صحيح , يجب ان يكون معرف الدورة رقما </p>
      </div>
    )
  }



  useEffect(() => {
    api.get(endpoints.user.enrollments.getEnrollment(enrollmentIdNum))
      .then((res) => {
        dispatch(setEnrollment(res.data));


        const first_lecture: EnrollmentLecture | null = res.data.course?.sections[0]?.lectures[0] || null
        const last_watched_lecture: EnrollmentLecture | null = res.data.last_watched_lecture || first_lecture
        dispatch(setActiveLecture(last_watched_lecture));

      })
      .catch((e) => {
        if (e.status === 404) {
          setError('not_found')
        } else if (e.status === 500) {
          setError('network_error')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <ResourceLoader className="h-dynamic" title="جاري تحميل الدورة التدريبية" />
  }

  if (error) {
    switch (error) {
      case 'not_found':
        return <NotFoundError className="h-dynamic" showText />;

      case 'network_error':
        return <NetworkError className="h-dynamic" showText />;

    }
  }

  return (
    <StudySessionTrackerProvider>
      <div className="grid border px-8 overflow-y-auto lg:grid-cols-[1fr_30%]">
        <CourseContent />
        <EnrollmentNavigation />
      </div>
    </StudySessionTrackerProvider>
  );
}
