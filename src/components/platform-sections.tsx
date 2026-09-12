import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Camera, ChevronRight, CirclePlay, Link2, MapPin, MessageCircle, Radio, Share2, Target, Trophy, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Match, Player, TrainingSession, CoachData, NewsItem } from "../lib/data";
import { CoachFeatureHero, CoachInfoBar, EditorialQuote, PhotoTreatment, DotField } from "./brand";

export type PlatformMode = "pre_event" | "live_event" | "post_event";

const journey = ["Train", "Build", "Compete", "Depart", "Arrive", "Live", "Results", "The Story"];

export function JourneyRail() {
  return <section className="journey-rail" aria-label="Team Mauritius journey">
    <span className="journey-label">ROAD TO LA RÉUNION</span>
    <div className="journey-steps">{journey.map((step, index) => <div className="journey-step" key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span>{index < journey.length - 1 && <ChevronRight size={14} />}</div>)}</div>
  </section>;
}

export function QuickNavigation() {
  const links = [
    { label: "Team", to: "/team", icon: <Users size={18} /> },
    { label: "Training", to: "/training", icon: <Trophy size={18} /> },
    { label: "News", to: "/news", icon: <ArrowUpRight size={18} /> },
    { label: "Live Center", to: "/live", icon: <Radio size={18} /> },
    { label: "Schedule", to: "/schedule", icon: <ChevronRight size={18} /> },
  ];
  return <nav className="quick-navigation" aria-label="Quick access">{links.map(link => <Link to={link.to} key={link.to}>{link.icon}<span>{link.label}</span></Link>)}</nav>;
}

export function ModePriorityPanel({ mode, matches, liveUrl }: { mode: PlatformMode; matches: Match[]; liveUrl: string }) {
  const currentMatch = matches.find(match => match.status === "LIVE");
  const completed = matches.filter(match => match.status === "FINISHED");
  if (mode === "live_event") {
    return <section className="mode-priority mode-live"><div className="mode-priority-heading"><span className="live-dot" /><div><small>LIVE FROM LA RÉUNION</small><h2>Live now</h2></div></div>{currentMatch ? <div className="priority-score"><span>{currentMatch.court}</span><strong>{currentMatch.nationA}</strong><b>{currentMatch.gameA} — {currentMatch.gameB}</b><strong>{currentMatch.nationB}</strong><small>{currentMatch.pairA} · {currentMatch.pairB}</small></div> : <div className="priority-empty">The first official live match will appear here as soon as scoring starts.</div>}<div className="priority-actions"><Link className="button" to="/live">Open live center <ArrowUpRight size={15} /></Link>{liveUrl && <a className="button button-secondary" href={liveUrl} target="_blank" rel="noreferrer">Watch live <CirclePlay size={15} /></a>}</div></section>;
  }
  if (mode === "post_event") {
    return <section className="mode-priority mode-archive"><div><small>POST-EVENT / ARCHIVE</small><h2>The story</h2><p>Results, highlights, galleries and the complete Team Mauritius competition record.</p></div><div className="archive-stat"><strong>{completed.length || "—"}</strong><span>Official results published</span></div><Link className="button" to="/results">Explore results <ArrowUpRight size={15} /></Link></section>;
  }
  return <JourneyRail />;
}

export function HomeEditorialGrid({ featuredPlayer }: { featuredPlayer?: Player }) {
  return <section className="section home-editorial-grid">
    <article className="editorial-feature latest-video"><div><span className="editorial-icon"><CirclePlay size={22} /></span><small>LATEST VIDEO</small><h3>Video desk ready</h3><p>The next official Team Mauritius video will be published here.</p></div><Link to="/media">Open media <ArrowUpRight size={15} /></Link></article>
    <article className="editorial-feature featured-player"><div><span className="editorial-icon"><Users size={22} /></span><small>FEATURED PLAYER</small><h3>{featuredPlayer?.name ?? "Player feature pending"}</h3><p>Official facts, results and media remain editable without invented information.</p></div>{featuredPlayer && <Link to={`/team/${featuredPlayer.id}`}>View profile <ArrowUpRight size={15} /></Link>}</article>
    <article className="editorial-feature coach-card"><div><span className="editorial-icon"><Trophy size={22} /></span><small>HEAD COACH</small><h3>Adam Auckland</h3><p>Preparation approach, tactical priorities and recurring Adam’s Notes.</p></div><Link to="/coach/adam-auckland">Coach profile <ArrowUpRight size={15} /></Link></article>
  </section>;
}

export function TrainingStoryBlocks({ session }: { session: TrainingSession }) {
  const completed = session.status === "COMPLETED";
  const blocks = [
    { title: "Training Report", icon: <ArrowUpRight size={18} /> },
    { title: "Photo Gallery", icon: <Camera size={18} /> },
    { title: "Video Highlights", icon: <CirclePlay size={18} /> },
    { title: "Coach Debrief", icon: <Trophy size={18} /> },
    { title: "Player Quotes", icon: <Users size={18} /> },
    { title: "What we learned", icon: <ChevronRight size={18} /> },
  ];
  return <section className="session-story"><div className="session-story-head"><div><small>SESSION CONTENT</small><h2>{completed ? "The full story" : "Ready to publish"}</h2></div><span className={`session-state state-${session.status.toLowerCase()}`}>{session.status}</span></div><div className="session-story-grid">{blocks.map(block => <article key={block.title}>{block.icon}<h3>{block.title}</h3><p>{completed ? "Official content will appear here when supplied by the media team." : "Available immediately after the session is completed."}</p><span>{completed ? "CONTENT PENDING" : "LOCKED UNTIL COMPLETED"}</span></article>)}</div></section>;
}

