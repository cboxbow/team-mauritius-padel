// Converts Supabase/PostgREST rows (snake_case, DB-shaped) into the existing frontend
// types from ./data.ts, so App.tsx and platform-sections.tsx render them with zero changes.
// Fields the admin can't edit yet (career stats, results timeline, highlights, sponsors,
// nationality, partner) are never in the DB — they're merged in from the matching static
// seed player, which stays the permanent source for that data (see docs/PLATFORM_ARCHITECTURE.md).

import type { Player, TrainingSession, NewsItem } from "./data";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

type DbMediaRow = {
  id: string;
  storage_path: string | null;
  external_url: string | null;
  role: "alt" | "gallery" | null;
  media_type?: string;
};

function mediaUrl(row: DbMediaRow): string | undefined {
  if (row.storage_path && SUPABASE_URL) return `${SUPABASE_URL}/storage/v1/object/public/media-public/${row.storage_path}`;
  return row.external_url ?? undefined;
}

type DbPlayerRow = {
  id: string;
  slug: string;
  full_name: string;
  ranking: string | null;
  club: string | null;
  playing_side: string | null;
  dominant_hand: string | null;
  biography: string | null;
  quote: string | null;
  strengths: string[] | null;
  social_links: Record<string, string> | null;
  hero_media_id: string | null;
  media: DbMediaRow[];
};

export function mapPlayerRow(row: DbPlayerRow, seed: Player): Player {
  const hero = row.media.find(m => m.id === row.hero_media_id);
  const alt = row.media.find(m => m.role === "alt");
  const gallery = row.media.filter(m => m.role === "gallery" || m.role === null);
  const instagram = row.social_links?.instagram;
  return {
    ...seed,
    id: row.slug,
    ranking: row.ranking ?? seed.ranking,
    club: row.club ?? seed.club,
    playingSide: row.playing_side ?? seed.playingSide,
    dominantHand: row.dominant_hand ?? seed.dominantHand,
    biography: row.biography ?? seed.biography,
    quote: row.quote ?? seed.quote,
    social: instagram ? `@${instagram}` : seed.social,
    strengths: row.strengths?.length ? row.strengths : seed.strengths,
    image: hero ? mediaUrl(hero) ?? seed.image : seed.image,
    imageAlt: alt ? mediaUrl(alt) ?? seed.imageAlt : seed.imageAlt,
    media: gallery.length ? gallery.map(mediaUrl).filter((u): u is string => Boolean(u)) : seed.media,
  };
}

type DbTrainingSessionRow = {
  id: string;
  session_status: "UPCOMING" | "LIVE" | "COMPLETED";
  report: {
    coach_debrief: string | null;
    key_takeaways: string[] | null;
    player_quotes: { text: string; author: string }[] | null;
    featured_player_id: string | null;
  } | null;
  media: DbMediaRow[];
};

export function mapTrainingSessionRow(row: DbTrainingSessionRow, seed: TrainingSession): TrainingSession {
  const photos = row.media.filter(m => m.media_type !== "video" && m.role !== "alt");
  const gallery = photos.map(mediaUrl).filter((u): u is string => Boolean(u));
  const hero = row.media.find(m => m.media_type !== "video" && m.role === "alt");
  const videos = row.media.filter(m => m.media_type === "video");
  const linkedVideo = videos.find(m => m.external_url?.includes("youtube") || m.external_url?.includes("youtu.be") || m.external_url?.includes("instagram") || m.external_url?.includes("vimeo"));
  const clips = videos.filter(m => m.storage_path).map(mediaUrl).filter((u): u is string => Boolean(u));
  return {
    ...seed,
    status: row.session_status,
    coachNote: row.report?.coach_debrief ?? seed.coachNote,
    keyTakeaways: row.report?.key_takeaways?.length ? row.report.key_takeaways : seed.keyTakeaways,
    playerQuote: row.report?.player_quotes?.[0] ?? seed.playerQuote,
    gallery: gallery.length ? gallery : seed.gallery,
    heroImage: hero ? mediaUrl(hero) : seed.heroImage,
    videoUrl: linkedVideo ? mediaUrl(linkedVideo) : seed.videoUrl,
    videoClips: clips.length ? clips : seed.videoClips,
  };
}

type DbNewsRow = {
  id: string;
  slug: string;
  category: string;
  published_at: string | null;
  title: string;
  excerpt: string | null;
  body: string | null;
  hero_media_url: string | null;
  hero_media_storage_path: string | null;
  tags: string[] | null;
};

export function mapNewsRow(row: DbNewsRow): NewsItem {
  const image = row.hero_media_storage_path
    ? mediaUrl({ id: "", storage_path: row.hero_media_storage_path, external_url: null, role: null })
    : row.hero_media_url;
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    date: row.published_at ? new Date(row.published_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "",
    title: row.title,
    excerpt: row.excerpt ?? "",
    body: row.body ?? undefined,
    image: image ?? "/images/event-cover.png",
    author: "Team Mauritius",
    tags: row.tags ?? [],
  };
}
