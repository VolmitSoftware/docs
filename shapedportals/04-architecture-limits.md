---
title: "Shaped Portals: Developer Reference"
description: "Geometry, persistence, region ownership, and build instructions"
published: true
date: 2026-09-01T00:00:00.000Z
tags: "shapedportals, architecture, physics, limits"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<nav aria-label="Shaped Portals guides" style="display:flex;gap:.45rem;flex-wrap:wrap;margin:0 0 1.5rem;padding:0 0 1rem;border-bottom:1px solid rgba(127,127,127,.25)"><a href="/shapedportals" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Home</a><a href="/shapedportals/00-overview" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Build &amp; commands</a><a href="/shapedportals/01-installation-configuration" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Configuration</a><a href="/shapedportals/02-portal-behavior-events" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Portal behavior</a><a href="/shapedportals/03-compatibility-operations" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Server setup</a><a href="/shapedportals/04-architecture-limits" aria-current="page" style="display:block;padding:.48rem .76rem;border:1px solid #8b5cf6;border-radius:999px;background:#7e22ce;color:#fff;text-decoration:none;font-size:.88rem;font-weight:700">Developer reference</a></nav>

Shaped Portals separates geometry, region-owned world access, configuration, and persistent portal records. This page explains those boundaries for developers and integrations.

- [Geometry](#geometry-engine)
- [Persistence](#why-portal-records-are-required)
- [Threading](#thread-and-region-model)
- [Build](#build-from-source)
{.grid-list}

## Geometry engine

The scanner classifies integer plane coordinates as interior, frame, blocked, or unowned. It uses an iterative `ArrayDeque` traversal and hash sets rather than recursion. Inclusive limits stop the search before it can grow beyond the configured bounds.

Nether ignition tests both vertical axes independently. End activation tests the horizontal X/Z plane from the completed eye frame. A valid result contains immutable interior and frame-coordinate sets.

| Constraint | Reason |
|---|---|
| Vertical X/Z or horizontal X/Z plane | Nether blocks use a vertical axis; End blocks are always horizontal |
| One connected interior | Diagonal contact does not form a connected portal surface |
| Bounded area, width, and height | Keeps scanning and block changes finite |
| One owning Folia region | There is no atomic multi-region block commit |
| Revalidation before commit | Rejects changes made while integrations inspect the proposal |

For Nether portals, the [creation event contract](/shapedportals/02-portal-behavior-events#ignition-and-protection-plugins) lets protection plugins cancel the proposal before any blocks are placed. End portals instead check the eye interaction and fire `BlockCanBuildEvent` for each proposed cell before revalidating the frame.

## Why portal records are required

Neither `NETHER_PORTAL` nor `END_PORTAL` is a tile state that can hold a persistent data container. Runtime block metadata also does not survive restart. Scanning after startup cannot reliably distinguish managed portals from vanilla or other plugins' blocks.

The registry records ownership. Vertical axes `X` and `Z` identify Nether portals; axis `Y` identifies a horizontal End portal. This keeps both portal types in the same schema without guessing from world blocks after a restart.

Events mark nearby records for checks, and a periodic sweep reconciles loaded records. The plugin never relies on globally cancelling `BlockPhysicsEvent` to preserve an unusual shape.

See [Persistent ownership](/shapedportals/02-portal-behavior-events#persistent-ownership) for the stored fields and recovery rules.

## Thread and region model

| Work | Execution context |
|---|---|
| Automatic file reloads, GUI reloads, and GUI writes | Off the gameplay thread |
| Registry persistence | Dedicated asynchronous writer |
| Configuration and language activation | Atomic snapshot replacement |
| Shape scans, portal placement, repairs, and removal | Owning region |
| GUI results and player feedback | Player's owning scheduler |
| Teleport chunk preparation | Asynchronous where available, otherwise on the owning region |
| Landing checks | Destination region |
| Player teleport completion | Entity scheduler |

Integrity checks skip unloaded chunks. Administrative teleportation can prepare the portal and nearby landing chunks. Creation refuses shapes that span independently owned regions.

## Native mechanics boundary

The plugin uses Bukkit `Orientable` block data for Nether portal axes and ordinary `END_PORTAL` block data for horizontal End surfaces. It does not need NMS, packets, or version adapters.

Minecraft controls destination search, coordinate scaling, and generated destination frames. End surfaces are horizontal by native block behavior; vertical End tiles, 3D surfaces, exact pairing, and custom destinations require a separate display or teleport system.

No event set covers every possible external block mutation, which is why the periodic integrity sweep remains necessary.

## Shared systems

VolmLib supplies TOML handling, file watching, localization, validated translation downloads, command/help presentation, HUD coordination, and scheduling.

Shaped Portals owns geometry, registry policy, integrity decisions, commands, presentation settings, and its categorized configuration editor. Optional React integration reads concurrent counts without accessing live world state during sampling.

## Build from source

The Gradle wrapper uses Java 25 and produces Java 17 bytecode.

```text
./gradlew build
```

The shaded artifact is `build/libs/ShapedPortals-2.0.0.jar`. The build also exports the React pack to `build/distributions/react-api-packs/`.

Build checks cover tests, Spigot 1.20.1 and current Paper/Spigot API compilation, Java 17 class compatibility, VolmLib relocation, and the remote-language manifest. The manifest lists the 17 repository translations and follows `main`; locale TOML files are downloaded when needed rather than bundled in the jar.

`./gradlew publishToMavenLocal` runs the checks and publishes the shaded plugin and sources as `com.volmit:shapedportals:2.0.0`. The repository's build and local-publication tasks also refresh its configured staging jar.

## Related pages

- [Shaped Portals home *Feature summary and documentation index*](/shapedportals)
- [Portal behavior *Integrity, protection plugins, and event details*](/shapedportals/02-portal-behavior-events)
- [Compatibility and operations *Platforms, diagnostics, and React metrics*](/shapedportals/03-compatibility-operations)
- [Source repository *Plugin code, build files, and issue tracker*](https://github.com/VolmitSoftware/ShapedPortals)
{.links-list}
