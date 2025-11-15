import React, { useEffect, useState } from "react";
import { useAppSelector } from "./store/store";
import PageLoader from "./components/PageLoader";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, loadingUser, user } = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const [renderContent, setRenderContent] = useState(false);

  useEffect(() => {
    
    if (loadingUser) return; // ننتظر انتهاء التحميل

    if (!isAuthenticated || !user) {
      // Get current path for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      const loginPath = `/login?next=${encodeURIComponent(currentPath)}`;
      navigate(loginPath, { replace: true });
      return;
    }



    setRenderContent(true);
  }, [isAuthenticated,loadingUser, navigate]);

  if (loadingUser) {
    return <PageLoader title="جاري التحقق من الحساب" />;
  }

  if (!renderContent) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
