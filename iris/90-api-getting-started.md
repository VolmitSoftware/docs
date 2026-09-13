---
title: "API - Getting Started"
description: "Iris documentation: API - Getting Started"
published: true
date: 2026-09-13T19:00:00.000Z
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

The API jar includes the VolmLib types needed by these signatures. Toolbelt access does not require a separate VolmLib dependency. Prefer the terrain service below for terrain queries that do not need engine access.

## Get a service

```java
RegisteredServiceProvider<IrisTerrainService> registration =
    Bukkit.getServicesManager().getRegistration(IrisTerrainService.class);

IrisTerrainService terrain = registration == null ? null : registration.getProvider();
```

Look up services when needed instead of keeping them across an Iris reload. Terrain reads are safe from any thread. Tree-feller calls must run on the thread delivering the block event. World and pregeneration events run on the server's global thread.

When switching over Iris enums, include a `default` branch so future values do not break your integration.

## Engine save requests

Call `Engine.requestSave()` from the appropriate world-owning thread. It returns `false` when lifecycle admission rejects the request; an accepted request runs mantle and world-manager hooks and saves engine metadata on the caller, while native structure ownership serialization runs as tracked background work. Acceptance does not mean the background write has finished. Reload and shutdown drain accepted writes before releasing their runtime. `Engine.save()` and `Engine.saveNow()` retain their synchronous behavior.

## Build artifacts

Iris has no GitHub Actions CI workflow. Run builds, tests, and artifact verification locally; pushes and pull requests do not run these checks automatically.

JitPack uses `jitpack.yml` to build and publish the API with remote dependencies. Reproduce that build with `./gradlew --no-daemon build publishToMavenLocal -PuseLocalVolmLib=false -PuseMavenLocal=false`. Iris pins the shared VolmLib artifact and packaging plugin to the same revision. Integration repositories only resolve their own groups or modules. ItemsAdder's API resolves from Maven Central.

Run `./gradlew irisApi` to generate the API jar and a Maven repository under `build/api`. Set `DEPLOY_DIR` to use another output directory. This writes files locally and does not upload them to a remote repository.

All four Iris platform builds use [shared automatic jar thinning](/volmlib/api/building#automatic-jar-thinning). The build removes unreachable VolmLib classes while retaining Iris classes, reflective Matter slices, resources, and loader-specific library packaging. Runtime jars retain source locations and parameter names.

Run `./gradlew verifyBukkitArtifact verifyModdedArtifacts` from the Iris repository to assemble and check all four jars without staging. Artifact checks include class references from field and method descriptors. Reports under each platform's `build/reports/packaging/` list removed classes and archive sizes.

Bukkit release builds use stronger compression by default. Run `./gradlew verifyBukkitArtifact` to build and check the jar. Compression preserves entry contents and adds no runtime downloads. Development mode (`-PvolmitPackaging=dev` or `VOLMIT_PACKAGING=dev`) skips stronger compression by default. Set `-PcompactRelease=true` or `false` to override that choice. Both modes strip unnecessary dependency debug tables while keeping source locations and parameter names.

## Source ownership

The Bukkit API remains under `art.arcane.iris.api`. Internal types use the feature packages listed in [Source organization](/iris/88-source-organization). Reusable noise, interpolation, streams, and hunk storage come from VolmLib.
