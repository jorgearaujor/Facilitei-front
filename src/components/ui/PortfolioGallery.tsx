import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatTipoServico,
  type PortfolioItem,
  type TipoServico,
} from "../../types/api";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  XMarkIcon,
} from "./Icons";
import { Button } from "./Button";
import { Modal } from "./Modal";

type PortfolioGalleryProps = {
  items: PortfolioItem[];
  isLoading?: boolean;
  isAvailable?: boolean;
  onDelete?: (item: PortfolioItem) => void;
  isDeleting?: boolean;
};

const OTHER_GROUP = "OUTROS";

const getGroupLabel = (group: string) =>
  group === OTHER_GROUP
    ? "Outros trabalhos"
    : formatTipoServico(group as TipoServico);

export function PortfolioGallery({
  items,
  isLoading = false,
  isAvailable = true,
  onDelete,
  isDeleting = false,
}: PortfolioGalleryProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const groups = useMemo(() => {
    const grouped = new Map<string, PortfolioItem[]>();
    items.forEach((item) => {
      const key = item.tipoServico || OTHER_GROUP;
      grouped.set(key, [...(grouped.get(key) || []), item]);
    });
    return Array.from(grouped.entries()).map(([key, groupItems]) => ({
      key,
      label: getGroupLabel(key),
      items: groupItems,
    }));
  }, [items]);

  const [activeGroup, setActiveGroup] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const selectedGroup =
    groups.find((group) => group.key === activeGroup) || groups[0];

  useEffect(() => {
    if (!groups.some((group) => group.key === activeGroup)) {
      setActiveGroup(groups[0]?.key || "");
    }
  }, [activeGroup, groups]);

  useEffect(() => {
    if (lightboxIndex === null || !selectedGroup) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) =>
          index === null
            ? null
            : (index - 1 + selectedGroup.items.length) % selectedGroup.items.length,
        );
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) =>
          index === null ? null : (index + 1) % selectedGroup.items.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, selectedGroup]);

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="aspect-[4/3] min-w-[78%] animate-pulse rounded-2xl bg-white/5 sm:min-w-[45%]"
          />
        ))}
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-dark-subtle">
        O portfólio estará disponível assim que a API de fotos for publicada.
      </div>
    );
  }

  if (items.length === 0 || !selectedGroup) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-dark-subtle">
        Este profissional ainda não adicionou trabalhos ao portfólio.
      </div>
    );
  }

  const moveCarousel = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const lightboxItem =
    lightboxIndex === null ? null : selectedGroup.items[lightboxIndex];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((group) => (
          <button
            key={group.key}
            type="button"
            onClick={() => {
              setActiveGroup(group.key);
              setLightboxIndex(null);
            }}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              selectedGroup.key === group.key
                ? "bg-primary text-white shadow-glow-primary"
                : "border border-white/10 bg-dark-background text-dark-subtle hover:border-primary/30 hover:text-dark-text"
            }`}
          >
            {group.label}
            <span className="ml-2 opacity-70">{group.items.length}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        {selectedGroup.items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Fotos anteriores"
              onClick={() => moveCarousel(-1)}
              className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-dark-background/90 text-white shadow-lg transition hover:bg-primary sm:flex"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Próximas fotos"
              onClick={() => moveCarousel(1)}
              className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-dark-background/90 text-white shadow-lg transition hover:bg-primary sm:flex"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,.15)_transparent]"
        >
          {selectedGroup.items.map((item, index) => (
            <figure
              key={item.id}
              className="group relative aspect-[4/3] min-w-[86%] snap-center overflow-hidden rounded-2xl border border-white/10 bg-dark-background sm:min-w-[48%] lg:min-w-[38%]"
            >
              <button
                type="button"
                aria-label={`Abrir foto ${index + 1} de ${selectedGroup.label}`}
                onClick={() => setLightboxIndex(index)}
                className="h-full w-full cursor-zoom-in"
              >
                <img
                  src={item.url}
                  alt={item.descricao || `Trabalho de ${selectedGroup.label}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 text-left text-xs font-medium text-white/90">
                  {index + 1} de {selectedGroup.items.length}
                </span>
              </button>

              {onDelete && (
                <button
                  type="button"
                  aria-label={`Remover foto ${index + 1}`}
                  title="Remover foto"
                  disabled={isDeleting}
                  onClick={() => setDeleteTarget(item)}
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white shadow-lg backdrop-blur transition hover:border-status-danger/60 hover:bg-status-danger disabled:opacity-50"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </figure>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              aria-label="Fechar foto"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {selectedGroup.items.length > 1 && (
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxIndex(
                    (lightboxIndex! - 1 + selectedGroup.items.length) %
                      selectedGroup.items.length,
                  );
                }}
                className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
              >
                <ChevronLeftIcon className="h-7 w-7" />
              </button>
            )}

            <motion.img
              key={lightboxItem.id}
              src={lightboxItem.url}
              alt={lightboxItem.descricao || `Trabalho de ${selectedGroup.label}`}
              className="max-h-[85vh] max-w-[88vw] rounded-xl object-contain shadow-2xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(event) => event.stopPropagation()}
            />

            {selectedGroup.items.length > 1 && (
              <button
                type="button"
                aria-label="Próxima foto"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxIndex(
                    (lightboxIndex! + 1) % selectedGroup.items.length,
                  );
                }}
                className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
              >
                <ChevronRightIcon className="h-7 w-7" />
              </button>
            )}

            <div className="absolute bottom-5 rounded-full bg-black/55 px-4 py-2 text-sm text-white">
              {selectedGroup.label} · {lightboxIndex! + 1} de {selectedGroup.items.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Remover foto"
      >
        <div className="space-y-5">
          {deleteTarget && (
            <img
              src={deleteTarget.url}
              alt="Foto que será removida"
              className="aspect-video w-full rounded-xl object-cover"
            />
          )}
          <p className="text-sm leading-relaxed text-dark-subtle">
            Esta foto será removida definitivamente do portfólio.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={isDeleting}
              onClick={() => {
                if (deleteTarget) onDelete?.(deleteTarget);
                setDeleteTarget(null);
              }}
            >
              <TrashIcon className="h-5 w-5" />
              {isDeleting ? "Removendo..." : "Remover foto"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
