import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { RegisterCliente } from "../components/register/RegisterCliente";
import { RegisterTrabalhador } from "../components/register/RegisterTrabalhador";
import { BriefcaseIcon } from "../components/ui/Icons"; // Assumindo que UsersIcon existe ou usando um similar

type UserRole = "cliente" | "trabalhador" | null;

export function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-6 sm:py-8 md:py-16">
      <div className="w-full max-w-4xl">
        {/* Cabeçalho Dinâmico */}
        <motion.div layout className="mb-8 text-center sm:mb-10">
          <Typography
            as="h2"
            className="mb-3 !text-3xl font-extrabold sm:!text-5xl"
          >
            {selectedRole === "cliente"
              ? "Cadastro de Cliente"
              : selectedRole === "trabalhador"
              ? "Cadastro de Profissional"
              : "Junte-se ao Facilitei"}
          </Typography>
          <p className="text-dark-subtle text-lg">
            {selectedRole
              ? "Preencha seus dados abaixo para começar."
              : "Escolha como você quer usar a plataforma."}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ESTADO 1: SELEÇÃO (GRID LINDÃO) */}
          {!selectedRole ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
            >
              {/* Card Cliente */}
              <button
                onClick={() => setSelectedRole("cliente")}
                className="group relative rounded-2xl border-2 border-white/5 bg-dark-surface/50 p-6 text-left transition-all duration-300 hover:border-primary/50 hover:bg-dark-surface hover:shadow-glow-primary sm:p-8"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-slate-50 transition-colors text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  Sou Cliente
                </h3>
                <p className="text-dark-subtle leading-relaxed">
                  Preciso contratar serviços para minha casa ou empresa com
                  segurança e rapidez.
                </p>
              </button>

              {/* Card Trabalhador */}
              <button
                onClick={() => setSelectedRole("trabalhador")}
                className="group relative rounded-2xl border-2 border-white/5 bg-dark-surface/50 p-6 text-left transition-all duration-300 hover:border-accent/50 hover:bg-dark-surface hover:shadow-glow-accent sm:p-8"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-on-accent transition-colors text-accent">
                  <BriefcaseIcon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  Sou Profissional
                </h3>
                <p className="text-dark-subtle leading-relaxed">
                  Quero oferecer meus serviços, encontrar novos clientes e
                  gerenciar minha agenda.
                </p>
              </button>
            </motion.div>
          ) : (
            /* ESTADO 2: FORMULÁRIOS (COM ANIMAÇÃO DE ENTRADA) */
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-lg mx-auto"
            >
              <Card className="border-t-4 border-t-accent p-4 shadow-2xl sm:p-8">
                {selectedRole === "cliente" && <RegisterCliente />}
                {selectedRole === "trabalhador" && <RegisterTrabalhador />}

                <button
                  onClick={() => setSelectedRole(null)}
                  className="mt-6 w-full text-sm text-dark-subtle hover:text-white transition-colors flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-white/5"
                >
                  ← Voltar e escolher outro tipo
                </button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedRole && (
          <Typography as="p" className="text-center !text-sm mt-12 opacity-60">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-accent hover:underline font-bold">
              Faça login
            </Link>
          </Typography>
        )}
      </div>
    </div>
  );
}
