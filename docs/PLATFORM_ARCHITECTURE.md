# Team Mauritius Padel — Platform Architecture

## Decision

The existing React, TypeScript and Vite application remains the public experience. A disruptive Next.js rebuild is not justified while the current visual system and routing are working. Vercel Functions provide the public JSON API; Supabase provides authentication, relational data and media storage.

## Product phases

- `pre_event`: countdown, training camp, squad and newsroom.
- `live_event`: current matches, schedule, scoring, standings, stream links and match reports.
- `post_event`: official results, highlights, galleries, statistics and archive.

The global value is stored in `site_settings.mode`. The public `/api/site-mode` endpoint lets the same URL and frontend prioritize the correct content.

## Data ownership

- Supabase Postgres is the source of truth for editorial and competition records.
- Supabase Storage holds original photos, video files, downloads and sponsor assets.
- Browser storage is permitted only for local development and non-authoritative preferences.
- Public Vercel Functions use the Supabase anonymous key and RLS-protected read policies.
- Administrative mutations must use an authenticated Supabase session and server-side authorization.

## Identity and authorization

Roles are stored in `user_profiles`: `admin`, `editor`, and `scorer`.

- Admin: platform settings, users and all content.
- Editor: players, sessions, newsroom, media and sponsors.
- Scorer: matches, sets, live scores, results and standings.

The first administrator must be created deliberately in Supabase after that user signs in. No automatic public role assignment is allowed.

## Live scoring integrity

- Matches and players use UUIDs; names are display values only.
- `match_players` links player IDs to a match and side.
- `live_scores` holds the current broadcast state.
- `match_sets` stores completed set scores.
- Every scoring mutation writes previous and next state to `score_audit`.
- OBS reads only the public structured endpoints under `/api/live/`.

## Activation checklist

1. Create or select the Supabase project.
2. Apply both SQL migrations in order.
3. Create Storage buckets for `media-public` and `media-private` with appropriate policies.
4. Configure the Supabase URL and anonymous key in Vercel.
5. Enable the selected Supabase Auth provider.
6. Create the first admin profile manually using the authenticated user's UUID.
7. Replace the development-only admin surface with authenticated Supabase queries and mutations.
8. Validate live scoring, audit history and OBS endpoints before competition day.

## Known activation dependency

The public platform and empty-state APIs are deployable immediately. Real editorial publishing, durable scoring and secure administration cannot be activated until Supabase project access and approved administrator identities are provided.
