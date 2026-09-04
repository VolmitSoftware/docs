---
title: "Repository readme"
description: "How this documentation repository is structured"
published: true
date: 2026-09-04T00:00:00.000Z
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
