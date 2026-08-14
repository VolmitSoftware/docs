---
title: "HiddenOre — Commands & Permissions"
description: "The /hiddenore command tree and permission node"
published: true
date: 2026-08-14T00:00:00.000Z
tags: "hiddenore, commands, permissions"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Commands

| Command | Description |
|---|---|
| `/hiddenore reload` | Reload HiddenOre configuration and language files |
| `/hiddenore debug` | Toggle ore debug mode for yourself |

Both subcommands check `hiddenore.admin` at runtime in addition to the `plugin.yml`
declaration.

## Permissions

| Node | Default | Description |
|---|---|---|
| `hiddenore.admin` | `op` | Allows use of all HiddenOre commands |

## Notes

**`reload`** re-reads `config.yml` and the language files and rebuilds the runtime
configuration. If the reload throws, HiddenOre logs the failure and keeps the previous runtime
configuration active rather than leaving the server half-applied.

Reload does not migrate world data. In `seeded` mode, reordering `drops:` keeps layouts
stable. Adding or removing unrelated rules preserves each retained rule's pseudorandom layout
except at direct overlaps. Changing an item rule's material or spatial generation fields gives
that rule a new undiscovered layout; changing only Fortune, tool tiers, or experience does not.

**`debug`** is per-player and player-only; it cannot be toggled from console.
