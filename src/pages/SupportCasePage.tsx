import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api, ensureCsrfToken } from "../lib/api";
import { getErrorMessage } from "../lib/httpError";
import { formatSupportDate, supportCategoryLabels, supportTypeLabels } from "../lib/support";
import type { SupportCaseDetail } from "../types/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Textarea } from "../components/ui/Textarea";
import { SupportPriorityLabel, SupportStatusBadge } from "../components/support/SupportStatusBadge";
import { ArrowRightIcon, CheckCircleIcon, ChevronLeftIcon, DocumentTextIcon } from "../components/ui/Icons";

export function SupportCasePage() {
  const { caseId } = useParams();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const queryKey = ["support-case", caseId];
  const detailQuery = useQuery({
    queryKey,
    queryFn: () => api.get<SupportCaseDetail>(`/support/cases/${caseId}`).then(({ data }) => data),
    enabled: Boolean(caseId),
    refetchInterval: 20_000,
  });
  const sendMessage = useMutation({
    mutationFn: async () => {
      await ensureCsrfToken();
      return api.post<SupportCaseDetail>(`/support/cases/${caseId}/messages`, { message }).then(({ data }) => data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
      void queryClient.invalidateQueries({ queryKey: ["support-cases"] });
      setMessage("");
      toast.success("Mensagem enviada ao suporte.");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Não foi possível enviar a mensagem.")),
  });

  if (detailQuery.isLoading) return <div className="h-96 animate-pulse rounded-[2rem] bg-dark-surface" />;
  const item = detailQuery.data;
  if (!item) return <Card className="p-10 text-center text-dark-subtle">Atendimento não encontrado.</Card>;
  const closed = item.status === "RESOLVIDO" || item.status === "REJEITADO";

  return (
    <div className="space-y-6">
      <Link to="/painel/suporte" className="inline-flex items-center gap-2 text-sm font-bold text-dark-subtle hover:text-primary">
        <ChevronLeftIcon className="h-4 w-4" /> Voltar para suporte
      </Link>

      <section className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-dark-surface to-dark-background p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <SupportStatusBadge status={item.status} />
              <SupportPriorityLabel priority={item.priority} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-dark-text">{item.subject}</h1>
            <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
              {item.protocol} · {supportTypeLabels[item.type]}
            </p>
          </div>
          <div className="rounded-2xl bg-primary/8 px-4 py-3 text-sm text-dark-subtle">
            Atualizado {formatSupportDate(item.updatedAt)}
          </div>
        </div>
        <div className="mt-6 grid gap-4 border-t border-primary/10 pt-6 sm:grid-cols-3">
          <Info label="Categoria" value={supportCategoryLabels[item.category]} />
          <Info label="Serviço" value={item.serviceTitle ?? "Não vinculado"} />
          <Info label="Responsável" value={item.assignedAdminName ?? "Equipe de suporte"} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-dark-text">Relato inicial</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-dark-subtle">{item.description}</p>
            {item.evidenceUrls.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {item.evidenceUrls.map((url, index) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-primary/15">
                    <img src={url} alt={`Evidência ${index + 1}`} className="h-28 w-full object-cover transition group-hover:scale-105" />
                  </a>
                ))}
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-primary/10 px-5 py-4 sm:px-6">
              <h2 className="font-display text-lg font-bold text-dark-text">Conversa com o suporte</h2>
              <p className="mt-1 text-xs text-dark-subtle">As respostas ficam registradas no protocolo.</p>
            </div>
            <div className="max-h-[520px] space-y-4 overflow-y-auto p-5 sm:p-6">
              {item.messages.length === 0 ? (
                <p className="py-8 text-center text-sm text-dark-subtle">A equipe ainda não enviou mensagens.</p>
              ) : item.messages.map((entry) => (
                <div key={entry.id} className={`flex ${entry.admin ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${entry.admin ? "bg-primary/10 text-dark-text" : "bg-primary text-white"}`}>
                    <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-wider opacity-70">
                      <span>{entry.admin ? "Equipe Facilitei" : "Você"}</span>
                      <span>{formatSupportDate(entry.createdAt)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{entry.message}</p>
                  </div>
                </div>
              ))}
            </div>
            {!closed && (
              <form
                onSubmit={(event) => { event.preventDefault(); if (message.trim()) sendMessage.mutate(); }}
                className="border-t border-primary/10 p-5 sm:p-6"
              >
                <Textarea name="support-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} placeholder="Escreva uma atualização ou responda ao suporte..." />
                <div className="mt-3 flex justify-end">
                  <Button type="submit" disabled={!message.trim() || sendMessage.isPending}>
                    {sendMessage.isPending ? "Enviando..." : "Enviar mensagem"} <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </section>

        <aside className="space-y-4">
          {item.resolution && (
            <Card className="border-emerald-400/25 bg-emerald-400/5 p-5">
              <CheckCircleIcon className="h-7 w-7 text-emerald-300" />
              <h2 className="mt-3 font-display text-lg font-bold text-dark-text">Conclusão do suporte</h2>
              <p className="mt-2 text-sm leading-6 text-dark-subtle">{item.resolution}</p>
            </Card>
          )}
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-dark-text">Histórico</h2>
            </div>
            <ol className="mt-5 space-y-4 border-l border-primary/20 pl-5">
              {item.history.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[1.58rem] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-dark-surface" />
                  <p className="text-sm font-semibold leading-5 text-dark-text">{event.description}</p>
                  <p className="mt-1 text-[10px] text-dark-subtle">{formatSupportDate(event.createdAt)}</p>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-dark-subtle">{label}</p><p className="mt-1 text-sm font-bold text-dark-text">{value}</p></div>;
}
