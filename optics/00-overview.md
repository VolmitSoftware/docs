---
title: "Optics Overview"
description: "Optics documentation: packages, build, and the rules a consumer can rely on"
published: true
date: 2026-10-08T12:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

Optics is the Java library behind Wormholes' portal geometry and projection. It defines frames, rigid and general transforms, aperture shape masks, a sampled animation model, a portal definition and registry API, and the scan, plate, occlusion, entity and view-stream machinery that turns a portal into a picture of its destination. The library has no Minecraft, Bukkit, Fabric, Forge or NeoForge types; the host supplies world access through small interfaces.

## Getting it

| | |
|---|---|
| Coordinates | `art.arcane:optics` |
| Version | `opticsVersion` in the repository's `gradle.properties` |
| Java | 25, compiled with `-parameters` |
| Runtime dependency | `it.unimi.dsi:fastutil` |
| Source | [github.com/VolmitSoftware/Optics](https://github.com/VolmitSoftware/Optics) |

Build from the repository root with `./gradlew build`. `./gradlew test` runs the unit tests alone, and `./gradlew publishToMavenLocal` installs the jar and its sources jar as `art.arcane:optics:<opticsVersion>` in the local Maven repository. Inside a Wormholes checkout the same source is the `optics/` submodule and `./gradlew :optics:test` runs its tests from there. Wormholes shades the library into every distribution, so a plugin that only talks to Wormholes never adds Optics itself.

## Packages

| Package | What it holds |
|---|---|
| `math` | `Vec3d`, `Vec2d`, `Rgba`, `Face`, `Axis`, `Box`, `BlockBox`, `Angles`, `CellKeys` |
| `frame` | `Frame`, `AxisPermutation`, `QuarterTurn`, `OpticTransform`, `Similarity`, `ViewWindow` |
| `transform` | `Affine`, `Quaternion`, `EulerAngles`, `EulerOrder` |
| `shape` | `Shape` and its presets, `ShapeDescriptor`, `PlaneShape`, `ShapeRaster`, `ShapeMesh`, `Outline`, `ShapeRasterCache` |
| `animation` | `Easing`, `Clip`, `Tween`, `Track`, `Sequence`, `Loop`, `Timeline`, `Animator`, `TimeSource`, `Interpolators` |
| `portal` | `PortalDefinition`, `PortalBuilder`, `PortalLink`, `PortalRegistry`, `PortalDirectory`, `PortalCrossing`, `PortalTracks` |
| `aperture` | Cell apertures, `ApertureDescriptor`, `AperturePolygon`, `SizeRatio`, `Endpoint`, `EndpointDirectory`, observer geometry and boundary samples |
| `crossing` | `PlaneCrossing`, `Pose`, `PoseTransform`, `ArrivalOrientation`, `LookTransfer`, `OrientationRule`, `MomentumRule`, `ScaleRule` |
| `claim` | Block claims, claim sets, blackout shells and the world output they write to |
| `scan`, `volume` | Cell scans, frustums, view volumes, level of detail, gaze scheduling and resample cadence |
| `plate` | Shared destination view plates, capture jobs, chunk leases and worker pools |
| `occlusion`, `recursion` | View and entity occlusion, nested portal view planning |
| `entity` | Projected entity snapshots, deltas, spoofed identities, names, metadata and map relays |
| `fidelity`, `light` | Atmosphere, acoustics, weather and block-entity relays, client profiles, light overlays and sky math |
| `state` | Block-state orientation rules and rewrite caches for rotated and reflected views |
| `view` | Block and section views, section caches and world change tracking |
| `stream` | The ClientView stream protocol: handshake, sessions, codecs, plates, bricks, entity frames and environment state |
| `client` | Client-side cell rules, sweeps, mesh plans and light sampling |
| `spi` | `OpticsScheduler`, `OpticsMetrics` and `ScaleAccess`, the hooks a host implements |

Packages under `internal` are implementation detail and are not API.

## Rules a consumer can rely on

- Pure Java. Nothing in the library imports a Minecraft, Bukkit, mod-loader or other platform class. Positions are `Vec3d`, directions are `Face`, colours are `Rgba`.
- No reflection, no service loaders and no static mutable state. Hosts pass their scheduler, metrics and scale access explicitly through the `spi` interfaces.
- `internal` packages never appear in a public signature.
- Value types are records or immutable final classes; operations return new instances.
- Hot-path methods have allocation-free variants that write into a caller-supplied array, such as `pointInto(x, y, z, double[] out3)`, and queries that fill a caller-supplied list return how many entries they added.
- Invalid arguments throw `IllegalArgumentException` naming the offending value.

The Wormholes build scans the library source on every change and rejects platform types, reflection, service loaders, static state and `internal` exposure.
