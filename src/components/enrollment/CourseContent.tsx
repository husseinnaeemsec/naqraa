import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import ResourceLoader from "../resourceLoader";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import type { LectureTab } from "../../../types";
import { setCurrentLecture } from "../../store/enrollmentSlice";
import NetworkError from "../errors/NetworkError";
import NotFoundError from "../errors/NotFoundError";
import UnknownError from "../errors/UnknownError";
import VideoPlayer from "../VideoPlayer";
import ClassroomTabs from "../ClassroomTabs";
import ContentTab from "../ContentTab";
import DiscussionTab from "../DiscussionTab";
import NotesTab from "../NotesTab";
import QuizzesTab from "../QuizzesTab";
import ResourcesTab from "../ResourcesTab";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/all";
import LectureNavigation from "./LectureNavigation";
import UnAuthoraizedError from "../errors/UnAuthoraizedError";

gsap.registerPlugin(ScrollToPlugin);

export default function CourseContent() {
  const { activeLecture, enrollment, currentLecture } = useAppSelector(
    (state) => state.enrollment
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"network_error"|"unauthoraized" | "not_found" | "unknown" | null>(null);
  const [activeTab, setActiveTab] = useState<LectureTab>("content");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  if (!activeLecture || !enrollment) return <></>;

  // Fetch current lecture details
  useEffect(() => {
    setLoading(true);
    api
      .get(endpoints.user.enrollments.getLecture(enrollment.id, activeLecture.id))
      .then((res) => dispatch(setCurrentLecture(res.data)))
      .catch((e) => {
        if (e.status === 404) setError("not_found");
        else if (e.status === 500) setError("network_error");
        else if (e.status === 401) setError("unauthoraized");
        else setError("unknown");
      })
      .finally(() => setLoading(false));
  }, [activeLecture]);

  // Scroll to content section when mounted
  useEffect(() => {
    if (!scrollerRef.current) return;
    gsap.to(scrollerRef.current, {
      duration: 0.5,
      scrollTo: { y: "#content", offsetY: 20 },
      ease: "power2.out",
    });
  }, []);

  // Loading & error handling
  if (loading) return <ResourceLoader />;
  if (error) {
    switch (error) {
      case "network_error":
        return <NetworkError />;
      case "not_found":
        return <NotFoundError />;
      case "unauthoraized":
        return <UnAuthoraizedError showText />
      default:
        return <UnknownError />;
    }
  }
  if (!currentLecture) return <></>;

  // Render tabs
  const renderTab = () => {
    switch (activeTab) {
      case "content":
        return <ContentTab activeLecture={currentLecture} />;
      case "discussion":
        return <DiscussionTab activeLecture={currentLecture} enrollment={enrollment} />;
      case "notes":
        return <NotesTab />;
      case "quizzes":
        return <QuizzesTab />;
      case "resources":
        return <ResourcesTab currentLecture={currentLecture} />;
      default:
        return <ContentTab activeLecture={currentLecture} />;
    }
  };

 
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Course Header - Sticky */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{enrollment.course.title}</h1>
        <p className="text-slate-500 dark:text-slate-400">{enrollment.course.description}</p>
      </div>
      
      {/* Scrollable Content */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto">
        {/* Video Player */}
        <div className="px-6 py-4">
          <VideoPlayer lecture={currentLecture} />
        </div>
        
        {/* Tabs */}
        <div className=" bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
          <ClassroomTabs
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as LectureTab)}
          />
        </div>
        {/* Tab content */}
        <div id="content" className="flex-1 p-6">
          {renderTab()}
        </div>
      </div>
      
      {/* Sticky Bottom Navigation */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-30 shadow-lg">
        <LectureNavigation />
      </div>
    </div>
  );
}
