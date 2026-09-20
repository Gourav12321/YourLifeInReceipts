# Your Life, In Receipts

> A personal ledger and a decade of Spotify listens, turned into a story you can scroll through — receipts, rituals, constellations, and the songs that kept returning.

**Live demo:** [https://web-teal-two-93.vercel.app](https://web-teal-two-93.vercel.app)  
**Repository:** [https://github.com/Gourav12321/YourLifeInReceipts](https://github.com/Gourav12321/YourLifeInReceipts)

---

## Overview

**Your Life, In Receipts** is a frontend-only narrative experience. It joins ~2,400 ledger entries (2015–2018) with ~150,000 Spotify plays (2013–2024) into moments, rituals, and constellations — then walks you through them like chapters in a memory.

No backend. No login. Everything runs from static JSON in the browser.

The product question is simple:

> What if your spending history and your music history remembered each other?

---

## The experience

Bottom navigation: **Paper** · **Constellations** · **Jukebox** · **Pocket**

### 1. Opening — The Last Receipt
Starts on **20 Sept 2018**: lunch, an auto ride, a torn paper receipt, and the song that was playing that week.

Two paths from here:
- **Rewind →** browse other receipts through the years
- **Constellations →** open *this* receipt’s journey in the sky (not a static summary)

### 2. Rewind
A vertical timeline of slips. Tap any receipt to open it.  
From a selected slip: **Back to rewind** (other receipts) or **Constellations →** (that item’s story arc).

### 3. Rituals
Repeated patterns — milk, tea, auto rides, train rides, snacks, the flour mill.  
Each ritual shows count, date range, notes, and a returning song.  
**See this journey →** focuses the matching constellation.

### 4. The Sky (Constellations)
A pannable / zoomable night sky of linked patterns, for example:
| Constellation | Idea |
|---------------|------|
| The Milk Way | The same small purchase, years of repetition |
| The Pair | Tickets and plates that almost always say “2” |
| The Gift | Things bought for family |
| Night Owl | Music after midnight (UTC) |
| Cinema Sky | Movie days and the artists that rose with them |
| Goodbyes | Money given when someone was leaving |
| Becoming | Big objects that arrived home |
| Festival Sky | Festivals and the old songs that came home |
| The Dark Patch | Silence — almost nothing played |

Selecting a receipt or ritual **focuses** its constellation and shows a **chronological journey** of stops (earlier → later), not just one card.

### 5. Letter
A closing letter that reflects what you found in the sky.

### 6. Jukebox & Pocket
- **Jukebox** — favourites and song timelines across first → last play years  
- **Pocket** — keepsakes / collected finds from the story

---

## Design notes

- Receipts feel like paper (torn edges, mono type, handwritten accents)
- Cassettes cue Spotify embeds for “what was playing then”
- Story tone stays gentle: we show patterns; we don’t invent why
- Places are anonymised (`Place 0` … `Place 6`); no real names

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Language | TypeScript |
| Data | Static JSON under `src/data/` |
| Hosting | Vercel |
| Audio | Spotify embed player (client-side) |

**No API server** — preprocess once → ship JSON → render the story.

---

## Data included

| File | What it holds |
|------|----------------|
| `src/data/moments.json` | 55 moments, 9 constellations, 12 relations, rituals, soundtracks, letter copy |
| `src/data/ledger.json` | ~2,461 receipt / ledger rows (2015-01-01 → 2018-09-20) |
| `src/data/plays_daily.json` | Daily Spotify play aggregates |
| `src/data/plays_monthly.json` | Monthly Spotify play aggregates |

**Sources (from preprocess meta):**
- Ledger: **2,461** rows  
- Spotify: **149,860** play rows  
- Overlap window used for joins: **2016-07-18 → 2018-09-20**

Helpers in `src/lib/data.ts` map a selected moment/ritual → constellation and build chronological journey stops.

---

## Project structure

```
src/
  app/                 # Next.js App Router (page, layout, styles)
  components/
    acts/              # Story acts (Opening, Rewind, Rituals, Sky, Letter, …)
    AppShell.tsx       # Chrome, back button, bottom tabs
    Cassette.tsx       # Tape UI + play cues
    JukeboxView.tsx
    PocketView.tsx
    ReceiptCard.tsx
    SpotifyPlayer.tsx
  data/                # Static datasets (committed)
  lib/                 # Types + data accessors / journey helpers
```

---

## Run locally

```bash
git clone https://github.com/Gourav12321/YourLifeInReceipts.git
cd YourLifeInReceipts
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

---

## Story flow (short)

```
Last Receipt ──Rewind──► other receipts
     │
     └──Constellations──► focused sky + journey timeline
              ▲
 Rituals ─────┘  (See this journey)
              │
              └──► Letter → restart
```

- **Rewind** = move between receipts  
- **Constellations** = see the journey of what you selected

---

## Deploy

Already live on Vercel and linked to this repo’s `main` branch:

- **App:** https://web-teal-two-93.vercel.app  
- **Repo:** https://github.com/Gourav12321/YourLifeInReceipts  

Push to `main` to redeploy.

---

## Caveats (from the data pack)

- Spotify timestamps are UTC; the ledger is local time — night-owl language only, not exact local hours  
- ~47% of ledger rows have a date but no time  
- Place names are anonymised  
- Treat the joined files as one fictional “You” — never name the person

---

## License / hackathon

Built as a frontend storytelling hackathon project. Dataset is included for demos; handle personal-finance–style data carefully if you fork.
