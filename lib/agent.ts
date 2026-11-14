import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rank } from "@/lib/retrieval";
import { askGemini, buildPrompt, AGENT_SYSTEM, AiError } from "@/lib/ai";
import { PLANS, isActive, type PlanId } from "@/lib/plans";

export const CONFIDENCE_THRESHOLD = 0.6;

export function monthStart(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function aiUsage(orgId: string) {
  const { count } = await supabaseAdmin()
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .gte("created_at", monthStart());
  return count ?? 0;
}

export type AgentResult =
  | { kind: "ai"; answer: string; confidence: number; articleIds: string[]; resolved: boolean }
  | { kind: "handoff"; reason: string };

/** Produces a grounded answer, or an explicit handoff. Never fabricates when knowledge is missing. */
export async function answerQuestion(orgId: string, question: string): Promise<AgentResult> {
  const db = supabaseAdmin();
  const { data: org } = await db.from("organizations").select("plan,subscription_status,trial_ends_at").eq("id", orgId).single();
  if (!org || !isActive(org)) return { kind: "handoff", reason: "Workspace subscription is inactive." };
  const limit = PLANS[org.plan as PlanId].aiRepliesPerMonth;
  if ((await aiUsage(orgId)) >= limit) return { kind: "handoff", reason: "Monthly AI reply limit reached." };

  const { data: arts } = await db.from("articles").select("id,title,body").eq("org_id", orgId);
  const top = rank(question, arts ?? []);
  if (top.length === 0) return { kind: "handoff", reason: "No relevant knowledge found." };

  try {
    const out = await askGemini(AGENT_SYSTEM, buildPrompt(question, top.map((t) => t.doc)));
    await db.from("usage_events").insert({ org_id: orgId, kind: "ai_reply" });
    const valid = new Set(top.map((t) => t.doc.id));
    return {
      kind: "ai",
      answer: out.answer,
      confidence: out.confidence,
      articleIds: out.used_article_ids.filter((id) => valid.has(id)),
      resolved: out.confidence >= CONFIDENCE_THRESHOLD,
    };
  } catch (e) {
    return { kind: "handoff", reason: e instanceof AiError ? e.message : "AI unavailable." };
  }
}
