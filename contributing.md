---
title: "Contributing"
description: "How to contribute to this documentation"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "meta"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

This wiki uses a Git repository. The wiki syncs in both directions with
[VolmitSoftware/docs](https://github.com/VolmitSoftware/docs).

## Editing

**Through Wiki.js.** Use the pencil icon on any page. The next sync commits
your change.

**Through a pull request.** Fork the repository, edit the `.md` file, and open a
pull request. File paths map to wiki paths. For example,
`shapedportals/00-overview.md` is `/shapedportals/00-overview`.

## Where content comes from

This repository is the source of truth for plugin documentation. Plugin
repositories do not contain separate documentation trees.

When a plugin change affects behavior, commands, permissions, configuration,
schemas, or APIs, update the matching page here at the same time.

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

Update `title`, `description`, and `tags` as needed. Bump `date` when a page
changes and preserve `dateCreated`.

## Conventions

- Use [Wiki.js page examples](/wiki-page-examples) for syntax and renderer
  features.
- Use [Wiki.js CSS layouts](/wiki-css-layout-examples) for responsive layout
  patterns.
- Use absolute internal links such as `/shapedportals/00-overview`. Do not link
  to a `.md` path.
- Write command syntax as `<required>` and `[optional]`.
- Mark a destructive operation with `{.is-warning}` or `{.is-danger}`.
- Wiki.js also supports `{.links-list}`, `{.grid-list}`, `{.tabset}`, `{.dense}`,
  and `{.is-info}` / `{.is-success}` / `{.is-warning}` / `{.is-danger}`.
- Do not document behavior that you have not verified against the source.

See [Repository readme](/README) for the file layout and page rules.
