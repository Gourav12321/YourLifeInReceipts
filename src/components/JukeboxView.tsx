"use client";

import { useMemo, useState } from "react";
import { Cassette } from "@/components/Cassette";
import { formatDate, pack } from "@/lib/data";
import type { FavouriteTrack } from "@/lib/types";

type Props = {
  onPlay: (uri: string, title: string, artist: string) => void;
};

export function JukeboxView({ onPlay }: Props) {
  const { favourites } = pack;
  const [selected, setSelected] = useState<FavouriteTrack | null>(
    favourites.all_time[0] ?? null,
  );
  const dial2018 = favourites.taste_dial["2018"];
  const dial2021 = favourites.taste_dial["2021"];

  return (
    <div className="anim-fade-up max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <p className="font-[family-name:var(--font-hand)] text-2xl text-cream/90">
          songs you kept coming back to
        </p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] text-white/40">
          Ranked by days played (30s+ listens) — not one-night loops
        </p>
      </div>

      <Side
        title="SIDE A · the ledger years (2015–2018)"
        tracks={favourites.side_a_ledger_years}
        selected={selected}
        onSelect={setSelected}
        onPlay={onPlay}
      />

      <Side
        title="SIDE B · after"
        tracks={favourites.side_b_after}
        selected={selected}
        onSelect={setSelected}
        onPlay={onPlay}
      />

      {selected && (
        <div className="paper rounded-2xl p-5 anim-fade-up">
          <p className="font-[family-name:var(--font-display)] text-2xl text-ink">
            {selected.track}
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[12px] text-ink-soft mt-1">
            {selected.artist} · {selected.days_played} days · {selected.years_active}{" "}
            years
          </p>
          <p className="font-[family-name:var(--font-hand)] text-hand text-lg mt-3">
            first heard: {formatDate(selected.first_played)}
          </p>

          {/* Timeline only spans this song's life — not the whole library */}
          {selected.dates && selected.dates.length > 0 && (
            <SongTimeline
              dates={selected.dates}
              first={selected.first_played}
              last={selected.last_played}
            />
          )}

          {selected.first_heard_near && selected.first_heard_near.length > 0 && (
            <div className="mt-4">
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-ink/40 uppercase mb-2">
                First heard near
              </p>
              {selected.first_heard_near.map((r) => (
                <p
                  key={r.id}
                  className="font-[family-name:var(--font-hand)] text-hand text-lg"
                >
                  “{r.label}”
                </p>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => onPlay(selected.uri, selected.track, selected.artist)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-stamp text-white px-4 py-2 text-sm hover:brightness-110 transition"
          >
            ▶ Play on Spotify
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Taste dial
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-cream">
            Explorer ↔ Comfort
          </p>
          <p className="mt-2 text-sm text-white/60">
            2018: {dial2018?.new_artist_pct ?? "—"}% new artists · 2021:{" "}
            {dial2021?.new_artist_pct ?? "—"}% new artists
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Forever songs
          </p>
          <ul className="mt-2 space-y-1">
            {favourites.forever_songs.slice(0, 4).map((s) => (
              <li key={s.uri}>
                <button
                  type="button"
                  onClick={() => onPlay(s.uri, s.track, s.artist)}
                  className="text-left text-sm text-cream/80 hover:text-amber transition"
                >
                  {s.track}{" "}
                  <span className="text-white/35">· {s.years_active} yrs</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Side({
  title,
  tracks,
  selected,
  onSelect,
  onPlay,
}: {
  title: string;
  tracks: FavouriteTrack[];
  selected: FavouriteTrack | null;
  onSelect: (t: FavouriteTrack) => void;
  onPlay: (uri: string, title: string, artist: string) => void;
}) {
  return (
    <section>
      <p className="font-[family-name:var(--font-hand)] text-lg text-amber mb-3 px-1">
        {title}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tracks.slice(0, 8).map((tr, i) => (
          <div key={tr.uri} className="flex flex-col items-center gap-2">
            <Cassette
              label={tr.track}
              mark={i === 0 ? "▶" : String(tr.years_active)}
              size="sm"
              active={selected?.uri === tr.uri}
              onClick={() => {
                onSelect(tr);
                onPlay(tr.uri, tr.track, tr.artist);
              }}
            />
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-white/40 text-center">
              {tr.days_played} days · {tr.years_active} years
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SongTimeline({
  dates,
  first,
  last,
}: {
  dates: string[];
  first: string;
  last: string;
}) {
  const { startMs, endMs, startLabel, endLabel } = useMemo(() => {
    const sorted = [...dates].sort();
    const start = first || sorted[0];
    const end = last || sorted[sorted.length - 1];
    const a = new Date(start + "T12:00:00").getTime();
    const b = new Date(end + "T12:00:00").getTime();
    const span = Math.max(b - a, 1);
    // pad a little so first/last dots aren't on the edge
    const pad = span * 0.04;
    return {
      startMs: a - pad,
      endMs: b + pad,
      startLabel: String(new Date(start + "T12:00:00").getFullYear()),
      endLabel: String(new Date(end + "T12:00:00").getFullYear()),
    };
  }, [dates, first, last]);

  const range = Math.max(endMs - startMs, 1);

  return (
    <div className="mt-5">
      <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-ink/40">
        Days you returned to this song
      </p>
      <div className="relative h-16 overflow-hidden rounded-xl border border-ink/10 bg-[#0a0e18]">
        <svg viewBox="0 0 100 20" className="h-full w-full" preserveAspectRatio="none">
          <line
            x1="2"
            y1="10"
            x2="98"
            y2="10"
            stroke="#f4efe6"
            strokeWidth="0.3"
            opacity="0.35"
          />
          {dates.map((d, i) => {
            const t = new Date(d + "T12:00:00").getTime();
            const x = 2 + ((t - startMs) / range) * 96;
            return (
              <circle
                key={d + i}
                cx={Math.min(98, Math.max(2, x))}
                cy={10 + ((i % 3) - 1) * 2.2}
                r="0.55"
                fill="#f0d78c"
                opacity="0.9"
              />
            );
          })}
        </svg>
        <div className="absolute inset-x-3 bottom-1 flex justify-between font-[family-name:var(--font-mono)] text-[9px] text-white/45">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      </div>
    </div>
  );
}
