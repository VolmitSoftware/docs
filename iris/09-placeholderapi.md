---
title: "PlaceholderAPI"
description: "Iris documentation: PlaceholderAPI"
published: true
date: 2026-09-14T00:56:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris registers a PlaceholderAPI expansion with id `iris` on Bukkit-family servers. It publishes twenty-nine read-only values: one service flag, nineteen world readings scoped to a player's position, and nine global pregeneration readings. Scoreboard, chat, and HUD plugins can show Iris state without writing Java.

Plugins that need the same data with real types and no string parsing should use the API pages instead. Start at [90 - API - Getting Started](/iris/90-api-getting-started). Then see [91 - API - Terrain](/iris/91-api-terrain) and [92 - API - World Events](/iris/92-api-world-events). There is no PlaceholderAPI on Fabric/Forge/NeoForge. See [07 - Pregeneration](/iris/07-pregeneration) and [28 - Integrations](/iris/28-integrations) for the surrounding runtime.

## Put an Iris value on a scoreboard

Install PlaceholderAPI before starting Iris, then restart the server. World placeholders need an online player in a loaded Iris world.

Add a placeholder such as `%iris_world.biome%` to your scoreboard plugin's format and reload that plugin. Use `%iris_world.available%` as a display condition when supported.

To inspect a value directly, run `/papi parse me %iris_world.biome%`. If it resolves there but differs on the scoreboard, check the scoreboard format and refresh interval. `/papi info iris` lists all available keys.

### Recovery

| Symptom | What actually happened | Fix |
|---|---|---|
| `/papi info iris` reports no such expansion | PlaceholderAPI was not enabled at the moment Iris ran its registration task, one tick after enable | Full server restart with both plugins present. There is no late retry on `PluginEnableEvent`, and `/papi reload` will not make Iris try again |
| The placeholder renders literally as `%iris_...%` | The path is not one Iris publishes. Unknown paths return null to PlaceholderAPI, which leaves the text alone | Copy an exact path from `/papi info iris` or the table below. Pre-2.0 underscore names are gone |
| A `world.*` key reads `---` | No player context (console or offline player). The player has no tracked position yet. The player is not in an Iris world. Or the terrain service returned nothing for that column | Parse as a named online player who is standing in a loaded Iris world |
| `world.available` is `true` but the biome lags your movement | The per-player world view has a one-second TTL | Wait a second, or teleport — teleports publish immediately. Do not go looking for a bug in the consumer first |
| A `pregen.*` key reads `---` | No job snapshot is currently published | Guard the board template on `pregen.available` rather than testing the value keys for `---` |
| The board shows `47.5%%` or `47.5` with no sign | `pregen.percent` deliberately returns a bare number | Put the literal `%` in the consumer's format string |

## Registration

| Item | Value |
|---|---|
| Expansion id | `iris` |
| Version | `2.0.0` |
| Author | `Volmit Software` |
| Required plugin | `Iris` |
| `persist()` | `true` — the expansion survives `/papi reload` without restarting Iris |

Iris checks `isPluginEnabled("PlaceholderAPI")` inside a task scheduled just after its own enable, and gives up silently if the answer is no. Registration also installs a listener. If that listener fails to attach, Iris unregisters the expansion again and logs a warning. You never end up with an expansion publishing stale positions.

Soft-depend only affects load order. It does not install or load PlaceholderAPI.

## Value grammar

| Rule | Detail |
|---|---|
| Path form | Dot-separated, lowercase `a-z`, `0-9`, and `-`. The path is lowercased before lookup, so `%iris_WORLD.BIOME%` resolves, but write it lowercase |
| Plain text only | No color codes, no unit suffixes, no `%` character in any value, `.` as the decimal separator, no thousands separators |
| Pack-name scrubbing | Section-sign sequences and `%` characters inside pack-authored names are removed before the value is returned. A mischievous biome name cannot inject formatting into a scoreboard |
| Genuine zero | Returned as `0`, or `0.00` for two-decimal values. Never `---` |

Every key answers in one of three ways:

| Answer | When | What the board shows |
|---|---|---|
| The value | Known path, data available | The value |
| `---` | Known path, nothing to report right now | `---` |
| Null | Unknown path | The literal `%iris_...%` |

Unknown paths stay visible on purpose. There is no blanket empty-string fallback that would hide a typo.

## Key reference

### World family

Everything except `%iris_available%` needs an online player with a tracked position.

