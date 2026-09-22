---
title: "Installation & Platforms"
description: "Iris documentation: Installation & Platforms"
published: true
date: 2026-09-21T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Install the Iris jar matching your server platform and Minecraft version. Java 25 is required. Bukkit-family servers use the plugin jar; Fabric, Forge and NeoForge use their respective mod jars.

Install a world pack with `/iris download`; startup does not download packs. Fresh Bukkit installations also need network access to download required libraries. Complete the pack and datapack restart prompts before creating a world.

Read this before [02 - Getting Started](/iris/02-getting-started). If Iris is already installed and you want a world, skip ahead.

## What a good install looks like

Whichever path you take, you are done when all three of these are true:

1. Iris reached its enabled/ready state with no exception in the startup log.
2. The data directory has a `iris.json`. After you install a pack, `packs/<key>/` is loadable.
3. `/iris` prints help from the server console.

On a modded client, the Iris keybind category shows that the client mod loaded. It does not prove that the server can generate chunks. Always check the server.

Keep the old jar and complete world backups until you finish the upgrade checks. A new Iris build generates future chunks with the current generator and keeps the selected pack unless you stage a pack update; existing terrain is untouched. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle#generation-updates-and-retained-terrain).

## Requirements

| Requirement | Value |
|---|---|
| Java | 25 |
| Minecraft (plugin) | 26.1.2, 26.2 and 26.3; one plugin jar supports all three |
| Minecraft (mod) | 26.2 only |
| Fabric Loader | 0.19.3+ |
| Forge | 65.x |
| NeoForge | 26.2.x |
| Network | Outbound HTTP or HTTPS for pack downloads, external datapack downloads and fresh Bukkit library downloads. Retain `plugins/Iris/cache/libraries/` for offline restarts; upgrades may require new downloads. Mod jars include their required libraries |

Before you replace an existing installation:

1. Run `java -version` **on the server**. Confirm it reports 25. Java 25 on the box is not the same as the server process using it.
2. Match the jar label to the platform and Minecraft version you run.
3. Stop the server cleanly.
4. Back up the Iris jar/mod, the Iris data directory, and every Iris world you intend to keep.

Never put two Iris platform jars in the same `plugins/` or `mods/` folder. That fails in confusing ways rather than picking a winner.

## Plugin install (Paper / Purpur / Leaf / Canvas / Folia / Spigot)

1. Put the Iris plugin jar in `plugins/`.
2. Start the server once.
3. Install or download a pack, then restart before creating a world.

Then verify from the server console:

```text
/iris version
/iris pack validate pack=overworld
/iris pack validate pack=underworld
```

`/iris version` prints `Iris v<version>` and proves command routing. Each `pack validate` must resolve the downloaded pack and finish with no blocking errors.

`/iris pack validate` with no argument validates every installed pack. Name one with `pack=<key>` to check a single pack.

A command that responds is not proof the generator can produce chunks. Finish with the disposable-world walkthrough in [02 - Getting Started](/iris/02-getting-started).

### Startup validation gates login

Players cannot join until startup validation completes. If Iris reports a native-integration or external-datapack failure, correct the reported issue and restart before creating worlds or opening Studio. `force=true` does not bypass native-integration failures.

Changed external datapacks may cause Iris to restart the server during startup. On plain Spigot, Iris stops instead; start the server again. A pack with blocking validation errors cannot be opened, while other valid packs remain available.

### Recover from a Java agent failure

If Iris requests an explicit Java agent:

1. Stop the server completely.
2. Confirm `plugins/Iris/agent.jar` exists after the first Iris startup.
3. Add `-javaagent:plugins/Iris/agent.jar` before `-jar`, keeping your other JVM options.

```sh
java -javaagent:plugins/Iris/agent.jar -jar server.jar nogui
```

4. Start from the server directory, or use an absolute agent path.
5. Complete any remaining pack or datapack restart prompt before opening worlds.

Hosts that allow dynamic attachment can use `-XX:+EnableDynamicAgentLoading`. The explicit `-javaagent` option avoids needing dynamic attachment. See [46 - Startup Safeguard](/iris/46-startup-safeguard) for blocked actions and restart requirements.

### Permissions

Grant these permissions as needed; both default to operators:

| Permission | Grants |
|---|---|
| `iris.all` | The entire `/iris` command tree — worlds, studio, pregen, packs, developer tools |
| `iris.treefeller` | Survival tree felling with an axe. Nothing else |

`iris.all` grants access to the command tree; it cannot be limited with subcommand nodes such as `iris.all.pregen`. Some tools have additional requirements listed in [04 - Commands & Permissions](/iris/04-commands-permissions).

Command root is `/iris`, aliases `/ir` and `/irs`.

### Soft dependencies

