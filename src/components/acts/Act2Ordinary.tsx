"use client";

import { getRituals } from "@/lib/data";

export function Act2Ordinary({ onDone }: { onDone: () => void }) {
  const rituals = getRituals();
  const words = rituals.flatMap((r) =>
    Array.from({ length: 12 }, () => r.title.en.toLowerCase()),
  );
  const extras = [
    "milk 1lit",
    "auto",
    "chocobar",
    "2 tickets",
    "half lit milk",
    "chai",
    "vada pav",
    "train",
  ];
  const wall = [...words, ...extras, ...extras, ...extras];

  return (
    <div className="anim-fade-up mx-auto max-w-3xl">
      <div className="relative min-h-[55vh] overflow-hidden rounded-2xl border border-white/5 bg-[#1c1814] p-4 sm:p-6">
        <div className="columns-2 gap-3 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-white/35 sm:columns-3 sm:text-xs">
          {wall.map((w, i) => (
            <p key={i} className="mb-1 break-inside-avoid opacity-80">
              {w}
            </p>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#1c1814] to-transparent" />
        <div className="absolute inset-x-0 bottom-6 text-center">
          <p className="mb-4 font-[family-name:var(--font-hand)] text-xl text-cream/80">
            all of this was ordinary
          </p>
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center rounded-full border border-cream/35 bg-black/35 px-5 py-2.5 text-sm text-cream backdrop-blur-sm transition hover:border-cream hover:bg-cream/10"
          >
            Keep going →
          </button>
        </div>
      </div>
    </div>
  );
}
