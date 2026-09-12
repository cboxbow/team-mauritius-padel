import { useEffect, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Menu, X, ArrowUpRight, ChevronRight, Clock3, MapPin, Play, Radio, Settings2, Plus, Minus, RotateCcw, Check, Users, Camera, Video, Gauge, LockKeyhole, ArrowLeftRight, Hand, TrendingUp, ShieldCheck, AtSign, Target, Shield, Zap, ArrowUpCircle, Wind, Eye, RotateCw, Brain, MessageCircle, Trash2 } from "lucide-react";
import { event, matches as seedMatches, navItems, newsItems as seedNewsItems, nations, players as seedPlayers, SEED_VERSION, trainingSessions as seedTrainingSessions, type Match, type Player, type TrainingSession, type NewsItem, type CoachData } from "./lib/data";
import { AssessSessionJournal, BehindTheTeamPage, CoachGoldMissionArticle, CoachPage, EditorialRoadmap, HomeEditorialGrid, MplStoryPage, ModePriorityPanel, QuickNavigation, TrainingStoryBlocks } from "./components/platform-sections";
import { PlayerStoryArticle, LAURA_KOENIG_STORY, MAGALY_SCHAFFO_STORY, KATE_FOO_KUNE_STORY, MARINE_GIRAUD_STORY, type PlayerStoryConfig } from "./components/player-story";
import { mapNewsRow, mapPlayerRow, mapTrainingSessionRow } from "./lib/api-mappers";
import { isSupabaseConfigured, supabase, SUPABASE_URL } from "./lib/supabase-client";
import { VisualEngineShowcase } from "./components/brand";
import type { Session } from "@supabase/supabase-js";

// Player Focus stories migrated onto the shared Player Story system (see components/player-story.tsx).
// Adam Auckland's "THE GOLD MISSION" hero is the master template every entry here reuses.
const PLAYER_STORIES: Record<string, PlayerStoryConfig> = {
  [LAURA_KOENIG_STORY.slug]: LAURA_KOENIG_STORY,
  [MAGALY_SCHAFFO_STORY.slug]: MAGALY_SCHAFFO_STORY,
  [KATE_FOO_KUNE_STORY.slug]: KATE_FOO_KUNE_STORY,
  [MARINE_GIRAUD_STORY.slug]: MARINE_GIRAUD_STORY,
};

const mergeSeedNews = (remoteNews: NewsItem[]) => {
  const remoteSlugs = new Set(remoteNews.map(item => item.slug));
  return [...remoteNews, ...seedNewsItems.filter(item => !remoteSlugs.has(item.slug))];
};

const STORAGE_KEY = "team-mauritius-local-state";
type SiteMode = "pre_event" | "live_event" | "post_event";
type LocalState = { mode: SiteMode; players: Player[]; matches: Match[]; liveUrl: string; trainingSessions: TrainingSession[]; newsItems: NewsItem[]; coach: CoachData | null };

const phaseLabels: Record<SiteMode, string> = { pre_event: "ROAD TO LA RÉUNION", live_event: "ISLAND PADEL CUP · LIVE", post_event: "THE STORY" };
const phaseMeta: Record<SiteMode, string> = { pre_event: "PHASE 01 / PREPARATION", live_event: "PHASE 02 / COMPETITION", post_event: "PHASE 03 / ARCHIVE" };

type StoredState = Partial<LocalState> & { seedVersion?: number };

function readState(): LocalState {
  if (typeof window === "undefined") return { mode: "pre_event", players: seedPlayers, matches: seedMatches, liveUrl: "", trainingSessions: seedTrainingSessions, newsItems: seedNewsItems, coach: null };
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as StoredState | null;
    const seedIsFresh = value?.seedVersion === SEED_VERSION;
    return {
      mode: value?.mode ?? "pre_event",
      players: seedIsFresh && value?.players ? value.players : seedPlayers,
      matches: seedIsFresh && value?.matches ? value.matches : seedMatches,
      liveUrl: value?.liveUrl ?? "",
      trainingSessions: seedIsFresh && value?.trainingSessions ? value.trainingSessions : seedTrainingSessions,
      newsItems: seedIsFresh && value?.newsItems ? mergeSeedNews(value.newsItems) : seedNewsItems,
      coach: null,
    };
  } catch { return { mode: "pre_event", players: seedPlayers, matches: seedMatches, liveUrl: "", trainingSessions: seedTrainingSessions, newsItems: seedNewsItems, coach: null }; }
}

function saveState(state: LocalState) { if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, seedVersion: SEED_VERSION })); }

function App() {
  const [state, setState] = useState<LocalState>(readState);
  useEffect(() => saveState(state), [state]);
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    fetch("/api/site-mode").then(response => response.json()).then(payload => {
      const remoteMode = payload?.data?.mode as SiteMode | undefined;
      if (remoteMode && ["pre_event", "live_event", "post_event"].includes(remoteMode)) setState(current => ({ ...current, mode: remoteMode }));
    }).catch(() => undefined);

    fetch("/api/players").then(response => response.json()).then(payload => {
      const rows = payload?.data as Parameters<typeof mapPlayerRow>[0][] | undefined;
      if (!rows?.length) return;
      const bySeedName = new Map(seedPlayers.map(p => [p.name, p]));
      const merged = rows
        .map(row => { const seed = bySeedName.get(row.full_name); return seed ? mapPlayerRow(row, seed) : null; })
        .filter((p): p is Player => p !== null);
      const coach = seedPlayers.find(p => p.gender === "Coach");
      if (merged.length && coach) setState(current => ({ ...current, players: [...merged, coach] }));
    }).catch(() => undefined);

    fetch("/api/training-sessions").then(response => response.json()).then(payload => {
      const rows = payload?.data as (Parameters<typeof mapTrainingSessionRow>[0] & { slug: string })[] | undefined;
      if (!rows?.length) return;
      // DB rows are matched to seed sessions by `slug` (DB) === `id` (seed) — both use the same scheme, e.g. "06-sep-assess".
      const merged = rows
        .map(row => { const seed = seedTrainingSessions.find(s => s.id === row.slug); return seed ? mapTrainingSessionRow(row, seed) : null; })
        .filter((s): s is TrainingSession => s !== null);
      if (merged.length) setState(current => ({ ...current, trainingSessions: merged }));
    }).catch(() => undefined);

    fetch("/api/news").then(response => response.json()).then(payload => {
      const rows = payload?.data as Parameters<typeof mapNewsRow>[0][] | undefined;
      if (!rows?.length) return;
      setState(current => ({ ...current, newsItems: mergeSeedNews(rows.map(mapNewsRow)) }));
    }).catch(() => undefined);

    fetch("/api/coach").then(response => response.json()).then(payload => {
      const coach = payload?.data as CoachData | null;
      if (coach) setState(current => ({ ...current, coach }));
    }).catch(() => undefined);
  }, []);
  return <BrowserRouter><ScrollToTop /><AppShell state={state} setState={setState} /></BrowserRouter>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Team Mauritius red dot-wave signature: the approved master artwork, opacity-scaled per page.
function DotWave({ intensity = 1 }: { intensity?: number }) {
  return <div className="dot-wave" style={{ opacity: intensity }} aria-hidden="true" />;
}

type ShellProps = { state: LocalState; setState: React.Dispatch<React.SetStateAction<LocalState>> };
function AppShell({ state, setState }: ShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileOpen);
    return () => document.body.classList.remove("menu-open");
  }, [mobileOpen]);
  return <div className="site-shell">
    <header className="site-header">
      <Link to="/" className="brand-lockup" onClick={() => setMobileOpen(false)}><img className="brand-mark" src="/images/team-mauritius-logo.png" alt="Team Mauritius" /><span><b>TEAM<br />MAURITIUS</b><small>MSRA × MPL</small></span></Link>
      <Link to="/island-padel-cup" className="header-ipc" onClick={() => setMobileOpen(false)}><img src="/images/island-padel-cup-logo.png" alt="Island Padel Cup 2026" /></Link>
      <img className="header-federations" src="/images/msra-mpl-logo.png" alt="Mauritius Squash Rackets Association × Mauritius Padel League" />
      <div className="header-phase"><span className="pulse-dot" />{phaseLabels[state.mode]}</div>
      <button className="icon-button menu-trigger" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="main-navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      <nav id="main-navigation" className={`main-nav ${mobileOpen ? "is-open" : ""}`}>{navItems.map(item => <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }: { isActive: boolean }) => isActive ? "active" : ""}>{item.label}</NavLink>)}</nav>
    </header>
    <div className="flag-line"><i /><i /><i /><i /></div>
    {state.mode === "live_event" && <Link className="sticky-live-bar" to="/live"><span className="live-dot" /><b>LIVE</b><span>{state.matches.find(match => match.status === "LIVE")?.court ?? "Island Padel Cup"}</span><strong>Open Live Center</strong><ChevronRight size={16} /></Link>}
    <main><Routes>
      <Route path="/" element={<Home state={state} />} />
      <Route path="/team" element={<Team players={state.players} />} />
      <Route path="/team/:playerId" element={<PlayerDetail players={state.players} trainingSessions={state.trainingSessions} />} />
      <Route path="/coach/adam-auckland" element={<CoachPage coach={state.coach} />} />
      <Route path="/story" element={<MplStoryPage />} />
      <Route path="/dev/visual-engine" element={<VisualEngineShowcase />} />
      <Route path="/behind-the-team" element={<BehindTheTeamPage />} />
      <Route path="/training" element={<Training trainingSessions={state.trainingSessions} />} />
      <Route path="/training/:sessionId" element={<TrainingDetail trainingSessions={state.trainingSessions} />} />
      <Route path="/news" element={<News newsItems={state.newsItems} />} />
      <Route path="/news/:slug" element={<NewsDetail newsItems={state.newsItems} />} />
      <Route path="/island-padel-cup" element={<EventHub state={state} />} />
      <Route path="/schedule" element={<Schedule state={state} />} />
      <Route path="/live" element={<Live state={state} />} />
      <Route path="/matches/:matchId" element={<MatchDetail state={state} />} />
      <Route path="/results" element={<Results state={state} />} />
      <Route path="/standings" element={<Standings />} />
      <Route path="/media" element={<Media />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/admin" element={<AdminGate state={state} setState={setState} />} />
      <Route path="*" element={<NotFound />} />
    </Routes></main>
    <Footer />
  </div>;
}

function Footer() { return <footer className="site-footer"><div className="footer-brand"><img className="brand-mark small" src="/images/team-mauritius-logo.png" alt="Team Mauritius" /><div><b>TEAM MAURITIUS</b><span>ROAD TO ISLAND PADEL CUP 2026</span></div></div><div className="footer-right"><Link className="footer-story-link" to="/story">Our Story: MPL × Team Mauritius</Link><div className="footer-partners"><small>OFFICIAL PARTNERS</small><img src="/images/sponsor-dove.png" alt="Dove Men+Care" /><img src="/images/sponsor-padel-house.png" alt="Padel House" /></div><img className="footer-federations" src="/images/msra-mpl-logo.png" alt="Mauritius Squash Rackets Association × Mauritius Padel League" /><span>© 2026 TEAM MAURITIUS</span></div></footer>; }

