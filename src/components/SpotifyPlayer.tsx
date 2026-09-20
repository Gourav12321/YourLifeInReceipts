"use client";

import { spotifyEmbedUrl } from "@/lib/data";

type Props = {
  uri: string | null | undefined;
  open: boolean;
  onClose: () => void;
  title?: string;
  artist?: string;
};

export function SpotifyPlayer({ uri, open, onClose, title, artist }: Props) {
  const src = spotifyEmbedUrl(uri);
  if (!open || !src) return null;

  return (
    <div className="fixed inset-x-0 bottom-[72px] z-[60] px-3 sm:px-6 pointer-events-none">
      <div className="mx-auto max-w-lg pointer-events-auto anim-fade-up">
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-2xl">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <div className="min-w-0">
              <p className="text-xs text-white/50 font-[family-name:var(--font-mono)] truncate">
                Now playing
              </p>
              {(title || artist) && (
                <p className="text-sm text-cream truncate">
                  {title}
                  {artist ? ` · ${artist}` : ""}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/60 hover:text-white text-sm px-2"
            >
              Close
            </button>
          </div>
          <iframe
            title="Spotify player"
            src={`${src}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="border-0"
          />
        </div>
      </div>
    </div>
  );
}