Optional integrations include PlaceholderAPI, CraftEngine, Nexo, ItemsAdder, SCore, ExecutableItems, MythicLib, MMOItems, eco, EcoItems, MythicMobs, MythicCrucible, KGenerators, WorldEdit and Multiverse-Core. Install the integrations you need separately; see [28 - Integrations](/iris/28-integrations).

### Folia

Folia supports `/iris create` without restarting for ordinary world creation. Install packs and complete any datapack restart prompt first. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

### Installing the first pack

Use `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=https://host/path/pack.zip`. The two pack names resolve to the newest stable release. A custom link must use HTTP or HTTPS and end in `.zip`; when the archive contains multiple dimensions, the shortest dimension key becomes the install folder. A successful command leaves the server running and tells you to restart before using the pack. The built-in pair has no external datapack imports, so that one restart is enough.

Create your first world with [02 - Getting Started](/iris/02-getting-started).

## Mod install (Fabric / Forge / NeoForge)

1. Drop the matching mod jar into `mods/`.
2. Start the dedicated server, or a client if you want singleplayer.
3. Required libraries are included in the mod jar. Do not add the Bukkit plugin jar.
4. Install a pack with `/iris download`. Put any external datapacks required by a custom pack in the save's `datapacks/` directory, then restart before opening the world. `/iris datapack ingest` is Bukkit-only. The built-in Overworld and Underworld need no external datapacks.

### Youer 26.2

Youer is a NeoForge hybrid. Install the NeoForge-labeled Iris jar in `mods/`; do not install the CraftBukkit-labeled jar in `plugins/`. The accepted 26.2 runtime is the official Youer build at commit `4eb14c90`, which bundles NeoForge 26.2.0.67.

Verify server-side:

```text
/iris version
/iris pack validate overworld
/iris pack validate underworld
```

Modded `/iris version` prints more than the Bukkit one. It prints mod version, platform, Minecraft version, and the count of loaded Iris dimensions. The install passes when that line looks right, both managed pack directories contain their primary dimension JSON, and validation reports no blocking errors.

### Restart once after installing a pack

Restart after installing the Iris pack and its required external datapacks, before creating or loading a world. This applies the pack's height range, custom biomes and datapack structures.

### Singleplayer on a modded client

Installed Iris packs show up as selectable World Types on the Create New World screen. Names are `IRIS:<Pack>` or `IRIS:<Pack> / <Dimension>` when a pack exposes more than one dimension.

### Client HUD

Installing the mod jar on a client adds a pregeneration HUD. It shows a progress bar, chunks done and total, percent, chunks per second, and ETA. It turns yellow while paused. `H` toggles it. The keybind category is "Iris" and also holds `M` (Iris Vision Map) and `J` (Iris What overlay). All three are rebindable. Details in [29 - Client HUD & Protocol](/iris/29-client-hud-protocol).

The client HUD works with modded and Bukkit/Paper Iris servers. Players without the client mod use the server's boss bar instead.

## Data directories

### Plugin

| Path | What lives there |
|---|---|
| `plugins/Iris/iris.json` | Shared settings; see [03 - Configuration](/iris/03-configuration) |
| `plugins/Iris/packs/<key>/` | Installed packs. This is the live tree the Studio reads and edits |
| `plugins/Iris/datapacks/` | External datapacks. Put ZIPs for automatic import in `imports/` |
| `plugins/Iris/languages/overrides/<locale>.json` | Optional server message overrides. See [08 - Localization](/iris/08-localization) |
| `<level-root>/datapacks/iris/` | The aggregate worldgen datapack Iris compiles from your installed packs. Iris owns this. Do not hand-edit it |
| `<level-root>/dimensions/<namespace>/<name>/` | Storage for a managed Iris world on Paper-family servers. Namespace is `iris` for worlds Iris creates |
| `<world-container>/<level-name>_iris_<name>/dimensions/iris/<name>/` | Storage for a managed `iris:<name>` world on plain Spigot/CraftBukkit |
| `<dimension-root>/iris/generation/` | Saved world-generation data; include it in world backups |

`<level-root>` is the folder named by `level-name` in `server.properties`. Plain Spigot gives each created `iris:*` world its own outer root next to that level, keeping chunks, generation history, and the pregen cache under the nested `dimensions/iris/<name>/` root.

