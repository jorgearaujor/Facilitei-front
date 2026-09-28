import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api, ensureCsrfToken, uploadFile } from "../../lib/api";
import { getErrorMessage } from "../../lib/httpError";
import { supportCategoryLabels, supportTypeLabels } from "../../lib/support";
import type {
  Servico,
  SupportCaseDetail,
  SupportCaseType,
  SupportCategory,
} from "../../types/api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { FlagIcon, ShieldCheckIcon, TrashIcon } from "../ui/Icons";

const typeOptions = (Object.entries(supportTypeLabels) as [SupportCaseType, string][]).map(
  ([value, label]) => ({ value, label }),
);
const categoryOptions = (Object.entries(supportCategoryLabels) as [SupportCategory, string][]).map(
  ([value, label]) => ({ value, label }),
);

type CreateSupportCaseModalProps = {
  open: boolean;
  onClose: () => void;
  initialType?: SupportCaseType;
  initialServiceId?: string;
  reportedUserId?: number;
};

export function CreateSupportCaseModal({
  open,
  onClose,
  initialType = "DENUNCIA",
  initialServiceId = "",
  reportedUserId,
}: CreateSupportCaseModalProps) {
  const navigate = useNavigate();
  const [type, setType] = useState<SupportCaseType>("DENUNCIA");
  const [category, setCategory] = useState<SupportCategory>("COMPORTAMENTO_INADEQUADO");
  const [serviceId, setServiceId] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setType(initialType);
    setServiceId(initialServiceId);
  }, [initialServiceId, initialType, open]);

  const servicesQuery = useQuery({
    queryKey: ["support-services"],
    queryFn: () => api.get<Servico[]>("/servicos").then(({ data }) => data),
    enabled: open,
  });

  const serviceOptions = useMemo(() => [
    { value: "", label: type === "DISPUTA" ? "Selecione o serviço" : "Nenhum serviço específico" },
    ...(servicesQuery.data ?? []).map((service) => ({
      value: String(service.id),
      label: `${service.titulo} · ${service.statusServico.replaceAll("_", " ")}`,
    })),
  ], [servicesQuery.data, type]);

  const createMutation = useMutation({
    mutationFn: async () => {
      await ensureCsrfToken();
      return api.post<SupportCaseDetail>("/support/cases", {
        type,
        category,
        subject,
        description,
        serviceId: serviceId ? Number(serviceId) : null,
        reportedUserId: type === "DENUNCIA" ? reportedUserId ?? null : null,
        evidenceUrls,
      }).then(({ data }) => data);
    },
    onSuccess: (created) => {
      toast.success(`Atendimento ${created.protocol} aberto.`);
      onClose();
      navigate(`/painel/suporte/${created.id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Não foi possível abrir o atendimento.")),
  });

  const uploadEvidence = async (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, 5 - evidenceUrls.length);
    if (selected.some((file) => file.size > 10 * 1024 * 1024)) {
      toast.error("Cada evidência deve ter no máximo 10 MB.");
      return;
    }
    setUploading(true);
    const loading = toast.loading("Enviando evidências...");
    try {
      const urls = await Promise.all(selected.map(uploadFile));
      setEvidenceUrls((current) => [...current, ...urls].slice(0, 5));
      toast.success("Evidências anexadas.", { id: loading });
    } catch (error) {
      toast.error(getErrorMessage(error, "Falha ao enviar uma evidência."), { id: loading });
    } finally {
      setUploading(false);
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (type === "DISPUTA" && !serviceId) {
      toast.error("Selecione o serviço que deseja disputar.");
      return;
    }
    createMutation.mutate();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Novo atendimento">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {typeOptions.map((option) => {
            const Icon = option.value === "DENUNCIA" ? FlagIcon : ShieldCheckIcon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setType(option.value);
                  if (option.value === "DISPUTA" && category === "COMPORTAMENTO_INADEQUADO") {
                    setCategory("QUALIDADE_SERVICO");
                  }
                }}
                className={`rounded-2xl border p-4 text-left transition ${
                  type === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-primary/15 bg-dark-background/40 text-dark-subtle hover:border-primary/30"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="mt-2 block text-sm font-extrabold">{option.label}</span>
              </button>
            );
          })}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dark-subtle">Categoria</label>
          <Select value={category} options={categoryOptions} onChange={setCategory} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-dark-subtle">
            Serviço relacionado {type === "DISPUTA" && <span className="text-status-danger">*</span>}
          </label>
          <Select value={serviceId} options={serviceOptions} onChange={setServiceId} disabled={servicesQuery.isLoading} />
        </div>

        <Input
          name="support-subject"
          label="Assunto"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          maxLength={160}
          placeholder="Resuma o que aconteceu"
          required
        />
        <Textarea
          name="support-description"
          label="Conte todos os detalhes"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={3000}
          placeholder="Datas, contexto, tentativas de solução e o resultado esperado..."
          required
          className="min-h-36"
        />

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-dark-subtle">Evidências</label>
            <span className="text-xs text-dark-subtle">{evidenceUrls.length}/5</span>
          </div>
          {evidenceUrls.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {evidenceUrls.map((url, index) => (
                <div key={url} className="relative overflow-hidden rounded-xl border border-primary/15 bg-dark-background">
                  <img src={url} alt={`Evidência ${index + 1}`} className="h-20 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setEvidenceUrls((items) => items.filter((item) => item !== url))}
                    aria-label="Remover evidência"
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1.5 text-white"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {evidenceUrls.length < 5 && (
            <label className="mt-2 flex min-h-16 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-primary/25 bg-primary/5 px-4 text-center text-sm font-bold text-primary hover:border-primary/50">
              {uploading ? "Enviando..." : "Anexar imagens ou comprovantes"}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                className="hidden"
                onChange={(event) => void uploadEvidence(event.target.files)}
              />
            </label>
          )}
        </div>

        <div className="rounded-2xl bg-primary/8 p-4 text-xs leading-5 text-dark-subtle">
          Seu protocolo terá histórico auditável. Notas internas do suporte nunca são exibidas para as partes.
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={createMutation.isPending || uploading}>
            {createMutation.isPending ? "Abrindo..." : "Abrir atendimento"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