function PageIntro({ eyebrow, title, copy, dotIntensity }: { eyebrow: string; title: string; copy?: string; dotIntensity?: number }) { return <section className="page-intro">{dotIntensity !== undefined && <DotWave intensity={dotIntensity / 100} />}<p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{copy && <p className="intro-copy">{copy}</p>}</section>; }
function SectionHead({ eyebrow, title, link, to }: { eyebrow?: string; title: string; link?: string; to?: string }) { return <div className="section-head"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{link && to && <Link className="text-link" to={to}>{link}<ArrowUpRight size={16} /></Link>}</div>; }
function ButtonLink({ to, children, secondary = false }: { to: string; children: React.ReactNode; secondary?: boolean }) { return <Link className={`button ${secondary ? "button-secondary" : ""}`} to={to}>{children}<ArrowUpRight size={15} /></Link>; }
function Tag({ children, tone = "red" }: { children: React.ReactNode; tone?: "red" | "gold" | "green" | "muted" }) { return <span className={`tag tag-${tone}`}>{children}</span>; }

function Home({ state }: { state: LocalState }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const target = new Date("2026-10-01T08:00:00+04:00").getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000), hours = Math.floor((diff / 3600000) % 24), minutes = Math.floor((diff / 60000) % 60), seconds = Math.floor((diff / 1000) % 60);
  const heroTitle = state.mode === "live_event" ? "ISLAND PADEL CUP" : state.mode === "post_event" ? "THE STORY" : "ROAD TO LA RÉUNION";
  const heroKicker = state.mode === "live_event" ? "LIVE FROM CLUB DE CHAMP FLEURI" : state.mode === "post_event" ? "TEAM MAURITIUS · 2026 ARCHIVE" : "TEAM MAURITIUS";
  const candidateIndex = state.trainingSessions.findIndex(session => new Date(session.startsAt).getTime() >= now);
  const nextSessionIndex = candidateIndex >= 0 ? candidateIndex : state.trainingSessions.length - 1;
  const nextSession = state.trainingSessions[nextSessionIndex];
  const sessionDaysToGo = Math.ceil((new Date(nextSession.startsAt).getTime() - now) / 86400000);
  return <>
    <section className="hero home-hero no-photo"><div className="hero-media"><DotWave intensity={1} /></div><div className="hero-content"><p className="eyebrow light">{heroKicker} <span className="slash">/</span> {phaseMeta[state.mode]}</p><h1>{heroTitle}<span className="red-dot">.</span></h1><p className="hero-sub">Island Padel Cup 2026<br /><span>1–4 October · Club de Champ Fleuri · La Réunion</span></p><div className="hero-actions"><ButtonLink to="/training">Follow the journey</ButtonLink><ButtonLink to="/live" secondary>Live center</ButtonLink></div></div><div className="hero-aside"><span className="vertical-label">MAURITIUS / INDIAN OCEAN</span><span className="hero-index">01<span>/</span>04</span></div></section>
    <section className="countdown-strip"><div><p className="eyebrow">{state.mode === "pre_event" ? "COUNTDOWN TO FIRST POINT" : "EVENT WINDOW"}</p><strong>{state.mode === "pre_event" ? "01 OCT 2026" : "01—04 OCT 2026"}</strong></div>{state.mode === "pre_event" ? <div className="countdown-numbers"><TimeUnit value={days} label="DAYS" /><TimeUnit value={hours} label="HOURS" /><TimeUnit value={minutes} label="MIN" /><TimeUnit value={seconds} label="SEC" /></div> : <Tag tone="red">{state.mode === "live_event" ? "LIVE NOW" : "ARCHIVE LIVE"}</Tag>}</section>
    <MeetTeamMauritius players={state.players} />
    <ModePriorityPanel mode={state.mode} matches={state.matches} liveUrl={state.liveUrl} />
    <QuickNavigation />
    <section className="section section-dark home-intro"><div className="intro-grid"><div><p className="eyebrow">THE MISSION</p><h2>4 sessions.<br /><span>One goal.</span><br />La Réunion.</h2></div><div className="mission-copy"><p>The preparation camp is designed to turn a group of top-ranked players into one competitive national unit — physically ready, tactically aligned and connected as a team.</p><ButtonLink to="/team" secondary>Meet Team Mauritius</ButtonLink></div></div></section>
    <section className="key-numbers"><div className="key-numbers-grid">{[["14", "Players"], ["07", "Men"], ["07", "Women"], ["01", "Head Coach"], ["04", "Preparation Sessions"], ["01–04 OCT", "La Réunion"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>
    {candidateIndex >= 0 ? <section className="section next-session"><SectionHead eyebrow="TEAM MAURITIUS // NEXT SESSION" title="Next on the court" link="View timeline" to="/training" /><div className="next-grid"><div className={`session-feature phase-${nextSession.phase.toLowerCase().replace(" ", "-")}`}><div className="session-art"><img src="/images/players/olivier-couacaud-alt.jpg" alt="Team Mauritius player in action" /><span className="session-number">{String(nextSessionIndex + 1).padStart(2, "0")}</span></div><div className="session-info"><div className="session-meta"><Tag>{nextSession.shortDate}</Tag><span>{nextSession.time}</span><span className="session-countdown">{sessionDaysToGo > 0 ? `${sessionDaysToGo} day${sessionDaysToGo === 1 ? "" : "s"} to go` : "Today"}</span></div><h3>{nextSession.title}</h3><p>{nextSession.summary}</p><ButtonLink to={`/training/${nextSession.id}`} secondary>Session details</ButtonLink></div></div><div className="next-side"><div className="mini-stat"><span className="stat-label">VENUE</span><strong>Caña Club</strong><small>Official preparation camp</small></div><div className="mini-stat"><span className="stat-label">NEXT MILESTONE</span><strong>Final pairings</strong><small>Island Cup simulation · 27 Sep</small></div><div className="mini-stat"><span className="stat-label">COACH</span><strong>Adam Auckland</strong><small>Lead the collective preparation</small></div></div></div></section> : <section className="section next-session"><SectionHead eyebrow="TEAM MAURITIUS" title="Next mission" link="Explore the event" to="/island-padel-cup" /><div className="next-grid"><div className="session-feature phase-final-camp"><div className="session-art"><img src="/images/event-cover.png" alt="Island Padel Cup 2026 event visual" /><span className="session-number">01</span></div><div className="session-info"><div className="session-meta"><Tag>1–4 OCT</Tag><span>Club de Champ Fleuri</span></div><h3>La Réunion</h3><p>Preparation is complete. Team Mauritius travels to La Réunion for the Island Padel Cup 2026.</p><ButtonLink to="/island-padel-cup" secondary>Island Padel Cup</ButtonLink></div></div><div className="next-side"><div className="mini-stat"><span className="stat-label">VENUE</span><strong>Club de Champ Fleuri</strong><small>La Réunion</small></div><div className="mini-stat"><span className="stat-label">NATIONS</span><strong>Mauritius · La Réunion · Madagascar</strong><small>Nations cup format</small></div><div className="mini-stat"><span className="stat-label">COACH</span><strong>Adam Auckland</strong><small>Lead the collective preparation</small></div></div></div></section>}
    <section className="section newsroom-preview"><SectionHead eyebrow="THE LATEST" title="Inside the journey" link="Open newsroom" to="/news" /><div className="news-grid">{state.newsItems.map(item => <NewsCard key={item.id} item={item} />)}</div></section>
    <HomeEditorialGrid featuredPlayer={state.players.find(player => player.gender !== "Coach")} />
    <section className="section dark-band"><div className="dark-band-inner"><div><p className="eyebrow light">ISLAND PADEL CUP 2026</p><h2>Three nations.<br />One island.</h2></div><div><p>Mauritius · La Réunion · Madagascar</p><ButtonLink to="/island-padel-cup">Explore the event</ButtonLink></div></div></section>
  </>;
}
function TimeUnit({ value, label }: { value: number; label: string }) { return <div className="time-unit"><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>; }

function MeetTeamMauritius({ players }: { players: Player[] }) {
  const men = players.filter(p => p.gender === "Men");
  const women = players.filter(p => p.gender === "Women");
  const coach = players.find(p => p.gender === "Coach");
  return <section className="section roster-teaser">
    <SectionHead eyebrow="TEAM MAURITIUS" title="Meet Team Mauritius" link="Full squad" to="/team" />
    <div className="roster-grid">
      <Link className="roster-card" to="/team"><img src="/images/players/mathieu-vallet-alt.jpg" alt="Team Mauritius men" /><div className="roster-card-scrim" /><div className="roster-card-copy"><strong>{String(men.length).padStart(2, "0")}</strong><span>Men</span><em>View players <ArrowUpRight size={14} /></em></div></Link>
      <Link className="roster-card" to="/team"><img src="/images/players/magaly-schaffo-alt.jpg" alt="Team Mauritius women" /><div className="roster-card-scrim" /><div className="roster-card-copy"><strong>{String(women.length).padStart(2, "0")}</strong><span>Women</span><em>View players <ArrowUpRight size={14} /></em></div></Link>
      {coach && <Link className="roster-card" to="/coach/adam-auckland">{coach.image && <img src={coach.image} alt={coach.name} />}<div className="roster-card-scrim" /><div className="roster-card-copy"><strong>01</strong><span>Head coach</span><b>{coach.name}</b><em>View profile <ArrowUpRight size={14} /></em></div></Link>}
    </div>
  </section>;
}

function Team({ players }: { players: Player[] }) {
  const men = players.filter(p => p.gender === "Men"), women = players.filter(p => p.gender === "Women"), coach = players.find(p => p.gender === "Coach");
  return <>
    <section className="team-campaign-hero">
      <DotWave intensity={0.62} />
      <div className="team-campaign-copy">
        <p className="eyebrow light">SELECTED SQUAD / ROAD TO LA RÉUNION 2026</p>
        <h1>Team<br /><span>Mauritius.</span></h1>
        <p>A national unit in the making: men, women and head coach moving under one campaign identity for the Island Padel Cup.</p>
      </div>
      <div className="team-campaign-strip">
        <span><b>{String(men.length).padStart(2, "0")}</b> MEN</span>
        <span><b>{String(women.length).padStart(2, "0")}</b> WOMEN</span>
        <span><b>01</b> HEAD COACH</span>
      </div>
    </section>
    <section className="section team-section team-roster-premium">
      <SectionHead eyebrow="MEN" title="The men" />
      <div className="player-grid">{men.map(p => <PlayerCard key={p.id} player={p} />)}</div>
      <SectionHead eyebrow="WOMEN" title="The women" />
      <div className="player-grid">{women.map(p => <PlayerCard key={p.id} player={p} />)}</div>
    </section>
    <section className="section coach-feature coach-feature-premium">
      <div className="coach-image"><img src={coach?.image ?? "/images/event-cover.png"} alt="Adam Auckland — Head Coach, Team Mauritius" /></div>
      <div className="coach-copy"><p className="eyebrow">COACH FOCUS / ADAM AUCKLAND</p><h2>The coaching mission</h2><p>Lead the collective preparation and establish a clear competitive identity for Team Mauritius.</p><ul>{coach?.highlights.map(item => <li key={item}>{item}</li>)}</ul><div className="coach-actions"><ButtonLink to="/coach/adam-auckland" secondary>Meet the coach</ButtonLink><ButtonLink to="/behind-the-team" secondary>Behind the team</ButtonLink></div></div>
    </section>
  </>;
}
function PlayerCard({ player }: { player: Player }) {
  const image = player.image ?? "/images/hero-team.jpg";
  const role = player.role ?? player.strengths?.[0] ?? "Selected player";
  return <Link className="player-card campaign-player-card" to={`/team/${player.id}`}>
    <div className="player-image"><img loading="lazy" src={image} alt={`${player.name} — Team Mauritius`} style={player.heroFocus ? { objectPosition: player.heroFocus } : undefined} /><span className="player-overlay" /></div>
    <div className="player-card-info">
      <span className="player-gender">PLAYER FOCUS / {player.gender.toUpperCase()}</span>
      <h3>{player.name}</h3>
      <div className="player-card-facts"><span>{player.ranking}</span><span>{player.playingSide}</span></div>
      <small>{role}</small>
      <em className="player-card-cta">View story <ArrowUpRight size={14} /></em>
      <span className="card-arrow"><ChevronRight size={18} /></span>
    </div>
  </Link>;
}

function PlayerDetail({ players, trainingSessions }: { players: Player[]; trainingSessions: TrainingSession[] }) {
  const { playerId } = useParams();
  const player = players.find(p => p.id === playerId) ?? players[0];
  const image = player.image ?? "/images/hero-team.jpg";
  const results = player.recentResultsDetailed ?? [];
  const maxPts = Math.max(1, ...results.map(r => r.pts));
  // Never repeat the hero portrait here — only distinct action/lifestyle shots.
  const mediaPhotos = [player.imageAlt, ...(player.media ?? [])].filter((src): src is string => Boolean(src));
  return <>
    <section className="athlete-hero"><DotWave intensity={0.4} /><div className="athlete-hero-grid"><div className="athlete-hero-copy"><p className="eyebrow">TEAM MAURITIUS · {player.gender.toUpperCase()}</p><h1>{player.name}</h1>{player.quote && player.quote !== "Quote to be published." && <blockquote className="athlete-quote">“{player.quote}”</blockquote>}<div className="athlete-facts-row"><AthleteFact icon={<MapPin size={16} />} label="CLUB" value={player.club} /><AthleteFact icon={<ArrowLeftRight size={16} />} label="PLAYING SIDE" value={player.playingSide} /><AthleteFact icon={<Hand size={16} />} label="DOMINANT HAND" value={player.dominantHand} /></div><div className="athlete-facts-row"><AthleteFact icon={<TrendingUp size={16} />} label="CURRENT MPL RANKING" value={player.ranking} /><AthleteFact icon={<ShieldCheck size={16} />} label="TEAM MAURITIUS" value="Selected player" />{player.social && player.social !== "—" && <AthleteFact icon={<AtSign size={16} />} label="SOCIAL MEDIA" value={player.social} />}</div></div><div className="athlete-hero-media"><img src={image} alt={`${player.name} — Team Mauritius`} style={player.heroFocus ? { objectPosition: player.heroFocus } : undefined} /></div></div></section>
    <section className="section athlete-bio"><p>{player.biography}</p></section>
    <section className="section athlete-grid">
      <div className="athlete-col">
        <div className="athlete-stats-block"><p className="eyebrow">CAREER AT A GLANCE</p>{player.careerStats ? <div className="athlete-stats-grid"><div><strong>{player.careerStats.tournaments}</strong><span>Career tournaments</span></div><div><strong>{player.careerStats.points.toLocaleString("en-US")}</strong><span>Career points</span></div><div><strong>{player.careerStats.wins}</strong><span>Wins</span></div><div><strong>{player.careerStats.podiums}</strong><span>Podiums</span></div></div> : <EmptyState text="Career stats to be added by the media team." />}</div>
        {player.strengths?.length ? <div className="athlete-dna-block"><p className="eyebrow">PLAYER DNA</p><div className="dna-badges">{player.strengths.map(item => <div className="dna-badge" key={item}>{dnaIcon(item)}<span>{item}</span></div>)}</div></div> : null}
      </div>
      <div className="athlete-col"><p className="eyebrow">BEST 8 RESULTS · RANKING TOP 8</p>{results.length ? <div className="results-timeline">{results.map((r, index) => <div className="result-card" key={`${r.date}-${r.venue}`}><span className="result-rank">{String(index + 1).padStart(2, "0")}</span><div className="result-body"><div className="result-top"><strong>{r.date}</strong><span>{r.category} {r.venue}</span></div><div className="result-bottom"><span>{ordinal(r.place)} place · {r.pts.toLocaleString("en-US")} pts</span><small>with {r.partner}</small></div><div className="result-bar"><i style={{ width: `${(r.pts / maxPts) * 100}%` }} /></div></div></div>)}</div> : <EmptyState text="Results to be added by the media team." />}</div>
    </section>
    <section className="section athlete-journey"><SectionHead eyebrow="PLAYER JOURNEY" title="Road to La Réunion" /><div className="journey-strip">{trainingSessions.slice(0, 4).map(session => <Link className={`journey-card state-${session.status.toLowerCase()}`} to={`/training/${session.id}`} key={session.id}><div className="journey-card-top"><Tag>{session.shortDate}</Tag><span className={`session-state state-${session.status.toLowerCase()}`}>{session.status}</span></div><h3>{session.phase}</h3><span className="journey-time"><Clock3 size={13} /> {session.time}</span><ul>{session.objectives.map(item => <li key={item}>{item}</li>)}</ul><small>{session.location} · {session.brunch ? "Sunday session + brunch" : "No brunch"}</small></Link>)}</div></section>
    {mediaPhotos.length > 0 && <section className="section athlete-media"><p className="eyebrow">PLAYER MEDIA</p><div className="athlete-media-grid">{mediaPhotos.map(src => <img key={src} src={src} alt={`${player.name} — Team Mauritius`} />)}</div></section>}
    {player.sponsors.length > 0 && <section className="section athlete-partners"><p className="eyebrow">PLAYER PARTNERS</p><div className="athlete-partners-grid">{player.sponsors.map(item => <span key={item}>{item}</span>)}</div></section>}
  </>;
}
function AthleteFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="athlete-fact">{icon}<div><small>{label}</small><strong>{value}</strong></div></div>; }
function dnaIcon(strength: string) {
  const s = strength.toLowerCase();
  if (s.includes("attack")) return <Target size={16} />;
  if (s.includes("defence") || s.includes("defense")) return <Shield size={16} />;
  if (s.includes("smash")) return <Zap size={16} />;
  if (s.includes("volley")) return <ArrowUpCircle size={16} />;
  if (s.includes("bandeja") || s.includes("vibora")) return <Wind size={16} />;
  if (s.includes("speed")) return <Gauge size={16} />;
  if (s.includes("reading")) return <Eye size={16} />;
  if (s.includes("consistency")) return <RotateCw size={16} />;
  if (s.includes("mentality")) return <Brain size={16} />;
  if (s.includes("communication")) return <MessageCircle size={16} />;
  return <Target size={16} />;
}
function ordinal(n: number) { const v = n % 100; const suffixes: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" }; return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? "th"}`; }
function EmptyState({ text }: { text: string }) { return <div className="empty-state">{text}</div>; }

function journeyState(session: TrainingSession, isNext: boolean) {
  if (session.status === "COMPLETED") return "completed";
  if (new Date(session.startsAt).toDateString() === new Date().toDateString()) return "today";
  if (isNext) return "next";
  return "upcoming";
}

function Training({ trainingSessions }: { trainingSessions: TrainingSession[] }) {
  const completedSessions = trainingSessions.filter(s => s.status === "COMPLETED");
  const latestCompleted = completedSessions[completedSessions.length - 1];
  const nextIndex = trainingSessions.findIndex(s => s.status !== "COMPLETED");
  const nextSession = nextIndex >= 0 ? trainingSessions[nextIndex] : undefined;
  const daysToGo = nextSession ? Math.ceil((new Date(nextSession.startsAt).getTime() - Date.now()) / 86400000) : 0;
  const featuredImage = (session?: TrainingSession) => seedPlayers.find(p => p.name === session?.featuredPlayer)?.image ?? "/images/players/olivier-couacaud-alt.jpg";
  return <>
    <section className="journey-hero"><DotWave intensity={0.25} /><p className="eyebrow">TEAM MAURITIUS / PREPARATION CAMP</p><h1 className="journey-hero-title">4 sessions.<br />One <span>goal.</span></h1><p className="journey-hero-sub">LA RÉUNION 2026</p></section>
    {latestCompleted ? <section className="section journey-recap">
      <div className="journey-recap-top"><span className="journey-next-count">{String(trainingSessions.indexOf(latestCompleted) + 1).padStart(2, "0")} / {String(trainingSessions.length).padStart(2, "0")}</span><Tag tone="green">Completed ✓</Tag></div>
      <p className="eyebrow">{latestCompleted.shortDate} · {latestCompleted.location}</p>
      <h2>{latestCompleted.title}</h2>
      <div className="journey-next-meta"><Clock3 size={16} /> {latestCompleted.time} <span>•</span> <MapPin size={16} /> {latestCompleted.location}</div>
      <p className="eyebrow detail-eyebrow">COACH'S NOTE</p>
      {latestCompleted.coachNote ? <p className="detail-note">{latestCompleted.coachNote}</p> : <EmptyState text="Adam's note will be published after the session." />}
      <div className="journey-recap-links">
        <Link className="text-link" to={`/training/${latestCompleted.id}`}>View session gallery <ArrowUpRight size={16} /></Link>
        {latestCompleted.videoUrl && <a className="text-link" href={latestCompleted.videoUrl} target="_blank" rel="noreferrer">Watch highlights <ArrowUpRight size={16} /></a>}
      </div>
      {nextSession && <div className="journey-up-next"><span>Next up</span><strong>{nextSession.shortDate} — {nextSession.phase}</strong></div>}
    </section> : nextSession ? <section className="section journey-next">
      <div className="journey-next-top"><p className="eyebrow">NEXT SESSION</p><span className="journey-next-count">{String(nextIndex + 1).padStart(2, "0")} / {String(trainingSessions.length).padStart(2, "0")}</span></div>
      <div className="journey-next-grid">
        <div className="journey-next-copy">
          <span className="journey-next-date">{nextSession.date.toUpperCase()}</span>
          <h2>{nextSession.title}.</h2>
          <div className="journey-next-meta"><MapPin size={16} /> {nextSession.location} <span>•</span> <Clock3 size={16} /> {nextSession.time}</div>
          <ul className="clean-list">{nextSession.objectives.map(item => <li key={item}>{item}</li>)}</ul>
          <div className="journey-next-footer"><span className="session-countdown">{daysToGo > 0 ? `${daysToGo} day${daysToGo === 1 ? "" : "s"} to go` : "Today"}</span><ButtonLink to={`/training/${nextSession.id}`}>View session</ButtonLink></div>
        </div>
        <div className="journey-next-media"><img src={featuredImage(nextSession)} alt="Team Mauritius training" /></div>
      </div>
    </section> : null}
    <section className="section journey-map">
      <SectionHead eyebrow="THE JOURNEY" title="Road to La Réunion" />
      <div className="journey-map-track">
        {trainingSessions.flatMap((session, index) => [
          <Link className={`journey-node state-${journeyState(session, session.id === nextSession?.id)}`} to={`/training/${session.id}`} key={session.id}>
            <span className="journey-node-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="journey-node-date">{session.shortDate}</span>
            <strong className="journey-node-phase">{session.phase}</strong>
            <span className="journey-node-state">{journeyState(session, session.id === nextSession?.id).toUpperCase()}</span>
          </Link>,
          <span className="journey-connector" aria-hidden="true" key={`${session.id}-connector`} />,
        ])}
        <div className="journey-node journey-node-milestone"><strong>Team<br />departure</strong></div>
        <span className="journey-connector" aria-hidden="true" />
        <div className="journey-node journey-node-destination"><strong>La Réunion</strong><span className="journey-node-state">Island Padel Cup · 01–04 Oct 2026</span></div>
      </div>
    </section>
    <section className="section purpose-panel"><div><p className="eyebrow">TRAIN WITH PURPOSE</p><h2>Quality <span>&gt;</span> volume.</h2></div><div><p>Every block has a competition objective. Adam controls intensity, rotations and tactical focus. The Sunday sessions run from 07:00–09:00; the Thursday competition block runs from 12:30–14:30.</p><p className="sunday-brunch-copy">BRUNCH AFTER THE SUNDAY SESSIONS · CAÑA CLUB</p></div></section>
  </>;
}

function TrainingDetail({ trainingSessions }: { trainingSessions: TrainingSession[] }) {
  const { sessionId } = useParams();
  const session = trainingSessions.find(s => s.id === sessionId) ?? trainingSessions[0];
  const sessionIndex = trainingSessions.findIndex(s => s.id === session.id);
  const nextSession = trainingSessions[sessionIndex + 1];
  if (session.id === "06-sep-assess") {
    return <>
      <PageIntro eyebrow={`${session.shortDate} / ${session.location}`} title={session.title} copy={session.summary} dotIntensity={85} />
      <AssessSessionJournal session={session} />
    </>;
  }
  return <>
    <PageIntro eyebrow={`${session.shortDate} / ${session.location}`} title={session.title} copy={session.summary} dotIntensity={85} />
    <section className={`section session-detail phase-${session.phase.toLowerCase().replace(" ", "-")}`}>
      <div className="detail-top"><div><Tag>{session.phase}</Tag><h2>{session.date}</h2><p><Clock3 size={16} /> {session.time} <span>•</span> <MapPin size={16} /> {session.location}</p></div><div className="detail-status"><span>SESSION FORMAT</span><strong>{session.brunch ? "SUNDAY · BRUNCH AFTER" : "THURSDAY · COMPETITION BLOCK"}</strong></div></div>
      <div className="detail-grid"><div><p className="eyebrow">OBJECTIVES</p><ul className="clean-list">{session.objectives.map(item => <li key={item}>{item}</li>)}</ul>{session.brunch && <div className="session-amenity"><span>TEAM BRUNCH</span><strong>After the Sunday session · Caña Club</strong></div>}
        {!session.coachNote && !session.playerQuote && !session.keyTakeaways?.length && !session.gallery?.length && !session.videoUrl && !session.videoClips?.length
          ? <><p className="eyebrow detail-eyebrow">TRAINING REPORT</p><EmptyState text="Report, images, videos, quotes and key moments can be published here after the session." /></>
          : <>
            <p className="eyebrow detail-eyebrow">COACH'S NOTE</p>
            {session.coachNote ? <p className="detail-note">{session.coachNote}</p> : <EmptyState text="Adam's note will be published after the session." />}
            <p className="eyebrow detail-eyebrow">PLAYER QUOTE</p>
            {session.playerQuote ? <blockquote className="detail-quote">“{session.playerQuote.text}”<cite>— {session.playerQuote.author}</cite></blockquote> : <EmptyState text="A player quote will be published after the session." />}
            <p className="eyebrow detail-eyebrow">KEY TAKEAWAYS</p>
            {session.keyTakeaways?.length ? <ul className="clean-list">{session.keyTakeaways.map(item => <li key={item}>{item}</li>)}</ul> : <EmptyState text="Key takeaways will be published after the session." />}
            {(session.gallery?.length || session.videoUrl || session.videoClips?.length) && <><p className="eyebrow detail-eyebrow">PHOTO GALLERY / VIDEO</p><div className="detail-media">{session.gallery?.map(src => <img key={src} src={src} alt="Team Mauritius training" />)}{session.videoClips?.map(src => <video key={src} src={src} controls playsInline preload="metadata" />)}{session.videoUrl && <a className="button button-secondary" href={session.videoUrl} target="_blank" rel="noreferrer">Watch highlights <ArrowUpRight size={15} /></a>}</div></>}
          </>}
      </div><div className="detail-image"><img src={session.heroImage ?? seedPlayers.find(p => p.name === session.featuredPlayer)?.image ?? "/images/players/laura-koenig-alt.jpg"} alt="Team Mauritius player in action" /><span>TEAM MAURITIUS · 2026</span></div></div>
      <div className="next-session-box"><div><small>{nextSession ? "NEXT SESSION" : "NEXT MILESTONE"}</small><strong>{nextSession ? `${nextSession.shortDate} · ${nextSession.title}` : "01 OCT · ISLAND PADEL CUP"}</strong></div><ChevronRight /></div>
    </section>
    <TrainingStoryBlocks session={session} />
  </>;
}

function News({ newsItems }: { newsItems: NewsItem[] }) {
  const categories = ["All stories", "Training Camp", "Team News", "Player Focus", "Coach’s Corner", "Behind The Scenes", "Sponsors", "Travel", "Island Padel Cup", "Match Reports", "Results"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const visibleStories = activeCategory === "All stories" ? newsItems : newsItems.filter(item => item.category === activeCategory);
  const lead = visibleStories.find(item => item.featured) ?? visibleStories[0];
  const rest = visibleStories.filter(item => item.id !== lead?.id);
  return <><section className="newsroom-hero"><DotWave intensity={0.45} /><div><p className="eyebrow light">EDITORIAL / TEAM MAURITIUS</p><h1>Newsroom</h1><p>Player focus, coach focus, training camp and the Road to La Réunion told as one national-team campaign.</p></div></section><section className="section news-page newsroom-premium"><div className="category-row" aria-label="Filter stories">{categories.map(category => <button className={`category-button ${activeCategory === category ? "is-active" : ""}`} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div>{lead ? <div className="newsroom-layout"><NewsCard item={lead} lead /><div className="news-grid large">{rest.map(item => <NewsCard key={item.id} item={item} />)}</div></div> : <EmptyState text="Stories in this category will be published throughout the camp." />}</section><EditorialRoadmap /></>;
}
function NewsCard({ item, lead = false }: { item: NewsItem; lead?: boolean }) { return <Link className={`news-card campaign-news-card ${item.featured || lead ? "featured" : ""}${lead ? " newsroom-lead-card" : ""}`} to={`/news/${item.slug}`}><div className="news-image"><img loading="lazy" src={item.image} alt={item.title} style={item.imageFocus ? { objectPosition: item.imageFocus } : undefined} /><span className="news-overlay" /><span className="news-cover-label">{item.category}</span></div><div className="news-card-copy"><div className="news-meta"><span>{item.category}</span><span>{item.date}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><span className="read-more">Read story <ArrowUpRight size={15} /></span></div></Link>; }
function NewsDetail({ newsItems }: { newsItems: NewsItem[] }) {
  const { slug } = useParams();
  const item = newsItems.find(newsItem => newsItem.slug === slug) ?? newsItems[0];
  const related = newsItems.filter(newsItem => newsItem.id !== item.id).slice(0, 2);
  const nextForRotation = newsItems[(newsItems.findIndex(n => n.id === item.id) + 1) % newsItems.length];
  if (item.slug === "adam-auckland-we-want-to-bring-back-gold") {
    return <CoachGoldMissionArticle item={item} next={nextForRotation} />;
  }
  const playerStory = PLAYER_STORIES[item.slug];
  if (playerStory) {
    return <PlayerStoryArticle item={item} next={nextForRotation} story={playerStory} />;
  }
  const chapters = articleChapters(item);
  return <><section className="article-hero editorial-article-hero"><DotWave intensity={0.25} /><div className="article-image"><img src={item.image} alt={item.title} style={item.imageFocus ? { objectPosition: item.imageFocus } : undefined} /></div><div className="article-title"><p className="eyebrow">{item.category} / {item.date}</p><h1>{item.title}</h1><p>{item.excerpt}</p><div className="article-byline"><span>BY {item.author}</span><ShareButton title={item.title} /></div></div></section><article className="article-body editorial-article-body"><div className="article-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{chapters.map((chapter, index) => <section className="article-chapter" key={`${chapter.title}-${index}`}><span className="gold-chapter-number">{String(index + 1).padStart(2, "0")}</span><h2>{chapter.title}</h2>{chapter.paragraphs.map((paragraph, pIndex) => <ArticleParagraph text={paragraph} key={pIndex} />)}</section>)}<div className="article-media-slots"><div><Camera size={20} /><h3>Media block</h3><p>Official images will be added when supplied by the media team.</p></div><div><Video size={20} /><h3>Broadcast layer</h3><p>Video highlights and replay links remain ready for publication.</p></div></div><div className="article-signoff">MSRA × MAURITIUS PADEL LEAGUE<br /><span>ROAD TO LA RÉUNION 2026</span></div></article><section className="section related-stories"><SectionHead eyebrow="KEEP FOLLOWING" title="Related stories" /><div className="news-grid">{related.map(newsItem => <NewsCard item={newsItem} key={newsItem.id} />)}</div></section></>;
}
function articleChapters(item: NewsItem) {
  const paragraphs = (item.body ?? item.excerpt).split("\n\n").map(p => p.trim()).filter(Boolean);
  if (paragraphs.length <= 2) return [{ title: "The campaign story", paragraphs }];
  const midpoint = Math.ceil(paragraphs.length / 2);
  return [
    { title: "The moment", paragraphs: paragraphs.slice(0, midpoint) },
    { title: "Road to La Réunion", paragraphs: paragraphs.slice(midpoint) },
  ].filter(chapter => chapter.paragraphs.length);
}
function ArticleParagraph({ text }: { text: string }) {
  const trimmed = text.trim();
  if (/^["“]/.test(trimmed)) return <blockquote className="article-quote">{trimmed.replace(/^["“]|["”]$/g, "")}</blockquote>;
  if (/\?(\s*\([^)]*\))?\s*$/.test(trimmed)) return <p className="article-question">{trimmed}</p>;
  if (/^(Interview|Originally published|Source\s*:)/i.test(trimmed)) return <p className="article-note">{trimmed}</p>;
  return <p>{trimmed}</p>;
}
function ShareButton({ title }: { title: string }) { const [shared, setShared] = useState(false); const share = async () => { const data = { title, url: window.location.href }; if (navigator.share) await navigator.share(data); else await navigator.clipboard.writeText(data.url); setShared(true); window.setTimeout(() => setShared(false), 1600); }; return <button className="share-button" onClick={share}>{shared ? "LINK COPIED" : "SHARE STORY"}<ArrowUpRight size={14} /></button>; }

function EventHub({ state }: { state: LocalState }) {
  const sections: { label: string; to?: string }[] = [
    { label: "Overview" }, { label: "Nations" }, { label: "Team Rosters", to: "/team" }, { label: "Schedule", to: "/schedule" },
    { label: "Live Scores", to: "/live" }, { label: "Results", to: "/results" }, { label: "Standings", to: "/standings" }, { label: "Draw" },
    { label: "Live Stream", to: "/live" }, { label: "Photos", to: "/media" }, { label: "Videos", to: "/media" }, { label: "News", to: "/news" },
  ];
  return <><PageIntro eyebrow="NATIONS CUP / 2026" title="Island Padel Cup" copy="The Indian Ocean’s #1 padel event. A nations cup format bringing Mauritius, La Réunion and Madagascar together." dotIntensity={70} /><section className="section event-hero-card"><div className="event-poster"><img src="/images/event-cover.png" alt="Island Padel Cup 2026 event visual" /></div><div className="event-details"><Tag tone="gold">{phaseLabels[state.mode]}</Tag><h2>{event.date.split(" ")[0]}<br />{event.date.split(" ").slice(-1)[0]}</h2><p><MapPin size={16} /> {event.venue} · {event.place}</p><div className="nation-row">{nations.map((nation, index) => <span key={nation}><b>0{index + 1}</b>{nation}</span>)}</div><ButtonLink to="/live">Open live center</ButtonLink></div></section><section className="section event-sections"><SectionHead eyebrow="THE COMPETITION" title="Follow the cup" /><div className="event-nav-grid">{sections.map((item, index) => item.to ? <Link to={item.to} key={item.label}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}<ChevronRight size={16} /></Link> : <div className="coming-soon" key={item.label}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}<small>COMING SOON</small></div>)}</div></section><section className="section format-section"><div><p className="eyebrow">TOURNAMENT CONCEPT</p><h2>Nations Cup<br /><span>Round Robin</span><br />Semi-finals / Finals</h2></div><div className="format-list"><span>01 / Open Tournament</span><span>02 / Closing Ceremony</span><span>03 / Official Team Rosters</span></div></section></>;
}

function Schedule({ state }: { state: LocalState }) {
  const dates: Match["date"][] = ["01 OCT", "02 OCT", "03 OCT", "04 OCT"];
  const [activeDate, setActiveDate] = useState<Match["date"]>(dates[0]);
  const visibleMatches = state.matches.filter(match => match.date === activeDate);
  return <><PageIntro eyebrow="ISLAND PADEL CUP / 01—04 OCT" title="Schedule" copy="Competition times and court assignments are admin-editable and will be published as the draw is confirmed." dotIntensity={70} /><section className="section schedule-section"><div className="schedule-tabs" aria-label="Competition dates">{dates.map(date => <button className={activeDate === date ? "is-active" : ""} aria-pressed={activeDate === date} onClick={() => setActiveDate(date)} key={date}>{date}</button>)}</div>{visibleMatches.map(match => <MatchRow match={match} key={match.id} />)}<EmptyState text={visibleMatches.length ? "Additional matches will appear here once the official draw is published." : `The ${activeDate} schedule will appear here once the official draw is published.`} /></section></>;
}
function MatchRow({ match }: { match: Match }) { return <Link className="match-row" to={`/matches/${match.id}`}><div className="match-time"><span>{match.scheduled}</span><small>{match.court}</small></div><div className="match-teams"><strong>{match.nationA}</strong><span>{match.pairA}</span><em>vs</em><strong>{match.nationB}</strong><span>{match.pairB}</span></div><Tag tone={match.status === "LIVE" ? "red" : "muted"}>{match.status}</Tag><ChevronRight size={18} /></Link>; }

function Live({ state }: { state: LocalState }) {
  const current = state.matches.filter(match => match.status === "LIVE");
  const upcoming = state.matches.filter(match => match.status === "UPCOMING" || match.status === "DELAYED");
  const finished = state.matches.filter(match => match.status === "FINISHED");
  const leadMatch = current[0];
  return <><section className="live-banner"><DotWave intensity={0.15} /><div><p className="eyebrow light"><span className="live-dot" /> LIVE CENTER / ISLAND PADEL CUP 2026</p><h1>{leadMatch ? "Live now" : "Ready when they are."}</h1><p>{leadMatch ? `${leadMatch.court} · ${leadMatch.nationA} vs ${leadMatch.nationB}` : "The broadcast interface for courts, schedules, scores and official results."}</p></div><div className="broadcast-actions">{state.liveUrl ? <a className="button" href={state.liveUrl} target="_blank" rel="noreferrer"><Play size={15} /> Watch live</a> : <span className="button button-secondary disabled"><Radio size={15} /> Stream URL pending</span>}<span className="live-clock"><span className="live-dot" /> {state.mode === "live_event" ? "LIVE DATA" : "PRE-EVENT MODE"}</span></div></section><section className="section live-section"><div className="live-layout"><div className="match-groups"><MatchGroup title="Current live matches" matches={current} empty="No official match is live." /><MatchGroup title="Upcoming matches" matches={upcoming} empty="The official schedule is pending." /><MatchGroup title="Finished matches" matches={finished} empty="Official results will appear here." /></div><aside className="standings-card"><SectionHead eyebrow="NATIONS CUP" title="Standings" /><StandingRow rank="01" nation="Mauritius" points="—" /><StandingRow rank="02" nation="La Réunion" points="—" /><StandingRow rank="03" nation="Madagascar" points="—" /><ButtonLink to="/standings" secondary>Full standings</ButtonLink></aside></div><div className="ticker"><span className="ticker-label">LIVE TICKER</span><span>Official match data will feed the public API and future OBS overlays.</span></div></section><section className="section live-note"><div><Gauge size={28} /><h2>Built for the<br />broadcast team.</h2></div><p>Current matches, upcoming fixtures, results, court status and structured public endpoints form the broadcast-ready layer.</p><Link to="/schedule" className="text-link">Open schedule <ArrowUpRight size={16} /></Link></section></>;
}
function MatchGroup({ title, matches, empty }: { title: string; matches: Match[]; empty: string }) { return <section className="match-group"><p className="eyebrow">{title}</p>{matches.length ? matches.map(match => <LiveMatchCard key={match.id} match={match} />) : <EmptyState text={empty} />}</section>; }
function LiveMatchCard({ match }: { match: Match }) { return <Link className={`live-match-card ${match.status === "LIVE" ? "is-live" : ""}`} to={`/matches/${match.id}`}><div className="live-match-top"><span>{match.court}</span><Tag tone={match.status === "LIVE" ? "red" : "muted"}>{match.status}</Tag></div><div className="scoreboard"><div><small>{match.nationA}</small><strong>{match.setsA.length ? match.setsA.join(" · ") : "—"}</strong><span>{match.pairA}</span></div><em>vs</em><div><small>{match.nationB}</small><strong>{match.setsB.length ? match.setsB.join(" · ") : "—"}</strong><span>{match.pairB}</span></div></div><div className="score-footer"><span>Game score</span><b>{match.gameA} — {match.gameB}</b></div></Link>; }
function StandingRow({ rank, nation, points }: { rank: string; nation: string; points: string }) { return <div className="standing-row"><b>{rank}</b><span>{nation}</span><strong>{points}</strong></div>; }

function MatchDetail({ state }: { state: LocalState }) { const { matchId } = useParams(); const match = state.matches.find(m => m.id === matchId) ?? state.matches[0]; return <><PageIntro eyebrow={`${match.court} / MATCH CENTER`} title={`${match.nationA} vs ${match.nationB}`} copy="A dedicated match page for score, pair photos, match report, highlights and replay." /><section className="section match-detail"><div className="match-detail-head"><Tag tone={match.status === "LIVE" ? "red" : "muted"}>{match.status}</Tag><span>{match.scheduled}</span></div><div className="big-score"><div><small>{match.nationA}</small><strong>{match.setsA.length ? match.setsA.join(" · ") : "—"}</strong><span>{match.pairA}</span></div><div className="vs-mark">VS</div><div><small>{match.nationB}</small><strong>{match.setsB.length ? match.setsB.join(" · ") : "—"}</strong><span>{match.pairB}</span></div></div><div className="set-table"><span>SET</span><span>{match.nationA}</span><span>{match.nationB}</span>{[0, 1, 2].map(set => <div className="set-line" key={set}><b>{set + 1}</b><span>{match.setsA[set] ?? "—"}</span><span>{match.setsB[set] ?? "—"}</span></div>)}</div><div className="match-report"><p className="eyebrow">MATCH REPORT</p><EmptyState text="Match report, highlights, replay and gallery will be published here." /></div></section></>; }
function Results({ state }: { state: LocalState }) { return <><PageIntro eyebrow="ISLAND PADEL CUP / ARCHIVE" title="Results" copy="Every final score, match report and shareable result card in one place." dotIntensity={70} /><section className="section results-section">{state.matches.filter(m => m.status === "FINISHED").map(match => <MatchRow match={match} key={match.id} />)}<EmptyState text="Results will appear here once matches are completed." /></section></>; }
function Standings() { return <><PageIntro eyebrow="NATIONS CUP / LIVE TABLE" title="Standings" copy="Admin-editable standings for the Mauritius, La Réunion and Madagascar nations cup." dotIntensity={70} /><section className="section standings-page"><div className="standings-table-head"><span>RANK</span><span>NATION</span><span>PLAYED</span><span>WON</span><span>POINTS</span></div>{nations.map((nation, index) => <div className="standings-table-row" key={nation}><b>0{index + 1}</b><strong>{nation}</strong><span>—</span><span>—</span><em>—</em></div>)}</section></>; }
function Media() {
  const [activeMedia, setActiveMedia] = useState("Photos");
  const mediaItems = [
    { image: "/images/players/amaury-de-beer-alt.jpg", title: "Selected squad / men", type: "Photo gallery", group: "Photos" },
    { image: "/images/players/marine-giraud-alt.jpg", title: "Selected squad / women", type: "Photo gallery", group: "Photos" },
  ];
  const groups = ["Photos", "Videos", "Press articles", "Press releases", "Downloads"];
  const visibleMedia = mediaItems.filter(item => item.group === activeMedia);
  return <><PageIntro eyebrow="MEDIA CENTER / TEAM MAURITIUS" title="Media" copy="The visual archive of preparation, competition and the story that follows." /><section className="section media-section"><div className="media-nav" aria-label="Filter media">{groups.map(group => <button className={activeMedia === group ? "is-active" : ""} aria-pressed={activeMedia === group} onClick={() => setActiveMedia(group)} key={group}>{group}</button>)}</div>{visibleMedia.length ? <div className="media-grid">{visibleMedia.map(item => <MediaTile image={item.image} title={item.title} type={item.type} key={item.title} />)}</div> : <EmptyState text={`${activeMedia} will be published throughout the camp.`} />}</section></>;
}
function MediaTile({ image, title, type }: { image: string; title: string; type: string }) { return <div className="media-tile"><div><img src={image} alt={title} /><span className="media-icon">{type.includes("Video") ? <Video size={16} /> : <Camera size={16} />}</span></div><small>{type}</small><h3>{title}</h3></div>; }
const partnerTiers: { tier: string; name: string | null; logo: string | null }[] = [
  { tier: "Main Partner", name: "Dove Men+Care", logo: "/images/sponsor-dove.png" },
  { tier: "Gold", name: "Padel House", logo: "/images/sponsor-padel-house.png" },
  { tier: "Silver", name: null, logo: null },
  { tier: "Official Supplier", name: null, logo: null },
];
function Partners() { return <><PageIntro eyebrow="PARTNERS / TEAM MAURITIUS" title="Partners" copy="The brands and people who help move the national team forward." /><section className="section partners-section"><div className="partner-lead"><p className="eyebrow">PARTNER PLATFORM</p><h2>Visibility that travels from the training court to the final point.</h2><p>Partner logos are ready to appear dynamically in the footer, live center, player pages, match pages, training news, result cards and future broadcast overlays.</p></div><div className="tier-grid">{partnerTiers.map((t, index) => <div className={`tier-card tier-${index}`} key={t.tier}><span>0{index + 1}</span><h3>{t.tier}</h3>{t.logo ? <div className="tier-logo"><img src={t.logo} alt={t.name ?? t.tier} /></div> : <><p>Partner slot available</p><div className="logo-placeholder">LOGO<br />PENDING</div></>}</div>)}</div></section></>; }

function AdminGate({ state, setState }: ShellProps) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (!isSupabaseConfigured) return <AdminLocalDemo state={state} setState={setState} />;
  if (session === undefined) return <section className="section admin-section"><EmptyState text="Checking session…" /></section>;
  if (!session) return <AdminLogin />;
  return <AdminPanels />;
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error: signInError } = await supabase!.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) setError(signInError.message);
  };
  return <><PageIntro eyebrow="SECURE CONTROL ROOM" title="Admin sign in" copy="Restricted to approved Team Mauritius staff accounts." /><section className="section admin-section"><form className="admin-panel" onSubmit={submit}><label className="field-label">Email<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></label><label className="field-label">Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{error && <span className="field-note" style={{ color: "var(--red)" }}>{error}</span>}<button className="button full" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form></section></>;
}

