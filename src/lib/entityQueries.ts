import type { QueryClient } from "@tanstack/react-query";
import type { Cliente, Trabalhador } from "../types/api";
import { get } from "./api";

const ENTITY_STALE_TIME = 5 * 60 * 1000;

export const getClienteCached = (queryClient: QueryClient, id: string) =>
  queryClient.fetchQuery({
    queryKey: ["cliente", String(id)],
    queryFn: () => get<Cliente>(`/clientes/id/${id}`),
    staleTime: ENTITY_STALE_TIME,
  });

export const getTrabalhadorCached = (queryClient: QueryClient, id: string) =>
  queryClient.fetchQuery({
    queryKey: ["trabalhador", String(id)],
    queryFn: () => get<Trabalhador>(`/trabalhadores/buscarPorId/${id}`),
    staleTime: ENTITY_STALE_TIME,
  });
