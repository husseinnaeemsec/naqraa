// pages/ClassroomPage.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { AuthUser, CurrentLecture, Enrollment, EnrollmentLecture, EnrollmentSection, LastWatchedEnrollment } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../store/store";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import ResourceLoader from "../../components/resourceLoader";
import NotFoundError from "../../components/errors/NotFoundError";
import NetworkError from "../../components/errors/NetworkError";
import { setActiveLecture, setEnrollment } from "../../store/enrollmentSlice";
import EnrollmentNavigation from "../../components/enrollment/EnrollmentNavigation";
import CourseContent from "../../components/enrollment/CourseContent";
import { StudySessionTrackerProvider } from "../../context/StudySessionContext";
import useApiErrorHandler from "../../hooks/use-api-error-handler";
import { useTranslation } from "react-i18next";
import { setUser } from "../../store/auth/authSlice";

export default function ClassroomPage() {
  const { t } = useTranslation();
  useApiErrorHandler();
  const { enrollment_id } = useParams<{ enrollment_id: string }>();
  const enrollmentIdNum = enrollment_id ? Number(enrollment_id) : null;
  const [hasValidData, setHasValidData] = useState<null | boolean>(null);
  const { enrollment } = useAppSelector(state => state.enrollment);
  const {user} = useAppSelector(state=>state.auth);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'network_error' | 'not_found' | 'rate_limiting' | null>(null)

  if (!enrollmentIdNum) {
    return (
      <div className="w-full h-dynamic flex items-center justify-center flex-col gap-2">
        <h1 className="text-3xl text-rose-600 font-semibold">{t('classroom_page.error')}</h1>
        <p className="text-lg text-rose-900">{t('classroom_page.invalid_course_id')}</p>
      </div>
    )
  }

  const getFirstLecture = (sections: EnrollmentSection[]): CurrentLecture | null => {
    const validSections = sections.filter(s => s.lectures.length >= 1);
    if (validSections) {
      return validSections[0].lectures[0] as CurrentLecture
    }
    return null;

  }

  useEffect(() => {
    api.get(endpoints.user.enrollments.getEnrollment(enrollmentIdNum))
      .then((res) => {
        dispatch(setEnrollment(res.data));
        const first_lecture: EnrollmentLecture | null = getFirstLecture(res.data.course.sections);
        const last_watched_lecture: EnrollmentLecture | null = res.data.last_watched_lecture || first_lecture
        dispatch(setActiveLecture(last_watched_lecture));
        dispatch(setUser({...user as AuthUser , progress : { last_watched_enrollment : { ...res.data.course,id:res.data.id } } }))
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

  useEffect(() => {
    setHasValidData((_prev) => {
      return enrollment?.course && enrollment?.course.sections.filter(s => s.lectures.length >= 1).length >= 1 || false;
    })
  }, [enrollment])

  if (loading) {
    return <ResourceLoader className="h-dynamic" title={t('classroom_page.loading_course')} />
  }

  if (error) {
    switch (error) {
      case 'not_found':
        return <NotFoundError className="h-dynamic" showText />;

      case 'network_error':
        return <NetworkError className="h-dynamic" showText />;

    }
  }

  if (hasValidData !== null && !hasValidData) {
    return (
      <div className="h-full text-lg text-center flex items-center justify-center flex-col">
        <h1 className="text-3xl mb-2 font-semibold text-rose-500"> حصل خطأ اثناء تحميل الدورة  </h1>
        <p className="max-w-sm">
          بيانات الدورة غير صالحة او انها لا تحتوي على اي محتوى الرجاء التواصل مع فريق الدعم لمساعدتكي على تخطي هذه المشكلة
        </p>
        <Link to={'/support'} className="mt-2 p-2 px-4 bg-emerald-500 text-white rounded"> تواصل مع فريق الدعم  </Link>
      </div>
    )
  }

  return (
    <StudySessionTrackerProvider>
      <div className="h-screen flex lg:grid lg:grid-cols-[1fr_25%] overflow-hidden">
        <CourseContent />
        <EnrollmentNavigation />
      </div>
    </StudySessionTrackerProvider>
  );
}
