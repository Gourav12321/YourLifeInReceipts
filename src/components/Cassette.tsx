"use client";

type Props = {
  label?: string;
  mark?: string;
  size?: "sm" | "md";
  onClick?: () => void;
  active?: boolean;
};

export function Cassette({
  label = "SIDE A · ?",
  mark = "?",
  size = "md",
  onClick,
  active,
}: Props) {
  const w = size === "sm" ? "w-40" : "w-52";
  const h = size === "sm" ? "h-[72px]" : "h-[92px]";

  const body = (
    <div
      className={`${w} ${h} relative select-none rounded-md border border-black/70 bg-gradient-to-b from-[#333] via-[#1c1c1c] to-[#0d0d0d] shadow-[0_10px_24px_rgba(0,0,0,0.45)] ${
        active ? "ring-2 ring-amber/70" : ""
      } ${onClick ? "cursor-pointer transition hover:brightness-110" : ""}`}
    >
      {/* screws */}
      <span className="absolute left-1.5 top-1.5 size-1.5 rounded-full bg-[#555]" />
      <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#555]" />
      <span className="absolute bottom-1.5 left-1.5 size-1.5 rounded-full bg-[#555]" />
      <span className="absolute bottom-1.5 right-1.5 size-1.5 rounded-full bg-[#555]" />

      {/* label window */}
      <div className="absolute inset-x-3 top-2.5 h-[42%] rounded-sm bg-[#f4efe6] px-2 py-1 shadow-inner">
        <div className="flex h-full items-start justify-between gap-1">
          <p className="line-clamp-2 font-[family-name:var(--font-hand)] text-[12px] leading-tight text-hand">
            {label}
          </p>
          <span className="shrink-0 font-[family-name:var(--font-hand)] text-base text-ink/45">
            {mark}
          </span>
        </div>
      </div>

      {/* reels — clearly inside the cassette body */}
      <div className="absolute inset-x-0 bottom-2.5 flex items-center justify-center gap-8">
        <Reel />
        <Reel />
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block" aria-label={`Cassette ${label}`}>
        {body}
      </button>
    );
  }
  return body;
}

function Reel() {
  return (
    <span className="relative flex size-7 items-center justify-center rounded-full border border-black/80 bg-[#2a2a2a] shadow-inner">
      <span className="size-2 rounded-full bg-[#111]" />
      <span className="absolute inset-[3px] rounded-full border border-dashed border-white/15" />
    </span>
  );
}

export function MiniCassetteBar({
  caption,
  onPlay,
}: {
  caption: string;
  onPlay?: () => void;
}) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-black/10 bg-black/5 px-3 py-2.5">
      <CassetteIcon />
      <p className="flex-1 font-[family-name:var(--font-hand)] text-[15px] leading-snug text-hand">
        {caption}
      </p>
      {onPlay && (
        <button
          type="button"
          onClick={onPlay}
          aria-label="Play"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-stamp text-white transition hover:scale-105"
        >
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <path d="M0 0l10 6-10 6V0z" />
          </svg>
        </button>
      )}
    </div>
  );
}

function CassetteIcon() {
  return (
    <svg width="28" height="18" viewBox="0 0 28 18" fill="none" className="shrink-0" aria-hidden>
      <rect x="1" y="2" width="26" height="14" rx="2" fill="#1a1a1a" />
      <rect x="4" y="4" width="20" height="7" rx="1" fill="#f4efe6" />
      <circle cx="9" cy="13" r="2" fill="#444" />
      <circle cx="19" cy="13" r="2" fill="#444" />
    </svg>
  );
}
