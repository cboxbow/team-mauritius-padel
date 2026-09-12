import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Flag, Target, Trophy, User, Users } from "lucide-react";
import type { NewsItem } from "../lib/data";
import { CoachFeatureHero, CoachInfoBar, DotWave, EditorialQuote, type CoachInfoBarItem } from "./brand";
import { Reveal } from "./platform-sections";

// Team Mauritius Player Story system — one reusable editorial architecture for every
// "Player Focus" feature.
//
// MASTER REFERENCE: Adam Auckland / "THE GOLD MISSION" (CoachFeatureHero + CoachInfoBar +
// the gold-chapter/gold-statement editorial body language, all in src/index.css). Every
// player story hero renders through the SAME CoachFeatureHero component Adam uses — same
// proportions, same dot-wave campaign artwork, same typography scale — so the whole series
// reads as one design system. Per-player config controls content only: copy, photo, facts.

export type PlayerStoryImageConfig = { src: string; alt: string; caption?: string; objectPosition?: string };
export type PlayerStoryChapterConfig = { label: string; title: ReactNode; paragraphs: string[]; media?: PlayerStoryImageConfig; mediaSide?: "left" | "right" };
export type PlayerKeyMomentConfig = { competition: string; result: string; partner?: string; context: string; image?: string; imageAlt?: string; imagePosition?: string };
export type PlayerStoryQuickFireItem = { label: string; answer: string };

export type PlayerStoryConfig = {
  slug: string;
  eyebrow: ReactNode;
  headlineWhite: ReactNode;
  headlineRed: ReactNode;
  playerName: string;
  subheadline: string;
  heroQuote: string;
  heroImage: string;
  heroImageAlt: string;
  heroObjectPosition?: string;
  snapshot: CoachInfoBarItem[];
  chapters: [PlayerStoryChapterConfig, PlayerStoryChapterConfig];
  pullQuote: string;
  keyMoment?: PlayerKeyMomentConfig;
  laterChapters?: PlayerStoryChapterConfig[];
  reunionTarget: { text: string; supportingText?: string };
  quickFire?: PlayerStoryQuickFireItem[];
  finalQuote?: string;
};

// The one campaign background every hero in the series shares — never regenerated per player.
const CAMPAIGN_DOT_WAVE_BG = "/images/brand/island-padel-cup-red-wave.png";

export function PlayerStoryHero({ story }: { story: PlayerStoryConfig }) {
  return (
    <CoachFeatureHero
      eyebrow={story.eyebrow}
      headlineWhite={story.headlineWhite}
      headlineRed={story.headlineRed}
      name={story.playerName}
      subtitle={story.subheadline}
      quote={story.heroQuote}
      bgImage={CAMPAIGN_DOT_WAVE_BG}
      portraitSrc={story.heroImage}
      portraitAlt={story.heroImageAlt}
      portraitFit="photo"
      portraitPosition={story.heroObjectPosition}
    />
  );
}

export function PlayerStorySnapshot({ items }: { items: CoachInfoBarItem[] }) {
  if (!items.length) return null;
  return <CoachInfoBar items={items} />;
}

export function PlayerStoryChapter({ chapter }: { chapter: PlayerStoryChapterConfig }) {
  const copy = (
    <div className="gold-chapter-copy">
      <span className="gold-chapter-number">{chapter.label}</span>
      <h2>{chapter.title}</h2>
      {chapter.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </div>
  );
  if (!chapter.media) return <Reveal><section className="section player-story-chapter-solo">{copy}</section></Reveal>;
  const media = <div className="gold-chapter-media"><img src={chapter.media.src} alt={chapter.media.alt} style={chapter.media.objectPosition ? { objectPosition: chapter.media.objectPosition } : undefined} /></div>;
  const mediaSide = chapter.mediaSide ?? "right";
  return (
    <Reveal><section className={`section gold-chapter ${mediaSide === "left" ? "gold-chapter-media-left" : "gold-chapter-media-right"}`}>
      {mediaSide === "left" && media}
      {copy}
      {mediaSide === "right" && media}
    </section></Reveal>
  );
}

export function PlayerStoryImage({ image }: { image: PlayerStoryImageConfig }) {
  return (
    <Reveal><section className="player-story-image-break">
      <img src={image.src} alt={image.alt} style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined} />
      {image.caption && <span className="player-story-image-caption">{image.caption}</span>}
    </section></Reveal>
  );
}

