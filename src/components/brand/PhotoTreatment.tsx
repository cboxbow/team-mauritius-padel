import type { ReactNode } from "react";
import { RedGlow } from "./RedGlow";

// The dark-gradient-vignette treatment repeated ad hoc across every bespoke page this
// project has built (.detail-image, .coach-page-media, .gold-hero-media, .gold-chapter-media…)
// consolidated into one component. Never alters the documentary photograph itself — only
// how it's framed, graded and composed on the page.

export type PhotoTreatmentGrade = "none" | "desaturate" | "warm" | "contrast";

export type PhotoTreatmentProps = {
  src: string;
  alt: string;
  height?: number | string;
  aspectRatio?: string;
  focus?: string;
  grade?: PhotoTreatmentGrade;
  rimGlow?: boolean;
  vignette?: boolean;
  noGradient?: boolean;
  caption?: ReactNode;
  className?: string;
};

export function PhotoTreatment({ src, alt, height, aspectRatio, focus = "center 20%", grade = "none", rimGlow = false, vignette = false, noGradient = false, caption, className }: PhotoTreatmentProps) {
  return (
    <div className={`brand-photo-treatment grade-${grade}${noGradient ? " no-gradient" : ""}${vignette ? " has-vignette" : ""}${className ? ` ${className}` : ""}`} style={{ height: height ?? (aspectRatio ? undefined : 480), aspectRatio }}>
      <img src={src} alt={alt} style={{ objectPosition: focus }} />
      {rimGlow && <RedGlow position="center" size={140} intensity={0.28} className="brand-photo-rim" />}
      {caption && <span className="brand-photo-caption">{caption}</span>}
    </div>
  );
}
