import type { ReactNode } from "react";
import { DotWave, type DotWaveVariant } from "./DotWave";

// Consolidates the hero-section pattern hand-built three times this project
// (MplStoryPage's .mpl-story-hero, CoachGoldMissionArticle's .gold-hero, and the
// Assess journal's objectives hero) into one reusable, parametrised component.

export type HeroTreatmentProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  sub?: ReactNode;
  quote?: ReactNode;
  media?: ReactNode;
  dotVariant?: DotWaveVariant;
  dotIntensity?: number;
  className?: string;
};

export function HeroTreatment({ eyebrow, title, sub, quote, media, dotVariant = "hero", dotIntensity = 0.65, className }: HeroTreatmentProps) {
  return (
    <section className={`brand-hero-treatment${className ? ` ${className}` : ""}`}>
      <DotWave variant={dotVariant} intensity={dotIntensity} />
      <div className="brand-hero-treatment-inner">
        <div className="brand-hero-treatment-copy">
          {eyebrow && <p className="eyebrow light">{eyebrow}</p>}
          {title && <h1>{title}</h1>}
          {sub && <p className="brand-hero-treatment-sub">{sub}</p>}
          {quote && <blockquote className="brand-hero-treatment-quote">{quote}</blockquote>}
        </div>
        {media && <div className="brand-hero-treatment-media">{media}</div>}
      </div>
    </section>
  );
}
