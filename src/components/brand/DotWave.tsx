import { useId, useMemo } from "react";

// Procedural, vector-based recreation of the Team Mauritius red dot-wave — the site's
// signature graphic — so pages are never blocked on a static /images/dot-wave-red.png.
// Dots are sampled ALONG a curved bezier "band" (not scattered-then-filtered), which is
// what gives a true flowing-surface look instead of a sparse particle field: density,
// size and glow all progress along the band's length and taper across its width.
// A seeded PRNG keeps output stable across renders without needing to store generated pixels.

export type DotWaveVariant = "wave" | "explosion" | "flow" | "corner" | "horizon" | "portrait" | "hero" | "subtle" | "goldMission";
export type DotWaveFade = "start" | "end" | "both" | "none";

export type DotWaveProps = {
  variant?: DotWaveVariant;
  density?: number;
  direction?: number;
  curvature?: number;
  amplitude?: number;
  dotSizeMin?: number;
  dotSizeMax?: number;
  perspective?: number;
  fade?: DotWaveFade;
  glow?: boolean | number;
  opacity?: number;
  rotation?: number;
  intensity?: number;
  color?: string;
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
};

type Vec = { x: number; y: number };
type Dot = { x: number; y: number; r: number; o: number };
type Band = { p0: Vec; p1: Vec; p2: Vec; p3: Vec; widthStart: number; widthEnd: number; densityBias: number; reverse?: boolean };

