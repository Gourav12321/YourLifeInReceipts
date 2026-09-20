"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  byMomentId,
  formatDate,
  formatDateShort,
  inr,
  pack,
  soundtrackLine,
  t,
} from "@/lib/data";
import type { Moment } from "@/lib/types";

type Slip = {
  id: string;
  momentId: string;
  label: string;
  amt: number;
  date: string;
  cat?: string;
  sub?: string;
};

type Props = {
  onDone: () => void;
  onClose: () => void;
  onJourney?: (momentId: string) => void;
  onPlay?: (uri: string, title: string, artist: string) => void;
};

export function Act1Rewind({ onDone, onClose, onJourney, onPlay }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const slips = useMemo(() => {
    const fromPath: Slip[] = [];
    for (const id of pack.rewind_path) {
      const m = byMomentId[id];
      if (!m) continue;
      if (m.receipts?.length) {
        for (const r of m.receipts.slice(0, 2)) {
          fromPath.push({
            id: `${m.id}-${r.id}`,
            momentId: m.id,
            label: r.label || m.title.en,
            amt: r.amt,
            date: r.date,
            cat: r.cat,
            sub: r.sub,
          });
        }
      } else {
        fromPath.push({
          id: m.id,
          momentId: m.id,
          label: m.title.en,
          amt: 0,
          date: m.range[1],
        });
      }
    }
    if (fromPath.length < 12) {
      for (const m of pack.moments) {
        if (fromPath.length >= 28) break;
        const r = m.receipts?.[0];
        if (!r) continue;
        fromPath.push({
          id: `extra-${r.id}`,
          momentId: m.id,
          label: r.label,
          amt: r.amt,
          date: r.date,
          cat: r.cat,
          sub: r.sub,
        });
      }
    }
    return fromPath.slice(0, 36);
  }, []);

  const openSlip = slips.find((s) => s.id === openId) ?? null;
  const openMoment: Moment | undefined = openSlip
    ? byMomentId[openSlip.momentId]
    : undefined;
  const snd = soundtrackLine(openMoment?.soundtrack ?? null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      const p = max <= 0 ? 1 : Math.min(1, el.scrollTop / max);
      setProgress(p);
      if (p > 0.55) setReady(true);
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const years = useMemo(() => {
    return [...new Set(slips.map((s) => s.date.slice(0, 4)))].sort();
  }, [slips]);

  return (
    <div className="anim-fade-up relative mx-auto flex w-full max-w-2xl flex-col gap-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close rewind"
        className="absolute right-0 top-0 z-20 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-cream backdrop-blur-sm transition hover:border-cream hover:bg-black/60"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>

      <div className="px-2 text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl text-cream">
          Rewind
        </p>
        <p className="mt-1 text-sm text-white/45">
          Scroll the years — tap any receipt to open it.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
        <div className="absolute left-0 top-0 z-20 h-1 w-full bg-white/5">
          <div
            className="h-full bg-amber transition-[width] duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr]">
          <div className="relative border-r border-white/10 py-8">
            <div className="sticky top-8 flex flex-col items-center gap-6 px-1">
              <span className="font-[family-name:var(--font-mono)] text-[9px] tracking-wider text-white/35">
                {years[0] ?? "2015"}
              </span>
              <div className="h-24 w-px bg-gradient-to-b from-white/30 to-amber/50" />
              <span className="font-[family-name:var(--font-mono)] text-[9px] tracking-wider text-amber">
                {years[years.length - 1] ?? "2018"}
              </span>
            </div>
          </div>

          <div
            ref={scroller}
            className="h-[min(62vh,520px)] overflow-y-auto overscroll-contain px-3 py-6 sm:px-5 scrollbar-thin"
          >
            <div className="mx-auto flex max-w-md flex-col gap-3 pb-28">
              {slips.map((s, i) => {
                const tilt = ((i % 5) - 2) * 1.2;
                const older = i / Math.max(slips.length - 1, 1);
                const selected = openId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setOpenId(s.id)}
                    className={`paper rounded-md px-4 py-3 text-left shadow-lg transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/70 ${
                      selected ? "ring-2 ring-amber/80" : ""
                    }`}
                    style={{
                      transform: `rotate(${tilt}deg)`,
                      opacity: 0.55 + older * 0.45,
                      filter: `saturate(${1 - older * 0.35})`,
                    }}
                  >
                    <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-wide text-ink-soft">
                      {formatDateShort(s.date)}
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-mono)] text-[13px] leading-snug text-ink">
                      {s.label}
                      {s.amt > 0 ? (
                        <span className="text-ink-soft"> · {inr(s.amt)}</span>
                      ) : null}
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-hand)] text-[13px] text-hand/70">
                      tap to open
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/95 to-transparent px-4 pb-5 pt-16 text-center">
          <p className="mb-3 font-[family-name:var(--font-hand)] text-xl text-cream/80">
            {ready ? "you’ve gone far enough" : "keep scrolling"}
          </p>
          <button
            type="button"
            onClick={onDone}
            className="pointer-events-auto inline-flex items-center rounded-full border border-cream/35 bg-black/40 px-5 py-2.5 text-sm text-cream backdrop-blur-sm transition hover:border-cream hover:bg-cream/10"
          >
            Continue →
          </button>
        </div>
      </div>

      <p className="text-center font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-white/30">
        {Math.round(progress * 100)}% through the rewind ·{" "}
        <button
          type="button"
          onClick={onDone}
          className="underline underline-offset-2 hover:text-cream"
        >
          skip anytime
        </button>
      </p>

      {/* Detail sheet when a receipt is clicked */}
      {openSlip && openMoment && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/65 p-3 sm:items-center"
          onClick={() => setOpenId(null)}
          role="presentation"
        >
          <div
            className="anim-fade-up paper paper-torn w-full max-w-md px-5 pb-6 pt-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Receipt detail"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase text-ink-soft">
                  {formatDate(openSlip.date)}
                  {openSlip.cat ? ` · ${openSlip.cat}` : ""}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-hand)] text-[26px] leading-tight text-hand">
                  {openSlip.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Close"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/55 transition hover:bg-ink/20 hover:text-ink"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            {openSlip.amt > 0 && (
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-ink">
                {inr(openSlip.amt)}
              </p>
            )}

            <p className="mt-4 font-[family-name:var(--font-display)] text-[15px] italic leading-snug text-ink-soft">
              {t(openMoment.line)}
            </p>

            <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] text-ink/40">
              Chapter: {t(openMoment.title)}
            </p>

            {snd && onPlay && (
              <button
                type="button"
                onClick={() => onPlay(snd.uri, snd.title, snd.artist)}
                className="mt-4 flex w-full items-center gap-2 rounded-lg bg-[#f4d03f]/75 px-3 py-2.5 text-left transition hover:bg-[#f4d03f]"
              >
                <span>▶</span>
                <span className="min-w-0 truncate font-[family-name:var(--font-mono)] text-[12px] text-ink">
                  Playing around then: {snd.title}
                </span>
              </button>
            )}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="flex-1 rounded-full border border-ink/20 py-2.5 text-sm text-ink/70 hover:bg-ink/5"
              >
                Back to rewind
              </button>
              {onJourney && (
                <button
                  type="button"
                  onClick={() => onJourney(openSlip.momentId)}
                  className="flex-1 rounded-full border border-amber/60 bg-amber/15 py-2.5 text-sm text-ink hover:bg-amber/25"
                >
                  Constellations →
                </button>
              )}
            </div>
            <p className="mt-2 text-center font-[family-name:var(--font-mono)] text-[10px] text-ink/35">
              Rewind = other receipts · Constellations = this journey
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
