import { requireContext } from "@/lib/session";
import { ArticleForm } from "@/components/Forms";
import { deleteArticle } from "../actions";

export const metadata = { title: "Knowledge Hub" };

export default async function Knowledge() {
  const { sb } = await requireContext();
  const { data } = await sb.from("articles").select("id,title,body,published").order("updated_at", { ascending: false });
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Knowledge Hub</h1>
      <p className="mt-2 text-sm text-ink/70">Hero Agent answers only from these articles. Published articles also appear in your public help center.</p>
      <div className="card mt-6"><h2 className="mb-3 font-semibold">New article</h2><ArticleForm /></div>
      <div className="mt-6 space-y-4">
        {(data ?? []).length === 0 && <p className="text-sm text-ink/60">No articles yet. Add one above.</p>}
        {(data ?? []).map((a) => (
          <details key={a.id} className="card">
            <summary className="cursor-pointer font-medium">{a.title} <span className="ml-2 text-xs text-ink/50">{a.published ? "Published" : "Internal"}</span></summary>
            <div className="mt-4"><ArticleForm a={a} /></div>
            <form action={deleteArticle} className="mt-3"><input type="hidden" name="id" value={a.id} /><button className="text-sm text-red-700 underline">Delete article</button></form>
          </details>
        ))}
      </div>
    </div>
  );
}
