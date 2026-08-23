---
title: "Installation & Platforms"
description: "Iris documentation: Installation & Platforms"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris ships as one Bukkit-family plugin jar and three self-contained mod jars (Fabric, Forge, NeoForge). This page puts the right artifact on your server and shows how to prove the install worked. Java 25 is required on every platform.

First boot never downloads a world pack. Install one with `/iris download`. Satisfy its declared external datapacks. Complete the registry-loading restart sequence before you create an Iris world.

Read this before [02 - Getting Started](/iris/02-getting-started). If Iris is already installed and you want a world, skip ahead.

## What a good install looks like

Whichever path you take, you are done when all three of these are true:

1. Iris reached its enabled/ready state with no exception in the startup log.
2. The data directory has a `settings.json`. After you install a pack, `packs/<key>/` is loadable.
3. `/iris` prints help from the server console.

On a modded client, the Iris keybind category shows that the client mod loaded. It does not prove that the server can generate chunks. Always check the server.

Keep the old jar and the entire Iris data directory until the new build passes these checks. A swap of the binary does **not** update pack snapshots already copied into existing worlds. That is a separate operation in [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

## Requirements

| Requirement | Value |
|---|---|
| Java | 25. The mod jars declare `java >= 25` and refuse to load on anything older |
| Minecraft (plugin) | 26.1.2 – 26.2. One jar covers both. `api-version` is pinned to 26.1 so it loads on the older line too |
| Minecraft (mod) | 26.2 only |
| Fabric Loader | 0.19.3+ (current acceptance target: 0.19.3) |
| Forge | 65.x (current acceptance target: 26.2-65.1.1) |
| NeoForge | 26.2.x (current acceptance target: 26.2.0.59) |
| Network | Outbound HTTP or HTTPS for `/iris download` and for Bukkit ingest of unresolved `datapackImports`. A startup whose declared imports are already installed and verified is network-free |

Before you replace an existing installation:

1. Run `java -version` **on the server**. Confirm it reports 25. Java 25 on the box is not the same as the server process using it.
2. Match the jar label to the platform and Minecraft version you run.
3. Stop the server cleanly.
4. Back up the Iris jar/mod, the Iris data directory, and every Iris world you intend to keep.

Never put two Iris platform jars in the same `plugins/` or `mods/` folder. That fails in confusing ways rather than picking a winner.

## Plugin install (Paper / Purpur / Leaf / Canvas / Folia / Spigot)

1. Drop the CraftBukkit-labeled plugin jar into `plugins/`.
2. Start the server. Iris loads at `STARTUP`, before worlds are created, because it has to register generators first.
3. First boot writes `plugins/Iris/settings.json` with defaults if it is absent and publishes a valid empty Iris datapack when no packs are installed. It performs no pack download.
4. Run `/iris download pack=overworld` and/or `/iris download pack=underworld`. Wait for validation and atomic installation to finish. The command does not restart or stop the process itself.
5. Restart before you use either pack. The shipping Overworld also declares Towns & Towers 26.1 and Dungeons & Taverns 5.3.0. With the default `general.autoIngestDatapacks=true`, this first boot ingests those two dependencies and leaves startup admission restart-required. Complete the ensuing clean restart so Minecraft can load their registry keys. If automatic ingest is disabled, run `/iris datapack ingest restart=true` after the downloads instead.

Then verify from the server console:

```text
/iris version
/iris pack validate pack=overworld
/iris pack validate pack=underworld
```

`/iris version` prints exactly one line — `Iris v<version> by Volmit Software`. That is the whole output. It does not report platform or Minecraft version. Use it only as a "the command tree is alive" check. Each `pack validate` must resolve the downloaded pack and finish with no blocking errors.

`/iris pack validate` with no argument validates every installed pack. Name one with `pack=<key>` to check a single pack.

A command that responds is not proof the generator can produce chunks. Finish with the disposable-world walkthrough in [02 - Getting Started](/iris/02-getting-started).

### Startup validation gates login

Iris blocks player login until external datapack validation and dimension-pack validation both complete. The kick message names the reason and tells you to check the console.

The two gates behave differently. A failed or restart-pending **external datapack** state keeps login locked. It also blocks all Iris world creation until you fix it and restart. Iris tells you when a restart is what is required.

When validated external datapacks change, Iris completes its initialization and then invokes the server's restart directly, before Paper begins loading default worlds. If that restart API throws or returns unexpectedly, Iris requests shutdown and keeps every configured Iris default world bound to a non-generating refusal; CraftBukkit cannot substitute vanilla terrain.

Unchanged, already-validated datapacks and packs reuse their persisted results. Iris still reads the local authored bytes to confirm the exact fingerprint. It skips remote resolution, semantic revalidation, copying, installation, and pack compilation.

A **dimension pack** with blocking errors does *not* lock the server. That one pack is refused for world and Studio creation. An error listing the reasons is printed at startup. Every healthy pack stays usable.

### Permissions

The descriptor declares two permissions, both defaulting to op:

| Permission | Grants |
|---|---|
| `iris.all` | The entire `/iris` command tree — worlds, studio, pregen, packs, developer tools |
| `iris.treefeller` | Survival tree felling with an axe. Nothing else |

There is exactly one permission check, at the command root, against `iris.all`. Subcommands do not derive their own permission nodes. There is no `iris.all.pregen`. If a non-op needs any Iris command, they need `iris.all`, and that is all of it. See [04 - Commands & Permissions](/iris/04-commands-permissions).

Command root is `/iris`, aliases `/ir` and `/irs`.

### Soft dependencies

None of these are bundled or required. When present they load before Iris so Iris can see them: PlaceholderAPI, CraftEngine, Nexo, ItemsAdder, SCore, ExecutableItems, MythicLib, MMOItems, eco, EcoItems, MythicMobs, MythicCrucible, KGenerators, WorldEdit. Multiverse-Core is deliberately ordered *after* Iris so that Multiverse sees Iris generators once they are registered. Integration details in [28 - Integrations](/iris/28-integrations).

### Folia

`folia-supported: true`, and engine work uses region-safe scheduling. The one behavioral difference that matters at install time: `/iris create` cannot build a live world at runtime on Folia. Instead it stages the world files, installs the pack snapshot, registers the world in `bukkit.yml`, reports success, and automatically requests a controlled server restart. After the server returns, the world generates and loads on its own from that `bukkit.yml` entry. You do not need to run `/iris load`. The host still needs a working restart script or external supervisor that can relaunch the JVM. If the restart command does not complete, Iris falls back to stopping the server and the supervisor must bring it back. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

### Installing the first pack

Use `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=https://host/path/pack.zip`. The two pack names resolve to hardcoded GitHub beta-release ZIPs. A custom link must use HTTP or HTTPS and have a path ending in `.zip`. When the archive contains multiple dimensions, Iris uses the shortest dimension key, then alphabetical order, as the install folder. Downloads are size-bounded, validated, and published atomically. A successful command leaves the server running and tells you to restart before using the pack. For the shipping Overworld, that boot performs the default automatic ingest of Towns & Towers 26.1 and Dungeons & Taverns 5.3.0. The requested registry-loading restart is still required.

Before you create a world you care about, run the Bukkit fresh-install runbook in [31 - Operator Runbooks](/iris/31-operator-runbooks).

## Mod install (Fabric / Forge / NeoForge)

1. Drop the matching mod jar into `mods/`.
2. Start the dedicated server, or a client if you want singleplayer.
3. The jar is self-contained — engine, SPI, and the required Fabric API modules are bundled. Mod id is `irisworldgen` on all three loaders.
4. First boot writes the forced worldgen datapack from packs already on disk. It performs no pack download. Install a pack with `/iris download`. Before the shipping Overworld loads, also install the exact compatible Towns & Towers 26.1 and Dungeons & Taverns 5.3.0 datapack archives in that save's `datapacks/` directory. `/iris datapack ingest` is Bukkit-only and is a stub on mod loaders. Restart only after the pack and both external datapacks are in place.

Verify server-side:

```text
/iris version
/iris pack validate overworld
/iris pack validate underworld
```

Modded `/iris version` prints more than the Bukkit one. It prints mod version, platform, Minecraft version, and the count of loaded Iris dimensions. The install passes when that line looks right, both managed pack directories contain their primary dimension JSON, and validation reports no blocking errors.

### Restart once after installing a pack

This is the modded-specific gotcha. Packs register their custom dimension types (which set the world height range) and their custom biomes through the forced datapack. That datapack is read when the server builds its registries at start. A pack installed during *this* boot may land after registries are already built. External datapacks are also save-local registry input. The shipping Overworld's Towns & Towers 26.1 and Dungeons & Taverns 5.3.0 archives must already be under `<save>/datapacks/` on that boot.

So: **restart once after the Iris pack and all of its external datapacks are installed, before creating or loading a world with it.** Worlds created before that restart run with fallback heights. They will not have the pack's real height range, custom biomes, or declared external structure registry. If a pack or its generated dimension-type datapack was installed during the current boot, restart before continuing.

### Singleplayer on a modded client

Installed Iris packs show up as selectable World Types on the Create New World screen. Names are `IRIS:<Pack>` or `IRIS:<Pack> / <Dimension>` when a pack exposes more than one dimension. The integrated server runs the same engine as a dedicated one.

### Client HUD

Installing the mod jar on a client adds a pregeneration HUD. It shows a progress bar, chunks done and total, percent, chunks per second, and ETA. It turns yellow while paused. `H` toggles it. The keybind category is "Iris" and also holds `M` (Iris Vision Map) and `J` (Iris What overlay). All three are rebindable. Details in [29 - Client HUD & Protocol](/iris/29-client-hud-protocol).

The HUD talks to both modded Iris servers and Bukkit/Paper Iris over channel `irisworldgen:main`. Custom payloads on modded, plugin messaging on Bukkit. Vanilla clients are unaffected and get the server-side boss bar instead. On a non-Iris server the client mod is inert.

## Data directories

### Plugin

| Path | What lives there |
|---|---|
| `plugins/Iris/settings.json` | Engine settings. Written with defaults if absent, and rewritten on every read. New keys appear with defaults. Your edits survive |
| `plugins/Iris/packs/<key>/` | Installed packs. This is the live tree the Studio reads and edits |
| `plugins/Iris/bootstrap/` | First-boot provisioning marker (`provisioned.properties`) recording what was installed and against which compiler identity |
| `plugins/Iris/datapacks/` | External datapack imports pulled from Modrinth by `/iris datapack`, plus a `staging/` subfolder used mid-download |
| `plugins/Iris/languages/overrides/<locale>.json` | Optional server message overrides. See [08 - Localization](/iris/08-localization) |
| `<level-root>/datapacks/iris/` | The aggregate worldgen datapack Iris compiles from your installed packs. Iris owns this. Do not hand-edit it |
| `<level-root>/dimensions/<namespace>/<name>/` | Storage for a managed Iris world on Paper-family servers. Namespace is `iris` for worlds Iris creates |
| `<world-container>/<level-name>_iris_<name>/dimensions/iris/<name>/` | Storage for a managed `iris:<name>` world on plain Spigot/CraftBukkit |
| `<dimension-root>/iris/pack/` | The per-world pack **snapshot**. A production engine reads only this copy, never `plugins/Iris/packs/` |

`<level-root>` is the server's selected level directory. That is the folder named by `level-name` in `server.properties`. Plain Spigot gives each created `iris:*` world its configured outer root next to that level. It then keeps the canonical dimension chunks, frozen pack, and pregen cache together under the nested `dimensions/iris/<name>/` root.

That last row is worth internalizing early. Editing `plugins/Iris/packs/overworld/` has no effect on a world that already exists. That world froze a copy of the pack at creation time. See [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout).

### Mod

Paths are relative to the game instance's `config/` directory.

| Path | What lives there |
|---|---|
| `config/irisworldgen/packs/<pack>/` | Installed packs. A pack counts as installed when `dimensions/<dimension>.json` exists |
| `config/irisworldgen/generated/datapack/iris/` | The generated forced datapack (datapack id `iris_worldgen`), plus a hash sidecar used to detect staleness. Iris owns this. Do not edit it |
| `config/irisworldgen/modded.json` | Mod-side config: default pack, primary-world routing, main-world override |
| `config/iris/` | Engine data directory — `settings.json` and per-world engine state |
| `<save>/datapacks/` | Save-local external datapacks. Install the shipping Overworld's compatible Towns & Towers 26.1 and Dungeons & Taverns 5.3.0 archives here before that Overworld loads |

Two different roots, and mixing them up is a common mistake. Packs, the generated datapack, and mod config live under `config/irisworldgen/`. The shared engine's own data lives under `config/iris/`.

### `modded.json`

Written with these defaults on first read. If the file is unparseable, Iris logs an error and falls back to defaults without rewriting it. A syntax error is silent apart from the log line. Check the log if a setting seems ignored.

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

`IrisSettings` is shared across every platform. Only the file location differs. The four keys most likely to matter before your first world:

| Key path | Default | When you would change it |
|---|---|---|
| `generator.defaultWorldType` | `overworld` | Bukkit `/iris create` resolves an omitted `type` (and the accepted but unadvertised `type=default` sentinel) through this. Point it at your own pack so `/iris create name=<name>` produces your world instead of the stock overworld |
| `general.language` | `en_US` | Server-side message locale. See [08 - Localization](/iris/08-localization) |
| `studio.openVSCode` | `true` | Set false on a headless box so `/iris studio vscode` writes the workspace file without trying to launch an editor |
| `studio.autoStartDefaultStudio` | `false` | Leave off for production. Turning it on opens a studio world at boot, which is only useful on a dedicated authoring server |

Full key list: [03 - Configuration](/iris/03-configuration).

## Pack download policy

| Platform | What happens |
|---|---|
| Plugin | Startup compiles only packs already present into the aggregate datapack. Zero packs is a valid startup state |
| Mod | Startup writes the forced datapack only from packs already present. Zero packs is a valid startup state |

Manual install is `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=<http(s)-zip-url>` (alias `dl`). There is no repository listing, arbitrary pack-name lookup, branch selector, or overwrite option. Built-in pack values are normalized case-insensitively. Custom ZIPs are selected only through `link=`.

Successful downloads update only the pack directory and validation result. Iris does not rebuild the live registry datapack, stop the server, or schedule a restart. On Bukkit, the shipping Overworld's declared imports are ingested by the default startup gate and require the ensuing clean restart. On modded, install those exact compatible external datapacks in the save manually because ingest is unavailable there. See [25 - Pack Management](/iris/25-pack-management).

## When the install goes wrong

| Symptom | Likely cause | Fix |
|---|---|---|
| `/iris version` does nothing | Wrong directory, wrong platform jar, a duplicate Iris jar, Java below 25, or an exception during enable | Stop the server. Leave exactly one matching artifact in place. Confirm Java 25. Fix the **first** Iris exception in the startup log. Later ones are usually fallout |
| `settings.json` exists but no world packs exist | This is the normal first-start state | Run `/iris download pack=overworld`, `/iris download pack=underworld`, or install a complete pack folder, then complete that pack's external-datapack and registry-restart workflow |
| Players are kicked at login with an Iris message | Startup validation has not passed | Read the reason in the kick text and the console. External datapack failures lock login. Fix the datapack state and restart |
| Pack validates, but modded heights and biomes are wrong | The forced datapack was generated after registries had already loaded | Restart once with the pack already on disk, then create a fresh disposable world to confirm |
| A non-op cannot run any Iris command | `iris.all` is not granted | Grant `iris.all`. `iris.treefeller` only covers survival tree felling and grants no commands |
| Client HUD missing but server commands work | Client mod absent, keybind unbound, or capability not negotiated | Install the matching client mod, reconnect, check the Iris keybind category. Server-side generation never depends on the client HUD |
| An existing world ignores a newly installed pack | The world is reading its frozen snapshot | Use the explicit snapshot update or create a new world — [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) and [25 - Pack Management](/iris/25-pack-management) |

## Native worldgen over Iris terrain

Iris replaces the chunk generator outright, so vanilla and mod worldgen only runs where Iris explicitly runs it. This behaves the same on every platform.

| Vanilla / mod worldgen | Runs over Iris terrain? | Control |
|---|---|---|
| Structures (vanilla, datapack, mod) | Yes, on by default | Deny families with `importedStructures.disabled`, or one complete key with `importedStructures.disabledExact` |
| Placed features: ores, trees, plants, springs, geodes | Yes, but **off by default** | `importedFeatures.enabled` per dimension, with per-step (`steps` / `disabledSteps`) and per-key (`disabled`) filters |
| Carvers (caves, canyons, mod carvers) | Never | There is no `NoiseGeneratorSettings` for a carver to sample against. Use the pack's `caves` and `carvings` instead |
| Surface builders and surface rules | Never | Iris builds surfaces from pack palettes |
| Mod biomes | Only as a `derivative`, `vanillaDerivative`, `biomeScatter`, or `biomeSkyScatter` target | Iris always picks the biome from the pack |
| Mob spawning, including mod mobs | Yes | Biome spawn tables are merged with the vanilla derivative's |

With `importedFeatures` off — the default — chunk output is pure Iris. Pack-author recipes for features, mobs, loot, saplings, and dimension-type gameplay are in [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough). The loader-level feature contract is restated on [94 - API - Modded](/iris/94-api-modded).

Separately from that flag, Iris custom biomes inherit the biome tags of their vanilla derivative on every platform. Tag-driven content such as `#minecraft:is_overworld` and mod spawn rules therefore applies to Iris custom biomes without any extra configuration.

## Build artifacts

If you are building rather than downloading, from the repo root with JDK 25:

```text
./gradlew buildAllToOut
```

Four jars land in `dist/`. The CraftBukkit jar's version token is the supported Minecraft *range*. The loader jars use `<mc>+<loader>`:

| Pattern | Platform |
|---|---|
| `Iris v<version> [CraftBukkit] 26.1.2-26.2.jar` | Plugin (whole Bukkit family, including Folia) |
| `Iris v<version> [Fabric] 26.2+<loader>.jar` | Fabric |
| `Iris v<version> [Forge] 26.2+<loader>.jar` | Forge |
| `Iris v<version> [NeoForge] 26.2+<loader>.jar` | NeoForge |

Per-platform build tasks and the developer build gate are in [00 - Overview](/iris/00-overview).

Next: create a world and open the Studio in [02 - Getting Started](/iris/02-getting-started). Every settings key is in [03 - Configuration](/iris/03-configuration).
