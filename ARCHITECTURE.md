# Architecture

## Goals

- **Frontend-only:** no API routes, no database — story + data ship as static assets.
- **Act-based UI:** each story chapter is an isolated component under `src/components/acts/`.
- **Shared chrome:** `AppShell` owns header, back navigation, mute, and bottom tabs.
- **Data layer:** `src/lib/data.ts` + `src/lib/types.ts` are the only places that know JSON shape.

## Layers

```
src/app/          → routing, metadata, global styles, page composition
src/components/   → UI (shell, receipts, cassette, tabs views)
src/components/acts/ → story acts (Opening → Rewind → Rituals → Sky → Letter)
src/hooks/        → reusable client state (e.g. now-playing)
src/lib/          → types + pure data accessors / journey mapping
src/data/         → committed JSON datasets
```

## Navigation model

| Tab | Source of truth |
|-----|-----------------|
| Paper | `act` ∈ {0,1,4,6} |
| Constellations | `act === 5` or tab forced to constellations |
| Jukebox / Pocket | dedicated views, independent of act |

Selecting a receipt or ritual sets `skyFocus` (constellation id). The sky pans to that cluster and builds a chronological journey list via `journeyForConstellation`.

## Performance notes

- Heavy views (`Act5Sky`, `JukeboxView`, `PocketView`) load via `next/dynamic` (client-only).
- Fonts use `display: "swap"`.
- Route-level `loading.tsx` for first paint feedback.
- Large JSON is imported statically once; filtering stays in memory helpers.

## Accessibility

- Skip link to `#main-content`
- `aria-current` on active tab
- Mute control exposes `aria-pressed`
- `prefers-reduced-motion` disables entrance animations
