---
title: "Repository readme"
description: "How this documentation repository is structured"
published: true
date: 2026-08-12T00:00:00.000Z
tags: "meta"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

# Volmit Software Documentation

Source for the Volmit Software documentation wiki, synced bi-directionally with Wiki.js.

## Layout

File paths map directly to wiki page paths. `iris.md` is `/iris`; `iris/commands.md` is
`/iris/commands`.

## Where content comes from

**This repository is the single source of truth for all plugin documentation.** The plugin
repositories carry no `docs/` trees; every page — numbered plugin docs, landing pages, the
BileTools set, HiddenOre's operator pages, `home.md` — is written and maintained here directly.

Each plugin repo's `AGENTS.md` requires that any change altering a feature, command,
permission, setting, config shape, schema, or API surface updates the matching page here in
the same workstream. Pages document the modern Minecraft 26.2 branches of each plugin.

## Page format

Numbered plugin pages live at `<plugin>/NN-slug.md` (newcomer reading order; API pages keep
the highest numbers; HiddenOre and VolmLib nest API pages under `<plugin>/api/`). Every page
carries Wiki.js YAML frontmatter (title, description, published, date, tags, editor,
dateCreated) and no leading H1 — the title renders from frontmatter. Cross-references are
absolute wiki paths such as `[04 - Commands & Permissions](/adapt/04-commands-permissions)`.
Bump `date` when editing a page.

## Contributing

Fork, edit the markdown, open a pull request. See `contributing.md`.
