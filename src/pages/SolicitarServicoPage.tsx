import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "../components/ui/Typography";
import {
  type Trabalhador,
  type TipoServico,
  type CategoriaGrupo,
  type PageResponse,
  formatTipoServico,
  serviceCategories,
  allCategoryGroups,
} from "../types/api";
import { TrabalhadorCard } from "../components/ui/TrabalhadorCard";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { RatingFilter } from "../components/ui/RatingFilter";
import {
  BuildingIcon,
  HomeIcon,
  WrenchIcon,
  LeafIcon,
  BookIcon,
  SparklesIcon,
} from "../components/ui/CategoryIcons";
import { api } from "../lib/api";
import { Select } from "../components/ui/Select";
import { SlidersIcon } from "../components/ui/Icons";

// --- MAP ICONES ---
const categoryIcons: Record<CategoriaGrupo | "TODOS", ReactElement> = {
  TODOS: <SparklesIcon className="w-6 h-6" />,
  "Construção e Reformas": <BuildingIcon className="w-6 h-6" />,
  "Serviços Domésticos": <HomeIcon className="w-6 h-6" />,
  "Serviços Técnicos": <WrenchIcon className="w-6 h-6" />,
  "Jardinagem e Exteriores": <LeafIcon className="w-6 h-6" />,
  "Educação e Aulas": <BookIcon className="w-6 h-6" />,
};

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 350;

interface TrabalhadoresQueryParams {
  page: number;
  nome: string;
  localizacao: string;
  tiposServico: TipoServico[];
  notaMinima: number;
}

const fetchTrabalhadores = async ({
  page,
  nome,
  localizacao,
  tiposServico,
  notaMinima,
}: TrabalhadoresQueryParams): Promise<PageResponse<Trabalhador>> => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(PAGE_SIZE),
    notaMinima: String(notaMinima),
  });

  if (nome) params.set("nome", nome);
  if (localizacao) params.set("localizacao", localizacao);
  tiposServico.forEach((tipo) => params.append("tiposServico", tipo));

  const { data } = await api.get<PageResponse<Trabalhador>>(
    "/trabalhadores/listar/paginado",
    { params },
  );
  return data;
};

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

const getServicoEmDestaque = (
  trabalhador: Trabalhador,
  selectedGroup: CategoriaGrupo | "TODOS",
  selectedService: string,
): TipoServico | undefined => {
  if (selectedService !== "TODOS") return selectedService as TipoServico;
  if (selectedGroup === "TODOS") {
    return (
      trabalhador.avaliacoesPorServico
        ?.filter((resumo) => trabalhador.servicos?.includes(resumo.tipoServico))
        .sort((a, b) => b.media - a.media)[0]?.tipoServico ??
      trabalhador.servicoPrincipal
    );
  }

  const servicosDoGrupo = serviceCategories[selectedGroup].filter((servico) =>
    trabalhador.servicos?.includes(servico),
  );

  return servicosDoGrupo.sort((primeiro, segundo) => {
    const notaPrimeiro =
      trabalhador.avaliacoesPorServico?.find(
        (resumo) => resumo.tipoServico === primeiro,
      )?.media || 0;
    const notaSegundo =
      trabalhador.avaliacoesPorServico?.find(
        (resumo) => resumo.tipoServico === segundo,
      )?.media || 0;
    return notaSegundo - notaPrimeiro;
  })[0];
};

