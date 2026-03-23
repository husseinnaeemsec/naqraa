import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/all";
import { useAppDispatch, useAppSelector } from "../../../store/index.tsx";
import { HeroCheckedIcon, HeroClockIcon, HeroPlayIcon, HeroMenuIcon, HeroXIcon } from "../../Icons";
import { setActiveLecture } from "../../../store/enrollmentSlice.tsx";

gsap.registerPlugin(ScrollToPlugin);

export default function EnrollmentNavigation() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { activeLecture, sections, completed_lectures } = useAppSelector(
    (state) => state.enrollment
  );
  const dispatch = useAppDispatch();



  // Scroll active lecture into view
  useEffect(() => {
    if (!activeLecture || !scrollerRef.current) return;
    const target = document.getElementById(`lecture-${activeLecture.id}`);
    if (!target) return;

    gsap.to(scrollerRef.current, {
      duration: 0.5,
      scrollTo: { y: target,offsetY:120},
    });
  }, [activeLecture?.id]);

  const isActiveLecture = (lecture_id: number) =>
    activeLecture?.id === lecture_id;

  const isLectureCompleted = (lecture_id: number) =>
    completed_lectures.findIndex((l) => l === lecture_id) !== -1;

  // Animate mobile menu
  useEffect(() => {
    if (!menuRef.current) return;
    gsap.set(menuRef.current, { x: "100%" });
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    if (menuOpen) {
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(menuRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [menuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b bg-white dark:bg-emerald-900 fixed bottom-0 w-full border z-30">
        <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
          محتوى الدورة
        </h3>
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 border rounded-md bg-emerald-600 text-white"
        >
          <HeroMenuIcon className="size-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 w-4/5 sm:w-3/5 h-full bg-white dark:bg-emerald-900 z-40 shadow-xl overflow-y-auto"
      >
        <div className="flex justify-between items-center p-3 border-b border-emerald-700 dark:border-emerald-500">
          <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
            محتوى الدورة
          </h3>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-md hover:bg-emerald-700/10 dark:hover:bg-emerald-800"
          >
            <HeroXIcon className="size-6 text-emerald-700 dark:text-emerald-300" />
          </button>
        </div>

        <div ref={scrollerRef} className="p-4 overflow-y-auto h-full">
          {sections.map((s) => (
            <div key={s.id}>
              <h1 className="text-lg font-semibold mb-2">
                {s.order} - {s.title}
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {s.lectures.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      dispatch(setActiveLecture(l));
                      setMenuOpen(false);
                    }}
                    id={`lecture-${l.id}`}
                    className={`p-2 transition-colors border border-emerald-300 rounded flex items-center gap-2 ${isActiveLecture(l.id)
                        ? "bg-emerald-600 text-white"
                        : "bg-transparent text-emerald-600 dark:text-emerald-300"
                      }`}
                  >
                    {isLectureCompleted(l.id) ? (
                      <HeroCheckedIcon className="size-6" />
                    ) : (
                      <HeroPlayIcon fill className="size-6" />
                    )}
                    <div className="space-y-1 text-right">
                      <p>{l.title}</p>
                      <div className="flex items-center gap-2 text-xs opacity-80">
                        <HeroClockIcon className="size-4" />
                        <span>{l.duration} دقيقة</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col h-screen bg-white dark:bg-emerald-950 border-l border-gray-200 dark:border-emerald-800">
        <div className="sticky top-0 bg-white dark:bg-emerald-950 border-b border-gray-200 dark:border-emerald-800 p-4 z-10">
          <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300">
            محتوى الدورة
          </h3>
        </div>
        <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {sections.map((s) => (
            <div key={s.id} >
              <h1 className="text-lg font-semibold mb-2">
                {s.order} - {s.title}
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {s.lectures.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => dispatch(setActiveLecture(l))}
                    id={`lecture-${l.id}`}
                    className={`p-2 transition-colors border border-slate-300 rounded flex items-center gap-2 ${isActiveLecture(l.id)
                        ? "bg-emerald-600 text-white"
                        : "bg-transparent text-slate-500 dark:text-emerald-300"
                      }`}
                  >
                    {isLectureCompleted(l.id) ? (
                      <HeroCheckedIcon className={` size-6 ${isActiveLecture(l.id) ? 'text-white' : 'text-emerald-600'} `} />
                    ) : (
                      <HeroPlayIcon fill className={`size-6 ${isActiveLecture(l.id) ? 'text-white' : 'text-slate-400'}`} />
                    )}
                    <div className="space-y-1 text-right">
                      <p className="font-medium">{l.title}</p>
                      <div className="flex items-center gap-2 text-xs opacity-80">
                        <HeroClockIcon className="size-4" />
                        <span>{l.duration} دقيقة</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
