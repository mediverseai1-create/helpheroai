import Link from "next/link";
import { MarketingShell } from "@/components/marketing";

export const PRODUCTS = [
  { href: "/product/inbox", name: "Inbox" },
  { href: "/product/agent", name: "Hero Agent" },
  { href: "/product/knowledge-hub", name: "Knowledge Hub" },
] as const;

export interface ProductContent {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  features: { t: string; d: string }[];
  steps: { t: string; d: string }[];
  example: { label: string; lines: { who: string; text: string }[] };
  connects: string;
  faqs: [string, string][];
}

export default function ProductPage({ c }: { c: ProductContent }) {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{c.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/70">{c.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="btn-accent">Start free trial</Link>
          <Link href="/pricing" className="btn-ghost">See pricing</Link>
        </div>
        <nav aria-label="Product pages" className="mt-10 flex flex-wrap gap-2 text-sm">
          {PRODUCTS.map((p) => (
            <Link key={p.href} href={p.href} className={`rounded-full border px-4 py-1.5 ${p.href.endsWith(c.slug) ? "border-ink bg-ink text-paper" : "border-line hover:bg-sand"}`}>{p.name}</Link>
          ))}
        </nav>
      </section>

      <section className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold md:text-4xl">What you get</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {c.features.map((f) => <div key={f.t} className="card"><h3 className="font-semibold">{f.t}</h3><p className="mt-2 text-sm text-ink/70">{f.d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
          <ol className="mt-6 space-y-5">
            {c.steps.map((s, i) => (
              <li key={s.t} className="border-t-2 border-ink pt-3"><span className="text-sm font-semibold text-hero">0{i + 1}</span><p className="font-semibold">{s.t}</p><p className="text-sm text-ink/70">{s.d}</p></li>
            ))}
          </ol>
        </div>
        <div className="card space-y-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">{c.example.label}</p>
          {c.example.lines.map((l, i) => (
            <p key={i} className="rounded-xl bg-sand p-3"><span className="mb-1 block text-xs text-ink/60">{l.who}</span>{l.text}</p>
          ))}
        </div>
      </section>

      <section className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold md:text-4xl">Works with the rest of HelpHeroAI</h2>
          <p className="mt-4 max-w-2xl text-ink/70">{c.connects}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {PRODUCTS.filter((p) => !p.href.endsWith(c.slug)).map((p) => <Link key={p.href} href={p.href} className="btn-ghost">{p.name} →</Link>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold md:text-4xl">Questions</h2>
        <div className="mt-6 max-w-3xl divide-y divide-line border-y border-line">
          {c.faqs.map(([q, a]) => <details key={q} className="py-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-sm text-ink/70">{a}</p></details>)}
        </div>
      </section>

      <section className="bg-ink py-16 text-paper">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Try it free for 14 days.</h2>
          <Link href="/signup" className="btn-accent mt-6">Start free trial</Link>
        </div>
      </section>
    </MarketingShell>
  );
}
