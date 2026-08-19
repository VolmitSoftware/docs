---
title: "Repository readme"
description: "How this documentation repository is structured"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "meta"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

This repository is the source for the Volmit Software documentation wiki.
The repository syncs with Wiki.js in both directions.

## Layout

File paths map to wiki page paths. `iris.md` is `/iris`.
`iris/commands.md` is `/iris/commands`.

## Where content comes from

**This repository is the single source of truth for all plugin
documentation.** The plugin repositories have no `docs/` trees. This
repository holds every page. That includes numbered plugin docs, landing
pages, the BileTools set, HiddenOre operator pages, and `home.md`.

Each plugin repository has an `AGENTS.md` file. If a change alters a
feature, command, permission, setting, config shape, schema, or API
surface, update the matching page here. Make that update in the same
workstream. These pages document the Minecraft 26.2 branches of each
plugin.

## Page format

Numbered plugin pages live at `<plugin>/NN-slug.md`. Newcomers read the
pages in number order. API pages keep the highest numbers. HiddenOre and
VolmLib put API pages under `<plugin>/api/`.

Every page has Wiki.js YAML frontmatter. The fields are title, description,
published, date, tags, editor, and dateCreated. Pages have no leading H1.
The title comes from the frontmatter. Cross-references are absolute wiki
paths such as
`[04 - Commands & Permissions](/adapt/04-commands-permissions)`. Bump
`date` when you edit a page.

## Contributing

Fork the repository. Edit the markdown. Open a pull request. See
`contributing.md`.
