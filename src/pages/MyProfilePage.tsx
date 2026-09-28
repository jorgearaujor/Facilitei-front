import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ClienteProfilePage } from "./ClienteProfilePage";
import { TrabalhadorProfilePage } from "./TrabalhadorProfilePage";

export function MyProfilePage() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  return user.role === "trabalhador" ? (
    <TrabalhadorProfilePage profileId={user.id} />
  ) : (
    <ClienteProfilePage profileId={user.id} />
  );
}