export function PlayerStoryQuote({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <Reveal><section className="player-story-quote-section">
      <DotWave variant="subtle" intensity={0.4} fade="both" />
      <div className="player-story-quote-inner">
        <EditorialQuote size="lg" attribution={attribution}>{quote}</EditorialQuote>
      </div>
    </section></Reveal>
  );
}

export function PlayerKeyMoment({ moment }: { moment: PlayerKeyMomentConfig }) {
  return (
    <Reveal><section className="section player-key-moment">
      <div className="player-key-moment-card">
        <p className="eyebrow">KEY MOMENT</p>
        <div className="player-key-moment-grid">
          <div><span>COMPETITION</span><strong>{moment.competition}</strong></div>
          <div><span>RESULT</span><strong>{moment.result}</strong></div>
          {moment.partner && <div><span>PARTNER</span><strong>{moment.partner}</strong></div>}
        </div>
        <p className="player-key-moment-context">{moment.context}</p>
      </div>
      {moment.image && <div className="player-key-moment-media"><img src={moment.image} alt={moment.imageAlt ?? ""} style={moment.imagePosition ? { objectPosition: moment.imagePosition } : undefined} /></div>}
    </section></Reveal>
  );
}

export function PlayerStoryQuickFire({ items }: { items: PlayerStoryQuickFireItem[] }) {
  if (!items.length) return null;
  return (
    <Reveal><section className="section player-quickfire">
      <p className="eyebrow">QUICK FIRE</p>
      <div className="player-quickfire-grid">
        {items.map(item => <div key={item.label}><span>{item.label}</span><strong>{item.answer}</strong></div>)}
      </div>
    </section></Reveal>
  );
}

export function RoadToReunionBlock({ target }: { target: { text: string; supportingText?: string } }) {
  return (
    <Reveal><section className="player-reunion">
      <img className="player-reunion-bg" src="/images/brand/mauritius-color-wave.jpg" alt="" aria-hidden="true" />
      <div className="player-reunion-inner">
        <span className="gold-chapter-number">ROAD TO</span>
        <h2>LA RÉUNION<br /><span className="is-red">2026</span></h2>
        <p>{target.text}</p>
        {target.supportingText && <p className="player-reunion-support">{target.supportingText}</p>}
      </div>
    </section></Reveal>
  );
}

export function NextPlayerStory({ next }: { next: NewsItem }) {
  return (
    <section className="section player-next-story">
      <p className="eyebrow">NEXT STORY</p>
      <Link className="player-next-story-card" to={`/news/${next.slug}`}>
        <div className="player-next-story-media"><img src={next.image} alt={next.title} style={next.imageFocus ? { objectPosition: next.imageFocus } : undefined} /></div>
        <div className="player-next-story-copy">
          <h3>{next.title}</h3>
          <span className="player-next-story-cta">Discover story <ArrowUpRight size={16} /></span>
        </div>
      </Link>
    </section>
  );
}

export function PlayerStoryArticle({ next, story }: { item: NewsItem; next: NewsItem; story: PlayerStoryConfig }) {
  const [chapterOne, chapterTwo] = story.chapters;
  return <>
    <PlayerStoryHero story={story} />
    <PlayerStorySnapshot items={story.snapshot} />
    <PlayerStoryChapter chapter={chapterOne} />
    <PlayerStoryChapter chapter={chapterTwo} />
    <PlayerStoryQuote quote={story.pullQuote} attribution={story.playerName.toUpperCase()} />
    {story.keyMoment && <PlayerKeyMoment moment={story.keyMoment} />}
    {story.laterChapters?.map((chapter, index) => <PlayerStoryChapter key={index} chapter={chapter} />)}
    <RoadToReunionBlock target={story.reunionTarget} />
    {story.quickFire && <PlayerStoryQuickFire items={story.quickFire} />}
    {story.finalQuote && <Reveal><section className="player-final-quote">
      <p>“{story.finalQuote}”</p>
      <span>{story.playerName.toUpperCase()}</span>
    </section></Reveal>}
    <NextPlayerStory next={next} />
    <section className="section player-story-footer-nav">
      <Link className="text-link" to="/news">Back to Newsroom</Link>
    </section>
  </>;
}

