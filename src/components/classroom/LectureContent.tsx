import { useState } from "react";
import { useAppSelector } from "../../store/store";
import type { LectureTab } from "../../../types";
import ClassroomTabs from "../ClassroomTabs";
import ContentTab from "../ContentTab";
import DiscussionTab from "../DiscussionTab";
import NotesTab from "../NotesTab";
import QuizzesTab from "../QuizzesTab";
import ResourcesTab from "../ResourcesTab";

/**
 * Lecture content component with tabbed interface
 * 
 * Features:
 * - Tab-based navigation (Content, Resources, Quizzes, Notes, Discussion)
 * - Persists active tab during lecture changes
 * - Responsive design
 * - Seamless integration with existing tab components
 */
export default function LectureContent() {
  const { currentLecture, enrollment } = useAppSelector((state) => state.enrollment);
  const [activeTab, setActiveTab] = useState<LectureTab>("content");

  if (!currentLecture || !enrollment) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          الرجاء تحديد محاضرة لعرض المحتوى
        </p>
      </div>
    );
  }

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
    <div className="h-full flex flex-col">
      {/* Tabs Header */}
      <div className="sticky top-0 bg-gradient-to-b from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-800/80 border-b-2 border-gray-200 dark:border-gray-700 z-10 backdrop-blur-sm shadow-sm">
        <ClassroomTabs
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as LectureTab)}
        />
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 min-h-[500px]">
        {renderTab()}
      </div>
    </div>
  );
}
