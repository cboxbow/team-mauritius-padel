// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH — Island Padel Cup 2026 + P500 Saint-Denis results.
//
// To publish a new score, edit ONE entry in `competitionMatches` below:
//   • set `score` (e.g. "6-4 6-3"), `status: "FINISHED"` and `winner: 1 | 2`
//   • or `status: "LIVE"` while a match is on court
// Every page (Home, Live Center, Schedule, Results, Match pages) reads from here.
//
// To close the tournament after the finals, switch COMPETITION_PHASE to "TOURNAMENT_COMPLETE".
//
// RULE: never enter a score, opponent, time or result that is not officially confirmed.
// Unknown values stay undefined and are shown as "Awaiting official result".
// ─────────────────────────────────────────────────────────────────────────────

export type CompetitionPhase = "FINAL_DAY" | "TOURNAMENT_COMPLETE";
export const COMPETITION_PHASE: CompetitionPhase = "FINAL_DAY";

export const competitionPhaseCopy: Record<CompetitionPhase, { label: string; headline: string; badge: string }> = {
  FINAL_DAY: { label: "FINAL DAY", headline: "Final Day", badge: "FINAL DAY" },
  TOURNAMENT_COMPLETE: { label: "TOURNAMENT COMPLETE", headline: "Tournament Complete", badge: "COMPLETE" },
};

export const competitionEvent = {
  title: "Island Padel Cup 2026",
  dates: "1–4 October 2026",
  venue: "Club de Champ Fleuri",
  city: "Saint-Denis",
  place: "La Réunion",
  streamUrl: undefined as string | undefined,
};

export type CompetitionName = "Island Padel Cup 2026" | "P500 Saint-Denis";
export type Nation = "Mauritius" | "La Réunion" | "Madagascar";
export type MatchStatus = "UPCOMING" | "LIVE" | "FINISHED" | "PENDING";
export type CompetitionDay = 1 | 2 | 3 | 4;

export type CompetitionMatch = {
  id: string;
  tie?: string;
  competition: CompetitionName;
  day: CompetitionDay;
  date: string;
  category: "Men" | "Women";
  stage: string;
  team1: string;
  team2: string;
  country1?: Nation;
  country2?: Nation;
  score?: string;
  status: MatchStatus;
  winner?: 1 | 2;
  court?: string;
  time?: string;
  image?: string;
  streamUrl?: string;
  note?: string;
};

export const nationFlags: Record<Nation, string> = { Mauritius: "🇲🇺", "La Réunion": "🇷🇪", Madagascar: "🇲🇬" };
export const nationCodes: Record<Nation, string> = { Mauritius: "MRI", "La Réunion": "REU", Madagascar: "MAD" };
export const dayLabels: Record<CompetitionDay, string> = { 1: "Day 1", 2: "Day 2", 3: "Day 3", 4: "Final Day" };
export const dayDates: Record<CompetitionDay, string> = { 1: "Thu 01 Oct", 2: "Fri 02 Oct", 3: "Sat 03 Oct", 4: "Sun 04 Oct" };

const R = (name: string) => `/images/island-padel-cup-2026/results/${name}.jpg`;

