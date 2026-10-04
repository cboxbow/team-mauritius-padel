// Lightweight home-page prerender for the CSR website.
//
// The full React app still hydrates in the browser. This gives crawlers and
// unfurled previews real campaign content without adding SSR-only dependencies.
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const ROOT_RE = /<div\s+id=["']root["'][^>]*>([\s\S]*?)<\/div>/;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function campaignMarkup() {
  const stories = [
    ["Final Day: Mauritius play for the men's title", "Men's final: Mauritius vs La Réunion. Women's final: Madagascar vs La Réunion."],
    ["P500 Saint-Denis: Mauritians in action", "Danjoux / Koenig win 9-0. Desvaux de Marigny / Park win 9-2."],
    ["Road to La Réunion", "Assess, Build, Compete and the Final Camp — preparation complete."],
  ];
  return `
    <section class="prerender-home">
      <p>ISLAND PADEL CUP 2026 / FINAL DAY</p>
      <h1>Final Day.</h1>
      <p>Team Mauritius at the Island Padel Cup 2026 — Club de Champ Fleuri, Saint-Denis, La Réunion, 1–4 October 2026.</p>
      <nav aria-label="Primary prerender links">
        <a href="/live">Follow the action</a>
        <a href="/team">Team Mauritius</a>
        <a href="/training">The journey</a>
      </nav>
      <div>
        ${stories.map(([title, copy]) => `<article><h2>${escapeHtml(title)}</h2><p>${escapeHtml(copy)}</p></article>`).join("")}
      </div>
    </section>
  `;
}

function run() {
  const htmlPath = resolve(process.cwd(), "dist/index.html");
  const template = readFileSync(htmlPath, "utf-8");
  const existing = template.match(ROOT_RE);
  if (!existing) {
    console.warn("[prerender] skipped: no #root found");
    return;
  }
  if (existing[1].trim()) {
    console.log("[prerender] skipped: #root already contains markup");
    return;
  }
  writeFileSync(htmlPath, template.replace(ROOT_RE, () => `<div id="root">${campaignMarkup()}</div>`));
  console.log("[prerender] home campaign markup baked into dist/index.html");
}

run();
