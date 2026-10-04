import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, MapPin, Play, Radio, Trophy } from "lucide-react";
import {
  AWAITING_RESULT, COMPETITION_PHASE, competitionEvent, competitionPhaseCopy, dayDates, dayLabels, finals, ipcMatches, matchBadge,
  nationCodes, nationsTies, p500Matches, poolStandings, tournamentGallery, type CompetitionDay, type CompetitionMatch, type Nation, type NationsTie,
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
  return <section className="cx-strip">
    <div><p className="eyebrow">{competitionEvent.venue.toUpperCase()} · {competitionEvent.city.toUpperCase()}</p><strong>{competitionEvent.dates}</strong></div>
    <Badge label={COMPETITION_PHASE === "FINAL_DAY" ? "FINAL DAY" : "COMPLETE"} tone="red" />
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
    <div className="final-card-foot">
      <span>{match.score ?? (match.status === "LIVE" ? "Live now" : "Result pending")}</span>
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
      <p>Unbeaten in the pool, Mauritius play La Réunion for the men's title. Madagascar meet La Réunion in the women's final. Both finals at 18:00.</p>
    </div>
    <div className="final-grid">{[men, women].filter((m): m is CompetitionMatch => Boolean(m)).map(match => <FinalCard match={match} key={match.id} />)}</div>
    <p className="final-day-note">Both finals start at 18:00 (GMT+4) · Club de Champ Fleuri, Saint-Denis.</p>
  </section>;
}

export function ResultCard({ match }: { match: CompetitionMatch }) {
  const badge = matchBadge(match);
  return <Link to={`/matches/${match.id}`} className={`cm-card${match.status === "LIVE" ? " is-live" : ""}${match.image && match.stage === "Pool" ? " has-thumb" : ""}`}>
    {match.image && match.stage === "Pool" && <img className="cm-thumb" src={match.image} alt={`Official result card: ${match.team1} vs ${match.team2}`} loading="lazy" />}
    <div className="cm-top"><span>{match.competition === "P500 Saint-Denis" ? "P500 SAINT-DENIS" : dayLabels[match.day].toUpperCase()} · {match.category === "Men" ? "MEN" : "WOMEN"} · {match.stage.toUpperCase()}</span><Badge {...badge} /></div>
    <div className="cm-body">
      <NationLine nation={match.country1} name={match.team1} winner={match.winner === 1} />
      <div className="cm-score">{match.score ?? <span>{match.status === "LIVE" ? "LIVE" : "—"}</span>}</div>
      <NationLine nation={match.country2} name={match.team2} winner={match.winner === 2} />
    </div>
    <div className="cm-foot"><span>{dayDates[match.day]}{match.time ? ` · ${match.time}` : ""}{match.court ? ` · ${match.court}` : ""}</span><span>{match.status === "FINISHED" ? "Confirmed result" : match.status === "PENDING" ? AWAITING_RESULT : match.status === "LIVE" ? "On court" : "Upcoming"}</span></div>
  </Link>;
}