function mulberry32(seed: number) {
  let a = seed | 0;
  return function random() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE = 1000;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const v = (x: number, y: number): Vec => ({ x: x * SIZE, y: y * SIZE });

function bezierPoint(band: Band, t: number): Vec {
  const mt = 1 - t;
  const a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t;
  return {
    x: a * band.p0.x + b * band.p1.x + c * band.p2.x + d * band.p3.x,
    y: a * band.p0.y + b * band.p1.y + c * band.p2.y + d * band.p3.y,
  };
}

function bezierTangent(band: Band, t: number): number {
  const mt = 1 - t;
  const dx = 3 * mt * mt * (band.p1.x - band.p0.x) + 6 * mt * t * (band.p2.x - band.p1.x) + 3 * t * t * (band.p3.x - band.p2.x);
  const dy = 3 * mt * mt * (band.p1.y - band.p0.y) + 6 * mt * t * (band.p2.y - band.p1.y) + 3 * t * t * (band.p3.y - band.p2.y);
  return Math.atan2(dy, dx);
}

function rotatePoint(p: Vec, deg: number): Vec {
  if (!deg) return p;
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  const dx = p.x - SIZE / 2, dy = p.y - SIZE / 2;
  return { x: SIZE / 2 + dx * cos - dy * sin, y: SIZE / 2 + dx * sin + dy * cos };
}

function bandsFor(variant: DotWaveVariant, curvature: number, amplitude: number): Band[] {
  const widthScale = 0.6 + amplitude * 0.9;
  switch (variant) {
    case "goldMission":
      return [
        { p0: v(0.02, 0.95), p1: v(0.28, 0.58 + 0.25 * curvature), p2: v(0.56, 0.44 - 0.1 * curvature), p3: v(0.86, 0.3), widthStart: 34 * widthScale, widthEnd: 260 * widthScale, densityBias: 2 },
        { p0: v(0.98, 1.05), p1: v(0.9, 0.68), p2: v(0.86, 0.32), p3: v(0.8, -0.05), widthStart: 210 * widthScale, widthEnd: 130 * widthScale, densityBias: 1 },
      ];
    case "hero":
      return [{ p0: v(0.02, 0.95), p1: v(0.3, 0.55 + 0.25 * curvature), p2: v(0.6, 0.45 - 0.1 * curvature), p3: v(0.95, 0.26), widthStart: 34 * widthScale, widthEnd: 300 * widthScale, densityBias: 2 }];
    case "wave":
      return [{ p0: v(0, 0.8), p1: v(0.32, 0.58 + 0.15 * curvature), p2: v(0.66, 0.42 - 0.1 * curvature), p3: v(1, 0.28), widthStart: 46 * widthScale, widthEnd: 230 * widthScale, densityBias: 1.4 }];
    case "flow":
      return [-1, 0, 1].map((offset): Band => ({
        p0: v(0, 0.82 + offset * 0.06), p1: v(0.3, 0.6 + offset * 0.08 + 0.12 * curvature), p2: v(0.65, 0.42 + offset * 0.05), p3: v(1, 0.26 + offset * 0.09),
        widthStart: 30 * widthScale, widthEnd: 170 * widthScale, densityBias: 1.3,
      }));
    case "horizon":
      return [{ p0: v(0, 0.7), p1: v(0.33, 0.62 + 0.06 * curvature), p2: v(0.66, 0.6 - 0.06 * curvature), p3: v(1, 0.66), widthStart: 120 * widthScale, widthEnd: 150 * widthScale, densityBias: 1 }];
    case "portrait":
      return [{ p0: v(0.5, 0.02), p1: v(0.4 - 0.1 * curvature, 0.36), p2: v(0.6 + 0.1 * curvature, 0.64), p3: v(0.5, 0.98), widthStart: 50 * widthScale, widthEnd: 210 * widthScale, densityBias: 1.4 }];
    case "explosion": {
      const bands: Band[] = [];
      for (let i = 0; i < 9; i++) {
        const ang = (i / 9) * Math.PI * 2;
        const end = { x: SIZE / 2 + Math.cos(ang) * SIZE * 0.62, y: SIZE / 2 + Math.sin(ang) * SIZE * 0.62 };
        const mid = { x: SIZE / 2 + Math.cos(ang) * SIZE * 0.31, y: SIZE / 2 + Math.sin(ang) * SIZE * 0.31 };
        bands.push({ p0: { x: SIZE / 2, y: SIZE / 2 }, p1: mid, p2: mid, p3: end, widthStart: 160 * widthScale, widthEnd: 20 * widthScale, densityBias: 1.6, reverse: true });
      }
      return bands;
    }
    case "corner": {
      const bands: Band[] = [];
      const origin = v(0.94, 0.06);
      for (let i = 0; i < 7; i++) {
        const ang = Math.PI * 0.55 + (i / 6) * (Math.PI / 2);
        const end = { x: origin.x + Math.cos(ang) * SIZE * 0.85, y: origin.y + Math.sin(ang) * SIZE * 0.85 };
        const mid = { x: origin.x + Math.cos(ang) * SIZE * 0.42, y: origin.y + Math.sin(ang) * SIZE * 0.42 };
        bands.push({ p0: origin, p1: mid, p2: mid, p3: end, widthStart: 190 * widthScale, widthEnd: 16 * widthScale, densityBias: 1.6, reverse: true });
      }
      return bands;
    }
    case "subtle":
    default:
      return [{ p0: v(0, 0.78), p1: v(0.32, 0.58 + 0.12 * curvature), p2: v(0.66, 0.44), p3: v(1, 0.3), widthStart: 40 * widthScale, widthEnd: 170 * widthScale, densityBias: 1.3 }];
  }
}

function sampleBand(band: Band, count: number, dotSizeMin: number, dotSizeMax: number, perspective: number, random: () => number): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const skew = Math.pow(random(), 1 / band.densityBias);
    const t = band.reverse ? 1 - skew : skew;
    const center = bezierPoint(band, t);
    const angle = bezierTangent(band, t);
    const perpAngle = angle + Math.PI / 2;
    const width = lerp(band.widthStart, band.widthEnd, band.reverse ? 1 - t : t);
    const spread = (random() + random() - 1) / 2; // triangular distribution, peaks at 0
    const offset = spread * width;
    const x = center.x + Math.cos(perpAngle) * offset;
    const y = center.y + Math.sin(perpAngle) * offset;
    const depth = band.reverse ? 1 - t : t;
    const edgeFalloff = Math.max(0, 1 - Math.abs(spread) * 1.9);
    const sizeT = Math.pow(depth, perspective) * (0.55 + edgeFalloff * 0.45);
    const r = lerp(dotSizeMin, dotSizeMax, sizeT) * (0.55 + random() * 0.55);
    const o = (0.3 + Math.pow(depth, Math.max(0.4, perspective * 0.7)) * 0.7) * (0.4 + edgeFalloff * 0.6) * (0.55 + random() * 0.45);
    if (r > 0.2 && o > 0.03 && x >= -40 && x <= SIZE + 40 && y >= -40 && y <= SIZE + 40) dots.push({ x, y, r, o });
  }
  return dots;
}

function fadeMultiplier(fade: DotWaveFade, x: number): number {
  const t = x / SIZE;
  if (fade === "start") return 0.25 + t * 0.75;
  if (fade === "end") return 0.25 + (1 - t) * 0.75;
  if (fade === "both") return 0.35 + (1 - Math.abs(t - 0.5) * 2) * 0.65;
  return 1;
}

