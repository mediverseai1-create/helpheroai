import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { answerQuestion } from "@/lib/agent";

// Agent-facing: draft a reply. Auth + RLS verify the agent can see the conversation.
export async function POST(req: Request) {
  const p = z.object({ conversationId: z.string().uuid() }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: conv } = await sb.from("conversations").select("id,org_id").eq("id", p.data.conversationId).single();
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data: msgs } = await sb
    .from("messages")
    .select("body")
    .eq("conversation_id", conv.id)
    .eq("sender", "customer")
    .order("created_at", { ascending: false })
    .limit(1);
  const q = msgs?.[0]?.body;
  if (!q) return NextResponse.json({ error: "No customer message" }, { status: 400 });
  const r = await answerQuestion(conv.org_id, q);
  if (r.kind === "handoff") return NextResponse.json({ draft: null, reason: r.reason });
  return NextResponse.json({ draft: r.answer, confidence: r.confidence });
}
