---
title: "Contributing"
description: "How to contribute to this documentation"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "meta"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

This wiki uses a Git repository. The wiki syncs in both directions with
[VolmitSoftware/docs](https://github.com/VolmitSoftware/docs).

## Editing

**Through Wiki.js.** Use the pencil icon on any page. The next sync commits
your change.

**Through a pull request.** Fork the repository. Edit the `.md` file. Open
a pull request. File paths map to wiki paths. `iris/commands.md` is
`/iris/commands`.

## Where content comes from

This repository is the source of truth for all plugin documentation. The
plugin repositories have no `docs/` trees. Edit every page here. That
includes numbered plugin pages, landing pages, the BileTools set, HiddenOre
operator pages, and `home.md`.

Each plugin repository has an `AGENTS.md` file. If a change alters a
feature, command, permission, setting, config shape, schema, or API
surface, update the matching page here. Make that update in the same
workstream.

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

Edit only `title`, `description`, and `tags`. Do not change the dates.

## Conventions

- Use absolute internal links such as `/iris/commands`. Do not use `iris/commands.md`.
- Write command syntax as `<required>` and `[optional]`.
- Mark a destructive operation with `{.is-warning}` or `{.is-danger}`.
- Wiki.js also supports `{.links-list}`, `{.grid-list}`, `{.tabset}`, `{.dense}`,
  and `{.is-info}` / `{.is-success}` / `{.is-warning}` / `{.is-danger}`.
- Do not document behavior that you have not verified against the source.

## Source branches

Iris, Adapt, and React use the **`unification`** branch. They do not use
`master`. The `master` branches are older. Those branches target earlier
Minecraft versions. Gloss, HiddenOre, BileTools, and Wormholes use
`master`.
