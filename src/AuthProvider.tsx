import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "./store/store";
import { endpoints } from "./api/routes";
import type { UserStatusResponse } from "../types";
import {
  logoutUser,
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


const AuthProvider: React.FC<Props> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { loadingUser } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const hasCheckedAuth = useRef(false);

  // Helper function to set language attributes
  const setLanguageAttributes = (lang: string) => {
    const langConfig = {
      'ar': { dir: 'rtl' },
      'en': { dir: 'ltr' },
      'ku': { dir: 'rtl' }
    };

    const config = langConfig[lang as keyof typeof langConfig] || langConfig['ar'];
    document.documentElement.dir = config.dir;
    document.documentElement.lang = lang;
  };



  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    dispatch(setLoadingState(true));

    api
      .get(endpoints.user.status, { withCredentials: true })
      .then(async (res) => {
        const isAuthenticated = res.data.ok;

        if (!isAuthenticated) {

          dispatch(logoutUser())
          return;
        }


        const profileRes = await api.get<UserStatusResponse>(
          endpoints.user.profile,
          { withCredentials: true }
        );

        // Handle authenticated user's language preference
        const user = profileRes.data;
        if (user.profile?.lang && ['ar', 'en', 'ku'].includes(user.profile.lang)) {
          // Set language from user profile
          await i18n.changeLanguage(user.profile.lang);
          setLanguageAttributes(user.profile.lang);

          // Clear localStorage language for authenticated users since it's managed server-side
          try {
            localStorage.removeItem('language');
          } catch (error) {
            console.warn('Error removing language from localStorage:', error);
          }
        }

        dispatch(setUser(user));
        dispatch(setWeekStudyTime(user.week_study_time));
        dispatch(setAuthenticationState(true));
      })
      .catch((err) => {
        // When logout occurs, restore language from localStorage if available
        try {
          const savedLanguage = localStorage.getItem('language');
          if (savedLanguage && ['ar', 'en', 'ku'].includes(savedLanguage)) {
            i18n.changeLanguage(savedLanguage);
            setLanguageAttributes(savedLanguage);
          }
        } catch (error) {
          console.warn('Error restoring language from localStorage:', error);
        }

        if (err.status === 401) {
          dispatch(logoutUser())
          setError("Unauthorized");
        }
      })
      .finally(() => {
        dispatch(setLoadingState(false));
      });
  }, [dispatch]);

  // ✅ هذا الشرط لا يغيّر ترتيب الـ hooks
  if (loadingUser && !error) {
    return <PageLoader title={t('auth.verifyingAccount')} />;
  }

  return <>{children}</>;
};

export default AuthProvider;
