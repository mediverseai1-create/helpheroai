import { MarketingShell } from "@/components/marketing";

export const metadata = { title: "About" };

export default function About() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="eyebrow">About</p>
        <h1 className="mt-3 text-4xl font-bold">Support software that is honest about what the AI knows.</h1>
        <p className="mt-6 text-ink/70">HelpHeroAI is built around one rule: an AI agent should answer only from your documentation, show how confident it is, and hand over to a person when it is not sure. Your team stays in control, and every number in your reports is calculated from real conversations.</p>
      </section>
    </MarketingShell>
  );
}
