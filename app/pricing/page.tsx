import Link from "next/link";
import { MarketingShell } from "@/components/marketing";
import { PLANS, PAID_PLANS } from "@/lib/plans";

export const metadata = { title: "Pricing" };

const everyPlan = [
  ["Shared inbox", "All conversations in one queue with statuses, history and replies."],
  ["Hero Agent", "AI answers grounded in your own articles, with confidence and sources."],
  ["Knowledge Hub", "Unlimited articles, internal or published."],
  ["Draft replies", "A suggested answer for agents to review and edit before sending."],
  ["Help center and chat page", "Hosted pages for your customers, ready to link."],
  ["Reports", "Conversation volume, AI resolution rate and handoffs."],
];

const faqs = [
  ["How does the free trial work?", "Every new workspace gets 14 days with 2 seats and 50 AI replies. No card is needed."],
  ["What happens if we use all our AI replies?", "New chats go straight to your team. You are never charged extra for AI replies."],
  ["Can I change plans?", "Yes. Pay for the plan you want from the Billing page. To downgrade or cancel, contact support."],
  ["When does my plan change after I pay?", "When the payment provider confirms the payment to us, usually within a minute. Returning from checkout alone changes nothing."],
  ["What is a seat?", "A teammate who can sign in and work the inbox."],
];

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
                  <li className="font-semibold">{p.seats} seats</li>
                  <li className="font-semibold">{p.aiRepliesPerMonth.toLocaleString()} AI replies / month</li>
                  {p.features.map((f) => <li key={f}>✓ {f}</li>)}
                </ul>
                <Link href="/signup" className={`mt-6 ${hl ? "btn-accent" : "btn-primary"}`}>Start free trial</Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">Included in every plan</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">The whole product, from day one.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {everyPlan.map(([t, d]) => <div key={t} className="card"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-ink/70">{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="eyebrow">Compare plans</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">What changes between plans</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Plan comparison</caption>
            <thead><tr className="border-b-2 border-ink"><th className="py-3 pr-4">&nbsp;</th>{PAID_PLANS.map((id) => <th key={id} className="py-3 pr-4">{PLANS[id].name}</th>)}</tr></thead>
            <tbody>
              {[
                ["Price per month", (id: (typeof PAID_PLANS)[number]) => `$${PLANS[id].priceMonthly}`],
                ["Price per month, annual", (id: (typeof PAID_PLANS)[number]) => `$${PLANS[id].priceAnnualPerMonth}`],
                ["Seats", (id: (typeof PAID_PLANS)[number]) => String(PLANS[id].seats)],
                ["AI replies per month", (id: (typeof PAID_PLANS)[number]) => PLANS[id].aiRepliesPerMonth.toLocaleString()],
                ["Support", (id: (typeof PAID_PLANS)[number]) => (id === "starter" ? "Email" : id === "growth" ? "Priority email" : "Priority + onboarding call")],
              ].map(([label, fn]) => (
                <tr key={label as string} className="border-b border-line">
                  <th scope="row" className="py-3 pr-4 font-medium">{label as string}</th>
                  {PAID_PLANS.map((id) => <td key={id} className="py-3 pr-4">{(fn as (i: (typeof PAID_PLANS)[number]) => string)(id)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink/50">Prices and limits shown are launch placeholders and may change before general availability.</p>
      </section>

      <section className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Pricing questions</h2>
          <div className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
            {faqs.map(([q, a]) => <details key={q} className="py-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-sm text-ink/70">{a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-paper">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Start with 14 days free.</h2>
          <Link href="/signup" className="btn-accent mt-6">Start free trial</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