const lauraChapterOne: PlayerStoryChapterConfig = {
  label: "01",
  title: <>From tennis<br />to padel.</>,
  paragraphs: [
    "Laura Koenig discovered padel during lockdown, and what hooked her instantly was simple: with the glass walls, the ball never really stops being in play. That one detail was enough to pull her in.",
    "She came to the sport with a strong tennis background, and it gave her a real head start — the racket touch and the court reading transferred straight away, letting her progress faster than most. What she had to unlearn was almost everything around the shot itself: padel's shorter preparations and the constant movement around the glass are, in her words, \"totally different from tennis.\"",
  ],
  media: { src: "/images/players/laura-koenig.jpg", alt: "Laura Koenig, Team Mauritius, playing a low volley at the glass", objectPosition: "50% 18%" },
  mediaSide: "right",
};

const lauraChapterTwo: PlayerStoryChapterConfig = {
  label: "02",
  title: <>A game built<br />on attack.</>,
  paragraphs: [
    "She's watched Mauritian padel change fast since 2023. There are far more tournaments now, far more young players coming through, and a level that's climbed noticeably — she's especially struck by how quickly the younger boys are improving, to the point where they're now challenging the men's draw itself.",
    "On court, she's an attacking player who plays her best padel next to a partner who can calm her down while staying aggressive and consistent — a system she says she's naturally comfortable in. Asked what's improved most in her own game, she points to her defence and her targeting at the net, especially on the volley. What she's still chasing: her smashes, her attacking game, her defence, and — she adds — her mental game too. Under real pressure — a tie-break, a deciding point, a third set — her routine is simple: remind herself she's done it hundreds of times before, breathe, focus, and go.",
  ],
  media: { src: "/images/players/laura-koenig-action-3.jpg", alt: "Laura Koenig, Team Mauritius, jumping for an overhead smash", objectPosition: "50% 0%" },
  mediaSide: "left",
};

const lauraChapterThree: PlayerStoryChapterConfig = {
  label: "03",
  title: <>The road<br />ahead.</>,
  paragraphs: [
    "Heading into the preparation with Adam Auckland, what she wants most is tactical guidance and a real team spirit built together, across the men's and women's squads alike. She already knows who the toughest tests in La Réunion will be: Anna-Blue and Elisa, the two strongest players on the island — \"monstrous,\" in her words — with Madagascar's Prisca and her partner also expected to cause real problems. Her read on the tie is clear-eyed but confident: outside of those two Réunion stars, she rates the rest of the field as being roughly at Mauritius's level — which means belief, on both the women's and men's sides, is what will make the difference.",
  ],
  media: { src: "/images/players/laura-koenig-action-2.jpg", alt: "Laura Koenig, Team Mauritius, following through on a forehand", objectPosition: "50% 16%" },
  mediaSide: "right",
};

const lauraChapterFour: PlayerStoryChapterConfig = {
  label: "04",
  title: <>The next<br />generation.</>,
  paragraphs: [
    "She sees today's wave of Mauritian talent coming through tennis, squash and other racket sports as a completely normal stage for a discipline this young on the island. What excites her is the generation coming next — those who'll start directly with a padel racket rather than arriving from another sport. She expects them to bring sharper technique and a tactical mindset built specifically for padel, not inherited from tennis, backed by coaches, clubs and sponsors who are now genuinely investing in that pathway.",
    "Her advice to a young Mauritian dreaming of the national jersey one day: enjoy it first — it's still a game, and without enjoyment you get nowhere. Have a good attitude, listen to advice, work hard, and persevere, because it won't be pure pleasure every single day.",
  ],
  media: { src: "/images/players/laura-koenig-podium-1.jpg", alt: "Laura Koenig and Alice Danjoux celebrate an AfrAsia Bank Padel League title" },
  mediaSide: "left",
};

