---
title: "Wiki.js CSS & Layout Gallery"
description: "Responsive Wiki.js layout patterns using verified Iris documentation data"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "meta, wikijs, css, layouts, examples"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Use this page as a visual menu when designing a Volmit wiki page. Every
preview uses real Iris documentation content, responsive CSS, semantic HTML,
and Git-friendly page source. The patterns are intentionally different: choose
one or combine two instead of putting every pattern on one production page.

> These previews require Wiki.js Markdown **Allow HTML** and a sanitizer policy
> that permits inline `style` attributes. That matches the current Volmit home
> page. If inline styles are removed on your Wiki.js instance, use the
> class-based stylesheet near the end of this page.
{.is-warning}

## Pick a pattern {#pick-a-pattern}

- [1 — Product hero](#layout-1)
- [2 — Choose-your-path navigation](#layout-2)
- [3 — Bento feature grid](#layout-3)
- [4 — Quick-start steps](#layout-4)
- [5 — Compatibility dashboard](#layout-5)
- [6 — Command center](#layout-6)
- [7 — Split feature panel](#layout-7)
- [8 — Vertical timeline](#layout-8)
- [9 — Platform comparison cards](#layout-9)
- [10 — Operations checklist](#layout-10)
- [CSS building blocks](#css-building-blocks)
- [Class-based stylesheet](#class-based-stylesheet)
{.grid-list}

## Design rules used here {#design-rules}

| Rule | Why it helps |
|---|---|
| One primary action per section | Readers can decide without scanning a wall of equal-weight links |
| `auto-fit` grids | Cards collapse naturally without page-specific breakpoints |
| `clamp()` spacing and type | The design scales smoothly between phone and desktop widths |
| `color: inherit` on neutral cards | Text remains readable in Wiki.js light and dark themes |
| Text plus color | Status never depends on color alone |
| Real links and headings | The page remains keyboard, screen-reader, and search friendly |
| Inline styles only for the demo | Production components are easier to maintain with scoped classes |
{.dense}

The examples use `/home-assets/iris.png`, current Iris routes, Minecraft 26.2,
Java 25, and current command syntax from the Iris documentation.

## Layout 1 — Product hero {#layout-1}

**Best for:** a plugin landing page with one sentence, two actions, and only the
most important compatibility facts.

<section aria-label="Iris introduction" style="position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:clamp(1.5rem,5vw,4rem);background:linear-gradient(135deg,#241245 0%,#5033a8 52%,#0f7f8c 100%);color:#fff;box-shadow:0 18px 50px rgba(23,16,55,.28)">
  <div aria-hidden="true" style="position:absolute;width:280px;height:280px;right:-90px;top:-130px;border-radius:50%;background:rgba(255,255,255,.12)"></div>
  <div aria-hidden="true" style="position:absolute;width:180px;height:180px;right:15%;bottom:-120px;border-radius:50%;background:rgba(79,229,197,.16)"></div>
  <div style="position:relative;max-width:760px">
    <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.25rem">
      <img src="/home-assets/iris.png" alt="Iris" width="82" height="82" style="object-fit:contain;border-radius:18px;background:rgba(255,255,255,.12);padding:8px">
      <div>
        <span style="display:inline-block;padding:.3rem .65rem;border:1px solid rgba(255,255,255,.3);border-radius:999px;background:rgba(255,255,255,.1);font-size:.75rem;font-weight:700;letter-spacing:.08em">WORLD GENERATION ENGINE</span>
        <h3 style="margin:.45rem 0 0;font-size:clamp(2rem,7vw,4.2rem);line-height:1">Iris</h3>
      </div>
    </div>
    <p style="max-width:650px;margin:0 0 1.5rem;font-size:clamp(1rem,2.4vw,1.3rem);line-height:1.65;color:rgba(255,255,255,.9)">Build deterministic terrain, biomes, caves, objects, and structures from editable JSON packs—across Bukkit and mod-loader servers.</p>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap">
      <a href="/iris/02-getting-started" style="display:inline-block;padding:.8rem 1.1rem;border-radius:10px;background:#fff;color:#30205f;font-weight:700;text-decoration:none">Create your first world →</a>
      <a href="/iris/00-overview" style="display:inline-block;padding:.8rem 1.1rem;border:1px solid rgba(255,255,255,.45);border-radius:10px;color:#fff;font-weight:700;text-decoration:none">Browse documentation</a>
    </div>
    <div style="display:flex;gap:.55rem;flex-wrap:wrap;margin-top:1.5rem;font-size:.85rem">
      <span style="padding:.35rem .65rem;border-radius:999px;background:rgba(0,0,0,.2)">Minecraft 26.2</span>
      <span style="padding:.35rem .65rem;border-radius:999px;background:rgba(0,0,0,.2)">Java 25</span>
      <span style="padding:.35rem .65rem;border-radius:999px;background:rgba(0,0,0,.2)">Paper · Folia · Fabric · Forge · NeoForge</span>
    </div>
  </div>
</section>

The useful CSS ideas are `clamp()` for fluid sizing, decorative shapes behind
content, `flex-wrap` for actions, and a constrained text width inside a
full-width panel.

## Layout 2 — Choose-your-path navigation {#layout-2}

**Best for:** a documentation index where readers arrive with different goals.
This is usually easier to navigate than a flat list of twenty pages.

<nav aria-label="Choose an Iris learning path" style="--accent:#7658d6;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
  <a href="/iris/01-installation-platforms" style="display:block;min-height:180px;padding:1.25rem;border:1px solid rgba(127,127,127,.28);border-top:4px solid var(--accent);border-radius:14px;background:rgba(127,127,127,.07);color:inherit;text-decoration:none">
    <span style="display:grid;place-items:center;width:2.25rem;height:2.25rem;margin-bottom:1rem;border-radius:10px;background:var(--accent);color:#fff;font-weight:800">01</span>
    <strong style="display:block;font-size:1.1rem">Run a server</strong>
    <span style="display:block;margin-top:.4rem;line-height:1.55;opacity:.78">Choose the correct jar, install Iris, and create a managed world.</span>
    <span style="display:block;margin-top:1rem;color:var(--accent);font-weight:700">Start installing →</span>
  </a>
  <a href="/iris/05-concepts-pack-layout" style="display:block;min-height:180px;padding:1.25rem;border:1px solid rgba(127,127,127,.28);border-top:4px solid #0b8f82;border-radius:14px;background:rgba(127,127,127,.07);color:inherit;text-decoration:none">
    <span style="display:grid;place-items:center;width:2.25rem;height:2.25rem;margin-bottom:1rem;border-radius:10px;background:#0b8f82;color:#fff;font-weight:800">02</span>
    <strong style="display:block;font-size:1.1rem">Author a pack</strong>
    <span style="display:block;margin-top:.4rem;line-height:1.55;opacity:.78">Learn dimensions, regions, biomes, generators, and pack layout.</span>
    <span style="display:block;margin-top:1rem;color:#0b8f82;font-weight:700">Learn the model →</span>
  </a>
  <a href="/iris/31-operator-runbooks" style="display:block;min-height:180px;padding:1.25rem;border:1px solid rgba(127,127,127,.28);border-top:4px solid #ce7218;border-radius:14px;background:rgba(127,127,127,.07);color:inherit;text-decoration:none">
    <span style="display:grid;place-items:center;width:2.25rem;height:2.25rem;margin-bottom:1rem;border-radius:10px;background:#ce7218;color:#fff;font-weight:800">03</span>
    <strong style="display:block;font-size:1.1rem">Operate production</strong>
    <span style="display:block;margin-top:.4rem;line-height:1.55;opacity:.78">Validate, pre-generate, back up, diagnose, and recover worlds.</span>
    <span style="display:block;margin-top:1rem;color:#ce7218;font-weight:700">Open runbooks →</span>
  </a>
  <a href="/iris/90-api-getting-started" style="display:block;min-height:180px;padding:1.25rem;border:1px solid rgba(127,127,127,.28);border-top:4px solid #2774c8;border-radius:14px;background:rgba(127,127,127,.07);color:inherit;text-decoration:none">
    <span style="display:grid;place-items:center;width:2.25rem;height:2.25rem;margin-bottom:1rem;border-radius:10px;background:#2774c8;color:#fff;font-weight:800">04</span>
    <strong style="display:block;font-size:1.1rem">Use the API</strong>
    <span style="display:block;margin-top:.4rem;line-height:1.55;opacity:.78">Query terrain and subscribe to engine, world, and pregen events.</span>
    <span style="display:block;margin-top:1rem;color:#2774c8;font-weight:700">Build an integration →</span>
  </a>
</nav>

The whole card is a real anchor, so its click target is generous. The grid
automatically changes column count as room becomes available.

## Layout 3 — Bento feature grid {#layout-3}

**Best for:** showing product breadth without making every feature look equally
important. Use short copy; this pattern becomes crowded quickly.

<section aria-label="Iris features" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.85rem">
  <article style="grid-column:1/-1;padding:clamp(1.2rem,3vw,2rem);border-radius:18px;background:linear-gradient(120deg,rgba(118,88,214,.2),rgba(11,143,130,.12));border:1px solid rgba(118,88,214,.35)">
    <span style="font-size:.75rem;font-weight:800;letter-spacing:.08em;color:#7658d6">THE CORE IDEA</span>
    <h3 style="margin:.35rem 0 .5rem">One pack describes an entire world</h3>
    <p style="max-width:720px;margin:0;line-height:1.6">Dimensions connect regions, biomes, generators, objects, and structures. Production worlds keep a snapshot while Studio hotloads your working pack.</p>
  </article>
  <article style="padding:1.15rem;border-radius:16px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.25)">
    <span aria-hidden="true" style="font-size:1.6rem">◒</span>
    <h3 style="margin:.7rem 0 .35rem;font-size:1rem">Terrain</h3>
    <p style="margin:0;line-height:1.5;opacity:.78">Noise, expressions, caves, carving, and image maps.</p>
  </article>
  <article style="padding:1.15rem;border-radius:16px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.25)">
    <span aria-hidden="true" style="font-size:1.6rem">♣</span>
    <h3 style="margin:.7rem 0 .35rem;font-size:1rem">Biomes</h3>
    <p style="margin:0;line-height:1.5;opacity:.78">Surfaces, decorators, deposits, entities, and custom climate.</p>
  </article>
  <article style="padding:1.15rem;border-radius:16px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.25)">
    <span aria-hidden="true" style="font-size:1.6rem">◇</span>
    <h3 style="margin:.7rem 0 .35rem;font-size:1rem">Structures</h3>
    <p style="margin:0;line-height:1.5;opacity:.78">Single objects, multi-piece jigsaws, and vanilla passthrough.</p>
  </article>
  <article style="padding:1.15rem;border-radius:16px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.25)">
    <span aria-hidden="true" style="font-size:1.6rem">⌘</span>
    <h3 style="margin:.7rem 0 .35rem;font-size:1rem">Studio</h3>
    <p style="margin:0;line-height:1.5;opacity:.78">Disposable authoring worlds, schemas, previews, and hotload.</p>
  </article>
  <article style="padding:1.15rem;border-radius:16px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.25)">
    <span aria-hidden="true" style="font-size:1.6rem">≋</span>
    <h3 style="margin:.7rem 0 .35rem;font-size:1rem">Determinism</h3>
    <p style="margin:0;line-height:1.5;opacity:.78">Matching artifacts, packs, seeds, and areas produce identical chunks.</p>
  </article>
</section>

`grid-column: 1 / -1` makes the summary span every available column without a
media query. The smaller cards then flow beneath it.

## Layout 4 — Quick-start steps {#layout-4}

**Best for:** installation, migration, authoring, or any sequence where order
matters. Each step ends in an observable result.

<section aria-label="Iris quick start" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:0">
  <article style="position:relative;padding:1.25rem;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.06)">
    <span style="display:inline-grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:#7658d6;color:#fff;font-weight:800">1</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.05rem">Install</h3>
    <p style="margin:0;line-height:1.55;opacity:.8">Choose the plugin or mod jar, place it in the server, then start once.</p>
    <span style="display:block;margin-top:.9rem;font-size:.82rem;font-weight:700;color:#7658d6">RESULT: Iris enables cleanly</span>
  </article>
  <article style="position:relative;padding:1.25rem;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.06)">
    <span style="display:inline-grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:#7658d6;color:#fff;font-weight:800">2</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.05rem">Create</h3>
    <p style="margin:0;line-height:1.55;opacity:.8">Run <code>/iris create name=demo type=overworld seed=1337</code>.</p>
    <span style="display:block;margin-top:.9rem;font-size:.82rem;font-weight:700;color:#7658d6">RESULT: a managed world exists</span>
  </article>
  <article style="position:relative;padding:1.25rem;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.06)">
    <span style="display:inline-grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:#7658d6;color:#fff;font-weight:800">3</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.05rem">Verify</h3>
    <p style="margin:0;line-height:1.55;opacity:.8">Teleport in, inspect the terrain, and confirm the expected pack and seed.</p>
    <span style="display:block;margin-top:.9rem;font-size:.82rem;font-weight:700;color:#7658d6">RESULT: new chunks are Iris terrain</span>
  </article>
  <article style="position:relative;padding:1.25rem;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.06)">
    <span style="display:inline-grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:#0b8f82;color:#fff;font-weight:800">4</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.05rem">Author</h3>
    <p style="margin:0;line-height:1.55;opacity:.8">Open a Studio world and edit the live pack with generated VSCode schemas.</p>
    <span style="display:block;margin-top:.9rem;font-size:.82rem;font-weight:700;color:#0b8f82">NEXT: build your own dimension</span>
  </article>
</section>

[Read the complete getting-started guide →](/iris/02-getting-started)

## Layout 5 — Compatibility dashboard {#layout-5}

**Best for:** requirements, current support, release readiness, or a project
status overview. The top row answers “will this run?” at a glance.

<section aria-label="Iris compatibility" style="border:1px solid rgba(127,127,127,.28);border-radius:18px;overflow:hidden">
  <header style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;padding:1.15rem 1.25rem;background:rgba(118,88,214,.13)">
    <div>
      <strong style="display:block;font-size:1.15rem">Compatibility snapshot</strong>
      <span style="opacity:.72">Current Iris documentation target</span>
    </div>
    <span style="padding:.4rem .75rem;border-radius:999px;background:#16835b;color:#fff;font-weight:700">● Documented</span>
  </header>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:rgba(127,127,127,.22)">
    <div style="padding:1.15rem;background:var(--v-background-base,#fff);color:inherit">
      <span style="display:block;font-size:.75rem;letter-spacing:.07em;opacity:.65">MINECRAFT</span>
      <strong style="display:block;margin-top:.25rem;font-size:1.3rem">26.2</strong>
    </div>
    <div style="padding:1.15rem;background:var(--v-background-base,#fff);color:inherit">
      <span style="display:block;font-size:.75rem;letter-spacing:.07em;opacity:.65">JAVA</span>
      <strong style="display:block;margin-top:.25rem;font-size:1.3rem">25</strong>
    </div>
    <div style="padding:1.15rem;background:var(--v-background-base,#fff);color:inherit">
      <span style="display:block;font-size:.75rem;letter-spacing:.07em;opacity:.65">BUKKIT LOAD</span>
      <strong style="display:block;margin-top:.25rem;font-size:1.3rem">STARTUP</strong>
    </div>
    <div style="padding:1.15rem;background:var(--v-background-base,#fff);color:inherit">
      <span style="display:block;font-size:.75rem;letter-spacing:.07em;opacity:.65">ADMIN NODE</span>
      <strong style="display:block;margin-top:.25rem;font-size:1.05rem"><code>iris.all</code></strong>
    </div>
  </div>
  <div style="padding:1.2rem">
    <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.7rem"><span style="color:#16835b">●</span><strong>Plugin jar:</strong><span>Paper family, Spigot, CraftBukkit, and Folia</span></div>
    <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.7rem"><span style="color:#16835b">●</span><strong>Mod jars:</strong><span>Fabric, Forge, and NeoForge</span></div>
    <div style="display:flex;align-items:flex-start;gap:.65rem"><span style="color:#c27118">▲</span><span><strong>Platform difference:</strong> exact vanilla-slot <code>/iris replace</code> is Paper-family only; Spigot still supports managed <code>iris:*</code> worlds.</span></div>
  </div>
</section>

`var(--v-background-base, #fff)` uses the Wiki.js theme value when present and
falls back safely. For stronger dark-mode control, use the class-based version
below.

## Layout 6 — Command center {#layout-6}

**Best for:** a compact command overview. Show common tasks here, then link to
the exhaustive reference instead of copying the entire command tree.

<section aria-label="Common Iris commands" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));border:1px solid rgba(127,127,127,.28);border-radius:18px;overflow:hidden">
  <aside style="padding:1.25rem;background:linear-gradient(180deg,rgba(118,88,214,.18),rgba(118,88,214,.05))">
    <span style="display:block;font-size:.75rem;font-weight:800;letter-spacing:.08em;color:#7658d6">COMMAND PALETTE</span>
    <h3 style="margin:.4rem 0 1rem">Common jobs</h3>
    <a href="#command-create" style="display:block;padding:.55rem .7rem;margin-bottom:.35rem;border-radius:8px;background:rgba(118,88,214,.15);color:inherit;text-decoration:none">Create a world</a>
    <a href="#command-pregen" style="display:block;padding:.55rem .7rem;margin-bottom:.35rem;border-radius:8px;color:inherit;text-decoration:none">Pregenerate terrain</a>
    <a href="#command-studio" style="display:block;padding:.55rem .7rem;border-radius:8px;color:inherit;text-decoration:none">Open Studio</a>
  </aside>
  <div style="padding:1.25rem;min-width:0">
    <article id="command-create" style="padding-bottom:1rem;margin-bottom:1rem;border-bottom:1px solid rgba(127,127,127,.22)">
      <strong>Create a managed Bukkit world</strong>
      <pre style="overflow:auto;margin:.65rem 0;padding:.85rem;border-radius:10px;background:#181522;color:#f4f1ff"><code>/iris create name=demo type=overworld seed=1337</code></pre>
      <span style="opacity:.75">The world name must be absent. Omitting the type uses the configured default.</span>
    </article>
    <article id="command-pregen" style="padding-bottom:1rem;margin-bottom:1rem;border-bottom:1px solid rgba(127,127,127,.22)">
      <strong>Start Bukkit pregeneration</strong>
      <pre style="overflow:auto;margin:.65rem 0;padding:.85rem;border-radius:10px;background:#181522;color:#f4f1ff"><code>/iris pregen start radius=5000 world=demo center=0,0</code></pre>
      <span style="opacity:.75">Radius is measured in blocks. Monitor with <code>/iris pregen status</code>.</span>
    </article>
    <article id="command-studio">
      <strong>Open a temporary authoring world</strong>
      <pre style="overflow:auto;margin:.65rem 0;padding:.85rem;border-radius:10px;background:#181522;color:#f4f1ff"><code>/iris studio open overworld seed=1337</code></pre>
      <span style="opacity:.75">Studio reads the live pack and is discarded when closed.</span>
    </article>
  </div>
</section>

[Open the full command and permission reference →](/iris/04-commands-permissions)

## Layout 7 — Split feature panel {#layout-7}

**Best for:** explaining one important concept with a visual on one side and
the next action on the other.

<section aria-label="Iris pack model" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));align-items:stretch;border:1px solid rgba(127,127,127,.28);border-radius:20px;overflow:hidden">
  <div style="display:grid;place-items:center;min-height:280px;padding:2rem;background:radial-gradient(circle at 50% 30%,rgba(100,219,193,.28),transparent 42%),linear-gradient(145deg,#21143d,#113a43);color:#fff">
    <div style="width:min(100%,320px)">
      <div style="margin-left:0;padding:.75rem 1rem;border-radius:10px;background:#7858d6;box-shadow:0 10px 25px rgba(0,0,0,.25)"><strong>Dimension</strong></div>
      <div style="width:2px;height:22px;margin:auto;background:rgba(255,255,255,.45)"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.65rem">
        <div style="padding:.7rem;border:1px solid rgba(255,255,255,.3);border-radius:9px;background:rgba(255,255,255,.1);text-align:center">Regions</div>
        <div style="padding:.7rem;border:1px solid rgba(255,255,255,.3);border-radius:9px;background:rgba(255,255,255,.1);text-align:center">Biomes</div>
        <div style="padding:.7rem;border:1px solid rgba(255,255,255,.3);border-radius:9px;background:rgba(255,255,255,.1);text-align:center">Generators</div>
        <div style="padding:.7rem;border:1px solid rgba(255,255,255,.3);border-radius:9px;background:rgba(255,255,255,.1);text-align:center">Structures</div>
      </div>
    </div>
  </div>
  <div style="padding:clamp(1.4rem,4vw,2.5rem)">
    <span style="font-size:.75rem;font-weight:800;letter-spacing:.08em;color:#0b8f82">MENTAL MODEL</span>
    <h3 style="margin:.45rem 0 .8rem;font-size:clamp(1.4rem,3vw,2rem)">Start with the dimension</h3>
    <p style="line-height:1.65">A dimension is the root configuration for one world type. It defines the height range, generation modes, regions, and native content that Iris imports.</p>
    <ul>
      <li>One dimension file describes one world's rules.</li>
      <li>Regions divide the map; biomes fill regions.</li>
      <li>Generators produce the terrain height.</li>
    </ul>
    <a href="/iris/11-dimensions" style="display:inline-block;margin-top:.5rem;padding:.7rem 1rem;border-radius:9px;background:#0b8f82;color:#fff;font-weight:700;text-decoration:none">Understand dimensions →</a>
  </div>
</section>

Because the two columns use `auto-fit`, the explanation stacks beneath the
visual when each side can no longer keep its minimum width.

## Layout 8 — Vertical timeline {#layout-8}

**Best for:** release flows, world lifecycle, migrations, or “what happens
next” explanations.

<section aria-label="Iris production lifecycle" style="max-width:760px;margin:0 auto">
  <article style="position:relative;margin-left:1rem;padding:0 0 1.5rem 2rem;border-left:2px solid rgba(118,88,214,.45)">
    <span aria-hidden="true" style="position:absolute;left:-.62rem;top:0;display:grid;place-items:center;width:1.15rem;height:1.15rem;border:3px solid var(--v-background-base,#fff);border-radius:50%;background:#7658d6"></span>
    <span style="font-size:.75rem;font-weight:800;color:#7658d6">AUTHOR</span>
    <h3 style="margin:.2rem 0 .35rem;font-size:1.05rem">Build and validate the live pack</h3>
    <p style="margin:0;opacity:.78">Use Studio, schemas, and pack validation before a production world exists.</p>
  </article>
  <article style="position:relative;margin-left:1rem;padding:0 0 1.5rem 2rem;border-left:2px solid rgba(118,88,214,.45)">
    <span aria-hidden="true" style="position:absolute;left:-.62rem;top:0;display:grid;place-items:center;width:1.15rem;height:1.15rem;border:3px solid var(--v-background-base,#fff);border-radius:50%;background:#7658d6"></span>
    <span style="font-size:.75rem;font-weight:800;color:#7658d6">CREATE</span>
    <h3 style="margin:.2rem 0 .35rem;font-size:1.05rem">Snapshot the pack into the world</h3>
    <p style="margin:0;opacity:.78">Iris copies the selected pack into <code>&lt;world&gt;/iris/pack</code>.</p>
  </article>
  <article style="position:relative;margin-left:1rem;padding:0 0 1.5rem 2rem;border-left:2px solid rgba(11,143,130,.5)">
    <span aria-hidden="true" style="position:absolute;left:-.62rem;top:0;display:grid;place-items:center;width:1.15rem;height:1.15rem;border:3px solid var(--v-background-base,#fff);border-radius:50%;background:#0b8f82"></span>
    <span style="font-size:.75rem;font-weight:800;color:#0b8f82">GENERATE</span>
    <h3 style="margin:.2rem 0 .35rem;font-size:1.05rem">Run from the world snapshot</h3>
    <p style="margin:0;opacity:.78">New chunks use the copied pack, seed, and current engine artifact.</p>
  </article>
  <article style="position:relative;margin-left:1rem;padding:0 0 0 2rem;border-left:2px solid transparent">
    <span aria-hidden="true" style="position:absolute;left:-.62rem;top:0;display:grid;place-items:center;width:1.15rem;height:1.15rem;border:3px solid var(--v-background-base,#fff);border-radius:50%;background:#ce7218"></span>
    <span style="font-size:.75rem;font-weight:800;color:#ce7218">CHANGE</span>
    <h3 style="margin:.2rem 0 .35rem;font-size:1.05rem">Use the pack-management workflow</h3>
    <p style="margin:0;opacity:.78">Editing the original live pack does not alter an existing production snapshot.</p>
  </article>
</section>

The line is a border on each item, and the marker is absolutely positioned
relative to that item. The final item hides its continuing line.

## Layout 9 — Platform comparison cards {#layout-9}

**Best for:** helping the reader select one of a few mutually exclusive
options. Put the recommendation in the heading instead of hiding it below a
large table.

<section aria-label="Choose an Iris artifact" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem;align-items:stretch">
  <article style="display:flex;flex-direction:column;padding:1.25rem;border:2px solid #7658d6;border-radius:16px;background:rgba(118,88,214,.08)">
    <span style="align-self:flex-start;padding:.3rem .6rem;border-radius:999px;background:#7658d6;color:#fff;font-size:.72rem;font-weight:800">REFERENCE TARGET</span>
    <h3 style="margin:.9rem 0 .25rem">Paper family</h3>
    <p style="margin:.2rem 0 1rem;opacity:.78">Paper, Purpur, Leaf, or Canvas using the plugin jar.</p>
    <ul style="padding-left:1.1rem;line-height:1.7">
      <li>Full managed world workflow</li>
      <li>Exact vanilla-slot replacement</li>
      <li>Broad Bukkit integrations</li>
    </ul>
    <a href="/iris/01-installation-platforms" style="display:block;margin-top:auto;padding:.7rem;border-radius:9px;background:#7658d6;color:#fff;text-align:center;text-decoration:none;font-weight:700">Install the plugin jar</a>
  </article>
  <article style="display:flex;flex-direction:column;padding:1.25rem;border:1px solid rgba(127,127,127,.28);border-radius:16px;background:rgba(127,127,127,.06)">
    <span style="align-self:flex-start;padding:.3rem .6rem;border-radius:999px;background:rgba(127,127,127,.18);font-size:.72rem;font-weight:800">REGION SCHEDULER</span>
    <h3 style="margin:.9rem 0 .25rem">Folia</h3>
    <p style="margin:.2rem 0 1rem;opacity:.78">The same plugin jar with region-safe scheduling.</p>
    <ul style="padding-left:1.1rem;line-height:1.7">
      <li>Live managed world creation</li>
      <li>Folia-aware scheduling</li>
      <li>Platform-specific lifecycle notes</li>
    </ul>
    <a href="/iris/30-platform-differences" style="display:block;margin-top:auto;padding:.7rem;border:1px solid rgba(127,127,127,.35);border-radius:9px;color:inherit;text-align:center;text-decoration:none;font-weight:700">Review differences</a>
  </article>
  <article style="display:flex;flex-direction:column;padding:1.25rem;border:1px solid rgba(127,127,127,.28);border-radius:16px;background:rgba(127,127,127,.06)">
    <span style="align-self:flex-start;padding:.3rem .6rem;border-radius:999px;background:rgba(127,127,127,.18);font-size:.72rem;font-weight:800">NATIVE MOD LOADERS</span>
    <h3 style="margin:.9rem 0 .25rem">Fabric / Forge / NeoForge</h3>
    <p style="margin:.2rem 0 1rem;opacity:.78">Choose the jar built for the server's exact loader.</p>
    <ul style="padding-left:1.1rem;line-height:1.7">
      <li>Same core generation engine</li>
      <li>Optional client HUD</li>
      <li>Brigadier command forms</li>
    </ul>
    <a href="/iris/01-installation-platforms" style="display:block;margin-top:auto;padding:.7rem;border:1px solid rgba(127,127,127,.35);border-radius:9px;color:inherit;text-align:center;text-decoration:none;font-weight:700">Choose a mod jar</a>
  </article>
</section>

`display: flex; flex-direction: column` plus `margin-top: auto` keeps the action
buttons aligned even when descriptions have different lengths.

## Layout 10 — Operations checklist {#layout-10}

**Best for:** deployment gates, maintenance windows, destructive procedures,
and runbooks. The visual hierarchy separates readiness from the dangerous
action.

<section aria-label="Iris production readiness" style="border:1px solid rgba(127,127,127,.28);border-radius:18px;overflow:hidden">
  <div style="display:flex;gap:1rem;align-items:flex-start;padding:1.25rem;background:rgba(11,143,130,.11)">
    <span aria-hidden="true" style="display:grid;place-items:center;flex:0 0 2.4rem;height:2.4rem;border-radius:50%;background:#0b8f82;color:#fff;font-weight:900">✓</span>
    <div>
      <strong style="display:block;font-size:1.12rem">Pre-change gate</strong>
      <span style="opacity:.78">Complete every check before replacing or deleting a managed world.</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:.75rem;padding:1.25rem">
    <label style="display:flex;gap:.7rem;align-items:flex-start;padding:.85rem;border-radius:10px;background:rgba(127,127,127,.07)"><input type="checkbox" disabled> <span><strong>Back up</strong><br><small>World folder, Iris settings, and the exact pack snapshot</small></span></label>
    <label style="display:flex;gap:.7rem;align-items:flex-start;padding:.85rem;border-radius:10px;background:rgba(127,127,127,.07)"><input type="checkbox" disabled> <span><strong>Record identity</strong><br><small>Platform artifact, Iris build, pack bytes, and seed</small></span></label>
    <label style="display:flex;gap:.7rem;align-items:flex-start;padding:.85rem;border-radius:10px;background:rgba(127,127,127,.07)"><input type="checkbox" disabled> <span><strong>Move players</strong><br><small>Evacuate the target world before lifecycle changes</small></span></label>
    <label style="display:flex;gap:.7rem;align-items:flex-start;padding:.85rem;border-radius:10px;background:rgba(127,127,127,.07)"><input type="checkbox" disabled> <span><strong>Plan rollback</strong><br><small>Know the restore point and exact validation command</small></span></label>
  </div>
  <div style="padding:1rem 1.25rem;border-top:1px solid rgba(193,56,56,.25);background:rgba(193,56,56,.1)">
    <strong style="color:#c13838">Destructive boundary:</strong>
    <span> <code>/iris remove &lt;world&gt; delete=true</code> deletes the managed world by default. Treat the backup as part of the command.</span>
  </div>
</section>

The checkboxes are disabled on purpose: this is a readable runbook, not a
persistent task application. Use plain list markers if your sanitizer removes
form controls.

## CSS building blocks {#css-building-blocks}

These small declarations account for most of the layouts above.

### Responsive card grid

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
gap: 1rem;
```

`auto-fit` fills the row; `minmax()` prevents unreadably narrow cards; `1fr`
shares remaining space.

### Fluid spacing and type

```css
padding: clamp(1.25rem, 4vw, 3rem);
font-size: clamp(1.8rem, 6vw, 4rem);
```

The first value is the minimum, the middle value scales with the viewport, and
the final value is the maximum.

### Theme-tolerant neutral card

```css
color: inherit;
background: rgba(127, 127, 127, 0.07);
border: 1px solid rgba(127, 127, 127, 0.26);
border-radius: 14px;
```

Mid-gray with low opacity adapts to both light and dark backgrounds. Do not use
faint gray text for essential information; `opacity` also reduces contrast.

### Equal-height action cards

```css
display: flex;
flex-direction: column;
height: 100%;
```

Then give the final action `margin-top: auto`. This pins it to the bottom.

### Horizontally scrollable code

```css
min-width: 0;
overflow-x: auto;
white-space: pre;
```

`min-width: 0` matters when the code block is inside a CSS grid or flex item.

### Accessible focus and motion

Inline styles cannot express pseudo-classes or user preferences. Put these in
the administrator stylesheet when using custom interactive cards:

```css
.volmit-gallery a:focus-visible {
  outline: 3px solid #52d7c2;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: no-preference) {
  .volmit-gallery .interactive-card {
    transition: transform 160ms ease, box-shadow 160ms ease;
  }

  .volmit-gallery .interactive-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
  }
}
```

Hover is enhancement only. Never hide content or the only action until hover.

## Class-based stylesheet {#class-based-stylesheet}

For a reusable production design, an administrator can place the following
scoped CSS in **Administration → Theme → CSS Override**. The
`.volmit-gallery` prefix limits collisions, but the setting is still global to
the wiki.

```css
.volmit-gallery {
  --vg-accent: #7658d6;
  --vg-accent-2: #0b8f82;
  --vg-surface: rgba(127, 127, 127, 0.07);
  --vg-border: rgba(127, 127, 127, 0.26);
  --vg-radius: 16px;
}

.volmit-gallery .vg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.volmit-gallery .vg-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 1.25rem;
  color: inherit;
  background: var(--vg-surface);
  border: 1px solid var(--vg-border);
  border-radius: var(--vg-radius);
}

.volmit-gallery a.vg-card {
  text-decoration: none;
}

.volmit-gallery .vg-card > :last-child {
  margin-bottom: 0;
}

.volmit-gallery .vg-action {
  display: inline-block;
  align-self: flex-start;
  margin-top: auto;
  padding: 0.7rem 1rem;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  background: var(--vg-accent);
  border-radius: 9px;
}

.volmit-gallery .vg-command-layout {
  display: grid;
  grid-template-columns: minmax(180px, 0.7fr) minmax(260px, 1.3fr);
}

.volmit-gallery a:focus-visible {
  outline: 3px solid #52d7c2;
  outline-offset: 3px;
}

@media (max-width: 720px) {
  .volmit-gallery .vg-command-layout {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .volmit-gallery .interactive-card {
    transition: transform 160ms ease, box-shadow 160ms ease;
  }

  .volmit-gallery .interactive-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
  }
}

@media (prefers-color-scheme: dark) {
  .volmit-gallery {
    --vg-surface: rgba(255, 255, 255, 0.06);
    --vg-border: rgba(255, 255, 255, 0.16);
  }
}
```

Example class-only markup:

```html
<section class="volmit-gallery">
  <div class="vg-grid">
    <article class="vg-card">
      <h3>Author a pack</h3>
      <p>Learn the content model, then build a minimal dimension.</p>
      <a class="vg-action" href="/iris/05-concepts-pack-layout">Start authoring</a>
    </article>
  </div>
</section>
```

> CSS Override affects every page and must be managed outside this Git-backed
> Markdown repository. Keep the page understandable if the custom stylesheet
> is unavailable, and record any required global CSS in the repository.
{.is-warning}

## Composition recipes {#composition-recipes}

| Page type | Recommended combination |
|---|---|
| Plugin landing page | Layout 1 hero → Layout 2 paths → Layout 3 features → ordinary support links |
| Installation guide | Short intro → Layout 5 requirements → Layout 4 steps → Wiki.js warnings |
| Command reference | Ordinary table of contents → Layout 6 common jobs → searchable Markdown tables |
| Concept guide | Layout 7 split explanation → normal prose and examples → Layout 8 lifecycle |
| Platform chooser | Layout 9 cards → detailed comparison table → installation steps |
| Destructive runbook | Layout 10 gate → exact command → verification → rollback |
{.dense}

Do not use a hero, bento grid, dashboard, timeline, and comparison cards merely
because they exist. A strong page normally needs one primary visual pattern and
one supporting pattern; the rest should be headings, prose, tables, and code.

## Before publishing {#before-publishing}

- Test the page at phone, tablet, and desktop widths.
- Tab through every link and make sure focus is visible.
- Confirm text remains readable in light and dark Wiki.js themes.
- Keep a real heading structure; cards do not replace document navigation.
- Use verified plugin data and exact command syntax.
- Prefer a standard Wiki.js alert for critical safety information.
- Check that the page still makes sense if custom CSS does not load.
- Link to the full reference instead of duplicating large tables.
{.grid-list}

For syntax, renderer modules, Wiki.js attributes, diagrams, tabs, images, and
other non-layout features, use [Wiki.js Page Examples](/wiki-page-examples).
