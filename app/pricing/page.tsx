import Link from "next/link";
import { MarketingShell } from "@/components/marketing";
import { PLANS, PAID_PLANS } from "@/lib/plans";

export const metadata = { title: "Pricing" };

export default function Pricing() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="eyebrow">Pricing</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Simple plans. Clear AI limits.</h1>
        <p className="mt-4 max-w-xl text-ink/70">Every plan starts with a 14-day trial. Plans include seats and a monthly allowance of AI replies. When the allowance is used, conversations go to your team instead of being billed unexpectedly.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PAID_PLANS.map((id) => {
            const p = PLANS[id];
            const hl = id === "growth";
            return (
              <div key={id} className={`card flex flex-col ${hl ? "border-2 border-hero" : ""}`}>
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="mt-3 text-4xl font-bold">${p.priceMonthly}<span className="text-base font-normal text-ink/60"> /month</span></p>
                <p className="text-sm text-ink/60">or ${p.priceAnnualPerMonth}/month billed annually</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  <li>{p.seats} seats</li>
                  <li>{p.aiRepliesPerMonth.toLocaleString()} AI replies / month</li>
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <Link href="/signup" className={`mt-6 ${hl ? "btn-accent" : "btn-primary"}`}>Start free trial</Link>
              </div>
            );
          })}
        </div>
      </section>
    </MarketingShell>
  );
}
