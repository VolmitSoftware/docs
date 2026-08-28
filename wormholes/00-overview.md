---
title: "Overview"
description: "Wormholes features, portal lifecycle, compatibility, and documentation map"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes is a portal, projection, and traversal plugin for modern Paper and
Folia servers. A frame portal can show destination blocks and entities before a
traveler crosses it. The same runtime also supports random teleport, survival
Dimensional Doors, pocket dimensions, and signed cross-server gateways.

## What Wormholes includes

| System | What it does | Continue with |
|---|---|---|
| Frame portals | Creates a flat aperture from a wand selection or connected runes | [Building Portals](/wormholes/03-building-portals) |
| Live projection | Sends destination blocks, lighting, and supported entities to each interested viewer | [Projection Modes and Settings](/wormholes/05-projection-modes-settings) |
| Local traversal | Links portals in the same server and preserves travel direction, access, cost, and cooldown rules | [Portal Types, Menus, and Settings](/wormholes/04-portal-types-menus-settings) |
| Random teleport | Searches for a safe destination using world, radius, height, biome, allocation, and rotation rules | [Random Teleport Portals](/wormholes/06-random-teleport-portals) |
| Dimensional Doors | Adds paired, personal, and public doors or trapdoors with configurable recipes | [Dimensional Doors](/wormholes/07-dimensional-doors) |
| Pocket dimensions | Allocates private rooms in a managed void world and provides a return route | [Pocket Dimensions](/wormholes/08-pocket-dimensions) |
| Cross-server gateways | Exchanges signed codes, trusts peers, streams remote views, and transfers travelers | [Cross-Server Networking](/wormholes/10-cross-server-networking) |
| Public integrations | Exposes placeholders, travel pricing hooks, traversal events, and runtime metrics | [Integrations](/wormholes/15-integrations) |

## How a frame portal works

1. A player forms a flat portal with the Portal Wand or matching rune blocks.
2. The portal owner opens its menu and selects a type, destination, travel mode,
   access policy, projection mode, and optional cost.
3. `ProjectionManager` creates an observer-specific view when a player enters
   the portal's interest area. Projection changes only that player's client.
4. Crossing the aperture starts a separate traversal path. Wormholes checks
   direction, access, cooldown, cost, destination readiness, and API vetoes
   before it moves or transfers the traveler.

Projection and traversal are intentionally separate. A portal can show a view
while travel is locked, allow travel with projection disabled, or render a
mirror without having a linked destination.

## Portal families

| Type | Primary use | Construction permission |
|---|---|---|
| `PORTAL` | Standard linked portal. Wand selections always start with this type | `wormholes.portals.portal` |
| `WORMHOLE` | Alternate linked frame type created from Wormhole Runes or selected in the menu | `wormholes.portals.wormhole` |
| `GATEWAY` | Cross-server portal backed by imported server and portal codes | `wormholes.gateway` |
| `RTP` | Random teleport portal with its own destination editor | `wormholes.portals.portal` |

Dimensional Doors are a separate survival system. They do not use frame portal
types, names, or destinations.

## Runtime details

| Item | Value |
|---|---|
| Java release and toolchain | 25 |
| Paper descriptor API version | `26.1` |
| Spigot compatibility API | `26.2-R0.1-SNAPSHOT` |
| Folia | Declared supported in `paper-plugin.yml` |
| Config | `plugins/Wormholes/wormholes.toml`, schema `3` |
| Paper load phase | `STARTUP` |
| Legacy plugin load phase | `POSTWORLD` |
| Optional declared plugins | PlaceholderAPI, Iris, Vault, Citizens |
| Reflective optional plugin | WorldGuard for RTP destination entry checks |

> Paper reads `paper-plugin.yml`, while a legacy plugin loader reads
> `plugin.yml`. The descriptors intentionally use different load phases and
> different command registration paths.
{.is-info}

## Find the right page

### Players and server owners

- [Installation and configuration](/wormholes/01-installation-configuration)
- [Core concepts](/wormholes/02-concepts)
- [Building portals](/wormholes/03-building-portals)
- [Portal menus and settings](/wormholes/04-portal-types-menus-settings)
- [Projection modes and performance](/wormholes/05-projection-modes-settings)
- [Random teleport portals](/wormholes/06-random-teleport-portals)
- [Dimensional Doors](/wormholes/07-dimensional-doors)
- [Pocket dimensions](/wormholes/08-pocket-dimensions)
{.grid-list}

### Operators

- [Commands and permissions](/wormholes/09-commands-permissions)
- [Cross-server networking](/wormholes/10-cross-server-networking)
- [Localization](/wormholes/11-localization)
- [PlaceholderAPI](/wormholes/12-placeholderapi)
- [Operator checks and recovery](/wormholes/14-operator-runbooks-smoke-tests)
- [Integrations](/wormholes/15-integrations)
{.grid-list}

### Plugin developers and maintainers

- [Runtime architecture](/wormholes/13-runtime-architecture)
- [Component and build reference](/wormholes/16-maintainer-component-build-reference)
- [API getting started](/wormholes/20-api-getting-started)
- [Traversal cost and events](/wormholes/21-api-traversal-cost-events)
- [PlaceholderAPI integration notes](/wormholes/22-api-placeholderapi)
- [Metrics integration contract](/wormholes/23-api-metrics-integration-contract)
{.grid-list}

## Build outputs

Run builds from the `Wormholes` repository root.

| Task | Output or check |
|---|---|
| `./gradlew build` | Runs the full verification gate and produces runtime and API artifacts |
| `./gradlew test` | Runs the JUnit suite with native access enabled for zstd |
| `./gradlew shadowJar` | Builds `Wormholes-<version>.jar`, the server plugin |
| `./gradlew apiJar` | Builds the compile-only public API jar |
| `./gradlew compileSpigotCompatibility` | Compiles the supported source set against Spigot 26.2 API |
| `./gradlew bandwidthHarness` | Runs transport, entity, and replication comparison scenarios |

Install the unclassified runtime jar on a server. The `-api.jar` is only for
third-party compilation.
