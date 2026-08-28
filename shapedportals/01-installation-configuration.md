---
title: "Shaped Portals — Installation & Configuration"
description: "Installation, typed TOML, hot reload, language files, and the in-game editor"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "shapedportals, installation, configuration, hot-reload"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Version 2.0 uses one Java 17 artifact with a Bukkit 1.20 API floor. First start
creates a documented TOML configuration, the selected language file, and the
portal store as soon as the first managed portal is written.

## Install

1. Stop the server and back it up.
2. Put `ShapedPortals-2.0.0.jar` in `plugins/`.
3. Start the server and confirm the enable line reports the expected Bukkit or
   Folia scheduler.
4. Review `plugins/ShapedPortals/config.toml`.
5. Test vanilla and shaped portals in an isolated area before production use.

## Live configuration behavior

The runtime uses an immutable validated snapshot. File watching and parsing run
off the gameplay thread. A stable edit installs only after both `config.toml`
and the selected language overlay validate; otherwise the last known good pair
remains active and the complete exception is logged.

`/sp reload` performs the same transaction immediately. GUI edits validate,
atomically replace `config.toml`, suppress their own duplicate watch event, and
become active at once. Invalid files are never replaced with defaults.

## Settings

| Key | Default | Behavior |
|---|---:|---|
| `general.enabled` | `true` | Allows new shaped portal creation; existing records remain maintained |
| `general.language` | `"en_US"` | Selects `languages/<locale>.toml`; path characters are rejected |
| `general.requireCreatePermission` | `true` | Requires `shapedportals.create` from player igniters |
| `general.failureFeedback` | `true` | Explains rejected attempts to player igniters |
| `portal.minimumInteriorBlocks` | `2` | Smallest connected interior |
| `portal.maximumInteriorBlocks` | `256` | Largest connected interior; hard maximum 4,096 |
| `portal.maximumWidth` | `64` | Largest horizontal interior span; hard maximum 512 |
| `portal.maximumHeight` | `64` | Largest vertical interior span; hard maximum 512 |
| `portal.frameMaterials` | `OBSIDIAN`, `CRYING_OBSIDIAN` | Complete boundary materials |
| `portal.interiorMaterials` | air variants, `FIRE`, `SOUL_FIRE` | Replaceable creation and repair cells |
| `portal.ignitionCauses` | `FLINT_AND_STEEL`, `FIREBALL`, `PLACED_FIRE` | Accepted Bukkit ignition causes |
| `portal.allowedWorlds` | empty | Optional case-insensitive allow-list |
| `portal.deniedWorlds` | empty | Case-insensitive deny-list; takes priority |
| `portal.deduplicationMillis` | `1500` | Coalesces duplicate events at one block |
| `effects.creationSound` | `true` | Plays a sound only after successful commit |
| `effects.creationSoundType` | `BLOCK_END_PORTAL_SPAWN` | Bukkit sound enum |
| `effects.creationSoundVolume` | `0.6` | Range 0.0–4.0 |
| `effects.creationSoundPitch` | `0.67` | Range 0.5–2.0 |
| `hotReload.enabled` | `true` | Watches the active config and language files |
| `hotReload.pollIntervalMillis` | `1000` | Watch poll interval; range 250–60,000 ms |
| `hotReload.cooldownMillis` | `1500` | Stable-edit debounce; range 250–60,000 ms |
| `integrity.enabled` | `true` | Repairs or deactivates managed portal records |
| `integrity.checkIntervalTicks` | `200` | Periodic sweep interval; range 20–72,000 ticks |
| `integrity.maximumChecksPerCycle` | `32` | Bounded records queued per sweep; range 1–1,024 |

Material names must resolve to block materials. Frame and interior lists may not
overlap, and `NETHER_PORTAL` is prohibited as a replaceable interior material.
Removing a frame material from the active configuration can deactivate existing
managed portals that still use it during their next integrity audit.

## Language files

The first selection of a locale creates `languages/<locale>.toml` from the
code-owned English catalog. Keys are quoted TOML strings. Missing known keys
fall back to English; unknown keys, wrong value types, placeholder drift, or
invalid MiniMessage reject the reload. Message substitutions mark operator data
as trusted or untrusted so user/world text cannot inject MiniMessage actions.

## Build from source

The Gradle 9.5.1 wrapper runs with the workspace JDK 25 toolchain and emits Java
17 bytecode:

```text
./gradlew build
```

The shaded plugin is `build/libs/ShapedPortals-2.0.0.jar`. `check` also compiles
the source against current Paper 26.1.2 and Spigot 26.2 APIs, then verifies that
every shaded class remains Java 17 bytecode and VolmLib was relocated.

Next: [Portal Behavior & Events](/shapedportals/02-portal-behavior-events)
