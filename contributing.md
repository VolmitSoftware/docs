---
title: Contributing
description: How to contribute to this documentation
published: true
date: 2026-08-09T00:00:00.000Z
tags: meta
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

This wiki is backed by a Git repository. Edits made in Wiki.js sync out to the repository, and
merged changes on the default branch sync back in.

## Editing through Wiki.js

If you have an account with edit rights, use the pencil icon on any page. Your change is
committed to the repository on the next sync.

## Editing through pull request

1. Fork [VolmitSoftware/docs](https://github.com/VolmitSoftware/docs).
2. Edit the relevant `.md` file. The file path maps directly to the page path —
   `iris/commands.md` is `/iris/commands`.
3. Open a pull request.

Once merged, the change appears in the wiki on the next sync.

## Frontmatter

Every page begins with a frontmatter block. Keep it intact — Wiki.js uses it for the page
title, description, and tags.

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

Only `title`, `description`, and `tags` should be edited by hand. Leave `date` and
`dateCreated` alone; Wiki.js maintains them.

## Conventions

- **Link internally with absolute paths.** `/iris/commands`, not `iris/commands.md`.
- **Command syntax:** `<required>`, `[optional]`.
- **Destructive operations get a callout.** Anything that deletes player data, purges
  entities, or reshuffles world state should carry a `>` blockquote warning.
- **Do not document behaviour you have not verified.** If a config key's effect is unclear
  from the source, say so rather than guessing.

## Pages generated from source

The command and permission tables were extracted from the plugin sources — `plugin.yml`
files and the annotated command classes. When a command changes upstream, the corresponding
table here needs regenerating rather than hand-editing, or the two will drift.
