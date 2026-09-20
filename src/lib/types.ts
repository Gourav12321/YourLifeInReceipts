export type LangText = { en: string; hi: string };

export type Receipt = {
  id: string;
  kind: string;
  date: string;
  time: string | null;
  label: string;
  sub: string;
  cat: string;
  amt: number;
  dir: "in" | "out";
  quote: boolean;
};

export type Soundtrack = {
  track: string;
  artist: string;
  uri: string;
  days_played: number;
  window_days: number;
  plays: number;
} | null;

export type Moment = {
  id: string;
  kind: string;
  role: string;
  acts: number[];
  title: LangText;
  range: [string, string];
  line: LangText;
  hero?: { kind: string; text: LangText };
  receipts: Receipt[];
  receipt_count: number;
  soundtrack: Soundtrack;
  playing_that_week?: {
    top_artist: { name?: string; plays?: number };
    top_track: {
      track: string;
      artist: string;
      uri: string;
      plays: number;
    } | null;
    plays: number;
  } | null;
  tone: string;
  sensitive: boolean;
  score: number;
  links: string[];
  breakdown?: Record<string, number>;
};

export type Constellation = {
  id: string;
  name: LangText;
  emoji: string;
  hint: LangText;
  core: string[];
  all: string[];
  moments: string[];
  reveal: LangText;
  relations: string[];
  challenge_stars?: string[];
  days?: string[];
};

export type Relation = {
  id: string;
  title: LangText;
  story_line: LangText;
  confidence: string;
  ui: string;
  n_days: number;
  stat: Record<string, unknown>;
};

export type FavouriteTrack = {
  track: string;
  artist: string;
  album: string;
  uri: string;
  days_played: number;
  plays: number;
  years_active: number;
  first_played: string;
  last_played: string;
  dates?: string[];
  first_heard_near?: Receipt[];
};

export type MomentsPack = {
  meta: {
    sources: {
      ledger: { rows: number; from: string; to: string };
      spotify: { rows: number; from: string; to: string };
    };
    overlap_window: [string, string];
    baselines: Record<string, number>;
    counts: Record<string, number>;
    caveats: string[];
  };
  acts: { id: number; name: string; mood: string }[];
  rewind_path: string[];
  moments: Moment[];
  constellations: Constellation[];
  relations: Relation[];
  letter: { lines: LangText[]; sign_off: LangText };
  microcopy: Record<string, LangText>;
  favourites: {
    all_time: FavouriteTrack[];
    side_a_ledger_years: FavouriteTrack[];
    side_b_after: FavouriteTrack[];
    forever_songs: {
      track: string;
      artist: string;
      uri: string;
      years_active: number;
    }[];
    taste_dial: Record<string, { new_artist_pct: number; artists: number }>;
    audio_cues: { moment: string; soundtrack: Soundtrack }[];
  };
};

export type Favourites = MomentsPack["favourites"];

export type LedgerRow = {
  id: string;
  d: string;
  t: string | null;
  c: string;
  s: string;
  n: string;
  a: number;
  ty: "E" | "I" | "T";
  tags: string[];
};

export type TabId = "paper" | "constellations" | "jukebox" | "pocket";
export type StoryAct = 0 | 1 | 2 | 3 | 4 | 5 | 6;
