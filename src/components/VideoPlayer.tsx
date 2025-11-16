import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CurrentLecture, LectureTimeline } from "../../types";
import { getMedia } from "../utils/functions";
import { HeroPlayIcon } from "./Icons";
import { useAppSelector, useAppDispatch } from "../store/store";
import { setActiveLecture } from "../store/enrollmentSlice";

interface Props {
  lecture: CurrentLecture | null;
  onAddNote?: (timelineItem: LectureTimeline, note: string) => void;
}

export default function VideoPlayer({ lecture, onAddNote }: Props) {
  const { t } = useTranslation();
  const [showVideo, setShowVideo] = useState(false);
  const [ended, setEnded] = useState(false);
  const { lectures , enrollment } = useAppSelector((state) => state.enrollment);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Reset when lecture changes
    setShowVideo(false);
    setEnded(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [lecture]);

  const handlePlayClick = () => {
    setShowVideo(true);
    setEnded(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          /* autoplay blocked by browser */
        });
      }
    }, 100);
  };

  const handleVideoEnded = () => {
    setEnded(true);
  };

  if (!lecture) return <></>;

  // Determine next lectures (skip current)
  const nextLectures = lectures.filter((l) => l.id !== lecture.id).slice(0, 3);



  return (
    <div className="w-full relative  mx-auto z-0 aspect-video overflow-hidden rounded-md rounded-b-none">
      {/* Overlay & Cover */}
      {!showVideo && !ended  && (
        <div
          className="absolute w-full h-full inset-0 z-10 cursor-pointer group"
          onClick={handlePlayClick}
        >
          <div className="absolute w-full border border-slate-300 overflow-hidden h-full bg-emerald-900/30 inset-0 z-10 flex flex-col gap-3 items-center justify-center transition-opacity duration-300 group-hover:bg-emerald-900/50">
            <div className="flex items-center justify-center bg-white rounded-full size-20 shadow-lg group-hover:scale-105 transition-transform">
              <HeroPlayIcon className="size-12 text-slate-800" />
            </div>
              {
                !lecture.cover && (
                  <h1 className="text-2xl  font-semibold"> {t('video_player.lecture', { order: lecture.order, title: lecture.title })} </h1>
                )
              }
          </div>
          {lecture.cover && (
            <img
            src={getMedia(lecture.cover)}
            alt={lecture.title}
            className="w-full h-full object-cover"
          />
          )}
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        key={lecture.id}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          showVideo && !ended ? "opacity-100" : "opacity-0"
        }`}
        src={getMedia(lecture.video)}
        controls
        onEnded={handleVideoEnded}
      />

      {/* Next lectures overlay */}
      {ended && nextLectures.length > 0 && (
        <div className="absolute inset-0 z-20 bg-emerald-900/50 flex flex-col items-center justify-center gap-4 p-4 text-white">
          <h3 className="text-lg font-semibold mb-2">{t('video_player.next_to_watch')}</h3>
          <div className="flex flex-col gap-2 w-full max-w-md">
            {nextLectures.map((l) => (
              <button
                key={l.id}
                onClick={() => dispatch(setActiveLecture(l))}
                className="flex items-center text-right gap-3 p-3 bg-white/10 rounded hover:bg-white/20 transition"
              >
                <HeroPlayIcon fill className="size-6" />
                <div>
                  <p className="font-medium">{l.title}</p>
                  <span className="text-xs opacity-80">{t('video_player.duration_minutes', { duration: l.duration })}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
