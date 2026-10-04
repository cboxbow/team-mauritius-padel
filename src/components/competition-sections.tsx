import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, MapPin, Play, Radio, Trophy } from "lucide-react";
import {
  AWAITING_RESULT, COMPETITION_PHASE, competitionEvent, competitionPhaseCopy, dayDates, dayLabels, finals, ipcMatches, matchBadge,
  mauritiusOutcome, nationCodes, nationsTies, p500Matches, p500MenFinal, p500PairMatches, p500Pairs, poolStandings, tournamentGallery, type CompetitionDay, type CompetitionMatch, type Nation, type NationsTie,
} from "../lib/competition";
import type { TrainingSession } from "../lib/data";
import { CampaignBackground } from "./brand";

const phase = competitionPhaseCopy[COMPETITION_PHASE];

// Inline SVG flags: emoji flags do not render on Windows browsers.
export function Flag({ nation, className = "" }: { nation: Nation; className?: string }) {
  const label = `${nation} flag`;
  if (nation === "Mauritius") return <svg className={`flag ${className}`} viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="6" fill="#ea2839" /><rect y="6" width="36" height="6" fill="#1a206d" /><rect y="12" width="36" height="6" fill="#ffd500" /><rect y="18" width="36" height="6" fill="#00a551" /></svg>;
  if (nation === "Madagascar") return <svg className={`flag ${className}`} viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="24" fill="#fff" /><rect x="12" width="24" height="12" fill="#fc3d32" /><rect x="12" y="12" width="24" height="12" fill="#007e3a" /></svg>;
  return <svg className={`flag ${className}`} viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="24" fill="#0b3d91" /><g fill="#ffd500">{[-60, -36, -12, 12, 36, 60].map(angle => <polygon key={angle} points="18,24 16.6,2 19.4,2" transform={`rotate(${angle} 18 24)`} />)}</g><polygon points="0,24 18,13 36,24" fill="#ef3340" /></svg>;
}

