import { Link } from "react-router-dom";
import type { SupportCaseSummary } from "../../types/api";
import { formatSupportDate, supportCategoryLabels, supportTypeLabels } from "../../lib/support";
import { ArrowRightIcon } from "../ui/Icons";
import { SupportPriorityLabel, SupportStatusBadge } from "./SupportStatusBadge";

export function SupportCaseCard({ item, admin = false }: { item: SupportCaseSummary; admin?: boolean }) {
  return (
    <Link
      to={admin ? `/admin/suporte/${item.id}` : `/painel/suporte/${item.id}`}
      className="group block rounded-[1.4rem] border border-primary/15 bg-dark-surface/85 p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/35"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <SupportStatusBadge status={item.status} />
            <SupportPriorityLabel priority={item.priority} />
          </div>
          <h3 className="mt-3 truncate font-display text-lg font-bold text-dark-text">{item.subject}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-dark-subtle">
            {item.protocol} · {supportTypeLabels[item.type]}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
          <ArrowRightIcon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-primary/10 pt-3 text-xs text-dark-subtle">
        <span>{supportCategoryLabels[item.category]}</span>
        <span>Atualizado {formatSupportDate(item.updatedAt)}</span>
      </div>
      {admin && (
        <div className="mt-2 flex justify-between text-xs text-dark-subtle">
          <span>Por {item.reporterName}</span>
          <span>{item.assignedAdminName ? `Com ${item.assignedAdminName}` : "Sem responsável"}</span>
        </div>
      )}
    </Link>
  );
}
