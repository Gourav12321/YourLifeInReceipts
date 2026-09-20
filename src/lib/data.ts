import momentsPack from "@/data/moments.json";
import ledgerRaw from "@/data/ledger.json";
import type {
  FavouriteTrack,
  Favourites,
  LedgerRow,
  Moment,
  MomentsPack,
  Soundtrack,
} from "./types";

export const pack = momentsPack as unknown as MomentsPack;
export const ledger = ledgerRaw as LedgerRow[];
export const favourites: Favourites = pack.favourites;

export const byMomentId: Record<string, Moment> = Object.fromEntries(
  pack.moments.map((m) => [m.id, m]),
);

export function t(text: { en: string; hi: string }, lang: "en" | "hi" = "en") {
  return text[lang];
}

export function formatInr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** @deprecated use formatInr */
export const inr = formatInr;

export function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

export function trackUriId(uri: string) {
  return uri.includes(":") ? uri.split(":").pop()! : uri;
}

export const uriId = trackUriId;

export function spotifyEmbedUrl(uri: string | null | undefined) {
  if (!uri) return null;
  const id = trackUriId(uri);
  return `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
}

export function momentById(id: string): Moment | undefined {
  return byMomentId[id];
}

export const getMoment = momentById;

export function rituals(): Moment[] {
  return pack.moments.filter((m) => m.kind === "ritual");
}

export const getRituals = rituals;

export function soundtrackForMoment(id: string): Soundtrack {
  const cue = favourites.audio_cues?.find((c) => c.moment === id);
  if (cue?.soundtrack) return cue.soundtrack;
  return momentById(id)?.soundtrack ?? null;
}

export function soundtrackLine(s: Soundtrack) {
  if (!s) return null;
  return {
    title: s.track,
    artist: s.artist,
    uri: s.uri,
    caption: `played on ${s.days_played} of the ${s.window_days} days around this`,
  };
}

export function topFavourite(): FavouriteTrack {
  return pack.favourites.all_time[0];
}

export function lastDayReceipts() {
  return momentById("m-last-receipt")?.receipts ?? [];
}

export function milkNotes(): string[] {
  const m = momentById("r-milk");
  if (!m) return [];
  const notes = m.receipts
    .map((r) => r.label)
    .filter((n) => n && n.toLowerCase().includes("milk"));
  return [...new Set(notes)].slice(0, 3);
}

export function searchLedger(q: string, limit = 40): LedgerRow[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return ledger.slice(-limit).reverse();
  const hits: LedgerRow[] = [];
  for (let i = ledger.length - 1; i >= 0 && hits.length < limit; i--) {
    const r = ledger[i];
    const blob = `${r.n} ${r.s} ${r.c} ${r.d}`.toLowerCase();
    if (blob.includes(needle)) hits.push(r);
  }
  return hits;
}

export function filterLedgerByTag(tag: string, limit = 50): LedgerRow[] {
  return ledger.filter((r) => r.tags.includes(tag)).slice(0, limit);
}

const RITUAL_CONSTELLATION: Record<string, string> = {
  "r-milk": "c-milk-way",
  "r-train": "c-pair",
  "r-auto": "c-pair",
  "r-snacks": "c-pair",
  "r-tea": "c-milk-way",
  "r-icecream": "c-milk-way",
  "r-flourmill": "c-becoming",
};

/** Map a moment id → constellation id (from constellation.moments) */
export function constellationForMoment(momentId: string): string | null {
  if (RITUAL_CONSTELLATION[momentId]) return RITUAL_CONSTELLATION[momentId];
  for (const c of pack.constellations) {
    if (c.moments.includes(momentId)) return c.id;
  }
  // follow links one hop
  const m = byMomentId[momentId];
  if (m?.links?.length) {
    for (const link of m.links) {
      if (link.startsWith("c-")) return link;
      for (const c of pack.constellations) {
        if (c.moments.includes(link)) return c.id;
      }
    }
  }
  return null;
}

export type JourneyStop = {
  id: string;
  date: string;
  label: string;
  amt?: number;
  kind: "moment" | "receipt";
};

/** Chronological journey stops for a constellation */
export function journeyForConstellation(constellationId: string): JourneyStop[] {
  const c = pack.constellations.find((x) => x.id === constellationId);
  if (!c) return [];
  const stops: JourneyStop[] = [];

  for (const mid of c.moments) {
    const m = byMomentId[mid];
    if (!m) continue;
    if (m.receipts?.length) {
      // sample up to 3 receipts along the arc
      const step = Math.max(1, Math.floor(m.receipts.length / 3));
      for (let i = 0; i < m.receipts.length && stops.length < 12; i += step) {
        const r = m.receipts[i];
        stops.push({
          id: r.id,
          date: r.date,
          label: r.label || t(m.title),
          amt: r.amt,
          kind: "receipt",
        });
      }
    } else {
      stops.push({
        id: m.id,
        date: m.range[0],
        label: t(m.title),
        kind: "moment",
      });
    }
  }

  // fill from ledger tags if thin
  if (stops.length < 4 && c.all?.length) {
    const ids = c.all.slice(0, 10);
    for (const id of ids) {
      const row = ledger.find((r) => r.id === id);
      if (!row) continue;
      if (stops.some((s) => s.id === row.id)) continue;
      stops.push({
        id: row.id,
        date: row.d,
        label: row.n || row.s || row.c,
        amt: row.a,
        kind: "receipt",
      });
    }
  }

  return stops.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 14);
}

export const ACT_NAMES = [
  "The Last Receipt",
  "Rewind",
  "The Ordinary",
  "The Cut",
  "The Return",
  "The Sky",
  "The Letter",
];
