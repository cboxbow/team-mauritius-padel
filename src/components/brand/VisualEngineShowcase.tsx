import { DotWave, type DotWaveVariant } from "./DotWave";
import { DotField } from "./DotField";
import { RedGlow } from "./RedGlow";
import { MauritiusAccent } from "./MauritiusAccent";
import { EditorialFrame } from "./EditorialFrame";
import { HeroTreatment } from "./HeroTreatment";
import { PhotoTreatment } from "./PhotoTreatment";

// Internal, unlinked showcase for the Team Mauritius visual engine (/dev/visual-engine).
// Not part of public navigation — a reference page for every brand/* component and
// DotWave variant, so future pages reuse this system instead of hand-rolling new CSS.

const VARIANTS: DotWaveVariant[] = ["wave", "explosion", "flow", "corner", "horizon", "portrait", "hero", "goldMission", "subtle"];

export function VisualEngineShowcase() {
  return <>
    <section style={{ padding: "70px clamp(20px,8vw,110px) 30px", background: "var(--black)" }}>
      <p className="eyebrow">INTERNAL / NOT LINKED IN NAVIGATION</p>
      <h1 style={{ fontSize: "clamp(2.6rem,6vw,5rem)", textTransform: "uppercase" }}>Visual engine</h1>
      <p style={{ color: "var(--muted)", maxWidth: 640, lineHeight: 1.6 }}>Every reusable component in <code>src/components/brand/</code>, procedurally generated — no raster background image required.</p>
    </section>

    <p className="showcase-row-label eyebrow">DotWave — 9 variants</p>
    <div className="showcase-grid">
      {VARIANTS.map(variant => <div className="showcase-tile" key={variant}><DotWave variant={variant} intensity={0.9} /><span className="showcase-tile-label">{variant}</span></div>)}
    </div>

    <p className="showcase-row-label eyebrow">DotField — scattered texture</p>
    <div className="showcase-flat"><DotField density={160} opacity={0.6} /></div>

    <p className="showcase-row-label eyebrow">RedGlow — positional accents</p>
    <div className="showcase-grid">
      {(["center", "top-left", "top-right", "bottom-left", "bottom-right", "top", "bottom"] as const).map(position => <div className="showcase-tile" key={position}><RedGlow position={position} intensity={0.5} /><span className="showcase-tile-label">{position}</span></div>)}
    </div>

    <p className="showcase-row-label eyebrow">MauritiusAccent</p>
    <div className="showcase-swatch-row">
      <MauritiusAccent orientation="horizontal" size={40} />
      <MauritiusAccent orientation="vertical" size={40} />
    </div>

    <p className="showcase-row-label eyebrow">EditorialFrame — dark &amp; light tone</p>
    <EditorialFrame eyebrow="COACH FOCUS" title="Editorial frame, dark tone" copy="Eyebrow, heading and copy with an optional DotWave riding behind it — the pattern every PageIntro-style section on the site already follows, now reusable." dotVariant="subtle" dotIntensity={0.3} />
    <EditorialFrame eyebrow="THE STORY" title="Editorial frame, light tone" copy="The same primitive, light background — used for the off-white reading sections between dark hero/quote moments." tone="light" />

    <p className="showcase-row-label eyebrow">PhotoTreatment — real photograph, different grades</p>
    <div className="showcase-grid">
      <div className="showcase-tile"><PhotoTreatment src="/images/players/adam-auckland.jpg" alt="Adam Auckland, Head Coach" height="100%" grade="none" /><span className="showcase-tile-label">grade: none</span></div>
      <div className="showcase-tile"><PhotoTreatment src="/images/players/adam-auckland.jpg" alt="Adam Auckland, Head Coach" height="100%" grade="desaturate" /><span className="showcase-tile-label">grade: desaturate</span></div>
      <div className="showcase-tile"><PhotoTreatment src="/images/players/adam-auckland.jpg" alt="Adam Auckland, Head Coach" height="100%" grade="warm" /><span className="showcase-tile-label">grade: warm</span></div>
      <div className="showcase-tile"><PhotoTreatment src="/images/players/adam-auckland.jpg" alt="Adam Auckland, Head Coach" height="100%" grade="contrast" rimGlow caption="With rim glow" /><span className="showcase-tile-label">grade: contrast + rim glow</span></div>
    </div>

    <p className="showcase-row-label eyebrow">HeroTreatment — composition</p>
    <HeroTreatment
      eyebrow={<>COACH FOCUS<br />ROAD TO LA RÉUNION 2026</>}
      title={<>The gold<br />mission.</>}
      sub={<>ADAM AUCKLAND<br />ON BUILDING TEAM MAURITIUS</>}
      quote={<>“We want to bring back gold.”</>}
      dotVariant="hero"
      dotIntensity={0.6}
      media={<PhotoTreatment src="/images/players/adam-auckland.jpg" alt="Adam Auckland, Head Coach, Team Mauritius" height="100%" />}
    />
  </>;
}
