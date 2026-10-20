---
title: "Repository readme"
description: "How this documentation repository is structured"
published: true
date: 2026-10-20T02:00:00.000Z
tags: "meta"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

This repository contains the Volmit Software documentation wiki. It syncs with
Wiki.js in both directions.

## Layout

File paths map to wiki page paths. For example, `shapedportals.md` is
`/shapedportals` and `shapedportals/00-overview.md` is
`/shapedportals/00-overview`.

## Where content comes from

This repository is the source of truth for plugin and Multiplexor documentation.
Product repositories link here instead of maintaining separate guides.
Multiplexor pages live at `servermultiplexor.md` and `servermultiplexor/NN-slug.md`.

When a plugin or Multiplexor change affects behavior, commands, permissions, configuration,
schemas, or APIs, update the matching page here at the same time. Legacy pages
must state the version they cover.

## Page format

Numbered plugin pages live at `<plugin>/NN-slug.md` in reading order. HiddenOre
and VolmLib keep API pages under `<plugin>/api/`.

Every page needs Wiki.js YAML frontmatter with `title`, `description`,
`published`, `date`, `tags`, `editor`, and `dateCreated`. Do not add a leading
H1 because Wiki.js renders the title from frontmatter. Use absolute wiki paths
for internal links and update `date` whenever a page changes.

See [Wiki.js page examples](/wiki-page-examples) for supported Markdown and
[Wiki.js CSS layouts](/wiki-css-layout-examples) for responsive page patterns.

## Contributing

See [Contributing](/contributing).

## Theme assets

The Graphite theme uses `theme/minimal-brutalism.css`, `theme/minimal-brutalism.js`, and `theme/projects.json`. The stylesheet and script retain their deployed asset URLs. Wiki.js Git storage imports these files when the repository syncs. Gloss recordings live in `gloss-assets/demos/` and use the same asset import as the other plugin media directories.

The homepage lists the published projects from `home.md`. Each project’s landing page supplies its documentation navigation, including section and subgroup headings. After adding a project or changing landing-page links, regenerate and validate the catalog:

```sh
node tools/build-theme-data.mjs
node tools/build-theme-data.mjs --check
```

In Wiki.js **Administration > Theme > Head HTML Injection**, include one stylesheet and one script reference. Update the version value when publishing theme changes. Browsers keep the previous URL for several hours, so a Git sync alone does not refresh a browser that already loaded the same `?v=` value.

```html
<link rel="stylesheet" href="/theme/minimal-brutalism.css?v=graphite-20261019-video">
<script src="/theme/minimal-brutalism.js?v=graphite-20261019-video"></script>
```

Keep the script in the head without `defer` or `async` so navigation initialization starts before the first page render. Preserve unrelated head content such as favicon settings. The theme uses system fonts and a local subset of Lucide 0.468.0 SVG icons. The license is in `theme/lucide-LICENSE.txt`.

### Navigation and layout

The project picker is searchable. On project pages, the left header field searches the whole site and the right field searches the current project. The homepage filters plugins and developer tools and leads with Iris, Adapt, Wormholes, Gloss, and React. Project landing pages and reference pages share a documentation sidebar, which opens as a drawer on phones. Breadcrumbs show the current project and section. Reference pages end with previous and next links in catalog order.

The theme derives background, surface, border, and text colors from the current project's catalog color. Dark mode uses deep surfaces and subdued accents; light mode uses faint tints with dark text. Pages without a project color use neutral gray. The header theme switch saves the reader's choice in the browser; new visitors use the wiki's configured mode. Project indexes use compact filled link targets. The Iris overview pairs its reference details with a terrain image linked to the biome catalog. The stylesheet works independently of the navigation catalog. If the catalog is unavailable, the original page content remains readable.

Pages use the available width with 16–32px outer gutters and 16px body text. Project landing pages place section headings above compact, aligned link columns. Links stack on phones with larger tap targets. Callouts use inline severity labels without bordered cards. Catalog tables and link-led lists with one destination per row use full-row link targets, including their descriptions. On phones, catalog details stack below each title with labels from the column headers. Reference pages share one outline between the desktop rail and the mobile **On this page** popup. The popup supports keyboard focus, Escape, and a close button. The first keyboard focus target skips to the current article. Sidebar sections and scroll position persist within the current project for the browser tab.

Reference table text wraps on phones. Wide tables scroll within the article, with every column moving together so the first column does not obscure the others.

### Demonstrations

Wormholes demonstrations with both client modes have **No client mod** and **Client mod** tabs. Client-only demonstrations show a **Client mod** heading. Each demonstration has a **Camera** dropdown for its available perspectives. Camera selection stays synchronized with Adapt's perspective tabs and is remembered across documentation pages. Each Wormholes demonstration selects its client mode independently.

Gloss demonstrations label Minecraft client footage and browser editor footage separately. Single-view clips use the same playback controls. Paired client clips add **First person** and **Third person** tabs.

Demonstrations use half the article width on desktop and the full article width on phones and tablets. Visible clips autoplay muted and loop, including when reduced motion is enabled. Readers can pause or enable audio with the playback controls. Hidden, offscreen, and background clips pause.

### Local validation

Use Node.js 20 or newer. Install the locked development dependencies and validate the theme, navigation catalog, and behavior tests:

```sh
npm ci
npm run check
```

Use `none` for plain-text code fences so Wiki.js does not request an unsupported syntax grammar.

From this repository, run the local documentation preview:

```sh
node tools/theme-preview.mjs
```

Open `http://127.0.0.1:4177`. Set `PORT` to use another port. Markdown, assets, the theme, and the navigation catalog come from this checkout; reload a page to see edits. The Wiki.js application shell and search use the hosted wiki, so the preview requires an internet connection and search results reflect published content. Add `?plain=1` to view local pages with the original Wiki.js styling.
