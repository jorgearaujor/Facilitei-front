import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} replace />;
  }

  if (!user?.admin) return <Navigate to="/painel" replace />;
  return <Outlet />;
}
