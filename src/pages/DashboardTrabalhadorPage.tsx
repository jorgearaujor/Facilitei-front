import { useState, useMemo } from "react"; // Importar useMemo
import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import type {
  Servico,
  Trabalhador,
  Cliente,
  AvaliacaoCliente,
} from "../types/api";
import {
  BellIcon,
  BoltIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CheckIcon,
} from "../components/ui/Icons";
import { AvaliacaoClienteModal } from "../components/ui/AvaliacaoClienteModal";
import { get, post, patch, put } from "../lib/api";
import { toast } from "react-hot-toast";
import { getClienteCached } from "../lib/entityQueries";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Avatar } from "../components/ui/Avatar";
import { terminalServiceStatuses } from "../lib/serviceStatus";
import { getErrorMessage } from "../lib/httpError";
import {
  assinaturaQueryKey,
  consultarAssinatura,
} from "../lib/assinatura";

// Interface para Solicitação
interface SolicitacaoServico {
  id: string;
  clienteId: string;
  trabalhadorId: string;
  tipoServico: string;
  servicoId?: string | null;
  descricao: string;
  status: "PENDENTE" | "ACEITA" | "RECUSADA";
  cliente?: Cliente;
}

interface WorkerData {
  newRequests: SolicitacaoServico[];
  activeServices: (Servico & { cliente: Cliente })[];
  finishedServices: (Servico & { cliente: Cliente })[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fetchWorkerData = async (
  workerId: string,
  queryClient: QueryClient,
): Promise<WorkerData> => {
  const allServices = await get<Servico[]>(
    `/servicos?trabalhadorId=${workerId}`
  );
  const activeServices = allServices.filter(
    (service) => !terminalServiceStatuses.includes(service.statusServico),
  );
  const finishedServices = allServices.filter(
    (service) => terminalServiceStatuses.includes(service.statusServico),
  );
  const allSolicitations = await get<SolicitacaoServico[]>(
    "/solicitacoes-servico"
  );
  const myNewRequests = allSolicitations.filter(
    (sol) =>
      String(sol.trabalhadorId) === String(workerId) &&
      sol.status === "PENDENTE"
  );

  const hydrateCliente = async <T extends { clienteId: string }>(item: T) => {
    const cliente = await getClienteCached(queryClient, item.clienteId);
    return { ...item, cliente };
  };

  return {
    newRequests: await Promise.all(myNewRequests.map(hydrateCliente)),
    activeServices: await Promise.all(activeServices.map(hydrateCliente)),
    finishedServices: await Promise.all(finishedServices.map(hydrateCliente)),
  };
};

// Função para buscar avaliações já feitas pelo trabalhador
const fetchAvaliacoesFeitas = async (
  workerId: string
): Promise<AvaliacaoCliente[]> => {
  try {
    return await get<AvaliacaoCliente[]>(
      `/avaliacoes-cliente/trabalhador/${workerId}`
    );
  } catch {
    return [];
  }
};

export function DashboardTrabalhadorPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const trabalhador = user as Trabalhador;
  const [reviewingClientService, setReviewingClientService] =
    useState<Servico | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const { data: assinatura } = useQuery({
    queryKey: assinaturaQueryKey,
    queryFn: consultarAssinatura,
    enabled: !!trabalhador.id,
    refetchOnWindowFocus: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["workerData", trabalhador.id],
    queryFn: () => fetchWorkerData(trabalhador.id, queryClient),
    enabled: !!trabalhador.id,
    refetchInterval: 5000,
  });

  // Query para saber quais serviços eu já avaliei
  const { data: avaliacoesFeitas } = useQuery({
    queryKey: ["avaliacoesClienteFeitas", trabalhador.id],
    queryFn: () => fetchAvaliacoesFeitas(trabalhador.id),
    enabled: !!trabalhador.id,
  });

  // Cria um Set com os IDs dos serviços já avaliados para busca rápida O(1)
  const reviewedClientServiceIds = useMemo(() => {
    return new Set(avaliacoesFeitas?.map((av) => String(av.servicoId)));
  }, [avaliacoesFeitas]);

  // --- Handlers ---
  const handleAccept = async (solicitacao: SolicitacaoServico) => {
    if (assinatura?.cobrancaHabilitada && !assinatura.ativa) {
      toast.error("Ative sua assinatura para aceitar novos serviços.");
      navigate("/painel/assinatura");
      return;
    }
    setIsMutating(true);
    try {
      await post<Servico>("/servicos", {
        titulo: `Serviço: ${solicitacao.tipoServico.replace(/_/g, " ")}`,
        descricao: solicitacao.descricao,
        trabalhadorId: Number(solicitacao.trabalhadorId),
        clienteId: Number(solicitacao.clienteId),
        solicitacaoId: Number(solicitacao.id),
        tipoServico: solicitacao.tipoServico,
        statusServico: "EM_ANDAMENTO",
      });
      toast.success("Serviço aceito! O chat foi liberado.");
      queryClient.invalidateQueries({ queryKey: ["workerData"] });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao aceitar serviço."));
    } finally {
      setIsMutating(false);
    }
  };

  const handleReject = async (solicitacao: SolicitacaoServico) => {
    setIsMutating(true);
    try {
      await patch(`/solicitacoes-servico/${solicitacao.id}`, {
        ...solicitacao,
        statusSolicitacao: "RECUSADA",
      });
      toast.success("Solicitação recusada.");
      queryClient.invalidateQueries({ queryKey: ["workerData"] });
    } catch {
      toast.error("Erro ao recusar.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleRequestFinish = async (servico: Servico) => {
    setIsMutating(true);
    try {
      await put(`/servicos/${servico.id}`, {
        ...servico,
        statusServico: "PENDENTE_APROVACAO",
      });
      toast.success("Finalização solicitada ao cliente!");
      queryClient.invalidateQueries({ queryKey: ["workerData"] });
    } catch {
      toast.error("Erro ao finalizar.");
    } finally {
      setIsMutating(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const newRequestsCount = data?.newRequests.length || 0;
  const activeServicesCount = data?.activeServices.length || 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8 lg:space-y-10"
    >
      {assinatura?.cobrancaHabilitada && !assinatura.ativa && (
        <motion.div variants={itemVariants}>
          <Card className="flex flex-col gap-5 border-status-pending/40 bg-status-pending/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-status-pending">
                Assinatura necessária
              </p>
              <Typography as="h2" className="mt-1 !text-xl">
                Ative seu plano para aparecer nas buscas e aceitar novos serviços
              </Typography>
              <p className="mt-2 text-sm text-dark-subtle">
                O pagamento mensal é processado com segurança pelo Mercado Pago.
              </p>
            </div>
            <Button className="shrink-0" variant="secondary" onClick={() => navigate("/painel/assinatura") }>
              Ver assinatura
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Header e KPIs omitidos para brevidade, mantidos iguais */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row">
        <motion.div variants={itemVariants} className="flex-1">
          <Card className="relative h-full overflow-hidden border-l-4 border-l-accent bg-gradient-to-br from-dark-surface to-dark-surface_hover p-5 sm:p-8">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BriefcaseIcon className="w-32 h-32 text-accent" />
            </div>
            <Typography as="h1" className="!text-3xl font-extrabold mb-1">
              Painel do Profissional
            </Typography>
            <p className="text-dark-subtle">
              Gerencie seus ganhos e reputação.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
                <span className="text-xs text-accent font-bold uppercase">
                  Nota Atual
                </span>
                <p className="text-2xl font-bold text-white">
                  {trabalhador.notaTrabalhador?.toFixed(1) || "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 w-full lg:w-1/3"
        >
          <Card className="flex-1 p-5 flex items-center justify-between bg-dark-surface/50 backdrop-blur-md border-primary/20">
            <div>
              <p className="text-dark-subtle text-sm">Novas Solicitações</p>
              <p className="text-2xl font-bold text-white">
                {newRequestsCount}
              </p>
            </div>
            <div
              className={`p-3 rounded-full ${
                newRequestsCount > 0
                  ? "bg-accent text-on-accent animate-pulse"
                  : "bg-dark-surface text-dark-subtle"
              }`}
            >
              <BellIcon className="w-6 h-6" />
            </div>
          </Card>
          <Card className="flex-1 p-5 flex items-center justify-between bg-dark-surface/50 backdrop-blur-md border-primary/20">
            <div>
              <p className="text-dark-subtle text-sm">Em Andamento</p>
              <p className="text-2xl font-bold text-white">
                {activeServicesCount}
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary/20 text-primary">
              <CalendarDaysIcon className="w-6 h-6" />
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Solicitações */}
        <section className="lg:col-span-2 space-y-6">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 border-b border-white/10 pb-2"
          >
            <BoltIcon className="h-5 w-5 text-accent" />
            <Typography as="h2" className="!text-2xl">
              Solicitações Pendentes
            </Typography>
          </motion.div>
          <LayoutGroup>
            <motion.div className="space-y-4">
              {data?.newRequests.length ? (
                data.newRequests.map((sol) => (
                  <Card
                    key={sol.id}
                    variants={itemVariants}
                    layout
                    className="border-2 border-transparent p-4 shadow-lg transition-colors hover:border-accent/30 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex min-w-0 gap-3 sm:gap-4">
                        <Avatar src={sol.cliente?.avatarUrl} name={sol.cliente?.nome}
                          className="w-14 h-14 rounded-full border-2 border-dark-subtle/30" />
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-white">
                            {sol.cliente?.nome}
                          </h3>
                          <p className="text-primary text-sm font-medium uppercase tracking-wide">
                            {sol.tipoServico.replace(/_/g, " ")}
                          </p>
                          <p className="text-dark-subtle mt-2 text-sm italic bg-dark-background/40 p-2 rounded">
                            "{sol.descricao}"
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:min-w-[140px]">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAccept(sol)}
                          disabled={isMutating || (assinatura?.cobrancaHabilitada && !assinatura.ativa)}
                          className="w-full shadow-glow-accent"
                        >
                          Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(sol)}
                          disabled={isMutating}
                          className="w-full !text-status-danger !border-status-danger hover:bg-status-danger/10"
                        >
                          Recusar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 opacity-50 border-2 border-dashed border-white/10 rounded-xl">
                  <p>Tudo tranquilo por aqui.</p>
                </div>
              )}
            </motion.div>
          </LayoutGroup>
        </section>

        {/* Serviços Ativos */}
        <aside className="lg:col-span-1 space-y-6">
          <motion.div
            variants={itemVariants}
            className="border-b border-white/10 pb-2"
          >
            <Typography as="h2" className="!text-2xl">
              Em Execução
            </Typography>
          </motion.div>
          <div className="space-y-4">
            {data?.activeServices.length ? (
              data.activeServices.map((servico) => (
                <Card
                  key={servico.id}
                  variants={itemVariants}
                  className={`p-4 relative overflow-hidden ${
                    servico.statusServico === "PENDENTE_APROVACAO"
                      ? "border-status-pending"
                      : "border-primary/40"
                  }`}
                >
                  {servico.statusServico === "PENDENTE_APROVACAO" && (
                    <div className="absolute top-0 right-0 bg-status-pending text-slate-950 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                      AGUARDANDO CLIENTE
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={servico.cliente?.avatarUrl} name={servico.cliente?.nome}
                      className="w-10 h-10 rounded-full" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-white truncate">
                        {servico.cliente?.nome}
                      </p>
                      <p className="text-xs text-dark-subtle truncate">
                        {servico.titulo}
                      </p>
                      <div className="mt-2">
                        <StatusBadge status={servico.statusServico} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/painel/chat/${servico.id}`)}
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4" /> Chat
                    </Button>
                    {servico.statusServico === "EM_ANDAMENTO" ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleRequestFinish(servico)}
                        disabled={isMutating}
                      >
                        <CheckIcon className="w-4 h-4 mr-1" /> Concluir
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled
                        variant="outline"
                        className="opacity-50"
                      >
                        Concluir
                      </Button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/painel/suporte?novo=disputa&servicoId=${servico.id}`)
                    }
                    className="mt-3 text-xs font-semibold text-dark-subtle transition hover:text-primary"
                  >
                    Precisa de ajuda? Abrir disputa
                  </button>
                </Card>
              ))
            ) : (
              <p className="text-sm text-dark-subtle">Sem serviços ativos.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Histórico - AQUI ESTAVA O PROBLEMA */}
      {data?.finishedServices && data.finishedServices.length > 0 && (
        <section className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="border-t border-white/10 pt-8"
          >
            <Typography as="h2" className="!text-2xl">
              <CheckCircleIcon className="h-6 w-6 text-primary" /> Histórico
            </Typography>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {data.finishedServices.map((servico) => {
              // Verifica se já avaliou usando o Set
              const isReviewed = reviewedClientServiceIds.has(
                String(servico.id)
              );
              return (
                <Card
                  key={servico.id}
                  variants={itemVariants}
                  className={`p-5 transition-opacity ${
                    isReviewed
                      ? "opacity-60 border-white/5"
                      : "border-accent/30 hover:border-accent"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar src={servico.cliente?.avatarUrl} name={servico.cliente?.nome}
                        className="w-10 h-10 rounded-full" />
                      <div>
                        <Typography as="h3" className="!text-lg">
                          {servico.titulo}
                        </Typography>
                        <StatusBadge status={servico.statusServico} />
                      </div>
                    </div>
                    {servico.statusServico !== "FINALIZADO" ? null : isReviewed ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="opacity-50 cursor-not-allowed border-none text-accent"
                      >
                        <CheckIcon className="w-4 h-4 mr-1" /> Avaliado
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setReviewingClientService(servico)}
                      >
                        Avaliar
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <AnimatePresence>
        {reviewingClientService && (
          <AvaliacaoClienteModal
            servico={reviewingClientService}
            onClose={() => setReviewingClientService(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
