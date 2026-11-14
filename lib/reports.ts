// Deterministic report maths.
export interface ConvRow { status: string; created_at: string }

export function summarize(rows: ConvRow[]) {
  const total = rows.length;
  const count = (s: string) => rows.filter((r) => r.status === s).length;
  const aiResolved = count("ai_resolved");
  const needsHuman = count("needs_human");
  const closed = count("closed");
  const open = count("open");
  const handled = aiResolved + needsHuman + closed;
  const aiRate = total === 0 ? 0 : Math.round((aiResolved / total) * 1000) / 10;
  return { total, open, aiResolved, needsHuman, closed, handled, aiRate };
}

export function perDay(rows: ConvRow[], days = 14, now = new Date()) {
  const out: { day: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    out.push({ day: d.toISOString().slice(0, 10), count: 0 });
  }
  rows.forEach((r) => { const o = out.find((x) => x.day === r.created_at.slice(0, 10)); if (o) o.count++; });
  return out;
}
