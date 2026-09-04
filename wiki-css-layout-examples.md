---
title: "Wiki.js CSS Layouts"
description: "Responsive layout examples for Volmit Wiki.js pages"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "meta, wikijs, css, layouts, examples"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

These examples use short Shaped Portals content to show common page layouts.
Use one strong layout per page. A landing page usually needs a hero, a few
task links, and space for real in-game media.

- [Landing hero](#landing-hero)
- [Task navigation](#task-navigation)
- [Media slots](#media-slots)
- [Reference layout](#reference-layout)
- [Reusable stylesheet](#reusable-stylesheet)
{.grid-list}

## Landing hero

Use a hero to answer three questions: what the plugin does, where to start,
and what it looks like.

<section aria-label="Shaped Portals example hero" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:clamp(1.25rem,4vw,3rem);align-items:center;padding:clamp(1.25rem,4vw,3rem);border:1px solid rgba(127,127,127,.35);background:rgba(123,43,153,.08)">
  <div>
    <p style="margin:0;color:inherit;font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase">Shaped Portals</p>
    <h3 style="margin:.35rem 0 .7rem;font-size:clamp(2rem,6vw,3.8rem);line-height:1">Build portals that fit the build.</h3>
    <p style="margin:0;max-width:55ch">Create custom Nether and End portal frames while keeping Minecraft's normal travel.</p>
    <nav aria-label="Example actions" style="display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.2rem">
      <a href="/shapedportals/00-overview" style="padding:.65rem .85rem;border:1px solid #7b2b99;background:#7b2b99;color:#fff!important;text-decoration:none">Build a portal</a>
      <a href="/shapedportals/01-installation-configuration" style="padding:.65rem .85rem;border:1px solid currentColor;text-decoration:none">Configuration</a>
    </nav>
  </div>
  <div role="img" aria-label="Placeholder for gameplay footage" style="display:grid;min-height:190px;place-content:center;gap:.3rem;padding:1rem;border:1px dashed rgba(127,127,127,.7);text-align:center">
    <strong>Gameplay video goes here</strong>
    <span style="opacity:.7">Show the frame being built and used.</span>
  </div>
</section>

Keep the description under two sentences and limit the actions to the two most
useful destinations.

## Task navigation

Task names are easier to scan than a list of page titles.

<nav aria-label="Example documentation links" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:1rem">
  <a href="/shapedportals/00-overview" style="display:grid;gap:.35rem;min-height:120px;padding:1rem;border:1px solid rgba(127,127,127,.35);color:inherit;text-decoration:none">
    <strong>Build a portal</strong>
    <span style="font-weight:400;opacity:.72">Nether and End frame instructions.</span>
  </a>
  <a href="/shapedportals/01-installation-configuration" style="display:grid;gap:.35rem;min-height:120px;padding:1rem;border:1px solid rgba(127,127,127,.35);color:inherit;text-decoration:none">
    <strong>Change the rules</strong>
    <span style="font-weight:400;opacity:.72">Materials, dimensions, worlds, sounds, and particles.</span>
  </a>
  <a href="/shapedportals/02-portal-behavior-events#troubleshooting" style="display:grid;gap:.35rem;min-height:120px;padding:1rem;border:1px solid rgba(127,127,127,.35);color:inherit;text-decoration:none">
    <strong>Fix a problem</strong>
    <span style="font-weight:400;opacity:.72">Activation, protection, integrity, and travel checks.</span>
  </a>
</nav>

Make the full card a link. Each card should contain one destination, a short
label, and one line of context.

## Media slots

Placeholders make the intended shot clear without pretending that temporary
art is final.

<section aria-label="Example media plan" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:1rem">
  <div role="img" aria-label="Placeholder for a Nether portal animation" style="display:grid;min-height:150px;place-content:center;gap:.3rem;padding:1rem;border:1px dashed rgba(127,127,127,.7);text-align:center"><strong>Nether portal GIF goes here</strong><span style="opacity:.7">An irregular frame being lit.</span></div>
  <div role="img" aria-label="Placeholder for an End portal animation" style="display:grid;min-height:150px;place-content:center;gap:.3rem;padding:1rem;border:1px dashed rgba(127,127,127,.7);text-align:center"><strong>End portal GIF goes here</strong><span style="opacity:.7">The final eye activating the surface.</span></div>
  <div role="img" aria-label="Placeholder for a configuration screenshot" style="display:grid;min-height:150px;place-content:center;gap:.3rem;padding:1rem;border:1px dashed rgba(127,127,127,.7);text-align:center"><strong>Configuration image goes here</strong><span style="opacity:.7">The main settings menu.</span></div>
</section>

Write alternative text for the finished media. Avoid autoplay with sound.
Videos need controls and captions when speech carries information.

## Reference layout

Use Markdown for dense reference material. It remains readable when page CSS
is unavailable.

| Command | Who can use it | Result |
|---|---|---|
| `/sp status` | Players and console | Shows service and portal counts |
| `/sp config` | Operators by default | Opens the settings menu |
| `/sp portals [page]` | Operators by default | Lists managed portals |

{.dense}

Put short tables near the task they support. Move long API or configuration
tables to their own page.

## Reusable stylesheet

Repeated layouts belong in the shared theme. Scope every selector to a unique
page class so it cannot change unrelated pages.

~~~css
.v-main .contents .plugin-home {
  --plugin-accent: #7b2b99;
  display: grid;
  gap: 3rem;
}

.v-main .contents .plugin-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: center;
  padding: clamp(1.5rem, 5vw, 3.5rem);
  border: 1px solid var(--volmit-line);
  background: color-mix(
    in srgb,
    var(--plugin-accent) 8%,
    var(--volmit-surface)
  );
}

.v-main .contents .plugin-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 1rem;
}

.v-main .contents .plugin-card {
  min-height: 120px;
  padding: 1rem;
  border: 1px solid var(--volmit-line);
  background: var(--volmit-surface);
}

.v-main .contents .plugin-card:focus-within,
.v-main .contents .plugin-card:hover {
  border-color: var(--plugin-accent);
}

@media (max-width: 959px) {
  .v-main .contents .plugin-hero {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .v-main .contents .plugin-home *,
  .v-main .contents .plugin-home *::before,
  .v-main .contents .plugin-home *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
~~~

Use fluid grids instead of fixed desktop widths. Check keyboard focus, text
contrast, mobile reflow, and both Wiki.js themes before publishing. The live
[Shaped Portals page](/shapedportals) uses a scoped version of this approach.
The [Adapt page example](/wiki-adapt-css-example) shows the same ideas on a
longer page with a skill tree.