| Placeholder | What it reports |
|---|---|
| `%iris_available%` | `true` when Iris has registered its terrain service on this server. Works from the console. Says nothing about the player's world |
| `%iris_world.available%` | `true` when the reading player's tracked position is in a world Iris generates. The guard for every other `world.*` key |
| `%iris_world.biome%` | Display name of the surface biome at the player's X/Z column, for example `Hot Desert Dunes` |
| `%iris_world.biome-key%` | Load key of that same biome, for example `desert/hot-dunes`. This is what a pack file is named after |
| `%iris_world.biome-custom%` | `true` when the surface biome defines custom derivatives, otherwise `false` |
| `%iris_world.biome-custom-id%` | Authored `customDerivitives[].id` when exactly one derivative is defined, for example `golden-dunes`; `---` for none or multiple |
| `%iris_world.biome-custom-ids%` | All authored custom derivative IDs, comma-and-space separated in definition order; `---` for none |
| `%iris_world.biome-custom-key%` | Namespaced Minecraft registry key for the sole custom derivative, such as `iris:biomes/<hash>`; `---` for none, multiple, or unavailable mapping |
| `%iris_world.biome-custom-keys%` | Registry keys for all custom derivatives in definition order, comma-and-space separated; `---` for none or any unavailable mapping |
| `%iris_world.biome-custom-count%` | Number of authored custom derivatives; `0` for a vanilla-only biome |
| `%iris_world.biome-derivative%` | Configured base derivative registry key, for example `minecraft:desert` |
| `%iris_world.biome-vanilla-derivative%` | Effective vanilla derivative registry key used when a vanilla biome is required |
| `%iris_world.biome-type%` | Inferred biome category: `land`, `sea`, `shore`, or `cave`; `---` when unavailable, including retained definitions without a recorded category |
| `%iris_world.min-height%` | World minimum absolute Y, inclusive |
| `%iris_world.max-height%` | World maximum absolute Y, exclusive |
| `%iris_world.height%` | World vertical span, equal to maximum minus minimum height |
| `%iris_world.fluid-height%` | Dimension fluid level in absolute world Y; this is configuration, not a measurement of water at the player |
| `%iris_world.region%` | Display name of the region covering the player's X/Z |
| `%iris_world.region-key%` | Load key of that region |
| `%iris_world.dimension%` | Load key of the dimension the player's world generates from, for example `overworld`. This is the dimension file's key, which is usually but not necessarily the pack folder name |

From the console, for an offline player, or before a player's first tracked position: `world.available` is `false` and the rest are `---`.

### Authored IDs and registry keys

For a biome file `biomes/desert/hot-dunes.json` with `"name": "Hot Desert Dunes"` and one `customDerivitives` entry containing `"id": "golden-dunes"`, the three authored values are:

- `%iris_world.biome%`: `Hot Desert Dunes`.
- `%iris_world.biome-key%`: `desert/hot-dunes`.
- `%iris_world.biome-custom-id%`: `golden-dunes`.

Minecraft's physical custom biome registry key is separate and can contain a content hash. `%iris_world.biome-custom-key%` exposes that mapping. The plural placeholders list all configured derivatives; the singular placeholders return `---` when more than one is defined. These are surface-biome definitions, not a lookup of the randomly selected physical biome at the player's exact Y. Iris does not rerun random selection to guess that value.

Biome names, region names, and custom mappings use the retained generation definitions for saved columns. Editing the active pack does not relabel an already recorded column. Missing registry mappings leave authored IDs available while the affected key placeholders return `---`.

While saved biome data loads, biome and region placeholders return `---`. Iris retries on the next request after its one-second cache expires, even if the player stays still. Normal loading does not log a terrain API error; actual read failures still do.

For MythicMobs RandomSpawns, use the location-based `irisbiome` condition with the biome load key. Player placeholders do not describe an arbitrary spawn point. See [28 - Integrations](/iris/28-integrations).

### Pregeneration family

One job runs per server, so these are global. Every player and the console see identical values.

| Placeholder | What it reports |
|---|---|
| `%iris_pregen.available%` | `true` while a job snapshot is published. Use this as the guard |
| `%iris_pregen.world%` | Name of the world being pregenerated |
| `%iris_pregen.percent%` | Completion from `0.00` to `100.00`, two decimals, no `%` character |
| `%iris_pregen.eta%` | Whole seconds remaining |
| `%iris_pregen.eta-text%` | The same estimate formatted for humans: `45s` under a minute, `2m 5s` under an hour, `1h 30m` above it |
| `%iris_pregen.chunks%` | Chunks finished so far |
| `%iris_pregen.total%` | Chunks the job will generate in total |
| `%iris_pregen.chunks-per-second%` | Current generation rate, two decimals |
| `%iris_pregen.paused%` | `true` while the job is paused |

