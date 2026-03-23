import { useRef, useState, useEffect } from "react";
import type { CurrentLecture } from "../../../types";
import { getMedia } from "../../utils/functions";
import { HeroPlayIcon } from "../Icons";
import { useAppSelector, useAppDispatch } from "../../store";
import { setActiveLecture } from "../../store/enrollmentSlice";

interface Props {
  lecture: CurrentLecture | null;
}

/**
 * Enhanced lecture video player component
 * 
 * Features:
 * - Cover image overlay before play
 * - Native video controls
 * - Next lectures suggestion when video ends
 * - Responsive aspect ratio (16:9)
 * - Auto-pause on lecture change
 */
export default function LecturePlayer({ lecture }: Props) {
  const [showVideo, setShowVideo] = useState(false);
  const [ended, setEnded] = useState(false);
  const { lectures } = useAppSelector((state) => state.enrollment);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useAppDispatch();

  // Reset player when lecture changes
  useEffect(() => {
    setShowVideo(false);
    setEnded(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [lecture?.id]);

  const handlePlayClick = () => {
    setShowVideo(true);
    setEnded(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Autoplay blocked by browser
        });
      }
    }, 100);
  };

  const handleVideoEnded = () => {
    setEnded(true);
  };

  if (!lecture) {
    return (
      <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">الرجاء تحديد محاضرة</p>
      </div>
    );
  }

  // Get next 3 lectures (excluding current)
  const nextLectures = lectures
    .filter((l) => l.id !== lecture.id)
    .slice(0, 3);

  return (
    <div className="w-full relative z-0 aspect-video overflow-hidden bg-black">
      {/* Cover Overlay - shown before play */}
      {!showVideo && !ended && (
        <div
          className="absolute w-full h-full inset-0 z-10 cursor-pointer group"
          onClick={handlePlayClick}
        >
          {/* Dark overlay with play button */}
          <div className="absolute w-full h-full bg-gradient-to-t from-black/60 via-black/30 to-black/20 inset-0 z-10 flex flex-col gap-3 items-center justify-center transition-all duration-300 group-hover:from-black/70 group-hover:via-black/40">
            <div className="flex items-center justify-center bg-white rounded-full size-20 shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <HeroPlayIcon className="size-12 text-emerald-600" />
            </div>
            <div className="text-center px-4">
              <h2 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
                {lecture.title}
              </h2>
              <p className="text-white/90 text-sm mt-2">
                المحاضرة {lecture.order} • {lecture.duration} دقيقة
              </p>
            </div>
          </div>

          {/* Cover Image or Gradient Background */}
          {lecture.cover ? (
            <img
              src={getMedia(lecture.cover)}
              alt={lecture.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700" />
          )}
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        key={lecture.id}
        className={`w-full h-full object-contain bg-black transition-opacity duration-300 ${
          showVideo && !ended ? "opacity-100" : "opacity-0"
        }`}
        src={getMedia(lecture.video)}
        controls
        controlsList="nodownload"
        onEnded={handleVideoEnded}
      />

      {/* Next Lectures Overlay - shown when video ends */}
      {ended && nextLectures.length > 0 && (
        <div className="absolute inset-0 z-20 bg-gradient-to-br from-emerald-900/95 to-emerald-800/95 flex flex-col items-center justify-center gap-6 p-6 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">أحسنت! 🎉</h3>
            <p className="text-emerald-200">ماذا تريد أن تشاهد بعد ذلك؟</p>
          </div>

          <div className="w-full max-w-md space-y-3">
            {nextLectures.map((l) => (
              <button
                key={l.id}
                onClick={() => dispatch(setActiveLecture(l))}
                className="w-full flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200 text-right group"
              >
                <div className="flex-shrink-0">
                  <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors">
                    <HeroPlayIcon fill className="size-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{l.title}</p>
                  <span className="text-sm text-emerald-200">
                    {l.duration} دقيقة
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setEnded(false)}
            className="mt-4 px-6 py-2 text-sm text-white/80 hover:text-white border border-white/30 rounded-full hover:bg-white/10 transition-all"
          >
            إعادة المشاهدة
          </button>
        </div>
      )}
    </div>
  );
}
