---
title: "API - Getting Started"
description: "Iris documentation: API - Getting Started"
published: true
date: 2026-09-15T01:26:00.000Z
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

Set `iris.revision` to the selected tag or commit. The generated API jar contains class signatures and throwing method stubs. Use it only for compilation. Install the full Bukkit jar on the server.

For a local source build, run `./gradlew publishToMavenLocal`. This installs `art.arcane:iris:<irisVersion>` into local Maven. Use those coordinates with `provided` when building against your own checkout. They do not identify the JitPack artifact.

You can also compile against the full plugin jar:

```groovy
dependencies {
    compileOnly files('libs/Iris-<version>.jar')
}
```

Declare Iris as an optional dependency. Paper plugins that import the API need `join-classpath: true`.

## Access Iris Toolbelt

Toolbelt remains part of Iris. Its current package is `art.arcane.iris.world`.

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

Custom `PlatformChunkGenerator` implementations must implement `beginInitialEntry(boolean playerEntry)` and `completeInitialEntry()`. Creation passes whether its sender needs a player teleport, begins the scope before the generator initializes, and completes it after initial entry, before optional pregeneration. Implementations must release any scoped prefetch deferral on failure and close; ordinary server startup does not enter this scope.

`IrisEngine.InitializationMode.WORLD_CREATION` warms generation caches as tracked background work for fresh normal world creation. `RUNTIME` retains synchronous warming for restored worlds and other runtime callers. Both modes retain normal world behavior; generation awaits cache readiness and propagates uncaught warmup task failures.

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

Without a supplied history, persistent and Studio creation open and validate the saved history. Generator startup retains its final active-pack verification in both paths.

## Engine save requests

Call `Engine.requestSave()` from the appropriate world-owning thread. It returns `false` when lifecycle admission rejects the request; an accepted request runs mantle and world-manager hooks and saves engine metadata on the caller, while native structure ownership serialization runs as tracked background work. Acceptance does not mean the background write has finished. Reload and shutdown drain accepted writes before releasing their runtime. `Engine.save()` and `Engine.saveNow()` retain their synchronous behavior.

## Build an API artifact

Run `./gradlew irisApi` from the Iris repository to generate the API jar and a Maven repository under `build/api`. Set `DEPLOY_DIR` to choose another local output directory.
