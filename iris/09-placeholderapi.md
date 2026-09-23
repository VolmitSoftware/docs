---
title: "PlaceholderAPI"
description: "Iris documentation: PlaceholderAPI"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris registers a PlaceholderAPI expansion with id `iris` on Bukkit-family servers. It publishes twenty-nine read-only values: one service flag, nineteen world readings scoped to a player's position, and nine global pregeneration readings. Scoreboard, chat, and HUD plugins can show Iris state without writing Java.

Plugins that need the same data with real types and no string parsing should use the API pages instead. Start at [90 - API - Getting Started](/iris/90-api-getting-started). Then see [91 - API - Terrain](/iris/91-api-terrain) and [92 - API - World Events](/iris/92-api-world-events). There is no PlaceholderAPI on Fabric/Forge/NeoForge. See [07 - Pregeneration](/iris/07-pregeneration) and [28 - Integrations](/iris/28-integrations) for related configuration.

## Put an Iris value on a scoreboard

Install PlaceholderAPI before starting Iris, then restart the server. World placeholders need an online player in a loaded Iris world.

Add a placeholder such as `%iris_world.biome%` to your scoreboard plugin's format and reload that plugin. Use `%iris_world.available%` as a display condition when supported.

To inspect a value directly, run `/papi parse me %iris_world.biome%`. `/papi info iris` lists all available keys.

## Registration

| Item | Value |
|---|---|
| Expansion id | `iris` |
| Version | `2.0.0` |
| Author | `Volmit Software` |
| Required plugin | `Iris` |
| `/papi reload` | The expansion remains registered |

Install both plugins before starting the server. Installing PlaceholderAPI alone does not enable Iris integration until Iris starts.

## Value grammar

| Rule | Detail |
|---|---|
| Path form | Dot-separated, lowercase `a-z`, `0-9`, and `-`. The path is lowercased before lookup, so `%iris_WORLD.BIOME%` resolves, but write it lowercase |
| Plain text only | No color codes, no unit suffixes, no `%` character in any value, `.` as the decimal separator, no thousands separators |
| Pack-name scrubbing | Section-sign sequences and `%` characters inside pack-authored names are removed before the value is returned. Pack names appear without embedded formatting |
| Genuine zero | Returned as `0`, or `0.00` for two-decimal values. Never `---` |

Every key answers in one of three ways:

| Answer | When | What the board shows |
|---|---|---|
| The value | Known path, data available | The value |
| `---` | Known path, nothing to report right now | `---` |
| Null | Unknown path | The literal `%iris_...%` |

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

Minecraft's physical custom biome registry key is separate and can contain a content hash. `%iris_world.biome-custom-key%` exposes that mapping. The plural placeholders list all configured derivatives; the singular placeholders return `---` when more than one is defined. These are surface-biome definitions, not a lookup of the randomly selected physical biome at the player's exact Y.

Biome names, region names, and custom mappings use the retained generation definitions for saved columns. Editing the active pack does not relabel an already recorded column. Missing registry mappings leave authored IDs available while the affected key placeholders return `---`.

Biome and region placeholders can temporarily return `---` while saved data loads. They update on a later display refresh, including while the player stands still.

For MythicMobs RandomSpawns, use the location-based `irisbiome` condition with the biome load key. Player placeholders do not describe an arbitrary spawn point. See [28 - Integrations](/iris/28-integrations).

### Pregeneration family

One job runs per server, so these are global. Every player and the console see identical values.

| Placeholder | What it reports |
|---|---|
| `%iris_pregen.available%` | `true` while pregeneration is active. Use this as the guard |
| `%iris_pregen.world%` | Name of the world being pregenerated |
| `%iris_pregen.percent%` | Completion from `0.00` to `100.00`, two decimals, no `%` character |
| `%iris_pregen.eta%` | Whole seconds remaining |
| `%iris_pregen.eta-text%` | The same estimate formatted for humans: `45s` under a minute, `2m 5s` under an hour, `1h 30m` above it |
| `%iris_pregen.chunks%` | Chunks finished so far |
| `%iris_pregen.total%` | Chunks the job will generate in total |
| `%iris_pregen.chunks-per-second%` | Current generation rate, two decimals |
| `%iris_pregen.paused%` | `true` while the job is paused |

After a job completes or is cancelled, `pregen.available` is `false` and every value key is `---`. Before enough progress exists to estimate the remaining time, `eta` reads `0` and `eta-text` reads `0s`.

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

## Surface readings and refresh timing

All `world.biome*`, `world.region`, and `world.region-key` values describe the surface at the player's X/Z position. A player in a cave still reads the surface biome overhead. For a biome at a specific Y, use the [Terrain API](/iris/91-api-terrain).

World readings can trail a walking player by up to one second. Joining, respawning, changing worlds, or teleporting updates the position immediately; the display plugin's own refresh interval still applies.

## Permissions

No placeholder is permission-gated. Anything sensitive is simply not published. There is no seed key, no file path key, and no key that mutates engine state on read.
