create extension if not exists pgcrypto;

do $$ begin
  create type public.site_mode as enum ('pre_event', 'live_event', 'post_event');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.publish_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.match_status as enum ('UPCOMING', 'LIVE', 'FINISHED', 'DELAYED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.session_status as enum ('UPCOMING', 'LIVE', 'COMPLETED');
exception when duplicate_object then null; end $$;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor', 'scorer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_team_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where user_id = auth.uid() and role in ('admin', 'editor', 'scorer')
  );
$$;

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nation text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  team_id uuid references public.teams(id) on delete set null,
  full_name text not null,
  gender text not null check (gender in ('Men', 'Women')),
  ranking text,
  club text,
  playing_side text,
  dominant_hand text,
  biography text,
  social_links jsonb not null default '{}'::jsonb,
  hero_media_id uuid,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  role text,
  philosophy text,
  preparation_approach text,
  tactical_priorities text,
  pair_building_philosophy text,
  competition_mindset text,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  venue text,
  location text,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  event_id uuid references public.events(id) on delete set null,
  title text not null,
  phase text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  objectives jsonb not null default '[]'::jsonb,
  brunch_after boolean not null default false,
  session_status public.session_status not null default 'UPCOMING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  coach_id uuid references public.coaches(id) on delete set null,
  report_body text,
  coach_debrief text,
  key_takeaways jsonb not null default '[]'::jsonb,
  player_quotes jsonb not null default '[]'::jsonb,
  featured_player_id uuid references public.players(id) on delete set null,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  category text not null,
  tags text[] not null default '{}',
  author_user_id uuid references auth.users(id) on delete set null,
  hero_media_id uuid,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  court text,
  scheduled_at timestamptz,
  team_a_id uuid references public.teams(id) on delete set null,
  team_b_id uuid references public.teams(id) on delete set null,
  status public.match_status not null default 'UPCOMING',
  winner_team_id uuid references public.teams(id) on delete set null,
  match_report text,
  replay_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.match_players (
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete restrict,
  side text not null check (side in ('A', 'B')),
  position smallint not null check (position in (1, 2)),
  primary key (match_id, player_id)
);

create table if not exists public.match_sets (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  set_number smallint not null check (set_number between 1 and 5),
  games_a smallint,
  games_b smallint,
  winner_side text check (winner_side in ('A', 'B')),
  unique (match_id, set_number)
);

create table if not exists public.live_scores (
  match_id uuid primary key references public.matches(id) on delete cascade,
  points_a text not null default '0',
  points_b text not null default '0',
  games_a smallint not null default 0,
  games_b smallint not null default 0,
  serving_side text check (serving_side in ('A', 'B')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.score_audit (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  previous_state jsonb,
  next_state jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.standings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  played smallint not null default 0,
  won smallint not null default 0,
  lost smallint not null default 0,
  points smallint not null default 0,
  updated_at timestamptz not null default now(),
  unique (event_id, team_id)
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  media_type text not null check (media_type in ('photo', 'video', 'press_article', 'press_release', 'download')),
  title text not null,
  storage_path text,
  external_url text,
  alt_text text,
  player_id uuid references public.players(id) on delete set null,
  session_id uuid references public.training_sessions(id) on delete set null,
  match_id uuid references public.matches(id) on delete set null,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.players drop constraint if exists players_hero_media_id_fkey;
alter table public.players add constraint players_hero_media_id_fkey foreign key (hero_media_id) references public.media(id) on delete set null;
alter table public.news drop constraint if exists news_hero_media_id_fkey;
alter table public.news add constraint news_hero_media_id_fkey foreign key (hero_media_id) references public.media(id) on delete set null;

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null check (tier in ('main', 'gold', 'silver', 'official_supplier')),
  logo_media_id uuid references public.media(id) on delete set null,
  website_url text,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.sponsor_impressions (
  id bigint generated always as identity primary key,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  placement text not null,
  occurred_at timestamptz not null default now()
);

create table if not exists public.live_links (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  youtube_url text,
  facebook_url text,
  replay_url text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  mode public.site_mode not null default 'pre_event',
  featured_player_id uuid references public.players(id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.site_settings (id, mode) values (true, 'pre_event') on conflict (id) do nothing;

create index if not exists training_sessions_starts_at_idx on public.training_sessions(starts_at);
create index if not exists matches_event_status_idx on public.matches(event_id, status);
create index if not exists news_status_published_idx on public.news(status, published_at desc);
create index if not exists media_status_published_idx on public.media(status, published_at desc);
create index if not exists score_audit_match_created_idx on public.score_audit(match_id, created_at desc);

alter table public.user_profiles enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.coaches enable row level security;
alter table public.events enable row level security;
alter table public.training_sessions enable row level security;
alter table public.training_reports enable row level security;
alter table public.news enable row level security;
alter table public.matches enable row level security;
alter table public.match_players enable row level security;
alter table public.match_sets enable row level security;
alter table public.live_scores enable row level security;
alter table public.score_audit enable row level security;
alter table public.standings enable row level security;
alter table public.media enable row level security;
alter table public.sponsors enable row level security;
alter table public.sponsor_impressions enable row level security;
alter table public.live_links enable row level security;
alter table public.site_settings enable row level security;

create policy "public read teams" on public.teams for select using (true);
create policy "public read published players" on public.players for select using (status = 'published' or public.is_team_admin());
create policy "public read published coaches" on public.coaches for select using (status = 'published' or public.is_team_admin());
create policy "public read published events" on public.events for select using (status = 'published' or public.is_team_admin());
create policy "public read sessions" on public.training_sessions for select using (true);
create policy "public read published reports" on public.training_reports for select using (status = 'published' or public.is_team_admin());
create policy "public read published news" on public.news for select using (status = 'published' or public.is_team_admin());
create policy "public read matches" on public.matches for select using (true);
create policy "public read match players" on public.match_players for select using (true);
create policy "public read match sets" on public.match_sets for select using (true);
create policy "public read live scores" on public.live_scores for select using (true);
create policy "public read standings" on public.standings for select using (true);
create policy "public read published media" on public.media for select using (status = 'published' or public.is_team_admin());
create policy "public read published sponsors" on public.sponsors for select using (status = 'published' or public.is_team_admin());
create policy "public read live links" on public.live_links for select using (true);
create policy "public read site settings" on public.site_settings for select using (true);
create policy "users read own profile" on public.user_profiles for select using (user_id = auth.uid() or public.is_team_admin());
create policy "admin manage user profiles" on public.user_profiles for all using (public.is_team_admin()) with check (public.is_team_admin());

create policy "admin manage teams" on public.teams for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage players" on public.players for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage coaches" on public.coaches for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage events" on public.events for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage sessions" on public.training_sessions for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage reports" on public.training_reports for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage news" on public.news for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage matches" on public.matches for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage match players" on public.match_players for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage match sets" on public.match_sets for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage live scores" on public.live_scores for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin read score audit" on public.score_audit for select using (public.is_team_admin());
create policy "admin insert score audit" on public.score_audit for insert with check (public.is_team_admin());
create policy "admin manage standings" on public.standings for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage media" on public.media for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage sponsors" on public.sponsors for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin record sponsor impressions" on public.sponsor_impressions for insert with check (true);
create policy "admin read sponsor impressions" on public.sponsor_impressions for select using (public.is_team_admin());
create policy "admin manage live links" on public.live_links for all using (public.is_team_admin()) with check (public.is_team_admin());
create policy "admin manage site settings" on public.site_settings for all using (public.is_team_admin()) with check (public.is_team_admin());
