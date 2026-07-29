import React from "react";
import { Navigate } from "react-router-dom";
import useInitializeUser from "@/hooks/useInitializeUser";
import { useAuthStore } from "@store/useAuthStore";
import FullPageLoader from "@components/Loader";

export const AuthenticatedGuard = ({ children }: { children: React.ReactNode }) => {
  const { userUuid } = useAuthStore() as { userUuid: string | null };
  console.log("AuthGuard:", userUuid);
  useInitializeUser();
  if (userUuid === null) return <FullPageLoader />;
  return userUuid ? <>{children}</> : <Navigate to="/login" />;
};