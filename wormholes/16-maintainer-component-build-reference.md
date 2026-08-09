---
title: "Maintainer Component & Build Reference"
description: "Wormholes documentation: Maintainer Component & Build Reference"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes is split into domain packages rather than one public class per feature. This reference maps every production package to the behavior it owns, identifies the runtime entry points, and records the verification and packaging tasks. Only `art.arcane.wormholes.api.traversal` excluding its `internal` package is a supported Java API.

## Runtime entry points

| Class or component | Responsibility |
|--------------------|----------------|
| `Wormholes` | Plugin entry point, load/enable/disable lifecycle, manager wiring, reset entry points |
| `WormholesBootstrap` | Paper bootstrap for the bundled pocket-dimension datapack |
| `WormholesReloadCoordinator` | Manual reload, TOML hotload application, complete data reset |
| `Settings` | Volatile runtime projection of the typed TOML settings and quality-profile overrides |
| `BlockManager` / `BlockOpsRuneConstruction` | Wand/rune item recognition, recipes, placed-rune index, rune construction dispatch |
| `ConstructionManager` / `WandSelectionManager` | Portal construction routing and box-selection workflow |
| `PortalManager` / `TraversableManager` | Portal registry, persistence loading, attendance, entry detection, traversal routing |
| `ProjectionManager` | Observer interest, projection scheduling, RTP view resolution, freeze/flush, projected events |
| `EffectManager` | Portal ambient effects and effect-entity ownership |

Enable and teardown order are documented in [Runtime Architecture](/wormholes/13-runtime-architecture).

## Package map

