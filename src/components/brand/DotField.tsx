import { useMemo } from "react";

// A scattered, non-directional dot texture — unlike DotWave it carries no "flow" narrative,
// so it reads as a quiet backdrop texture rather than an energy graphic (stat grids, footers,
// dark panels behind body copy).

export type DotFieldProps = {
  density?: number;
  dotSizeMin?: number;
  dotSizeMax?: number;
  opacity?: number;
  color?: string;
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
};

function mulberry32(seed: number) {
  let a = seed | 0;
  return function random() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function DotField({ density = 120, dotSizeMin = 0.6, dotSizeMax = 2.6, opacity = 0.5, color = "var(--red)", seed = 3, className, style }: DotFieldProps) {
  const dots = useMemo(() => {
    const random = mulberry32(seed);
    return Array.from({ length: density }, () => ({
      x: random() * 1000,
      y: random() * 1000,
      r: dotSizeMin + random() * (dotSizeMax - dotSizeMin),
      o: 0.3 + random() * 0.7,
    }));
  }, [density, dotSizeMin, dotSizeMax, seed]);

  return (
    <div className={`brand-dot-field${className ? ` ${className}` : ""}`} style={{ opacity, ...style }} aria-hidden="true">
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" width="100%" height="100%">
        {dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} fill={color} opacity={dot.o} />)}
      </svg>
    </div>
  );
}
