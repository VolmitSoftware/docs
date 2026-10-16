---
title: "Installation & Platforms"
description: "Iris documentation: Installation & Platforms"
published: true
date: 2026-10-15T22:46:37.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Install the Iris jar matching your server platform and Minecraft version. Minecraft 1.21.1 mods use Java 21; the 26.x distributions use Java 25. Bukkit-family servers use the plugin jar; Fabric, Forge and NeoForge use their respective mod jars.

Install a world pack with `/iris download`; startup does not download packs. Fresh Bukkit installations also need network access to download required libraries. Complete the pack and datapack restart prompts before creating a world.

For 1.21.1, use a pack whose blocks exist on that version or define [dimension block fallbacks](/iris/11-dimensions#version-content-fallbacks-blockfallbacks). Content that requires unavailable blocks is excluded by the [pack compatibility gate](/iris/25-pack-management).

Read this before [02 - Getting Started](/iris/02-getting-started). If Iris is already installed and you want a world, skip ahead.

## Requirements

| Requirement | Value |
|---|---|
| Java | 21 for Minecraft 1.21.1 mods; 25 for 26.x |
| Minecraft (plugin) | 26.1.2, 26.2 and 26.3; one plugin jar supports all three |
| Minecraft (mod) | 1.21.1 and 26.3; separate jars for each game version and loader |
| Fabric Loader | 0.19.5+ |
| Forge | 52.x for 1.21.1; 66.x for 26.3 |
| NeoForge | 21.1.x for 1.21.1; 26.3.x for 26.3 |
| Network | Outbound HTTP or HTTPS for pack downloads, external datapack downloads and fresh Bukkit library downloads. Retain `plugins/Iris/cache/libraries/` for offline restarts; upgrades may require new downloads. Mod jars include their required libraries |

Before you replace an existing installation:

1. Run `java -version` **on the server**. Confirm the server process uses Java 21 for 1.21.1 or Java 25 for 26.x.
2. Match the jar label to the platform and Minecraft version you run. For example, `Iris v4.3.3 [CraftBukkit] 26.1.2-26.3.jar` supports the three listed plugin versions; the mod jars each name their target game and loader version.
3. Stop the server cleanly.
4. Back up the Iris jar/mod, the Iris data directory, and every Iris world you intend to keep.

Install only one Iris platform jar in the `plugins/` or `mods/` folder.

Native Billow noise is enabled by default when the jar contains a compatible native library. Start Java 25 with `--enable-native-access=ALL-UNNAMED` before `-jar` to allow it; unavailable native support uses Java sampling. Minecraft 1.21.1 uses Java sampling and supports the Java 21 Vector API kernels. See [Configuration](/iris/03-configuration#native-billow-noise) and [Workspace builds](/volmlib/api/building).

For a local source build, run `./gradlew buildPsychoLT` from the Iris repository, or select that task in IntelliJ's Gradle window. It builds and verifies all four platform jars, exports them to `PluginOuts`, and stages them in the local test-server consumer dropins. Use `./gradlew buildAllToOut` to export the default 26.3 mod jars and Bukkit jar without staging them in a test server. Build the three 1.21.1 mod jars with `./gradlew fabricJar forgeJar neoforgeJar -PminecraftVersion=1.21.1`; output is under `adapters/<loader>/build/1.21.1/libs/`. Source builds require Java 25 and a Java 21 toolchain for the 1.21.1 target.

## Plugin install (Paper / Purpur / Leaf / Canvas / Folia / Spigot)

Install the selected CraftBukkit distribution jar as the only Iris plugin jar. Each build automatically selects the smaller ordinary or XZ package, with the native adapters included in either format. With XZ, startup verifies and extracts the bundled runtime into `plugins/Iris/cache/runtime/`, which must be writable. Later starts reuse the verified cache. Other required libraries and packs can still need network access.

1. Put the Iris plugin jar in `plugins/`.
2. Start the server once.
3. Install or download a pack, then restart before creating a world.

Validate installed packs from the server console:

```none
/iris pack validate pack=overworld
/iris pack validate pack=underworld
```

Each `pack validate` must finish with no blocking errors.

`/iris pack validate` with no argument validates every installed pack. Name one with `pack=<key>` to check a single pack.

Create a world with [02 - Getting Started](/iris/02-getting-started).

### Startup requirements

Players cannot join until startup validation completes. Complete the required console prompts and restart before creating worlds or opening Studio. Danger Mode blocks player login and Iris world and Studio operations until you correct the reported issue and fully restart.

Changed external datapacks may cause Iris to restart the server during startup. On plain Spigot, Iris stops instead; start the server again. A pack with blocking validation errors cannot be opened, while other valid packs remain available.

### Java agent option

If Iris requests an explicit Java agent:

1. Stop the server completely.
2. Confirm `plugins/Iris/agent.jar` exists after the first Iris startup.
3. Add `-javaagent:plugins/Iris/agent.jar` before `-jar`, keeping your other JVM options.

```sh
java -javaagent:plugins/Iris/agent.jar -jar server.jar nogui
```

4. Start from the server directory, or use an absolute agent path.
5. Complete any remaining pack or datapack restart prompt before opening worlds.

Hosts that allow dynamic attachment can use `-XX:+EnableDynamicAgentLoading`. The explicit `-javaagent` option avoids needing dynamic attachment.

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
3. Required libraries for creating and reopening Iris worlds are included in the mod jar; no separate library mods are needed. Do not add the Bukkit plugin jar.
4. Install a pack with `/iris download`. Put any external datapacks required by a custom pack in the save's `datapacks/` directory, then restart before opening the world. `/iris datapack ingest` is Bukkit-only. The built-in Overworld and Underworld need no external datapacks.

### Youer

Youer is a NeoForge hybrid. Install the NeoForge-labeled Iris jar in `mods/`; do not install the CraftBukkit-labeled jar in `plugins/`. Match the Iris jar to Youer’s Minecraft version: 1.21.1 or 26.3. The 26.2 Youer build requires an Iris distribution targeting 26.2, which is outside the mod version matrix.

Validate the installed packs:

```none
/iris pack validate overworld
/iris pack validate underworld
```

Resolve blocking pack-validation errors before creating a world.

### Restart once after installing a pack

Restart after installing the Iris pack and its required external datapacks, before creating or loading a world. This applies the pack's height range, custom biomes and datapack structures.

### Singleplayer on a modded client

Installed Iris packs show up as selectable World Types on the Create New World screen. Names are `IRIS:<Pack>` or `IRIS:<Pack> / <Dimension>` when a pack exposes more than one dimension.

### Client HUD

Installing the mod jar on a client adds a pregeneration HUD. It shows a progress bar, chunks done and total, percent, chunks per second, and ETA. It turns yellow while paused. `H` toggles it. The keybind category is "Iris" and also holds `M` (Iris Vision Map) and `J` (Iris What overlay). All three are rebindable. Details in [29 - Client HUD & Maps](/iris/29-client-hud-protocol).

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
| `config/irisworldgen/modded.json` | Mod-side config: default pack, primary-world routing, main-world override, dimension takeovers |
| `config/irisworldgen/catalog/worldgen-catalog.json` | Worldgen catalog of the loaded mods, captured at each server start. See [48 - Mod Worldgen](/iris/48-mod-worldgen) |
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
| `dimensionTakeovers` | `{}` | Existing dimensions that generate from an Iris pack on dedicated servers, as `"namespace:path": "pack"` or `"pack:dimensionKey"`. Set by `/iris world takeover`. See [48 - Mod Worldgen](/iris/48-mod-worldgen#take-over-a-dimension) |

Only `/iris world replace-overworld`, `/iris world disable|delete` on the primary, `/iris world mainworld`, and `/iris world takeover` rewrite this file at runtime.

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

Fresh Bukkit installations download required libraries from dependency repositories, including JitPack. Allow outbound HTTPS and write access to `plugins/Iris/cache/libraries/`.

Keep this cache for subsequent offline starts. Changing Iris or Minecraft versions may require another download. Do not install dependency jars as separate plugins. Fabric, Forge and NeoForge jars include their required libraries for offline startup.

## Pack download policy

A server can start without installed packs. Download one explicitly before creating worlds.

On Bukkit, use `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=<http(s)-zip-url>`. To replace an installed pack with a backup of its current files, add `overwrite=true`. For example:

```none
/iris download pack=overworld overwrite=true
```

For mod-loader syntax, see [04 - Commands & Permissions](/iris/04-commands-permissions). Restart after installing a pack and its required external datapacks. A download changes the authoring pack, not an existing world's generation; see [25 - Pack Management](/iris/25-pack-management).

## Running a pack authored on a newer Minecraft

Run `/iris pack compat` to review content unavailable on your Minecraft version. Iris skips unsupported content where possible; a pack with blocking validation errors cannot create a world. Use supported replacements or update the server as described in [25 - Pack Management](/iris/25-pack-management).

## Native worldgen over Iris terrain

Fabric servers can run Iris alongside C2ME with native structure generation enabled.

Configure vanilla and mod features in the pack dimension:

| Vanilla / mod worldgen | Runs over Iris terrain? | Control |
|---|---|---|
| Structures (vanilla, datapack, mod) | Yes, on by default | Deny families with `importedStructures.disabled`, or one complete key with `importedStructures.disabledExact` |
| Placed features: ores, trees, plants, springs, geodes | Yes, but **off by default** | `importedFeatures.enabled` per dimension, with per-step (`steps` / `disabledSteps`), per-key (`disabled` / `disabledExact`), and per-biome (`biomeRules`) filters |
| Carvers (caves, canyons, mod carvers) | Never | Use the pack's `caves` and `carvings` instead |
| Surface builders and surface rules | Never | Iris builds surfaces from pack palettes |
| Mod biomes | Only as a `derivative`, `vanillaDerivative`, `biomeScatter`, or `biomeSkyScatter` target | Iris always picks the biome from the pack. On mod loaders, `/iris ingest mods` builds a pack that adopts them |
| Mob spawning, including mod mobs | Yes | Biome spawn tables are merged with the vanilla derivative's |

Pack-author examples are in [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough). The worldgen catalog, mod ingest, borrowed dimension types, and dimension takeovers are covered in [48 - Mod Worldgen](/iris/48-mod-worldgen).

Separately from that flag, Iris custom biomes inherit the biome tags of their vanilla derivative on every platform. Tag-driven content such as `#minecraft:is_overworld` and mod spawn rules therefore applies to Iris custom biomes without any extra configuration.