export const LAURA_KOENIG_STORY: PlayerStoryConfig = {
  slug: "laura-koenig-the-only-point",
  eyebrow: <>PLAYER FOCUS<br />ROAD TO LA RÉUNION 2026</>,
  headlineWhite: "THE ONLY",
  headlineRed: "POINT",
  playerName: "LAURA KOENIG",
  subheadline: "FROM MADAGASCAR 2025 TO LA RÉUNION 2026",
  heroQuote: "One point. One jersey. One new challenge.",
  heroImage: "/images/players/laura-koenig-alt.jpg",
  heroImageAlt: "Laura Koenig, Team Mauritius, reaching for an overhead smash",
  snapshot: [
    { icon: <User size={16} />, label: "PLAYER", value: "Laura Koenig" },
    { icon: <Flag size={16} />, label: "TEAM", value: "Mauritius" },
    { icon: <Trophy size={16} />, label: "RANK", value: "No. 3" },
    { icon: <Target size={16} />, label: "MISSION", value: "La Réunion 2026" },
    { icon: <Users size={16} />, label: "KEY MOMENT", value: "Island Padel Cup 2025" },
  ],
  chapters: [lauraChapterOne, lauraChapterTwo],
  pullQuote: "A point earned for the team belongs to everyone.",
  keyMoment: {
    competition: "Island Padel Cup 2025",
    result: "Mauritius's only point against Madagascar",
    partner: "Alice Danjoux",
    context: "Her favourite memories are mostly about titles — her M1000 wins stand out — but one moment sits above the rest: earning Mauritius's only point against Madagascar at the 2025 Island Padel Cup, and sharing the court with Anna-Blue Houareau and Mathieu Vallet along the way. That win against Madagascar, alongside Alice Danjoux, produced the only tears of joy she's ever shed on a padel court.",
    image: "/images/players/laura-koenig-podium.jpg",
    imageAlt: "Laura Koenig celebrating an AfrAsia Bank Padel League title on the podium",
    imagePosition: "50% 20%",
  },
  laterChapters: [lauraChapterThree, lauraChapterFour],
  reunionTarget: {
    text: "Her personal target for La Réunion is straightforward: enjoy herself, play good padel, and bring home a point — maybe two — for the team.",
    supportingText: "Her hope for Team Mauritius as a whole is bigger still: both the women's and men's teams reaching the final this year, and perhaps bringing the trophies back home.",
  },
  quickFire: [
    { label: "ATTACK / DEFENCE", answer: "Attack" },
    { label: "BAJADA / SMASH", answer: "Bajada" },
    { label: "DECISIVE POINT", answer: "Take the risk" },
    { label: "TOUGHEST TO FACE", answer: "The big smashers" },
    { label: "TEAM MAURITIUS", answer: "TogetherWeCan" },
    { label: "ISLAND PADEL CUP", answer: "Fun!" },
  ],
  finalQuote: "Representing Mauritius, for me, is... an honour — and I hope to make my team and the Mauritian padel community proud.",
};

const magalyChapterOne: PlayerStoryChapterConfig = {
  label: "01",
  title: <>A court built<br />from scratch.</>,
  paragraphs: [
    "Padel runs in the whole family for Magaly Schaffo. Married with two sons, aged 12 and 14, she says all four of them are passionate about the sport, spending most weekends on court together — and lately they've even started entering tournaments as a family. She jokes that it probably won't be long before her boys are too good to want to play with their parents anymore.",
    "Her path into padel started somewhere unexpected: business. In 2014, she and her husband bought Tennispro.fr, an online tennis equipment store, which they gradually expanded into other racket sports, padel included. Following a period of growth in 2018, they built a much larger facility for the company — and installed a padel court inside it. That court is where she first picked up a padel racket.",
  ],
  media: { src: "/images/players/magaly-schaffo-alt.jpg", alt: "Magaly Schaffo, Team Mauritius, playing a forehand under the lights", objectPosition: "50% 20%" },
  mediaSide: "right",
};

