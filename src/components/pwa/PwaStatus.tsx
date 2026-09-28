import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { registerSW } from "virtual:pwa-register";
import { Button } from "../ui/Button";

type UpdateServiceWorker = ReturnType<typeof registerSW>;

export function PwaStatus() {
  const updateServiceWorker = useRef<UpdateServiceWorker | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    updateServiceWorker.current = registerSW({
      immediate: true,
      onNeedRefresh: () => setUpdateAvailable(true),
      onOfflineReady: () =>
        toast.success("Facilitei pronto para abrir mesmo sem internet."),
      onRegisterError: (error) =>
        console.error("Não foi possível registrar o modo aplicativo.", error),
    });

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Conexão restabelecida.");
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const handlePushMessage = (event: MessageEvent) => {
      if (event.data?.type === "FACILITEI_PUSH_RECEIVED") {
        window.dispatchEvent(new CustomEvent("facilitei:push", { detail: event.data.payload }));
      }
    };
    navigator.serviceWorker?.addEventListener("message", handlePushMessage);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker?.removeEventListener("message", handlePushMessage);
    };
  }, []);

  if (!updateAvailable && isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-24 z-[80] mx-auto max-w-md rounded-2xl border border-primary/20 bg-dark-surface/95 p-3 shadow-2xl backdrop-blur-xl lg:bottom-5"
    >
      {updateAvailable ? (
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-dark-text">Nova versão disponível</p>
            <p className="mt-0.5 text-xs text-dark-subtle">Atualize quando terminar o que está fazendo.</p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => void updateServiceWorker.current?.(true)}
          >
            Atualizar
          </Button>
        </div>
      ) : (
        <p className="px-2 py-1 text-center text-sm font-semibold text-dark-text">
          Você está sem internet. Algumas ações ficarão indisponíveis.
        </p>
      )}
    </div>
  );
}
