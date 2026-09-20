"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  byMomentId,
  formatDate,
  formatDateShort,
  inr,
  journeyForConstellation,
  pack,
  soundtrackLine,
  t,
} from "@/lib/data";
import type { Constellation, Moment } from "@/lib/types";

type Props = {
  found: Set<string>;
  onFind: (id: string) => void;
  onPlay: (uri: string, title: string, artist: string) => void;
  onToLetter: () => void;
  /** Open / pan to this constellation when set (from a selected receipt) */
  focusId?: string | null;
};

type Pt = { x: number; y: number; r: number };

const FILTERS = [
  { id: "all", label: "All" },
  { id: "music", label: "Music" },
  { id: "purchases", label: "Purchases" },
  { id: "events", label: "Events" },
] as const;

const FILTER_IDS: Record<(typeof FILTERS)[number]["id"], string[]> = {
  all: [],
  music: ["c-night-owl", "c-cinema-sky", "c-silence", "c-festival-sky"],
  purchases: ["c-milk-way", "c-becoming", "c-gift"],
  events: ["c-pair", "c-goodbyes", "c-festival-sky", "c-gift"],
};

/** Wide sky map — clusters far apart so users must pan / zoom to explore */
const LAYOUT: Record<string, Pt[]> = {
  "c-gift": [
    { x: 50, y: 42, r: 2.8 },
    { x: 38, y: 56, r: 2.0 },
    { x: 62, y: 58, r: 2.0 },
  ],
  "c-pair": [
    { x: 118, y: 18, r: 2.2 },
    { x: 132, y: 28, r: 1.8 },
    { x: 124, y: 40, r: 1.8 },
  ],
  "c-goodbyes": [
    { x: -28, y: 8, r: 1.9 },
    { x: -16, y: 18, r: 1.5 },
    { x: -30, y: 26, r: 1.5 },
  ],
  "c-milk-way": [
    { x: -40, y: 95, r: 1.5 },
    { x: -28, y: 90, r: 1.3 },
    { x: -16, y: 86, r: 1.2 },
    { x: -4, y: 82, r: 1.1 },
    { x: 8, y: 78, r: 1.0 },
  ],
  "c-night-owl": [
    { x: 130, y: 105, r: 2.1 },
    { x: 142, y: 116, r: 1.5 },
    { x: 122, y: 118, r: 1.4 },
  ],
  "c-cinema-sky": [
    { x: 88, y: 120, r: 2.0 },
    { x: 100, y: 112, r: 1.5 },
    { x: 96, y: 130, r: 1.4 },
  ],
  "c-festival-sky": [
    { x: 8, y: -25, r: 1.8 },
    { x: 18, y: -32, r: 1.4 },
    { x: 26, y: -22, r: 1.4 },
  ],
  "c-becoming": [
    { x: 55, y: 95, r: 1.9 },
    { x: 66, y: 88, r: 1.4 },
    { x: 62, y: 104, r: 1.4 },
  ],
  "c-silence": [
    { x: -35, y: 48, r: 1.2 },
    { x: -28, y: 54, r: 0.9 },
  ],
};

const LABEL_AT: Record<string, { x: number; y: number }> = {
  "c-gift": { x: 50, y: 34 },
  "c-pair": { x: 126, y: 12 },
  "c-goodbyes": { x: -22, y: 0 },
  "c-milk-way": { x: -18, y: 102 },
  "c-night-owl": { x: 132, y: 98 },
  "c-cinema-sky": { x: 94, y: 138 },
  "c-festival-sky": { x: 16, y: -38 },
  "c-becoming": { x: 58, y: 110 },
  "c-silence": { x: -32, y: 42 },
};

const GIFT_LABELS = [
  { x: 50, y: 38, text: "The Beatles" },
  { x: 32, y: 60, text: "Aai (Dec 2016)" },
  { x: 68, y: 62, text: "Place 0" },
];

const PLAIN: Record<string, string> = {
  "c-milk-way": "The same small purchase, repeated for years.",
  "c-pair": 'Tickets and plates that almost always say "2".',
  "c-goodbyes": "Money given when someone was leaving.",
  "c-gift": "Things bought for family — phone, glasses, pocket money.",
  "c-night-owl": "Music that ran long after midnight (UTC).",
  "c-cinema-sky": "Movie days and the artist that rose with them.",
  "c-festival-sky": "Festivals — and the old songs that came home.",
  "c-becoming": "Big objects that arrived home.",
  "c-silence": "A year when almost nothing played.",
};

function ribbon(a: Pt, b: Pt) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ox = (-dy / len) * 3;
  const oy = (dx / len) * 3;
  return `M ${a.x} ${a.y} Q ${mx + ox} ${my + oy} ${b.x} ${b.y}`;
}

