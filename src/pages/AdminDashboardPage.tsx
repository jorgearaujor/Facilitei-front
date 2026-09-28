import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type {
  AdminMetrics,
  SupportCasePage,
  SupportCaseType,
  SupportPriority,
  SupportStatus,
} from "../types/api";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { SupportCaseCard } from "../components/support/SupportCaseCard";
import { InboxIcon, ShieldCheckIcon, UsersIcon, WrenchScrewdriverIcon } from "../components/ui/Icons";

type StatusFilter = SupportStatus | "";
type TypeFilter = SupportCaseType | "";
type PriorityFilter = SupportPriority | "";

export function AdminDashboardPage() {
  const [status, setStatus] = useState<StatusFilter>("");
  const [type, setType] = useState<TypeFilter>("");
  const [priority, setPriority] = useState<PriorityFilter>("");
  const [search, setSearch] = useState("");
  const [unassigned, setUnassigned] = useState(false);

  const metricsQuery = useQuery({
    queryKey: ["admin-support-metrics"],
    queryFn: () => api.get<AdminMetrics>("/admin/support/metrics").then(({ data }) => data),
    refetchInterval: 30_000,
  });
  const casesQuery = useQuery({
    queryKey: ["admin-support-cases", status, type, priority, search, unassigned],
    queryFn: () => api.get<SupportCasePage>("/admin/support/cases", {
      params: {
        status: status || undefined,
        type: type || undefined,
        priority: priority || undefined,
        search: search.trim() || undefined,
        unassigned,
        size: 50,
      },
    }).then(({ data }) => data),
    refetchInterval: 20_000,
  });

  const metrics = metricsQuery.data;
  const kpis = [
    { label: "Casos abertos", value: metrics?.openCases ?? 0, hint: `${metrics?.createdLast24Hours ?? 0} nas últimas 24h`, icon: InboxIcon, tone: "text-sky-300 bg-sky-400/10" },
    { label: "Disputas ativas", value: metrics?.openDisputes ?? 0, hint: `${metrics?.urgentCases ?? 0} urgentes`, icon: ShieldCheckIcon, tone: "text-orange-300 bg-orange-400/10" },
    { label: "Sem responsável", value: metrics?.unassignedCases ?? 0, hint: "Aguardando triagem", icon: WrenchScrewdriverIcon, tone: "text-violet-300 bg-violet-400/10" },
    { label: "Usuários", value: metrics?.users ?? 0, hint: `${metrics?.clients ?? 0} clientes · ${metrics?.workers ?? 0} profissionais`, icon: UsersIcon, tone: "text-emerald-300 bg-emerald-400/10" },
  ];

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-[#0E2C27] p-6 text-[#F5F1E8] sm:p-9">
        <div className="absolute -right-12 top-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#C7F36B]/25 bg-[#C7F36B]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#C7F36B]">Operações</span>
            <span className="text-xs text-[#F5F1E8]/50">Atualização automática a cada 20 segundos</span>
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold sm:text-5xl">Administração & suporte</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#F5F1E8]/65 sm:text-base">
            Priorize riscos, acompanhe disputas e mantenha decisões registradas em uma única fila operacional.
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, hint, icon: Icon, tone }) => (
          <Card key={label} className="p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></div>
            <p className="mt-4 text-sm font-semibold text-dark-subtle">{label}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-dark-text">{metricsQuery.isLoading ? "—" : value}</p>
            <p className="mt-2 text-xs text-dark-subtle">{hint}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Fila operacional</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-dark-text">Casos para análise</h2>
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-primary/15 bg-dark-surface px-4 py-3 text-xs font-bold text-dark-subtle">
            <input type="checkbox" checked={unassigned} onChange={(event) => setUnassigned(event.target.checked)} className="accent-primary" />
            Apenas sem responsável
          </label>
        </div>

        <Card className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
          <Input name="admin-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Protocolo, assunto ou usuário" />
          <Select value={status} onChange={setStatus} options={[
            { value: "", label: "Todos os status" },
            { value: "ABERTO", label: "Aberto" },
            { value: "EM_ANALISE", label: "Em análise" },
            { value: "AGUARDANDO_USUARIO", label: "Aguardando usuário" },
            { value: "RESOLVIDO", label: "Resolvido" },
            { value: "REJEITADO", label: "Encerrado" },
          ]} />
          <Select value={type} onChange={setType} options={[
            { value: "", label: "Denúncias e disputas" },
            { value: "DENUNCIA", label: "Denúncias" },
            { value: "DISPUTA", label: "Disputas" },
          ]} />
          <Select value={priority} onChange={setPriority} options={[
            { value: "", label: "Todas as prioridades" },
            { value: "URGENTE", label: "Urgente" },
            { value: "ALTA", label: "Alta" },
            { value: "NORMAL", label: "Normal" },
            { value: "BAIXA", label: "Baixa" },
          ]} />
        </Card>

        {casesQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-48 animate-pulse rounded-[1.4rem] bg-dark-surface" />)}</div>
        ) : casesQuery.data?.content.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {casesQuery.data.content.map((item) => <SupportCaseCard key={item.id} item={item} admin />)}
          </div>
        ) : (
          <Card className="p-12 text-center"><InboxIcon className="mx-auto h-10 w-10 text-primary" /><p className="mt-3 font-bold text-dark-text">Nenhum caso com estes filtros.</p></Card>
        )}
      </section>
    </div>
  );
}
