import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Typography } from "../components/ui/Typography";
import { api, ensureCsrfToken } from "../lib/api";
import { getErrorMessage } from "../lib/httpError";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await ensureCsrfToken();
      const { data } = await api.post<{ message: string }>(
        "/auth/forgot-password",
        { email },
      );
      setSent(true);
      toast.success(data.message);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Não foi possível solicitar a recuperação agora.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 sm:p-10">
          <Typography as="h1" className="mb-2 !text-3xl">
            Recuperar senha
          </Typography>
          <p className="mb-8 text-dark-subtle">
            Informe seu e-mail e enviaremos um link válido por 30 minutos.
          </p>

          {sent ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-dark-text">
                Se o e-mail estiver cadastrado, as instruções chegarão em breve.
                Confira também a caixa de spam.
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setSent(false)}
              >
                Enviar novamente
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-6 block text-center text-sm text-primary hover:text-accent"
          >
            Voltar para o login
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}
