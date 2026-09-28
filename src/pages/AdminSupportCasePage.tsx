import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api, ensureCsrfToken } from "../lib/api";
import { getErrorMessage } from "../lib/httpError";
import {
  formatSupportDate,
  supportCategoryLabels,
  supportPriorityLabels,
  supportStatusLabels,
  supportTypeLabels,
} from "../lib/support";
import type { SupportCaseDetail, SupportPriority, SupportStatus } from "../types/api";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { SupportPriorityLabel, SupportStatusBadge } from "../components/support/SupportStatusBadge";
import { ArrowRightIcon, ChevronLeftIcon, DocumentTextIcon, ShieldCheckIcon } from "../components/ui/Icons";

export function AdminSupportCasePage() {
  const { caseId } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const queryKey = ["admin-support-case", caseId];
  const [reply, setReply] = useState("");
  const [internalNote, setInternalNote] = useState(false);
  const [status, setStatus] = useState<SupportStatus>("ABERTO");
  const [priority, setPriority] = useState<SupportPriority>("NORMAL");
  const [resolution, setResolution] = useState("");

  const detailQuery = useQuery({
    queryKey,
    queryFn: () => api.get<SupportCaseDetail>(`/admin/support/cases/${caseId}`).then(({ data }) => data),
    enabled: Boolean(caseId),
    refetchInterval: 20_000,
  });
  useEffect(() => {
    if (!detailQuery.data) return;
    setStatus(detailQuery.data.status);
    setPriority(detailQuery.data.priority);
    setResolution(detailQuery.data.resolution ?? "");
  }, [detailQuery.data]);

  const update = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      await ensureCsrfToken();
      return api.patch<SupportCaseDetail>(`/admin/support/cases/${caseId}`, body).then(({ data }) => data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
      void queryClient.invalidateQueries({ queryKey: ["admin-support-cases"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-support-metrics"] });
      toast.success("Atendimento atualizado.");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Não foi possível atualizar o atendimento.")),
  });
  const sendMessage = useMutation({
    mutationFn: async () => {
      await ensureCsrfToken();
      return api.post<SupportCaseDetail>(`/admin/support/cases/${caseId}/messages`, { message: reply, internalNote }).then(({ data }) => data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
      setReply("");
      toast.success(internalNote ? "Nota interna registrada." : "Resposta enviada ao usuário.");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Não foi possível registrar a mensagem.")),
  });

  if (detailQuery.isLoading) return <div className="h-96 animate-pulse rounded-[2rem] bg-dark-surface" />;
  const item = detailQuery.data;
  if (!item) return <Card className="p-10 text-center text-dark-subtle">Atendimento não encontrado.</Card>;
  const assignedToMe = String(item.assignedAdminId) === String(user?.id);
  const closed = ["RESOLVIDO", "REJEITADO"].includes(item.status);

  const saveDecision = () => {
    update.mutate({ status, priority, resolution: ["RESOLVIDO", "REJEITADO"].includes(status) ? resolution : null });
  };

  return (
    <div className="space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-dark-subtle hover:text-primary">
        <ChevronLeftIcon className="h-4 w-4" /> Voltar para a fila
      </Link>

      <section className="rounded-[2rem] border border-primary/15 bg-[#102F29] p-6 text-[#F5F1E8] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2"><SupportStatusBadge status={item.status} /><SupportPriorityLabel priority={item.priority} /></div>
            <h1 className="mt-4 font-display text-3xl font-extrabold">{item.subject}</h1>
            <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#C7F36B]">{item.protocol} · {supportTypeLabels[item.type]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {assignedToMe ? (
              <Button variant="outline" onClick={() => update.mutate({ unassign: true })}>Devolver à fila</Button>
            ) : (
              <Button variant="secondary" onClick={() => update.mutate({ assignToMe: true })}>Assumir atendimento</Button>
            )}
          </div>
        </div>
        <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Solicitante" value={item.reporterName} />
          <Info label="Reportado" value={item.reportedUserName ?? "Não informado"} />
          <Info label="Serviço" value={item.serviceTitle ?? "Não vinculado"} />
          <Info label="Categoria" value={supportCategoryLabels[item.category]} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-dark-text">Relato e evidências</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-dark-subtle">{item.description}</p>
            {item.evidenceUrls.length > 0 && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{item.evidenceUrls.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer"><img src={url} alt={`Evidência ${index + 1}`} className="h-28 w-full rounded-xl border border-primary/15 object-cover" /></a>)}</div>}
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-primary/10 px-5 py-4 sm:px-6">
              <h2 className="font-display text-lg font-bold text-dark-text">Comunicação do caso</h2>
              <p className="mt-1 text-xs text-dark-subtle">Notas internas aparecem apenas para administradores.</p>
            </div>
            <div className="max-h-[580px] space-y-4 overflow-y-auto p-5 sm:p-6">
              {item.messages.length === 0 && <p className="py-8 text-center text-sm text-dark-subtle">Nenhuma mensagem adicional.</p>}
              {item.messages.map((entry) => (
                <div key={entry.id} className={`rounded-2xl border p-4 ${entry.internalNote ? "border-amber-400/25 bg-amber-400/5" : entry.admin ? "border-primary/20 bg-primary/8" : "border-primary/10 bg-dark-background/50"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-wider text-dark-subtle">
                    <span>{entry.internalNote ? "Nota interna" : entry.admin ? `Suporte · ${entry.authorName}` : `Usuário · ${entry.authorName}`}</span>
                    <span>{formatSupportDate(entry.createdAt)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-dark-text">{entry.message}</p>
                </div>
              ))}
            </div>
            {!closed && (
              <form onSubmit={(event) => { event.preventDefault(); if (reply.trim()) sendMessage.mutate(); }} className="border-t border-primary/10 p-5 sm:p-6">
                <label className="mb-3 flex cursor-pointer items-center gap-2 text-xs font-bold text-dark-subtle">
                  <input type="checkbox" checked={internalNote} onChange={(event) => setInternalNote(event.target.checked)} className="accent-primary" />
                  Registrar como nota interna
                </label>
                <Textarea name="admin-reply" value={reply} onChange={(event) => setReply(event.target.value)} maxLength={2000} placeholder={internalNote ? "Contexto interno, hipótese ou próximo passo..." : "Resposta que o usuário receberá..."} />
                <div className="mt-3 flex justify-end"><Button type="submit" disabled={!reply.trim() || sendMessage.isPending}>{sendMessage.isPending ? "Salvando..." : internalNote ? "Salvar nota" : "Responder"}<ArrowRightIcon className="h-4 w-4" /></Button></div>
              </form>
            )}
          </Card>
        </section>

        <aside className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-2"><ShieldCheckIcon className="h-5 w-5 text-primary" /><h2 className="font-display font-bold text-dark-text">Decisão e prioridade</h2></div>
            <div className="mt-5 space-y-4">
              <div><label className="mb-1.5 block text-xs font-bold text-dark-subtle">Status</label><Select value={status} onChange={setStatus} options={(Object.entries(supportStatusLabels) as [SupportStatus, string][]).map(([value, label]) => ({ value, label }))} /></div>
              <div><label className="mb-1.5 block text-xs font-bold text-dark-subtle">Prioridade</label><Select value={priority} onChange={setPriority} options={(Object.entries(supportPriorityLabels) as [SupportPriority, string][]).map(([value, label]) => ({ value, label }))} /></div>
              {["RESOLVIDO", "REJEITADO"].includes(status) && <Textarea name="admin-resolution" label="Conclusão obrigatória" value={resolution} onChange={(event) => setResolution(event.target.value)} maxLength={2000} placeholder="Explique a decisão e os próximos passos..." />}
              <Button className="w-full" onClick={saveDecision} disabled={update.isPending || (["RESOLVIDO", "REJEITADO"].includes(status) && !resolution.trim())}>{update.isPending ? "Salvando..." : "Salvar decisão"}</Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2"><DocumentTextIcon className="h-5 w-5 text-primary" /><h2 className="font-display font-bold text-dark-text">Trilha de auditoria</h2></div>
            <ol className="mt-5 space-y-4 border-l border-primary/20 pl-5">{item.history.map((event) => <li key={event.id} className="relative"><span className="absolute -left-[1.58rem] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-dark-surface" /><p className="text-sm font-semibold leading-5 text-dark-text">{event.description}</p><p className="mt-1 text-[10px] text-dark-subtle">{event.actorName} · {formatSupportDate(event.createdAt)}</p></li>)}</ol>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F5F1E8]/45">{label}</p><p className="mt-1 truncate text-sm font-bold">{value}</p></div>;
}