Pack-folder edits do not update existing production worlds automatically. Use the update workflow in [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

### Mod

Paths are relative to the game instance's `config/` directory.

| Path | What lives there |
|---|---|
| `config/irisworldgen/packs/<pack>/` | Installed packs. A pack counts as installed when `dimensions/<dimension>.json` exists |
| `config/irisworldgen/generated/datapack/iris/` | Generated datapack; do not edit it by hand |
| `config/irisworldgen/modded.json` | Mod-side config: default pack, primary-world routing, main-world override |
| `config/iris/` | Engine data directory — `iris.json` and per-world engine state |
| `<save>/datapacks/` | Save-local external datapacks declared by custom Iris packs. The current built-in Overworld and Underworld releases need none |

Two different roots, and mixing them up is a common mistake. Packs, the generated datapack, and mod config live under `config/irisworldgen/`. The shared engine's own data lives under `config/iris/`.

### `modded.json`

Created with these defaults when absent. Edit valid JSON and restart to apply changes; see [03 - Configuration](/iris/03-configuration).

| Key | Default | What it does |
|---|---|---|
| `defaultPack` | `overworld` | The pack `/iris create` uses when you do not name one. Iris never downloads it automatically |
| `primaryWorld` | `""` | Dimension id players get routed into. Empty means no routing. Set by `/iris world replace-overworld` rather than by hand |
| `routePlayersToPrimaryWorld` | `true` | Whether the routing above actually happens. Set false to keep a primary world configured but stop moving players into it |
| `mainWorldPack` | `""` | Pack whose generator replaces the vanilla main world. Empty means the vanilla overworld is untouched |
| `mainWorldSeed` | `0` | Seed for that main-world override |
| `mainWorldAutoRestart` | `false` | When true, `/iris world mainworld` halts the server immediately so the override takes effect. Leave false unless you have a supervisor that restarts the process |

Only `/iris world replace-overworld`, `/iris world disable|delete` on the primary, and `/iris world mainworld` rewrite this file at runtime.

## Settings that affect install and first world

These settings are in `iris.json`:

| Key path | Default | When you would change it |
|---|---|---|
| `generator.defaultWorldType` | `overworld` | Default pack for Bukkit world creation when `type` is omitted |
| `general.language` | `en_US` | Server-side message locale. See [08 - Localization](/iris/08-localization) |
| `studio.openVSCode` | `true` | Set false on a headless box so `/iris studio vscode` writes the workspace file without trying to launch an editor |
| `studio.autoStartDefaultStudio` | `false` | Leave off for production. Turning it on opens a studio world at boot, which is only useful on a dedicated authoring server |

Full key list: [03 - Configuration](/iris/03-configuration).

## Native runtime dependencies

Fresh Bukkit installations download required libraries from dependency repositories, including JitPack. Allow outbound HTTPS and write access to `plugins/Iris/cache/libraries/`. If a repository is unavailable, wait for access to return and restart; first startup cannot finish without those libraries.

Keep this cache for subsequent offline starts. Changing Iris or Minecraft versions may require another download. Do not install dependency jars as separate plugins. Fabric, Forge and NeoForge jars include their required libraries.

## Pack download policy

A server can start without installed packs. Download one explicitly before creating worlds.

On Bukkit, use `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=<http(s)-zip-url>`. To replace an installed pack with a backup of its current files, add `overwrite=true`. For example:

```text
/iris download pack=overworld overwrite=true
```

For mod-loader syntax, see [04 - Commands & Permissions](/iris/04-commands-permissions). Restart after installing a pack and its required external datapacks. A download changes the authoring pack, not an existing world's generation; see [25 - Pack Management](/iris/25-pack-management).

## Running a pack authored on a newer Minecraft

Run `/iris pack compat` to review content unavailable on your Minecraft version. Iris skips unsupported content where possible; a pack with blocking validation errors cannot create a world. Use supported replacements or update the server as described in [25 - Pack Management](/iris/25-pack-management).

## Native worldgen over Iris terrain

Configure vanilla and mod features in the pack dimension:

| Vanilla / mod worldgen | Runs over Iris terrain? | Control |
|---|---|---|
| Structures (vanilla, datapack, mod) | Yes, on by default | Deny families with `importedStructures.disabled`, or one complete key with `importedStructures.disabledExact` |
| Placed features: ores, trees, plants, springs, geodes | Yes, but **off by default** | `importedFeatures.enabled` per dimension, with per-step (`steps` / `disabledSteps`) and per-key (`disabled`) filters |
| Carvers (caves, canyons, mod carvers) | Never | Use the pack's `caves` and `carvings` instead |
| Surface builders and surface rules | Never | Iris builds surfaces from pack palettes |
| Mod biomes | Only as a `derivative`, `vanillaDerivative`, `biomeScatter`, or `biomeSkyScatter` target | Iris always picks the biome from the pack |
| Mob spawning, including mod mobs | Yes | Biome spawn tables are merged with the vanilla derivative's |

Pack-author examples are in [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

Separately from that flag, Iris custom biomes inherit the biome tags of their vanilla derivative on every platform. Tag-driven content such as `#minecraft:is_overworld` and mod spawn rules therefore applies to Iris custom biomes without any extra configuration.
