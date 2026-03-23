import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { setActiveLecture } from "../../store/enrollmentSlice";
import { HeroCheckedIcon, HeroClockIcon, HeroPlayIcon, HeroChevronDownIcon } from "../Icons";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/all";
import { useState } from "react";

gsap.registerPlugin(ScrollToPlugin);

interface Props {
  onClose?: () => void;
}

/**
 * Course sidebar component - displays course sections and lectures
 * with progress tracking and navigation
 * 
 * Features:
 * - Collapsible sections
 * - Progress indicators (completed lectures)
 * - Active lecture highlighting
 * - Auto-scroll to active lecture
 * - Responsive design (works in sidebar or mobile drawer)
 */
export default function CourseSidebar({ onClose }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { activeLecture, sections, completed_lectures, enrollment } = useAppSelector(
    (state) => state.enrollment
  );
  const dispatch = useAppDispatch();
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  // Initialize: expand all sections by default
  useEffect(() => {
    if (sections.length > 0) {
      setExpandedSections(sections.map(s => s.id));
    }
  }, [sections]);

  // Auto-scroll to active lecture when it changes
  useEffect(() => {
    if (!activeLecture || !scrollerRef.current) return;
    
    const target = document.getElementById(`lecture-${activeLecture.id}`);
    if (!target) return;

    // Smooth scroll to active lecture
    gsap.to(scrollerRef.current, {
      duration: 0.5,
      scrollTo: { y: target, offsetY: 100 },
      ease: "power2.out",
    });
  }, [activeLecture?.id]);

  const isActiveLecture = (lectureId: number) => activeLecture?.id === lectureId;
  const isLectureCompleted = (lectureId: number) => completed_lectures.includes(lectureId);
  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLectureClick = (lecture: any) => {
    dispatch(setActiveLecture(lecture));
    onClose?.();
  };

  if (!enrollment) return null;

  // Calculate course progress
  const totalLectures = sections.reduce((acc, s) => acc + s.lectures.length, 0);
  const completedCount = completed_lectures.length;
  const progressPercentage = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 border-l border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/95 border-b border-gray-200 dark:border-gray-700 p-5 z-10 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
          {enrollment.course.title}
        </h3>
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 dark:text-gray-400 font-medium">تقدم الدورة</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span>{completedCount} / {totalLectures} محاضرة</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ {completedCount}</span>
          </p>
        </div>
      </div>

      {/* Sections & Lectures */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/50 dark:bg-gray-900/30">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const sectionCompletedCount = section.lectures.filter(l => 
            completed_lectures.includes(l.id)
          ).length;
          
          return (
            <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-md transition-shadow">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-750 transition-all duration-200"
              >
                <div className="flex-1 text-right">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {section.order}. {section.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {sectionCompletedCount} / {section.lectures.length} محاضرة
                  </p>
                </div>
                <HeroChevronDownIcon 
                  className={`size-5 text-gray-500 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Lectures */}
              {isExpanded && (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {section.lectures.map((lecture) => {
                    const isActive = isActiveLecture(lecture.id);
                    const isCompleted = isLectureCompleted(lecture.id);

                    return (
                      <button
                        key={lecture.id}
                        id={`lecture-${lecture.id}`}
                        onClick={() => handleLectureClick(lecture)}
                        className={`w-full p-3 flex items-start gap-3 transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-r-4 border-emerald-600 shadow-sm"
                            : "hover:bg-gray-50 dark:hover:bg-gray-750/50"
                        }`}
                      >
                        {/* Icon */}
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <HeroCheckedIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <HeroPlayIcon 
                              fill 
                              className={`size-5 ${
                                isActive 
                                  ? 'text-emerald-600 dark:text-emerald-400' 
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}
                            />
                          )}
                        </div>

                        {/* Lecture Info */}
                        <div className="flex-1 text-right">
                          <p className={`text-sm font-medium ${
                            isActive 
                              ? 'text-emerald-700 dark:text-emerald-300' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {lecture.title}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <HeroClockIcon className="size-3" />
                            <span>{lecture.duration} دقيقة</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
