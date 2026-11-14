"use client";
import { useState } from "react";

interface Msg { who: "me" | "bot"; text: string }

export default function ChatBox({ slug }: { slug: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [conv, setConv] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const message = text.trim();
    if (!message || busy) return;
    setErr(null);
    setBusy(true);
    setMsgs((m) => [...m, { who: "me", text: message }]);
    setText("");
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, conversationId: conv, message }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      setConv(j.conversationId);
      setMsgs((m) => [...m, { who: "bot", text: j.reply }]);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Something went wrong.");
    }
    setBusy(false);
  }

  return (
    <div className="card">
      <div className="min-h-48 space-y-3" aria-live="polite">
        {msgs.length === 0 && <p className="text-sm text-ink/50">Ask a question to get started.</p>}
        {msgs.map((m, i) => <p key={i} className={`max-w-[85%] whitespace-pre-wrap rounded-2xl p-3 text-sm ${m.who === "me" ? "ml-auto bg-hero text-white" : "bg-sand"}`}>{m.text}</p>)}
        {busy && <p className="text-sm text-ink/50">Thinking…</p>}
      </div>
      {err && <p role="alert" className="mt-3 text-sm text-red-700">{err}</p>}
      <form onSubmit={send} className="mt-4 flex gap-2">
        <label htmlFor="msg" className="sr-only">Message</label>
        <input id="msg" className="input" value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} placeholder="Type your question" />
        <button className="btn-accent" disabled={busy}>Send</button>
      </form>
    </div>
  );
}
