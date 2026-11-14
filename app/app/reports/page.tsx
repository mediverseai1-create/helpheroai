import { requireContext } from "@/lib/session";
import { summarize, perDay } from "@/lib/reports";

export const metadata = { title: "Reports" };

export default async function Reports() {
  const { sb } = await requireContext();
  const { data } = await sb.from("conversations").select("status,created_at");
  const rows = data ?? [];
  const s = summarize(rows);
  const days = perDay(rows);
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold">Reports</h1>
      <p className="mt-2 text-sm text-ink/70">Calculated directly from your conversations. AI resolution rate = AI resolved ÷ all conversations.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["Conversations", s.total], ["AI resolution rate", `${s.aiRate}%`], ["Needs a person", s.needsHuman], ["Closed", s.closed]].map(([l, v]) => (
          <div key={l} className="card"><p className="text-sm text-ink/60">{l}</p><p className="mt-1 text-3xl font-bold">{v}</p></div>
        ))}
      </div>
      <div className="card mt-6">
        <h2 className="font-semibold">Conversations per day (last 14 days)</h2>
        {s.total === 0 ? <p className="mt-3 text-sm text-ink/60">No data yet.</p> : (
          <div className="mt-4 flex h-40 items-end gap-1" role="img" aria-label="Bar chart of conversations per day">
            {days.map((d) => <div key={d.day} title={`${d.day}: ${d.count}`} className="flex-1 rounded-t bg-hero" style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 4 : 1 }} />)}
          </div>
        )}
      </div>
    </div>
  );
}
