# Team Mauritius — Road to Island Padel Cup 2026

Premium editorial hub for Team Mauritius: selected squad, preparation camp, newsroom, Island Padel Cup event center, live scoring concept, results, standings, media and partners.

## Approved preparation calendar

| Date | Phase | Time | Objectives |
| --- | --- | --- | --- |
| 06 SEP | Assess | 07:00–09:00 | Team building · Player assessment · Pressure points |
| 13 SEP | Build | 07:00–09:00 | Pair chemistry · Communication · Tactical patterns |
| 24 SEP | Compete | 12:30–14:30 | Match simulation · Competition intensity · Pressure situations |
| 27 SEP | Final Camp | 07:00–09:00 | Final pairings · Island Cup simulation · Team briefing |

Brunch is linked only to the Sunday sessions and takes place at Caña Club after training.

## Local development

```bash
npm install
npm run dev
```

The app is available at `http://127.0.0.1:8080/`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

## Architecture and production status

- React + TypeScript + Vite.
- Public content is editable at source level and all visible controls are functional.
- The `/admin` route is a local demonstration surface using browser storage; it is intentionally absent from public navigation.
- Production administration still requires authentication, role-based permissions, durable storage, audit history and a protected API or Supabase project.
- Never place service-role keys or private credentials in the browser bundle.

The creative and implementation brief is documented in `PREMIUM_UPGRADE_PROMPT.md`.
