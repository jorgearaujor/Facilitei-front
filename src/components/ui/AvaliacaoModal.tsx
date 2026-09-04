import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatTipoServico, type Servico } from "../../types/api";
import { Modal } from "./Modal";
import { RatingInput } from "./RatingInput";
import { Textarea } from "./Textarea";
import { Button } from "./Button";
import { Typography } from "./Typography";
import { toast } from "react-hot-toast";
import { post } from "../../lib/api";
import axios from "axios";

interface AvaliacaoModalProps {
  servico: Servico | null;
  onClose: () => void;
}

export function AvaliacaoModal({ servico, onClose }: AvaliacaoModalProps) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!servico || !user) return;
      return post("/avaliacoes-servico/Criar", {
        clienteId: user.id,
        servicoId: servico.id,
        nota: nota,
        comentario: comentario,
        fotos: [],
      });
    },
    onSuccess: () => {
      toast.success("Avaliação enviada! Obrigado.");
      queryClient.invalidateQueries({ queryKey: ["servicosAvaliados"] });
      queryClient.invalidateQueries({ queryKey: ["allTrabalhadores"] });
      queryClient.invalidateQueries({
        queryKey: ["trabalhador", servico?.trabalhadorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["avaliacoesTrabalhador", servico?.trabalhadorId],
      });
      setNota(5);
      setComentario("");

      // Fechar apenas após sucesso
      setTimeout(onClose, 500);
    },
    onError: (err: unknown) => {
      const msg = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message || "Erro ao enviar avaliação."
        : "Erro ao enviar avaliação.";
      toast.error(msg);
    },
  });

  const handleSubmit = () => {
    if (mutation.isPending) return; // Previne duplo clique manual
    mutation.mutate();
  };

  return (
    <Modal isOpen={!!servico} onClose={onClose} title="Serviço concluído!">
      <div className="space-y-6 text-center pointer-events-auto">
        {/* Overlay transparente se estiver carregando para bloquear tudo */}
        {mutation.isPending && (
          <div className="absolute inset-0 z-50 bg-transparent cursor-wait" />
        )}

        <Typography as="p">
          Como foi o serviço{" "}
          <strong className="text-primary">{servico?.titulo}</strong>?
        </Typography>

        <p className="text-sm leading-relaxed text-dark-subtle">
          Sua avaliação ajuda outros clientes a escolherem com confiança e
          valoriza os bons profissionais da comunidade.
        </p>

        {servico && (
          <div className="rounded-xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-dark-subtle">
            Esta nota será atribuída à especialidade{" "}
            <strong className="text-accent">
              {formatTipoServico(servico.tipoServico)}
            </strong>
            .
          </div>
        )}

        <div
          className={`py-2 transition-opacity ${
            mutation.isPending ? "opacity-50" : ""
          }`}
        >
          <RatingInput
            rating={nota}
            onRatingChange={mutation.isPending ? () => {} : setNota}
          />
        </div>

        <Textarea
          name="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="O profissional foi pontual? O serviço ficou bom?"
          className="min-h-[100px]"
          disabled={mutation.isPending}
        />

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Avaliar depois
          </Button>
          <Button
            variant="secondary"
            className="w-full shadow-glow-accent"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></span>
                Enviando...
              </span>
            ) : (
              "Enviar Avaliação"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
