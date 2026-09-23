---
title: "Configuration"
description: "Iris documentation: Configuration"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Edit `iris.json` in your platform's data folder to configure Iris. Run `/iris reload` or save the file and wait for automatic hotload. Settings marked **Restart** take effect after a server restart.

## File locations

| Platform | Shared settings | Packs root | Platform-only config |
|----------|-----------------|------------|----------------------|
| Bukkit / Paper / Folia | `plugins/Iris/iris.json` | `plugins/Iris/packs/` | `plugins/Iris/compat.json` |
| Fabric / Forge / NeoForge | `<configDir>/iris/iris.json` | `<configDir>/irisworldgen/packs/` | `<configDir>/irisworldgen/modded.json` |

`<configDir>` is the loader's `config/` directory. On mod loaders, install packs under `irisworldgen/packs/`; the separate `iris/packs/` directory is unused. See [01 - Installation & Platforms](/iris/01-installation-platforms).

## Changing settings

Back up `iris.json`, edit the existing fields, and save valid JSON. For example, to change the server language, set `general.language` to `"de_DE"` in the existing `general` object:

```json
{
  "general": {
    "language": "de_DE",
    "metrics": true
  }
}
```

This example shows where the fields belong; keep the other settings in your file. Run `/iris reload`, then `/iris help` to check the language. Personal language choices are separate; see [08 - Localization](/iris/08-localization).

| Action | Result |
|--------|--------|
| First boot | Creates `iris.json` with defaults if it is missing |
| Startup | Loads the file. Invalid JSON leaves the file untouched and uses defaults for that boot |
| Successful startup or `/iris reload` | Adds missing defaults and rewrites the complete file. Custom formatting is replaced |
| `/iris reload` | Reloads settings and the locale. On mod loaders, also regenerates the datapack. Does not reload packs or restart services |
| Automatic hotload | Applies saved settings without rewriting the file. Files over 2 MiB are rejected |
| Invalid edit while running | Keeps the current settings. Correct the file and save again |
| File deleted while running | Keeps current settings without recreating the file |
| Debug command | `/iris debug toggle` on Bukkit or `/iris debug` on mod loaders changes debug mode and saves the settings |

## Settings groups

Missing groups use their defaults.

| Field | Covers |
|-------|--------|
| `general` | Language, logging, colors, datapacks and pack validation |
| `world` | Entity spawning, effects and pregeneration cache |
| `gui` | Desktop windows opened on the server machine |
| `autoConfiguration` | Bukkit server timeout settings |
| `generator` | World creation defaults and generation transitions |
| `studio` | Studio world behavior |
| `performance` | Caches and background maintenance |
| `pregen` | Pregeneration scheduling, limits and timeouts |
| `treeFeller` | Survival tree felling |

## `general`

| Key | Default | Takes effect | Use |
|-----|---------|--------------|-----|
| `language` | `"en_US"` | Live | Server language. Non-English catalogs download when selected |
| `metrics` | `true` | **Restart** | **Bukkit only.** Enables bStats reporting |
| `commandSounds` | `true` | Live | **Bukkit only.** Plays sounds for command completion and command results |
| `debug` | `false` | Live | Enables detailed console logging and chunk error dumps under `debug/chunk-errors/`. Leave off during normal operation |
| `dumpMantleOnError` | `false` | Live | Saves a region dump under `dump/` when stored generation data cannot be read correctly |
| `disableNMS` | `false` | **Restart** | **Bukkit only.** Disables native server integration and prevents Iris world creation. Leave false for normal use |
| `eagerRuntimeInjection` | `false` | **Restart** | **Bukkit only.** Prepares and checks native server integration during startup instead of when the first Iris world loads |
| `splashLogoStartup` | `true` | **Restart** | Shows the Iris logo and version at startup |
| `useConsoleCustomColors` | `true` | Live | Enables gradient and hex colors in console messages |
| `useCustomColorsIngame` | `true` | Live | Enables gradient and hex colors in player messages |
| `progressBossBar` | `true` | Live | Shows boss bars for supported jobs, Studio opens and downloads. Ordinary world creation uses an action bar |
| `adjustVanillaHeight` | `false` | **Restart** | **Bukkit only.** Applies Iris height to the vanilla Overworld, Nether and End dimension types when generating the datapack |
| `autoIngestDatapacks` | `true` | **Restart** | **Bukkit only.** Imports configured datapack sources and ZIPs in `plugins/Iris/datapacks/imports/` at startup. Drop-folder imports apply to all Iris dimensions |
| `autoImportDatapackStructures` | `false` | Live, next import | **Bukkit only.** Copies registered datapack structures into editable pack files. Use `/iris structure import <dimension>` for a manual import |
| `strictContentKeys` | `false` | Live | Rejects packs with unresolved content keys or invalid block-state properties. Useful while authoring. The JVM property `-Diris.strictContent=true` or `false` overrides this setting |
| `spinh` | `-20` | Live | Hue adjustment for animated Iris text |
| `spins` | `7` | Live | Saturation adjustment for animated Iris text |
| `spinb` | `8` | Live | Brightness adjustment for animated Iris text |

