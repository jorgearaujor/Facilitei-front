import type { SupportPriority, SupportStatus } from "../../types/api";
import {
  supportPriorityClasses,
  supportPriorityLabels,
  supportStatusClasses,
  supportStatusLabels,
} from "../../lib/support";

export function SupportStatusBadge({ status }: { status: SupportStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold ${supportStatusClasses[status]}`}>
      {supportStatusLabels[status]}
    </span>
  );
}

export function SupportPriorityLabel({ priority }: { priority: SupportPriority }) {
  return (
    <span className={`text-xs font-extrabold uppercase tracking-[0.14em] ${supportPriorityClasses[priority]}`}>
      {supportPriorityLabels[priority]}
    </span>
  );
}
