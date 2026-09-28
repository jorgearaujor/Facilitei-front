import { type KeyboardEvent } from "react";
import { type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  formatTipoServico,
  type TipoServico,
  type Trabalhador,
} from "../../types/api";
import { cardItemVariants } from "../../lib/variants";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { Rating } from "./Rating";

interface TrabalhadorCardProps {
  trabalhador: Trabalhador;
  tipoServico?: TipoServico;
  variants?: Variants;
}

export function TrabalhadorCard({
  trabalhador,
  tipoServico,
  variants = cardItemVariants,
}: TrabalhadorCardProps) {
  const navigate = useNavigate();
  const profilePath = `/trabalhador/${trabalhador.id}`;
  const tipoExibido = tipoServico || trabalhador.servicoPrincipal;
  const resumoAvaliacao = trabalhador.avaliacoesPorServico?.find(
    (resumo) => resumo.tipoServico === tipoExibido,
  );
  const notaExibida = resumoAvaliacao?.media ?? 0;
  const readableService = tipoExibido
    ? formatTipoServico(tipoExibido)
    : "Serviço";
  const cidade = trabalhador.endereco?.cidade || "Local não informado";
  const estado = trabalhador.endereco?.estado;

  const openProfile = () => navigate(profilePath);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProfile();
    }
  };

  return (
    <Card
      variants={variants}
      layout
      role="link"
      tabIndex={0}
      aria-label={`Ver perfil de ${trabalhador.nome}`}
      onClick={openProfile}
      onKeyDown={handleKeyDown}
      whileHover={{ y: -3 }}
      className="group h-full cursor-pointer overflow-hidden border-primary/10 bg-dark-surface/95 p-0 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-[#FF7E5F]" />
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          <Avatar
            src={trabalhador.avatarUrl}
            name={trabalhador.nome}
            className="h-16 w-16 shrink-0 rounded-2xl border border-primary/15 object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
          />

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-base font-bold text-dark-text transition-colors group-hover:text-primary sm:text-lg">
              {trabalhador.nome}
            </h3>
            <p className="mt-1 line-clamp-1 text-xs font-bold uppercase tracking-[0.08em] text-primary">
              {readableService}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <Rating
                score={notaExibida}
                className="space-x-0.5"
                starClassName="text-sm"
              />
              <span className="text-xs font-semibold text-dark-subtle">
                {resumoAvaliacao
                  ? `${notaExibida.toFixed(1)} (${resumoAvaliacao.quantidadeAvaliacoes})`
                  : "Novo perfil"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-primary/10 pt-3 text-xs">
          <span className="min-w-0 truncate text-dark-subtle">
            {cidade}{estado ? `, ${estado}` : ""}
          </span>
          <span className="shrink-0 font-bold text-primary transition-transform group-hover:translate-x-0.5">
            Ver perfil →
          </span>
        </div>
      </div>
    </Card>
  );
}
