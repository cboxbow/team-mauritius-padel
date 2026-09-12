const sharp = require("sharp");
const path = require("path");

const SRC = path.resolve(__dirname, "../../coach adam/Adam Face.png");
const OUT = path.resolve(__dirname, "../public/images/players/adam-auckland-cutout.png");

const BG = [211, 211, 211];
const LOW_T = 16;
const HIGH_T = 58;
const LO_CHROMA = 7;
const HI_CHROMA = 24;

function boxBlur(src, width, height, radius) {
  const tmp = new Float32Array(width * height);
  const out = new Uint8ClampedArray(width * height);
  const size = radius * 2 + 1;
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = -radius; x <= radius; x++) sum += src[y * width + Math.min(width - 1, Math.max(0, x))];
    for (let x = 0; x < width; x++) {
      tmp[y * width + x] = sum / size;
      const addX = Math.min(width - 1, x + radius + 1);
      const subX = Math.max(0, x - radius);
      sum += src[y * width + addX] - src[y * width + subX];
    }
  }
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = -radius; y <= radius; y++) sum += tmp[Math.min(height - 1, Math.max(0, y)) * width + x];
    for (let y = 0; y < height; y++) {
      out[y * width + x] = Math.round(sum / size);
      const addY = Math.min(height - 1, y + radius + 1);
      const subY = Math.max(0, y - radius);
      sum += tmp[addY * width + x] - tmp[subY * width + x];
    }
  }
  return out;
}

async function main() {
  const { data, info } = await sharp(SRC).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const rgba = Buffer.from(data);
  const alpha = new Uint8ClampedArray(width * height);

  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const r = rgba[o], g = rgba[o + 1], b = rgba[o + 2];
    const dr = r - BG[0], dg = g - BG[1], db = b - BG[2];
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    const distSignal = Math.max(0, Math.min(1, (dist - LOW_T) / (HIGH_T - LOW_T)));
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    const chromaSignal = Math.max(0, Math.min(1, (chroma - LO_CHROMA) / (HI_CHROMA - LO_CHROMA)));
    const a = Math.max(distSignal, chromaSignal);
    alpha[i] = Math.round(a * 255);
  }

  const blurredAlpha = boxBlur(alpha, width, height, 2);

  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const oo = i * 4;
    const a = blurredAlpha[i] / 255;
    let r = rgba[o], g = rgba[o + 1], b = rgba[o + 2];
    if (a > 0.02 && a < 0.98) {
      r = Math.max(0, Math.min(255, (r - (1 - a) * BG[0]) / a));
      g = Math.max(0, Math.min(255, (g - (1 - a) * BG[1]) / a));
      b = Math.max(0, Math.min(255, (b - (1 - a) * BG[2]) / a));
    }
    out[oo] = r; out[oo + 1] = g; out[oo + 2] = b; out[oo + 3] = blurredAlpha[i];
  }

  await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(OUT);
  console.log("written", OUT, width, height);
}

main().catch(err => { console.error(err); process.exit(1); });