export function SolicitarServicoPage() {
  const [selectedGroup, setSelectedGroup] = useState<CategoriaGrupo | "TODOS">(
    "TODOS",
  );
  const [selectedService, setSelectedService] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [locationTerm, setLocationTerm] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebouncedValue(
    searchTerm.trim(),
    SEARCH_DEBOUNCE_MS,
  );
  const debouncedLocationTerm = useDebouncedValue(
    locationTerm.trim(),
    SEARCH_DEBOUNCE_MS,
  );

  const selectedServiceTypes = useMemo<TipoServico[]>(() => {
    if (selectedService !== "TODOS") {
      return [selectedService as TipoServico];
    }
    if (selectedGroup !== "TODOS") {
      return serviceCategories[selectedGroup];
    }
    return [];
  }, [selectedGroup, selectedService]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "allTrabalhadores",
      debouncedSearchTerm,
      debouncedLocationTerm,
      selectedServiceTypes,
      minRating,
    ],
    queryFn: ({ pageParam }) =>
      fetchTrabalhadores({
        page: pageParam,
        nome: debouncedSearchTerm,
        localizacao: debouncedLocationTerm,
        tiposServico: selectedServiceTypes,
        notaMinima: minRating,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
  });

  const trabalhadores = useMemo(
    () => data?.pages.flatMap((page) => page.content) ?? [],
    [data],
  );
  const totalTrabalhadores = data?.pages[0]?.totalElements ?? 0;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const availableServices = useMemo(() => {
    if (selectedGroup === "TODOS") return [];
    return serviceCategories[selectedGroup];
  }, [selectedGroup]);

  return (
    <div className="flex min-h-[80vh] flex-col gap-6 lg:flex-row lg:gap-8">
      {/* --- SIDEBAR DE FILTROS (Mobile: Topo, Desktop: Esquerda) --- */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full flex-shrink-0 space-y-4 lg:w-80 lg:space-y-6"
      >
        <Card className="border-primary/20 bg-dark-surface/90 p-4 sm:p-5 lg:sticky lg:top-24 lg:p-6">
          <div className="mb-4 lg:mb-6">
            <Typography
              as="h3"
              className="mb-3 flex items-center gap-2 !text-lg font-bold text-white sm:!text-xl lg:mb-4"
            >
              <SparklesIcon className="w-5 h-5 text-accent" /> Categorias
            </Typography>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-1 lg:overflow-visible lg:px-0 lg:pb-0">
              {["TODOS", ...allCategoryGroups].map((group) => {
                const isActive = selectedGroup === group;
                return (
                  <button
                    key={group}
                    onClick={() => {
                      setSelectedGroup(group as never);
                      setSelectedService("TODOS");
                    }}
                    className={`
                      flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all lg:w-full lg:rounded-xl lg:py-3
                      ${
                        isActive
                          ? "bg-accent text-on-accent shadow-glow-accent font-bold"
                          : "text-dark-subtle hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    {categoryIcons[group as CategoriaGrupo | "TODOS"]}
                    <span className="truncate">{group}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-4">
            <Input
              label="Buscar Nome"
              name="search"
              placeholder="Ex: João Silva"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowMoreFilters((visible) => !visible)}
              aria-expanded={showMoreFilters}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/20 text-sm font-bold text-primary lg:hidden"
            >
              <SlidersIcon className="h-5 w-5" />
              {showMoreFilters ? "Ocultar filtros" : "Local e avaliação"}
            </button>

            <div
              className={`${showMoreFilters ? "space-y-4" : "hidden"} lg:block lg:space-y-4`}
            >
              <Input
                label="Cidade/UF"
                name="location"
                placeholder="Ex: São Paulo"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
              />

              {selectedGroup !== "TODOS" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    Especialidade
                  </label>
                  <Select
                    value={selectedService}
                    onChange={setSelectedService}
                    options={[
                      { value: "TODOS", label: "Todas" },
                      ...availableServices.map((servico) => ({
                        value: servico,
                        label: formatTipoServico(servico),
                      })),
                    ]}
                    ariaLabel="Especialidade"
                  />
                </div>
              )}

              <div className="pt-2">
                <label className="block text-sm font-medium text-primary mb-2">
                  {selectedService === "TODOS"
                    ? selectedGroup === "TODOS"
                      ? "Avaliação geral mínima"
                      : "Melhor avaliação no grupo"
                    : `Avaliação mínima em ${formatTipoServico(
                        selectedService as TipoServico,
                      )}`}
                </label>
                <RatingFilter
                  rating={minRating}
                  onRatingChange={setMinRating}
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.aside>

      {/* --- GRID DE RESULTADOS --- */}
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-wrap items-end justify-between gap-2 sm:mb-6"
        >
          <Typography
            as="h2"
            className="!text-xl font-bold min-[380px]:!text-2xl sm:!text-3xl"
          >
            Profissionais Disponíveis{" "}
            <span className="text-accent">({totalTrabalhadores})</span>
          </Typography>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error && !data ? (
          <Card className="border-status-danger/30 py-12 text-center">
            <Typography as="p" className="text-lg text-dark-subtle">
              Não foi possível carregar os profissionais.
            </Typography>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 font-semibold text-accent hover:underline"
            >
              Tentar novamente
            </button>
          </Card>
        ) : (
          <AnimatePresence mode="popLayout">
            <div>
              <motion.div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                {trabalhadores.length > 0 ? (
                  trabalhadores.map((trabalhador) => (
                    <TrabalhadorCard
                      key={trabalhador.id}
                      trabalhador={trabalhador}
                      tipoServico={getServicoEmDestaque(
                        trabalhador,
                        selectedGroup,
                        selectedService,
                      )}
                    />
                  ))
                ) : (
                  <motion.div className="col-span-full py-12 text-center bg-dark-surface/30 rounded-xl border border-dashed border-white/10">
                    <Typography as="p" className="text-xl text-dark-subtle">
                      Nenhum profissional encontrado para essa busca.
                    </Typography>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedGroup("TODOS");
                        setSelectedService("TODOS");
                        setLocationTerm("");
                        setMinRating(0);
                      }}
                      className="mt-4 text-accent hover:underline"
                    >
                      Limpar filtros
                    </button>
                  </motion.div>
                )}
              </motion.div>

              {hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="flex flex-col items-center gap-3 py-8"
                >
                  <button
                    type="button"
                    onClick={() => void fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="min-h-11 rounded-lg border border-accent/40 px-6 py-3 font-semibold text-accent transition-colors hover:bg-accent/10 disabled:cursor-wait disabled:opacity-60"
                  >
                    {isFetchingNextPage
                      ? "Carregando profissionais..."
                      : "Carregar mais"}
                  </button>
                </div>
              )}

              {isFetchNextPageError && (
                <div className="pb-8 text-center" role="alert">
                  <p className="text-sm text-status-danger">
                    Não foi possível carregar mais profissionais.
                  </p>
                  <button
                    type="button"
                    onClick={() => void fetchNextPage()}
                    className="mt-2 font-semibold text-accent hover:underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              )}

              {!hasNextPage && trabalhadores.length > 0 && (
                <p className="py-8 text-center text-sm text-dark-subtle">
                  Você chegou ao fim dos resultados.
                </p>
              )}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
