import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export interface Org {
  id: string; name: string; slug: string; plan: "trial" | "starter" | "growth" | "scale";
  subscription_status: string; trial_ends_at: string;
}

/** Current user + workspace. Redirects to login/onboarding as needed. */
export async function requireContext() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: m } = await sb.from("members").select("role, organizations(id,name,slug,plan,subscription_status,trial_ends_at)").eq("user_id", user.id).limit(1).maybeSingle();
  const org = (m?.organizations as unknown as Org | null) ?? null;
  if (!org || !m) redirect("/onboarding");
  return { sb, user, org, role: m.role as string };
}
