import Link from "next/link";
import { MarketingShell } from "@/components/marketing";
import { PLANS, PAID_PLANS } from "@/lib/plans";

const modules = [
  { t: "Shared inbox", d: "Every customer conversation in one queue, with status, history and clear ownership." },
  { t: "Hero Agent", d: "Answers from your own knowledge base, shows its confidence, and escalates when it is unsure." },
  { t: "Knowledge Hub", d: "Write an article once. It powers the agent, the draft assistant and your public help center." },
  { t: "Draft replies", d: "Agents get a grounded reply suggestion they can edit and send. Nothing is auto-sent by the assistant." },
  { t: "Help center + chat page", d: "A public help center and a shareable chat page for every workspace." },
  { t: "Reports", d: "Volume, AI resolution rate and handoffs, calculated from your real conversations." },
];

const links: Record<string, string> = { "Shared inbox": "/product/inbox", "Hero Agent": "/product/agent", "Knowledge Hub": "/product/knowledge-hub" };

const faqs = [
  ["Does the AI make things up?", "Hero Agent answers only from the articles you write. If nothing relevant is found, or its confidence is below 60%, the conversation goes to your team instead."],
  ["What counts as an AI reply?", "Each answer Hero Agent generates counts toward your plan's monthly allowance, including tests in the dashboard. When the allowance is used up, chats go to your team rather than being billed extra."],
  ["Do I need a credit card to start?", "No. Every workspace starts with a 14-day trial and no card."],
  ["Can customers reach us without a website widget?", "Yes. Every workspace gets a hosted chat page and help center you can link to from anywhere."],
  ["Which channels are supported?", "Today: hosted chat and the help center. Email and messaging channels are on the roadmap, not live."],
  ["How is billing handled?", "Plans change only after the payment provider confirms payment. Returning from checkout never unlocks a plan by itself."],
];

