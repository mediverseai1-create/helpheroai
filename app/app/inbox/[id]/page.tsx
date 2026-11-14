import { notFound } from "next/navigation";
import Link from "next/link";
import { requireContext } from "@/lib/session";
import { ReplyForm } from "@/components/Forms";
import { setStatus } from "../../actions";

export default async function Conversation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { sb } = await requireContext();
  const { data: c } = await sb.from("conversations").select("*").eq("id", id).maybeSingle();
  if (!c) notFound();
  const { data: msgs } = await sb.from("messages").select("id,sender,body,confidence,created_at").eq("conversation_id", id).order("created_at");
  const closed = c.status === "closed";
  return (
    <div className="max-w-3xl">
      <Link href="/app/inbox" className="text-sm underline">← Inbox</Link>
      <h1 className="mt-2 text-2xl font-bold">{c.subject}</h1>
      <p className="text-sm text-ink/60">{c.customer_name}{c.customer_email ? ` · ${c.customer_email}` : ""} · {c.status.replace("_", " ")}</p>
      <div className="mt-6 space-y-3">
        {(msgs ?? []).map((m) => (
          <div key={m.id} className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.sender === "customer" ? "bg-white border border-line" : m.sender === "ai" ? "ml-auto bg-mint" : "ml-auto bg-hero text-white"}`}>
            <p className="mb-1 text-xs opacity-70">{m.sender === "ai" ? `Hero Agent${m.confidence != null ? ` · ${Math.round(m.confidence * 100)}%` : ""}` : m.sender === "agent" ? "Your team" : "Customer"}</p>
            <p className="whitespace-pre-wrap">{m.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8"><ReplyForm id={id} /></div>
      <form action={setStatus} className="mt-4">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={closed ? "open" : "closed"} />
        <button className="btn-ghost">{closed ? "Reopen" : "Close conversation"}</button>
      </form>
    </div>
  );
}