const magalyChapterTwo: PlayerStoryChapterConfig = {
  label: "02",
  title: <>From tennis<br />to attack.</>,
  paragraphs: [
    "Tennis had been her sport since the age of five, and she reached a best ranking of 2/6 in France at 21. But she felt she'd reached a plateau there, with little room left to progress. Padel offered the opposite: a new project to sink her teeth into, almost starting from zero, with a steep learning curve ahead. For a lifelong competitor, that was exactly the kind of challenge she needed.",
    "On court, she describes her main quality as refusing to ever give up — a trait she has carried since childhood. She's also a naturally offensive player, having always been an attacking presence in her tennis days, and that instinct has carried straight over to padel: she's more comfortable attacking than defending. She's right-handed but prefers to play the left side of the court, occasionally switching to the right in mixed doubles.",
  ],
  media: { src: "/images/players/magaly-schaffo.jpg", alt: "Magaly Schaffo, Team Mauritius, playing a backhand", objectPosition: "50% 18%" },
  mediaSide: "left",
};

const magalyChapterThree: PlayerStoryChapterConfig = {
  label: "03",
  title: <>Arriving in<br />Mauritius.</>,
  paragraphs: [
    "Her ideal partner, she says, would be someone who can defend the right side and still finish points at the net. What she actually found is almost the opposite: her partner isn't especially fond of defending behind the glass and plays a highly aggressive game on the right, regularly catching opponents off guard. The contrast, she admits, works surprisingly well — their games complement each other. She's clear-eyed about what she still needs to work on: her defensive play off the back glass, and her footwork, to gain speed and efficiency on the ball.",
    "Magaly and her family moved to Mauritius in August 2025. Getting to compete at the Island Cup — and wear the Mauritius colours — is a source of real pride for her, and she's grateful to the team for the trust placed in her to wear the jersey.",
  ],
  media: { src: "/images/players/magaly-schaffo-alt.jpg", alt: "Magaly Schaffo, Team Mauritius, playing a forehand under the lights", objectPosition: "50% 20%" },
  mediaSide: "right",
};

export const MAGALY_SCHAFFO_STORY: PlayerStoryConfig = {
  slug: "magaly-schaffo-tennispro-to-padel",
  eyebrow: <>PLAYER FOCUS<br />ROAD TO LA RÉUNION 2026</>,
  headlineWhite: "BUILT FOR",
  headlineRed: "THE GAME",
  playerName: "MAGALY SCHAFFO",
  subheadline: "FROM BUILDING A COURT TO REPRESENTING MAURITIUS",
  heroQuote: "A new project to sink her teeth into, almost starting from zero.",
  heroImage: "/images/players/magaly-schaffo.jpg",
  heroImageAlt: "Magaly Schaffo, Team Mauritius, playing a backhand",
  heroObjectPosition: "center 15%",
  snapshot: [
    { icon: <User size={16} />, label: "PLAYER", value: "Magaly Schaffo" },
    { icon: <Flag size={16} />, label: "TEAM", value: "Mauritius" },
    { icon: <Trophy size={16} />, label: "RANK", value: "No. 1" },
    { icon: <Target size={16} />, label: "MISSION", value: "La Réunion 2026" },
  ],
  chapters: [magalyChapterOne, magalyChapterTwo],
  pullQuote: "Their games complement each other.",
  laterChapters: [magalyChapterThree],
  reunionTarget: {
    text: "She isn't chasing a personal target for this event — for her, the goal is entirely collective: staying united as a group and giving everything to bring the Island Cup home together.",
    supportingText: "She expects AnnaBlue and Elisa to be the toughest test of the tie — but that's exactly the kind of challenge that makes competing worthwhile. On her side, one thing is certain: she'll give her best on every single point, all the way to the last ball.",
  },
};

