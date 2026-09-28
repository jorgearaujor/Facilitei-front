import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import type { SupportCasePage } from "../types/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CreateSupportCaseModal } from "../components/support/CreateSupportCaseModal";
import { SupportCaseCard } from "../components/support/SupportCaseCard";
import { ChatBubbleLeftRightIcon, FlagIcon, ShieldCheckIcon } from "../components/ui/Icons";

export function SupportCenterPage() {
  const [creating, setCreating] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("novo") === "disputa" ? "DISPUTA" : "DENUNCIA";
  const reportedUserId = Number(searchParams.get("usuarioId")) || undefined;
  const initialServiceId = searchParams.get("servicoId") ?? "";

  useEffect(() => {
    if (searchParams.has("novo")) setCreating(true);
  }, [searchParams]);
  const casesQuery = useQuery({
    queryKey: ["support-cases"],
    queryFn: () => api.get<SupportCasePage>("/support/cases", { params: { size: 50 } }).then(({ data }) => data),
    refetchInterval: 30_000,
  });

  const counts = useMemo(() => {
    const items = casesQuery.data?.content ?? [];
    return {
      open: items.filter((item) => !["RESOLVIDO", "REJEITADO"].includes(item.status)).length,
      waiting: items.filter((item) => item.status === "AGUARDANDO_USUARIO").length,
      solved: items.filter((item) => item.status === "RESOLVIDO").length,
    };
  }, [casesQuery.data]);

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-[#123D35] p-6 text-[#F5F1E8] shadow-2xl sm:p-9">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#C7F36B]/12 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C7F36B]/25 bg-[#C7F36B]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#C7F36B]">
              <ShieldCheckIcon className="h-4 w-4" /> Confiança e segurança
            </span>
            <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Suporte que acompanha você até a solução.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#F5F1E8]/70 sm:text-base">
              Abra uma denúncia ou disputa, anexe evidências e acompanhe cada atualização pelo protocolo.
            </p>
          </div>
          <Button variant="secondary" size="lg" onClick={() => setCreating(true)}>
            <FlagIcon className="h-5 w-5" /> Novo atendimento
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {[
          ["Em andamento", counts.open],
          ["Aguardando você", counts.waiting],
          ["Resolvidos", counts.solved],
        ].map(([label, value]) => (
          <Card key={String(label)} className="p-4 text-center sm:p-5">
            <p className="font-display text-2xl font-extrabold text-dark-text sm:text-3xl">{value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-dark-subtle sm:text-xs">{label}</p>
          </Card>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Seus protocolos</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-dark-text">Histórico de atendimento</h2>
          </div>
        </div>

        {casesQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-44 animate-pulse rounded-[1.4rem] bg-dark-surface" />)}
          </div>
        ) : casesQuery.data?.content.length ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-2">
            {casesQuery.data.content.map((item) => <SupportCaseCard key={item.id} item={item} />)}
          </motion.div>
        ) : (
          <Card className="px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ChatBubbleLeftRightIcon className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-dark-text">Você ainda não abriu atendimentos</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-dark-subtle">
              Se algo sair do combinado, nossa equipe pode analisar o caso e manter o histórico organizado.
            </p>
            <Button className="mt-5" onClick={() => setCreating(true)}>Abrir primeiro atendimento</Button>
          </Card>
        )}
      </section>

      <CreateSupportCaseModal
        open={creating}
        initialType={initialType}
        initialServiceId={initialServiceId}
        reportedUserId={reportedUserId}
        onClose={() => {
          setCreating(false);
          if (searchParams.has("novo")) setSearchParams({}, { replace: true });
        }}
      />
    </div>
  );
}
