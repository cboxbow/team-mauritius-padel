// Build-time route collection for sitemap generation.
//
// This intentionally avoids parser dependencies so the production build remains
// portable on Vercel and on local machines with only package.json installed.
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const DEFAULT_INPUT = "src/App.tsx";
const DEFAULT_OUTPUT = "dist/sitemap-routes.json";
const EXCLUDED_PREFIXES = ["/admin", "/api", "/assets", "/dev", "/publish", "/.well-known"];
const EXCLUDED_FILES = new Set(["/favicon.ico", "/manifest.json", "/robots.txt", "/sitemap.xml"]);

function parseArgs(argv) {
  const args = { input: DEFAULT_INPUT, output: DEFAULT_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input" && argv[i + 1]) args.input = argv[++i];
    else if (argv[i] === "--output" && argv[i + 1]) args.output = argv[++i];
  }
  return args;
}

function normalizeRoutePath(routePath) {
  const trimmed = String(routePath ?? "").trim();
  if (!trimmed || trimmed === "*") return null;
  const withoutHash = trimmed.split("#", 1)[0];
  const withoutQuery = withoutHash.split("?", 1)[0];
  const normalized = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, "") : normalized;
}

function isIndexableStaticRoute(routePath) {
  if (!routePath || routePath.includes(":") || routePath.includes("*")) return false;
  const lower = routePath.toLowerCase();
  if (EXCLUDED_FILES.has(lower)) return false;
  return !EXCLUDED_PREFIXES.some(prefix => lower === prefix || lower.startsWith(`${prefix}/`));
}

export function collectSitemapRoutesFromSource(source) {
  const routePattern = /<Route\b[^>]*\bpath=(?:"([^"]+)"|'([^']+)'|\{\s*["']([^"']+)["']\s*\})/g;
  const routes = new Set();
  let match;
  while ((match = routePattern.exec(source))) {
    const routePath = normalizeRoutePath(match[1] ?? match[2] ?? match[3]);
    if (isIndexableStaticRoute(routePath)) routes.add(routePath);
  }
  return Array.from(routes).sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });
}

function run() {
  const cwd = process.cwd();
  const args = parseArgs(process.argv.slice(2));
  const inputPath = resolve(cwd, args.input);
  const outputPath = resolve(cwd, args.output);
  const source = readFileSync(inputPath, "utf-8");
  const routes = collectSitemapRoutesFromSource(source);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify({ version: 1, source: args.input, generatedAt: new Date().toISOString(), routes }, null, 2)}\n`);
  console.log(`[sitemap-routes] wrote ${routes.length} routes to ${args.output}`);
}

if (process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])) run();
