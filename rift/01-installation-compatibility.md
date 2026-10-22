---
title: "Rift: Installation and Compatibility"
description: "Minecraft and Java requirements, installation, builds, and Folia limits"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "rift, installation, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift supports Paper for Minecraft 26.1 through 26.3, including patch releases, on Java 25 or newer. Folia has the lifecycle restrictions below.

## Requirements and installation

| Component | Requirement |
|---|---|
| Server | Paper 26.1, 26.2, or 26.3, including patch releases |
| Java | 25 or newer |
| VolmLib | Included in the Rift distribution; no separate plugin required |
| External generator | Optional; required when a world uses its generator |
| PlaceholderAPI | Optional separate plugin for `%rift_...%` values; no expansion download required |
| Filesystem | Writable plugin data folder and world container |
| Network | Dependency downloads; optional language, update, metrics, and debug-upload requests |

Rift checks the Minecraft release and Java major version before library downloads or world initialization. Other Minecraft release lines, previews, and Java majors older than 25 are unsupported. An older JVM can reject the Java 25 bytecode before Rift displays a message.

1. Stop the server and back up worlds and `plugins/Rift/`.
2. Place the Rift distribution jar in `plugins/`.
3. Start the server and run `/rift status`.

Restart to update the plugin jar. Configuration, profiles, and installed languages hot-load separately; do not use Bukkit `/reload` or plugin hot-loaders.

## Builds and downloads

Build with JDK 25:

```shell
./gradlew clean build
```

Use `gradlew.bat clean build` on Windows. The verified distribution goes to `build/libs/` and `../BUILDS/Rift.jar`. `-PbuildsDirectory=<path>` changes staging. `buildSwiftSwamp` uses the same verified staging workflow. Neither workflow installs the jar on a server.

Gradle uses a sibling VolmLib composite build when available. Set `-PuseLocalVolmLib=false` to use the published coordinate.

The distribution relocates and shrinks the required VolmLib code. SlimJar downloads and relocates Gson, TOML, and Adventure runtime dependencies instead of bundling them into the main jar. The bootstrap code and reflection-dependent fields remain available after shrinking.

Build checks compile against the minimum and maximum supported Paper APIs, verify Java 25 bytecode, and check required and forbidden distribution entries. A failed check leaves the previously staged jar unchanged.

English messages are generated locally. The other locale catalogs remain in the GitHub source repository and download on selection. See [Configuration and localization](/rift/04-configuration-localization) for language, metrics, update, and upload controls.

## Folia

Folia uses the same Minecraft and Java bounds. Listing, information, configuration, diagnostics, teleporting, and profile flag editing remain available.

Create, import, load, unload, quarantine, and restore are disabled because Rift cannot use dynamic world lifecycle operations there. Auto-load does not bypass that restriction. Unmanage retires a profile without unloading or moving its world.

## Uninstalling

Rift keeps its profiles and settings in `plugins/Rift/`, but the worlds it creates, imports, and quarantines are ordinary world folders in the server's world container. Decide which worlds to keep before you delete anything.

> Back up the world container and `plugins/Rift/` together before uninstalling. A deleted world folder cannot be recovered.
{.is-warning}

### Before removing the jar

1. Run `/rift list` to record every managed world and quarantine entry, and `/rift check <name>` to see each world's storage path.
2. Restore any quarantined world you want to keep with `/rift restore <id>`. Only Rift can restore a quarantine entry.
3. On Paper, run `/rift unload <name>` for each world you will delete. Rift moves the players in it to the evacuation world first.

### Remove Rift

1. Stop the server and delete the Rift jar from `plugins/`.
2. Delete `plugins/Rift/`. It holds the configuration, languages and language choices, world profiles and their policies, retired profiles, quarantine manifests, and diagnostic reports.
3. Delete the world data you do not want to keep:

| Data | Location | Remove it? |
|---|---|---|
| Worlds created by Rift | `<primary-world>/dimensions/rift/<key>/`, for example `world/dimensions/rift/example_world/` | Delete each unwanted world, or the whole `dimensions/rift/` folder to remove them all |
| Quarantined worlds | `<world-container>/.rift-trash/<id>/` | Delete the whole `.rift-trash/` folder; without Rift these entries cannot be restored |
| Imported worlds | Their original location | Rift never moves imported storage; keep or delete them like any other world |

4. Leave `plugins/bStats/` in place unless no remaining plugin on the server uses bStats; that folder is shared.
5. Remove `%rift_…%` placeholders from other plugins' configuration. Without Rift, PlaceholderAPI leaves them unreplaced.

### What remains

- The server does not load Rift-managed worlds by itself. Worlds you keep stay on disk until another world manager loads them.
- A world created with the `void` generator depends on Rift's generator. If another world manager loads it without a void generator, unexplored chunks generate as ordinary terrain.
- Difficulty, game rules (including PvP), world borders, and spawn locations that Rift applied are saved in each world and stay in effect, including in the primary world if Rift managed it. Change them with vanilla commands or another world manager.
- Players who logged out inside a world that no longer loads join in the primary world.

### Starting fresh

1. Stop the server.
2. Delete `plugins/Rift/`, `<world-container>/.rift-trash/`, and `<primary-world>/dimensions/rift/`.
3. Start the server with the Rift jar in `plugins/`. Rift creates a new `config.toml` and manages no worlds until you create or import them.

Next: [Commands and permissions](/rift/02-commands-permissions)
