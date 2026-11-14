import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { answerQuestion } from "@/lib/agent";

const Body = z.object({
  slug: z.string().regex(/^[a-z0-9-]{3,40}$/),
  conversationId: z.string().uuid().optional(),
  name: z.string().trim().max(80).optional(),
  email: z.string().email().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

// Public endpoint for the customer chat page. Uses the service role, so it validates org and conversation itself.
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { slug, conversationId, name, email, message } = parsed.data;
  const db = supabaseAdmin();
  const { data: org } = await db.from("organizations").select("id").eq("slug", slug).single();
  if (!org) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  let convId = conversationId;
  if (convId) {
    const { data: c } = await db.from("conversations").select("id").eq("id", convId).eq("org_id", org.id).single();
    if (!c) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  } else {
    const { data: c, error } = await db
      .from("conversations")
      .insert({ org_id: org.id, customer_name: name || "Visitor", customer_email: email || null, subject: message.slice(0, 80) })
      .select("id")
      .single();
    if (error || !c) return NextResponse.json({ error: "Could not start conversation" }, { status: 500 });
    convId = c.id as string;
  }
  await db.from("messages").insert({ conversation_id: convId, org_id: org.id, sender: "customer", body: message });

  const result = await answerQuestion(org.id, message);
  const resolved = result.kind === "ai" && result.resolved;
  const reply = resolved && result.kind === "ai" ? result.answer : "Thanks, I have passed this to our team and someone will reply here soon.";
  await db.from("messages").insert({
    conversation_id: convId,
    org_id: org.id,
    sender: "ai",
    body: reply,
    confidence: result.kind === "ai" ? result.confidence : null,
    source_article_ids: result.kind === "ai" && resolved ? result.articleIds : [],
  });
  await db
    .from("conversations")
    .update({ status: resolved ? "ai_resolved" : "needs_human", updated_at: new Date().toISOString() })
    .eq("id", convId);
  return NextResponse.json({ conversationId: convId, reply, handedOff: !resolved });
}
