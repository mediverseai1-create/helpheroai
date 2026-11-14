import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { WorkspaceForm } from "@/components/Forms";
import { Logo } from "@/components/marketing";

export const metadata = { title: "Create your workspace" };

export default async function Onboarding() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: m } = await sb.from("members").select("org_id").eq("user_id", user.id).limit(1).maybeSingle();
  if (m) redirect("/app");
  return (
    <div className="flex min-h-screen flex-col px-5 py-6">
      <Logo />
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <h1 className="text-3xl font-bold">Set up your workspace</h1>
        <p className="mb-6 mt-2 text-sm text-ink/70">Your 14-day trial starts now. No card needed.</p>
        <WorkspaceForm />
      </div>
    </div>
  );
}