const kateChapterOne: PlayerStoryChapterConfig = {
  label: "01",
  title: <>Two sports,<br />one fire.</>,
  paragraphs: [
    "Before padel, Kate Foo Kune's sporting life was already full. Badminton took up a huge part of her life — she started very young and had the chance to represent Mauritius at the highest level, including at the Olympic Games, and won several African titles. It was a life of training, travel, competition and plenty of sacrifice, but also extraordinary moments. High-level sport shaped her enormously, both as an athlete and as a person.",
    "She discovered padel quite naturally after her badminton career. What appealed to her immediately was the social side of the sport — you can be competitive, but also take real pleasure in playing with the people around you. Very quickly, she rediscovered sensations she loved in badminton: reflexes, movement, anticipation, and above all the need to stay involved in every point.",
  ],
  media: { src: "/images/players/kate-foo-kune-alt.jpg", alt: "Kate Foo Kune, Team Mauritius, close-up on court with her Olympic rings tattoo visible", objectPosition: "50% 18%" },
  mediaSide: "right",
};

const kateChapterTwo: PlayerStoryChapterConfig = {
  label: "02",
  title: <>The fire<br />returns.</>,
  paragraphs: [
    "The shift from playing for pleasure to wanting competition again came gradually. At first she played purely for enjoyment, but after so many years in high-level sport, competition never really leaves you. At some point she started asking herself: what if I really tried to see how far I could go in padel? That desire only grew.",
    "She hadn't necessarily expected to feel that same adrenaline again in another sport — she thought that chapter of her life was behind her. But she's realised that the drive to compete never fully disappears; it just takes another form.",
  ],
  media: { src: "/images/players/kate-foo-kune.jpg", alt: "Kate Foo Kune, Team Mauritius, playing a forehand volley", objectPosition: "50% 12%" },
  mediaSide: "left",
};

const kateChapterThree: PlayerStoryChapterConfig = {
  label: "03",
  title: <>What transfers,<br />what doesn't.</>,
  paragraphs: [
    "Badminton still brings a lot to her padel today: reflexes, explosiveness, changes of direction, reading trajectories, and the ability to react quickly. Badminton also taught her to watch her opponent closely and anticipate what's coming before the shot is even played — plus the mental side: staying focused, managing key moments, and accepting that a point or a match can turn very quickly.",
    "What she's had to adjust, on the other hand, is patience. In badminton, you often look to create an opening quickly and finish the point; in padel, you sometimes have to accept building the point, defending, playing extra shots and waiting for the right moment. It's probably the adjustment that's demanded the most from her.",
    "Her tennis and badminton backgrounds complement each other too: tennis brings construction of the point, consistency and power; badminton brings more speed, reflexes and explosiveness — qualities that combine well on a padel court.",
  ],
  media: { src: "/images/players/kate-foo-kune-alt.jpg", alt: "Kate Foo Kune, Team Mauritius, close-up on court with her Olympic rings tattoo visible", objectPosition: "50% 18%" },
  mediaSide: "right",
};

const kateChapterFour: PlayerStoryChapterConfig = {
  label: "04",
  title: <>Representing<br />Mauritius, again.</>,
  paragraphs: [
    "Her relationship with winning and losing has changed since her high-level days. As a young athlete, a defeat could feel enormous; with experience, she's learned to step back, analyse what didn't work, and move on quickly — without wanting to win any less. She simply manages the emotions around victory and defeat better now.",
    "Representing Mauritius again means something special to her. Having already had the chance to represent the country in another sport, she thought she knew that feeling — but wearing the country's colours again, in a different sport, gives her a particular sensation. It's also a chance to show that athletes can reinvent themselves and keep representing their country in a different way.",
  ],
  media: { src: "/images/players/kate-foo-kune.jpg", alt: "Kate Foo Kune, Team Mauritius, playing a forehand volley", objectPosition: "50% 12%" },
  mediaSide: "left",
};