export const competitionMatches: CompetitionMatch[] = [
  // ── ISLAND PADEL CUP 2026 · POOL RUBBERS (source: official Island Padel Cup result cards) ──
  // `tie` groups the 3 rubbers of a nations tie. Third-set notation: (7-5) = tie-break of set 2, [10-8] = super tie-break.
  // DAY 1 · La Réunion vs Madagascar
  { id: "d1-men-1", tie: "d1-men", competition: "Island Padel Cup 2026", day: 1, date: "2026-10-01", category: "Men", stage: "Pool", team1: "Romain / Giovann", team2: "Landry / Tiavina", country1: "La Réunion", country2: "Madagascar", score: "6-4 6-2", status: "FINISHED", winner: 1, image: R("d1-men-1") },
  { id: "d1-men-2", tie: "d1-men", competition: "Island Padel Cup 2026", day: 1, date: "2026-10-01", category: "Men", stage: "Pool", team1: "Paul Henry / Mickael", team2: "Corentin / Tokiana", country1: "La Réunion", country2: "Madagascar", score: "6-4 3-6 [10-8]", status: "FINISHED", winner: 1, image: R("d1-men-2") },
  { id: "d1-men-3", tie: "d1-men", competition: "Island Padel Cup 2026", day: 1, date: "2026-10-01", category: "Men", stage: "Pool", team1: "Silvain / Hugo", team2: "Miary Zo / Toavina", country1: "La Réunion", country2: "Madagascar", score: "6-4 4-6 [8-10]", status: "FINISHED", winner: 2, image: R("d1-men-3") },
  { id: "d1-women-1", tie: "d1-women", competition: "Island Padel Cup 2026", day: 1, date: "2026-10-01", category: "Women", stage: "Pool", team1: "Flore / Carole", team2: "Fitia Rob / Camille", country1: "La Réunion", country2: "Madagascar", score: "6-3 6-1", status: "FINISHED", winner: 1, image: R("d1-women-1") },
  { id: "d1-women-2", tie: "d1-women", competition: "Island Padel Cup 2026", day: 1, date: "2026-10-01", category: "Women", stage: "Pool", team1: "Anna Blue / Elisa", team2: "Prisca / Lalaina", country1: "La Réunion", country2: "Madagascar", score: "7-6 6-0", status: "FINISHED", winner: 1, image: R("d1-women-2") },
  // Official card shows a Mauritius flag for Elisa / Jennifer — Day 1 was La Réunion vs Madagascar and both wear La Réunion kit.
  { id: "d1-women-3", tie: "d1-women", competition: "Island Padel Cup 2026", day: 1, date: "2026-10-01", category: "Women", stage: "Pool", team1: "Elisa / Jennifer", team2: "Steffy / Fitia Rak", country1: "La Réunion", country2: "Madagascar", score: "6-3 6-2", status: "FINISHED", winner: 1, image: R("d1-women-3") },
  // DAY 2 · Mauritius vs Madagascar
  { id: "d2-men-1", tie: "d2-men", competition: "Island Padel Cup 2026", day: 2, date: "2026-10-02", category: "Men", stage: "Pool", team1: "Olivier Couacaud / Jake Lam Hau Ching", team2: "Miary Zo / Landry", country1: "Mauritius", country2: "Madagascar", score: "6-4 6-3", status: "FINISHED", winner: 1, image: R("d2-men-1") },
  { id: "d2-men-2", tie: "d2-men", competition: "Island Padel Cup 2026", day: 2, date: "2026-10-02", category: "Men", stage: "Pool", team1: "Amaury de Beer / Mathieu Vallet", team2: "Tiavina / Toavina", country1: "Mauritius", country2: "Madagascar", score: "6-0 7-6 (7-5)", status: "FINISHED", winner: 1, image: R("d2-men-2") },
  { id: "d2-men-3", tie: "d2-men", competition: "Island Padel Cup 2026", day: 2, date: "2026-10-02", category: "Men", stage: "Pool", team1: "Simon Koenig / Richard", team2: "Tokiana / Corentin", country1: "Mauritius", country2: "Madagascar", score: "4-6 7-5 [8-10]", status: "FINISHED", winner: 2, image: R("d2-men-3") },
  { id: "d2-women-1", tie: "d2-women", competition: "Island Padel Cup 2026", day: 2, date: "2026-10-02", category: "Women", stage: "Pool", team1: "Laura Koenig / Kate Foo Kune", team2: "Camille / Steffy", country1: "Mauritius", country2: "Madagascar", score: "6-4 6-2", status: "FINISHED", winner: 1, image: R("d2-women-1") },
  { id: "d2-women-2", tie: "d2-women", competition: "Island Padel Cup 2026", day: 2, date: "2026-10-02", category: "Women", stage: "Pool", team1: "Marinne Giraud / Magaly Schaffo", team2: "Fitia Rob / Lalaina", country1: "Mauritius", country2: "Madagascar", score: "3-6 4-6", status: "FINISHED", winner: 2, image: R("d2-women-2") },
  { id: "d2-women-3", tie: "d2-women", competition: "Island Padel Cup 2026", day: 2, date: "2026-10-02", category: "Women", stage: "Pool", team1: "Cécile Park / Alice Danjoux", team2: "Fitia Rak / Prisca", country1: "Mauritius", country2: "Madagascar", score: "5-7 2-6", status: "FINISHED", winner: 2, image: R("d2-women-3") },
  // DAY 3 · Mauritius vs La Réunion
  { id: "d3-men-1", tie: "d3-men", competition: "Island Padel Cup 2026", day: 3, date: "2026-10-03", category: "Men", stage: "Pool", team1: "Ryan Wong / Mathieu Vallet", team2: "Lucas / Mickael", country1: "Mauritius", country2: "La Réunion", score: "6-4 6-2", status: "FINISHED", winner: 1, image: R("d3-men-1") },
  { id: "d3-men-2", tie: "d3-men", competition: "Island Padel Cup 2026", day: 3, date: "2026-10-03", category: "Men", stage: "Pool", team1: "Nicolas Legros / Olivier Couacaud", team2: "Paul / Sylvain", country1: "Mauritius", country2: "La Réunion", score: "7-5 7-6 (8-6)", status: "FINISHED", winner: 1, image: R("d3-men-2") },
  { id: "d3-men-3", tie: "d3-men", competition: "Island Padel Cup 2026", day: 3, date: "2026-10-03", category: "Men", stage: "Pool", team1: "Amaury de Beer / Jake Lam Hau Ching", team2: "Hugo / Giovanni", country1: "Mauritius", country2: "La Réunion", score: "6-4 6-4", status: "FINISHED", winner: 1, image: R("d3-men-3") },
  { id: "d3-women-1", tie: "d3-women", competition: "Island Padel Cup 2026", day: 3, date: "2026-10-03", category: "Women", stage: "Pool", team1: "Céline Desvaux de Marigny / Cécile Park", team2: "Anna Blue / Laura", country1: "Mauritius", country2: "La Réunion", score: "1-6 2-6", status: "FINISHED", winner: 2, image: R("d3-women-1") },
  { id: "d3-women-2", tie: "d3-women", competition: "Island Padel Cup 2026", day: 3, date: "2026-10-03", category: "Women", stage: "Pool", team1: "Magaly Schaffo / Marinne Giraud", team2: "Flore / Élodie", country1: "Mauritius", country2: "La Réunion", score: "4-6 4-6", status: "FINISHED", winner: 2, image: R("d3-women-2") },
  { id: "d3-women-3", tie: "d3-women", competition: "Island Padel Cup 2026", day: 3, date: "2026-10-03", category: "Women", stage: "Pool", team1: "Kate Foo Kune / Laura Koenig", team2: "Elisa / Shona", country1: "Mauritius", country2: "La Réunion", score: "3-6 5-7", status: "FINISHED", winner: 2, image: R("d3-women-3") },

  // ── FINAL DAY · SUNDAY 04 OCTOBER · 18:00 GMT+4 (official finals visuals) ──
  { id: "ipc-final-men", competition: "Island Padel Cup 2026", day: 4, date: "2026-10-04", category: "Men", stage: "Men's Final", team1: "Mauritius", team2: "La Réunion", country1: "Mauritius", country2: "La Réunion", status: "UPCOMING", time: "18:00 (GMT+4)", image: R("finals-men") },
  { id: "ipc-final-women", competition: "Island Padel Cup 2026", day: 4, date: "2026-10-04", category: "Women", stage: "Women's Final", team1: "Madagascar", team2: "La Réunion", country1: "Madagascar", country2: "La Réunion", status: "UPCOMING", time: "18:00 (GMT+4)", image: R("finals-women") },

  // ── P500 SAINT-DENIS · SEPARATE COMPETITION (not part of the nations standings) ──
  { id: "p500-danjoux-koenig-r1", competition: "P500 Saint-Denis", day: 4, date: "2026-10-04", category: "Women", stage: "P500 Women", team1: "Alice Danjoux / Laura Koenig", team2: "Fanny Grondin / Joëlle Thien Kin Sien", country1: "Mauritius", score: "9-0", status: "FINISHED", winner: 1 },
  { id: "p500-desvaux-park-r1", competition: "P500 Saint-Denis", day: 4, date: "2026-10-04", category: "Women", stage: "P500 Women", team1: "Céline Desvaux de Marigny / Cécile Park", team2: "Allison Costa / Vanessa Cabon", country1: "Mauritius", score: "9-2", status: "FINISHED", winner: 1 },
  { id: "p500-schaffo-giraud", competition: "P500 Saint-Denis", day: 4, date: "2026-10-04", category: "Women", stage: "P500 Women · Seed TS8", team1: "Magaly Schaffo / Marinne Giraud", team2: "Opponents to be confirmed", country1: "Mauritius", status: "PENDING" },
];