const DNA_VOCABULARY = ["Attack", "Defence", "Smash", "Volley", "Bandeja / Vibora", "Speed", "Game reading", "Consistency", "Mentality", "Communication"];

type DbPlayerRow = { id: string; full_name: string; club: string | null; ranking: string | null; playing_side: string | null; dominant_hand: string | null; biography: string | null; quote: string | null; strengths: string[] | null; social_links: Record<string, string> | null; hero_media_id: string | null };
type DbMatchRow = { id: string; court: string | null; status: "UPCOMING" | "LIVE" | "FINISHED" | "DELAYED"; team_a_id: string | null; team_b_id: string | null; live_scores: { games_a: number; games_b: number; points_a: string; points_b: string; serving_side: string | null }[] | null };
type DbMediaRow = { id: string; storage_path: string | null; external_url: string | null; role: string | null; media_type: string };
type DbTrainingSessionRow = { id: string; title: string; session_status: "UPCOMING" | "LIVE" | "COMPLETED" };
type DbReportRow = { id: string; coach_debrief: string | null; key_takeaways: string[] | null; player_quotes: { text: string; author: string }[] | null };
type DbNewsRow = { id: string; slug: string; title: string; excerpt: string | null; body: string | null; category: string; tags: string[] | null; status: "draft" | "published" | "archived" };
type DbTeamRow = { id: string; name: string; nation: string };
type DbStandingRow = { team_id: string; played: number; won: number; lost: number; points: number };

