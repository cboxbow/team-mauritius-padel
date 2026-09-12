# Team Mauritius Digital Hub — Premium Upgrade Prompt

Transform the existing Team Mauritius / Island Padel Cup 2026 website into a premium, credible and production-minded national-team digital hub. Preserve the current visual identity and source assets while elevating hierarchy, polish, usefulness, trust and mobile execution.

## Product objective

Create one authoritative destination for supporters, players, partners, media and the event operations team across three phases: preparation, live competition and post-event archive. The public experience must feel official and editorial; operational controls must feel deliberate, secure and clearly separated from the public site.

## Design system (required)

- Platform: responsive web, mobile-first refinement with an editorial desktop experience.
- Theme: premium dark sports publishing; cinematic, disciplined, confident and national-team focused.
- Background: Carbon Black (#070708) and Deep Navy (#0B1018).
- Primary accent: Team Red (#EF3D32) for actions, active states and competition energy.
- Secondary accent: Championship Gold (#D6B36A) for prestige, partners and controlled highlights.
- Text: Warm White (#F4F4F0) with Steel Gray (#8B929D) for secondary information.
- Typography: Barlow Condensed for athletic display headlines, Barlow for reading, JetBrains Mono for dates, scores and operational metadata.
- Geometry: mostly square or lightly softened surfaces; avoid generic rounded SaaS cards.
- Motion: restrained transitions, score pulses and image movement; respect reduced-motion preferences.
- Accessibility: visible focus states, semantic headings, accurate button labels, sufficient contrast and touch targets of at least 44px.

## Experience structure

1. Header: compact official identity, current campaign phase and public navigation. Keep administration out of the public navigation until authentication exists.
2. Home hero: immediate Team Mauritius positioning, Island Padel Cup dates, one primary journey CTA and one live CTA. Maintain high contrast on all mobile sizes.
3. Campaign status: show the next session calculated from real dates, the exact venue and the next milestone. Never derive chronological state from editorial publication status.
4. Preparation timeline: display exactly 06, 13, 24 and 27 September with the approved times. Brunch appears only for the Sunday sessions. Do not display cancelled or superseded dates.
5. Team directory: preserve the selected squad, separate men and women, keep coach identity unchanged and make future editorial data clearly manageable.
6. Newsroom: functional category filters, meaningful empty states and article pages suitable for photographs, quotes and video.
7. Event hub: distinguish available destinations from coming-soon modules; do not use dead or circular links.
8. Live center: clearly separate demo data from real event data. Prepare the information architecture for matches, scores, stream, ticker and standings without pretending local data is shared live data.
9. Media and partners: functional filters, strong image crops, credible sponsorship inventory and no fake partner logos.
10. Admin: direct-access local demo only until authentication and durable persistence are connected. Validate external URLs and communicate storage scope honestly.

## Functional and technical requirements

- Remove prototype-only route messaging and unsafe cross-origin message handling from production builds.
- Use standard cross-platform development and build scripts.
- Keep TypeScript strict and lint free of errors.
- Reduce dependency and scaffold residue; remove unused demo networking code and vulnerable packages where practical.
- Preserve BrowserRouter only with a documented hosting fallback strategy, or use a routing approach supported by the selected host.
- Split the monolithic application into maintainable feature modules in later iterations without destabilizing the first upgrade pass.
- Prepare a future Supabase phase with authenticated roles, durable content, media storage, realtime scores, migrations and row-level security.

## Content rules

- 06 SEP — ASSESS — 07:00–09:00
- 13 SEP — BUILD — 07:00–09:00
- 24 SEP — COMPETE — 12:30–14:30
- 27 SEP — FINAL CAMP — 07:00–09:00
- Use “Final pairings”, “Island Cup simulation” and “Team briefing”.
- Use “4 SESSIONS. ONE GOAL. LA RÉUNION.”
- Use “BRUNCH AFTER THE SUNDAY SESSIONS • CAÑA CLUB”.
- Preserve the selected squad, coach Adam Auckland, Island Padel Cup dates, branding and event identity.

## Quality bar

The result should feel like an official national-team campaign built by a senior sports creative studio and a disciplined product team: visually memorable, fast, coherent, accessible, credible and ready to evolve into a real operational platform.

# TEAM MAURITIUS — CREATIVE DIRECTION & VISUAL GENERATION

You are not only a frontend developer.

For this project you must operate simultaneously as:

1. Senior Art Director
2. Sports Editorial Designer
3. UI/UX Designer
4. Frontend Developer
5. Image Researcher
6. AI Image Creator
7. Photo Editor
8. Brand Guardian

The objective is NOT to build pages only from the images supplied by the user.

The supplied images are REFERENCE ASSETS and SOURCE MATERIAL.
They must not restrict the visual design.

--------------------------------------------------
VISUAL CREATION RULE
--------------------------------------------------

For every page, article, player profile, coach profile or feature:

FIRST inspect the available assets.

THEN determine what visual assets the ideal design actually requires.

Classify every required visual as:

A — existing asset can be used directly
B — existing asset should be cropped / edited / enhanced
C — a new visual should be generated
D — a graphic composition should be created from multiple assets
E — a decorative/design asset should be generated

DO NOT automatically choose A.

If the existing images are insufficient to create a premium result,
CREATE THE MISSING VISUALS.

--------------------------------------------------
IMAGE GENERATION
--------------------------------------------------

Use the available image-generation skill whenever a page would benefit
from imagery that does not already exist.

Examples:

• editorial hero images
• cinematic player portraits
• coach portraits
• padel action scenes
• Mauritius / La Réunion atmosphere
• padel rackets and balls
• courts
• tournament atmosphere
• abstract red dot-wave backgrounds
• black/red sports textures
• editorial backgrounds
• promotional campaign imagery
• social-media crops
• article thumbnails
• section backgrounds
• graphical transitions
• composite imagery

Generated visuals must follow the Team Mauritius visual identity.

--------------------------------------------------
DO NOT INVENT REAL EVENTS
--------------------------------------------------

AI-generated imagery must never falsely represent a real historical
match, player result or event as documentary photography.

When documentary authenticity matters, use the supplied real images.

Generated imagery may be used for:
campaign visuals,
editorial illustrations,
backgrounds,
textures,
conceptual scenes,
graphic compositions,
and clearly promotional imagery.

--------------------------------------------------
BRAND DNA
--------------------------------------------------

Visual language:

TEAM MAURITIUS
ISLAND PADEL CUP
MAURITIUS PADEL LEAGUE

Primary palette:

BLACK
WHITE
MAURITIUS RED

Secondary accents may use Mauritius flag colours sparingly.

Signature visual element:

RED DOT WAVE

The dot wave should behave like an energetic flowing field:
variable dot sizes,
curved movement,
depth,
acceleration,
fade,
particle dispersion.

Never use it as a repetitive wallpaper.

--------------------------------------------------
EDITORIAL STYLE

Reference feeling:

Nike campaign
Adidas performance
Formula 1 editorial
premium football national-team campaigns
modern sports magazines

But DO NOT copy their designs.

Create an original Team Mauritius visual system.

--------------------------------------------------
PAGE COMPOSITION

Do not create pages that are simply:

IMAGE
TEXT
IMAGE
TEXT
IMAGE
TEXT

Instead create editorial compositions using:

hero sections
full bleed imagery
asymmetrical grids
oversized typography
pull quotes
statistics
photo crops
dark/light transitions
dot-wave graphics
visual storytelling
cards
editorial captions
player information
dynamic spacing

Every major article should feel like a designed sports feature,
not a blog post.

--------------------------------------------------
VISUAL AUTONOMY

IMPORTANT:

Do not wait for the user to provide every image.

When an appropriate visual does not exist:

GENERATE IT.

When an existing image has a poor crop:

CREATE A BETTER CROP OR COMPOSITION.

When an image needs a different aspect ratio:

EDIT / EXTEND IT when the available tools allow it.

When a background is missing:

CREATE IT.

When decorative artwork would improve the page:

CREATE IT.

The asset folder is a starting point, not a limitation.

--------------------------------------------------
ASSET WORKFLOW

Before implementing a major page:

1. Inspect existing assets.
2. Define the visual story.
3. Make an asset checklist.
4. Identify missing visuals.
5. Generate/edit missing visuals.
6. Save them in the appropriate project asset directory.
7. Implement the page.
8. Review the page visually.
9. Improve weak sections.
10. Repeat until the page looks publication-ready.

Do not stop after the first functional implementation.

--------------------------------------------------
QUALITY BAR

Ask yourself:

"Would this look credible as the official digital campaign of a
national sports team?"

If not, continue improving it.

Functionality alone is NOT completion.

The page must be:
functional,
responsive,
visually coherent,
editorial,
premium,
and emotionally engaging.

--------------------------------------------------
VISUAL ASSET FALLBACK SYSTEM
--------------------------------------------------

For every visual requirement, use this priority:

LEVEL 1 — REAL PROJECT ASSET
Use authentic supplied photography when the visual represents:
- a named player
- Adam Auckland
- staff
- a real tournament
- a real historical event

LEVEL 2 — IMAGE GENERATION
If an image-generation tool or skill is available, create missing
non-documentary visual assets when this improves the design.

LEVEL 3 — PROGRAMMATIC GRAPHICS
If image generation is NOT available, DO NOT abandon the visual concept.

Create the required visual assets programmatically using:
- SVG
- CSS
- gradients
- masks
- filters
- blend modes
- Canvas
- procedural particles
- generated dot patterns
- typography
- geometric compositions

The RED DOT WAVE should preferably be recreated as a reusable
SVG/CSS/procedural design system rather than relying on a static image.

LEVEL 4 — COMPOSITION
Create new editorial visuals by combining:
- authentic photographs
- generated SVG graphics
- typography
- gradients
- textures
- masks
- overlays
- brand elements

IMPORTANT:

"No image-generation tool available" does NOT mean
"use only the photographs supplied by the user."

It means:
USE THE OTHER AVAILABLE CREATIVE METHODS.

Codex must remain visually autonomous.

--------------------------------------------------
DO NOT GENERATE IDENTIFIABLE PEOPLE
--------------------------------------------------

For Team Mauritius players, coaches and staff:

Never generate a synthetic replacement for a real identifiable person.

Use authentic photography supplied by the project/user.

AI generation may be used for:
- backgrounds
- abstract environments
- padel courts without identifiable people
- rackets
- balls
- textures
- Mauritius-inspired atmospheres
- red dot waves
- graphic campaign elements
- lighting effects
- editorial compositions

Authenticity of Team Mauritius people must always be preserved.
