import ProductPage from "@/components/ProductPage";

export const metadata = { title: "Inbox", description: "A shared inbox where AI handoffs land with the full conversation." };

export default function Page() {
  return (
    <ProductPage
      c={{
        slug: "inbox",
        eyebrow: "Inbox",
        title: "One queue for every conversation, with the AI's work attached.",
        intro: "When Hero Agent cannot answer, your team gets the whole thread: what the customer asked, what the AI said and how sure it was. Reply, draft with AI, or close it out.",
        features: [
          { t: "Clear statuses", d: "Open, AI resolved, needs a person and closed. Filter the queue with one click." },
          { t: "Full transcript", d: "Customer messages, AI answers with confidence, and your team's replies in one thread." },
          { t: "Reply in place", d: "Answer the customer from the conversation. Their chat page shows your reply." },
          { t: "Draft with AI", d: "Get a suggested reply built from your articles. It fills the box for you to edit, and is never sent automatically." },
          { t: "Close and reopen", d: "Mark conversations done and bring them back if the customer returns." },
          { t: "Private to your workspace", d: "Row-level security keeps every workspace's conversations separate from all others." },
        ],
        steps: [
          { t: "A customer chats", d: "They use your hosted chat page. Hero Agent replies if your articles cover the question." },
          { t: "Unanswered chats are flagged", d: "Low confidence or no matching article moves the conversation to Needs a person." },
          { t: "Your team replies", d: "Open the thread, optionally draft with AI, review and send." },
        ],
        example: { label: "Example thread", lines: [
          { who: "Customer", text: "Can you waive the shipping fee?" },
          { who: "Hero Agent · handed off", text: "Thanks, I have passed this to our team." },
          { who: "Your team", text: "Yes, we have removed the fee from your order." },
        ] },
        connects: "The inbox is fed by Hero Agent and the chat page, and the draft assistant uses your Knowledge Hub, so the AI and your team always work from the same answers.",
        faqs: [
          ["Which channels does the inbox support?", "Hosted chat today. Email and messaging channels are on the roadmap and are not live yet."],
          ["Can several teammates work the inbox?", "Yes, up to your plan's seat count. Team invitations are not built yet."],
          ["Are AI drafts sent automatically?", "No. A draft only fills the reply box. You review and send it."],
        ],
      }}
    />
  );
}
