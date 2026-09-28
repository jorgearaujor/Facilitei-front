import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import {
  formatTipoServico,
  type AvaliacaoServico,
  type Trabalhador,
  type TipoServico,
} from "../types/api";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Modal } from "../components/ui/Modal";
import { Textarea } from "../components/ui/Textarea";
import { toast } from "react-hot-toast";
import { get, post } from "../lib/api";
import {
  ArrowRightIcon,
  CameraIcon,
  CogIcon,
  DocumentTextIcon,
  StarIcon,
  WrenchScrewdriverIcon,
} from "../components/ui/Icons";
import { Rating } from "../components/ui/Rating";
import { Avatar } from "../components/ui/Avatar";
import { PortfolioGallery } from "../components/ui/PortfolioGallery";
import { fetchPortfolio } from "../lib/portfolio";
import { getErrorMessage } from "../lib/httpError";
import { Select } from "../components/ui/Select";

type SolicitacaoRequest = {
  clienteId: string;
  trabalhadorId: string;
  tipoServico: TipoServico;
  descricao: string;
  statusSolicitacao: "PENDENTE";
};

const fetchTrabalhadorById = async (id: string): Promise<Trabalhador> =>
  get<Trabalhador>(`/trabalhadores/buscarPorId/${id}`);
const fetchAvaliacoesTrabalhador = async (
  workerId: string,
): Promise<AvaliacaoServico[]> => {
  try {
    return await get<AvaliacaoServico[]>(
      `/avaliacoes-servico/trabalhador/${workerId}`,
    );
  } catch {
    return [];
  }
};

type TrabalhadorProfilePageProps = {
  profileId?: string;
};

