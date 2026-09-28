import type { AssinaturaPrestador } from "../types/api";
import { api } from "./api";

export const assinaturaQueryKey = ["assinatura-prestador"] as const;

export async function consultarAssinatura(): Promise<AssinaturaPrestador> {
  const { data } = await api.get<AssinaturaPrestador>(
    "/assinaturas/prestador",
  );
  return data;
}

export async function iniciarCheckout(): Promise<AssinaturaPrestador> {
  const { data } = await api.post<AssinaturaPrestador>(
    "/assinaturas/prestador/checkout",
  );
  return data;
}

export async function cancelarAssinatura(): Promise<AssinaturaPrestador> {
  const { data } = await api.post<AssinaturaPrestador>(
    "/assinaturas/prestador/cancelar",
  );
  return data;
}

export function formatarValorMensal(valorCentavos: number | null): string {
  if (valorCentavos == null) return "Valor exibido no checkout";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorCentavos / 100);
}

export function formatarValidade(data: string | null): string {
  if (!data) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(data));
}
