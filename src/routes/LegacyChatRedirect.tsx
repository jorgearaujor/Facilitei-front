import { Navigate, useParams } from "react-router-dom";

export function LegacyChatRedirect() {
  const { servicoId } = useParams();
  return <Navigate to={`/painel/chat/${servicoId}`} replace />;
}
