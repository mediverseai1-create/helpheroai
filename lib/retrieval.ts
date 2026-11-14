// Deterministic keyword retrieval over knowledge articles. No AI involved.
export interface Doc { id: string; title: string; body: string }

const STOP = new Set("a an the is are was were be to of and or in on for with how do i my can what when where why it this that you your we our at by from as not".split(" "));

export function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));
}

export function rank(query: string, docs: Doc[], limit = 3): { doc: Doc; score: number }[] {
  const q = new Set(tokens(query));
  if (q.size === 0) return [];
  return docs
    .map((doc) => {
      const title = new Set(tokens(doc.title));
      const body = new Set(tokens(doc.body));
      let score = 0;
      q.forEach((t) => { if (title.has(t)) score += 2; if (body.has(t)) score += 1; });
      return { doc, score: score / (q.size * 3) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
