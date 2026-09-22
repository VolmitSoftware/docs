---
title: "Repository readme"
description: "How this documentation repository is structured"
published: true
date: 2026-09-22T00:00:00.000Z
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

The Graphite theme uses `theme/minimal-brutalism.css`, `theme/minimal-brutalism.js`, and `theme/projects.json`. The stylesheet and script retain their deployed asset URLs. Wiki.js Git storage imports these files when the repository syncs.

The homepage lists the published projects from `home.md`. Each project’s landing page supplies its documentation navigation. After adding a project or changing landing-page links, regenerate and validate the catalog:

```sh
node tools/build-theme-data.mjs
node tools/build-theme-data.mjs --check
```

In Wiki.js **Administration > Theme > Head HTML Injection**, include one stylesheet and one deferred script reference. Update the version value when publishing theme changes:

```html
<link rel="stylesheet" href="/theme/minimal-brutalism.css?v=graphite-20260922">
<script src="/theme/minimal-brutalism.js?v=graphite-20260922" defer></script>
```

Preserve unrelated head content such as favicon settings. The theme uses system fonts and the wiki’s icon set. The project picker is searchable; the homepage filters plugins and developer tools. Project landing pages use section tabs, and reference pages use the project’s documentation sidebar. Light and dark preferences persist in the browser.

From this repository, run the local theme preview:

```sh
node tools/theme-preview.mjs
```

Open `http://127.0.0.1:4177`. Set `PORT` to use another port. The preview combines public wiki pages with the local theme and catalog. Add `?plain=1` to view the upstream styling.
