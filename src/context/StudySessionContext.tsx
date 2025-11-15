import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import api from "../api/client";
import { endpoints } from "../api/routes";

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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxSeconds = getRemainingSecondsToday();

  // 🟢 useCallback for stable references
  const start = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => setIsActive(false), []);

  const submit = useCallback(async () => {
    try {
      await api.post(endpoints.user.studySession, { total_seconds: seconds });
      setLastUpdated(new Date());
      // Study time submitted successfully
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

  // Pause/resume on tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => setIsActive(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Auto-sync every 3 minutes
  useEffect(() => {
    const SYNC_INTERVAL_MS = 3 * 60 * 1000;
    syncIntervalRef.current = setInterval(() => {
      const now = new Date();
      if (!lastUpdated || now.getTime() - lastUpdated.getTime() >= SYNC_INTERVAL_MS) {
        submit();
      }
    }, 10_000);

    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [lastUpdated, submit]);

  // Submit on page unload
  useEffect(() => {
    const handleBeforeUnload = () => submit();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submit]);

  return (
    <TrackerContext.Provider value={{ seconds, isActive, start, stop, submit }}>
      {children}
    </TrackerContext.Provider>
  );
};
