import type { StatusServico } from "../../types/api";

const statusConfig: Record<StatusServico, { label: string; classes: string }> = {
  SOLICITADO: {
    label: "Solicitado",
    classes: "border-slate-400/40 bg-slate-400/10 text-slate-300",
  },
  AGUARDANDO_CONTATO: {
    label: "Aguardando contato",
    classes: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  },
  EM_ANALISE: {
    label: "Em análise",
    classes: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  },
  APROVADO: {
    label: "Aprovado",
    classes: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  },
  PENDENTE: {
    label: "Pendente",
    classes: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  },
  EM_ANDAMENTO: {
    label: "Em andamento",
    classes: "border-primary/50 bg-primary/20 text-primary",
  },
  PAUSADO: {
    label: "Pausado",
    classes: "border-orange-400/40 bg-orange-400/10 text-orange-300",
  },
  PENDENTE_APROVACAO: {
    label: "Aguardando aprovação",
    classes: "border-status-pending/50 bg-status-pending/20 text-status-pending",
  },
  FINALIZADO: {
    label: "Finalizado",
    classes: "border-accent/40 bg-accent/10 text-accent",
  },
  CANCELADO: {
    label: "Cancelado",
    classes: "border-status-danger/40 bg-status-danger/10 text-status-danger",
  },
  NAO_COMPARECEU: {
    label: "Não compareceu",
    classes: "border-rose-400/40 bg-rose-400/10 text-rose-300",
  },
  RECUSADO: {
    label: "Recusado",
    classes: "border-status-danger/40 bg-status-danger/10 text-status-danger",
  },
};

export function StatusBadge({ status }: { status: StatusServico }) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