// ── Derived helpers (no need to edit below) ────────────────────────────────
export const ipcMatches = competitionMatches.filter(m => m.competition === "Island Padel Cup 2026");
export const p500Matches = competitionMatches.filter(m => m.competition === "P500 Saint-Denis");
export const finals = ipcMatches.filter(m => m.day === 4);
export const isMauritiusMatch = (m: CompetitionMatch) => m.country1 === "Mauritius" || m.country2 === "Mauritius";
export const mauritiusIpcMatches = ipcMatches.filter(isMauritiusMatch);

/** WIN / LOSS from Team Mauritius' point of view — only when a confirmed winner exists. */
export function mauritiusOutcome(m: CompetitionMatch): "WIN" | "LOSS" | undefined {
  if (m.status !== "FINISHED" || !m.winner) return undefined;
  const mauritiusSide = m.country1 === "Mauritius" ? 1 : m.country2 === "Mauritius" ? 2 : undefined;
  if (!mauritiusSide) return undefined;
  return m.winner === mauritiusSide ? "WIN" : "LOSS";
}

export function matchBadge(m: CompetitionMatch): { label: string; tone: "red" | "gold" | "green" | "muted" } {
  if (m.status === "LIVE") return { label: "LIVE", tone: "red" };
  const outcome = mauritiusOutcome(m);
  if (outcome) return { label: outcome, tone: outcome === "WIN" ? "green" : "muted" };
  if (m.status === "FINISHED") { const w = m.winner === 1 ? m.country1 : m.winner === 2 ? m.country2 : undefined; return { label: w ? `${nationCodes[w]} WIN` : "FINISHED", tone: "gold" }; }
  if (m.status === "UPCOMING") return { label: m.day === 4 && m.competition === "Island Padel Cup 2026" ? "FINAL · UPCOMING" : "UPCOMING", tone: "gold" };
  return { label: "RESULT PENDING", tone: "muted" };
}

