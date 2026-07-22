import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AccessDeniedPage } from "../../pages/AccessDeniedPage";
import { AuthLoadingScreen } from "./components/AuthLoadingScreen";
import { useAuth } from "./useAuth";

export const ProtectedRoute = () => {
  const location = useLocation();
  const { user, profile, isAuthLoading, isProfileLoading } = useAuth();

  if (isAuthLoading || (user && isProfileLoading)) return <AuthLoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!profile || !profile.active) return <AccessDeniedPage />;
  return <Outlet />;
};
