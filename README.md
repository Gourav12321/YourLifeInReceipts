# Your Life, In Receipts

A frontend-only Next.js experience that turns a personal ledger and Spotify history into a scrollable story — last receipt, rewind, rituals, constellations, jukebox, and a closing letter.

## Stack

- Next.js 16 (App Router) + React 19 + Tailwind CSS 4
- Static JSON datasets under `src/data/` (no backend)

## Data included

| File | Contents |
|------|----------|
| `src/data/moments.json` | Story moments, rituals, constellations, soundtracks |
| `src/data/ledger.json` | Receipt / ledger rows |
| `src/data/plays_daily.json` | Daily Spotify play aggregates |
| `src/data/plays_monthly.json` | Monthly Spotify play aggregates |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Live

- GitHub: https://github.com/Gourav12321/YourLifeInReceipts
- Vercel: https://web-teal-two-93.vercel.app
