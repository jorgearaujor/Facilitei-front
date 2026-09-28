import { toast } from "react-hot-toast";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import { BellIcon, CheckIcon } from "../ui/Icons";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function PushNotificationSettings() {
  const push = usePushNotifications(true);
  const active = push.capability === "subscribed";

  const change = async () => {
    try {
      if (active) {
        await push.disable();
        toast.success("Notificações desativadas neste dispositivo.");
      } else {
        await push.enable();
        toast.success("Notificações ativadas neste dispositivo.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível alterar a configuração.");
    }
  };

  return (
    <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex items-start gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${active ? "bg-[#C7F36B] text-[#173D36]" : "bg-primary/10 text-primary"}`}>
          {active ? <CheckIcon className="h-6 w-6 stroke-[2.5]" /> : <BellIcon className="h-6 w-6" />}
        </span>
        <div>
          <h2 className="font-display text-lg font-bold text-dark-text">Notificações push</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-dark-subtle">
            {active
              ? "Este dispositivo recebe avisos de novos pedidos, mensagens e mudanças nos serviços."
              : push.capability === "denied"
                ? "As notificações estão bloqueadas no navegador. Libere a permissão nas configurações do site."
                : "Receba avisos importantes mesmo quando o Facilitei estiver fechado."}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant={active ? "outline" : "primary"}
        disabled={push.isLoading || push.isChanging || !push.config?.enabled || push.capability === "unsupported" || push.capability === "denied"}
        onClick={() => void change()}
        className="shrink-0"
      >
        {!push.config?.enabled
          ? "Indisponível"
          : push.isChanging
            ? "Aguarde..."
            : active ? "Desativar neste dispositivo" : "Ativar notificações"}
      </Button>
    </Card>
  );
}
