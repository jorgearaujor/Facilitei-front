import { useAuthStore } from '../store/useAuthStore';
import { ClienteSettingsPage } from './ClienteSettingsPage';
import { TrabalhadorSettingsPage } from './TrabalhadorSettingsPage';
import { Navigate } from 'react-router-dom';
import { PushNotificationSettings } from '../components/notifications/PushNotificationSettings';

export function SettingsRootPage() {
  const { user } = useAuthStore();

  if (user?.role === 'trabalhador') {
    return (
      <div className="space-y-8">
        <TrabalhadorSettingsPage />
        <div className="mx-auto max-w-5xl"><PushNotificationSettings /></div>
      </div>
    );
  }
  
  if (user?.role === 'cliente') {
    return (
      <div className="space-y-8">
        <ClienteSettingsPage />
        <div className="mx-auto max-w-4xl"><PushNotificationSettings /></div>
      </div>
    );
  }

  // Se (por algum motivo) não for nenhum dos dois, volta pro login
  return <Navigate to="/login" replace />;
}
