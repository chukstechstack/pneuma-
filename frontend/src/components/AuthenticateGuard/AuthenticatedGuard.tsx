import React from "react";
import { Navigate } from "react-router-dom";
import useInitializeUser from "@/hooks/useInitializeUser";
import { useAuthStore } from "@store/useAuthStore";
import { FullPageLoader } from "@/components/Loaders/FullPageLoader"; 

export const AuthenticatedGuard = ({ children }: { children: React.ReactNode }) => {
  const { userUuid } = useAuthStore() as { userUuid: string | null | undefined };
  console.log("AuthGuard userUuid:", userUuid);
  
  useInitializeUser();

  // If userUuid is explicitly undefined (still initializing/loading from storage), show loader
  if (userUuid === undefined) {
    return <FullPageLoader />;
  }

  // If userUuid is null (definitely logged out), redirect to login
  if (userUuid === null) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render protected content
  return <>{children}</>;
};