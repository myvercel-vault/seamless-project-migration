import { lazy, Suspense, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Loader2, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { askMascot } from "@/lib/mascot.functions";

const FoxMascot3D = lazy(() => import("./FoxMascot3D"));

type Msg = { role: "fox" | "user"; text: string };

const QUESTIONS = [
  "Hi, I'm Jom! Is there something I can help you with today?",
  "Woof... I mean hello! What would you like to know about the maintenance?",
  "Hey there! Want to ask me when we'll be back?",
  "Hi! Tell me what's on your mind and I'll try to answer.",
];

export default function MascotStage() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const turn = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  const scroll = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 30);

  const onTap = () => {
    if (busy) return;
    if (!open) {
      setOpen(true);
      setMessages([{ role: "fox", text: QUESTIONS[0] ?? "Hi!" }]);
    } else if (messages.length === 1) {
      turn.current = (turn.current + 1) % QUESTIONS.length;
      setMessages([{ role: "fox", text: QUESTIONS[turn.current] ?? "Hi!" }]);
    }
  };

  const send = async () => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setText("");
    setBusy(true);
    scroll();
    try {
      const { reply } = await askMascot({ data: { history: next.slice(-8) } });
      setMessages([...next, { role: "fox", text: reply }]);
    } catch {
      setMessages([...next, { role: "fox", text: "Oops, I couldn't reach my brain. Please try again!" }]);
    } finally {
      setBusy(false);
      scroll();
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative aspect-square w-full">
        <ClientOnly
          fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading mascot…</div>}
        >
          <Suspense
            fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading mascot…</div>}
          >
            <FoxMascot3D onTap={onTap} />
          </Suspense>
        </ClientOnly>
        {!open && (
          <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-full border bg-surface-bright px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
            Tap me! 👆
          </div>
        )}
      </div>

      {open && (
        <div className="fade-rise mx-auto -mt-4 w-full rounded-2xl border bg-card/95 p-3 shadow-2xl backdrop-blur" role="dialog" aria-label="Chat with Jom">
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span>Jom the Fox</span>
            <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-48 space-y-2 overflow-y-auto pr-1" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-3 py-2 text-sm text-secondary-foreground"
                  }
                >
                  {m.text}
                </p>
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Jom is thinking…
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask Jom anything…"
              maxLength={300}
              aria-label="Your question"
              className="h-10 rounded-xl"
            />
            <button
              type="submit"
              disabled={busy || !text.trim()}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
