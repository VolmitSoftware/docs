---
title: HiddenOre — Commands & Permissions
description: The /hiddenore command tree and permission node
published: true
date: 2026-08-09T00:00:00.000Z
tags: hiddenore, commands, permissions
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

Reload does not migrate world data. If you changed the order of item rules under `drops:`
while running in `seeded` mode, see the warning in [Configuration](/hiddenore/configuration).

**`debug`** is per-player and player-only; it cannot be toggled from console.
