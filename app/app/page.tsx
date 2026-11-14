import Link from "next/link";
import { requireContext } from "@/lib/session";
import { summarize } from "@/lib/reports";
import { aiUsage } from "@/lib/agent";
import { PLANS } from "@/lib/plans";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const { sb, org } = await requireContext();
  const [{ data: convs }, { count: articles }, used] = await Promise.all([
    sb.from("conversations").select("status,created_at"),
    sb.from("articles").select("id", { count: "exact", head: true }),
    aiUsage(org.id),
  ]);
  const s = summarize(convs ?? []);
  const limit = PLANS[org.plan].aiRepliesPerMonth;
  const stats = [["Open or waiting", s.open + s.needsHuman], ["AI resolved", s.aiResolved], ["Total conversations", s.total], ["Articles", articles ?? 0]];
  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([l, v]) => <div key={l} className="card"><p className="text-sm text-ink/60">{l}</p><p className="mt-1 text-3xl font-bold">{v}</p></div>)}
      </div>
      <div className="card mt-6">
        <p className="font-semibold">AI replies this month</p>
        <p className="text-sm text-ink/60">{used} of {limit.toLocaleString()} on the {PLANS[org.plan].name} plan</p>
        <div className="mt-3 h-2 rounded-full bg-sand" role="progressbar" aria-valuenow={used} aria-valuemax={limit}><div className="h-2 rounded-full bg-hero" style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} /></div>
      </div>
      {(articles ?? 0) === 0 && (
        <div className="card mt-6">
          <h2 className="font-semibold">Get started</h2>
          <p className="mt-1 text-sm text-ink/70">Add your first help article so Hero Agent has something to answer from.</p>
          <Link href="/app/knowledge" className="btn-accent mt-4">Add an article</Link>
        </div>
      )}
      <div className="card mt-6">
        <h2 className="font-semibold">Share with customers</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>Chat page: <Link className="underline" href={`/chat/${org.slug}`}>/chat/{org.slug}</Link></li>
          <li>Help center: <Link className="underline" href={`/help/${org.slug}`}>/help/{org.slug}</Link></li>
        </ul>
      </div>
    </div>
  );
}
