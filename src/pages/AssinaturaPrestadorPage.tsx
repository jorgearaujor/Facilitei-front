import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Typography } from "../components/ui/Typography";
import { CheckIcon } from "../components/ui/Icons";
import {
  assinaturaQueryKey,
  cancelarAssinatura,
  consultarAssinatura,
  formatarValidade,
  formatarValorMensal,
  iniciarCheckout,
} from "../lib/assinatura";
import { ensureCsrfToken } from "../lib/api";
import { getErrorMessage } from "../lib/httpError";
import { useAuthStore } from "../store/useAuthStore";
import type { AssinaturaPrestador } from "../types/api";

const statusLabels: Record<string, string> = {
  NONE: "Ainda não ativada",
  PENDING: "Aguardando pagamento",
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  EXPIRED: "Expirada",
  CANCELLED: "Cancelada",
};

export function AssinaturaPrestadorPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const assinaturaQuery = useQuery({
    queryKey: assinaturaQueryKey,
    queryFn: consultarAssinatura,
    enabled: user?.role === "trabalhador",
    refetchOnWindowFocus: true,
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING" ? 5000 : false,
  });

  const atualizarCache = (assinatura: AssinaturaPrestador) => {
    queryClient.setQueryData(assinaturaQueryKey, assinatura);
    return assinatura;
  };

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      await ensureCsrfToken();
      return iniciarCheckout();
    },
    onSuccess: (assinatura) => {
      atualizarCache(assinatura);
      if (!assinatura.checkoutUrl?.startsWith("https://")) {
        toast.error("O checkout não retornou um endereço seguro.");
        return;
      }
      window.location.assign(assinatura.checkoutUrl);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Não foi possível abrir o checkout."));
    },
  });

  const cancelamentoMutation = useMutation({
    mutationFn: async () => {
      await ensureCsrfToken();
      return cancelarAssinatura();
    },
    onSuccess: (assinatura) => {
      atualizarCache(assinatura);
      toast.success("Assinatura cancelada.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Não foi possível cancelar a assinatura."));
    },
  });

  if (user?.role !== "trabalhador") {
    return <Navigate to="/painel" replace />;
  }

  if (assinaturaQuery.isLoading) {
    return (
      <div className="flex justify-center py-32" aria-label="Carregando assinatura">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (assinaturaQuery.isError || !assinaturaQuery.data) {
    return (
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <Typography as="h1" className="!text-2xl">Não foi possível consultar sua assinatura</Typography>
        <p className="mt-3 text-dark-subtle">Tente novamente em alguns instantes.</p>
        <Button className="mt-6" onClick={() => assinaturaQuery.refetch()}>Tentar novamente</Button>
      </Card>
    );
  }

  const assinatura = assinaturaQuery.data;
  const processando = checkoutMutation.isPending || cancelamentoMutation.isPending;
  const iniciarOuContinuar = assinatura.status === "PENDING"
    ? "Continuar pagamento"
    : "Ativar plano mensal";

  const confirmarCancelamento = () => {
    if (window.confirm("O cancelamento é imediato e seu perfil deixará de receber novos pedidos. Deseja continuar?")) {
      cancelamentoMutation.mutate();
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Plano do profissional
        </span>
        <Typography as="h1" className="mt-4 !text-4xl font-extrabold">
          Sua vitrine ativa no Facilitei
        </Typography>
        <p className="mx-auto mt-3 max-w-2xl text-dark-subtle">
          A mensalidade mantém seu perfil visível para clientes e libera o recebimento e aceite de novos serviços.
        </p>
      </div>

      {!assinatura.cobrancaHabilitada ? (
        <Card className="border-status-pending/40 p-8 text-center">
          <Typography as="h2" className="!text-2xl">Cobrança em configuração</Typography>
          <p className="mt-3 text-dark-subtle">
            O plano ainda não foi habilitado pelo Facilitei. Sua conta continua disponível enquanto isso.
          </p>
          <Link to="/painel"><Button className="mt-6" variant="outline">Voltar ao painel</Button></Link>
        </Card>
      ) : (
        <Card className="overflow-hidden border-accent/30">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Typography as="h2" className="!text-2xl">Plano mensal</Typography>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${assinatura.ativa ? "bg-status-success/15 text-status-success" : "bg-status-pending/15 text-status-pending"}`}>
                  {statusLabels[assinatura.status] ?? assinatura.status}
                </span>
              </div>

              <p className="mt-6 text-3xl font-extrabold text-white">
                {formatarValorMensal(assinatura.valorCentavos)}
                {assinatura.valorCentavos != null && <span className="text-base font-medium text-dark-subtle"> / mês</span>}
              </p>

              <ul className="mt-7 space-y-4 text-sm text-dark-text">
                {["Perfil exibido nas buscas de profissionais", "Recebimento de novas solicitações", "Acesso ao chat e gestão dos serviços"].map((beneficio) => (
                  <li key={beneficio} className="flex items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                    {beneficio}
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-xs leading-relaxed text-dark-subtle">
                O pagamento é concluído no ambiente seguro do Mercado Pago. O Facilitei não recebe nem armazena os dados do seu cartão.
              </p>
            </div>

            <div className="flex flex-col justify-center border-t border-white/10 bg-dark-background/35 p-6 sm:p-10 lg:border-l lg:border-t-0">
              {assinatura.ativa ? (
                <>
                  <p className="text-sm font-semibold text-status-success">Assinatura confirmada</p>
                  <p className="mt-2 text-sm text-dark-subtle">Acesso válido até</p>
                  <p className="mt-1 text-xl font-bold text-white">{formatarValidade(assinatura.ativaAte)}</p>
                  <Button className="mt-8" variant="danger" disabled={processando} onClick={confirmarCancelamento}>
                    {cancelamentoMutation.isPending ? "Cancelando..." : "Cancelar assinatura"}
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-dark-subtle">
                    Você verá o valor e os dados da recorrência antes de confirmar o pagamento.
                  </p>
                  <Button className="mt-6 w-full" size="lg" variant="secondary" disabled={processando} onClick={() => checkoutMutation.mutate()}>
                    {checkoutMutation.isPending ? "Abrindo checkout..." : iniciarOuContinuar}
                  </Button>
                  {assinatura.status === "PENDING" && (
                    <p className="mt-4 text-center text-xs text-status-pending">
                      Aguardando a confirmação do pagamento. Esta tela atualiza automaticamente.
                    </p>
                  )}
                </>
              )}
              <Link to="/painel" className="mt-5 text-center text-sm font-semibold text-primary hover:underline">
                Voltar ao painel
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
