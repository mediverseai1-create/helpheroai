import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

const Event = z.object({
  org_id: z.string().uuid(),
  plan: z.enum(["starter", "growth", "scale"]),
  status: z.enum(["active", "past_due", "canceled"]),
  customer_ref: z.string().max(200).optional(),
});

// Trusted payment confirmation. Plans change only here (or via admin SQL), never from a browser redirect.
export async function POST(req: Request) {
  const secret = process.env.BILLING_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const raw = await req.text();
  const sig = req.headers.get("x-helphero-signature") ?? "";
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const ev = Event.safeParse(body);
  if (!ev.success) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const { error } = await supabaseAdmin()
    .from("organizations")
    .update({ plan: ev.data.plan, subscription_status: ev.data.status, billing_customer_ref: ev.data.customer_ref ?? null })
    .eq("id", ev.data.org_id);
  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
