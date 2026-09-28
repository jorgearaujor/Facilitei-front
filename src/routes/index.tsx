import { Navigate, createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { AboutPage } from "../pages/AboutPage";
import { AssinaturaPrestadorPage } from "../pages/AssinaturaPrestadorPage";
import { ChatPage } from "../pages/ChatPage";
import { ClienteProfilePage } from "../pages/ClienteProfilePage";
import { DashboardRootPage } from "../pages/DashboardRootPage";
import { FAQPage } from "../pages/FAQPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { MyProfilePage } from "../pages/MyProfilePage";
import { RegisterPage } from "../pages/RegisterPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { SettingsRootPage } from "../pages/SettingsRootPage";
import { SolicitarServicoPage } from "../pages/SolicitarServicoPage";
import { TrabalhadorProfilePage } from "../pages/TrabalhadorProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { LegacyChatRedirect } from "./LegacyChatRedirect";
import { AdminRoute } from "./AdminRoute";
import { SupportCenterPage } from "../pages/SupportCenterPage";
import { SupportCasePage } from "../pages/SupportCasePage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminSupportCasePage } from "../pages/AdminSupportCasePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "faq", element: <FAQPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "recuperar-senha", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "redefinir-senha", element: <ResetPasswordPage /> },
      { path: "cadastro", element: <RegisterPage /> },

      // Área pública.
      { path: "profissionais", element: <SolicitarServicoPage /> },
      { path: "trabalhador/:id", element: <TrabalhadorProfilePage /> },
      { path: "cliente/:id", element: <ClienteProfilePage /> },

      // Área autenticada.
      {
        path: "painel",
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardRootPage /> },
          { path: "perfil", element: <MyProfilePage /> },
          { path: "configuracoes", element: <SettingsRootPage /> },
          { path: "assinatura", element: <AssinaturaPrestadorPage /> },
          { path: "chat/:servicoId", element: <ChatPage /> },
          { path: "suporte", element: <SupportCenterPage /> },
          { path: "suporte/:caseId", element: <SupportCasePage /> },
        ],
      },

      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "suporte/:caseId", element: <AdminSupportCasePage /> },
        ],
      },

      // Compatibilidade com URLs publicadas antes da reorganização.
      { path: "dashboard", element: <Navigate to="/painel" replace /> },
      {
        path: "dashboard/solicitar",
        element: <Navigate to="/profissionais" replace />,
      },
      {
        path: "dashboard/configuracoes",
        element: <Navigate to="/painel/configuracoes" replace />,
      },
      {
        path: "dashboard/assinatura",
        element: <Navigate to="/painel/assinatura" replace />,
      },
      {
        path: "dashboard/chat/:servicoId",
        element: <LegacyChatRedirect />,
      },
    ],
  },
]);