function Section({ id, eyebrow, title, intro, children, tone }: { id?: string; eyebrow: string; title: string; intro?: string; children?: React.ReactNode; tone?: "sand" | "ink" }) {
  const bg = tone === "sand" ? "bg-sand" : tone === "ink" ? "bg-ink text-paper" : "";
  return (
    <section id={id} className={`py-20 ${bg}`}>
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold md:text-5xl">{title}</h2>
        {intro && <p className={`mt-4 max-w-2xl text-lg ${tone === "ink" ? "text-paper/70" : "text-ink/70"}`}>{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

/** Real product UI rendered from components, not a screenshot. Sample content is clearly labelled. */
function ConversationPreview() {
  return (
    <div className="card max-w-md space-y-3 text-sm" aria-label="Example conversation">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Example conversation</p>
      <p className="max-w-[85%] rounded-2xl border border-line p-3">How do I get a refund?</p>
      <p className="ml-auto max-w-[85%] rounded-2xl bg-mint p-3"><span className="mb-1 block text-xs opacity-70">Hero Agent · 100% · from “Refund policy”</span>Refunds are available within 30 days of purchase. Email billing to request one.</p>
      <p className="max-w-[85%] rounded-2xl border border-line p-3">Can you waive the shipping fee too?</p>
      <p className="ml-auto max-w-[85%] rounded-2xl bg-amber-100 p-3"><span className="mb-1 block text-xs opacity-70">Not in the knowledge base → handed to your team</span>Thanks, I have passed this to our team.</p>
    </div>
  );
}

export default function Home() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-20">
        <p className="eyebrow">AI + human customer support</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-[1.05] md:text-7xl">
          Support that answers fast and knows when to <span className="text-hero">hand over</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink/70">
          HelpHeroAI gives your team a shared inbox and an AI agent grounded in your own documentation. No guessing: if the answer is not in your knowledge base, a person steps in.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="btn-accent">Start 14-day free trial</Link>
          <Link href="/pricing" className="btn-ghost">See pricing</Link>
        </div>
        <p className="mt-3 text-sm text-ink/50">No card required.</p>
        <div className="mt-12"><ConversationPreview /></div>
      </section>

      <Section id="product" tone="sand" eyebrow="Product" title="One system for your customers, your agents and your AI." intro="Everything shares one customer record and one knowledge base, so the AI and your team never work from different answers.">
        <div className="grid gap-4 md:grid-cols-3">
          {modules.map((m) => (
            <div key={m.t} className="card">
              <h3 className="text-lg font-semibold">{m.t}</h3>
              <p className="mt-2 text-sm text-ink/70">{m.d}</p>
              {links[m.t] && <Link href={links[m.t]} className="mt-3 inline-block text-sm font-semibold text-hero underline">Learn more</Link>}
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Hero Agent" title="An AI agent that shows its work." intro="Every AI answer carries a confidence score and the articles it came from, so your team can see exactly why it said what it said.">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <ul className="space-y-5">
            {[["Grounded", "It reads only your Knowledge Hub. No outside guesses."], ["Honest about gaps", "No matching article means no AI call and an immediate handoff."], ["Testable", "Ask it questions in the dashboard before customers ever see it."], ["Capped", "Plan allowances stop surprise bills. Over the limit, chats go to people."]].map(([t, d]) => (
              <li key={t} className="border-t-2 border-ink pt-3"><p className="font-semibold">{t}</p><p className="text-sm text-ink/70">{d}</p></li>
            ))}
          </ul>
          <ConversationPreview />
        </div>
      </Section>

      <Section tone="sand" eyebrow="Inbox" title="Your team picks up exactly where the AI stopped." intro="Handed-off chats arrive with the full transcript. Reply directly, or ask the assistant for a draft you can edit first.">
        <div className="grid gap-4 md:grid-cols-3">
          {[["Clear statuses", "Open, AI resolved, needs a person, closed. Filter the queue in one click."], ["Full history", "The customer's messages, the AI's answers and its confidence, all in one thread."], ["Draft with AI", "A suggested reply built from your articles. You review it, then send."]].map(([t, d]) => (
            <div key={t} className="card"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-ink/70">{d}</p></div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Knowledge Hub" title="Write once. Answer everywhere." intro="Articles feed Hero Agent, the draft assistant and your public help center. Keep some internal, publish the rest.">
        <div className="grid gap-4 md:grid-cols-3">
          {[["Internal or public", "Toggle each article between agent-only knowledge and the public help center."], ["Instant effect", "Edit an article and the next answer uses it. No retraining step."], ["Shareable", "A hosted help center and chat page, ready to link from your site or emails."]].map(([t, d]) => (
            <div key={t} className="card"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-ink/70">{d}</p></div>
          ))}
        </div>
      </Section>

      <Section tone="sand" eyebrow="Reports" title="Numbers you can trust." intro="Report figures are plain counts from your conversations. The AI explains and answers; it never calculates your metrics.">
        <div className="grid gap-4 md:grid-cols-4">
          {["Conversations", "AI resolution rate", "Needs a person", "Conversations per day"].map((l) => (
            <div key={l} className="card"><p className="font-semibold">{l}</p></div>
          ))}
        </div>
      </Section>

      <Section id="how" eyebrow="How it works" title="From empty workspace to live in an afternoon.">
        <ol className="grid gap-6 md:grid-cols-4">
          {[["Create your workspace", "Sign up and name your company. No card."], ["Add help articles", "Paste in the answers you give most often."], ["Test and share", "Try Hero Agent, then share your chat page."], ["Work the inbox", "Handle handoffs and watch the reports."]].map(([s, d], i) => (
            <li key={s} className="border-t-2 border-ink pt-4">
              <span className="text-sm font-semibold text-hero">0{i + 1}</span>
              <p className="mt-1 font-semibold">{s}</p>
              <p className="text-sm text-ink/70">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="sand" eyebrow="Pricing" title="Simple plans. Clear AI limits.">
        <div className="grid gap-4 md:grid-cols-3">
          {PAID_PLANS.map((id) => {
            const p = PLANS[id];
            return (
              <div key={id} className="card">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-2 text-3xl font-bold">${p.priceMonthly}<span className="text-sm font-normal text-ink/60"> /month</span></p>
                <p className="mt-2 text-sm text-ink/70">{p.seats} seats · {p.aiRepliesPerMonth.toLocaleString()} AI replies / month</p>
              </div>
            );
          })}
        </div>
        <Link href="/pricing" className="btn-primary mt-6">Compare plans</Link>
      </Section>

      <Section eyebrow="FAQ" title="Questions, answered plainly.">
        <div className="max-w-3xl divide-y divide-line border-y border-line">
          {faqs.map(([q, a]) => (
            <details key={q} className="py-4">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-2 text-sm text-ink/70">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="bg-ink py-20 text-paper">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">Try it with your own help articles.</h2>
          <p className="mx-auto mt-3 max-w-xl text-paper/70">14 days free. No card. Your team stays in control.</p>
          <Link href="/signup" className="btn-accent mt-6">Start free trial</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
