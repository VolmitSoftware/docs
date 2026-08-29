---
title: "Installation and Configuration"
description: "Foundation requirements, typed TOML settings, hot reload, and in-game editor"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "foundation, installation, configuration"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation targets the Minecraft 26.x server APIs and Java 25. The build verifies the same sources against Paper 26.2 build 112 and Spigot 26.2; Paper, Spigot, and Folia command and scheduler paths are kept separate where the platforms require it.

## Requirements

| Item | Value |
|---|---|
| Java | 25 |
| Descriptor API | `26.1` |
| Paper compile target | `26.2.build.112-stable` |
| Spigot compatibility target | `26.2-R0.1-SNAPSHOT` |
| Folia | Declared supported |
| Required plugins | None |
| Optional plugins | Vault and PlaceholderAPI; other Volmit plugins are declared for deterministic suite ordering |

Install the unclassified Foundation jar and start the server. Foundation creates `plugins/Foundation/foundation.toml`, the independent `worth.toml` catalog, generated and editable language files, and its `data/` storage on first enable. Startup always prints the Volmit-style `FOUNDATION` console splash with version, release train, Java, supported Minecraft line, module totals, and `READY` or `DEGRADED` state.

## Building and local publication

Run `./gradlew build` from the Foundation repository. The complete build compiles the Java 25 Paper target, compiles the same shared source against Spigot, runs the test suite, inspects the shaded artifact, and stages the deployable jar as `C:/VolmitSoftware/BUILDS/Foundation.jar`. The versioned artifact remains available under `build/libs/` for diagnostics and publication.

Run `./gradlew publishToMavenLocal` to publish the shaded runtime artifact as `art.arcane:foundation:1.0.0-26.2-SNAPSHOT`. Publication builds the same runtime jar used by the server; it does not publish an unshaded or server-API-bundled substitute.

## Configuration lifecycle

`foundation.toml` is a typed, documented VolmLib configuration. Foundation parses and validates a candidate before committing it, writes in-game changes through a same-directory temporary file, preserves a `.last-good` copy, and rejects unsafe symbolic links, non-regular files, oversized files, invalid registry names, non-finite numbers, and out-of-range settings.

Sound settings use canonical namespaced registry keys such as `minecraft:block.amethyst_block.chime`; particle settings use keys such as `minecraft:end_rod`. Uppercase Bukkit constant names already written by Foundation, including `BLOCK_AMETHYST_BLOCK_CHIME` and `END_ROD`, remain accepted. Particles that require additional data are rejected because the configurable effects do not supply a particle-data payload.

When `runtime.hotReload` is enabled, a stable-content watcher coalesces file changes. Parsing happens asynchronously and the validated state is committed through the global scheduler. Invalid or superseded candidates do not replace the active state.

## Languages

`language = "en_US"` selects `languages/en_US.toml`. Every locale is one complete, editable `languages/<locale>.toml` file; Foundation creates English on first use, preserves existing values, and merges newly-added message defaults during upgrades. Locale files accept MiniMessage, legacy `&` codes, `&#RRGGBB`, and required placeholders. They are hot-reloaded independently of `foundation.toml`, retain the previous valid snapshot after a syntax or placeholder error, and have the same regular-file, symbolic-link, size, and scheduler safety checks as the primary config.

Clicking `language` in the in-game configuration editor closes the inventory and prints every discovered locale as a hoverable chat option. A player can type a locale into the private editor prompt or click an option to run the validated selection immediately. `/foundation language <locale>` provides the same transactional path and tab-completes installed files. Existing installations using `languages/overrides/<locale>.toml` are copied safely into the flat layout when the old generated reference is detected; the legacy file is retained as recovery evidence.

## Worth catalog

`worth.toml` is separate from the economy configuration. On first startup Foundation writes every item registered by the running 26.x server into one of eleven categories with a positive default unit price. A value of `0` keeps the item in the catalog while disabling sale of that item. New server items are added automatically on startup, edits are hot-reloaded, in-game writes use optimistic revisions and atomic replacement, and `worth.toml.last-good` retains the prior bytes.

## In-game editor

Open `/foundation` and select **Configuration Editor**, or run `/foundation config`. The editor requires `foundation.admin.config` and provides:

- boolean toggles;
- bounded numeric increments with shift multipliers and exact chat input;
- enum cycling;
- string input with `reset` and `cancel` controls;
- a discovered language picker with typed and click-to-select chat input;
- paged text-list editing with addition and deletion;
- optimistic revision checks so stale menus cannot overwrite a newer file or menu change;
- permission rechecks before every write.

Chat input expires after 60 seconds. Every accepted edit follows the same validation, atomic-write, module-reconcile, and last-known-good path as a file edit.

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

Continue with [commands and permissions](/foundation/02-commands-permissions) or [development and command architecture](/foundation/06-development).
