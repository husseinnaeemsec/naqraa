import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import { useLocation } from "react-router-dom";
import { endpoints } from "../api/routes";
import api from "../api/client";
import type { StudySession } from "../../types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { updateDayStudyTime } from "../store/auth/authSlice";

interface TrackerContextType {
  seconds: number;
  isActive: boolean;
  start: () => void;
  stop: () => void;
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

// 🧮 Utility to get remaining seconds of today
function getRemainingSecondsToday(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

export const StudySessionTrackerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  // Removed unused lastUpdated
  const lastSentRef = useRef<Date | null>(null);
  const location = useLocation();
  const dispatch = useAppDispatch();
  // Removed unused useNavigate
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxSeconds = getRemainingSecondsToday();

  const {week_study_time} = useAppSelector(state=>state.auth);

  // useCallback for stable references
  const start = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => setIsActive(false), []);

  // Minimum interval between submits (ms)
  const MIN_SUBMIT_INTERVAL = 30 * 1000; // 30 seconds

  // Reliable submit using sendBeacon for unload/path change
  const syncSubmit = useCallback(() => {
    const now = new Date();
    if (lastSentRef.current && now.getTime() - lastSentRef.current.getTime() < MIN_SUBMIT_INTERVAL) {
      return;
    }
    if(seconds <= 0) return;
    try {
      const url = api.defaults.baseURL + endpoints.user.studySession;
      const payload = JSON.stringify({ total_seconds: seconds });
      const headers = { type: "application/json" };
      navigator.sendBeacon(url, new Blob([payload], headers));
      lastSentRef.current = now;
    } catch (err) {
      // Fallback: ignore
    }
  }, [seconds]);

  const submit = useCallback(async () => {
    const now = new Date();
    if (lastSentRef.current && now.getTime() - lastSentRef.current.getTime() < MIN_SUBMIT_INTERVAL) {
      return;
    }
    if(seconds <= 0) return;
    try {
      const req = await api.post(endpoints.user.studySession, { total_seconds: seconds });
      lastSentRef.current = now;
      // Study time submitted successfully
      const session:StudySession = req.data;
      dispatch(updateDayStudyTime(session));
    } catch (err) {
      // Failed to submit study time
    }
  }, [seconds]);

  // Increment timer every second
  useEffect(() => {
    if (!isActive) return;
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const newVal = prev + 1;
        if (newVal >= maxSeconds) {
          stop();
          submit(); // final submit
          return maxSeconds;
        }
        return newVal;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, stop, submit, maxSeconds]);

  // Pause/resume on tab visibility, and submit if hidden (with interval check)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
      if (document.hidden) {
        submit();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [submit]);

  // Submit before route/path changes (react-router) using sendBeacon
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      syncSubmit();
      prevPathRef.current = location.pathname;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, syncSubmit]);

  // Auto-sync every 30 seconds (or 1 minute if you want)
  useEffect(() => {
    const SYNC_INTERVAL_MS = 30 * 1000; // 30 seconds
    syncIntervalRef.current = setInterval(() => {
      submit();
    }, SYNC_INTERVAL_MS);
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [submit]);

  // Send on unmount (final chance) using sendBeacon
  useEffect(()=>{
    return ()=>{
      syncSubmit();
    }
  },[syncSubmit])

  // Submit on page unload (final chance) using sendBeacon
  useEffect(() => {
    const handleBeforeUnload = () => {
      syncSubmit();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [syncSubmit]);


  // Ensure syncSubmit is called before unmount (route change, provider unmount, etc)
  useEffect(() => {
    return () => {
      syncSubmit();
    };
  }, [syncSubmit]);

  return (
    <TrackerContext.Provider value={{ seconds, isActive, start, stop, submit }}>
      {children}
    </TrackerContext.Provider>
  );
};
