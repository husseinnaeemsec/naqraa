import React from "react";
import { useAppSelector } from "./store/store";
import PageLoader from "./components/PageLoader";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, loadingUser } = useAppSelector((state) => state.auth);



  // إذا لسه يتحقق من المستخدم → نعرض لودر
  if (loadingUser) {
    return <PageLoader title="جاري التحقق من الحساب" />;
  }

  // إذا انتهى التحقق وما المستخدم مو مسجل دخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // إذا المستخدم موثق
  return <>{children}</>;
};

export default ProtectedRoute;
