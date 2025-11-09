import React, { useEffect, useState } from "react";
import { useAppSelector } from "./store/store";
import PageLoader from "./components/PageLoader";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, loadingUser , user } = useAppSelector((state) => state.auth);
  const [renderContent, setRenderContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until user loading is finished
    if (!loadingUser) {
      if (!isAuthenticated) {
        // Redirect if not authenticated
        navigate("/login", { replace: true });
      } else {
        // Allow render if authenticated
        if(user?.verified){
          setRenderContent(true);
        }else{
          navigate("/verify/");
        }
      }
    }
  }, [isAuthenticated,user?.verified,loadingUser, navigate]);

  if (loadingUser) {
    return <PageLoader title="جاري التحقق من الحساب" />;
  }

  if (!renderContent) {
    // Prevent flashing before redirect
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
