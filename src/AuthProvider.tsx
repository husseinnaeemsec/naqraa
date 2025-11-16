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
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loadingUser } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const hasCheckedAuth = useRef(false);



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
        dispatch(setUser(profileRes.data));
        dispatch(setWeekStudyTime(profileRes.data.week_study_time));
        dispatch(setAuthenticationState(true));
      })
      .catch((_err) => {
        dispatch(logoutUser())
        setError("Unauthorized");
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
