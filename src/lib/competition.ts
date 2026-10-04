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

export const competitionMatches: CompetitionMatch[] = [
  // ── ISLAND PADEL CUP 2026 · NATIONS DRAW (official programme) ─────────────
  { id: "ipc-d1-reu-mad-men", competition: "Island Padel Cup 2026", day: 1, date: "2026-10-01", category: "Men", stage: "Nations draw", team1: "La Réunion", team2: "Madagascar", country1: "La Réunion", country2: "Madagascar", status: "PENDING" },
  { id: "ipc-d1-reu-mad-women", competition: "Island Padel Cup 2026", day: 1, date: "2026-10-01", category: "Women", stage: "Nations draw", team1: "La Réunion", team2: "Madagascar", country1: "La Réunion", country2: "Madagascar", status: "PENDING" },
  { id: "ipc-d2-mad-mri-men", competition: "Island Padel Cup 2026", day: 2, date: "2026-10-02", category: "Men", stage: "Nations draw", team1: "Mauritius", team2: "Madagascar", country1: "Mauritius", country2: "Madagascar", status: "PENDING" },
  { id: "ipc-d2-mad-mri-women", competition: "Island Padel Cup 2026", day: 2, date: "2026-10-02", category: "Women", stage: "Nations draw", team1: "Mauritius", team2: "Madagascar", country1: "Mauritius", country2: "Madagascar", status: "PENDING" },
  { id: "ipc-d3-reu-mri-men", competition: "Island Padel Cup 2026", day: 3, date: "2026-10-03", category: "Men", stage: "Nations draw", team1: "Mauritius", team2: "La Réunion", country1: "Mauritius", country2: "La Réunion", status: "PENDING" },
  { id: "ipc-d3-reu-mri-women", competition: "Island Padel Cup 2026", day: 3, date: "2026-10-03", category: "Women", stage: "Nations draw", team1: "Mauritius", team2: "La Réunion", country1: "Mauritius", country2: "La Réunion", status: "PENDING" },

  // ── FINAL DAY · SUNDAY 04 OCTOBER ────────────────────────────────────────
  { id: "ipc-final-men", competition: "Island Padel Cup 2026", day: 4, date: "2026-10-04", category: "Men", stage: "Men's Final", team1: "Mauritius", team2: "La Réunion", country1: "Mauritius", country2: "La Réunion", status: "UPCOMING", image: "/images/sessions/session-03-compete/men-team.jpg" },
  { id: "ipc-final-women", competition: "Island Padel Cup 2026", day: 4, date: "2026-10-04", category: "Women", stage: "Women's Final", team1: "Madagascar", team2: "La Réunion", country1: "Madagascar", country2: "La Réunion", status: "UPCOMING" },

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
  if (m.status === "FINISHED") return { label: "FINAL", tone: "gold" };
  if (m.status === "UPCOMING") return { label: m.day === 4 && m.competition === "Island Padel Cup 2026" ? "FINAL · UPCOMING" : "UPCOMING", tone: "gold" };
  return { label: "RESULT PENDING", tone: "muted" };
}

export const AWAITING_RESULT = "Awaiting official result";
