# Contributing

Thanks for checking out **Your Life, In Receipts**.

## Setup

```bash
npm install
npm run dev
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

## Guidelines

1. Keep the app **frontend-only** — prefer static data over new API routes.
2. Put story screens in `src/components/acts/`; shared chrome in `src/components/`.
3. Add data helpers to `src/lib/data.ts` instead of reaching into JSON from UI.
4. Respect anonymisation: never invent real names for `Place N` tokens.
5. Prefer mobile-first layout; test at ~375px and ~1024px widths.

## Pull requests

- Describe the story/UX change, not only the files touched.
- Note any dataset assumptions you relied on.
