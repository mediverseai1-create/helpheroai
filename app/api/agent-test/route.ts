import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { answerQuestion } from "@/lib/agent";

export async function POST(req: Request) {
  const p = z.object({ question: z.string().trim().min(1).max(2000) }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ reason: "Enter a question." }, { status: 400 });
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ reason: "Unauthorized" }, { status: 401 });
  const { data: m } = await sb.from("members").select("org_id").eq("user_id", user.id).limit(1).maybeSingle();
  if (!m) return NextResponse.json({ reason: "No workspace" }, { status: 403 });
  const r = await answerQuestion(m.org_id, p.data.question);
  if (r.kind === "handoff") return NextResponse.json({ reason: r.reason });
  const { data: arts } = r.articleIds.length ? await supabaseAdmin().from("articles").select("title").in("id", r.articleIds) : { data: [] };
  return NextResponse.json({ answer: r.answer, confidence: r.confidence, sources: (arts ?? []).map((a) => a.title) });
}