const ISLAND_CUP_EVENT_ID = "00000000-0000-4000-8000-000000000010";
const mediaSrc = (m: { storage_path: string | null; external_url: string | null }) => m.storage_path ? `${SUPABASE_URL}/storage/v1/object/public/media-public/${m.storage_path}` : m.external_url ?? undefined;
async function uploadMedia(file: File, folder: string, extra: Record<string, unknown>) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: uploadError } = await supabase!.storage.from("media-public").upload(path, file);
  if (uploadError) throw uploadError;
  const { data, error: insertError } = await supabase!.from("media").insert({ storage_path: path, status: "published", published_at: new Date().toISOString(), ...extra }).select().single();
  if (insertError) throw insertError;
  return data as DbMediaRow;
}

function AdminPanels() {
  const [dbPlayers, setDbPlayers] = useState<DbPlayerRow[]>([]);
  const [dbMatches, setDbMatches] = useState<DbMatchRow[]>([]);
  const [dbTeams, setDbTeams] = useState<DbTeamRow[]>([]);
  const [dbStandings, setDbStandings] = useState<DbStandingRow[]>([]);
  const [dbSessions, setDbSessions] = useState<DbTrainingSessionRow[]>([]);
  const [dbNews, setDbNews] = useState<DbNewsRow[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [playerMedia, setPlayerMedia] = useState<DbMediaRow[]>([]);
  const [sessionMedia, setSessionMedia] = useState<DbMediaRow[]>([]);
  const [videoUrlDraft, setVideoUrlDraft] = useState("");
  const [coachNoteDraft, setCoachNoteDraft] = useState("");
  const [quoteTextDraft, setQuoteTextDraft] = useState("");
  const [quoteAuthorDraft, setQuoteAuthorDraft] = useState("");
  const [takeawaysDraft, setTakeawaysDraft] = useState("");
  const [editingNewsId, setEditingNewsId] = useState<string>("");
  const [newsTitle, setNewsTitle] = useState(""); const [newsExcerpt, setNewsExcerpt] = useState(""); const [newsBody, setNewsBody] = useState(""); const [newsCategory, setNewsCategory] = useState("Team News"); const [newsTags, setNewsTags] = useState(""); const [newsStatus, setNewsStatus] = useState<"draft" | "published">("draft");
  const [newMatchTeamA, setNewMatchTeamA] = useState(""); const [newMatchTeamB, setNewMatchTeamB] = useState(""); const [newMatchCourt, setNewMatchCourt] = useState("Court 1"); const [newMatchTime, setNewMatchTime] = useState("");
  const [siteMode, setSiteMode] = useState<SiteMode>("pre_event");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [saved, setSaved] = useState("");

  const flashSaved = (label: string) => { setSaved(label); window.setTimeout(() => setSaved(""), 1600); };

  useEffect(() => {
    supabase!.from("players").select("*").order("full_name").then(({ data }) => {
      setDbPlayers((data as DbPlayerRow[] | null) ?? []);
      if (data?.length) setSelectedPlayerId(current => current || data[0].id);
    });
    supabase!.from("matches").select("id, court, status, team_a_id, team_b_id, live_scores(games_a, games_b, points_a, points_b, serving_side)").then(({ data }) => setDbMatches((data as DbMatchRow[] | null) ?? []));
    supabase!.from("site_settings").select("mode, youtube_url").single().then(({ data }) => { if (data) { setSiteMode(data.mode); setYoutubeUrl(data.youtube_url ?? ""); } });
    supabase!.from("teams").select("id, name, nation").then(({ data }) => setDbTeams((data as DbTeamRow[] | null) ?? []));
    supabase!.from("standings").select("team_id, played, won, lost, points").then(({ data }) => setDbStandings((data as DbStandingRow[] | null) ?? []));
    supabase!.from("training_sessions").select("id, title, session_status").order("starts_at").then(({ data }) => {
      setDbSessions((data as DbTrainingSessionRow[] | null) ?? []);
      if (data?.length) setSelectedSessionId(current => current || data[0].id);
    });
    supabase!.from("news").select("id, slug, title, excerpt, body, category, tags, status").order("created_at", { ascending: false }).then(({ data }) => setDbNews((data as DbNewsRow[] | null) ?? []));
  }, []);

  const player = dbPlayers.find(p => p.id === selectedPlayerId);
  const patchPlayer = async (patch: Partial<DbPlayerRow>) => {
    if (!player) return;
    await supabase!.from("players").update(patch).eq("id", player.id);
    setDbPlayers(current => current.map(p => p.id === player.id ? { ...p, ...patch } : p));
    flashSaved("Profile saved");
  };
  const toggleStrength = (item: string) => {
    if (!player) return;
    const current = player.strengths ?? [];
    const next = current.includes(item) ? current.filter(s => s !== item) : current.length < 3 ? [...current, item] : current;
    patchPlayer({ strengths: next });
  };

  useEffect(() => {
    if (!player) { setPlayerMedia([]); return; }
    supabase!.from("media").select("id, storage_path, external_url, role, media_type").eq("player_id", player.id).then(({ data }) => setPlayerMedia((data as DbMediaRow[] | null) ?? []));
  }, [player?.id]);

  const uploadPlayerHero = async (file: File) => {
    if (!player) return;
    try {
      const oldHeroId = player.hero_media_id;
      const row = await uploadMedia(file, `players/${player.id}`, { media_type: "photo", player_id: player.id, title: `${player.full_name} portrait` });
      await supabase!.from("players").update({ hero_media_id: row.id }).eq("id", player.id);
      if (oldHeroId) await supabase!.from("media").delete().eq("id", oldHeroId);
      setDbPlayers(current => current.map(p => p.id === player.id ? { ...p, hero_media_id: row.id } : p));
      setPlayerMedia(current => [...current.filter(m => m.id !== oldHeroId), row]);
      flashSaved("Portrait updated");
    } catch (err) { flashSaved(`Upload failed: ${(err as Error).message}`); }
  };
  const uploadPlayerAlt = async (file: File) => {
    if (!player) return;
    try {
      await supabase!.from("media").delete().eq("player_id", player.id).eq("role", "alt");
      const row = await uploadMedia(file, `players/${player.id}`, { media_type: "photo", player_id: player.id, role: "alt", title: `${player.full_name} action` });
      setPlayerMedia(current => [...current.filter(m => m.role !== "alt"), row]);
      flashSaved("Action photo updated");
    } catch (err) { flashSaved(`Upload failed: ${(err as Error).message}`); }
  };
  const uploadPlayerGallery = async (file: File) => {
    if (!player) return;
    try {
      const row = await uploadMedia(file, `players/${player.id}`, { media_type: "photo", player_id: player.id, role: "gallery", title: `${player.full_name} media` });
      setPlayerMedia(current => [...current, row]);
      flashSaved("Photo added");
    } catch (err) { flashSaved(`Upload failed: ${(err as Error).message}`); }
  };
  const deletePlayerMedia = async (id: string) => { await supabase!.from("media").delete().eq("id", id); setPlayerMedia(current => current.filter(m => m.id !== id)); };

  const updateMode = async (mode: SiteMode) => { setSiteMode(mode); await supabase!.from("site_settings").update({ mode }).eq("id", true); flashSaved("Site mode saved"); };
  const saveYoutubeUrl = async () => { await supabase!.from("site_settings").update({ youtube_url: youtubeUrl }).eq("id", true); flashSaved("Stream link saved"); };

  const setMatchStatus = async (matchId: string, status: DbMatchRow["status"]) => { await supabase!.rpc("admin_set_match_status", { p_match_id: matchId, p_status: status }); setDbMatches(current => current.map(m => m.id === matchId ? { ...m, status } : m)); };
  const adjustScore = async (match: DbMatchRow, side: "A" | "B", delta: number) => {
    const scoreRow = match.live_scores?.[0] ?? { games_a: 0, games_b: 0, points_a: "0", points_b: "0", serving_side: null };
    const gamesA = side === "A" ? Math.max(0, scoreRow.games_a + delta) : scoreRow.games_a;
    const gamesB = side === "B" ? Math.max(0, scoreRow.games_b + delta) : scoreRow.games_b;
    await supabase!.rpc("admin_update_live_score", { p_match_id: match.id, p_points_a: scoreRow.points_a, p_points_b: scoreRow.points_b, p_games_a: gamesA, p_games_b: gamesB, p_serving_side: scoreRow.serving_side });
    setDbMatches(current => current.map(m => m.id === match.id ? { ...m, live_scores: [{ ...scoreRow, games_a: gamesA, games_b: gamesB }] } : m));
  };
  const teamName = (id: string | null) => dbTeams.find(t => t.id === id)?.name ?? "Team";
  const createMatch = async () => {
    if (!newMatchTeamA || !newMatchTeamB) return;
    const { data } = await supabase!.from("matches").insert({ event_id: ISLAND_CUP_EVENT_ID, team_a_id: newMatchTeamA, team_b_id: newMatchTeamB, court: newMatchCourt, scheduled_at: newMatchTime || null, status: "UPCOMING" }).select("id, court, status, team_a_id, team_b_id").single();
    if (data) setDbMatches(current => [...current, { ...(data as Omit<DbMatchRow, "live_scores">), live_scores: [] }]);
    flashSaved("Match created");
  };
  const updateStanding = async (teamId: string, field: keyof DbStandingRow, value: number) => {
    const existing = dbStandings.find(s => s.team_id === teamId);
    const patch = { event_id: ISLAND_CUP_EVENT_ID, team_id: teamId, played: existing?.played ?? 0, won: existing?.won ?? 0, lost: existing?.lost ?? 0, points: existing?.points ?? 0, [field]: value };
    const { data } = await supabase!.from("standings").upsert(patch, { onConflict: "event_id,team_id" }).select("team_id, played, won, lost, points").single();
    if (data) setDbStandings(current => [...current.filter(s => s.team_id !== teamId), data as DbStandingRow]);
    flashSaved("Standings saved");
  };

  const session = dbSessions.find(s => s.id === selectedSessionId);
  useEffect(() => {
    if (!session) return;
    supabase!.from("training_reports").select("id, coach_debrief, key_takeaways, player_quotes").eq("session_id", session.id).maybeSingle().then(({ data }) => {
      const report = data as DbReportRow | null;
      setCoachNoteDraft(report?.coach_debrief ?? "");
      setQuoteTextDraft(report?.player_quotes?.[0]?.text ?? "");
      setQuoteAuthorDraft(report?.player_quotes?.[0]?.author ?? "");
      setTakeawaysDraft((report?.key_takeaways ?? []).join("\n"));
    });
    supabase!.from("media").select("id, storage_path, external_url, role, media_type").eq("session_id", session.id).then(({ data }) => {
      const rows = (data as DbMediaRow[] | null) ?? [];
      setSessionMedia(rows.filter(r => r.media_type === "photo"));
      setVideoUrlDraft(rows.find(r => r.media_type === "video")?.external_url ?? "");
    });
  }, [session?.id]);

  const saveSessionStatus = async (status: DbTrainingSessionRow["session_status"]) => {
    if (!session) return;
    await supabase!.from("training_sessions").update({ session_status: status }).eq("id", session.id);
    setDbSessions(current => current.map(s => s.id === session.id ? { ...s, session_status: status } : s));
    flashSaved("Session status saved");
  };
  const saveReport = async () => {
    if (!session) return;
    const patch = { session_id: session.id, coach_debrief: coachNoteDraft || null, player_quotes: quoteTextDraft ? [{ text: quoteTextDraft, author: quoteAuthorDraft }] : [], key_takeaways: takeawaysDraft.split("\n").map(s => s.trim()).filter(Boolean), status: "published", published_at: new Date().toISOString() };
    const { data: existing } = await supabase!.from("training_reports").select("id").eq("session_id", session.id).maybeSingle();
    if (existing) await supabase!.from("training_reports").update(patch).eq("id", existing.id);
    else await supabase!.from("training_reports").insert(patch);
    flashSaved("Report saved");
  };
  const uploadSessionPhoto = async (file: File) => {
    if (!session) return;
    const row = await uploadMedia(file, `sessions/${session.id}`, { media_type: "photo", session_id: session.id, title: `${session.title} photo` });
    setSessionMedia(current => [...current, row]);
    flashSaved("Photo added");
  };
  const saveVideoUrl = async () => {
    if (!session) return;
    const { data: existingVideo } = await supabase!.from("media").select("id").eq("session_id", session.id).eq("media_type", "video").maybeSingle();
    if (videoUrlDraft) {
      if (existingVideo) await supabase!.from("media").update({ external_url: videoUrlDraft }).eq("id", existingVideo.id);
      else await supabase!.from("media").insert({ media_type: "video", session_id: session.id, external_url: videoUrlDraft, title: `${session.title} highlights`, status: "published", published_at: new Date().toISOString() });
      flashSaved("Video link saved");
    }
  };

  const startNewArticle = () => { setEditingNewsId("new"); setNewsTitle(""); setNewsExcerpt(""); setNewsBody(""); setNewsCategory("Team News"); setNewsTags(""); setNewsStatus("draft"); };
  const editArticle = (n: DbNewsRow) => { setEditingNewsId(n.id); setNewsTitle(n.title); setNewsExcerpt(n.excerpt ?? ""); setNewsBody(n.body ?? ""); setNewsCategory(n.category); setNewsTags((n.tags ?? []).join(", ")); setNewsStatus(n.status === "published" ? "published" : "draft"); };
  const saveArticle = async () => {
    const slug = newsTitle.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload = { title: newsTitle, excerpt: newsExcerpt, body: newsBody, category: newsCategory, tags: newsTags.split(",").map(t => t.trim()).filter(Boolean), status: newsStatus, published_at: newsStatus === "published" ? new Date().toISOString() : null };
    if (editingNewsId === "new") {
      const { data } = await supabase!.from("news").insert({ ...payload, slug }).select("id, slug, title, excerpt, body, category, tags, status").single();
      if (data) setDbNews(current => [data as DbNewsRow, ...current]);
    } else {
      await supabase!.from("news").update(payload).eq("id", editingNewsId);
      setDbNews(current => current.map(n => n.id === editingNewsId ? { ...n, ...payload } : n));
    }
    flashSaved("Article saved");
    setEditingNewsId("");
  };

  return <><PageIntro eyebrow="CONTROL ROOM / LIVE" title="Admin" copy="Changes here save directly to Team Mauritius' database and go live on the next page load — no redeploy needed." /><section className="section admin-section">
    {saved && <div className="admin-warning"><Check size={18} /><div><strong>{saved}</strong></div></div>}
    <div className="admin-grid">
      <div className="admin-grid-col">
      <div className="admin-panel">
        <div className="panel-heading"><div><p className="eyebrow">SITE CONTROL</p><h2>Phase mode</h2></div><Settings2 size={20} /></div>
        <div className="mode-grid">{(["pre_event", "live_event", "post_event"] as SiteMode[]).map(mode => <button key={mode} className={siteMode === mode ? "selected" : ""} onClick={() => updateMode(mode)}><span>{mode === "pre_event" ? "01" : mode === "live_event" ? "02" : "03"}</span>{phaseLabels[mode]}</button>)}</div>
        <label className="field-label">YouTube Live URL<input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} onBlur={saveYoutubeUrl} placeholder="Add stream URL when ready" /></label>
        <button className="button full" onClick={() => supabase!.auth.signOut()}>Sign out</button>
      </div>
      <div className="admin-panel">
        <div className="panel-heading"><div><p className="eyebrow">TRAINING SESSIONS</p><h2>Session content</h2></div><Camera size={20} /></div>
        <label className="field-label">Session<select value={selectedSessionId} onChange={e => setSelectedSessionId(e.target.value)}>{dbSessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
        {session && <>
          <label className="field-label">Status<select value={session.session_status} onChange={e => saveSessionStatus(e.target.value as DbTrainingSessionRow["session_status"])}><option value="UPCOMING">Upcoming</option><option value="LIVE">Live</option><option value="COMPLETED">Completed</option></select></label>
          <label className="field-label">Coach's note<textarea rows={3} value={coachNoteDraft} onChange={e => setCoachNoteDraft(e.target.value)} onBlur={saveReport} /></label>
          <div className="admin-two-col"><label className="field-label">Player quote<input value={quoteTextDraft} onChange={e => setQuoteTextDraft(e.target.value)} onBlur={saveReport} /></label><label className="field-label">Quote author<input value={quoteAuthorDraft} onChange={e => setQuoteAuthorDraft(e.target.value)} onBlur={saveReport} /></label></div>
          <label className="field-label">Key takeaways (one per line)<textarea rows={3} value={takeawaysDraft} onChange={e => setTakeawaysDraft(e.target.value)} onBlur={saveReport} /></label>
          <label className="field-label">Video URL<input value={videoUrlDraft} onChange={e => setVideoUrlDraft(e.target.value)} onBlur={saveVideoUrl} placeholder="YouTube / Instagram link" /></label>
          <label className="field-label">Add gallery photo<input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadSessionPhoto(e.target.files[0])} /></label>
          {sessionMedia.length > 0 && <div className="detail-media">{sessionMedia.map(m => <img key={m.id} src={mediaSrc(m)} alt="" style={{ width: 80, height: 80, objectFit: "cover" }} />)}</div>}
        </>}
      </div>
      <div className="admin-panel">
        <div className="panel-heading"><div><p className="eyebrow">STANDINGS</p><h2>Nations Cup</h2></div><Gauge size={20} /></div>
        {dbTeams.map(t => { const s = dbStandings.find(x => x.team_id === t.id); return <div className="score-control" key={t.id}>
          <div className="score-control-head"><span>{t.name}</span></div>
          <div className="admin-two-col"><label className="field-label">Played<input type="number" defaultValue={s?.played ?? 0} onBlur={e => updateStanding(t.id, "played", Number(e.target.value))} /></label><label className="field-label">Won<input type="number" defaultValue={s?.won ?? 0} onBlur={e => updateStanding(t.id, "won", Number(e.target.value))} /></label></div>
          <div className="admin-two-col"><label className="field-label">Lost<input type="number" defaultValue={s?.lost ?? 0} onBlur={e => updateStanding(t.id, "lost", Number(e.target.value))} /></label><label className="field-label">Points<input type="number" defaultValue={s?.points ?? 0} onBlur={e => updateStanding(t.id, "points", Number(e.target.value))} /></label></div>
        </div>; })}
      </div>
      </div>
      <div className="admin-grid-col">
      <div className="admin-panel">
        <div className="panel-heading"><div><p className="eyebrow">PLAYER DIRECTORY</p><h2>Edit profile</h2></div><Users size={20} /></div>
        <label className="field-label">Player<select value={selectedPlayerId} onChange={e => setSelectedPlayerId(e.target.value)}>{dbPlayers.map(item => <option key={item.id} value={item.id}>{item.full_name}</option>)}</select></label>
        {player && <>
          <div className="admin-two-col"><label className="field-label">Ranking<input value={player.ranking ?? ""} onChange={e => setDbPlayers(current => current.map(p => p.id === player.id ? { ...p, ranking: e.target.value } : p))} onBlur={e => patchPlayer({ ranking: e.target.value })} /></label><label className="field-label">Club<input value={player.club ?? ""} onChange={e => setDbPlayers(current => current.map(p => p.id === player.id ? { ...p, club: e.target.value } : p))} onBlur={e => patchPlayer({ club: e.target.value })} /></label></div>
          <div className="admin-two-col"><label className="field-label">Playing side<input value={player.playing_side ?? ""} onChange={e => setDbPlayers(current => current.map(p => p.id === player.id ? { ...p, playing_side: e.target.value } : p))} onBlur={e => patchPlayer({ playing_side: e.target.value })} /></label><label className="field-label">Dominant hand<input value={player.dominant_hand ?? ""} onChange={e => setDbPlayers(current => current.map(p => p.id === player.id ? { ...p, dominant_hand: e.target.value } : p))} onBlur={e => patchPlayer({ dominant_hand: e.target.value })} /></label></div>
          <label className="field-label">Biography<textarea rows={3} value={player.biography ?? ""} onChange={e => setDbPlayers(current => current.map(p => p.id === player.id ? { ...p, biography: e.target.value } : p))} onBlur={e => patchPlayer({ biography: e.target.value })} /></label>
          <label className="field-label">Quote<textarea rows={2} value={player.quote ?? ""} onChange={e => setDbPlayers(current => current.map(p => p.id === player.id ? { ...p, quote: e.target.value } : p))} onBlur={e => patchPlayer({ quote: e.target.value })} /></label>
          <label className="field-label">Instagram<input value={player.social_links?.instagram ?? ""} onChange={e => setDbPlayers(current => current.map(p => p.id === player.id ? { ...p, social_links: { ...p.social_links, instagram: e.target.value } } : p))} onBlur={e => patchPlayer({ social_links: { ...player.social_links, instagram: e.target.value } })} /></label>
          <span className="field-note">PLAYER DNA (up to 3)</span>
          <div className="mode-grid">{DNA_VOCABULARY.map(item => <button key={item} className={player.strengths?.includes(item) ? "selected" : ""} onClick={() => toggleStrength(item)}>{item}</button>)}</div>
          <span className="field-note">PHOTOS</span>
          {(playerMedia.find(m => m.id === player.hero_media_id) || playerMedia.find(m => m.role === "alt")) && <div className="detail-media">{playerMedia.find(m => m.id === player.hero_media_id) && <img src={mediaSrc(playerMedia.find(m => m.id === player.hero_media_id)!)} alt="Current portrait" title="Current portrait" style={{ width: 80, height: 80, objectFit: "cover" }} />}{playerMedia.find(m => m.role === "alt") && <img src={mediaSrc(playerMedia.find(m => m.role === "alt")!)} alt="Current action shot" title="Current action shot" style={{ width: 80, height: 80, objectFit: "cover" }} />}</div>}
          <div className="admin-two-col"><label className="field-label">Portrait<input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadPlayerHero(e.target.files[0])} /></label><label className="field-label">Action shot<input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadPlayerAlt(e.target.files[0])} /></label></div>
          <label className="field-label">Add gallery photo<input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadPlayerGallery(e.target.files[0])} /></label>
          {playerMedia.filter(m => m.id !== player.hero_media_id).length > 0 && <div className="detail-media">{playerMedia.filter(m => m.id !== player.hero_media_id).map(m => <div key={m.id} style={{ position: "relative" }}><img src={mediaSrc(m)} alt="" style={{ width: 80, height: 80, objectFit: "cover" }} />{m.role === "gallery" && <button onClick={() => deletePlayerMedia(m.id)} style={{ position: "absolute", top: 2, right: 2 }} aria-label="Remove photo"><Trash2 size={12} /></button>}</div>)}</div>}
        </>}
      </div>
      <div className="admin-panel">
        <div className="panel-heading"><div><p className="eyebrow">NEWSROOM</p><h2>Articles</h2></div><Video size={20} /></div>
        {!editingNewsId && <><button className="button full" onClick={startNewArticle}>+ New story</button><div className="notes-list">{dbNews.map(n => <span key={n.id} onClick={() => editArticle(n)} style={{ cursor: "pointer" }}>{n.title} — {n.status}</span>)}</div></>}
        {editingNewsId && <>
          <label className="field-label">Title<input value={newsTitle} onChange={e => setNewsTitle(e.target.value)} /></label>
          <label className="field-label">Excerpt<textarea rows={2} value={newsExcerpt} onChange={e => setNewsExcerpt(e.target.value)} /></label>
          <label className="field-label">Body (blank line = new paragraph)<textarea rows={6} value={newsBody} onChange={e => setNewsBody(e.target.value)} /></label>
          <div className="admin-two-col"><label className="field-label">Category<input value={newsCategory} onChange={e => setNewsCategory(e.target.value)} /></label><label className="field-label">Tags (comma separated)<input value={newsTags} onChange={e => setNewsTags(e.target.value)} /></label></div>
          <label className="field-label">Status<select value={newsStatus} onChange={e => setNewsStatus(e.target.value as "draft" | "published")}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <div className="admin-two-col"><button className="button full" onClick={saveArticle}>Save</button><button className="button button-secondary full" onClick={() => setEditingNewsId("")}>Cancel</button></div>
        </>}
      </div>
      <div className="admin-panel scoring-panel">
        <div className="panel-heading"><div><p className="eyebrow">LIVE SCORING</p><h2>Phone-ready controls</h2></div><Gauge size={20} /></div>
        <div className="admin-two-col"><label className="field-label">Team A<select value={newMatchTeamA} onChange={e => setNewMatchTeamA(e.target.value)}><option value="">Select</option>{dbTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label><label className="field-label">Team B<select value={newMatchTeamB} onChange={e => setNewMatchTeamB(e.target.value)}><option value="">Select</option>{dbTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label></div>
        <div className="admin-two-col"><label className="field-label">Court<input value={newMatchCourt} onChange={e => setNewMatchCourt(e.target.value)} /></label><label className="field-label">Date/time<input type="datetime-local" value={newMatchTime} onChange={e => setNewMatchTime(e.target.value)} /></label></div>
        <button className="button full" onClick={createMatch}>+ Create match</button>
        {dbMatches.length ? dbMatches.map(match => { const scoreRow = match.live_scores?.[0]; return <div className="score-control" key={match.id}><div className="score-control-head"><span>{match.court ?? "Court"}</span><button onClick={() => setMatchStatus(match.id, "LIVE")}>{match.status === "LIVE" ? "LIVE" : "Set live"}</button></div><div className="score-control-row"><span>{teamName(match.team_a_id)}</span><b>{scoreRow?.games_a ?? 0}</b><button onClick={() => adjustScore(match, "A", -1)} aria-label="Minus team A"><Minus size={16} /></button><button onClick={() => adjustScore(match, "A", 1)} aria-label="Plus team A"><Plus size={16} /></button></div><div className="score-control-row"><span>{teamName(match.team_b_id)}</span><b>{scoreRow?.games_b ?? 0}</b><button onClick={() => adjustScore(match, "B", -1)} aria-label="Minus team B"><Minus size={16} /></button><button onClick={() => adjustScore(match, "B", 1)} aria-label="Plus team B"><Plus size={16} /></button></div><div className="score-control-actions"><button onClick={() => setMatchStatus(match.id, "FINISHED")}><Check size={14} /> Finish match</button></div></div>; }) : <EmptyState text="No matches scheduled yet — create one above." />}
      </div>
      </div>
    </div>
  </section></>;
}

function AdminLocalDemo({ state, setState }: ShellProps) { const [saved, setSaved] = useState(false); const [selectedPlayer, setSelectedPlayer] = useState(state.players[0].id); const player = state.players.find(p => p.id === selectedPlayer) ?? state.players[0]; const [name, setName] = useState(player.name); const [liveUrl, setLiveUrl] = useState(state.liveUrl); useEffect(() => { setName(player.name); }, [player.name]); const updatePlayer = (field: keyof Player, value: string) => setState(current => ({ ...current, players: current.players.map(item => item.id === selectedPlayer ? { ...item, [field]: value } : item) })); const score = (matchId: string, side: "A" | "B", delta: number) => setState(current => ({ ...current, matches: current.matches.map(m => m.id === matchId ? { ...m, gameA: side === "A" ? Math.max(0, m.gameA + delta) : m.gameA, gameB: side === "B" ? Math.max(0, m.gameB + delta) : m.gameB } : m) })); const markLive = (matchId: string) => setState(current => ({ ...current, mode: "live_event", matches: current.matches.map(m => ({ ...m, status: m.id === matchId ? "LIVE" : m.status })) })); return <><PageIntro eyebrow="CONTROL ROOM / LOCAL EDIT MODE" title="Admin" copy="Supabase isn't configured in this environment — changes here are a local-only preview." /><section className="section admin-section"><div className="admin-warning"><LockKeyhole size={18} /><div><strong>Local demo mode</strong><span>Changes are stored in this browser only. No production backend is connected here.</span></div></div><div className="admin-grid"><div className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">SITE CONTROL</p><h2>Phase mode</h2></div><Settings2 size={20} /></div><div className="mode-grid">{(["pre_event", "live_event", "post_event"] as SiteMode[]).map(mode => <button key={mode} className={state.mode === mode ? "selected" : ""} onClick={() => setState(current => ({ ...current, mode }))}><span>{mode === "pre_event" ? "01" : mode === "live_event" ? "02" : "03"}</span>{phaseLabels[mode]}</button>)}</div><label className="field-label">YouTube Live URL<input value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="Add stream URL when ready" /></label><button className="button full" onClick={() => { setState(current => ({ ...current, liveUrl })); setSaved(true); window.setTimeout(() => setSaved(false), 1800); }}>{saved ? <><Check size={15} /> Saved locally</> : <>Save settings <Check size={15} /></>}</button></div><div className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">PLAYER DIRECTORY</p><h2>Edit profile</h2></div><Users size={20} /></div><label className="field-label">Player<select value={selectedPlayer} onChange={e => setSelectedPlayer(e.target.value)}>{state.players.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="field-label">Full name<input value={name} onChange={e => setName(e.target.value)} onBlur={() => updatePlayer("name", name)} /></label><div className="admin-two-col"><label className="field-label">Ranking<input value={player.ranking} onChange={e => updatePlayer("ranking", e.target.value)} /></label><label className="field-label">Club<input value={player.club} onChange={e => updatePlayer("club", e.target.value)} /></label></div><div className="admin-two-col"><label className="field-label">Playing side<input value={player.playingSide} onChange={e => updatePlayer("playingSide", e.target.value)} /></label><label className="field-label">Dominant hand<input value={player.dominantHand} onChange={e => updatePlayer("dominantHand", e.target.value)} /></label></div><span className="field-note">Photo, biography, quotes, galleries and sponsors remain editable fields for the Supabase phase.</span></div><div className="admin-panel scoring-panel"><div className="panel-heading"><div><p className="eyebrow">LIVE SCORING</p><h2>Phone-ready controls</h2></div><Gauge size={20} /></div>{state.matches.map(match => <div className="score-control" key={match.id}><div className="score-control-head"><span>{match.court}</span><button onClick={() => markLive(match.id)}>{match.status === "LIVE" ? "LIVE" : "Set live"}</button></div><div className="score-control-row"><span>{match.nationA}</span><b>{match.gameA}</b><button onClick={() => score(match.id, "A", -1)} aria-label="Minus team A"><Minus size={16} /></button><button onClick={() => score(match.id, "A", 1)} aria-label="Plus team A"><Plus size={16} /></button></div><div className="score-control-row"><span>{match.nationB}</span><b>{match.gameB}</b><button onClick={() => score(match.id, "B", -1)} aria-label="Minus team B"><Minus size={16} /></button><button onClick={() => score(match.id, "B", 1)} aria-label="Plus team B"><Plus size={16} /></button></div><div className="score-control-actions"><button onClick={() => setState(current => ({ ...current, matches: current.matches.map(m => m.id === match.id ? { ...m, gameA: 0, gameB: 0 } : m) }))}><RotateCcw size={14} /> Undo / reset</button><button onClick={() => setState(current => ({ ...current, matches: current.matches.map(m => m.id === match.id ? { ...m, status: "FINISHED" } : m) }))}><Check size={14} /> Finish match</button></div></div>)}</div></div></section></>; }
function NotFound() { return <section className="section not-found"><p className="eyebrow">404 / OUT OF BOUNDS</p><h1>Page not found.</h1><ButtonLink to="/">Back to the hub</ButtonLink></section>; }

export default App;
