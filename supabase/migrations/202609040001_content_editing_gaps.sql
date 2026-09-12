-- Closes gaps between the existing schema and the frontend Player/TrainingSession types
-- so the admin UI (M3) can fully replace the hand-edited fields in src/lib/data.ts.

alter table public.players add column if not exists quote text;
alter table public.players add column if not exists strengths text[] not null default '{}';

alter table public.site_settings add column if not exists youtube_url text;

alter table public.media add column if not exists role text check (role in ('alt', 'gallery')) default 'gallery';
