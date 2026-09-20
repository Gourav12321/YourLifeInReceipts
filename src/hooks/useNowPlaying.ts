"use client";

import { useCallback, useState } from "react";

export type NowPlaying = {
  uri: string;
  title: string;
  artist: string;
} | null;

/** Shared Spotify cue state for story acts + shell mute. */
export function useNowPlaying() {
  const [play, setPlay] = useState<NowPlaying>(null);
  const [muted, setMuted] = useState(false);

  const onPlay = useCallback((uri: string, title: string, artist: string) => {
    setMuted(false);
    setPlay({ uri, title, artist });
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (!m) setPlay(null);
      return !m;
    });
  }, []);

  const clearPlay = useCallback(() => setPlay(null), []);

  return { play, muted, onPlay, toggleMute, clearPlay };
}
