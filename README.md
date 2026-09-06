---
title: "Repository readme"
description: "How this documentation repository is structured"
published: true
date: 2026-09-06T01:32:26.266Z
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

This repository is the source of truth for plugin documentation. Plugin
repositories do not contain separate documentation trees.

When a plugin change affects behavior, commands, permissions, configuration,
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

The wiki uses `theme/minimal-brutalism.css`, `theme/minimal-brutalism.js`, and the fonts under `home-assets/fonts/`. Serve these files at their matching root-relative URLs.

In Wiki.js **Administration > Theme**, use **Code Injection > Head HTML Injection**. These fields are part of the [Wiki.js theme configuration](https://github.com/requarks/wiki/blob/main/client/components/admin/admin-theme.vue).

Copy the contents of `theme/font-preloads.html` into the head field before this stylesheet and script:

```html
<link rel="stylesheet" href="/theme/minimal-brutalism.css">
<script src="/theme/minimal-brutalism.js" defer></script>
```

Keep one copy of each theme reference and preserve unrelated head content. Updating the repository does not insert the preload snippet into Wiki.js settings. The snippet preloads the main heading and body fonts. The text fonts use `font-display: optional` to prevent a late font replacement from shifting the page.

From this repository, run the local theme preview:

```sh
node tools/theme-preview.mjs
```

Open `http://127.0.0.1:4177`. Set `PORT` to use another port. The preview combines public wiki pages with local CSS, JavaScript, and font preloads. It removes the existing theme stylesheet reference before injection. Add `?plain=1` to view the upstream styling. Check desktop and mobile layouts in both color modes.