export const KATE_FOO_KUNE_STORY: PlayerStoryConfig = {
  slug: "kate-foo-kune-badminton-to-padel",
  eyebrow: <>PLAYER FOCUS<br />ROAD TO LA RÉUNION 2026</>,
  headlineWhite: "THE FIRE",
  headlineRed: "NEVER LEFT",
  playerName: "KATE FOO KUNE",
  subheadline: "FROM OLYMPIC BADMINTON TO TEAM MAURITIUS",
  heroQuote: "A new court. The same competitive fire.",
  heroImage: "/images/players/kate-foo-kune.jpg",
  heroImageAlt: "Kate Foo Kune, Team Mauritius, playing a forehand volley",
  heroObjectPosition: "center 15%",
  snapshot: [
    { icon: <User size={16} />, label: "PLAYER", value: "Kate Foo Kune" },
    { icon: <Flag size={16} />, label: "TEAM", value: "Mauritius" },
    { icon: <Trophy size={16} />, label: "RANK", value: "No. 7" },
    { icon: <Target size={16} />, label: "MISSION", value: "La Réunion 2026" },
    { icon: <Users size={16} />, label: "KEY MOMENT", value: "M500 Terres Brunes 2026" },
  ],
  chapters: [kateChapterOne, kateChapterTwo],
  pullQuote: "That feeling of “I can still improve” is deeply motivating.",
  keyMoment: {
    competition: "M500, Terres Brunes Sports & Leisure",
    result: "Champion",
    partner: "Marine Giraud",
    context: "She recently won the M500 at Terres Brunes with her partner — she puts it down to complementarity and trust. Different personalities and styles, but they understand each other well on court, communicate a lot, support each other through tough moments, and genuinely trust one another. A good pair, she says, isn't necessarily two players who play exactly the same way — it's two people who turn their differences into a strength.",
  },
  laterChapters: [kateChapterThree, kateChapterFour],
  reunionTarget: {
    text: "Going into the Island Padel Cup in La Réunion, the ambition is clear: to be competitive and go as far as possible, but above all to enjoy the experience, represent Mauritius as well as possible, and show they belong in the competition.",
    supportingText: "She's no longer playing to prove something to others; she plays because she still deeply loves competition, and wants to see how far she can go.",
  },
};

const marineChapterOne: PlayerStoryChapterConfig = {
  label: "01",
  title: <>From the<br />WTA tour.</>,
  paragraphs: [
    "Before padel, Marine Giraud's sporting life was already a full one. She started tennis young and moved quickly into competition, spending years on the junior and then professional circuit, reaching a best world ranking of 233 on the WTA tour. She travelled extensively, competed internationally, and represented Mauritius along the way — tennis, in her words, built her enormously, both as an athlete and as a person.",
    "She discovered padel around two years ago, pushed onto the court by her older sister. At first it was pure curiosity, no ambition attached — and what hooked her immediately was how playful, social and easy-going the sport felt. After years of living tennis at high intensity, she rediscovered the simple pleasure of playing without pressure. Predictably, though, her competitive streak didn't stay dormant for long.",
  ],
  media: { src: "/images/players/marine-giraud-alt.jpg", alt: "Marine Giraud, Team Mauritius, playing a forehand at the net", objectPosition: "50% 18%" },
  mediaSide: "right",
};

const marineChapterTwo: PlayerStoryChapterConfig = {
  label: "02",
  title: <>The turning<br />point.</>,
  paragraphs: [
    "The real turning point came watching last year's Island Padel Cup at Urban Rivière Noire. Seeing the matches and the Mauritian team compete, she remembers thinking: “Next year, I want to be part of this.” That's the moment her whole approach to padel shifted, and the pull of competition came back.",
    "She hadn't expected to feel that adrenaline again in another sport. When she stopped playing professional tennis, she assumed that chapter was closed. What's struck her about padel is finding that same hunger to win in a completely different setting — one that today carries a lot more lightness and enjoyment around the competition itself.",
  ],
  media: { src: "/images/players/marine-giraud.jpg", alt: "Marine Giraud, Team Mauritius, stretching for a backhand at the glass", objectPosition: "50% 18%" },
  mediaSide: "left",
};

