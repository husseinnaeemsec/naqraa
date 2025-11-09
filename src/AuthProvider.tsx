import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import { endpoints } from "./api/routes";
import type { UserStatusResponse } from "../types";
import {
  setAuthenticationState,
  setLoadingState,
  setUser,
  setWeekStudyTime,
} from "./store/authSlice";
import PageLoader from "./components/PageLoader";
import api from "./api/client";

interface Props {
  children: React.ReactNode;
}

const CACHE_KEY = "user_cache";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 12; // 12h

const AuthProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { loadingUser } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const hasCheckedAuth = useRef(false);
  

  const loadCachedUser = (): UserStatusResponse | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      const lastUpdated = new Date(parsed.last_updated);
      const isFresh = Date.now() - lastUpdated.getTime() < CACHE_DURATION_MS;
      return isFresh ? parsed.data : null;
    } catch {
      return null;
    }
  };

  const saveUserToCache = (user: UserStatusResponse) => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: user, last_updated: new Date().toISOString() })
    );
  };

  const clearUserCache = () => {
    localStorage.removeItem(CACHE_KEY);
  };

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    dispatch(setLoadingState(true));

    // ✅ 1. Check auth state (lightweight endpoint)
    api
      .get(endpoints.user.status, { withCredentials: true })
      .then(async (res) => {
        const isAuthenticated = res.data.ok;

        if (!isAuthenticated) {
          clearUserCache();
          dispatch(setAuthenticationState(false));
          return;
        }

        dispatch(setAuthenticationState(true));

        // 2. Try to use cache
        const cachedUser = loadCachedUser();

        if (cachedUser) {
          dispatch(setUser(cachedUser));
          dispatch(setWeekStudyTime(cachedUser.week_study_time));
        } else {
          // 3. Fetch full profile
          const profileRes = await api.get<UserStatusResponse>(
            endpoints.user.profile,
            { withCredentials: true }
          );
          dispatch(setUser(profileRes.data));
          dispatch(setWeekStudyTime(profileRes.data.week_study_time));
          saveUserToCache(profileRes.data);
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        clearUserCache();
        dispatch(setAuthenticationState(false));
        setError("Unauthorized");
      })
      .finally(() => {
        dispatch(setLoadingState(false));
      });
  }, [dispatch]);

  if (loadingUser && !error) {
    return <PageLoader title="جاري التحقق من الحساب" />;
  }

  return <>{children}</>;
};

export default AuthProvider;
