import { useState, useRef, useEffect, FormEvent } from "react";
import { ChatMessage } from "../types";
import { X, Send, User, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModelForBooking: (modelName: string) => void;
}

export default function ChatAdvisor({ isOpen, onClose }: ChatAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Bienvenido al canal de atención de **EPSA Motor**. Te ayudamos a cotizar mototaxis Torito Bajaj del catálogo oficial (**2T UG**, **CROM PLUS**, **Torito 250**, **MAXIMA GLP**), financiamiento y visitas en **Comas, Ventanilla o Puente Piedra**. WhatsApp: **+51 907 721 481**. ¿En qué te ayudamos hoy?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Requisitos para crédito",
    "Precio CROM PLUS GSL",
    "Mejor moto para carga",
    "Sede Comas",
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Server expects { messages: [{ role, content }, ...] } including the new user message
      const messagesPayload = [
        ...messages.slice(-8).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user" as const, content: textToSend },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesPayload,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al conectar con el asesor.");
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "Estimado cliente, disculpe el inconveniente. Tuvimos un problema de conexión temporal. ¿Podría volver a enviar su consulta? También puede comunicarse telefónicamente o visitarnos en Comas, Puente Piedra o Ventanilla.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "Bienvenido de nuevo. Chat reiniciado. ¿Tiene alguna consulta técnica o sobre financiamiento de nuestros modelos?",
        timestamp: new Date(),
      }
    ]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 240 }}
          className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-[#131c2e] z-50 flex flex-col shadow-2xl border-l border-[#1e2e4a]"
        >
      
      {/* Chat Header */}
      <div className="bg-[#60a5fa] text-white p-4 flex justify-between items-center border-b border-[#060a13]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#060a13]/15 border border-[#1e2e4a]/25 flex items-center justify-center text-white shadow-xs shrink-0">
            <span className="font-display font-bold text-xs">EPSA</span>
          </div>
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">Asesoría de Ventas</h4>
            <p className="text-[9px] text-[#60a5fa] uppercase tracking-widest font-bold font-mono">EPSA Motor — Concesionario</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            title="Reiniciar conversación"
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-[#1e3a8a]/10 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Cerrar ventana"
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-[#1e3a8a]/10 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#060a13] space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-[9px] font-bold ${
                  isAssistant ? "bg-[#131c2e] border border-[#1e2e4a] text-[#60a5fa]" : "bg-[#060a13] border border-[#1e2e4a] text-[#60a5fa]"
                }`}
              >
                {isAssistant ? "EPSA" : <User className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1">
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed shadow-xs border ${
                    isAssistant
                      ? "bg-[#131c2e] border-[#1e2e4a] text-[#e2e8f0] rounded-tl-none"
                      : "bg-[#60a5fa] border-[#60a5fa] text-white rounded-tr-none"
                  }`}
                >
                  {/* Markdown-like simple bold rendering */}
                  {msg.content.split("\n").map((line, lineIdx) => (
                    <p key={lineIdx} className={lineIdx > 0 ? "mt-1.5" : ""}>
                      {line.split("**").map((chunk, chunkIdx) => {
                        if (chunkIdx % 2 === 1) {
                          return <strong key={chunkIdx} className="font-bold text-[#60a5fa]">{chunk}</strong>;
                        }
                        return chunk;
                      })}
                    </p>
                  ))}
                </div>
                <span className={`text-[9px] text-[#71717a] block px-1 ${!isAssistant ? "text-right" : ""}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex gap-2.5 mr-auto max-w-[80%]">
            <div className="w-7 h-7 rounded-xl bg-[#131c2e] border border-[#1e2e4a] text-[#60a5fa] flex items-center justify-center text-[9px] font-bold">
              EPSA
            </div>
            <div className="bg-[#131c2e] border border-[#1e2e4a] p-3.5 rounded-xl rounded-tl-none shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#60a5fa] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#60a5fa] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-[#60a5fa] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Slider */}
      {messages.length === 1 && !loading && (
        <div className="bg-[#060a13] border-t border-[#1e2e4a] p-3 overflow-x-auto">
          <p className="text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider mb-2 px-1">Preguntas Frecuentes:</p>
          <div className="flex gap-2 whitespace-nowrap pb-1">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="bg-[#131c2e] hover:bg-[#1a263e] border border-[#1e2e4a] text-[#60a5fa] hover:text-[#f1f5f9] text-[11px] px-3.5 py-2 rounded-xl cursor-pointer transition-all shrink-0 shadow-xs font-bold"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Footer Input */}
      <form onSubmit={handleFormSubmit} className="bg-[#060a13] border-t border-[#1e2e4a] p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu consulta aquí..."
          className="flex-1 border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-xl px-3 text-xs text-[#f1f5f9] bg-[#131c2e] placeholder-zinc-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-[#60a5fa] hover:bg-[#1e3a8a] disabled:bg-[#1a263e] text-white disabled:text-zinc-500 p-2.5 rounded-xl cursor-pointer transition-all shrink-0 border border-[#60a5fa] disabled:border-[#1e2e4a]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
