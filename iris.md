---
title: "Iris"
description: "Iris world generation engine for Paper and Folia"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Iris replaces vanilla world generation. You write dimensions, regions, biomes, objects, and
jigsaw structures as JSON data packs. Iris assembles them when it generates a chunk.

| | |
|---|---|
| Command | `/iris` (`ir`, `irs`) |
| Load | `STARTUP` — before any world loads |
| Folia | Supported |
| Permissions | `iris.all`, `iris.treefeller` |
| Direct Bukkit integrations | WorldEdit, Multiverse-Core, PlaceholderAPI, CraftEngine, Nexo, ItemsAdder, ExecutableItems, MMOItems, EcoItems, MythicMobs, MythicCrucible, KGenerators |
| Ecosystem prerequisites | SCore loads for ExecutableItems, MythicLib for MMOItems, and eco for EcoItems; none is a direct Iris provider |
| Iris-aware Volmit plugins | React consumes Iris metrics; Wormholes uses Iris biome, terrain, and fluid probes for random teleport destinations |

> Iris declares `loadbefore: Multiverse-Core`. If you run Multiverse, Iris must start first.
> If Multiverse starts first, it claims Iris worlds with the vanilla generator.
> Multiverse cannot create, delete, regenerate, or clone Iris worlds — those commands are
> refused. Read [Multiverse](/iris/34-multiverse) before running any of them.
{.is-warning}

## Permissions

| Node | Default | Covers |
|---|---|---|
| `iris.all` | `op` | The full `/iris` tree — worlds, studio, pregen, packs, developer tools |
| `iris.treefeller` | `op` | Lets survival players fell Iris-managed trees with an axe |

`iris.all` is coarse. There is no per-subcommand node. Anyone who holds it can create,
unload, evacuate, and delete worlds. Grant it to administrators only. Use
`iris.treefeller` for the one player-facing feature.

### Getting started

- [Overview](/iris/00-overview)
- [Installation & Platforms](/iris/01-installation-platforms)
- [Getting Started](/iris/02-getting-started)
- [Configuration](/iris/03-configuration)
- [Commands & Permissions](/iris/04-commands-permissions)
{.links-list}

### Concepts and worlds

- [Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [Worlds & Lifecycle](/iris/06-worlds-lifecycle)
- [Pregeneration](/iris/07-pregeneration)
- [Localization](/iris/08-localization)
- [PlaceholderAPI](/iris/09-placeholderapi)
- [Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
{.links-list}

### Authoring a pack

- [Dimensions](/iris/11-dimensions)
- [Regions](/iris/12-regions)
- [Biomes](/iris/13-biomes)
- [Generators, Noise & Expressions](/iris/14-generators-noise)
- [Caves & Carving](/iris/15-caves-carving)
- [Image Map Concepts](/iris/37-image-map-concepts)
- [Supported Image Inputs](/iris/38-supported-image-inputs)
- [Grayscale Heightmaps](/iris/39-grayscale-heightmaps)
- [RGB Heightmaps](/iris/40-rgb-heightmaps)
- [Color Maps & Masks](/iris/41-color-maps-masks)
- [Image Map Studio Workflow](/iris/42-image-map-studio-workflow)
- [Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates)
- [Biome Catalog](/iris/44-biome-catalog)
- [Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits)
- [Trees, Fungi, Coral, Crystals, Formations, Ruins](/iris/17-trees-fungi-coral-crystals-formations-ruins)
- [Structures Overview](/iris/18-structures-overview)
- [Objects](/iris/19-objects)
- [Object Placement](/iris/20-object-placement)
- [Jigsaw Structures](/iris/21-jigsaw-structures)
- [Native Structures & Datapacks](/iris/22-native-structures-datapacks)
- [Loot, Entities, Spawners, Markers](/iris/23-loot-entities-spawners-markers)
- [Vanilla Passthrough](/iris/35-vanilla-passthrough)
- [Pack Mods & Snippets](/iris/24-pack-mods-snippets)
- [Pack Management](/iris/25-pack-management)
{.links-list}

### Examples and operations

- [Example - Minimal Dimension](/iris/26-example-minimal-dimension)
- [Example - Configuring Overworld](/iris/27-example-configuring-overworld)
- [Integrations](/iris/28-integrations)
- [Client HUD & Protocol](/iris/29-client-hud-protocol)
- [Platform Differences](/iris/30-platform-differences)
- [Operator Runbooks](/iris/31-operator-runbooks)
- [Determinism & Goldenhash](/iris/32-determinism-goldenhash)
- [Performance Tuning](/iris/33-performance-tuning)
- [Multiverse](/iris/34-multiverse)
{.links-list}

### Maintainer

- [Maintainer - MC Version Bump](/iris/85-maintainer-mc-version-bump)
- [Maintainer - Release Checklist](/iris/86-maintainer-release-checklist)
- [Maintainer - Release Readiness](/iris/87-maintainer-release-readiness)
{.links-list}

### Developer API

- [API - Getting Started](/iris/90-api-getting-started)
- [API - Terrain](/iris/91-api-terrain)
- [API - World Events](/iris/92-api-world-events)
- [API - Tree Feller](/iris/93-api-tree-feller)
- [API - Modded](/iris/94-api-modded)
{.links-list}


## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/Iris*](https://github.com/VolmitSoftware/Iris)
- [Dimension packs *github.com/IrisDimensions*](https://github.com/IrisDimensions)
{.links-list}