`strictContentKeys` does not change how Iris handles content unavailable on your Minecraft version. Use `/iris pack compat` to review version compatibility; see [25 - Pack Management](/iris/25-pack-management).

## `world`

These settings control Iris spawning and effects. Vanilla spawning has its own server settings.

| Key | Default | Takes effect | Use |
|-----|---------|--------------|-----|
| `postLoadBlockUpdates` | `true` | Live | Updates blocks near players after generation so placed objects settle and receive waterlogging updates |
| `forcePersistEntities` | `true` | Live | Prevents normal despawning of Iris-spawned entities |
| `ambientEntitySpawningSystem` | `true` | Live | Enables biome and region ambient spawn lists |
| `asyncTickIntervalMS` | `700` | Live, next tick | Milliseconds between Iris spawning, effects and cleanup passes |
| `targetSpawnEntitiesPerChunk` | `0.95` | Live | Stops Iris spawning when entities per loaded chunk exceed this value |
| `markerEntitySpawningSystem` | `true` | Live | Enables mobs placed at pack-defined feature markers |
| `effectSystem` | `true` | Live | Applies biome and region potion effects, particles and sounds to players |
| `globalPregenCache` | `false` | Following world-init or chunk-load event | **Bukkit only.** Saves generated-chunk records so pregeneration can skip completed chunks across restarts |

## `gui`

These windows open on the machine running the server. Set `useServerLaunchedGuis` to false on remote or headless hosts.

| Key | Default | Takes effect | Use |
|-----|---------|--------------|-----|
| `useServerLaunchedGuis` | `true` | Live | Allows the noise explorer, vision map and pregeneration viewer to open desktop windows |
| `maximumPregenGuiFPS` | `false` | Next window open | Refreshes the local pregeneration preview more frequently |
| `colorMode` | `true` | Next window open | Shows the noise explorer in color instead of grayscale |

## `autoConfiguration`

These settings apply only to Bukkit servers. Disable them if you manage the corresponding server timeout settings yourself.

| Key | Default | Takes effect | Use |
|-----|---------|--------------|-----|
| `configureSpigotTimeoutTime` | `true` | **Restart** | Raises `timeout-time` in `spigot.yml` to allow longer generation tasks |
| `configurePaperWatchdogDelay` | `true` | **Restart** | Raises Paper's watchdog warning and timeout limits |

## `generator`

| Key | Default | Takes effect | Use |
|-----|---------|--------------|-----|
| `generationTransitionWidthBlocks` | `256` | Next generation activation | Width of transitions beside saved terrain after generation updates. Range: 16–8192 blocks. Existing transitions keep their previous width |
| `defaultWorldType` | `"overworld"` | Live | **Bukkit only.** Pack used when a world or Studio command omits one, or `bukkit.yml` uses the bare `Iris` generator. Mod loaders use `modded.json`'s `defaultPack` |
| `preventLeafDecay` | `true` | **Restart** | Makes generated leaves persistent. Separate from the dimension's `preventLeafDecay` pack setting |

## `performance`

Restart requirements are listed for each key.

| Key | Default | Takes effect | Use |
|-----|---------|--------------|-----|
| `trimMantleInStudio` | `false` | Live | Enables routine cleanup of stored generation data in Studio worlds |
| `mantleKeepAlive` | `30` | Live | Requested retention time, in seconds, for generation data in memory |
| `noiseCacheSize` | `1024` | Engine hotload or restart; live for terrain queries | Base noise cache capacity |
| `resourceLoaderCacheSize` | `1024` | **Restart / pack reload** | Number of pack resources retained per loader |
| `objectLoaderCacheSize` | `4096` | **Restart / pack reload** | Cache capacity for objects and images |
| `mantleCleanupDelay` | `200` | Live | Delay in ticks before loaded-chunk generation data cleanup. Default: 10 seconds |
| `simdKernels` | `true` | **Restart** | Enables vectorized noise calculations when the JVM starts with `--add-modules=jdk.incubator.vector` |

### `performance.engineSVC`

| Key | Default | Takes effect | Use |
|-----|---------|--------------|-----|
| `useVirtualThreads` | `true` | **Restart** | Uses virtual threads for background maintenance |
| `forceMulticoreWrite` | `false` | Live | Enables parallel generation outside pregeneration and more frequent saving of eligible generation data |
| `priority` | `5` | **Restart** | Background thread priority, from 1 to 10. Applies only when `useVirtualThreads` is false |
| `parallelism` | `-1` | **Restart** | Background maintenance worker count. Nonpositive values choose automatically; positive values are limited by available processors |

