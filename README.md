# Ophelia's Pansies

Ophelia's Pansies is a quiet check-in for thoughts and feelings. Pansies, that's for thoughts: a morning note, an evening note, and a likeness for the day.

It is a sister to [Ophelia's Rosemaries](https://github.com/freddie-freeloader/hedwig), the letter desk. This repository stays named `mental-weather`. Check-ins still live in the browser under `mental-weather:` keys, and backups still use `"app": "mental-weather"`.

- No backend, no network needed
- Data stays in the browser (`localStorage`), one entry per check-in per day
- React + Vite + TypeScript + Material UI

## Structure

- `src/App.tsx`: welcome, theme, and section navigation
- `src/theme.ts`: sage, wax, and paper palette shared with Rosemaries
- `src/components/`: morning / evening check-in forms, animal archetype display, shared fields
- `src/storage.ts`: `localStorage` persistence
- Customize tab: rename, hide, reorder, add or delete questions (stored in `localStorage`, included in backups)
- History tab: export/import all data as a JSON backup (git-friendly)
- `docs/`: project description and form reference

## Development

```bash
npm install
npm run dev      # dev server
npm run build    # static build in dist/
npm run preview  # serve the build
npm test         # unit tests (vitest)
npm run test:e2e # Playwright (first: npx playwright install chromium)
npm run lint
```

`dist/` is static and can be hosted anywhere.

## GitHub Pages

- Workflow: `.github/workflows/deploy.yml` builds and deploys `dist/` on push to `main`.
- Enable once: repo Settings → Pages → Source: **GitHub Actions**.
- `vite.config.ts` uses `base: './'`, so it works under any repo path.