export function CoachPage({ coach }: { coach: CoachData | null }) {
  const dna: [string, string][] = [
    ["Background", coach?.background ?? "To be published by Adam Auckland."],
    ["Experience", coach?.experience ?? "To be published by Adam Auckland."],
  ];
  const sections: [string, string][] = [
    ["Main objective", coach?.main_objective ?? "To be published by Adam Auckland."],
    ["Playing identity", coach?.playing_identity ?? "To be published by Adam Auckland."],
    ["Expectations", coach?.expectations ?? "To be published by Adam Auckland."],
  ];
  const instagram = coach?.social_links?.instagram;
  return <><section className="coach-page-hero"><div><p className="eyebrow">HEAD COACH / TEAM MAURITIUS</p><h1>Adam<br />Auckland</h1><p>{coach?.philosophy ?? "Leading the collective preparation for the Island Padel Cup 2026."}</p>{coach?.club && <span className="coach-structure">{coach.club}</span>}{coach?.nationality && <span className="coach-structure">{coach.nationality}</span>}{instagram && <span className="coach-structure">@{instagram}</span>}</div><div className="coach-page-media"><img src="/images/players/adam-auckland.jpg" alt="Adam Auckland — Head Coach, Team Mauritius" /></div></section><section className="section coach-dna"><div className="section-head"><div><p className="eyebrow">COACH DNA</p><h2>What Adam brings</h2></div></div><div className="behind-grid">{dna.map(([title, value], index) => <article key={title}><b>{String(index + 1).padStart(2, "0")}</b><h2>{title}</h2><p>{value}</p></article>)}</div>{coach?.preparation_priorities?.length ? <div className="dna-badges" style={{ marginTop: 30 }}>{coach.preparation_priorities.map(item => <Tag key={item}>{item}</Tag>)}</div> : null}</section><section className="section coach-page-grid">{sections.map(([title, copy]) => <article key={title}><small>{title}</small><p>{copy}</p></article>)}</section><section className="section adams-notes"><div><p className="eyebrow">{coach?.team_word ? `TEAM MAURITIUS: ${coach.team_word.toUpperCase()}` : "RECURRING EDITORIAL SERIES"}</p><h2>Adam’s Notes</h2><p>{coach?.message_to_team ?? "Key observations, tactical focus and next-step priorities after each camp."}</p></div><div className="notes-list"><span>06 SEP · NOTE PENDING</span><span>13 SEP · NOTE PENDING</span><span>24 SEP · NOTE PENDING</span><span>27 SEP · NOTE PENDING</span></div></section></>;
}

function Tag({ children }: { children: ReactNode }) { return <span className="tag">{children}</span>; }

export function BehindTheTeamPage() {
  const areas = [
    ["Coach", "Adam Auckland"], ["MSRA", "Team environment"], ["Mauritius Padel League", "Team environment"],
    ["Physical preparation", "Details pending"], ["Medical / physio", "Staff pending"], ["Media / video", "Team pending"],
    ["Travel logistics", "Details pending"], ["Partners", "Partner roster pending"],
  ];
  return <><section className="page-intro"><p className="eyebrow">THE PEOPLE BEHIND THE JOURNEY</p><h1>Behind Team Mauritius</h1><p className="intro-copy">The wider environment supporting the team from preparation to competition.</p></section><section className="section behind-grid">{areas.map(([title, value], index) => <article key={title}><b>{String(index + 1).padStart(2, "0")}</b><h2>{title}</h2><p>{value}</p></article>)}</section></>;
}

export function EditorialRoadmap() {
  const stories = ["06 SEP · Meet Team Mauritius", "13 SEP · Building The Team", "24 SEP · Competition Mode", "27 SEP · Ready For La Réunion", "Departure", "Arrival in La Réunion", "Official Practice", "Opening Ceremony", "Competition Day 1", "Competition Day 2", "Semi-Finals", "Finals"];
  return <section className="section editorial-roadmap"><div><p className="eyebrow">CHRONOLOGICAL STORY FEED</p><h2>Road to La Réunion</h2></div><div className="story-feed">{stories.map((story, index) => <div key={story}><b>{String(index + 1).padStart(2, "0")}</b><span>{story}</span><small>{index < 4 ? "PLANNED" : "UPCOMING"}</small></div>)}</div></section>;
}

export function VenueLine() {
  return <span className="venue-line"><MapPin size={14} /> Club de Champ Fleuri · La Réunion</span>;
}

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView<HTMLDivElement>();
  return <div ref={ref} className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}

const assessObjectives = [
  { title: "TEAM BUILDING", copy: "Build chemistry across the men's and women's squads. Establish communication, trust and a strong Team Mauritius identity." },
  { title: "PLAYER ASSESSMENT", copy: "Assess pair combinations, court positioning, communication and decision-making through technical work and match scenarios." },
  { title: "PRESSURE POINTS", copy: "Test players under match pressure with decisive points, tie-break situations and competitive scenarios." },
];

const assessTimeline = [
  { time: "07:00", title: "BRIEFING & ACTIVATION", copy: "Team introduction, warm-up and preparation objectives." },
  { time: "07:15", title: "TECHNICAL & TACTICAL WORK", copy: "Movement, positioning, transitions and tactical patterns." },
  { time: "07:40", title: "PAIR COMBINATIONS", copy: "Testing chemistry, communication and different player combinations." },
  { time: "08:20", title: "PRESSURE POINTS", copy: "Competitive situations, decisive points and tie-break scenarios." },
  { time: "08:50", title: "COACH DEBRIEF", copy: "Initial observations and direction for the next preparation block." },
  { time: "09:00", title: "TEAM BRUNCH", copy: "Caña Club" },
];

const assessCoachFocus = ["PAIR COMPLEMENTARITY", "COMMUNICATION & TRUST", "COMPOSURE UNDER PRESSURE", "TEAM UNITY"];

const assessTakeaways = [
  { title: "ONE TEAM", copy: "The preparation starts by creating a collective identity across the entire Mauritius squad." },
  { title: "BUILDING CHEMISTRY", copy: "Pair combinations and communication are central to finding the strongest competitive balance." },
  { title: "PERFORM UNDER PRESSURE", copy: "Training must reproduce the moments that decide matches." },
  { title: "THE JOURNEY HAS STARTED", copy: "Session by session, Team Mauritius is building towards the Island Padel Cup in La Réunion." },
];

const assessProgression = ["ASSESS", "BUILD", "COMPETE", "READY"];