const PRESETS: Record<DotWaveVariant, Required<Pick<DotWaveProps, "density" | "curvature" | "amplitude" | "dotSizeMin" | "dotSizeMax" | "fade" | "perspective" | "glow">>> = {
  wave: { density: 620, curvature: 0.7, amplitude: 0.55, dotSizeMin: 2, dotSizeMax: 16, fade: "both", perspective: 1.6, glow: true },
  hero: { density: 820, curvature: 0.75, amplitude: 0.65, dotSizeMin: 2, dotSizeMax: 20, fade: "start", perspective: 1.7, glow: true },
  goldMission: { density: 1500, curvature: 0.8, amplitude: 0.7, dotSizeMin: 2, dotSizeMax: 22, fade: "start", perspective: 1.8, glow: true },
  explosion: { density: 700, curvature: 0.6, amplitude: 0.55, dotSizeMin: 1.5, dotSizeMax: 14, fade: "end", perspective: 1.5, glow: false },
  flow: { density: 780, curvature: 0.65, amplitude: 0.5, dotSizeMin: 1.5, dotSizeMax: 13, fade: "both", perspective: 1.5, glow: true },
  corner: { density: 560, curvature: 0.5, amplitude: 0.55, dotSizeMin: 1.5, dotSizeMax: 14, fade: "end", perspective: 1.5, glow: false },
  horizon: { density: 480, curvature: 0.4, amplitude: 0.4, dotSizeMin: 1.5, dotSizeMax: 11, fade: "both", perspective: 1.3, glow: false },
  portrait: { density: 560, curvature: 0.85, amplitude: 0.55, dotSizeMin: 1.5, dotSizeMax: 13, fade: "both", perspective: 1.5, glow: false },
  subtle: { density: 260, curvature: 0.6, amplitude: 0.4, dotSizeMin: 0.8, dotSizeMax: 5, fade: "both", perspective: 1.4, glow: false },
};

export function DotWave({ variant = "wave", intensity = 1, opacity = 1, rotation = 0, color = "var(--red)", seed = 7, className, style, ...overrides }: DotWaveProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const preset = PRESETS[variant];
  const density = overrides.density ?? preset.density;
  const curvature = overrides.curvature ?? preset.curvature;
  const amplitude = overrides.amplitude ?? preset.amplitude;
  const dotSizeMin = overrides.dotSizeMin ?? preset.dotSizeMin;
  const dotSizeMax = overrides.dotSizeMax ?? preset.dotSizeMax;
  const perspective = overrides.perspective ?? preset.perspective;
  const fade = overrides.fade ?? preset.fade;
  const glow = overrides.glow ?? preset.glow;

  const { dots, atmosphere, glowDots } = useMemo(() => {
    const random = mulberry32(seed);
    const bands = bandsFor(variant, curvature, amplitude);
    const perBand = Math.round(density / bands.length);
    const mainDots = bands.flatMap(band => sampleBand(band, perBand, dotSizeMin, dotSizeMax, perspective, random));

    const atmoCount = Math.round(density * 0.16);
    const atmo: Dot[] = Array.from({ length: atmoCount }, () => ({
      x: random() * SIZE, y: random() * SIZE,
      r: dotSizeMin * (0.4 + random() * 0.6),
      o: 0.08 + random() * 0.14,
    }));

    let glowPts: Dot[] = [];
    if (glow) {
      const primary = bands[0];
      const steps = 16;
      glowPts = Array.from({ length: steps }, (_, i) => {
        const t = primary.reverse ? 1 - i / (steps - 1) : i / (steps - 1);
        const p = bezierPoint(primary, t);
        const depth = primary.reverse ? 1 - t : t;
        return { x: p.x, y: p.y, r: lerp(18, 70, Math.pow(depth, 1.4)), o: 0.03 + Math.pow(depth, 1.6) * 0.1 };
      });
    }

    return { dots: mainDots, atmosphere: atmo, glowDots: glowPts };
  }, [variant, curvature, amplitude, density, dotSizeMin, dotSizeMax, perspective, glow, seed]);

  return (
    <div className={`brand-dot-wave${className ? ` ${className}` : ""}`} style={{ opacity: intensity, ...style }} aria-hidden="true">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} preserveAspectRatio="none" width="100%" height="100%">
        {glow && (
          <defs>
            <filter id={`dw-glow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
        )}
        <g transform={`rotate(${rotation} ${SIZE / 2} ${SIZE / 2})`}>
          {glowDots.length > 0 && (
            <g filter={`url(#dw-glow-${uid})`}>
              {glowDots.map((dot, index) => {
                const rp = rotatePoint({ x: dot.x, y: dot.y }, 0);
                return <circle key={`glow-${index}`} cx={rp.x} cy={rp.y} r={dot.r} fill={color} opacity={dot.o * opacity * fadeMultiplier(fade, dot.x)} />;
              })}
            </g>
          )}
          {atmosphere.map((dot, index) => <circle key={`atmo-${index}`} cx={dot.x} cy={dot.y} r={dot.r} fill={color} opacity={dot.o * opacity} />)}
          {dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} fill={color} opacity={dot.o * opacity * fadeMultiplier(fade, dot.x)} />)}
        </g>
      </svg>
    </div>
  );
}
