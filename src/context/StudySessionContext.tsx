import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";

import { useLocation } from "react-router-dom";
import { dailyStudySessionAPI } from "../api/dailyStudySession";

interface TrackerContextType {
  studyTimeAccumulator: number;
  pauseTimeAccumulator: number;
  isStudying: boolean;
  submit: () => Promise<void>;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const useStudySessionTracker = () => {
  const context = useContext(TrackerContext);
  if (!context)
    throw new Error(
      "useStudySessionTracker must be used within StudySessionTrackerProvider"
    );
  return context;
};

export const StudySessionTrackerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Accumulate time deltas to send in batches
  const studyTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const isStudyingRef = useRef(true);
  const lastSentRef = useRef<Date | null>(null);
  const location = useLocation();
  
  // Minimum interval between submits (30 seconds)
  const MIN_SUBMIT_INTERVAL = 30 * 1000;

  // Submit accumulated time to backend
  const submit = useCallback(async () => {
    const now = new Date();
    if (lastSentRef.current && now.getTime() - lastSentRef.current.getTime() < MIN_SUBMIT_INTERVAL) {
      return;
    }
    
    const studyDelta = studyTimeRef.current;
    const pauseDelta = pauseTimeRef.current;
    
    if (studyDelta === 0 && pauseDelta === 0) return;
    
    try {
      await dailyStudySessionAPI.track({
        study_time_delta: studyDelta,
        pause_time_delta: pauseDelta,
      });
      
      // Reset accumulators after successful submit
      studyTimeRef.current = 0;
      pauseTimeRef.current = 0;
      lastSentRef.current = now;
    } catch (err) {
      console.error('Failed to submit study time:', err);
    }
  }, []);

  // Reliable submit using sendBeacon for unload/path change
  const syncSubmit = useCallback(() => {
    const studyDelta = studyTimeRef.current;
    const pauseDelta = pauseTimeRef.current;
    
    if (studyDelta === 0 && pauseDelta === 0) return;
    
    try {
      // Get base URL from api client
      const baseURL = import.meta.env.VITE_API_URL;
      const url = `${baseURL}/enrollments/daily-session/track/`;
      const payload = JSON.stringify({
        study_time_delta: studyDelta,
        pause_time_delta: pauseDelta,
      });
      const headers = { type: "application/json" };
      navigator.sendBeacon(url, new Blob([payload], headers));
      
      studyTimeRef.current = 0;
      pauseTimeRef.current = 0;
    } catch (err) {
      console.error('Failed to sync study time:', err);
    }
  }, []);


  // Increment study time every second when active
  useEffect(() => {
    const intervalRef = setInterval(() => {
      if (isStudyingRef.current) {
        studyTimeRef.current += 1;
      } else {
        pauseTimeRef.current += 1;
      }
    }, 1000);

    return () => clearInterval(intervalRef);
  }, []);

  // Pause/resume on tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      isStudyingRef.current = !document.hidden;
      if (document.hidden) {
        submit();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [submit]);

  // Submit before route/path changes using sendBeacon
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      syncSubmit();
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, syncSubmit]);

  // Auto-sync every 30 seconds
  useEffect(() => {
    const syncIntervalRef = setInterval(() => {
      submit();
    }, MIN_SUBMIT_INTERVAL);
    
    return () => clearInterval(syncIntervalRef);
  }, [submit, MIN_SUBMIT_INTERVAL]);

  // Submit on page unload using sendBeacon
  useEffect(() => {
    const handleBeforeUnload = () => {
      syncSubmit();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [syncSubmit]);

  // Ensure syncSubmit is called before unmount
  useEffect(() => {
    return () => {
      syncSubmit();
    };
  }, [syncSubmit]);

  return (
    <TrackerContext.Provider 
      value={{ 
        studyTimeAccumulator: studyTimeRef.current,
        pauseTimeAccumulator: pauseTimeRef.current,
        isStudying: isStudyingRef.current,
        submit 
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};
