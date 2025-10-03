import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { Enrollment, EnrollmentLecture } from "../../../types";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { convertDurationsToHours, getLectureDurations } from "../../utils/functions";
import ClassroomTabs from "../../components/ClassroomTabs";
import ContentTab from "../../components/ContentTab";
import AboutTeacherTab from "../../components/AboutTeacherTab";
import ResourcesTab from "../../components/ResourcesTab";
import QuizzesTab from "../../components/QuizzesTab";
import DiscussionTab from "../../components/DiscussionTab";
import NotesTab from "../../components/NotesTab";
import { t } from "i18next";
import VideoPlayer from "../../components/VideoPlayer";
import EnrollmentProgressTracker from "../../components/EnrollmentProgressTracker";

// Classroom Page Component
const ClassroomPage = () => {
    const { enrollment_id } = useParams<{ enrollment_id: string }>();
    const enrollmentIdNum = enrollment_id ? Number(enrollment_id) : null;
    const [activeLecture, setActiveLecture] = useState<EnrollmentLecture | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [duration, setDuration] = useState<string[] | null>(null);
    const [activeTab, setActiveTab] = useState('notes');
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const allLectures = useMemo(() => {
        if (!enrollment) return [];
        const lectures: EnrollmentLecture[] = [];
        enrollment.course.sections
            .sort((a, b) => a.order - b.order)
            .forEach(section => {
                section.lectures
                    .sort((a, b) => a.order - b.order)
                    .forEach(lecture => lectures.push(lecture));
            });
        return lectures;
    }, [enrollment]);



    useEffect(() => {
        if (!enrollmentIdNum) return;
        api
            .get(endpoints.user.enrollments.getEnrollment(enrollmentIdNum))
            .then((res) => {
                setEnrollment(res.data)
            })
            .catch((err) => console.error(err));
    }, [enrollmentIdNum]);




    useEffect(() => {
        if (enrollment?.last_watched_lecture) {
            setActiveLecture(enrollment.last_watched_lecture)
        } else {
            setActiveLecture(enrollment?.course.sections[0].lectures[0] || null)
        }
        if (enrollment) {
            setDuration(convertDurationsToHours(getLectureDurations(enrollment)))
        }
    }, [enrollment])

    const renderTab = () => {
        switch (activeTab) {
            case 'content':
                return <ContentTab activeLecture={activeLecture} />;

            case 'teacher':
                return <AboutTeacherTab enrollment={enrollment} />;

            case 'resources':
                return <ResourcesTab activeLecture={activeLecture} />;

            case 'quizzes':
                return <QuizzesTab activeLecture={activeLecture} />;

            case 'discussion':
                return <DiscussionTab activeLecture={activeLecture} enrollment={enrollment} />;

            case 'notes':
                return <NotesTab setActiveLecture={setActiveLecture} enrollment={enrollment} activeLecture={activeLecture} />

            default:
                return <ContentTab activeLecture={activeLecture} />

        }
    }

    const goToNextLecture = () => {

        if (!activeLecture) return;
        const index = allLectures.findIndex(l => l.id === activeLecture.id);
        console.log(index)
        if (index >= 0 && index < allLectures.length - 1) {
            setActiveLecture(allLectures[index + 1]);
        }
    };

    const goToPrevLecture = () => {
        if (!activeLecture) return;
        const index = allLectures.findIndex(l => l.id === activeLecture.id);
        if (index > 0) {
            setActiveLecture(allLectures[index - 1]);
        }
    };

    return (
        <EnrollmentProgressTracker activeLectureId={activeLecture?.id || null} enrollmentId={enrollment?.id || null }>
            <>

                <div className="space-y-8 dark:bg-emerald-950 bg-white    overflow-y-auto">
                    <div className="bg-white dark:bg-transparent   rounded-lg space-y-5">
                        <div className="grid border lg:grid-cols-[1fr_25%]">
                            {/* Course content */}
                            <div className="h-dynamic overflow-y-auto">
                                {
                                    activeLecture?.video ? (
                                        <VideoPlayer activeLecture={activeLecture} />
                                    ) :
                                        (
                                            <div className="w-full aspect-video bg-slate-100 rounded-xl">  </div>
                                        )
                                }
                                <div className=" w-full ">
                                    <ClassroomTabs key={activeLecture?.id} activeTab={activeTab} onChange={(tab) => { setActiveTab(tab) }} />
                                </div>
                                {/* Tabs */}
                                <div className="my-5 min-h-80 p-4">
                                    {renderTab()}
                                </div>
                                <div className="sticky bottom-0 bg-white border-t w-full p-3">
                                    <div className="flex items-center justify-between w-full">
                                        <button
                                            className="p-2 px-4 bg-emerald-500 rounded text-white"
                                            onClick={goToNextLecture}
                                        >
                                            {t("next")}
                                        </button>
                                        <button
                                            className="p-2 px-4 bg-gray-200 rounded"
                                            onClick={goToPrevLecture}
                                        >
                                            {t("prev")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Course Sidebar */}
                            <div className="h-dynamic  overflow-y-auto">
                                <div className=" sticky top-0 dark:bg-emerald-900 dashboard-box overflow-y-auto ">
                                    <h3 className="text-lg  font-semibold text-emerald-800 p-2 mb-4">محتوى الدورة</h3>
                                    <div className="space-y-3">
                                        {enrollment?.course.sections.map((section) => (
                                            <div
                                                key={section.id}
                                                className={`p-4 space-y-3  transition-colors `}
                                            >
                                                <p> {section.order} - {section.title} </p>
                                                {
                                                    section.lectures.map((lecture) => {
                                                        return (
                                                            <button onClick={() => { setActiveLecture(lecture) }} key={lecture.id}

                                                                className={` ${activeLecture?.id === lecture.id ? ' sticky sketch-bg-emerald-100 bg-emerald-700 text-emerald-50 ' : 'bg-white  dark:bg-emerald-800'} block  w-full text-right rounded-lg p-3 dashboard-box cursor-pointer transition-colors `}

                                                            >
                                                                <h1 className="text-lg"> {lecture.title} </h1>
                                                                <span className={` ${activeLecture?.id === lecture.id ? 'text-emerald-100' : 'text-slate-500'} flex  dark:text-emerald-200 text-xs mt-2 gap-1 items-center `}>
                                                                    <i className="fi fi-rr-clock"></i>
                                                                    {lecture.duration}
                                                                    <i> دقيقة </i>
                                                                </span>
                                                            </button>
                                                        )
                                                    })
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </EnrollmentProgressTracker>
    );
};

export default ClassroomPage;