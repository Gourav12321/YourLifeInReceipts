"use client";

import type { TabId } from "@/lib/types";

type Props = {
  title?: string;
  actLabel?: string;
  muted: boolean;
  onToggleMute: () => void;
  tab: TabId;
  onTab: (t: TabId) => void;
  onBack?: () => void;
  variant?: "desk" | "cold" | "sky";
  children: React.ReactNode;
};

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "paper",
    label: "Paper",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="3" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7h8M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 19h12v1.5a1 1 0 01-1 1H7a1 1 0 01-1-1V19z" fill="currentColor" opacity=".35" />
      </svg>
    ),
  },
  {
    id: "constellations",
    label: "Constellations",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3l1.2 3.6L17 8l-3.8 1.4L12 13l-1.2-3.6L7 8l3.8-1.4L12 3z" opacity=".9" />
        <path d="M18 13l.7 2L21 16l-2.3.8L18 19l-.7-2.2L15 16l2.3-.8L18 13z" opacity=".55" />
        <path d="M6 14l.6 1.7L8.5 16l-1.9.6L6 18.5l-.6-1.9L3.5 16l1.9-.3L6 14z" opacity=".55" />
      </svg>
    ),
  },
  {
    id: "jukebox",
    label: "Jukebox",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="12.5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="15.5" cy="12.5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 7V5.5A1.5 1.5 0 016.5 4h11A1.5 1.5 0 0119 5.5V7" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: "pocket",
    label: "Pocket",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 8h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M4 8h16l-1.5-3.5A2 2 0 0016.7 3H7.3a2 2 0 00-1.8 1.5L4 8z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export function AppShell({
  title = "Your Life, In Receipts",
  actLabel,
  muted,
  onToggleMute,
  tab,
  onTab,
  onBack,
  variant = "desk",
  children,
}: Props) {
  const bg =
    variant === "sky" ? "desk-sky" : variant === "cold" ? "desk-cold" : "desk-surface";

  return (
    <div className={`min-h-dvh ${bg} dots flex flex-col`}>
      <header className="sticky top-0 z-40 backdrop-blur-sm bg-black/20 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="w-24 flex justify-start">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="text-[10px] tracking-[0.18em] uppercase text-cream/80 font-[family-name:var(--font-mono)] hover:text-amber transition"
              >
                ← Back
              </button>
            ) : (
              <span className="text-[10px] tracking-[0.18em] uppercase text-white/45 font-[family-name:var(--font-mono)]">
                {actLabel || "—"}
              </span>
            )}
          </div>
          <h1 className="text-center text-[15px] sm:text-lg font-[family-name:var(--font-display)] text-cream tracking-wide">
            {title}
          </h1>
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="w-24 flex justify-end text-white/70 hover:text-white transition"
          >
            {muted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M11 5L6 9H3v6h3l5 4V5z" />
                <path d="M15 9l6 6M21 9l-6 6" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M11 5L6 9H3v6h3l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl px-3 sm:px-6 pb-28 pt-4">
        {children}
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-[#120e0a]/92 backdrop-blur-md">
        <div className="mx-auto max-w-lg grid grid-cols-4 px-2 py-2">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTab(item.id)}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${
                  active ? "text-cream" : "text-white/40 hover:text-white/70"
                }`}
              >
                {item.icon}
                <span className="text-[10px] tracking-wide">{item.label}</span>
                <span
                  className={`h-0.5 w-8 rounded-full transition ${
                    active ? "bg-cream" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
