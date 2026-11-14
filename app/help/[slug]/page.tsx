import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function HelpCenter({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = supabaseAdmin();
  const { data: org } = await db.from("organizations").select("id,name").eq("slug", slug).maybeSingle();
  if (!org) notFound();
  const { data: arts } = await db.from("articles").select("id,title").eq("org_id", org.id).eq("published", true).order("title");
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-4xl font-bold">{org.name} help center</h1>
      <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
        {(arts ?? []).map((a) => <li key={a.id}><Link className="block p-4 hover:bg-sand" href={`/help/${slug}/${a.id}`}>{a.title}</Link></li>)}
        {(arts ?? []).length === 0 && <li className="p-6 text-sm text-ink/60">No articles published yet.</li>}
      </ul>
      <p className="mt-6 text-sm">Can not find an answer? <Link className="underline" href={`/chat/${slug}`}>Chat with us</Link>.</p>
    </main>
  );
}
