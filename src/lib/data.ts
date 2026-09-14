// Bump whenever seed players/matches change so cached browser state (see App.tsx readState) refreshes instead of hiding the update behind stale localStorage.
export const SEED_VERSION = 33;

export type PlayerGender = "Men" | "Women" | "Coach";

export type Player = {
  id: string;
  name: string;
  gender: PlayerGender;
  role?: string;
  ranking: string;
  club: string;
  nationality: string;
  playingSide: string;
  dominantHand: string;
  partner: string;
  biography: string;
  highlights: string[];
  recentResults: string[];
  quote: string;
  social: string;
  sponsors: string[];
  image?: string;
  // Optional landscape image for the profile hero when the card portrait would crop badly.
  detailImage?: string;
  // A second, distinct action shot (if one exists on disk) — used for Player Media so it never repeats the hero portrait.
  imageAlt?: string;
  // The player's own top-3 selected strengths from their Player Profile form — never invented.
  strengths?: string[];
  // Lifestyle / team / travel photos supplied by the player (Media Kit, photo 03) — separate from the main portrait.
  media?: string[];
  // Per-photo crop anchor for the profile hero image (CSS object-position) — only set when the default crop cuts the face off.
  heroFocus?: string;
  // Raw MPL numbers behind the `ranking`/`highlights` strings — used for the big stat tiles on the profile page.
  careerStats?: { tournaments: number; points: number; wins: number; podiums: number; rank: number; rankingPts: number };
  // The 8 counted (retenu) results behind `recentResults`, kept structured for the ranked results timeline.
  recentResultsDetailed?: MplResult[];
};

export type TrainingSession = {
  id: string;
  startsAt: string;
  date: string;
  shortDate: string;
  title: string;
  phase: "ASSESS" | "BUILD" | "COMPETE" | "FINAL CAMP";
  time: string;
  location: string;
  objectives: string[];
  brunch: boolean;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  summary: string;
  // Published by the media team once the session has taken place. Left undefined until real content exists.
  coachNote?: string;
  playerQuote?: { text: string; author: string };
  gallery?: string[];
  heroImage?: string;
  videoUrl?: string;
  videoClips?: string[];
  keyTakeaways?: string[];
  featuredPlayer?: string;
  completedAt?: string;
};

export type NewsItem = {
  id: string;
  slug: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  imageFocus?: string;
  featured?: boolean;
  author: string;
  tags: string[];
  // Full article text, published via the admin/Supabase phase. Left undefined until real copy exists.
  body?: string;
};

export type CoachData = { full_name: string; role: string | null; nationality: string | null; club: string | null; social_links: Record<string, string> | null; background: string | null; experience: string | null; philosophy: string | null; main_objective: string | null; preparation_priorities: string[] | null; playing_identity: string | null; expectations: string | null; message_to_team: string | null; team_word: string | null };

export type Match = {
  id: string;
  date: "01 OCT" | "02 OCT" | "03 OCT" | "04 OCT";
  court: string;
  nationA: string;
  nationB: string;
  pairA: string;
  pairB: string;
  playerIdsA: string[];
  playerIdsB: string[];
  status: "UPCOMING" | "LIVE" | "FINISHED" | "DELAYED";
  scheduled: string;
  setsA: number[];
  setsB: number[];
  gameA: number;
  gameB: number;
};

const playerImageSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-");

const playerImage = (name: string) => `/images/players/${playerImageSlug(name)}.jpg`;
// Players with a second, distinct action shot on disk (`-alt.jpg`) — used in Player Media so it never repeats the hero portrait.
const playersWithAltImage = new Set([
  "Mathieu Vallet", "Amaury de Beer", "Olivier Couacaud", "Jake Lam Hau Ching", "Ryan Wong", "Simon Koenig", "Nicolas Legros",
  "Marine Giraud", "Laura Koenig", "Alice Danjoux", "Kate Foo Kune", "Céline Desvaux de Marigny", "Cécile Park", "Magaly Schaffo",
]);
const playerImageAlt = (name: string) => playersWithAltImage.has(name) ? `/images/players/${playerImageSlug(name)}-alt.jpg` : undefined;

export type MplResult = { date: string; category: string; venue: string; partner: string; place: number; pts: number };
type MplStats = { rank: number; rankingPts: number; careerPts: number; careerTournaments: number; wins: number; podiums: number; club: string; recent: MplResult[] };

