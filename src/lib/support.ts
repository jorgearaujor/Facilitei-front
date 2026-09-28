import type {
  SupportCaseType,
  SupportCategory,
  SupportPriority,
  SupportStatus,
} from "../types/api";

export const supportTypeLabels: Record<SupportCaseType, string> = {
  DENUNCIA: "Denúncia",
  DISPUTA: "Disputa de serviço",
};

export const supportCategoryLabels: Record<SupportCategory, string> = {
  COMPORTAMENTO_INADEQUADO: "Comportamento inadequado",
  FRAUDE_GOLPE: "Fraude ou golpe",
  NAO_COMPARECIMENTO: "Não comparecimento",
  PAGAMENTO_COBRANCA: "Pagamento ou cobrança",
  QUALIDADE_SERVICO: "Qualidade do serviço",
  SEGURANCA: "Segurança",
  CONTA_ACESSO: "Conta ou acesso",
  OUTRO: "Outro assunto",
};

export const supportStatusLabels: Record<SupportStatus, string> = {
  ABERTO: "Aberto",
  EM_ANALISE: "Em análise",
  AGUARDANDO_USUARIO: "Aguardando você",
  RESOLVIDO: "Resolvido",
  REJEITADO: "Encerrado",
};

export const supportPriorityLabels: Record<SupportPriority, string> = {
  BAIXA: "Baixa",
  NORMAL: "Normal",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

export const supportStatusClasses: Record<SupportStatus, string> = {
  ABERTO: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  EM_ANALISE: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  AGUARDANDO_USUARIO: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  RESOLVIDO: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  REJEITADO: "border-slate-400/30 bg-slate-400/10 text-slate-300",
};

export const supportPriorityClasses: Record<SupportPriority, string> = {
  BAIXA: "text-slate-300",
  NORMAL: "text-sky-300",
  ALTA: "text-orange-300",
  URGENTE: "text-rose-300",
};

export const formatSupportDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
