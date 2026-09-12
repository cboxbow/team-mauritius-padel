import type { ReactNode } from "react";
import { DotWave, type DotWaveVariant } from "./DotWave";

// Generalises the eyebrow + oversized heading + copy pattern used everywhere on the site
// (PageIntro, SectionHead and every bespoke page's own hand-rolled version of the same idea)
// into one reusable frame, optionally with a DotWave riding behind it.

export type EditorialFrameProps = {
  eyebrow?: string;
  title?: ReactNode;
  copy?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  dotVariant?: DotWaveVariant;
  dotIntensity?: number;
  children?: ReactNode;
  className?: string;
};

export function EditorialFrame({ eyebrow, title, copy, tone = "dark", align = "left", dotVariant, dotIntensity = 0.4, children, className }: EditorialFrameProps) {
  return (
    <div className={`brand-editorial-frame tone-${tone} align-${align}${className ? ` ${className}` : ""}`}>
      {dotVariant && <DotWave variant={dotVariant} intensity={dotIntensity} />}
      <div className="brand-editorial-frame-inner">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2>{title}</h2>}
        {copy && <p className="brand-editorial-frame-copy">{copy}</p>}
        {children}
      </div>
    </div>
  );
}
