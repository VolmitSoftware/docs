---
title: "Optics Overview"
description: "Build Optics and understand its packages, API guarantees, and integration boundaries"
published: true
date: 2026-10-13T00:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

Optics is the Java library behind Wormholes' portal geometry and projection. It defines geometry, masks, animation, portals and APIs for sampled destination views. The library has no Minecraft, Bukkit, Fabric, Forge or NeoForge types. The host supplies world access, output, scheduling and rendering.

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
| `crossing` | `PlaneCrossing`, `Pose`, `PoseTransform`, `ArrivalOrientation`, `LookTransfer`, `OrientationRule`, `MomentumRule`, `ScaleRule`, `GravityFrame`, `TravellerState`, `TravellerTransform` |
| `claim` | Block claims, claim sets, blackout shells and the world output they write to |
| `scan`, `volume` | Cell scans, frustums, view volumes, level of detail, gaze scheduling and resample cadence |
| `plate` | Shared destination view plates, capture jobs, chunk leases and worker pools |
| `occlusion`, `recursion` | View and entity occlusion, nested portal view planning |
| `entity` | Projected entity snapshots, deltas, `EntityVisualMetadata` gravity/scale headers, spoofed identities, names, metadata and map relays |
| `fidelity`, `light` | Atmosphere, acoustics, weather and block-entity relays, client profiles, light overlays and sky math |
| `state` | Block-state orientation rules and rewrite caches for rotated and reflected views |
| `view` | Block and section views, section caches, world change tracking and `AffineProjection` for host-sampled aperture transforms |
| `stream` | The ClientView stream protocol: handshake, sessions, codecs, plates, bricks, entity frames and environment state |
| `client` | Client-side cell rules, sweeps, mesh plans and light sampling |
| `spi` | `OpticsScheduler`, `OpticsMetrics`, `ScaleAccess` and `GravityAccess`, the hooks a host implements |

Packages under `internal` are implementation detail and are not API.

For streamed entity frames, implement `EntityScenes.isObserver(observer, visual)` to identify the observer's snapshot. `EntityScenes.observerVisible(observer, portal)` defaults to `false`. Return `true` for a view that should include that snapshot even when its target requests observer suppression. Keep identity checks independent of the view's visibility policy so other entity filtering remains consistent.

For additional streamed geometry metadata, implement `ViewStreamEndpoints.geometryMetadata(observer, portalId, context)`. The hook runs on the owning server context and supplies the portal key, aperture descriptor, and negotiated capabilities. Capture immutable values there and return a `GeometryMetadata` callback that creates extension messages from the supplied wire geometry revision, without reading world or entity state. The stream lane emits those messages immediately after the matching `Portal` descriptor and before its content. Check negotiated capabilities during capture. The default callback returns no messages.

## Rules a consumer can rely on

- Pure Java. Nothing in the library imports a Minecraft, Bukkit, mod-loader or other platform class. Positions are `Vec3d`, directions are `Face`, colors are `Rgba`.
- No reflection, no service loaders and no static mutable state. Hosts pass their scheduler, metrics and scale access explicitly through the `spi` interfaces.
- `internal` packages never appear in a public signature.
- Math records and portal definitions return new values. Registries, caches, scans, animators, claim sets and `Box` hold mutable state.
- Some hot-path methods write into supplied arrays, such as `pointInto(x, y, z, double[] out3)`. List queries generally append results and report how many entries they added.
- Validation depends on the API. Constructors can reject invalid input, descriptor factories can return an empty `Optional`, and queries can return `null`.

The Wormholes build scans the library source on every change and rejects platform types, reflection, service loaders, static state and `internal` exposure.

## Integration boundaries

`PortalDefinition` describes a cell-aligned aperture. Its frame uses cardinal faces, its dimensions count whole cells, and placement snaps to the cell grid. See [04 - Portals](/optics/04-portals).

`Affine`, `Quaternion` and animation clips support free render transforms, fractional size, shear and continuous motion. A host must sample and apply these values. `PortalTracks` defines keys and helper clips, but Wormholes does not bind these tracks to its runtime portals.

An unmodified Minecraft client does not implement the ClientView protocol. A server host can send ordinary blocks, entities or display geometry through its own adapter. A compatible client can negotiate the stream capabilities described in [10 - ClientView and Client Geometry](/optics/10-clientview-and-client-geometry).

`TravellerState` combines pose, percentage-readable scale and a cardinal gravity frame. `TravellerTransform` carries that state through a portal similarity. Gravity frames support 24 proper orientations, with six possible down directions and exact 90-degree turns. The host applies physics, camera, model orientation and synchronized state through its platform adapter. See [05 - Apertures and Crossing](/optics/05-apertures-and-crossing#directional-gravity-and-traveller-state).

A host can draw sampled shapes and transforms as a virtual scene. This does not establish support for arbitrary live-world portal rendering, continuous travel, shaders or every client renderer.

## Reference map

| Task | Reference |
|---|---|
| Place, rotate or scale coordinate systems | [01 - Frames and Transforms](/optics/01-frames-and-transforms) |
| Define masks and produce meshes or outlines | [02 - Shapes](/optics/02-shapes) |
| Animate values and coordinate effects | [03 - Animation](/optics/03-animation) |
| Create, move, resize, link and query portals | [04 - Portals](/optics/04-portals) |
| Convert apertures and transfer traveller state | [05 - Apertures and Crossing](/optics/05-apertures-and-crossing) |
| Sample projected blocks and limit visibility | [06 - Projection and Visibility](/optics/06-projection-and-visibility) |
| Supply world data and manage reusable captures | [07 - World Views and Plates](/optics/07-world-views-and-plates) |
| Project entity state and relationships | [08 - Entity Projection](/optics/08-entity-projection) |
| Relay destination appearance and orient block states | [09 - Fidelity and Block States](/optics/09-fidelity-and-block-states) |
| Implement a compatible stream consumer | [10 - ClientView and Client Geometry](/optics/10-clientview-and-client-geometry) |
| Implement platform services and use math helpers | [11 - Math and Host Interfaces](/optics/11-math-and-host-interfaces) |
