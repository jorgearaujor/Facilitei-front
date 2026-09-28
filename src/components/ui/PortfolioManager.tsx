import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Button } from "./Button";
import { PortfolioGallery } from "./PortfolioGallery";
import {
  addPortfolioImages,
  createPortfolio,
  deletePortfolioImage,
  fetchPortfolio,
} from "../../lib/portfolio";
import { getErrorMessage } from "../../lib/httpError";
import { formatTipoServico, type TipoServico } from "../../types/api";
import { Select } from "./Select";

export function PortfolioManager({
  trabalhadorId,
  servicos,
}: {
  trabalhadorId: string;
  servicos: TipoServico[];
}) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tipoServico, setTipoServico] = useState<TipoServico | "">(
    servicos[0] || "",
  );

  useEffect(() => {
    if (!tipoServico || !servicos.includes(tipoServico)) {
      setTipoServico(servicos[0] || "");
    }
  }, [servicos, tipoServico]);

  const portfolioQuery = useQuery({
    queryKey: ["portfolio", trabalhadorId],
    queryFn: () => fetchPortfolio(trabalhadorId),
  });

  const addMutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (!tipoServico) throw new Error("Selecione a especialidade das fotos.");
      const portfolioId = portfolioQuery.data?.portfolioId;
      return portfolioId
        ? addPortfolioImages(portfolioId, files, tipoServico)
        : createPortfolio(trabalhadorId, files, tipoServico);
    },
    onSuccess: (portfolio) => {
      if (inputRef.current) inputRef.current.value = "";
      queryClient.setQueryData(["portfolio", trabalhadorId], portfolio);
      toast.success("Fotos adicionadas ao portfólio.");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Não foi possível adicionar as fotos.")),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ portfolioId, imageId }: { portfolioId: string; imageId: string }) =>
      deletePortfolioImage(portfolioId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", trabalhadorId] });
      toast.success("Foto removida do portfólio.");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Não foi possível remover a foto.")),
  });

  const handleFiles = (selectedFiles?: FileList | null) => {
    const files = Array.from(selectedFiles || []);
    if (files.length === 0) return;

    if (files.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Selecione apenas arquivos de imagem.");
      return;
    }
    if (files.some((file) => file.size > 10 * 1024 * 1024)) {
      toast.error("Cada imagem deve ter no máximo 10MB.");
      return;
    }

    addMutation.mutate(files);
  };

  const result = portfolioQuery.data;
  const unavailable = result?.available === false;

  return (
    <div className="space-y-5">
      {portfolioQuery.isError && (
        <div className="rounded-xl border border-status-danger/30 bg-status-danger/10 p-4 text-sm text-status-danger">
          Não foi possível carregar o portfólio. Tente novamente.
        </div>
      )}

      {unavailable && (
        <div className="rounded-xl border border-status-pending/30 bg-status-pending/10 p-4 text-sm text-status-pending">
          A API de portfólio não está disponível neste ambiente.
        </div>
      )}

      <PortfolioGallery
        items={result?.items || []}
        isLoading={portfolioQuery.isLoading}
        isAvailable={!unavailable && !portfolioQuery.isError}
        isDeleting={deleteMutation.isPending}
        onDelete={(item) => {
          if (!result?.portfolioId) return;
          deleteMutation.mutate({
            portfolioId: result.portfolioId,
            imageId: item.id,
          });
        }}
      />

      {!unavailable && !portfolioQuery.isError && (
        <div className="rounded-2xl border border-primary/10 bg-dark-background/40 p-4 sm:p-5">
          <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">
                Pasta do serviço
              </label>
              <Select
                value={tipoServico}
                onChange={setTipoServico}
                options={servicos.map((servico) => ({
                  value: servico,
                  label: formatTipoServico(servico),
                }))}
                placeholder="Escolha a especialidade"
                ariaLabel="Especialidade das fotos"
              />
            </div>
          <input
            ref={inputRef}
            id="portfolio-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={addMutation.isPending || !tipoServico}
            onClick={() => inputRef.current?.click()}
          >
            {addMutation.isPending ? "Enviando fotos..." : "Adicionar fotos"}
          </Button>
          </div>
          <p className="mt-2 text-xs text-dark-subtle">
            As fotos selecionadas ficarão juntas nesta pasta. Até 10MB por imagem.
          </p>
        </div>
      )}
    </div>
  );
}
