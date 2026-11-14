"use client";
import { useActionState, useState } from "react";
import { createWorkspace, saveArticle, sendReply, renameOrg, type FormState } from "@/app/app/actions";

function Msg({ s }: { s: FormState }) {
  if (!s) return null;
  return s.error ? <p role="alert" className="text-sm text-red-700">{s.error}</p> : s.ok ? <p role="status" className="text-sm text-green-800">{s.ok}</p> : null;
}

export function WorkspaceForm() {
  const [s, act, pending] = useActionState(createWorkspace, undefined);
  const [slug, setSlug] = useState("");
  return (
    <form action={act} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">Company name</label>
        <input id="name" name="name" className="input" required minLength={2} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40))} />
      </div>
      <div>
        <label className="label" htmlFor="slug">URL name</label>
        <input id="slug" name="slug" className="input" required value={slug} onChange={(e) => setSlug(e.target.value)} />
        <p className="mt-1 text-xs text-ink/60">Used for your public help center and chat page.</p>
      </div>
      <Msg s={s} />
      <button className="btn-accent w-full" disabled={pending}>{pending ? "Creating…" : "Create workspace"}</button>
    </form>
  );
}

export function ArticleForm({ a }: { a?: { id: string; title: string; body: string; published: boolean } }) {
  const [s, act, pending] = useActionState(saveArticle, undefined);
  return (
    <form action={act} className="space-y-3">
      {a && <input type="hidden" name="id" value={a.id} />}
      <div>
        <label className="label" htmlFor={`t${a?.id ?? "new"}`}>Title</label>
        <input id={`t${a?.id ?? "new"}`} name="title" className="input" defaultValue={a?.title} required />
      </div>
      <div>
        <label className="label" htmlFor={`b${a?.id ?? "new"}`}>Content</label>
        <textarea id={`b${a?.id ?? "new"}`} name="body" rows={a ? 6 : 8} className="input" defaultValue={a?.body} required />
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={a?.published} /> Show in public help center</label>
      <Msg s={s} />
      <button className="btn-primary" disabled={pending}>{pending ? "Saving…" : a ? "Save changes" : "Add article"}</button>
    </form>
  );
}

export function ReplyForm({ id }: { id: string }) {
  const [s, act, pending] = useActionState(sendReply, undefined);
  const [text, setText] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);
  async function draft() {
    setDrafting(true);
    setNote(null);
    try {
      const r = await fetch("/api/draft", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId: id }) });
      const j = await r.json();
      if (j.draft) { setText(j.draft); setNote(`Draft from your knowledge base (confidence ${Math.round(j.confidence * 100)}%). Review before sending.`); }
      else setNote(j.reason ?? j.error ?? "No draft available.");
    } catch { setNote("Could not reach the AI service."); }
    setDrafting(false);
  }
  return (
    <form action={async (fd) => { await act(fd); setText(""); }} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <label className="label" htmlFor="reply">Reply</label>
      <textarea id="reply" name="body" rows={4} className="input" value={text} onChange={(e) => setText(e.target.value)} required />
      {note && <p className="text-xs text-ink/60">{note}</p>}
      <Msg s={s} />
      <div className="flex gap-2">
        <button className="btn-primary" disabled={pending}>{pending ? "Sending…" : "Send reply"}</button>
        <button type="button" className="btn-ghost" onClick={draft} disabled={drafting}>{drafting ? "Drafting…" : "Draft with AI"}</button>
      </div>
    </form>
  );
}

export function RenameForm({ name }: { name: string }) {
  const [s, act, pending] = useActionState(renameOrg, undefined);
  return (
    <form action={act} className="space-y-3">
      <label className="label" htmlFor="wname">Workspace name</label>
      <input id="wname" name="name" className="input" defaultValue={name} required />
      <Msg s={s} />
      <button className="btn-primary" disabled={pending}>Save</button>
    </form>
  );
}

export function AgentTester() {
  const [q, setQ] = useState("");
  const [out, setOut] = useState<{ answer?: string; confidence?: number; reason?: string; sources?: string[] } | null>(null);
  const [busy, setBusy] = useState(false);
  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    setOut(null);
    try {
      const r = await fetch("/api/agent-test", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: q }) });
      setOut(await r.json());
    } catch { setOut({ reason: "Could not reach the AI service." }); }
    setBusy(false);
  }
  return (
    <div className="space-y-4">
      <form onSubmit={run} className="space-y-3">
        <label className="label" htmlFor="q">Ask as a customer</label>
        <textarea id="q" rows={3} className="input" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-accent" disabled={busy}>{busy ? "Thinking…" : "Test Hero Agent"}</button>
      </form>
      {out && (
        <div className="card">
          {out.answer ? (<>
            <p>{out.answer}</p>
            <p className="mt-3 text-xs text-ink/60">Confidence {Math.round((out.confidence ?? 0) * 100)}% · {(out.confidence ?? 0) >= 0.6 ? "would answer the customer" : "would hand off to a person"}</p>
            {out.sources && out.sources.length > 0 && <p className="text-xs text-ink/60">Sources: {out.sources.join(", ")}</p>}
          </>) : <p className="text-sm">Would hand off to a person. Reason: {out.reason ?? "unknown"}</p>}
        </div>
      )}
    </div>
  );
}