export function AssessSessionJournal({ session }: { session: TrainingSession }) {
  const heroTrainingImage = session.gallery?.[0];
  const coachImage = session.heroImage;
  return <>
    <section className="section assess-objectives">
      <div className="assess-objectives-grid">
        <div className="assess-objectives-copy">
          <p className="eyebrow">SESSION 01 · ASSESS</p>
          <h2>Objectives</h2>
          <div className="assess-objective-rows">
            {assessObjectives.map((item, index) => <Reveal key={item.title} delay={index * 80}><div className="assess-objective-row"><span className="assess-objective-marker" aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.copy}</p></div></div></Reveal>)}
          </div>
        </div>
        <div className="assess-objectives-media">{coachImage ? <img src={coachImage} alt="Head coach Adam Auckland explaining a drill, Assess session" /> : <DotWaveBackground intensity={0.5} />}</div>
      </div>
    </section>

    <section className="section assess-timeline-section">
      <p className="eyebrow">SESSION 01 · ASSESS</p>
      <h2>Today's session</h2>
      <Reveal className="assess-timeline">
        <div className="assess-timeline-line" aria-hidden="true" />
        {assessTimeline.map((item, index) => <div className="assess-timeline-row" key={item.time} style={{ transitionDelay: `${index * 90}ms` }}><span className="assess-timeline-dot" aria-hidden="true" /><span className="assess-timeline-time">{item.time}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></div>)}
      </Reveal>
    </section>

    <section className="section assess-brunch">
      <Reveal><div className="assess-brunch-card">
        <span className="assess-brunch-label">TEAM BRUNCH</span>
        <h3>After the Sunday session · Caña Club</h3>
        <p className="assess-brunch-sub">Recovery. Debrief. Team building.</p>
        <p>An informal post-session moment with the squad and Head Coach Adam Auckland to review the morning, strengthen team chemistry and align everyone around the Road to La Réunion.</p>
      </div></Reveal>
    </section>

    <section className="section assess-coach-note">
      <Reveal>
        <p className="eyebrow">SESSION 01 · ASSESS</p>
        <h2>Coach's note</h2>
        <blockquote className="assess-quote">“I came away with a very positive impression. I saw a lot of engagement, real pride in representing Mauritius, and highly motivated players. It's an excellent base to build on.”<cite>— Adam Auckland, Head Coach · L'Express Sport, 11 September 2026</cite></blockquote>
        <div className="assess-coach-focus">
          <span className="assess-coach-focus-label">HEAD COACH FOCUS</span>
          <div className="assess-coach-focus-row">{assessCoachFocus.map(item => <span key={item}>{item}</span>)}</div>
        </div>
      </Reveal>
    </section>

    <section className="section assess-player-quote">
      <DotWaveBackground intensity={0.16} />
      <Reveal><blockquote className="assess-player-quote-text"><span className="assess-quote-mark" aria-hidden="true">“</span>Different players, different styles — but one objective. Every session brings us closer together as Team Mauritius.<cite>— Team Mauritius · Road to La Réunion</cite></blockquote></Reveal>
    </section>

    <section className="section assess-takeaways">
      <p className="eyebrow">KEY TAKEAWAYS · SESSION 01</p>
      <div className="assess-takeaways-grid">
        {assessTakeaways.map((item, index) => <Reveal key={item.title} delay={index * 90} className="assess-takeaway"><span className="assess-takeaway-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.copy}</p></Reveal>)}
      </div>
    </section>

    <section className="assess-media">
      <p className="eyebrow">SESSION MEDIA</p>
      <p className="assess-media-note">Official Team Mauritius training portraits and session photography will be added following Sunday's preparation session.</p>
      <div className="assess-media-grid">
        <div className="assess-media-slot assess-media-hero">{heroTrainingImage ? <img src={heroTrainingImage} alt="Team Mauritius training, Assess session" /> : <DotWaveBackground intensity={0.5} />}</div>
        <div className="assess-media-slot"><DotWaveBackground intensity={0.5} /><span className="assess-media-slot-label">Coach</span></div>
        <div className="assess-media-slot"><DotWaveBackground intensity={0.5} /><span className="assess-media-slot-label">Team brunch</span></div>
        <div className="assess-media-slot"><DotWaveBackground intensity={0.5} /></div>
        <div className="assess-media-slot"><DotWaveBackground intensity={0.5} /></div>
        <div className="assess-media-slot"><DotWaveBackground intensity={0.5} /></div>
      </div>
    </section>

    <section className="assess-closing">
      <DotWaveBackground intensity={1} />
      <div className="assess-closing-inner">
        <p className="eyebrow light">ROAD TO LA RÉUNION · SESSION 01</p>
        <h2>The work starts here.</h2>
        <p className="assess-closing-sub">One team.<br />One objective.<br />La Réunion.</p>
        <div className="assess-closing-stage">SESSION 01 / 04 · ASSESS ✓</div>
        <div className="assess-progression">
          {assessProgression.map((stage, index) => <span key={stage} className={`assess-progression-stage${index === 0 ? " is-active" : ""}`}><b>{String(index + 1).padStart(2, "0")}</b>{stage}{index === 0 && " ✓"}</span>)}
        </div>
      </div>
    </section>
  </>;
}

function DotWaveBackground({ intensity = 1 }: { intensity?: number }) {
  return <div className="dot-wave" style={{ opacity: intensity }} aria-hidden="true" />;
}

type MplAnswer = { speaker: string; text: string };
type MplQA = { question: string; answers: MplAnswer[]; sidebar?: { title: string; body: string } };
type MplSection = { id: string; title: string; qas: MplQA[] };

const mplRoles = [
  { name: "CHRISTIAN", title: "Vision & structure", copy: "Governance, the MSRA framework and national development." },
  { name: "PASCAL", title: "Clubs & competition", copy: "Player development, running the circuit and building a sporting culture." },
  { name: "MATHIEU", title: "Ground & operations", copy: "Founding member, Mauritius's number one in July 2026, and the backbone of tournament logistics." },
];

const mplStats: [string, string][] = [
  ["18", "Affiliated clubs"],
  ["65", "Courts in Mauritius"],
  ["252", "Events on the 2026 calendar"],
  ["1,825", "Registered licence holders"],
];

const mplSections: MplSection[] = [
  {
    id: "01",
    title: "The birth",
    qas: [
      {
        question: "Let's go back to 2023. How did the idea of creating the Mauritius Padel League come about?",
        answers: [{ speaker: "CHRISTIAN", text: "In 2023, padel was really starting to take off in Mauritius. There were a few clubs, plenty of enthusiasm, but everyone was still operating somewhat on their own. With Pascal, Mathieu and the founding team, we quickly agreed that if we wanted the sport to grow properly, we needed something bigger than any one club's interests: a shared calendar, shared categories, a ranking, and above all continuity. That's how the Mauritius Padel League was born. At the start, we obviously had no idea how far it would take us. We simply wanted to give structure to a sport that was being born." }],
      },
      {
        question: "At that point, what convinced you that padel in Mauritius needed a genuine national structure rather than just a series of tournaments organised independently by the clubs?",
        answers: [{ speaker: "PASCAL", text: "Because a series of tournaments doesn't build a sport. For a player to progress, they need to know where they stand, which tournaments they can play, how many points they earn and what their next objective is. It's the same for clubs: we needed a calendar where everyone found their place, and identical rules for everyone. That continuity is what turns players who show up to play padel now and then into a real sporting community." }],
      },
      {
        question: "The main clubs were also commercial operators, sometimes competitors. How did you manage to bring them together around a shared calendar, rules and ranking?",
        answers: [{ speaker: "CHRISTIAN", text: "I think the key was telling them, quite simply: commercially, you're competitors — but on the sporting side, we need each other. No single club could build a credible national championship alone. So we had to create neutral ground where everyone would accept the same rules. The calendar, the categories and the ranking belong to the ecosystem, not to any one club. Once the clubs understood that, the momentum built itself." }],
        sidebar: { title: "Turning the vision into reality", body: "I've been part of this adventure from the start. A vision only truly comes to life once the organisation on the ground follows through. My role has always been to make sure tournaments were prepared with method, that players knew where they were headed, and that teams could focus fully on competing." },
      },
    ],
  },
  {
    id: "02",
    title: "From 2023 to today",
    qas: [
      {
        question: "Why was it important for the Padel League's sporting development to happen under the umbrella of the Mauritius Squash & Rackets Association (MSRA)?",
        answers: [{ speaker: "CHRISTIAN", text: "Because from the start we wanted to build a sport, not just a commercial activity. On 26 July 2023, the MSRA formally brought padel under its wing and entrusted the MPL with organising tournaments under its supervision. The MSRA gave us an associative and sporting framework, but also the experience of a racket-sport federation: licences, competitions, rules, governance, national selection. And personally, coming from squash and already knowing that structure, it felt natural. We wanted padel to be able to grow very fast, without losing its sporting structure along the way." }],
      },
      {
        question: "Christian, you experienced racket sport as a squash player before moving to the organisational side. Did that experience help you imagine what the Padel League needed to become?",
        answers: [{ speaker: "CHRISTIAN", text: "Enormously. For more than fifteen years I've taken great pleasure in organising national and international squash tournaments across the island's clubs, under the MSRA. With the founding of RM Club, I also got into the habit of running our internal racket-sport competitions — squash, badminton and padel were really my thing. Meanwhile, Pascal was running the Urban Sport tournaments; Fabrice Péroux and Florian Manson ran Isla Padel's; Matteo Zinno and Hirad Tabibi ran Oxygen's. Everyone had built their own know-how. So we came together to turn these local experiences into a shared calendar, shared categories and a national ranking. Mathieu Vallet was also part of the adventure from the start, bringing his sporting and logistical rigour. More recently, he's also brought that experience to running Caña Club. It's the coming-together of all these complementary paths that gave the MPL its strength." }],
      },
      {
        question: "When you launched the project in 2023, did you think Mauritian padel would grow this fast?",
        answers: [{ speaker: "CHRISTIAN", text: "No. Definitely not at this speed. Between September and December 2023, we organised around ten tournaments across four clubs. In 2024, the circuit grew to 87 tournaments across seven clubs. In 2025, 134 tournaments were actually played. In 2026, the network counts 18 affiliated clubs and 65 courts. The official calendar lists 252 events and, as of 7 September, the platform's dashboard counted 1,825 registered licence holders. What impresses me most is that this growth in volume came with a genuine rise in the sporting level." }],
      },
      {
        question: "What makes you proudest today: the number of players, the clubs, the sporting level, the calendar, the partners, or having built a genuine community?",
        answers: [{ speaker: "CHRISTIAN", text: "If I had to choose, I'd say the community. Because the clubs, the calendar, the ranking, the partners and now Team Mauritius are ultimately consequences of that community. Today, someone can start padel at a club, enter the early categories, climb the ranking, play the biggest tournaments and potentially reach a Mauritian selection. In 2023, that path didn't exist. Today it does. For me, that's probably our greatest achievement." }],
      },
      {
        question: "Pascal, as a club operator and organiser, you see players' progress every day. What difference do you see between Mauritian padel in 2023 and in 2026?",
        answers: [{ speaker: "PASCAL", text: "It's huge. In 2023, a lot of players were still discovering the sport. Today, they talk tactics, positioning, choice of partner, ranking, physical preparation. We also see players planning their season around tournaments. And in the clubs, we feel it every day: people no longer just come to play a game with friends. A real padel culture has emerged." }],
      },
      {
        question: "At what point did you realise padel was no longer just a passing trend in Mauritius but was becoming a genuine competitive sport?",
        answers: [{ speaker: "PASCAL", text: "When players started organising their year around competitions. At the start, they'd ask: 'Is there a tournament this weekend?' Now they look several weeks or months ahead: 'What's the next M250? Where's the M500? How many points do I need to defend?' That's when you understand you're no longer dealing with a trend. You've created a competitive culture." }],
      },
      {
        question: "What was hardest to build over these three years: the competitions, the ranking, coordination between clubs, or the sporting culture around padel?",
        answers: [{ speaker: "PASCAL", text: "Probably finding the balance between growth and structure. Padel was growing so fast that the system constantly had to adapt: more players, more clubs, more categories and far more tournaments. And despite that growth, we had to keep things readable and fair. The ranking was essential because it gave the whole system a sporting logic. Today, the same platform connects registrations, results, the calendar and the ranking. As of 11 June 2026, it was tracking 497 events and 11,913 match results." }],
        sidebar: { title: "Mastering what happens behind the scenes", body: "Running a tournament means keeping control of a lot of moving parts at once: registrations, draws, schedules, courts, results, and every unexpected thing that comes up during competition. When it all works, that organisation becomes almost invisible. That's exactly the result we're after: giving players an experience that's clear, consistent and professional." },
      },
    ],
  },
  {
    id: "03",
    title: "From the Padel League to Team Mauritius",
    qas: [
      {
        question: "At what point did you move from the idea of developing a Mauritian circuit to that of building a genuine Team Mauritius?",
        answers: [{ speaker: "CHRISTIAN", text: "I don't think there was one specific day where we said: now we create Team Mauritius. It happened naturally. Once you have a calendar, a national ranking, players meeting each other all year and the level rising, the next question is inevitable: who are our best players today, and how can they represent Mauritius? Team Mauritius is really the consequence of what's been built since 2023." }],
      },
      {
        question: "Is it, in the end, the natural conclusion of the system put in place since 2023: tournaments → ranking → best players → national selection?",
        answers: [{ speaker: "PASCAL", text: "Exactly. And that's what gives value to everything before it. A ranking isn't just a list on a website. It has to open a door. Today that door can lead to Team Mauritius. And tomorrow, we want it to be able to lead further still." }],
      },
      {
        question: "What does it mean to you today to see players who've competed for several years in Mauritius Padel League events now wearing Mauritius's colours?",
        answers: [{ speaker: "CHRISTIAN", text: "That's probably where it all makes sense. Some of these players, we've watched in our tournaments for years. We've followed their wins, their losses, their progress. And now we see them training together under the same jersey to represent Mauritius. When you think back to the four clubs of 2023, there's naturally a lot of emotion in that." }],
        sidebar: { title: "A demand lived as a player", body: "As of 29 August 2025, I was co-leader of the MPL men's ranking with Amaury de Beer, both on 4,800 points. In July 2026, after the last qualifying stage at Terres Brunes, I'd held on to the status of Mauritian number one. That dual position — player and organiser — lets me understand what competitors need, while keeping a very concrete view of what needs improving, tournament after tournament." },
      },
      {
        question: "Does this selection represent only today's best players, or also the whole padel community built up around them?",
        answers: [{ speaker: "PASCAL", text: "No — obviously, on sporting merit, it's the best who should represent Mauritius. But behind them stand everyone who helped build the level they've reached: their partners, their opponents, the clubs, the coaches, the organisers, and the players they face every week. So when Team Mauritius steps onto the court, it represents far more than just the selected players." }],
      },
    ],
  },
  {
    id: "04",
    title: "The Island Padel Cup",
    qas: [
      {
        question: "Why create a competition between Mauritius, La Réunion and Madagascar rather than staying focused solely on a national circuit?",
        answers: [{ speaker: "CHRISTIAN", text: "The idea for the Island Padel Cup first came from Madagascar. Gary Ah-Waye and Sébastien Andriantsoa, of the Malagasy Pro Padel Tour, launched the project in 2024 with the ambition of building a genuine sporting bridge between the islands of the Indian Ocean. When they brought Madagascar, Mauritius and La Réunion together for the first edition in Soavina, we found ourselves instantly on the same wavelength. Our circuits were still young, but we all shared the same will: to help our players progress through a regular regional competition. Madagascar launched the idea, and each island then helped it grow — Madagascar in 2024, Mauritius in 2025, and now La Réunion in 2026." }],
      },
      {
        question: "What does the Island Padel Cup represent in your vision for padel's development across the Indian Ocean?",
        answers: [{ speaker: "PASCAL", text: "It's more than a tournament. The idea is to gradually build a shared story between our islands. The event's rotation — from Madagascar to Mauritius and now to La Réunion — gives each territory the chance to carry that story forward. The team format lets the best players defend their colours, while the Open tournament keeps an inclusive, friendly dimension. If a Mauritius-Réunion or a Mauritius-Madagascar fixture means something instantly to a padel player, then we'll have succeeded." }],
      },
      {
        question: "After Madagascar then Mauritius, Team Mauritius now heads to La Réunion. Is a genuine regional sporting story now taking shape?",
        answers: [{ speaker: "CHRISTIAN", text: "Yes — it already has its first chapters. In 2024, Madagascar won the men's title and La Réunion the women's. In 2025, La Réunion completed the double, in both the men's and women's events. A real sporting rivalry already exists. But it stays positive: on court, everyone wants to beat the other; once the match is over, we're all part of the same project — growing padel in our region. That combination of history, competition and friendship is what makes the Island Padel Cup special." }],
      },
      {
        question: "When you watch the team walk onto the court in the Mauritian jersey in La Réunion, what will that mean to each of you personally?",
        answers: [
          { speaker: "CHRISTIAN", text: "Personally, I think I'll have 2023 in mind. Between a handful of people around a table trying to put a calendar together, and a Mauritian team walking onto a court in La Réunion wearing the national jersey — an enormous amount has happened in just three years. I think it'll be a moment where we can simply look at the team and think: that's why we did all this." },
          { speaker: "PASCAL", text: "I'll probably be watching the players. Because we've known almost all of them since their earliest days in the League. Seeing them together under the same jersey, with a coach and a shared objective — that's something very powerful." },
        ],
        sidebar: { title: "Preparing to perform better", body: "For a competition like the Island Padel Cup, performance doesn't start on the match's first point. It starts in the preparation, and in the attention paid to every detail. The goal is for the team to arrive with a clear framework, solid organisation, and the freedom to focus entirely on their game." },
      },
    ],
  },
  {
    id: "05",
    title: "What's next",
    qas: [
      {
        question: "After three years spent structuring the competitions, what's the next step for Mauritian padel?",
        answers: [{ speaker: "CHRISTIAN", text: "For three years, we've mainly built the foundation. Now we need to build depth. That means more young players, more coaching, coaches, officials, inter-club competitions and an even more professional structure. The next chapter begins with the Interclub 2026-2027, running from September 2026 to November 2027. Clubs will move through divisions from D4 to D1, with promotion and relegation, around a regular Friday-night fixture. The next big project is also about producing players who've learned padel directly, from the start." }],
      },
      {
        question: "Is your ambition now to make Mauritius a reference for padel in the Indian Ocean, and gradually across the African region?",
        answers: [{ speaker: "PASCAL", text: "Yes, clearly. Mauritius is small, but that can also be an advantage — we can bring clubs and players together quickly around a shared system. Our ambition isn't to claim we're at the level of the great padel nations today. It's to build well enough that Mauritius becomes a credible reference in our region, then gradually beyond it." }],
      },
      {
        question: "Today, many of the best players come from tennis or squash. Is your next big challenge to bring through a 100% padel generation, trained from a young age?",
        answers: [{ speaker: "CHRISTIAN", text: "Absolutely. Today, many of our best players come from tennis or squash. That's completely normal for such a young discipline. The first structured junior tournament took place on 23 January 2025. As of 11 June 2026, 48 U15 players already appeared on the platform. But the true measure of our success will come when we see young players who started directly with a padel racket, who grew up with our junior categories, our ranking and our competitions. That generation will probably play a different padel from ours. And I especially hope they'll be better than we are!" }],
      },
      {
        question: "If we did this interview again in five years, where would you like to see Mauritian padel?",
        answers: [
          { speaker: "CHRISTIAN", text: "I'd like what we're building today to look small by comparison. I'd like to see junior academies, a real generation trained in padel, national teams in several categories, regular international competitions in Mauritius, and Mauritian players capable of getting results abroad. Among the paths worth building: an M2000 category, training pathways for coaches and referees, and eventually a junior team in every club. These are still working proposals. But above all, I'd like to find that same unity between clubs and that same passion among players." },
          { speaker: "PASCAL", text: "I'd like a child starting padel today to be able to think: one day, I want to play for Mauritius. If we manage to create that dream — and above all, the path to reach it — then the work done since 2023 will truly have been worth it." },
        ],
        sidebar: { title: "Raising the standard", body: "The next step is to keep raising the standard: smoother organisation, an even better player experience, and methods able to support the circuit's growth. We also need to pass this know-how on, so that the quality of competitions doesn't rest on one person, but becomes a genuine culture of organisation." },
      },
    ],
  },
];

export function MplStoryPage() {
  return <>
    <section className="mpl-story-hero">
      <DotWaveBackground intensity={0.7} />
      <div className="mpl-story-hero-inner">
        <p className="eyebrow light">MAURITIUS PADEL LEAGUE × MSRA</p>
        <h1>We go<br />beyond borders.</h1>
        <p className="mpl-story-hero-sub">22 questions. Two voices. One vision. With Mathieu Vallet.<br />An interview with Christian Bezandry &amp; Pascal Hoffmann on the story of the Mauritius Padel League — from four clubs in 2023 to Team Mauritius today.</p>
      </div>
    </section>

    <section className="key-numbers"><div className="key-numbers-grid">{mplStats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

    <section className="section mpl-story-roles-section">
      <p className="eyebrow">SECTION 00</p>
      <h2>Three complementary responsibilities</h2>
      <p className="intro-copy">Since the earliest days of the Mauritius Padel League, the adventure has rested on three complementary responsibilities: giving the project a direction, growing the competition, and guaranteeing its execution on the ground.</p>
      <div className="mpl-story-roles">
        {mplRoles.map(role => <div key={role.name}><small>{role.name}</small><h3>{role.title}</h3><p>{role.copy}</p></div>)}
      </div>
      <Reveal className="mpl-sidebar"><span className="mpl-sidebar-label">THE VIEW FROM MATHIEU</span><h4>The third pillar</h4><p>The article of 29 August 2025 names Mathieu Vallet among the seven founding members of the Mauritius Padel League, alongside Pascal Hoffmann, Christian Bezandry, Matteo Zinno, Fabrice Péroux, Florian Manson and Hirad Tabibi. He also appears as co-leader of the men's ranking with Amaury de Beer, both on 4,800 points. In July 2026, the Mauritian press confirmed he retained the status of national number one after the last qualifying stage for the Island Padel Cup. His role connects sporting performance to operational rigour — which is why he appears throughout this document at each stage of the journey.</p></Reveal>
      <Reveal className="mpl-founders-photo"><img src="https://jayjysalmqbvzpxhhiwm.supabase.co/storage/v1/object/public/media-public/story/mpl-founders.jpg" alt="The seven founding members of the Mauritius Padel League" /><span className="mpl-founders-caption">THE SEVEN FOUNDING MEMBERS · LEFT TO RIGHT: PASCAL HOFFMANN, MATHIEU VALLET, CHRISTIAN BEZANDRY, MATTEO ZINNO, FABRICE PÉROUX, FLORIAN MANSON &amp; HIRAD TABIBI</span></Reveal>
    </section>

    {mplSections.map(section => <section className="section mpl-story-section" key={section.id}>
      <p className="eyebrow">SECTION {section.id}</p>
      <h2>{section.title}</h2>
      <div className="mpl-qa-list">
        {section.qas.map((qa, index) => <div className="mpl-qa" key={index}>
          <p className="mpl-question">{qa.question}</p>
          {qa.answers.map(a => <blockquote className="mpl-answer" key={a.speaker}><span className="mpl-speaker">{a.speaker}</span><p>{a.text}</p></blockquote>)}
          {qa.sidebar && <Reveal className="mpl-sidebar"><span className="mpl-sidebar-label">THE VIEW FROM MATHIEU</span><h4>{qa.sidebar.title}</h4><p>{qa.sidebar.body}</p></Reveal>}
        </div>)}
      </div>
    </section>)}

    <section className="section mpl-story-final">
      <p className="eyebrow">CLOSING</p>
      <h2>The three final questions</h2>
      <div className="mpl-final-grid">
        <div><span className="mpl-speaker">CHRISTIAN</span><p className="mpl-question">If you had to sum up in one sentence what you've built since 2023?</p><blockquote>“We started from four clubs that wanted to work together, and three years later we have a community, an identity, and players who wear Mauritius's colours.”</blockquote></div>
        <div><span className="mpl-speaker">PASCAL</span><p className="mpl-question">At what moment do you think: all of this was worth it?</p><blockquote>“When I see players who were simply passionate beginners at the start of the League now fighting today for a place in Team Mauritius. That's when I know the system has created something.”</blockquote></div>
      </div>
      <div className="mpl-chorus">
        <p className="mpl-question">Together — The Mauritius Padel League started by organising tournaments. Today, it helps send a team to represent Mauritius. What's next?</p>
        <p><span className="mpl-speaker">CHRISTIAN</span> “In 2023, we built the League.”</p>
        <p><span className="mpl-speaker">PASCAL</span> “Then, we built the competition.”</p>
        <p><span className="mpl-speaker">CHRISTIAN</span> “Today, we're building Team Mauritius.”</p>
        <p><span className="mpl-speaker">MATHIEU</span> “And we keep raising our standards, tournament after tournament.”</p>
        <p><span className="mpl-speaker">PASCAL</span> “And now...”</p>
        <p className="mpl-chorus-line"><span className="mpl-speaker">TOGETHER</span> “We go beyond borders.”</p>
      </div>
    </section>

    <section className="mpl-story-closing">
      <DotWaveBackground intensity={1} />
      <div className="mpl-story-closing-inner">
        <h2>One island.<br />One team.<br /><span>One game.</span></h2>
        <p>Mauritius Padel League × MSRA</p>
      </div>
    </section>
  </>;
}

// Bespoke editorial treatment for one specific article (Adam Auckland's L'Express interview).
// Parses the real, already-published CMS body into question/answer pairs at render time —
// never a hardcoded copy — so future admin edits to the article stay reflected automatically.
function parseInterviewBody(body: string) {
  const paragraphs = body.split("\n\n").map(p => p.trim()).filter(Boolean);
  const intro: string[] = [];
  const qas: { question: string; answer: string[] }[] = [];
  let current: { question: string; answer: string[] } | null = null;
  for (const paragraph of paragraphs) {
    if (/^(Interview by|Originally published|Source\s*:)/i.test(paragraph)) continue;
    if (/\?(\s*\([^)]*\))?\s*$/.test(paragraph)) {
      if (current) qas.push(current);
      current = { question: paragraph, answer: [] };
      continue;
    }
    const clean = paragraph.replace(/^["“]|["”]$/g, "");
    if (current) current.answer.push(clean);
    else intro.push(clean);
  }
  if (current) qas.push(current);
  return { intro, qas };
}

const GOLD_TEAM_LISTENING = "https://jayjysalmqbvzpxhhiwm.supabase.co/storage/v1/object/public/media-public/sessions/06-sep-assess/team-listening.png";

function GoldShareRow() {
  const [copied, setCopied] = useState(false);
  const shareTo = (kind: "whatsapp" | "facebook") => {
    const url = window.location.href;
    if (kind === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(`${document.title} — ${url}`)}`, "_blank", "noreferrer");
    else window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noreferrer");
  };
  const copyLink = async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <div className="gold-share-row">
    <button onClick={() => shareTo("whatsapp")}><MessageCircle size={15} /> WhatsApp</button>
    <button onClick={() => shareTo("facebook")}><Share2 size={15} /> Facebook</button>
    <button onClick={copyLink}><Link2 size={15} /> {copied ? "Link copied" : "Copy link"}</button>
  </div>;
}

export function CoachGoldMissionArticle({ item, next }: { item: NewsItem; next: NewsItem }) {
  const { intro, qas } = parseInterviewBody(item.body ?? "");
  const heroQuote = item.title.match(/"([^"]+)"/)?.[1] ?? "We want to bring back gold.";
  const [mission, injury, assess, tactics, pairing, identity, ambition] = qas;
  return <>
    <CoachFeatureHero
      eyebrow={<>COACH FOCUS<br />ROAD TO LA RÉUNION 2026</>}
      headlineWhite="THE GOLD "
      headlineRed="MISSION"
      name="ADAM AUCKLAND"
      subtitle="ON BUILDING TEAM MAURITIUS"
      quote={heroQuote}
      signature={<>Better Players.<br />A Stronger Mauritius.</>}
      bgImage="/images/brand/island-padel-cup-red-wave.png"
      portraitSrc="/images/players/adam-auckland-cutout.png"
      portraitAlt="Adam Auckland, Head Coach, Team Mauritius"
    />

    <CoachInfoBar
      items={[
        { icon: <User size={16} />, label: "ROLE", value: "Head Coach" },
        { icon: <Target size={16} />, label: "MISSION", value: "La Réunion 2026" },
        { icon: <Trophy size={16} />, label: "TARGET", value: "Gold" },
        { icon: <Users size={16} />, label: "TEAM", value: "Mauritius" },
      ]}
      tagline={<>PADEL<br />BEYOND<br />BORDERS</>}
    />

    <section className="gold-intro">
      <div className="gold-intro-copy">
        <p className="eyebrow">THE STORY</p>
        <p className="gold-intro-lede">As Team Mauritius intensifies its preparation for the Island Padel Cup 2026, Head Coach Adam Auckland shares his vision, his philosophy and his belief in a team ready to go one step further — and bring back gold.</p>
        {intro.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <PhotoTreatment className="gold-intro-media" src={GOLD_TEAM_LISTENING} alt="Team Mauritius listening to Adam Auckland, first session" height="clamp(320px, 32vw, 460px)" focus="center 30%" />
    </section>

    <section className="gold-pullquote">
      <DotWaveBackground intensity={0.35} />
      <div className="gold-pullquote-inner">
        <EditorialQuote size="lg" attribution={<>ADAM AUCKLAND<br />HEAD COACH · TEAM MAURITIUS</>}>We want<br />to bring back gold.</EditorialQuote>
      </div>
    </section>

    {mission && injury && <Reveal><section className="section gold-chapter gold-chapter-media-right">
      <div className="gold-chapter-copy">
        <span className="gold-chapter-number">01</span>
        <p className="eyebrow">THE MISSION</p>
        <h2>{mission.question}</h2>
        {mission.answer.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <h3 className="gold-chapter-subquestion">{injury.question}</h3>
        {injury.answer.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <div className="gold-chapter-media"><img src="/images/players/adam-auckland.jpg" alt="Adam Auckland, Head Coach" /></div>
    </section></Reveal>}

    {assess && tactics && <Reveal><section className="section gold-chapter gold-chapter-media-left">
      <div className="gold-chapter-media"><img src="/images/sessions/first-day-team.jpg" alt="Team Mauritius, first day at Caña Club" /></div>
      <div className="gold-chapter-copy">
        <span className="gold-chapter-number">02</span>
        <p className="eyebrow">BUILDING TEAM MAURITIUS</p>
        <h2>{assess.question}</h2>
        {assess.answer.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <h3 className="gold-chapter-subquestion">{tactics.question}</h3>
        {tactics.answer.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </section></Reveal>}

    {pairing && <Reveal><section className="gold-statement">
      <DotField className="gold-statement-texture" density={90} dotSizeMin={1} dotSizeMax={2.5} opacity={0.1} color="#070708" />
      <div className="gold-statement-head">
        <span className="gold-chapter-number">03</span>
        <p className="eyebrow light">PREPARATION &amp; PAIRS</p>
        <h2>{pairing.question}</h2>
      </div>
      <div className="gold-statement-media">
        <img src="/images/sessions/first-day-mathieu-nicolas.jpg" alt="Team Mauritius players training in pairs" />
        <span className="gold-statement-caption">TEAM MAURITIUS TRAINING<br />PAIR PREPARATION &middot; ROAD TO LA R&Eacute;UNION 2026</span>
      </div>
      <div className="gold-statement-body">
        {pairing.answer.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </section></Reveal>}

    {identity && <Reveal><section className="section gold-chapter gold-chapter-media-right">
      <div className="gold-chapter-copy">
        <span className="gold-chapter-number">04</span>
        <p className="eyebrow">THE MAURITIUS IDENTITY</p>
        <h2>{identity.question}</h2>
        {identity.answer.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <div className="gold-keywords">{["COMMUNICATION", "PAIR CHEMISTRY", "DISCIPLINE", "TEAM SPIRIT", "PRESSURE", "BELIEF"].map(keyword => <span key={keyword}>{keyword}</span>)}</div>
      </div>
      <div className="gold-chapter-media"><img src="/images/brand/team-mauritius-identity.jpg" alt="Team Mauritius, one team huddle" /></div>
    </section></Reveal>}

    <Reveal><section className="gold-reunion">
      <div className="gold-reunion-media"><img src="/images/event-cover.png" alt="Island Padel Cup 2026" /></div>
      <div className="gold-reunion-copy">
        <span className="gold-chapter-number">05</span>
        <p className="eyebrow">LA RÉUNION 2026</p>
        <h2>A bigger<br />challenge.<br />A stronger<br />team.</h2>
        <p>Team Mauritius travels to La Réunion from 1 to 4 October 2026 for the Island Padel Cup — the next stage of the journey Adam Auckland is building towards.</p>
      </div>
    </section></Reveal>

    {ambition && <section className="gold-objective">
      <DotWaveBackground intensity={0.2} />
      <div className="gold-objective-inner">
        <span className="gold-chapter-number">06</span>
        <p className="eyebrow light">THE OBJECTIVE</p>
        <h2>Gold.<br />For<br /><span>Mauritius.</span></h2>
        <p className="gold-objective-question">{ambition.question}</p>
        {ambition.answer.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </section>}

    <Reveal><section className="gold-coach-profile">
      <DotField className="gold-coach-profile-texture" density={70} dotSizeMin={1} dotSizeMax={2} opacity={0.1} color="#ef3d32" />
      <div className="gold-coach-profile-media">
        <img src="/images/players/adam-auckland-hit.jpg" alt="Adam Auckland, Head Coach, Team Mauritius" />
        <span className="gold-coach-profile-vertical">TEAM MAURITIUS</span>
        <div className="gold-coach-profile-media-caption">
          <p>BETTER PLAYERS.<br />A STRONGER<br />MAURITIUS.</p>
          <span className="gold-coach-profile-rule" aria-hidden="true" />
        </div>
      </div>
      <div className="gold-coach-profile-content">
        <div className="gold-coach-profile-head">
          <h2>ADAM AUCKLAND</h2>
          <p className="gold-coach-profile-role">HEAD COACH &middot; TEAM MAURITIUS</p>
        </div>
        <div className="gold-coach-profile-credentials">
          <div>
            <span className="gold-coach-profile-num">01</span>
            <strong>BRITISH</strong>
            <p>Labourdonnais Sports Club</p>
          </div>
          <div>
            <span className="gold-coach-profile-num">02</span>
            <strong>FORMER PROFESSIONAL</strong>
            <p>Squash Player</p>
          </div>
          <div>
            <span className="gold-coach-profile-num">03</span>
            <strong>15+ YEARS</strong>
            <p>High-Performance Coaching Experience</p>
          </div>
        </div>
        <div className="gold-coach-profile-mission">
          <div className="gold-coach-profile-mission-copy">
            <p className="eyebrow">MISSION &middot; LA R&Eacute;UNION 2026</p>
            <blockquote>&ldquo;Build Better Players. Build A Stronger Team.&rdquo;</blockquote>
          </div>
          <div className="gold-coach-profile-tagline">
            <p>ONE TEAM.<br />ONE ISLAND.<br />ONE GOAL.</p>
            <span aria-hidden="true" />
          </div>
        </div>
      </div>
    </section></Reveal>

    <section className="section gold-footer">
      <div className="gold-share"><span className="eyebrow">SHARE STORY</span><GoldShareRow /></div>
      <div className="gold-nav">
        <Link className="text-link" to="/news">Back to Newsroom</Link>
        <Link className="text-link" to={`/news/${next.slug}`}>Next story <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  </>;
}
