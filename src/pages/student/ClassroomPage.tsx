import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Enrollment, EnrollmentLecture } from "../../../types";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { convertDurationsToHours, getLectureDurations, getMedia } from "../../utils/functions";
import ClassroomTabs from "../../components/ClassroomTabs";
import ContentTab from "../../components/ContentTab";
import AboutTeacherTab from "../../components/AboutTeacherTab";
import ResourcesTab from "../../components/ResourcesTab";
import QuizzesTab from "../../components/QuizzesTab";
import DiscussionTab from "../../components/DiscussionTab";
import NotesTab from "../../components/NotesTab";

// Classroom Page Component
const ClassroomPage = () => {
    const { enrollment_id } = useParams<{ enrollment_id: string }>();
    const enrollmentIdNum = enrollment_id ? Number(enrollment_id) : null;
    const [activeLecture, setActiveLecture] = useState<EnrollmentLecture | null>(null)
    const [duration, setDuration] = useState<string[] | null>(null);
    const [activeTab,setActiveTab] = useState('notes');

    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

    useEffect(() => {
        if (!enrollmentIdNum) return;

        api
            .get(endpoints.user.enrollments.getEnrollment(enrollmentIdNum))
            .then((res) => setEnrollment(res.data))
            .catch((err) => console.error(err));
    }, [enrollmentIdNum]);

    useEffect(() => {
        setActiveLecture(enrollment?.course.sections[0].lectures[0] || null)
        if (enrollment) {
            setDuration(convertDurationsToHours(getLectureDurations(enrollment)))
        }
        console.log(duration)
    }, [enrollment])

    const renderTab = ()=>{
        switch (activeTab){
            case 'content':
                return <ContentTab activeLecture={activeLecture} />;
            
            case 'teacher':
                return <AboutTeacherTab enrollment={enrollment} />;
            
            case 'resources':
                return <ResourcesTab activeLecture={activeLecture} />;

            case 'quizzes':
                return <QuizzesTab activeLecture={activeLecture} />;
            
            case 'discussion':
                return <DiscussionTab enrollment={enrollment} />;
            
            case 'notes':
                return <NotesTab setActiveLecture={setActiveLecture} enrollment={enrollment} activeLecture={activeLecture} />

            default:
                return <ContentTab activeLecture={activeLecture} />
            
        }
    }

    return (
        <div className="space-y-8  bg-white  border-8   overflow-y-auto">
            <div className="bg-white dark:bg-transparent   rounded-lg space-y-5">
                <div className="grid border lg:grid-cols-[1fr_25%] gap-5">
                    {/* Course content */}
                    <div className="h-dynamic overflow-y-auto p-6">
                        {
                            activeLecture?.video ? (
                                <video key={activeLecture?.id} src={getMedia(activeLecture?.video || '')} controls className="bg-gray-100 dark:bg-emerald-900 aspect-video rounded-lg rounded-b-none flex items-center justify-center" ></video>
                            ) :
                                (
                                    <div className="w-full aspect-video bg-slate-100 rounded-xl">  </div>
                                )
                        }
                        <div className=" w-full ">
                            <ClassroomTabs activeTab={activeTab} onChange={(tab)=>{ setActiveTab(tab) }} />
                        </div>
                        {/* Tabs */}
                        <div className="my-5 min-h-80">
                            {renderTab()}
                        </div>
                    </div>
                    {/* Course Sidebar */}
                    <div className="h-dynamic p-6 px-3 overflow-y-auto">
                        <div className=" sticky top-0 bg-slate-50/50 dashboard-box overflow-y-auto rounded-md">
                            <h3 className="text-lg font-semibold text-emerald-800 p-2 mb-4">محتوى الدورة</h3>
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

                                                        className={` ${activeLecture?.id === lecture.id ? 'sketch-bg-emerald-100' : 'bg-white'} block  w-full text-right rounded-lg p-3 dashboard-box cursor-pointer transition-colors `}

                                                    >
                                                        <h1 className="text-lg"> {lecture.title} </h1>
                                                        <span className="flex text-muted text-xs mt-2 gap-1 items-center">
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
    );
};

export default ClassroomPage;