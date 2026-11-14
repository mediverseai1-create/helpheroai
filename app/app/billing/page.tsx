import { requireContext } from "@/lib/session";
import { aiUsage } from "@/lib/agent";
import { PLANS, PAID_PLANS, paymentLink, isActive } from "@/lib/plans";

export const metadata = { title: "Billing" };

function withRef(url: string, orgId: string) {
  try { const u = new URL(url); u.searchParams.set("client_reference_id", orgId); return u.toString(); } catch { return url; }
}

export default async function Billing() {
  const { org, sb } = await requireContext();
  const used = await aiUsage(org.id);
  const { count: seats } = await sb.from("members").select("user_id", { count: "exact", head: true });
  const plan = PLANS[org.plan];
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold">Billing</h1>
      <div className="card mt-6">
        <p className="text-sm text-ink/60">Current plan</p>
        <p className="text-2xl font-bold">{plan.name} <span className="text-sm font-normal text-ink/60">· {org.subscription_status.replace("_", " ")}</span></p>
        {org.subscription_status === "trialing" && <p className="mt-1 text-sm">Trial {isActive(org) ? "ends" : "ended"} {new Date(org.trial_ends_at).toLocaleDateString()}.</p>}
        <p className="mt-3 text-sm">AI replies: {used} / {plan.aiRepliesPerMonth.toLocaleString()} this month · Seats: {seats ?? 1} / {plan.seats}</p>
      </div>
      <h2 className="mt-8 text-xl font-semibold">Plans</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {PAID_PLANS.map((id) => {
          const p = PLANS[id];
          const m = paymentLink(id, false), a = paymentLink(id, true);
          return (
            <div key={id} className="card">
              <h3 className="font-semibold">{p.name}{org.plan === id && " (current)"}</h3>
              <p className="text-2xl font-bold">${p.priceMonthly}<span className="text-sm font-normal text-ink/60">/mo</span></p>
              <p className="text-xs text-ink/60">{p.seats} seats · {p.aiRepliesPerMonth.toLocaleString()} AI replies</p>
              <div className="mt-4 space-y-2">
                {m ? <a className="btn-primary w-full" href={withRef(m, org.id)}>Pay monthly</a> : <p className="text-xs text-ink/50">Monthly payment link not configured.</p>}
                {a && <a className="btn-ghost w-full" href={withRef(a, org.id)}>Pay annually (${p.priceAnnualPerMonth}/mo)</a>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-ink/60">Your plan changes only after payment is confirmed by our payment provider. Returning from checkout does not unlock anything by itself; confirmation usually arrives within a minute. To change or cancel a plan, contact support.</p>
    </div>
  );
}