function Badge({ label, tone }: { label: string; tone: "red" | "gold" | "green" | "muted" }) {
  return <span className={`tag tag-${tone} result-badge result-badge-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{label === "LIVE" && <span className="live-dot" />}{label}</span>;
}

function NationLine({ nation, name, winner }: { nation?: Nation; name: string; winner?: boolean }) {
  return <div className={`cm-side${winner ? " is-winner" : ""}`}>
    {nation && <Flag nation={nation} className="cm-flag" />}
    <div><strong>{name}</strong>{nation && name !== nation && <small>{nation}</small>}</div>
  </div>;
}

export function CompetitionHero() {
  return <section className="cx-hero">
    <img className="cx-hero-photo" src="/images/Team Mauritius 2.jpeg" alt="Official Team Mauritius squad for the Island Padel Cup 2026" />
    <span className="cx-hero-scrim" />
    <CampaignBackground variant="editorial" intensity={0.35} />
    <div className="cx-hero-copy">
      <p className="eyebrow light"><span className="live-dot" /> {competitionEvent.title.toUpperCase()} <span className="slash">/</span> {phase.label}</p>
      <h1>{phase.headline}<span className="red-dot">.</span></h1>
      <p className="cx-hero-team">Team Mauritius <Flag nation="Mauritius" className="cx-hero-flag" /></p>
      <p className="cx-hero-meta"><MapPin size={15} /> {competitionEvent.city} — {competitionEvent.place} <span /> {competitionEvent.dates}</p>
      <div className="hero-actions">
        <Link className="button" to="/live">{COMPETITION_PHASE === "FINAL_DAY" ? "Follow the action" : "See the results"}<ArrowUpRight size={15} /></Link>
        <Link className="button button-secondary" to="/team">Team Mauritius<ArrowUpRight size={15} /></Link>
      </div>
    </div>
  </section>;
}

export function CompetitionStrip() {
  if (COMPETITION_PHASE === "FINAL_DAY") return <section className="cx-strip">
    <div><p className="eyebrow">FINAL DAY · LA RÉUNION · TWO EVENTS</p><strong>Island Padel Cup 2026 <i>+</i> P500 Saint-Denis</strong></div>
    <Badge label="FINAL DAY" tone="red" />
  </section>;
  return <FinalWeekendRecap />;
}

/** Two separate competitions, told side by side — never merged. */
export function FinalWeekendRecap() {
  const ipcMen = finals.find(m => m.category === "Men");
  const ipcMauritiusSide = ipcMen?.country1 === "Mauritius" ? 1 : 2;
  const ipcDone = ipcMen?.status === "FINISHED" && ipcMen.winner;
  const ipcLabel = ipcDone ? (ipcMen.winner === ipcMauritiusSide ? "🏆 Mauritius — Men's Champions" : "🥈 Mauritius — Men's Runner-Up") : AWAITING_RESULT;
  return <section className="weekend-recap">
    <p className="eyebrow">FINAL WEEKEND RECAP · LA RÉUNION · 04 OCTOBER 2026</p>
    <div className="weekend-recap-grid">
      <Link to="/results#island-padel-cup" className="weekend-recap-card"><small>ISLAND PADEL CUP 2026 · NATIONS</small><strong>{ipcLabel}</strong><span>{ipcDone ? "Final: La Réunion 2–0 Mauritius" : ""}</span></Link>
      <Link to="/results#p500" className={`weekend-recap-card${p500Won() ? " is-gold" : ""}`}><small>P500 SAINT-DENIS · PAIRS</small><strong>{p500Won() ? "🏆 Mathieu VALLET / Amaury DE BEER — Champions" : "Mathieu VALLET / Amaury DE BEER — Finalists"}</strong><span>{p500MenFinal?.score ? `Final: ${p500MenFinal.score.split(" ").join(" / ")}` : ""}</span></Link>
    </div>
  </section>;
}

function FinalCard({ match }: { match: CompetitionMatch }) {
  const badge = matchBadge(match);
  const isMauritius = match.country1 === "Mauritius" || match.country2 === "Mauritius";
  return <Link to={`/matches/${match.id}`} className={`final-card${isMauritius ? " is-mauritius" : ""}${match.status === "LIVE" ? " is-live" : ""}`}>
    {match.image && <img className="final-card-photo" src={match.image} alt="" loading="lazy" />}
    <span className="final-card-scrim" />
    <div className="final-card-top"><span><Trophy size={15} /> {match.stage}</span><Badge {...badge} /></div>
    <div className="final-card-teams">
      <div className={match.winner === 1 ? "is-winner" : ""}>{match.country1 && <Flag nation={match.country1} className="final-flag" />}<strong>{match.team1}</strong><small>{match.country1 && nationCodes[match.country1]}</small></div>
      <em>VS</em>
      <div className={match.winner === 2 ? "is-winner" : ""}>{match.country2 && <Flag nation={match.country2} className="final-flag" />}<strong>{match.team2}</strong><small>{match.country2 && nationCodes[match.country2]}</small></div>
    </div>
    {match.status === "FINISHED" && match.winner && <div className="final-card-result">
      <span><b>🏆 Champions</b>{match.winner === 1 ? match.team1 : match.team2}</span>
      <span><b>🥈 Runners-up</b>{match.winner === 1 ? match.team2 : match.team1}</span>
    </div>}
    {match.status === "FINISHED" && ipcMatches.some(m => m.tie === `d4-${match.category === "Men" ? "men" : "women"}`) && <div className="fr-rubbers is-compact">{ipcMatches.filter(m => m.tie === `d4-${match.category === "Men" ? "men" : "women"}`).map(m => <FinalRubberLine match={m} key={m.id} />)}</div>}
    <div className="final-card-foot">
      <span>{match.status === "FINISHED" && match.score && match.winner ? `FT · ${match.winner === 1 ? match.team1 : match.team2} ${Math.max(...match.score.split("-").map(Number))}–${Math.min(...match.score.split("-").map(Number))} ${match.winner === 1 ? match.team2 : match.team1}` : match.score ?? (match.status === "LIVE" ? "Live now" : "Result pending")}</span>
      <span>{[match.time, match.court].filter(Boolean).join(" · ") || dayDates[4]}</span>
    </div>
  </Link>;
}

export function FinalDaySection({ compact = false }: { compact?: boolean }) {
  const men = finals.find(m => m.category === "Men");
  const women = finals.find(m => m.category === "Women");
  return <section className={`section final-day${compact ? " is-compact" : ""}`}>
    <CampaignBackground variant="subtle" intensity={0.18} />
    <div className="final-day-head">
      <p className="eyebrow">ISLAND PADEL CUP 2026 · SUNDAY 04 OCTOBER</p>
      <h2>Final Day<span className="red-dot">.</span></h2>
      <p>La Réunion won the men's final 2-0 — Mauritius finish runners-up after topping the round-robin. Women's final: Madagascar vs La Réunion.</p>
    </div>
    <div className="final-grid">{[men, women].filter((m): m is CompetitionMatch => Boolean(m)).map(match => <FinalCard match={match} key={match.id} />)}</div>
    <p className="final-day-note">Finals played at 18:00 (GMT+4) · Club de Champ Fleuri, Saint-Denis. Results are published once official.</p>
  </section>;
}

export function ResultCard({ match }: { match: CompetitionMatch }) {
  const badge = matchBadge(match);
  return <Link to={`/matches/${match.id}`} className={`cm-card${match.status === "LIVE" ? " is-live" : ""}${match.image && match.stage === "Pool" ? " has-thumb" : ""}`}>
    {match.image && match.stage === "Pool" && <img className="cm-thumb" src={match.image} alt={`Official result card: ${match.team1} vs ${match.team2}`} loading="lazy" />}
    <div className="cm-top"><span>{match.competition === "P500 Saint-Denis" ? `P500 SAINT-DENIS · ${match.category === "Men" ? "MEN" : "WOMEN"} · ${(match.round ?? match.matchNo ?? "").toUpperCase()}` : `${dayLabels[match.day].toUpperCase()} · ${match.category === "Men" ? "MEN" : "WOMEN"} · ${match.stage.toUpperCase()}`}</span><Badge {...badge} /></div>
    <div className="cm-body">
      <NationLine nation={match.country1} name={match.team1} winner={match.winner === 1} />
      <div className="cm-score">{match.score ?? <span>{match.status === "LIVE" ? "LIVE" : "—"}</span>}</div>
      <NationLine nation={match.country2} name={match.team2} winner={match.winner === 2} />
    </div>
    <div className="cm-foot"><span>{match.competition === "P500 Saint-Denis" ? (match.matchNo ?? "P500") : dayDates[match.day]}{match.time ? ` · ${match.time}` : ""}{match.court ? ` · ${match.court}` : ""}</span><span>{match.status === "FINISHED" ? "Confirmed result" : match.status === "PENDING" ? AWAITING_RESULT : match.status === "LIVE" ? "On court" : "Upcoming"}</span></div>
  </Link>;
}

// ── Island Padel Cup 2026 · men's final result (official) ──
const menFinal = () => finals.find(m => m.category === "Men");
const menFinalRubbers = () => ipcMatches.filter(m => m.tie === "d4-men");
const surnames = (pair: string) => pair.split(" / ").map(p => p.split(" ").filter(w => w === w.toUpperCase() && /[A-ZÀ-Ý]/.test(w)).join(" ")).join(" / ");
const flip = (score: string) => score.replace(/(\d+)-(\d+)/g, "$2-$1");

/** One decisive match, written from the winner's side ("GRENIER / MARCILLE 7-5 6-4 COUACAUD / LEGROS"). */
function FinalRubberLine({ match, full = false }: { match: CompetitionMatch; full?: boolean }) {
  if (!match.score || !match.winner) return null;
  const winnerPair = match.winner === 1 ? match.team1 : match.team2;
  const loserPair = match.winner === 1 ? match.team2 : match.team1;
  const winnerNation = match.winner === 1 ? match.country1 : match.country2;
  const loserNation = match.winner === 1 ? match.country2 : match.country1;
  const score = match.winner === 1 ? match.score : flip(match.score);
  return <Link to={`/matches/${match.id}`} className="final-rubber">
    <span className="final-rubber-ft">FT</span>
    <span className="final-rubber-pair is-winner">{winnerNation && <Flag nation={winnerNation} className="cm-flag" />}{full ? winnerPair : surnames(winnerPair)}</span>
    <b>{score}</b>
    <span className="final-rubber-pair">{loserNation && <Flag nation={loserNation} className="cm-flag" />}{full ? loserPair : surnames(loserPair)}</span>
  </Link>;
}

/** Homepage story 01: official men's final result. */
export function FinalResultHero() {
  const final = menFinal();
  if (!final || final.status !== "FINISHED" || !final.winner) return <CompetitionHero />;
  const champion = (final.winner === 1 ? final.country1 : final.country2) as Nation;
  const runnerUp = (final.winner === 1 ? final.country2 : final.country1) as Nation;
  const [s1, s2] = (final.score ?? "0-0").split("-").map(Number);
  const champScore = final.winner === 1 ? s1 : s2, runnerScore = final.winner === 1 ? s2 : s1;
  return <section className="fr-hero">
    <img className="cx-hero-photo" src="/images/Team Mauritius 2.jpeg" alt="Official Team Mauritius squad at the Island Padel Cup 2026" />
    <span className="cx-hero-scrim fr-scrim" />
    <CampaignBackground variant="editorial" intensity={0.3} />
    <div className="fr-copy">
      <p className="eyebrow light">ISLAND PADEL CUP 2026 <span className="slash">/</span> FINAL RESULT · MEN</p>
      <h1>{champion}<br /><span>Champions</span></h1>
      <div className="fr-score">
        <div><Flag nation={champion} className="fr-flag" /><strong>{String(champScore).padStart(2, "0")}</strong><small>{champion}</small></div>
        <i>—</i>
        <div><Flag nation={runnerUp} className="fr-flag" /><strong>{String(runnerScore).padStart(2, "0")}</strong><small>{runnerUp}</small></div>
      </div>
      <p className="fr-runner">🥈 {runnerUp} · Runners-up 2026</p>
      <div className="fr-rubbers">{menFinalRubbers().map(m => <FinalRubberLine match={m} key={m.id} />)}</div>
      <p className="fr-editorial">Team Mauritius finishes runner-up in the 2026 Island Padel Cup after an impressive campaign in La Réunion.</p>
      <div className="hero-actions">
        <Link className="button" to="/results">Full results<ArrowUpRight size={15} /></Link>
        <Link className="button button-secondary" to="/news/final-day-island-padel-cup-2026">Read the story<ArrowUpRight size={15} /></Link>
      </div>
    </div>
  </section>;
}

/** Team Mauritius men's campaign: round-robin record + final. */
export function MauritiusMenCampaign() {
  const pool = nationsTies.filter(t => t.day < 4 && t.category === "Men" && (t.nation1 === "Mauritius" || t.nation2 === "Mauritius") && t.winner);
  const won = pool.filter(t => (t.nation1 === "Mauritius" ? 1 : 2) === t.winner).length;
  const finalTie = nationsTies.find(t => t.day === 4 && t.category === "Men");
  const final = menFinal();
  const mauritiusWon = final?.status === "FINISHED" && final.winner === (final.country1 === "Mauritius" ? 1 : 2);
  return <section className="section mri-campaign">
    <div className="section-head"><div><p className="eyebrow">TEAM MAURITIUS · MEN</p><h2>The campaign</h2></div><Link className="text-link" to="/results">Full results<ArrowUpRight size={16} /></Link></div>
    <div className="mri-campaign-grid">
      <div className="mri-campaign-step"><small>ROUND-ROBIN STAGE</small><strong>{won}<i>W</i> {pool.length - won}<i>L</i></strong><p>Top of the group after wins against Madagascar (2-1) and La Réunion (3-0).</p></div>
      <div className="mri-campaign-step"><small>FINAL</small>{finalTie && <strong className="mri-campaign-final"><Flag nation={finalTie.nation2} className="tie-flag" />{finalTie.wins2}<i>–</i>{finalTie.wins1}<Flag nation={finalTie.nation1} className="tie-flag" /></strong>}<p>{final?.status === "FINISHED" ? `${finalTie?.nation2 ?? ""} ${finalTie?.wins2 ?? ""}–${finalTie?.wins1 ?? ""} ${finalTie?.nation1 ?? ""}` : AWAITING_RESULT}</p></div>
      <div className="mri-campaign-step is-position"><small>FINAL POSITION</small><strong>{final?.status === "FINISHED" ? (mauritiusWon ? "🏆" : "🥈") : "—"}</strong><p>{final?.status === "FINISHED" ? (mauritiusWon ? "Mauritius · Champions" : "Mauritius · Runners-up · Island Padel Cup 2026") : AWAITING_RESULT}</p></div>
    </div>
  </section>;
}

/** Results page: final standings block (men decided, women pending until official). */
export function FinalStandings() {
  return <section className="section final-standings">
    <div className="section-head"><div><p className="eyebrow">ISLAND PADEL CUP 2026</p><h2>Final standings</h2></div></div>
    <div className="fs-grid">{(["Men", "Women"] as const).map(category => {
      const final = finals.find(m => m.category === category);
      const done = final?.status === "FINISHED" && final.winner;
      const champion = done ? (final.winner === 1 ? final.country1 : final.country2) : undefined;
      const runnerUp = done ? (final.winner === 1 ? final.country2 : final.country1) : undefined;
      const tie = nationsTies.find(t => t.day === 4 && t.category === category);
      return <article className="fs-card" key={category}>
        <p className="eyebrow">{category === "Men" ? "MEN" : "WOMEN"}</p>
        {champion && runnerUp ? <>
          <div className="fs-row is-champion"><span>🏆 Champions</span><b><Flag nation={champion} className="standing-flag" /> {champion}</b></div>
          <div className="fs-row"><span>🥈 Runners-up</span><b><Flag nation={runnerUp} className="standing-flag" /> {runnerUp}</b></div>
          {tie && <p className="fs-final">FINAL · {tie.winner === 1 ? tie.nation1 : tie.nation2} {Math.max(tie.wins1, tie.wins2)}–{Math.min(tie.wins1, tie.wins2)} {tie.winner === 1 ? tie.nation2 : tie.nation1}</p>}
          {category === "Men" && <div className="fr-rubbers is-compact">{menFinalRubbers().map(m => <FinalRubberLine match={m} key={m.id} />)}</div>}
        </> : <>
          <div className="fs-row"><span>Final</span><b>{final ? <>{final.country1 && <Flag nation={final.country1} className="standing-flag" />} {final.team1} vs {final.country2 && <Flag nation={final.country2} className="standing-flag" />} {final.team2}</> : "—"}</b></div>
          <p className="fs-final">{AWAITING_RESULT}</p>
        </>}
      </article>;
    })}</div>
  </section>;
}

function TieCard({ tie }: { tie: NationsTie }) {
  const mauritiusSide = tie.nation1 === "Mauritius" ? 1 : tie.nation2 === "Mauritius" ? 2 : undefined;
  const winnerNation = tie.winner === 1 ? tie.nation1 : tie.winner === 2 ? tie.nation2 : undefined;
  const label = !winnerNation ? (tie.day === 4 ? "LIVE" : "RESULT PENDING") : tie.day === 4 ? (mauritiusSide ? (tie.winner === mauritiusSide ? "CHAMPIONS" : "RUNNERS-UP") : `${nationCodes[winnerNation]} CHAMPIONS`) : mauritiusSide ? (tie.winner === mauritiusSide ? "WIN" : "LOSS") : `${nationCodes[winnerNation]} WIN`;
  const tone = label === "WIN" || label === "CHAMPIONS" ? "green" : label === "LIVE" ? "red" : label.endsWith(" WIN") || label === "RUNNERS-UP" || label.endsWith("CHAMPIONS") ? "gold" : "muted";
  return <div className={`tie-card${label === "WIN" ? " is-win" : ""}`}>
    {tie.image && <img className="tie-card-photo" src={tie.image} alt="" loading="lazy" />}
    <div className="tie-card-top"><span>{dayLabels[tie.day].toUpperCase()} · {tie.category === "Men" ? "MEN" : "WOMEN"}</span><Badge label={label} tone={tone} /></div>
    <div className="tie-card-score">
      <div><Flag nation={tie.nation1} className="tie-flag" /><strong>{tie.nation1}</strong></div>
      <b>{tie.wins1}<i>–</i>{tie.wins2}</b>
      <div><Flag nation={tie.nation2} className="tie-flag" /><strong>{tie.nation2}</strong></div>
    </div>
    <small>{dayDates[tie.day]} · {tie.day === 4 ? (tie.winner ? "Final · FT" : "Final · in progress") : "Nations tie, best of 3 matches"}</small>
  </div>;
}

export function LatestResults() {
  const mauritiusTies = nationsTies.filter(t => t.nation1 === "Mauritius" || t.nation2 === "Mauritius").slice().reverse();
  return <section className="section latest-results">
    <div className="section-head"><div><p className="eyebrow">ISLAND PADEL CUP 2026 · POOL RESULTS</p><h2>Latest results</h2></div><Link className="text-link" to="/live">All match scores<ArrowUpRight size={16} /></Link></div>
    <div className="tie-grid">{mauritiusTies.map(tie => <TieCard tie={tie} key={tie.id} />)}</div>
  </section>;
}

export function TournamentGallery() {
  return <section className="section tournament-gallery">
    <div className="section-head"><div><p className="eyebrow">CLUB DE CHAMP FLEURI · SAINT-DENIS</p><h2>On court in La Réunion</h2></div></div>
    <div className="tg-grid">{tournamentGallery.map((photo, index) => <figure className={`tg-item${index === 0 ? " is-wide" : ""}`} key={photo.src}><img src={photo.src} alt={photo.caption} loading="lazy" /><figcaption>{photo.caption}</figcaption></figure>)}</div>
  </section>;
}

const shortPair = (pair: string) => pair.split(" / ").map(p => p.split(" ").filter(w => w === w.toUpperCase() && /[A-ZÀ-Ý]/.test(w)).map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")).join(" / ");
const roundShort: Record<string, string> = { "Round of 32": "R32", "Round of 16": "R16", "Quarter-final": "QF", "Semi-final": "SF", "Final": "FINAL" };

const p500Won = () => p500MenFinal?.status === "FINISHED" && mauritiusOutcome(p500MenFinal) === "WIN";

function P500FinalCard() {
  const final = p500MenFinal;
  if (!final) return null;
  const badge = matchBadge(final);
  const done = final.status === "FINISHED" && final.winner;
  return <Link to={`/matches/${final.id}`} className={`final-card p500-final-card is-mauritius${final.status === "LIVE" ? " is-live" : ""}${p500Won() ? " is-champions" : ""}`}>
    <div className="final-card-top"><span><Trophy size={15} /> P500 Saint-Denis · Men's Final</span><Badge {...badge} /></div>
    <div className="final-card-teams">
      <div className={final.winner === 1 ? "is-winner" : ""}><Flag nation="Mauritius" className="final-flag" /><strong>{final.team1.split(" / ").map(n => <span key={n}>{n}</span>)}</strong></div>
      <em>{done ? "DEF." : "VS"}</em>
      <div className={final.winner === 2 ? "is-winner" : ""}>{final.country2 && <Flag nation={final.country2} className="final-flag" />}<strong>{final.team2.split(" / ").map(n => <span key={n}>{n}</span>)}</strong></div>
    </div>
    {done && final.score && <div className="p500-final-sets">{final.score.split(" ").map((set, i) => { const [a, b] = set.split("-").map(Number); return <span key={i} className={a > b ? "is-won" : "is-lost"}><small>SET {i + 1}</small>{a}–{b}</span>; })}</div>}
    <div className="final-card-foot"><span>{done ? (p500Won() ? "🏆 P500 Champions · Vallet / De Beer" : "FT") : final.score ?? (final.status === "LIVE" ? "Live now" : "Result pending")}</span><span>{done ? (final.matchNo ? `${final.matchNo} · FT` : "FT") : final.time ?? "Time to be confirmed"}</span></div>
  </Link>;
}

/** Headline P500 block. Champions view once the final is official; finalists view before. */
export function P500Hero({ compact = false }: { compact?: boolean }) {
  const road = p500PairMatches("vallet-debeer");
  const played = road.filter(m => m.status === "FINISHED");
  const wins = played.filter(m => mauritiusOutcome(m) === "WIN").length;
  const semi = road.find(m => m.round === "Semi-final");
  const final = p500MenFinal;
  const champions = p500Won();
  const goToRoad = (e: React.MouseEvent) => { e.preventDefault(); document.getElementById("road-to-the-final")?.scrollIntoView({ behavior: "smooth" }); };
  return <section className={`section p500-hero${compact ? " is-compact" : ""}${champions ? " is-champions" : ""}`}>
    <CampaignBackground variant="subtle" intensity={0.16} />
    <div className="p500-hero-head">
      <p className="eyebrow">P500 SAINT-DENIS · 04 OCTOBER 2026</p>
      <p className="p500-hero-sub">Team Mauritius · separate from the Island Padel Cup</p>
    </div>
    <div className="p500-hero-grid">
      <div className="p500-hero-copy">
        {champions && <div className="p500-portraits" aria-hidden="true"><img src="/images/players/official-2026/mathieu-vallet.jpg" alt="" loading="lazy" /><img src="/images/players/official-2026/amaury-de-beer.jpg" alt="" loading="lazy" /></div>}
        <p className="p500-kicker"><Flag nation="Mauritius" className="p500-kicker-flag" /> {champions ? "Vallet & De Beer" : "Vallet / De Beer"}</p>
        <h2>{champions ? <>P500 champions<span className="red-dot">.</span></> : compact ? <>One more final<span className="red-dot">.</span></> : <>P500 finalists<span className="red-dot">.</span></>}</h2>
        {champions ? <p className="p500-status">Bring the title home · 🇲🇺 Mauritius</p> : compact && <p className="p500-status">P500 Finalists · final next</p>}
        <div className="p500-stats">
          <div><strong>{played.length}</strong><span>Matches</span></div>
          <div><strong>{wins}</strong><span>Wins</span></div>
          <div><strong>{champions ? "🏆" : "Final"}</strong><span>{champions ? "Champions" : "Next"}</span></div>
        </div>
        {champions && final?.score ? <Link to={`/matches/${final.id}`} className="p500-latest"><small>FINAL · FT</small><b>{final.score.split(" ").join(" / ")}</b><span>def. {shortPair(final.team2)}</span></Link>
          : semi && semi.score && <Link to={`/matches/${semi.id}`} className="p500-latest"><small>LATEST RESULT · SEMI-FINAL</small><b>{semi.score.replace(" ", " / ")}</b><span>vs {shortPair(semi.team2)}</span></Link>}
        <div className="hero-actions">
          {compact ? <>
            <Link className="button" to="/live#road-to-the-final">{champions ? "Road to the title" : "Follow P500"}<ArrowUpRight size={15} /></Link>
            {champions && <Link className="button button-secondary" to="/news/vallet-de-beer-p500-champions">Read the story<ArrowUpRight size={15} /></Link>}
          </> : <Link className="button" to="#road-to-the-final" onClick={goToRoad}>{champions ? "View road to the title" : "View road to the final"}<ArrowUpRight size={15} /></Link>}
        </div>
      </div>
      <P500FinalCard />
    </div>
  </section>;
}

export function RoadToTheFinal() {
  const road = p500PairMatches("vallet-debeer");
  return <section className="section road-final" id="road-to-the-final">
    <div className="section-head"><div><p className="eyebrow">P500 SAINT-DENIS · MEN</p><h2>{p500Won() ? "Road to the title" : "Road to the final"}</h2></div></div>
    <p className="road-final-pair"><Flag nation="Mauritius" className="p500-kicker-flag" /> Mathieu VALLET <i>/</i> Amaury DE BEER</p>
    <ol className="road-steps">{road.map(m => {
      const outcome = mauritiusOutcome(m);
      const isFinal = m.round === "Final";
      return <li key={m.id} className={`road-step${isFinal ? " is-final" : ""}${outcome === "WIN" ? " is-win" : ""}`}>
        <Link to={`/matches/${m.id}`}>
          <span className="road-round">{m.round ? roundShort[m.round] ?? m.round : m.matchNo}</span>
          <span className="road-mark">{isFinal ? (m.status === "FINISHED" ? (outcome === "WIN" ? "W" : "L") : "NEXT") : outcome === "WIN" ? "W" : outcome === "LOSS" ? "L" : "—"}</span>
          <b>{m.score ?? (isFinal ? "Result pending" : "—")}</b>
          <small>vs {shortPair(m.team2)}</small>
        </Link>
      </li>;
    })}</ol>
  </section>;
}

function P500PairCard({ pairKey }: { pairKey: string }) {
  const pair = p500Pairs.find(p => p.key === pairKey);
  if (!pair) return null;
  const matches = p500PairMatches(pairKey).filter(m => m.round !== "Final");
  const fullTeam = matches.some(m => m.country1 === "Mauritius");
  return <article className="p500-pair">
    <div className="p500-pair-head"><div>{fullTeam && <Flag nation="Mauritius" className="cm-flag" />}<strong>{pair.label}</strong></div><span className={`p500-pair-result${pair.result.includes("finalist") ? " is-strong" : ""}`}>{pair.result}</span></div>
    {!fullTeam && <p className="p500-pair-note">Ryan WONG (Team Mauritius) with Aaron SANCHEZ ROMERO.</p>}
    <ul>{matches.map(m => {
      const outcome = mauritiusOutcome(m);
      return <li key={m.id}><Link to={`/matches/${m.id}`}><span className="p500-pair-round">{m.round ? roundShort[m.round] : m.matchNo}</span><span className={`p500-pair-wl${outcome === "WIN" ? " is-win" : outcome === "LOSS" ? " is-loss" : ""}`}>{outcome === "WIN" ? "W" : outcome === "LOSS" ? "L" : "…"}</span><b>{m.score ?? "Pending"}</b><small>vs {shortPair(m.team2) || m.team2}</small></Link></li>;
    })}</ul>
  </article>;
}

export function P500Results() {
  return <section className="section p500-results">
    <div className="section-head"><div><p className="eyebrow">P500 SAINT-DENIS · WOMEN</p><h2>Women's results</h2></div></div>
    <div className="p500-pair-grid">{["danjoux-koenig", "desvaux-park", "schaffo-giraud"].map(k => <P500PairCard pairKey={k} key={k} />)}</div>
    <div className="section-head p500-subhead"><div><p className="eyebrow">P500 SAINT-DENIS · MEN</p><h2>Other men's results</h2></div></div>
    <div className="p500-pair-grid">{["lam-couacaud", "wong-sanchez", "koenig-legros"].map(k => <P500PairCard pairKey={k} key={k} />)}</div>
    <p className="p500-note">The P500 Saint-Denis is a separate tournament. Its results never count towards the Island Padel Cup nations standings.</p>
  </section>;
}

export function P500Hub() {
  return <div className="p500-hub"><P500Hero /><RoadToTheFinal /><P500Results /></div>;
}

export function P500Section({ standalone = false }: { standalone?: boolean }) {
  return standalone ? <P500Hub /> : <P500Hero compact />;
}

export function EventSwitcher() {
  return <nav className="event-switcher" aria-label="Final day events">
    <span className="event-switcher-label">{COMPETITION_PHASE === "FINAL_DAY" ? <><span className="live-dot" /> LIVE / FINAL DAY</> : "FINAL WEEKEND · RESULTS"}</span>
    <a href="#island-padel-cup" onClick={e => { e.preventDefault(); document.getElementById("island-padel-cup")?.scrollIntoView({ behavior: "smooth" }); }}>Island Padel Cup</a>
    <a href="#p500" onClick={e => { e.preventDefault(); document.getElementById("p500")?.scrollIntoView({ behavior: "smooth" }); }}>P500 Saint-Denis</a>
  </nav>;
}

export function MauritiusResultsByDay({ days = [1, 2, 3, 4] }: { days?: CompetitionDay[] }) {
  return <section className="section mri-results">
    <div className="section-head"><div><p className="eyebrow">ISLAND PADEL CUP 2026</p><h2>Results — day by day</h2></div></div>
    {days.map(day => {
      const dayMatches = ipcMatches.filter(m => m.day === day);
      const dayTies = nationsTies.filter(t => t.day === day);
      return <div className="mri-day" key={day}>
        <div className="mri-day-head"><strong>{dayLabels[day]}</strong><span>{dayDates[day]}</span>{!dayMatches.some(m => m.country1 === "Mauritius" || m.country2 === "Mauritius") && <small>Team Mauritius not scheduled</small>}</div>
        {dayTies.length ? dayTies.map(tie => <div className="mri-tie" key={tie.id}>
          <TieCard tie={tie} />
          <div className="cm-grid">{dayMatches.filter(m => m.tie === tie.id).map(match => <ResultCard match={match} key={match.id} />)}</div>
        </div>) : null}
        {dayMatches.some(m => !m.tie) && <div className="cm-grid">{dayMatches.filter(m => !m.tie).map(match => <ResultCard match={match} key={match.id} />)}</div>}
      </div>;
    })}
  </section>;
}

export function NationsStandings() {
  return <aside className="standings-card">
    <div className="section-head"><div><p className="eyebrow">POOL · NATIONS CUP</p><h2>Standings</h2></div></div>
    {(["Men", "Women"] as const).map(category => <div className="pool-table" key={category}>
      <p className="eyebrow">{category === "Men" ? "MEN" : "WOMEN"}</p>
      <div className="pool-table-head"><span>NATION</span><span>W</span><span>MATCHES</span></div>
      {poolStandings(category).map((row, index) => <div className={`pool-table-row${index < 2 ? " is-finalist" : ""}`} key={row.nation}>
        <span><Flag nation={row.nation} className="standing-flag" /> {row.nation}</span><b>{row.won}</b><em>{row.rubbersWon}–{row.rubbersLost}</em>
      </div>)}
    </div>)}
    <p className="standings-note">Top two of each pool contest the final. Computed from official result cards.</p>
  </aside>;
}

export function LiveCenterPage({ liveUrl }: { liveUrl: string }) {
  const { hash } = useLocation();
  useEffect(() => { if (!hash) return; const timer = window.setTimeout(() => { const target = document.getElementById(hash.slice(1)); if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 8, behavior: "instant" as ScrollBehavior }); }, 150); return () => window.clearTimeout(timer); }, [hash]);
  const stream = liveUrl || competitionEvent.streamUrl;
  const live = ipcMatches.concat(p500Matches).filter(m => m.status === "LIVE");
  return <>
    <section className="live-banner">
      <CampaignBackground variant="live" intensity={0.15} />
      <div><p className="eyebrow light"><span className="live-dot" /> LIVE CENTER / {competitionEvent.title.toUpperCase()}</p><h1>{phase.headline}</h1><p>{competitionEvent.venue} · {competitionEvent.city} — {competitionEvent.place} · {competitionEvent.dates}</p></div>
      <div className="broadcast-actions">{stream ? <a className="button" href={stream} target="_blank" rel="noreferrer"><Play size={15} /> Watch live</a> : <span className="button button-secondary disabled"><Radio size={15} /> Stream not announced</span>}<span className="live-clock"><span className="live-dot" /> {live.length ? `${live.length} MATCH${live.length > 1 ? "ES" : ""} LIVE` : phase.label}</span></div>
    </section>
    <EventSwitcher />
    <div id="island-padel-cup" className="event-block-label"><span>01</span>Island Padel Cup 2026</div>
    <FinalDaySection compact />
    <section className="section live-section"><div className="live-layout"><div><MauritiusResultsByDay /></div><NationsStandings /></div></section>
    <TournamentGallery />
    <div id="p500" className="event-block-label"><span>02</span>P500 Saint-Denis 2026</div>
    <P500Hub />
  </>;
}

export function ResultsPage() {
  const ipcFinished = ipcMatches.filter(m => m.status === "FINISHED");
  return <>
    <section className="page-intro"><p className="eyebrow">ISLAND PADEL CUP 2026 · P500 SAINT-DENIS 2026</p><h1>Results</h1><p className="intro-copy">Confirmed scores only. Two separate competitions, listed separately.</p></section>
    <EventSwitcher />
    <div id="island-padel-cup" className="event-block-label"><span>01</span>Island Padel Cup 2026</div>
    <FinalStandings />
    <section className="section results-section">
      {ipcFinished.length ? <MauritiusResultsByDay days={[1, 2, 3]} /> : <div className="empty-state">{AWAITING_RESULT}</div>}
    </section>
    <div id="p500" className="event-block-label"><span>02</span>P500 Saint-Denis 2026</div>
    <P500Hub />
  </>;
}

export function CompetitionMatchPage({ match }: { match?: CompetitionMatch }) {
  if (!match) return <section className="section not-found"><p className="eyebrow">MATCH CENTER</p><h1>Match not found.</h1><Link className="button" to="/live">Back to Live Center<ArrowUpRight size={15} /></Link></section>;
  const badge = matchBadge(match);
  return <>
    <section className="page-intro"><p className="eyebrow">{match.competition.toUpperCase()} / {match.competition === "P500 Saint-Denis" ? `${match.category === "Men" ? "MEN" : "WOMEN"} / ${(match.round ?? match.matchNo ?? "").toUpperCase()}` : `${dayLabels[match.day].toUpperCase()} / ${match.stage.toUpperCase()}`}</p><h1>{match.team1} vs {match.team2}</h1></section>
    <section className="section match-detail">
      <div className="match-detail-head"><Badge {...badge} /><span>{match.competition === "P500 Saint-Denis" ? (match.matchNo ?? "P500 Saint-Denis") : dayDates[match.day]}{match.time ? ` · ${match.time}` : ""}{match.court ? ` · ${match.court}` : ""}</span></div>
      <div className="cm-card is-large"><div className="cm-body"><NationLine nation={match.country1} name={match.team1} winner={match.winner === 1} /><div className="cm-score">{match.score ?? <span>—</span>}</div><NationLine nation={match.country2} name={match.team2} winner={match.winner === 2} /></div></div>
      {match.image && <figure className="official-card"><img src={match.image} alt={`Official Island Padel Cup visual: ${match.team1} vs ${match.team2}`} /><figcaption>{match.status === "FINISHED" ? "Official result card" : "Official match visual"}</figcaption></figure>}
      {match.note && <div className="match-note"><p className="eyebrow">EDITOR NOTE</p><p>{match.note}</p></div>}
      <div className="match-report"><p className="eyebrow">MATCH REPORT</p><div className="empty-state">{match.status === "FINISHED" ? "Confirmed result." : AWAITING_RESULT}</div></div>
      <Link className="button button-secondary" to={match.competition === "P500 Saint-Denis" ? "/live#p500" : "/live"}>Back to Live Center<ArrowUpRight size={15} /></Link>
    </section>
  </>;
}

export function ScheduleMatches() {
  const days: CompetitionDay[] = [1, 2, 3, 4];
  return <div className="schedule-days">{days.map(day => <div className="mri-day" key={day}><div className="mri-day-head"><strong>{dayLabels[day]}</strong><span>{dayDates[day]}</span></div><div className="cm-grid">{ipcMatches.filter(m => m.day === day).map(m => <ResultCard match={m} key={m.id} />)}</div></div>)}</div>;
}

export function JourneyRecap({ sessions }: { sessions: TrainingSession[] }) {
  return <section className="section journey-recap">
    <div className="section-head"><div><p className="eyebrow">THE JOURNEY · PREPARATION COMPLETE</p><h2>Road to La Réunion</h2></div><Link className="text-link" to="/training">The full journey<ArrowUpRight size={16} /></Link></div>
    <div className="journey-recap-grid">{sessions.map((session, index) => <Link to={`/training/${session.id}`} className="journey-recap-card" key={session.id}>
      <span className="journey-recap-num">{String(index + 1).padStart(2, "0")}</span>
      <div><small>{session.shortDate} · {session.location}</small><strong>{session.title}</strong></div>
      <span className="journey-recap-status"><CheckCircle2 size={14} /> {session.status === "COMPLETED" ? "Completed" : session.status}</span>
    </Link>)}</div>
  </section>;
}
