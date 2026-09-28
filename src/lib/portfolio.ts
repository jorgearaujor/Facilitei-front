import axios from "axios";
import type { PortfolioItem, TipoServico } from "../types/api";
import { api, del, get } from "./api";

type PortfolioApiResponse = {
  id: number | string;
  trabalhadorId: number | string;
  imagens?: Array<{
    id: number | string;
    url: string;
    tipoServico?: TipoServico | null;
  }>;
};

export type PortfolioResult = {
  available: boolean;
  portfolioId: string | null;
  items: PortfolioItem[];
};

const normalizePortfolio = (data: PortfolioApiResponse): PortfolioResult => ({
  available: true,
  portfolioId: String(data.id),
  items: (data.imagens || []).map((imagem) => ({
    id: String(imagem.id),
    trabalhadorId: String(data.trabalhadorId),
    url: imagem.url,
    tipoServico: imagem.tipoServico || undefined,
  })),
});

const createFormData = (
  files: File[],
  tipoServico: TipoServico,
  trabalhadorId?: string,
) => {
  const formData = new FormData();
  if (trabalhadorId) formData.append("trabalhadorId", trabalhadorId);
  formData.append("tipoServico", tipoServico);
  files.forEach((file) => formData.append("imagens", file));
  return formData;
};

export async function fetchPortfolio(
  trabalhadorId: string,
): Promise<PortfolioResult> {
  try {
    const data = await get<PortfolioApiResponse>(
      `/portfolios/trabalhador/${trabalhadorId}`,
    );
    return normalizePortfolio(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { available: true, portfolioId: null, items: [] };
    }
    if (axios.isAxiosError(error) && error.response?.status === 405) {
      return { available: false, portfolioId: null, items: [] };
    }
    throw error;
  }
}

export async function createPortfolio(
  trabalhadorId: string,
  files: File[],
  tipoServico: TipoServico,
): Promise<PortfolioResult> {
  const { data } = await api.post<PortfolioApiResponse>(
    "/portfolios",
    createFormData(files, tipoServico, trabalhadorId),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return normalizePortfolio(data);
}

export async function addPortfolioImages(
  portfolioId: string,
  files: File[],
  tipoServico: TipoServico,
): Promise<PortfolioResult> {
  const { data } = await api.post<PortfolioApiResponse>(
    `/portfolios/${portfolioId}/imagens`,
    createFormData(files, tipoServico),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return normalizePortfolio(data);
}

export const deletePortfolioImage = (
  portfolioId: string,
  imageId: string,
) => del<void>(`/portfolios/${portfolioId}/imagens/${imageId}`);
