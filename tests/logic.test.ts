import { test } from "node:test";
import assert from "node:assert/strict";
import { rank } from "../lib/retrieval.ts";
import { summarize, perDay } from "../lib/reports.ts";

test("rank finds relevant article and ignores unrelated", () => {
  const docs = [
    { id: "1", title: "How to reset your password", body: "Use the forgot password link on the sign in page." },
    { id: "2", title: "Shipping times", body: "Orders ship in 3 days." },
  ];
  const r = rank("I forgot my password", docs);
  assert.equal(r[0].doc.id, "1");
  assert.equal(rank("quantum entanglement", docs).length, 0);
});

test("summarize computes AI rate", () => {
  const rows = [
    { status: "ai_resolved", created_at: "2026-01-01T00:00:00Z" },
    { status: "ai_resolved", created_at: "2026-01-01T00:00:00Z" },
    { status: "needs_human", created_at: "2026-01-01T00:00:00Z" },
    { status: "closed", created_at: "2026-01-01T00:00:00Z" },
  ];
  const s = summarize(rows);
  assert.equal(s.total, 4);
  assert.equal(s.aiRate, 50);
  assert.equal(summarize([]).aiRate, 0);
});

test("perDay buckets", () => {
  const now = new Date("2026-01-14T10:00:00Z");
  const d = perDay([{ status: "open", created_at: "2026-01-14T01:00:00Z" }], 14, now);
  assert.equal(d.length, 14);
  assert.equal(d[13].count, 1);
});
