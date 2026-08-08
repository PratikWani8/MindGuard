import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, BookMarked, AlertCircle, RotateCcw } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import { sendChatMessage } from "../../services/chatApi";
import { chatSuggestedPrompts } from "../../data/mockData";
import { cn } from "../../utils/cn";

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I'm the MindGuard assistant. I can help you understand your patterns, suggest grounded coping techniques, and point you to real resources — I'm not a therapist or doctor, so for clinical concerns please reach a professional.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setError("");
    setInput("");
    const userMsg = { id: "u_" + Date.now(), role: "user", text: content };
    setMessages((m) => [...m, userMsg]);
    setSending(true);
    try {
      const reply = await sendChatMessage(content, messages);
      setMessages((m) => [...m, { id: reply.id, role: "assistant", text: reply.text, sources: reply.sources }]);
    } catch (e) {
      setError("The assistant couldn't respond right now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-9rem)]">
      <GlassCard strong className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-violet-100/70">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-display font-semibold text-ink-900">MindGuard Assistant</p>
            <p className="text-xs text-ink-400">Grounded, referenced answers — not a substitute for professional care</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5 space-y-4">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user" ? "bg-gradient-to-br from-violet-500 to-aqua-500 text-white" : "bg-white/80 text-ink-700 border border-violet-100"
                )}
              >
                <p>{m.text}</p>
                {m.sources && (
                  <div className="mt-2.5 pt-2.5 border-t border-violet-100/70 space-y-1">
                    {m.sources.map((s) => (
                      <div key={s} className="flex items-center gap-1.5 text-[11px] text-violet-500">
                        <BookMarked size={11} /> {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-white/80 border border-violet-100 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-calm-red bg-red-50 rounded-xl px-3 py-2 w-fit">
              <AlertCircle size={14} /> {error}
              <button onClick={() => send(messages[messages.length - 1]?.text)} className="ml-1"><RotateCcw size={13} /></button>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {chatSuggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-xs bg-violet-50 text-violet-700 px-3 py-2 rounded-xl font-medium hover:bg-violet-100 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-violet-100/70 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask MindGuard something…"
            className="flex-1 px-4 py-2.75 rounded-xl border border-violet-100 bg-white/70 text-sm focus-ring focus:border-violet-300"
          />
          <Button size="md" onClick={() => send()} disabled={sending || !input.trim()}>
            <Send size={16} />
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
