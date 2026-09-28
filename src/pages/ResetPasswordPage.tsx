import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Typography } from "../components/ui/Typography";
import { api, ensureCsrfToken } from "../lib/api";
import { getErrorMessage } from "../lib/httpError";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (novaSenha.length < 12) {
      toast.error("A senha precisa ter pelo menos 12 caracteres.");
      return;
    }
    if (novaSenha !== confirmacao) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      await ensureCsrfToken();
      const { data } = await api.post<{ message: string }>(
        "/auth/reset-password",
        { token, novaSenha },
      );
      toast.success(data.message);
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "O link é inválido, expirou ou já foi utilizado.",
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
            Criar nova senha
          </Typography>
          <p className="mb-8 text-dark-subtle">
            Escolha uma senha com no mínimo 12 caracteres.
          </p>

          {!token ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-status-danger/30 bg-status-danger/10 p-4 text-sm text-status-danger">
                Este link não contém um token de recuperação válido.
              </div>
              <Link
                to="/recuperar-senha"
                className="block text-center text-primary hover:text-accent"
              >
                Solicitar um novo link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nova senha"
                name="novaSenha"
                type="password"
                autoComplete="new-password"
                minLength={12}
                value={novaSenha}
                onChange={(event) => setNovaSenha(event.target.value)}
                required
              />
              <Input
                label="Confirmar nova senha"
                name="confirmacao"
                type="password"
                autoComplete="new-password"
                minLength={12}
                value={confirmacao}
                onChange={(event) => setConfirmacao(event.target.value)}
                required
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Redefinindo..." : "Redefinir senha"}
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
