---
title: "Contributing"
description: "How to contribute to this documentation"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "meta"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

# Contributing

This wiki is backed by a Git repository and syncs bi-directionally with
[VolmitSoftware/docs](https://github.com/VolmitSoftware/docs).

## Editing

**Through Wiki.js** — use the pencil icon on any page. Your change commits on the next sync.

**Through a pull request** — fork the repo, edit the `.md` file, open a PR. File paths map
directly to page paths: `iris/commands.md` is `/iris/commands`.

## Where content comes from

Most pages are **ported from `docs/` directories inside the plugin repositories**. Iris, Adapt,
React, Wormholes and HoloUI each maintain their own documentation alongside the code.

> Editing a ported page here will be overwritten the next time the docs are re-imported from
> upstream. Fix those pages in the plugin repository instead, then re-run the import.
{.is-warning}

Pages written specifically for this wiki — the BileTools set, HiddenOre's operator pages, and
the plugin landing pages — can be edited here directly.

## Frontmatter

```
---
title: Page Title
description: One-line summary
published: true
date: 2026-08-09T00:00:00.000Z
tags: plugin-name, topic
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
```

Edit only `title`, `description` and `tags`. Leave the dates alone.

## Conventions

- Absolute internal links: `/iris/commands`, not `iris/commands.md`
- Command syntax: `<required>`, `[optional]`
- Destructive operations get a `{.is-warning}` or `{.is-danger}` callout
- Wiki.js extras available: `{.links-list}`, `{.grid-list}`, `{.tabset}`, `{.dense}`,
  and `{.is-info}` / `{.is-success}` / `{.is-warning}` / `{.is-danger}`
- Do not document behaviour you have not verified against the source

## Source branches

Iris, Adapt and React are documented from their **`unification`** branch, not `master`.
The `master` branches are older and target much earlier Minecraft versions. HoloUI, HiddenOre,
BileTools and Wormholes are documented from `master`.