| Package | Behavior owners | User-facing reference |
|---------|-----------------|-----------------------|
| `art.arcane.wormholes` | Plugin lifecycle, listeners, construction, projection orchestration, config application | [Building Portals](/wormholes/03-building-portals), [Projection Modes & Settings](/wormholes/05-projection-modes-settings), [Runtime Architecture](/wormholes/13-runtime-architecture) |
| `api.traversal` | Supported provider, context, quote, reservation, receipt, outcome, and event types | [API - Getting Started](/wormholes/20-api-getting-started), [API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) |
| `api.traversal.internal` | Provider discovery, ordering, fault policy, tickets, settlement, and event dispatch; not public API | [API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) |
| `chunk` | Chunk leases, arrival warming, view-distance and send-rate helpers | [Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| `chunk.presend` | Optional traversal-time chunk pre-send planning, budgets, adapters, and platform delivery | [Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| `commands` | Director root, admin, network, and server command handlers and parameter completion | [Commands & Permissions](/wormholes/09-commands-permissions) |
| `config` / `config.toml` | Schema-2 TOML loading, canonical writes, and typed main/network/projection/render settings | [Installation & Configuration](/wormholes/01-installation-configuration) |
| `door` | Dimensional item identity, recipes, placement, visuals, access, OpenState, object/living transit, pockets, rescue, persistence, and protection | [Dimensional Doors](/wormholes/07-dimensional-doors), [Pocket Dimensions](/wormholes/08-pocket-dimensions) |
| `geometry` | Portal frames, structure planes, directions, transforms, and plane normalization | [Concepts](/wormholes/02-concepts), [Building Portals](/wormholes/03-building-portals) |
| `localization` | Typed message catalog, bundled/owner locale merging, validation, and audience rendering | [Localization](/wormholes/11-localization) |
| `network` | Identities, trust, routes, codes, peer lifecycle, protocol, compression, player admission/handoff, entity transfer, diagnostics | [Cross-Server Networking](/wormholes/10-cross-server-networking) |
| `network.replication` | Remote-view chunk tracking, hashes, bulk/delta replication, resync, and statistics | [Cross-Server Networking](/wormholes/10-cross-server-networking), [Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| `network.replication.capture` | Optional shadow capture and comparison instrumentation for replicated chunks | [Installation & Configuration](/wormholes/01-installation-configuration), [Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests) |
| `network.view` | Remote view subscriptions, block/entity capture, heartbeat, publishing, and peer session state | [Projection Modes & Settings](/wormholes/05-projection-modes-settings), [Cross-Server Networking](/wormholes/10-cross-server-networking) |
| `papi` | Snapshot publication, selection, formatting, resolvers, and PlaceholderAPI expansion lifecycle | [PlaceholderAPI](/wormholes/12-placeholderapi), [API - PlaceholderAPI](/wormholes/22-api-placeholderapi) |
| `platform` | Paper/Spigot/Folia capability and packet/scheduler boundary helpers | [Installation & Configuration](/wormholes/01-installation-configuration), [Runtime Architecture](/wormholes/13-runtime-architecture) |
| `portal` | Local portal model, JSON persistence, menus, settings, tunnels, linking, costs, permissions, surfaces, and traversal transforms | [Concepts](/wormholes/02-concepts), [Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings) |
| `portal.rtp` | RTP editor, settings, sampler, safety validation, searches, leases, allocation, projection authorization, WorldGuard/Iris checks, and rim display | [Random Teleport Portals](/wormholes/06-random-teleport-portals) |
| `portal.vanilla` | Managed Nether and End detection, pairing, frame integrity, and vanilla event replacement | [Building Portals](/wormholes/03-building-portals) |
| `render` | Portal block scans, claims, blackout mesh, entities, recursive portals, light, occlusion, caching, and packet delivery | [Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| `render.view` | Live, snapshot, and region-safe world-view implementations used by the projector | [Projection Modes & Settings](/wormholes/05-projection-modes-settings), [Runtime Architecture](/wormholes/13-runtime-architecture) |
| `service` | Commands, audiences, diagnostics, bStats, stats snapshot, telemetry, and VolmLib integration service | [Commands & Permissions](/wormholes/09-commands-permissions), [Integrations](/wormholes/15-integrations), [API - Metrics & Integration Contract](/wormholes/23-api-metrics-integration-contract) |
| `survival.doors.dimension` | Bootstrap/datapack integration for the `wormholes:pockets` dimension | [Pocket Dimensions](/wormholes/08-pocket-dimensions) |
| `util` / `util.common` / `util.project.config` | Atomic I/O, caches, reflection helpers, bounded executors, and TOML file hotload support | [Installation & Configuration](/wormholes/01-installation-configuration), [Runtime Architecture](/wormholes/13-runtime-architecture) |

## Internal boundaries

- Portal CRUD, menus, projection/render classes, RTP search, dimensional doors, and network/wire classes are implementation details; plugins must not compile against them.
- `PortalTypeAccess` controls construction and type management only. Traversal authorization remains in the dynamic portal and door policies.
- World and entity access is scheduled through VolmLib's Folia-aware bridge. Network, disk, and heavy sampling work may run asynchronously, but game-state application returns to the owning region or entity.
- Portal JSON, door state, routes, trust, identities, dictionaries, and the stats snapshot have different lifecycle and reset rules; see [Runtime Architecture](/wormholes/13-runtime-architecture) before changing persistence.

## Build and verification tasks

Run tasks from `WormholesPlugin/` with Java 25.

| Task | Result |
|------|--------|
| `./gradlew test` | JUnit suite with native access enabled for zstd |
| `./gradlew compileSpigotCompatibility` | Compiles supported source against Spigot API after excluding Paper-only bootstrap/listener/registrar classes |
| `./gradlew check` | Unit tests plus Spigot compatibility compilation |
| `./gradlew shadowJar` | Runtime plugin jar with configured relocations and SlimJar metadata |
| `./gradlew apiJar` | Compile-only public traversal API jar; excludes `api.traversal.internal` |
| `./gradlew build` | Full check plus runtime and API artifacts |
| `./gradlew bandwidthHarness` | Entity, transport, and replication comparison harness; scenario settings are supplied as JVM system properties |
| `./gradlew buildPsychoLT` | Full check plus managed test-server drop-in deployment; use only for the workspace Multiplexor test environment |

`build/libs/Wormholes-<version>.jar` is the server artifact; `build/libs/Wormholes-<version>-api.jar` is compile-only. A green build proves compilation and automated behavior, not client-visible projection, door interaction, cross-server transfer, or Folia ownership under a live workload; use the matching checks in [Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests).
