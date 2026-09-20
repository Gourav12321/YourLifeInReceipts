"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { DottedRow, ReceiptCard } from "@/components/ReceiptCard";
import { MiniCassetteBar } from "@/components/Cassette";
import { formatDate, pack, t, topFavourite } from "@/lib/data";

type Props = {
  onRestart: () => void;
  onClose: () => void;
  onPlay: (uri: string, title: string, artist: string) => void;
  found: Set<string>;
};

const STAMPS = ["FOUND", "KEPT", "YOURS", "SAVED", "HOME"];
const TITLES = [
  "Your last receipt",
  "A letter home",
  "What the ledger kept",
  "Receipts that stayed",
  "After the last page",
];
const PS = [
  "Folded once. Kept forever.",
  "Printed only for you, tonight.",
  "The quiet numbers finally spoke.",
  "A copy no one else has.",
  "Still warm from the printer.",
];

function hashSeed(parts: string[]) {
  let h = 2166136261;
  const s = parts.join("|");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function Act6Letter({ onRestart, onClose, onPlay, found }: Props) {
  const { letter, constellations, favourites } = pack;
  const [copied, setCopied] = useState(false);

  const edition = useMemo(() => {
    const today = new Date();
    const dayKey = today.toISOString().slice(0, 10);
    const foundIds = [...found].sort().join(",");
    const seed = hashSeed([dayKey, foundIds, String(found.size)]);
    const pick = <T,>(arr: T[], offset = 0) => arr[(seed + offset) % arr.length];

    const foundNames = constellations
      .filter((c) => found.has(c.id))
      .map((c) => t(c.name));

    const tracks = favourites.all_time;
    const song = tracks[(seed + 3) % tracks.length] ?? topFavourite();

    const highlightIdx = seed % Math.max(letter.lines.length, 1);

    return {
      seed,
      no: (seed % 900) + 100,
      title: pick(TITLES),
      stamp: pick(STAMPS, 1),
      ps: pick(PS, 2),
      tilt: ((seed % 7) - 3) * 0.6,
      clipSide: seed % 2 === 0 ? "right" : "left",
      stainX: 55 + (seed % 30),
      stainY: 8 + (seed % 20),
      stampRot: -6 - (seed % 10),
      highlightIdx,
      song,
      foundNames,
      weekday: today.toLocaleDateString("en-GB", { weekday: "long" }),
      printed: formatDate(dayKey),
    };
  }, [found, constellations, favourites, letter.lines.length]);

  const rows = letter.lines.map((line, i) => {
    const en = t(line);
    const m = en.match(/^(.*?)(\d[\d,]*.*|#1\.?|20 September 2018.*)$/i);
    const base = m
      ? { left: m[1].trim(), right: m[2].trim(), raw: en }
      : { left: en, right: "", raw: en };
    return { ...base, highlight: i === edition.highlightIdx };
  });

  // Unique extra line from opened constellations
  const uniqueLine =
    edition.foundNames.length > 0
      ? `You opened ${edition.foundNames.length} sky pattern${
          edition.foundNames.length === 1 ? "" : "s"
        }: ${edition.foundNames.slice(0, 3).join(", ")}${
          edition.foundNames.length > 3 ? "…" : ""
        }.`
      : "The sky is still waiting for you to look up.";

  return (
    <div className="anim-fade-up relative flex flex-col items-center gap-5 pb-4">
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close letter"
        className="absolute right-2 top-0 z-20 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-cream backdrop-blur-sm transition hover:border-cream hover:bg-black/60 sm:right-[calc(50%-14rem)]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>

      <ReceiptCard
        wide
        className="relative !max-w-md"
        style={
          {
            transform: `rotate(${edition.tilt}deg)`,
            backgroundImage: `radial-gradient(circle at ${edition.stainX}% ${edition.stainY}%, rgba(139,90,43,0.14), transparent 28%), linear-gradient(105deg, transparent 48%, rgba(0,0,0,0.03) 49%, rgba(0,0,0,0.03) 51%, transparent 52%), var(--paper)`,
          } as CSSProperties
        }
      >
        {/* paperclip — left or right */}
        <div
          className={`absolute -top-2 h-10 w-6 rounded-full border-2 border-[#9aa3ad] opacity-80 ${
            edition.clipSide === "right"
              ? "right-8 rotate-12"
              : "left-8 -rotate-12"
          }`}
          aria-hidden
        />

        <div className="mb-4 flex items-start justify-between gap-2">
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-ink/40">
            Edition #{edition.no}
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-ink/40">
            {edition.weekday}
          </p>
        </div>

        <p className="mb-5 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-ink">
          {edition.title}
        </p>

        <div className="space-y-1.5">
          {rows.map((r, i) => {
            if (!r.right) {
              return (
                <p
                  key={i}
                  className={`py-1 font-[family-name:var(--font-mono)] text-[12px] sm:text-[13px] ${
                    r.highlight ? "rounded-sm bg-[#f4d03f]/70 -mx-2 px-2" : ""
                  }`}
                >
                  {r.left}
                </p>
              );
            }
            return (
              <DottedRow
                key={i}
                left={r.left}
                right={r.right}
                highlight={r.highlight}
              />
            );
          })}

          {/* unique personal line */}
          <p className="mt-2 rounded-sm bg-ink/[0.04] px-2 py-2 font-[family-name:var(--font-hand)] text-[16px] leading-snug text-hand">
            {uniqueLine}
          </p>
        </div>

        <MiniCassetteBar
          caption={`“${edition.song.track}” · ${edition.song.days_played} days`}
          onPlay={() =>
            onPlay(edition.song.uri, edition.song.track, edition.song.artist)
          }
        />

        <div className="my-5 flex items-center gap-2 border-t border-dashed border-ink/25 font-[family-name:var(--font-mono)] text-[10px] tracking-widest text-ink/35">
          <span className="flex-1 border-t border-dotted border-ink/25" />
          TEAR HERE
          <span className="flex-1 border-t border-dotted border-ink/25" />
        </div>

        <p className="pr-12 font-[family-name:var(--font-hand)] text-[22px] leading-snug text-hand sm:text-[26px]">
          {t(letter.sign_off)}
        </p>
        <p className="mt-2 font-[family-name:var(--font-hand)] text-[15px] text-hand/70">
          P.S. {edition.ps}
        </p>

        <div
          className="stamp absolute bottom-8 right-4 px-2 py-1 text-[11px]"
          style={{ transform: `rotate(${edition.stampRot}deg)` }}
        >
          {edition.stamp}
        </div>
      </ReceiptCard>

      <div className="flex flex-wrap justify-center gap-5 text-sm text-cream/80">
        <button
          type="button"
          onClick={onClose}
          className="underline decoration-white/30 underline-offset-4 hover:decoration-cream"
        >
          Close
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `Your Life, In Receipts — Edition #${edition.no}\n${uniqueLine}\n${t(letter.sign_off)}`,
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              /* ignore */
            }
          }}
          className="underline decoration-white/30 underline-offset-4 hover:decoration-cream"
        >
          {copied ? "Copied!" : "Share"}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="underline decoration-white/30 underline-offset-4 hover:decoration-cream"
        >
          Start again
        </button>
      </div>

      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-white/30">
        Printed {edition.printed} · all receipts drift home
      </p>
    </div>
  );
}