const formatResult = (r: MplResult) => `${r.date} · ${r.category} ${r.venue} · #${r.place} with ${r.partner} · ${r.pts.toLocaleString("en-US")} pts`;
const mplHighlights = (s: MplStats) => [
  `${s.careerTournaments} career tournaments · ${s.careerPts.toLocaleString("en-US")} career points`,
  `${s.wins} wins · ${s.podiums} podiums`,
];
const mplRanking = (s: MplStats) => `#${s.rank} · ${s.rankingPts.toLocaleString("en-US")} pts (Top 8)`;

// Source: Mauritius Padel League ranking tracker. Ranking period 01 Sep 2025 – 01 Sep 2026 (Top 8 scores).
// Career totals and "recent" (the 8 counted/retenu results making up rankingPts) below are sourced from the official
// player detail/ranking dashboard (ISLAND PADEL CUP 2026/players details ranking/*.png), the authoritative per-player historique.
const mplStats: Record<string, MplStats> = {
  "Mathieu Vallet": { rank: 1, rankingPts: 5450, careerPts: 24590, careerTournaments: 53, wins: 31, podiums: 45, club: "Caña Club", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Amaury de Beer", place: 3, pts: 750 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Amaury de Beer", place: 1, pts: 1000 },
    { date: "09 May 2026", category: "M500", venue: "Urban Sport Black River", partner: "Amaury de Beer", place: 1, pts: 500 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Olivier Couacaud", place: 1, pts: 1000 },
    { date: "17 Jan 2026", category: "M500", venue: "RM Club Tamarin", partner: "Amaury de Beer", place: 1, pts: 500 },
    { date: "12 Dec 2025", category: "M500", venue: "I Padel by RM Hennessy", partner: "Amaury de Beer", place: 1, pts: 500 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Amaury de Beer", place: 5, pts: 700 },
    { date: "17 Oct 2025", category: "M500", venue: "Urban Sport Grand Baie", partner: "Josselin Cotin", place: 1, pts: 500 },
  ] },
  "Amaury de Beer": { rank: 3, rankingPts: 4950, careerPts: 19150, careerTournaments: 36, wins: 27, podiums: 34, club: "RM Club", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Mathieu Vallet", place: 3, pts: 750 },
    { date: "20 Jun 2026", category: "M500", venue: "I Padel by RM Hennessy", partner: "Jake Lam Hau Ching", place: 1, pts: 500 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Mathieu Vallet", place: 1, pts: 1000 },
    { date: "09 May 2026", category: "M500", venue: "Urban Sport Black River", partner: "Mathieu Vallet", place: 1, pts: 500 },
    { date: "11 Apr 2026", category: "M500", venue: "I Padel by RM Port Chambly", partner: "Olivier Couacaud", place: 1, pts: 500 },
    { date: "14 Feb 2026", category: "M500", venue: "Labourdonnais Mapou", partner: "Jake Lam Hau Ching", place: 1, pts: 500 },
    { date: "17 Jan 2026", category: "M500", venue: "RM Club Tamarin", partner: "Mathieu Vallet", place: 1, pts: 500 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Mathieu Vallet", place: 5, pts: 700 },
  ] },
  "Olivier Couacaud": { rank: 2, rankingPts: 5125, careerPts: 16728, careerTournaments: 38, wins: 8, podiums: 29, club: "RM Club", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Enzo Couacaud", place: 1, pts: 1000 },
    { date: "11 Jul 2026", category: "M500", venue: "Terres Brunes Sports & Leisure", partner: "Jake Lam Hau Ching", place: 1, pts: 500 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Nicolas Legros", place: 3, pts: 750 },
    { date: "09 May 2026", category: "M500", venue: "Urban Sport Black River", partner: "Aaron Sanchez", place: 2, pts: 410 },
    { date: "11 Apr 2026", category: "M500", venue: "I Padel by RM Port Chambly", partner: "Amaury de Beer", place: 1, pts: 500 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Mathieu Vallet", place: 1, pts: 1000 },
    { date: "12 Dec 2025", category: "M500", venue: "I Padel by RM Hennessy", partner: "Enzo Couacaud", place: 2, pts: 400 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Sebastien Tronc", place: 9, pts: 565 },
  ] },
  "Jake Lam Hau Ching": { rank: 4, rankingPts: 4625, careerPts: 19790, careerTournaments: 77, wins: 25, podiums: 45, club: "Moka Rangers", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Nicolas Legros", place: 4, pts: 720 },
    { date: "11 Jul 2026", category: "M500", venue: "Terres Brunes Sports & Leisure", partner: "Olivier Couacaud", place: 1, pts: 500 },
    { date: "20 Jun 2026", category: "M500", venue: "I Padel by RM Hennessy", partner: "Amaury de Beer", place: 1, pts: 500 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Ryan Wong", place: 6, pts: 675 },
    { date: "09 May 2026", category: "M500", venue: "Urban Sport Black River", partner: "Samuel Ava", place: 3, pts: 395 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Ryan Wong", place: 3, pts: 750 },
    { date: "14 Feb 2026", category: "M500", venue: "Labourdonnais Mapou", partner: "Amaury de Beer", place: 1, pts: 500 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Ryan Wong", place: 9, pts: 585 },
  ] },
  "Ryan Wong": { rank: 6, rankingPts: 4095, careerPts: 12150, careerTournaments: 46, wins: 6, podiums: 16, club: "RM Club", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Aaron Sanchez", place: 7, pts: 615 },
    { date: "20 Jun 2026", category: "M500", venue: "I Padel by RM Hennessy", partner: "Olivier Couacaud", place: 4, pts: 350 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Jake Lam Hau Ching", place: 6, pts: 675 },
    { date: "11 Apr 2026", category: "M500", venue: "I Padel by RM Port Chambly", partner: "Mathieu Vallet", place: 2, pts: 400 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Jake Lam Hau Ching", place: 3, pts: 750 },
    { date: "12 Dec 2025", category: "M500", venue: "I Padel by RM Hennessy", partner: "Jake Lam Hau Ching", place: 3, pts: 385 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Jake Lam Hau Ching", place: 9, pts: 585 },
    { date: "19 Sep 2025", category: "M500", venue: "Studio by RM Azuri", partner: "Jake Lam Hau Ching", place: 3, pts: 335 },
  ] },
  "Simon Koenig": { rank: 7, rankingPts: 3990, careerPts: 10036, careerTournaments: 35, wins: 3, podiums: 9, club: "Caña Club", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Jason Rogers", place: 5, pts: 675 },
    { date: "11 Jul 2026", category: "M500", venue: "Terres Brunes Sports & Leisure", partner: "Mathieu Vallet", place: 2, pts: 400 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Jason Rogers", place: 7, pts: 635 },
    { date: "09 May 2026", category: "M500", venue: "Urban Sport Black River", partner: "Ryan Wong", place: 5, pts: 325 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Jason Rogers", place: 5, pts: 645 },
    { date: "12 Dec 2025", category: "M500", venue: "I Padel by RM Hennessy", partner: "Jason Rogers", place: 7, pts: 295 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Jason Rogers", place: 6, pts: 690 },
    { date: "17 Oct 2025", category: "M500", venue: "Urban Sport Grand Baie", partner: "Romain Bouic", place: 3, pts: 325 },
  ] },
  "Nicolas Legros": { rank: 5, rankingPts: 4245, careerPts: 15673, careerTournaments: 34, wins: 6, podiums: 23, club: "RM Club", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Jake Lam Hau Ching", place: 4, pts: 720 },
    { date: "20 Jun 2026", category: "M500", venue: "I Padel by RM Hennessy", partner: "Mathieu Vallet", place: 2, pts: 400 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Olivier Couacaud", place: 3, pts: 750 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Josselin Cotin", place: 2, pts: 800 },
    { date: "14 Feb 2026", category: "M500", venue: "Labourdonnais Mapou", partner: "Josselin Cotin", place: 7, pts: 275 },
    { date: "17 Jan 2026", category: "M500", venue: "RM Club Tamarin", partner: "Josselin Cotin", place: 2, pts: 400 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Josselin Cotin", place: 8, pts: 600 },
    { date: "19 Sep 2025", category: "M500", venue: "Studio by RM Azuri", partner: "Josselin Cotin", place: 4, pts: 300 },
  ] },
  "Magaly Schaffo": { rank: 1, rankingPts: 4900, careerPts: 6902, careerTournaments: 20, wins: 9, podiums: 12, club: "RM Club", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Marine Giraud", place: 2, pts: 700 },
    { date: "20 Jun 2026", category: "M500", venue: "I Padel by RM Hennessy", partner: "Marine Giraud", place: 1, pts: 500 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Marine Giraud", place: 1, pts: 1000 },
    { date: "11 Apr 2026", category: "M500", venue: "I Padel by RM Port Chambly", partner: "Marine Giraud", place: 1, pts: 500 },
    { date: "14 Feb 2026", category: "M500", venue: "Labourdonnais Mapou", partner: "Marine Giraud", place: 1, pts: 500 },
    { date: "17 Jan 2026", category: "M500", venue: "RM Club Tamarin", partner: "Marine Giraud", place: 1, pts: 500 },
    { date: "12 Dec 2025", category: "M500", venue: "I Padel by RM Hennessy", partner: "Marine Giraud", place: 1, pts: 500 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Ludivine Grondin", place: 3, pts: 700 },
  ] },
  "Marine Giraud": { rank: 2, rankingPts: 4700, careerPts: 8983, careerTournaments: 23, wins: 10, podiums: 14, club: "Terres Brunes", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Magaly Schaffo", place: 2, pts: 700 },
    { date: "11 Jul 2026", category: "M500", venue: "Terres Brunes Sports & Leisure", partner: "Kate Foo Kune", place: 1, pts: 500 },
    { date: "20 Jun 2026", category: "M500", venue: "I Padel by RM Hennessy", partner: "Magaly Schaffo", place: 1, pts: 500 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Magaly Schaffo", place: 1, pts: 1000 },
    { date: "11 Apr 2026", category: "M500", venue: "I Padel by RM Port Chambly", partner: "Magaly Schaffo", place: 1, pts: 500 },
    { date: "14 Feb 2026", category: "M500", venue: "Labourdonnais Mapou", partner: "Magaly Schaffo", place: 1, pts: 500 },
    { date: "17 Jan 2026", category: "M500", venue: "RM Club Tamarin", partner: "Magaly Schaffo", place: 1, pts: 500 },
    { date: "12 Dec 2025", category: "M500", venue: "I Padel by RM Hennessy", partner: "Magaly Schaffo", place: 1, pts: 500 },
  ] },
  "Laura Koenig": { rank: 3, rankingPts: 4525, careerPts: 16733, careerTournaments: 36, wins: 21, podiums: 30, club: "Caña Club", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Anna Blue Houareau", place: 1, pts: 1000 },
    { date: "20 Jun 2026", category: "M500", venue: "I Padel by RM Hennessy", partner: "Alice Danjoux", place: 2, pts: 325 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Alice Danjoux", place: 3, pts: 600 },
    { date: "09 May 2026", category: "M500", venue: "Urban Sport Black River", partner: "Alice Danjoux", place: 1, pts: 500 },
    { date: "11 Apr 2026", category: "M500", venue: "I Padel by RM Port Chambly", partner: "Alice Danjoux", place: 3, pts: 275 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Alice Danjoux", place: 1, pts: 1000 },
    { date: "14 Feb 2026", category: "M500", venue: "Labourdonnais Mapou", partner: "Alice Danjoux", place: 2, pts: 325 },
    { date: "17 Oct 2025", category: "M500", venue: "Urban Sport Grand Baie", partner: "Alice Danjoux", place: 1, pts: 500 },
  ] },
  "Alice Danjoux": { rank: 4, rankingPts: 3800, careerPts: 19312, careerTournaments: 45, wins: 25, podiums: 36, club: "RM Club", recent: [
    { date: "20 Jun 2026", category: "M500", venue: "I Padel by RM Hennessy", partner: "Laura Koenig", place: 2, pts: 325 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Laura Koenig", place: 3, pts: 600 },
    { date: "09 May 2026", category: "M500", venue: "Urban Sport Black River", partner: "Laura Koenig", place: 1, pts: 500 },
    { date: "11 Apr 2026", category: "M500", venue: "I Padel by RM Port Chambly", partner: "Laura Koenig", place: 3, pts: 275 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Laura Koenig", place: 1, pts: 1000 },
    { date: "14 Feb 2026", category: "M500", venue: "Labourdonnais Mapou", partner: "Laura Koenig", place: 2, pts: 325 },
    { date: "17 Oct 2025", category: "M500", venue: "Urban Sport Grand Baie", partner: "Laura Koenig", place: 1, pts: 500 },
    { date: "19 Sep 2025", category: "M500", venue: "Studio by RM Azuri", partner: "Laura Koenig", place: 5, pts: 275 },
  ] },
  "Céline Desvaux de Marigny": { rank: 5, rankingPts: 3465, careerPts: 12613, careerTournaments: 36, wins: 2, podiums: 28, club: "Urban Black River", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Cécile Park", place: 3, pts: 600 },
    { date: "11 Jul 2026", category: "M500", venue: "Terres Brunes Sports & Leisure", partner: "Cécile Park", place: 2, pts: 300 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Cécile Park", place: 2, pts: 700 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Cécile Park", place: 3, pts: 550 },
    { date: "14 Feb 2026", category: "M500", venue: "Labourdonnais Mapou", partner: "Cécile Park", place: 3, pts: 275 },
    { date: "12 Dec 2025", category: "M500", venue: "I Padel by RM Hennessy", partner: "Cécile Park", place: 2, pts: 325 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Cécile Park", place: 9, pts: 415 },
    { date: "17 Oct 2025", category: "M500", venue: "Urban Sport Grand Baie", partner: "Cécile Park", place: 3, pts: 300 },
  ] },
  "Cécile Park": { rank: 5, rankingPts: 3465, careerPts: 11782, careerTournaments: 34, wins: 2, podiums: 26, club: "Urban Sport", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Céline Desvaux de Marigny", place: 3, pts: 600 },
    { date: "11 Jul 2026", category: "M500", venue: "Terres Brunes Sports & Leisure", partner: "Céline Desvaux de Marigny", place: 2, pts: 300 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Céline Desvaux de Marigny", place: 2, pts: 700 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Céline Desvaux de Marigny", place: 3, pts: 550 },
    { date: "14 Feb 2026", category: "M500", venue: "Labourdonnais Mapou", partner: "Céline Desvaux de Marigny", place: 3, pts: 275 },
    { date: "12 Dec 2025", category: "M500", venue: "I Padel by RM Hennessy", partner: "Céline Desvaux de Marigny", place: 2, pts: 325 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Céline Desvaux de Marigny", place: 9, pts: 415 },
    { date: "17 Oct 2025", category: "M500", venue: "Urban Sport Grand Baie", partner: "Céline Desvaux de Marigny", place: 3, pts: 300 },
  ] },
  "Kate Foo Kune": { rank: 7, rankingPts: 3315, careerPts: 8292, careerTournaments: 30, wins: 4, podiums: 12, club: "Isla Padel", recent: [
    { date: "15 Aug 2026", category: "M1000", venue: "Caña Beau Plan", partner: "Martina Hola", place: 4, pts: 550 },
    { date: "11 Jul 2026", category: "M500", venue: "Terres Brunes Sports & Leisure", partner: "Marine Giraud", place: 1, pts: 500 },
    { date: "06 Jun 2026", category: "M1000", venue: "RM Club Grand Baie", partner: "Laetitia Gossart", place: 6, pts: 420 },
    { date: "11 Apr 2026", category: "M500", venue: "I Padel by RM Port Chambly", partner: "Laetitia Gossart", place: 2, pts: 325 },
    { date: "14 Mar 2026", category: "M1000", venue: "Sparc Cascavelle", partner: "Laetitia Gossart", place: 4, pts: 500 },
    { date: "12 Dec 2025", category: "M500", venue: "I Padel by RM Hennessy", partner: "Laetitia Gossart", place: 3, pts: 275 },
    { date: "31 Oct 2025", category: "M1000", venue: "Urban Sport Black River", partner: "Laetitia Gossart", place: 11, pts: 378 },
    { date: "19 Sep 2025", category: "M500", venue: "Studio by RM Azuri", partner: "Laetitia Gossart", place: 2, pts: 375 },
  ] },
};

// Real bio/quote/social submitted by players via their Player Profile form — overrides the placeholder text below.
const playerOverrides: Record<string, Partial<Player>> = {
  "Mathieu Vallet": {
    media: ["/images/players/mathieu-vallet-media-2.jpg", "/images/players/mathieu-vallet-media-3.jpg"],
  },
  "Olivier Couacaud": {
    media: ["/images/players/olivier-couacaud-media-2.jpg"],
  },
  "Jake Lam Hau Ching": {
    media: ["/images/players/jake-lam-hau-ching-media-2.jpg"],
  },
  "Nicolas Legros": {
    media: ["/images/players/nicolas-legros-media-2.jpg"],
  },
  "Alice Danjoux": {
    heroFocus: "center 42%",
  },
  "Laura Koenig": {
    detailImage: "/images/players/laura-koenig-hero.jpg",
    heroFocus: "center center",
  },
  "Amaury de Beer": {
    club: "RM Club Tamarin",
    biography: "I used to play tennis, switched to padel a few years ago for the fun, I represent RM Club Mauritius.",
    quote: "Keep calm, it's just padel",
    social: "@amodebeer",
    dominantHand: "Right-handed",
    playingSide: "Left",
    strengths: ["Smash", "Consistency"],
    media: ["/images/players/amaury-de-beer-media-2.jpg", "/images/players/amaury-de-beer-media-3.jpg"],
  },
  "Céline Desvaux de Marigny": {
    detailImage: "/images/players/celine-desvaux-de-marigny-hero.jpg",
    heroFocus: "center center",
    biography: "I'm coming from beach tennis but appreciate much more the padel. To play with my sister is just so special. I play at Urban Black River and enjoy the outdoor court as well as the good vibes and ambiance!",
    quote: "Trust the flow of life and believe in yourself!",
    social: "@celine_desvaux",
    dominantHand: "Left-handed",
    playingSide: "Right",
    media: ["/images/players/celine-desvaux-lifestyle-1.jpg", "/images/players/celine-desvaux-lifestyle-2.jpg"],
  },
  "Magaly Schaffo": {
    club: "RM Grand Baie",
    biography: "I am in Mauritius since 1 year. I am at RM Club. I can say that I never give up on the court but I accept the defeat because it is part of the game and it gives me something to aim for the next time.",
    quote: "Never give up",
    dominantHand: "Right-handed",
    playingSide: "Left",
    strengths: ["Attack", "Bandeja / Vibora", "Mentality"],
  },
  "Cécile Park": {
    biography: "I started padel 3 years ago and have been at Urban Sports Club since 2 years. It is such a social game, where we can share some good laughs and have a good sweat. There is still so much room for improvement, which is a good motivation for the future. As a player I think that the most important thing is consistency.",
    quote: "In it to kill it!",
    social: "@cec_park",
    dominantHand: "Right-handed",
    playingSide: "Left",
    strengths: ["Attack", "Defence", "Mentality"],
    media: ["/images/players/cecile-park-lifestyle-1.jpg"],
  },
  "Ryan Wong": {
    club: "RM Club Grand Baie",
    biography: "I'm an ambassador for RM Club and Tailwind, with a 17-year tennis background that shaped my attacking instincts at the net in padel.",
    quote: "Playing for Mauritius isn't just about winning points, it's about carrying the island's colours with pride",
    social: "@ryan_wong1",
    dominantHand: "Right-handed",
    playingSide: "Left",
    strengths: ["Attack", "Smash", "Volley"],
  },
};

export const players: Player[] = [
  ...[
    "Mathieu Vallet",
    "Amaury de Beer",
    "Olivier Couacaud",
    "Jake Lam Hau Ching",
    "Ryan Wong",
    "Simon Koenig",
    "Nicolas Legros",
  ].map((name): Player => {
    const stats = mplStats[name];
    return {
      id: playerImageSlug(name),
      name,
      gender: "Men" as const,
      ranking: mplRanking(stats),
      club: stats.club,
      nationality: "Mauritius",
      playingSide: "—",
      dominantHand: "—",
      partner: "To be confirmed",
      biography: "Player biography to be added by the Team Mauritius media team.",
      highlights: mplHighlights(stats),
      recentResults: stats.recent.map(formatResult),
      quote: "Quote to be published.",
      social: "—",
      sponsors: [],
      image: playerImage(name),
      imageAlt: playerImageAlt(name),
      careerStats: { tournaments: stats.careerTournaments, points: stats.careerPts, wins: stats.wins, podiums: stats.podiums, rank: stats.rank, rankingPts: stats.rankingPts },
      recentResultsDetailed: stats.recent,
      ...playerOverrides[name],
    };
  }),
  ...[
    "Magaly Schaffo",
    "Marine Giraud",
    "Laura Koenig",
    "Alice Danjoux",
    "Céline Desvaux de Marigny",
    "Cécile Park",
    "Kate Foo Kune",
  ].map((name): Player => {
    const stats = mplStats[name];
    return {
      id: playerImageSlug(name),
      name,
      gender: "Women" as const,
      ranking: mplRanking(stats),
      club: stats.club,
      nationality: "Mauritius",
      playingSide: "—",
      dominantHand: "—",
      partner: "To be confirmed",
      biography: "Player biography to be added by the Team Mauritius media team.",
      highlights: mplHighlights(stats),
      recentResults: stats.recent.map(formatResult),
      quote: "Quote to be published.",
      social: "—",
      sponsors: [],
      image: playerImage(name),
      imageAlt: playerImageAlt(name),
      careerStats: { tournaments: stats.careerTournaments, points: stats.careerPts, wins: stats.wins, podiums: stats.podiums, rank: stats.rank, rankingPts: stats.rankingPts },
      recentResultsDetailed: stats.recent,
      ...playerOverrides[name],
    };
  }),
  {
    id: "coach-adam-auckland",
    name: "Adam Auckland",
    gender: "Coach",
    role: "Head Coach",
    ranking: "—",
    club: "Team Mauritius",
    nationality: "—",
    playingSide: "—",
    dominantHand: "—",
    partner: "—",
    image: playerImage("Adam Auckland"),
    biography: "Lead the collective preparation and establish a clear competitive identity for Team Mauritius.",
    highlights: [
      "Pair combinations & chemistry",
      "Match strategy and court positioning",
      "Pressure scenarios & decision-making",
      "Competition-day routines",
      "Individual and collective feedback",
    ],
    recentResults: [],
    quote: "The goal: arrive in La Réunion with clear pair structures, shared tactical references and a united team culture.",
    social: "—",
    sponsors: [],
  },
];

export const trainingSessions: TrainingSession[] = [
  {
    id: "06-sep-assess",
    startsAt: "2026-09-06T07:00:00+04:00",
    date: "06 September 2026",
    shortDate: "06 SEP",
    title: "Assess",
    phase: "ASSESS",
    time: "07:00–09:00",
    location: "Caña Club",
    objectives: ["Team building", "Player assessment", "Pressure points"],
    brunch: true,
    status: "UPCOMING",
    summary: "The opening block: establish the baseline, meet the team and surface the pressure points before the work begins.",
  },
  {
    id: "13-sep-build",
    startsAt: "2026-09-13T07:00:00+04:00",
    date: "13 September 2026",
    shortDate: "13 SEP",
    title: "Build",
    phase: "BUILD",
    time: "07:00–09:00",
    location: "Caña Club",
    objectives: ["Pair chemistry", "Communication", "Tactical patterns"],
    brunch: true,
    status: "UPCOMING",
    summary: "From individual quality to collective rhythm: build the pair chemistry and shared language that will travel to La Réunion.",
  },
  {
    id: "24-sep-compete",
    startsAt: "2026-09-24T12:30:00+04:00",
    date: "24 September 2026",
    shortDate: "24 SEP",
    title: "Compete",
    phase: "COMPETE",
    time: "12:30–14:30",
    location: "Caña Club",
    objectives: ["Match simulation", "Competition intensity", "Pressure situations"],
    brunch: false,
    status: "UPCOMING",
    summary: "Competition mode: pressure situations, match simulation and the intensity required when every point starts to matter.",
  },
  {
    id: "27-sep-final-camp",
    startsAt: "2026-09-27T07:00:00+04:00",
    date: "27 September 2026",
    shortDate: "27 SEP",
    title: "Final Camp",
    phase: "FINAL CAMP",
    time: "07:00–09:00",
    location: "Caña Club",
    objectives: ["Final pairings", "Island Cup simulation", "Team briefing", "Official Team Mauritius photo"],
    brunch: true,
    status: "UPCOMING",
    summary: "No more experiments. Final pairings, the Island Cup simulation and the final team briefing before departure.",
  },
];

export const newsItems: NewsItem[] = [
  {
    id: "news-meet-team",
    slug: "meet-team-mauritius",
    category: "Team News",
    date: "06 September 2026",
    title: "Meet Team Mauritius",
    excerpt: "The selected squad comes together at Caña Club for team building, player assessment and the first pressure-point sequences.",
    image: "/images/newsroom/meet-team-training.jpg",
    imageFocus: "center 68%",
    featured: true,
    author: "Team Mauritius",
    tags: ["Team Mauritius", "Assess", "Caña Club"],
  },
  {
    id: "news-build",
    slug: "building-the-team",
    category: "Training Camp",
    date: "13 September 2026",
    title: "Building the team",
    excerpt: "Pair chemistry, communication and tactical patterns turn individual quality into a shared competitive language.",
    image: "/images/sessions/first-day-mathieu-nicolas.jpg",
    imageFocus: "center 44%",
    author: "Team Mauritius",
    tags: ["Training Camp", "Build", "Caña Club"],
  },
  {
    id: "news-competition",
    slug: "competition-mode",
    category: "Coach’s Corner",
    date: "24 September 2026",
    title: "Competition mode",
    excerpt: "A Thursday competition block from 12:30–14:30: match simulation, competition intensity and pressure situations.",
    image: "/images/newsroom/coach-around-team.png",
    imageFocus: "center center",
    author: "Team Mauritius",
    tags: ["Competition Mode", "Coach", "Caña Club"],
  },
  {
    id: "news-ready",
    slug: "ready-for-la-reunion",
    category: "Island Padel Cup",
    date: "27 September 2026",
    title: "Ready for La Réunion",
    excerpt: "Final pairings, an Island Cup simulation and the closing team briefing before departure.",
    image: "/images/newsroom/island-padel-cup-group.jpg",
    imageFocus: "center 52%",
    author: "Team Mauritius",
    tags: ["Final Camp", "La Réunion", "Team Mauritius"],
  },
  {
    id: "news-laura-koenig-focus",
    slug: "laura-koenig-the-only-point",
    category: "Player Focus",
    date: "Road to La Réunion 2026",
    title: "Laura Koenig: The Only Point",
    excerpt: "From Madagascar 2025 to La Réunion 2026: one point, one jersey and one new challenge.",
    image: "/images/players/laura-koenig-alt.jpg",
    imageFocus: "center 42%",
    author: "Team Mauritius",
    tags: ["Player Focus", "Laura Koenig", "Team Mauritius"],
  },
  {
    id: "news-magaly-schaffo-focus",
    slug: "magaly-schaffo-tennispro-to-padel",
    category: "Player Focus",
    date: "Road to La Réunion 2026",
    title: "Magaly Schaffo: Built for the Game",
    excerpt: "From building a court to representing Mauritius: a competitor shaped by family, attack and team purpose.",
    image: "/images/players/magaly-schaffo-newsroom.jpg",
    imageFocus: "center 30%",
    author: "Team Mauritius",
    tags: ["Player Focus", "Magaly Schaffo", "Team Mauritius"],
  },
  {
    id: "news-kate-foo-kune-focus",
    slug: "kate-foo-kune-badminton-to-padel",
    category: "Player Focus",
    date: "Road to La Réunion 2026",
    title: "Kate Foo Kune: The Fire Never Left",
    excerpt: "A new court, the same competitive fire: from Olympic badminton to Team Mauritius padel.",
    image: "/images/players/kate-foo-kune-newsroom.jpg",
    imageFocus: "center 25%",
    author: "Team Mauritius",
    tags: ["Player Focus", "Kate Foo Kune", "Team Mauritius"],
  },
  {
    id: "news-marine-giraud-focus",
    slug: "marine-giraud-wta-to-padel",
    category: "Player Focus",
    date: "Road to La Réunion 2026",
    title: "Marine Giraud: A Second Life",
    excerpt: "From world No. 233 on the WTA tour to Team Mauritius: the competition chapter reopened in padel.",
    image: "/images/players/marine-giraud-newsroom.jpg",
    imageFocus: "center 24%",
    author: "Team Mauritius",
    tags: ["Player Focus", "Marine Giraud", "Team Mauritius"],
  },
];

export const matches: Match[] = [
  {
    id: "match-001",
    date: "01 OCT",
    court: "Court 1",
    nationA: "Mauritius",
    nationB: "La Réunion",
    pairA: "Pair to be confirmed",
    pairB: "Pair to be confirmed",
    playerIdsA: [],
    playerIdsB: [],
    status: "UPCOMING",
    scheduled: "Schedule to be published",
    setsA: [],
    setsB: [],
    gameA: 0,
    gameB: 0,
  },
];

export const nations = ["Mauritius", "La Réunion", "Madagascar"];
export const event = {
  title: "Island Padel Cup 2026",
  date: "1–4 October 2026",
  venue: "Club de Champ Fleuri",
  place: "La Réunion",
};

export const navItems = [
  { label: "Home", to: "/" },
  { label: "Team", to: "/team" },
  { label: "Road to La Réunion", to: "/training" },
  { label: "Newsroom", to: "/news" },
  { label: "Island Padel Cup", to: "/island-padel-cup" },
  { label: "Live Center", to: "/live" },
];
