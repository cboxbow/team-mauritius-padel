import type { ReactNode } from "react";

// The compact black info-strip pattern (role / mission / target / team, etc.) — reusable
// for any feature that needs a quick-glance fact row under a hero.

export type CoachInfoBarItem = { icon: ReactNode; label: string; value: string };

export type CoachInfoBarProps = {
  items: CoachInfoBarItem[];
  tagline?: ReactNode;
  className?: string;
};

export function CoachInfoBar({ items, tagline, className }: CoachInfoBarProps) {
  return (
    <section className={`brand-coach-info-bar${className ? ` ${className}` : ""}`}>
      {items.map(item => (
        <div key={item.label}>
          {item.icon}
          <div><span>{item.label}</span><strong>{item.value}</strong></div>
        </div>
      ))}
      {tagline && <div className="brand-coach-info-bar-tagline">{tagline}</div>}
    </section>
  );
}
