import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api, ensureCsrfToken } from "../../lib/api";
import type { AppNotification } from "../../types/api";
import { BellIcon, CheckIcon } from "../ui/Icons";
import { Button } from "../ui/Button";
import { usePushNotifications } from "../../hooks/usePushNotifications";

const relativeTime = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function formatRelativeTime(value: string) {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  if (Math.abs(seconds) < 60) return "agora";
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return relativeTime.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeTime.format(hours, "hour");
  return relativeTime.format(Math.round(hours / 24), "day");
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const push = usePushNotifications(true);

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get<AppNotification[]>("/notifications").then(({ data }) => data),
    refetchInterval: 30_000,
  });
  const unreadQuery = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: () => api.get<{ count: number }>("/notifications/unread-count").then(({ data }) => data.count),
    refetchInterval: 30_000,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    void queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
  };

  useEffect(() => {
    const onPush = (event: Event) => {
      const payload = (event as CustomEvent<{ title?: string }>).detail;
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      toast(payload?.title || "Você tem uma novidade.", { icon: "🔔" });
    };
    window.addEventListener("facilitei:push", onPush);
    return () => window.removeEventListener("facilitei:push", onPush);
  }, [queryClient]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const markRead = useMutation({
    mutationFn: async (id: number) => {
      await ensureCsrfToken();
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: invalidate,
  });
  const markAllRead = useMutation({
    mutationFn: async () => {
      await ensureCsrfToken();
      await api.patch("/notifications/read-all");
    },
    onSuccess: invalidate,
  });

  const openNotification = (notification: AppNotification) => {
    if (!notification.read) markRead.mutate(notification.id);
    setOpen(false);
    if (notification.actionUrl) navigate(notification.actionUrl);
  };

  const enablePush = async () => {
    try {
      await push.enable();
      toast.success("Notificações push ativadas neste dispositivo.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível ativar as notificações.");
    }
  };

  const unread = unreadQuery.data ?? 0;
  const items = notificationsQuery.data ?? [];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={unread ? `${unread} notificações não lidas` : "Notificações"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-dark-surface text-dark-subtle transition-colors hover:border-primary/35 hover:text-primary"
      >
        <BellIcon className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#FF7E5F] px-1 text-[10px] font-extrabold text-[#173D36] ring-2 ring-dark-background">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-[4.5rem] z-[70] overflow-hidden rounded-[1.5rem] border border-primary/15 bg-dark-surface shadow-2xl sm:left-auto sm:right-4 sm:w-[390px] lg:absolute lg:right-0 lg:top-12">
          <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
            <div>
              <p className="font-display text-lg font-bold text-dark-text">Notificações</p>
              <p className="text-xs text-dark-subtle">{unread ? `${unread} não lida${unread === 1 ? "" : "s"}` : "Tudo em dia"}</p>
            </div>
            {unread > 0 && (
              <button type="button" onClick={() => markAllRead.mutate()} className="text-xs font-bold text-primary hover:underline">
                Marcar todas como lidas
              </button>
            )}
          </div>

          {push.config?.enabled && push.capability !== "subscribed" && push.capability !== "denied" && (
            <div className="m-3 rounded-2xl bg-primary/10 p-4">
              <p className="text-sm font-bold text-dark-text">Receba novidades mesmo com o app fechado</p>
              <p className="mt-1 text-xs leading-5 text-dark-subtle">Ative o push para pedidos, mensagens e mudanças de status.</p>
              <Button size="sm" className="mt-3" disabled={push.isChanging} onClick={() => void enablePush()}>
                {push.isChanging ? "Ativando..." : "Ativar neste dispositivo"}
              </Button>
            </div>
          )}

          <div className="max-h-[min(60vh,480px)] overflow-y-auto">
            {notificationsQuery.isLoading ? (
              <p className="p-8 text-center text-sm text-dark-subtle">Carregando...</p>
            ) : items.length === 0 ? (
              <div className="p-10 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><CheckIcon className="h-6 w-6" /></span>
                <p className="mt-3 font-bold text-dark-text">Nenhuma novidade</p>
                <p className="mt-1 text-sm text-dark-subtle">Os avisos importantes aparecerão aqui.</p>
              </div>
            ) : items.map((notification) => (
              <button
                type="button"
                key={notification.id}
                onClick={() => openNotification(notification)}
                className={`relative block w-full border-b border-primary/10 px-5 py-4 text-left transition-colors last:border-0 hover:bg-primary/5 ${notification.read ? "" : "bg-primary/[0.07]"}`}
              >
                {!notification.read && <span className="absolute left-2 top-6 h-2 w-2 rounded-full bg-[#FF7E5F]" />}
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-extrabold text-dark-text">{notification.title}</p>
                  <time className="shrink-0 text-[10px] font-semibold text-dark-subtle">{formatRelativeTime(notification.createdAt)}</time>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-dark-subtle">{notification.message}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
