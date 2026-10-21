---
title: "Husk - Building"
description: "Java requirements, supported targets, Gradle commands, and distribution names"
published: true
date: 2026-10-21T00:00:00.000Z
tags: "husk, building"
editor: markdown
dateCreated: 2026-10-15T03:00:00.000Z
---

Run the included Gradle wrapper with JDK 25. Install JDK 17 and JDK 21 alongside it for the older target toolchains; the shared runtime tests run on Java 17. Run commands from the project root. The first build downloads the selected Minecraft and loader development dependencies.

## Supported targets

| Minecraft | Java runtime | Fabric Loader | Forge | NeoForge |
|---|---|---|---|---|
| 1.20.1 | 17 | 0.19.5 | 1.20.1-47.4.28 | Use the Forge jar |
| 1.21.1 | 21 | 0.19.5 | 1.21.1-52.1.20 | 21.1.262 |
| 26.1.2 | 25 | 0.19.5 | 26.1.2-64.1.4 | 26.1.2.116 |
| 26.2 | 25 | 0.19.5 | 26.2-65.1.3 | 26.2.0.89 |
| 26.3 | 25 | 0.19.5 | 26.3-66.0.8 | 26.3.0.33-beta |

The Bukkit-family distribution supports these five exact Minecraft releases on Spigot, Paper, and available Folia releases. The range in its filename does not include intervening Minecraft versions. Forge is required for every target; NeoForge 1.20.1 uses the Forge 1.20.1 artifact. `gradle/targets.json` defines the mod dependency versions; `minecraftVersion` in `gradle.properties` selects the default target for individual loader tasks.

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

`build` and `buildAll` build and check the entire matrix, then collect fifteen distributable jars in `build/distributions/`. `buildBukkit` builds and checks the Bukkit artifact. `fabricJar`, `forgeJar`, and `neoforgeJar` select the default Minecraft target; append `1_20_1`, `1_21_1`, `26_1_2`, `26_2`, or `26_3` to select an explicit target. `buildFabric`, `buildForge`, and `buildNeoForge` build every target for one loader. `neoforgeJar1_20_1` builds the shared Forge artifact. `checkAll` runs the complete build gate.

`build/artifacts.json` records each distribution filename, byte size, and SHA-256 digest. Aggregate loader tasks keep their included VolmLib outputs separate for each loader and target.

Run a loader build directly with:

```sh
./gradlew -p adapters/fabric build -PminecraftVersion=26.2
```

Use `build` or the root loader tasks for distributable jars. Fabric 1.20.1/1.21.1 and Forge 1.20.1 require remapping after shading; their `shadowJar` output in `devlibs/` is a development artifact. Forge 1.21.1 uses Mojang names directly. Deploy the completed jar from `libs/` or `build/distributions/`.

Each loader stores its outputs under `adapters/<loader>/build/<minecraft>/`. Bukkit outputs are under `bukkit/build/libs/`. The artifact names follow the Volmit convention:

```none
Husk v0.1.0 [CraftBukkit] 1.20.1-26.3.jar
Husk v0.1.0 [Forge] 1.20.1+47.4.28.jar
Husk v0.1.0 [NeoForge] 1.21.1+21.1.262.jar
Husk v0.1.0 [Fabric] 26.3+0.19.5.jar
Husk v0.1.0 [Forge] 26.3+66.0.8.jar
Husk v0.1.0 [NeoForge] 26.3+26.3.0.33.jar
```

Build commands retain artifacts in the project's build directories. After registering the source workspace, run `projects build husk --all-targets` from Multiplexor to build the targets in separate source copies. Select `--target fabric-26.3` to build one target. Export and server delivery use named destinations with a preview; see [Project builds](/servermultiplexor/13-project-builds).

## VolmLib dependency

Husk searches upward for a `VolmLib` checkout and substitutes its local Gradle projects. Set `-PlocalVolmLibDirectory=/path/to/VolmLib` or `VOLMLIB_DIR` to choose a checkout elsewhere. Relative property paths are resolved from the Husk root.

The example uses `volmlib-localization`, which includes the platform-neutral configuration, atomic file, and splash helpers. It is shaded into every distribution; no separate VolmLib jar is installed. Use `-PuseLocalVolmLib=false` for remote resolution and set `volmLibVersion` to a published revision containing the APIs used by the project.

See [Developing a project](/husk/02-development) for identity settings and target extensions.
