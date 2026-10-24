# Ophelia's Mental Weather Log

Local-first single-page app for tracking daily mental health metrics (sleep, mood, energy, social).

- No backend, no network needed
- Data stays in the browser (`localStorage`), one entry per check-in per day
- React + Vite + TypeScript + Material UI

## Structure

- `src/App.tsx`: tab navigation
- `src/components/`: morning / evening check-in forms, animal archetype display, shared fields
- `src/storage.ts`: `localStorage` persistence
- `docs/`: project description and form reference

## Development

```bash
npm install
npm run dev      # dev server
npm run build    # static build in dist/
npm run preview  # serve the build
```

`dist/` is static and can be hosted anywhere.
