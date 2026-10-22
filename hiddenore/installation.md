---
title: "HiddenOre: Installation"
description: "Requirements, first-run setup, and uninstalling"
published: true
date: 2026-10-22T00:00:00.000Z
tags: "hiddenore, installation"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

| | |
|---|---|
| Server software | Paper, Purpur, or Folia for Minecraft 26.1.2 through 26.2; Paper 26.3 |
| Java | 25 |
| Main command | `/hiddenore` |
| Config file | `plugins/HiddenOre/hiddenore.toml` |
| Optional plugins | PlaceholderAPI, Adapt, Iris |

## Install

Download the CraftBukkit jar from the [latest stable release](https://github.com/VolmitSoftware/HiddenOre/releases/latest), or choose the [current beta](https://github.com/VolmitSoftware/HiddenOre/releases/tag/beta). Stable releases use `v<version>` tags. The beta is a rolling prerelease whose jar is replaced with each beta; both release channels publish CraftBukkit builds.

Install the selected distribution jar as the only HiddenOre jar. Each build automatically selects the smaller ordinary or XZ package. If it selects XZ, startup verifies and extracts the bundled runtime to `plugins/HiddenOre/cache/runtime/`, which must be writable. Later starts reuse the verified cache. Extraction needs no network access. Downloads for other libraries and language files still apply.

1. Put `HiddenOre-<version>-bukkit.jar` in `plugins/`.
2. Start the server once.
3. Edit `plugins/HiddenOre/hiddenore.toml`.
4. Save, and check the console for validation errors.

Saved edits apply without a restart. An invalid file leaves the previous settings active, so check the console if a change seems to do nothing.

## Next

Decide whether HiddenOre replaces ore drops, adds bonus drops, or leaves vanilla drops alone, and set each ore up in [Configuration](/hiddenore/configuration).

If you run [Iris](/iris), set `hideOresForHiddenOre` on the Iris dimension instead of enabling `[ore-removal]`. See [Iris worlds](/hiddenore/configuration#iris-worlds).

Set the server language with the `language` key, or see [Languages](/languages).

## Uninstalling

HiddenOre keeps its settings in `plugins/HiddenOre/` and its block records in chunk data. It stores no player data and has no database, proxy, or client component.

> Ore that `[ore-removal]` stripped from generated terrain does not return when HiddenOre is removed. Back up your worlds before regenerating any chunks.
{.is-warning}

### Remove HiddenOre

1. Stop the server and delete `HiddenOre v<version> [CraftBukkit] 26.1.2-26.3.jar` from `plugins/`.
2. Delete `plugins/HiddenOre/`. It holds `hiddenore.toml`, language files and per-player language choices, diagnostic reports, the runtime cache, and downloaded libraries.
3. If an Iris dimension sets `hideOresForHiddenOre` to `true`, set it to `false` and stage the pack update for existing worlds as described in [Pack management](/iris/25-pack-management). Until then, Iris keeps generating terrain without ore.
4. Remove `%hiddenore_…%` placeholders from other plugins' configuration. Without HiddenOre, PlaceholderAPI leaves them unreplaced.
5. Leave `plugins/bStats/` in place unless no remaining plugin on the server uses bStats. That folder is shared.

### What remains

| Leftover | Without HiddenOre |
|---|---|
| Terrain generated while `[ore-removal]` was enabled, or by an Iris dimension with `hideOresForHiddenOre` | Contains none of the removed ores, and mining it gives only vanilla drops. Chunks generated after removal contain ore normally. To restore ore in existing terrain, regenerate those chunks with a world-editing tool or start a new world |
| `hiddenore:placed_blocks` and `hiddenore:consumed_veins` records in chunk data | Inert. A reinstalled HiddenOre reads them again, so player-placed blocks stay marked and mined vein blocks stay spent |

### Starting fresh

1. Stop the server.
2. Delete `plugins/HiddenOre/`.
3. Start the server with the HiddenOre jar in `plugins/`. HiddenOre writes a default `hiddenore.toml` with `[ore-removal]` disabled.

Chunk records stay in the world and apply again after a reinstall. Only newly generated or regenerated chunks start without them.
