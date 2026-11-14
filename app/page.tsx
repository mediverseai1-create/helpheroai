import Link from "next/link";
import { MarketingShell } from "@/components/marketing";

const modules = [
  { t: "Shared inbox", d: "Every customer conversation in one queue, with status, history and clear ownership." },
  { t: "Hero Agent", d: "Answers from your own knowledge base, shows its confidence, and escalates when it is unsure." },
  { t: "Knowledge Hub", d: "Write an article once. It powers the agent, the draft assistant and your public help center." },
  { t: "Draft replies", d: "Agents get a grounded reply suggestion they can edit and send, never auto-sent." },
  { t: "Help center + chat page", d: "A public help center and a shareable chat page for every workspace." },
  { t: "Reports", d: "Volume, AI resolution rate and handoffs, calculated from your real conversations." },
];

export default function Home() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20">
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
      </section>

      <section id="product" className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">Product</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl">One system for your customers, your agents and your AI.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {modules.map((m) => (
              <div key={m.t} className="card">
                <h3 className="text-lg font-semibold">{m.t}</h3>
                <p className="mt-2 text-sm text-ink/70">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 py-16">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">From empty workspace to live in an afternoon.</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {["Create your workspace", "Add help articles", "Test and share your chat page", "Work the inbox and watch reports"].map((s, i) => (
            <li key={s} className="border-t-2 border-ink pt-4">
              <span className="text-sm font-semibold text-hero">0{i + 1}</span>
              <p className="mt-1 font-semibold">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-ink py-16 text-paper">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Try it with your own help articles.</h2>
          <Link href="/signup" className="btn-accent mt-6">Start free trial</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
