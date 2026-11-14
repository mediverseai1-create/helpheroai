import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ChatBox from "./ChatBox";

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: org } = await supabaseAdmin().from("organizations").select("name").eq("slug", slug).maybeSingle();
  if (!org) notFound();
  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <h1 className="text-2xl font-bold">Chat with {org.name}</h1>
      <p className="mb-5 text-sm text-ink/60">Our assistant answers from our help articles and brings in a person when needed.</p>
      <ChatBox slug={slug} />
    </main>
  );
}
