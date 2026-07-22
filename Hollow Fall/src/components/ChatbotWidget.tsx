import { MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const STARTER_MESSAGES: Message[] = [
  {
    role: "assistant",
    text: "Ask me about Hollow Fall: release, story, characters, enemies, platforms, or support.",
  },
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(STARTER_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", text: question }]);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) {
        throw new Error("Chatbot backend is not available.");
      }

      const data = (await response.json()) as { answer?: string };
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.answer || "I couldn't find that information in the Hollow Fall knowledge base.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Start the local chatbot backend on port 8000, then ask again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[260] font-sans">
      {open && (
        <section className="mb-4 flex h-[520px] w-[min(380px,calc(100vw-2.5rem))] flex-col border border-primary/50 bg-background/95 shadow-2xl backdrop-blur-md">
          <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div>
              <p className="font-display text-xl tracking-wider text-foreground">HOLLOWFALL ASSISTANT</p>
              <p className="font-serif-h text-[9px] text-muted-foreground">LOCAL KNOWLEDGE BASE</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center border border-border/70 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] border px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto border-primary/50 bg-primary/15 text-foreground"
                    : "border-border/70 bg-card text-muted-foreground"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[88%] border border-border/70 bg-card px-3 py-2 text-sm text-muted-foreground">
                Searching Hollow Fall data...
              </div>
            )}
          </div>

          <form onSubmit={submitMessage} className="flex gap-2 border-t border-border/60 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about the game..."
              className="min-w-0 flex-1 border border-border/70 bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="grid h-10 w-10 place-items-center border border-primary/60 bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="grid h-14 w-14 place-items-center border border-primary/70 bg-primary text-primary-foreground shadow-2xl transition-transform hover:-translate-y-1"
        style={{ boxShadow: "0 0 36px oklch(0.45 0.22 25 / 0.65)" }}
        aria-label="Open Hollow Fall assistant"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
