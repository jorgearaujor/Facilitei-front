import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    const redirectTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
        replace
      />
    );
  }

  // Se estiver autenticado, renderiza o conteúdo da rota (o Outlet)
  return <Outlet />;
}