## `pregen`

Changes apply to the next pregeneration job. See [07 - Pregeneration](/iris/07-pregeneration) for commands.

| Key | Default | Applies to | Use |
|-----|---------|------------|-----|
| `runtimeSchedulerMode` | `AUTO` | Bukkit | Scheduler selection: `AUTO`, `PAPER_LIKE` or `FOLIA`. Leave `AUTO` for normal use; Folia uses its region scheduler |
| `paperLikeBackendMode` | `AUTO` | Bukkit, non-Folia | Backend selection: `AUTO`, `TICKET` or `SERVICE`. `AUTO` uses `TICKET`; ignored on Folia |
| `chunkLoadTimeoutSeconds` | `15` | Both | Bukkit slow-request warning threshold, clamped to 5–120 seconds; slow requests continue waiting. Mod loaders use a 120-second timeout |
| `timeoutWarnIntervalMs` | `500` | Bukkit | Minimum interval between slow-request and failed-release warnings. Minimum: 250 ms |
| `saveIntervalMs` | `30000` | Both | Progress-save interval, clamped to 5000–900000 ms |
| `maxResidentTectonicPlates` | `96` | Both | Requested limit on resident generation regions. Minimum: 16. Iris may use a lower limit for the world and server |
| `mantleBackpressureWaitMs` | `25` | Both | How often pregeneration checks whether it can resume after reaching its region limit. Range: 5–1000 ms |
| `mantleBackpressureTimeoutMs` | `60000` | Both | Wait limit before a region-limit warning. Range: 5000–600000 ms |
| `moddedPregenInFlight` | `0` | Modded | Concurrent chunk limit. Positive values are capped at 512; nonpositive values choose automatically. Ignored on Bukkit |

## `treeFeller`

Both settings apply live after reload. Players need `iris.treefeller` on Bukkit or the platform's tree-feller permission on mod loaders.

| Key | Default | Use |
|-----|---------|-----|
| `enabled` | `false` | Enables felling an entire Iris-managed tree by breaking one log |
| `durabilityPreservationChance` | `0` | Percentage chance per block that the axe loses no durability. Range: 0–100 |

See [04 - Commands & Permissions](/iris/04-commands-permissions) and [28 - Integrations](/iris/28-integrations).

## `studio`

| Key | Default | Use |
|-----|---------|-----|
| `openVSCode` | `true` | Allows `/iris studio vscode` to launch the editor after writing its workspace file. Set false on a headless host |
| `entitySpawning` | `true` | Allows mobs in Studio worlds. Natural spawning still requires an eligible player outside spectator mode |
| `disableTimeAndWeather` | `true` | Freezes the day cycle at noon and disables weather when Studio opens |
| `autoStartDefaultStudio` | `false` | Opens the default pack's Studio world automatically at startup |

See [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

## Bukkit-only: `compat.json`

Use `plugins/Iris/compat.json` to substitute blocks and items unavailable on your server. Iris writes `compat.default.json` alongside it as a reference. Your entries supplement the built-in mappings. Restart after editing; `/iris reload` does not apply this file.

```json
{
  "blockFilters": [
    { "when": "example:missing_block", "supplement": "minecraft:stone", "exact": false }
  ],
  "itemFilters": [
    { "when": "example:missing_item", "supplement": "minecraft:stick" }
  ]
}
```

| Field | Applies to | Use |
|-------|------------|-----|
| `when` | Block and item filters | Unsupported source key to replace |
| `supplement` | Block and item filters | Supported replacement key |
| `exact` | Block filters only | Match the full namespace and block-state properties when true; match the bare material name when false |

Invalid JSON leaves the built-in mappings active. Mod loaders do not use these files.

## Modded-only: `modded.json`

Edit `<configDir>/irisworldgen/modded.json` and restart to apply changes. Iris creates the file with defaults if it is absent. Invalid JSON leaves the file untouched and uses defaults for that boot. The Bukkit plugin does not use this file.

| Key | Default | Use |
|-----|---------|-----|
| `defaultPack` | `"overworld"` | Pack used by `/iris create` when omitted. Install the pack separately |
| `primaryWorld` | `""` | Iris dimension id used for player routing |
| `routePlayersToPrimaryWorld` | `true` | Sends players to the primary world when one is set |
| `mainWorldPack` | `""` | Pack or `pack:dimensionKey` for the main-world preset |
| `mainWorldSeed` | `0` | Seed for the main-world preset |
| `mainWorldAutoRestart` | `false` | Restarts automatically after a main-world inject |

World-management commands also update this file. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) and [30 - Platform Differences](/iris/30-platform-differences).

## Related

- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [08 - Localization](/iris/08-localization)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [25 - Pack Management](/iris/25-pack-management)
