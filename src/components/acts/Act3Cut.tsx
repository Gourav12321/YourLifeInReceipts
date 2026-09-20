"use client";

export function Act3Cut({ onDone }: { onDone: () => void }) {
  return (
    <div className="anim-fade-up flex min-h-[60vh] items-center justify-center">
      <button
        type="button"
        onClick={onDone}
        className="group max-w-md px-6 text-center"
      >
        <p className="font-[family-name:var(--font-display)] text-[26px] leading-snug text-cream sm:text-3xl">
          All of this was ordinary.
        </p>
        <span className="mt-6 inline-block h-0.5 w-3 bg-white/25 transition group-hover:w-10 group-hover:bg-amber" />
        <p className="mt-8 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/35 group-hover:text-amber">
          tap to continue →
        </p>
      </button>
    </div>
  );
}
