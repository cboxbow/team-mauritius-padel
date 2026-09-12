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
    ["Meet Team Mauritius", "The selected squad comes together at Caña Club."],
    ["Building the team", "Pair chemistry, communication and tactical patterns."],
    ["Competition mode", "Match simulation and pressure situations."],
  ];
  return `
    <section class="prerender-home">
      <p>TEAM MAURITIUS / ROAD TO LA RÉUNION 2026</p>
      <h1>Road to La Réunion.</h1>
      <p>Official digital hub for Team Mauritius on the road to the Island Padel Cup 2026 at Club de Champ Fleuri, La Réunion.</p>
      <nav aria-label="Primary prerender links">
        <a href="/team">Meet the team</a>
        <a href="/training">Follow the journey</a>
        <a href="/live">Live center</a>
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
