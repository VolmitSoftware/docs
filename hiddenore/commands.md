---
title: HiddenOre — Commands & Permissions
description: HiddenOre command tree and permission node
published: true
date: 2026-08-09T00:00:00.000Z
tags: hiddenore, commands
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

HiddenOre registers the root command `/hiddenore`.

## Commands

| Command | Description |
|---|---|
| `/hiddenore reload` | Reload HiddenOre configuration and language files |
| `/hiddenore debug` | Toggle ore debug mode for yourself |


## Permissions

| Node | Default | Description |
|---|---|---|
| `hiddenore.admin` | `op` | Allows use of all HiddenOre commands |

Both subcommands check `hiddenore.admin` explicitly at runtime in addition to the
`plugin.yml` declaration.

### Notes on `/hiddenore reload`

Reload re-reads `config.yml` and the language files and rebuilds the runtime configuration.
If the reload throws, HiddenOre logs the failure and **keeps the previous runtime
configuration active** rather than leaving the server in a half-applied state.

Reload does not migrate world data. If you have changed the order of item rules under
`drops:` while running in `seeded` mode, see the warning in
[Configuration](/hiddenore/configuration).

### Notes on `/hiddenore debug`

Debug mode is per-player and player-only; it cannot be toggled from console.
