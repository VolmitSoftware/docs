---
title: "HiddenOre — Commands & Permissions"
description: "The /hiddenore command tree and permission node"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "hiddenore, commands, permissions"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Commands

| Command | Description |
|---|---|
| `/hiddenore reload` | Reload HiddenOre configuration and language files |
| `/hiddenore debug` | Toggle ore debug mode for yourself |

Both subcommands require `hiddenore.admin`.


## Permissions

| Node | Default | Description |
|---|---|---|
| `hiddenore.admin` | `op` | Allows use of all HiddenOre commands |

## Notes

**`reload`** reads `hiddenore.yml` and the language files again. It rebuilds the
runtime configuration. If the reload throws, HiddenOre logs the failure.
HiddenOre keeps the previous runtime configuration. It does not leave the server
half-applied.

Reload does not migrate world data. In `seeded` mode, reordering `drops:` keeps
layouts stable. Adding or removing unrelated rules preserves each retained
rule's layout except at direct overlaps. Changing an item rule's material or
spatial generation fields gives that rule a new undiscovered layout. Changing
only Fortune, tool tiers, or experience does not.

**`debug`** is per-player and player-only. You cannot toggle it from console.
