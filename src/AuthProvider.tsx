import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import { endpoints } from "./api/routes";
import type { UserStatusResponse } from "../types";
import { setAuthenticationState, setLoadingState, setUser } from "./store/authSlice";
import PageLoader from "./components/PageLoader";
import api from "./api/client";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { loadingUser } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>(null);

  // 🔹 ref لتتبع إذا تم إرسال request مسبقاً
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (hasCheckedAuth.current) return; // إذا تم التحقق مسبقاً، لا نفعل شيئاً

    hasCheckedAuth.current = true; // علم بأن الطلب جاري

    dispatch(setLoadingState(true));

    api.get<UserStatusResponse>(endpoints.user.profile)
      .then((res) => {
        dispatch(setUser(res.data))
        dispatch(setAuthenticationState(true));
      })
      .catch((e) => {
        if (e.status === 401) setError("");
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
