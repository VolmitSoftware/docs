---
title: "Maintainer — Source organization"
description: "Iris package ownership and its shared VolmLib dependencies."
published: true
date: 2026-09-12T16:00:00.000Z
tags: "iris, development"
editor: markdown
dateCreated: 2026-09-11T20:00:00.000Z
---

Iris groups source code by feature. VolmLib owns the reusable algorithms and storage primitives. Iris owns pack interpretation, world generation, world lifecycle, and authoring workflows.

## Build modules

| Location | Responsibility |
|---|---|
| `core` | Shared Iris implementation and resources |
| `spi` | Platform contracts |
| `adapters/bukkit` | Bukkit plugin entry points, public API, and versioned native bindings |
| `adapters/modded-common` | Shared mod-loader implementation |
| `adapters/minecraft-common` | Shared native Minecraft generation code |
| `adapters/client-common` | Shared client code |
| `adapters/fabric`, `adapters/forge`, `adapters/neoforge` | Loader entry points and independent loader builds |
| `probe` | Offline initialization and generation probes |
| `core/agent` | Embedded generation agent |

Feature packages remain within these modules. A package does not introduce another Gradle project. Some Bukkit-dependent implementation remains in `core`, with the existing purity checks tracking that boundary.

## Feature packages

All names below start with `art.arcane.iris`.

| Package | Responsibility |
|---|---|
| `generation` | Terrain, biomes, caves, hydrology, decoration, runtime, stages, and generation caches |
| `structure` | Objects, jigsaw definitions, graph compilation, placement, authoring, and export |
| `pack` | Loading, validation, schemas, datapacks, and pack operations |
| `world` | World lifecycle, saved history, storage, pregeneration, entities, loot, and tree felling |
| `studio` | Authoring sessions, jigsaw editing, object editing, previews, and workspaces |
| `platform` | Server bindings, native access, protocol handling, and bootstrap support |
| `command` | Iris commands and argument bindings |
| `integration` | External plugin and shared integration bindings |
| `configuration` | Iris settings and settings reload |
| `localization` | Iris message catalogs and language handling |
| `diagnostics` | Reports, log filtering, and startup display |

Definitions and their implementation helpers share the owning feature package. For example, biome definitions and biome generators live in `generation.biome`. Jigsaw studio sessions and editing services live in `studio.jigsaw`.

## Shared implementations

VolmLib supplies noise, interpolation, procedural streams, hunk storage, coordinate math, rarity selection, and generic command handlers. Iris imports those implementations directly. See [Noise and procedural streams](/volmlib/api/noise) and [Hunks and coordinate math](/volmlib/api/hunks).

Iris retains image and expression resource bindings in `generation.noise`. Runtime-owned stream caches and context injection live in `generation.stream`. World-backed hunk views live in `generation.chunk`.

The Bukkit developer API remains under `art.arcane.iris.api`. Code that uses internal Iris types must import their owning feature packages. Pack JSON resource names and fields are independent of these Java package names.

Generated schema definition IDs and their `$ref` targets follow the new Java packages. These package moves preserve every resource field, description, default, constraint, and enum value.

## Saved data

Matter slice identifiers are part of the saved format. `world.storage.matter.IrisMatterSupport` registers each identifier with VolmLib before storage opens. Package moves retain these identifiers, so saved slices remain readable without rewriting world data.

| Stored identifier | Payload type |
|---|---|
| `art.arcane.iris.core.link.Identifier` | `integration.Identifier` |
| `art.arcane.iris.engine.object.IrisSpawner` | `world.entity.IrisSpawner` |
| `art.arcane.iris.util.project.matter.TileWrapper` | `world.storage.matter.TileWrapper` |
| `art.arcane.iris.util.project.matter.PreObjectMatterCell` | `world.storage.matter.PreObjectMatterCell` |
| `art.arcane.iris.engine.hydrology.cave.HydrologyCaveCell` | `generation.hydrology.cave.HydrologyCaveCell` |
| `art.arcane.iris.engine.framework.NativeStructureOwnershipBundle` | `structure.nativegen.NativeStructureOwnershipBundle` |
| `art.arcane.iris.engine.framework.TreeBlockMaterial` | `generation.decoration.tree.TreeBlockMaterial` |

These identifiers remain the write and read keys even though their text contains former package names. See [Matter slice identifiers](/volmlib/api#matter-slice-identifiers) for the registration contract.

## Build metadata

Generation revision capture includes source roots and the resolved VolmLib artifact. Package changes also affect reflection targets, classloading checks, resource metadata, and artifact verification. The build validates the generation revision before packaging jars.

Bukkit release jars retain command parameter handlers, context handlers, custom handlers, and annotated mantle components. Artifact verification requires every handler class from those source packages and every component with `ComponentFlag`, including classes discovered through package scanning.
