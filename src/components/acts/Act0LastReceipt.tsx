"use client";

import { Cassette } from "@/components/Cassette";
import { DottedRow, ReceiptCard } from "@/components/ReceiptCard";
import {
  formatDateShort,
  getMoment,
  inr,
  lastDayReceipts,
  pack,
  soundtrackForMoment,
  soundtrackLine,
  t,
} from "@/lib/data";

type Props = {
  onRewind: () => void;
  onConstellations: () => void;
  onPlay: (uri: string, title: string, artist: string) => void;
};

export function Act0LastReceipt({ onRewind, onConstellations, onPlay }: Props) {
  const moment = getMoment("m-last-receipt");
  const rows = lastDayReceipts();
  const total = rows.reduce((s, r) => s + r.amt, 0);
  const snd = soundtrackLine(
    soundtrackForMoment("m-last-receipt") ?? moment?.soundtrack ?? null,
  );

  function playCue() {
    if (snd) onPlay(snd.uri, snd.title, snd.artist);
  }

  return (
    <div className="anim-fade-up flex flex-col items-center gap-6 pb-4 pt-2">
      <ReceiptCard className="relative">
        <p className="mb-4 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-ink-soft">
          Thursday · lunch
        </p>

        {rows.map((r) => (
          <div key={r.id} className="mb-3">
            <p className="mb-1 font-[family-name:var(--font-mono)] text-[11px] text-ink-soft">
              {formatDateShort(r.date)}
              {r.time ? ` ${r.time}` : ""}
            </p>
            <DottedRow
              left={
                <span className="whitespace-normal">
                  {r.label.includes("2 plates") ? (
                    <>
                      Idli medu Vada mix
                      <br />
                      <span className="inline-flex items-center gap-1">
                        <PencilCircle>2</PencilCircle> plates
                      </span>
                    </>
                  ) : r.label.match(/^2\b/) ? (
                    <>
                      <PencilCircle>2</PencilCircle>{" "}
                      {r.label.replace(/^2\s*/, "")}
                    </>
                  ) : (
                    r.label
                  )}
                </span>
              }
              right={inr(r.amt)}
            />
          </div>
        ))}

        <div className="my-3 border-t border-dashed border-ink/25" />
        <DottedRow
          left={<span className="font-semibold tracking-wide">TOTAL</span>}
          right={<span className="text-base font-semibold">{inr(total)}</span>}
        />

        <div className="stamp absolute bottom-6 right-4 px-2 py-1 text-[10px]">
          LAST
        </div>
      </ReceiptCard>

      <div className="flex flex-col items-center gap-2">
        <Cassette
          label={snd ? snd.title : "SIDE A · ?"}
          mark={snd ? "▶" : "?"}
          onClick={snd ? playCue : onRewind}
        />
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-white/35">
          {snd ? `Tap cassette · ${snd.artist}` : "Tap cassette to begin"}
        </p>
      </div>

      <div className="max-w-md px-2 text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl leading-snug text-cream sm:text-[28px]">
          {moment
            ? `${t(moment.line).split(".")[0]}.`
            : "This was the last entry in your ledger."}
        </p>
        <p className="mt-2 text-sm text-white/50">Let&apos;s go back.</p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onRewind}
            className="inline-flex flex-col items-center rounded-full border border-cream/30 bg-white/5 px-6 py-3 transition hover:border-cream hover:bg-cream/10"
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-white/45">
              Other receipts
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg text-cream">
              Rewind →
            </span>
          </button>
          <button
            type="button"
            onClick={onConstellations}
            className="inline-flex flex-col items-center rounded-full border border-amber/50 bg-amber/10 px-6 py-3 transition hover:border-amber hover:bg-amber/20"
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-amber/80">
              This receipt&apos;s story
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg text-amber">
              Constellations →
            </span>
          </button>
        </div>

        <p className="mt-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/30">
          {pack.meta.sources.ledger.rows.toLocaleString()} receipts ·{" "}
          {pack.meta.sources.spotify.rows.toLocaleString()} plays
        </p>
      </div>
    </div>
  );
}

function PencilCircle({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex size-5 items-center justify-center rounded-full border border-ink/50 font-[family-name:var(--font-mono)] text-[11px]">
      {children}
    </span>
  );
}
