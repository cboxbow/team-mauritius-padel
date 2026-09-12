// A pure CSS radial-glow accent — the "rim lighting" effect used ad hoc on earlier
// bespoke pages (e.g. the Coach Gold Mission hero image), now a reusable primitive.

export type RedGlowPosition = "center" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type RedGlowProps = {
  position?: RedGlowPosition;
  size?: number;
  intensity?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

const POSITIONS: Record<RedGlowPosition, string> = {
  center: "50% 50%",
  top: "50% 0%",
  bottom: "50% 100%",
  "top-left": "0% 0%",
  "top-right": "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right": "100% 100%",
};

export function RedGlow({ position = "center", size = 60, intensity = 0.35, color = "239,61,50", className, style }: RedGlowProps) {
  return (
    <div
      className={`brand-red-glow${className ? ` ${className}` : ""}`}
      style={{ background: `radial-gradient(${size}% ${size}% at ${POSITIONS[position]}, rgba(${color}, ${intensity}), transparent 70%)`, ...style }}
      aria-hidden="true"
    />
  );
}
