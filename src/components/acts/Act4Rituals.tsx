"use client";

import { useMemo, useState } from "react";
import { Cassette, MiniCassetteBar } from "@/components/Cassette";
import { ReceiptCard } from "@/components/ReceiptCard";
import {
  formatDate,
  getRituals,
  inr,
  soundtrackForMoment,
  soundtrackLine,
  t,
} from "@/lib/data";

type Props = {
  onNext: () => void;
  onJourney?: (momentId: string) => void;
  onBack?: () => void;
  onPlay: (uri: string, title: string, artist: string) => void;
};

export function Act4Rituals({ onNext, onJourney, onBack, onPlay }: Props) {
  const rituals = useMemo(() => getRituals(), []);
  const [idx, setIdx] = useState(
    Math.max(
      0,
      rituals.findIndex((r) => r.id === "r-milk"),
    ),
  );
  const ritual = rituals[idx] ?? rituals[0];
  if (!ritual) return null;

  const countMatch = ritual.hero?.text.en.match(/×(\d+)/);
  const count = countMatch ? countMatch[1] : String(ritual.receipt_count);
  const sumMatch = ritual.hero?.text.en.match(/₹[\d,]+/);
  const sum =
    sumMatch?.[0] ??
    inr(ritual.receipts.reduce((s, r) => s + r.amt, 0));
  const notes = ritual.receipts
    .map((r) => r.label)
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3);
  const snd = soundtrackLine(
    soundtrackForMoment(ritual.id) ?? ritual.soundtrack,
  );

  return (
    <div className="anim-fade-up relative flex flex-col items-center gap-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Close rituals"
          className="absolute right-0 top-0 z-20 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-cream backdrop-blur-sm transition hover:border-cream hover:bg-black/60 sm:right-[calc(50%-11rem)]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      )}

      <ReceiptCard>
        <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-ink-soft uppercase">
          {t(ritual.title)}
        </p>

        <div className="relative mt-3 mb-2">
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 font-[family-name:var(--font-hand)] text-ink/15 text-lg tracking-widest overflow-hidden whitespace-nowrap select-none"
            aria-hidden
          >
            {"|||| || ||| |||| || ||| |||| || ||| ".repeat(3)}
          </div>
          <p className="relative font-[family-name:var(--font-display)] text-[72px] sm:text-[88px] leading-none text-ink">
            {count}
          </p>
        </div>

        <p className="font-[family-name:var(--font-display)] italic text-[17px] text-ink-soft leading-snug max-w-[16rem]">
          {t(ritual.line).replace(/^\D*\d+\s*/, "").replace(/^times?\.\s*/i, "") ||
            "times. Nobody thinks they'll remember that."}
        </p>

        <div className="border-t border-dashed border-ink/20 my-4" />
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-ink-soft">
          {formatDate(ritual.range[0])} → {formatDate(ritual.range[1])} · {sum}
        </p>

        <ul className="mt-4 space-y-2">
          {notes.map((n) => (
            <li
              key={n}
              className="font-[family-name:var(--font-hand)] text-[18px] text-hand flex items-center gap-2"
            >
              <span className="text-ink/40">✓</span>
              {n}
            </li>
          ))}
        </ul>

        {snd && (
          <MiniCassetteBar
            caption="the song you kept returning to"
            onPlay={() => onPlay(snd.uri, snd.title, snd.artist)}
          />
        )}
      </ReceiptCard>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="text-white/40 hover:text-cream disabled:opacity-20 text-sm"
        >
          ←
        </button>
        <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-white/40 uppercase">
          Ritual {idx + 1} of {rituals.length}
        </p>
        <button
          type="button"
          disabled={idx >= rituals.length - 1}
          onClick={() => setIdx((i) => Math.min(rituals.length - 1, i + 1))}
          className="text-white/40 hover:text-cream disabled:opacity-20 text-sm"
        >
          →
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-md">
        {rituals.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setIdx(i)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-[family-name:var(--font-mono)] border transition ${
              i === idx
                ? "border-amber text-amber bg-amber/10"
                : "border-white/15 text-white/45 hover:text-cream"
            }`}
          >
            {r.title.en}
          </button>
        ))}
      </div>

      {snd && (
        <div className="flex flex-col items-center gap-2">
          <Cassette
            label={snd.title}
            mark="▶"
            size="sm"
            onClick={() => onPlay(snd.uri, snd.title, snd.artist)}
          />
          <p className="text-[11px] text-white/40 font-[family-name:var(--font-mono)]">
            {snd.caption} · {snd.artist}
          </p>
        </div>
      )}

      <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {onJourney && (
          <button
            type="button"
            onClick={() => onJourney(ritual.id)}
            className="rounded-full border border-amber/50 bg-amber/10 px-5 py-2.5 font-[family-name:var(--font-display)] text-lg text-amber transition hover:bg-amber/20"
          >
            See this journey →
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          className="text-cream underline underline-offset-4 decoration-white/35 hover:decoration-cream font-[family-name:var(--font-display)] text-lg"
        >
          All constellations →
        </button>
      </div>
    </div>
  );
}
