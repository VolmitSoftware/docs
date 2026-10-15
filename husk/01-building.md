---
title: "Husk - Building"
description: "Java requirements, supported targets, Gradle commands, and distribution names"
published: true
date: 2026-10-15T03:00:00.000Z
tags: "husk, building"
editor: markdown
dateCreated: 2026-10-15T03:00:00.000Z
---

Build Husk with JDK 25 and its included Gradle wrapper. Run commands from the project root. The first build downloads the selected Minecraft and loader development dependencies.

## Supported targets

| Minecraft | Fabric Loader | Forge | NeoForge |
|---|---|---|---|
| 26.1.2 | 0.19.5 | 26.1.2-64.1.4 | 26.1.2.116 |
| 26.2 | 0.19.5 | 26.2-65.1.3 | 26.2.0.89 |
| 26.3 | 0.19.5 | 26.3-66.0.8 | 26.3.0.33-beta |

The Bukkit-family distribution supports these three Minecraft releases on Spigot, Paper, and Folia. `gradle/targets.json` defines the mod dependency versions; `minecraftVersion` in `gradle.properties` selects the default target for individual loader tasks.

## Build commands

```sh
./gradlew build
./gradlew buildBukkit
./gradlew fabricJar
./gradlew forgeJar26_1_2
./gradlew neoforgeJar26_2
./gradlew test
./gradlew targets
```

`build` and `buildAll` build and check the entire matrix, then collect ten distributable jars in `build/distributions/`. `buildBukkit` builds and checks the Bukkit artifact. `fabricJar`, `forgeJar`, and `neoforgeJar` select the default Minecraft target; append `26_1_2`, `26_2`, or `26_3` to select an explicit target. `buildFabric`, `buildForge`, and `buildNeoForge` build every target for one loader. `checkAll` runs the complete build gate.

`build/artifacts.json` records each distribution filename, byte size, and SHA-256 digest. Aggregate loader tasks keep their included VolmLib outputs separate for each loader and target.

Run a loader build directly with:

```sh
./gradlew -p adapters/fabric build -PminecraftVersion=26.2
```

Each loader stores its outputs under `adapters/<loader>/build/<minecraft>/`. Bukkit outputs are under `bukkit/build/libs/`. The artifact names follow the Volmit convention:

```text
Husk v0.1.0 [CraftBukkit] 26.1.2-26.3.jar
Husk v0.1.0 [Fabric] 26.3+0.19.5.jar
Husk v0.1.0 [Forge] 26.3+66.0.8.jar
Husk v0.1.0 [NeoForge] 26.3+26.3.0.33.jar
```

`buildAllToOut` copies the full set to the sibling `PluginOuts` directory. Override that destination with `-PpluginOutDirectory=/path/to/output`. Build commands do not install artifacts into servers.

## VolmLib dependency

Husk searches upward for a `VolmLib` checkout and substitutes its local Gradle projects. Set `-PlocalVolmLibDirectory=/path/to/VolmLib` or `VOLMLIB_DIR` to choose a checkout elsewhere. Relative property paths are resolved from the Husk root.

The example uses `volmlib-localization`, which includes the platform-neutral configuration, atomic file, and splash helpers. It is shaded into every distribution; no separate VolmLib jar is installed. Use `-PuseLocalVolmLib=false` for remote resolution and set `volmLibVersion` to a published revision containing the APIs used by the project.

See [Developing a project](/husk/02-development) for identity settings and target extensions.
