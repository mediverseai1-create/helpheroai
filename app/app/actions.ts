"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireContext } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase/server";

export type FormState = { error?: string; ok?: string } | undefined;

export async function signOut() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/");
}

const Ws = z.object({
  name: z.string().trim().min(2, "Workspace name is too short.").max(80),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{3,40}$/, "URL name: 3 to 40 letters, numbers or dashes."),
});

export async function createWorkspace(_: FormState, fd: FormData): Promise<FormState> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const p = Ws.safeParse({ name: fd.get("name"), slug: fd.get("slug") });
  if (!p.success) return { error: p.error.issues[0].message };
  const { error } = await sb.rpc("create_workspace", { p_name: p.data.name, p_slug: p.data.slug });
  if (error) return { error: error.code === "23505" ? "That URL name is taken." : "Could not create workspace." };
  redirect("/app");
}

const Article = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2, "Title is too short.").max(200),
  body: z.string().trim().min(1, "Write some content.").max(20000),
  published: z.boolean(),
});

export async function saveArticle(_: FormState, fd: FormData): Promise<FormState> {
  const { sb, org } = await requireContext();
  const p = Article.safeParse({
    id: fd.get("id") || undefined, title: fd.get("title"), body: fd.get("body"), published: fd.get("published") === "on",
  });
  if (!p.success) return { error: p.error.issues[0].message };
  const row = { title: p.data.title, body: p.data.body, published: p.data.published, updated_at: new Date().toISOString() };
  const { error } = p.data.id
    ? await sb.from("articles").update(row).eq("id", p.data.id)
    : await sb.from("articles").insert({ ...row, org_id: org.id });
  if (error) return { error: "Could not save the article." };
  revalidatePath("/app/knowledge");
  return { ok: "Saved." };
}

export async function deleteArticle(fd: FormData) {
  const { sb } = await requireContext();
  const id = z.string().uuid().safeParse(fd.get("id"));
  if (!id.success) return;
  await sb.from("articles").delete().eq("id", id.data);
  revalidatePath("/app/knowledge");
}

export async function sendReply(_: FormState, fd: FormData): Promise<FormState> {
  const { sb, org, user } = await requireContext();
  const p = z.object({ id: z.string().uuid(), body: z.string().trim().min(1, "Write a reply first.").max(8000) })
    .safeParse({ id: fd.get("id"), body: fd.get("body") });
  if (!p.success) return { error: p.error.issues[0].message };
  const { error } = await sb.from("messages").insert({ conversation_id: p.data.id, org_id: org.id, sender: "agent", body: p.data.body });
  if (error) return { error: "Could not send." };
  await sb.from("conversations").update({ updated_at: new Date().toISOString(), assignee: user.id, status: "open" }).eq("id", p.data.id);
  revalidatePath(`/app/inbox/${p.data.id}`);
  return { ok: "Reply sent." };
}

export async function setStatus(fd: FormData) {
  const { sb } = await requireContext();
  const p = z.object({ id: z.string().uuid(), status: z.enum(["open", "closed"]) }).safeParse({ id: fd.get("id"), status: fd.get("status") });
  if (!p.success) return;
  await sb.from("conversations").update({ status: p.data.status, updated_at: new Date().toISOString() }).eq("id", p.data.id);
  revalidatePath("/app/inbox");
  revalidatePath(`/app/inbox/${p.data.id}`);
}

export async function renameOrg(_: FormState, fd: FormData): Promise<FormState> {
  const { sb, org } = await requireContext();
  const p = z.string().trim().min(2).max(80).safeParse(fd.get("name"));
  if (!p.success) return { error: "Name must be 2 to 80 characters." };
  const { error } = await sb.from("organizations").update({ name: p.data }).eq("id", org.id);
  if (error) return { error: "Only owners and admins can rename the workspace." };
  revalidatePath("/app", "layout");
  return { ok: "Saved." };
}
