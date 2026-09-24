---
title: "API - Getting Started"
description: "Iris documentation: API - Getting Started"
published: true
date: 2026-09-24T00:44:50.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Iris exposes Bukkit APIs for terrain queries, world and pregeneration events, and tree felling.

| Goal | Guide |
|---|---|
| Query generated terrain | [Terrain](/iris/91-api-terrain) |
| Observe engine or pregeneration changes | [World Events](/iris/92-api-world-events) |
| Start or charge tree felling | [Tree Feller](/iris/93-api-tree-feller) |
| Integrate a Fabric, Forge, or NeoForge mod | [Modded API](/iris/94-api-modded) |

## Add Iris to your project

Use Java 25 and compile against the same Iris revision installed on the server. Do not bundle Iris into your plugin.

JitPack serves Iris under `com.github.VolmitSoftware:Iris:<tag-or-commit>`. Select a revision with a successful [JitPack build](https://jitpack.io/#VolmitSoftware/Iris). The version is a Git tag or commit, not the version string inside `plugin.yml`.

```xml
<repositories>
    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>com.github.VolmitSoftware</groupId>
        <artifactId>Iris</artifactId>
        <version>${iris.revision}</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

Set `iris.revision` to the selected tag or commit. Use the API jar only for compilation. Install the full Bukkit jar on the server.

For a local source build, run `./gradlew publishToMavenLocal`. This installs `art.arcane:iris:<irisVersion>` into local Maven. Use those coordinates with `provided` when building against your own checkout. They do not identify the JitPack artifact.

You can also compile against the full plugin jar:

```groovy
dependencies {
    compileOnly files('libs/Iris-<version>.jar')
}
```

Declare Iris as an optional dependency. Paper plugins that import the API need `join-classpath: true`.

## Access Iris Toolbelt

Import Toolbelt from `art.arcane.iris.world`.

```java
import art.arcane.iris.generation.runtime.Engine;
import art.arcane.iris.platform.generation.PlatformChunkGenerator;
import art.arcane.iris.world.IrisToolbelt;

PlatformChunkGenerator generator = IrisToolbelt.access(world);
Engine engine = generator == null ? null : generator.getEngine();
if (engine == null || engine.isClosed()) {
    return;
}
```

The API jar includes the VolmLib types needed by these signatures. Toolbelt access does not require a separate VolmLib dependency. Prefer the terrain service below for terrain queries that do not need engine access.

## Get a service

```java
RegisteredServiceProvider<IrisTerrainService> registration =
    Bukkit.getServicesManager().getRegistration(IrisTerrainService.class);

IrisTerrainService terrain = registration == null ? null : registration.getProvider();
```

Look up services when needed instead of keeping them across an Iris reload. Terrain reads are safe from any thread. Tree-feller calls must run on the thread delivering the block event. World and pregeneration events run on the server's global thread.

When switching over Iris enums, include a `default` branch so future values do not break your integration.

## World creation

`StudioSVC.installIntoWorld` returns `StudioSVC.GenerationPublication`, which contains the published `dimension()` and verified `history()`. Pass that history to `IrisWorldCreator.generationHistory(...)` before `create()`. It must match the target dimension directory and seed; transient worlds cannot accept a generation history.

Standalone integrations can use `art.arcane.iris.world.history.GenerationHistory.createUnpublished(FreshCreation)` for a fresh world held in private staging. The nested `FreshCreation` record supplies the dimension root, source pack, pack fingerprint, seed, dimension contract, and registry contract. The dimension root must not exist and its parent must exist. Saved-biome and semantic appends defer durable synchronization until the integration publishes the complete world; ordinary `GenerationHistory.create(...)` and `open(...)` retain immediate append durability.

The integration must drain generation, close its resources, force every staged file and directory, atomically move the completed staging tree to its destination, and force the destination's parent before reporting successful publication. A failure before the move leaves the staging tree unpublished. A failure while forcing the parent can occur after the destination appears, so destination presence alone does not confirm successful publication.

## Engine save requests

Call `Engine.requestSave()` from the world-owning thread. It returns `false` when Iris cannot accept the request. An accepted request can finish writing in the background. Use `Engine.save()` or `Engine.saveNow()` when the write must finish before returning.

## Build an API artifact

Run `./gradlew irisApi` from the Iris repository to generate the API jar and a Maven repository under `build/api`. Set `DEPLOY_DIR` to choose another local output directory.
