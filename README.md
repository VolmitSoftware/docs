# Volmit Software Documentation

Source for the Volmit Software documentation wiki. This repository is synced bi-directionally
with a Wiki.js instance.

## Layout

File paths map directly to wiki page paths:

| File | Page |
|---|---|
| `home.md` | `/home` (wiki homepage) |
| `iris.md` | `/iris` |
| `iris/commands.md` | `/iris/commands` |
| `hiddenore/api/events.md` | `/hiddenore/api/events` |

## Frontmatter

Every page carries a Wiki.js frontmatter block. Keep it. Edit only `title`, `description`,
and `tags`.

## Contributing

Fork, edit the markdown, open a pull request. See [Contributing](contributing.md).

## Generated content

Command tables, permission tables, and configuration references were extracted from the
plugin sources rather than written by hand. When a command or config key changes upstream,
regenerate the table instead of editing it here, or the two will drift.