const marineChapterThree: PlayerStoryChapterConfig = {
  label: "03",
  title: <>What transfers,<br />what doesn't.</>,
  paragraphs: [
    "Tennis still shows up everywhere in her padel: trajectory reading, reflexes, the volley, forward movement, and the mental side of the game. Having played so many matches also helps her manage pressure and big moments. But she's careful not to overstate the overlap — padel is a different sport, and not everything from tennis transfers cleanly.",
  ],
  media: { src: "/images/players/marine-giraud-alt.jpg", alt: "Marine Giraud, Team Mauritius, playing a forehand at the net", objectPosition: "50% 18%" },
  mediaSide: "right",
};

const marineChapterFour: PlayerStoryChapterConfig = {
  label: "04",
  title: <>Tennis,<br />looking back.</>,
  paragraphs: [
    "Asked how far tennis actually took her: a best ranking of 233 in the world, several years on the professional circuit. But looking back, she doesn't hold onto the ranking or a single result — she holds onto the whole journey: the travel, the tournaments, the people, the hard moments too, and the chance to represent Mauritius. When you're living it, she says, you don't always realise how lucky you are to have it.",
  ],
  media: { src: "/images/players/marine-giraud-podium.jpg", alt: "Marine Giraud and Magaly Schaffo celebrate an AfrAsia Bank Padel League title", objectPosition: "50% 20%" },
  mediaSide: "left",
};

export const MARINE_GIRAUD_STORY: PlayerStoryConfig = {
  slug: "marine-giraud-wta-to-padel",
  eyebrow: <>PLAYER FOCUS<br />ROAD TO LA RÉUNION 2026</>,
  headlineWhite: "A SECOND",
  headlineRed: "LIFE",
  playerName: "MARINE GIRAUD",
  subheadline: "FROM WORLD NO. 233 ON THE WTA TOUR TO TEAM MAURITIUS",
  heroQuote: "Next year, I want to be part of this.",
  heroImage: "/images/players/marine-giraud.jpg",
  heroImageAlt: "Marine Giraud, Team Mauritius, stretching for a backhand at the glass",
  heroObjectPosition: "center 18%",
  snapshot: [
    { icon: <User size={16} />, label: "PLAYER", value: "Marine Giraud" },
    { icon: <Flag size={16} />, label: "TEAM", value: "Mauritius" },
    { icon: <Trophy size={16} />, label: "RANK", value: "No. 2" },
    { icon: <Target size={16} />, label: "MISSION", value: "La Réunion 2026" },
    { icon: <Users size={16} />, label: "KEY MOMENT", value: "M500 Terres Brunes 2026" },
  ],
  chapters: [marineChapterOne, marineChapterTwo],
  pullQuote: "Defend, let the ball go, use the glass, be patient.",
  keyMoment: {
    competition: "M500, Terres Brunes Sports & Leisure",
    result: "Champion",
    partner: "Kate Foo Kune",
    context: "Her regular partner is Magaly Schaffo — they've played together since December and have already built real chemistry on court. For the M500 at Terres Brunes specifically, Magaly wasn't in Mauritius, so Marine partnered Kate Foo Kune instead, and the pairing won the tournament. What Magaly has that Marine doesn't, in her own words, is raw power — particularly incisive overhead shots that can decide a point outright.",
  },
  laterChapters: [marineChapterThree, marineChapterFour],
  reunionTarget: {
    text: "Heading to La Réunion for the Island Padel Cup, her ambition is both personal and collective: play her best padel and bring the team as many points as possible, while the real goal stays shared — perform well together and get the best possible result for Mauritius.",
    supportingText: "She still wants to win every time she walks onto the court — that part, she says, will never change — while enjoying a first international padel experience.",
  },
};
