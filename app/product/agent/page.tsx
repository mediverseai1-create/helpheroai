import ProductPage from "@/components/ProductPage";

export const metadata = { title: "Hero Agent", description: "An AI agent that answers only from your knowledge base and hands off when unsure." };

export default function Page() {
  return (
    <ProductPage
      c={{
        slug: "agent",
        eyebrow: "Hero Agent",
        title: "An AI agent that answers from your docs and knows its limits.",
        intro: "Hero Agent reads the articles you wrote, answers with a confidence score, and passes the conversation to your team when it is not sure. It never answers from outside your knowledge base.",
        features: [
          { t: "Grounded answers", d: "Replies come only from your Knowledge Hub articles, with the sources recorded." },
          { t: "Confidence score", d: "Every answer carries a score. Below 60%, the chat goes to a person." },
          { t: "Honest handoff", d: "If no article matches, no AI call is made and the customer is told a person will reply." },
          { t: "Test console", d: "Ask questions as a customer in the dashboard and see the answer, confidence and sources before going live." },
          { t: "Usage limits", d: "Each plan has a monthly AI reply allowance. When it runs out, chats go to your team. No surprise charges." },
          { t: "Safe by design", d: "Customer messages and articles are treated as data, not instructions, and AI output is validated before use." },
        ],
        steps: [
          { t: "Find relevant articles", d: "A deterministic keyword search picks the closest articles. No AI is involved in this step." },
          { t: "Answer from them", d: "The AI model writes a short answer using only those articles and rates its own confidence." },
          { t: "Reply or hand off", d: "Confident answers go to the customer. Everything else lands in your inbox." },
        ],
        example: { label: "Example answer", lines: [
          { who: "Customer", text: "How do I get a refund?" },
          { who: "Hero Agent · 100% · from Refund policy", text: "Refunds are available within 30 days of purchase. Email billing to request one." },
        ] },
        connects: "Hero Agent reads from the Knowledge Hub and writes into the Inbox. Improve its answers by improving your articles, no retraining required.",
        faqs: [
          ["Can it make things up?", "It is instructed to answer only from your articles and to report low confidence when they do not cover the question. Low confidence and missing matches both trigger a handoff. Like any AI, it can still be wrong, so test it and keep articles accurate."],
          ["Which AI model does it use?", "Google Gemini, configured by the workspace operator."],
          ["Does testing use my allowance?", "Yes. Test console answers count as AI replies."],
        ],
      }}
    />
  );
}