function TieCard({ tie }: { tie: NationsTie }) {
  const mauritiusSide = tie.nation1 === "Mauritius" ? 1 : tie.nation2 === "Mauritius" ? 2 : undefined;
  const winnerNation = tie.winner === 1 ? tie.nation1 : tie.winner === 2 ? tie.nation2 : undefined;
  const label = !winnerNation ? "RESULT PENDING" : mauritiusSide ? (tie.winner === mauritiusSide ? "WIN" : "LOSS") : `${nationCodes[winnerNation]} WIN`;
  const tone = label === "WIN" ? "green" : label.endsWith(" WIN") ? "gold" : "muted";
  return <div className={`tie-card${label === "WIN" ? " is-win" : ""}`}>
    {tie.image && <img className="tie-card-photo" src={tie.image} alt="" loading="lazy" />}
    <div className="tie-card-top"><span>{dayLabels[tie.day].toUpperCase()} · {tie.category === "Men" ? "MEN" : "WOMEN"}</span><Badge label={label} tone={tone} /></div>
    <div className="tie-card-score">
      <div><Flag nation={tie.nation1} className="tie-flag" /><strong>{tie.nation1}</strong></div>
      <b>{tie.wins1}<i>–</i>{tie.wins2}</b>
      <div><Flag nation={tie.nation2} className="tie-flag" /><strong>{tie.nation2}</strong></div>
    </div>
    <small>{dayDates[tie.day]} · Nations tie, best of 3 matches</small>
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

export function P500Section({ standalone = false }: { standalone?: boolean }) {
  return <section className={`section p500-section${standalone ? " is-standalone" : ""}`}>
    <div className="section-head"><div><p className="eyebrow">MAURITIANS IN ACTION · SEPARATE EVENT</p><h2>P500 Saint-Denis</h2></div>{!standalone && <Link className="text-link" to="/live#p500">All P500 results<ArrowUpRight size={16} /></Link>}</div>
    <p className="p500-note">A P500 tournament runs alongside the Island Padel Cup on Sunday 4 October. These results do not count towards the Island Padel Cup nations standings.</p>
    <div className="cm-grid">{p500Matches.map(match => <ResultCard match={match} key={match.id} />)}</div>
  </section>;
}

export function MauritiusResultsByDay() {
  const days: CompetitionDay[] = [1, 2, 3, 4];
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
        </div>) : <div className="cm-grid">{dayMatches.map(match => <ResultCard match={match} key={match.id} />)}</div>}
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
  const stream = liveUrl || competitionEvent.streamUrl;
  const live = ipcMatches.concat(p500Matches).filter(m => m.status === "LIVE");
  return <>
    <section className="live-banner">
      <CampaignBackground variant="live" intensity={0.15} />
      <div><p className="eyebrow light"><span className="live-dot" /> LIVE CENTER / {competitionEvent.title.toUpperCase()}</p><h1>{phase.headline}</h1><p>{competitionEvent.venue} · {competitionEvent.city} — {competitionEvent.place} · {competitionEvent.dates}</p></div>
      <div className="broadcast-actions">{stream ? <a className="button" href={stream} target="_blank" rel="noreferrer"><Play size={15} /> Watch live</a> : <span className="button button-secondary disabled"><Radio size={15} /> Stream not announced</span>}<span className="live-clock"><span className="live-dot" /> {live.length ? `${live.length} MATCH${live.length > 1 ? "ES" : ""} LIVE` : phase.label}</span></div>
    </section>
    <FinalDaySection compact />
    <section className="section live-section"><div className="live-layout"><div><MauritiusResultsByDay /></div><NationsStandings /></div></section>
    <TournamentGallery />
    <div id="p500"><P500Section standalone /></div>
  </>;
}

export function ResultsPage() {
  const finished = [...ipcMatches, ...p500Matches].filter(m => m.status === "FINISHED");
  return <>
    <section className="page-intro"><p className="eyebrow">ISLAND PADEL CUP 2026 · P500 SAINT-DENIS</p><h1>Results</h1><p className="intro-copy">Confirmed scores only. Island Padel Cup and P500 Saint-Denis results are listed separately.</p></section>
    <section className="section results-section">
      <p className="eyebrow">ISLAND PADEL CUP 2026</p>
      {finished.filter(m => m.competition === "Island Padel Cup 2026").length ? <div className="cm-grid">{finished.filter(m => m.competition === "Island Padel Cup 2026").map(m => <ResultCard match={m} key={m.id} />)}</div> : <div className="empty-state">{AWAITING_RESULT}</div>}
      <p className="eyebrow results-subhead">P500 SAINT-DENIS</p>
      <div className="cm-grid">{finished.filter(m => m.competition === "P500 Saint-Denis").map(m => <ResultCard match={m} key={m.id} />)}</div>
    </section>
  </>;
}

export function CompetitionMatchPage({ match }: { match?: CompetitionMatch }) {
  if (!match) return <section className="section not-found"><p className="eyebrow">MATCH CENTER</p><h1>Match not found.</h1><Link className="button" to="/live">Back to Live Center<ArrowUpRight size={15} /></Link></section>;
  const badge = matchBadge(match);
  return <>
    <section className="page-intro"><p className="eyebrow">{match.competition.toUpperCase()} / {dayLabels[match.day].toUpperCase()} / {match.stage.toUpperCase()}</p><h1>{match.team1} vs {match.team2}</h1></section>
    <section className="section match-detail">
      <div className="match-detail-head"><Badge {...badge} /><span>{dayDates[match.day]}{match.time ? ` · ${match.time}` : ""}{match.court ? ` · ${match.court}` : ""}</span></div>
      <div className="cm-card is-large"><div className="cm-body"><NationLine nation={match.country1} name={match.team1} winner={match.winner === 1} /><div className="cm-score">{match.score ?? <span>—</span>}</div><NationLine nation={match.country2} name={match.team2} winner={match.winner === 2} /></div></div>
      {match.image && <figure className="official-card"><img src={match.image} alt={`Official Island Padel Cup visual: ${match.team1} vs ${match.team2}`} /><figcaption>{match.status === "FINISHED" ? "Official result card" : "Official match visual"}</figcaption></figure>}
      <div className="match-report"><p className="eyebrow">MATCH REPORT</p><div className="empty-state">{match.status === "FINISHED" ? "Confirmed result." : AWAITING_RESULT}</div></div>
      <Link className="button button-secondary" to="/live">Back to Live Center<ArrowUpRight size={15} /></Link>
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
