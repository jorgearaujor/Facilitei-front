import { useEffect, type ReactNode } from "react";
import {
  api,
  ensureCsrfToken,
  isOptionalAuthEndpointUnavailable,
} from "../../lib/api";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";

type AuthBootstrapProps = {
  children: ReactNode;
};

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const { isInitialized, login, logout, markInitialized } = useAuthStore();

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      try {
        await ensureCsrfToken();
        const { data } = await api.get("/auth/session");
        if (active && data.user && data.role) {
          login({ ...data.user, role: data.role, admin: Boolean(data.admin) });
        }
      } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : 0;
        if (active && (status === 401 || status === 403)) {
          logout();
        } else if (!isOptionalAuthEndpointUnavailable(error)) {
          console.warn("Não foi possível validar a sessão atual.", error);
        }
      } finally {
        if (active) markInitialized();
      }
    };

    initialize();
    return () => {
      active = false;
    };
  }, [login, logout, markInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen grid place-items-center bg-dark-background text-white">
        Verificando sessao...
      </div>
    );
  }

  return children;
}
