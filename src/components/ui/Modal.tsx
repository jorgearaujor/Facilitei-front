import { type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-md sm:items-center sm:p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-primary/20 bg-dark-surface shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com Gradiente Sutil */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar modal"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-dark-subtle hover:bg-red-500/20 hover:text-red-500 transition-all"
              >
                &times;
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