export const AWAITING_RESULT = "Awaiting official result";

// ── Nations ties (3 rubbers each) — derived from the rubbers above, nothing to edit here ──
export type NationsTie = { id: string; day: CompetitionDay; category: "Men" | "Women"; nation1: Nation; nation2: Nation; wins1: number; wins2: number; played: number; winner?: 1 | 2; image?: string };
const tieImages: Record<string, string> = { "d2-men": R("d2-men-team"), "d2-women": R("d2-women-team") };
export const nationsTies: NationsTie[] = [...new Set(ipcMatches.filter(m => m.tie).map(m => m.tie as string))].map(id => {
  const rubbers = ipcMatches.filter(m => m.tie === id);
  const first = rubbers[0];
  const wins1 = rubbers.filter(m => m.status === "FINISHED" && m.winner === 1).length;
  const wins2 = rubbers.filter(m => m.status === "FINISHED" && m.winner === 2).length;
  return { id, day: first.day, category: first.category, nation1: first.country1 as Nation, nation2: first.country2 as Nation, wins1, wins2, played: wins1 + wins2, winner: wins1 >= 2 ? 1 : wins2 >= 2 ? 2 : undefined, image: tieImages[id] };
});

export type StandingRow = { nation: Nation; played: number; won: number; rubbersWon: number; rubbersLost: number };
export function poolStandings(category: "Men" | "Women"): StandingRow[] {
  const nations: Nation[] = ["Mauritius", "La Réunion", "Madagascar"];
  return nations.map(nation => {
    const ties = nationsTies.filter(t => t.category === category && (t.nation1 === nation || t.nation2 === nation) && t.winner);
    const side = (t: NationsTie) => t.nation1 === nation ? 1 : 2;
    return {
      nation,
      played: ties.length,
      won: ties.filter(t => t.winner === side(t)).length,
      rubbersWon: ties.reduce((sum, t) => sum + (side(t) === 1 ? t.wins1 : t.wins2), 0),
      rubbersLost: ties.reduce((sum, t) => sum + (side(t) === 1 ? t.wins2 : t.wins1), 0),
    };
  }).sort((a, b) => b.won - a.won || (b.rubbersWon - b.rubbersLost) - (a.rubbersWon - a.rubbersLost));
}

// ── Tournament gallery (Club de Champ Fleuri, Day 3). Captions never name players unless identity is certain. ──
export const tournamentGallery: { src: string; caption: string }[] = [
  { src: "/images/island-padel-cup-2026/gallery/day3-01.jpg", caption: "Team Mauritius at the net · Day 3" },
  { src: "/images/island-padel-cup-2026/gallery/day3-03.jpg", caption: "Team Mauritius on court · Day 3" },
  { src: "/images/island-padel-cup-2026/gallery/day3-07.jpg", caption: "Team Mauritius · Club de Champ Fleuri" },
  { src: "/images/island-padel-cup-2026/gallery/day3-06.jpg", caption: "Fair play after the match · Day 3" },
  { src: "/images/island-padel-cup-2026/gallery/day3-02.jpg", caption: "Women's tie · Day 3" },
  { src: "/images/island-padel-cup-2026/gallery/day3-04.jpg", caption: "Rally at Club de Champ Fleuri · Day 3" },
  { src: "/images/island-padel-cup-2026/gallery/day3-05.jpg", caption: "Between points · Day 3" },
  { src: "/images/island-padel-cup-2026/gallery/day3-08.jpg", caption: "Team Mauritius in action · Day 3" },
];