export function TrabalhadorProfilePage({
  profileId,
}: TrabalhadorProfilePageProps = {}) {
  const { id } = useParams<{ id: string }>();
  const trabalhadorId = profileId || id || "0";
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isOwner = user?.id === trabalhadorId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [selectedServico, setSelectedServico] = useState<TipoServico | "">("");
  const [filtroAvaliacao, setFiltroAvaliacao] = useState<
    TipoServico | "TODOS"
  >("TODOS");

  const {
    data: trabalhador,
    isLoading: isLoadingTrabalhador,
    isError,
  } = useQuery<Trabalhador>({
    queryKey: ["trabalhador", trabalhadorId],
    queryFn: () => fetchTrabalhadorById(trabalhadorId),
    enabled: trabalhadorId !== "0",
  });

  const { data: avaliacoes, isLoading: isLoadingAvaliacoes } = useQuery({
    queryKey: ["avaliacoesTrabalhador", trabalhador?.id],
    queryFn: () => fetchAvaliacoesTrabalhador(trabalhador!.id),
    enabled: !!trabalhador,
  });

  const { data: portfolio, isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ["portfolio", trabalhadorId],
    queryFn: () => fetchPortfolio(trabalhadorId),
    enabled: !!trabalhador,
  });

  useEffect(() => {
    if (trabalhador) setSelectedServico(trabalhador.servicoPrincipal);
  }, [trabalhador]);

  const avaliacoesFiltradas = useMemo(
    () =>
      (avaliacoes || []).filter(
        (avaliacao) =>
          filtroAvaliacao === "TODOS" ||
          avaliacao.tipoServico === filtroAvaliacao,
      ),
    [avaliacoes, filtroAvaliacao],
  );

  const mutationCreateSolicitacao = useMutation({
    mutationFn: async (data: SolicitacaoRequest) =>
      post("/solicitacoes-servico", data),
    onSuccess: () => {
      toast.success("Solicitação enviada! Aguarde o aceite.");
      setIsModalOpen(false);
      setDescricao("");
    },
    onError: (error: unknown) =>
      toast.error(getErrorMessage(error, "Erro ao enviar.")),
  });

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      toast("Faça login para contratar.");
      navigate(`/login?redirectTo=${location.pathname}`);
      return;
    }
    if (user?.role !== "cliente") {
      toast.error("Apenas clientes podem solicitar serviços.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitRequest = () => {
    if (!selectedServico) return toast.error("Selecione um serviço.");
    if (descricao.length < 10)
      return toast.error("Descreva melhor (mín. 10 caracteres).");
    mutationCreateSolicitacao.mutate({
      clienteId: user!.id,
      trabalhadorId,
      tipoServico: selectedServico,
      descricao,
      statusSolicitacao: "PENDENTE",
    });
  };

  if (isError || (!isLoadingTrabalhador && !trabalhador))
    return (
      <div className="text-center py-32 text-red-500">Perfil Indisponível</div>
    );
  if (isLoadingTrabalhador)
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <>
      {/* HERO BANNER (Fundo do Perfil) */}
      <div className="relative h-64 w-full rounded-b-[3rem] bg-gradient-to-r from-dark-surface to-primary/20 overflow-hidden mb-20">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark-background to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUNA DA ESQUERDA (Info Principal) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="relative flex flex-col items-center overflow-visible border-t-4 border-t-accent p-5 text-center sm:p-8">
              <div className="relative -mt-20 mb-4">
                <Avatar src={trabalhador!.avatarUrl} name={trabalhador!.nome}
                  className="w-40 h-40 rounded-full border-4 border-dark-background shadow-2xl" />
                <div
                  className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-dark-surface"
                  title="Disponível"
                ></div>
              </div>

              <h1 className="text-3xl font-extrabold text-white mb-1">
                {trabalhador!.nome}
              </h1>
              <p className="text-accent font-semibold uppercase tracking-wider text-sm mb-4">
                {trabalhador!.servicoPrincipal.replace(/_/g, " ")}
              </p>

              <Rating score={trabalhador!.notaTrabalhador} />
              <span className="text-sm text-dark-subtle mt-1 mb-6">
                Média geral: {trabalhador!.notaTrabalhador.toFixed(1)} de 5.0
              </span>

              <div className="w-full space-y-3 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-subtle">Cidade</span>
                  <span className="font-medium text-white">
                    {trabalhador!.endereco?.cidade}/
                    {trabalhador!.endereco?.estado}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-subtle">Disponibilidade</span>
                  <span className="font-medium text-white">
                    {trabalhador!.disponibilidade}
                  </span>
                </div>
              </div>

             {isOwner ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mt-8 border-white/20 hover:bg-white/5 text-white"
                  onClick={() => navigate("/painel/configuracoes")}
                >
                  <CogIcon className="w-5 h-5 mr-2" /> Editar Perfil
                </Button>
              ) : (
                user?.role !== "trabalhador" && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full mt-8 shadow-glow-accent font-bold text-lg"
                    onClick={handleOpenModal}
                  >
                    Contratar agora <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                )
              )}
              {isAuthenticated && !isOwner && (
                <button
                  type="button"
                  onClick={() => navigate(`/painel/suporte?novo=denuncia&usuarioId=${trabalhadorId}`)}
                  className="mt-4 w-full text-center text-xs font-bold text-dark-subtle transition hover:text-status-danger"
                >
                  Denunciar este perfil
                </button>
              )}
            </Card>
          </motion.div>

          {/* COLUNA DA DIREITA (Detalhes) */}
          <div className="lg:col-span-2 space-y-8 pt-12 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-dark-surface/40 p-5 backdrop-blur-sm sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-primary" />
                  </div>
                  <Typography as="h3" className="!text-xl">
                    Sobre o Profissional
                  </Typography>
                </div>
                <p className="text-dark-text/90 leading-relaxed text-lg">
                  {trabalhador!.sobre ||
                    `Olá! Sou ${
                      trabalhador!.nome
                    }, especialista em ${trabalhador!.servicoPrincipal
                      .replace(/_/g, " ")
                      .toLowerCase()}. Estou pronto para resolver seu problema com qualidade e dedicação.`}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-accent" />
                  </div>
                  <Typography as="h3" className="!text-xl">
                    Habilidades
                  </Typography>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {trabalhador!.servicos.map((servico) => {
                    const resumo = trabalhador!.avaliacoesPorServico?.find(
                      (item) => item.tipoServico === servico,
                    );

                    return (
                      <div
                        key={servico}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-dark-background px-4 py-3"
                      >
                        <span className="text-sm font-medium text-white">
                          {formatTipoServico(servico)}
                        </span>
                        {resumo ? (
                          <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-accent">
                            <StarIcon className="h-4 w-4" />
                            {resumo.media.toFixed(1)}
                            <span className="ml-1 font-normal text-dark-subtle">
                              ({resumo.quantidadeAvaliacoes})
                            </span>
                          </span>
                        ) : (
                          <span className="shrink-0 text-xs text-dark-subtle">
                            Sem nota
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-5 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <CameraIcon className="h-6 w-6 text-primary" />
                  </div>
                  <Typography as="h3" className="!text-xl">
                    Portfólio
                  </Typography>
                </div>
                <PortfolioGallery
                  items={portfolio?.items || []}
                  isLoading={isLoadingPortfolio}
                  isAvailable={portfolio?.available !== false}
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-5 sm:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-500/10 p-2">
                      <StarIcon className="h-6 w-6 text-yellow-500" />
                    </div>
                    <Typography as="h3" className="!text-xl">
                      Avaliações ({avaliacoesFiltradas.length})
                    </Typography>
                  </div>
                  <Select
                    value={filtroAvaliacao}
                    onChange={setFiltroAvaliacao}
                    options={[
                      { value: "TODOS", label: "Todas as especialidades" },
                      ...trabalhador!.servicos.map((servico) => ({
                        value: servico,
                        label: formatTipoServico(servico),
                      })),
                    ]}
                    className="w-full sm:w-64"
                    ariaLabel="Filtrar avaliações por especialidade"
                  />
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingAvaliacoes ? (
                    <p className="text-center py-4">Carregando...</p>
                  ) : avaliacoesFiltradas.length > 0 ? (
                    avaliacoesFiltradas.map((av) => (
                      <div
                        key={av.id}
                        className="bg-dark-background/50 p-4 rounded-xl border border-white/5"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-white">
                            {av.clienteNome || "Cliente"}
                          </span>
                          <Rating score={av.nota} />
                        </div>
                        <div className="mb-2 inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          {av.tipoServico
                            ? formatTipoServico(av.tipoServico)
                            : "Serviço avaliado"}
                        </div>
                        <p className="text-dark-subtle italic">
                          "{av.comentario}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-dark-subtle text-center py-4">
                      Nenhuma avaliação nesta especialidade.
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Solicitar Serviço`}
      >
        <div className="space-y-5">
          <p className="text-sm text-dark-subtle">
            Você está contratando{" "}
            <span className="text-white font-bold">{trabalhador!.nome}</span>.
          </p>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Tipo de Serviço
            </label>
            <Select
              value={selectedServico}
              onChange={setSelectedServico}
              options={trabalhador!.servicos.map((servico) => ({
                value: servico,
                label: formatTipoServico(servico),
              }))}
              ariaLabel="Tipo de serviço"
            />
          </div>

          <Textarea
            name="descricao"
            label="Descreva o que precisa"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Preciso instalar 2 ares-condicionados no quarto e sala..."
          />

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSubmitRequest}
              disabled={mutationCreateSolicitacao.isPending}
            >
              {mutationCreateSolicitacao.isPending
                ? "Enviando..."
                : "Confirmar Pedido"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
