import ProductPage from "@/components/ProductPage";

export const metadata = { title: "Knowledge Hub", description: "Write help articles once and use them for your AI agent and public help center." };

export default function Page() {
  return (
    <ProductPage
      c={{
        slug: "knowledge-hub",
        eyebrow: "Knowledge Hub",
        title: "Write the answer once. Use it everywhere.",
        intro: "Your articles are the single source of truth. They power Hero Agent, the draft assistant and your public help center, so customers and your team always get the same answer.",
        features: [
          { t: "Simple editor", d: "Add a title and write the answer. No formatting setup or training step." },
          { t: "Internal or public", d: "Keep an article for the AI and your team only, or publish it to your help center." },
          { t: "Hosted help center", d: "Every workspace gets a public help center page at its own address." },
          { t: "Instant updates", d: "Edit an article and the very next AI answer uses the new text." },
          { t: "Used everywhere", d: "The same articles feed the agent, the draft assistant and the help center." },
          { t: "Your data stays yours", d: "Articles are private to your workspace unless you publish them." },
        ],
        steps: [
          { t: "Add your common answers", d: "Start with the questions your team answers most often." },
          { t: "Choose what is public", d: "Tick publish for articles customers should see in the help center." },
          { t: "Test with Hero Agent", d: "Ask questions in the test console and fill any gaps you find." },
        ],
        example: { label: "Example article", lines: [
          { who: "Title", text: "Refund policy" },
          { who: "Content", text: "Refunds are available within 30 days of purchase. Email billing to request a refund." },
        ] },
        connects: "The Knowledge Hub feeds Hero Agent, which hands unanswered questions to your Inbox. Those handoffs show you which articles to write next.",
        faqs: [
          ["Is there a limit on articles?", "No article limit is enforced. Each article can be up to 20,000 characters."],
          ["Can I import existing help content?", "Not yet. Today you add articles by pasting them in."],
          ["Do internal articles appear publicly?", "No. Only articles marked as published appear in the help center."],
        ],
      }}
    />
  );
}
