import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function Article({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = supabaseAdmin();
  const { data: org } = await db.from("organizations").select("id").eq("slug", slug).maybeSingle();
  if (!org) notFound();
  const { data: a } = await db.from("articles").select("title,body").eq("id", id).eq("org_id", org.id).eq("published", true).maybeSingle();
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Link href={`/help/${slug}`} className="text-sm underline">← All articles</Link>
      <h1 className="mt-3 text-3xl font-bold">{a.title}</h1>
      <div className="mt-6 whitespace-pre-wrap leading-relaxed">{a.body}</div>
    </main>
  );
}
