export default function Loading() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#0e0d0c] px-6 text-center"
      role="status"
      aria-live="polite"
      aria-label="Loading experience"
    >
      <div className="h-10 w-10 animate-pulse rounded-full border border-[#e8b86d]/40 border-t-[#e8b86d]" />
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-white/45">
        Unfolding the ledger…
      </p>
    </div>
  );
}
