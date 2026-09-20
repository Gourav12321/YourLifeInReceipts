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

const TABS: { id: TabId; label: string; short: string; icon: React.ReactNode }[] =
  [
    {
      id: "paper",
      label: "Paper",
      short: "Paper",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="6"
            y="3"
            width="12"
            height="16"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 7h8M8 10h8M8 13h5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M6 19h12v1.5a1 1 0 01-1 1H7a1 1 0 01-1-1V19z"
            fill="currentColor"
            opacity=".35"
          />
        </svg>
      ),
    },
    {
      id: "constellations",
      label: "Constellations",
      short: "Sky",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M12 3l1.2 3.6L17 8l-3.8 1.4L12 13l-1.2-3.6L7 8l3.8-1.4L12 3z"
            opacity=".9"
          />
          <path
            d="M18 13l.7 2L21 16l-2.3.8L18 19l-.7-2.2L15 16l2.3-.8L18 13z"
            opacity=".55"
          />
          <path
            d="M6 14l.6 1.7L8.5 16l-1.9.6L6 18.5l-.6-1.9L3.5 16l1.9-.3L6 14z"
            opacity=".55"
          />
        </svg>
      ),
    },
    {
      id: "jukebox",
      label: "Jukebox",
      short: "Jukebox",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="3"
            y="7"
            width="18"
            height="11"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="8.5" cy="12.5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
          <circle
            cx="15.5"
            cy="12.5"
            r="2.2"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M5 7V5.5A1.5 1.5 0 016.5 4h11A1.5 1.5 0 0119 5.5V7"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      ),
    },
    {
      id: "pocket",
      label: "Pocket",
      short: "Pocket",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 8h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M4 8h16l-1.5-3.5A2 2 0 0016.7 3H7.3a2 2 0 00-1.8 1.5L4 8z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
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
    variant === "sky"
      ? "desk-sky"
      : variant === "cold"
        ? "desk-cold"
        : "desk-surface";

  return (
    <div className={`min-h-dvh ${bg} dots flex flex-col`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-cream focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="shell-pad mx-auto flex max-w-6xl items-center justify-between gap-2 py-3 sm:gap-3">
          <div className="flex w-[4.5rem] justify-start sm:w-28">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="touch-target inline-flex items-center justify-center rounded-md px-1 text-[10px] uppercase tracking-[0.18em] text-cream/80 transition hover:text-amber font-[family-name:var(--font-mono)]"
              >
                ← Back
              </button>
            ) : (
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-[family-name:var(--font-mono)]">
                {actLabel || "—"}
              </span>
            )}
          </div>
          <h1 className="min-w-0 flex-1 truncate text-center text-[14px] text-cream tracking-wide sm:text-lg font-[family-name:var(--font-display)]">
            {title}
          </h1>
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? "Unmute audio" : "Mute audio"}
            aria-pressed={muted}
            className="touch-target inline-flex w-[4.5rem] items-center justify-end text-white/70 transition hover:text-white sm:w-28"
          >
            {muted ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <path d="M11 5L6 9H3v6h3l5 4V5z" />
                <path d="M15 9l6 6M21 9l-6 6" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <path d="M11 5L6 9H3v6h3l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="shell-pad mx-auto w-full max-w-6xl flex-1 pb-28 pt-4 outline-none"
      >
        {children}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#120e0a]/92 backdrop-blur-md"
        aria-label="Primary"
      >
        <div className="shell-pad mx-auto grid max-w-lg grid-cols-4 py-1.5 sm:py-2">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTab(item.id)}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                className={`touch-target flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 transition ${
                  active
                    ? "text-cream"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {item.icon}
                <span className="nav-label text-[9px] tracking-wide sm:text-[10px]">
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
                <span
                  className={`h-0.5 w-8 rounded-full transition ${
                    active ? "bg-cream" : "bg-transparent"
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
