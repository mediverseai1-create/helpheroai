import Link from "next/link";
import { requireContext } from "@/lib/session";

export const metadata = { title: "Inbox" };
const label: Record<string, string> = { open: "Open", ai_resolved: "AI resolved", needs_human: "Needs a person", closed: "Closed" };

export default async function Inbox({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  const { sb } = await requireContext();
  let q = sb.from("conversations").select("id,customer_name,subject,status,updated_at").order("updated_at", { ascending: false }).limit(100);
  if (s && label[s]) q = q.eq("status", s);
  const { data } = await q;
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold">Inbox</h1>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link className="btn-ghost !py-1.5" href="/app/inbox">All</Link>
        {Object.entries(label).map(([k, v]) => <Link key={k} className="btn-ghost !py-1.5" href={`/app/inbox?s=${k}`}>{v}</Link>)}
      </div>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
        {(data ?? []).map((c) => (
          <li key={c.id}>
            <Link href={`/app/inbox/${c.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-sand">
              <span className="min-w-0"><span className="block truncate font-medium">{c.subject}</span><span className="text-sm text-ink/60">{c.customer_name}</span></span>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${c.status === "needs_human" ? "bg-amber-100" : c.status === "ai_resolved" ? "bg-mint" : "bg-sand"}`}>{label[c.status]}</span>
            </Link>
          </li>
        ))}
        {(data ?? []).length === 0 && <li className="p-8 text-center text-sm text-ink/60">No conversations yet. Share your chat page with a customer or try it yourself.</li>}
      </ul>
    </div>
  );
}
