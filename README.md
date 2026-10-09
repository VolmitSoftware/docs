---
title: "Repository readme"
description: "How this documentation repository is structured"
published: true
date: 2026-10-09T16:58:33.000Z
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
<link rel="stylesheet" href="/theme/minimal-brutalism.css?v=graphite-20261009-production">
<script src="/theme/minimal-brutalism.js?v=graphite-20261009-production"></script>
```

Keep the script in the head without `defer` or `async` so navigation initialization starts before the first page render. Preserve unrelated head content such as favicon settings. The theme uses system fonts and a local subset of Lucide 0.468.0 SVG icons; the license is in `theme/lucide-LICENSE.txt`. Each Wormholes demonstration has No client mod and Client mod tabs, plus a separate Camera dropdown for First person or Third person. Camera selection stays synchronized with Adapt's perspective tabs and is remembered across documentation pages. Each Wormholes demonstration selects its client mode independently. Gloss demonstrations label Minecraft client footage and browser editor footage separately. Single-view clips use the same playback controls; paired client clips add First person and Third person tabs. Visible clips autoplay muted and loop. Reduced-motion users start clips with the playback controls. Hidden, offscreen, and background clips pause. The project picker is searchable. On a project page the header search splits: site search stays on the left, and the right field searches only that project. The homepage filters plugins and developer tools and leads with Iris, Adapt, Wormholes, Gloss, and React. Project landing pages use section tabs, and reference pages use the project’s documentation sidebar. The page background is black. Surfaces use a short zinc scale, the header and project bar are frosted glass, and the rules around the current project use that project’s color. Body links stay rose. Its stylesheet applies independently of the navigation catalog; if the catalog is unavailable, the original page content remains readable.

Pages use the available width with 16–32px outer gutters. Callouts use inline severity labels without bordered cards. Catalog tables and link-led lists with one destination per row use full-row link targets, including their descriptions. On phones, catalog details stack below each title with labels from the column headers. Reference pages share one outline between the desktop rail and the mobile **On this page** popup. The popup supports keyboard focus, Escape, and a close button. The first keyboard focus target skips to the current article. Sidebar sections and scroll position persist within the current project for the browser tab.

Use Node.js 20 or newer. Install the locked development dependencies and validate the theme, navigation catalog, and behavior tests:

```sh
npm ci
npm run check
```

Use `none` for plain-text code fences so Wiki.js does not request an unsupported syntax grammar.

From this repository, run the local theme preview:

```sh
node tools/theme-preview.mjs
```

Open `http://127.0.0.1:4177`. Set `PORT` to use another port. The preview combines public wiki pages with the local theme and catalog. Add `?plain=1` to view the upstream styling.
