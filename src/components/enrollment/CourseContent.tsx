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
    <div ref={scrollerRef} className="h-dynamic overflow-y-auto   pb-0">
      <div className="p-6 flex flex-col ">
        <h1 className="text-2xl font-bold"> {enrollment.course.title} </h1>
        <p className="text-slate-500"> {enrollment.course.description} </p>
      </div>
      {/* Video Player */}
      <VideoPlayer lecture={currentLecture} />
      {/* Tabs */}
      <ClassroomTabs
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as LectureTab)}
      />
      {/* Tab content */}
      <div id="content" className="flex flex-col justify-between min-h-96 pb-20 lg:pb-0 ">
        <div className="p-4"> {renderTab()} </div>
        {/* Sticky Bottom Actions */}
        <LectureNavigation />
      </div>
    </div>
  );
}
