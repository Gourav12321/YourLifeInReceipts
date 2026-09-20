"use client";

import { useMemo, useState } from "react";
import { formatDate, inr, ledger, pack, searchLedger } from "@/lib/data";
import type { LedgerRow } from "@/lib/types";

const QUICK = [
  { label: "milk", q: "milk" },
  { label: "two", q: "2 " },
  { label: "Aai", q: "aai" },
  { label: "movie", q: "ticket" },
  { label: "farewell", q: "farewell" },
  { label: "gift", q: "gift" },
];

export function PocketView() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<LedgerRow | null>(null);

  const results = useMemo(() => {
    if (tag) {
      return ledger.filter((r) => r.tags.includes(tag)).slice(-60).reverse();
    }
    return searchLedger(q, 50);
  }, [q, tag]);

  const onThisDay = useMemo(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const suffix = `-${mm}-${dd}`;
    const byYear: Record<string, LedgerRow[]> = {};
    for (const r of ledger) {
      if (r.d.endsWith(suffix)) {
        const y = r.d.slice(0, 4);
        (byYear[y] ||= []).push(r);
      }
    }
    return byYear;
  }, []);

  return (
    <div className="anim-fade-up max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream">
          Pocket
        </h2>
        <p className="text-sm text-white/45 mt-1">
          Search {pack.meta.sources.ledger.rows.toLocaleString()} receipts ·{" "}
          {pack.meta.sources.ledger.from} → {pack.meta.sources.ledger.to}
        </p>
      </div>

      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setTag(null);
        }}
        placeholder="Search notes, categories, places…"
        className="w-full rounded-full bg-white/5 border border-white/15 px-5 py-3 text-cream placeholder:text-white/30 outline-none focus:border-amber/50 font-[family-name:var(--font-mono)] text-sm"
      />

      <div className="flex flex-wrap gap-2">
        {QUICK.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setQ(item.q);
              setTag(null);
            }}
            className="px-3 py-1 rounded-full border border-white/15 text-[11px] text-white/55 hover:text-cream hover:border-white/35 font-[family-name:var(--font-mono)]"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setTag("ritual:milk");
            setQ("");
          }}
          className="px-3 py-1 rounded-full border border-amber/40 text-[11px] text-amber font-[family-name:var(--font-mono)]"
        >
          tag:milk
        </button>
        <button
          type="button"
          onClick={() => {
            setTag("two");
            setQ("");
          }}
          className="px-3 py-1 rounded-full border border-amber/40 text-[11px] text-amber font-[family-name:var(--font-mono)]"
        >
          tag:two
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="rounded-2xl border border-white/10 bg-black/25 max-h-[55vh] overflow-y-auto scrollbar-thin divide-y divide-white/5">
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelected(r)}
              className={`w-full text-left px-4 py-3 hover:bg-white/5 transition ${
                selected?.id === r.id ? "bg-white/8" : ""
              }`}
            >
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-[family-name:var(--font-hand)] text-lg text-cream truncate">
                    {r.n || r.s || r.c || "(blank)"}
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-[10px] text-white/40">
                    {r.id} · {formatDate(r.d)}
                    {r.t ? ` ${r.t}` : ""} · {r.c}
                  </p>
                </div>
                <p className="font-[family-name:var(--font-mono)] text-sm text-amber shrink-0">
                  {r.ty === "I" ? "+" : ""}
                  {inr(r.a)}
                </p>
              </div>
            </button>
          ))}
          {results.length === 0 && (
            <p className="p-6 text-sm text-white/40">No receipts matched.</p>
          )}
        </div>

        <div className="space-y-4">
          {selected && (
            <div className="paper rounded-xl p-4 anim-fade-up">
              <p className="font-[family-name:var(--font-mono)] text-[10px] text-ink/40 tracking-wider">
                {selected.id}
              </p>
              <p className="font-[family-name:var(--font-hand)] text-2xl text-hand mt-1">
                {selected.n || selected.s || selected.c}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-sm text-ink mt-2">
                {formatDate(selected.d)}
                {selected.t ? ` · ${selected.t}` : ""}
              </p>
              <p className="font-[family-name:var(--font-display)] text-xl text-ink mt-2">
                {inr(selected.a)}
              </p>
              <p className="text-xs text-ink-soft mt-2">
                {selected.c}
                {selected.s ? ` / ${selected.s}` : ""} · {selected.ty}
              </p>
              {selected.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {selected.tags.map((tg) => (
                    <span
                      key={tg}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-ink/5 font-[family-name:var(--font-mono)]"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="font-[family-name:var(--font-hand)] text-xl text-cream mb-3">
              on this day
            </p>
            {Object.keys(onThisDay).length === 0 && (
              <p className="text-sm text-white/40 font-[family-name:var(--font-mono)]">
                — no ledger entries for today&apos;s date across years
              </p>
            )}
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
              {Object.entries(onThisDay)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([year, rows]) => (
                  <div key={year}>
                    <p className="font-[family-name:var(--font-mono)] text-[10px] text-amber mb-1">
                      {year}
                    </p>
                    {rows.slice(0, 3).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelected(r)}
                        className="block text-left text-sm text-white/70 hover:text-cream truncate w-full"
                      >
                        {r.n || r.s || r.c} · {inr(r.a)}
                      </button>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
