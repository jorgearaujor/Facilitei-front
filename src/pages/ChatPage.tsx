import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client, type IMessage } from "@stomp/stompjs";
import { useAuthStore } from "../store/useAuthStore";
import { Typography } from "../components/ui/Typography";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { api, uploadFile } from "../lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface ChatMessage {
  id: number;
  remetente: string;
  conteudo: string;
  tipo: "TEXTO" | "IMAGEM";
  urlArquivo?: string;
  dataEnvio: string;
}

const stompConfig = {
  brokerURL: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/buildrun-livechat-websocket`,
  reconnectDelay: 5000,
};

const readCsrfCookie = (): string => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="));
  return cookie ? decodeURIComponent(cookie.substring("XSRF-TOKEN=".length)) : "";
};

export function ChatPage() {
  const { servicoId } = useParams<{ servicoId: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (servicoId) {
      api
        .get<ChatMessage[]>(`/chat/historico/${servicoId}`)
        .then((res) => setMessages(res.data))
        .catch(() => toast.error("Erro ao carregar histórico."));
    }
  }, [servicoId]);

  useEffect(() => {
    if (!user || !servicoId) return;
    const client = new Client(stompConfig);
    client.beforeConnect = async () => {
      client.connectHeaders = { "X-XSRF-TOKEN": readCsrfCookie() };
    };
    stompClientRef.current = client;

    client.onConnect = () => {
      setIsConnected(true);
      client.subscribe(`/topics/chat/${servicoId}`, (msg: IMessage) => {
        const newMessage: ChatMessage = JSON.parse(msg.body);
        setMessages((prev) => [...prev, newMessage]);
      });
    };
    client.onWebSocketError = () => setIsConnected(false);
    client.activate();

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [user, servicoId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !isConnected) return;

    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: `/app/chat/${servicoId}`,
        body: JSON.stringify({
          servicoId,
          user: user?.nome,
          message: inputText,
          type: "TEXTO",
        }),
      });
      setInputText("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const toastId = toast.loading("Enviando imagem...");

    try {
      const url = await uploadFile(file);
      if (stompClientRef.current) {
        stompClientRef.current.publish({
          destination: `/app/chat/${servicoId}`,
          body: JSON.stringify({
            servicoId,
            user: user?.nome,
            message: "Imagem enviada",
            type: "IMAGEM",
            fileUrl: url,
          }),
        });
      }
      toast.success("Enviado!", { id: toastId });
    } catch {
      toast.error("Erro no upload.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-8rem)] min-h-0 max-w-4xl flex-col md:h-[calc(100dvh-8.75rem)]">
      {/* Header do Chat */}
      <div className="mb-3 flex shrink-0 items-center justify-between rounded-xl border border-white/10 bg-dark-surface/80 p-3 shadow-lg backdrop-blur-md sm:mb-4 sm:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-dark-subtle hover:text-white transition-colors"
          >
            ← Voltar
          </button>
          <div className="min-w-0">
            <Typography as="h2" className="truncate !text-base font-bold sm:!text-lg">
              Chat do Serviço #{servicoId}
            </Typography>
            <span
              className={`text-xs flex items-center gap-1 ${
                isConnected ? "text-accent" : "text-red-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-accent animate-pulse" : "bg-red-500"
                }`}
              />
              {isConnected ? "Online" : "Reconectando..."}
            </span>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <Card className="min-h-0 flex-1 space-y-4 overflow-y-auto border-white/5 bg-dark-background/40 p-3 sm:p-6">
        {messages.map((msg, idx) => {
          const isMe = msg.remetente === user?.nome;
          return (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md sm:max-w-[60%] sm:p-4 sm:text-base ${
                  isMe
                    ? "bg-primary text-slate-50 rounded-tr-none"
                    : "bg-dark-surface text-dark-text rounded-tl-none border border-white/10"
                }`}
              >
                {!isMe && (
                  <p className="text-xs text-accent font-bold mb-1">
                    {msg.remetente}
                  </p>
                )}

                {msg.tipo === "IMAGEM" ? (
                  <img
                    src={msg.urlArquivo}
                    alt="Anexo"
                    className="rounded-lg max-h-60 w-full object-cover cursor-pointer hover:opacity-90"
                    onClick={() => window.open(msg.urlArquivo, "_blank")}
                  />
                ) : (
                  <p className="break-words leading-relaxed">{msg.conteudo}</p>
                )}

                <p
                  className={`text-[10px] mt-2 text-right ${
                    isMe ? "text-white/60" : "text-dark-subtle"
                  }`}
                >
                  {new Date(msg.dataEnvio).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </Card>

      {/* Input Area */}
      <div className="mt-3 flex shrink-0 items-center gap-1 rounded-xl border border-primary/20 bg-dark-surface p-1.5 shadow-lg sm:mt-4 sm:gap-2 sm:p-2">
        <label
          className={`shrink-0 cursor-pointer rounded-full p-2.5 text-dark-subtle transition-colors hover:bg-white/5 hover:text-accent sm:p-3 ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={!isConnected || isUploading}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </label>

        <div className="min-w-0 flex-1">
          <Input
            label=""
            name="chat"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="border-none bg-transparent px-0 !shadow-none focus:ring-0"
            disabled={!isConnected}
            autoComplete="off"
          />
        </div>

        <Button
          onClick={() => handleSendMessage()}
          disabled={!isConnected || !inputText.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-hover p-0 shadow-glow-primary sm:h-12 sm:w-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
