---
title: "Installation and Configuration"
description: "Foundation requirements, typed TOML settings, hot reload, and in-game editor"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "foundation, installation, configuration"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation supports Minecraft 26.x on Paper, Spigot, and Folia. Java 25 is required.

## Requirements

| Item | Value |
|---|---|
| Java | 25 |
| Servers | Paper, Spigot, and Folia on Minecraft 26.x |
| Folia | Supported |
| Required plugins | None |
| Optional plugins | Vault and PlaceholderAPI |

Put the Foundation jar in `plugins/` and start the server. Foundation creates `plugins/Foundation/foundation.toml`, `worth.toml`, language files, and its `data/` folder.

## Configuration lifecycle

Changes to `foundation.toml` reload automatically when `runtime.hotReload` is enabled. Invalid changes leave the current settings active. Foundation keeps a `.last-good` copy for recovery.

Sound settings use canonical namespaced registry keys such as `minecraft:block.amethyst_block.chime`; particle settings use keys such as `minecraft:end_rod`. Uppercase Bukkit constant names already written by Foundation, including `BLOCK_AMETHYST_BLOCK_CHIME` and `END_ROD`, remain accepted. Particles that require additional data are rejected because the configurable effects do not supply a particle-data payload.

## Languages

`language = "en_US"` selects `languages/en_US.toml`. Locale files accept MiniMessage, legacy `&` codes, `&#RRGGBB`, and required placeholders. They reload automatically; invalid changes leave the previous messages active.

Use the in-game editor or `/foundation language <locale>` to select an installed locale.

## Worth catalog

`worth.toml` stores item prices separately from the economy settings. A value of `0` disables sale of that item. Changes reload automatically, and `worth.toml.last-good` retains the previous file.

## In-game editor

Open `/foundation` and select **Configuration Editor**, or run `/foundation config`. The editor requires `foundation.admin.config` and provides:

- boolean toggles;
- bounded numeric increments with shift multipliers and exact chat input;
- enum cycling;
- string input with `reset` and `cancel` controls;
- a discovered language picker with typed and click-to-select chat input;
- paged text-list editing with addition and deletion;
- protection against stale menus overwriting newer changes.

Chat input expires after 60 seconds.

## Configuration sections

| Section | Settings |
|---|---|
| `runtime` | Hot reload, poll interval, verbose diagnostics |
| `debug` | Disabled-by-default mclo.gs upload and its client-side upload byte cap |
| `branding` | Menus, sounds, particles, primary and secondary colors, success/error/teleport sound keys, teleport particle key, volumes, pitches, and particle count |
| `modules` | One enable switch for every runtime module |
| `teleport` | Warmup, cooldown, request expiry, movement and damage cancellation, safe landing search, and back history size |
| `homes` | Default limit, accepted name expression, default home name |
| `spawn` | First-join and respawn routing |
| `social` | Social spy availability, ignore enforcement, vanished-target policy |
| `utilities` | Maximum speed and world-change flight recheck |
| `economy` | Starting and maximum balance, negatives, currency names, display decimals, leaderboard scan cap, and Vault provider |
| `playerState` | Automatic AFK delay, activity clearing, persisted vanish |
| `information` | `/near` limits and the editable rules list |
| `integrations` | PlaceholderAPI publication |
| `hud` | Independent title, shared action-bar, boss-bar, timing, and boss-bar color switches |
| `gameplay` | Confirmation lifetime and maximum weather duration |
| `administration` | Mass-teleport cap, sightline distance, `/sudo` length, and blocked command roots |
| `moderation` | Default and maximum durations, warning and reason caps, jailed and muted command allowlists |
| `items` | Grant cap, unsafe-enchantment policy, disposal size |
| `mail` | Mailbox size, message length, join notification |
| `kits` | Kit-count and cooldown caps plus overflow policy |
| `cosmetics` | Selectable particle list, celebration cooldown, burst count, and spread |

Language messages are intentionally absent from `foundation.toml`: they belong to the selected TOML locale file. Placeholders such as `{active}`, `{available}`, `{version}`, `{java}`, `{name}`, `{id}`, `{state}`, `{seconds}`, `{material}`, `{price}`, and `{reason}` must be retained by translations that use them.

Continue with [commands and permissions](/foundation/02-commands-permissions).
