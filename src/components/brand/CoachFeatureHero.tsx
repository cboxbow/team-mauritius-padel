import type { ReactNode } from "react";
import { DotWave, type DotWaveFade, type DotWaveVariant } from "./DotWave";

// A cinematic, campaign-poster-style hero for a coach/player feature: massive two-tone
// headline over a red wave background. Background is either the procedural DotWave engine
// (bgImage omitted) or the official "Island Padel Cup design RED" campaign artwork
// (bgImage supplied) — both render behind the same copy layout. Portrait is optional — when
// omitted, the wave itself is the full visual; when supplied, it bleeds into the black
// background (no card, no border) rather than sitting in a boxed image slot.
//
// This is the MASTER hero template for every Player Focus / Coach Focus feature — Adam
// Auckland's "THE GOLD MISSION" page is its reference implementation. Every other player
// story reuses this exact component so the whole series shares one hero architecture.
//
// portraitFit: "cutout" (default) expects a pre-isolated subject (real alpha, e.g. a
// background-removed photo) and renders it with a grounding drop-shadow — this is Adam's
// exact, unchanged treatment. "photo" is for an ordinary rectangular photograph: it blends
// into the black background via edge masking (left + top/bottom fade) instead of a shadow,
// so there is never a visible photo-card boundary.

export type CoachFeatureHeroProps = {
  eyebrow: ReactNode;
  headlineWhite: ReactNode;
  headlineRed: ReactNode;
  name: ReactNode;
  subtitle: ReactNode;
  quote: ReactNode;
  signature?: ReactNode;
  portraitSrc?: string;
  portraitAlt?: string;
  portraitFit?: "cutout" | "photo";
  portraitPosition?: string;
  bgImage?: string;
  dotVariant?: DotWaveVariant;
  dotIntensity?: number;
  dotFade?: DotWaveFade;
  className?: string;
};

export function CoachFeatureHero({
  eyebrow, headlineWhite, headlineRed, name, subtitle, quote, signature,
  portraitSrc, portraitAlt, portraitFit = "cutout", portraitPosition,
  bgImage,
  dotVariant = "goldMission", dotIntensity = 0.95, dotFade = "start",
  className,
}: CoachFeatureHeroProps) {
  return (
    <section className={`brand-coach-hero${portraitSrc ? "" : " no-portrait"}${className ? ` ${className}` : ""}`}>
      {bgImage ? (
        <img className="brand-coach-hero-bg" src={bgImage} alt="" aria-hidden="true" />
      ) : (
        <DotWave variant={dotVariant} intensity={dotIntensity} fade={dotFade} />
      )}
      {portraitSrc && (
        <div className={`brand-coach-hero-portrait${portraitFit === "photo" ? " is-photo" : ""}`}>
          <img src={portraitSrc} alt={portraitAlt} style={portraitPosition ? { objectPosition: portraitPosition } : undefined} />
        </div>
      )}
      {signature && <span className="brand-coach-hero-signature">{signature}</span>}
      <div className="brand-coach-hero-inner">
        <div className="brand-coach-hero-copy">
          <p className="eyebrow light">{eyebrow}</p>
          <h1><span className="is-white">{headlineWhite}</span><span className="is-red">{headlineRed}</span></h1>
          <p className="brand-coach-hero-name">{name}</p>
          <p className="brand-coach-hero-subtitle">{subtitle}</p>
          <p className="brand-coach-hero-quote">“{quote}”</p>
          <span className="brand-coach-hero-rule" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