The snapshot is republished on the `STARTED`, `TICK`, `PAUSED`, `RESUMED`, and `SAVING` pregen phases, and cleared on `COMPLETED` and `CANCELLED`. After the clear, `pregen.available` is `false` and every value key is `---`. Before the job has run long enough to estimate, `eta` reads `0` and `eta-text` reads `0s`.

### Paths as `/papi info iris` prints them

```
available
pregen.available
pregen.chunks
pregen.chunks-per-second
pregen.eta
pregen.eta-text
pregen.paused
pregen.percent
pregen.total
pregen.world
world.available
world.biome
world.biome-custom
world.biome-custom-count
world.biome-custom-id
world.biome-custom-ids
world.biome-custom-key
world.biome-custom-keys
world.biome-derivative
world.biome-key
world.biome-type
world.biome-vanilla-derivative
world.dimension
world.fluid-height
world.height
world.max-height
world.min-height
world.region
world.region-key
```

Prefix each with `%iris_` and suffix with `%`.

## What "surface" means, and what a board costs

All `world.biome*` values, `world.region`, and `world.region-key` are **surface column** readings: whatever the generator places at ground level for that X/Z. Y is not part of the query. A player 60 blocks down in a cave still reads the surface biome overhead, not the cave biome. If you need the biome at an actual Y, that is a terrain API call, not a placeholder. See [91 - API - Terrain](/iris/91-api-terrain).

### When a position is published

| Event | Timing |
|---|---|
| Walking (`PlayerMoveEvent`) | At most once per second, and skipped entirely while the player stays inside the same block column |
| Join, respawn, world change, portal, and every teleport — `/iris goto`, `/tp`, ender pearls, random-TP plugins | Immediately, bypassing the one-second interval |
| Quit | The player's tracked position and cached view are released |

Because teleports publish immediately, a player who arrives somewhere and stands still never reads a stale column from where they came from.

### View rebuild cost

A player's world view is rebuilt at most once per second (`VIEW_TTL_MS = 1000`), and only when something actually reads a `world.*` key. This has three effects on a board:

- All `world.*` keys share one cached view. A rebuild queries one biome environment and one world-info snapshot per player.
- Values can trail a sprinting player by up to a second.
- A board nobody is reading costs nothing. Iris does not poll terrain in the background for this.

Pregen values are not polled per player either. They come from one global snapshot updated by `IrisPregenerationEvent`.

## Permissions

No placeholder is permission-gated. Anything sensitive is simply not published. There is no seed key, no file path key, and no key that mutates engine state on read.

## Failure policy

| Situation | Result |
|---|---|
| Unknown path | Null to PlaceholderAPI, so the literal `%iris_...%` stays on screen |
| Known path, no data | `---` |
| No player context on a `world.*` key | `---`, and `world.available` is `false` |
| Player outside an Iris world | `---`, and `world.available` is `false` |
| Terrain service not registered | `---`, `world.available` is `false`, `%iris_available%` is `false` |
| No pregen job | `---`, and `pregen.available` is `false` |
| A resolver throws | `---`, plus one logged warning for that path. Logging stops after 64 distinct paths have warned |

A key that threw is not quarantined. It keeps being called and keeps answering `---` until whatever was wrong resolves itself.

## Migration from pre-2.0 keys

The old underscore keys are gone with no aliases and no dual-accept window. They now render literally, which is deliberate. A silently empty scoreboard line is worse than a visibly broken one.

| Old key | New key | Why |
|---|---|---|
| `%iris_biome_name%` | `%iris_world.biome%` | Dot grammar |
| `%iris_biome_id%` | `%iris_world.biome-key%` | `id` was always the load key. The name now says so |
| `%iris_region_name%` | `%iris_world.region%` | Dot grammar |
| `%iris_region_id%` | `%iris_world.region-key%` | Same as `biome_id` |
| `%iris_biome_file%` | removed | Leaked absolute server paths, and threw whenever the biome had no backing file |
| `%iris_region_file%` | removed | Same problem |
| `%iris_world_seed%` | removed | A scoreboard has no permission context. Read `IrisWorldInfo.seed()` from the terrain API if a plugin genuinely needs it |
| `%iris_terrain_height%` | removed | Reported generated height before objects and player edits, so it regularly disagreed with the block under the player's feet |
| `%iris_terrain_slope%` | removed | A pack-authoring diagnostic, far too expensive to run once per player per board refresh |
| `%iris_world_mode%` | removed | Studio versus production is not something a live board needs |
| `%iris_world_speed%` | removed | Mutated engine rate-window state as a side effect of being read. Use `%iris_pregen.chunks-per-second%` |

One behavior change hides inside the renames. The old biome and region keys sampled two blocks above the player's feet, so they picked up cave and overhang biomes. The new keys are always the surface column. `%iris_world.dimension%` has no pre-2.0 equivalent.