function momentsFor(c: Constellation): Moment[] {
  return c.moments.map((id) => byMomentId[id]).filter(Boolean) as Moment[];
}

const MIN_Z = 0.55;
const MAX_Z = 3.2;

export function Act5Sky({ found, onFind, onPlay, onToLetter, focusId }: Props) {
  const list = pack.constellations;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(focusId || "c-gift");
  const [journeyStop, setJourneyStop] = useState(0);

  // pan/zoom in SVG units (viewBox is 100×100)
  const [zoom, setZoom] = useState(1.45);
  const [pan, setPan] = useState({ x: 0, y: 8 });
  const drag = useRef<{
    active: boolean;
    moved: boolean;
    sx: number;
    sy: number;
    ox: number;
    oy: number;
  } | null>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const focusedOnce = useRef<string | null>(null);

  const filtered = useMemo(() => {
    const allow = FILTER_IDS[filter];
    return list.filter((c) => {
      if (allow.length && !allow.includes(c.id)) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return `${c.name.en} ${PLAIN[c.id] ?? ""} ${c.reveal.en}`
        .toLowerCase()
        .includes(q);
    });
  }, [list, filter, query]);

  const active = filtered.find((c) => c.id === activeId) ?? filtered[0] ?? null;

  const journey = useMemo(
    () => (active ? journeyForConstellation(active.id) : []),
    [active],
  );

  useEffect(() => {
    if (activeId) onFind(activeId);
  }, [activeId, onFind]);

  useEffect(() => {
    if (!filtered.some((c) => c.id === activeId) && filtered[0]) {
      setActiveId(filtered[0].id);
    }
  }, [filtered, activeId]);

  useEffect(() => {
    setJourneyStop(0);
  }, [active?.id]);

  // Prefer landing on the last stop when opening from the final receipt
  useEffect(() => {
    if (!focusId || !active || focusId !== active.id) return;
    if (journey.length < 2) return;
    if (focusId === "c-pair" || focusId === "c-milk-way") {
      setJourneyStop(journey.length - 1);
    }
  }, [focusId, active?.id, journey.length]);

  // non-passive wheel so zoom doesn't scroll the page
  useEffect(() => {
    const el = skyRef.current;
    if (!el) return;
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      setZoom((z) => Math.min(MAX_Z, Math.max(MIN_Z, z * factor)));
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, []);

  const related = active ? momentsFor(active) : [];
  const relation = active
    ? pack.relations.find((r) => active.relations.includes(r.id))
    : null;
  const stop = journey[journeyStop] ?? journey[0] ?? null;
  const hero =
    related.find(
      (m) =>
        m.id === stop?.id || m.receipts?.some((r) => r.id === stop?.id),
    ) ?? related[0];
  const snd = soundtrackLine(hero?.soundtrack ?? null);

  function open(id: string, opts?: { zoomIn?: boolean }) {
    setActiveId(id);
    onFind(id);
    const pts = LAYOUT[id];
    if (!pts?.length) return;
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    setPan({ x: 50 - cx, y: 50 - cy });
    if (opts?.zoomIn) setZoom(1.85);
  }

  // Focus the constellation that came from a selected receipt / ritual
  useEffect(() => {
    if (!focusId) return;
    if (focusedOnce.current === focusId) return;
    focusedOnce.current = focusId;
    setFilter("all");
    setQuery("");
    open(focusId, { zoomIn: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId]);

  const vbSize = 100 / zoom;
  const vbX = 50 - vbSize / 2 - pan.x;
  const vbY = 50 - vbSize / 2 - pan.y;

  const onPointerDown = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      active: true,
      moved: false,
      sx: e.clientX,
      sy: e.clientY,
      ox: pan.x,
      oy: pan.y,
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d?.active || !skyRef.current) return;
    const rect = skyRef.current.getBoundingClientRect();
    const dx = ((e.clientX - d.sx) / rect.width) * vbSize;
    const dy = ((e.clientY - d.sy) / rect.height) * vbSize;
    if (Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) > 4) {
      d.moved = true;
    }
    setPan({ x: d.ox + dx, y: d.oy + dy });
  };

  const endDrag = () => {
    if (drag.current) drag.current.active = false;
  };

  function zoomBy(factor: number) {
    setZoom((z) => Math.min(MAX_Z, Math.max(MIN_Z, z * factor)));
  }

  function resetView() {
    setZoom(1.45);
    setPan({ x: 0, y: 8 });
  }

  return (
    <div className="anim-fade-up mx-auto max-w-6xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream">
            The sky
          </h2>
          <p className="text-sm text-white/45">
            Grab to explore · scroll to zoom · tap a star
          </p>
        </div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-amber">
          {found.size} of {list.length} constellations found
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: Aai, milk, movies…"
          className="w-full max-w-sm rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-cream placeholder:text-white/30 outline-none focus:border-amber/50 font-[family-name:var(--font-mono)]"
        />
        <div className="flex gap-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em]">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={
                filter === f.id
                  ? "border-b border-amber pb-0.5 text-amber"
                  : "text-white/40 hover:text-white/70"
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Left sky + right detail */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_300px] lg:items-start">
        <div className="min-w-0 space-y-2">
          <div
            ref={skyRef}
            className="relative aspect-[4/3] w-full touch-none overflow-hidden rounded-2xl border border-white/10 bg-[#070b14] shadow-[inset_0_0_80px_rgba(0,0,0,0.55)] sm:aspect-[16/11] cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <svg
              viewBox={`${vbX} ${vbY} ${vbSize} ${vbSize}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="skyWash2" cx="50%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#1a2440" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#070b14" stopOpacity="0" />
                </radialGradient>
                <filter id="starGlow">
                  <feGaussianBlur stdDeviation="1.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* large sky field so panning feels open */}
              <rect x="-120" y="-100" width="360" height="320" fill="#070b14" />
              <rect x="-80" y="-60" width="280" height="260" fill="url(#skyWash2)" />

              {Array.from({ length: 180 }).map((_, i) => (
                <circle
                  key={i}
                  cx={((i * 41) % 280) - 90}
                  cy={((i * 67) % 250) - 70}
                  r={i % 9 === 0 ? 0.4 : 0.15}
                  fill="#fff"
                  opacity={0.1 + (i % 5) * 0.04}
                />
              ))}

              {/* silence patch — near The Dark Patch */}
              <rect x="-42" y="44" width="16" height="16" rx="1" fill="#03040a" opacity="0.92" />
              <text
                x="-34"
                y="52"
                textAnchor="middle"
                fill="#f4efe6"
                fontSize="2.3"
                opacity="0.45"
                style={{ fontFamily: "var(--font-hand)" }}
              >
                silence
              </text>
              <text
                x="-34"
                y="56"
                textAnchor="middle"
                fill="#f4efe6"
                fontSize="1.5"
                opacity="0.3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                2014
              </text>

              {filtered.map((c) => {
                const pts = LAYOUT[c.id];
                if (!pts?.length) return null;
                const on = active?.id === c.id;
                const seen = found.has(c.id);
                const lb = LABEL_AT[c.id];
                return (
                  <g
                    key={c.id}
                    className="cursor-pointer"
                    opacity={on ? 1 : seen ? 0.7 : 0.4}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (drag.current?.moved) return;
                      open(c.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {pts.slice(0, -1).map((p, i) => (
                      <path
                        key={i}
                        d={ribbon(p, pts[i + 1])}
                        fill="none"
                        stroke={on ? "#f0d78c" : "#e8dcc8"}
                        strokeWidth={on ? 0.5 : 0.28}
                        strokeLinecap="round"
                        opacity={on ? 0.85 : 0.35}
                      />
                    ))}
                    {pts.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={on ? p.r * 1.15 : p.r}
                        fill={on ? "#f0d78c" : seen ? "#d4b56a" : "#b9a888"}
                        filter={on ? "url(#starGlow)" : undefined}
                      />
                    ))}
                    {lb && (
                      <text
                        x={lb.x}
                        y={lb.y}
                        textAnchor="middle"
                        fill="#f7f1e6"
                        fontSize={on ? 2.7 : 2.2}
                        opacity={on ? 0.95 : 0.5}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {c.name.en}
                      </text>
                    )}
                  </g>
                );
              })}

              {active?.id === "c-gift" &&
                GIFT_LABELS.map((lb) => (
                  <text
                    key={lb.text}
                    x={lb.x}
                    y={lb.y}
                    textAnchor="middle"
                    fill="#f0d78c"
                    fontSize="2.2"
                    opacity="0.9"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {lb.text}
                  </text>
                ))}
            </svg>

            {/* zoom controls */}
            <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => zoomBy(1.15)}
                className="size-9 rounded-lg border border-white/20 bg-black/55 text-lg text-cream backdrop-blur-sm hover:bg-black/75"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => zoomBy(1 / 1.15)}
                className="size-9 rounded-lg border border-white/20 bg-black/55 text-lg text-cream backdrop-blur-sm hover:bg-black/75"
                aria-label="Zoom out"
              >
                −
              </button>
              <button
                type="button"
                onClick={resetView}
                className="rounded-lg border border-white/20 bg-black/55 px-2 py-1.5 font-[family-name:var(--font-mono)] text-[9px] text-white/70 backdrop-blur-sm hover:text-cream"
              >
                reset
              </button>
            </div>

            <p className="pointer-events-none absolute left-3 top-3 font-[family-name:var(--font-mono)] text-[10px] text-white/35">
              {Math.round(zoom * 100)}% · drag to pan
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => open(c.id)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-[family-name:var(--font-mono)] transition ${
                  active?.id === c.id
                    ? "border-amber bg-amber/15 text-amber"
                    : found.has(c.id)
                      ? "border-white/25 text-cream/80"
                      : "border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {found.has(c.id) || active?.id === c.id ? "★" : "☆"} {c.name.en}
              </button>
            ))}
          </div>
        </div>

        {/* Right detail — journey of the selected constellation */}
        <aside className="space-y-3 lg:sticky lg:top-20">
          {active ? (
            <div className="paper rounded-xl px-4 py-4 shadow-xl">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                {focusId === active.id
                  ? "Your selected journey"
                  : "Constellation found"}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-[26px] leading-tight text-ink">
                {active.emoji} {t(active.name)}
              </h3>
              <p className="mt-2 text-[13px] text-ink-soft">{PLAIN[active.id]}</p>
              <p className="mt-3 font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-ink">
                {t(active.reveal)}
              </p>
              {relation && (
                <p className="mt-3 border-t border-dashed border-ink/15 pt-2 text-[12px] text-ink/75">
                  {t(relation.story_line)}
                </p>
              )}
              <p className="mt-3 font-[family-name:var(--font-hand)] text-[17px] text-hand">
                We don&apos;t tell you why. You remember.
              </p>
            </div>
          ) : null}

          {stop && (
            <div className="paper paper-torn-top rounded-b-xl px-4 pb-5 pt-6">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                Stop {journeyStop + 1} of {Math.max(journey.length, 1)}
              </p>
              <p className="mt-1 font-[family-name:var(--font-hand)] text-[20px] leading-snug text-hand">
                {stop.label}
              </p>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] text-ink-soft">
                {formatDate(stop.date)}
                {stop.amt != null ? ` · ${inr(stop.amt)}` : ""}
              </p>
              {hero && (
                <p className="mt-2 font-[family-name:var(--font-display)] text-[13px] italic text-ink-soft">
                  {t(hero.line)}
                </p>
              )}
              {snd && (
                <button
                  type="button"
                  onClick={() => onPlay(snd.uri, snd.title, snd.artist)}
                  className="mt-4 flex w-full items-center gap-2 rounded-lg bg-[#f4d03f]/75 px-3 py-2.5 text-left transition hover:bg-[#f4d03f]"
                >
                  <span>▶</span>
                  <span className="min-w-0 truncate font-[family-name:var(--font-mono)] text-[11px] text-ink">
                    Playing that week: {snd.title}
                  </span>
                </button>
              )}
              {journey.length > 1 && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={journeyStop <= 0}
                    onClick={() => setJourneyStop((i) => Math.max(0, i - 1))}
                    className="flex-1 rounded-full border border-ink/15 py-2 text-[12px] text-ink/70 disabled:opacity-30"
                  >
                    ← Earlier
                  </button>
                  <button
                    type="button"
                    disabled={journeyStop >= journey.length - 1}
                    onClick={() =>
                      setJourneyStop((i) =>
                        Math.min(journey.length - 1, i + 1),
                      )
                    }
                    className="flex-1 rounded-full border border-ink/15 py-2 text-[12px] text-ink/70 disabled:opacity-30"
                  >
                    Later →
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-3">
            <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-white/35">
              Journey · chronological
            </p>
            <ol className="relative max-h-52 space-y-0 overflow-y-auto scrollbar-thin pl-1">
              {journey.length === 0 && (
                <li className="text-[12px] text-white/45">No stops yet.</li>
              )}
              {journey.map((s, i) => (
                <li
                  key={`${s.id}-${i}`}
                  className="relative flex gap-3 pb-3 last:pb-0"
                >
                  <div className="flex w-4 flex-col items-center">
                    <span
                      className={`mt-1 size-2.5 shrink-0 rounded-full ${
                        i === journeyStop ? "bg-amber" : "bg-white/30"
                      }`}
                    />
                    {i < journey.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-white/15" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setJourneyStop(i)}
                    className={`min-w-0 flex-1 pb-1 text-left ${
                      i === journeyStop
                        ? "text-cream"
                        : "text-white/55 hover:text-white/80"
                    }`}
                  >
                    <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-wide text-white/35">
                      {formatDateShort(s.date)}
                    </p>
                    <p className="truncate text-[12px] leading-snug">
                      {s.label}
                    </p>
                    {s.amt != null && (
                      <p className="font-[family-name:var(--font-mono)] text-[10px] text-white/30">
                        {inr(s.amt)}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <button
            type="button"
            onClick={onToLetter}
            className="w-full rounded-full border border-cream/30 py-2.5 font-[family-name:var(--font-display)] text-cream transition hover:bg-cream/10"
          >
            Read the letter →
          </button>
        </aside>
      </div>
    </div>
  );
}
