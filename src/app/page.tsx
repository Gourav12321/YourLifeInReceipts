"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SpotifyPlayer } from "@/components/SpotifyPlayer";
import { Act0LastReceipt } from "@/components/acts/Act0LastReceipt";
import { Act1Rewind } from "@/components/acts/Act1Rewind";
import { Act4Rituals } from "@/components/acts/Act4Rituals";
import { Act6Letter } from "@/components/acts/Act6Letter";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { constellationForMoment } from "@/lib/data";
import type { TabId } from "@/lib/types";

const Act5Sky = dynamic(
  () =>
    import("@/components/acts/Act5Sky").then((m) => m.Act5Sky),
  {
    ssr: false,
    loading: () => (
      <p className="py-16 text-center font-[family-name:var(--font-mono)] text-sm text-white/40">
        Looking up at the sky…
      </p>
    ),
  },
);

const JukeboxView = dynamic(
  () =>
    import("@/components/JukeboxView").then((m) => m.JukeboxView),
  {
    ssr: false,
    loading: () => (
      <p className="py-16 text-center font-[family-name:var(--font-mono)] text-sm text-white/40">
        Warming the jukebox…
      </p>
    ),
  },
);

const PocketView = dynamic(
  () =>
    import("@/components/PocketView").then((m) => m.PocketView),
  { ssr: false },
);

/** Story acts: 0 opening, 1 rewind, 4 rituals, 5 sky, 6 letter */
const ACT_TAG: Record<number, string> = {
  0: "OPENING",
  1: "REWIND",
  4: "RITUALS",
  5: "SKY",
  6: "LETTER",
};

export default function HomePage() {
  const [tab, setTab] = useState<TabId>("paper");
  const [act, setAct] = useState(0);
  const [found, setFound] = useState<Set<string>>(() => new Set());
  const [skyFocus, setSkyFocus] = useState<string | null>(null);
  const { play, muted, onPlay, toggleMute, clearPlay } = useNowPlaying();

  const onFind = useCallback((id: string) => {
    setFound((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const navTab: TabId =
    tab === "paper" && act === 5 ? "constellations" : tab;

  const showingSky = navTab === "constellations";
  const showingPaperStory = tab === "paper" && act !== 5;

  const actLabel = useMemo(() => {
    if (navTab === "constellations") return "SKY";
    if (navTab === "jukebox") return "JUKEBOX";
    if (navTab === "pocket") return "POCKET";
    return ACT_TAG[act] ?? "PAPER";
  }, [navTab, act]);

  const variant =
    showingSky
      ? "sky"
      : tab === "paper" && act === 0
        ? "cold"
        : "desk";

  function goTab(next: TabId) {
    if (next === "constellations") {
      setTab("constellations");
      setAct(5);
      return;
    }
    if (next === "paper") {
      setTab("paper");
      if (act === 5) setAct(4);
      return;
    }
    setTab(next);
  }

  function goToSky(focusId?: string | null) {
    setSkyFocus(focusId ?? null);
    setAct(5);
    setTab("constellations");
  }

  function goToJourney(momentId: string) {
    goToSky(constellationForMoment(momentId));
  }

  function goToLetter() {
    setTab("paper");
    setAct(6);
  }

  function goBack() {
    if (showingSky) {
      setTab("paper");
      setAct(4);
      return;
    }
    if (tab !== "paper") {
      setTab("paper");
      return;
    }
    if (act === 6) {
      goToSky(skyFocus);
      return;
    }
    if (act === 4) {
      setAct(1);
      return;
    }
    if (act === 1) {
      setAct(0);
      return;
    }
  }

  const canGoBack =
    showingSky ||
    tab === "jukebox" ||
    tab === "pocket" ||
    (tab === "paper" && act > 0);

  return (
    <AppShell
      actLabel={actLabel}
      muted={muted}
      onToggleMute={toggleMute}
      tab={navTab}
      onTab={goTab}
      onBack={canGoBack ? goBack : undefined}
      variant={variant}
    >
      {showingPaperStory && (
        <>
          {act === 0 && (
            <Act0LastReceipt
              onRewind={() => setAct(1)}
              onConstellations={() => goToJourney("m-last-receipt")}
              onPlay={onPlay}
            />
          )}
          {act === 1 && (
            <Act1Rewind
              onDone={() => setAct(4)}
              onClose={() => setAct(0)}
              onJourney={goToJourney}
              onPlay={onPlay}
            />
          )}
          {act === 4 && (
            <Act4Rituals
              onNext={() => goToSky(null)}
              onJourney={goToJourney}
              onBack={() => setAct(1)}
              onPlay={onPlay}
            />
          )}
          {act === 6 && (
            <Act6Letter
              found={found}
              onClose={() => goToSky(skyFocus)}
              onRestart={() => {
                setTab("paper");
                setAct(0);
                setFound(new Set());
                clearPlay();
                setSkyFocus(null);
              }}
              onPlay={onPlay}
            />
          )}
        </>
      )}

      {showingSky && (
        <Act5Sky
          found={found}
          onFind={onFind}
          onPlay={onPlay}
          onToLetter={goToLetter}
          focusId={skyFocus}
        />
      )}

      {tab === "jukebox" && <JukeboxView onPlay={onPlay} />}

      {tab === "pocket" && <PocketView />}

      {!muted && (
        <SpotifyPlayer
          uri={play?.uri}
          open={!!play}
          onClose={clearPlay}
          title={play?.title}
          artist={play?.artist}
        />
      )}
    </AppShell>
  );
}
