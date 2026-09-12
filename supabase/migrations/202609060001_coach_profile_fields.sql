-- Closes gaps between the coaches table and the real Head Coach Profile form
-- (nationality, club/structure, social, background, experience, preparation
-- priorities, objective, playing identity, expectations, message, team word).

alter table public.coaches add column if not exists nationality text;
alter table public.coaches add column if not exists club text;
alter table public.coaches add column if not exists social_links jsonb not null default '{}'::jsonb;
alter table public.coaches add column if not exists background text;
alter table public.coaches add column if not exists experience text;
alter table public.coaches add column if not exists preparation_priorities text[] not null default '{}';
alter table public.coaches add column if not exists main_objective text;
alter table public.coaches add column if not exists playing_identity text;
alter table public.coaches add column if not exists expectations text;
alter table public.coaches add column if not exists message_to_team text;
alter table public.coaches add column if not exists team_word text;
alter table public.coaches add column if not exists hero_media_id uuid references public.media(id) on delete set null;
