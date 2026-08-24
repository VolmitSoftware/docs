---
title: "Maintainer Component & Build Reference"
description: "Wormholes documentation: Maintainer Component & Build Reference"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes is split into domain packages rather than one public class per
feature. This page maps each production package to the behavior it owns. It also
lists runtime entry points and build tasks. Only
`art.arcane.wormholes.api.traversal` excluding its `internal` package is a
supported Java API.

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

Enable and teardown order are documented in
[13 - Runtime Architecture](/wormholes/13-runtime-architecture).

## Package map

| Package | Behavior owners | User-facing reference |
|---------|-----------------|-----------------------|
| `art.arcane.wormholes` | Plugin lifecycle, listeners, construction, projection orchestration, config application | [03 - Building Portals](/wormholes/03-building-portals), [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings), [13 - Runtime Architecture](/wormholes/13-runtime-architecture) |
| `api.traversal` | Supported provider, context, quote, reservation, receipt, outcome, and event types | [20 - API - Getting Started](/wormholes/20-api-getting-started), [21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) |
| `api.traversal.internal` | Provider discovery, ordering, fault policy, tickets, settlement, and event dispatch. Not public API | [21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) |
| `chunk` | Chunk leases, arrival warming, view-distance and send-rate helpers | [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| `chunk.presend` | Optional traversal-time chunk pre-send planning, budgets, adapters, and platform delivery | [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| `commands` | Director root, admin, network, and server command handlers and parameter completion | [09 - Commands & Permissions](/wormholes/09-commands-permissions) |
| `config` / `config.toml` | Schema-2 TOML loading, canonical writes, and typed main/network/projection/render settings | [01 - Installation & Configuration](/wormholes/01-installation-configuration) |
| `door` | Dimensional item identity, recipes, placement, visuals, access, OpenState, object/living transit, pockets, rescue, persistence, and protection | [07 - Dimensional Doors](/wormholes/07-dimensional-doors), [08 - Pocket Dimensions](/wormholes/08-pocket-dimensions) |
| `geometry` | Portal look/traversal raycast (`Raycast`) | [02 - Concepts](/wormholes/02-concepts), [03 - Building Portals](/wormholes/03-building-portals) |
| `localization` | Typed message catalog, bundled/owner locale merging, validation, and audience rendering | [11 - Localization](/wormholes/11-localization) |
| `network` | Identities, trust, routes, codes, peer lifecycle, protocol, compression, player admission/handoff, entity transfer, diagnostics | [10 - Cross-Server Networking](/wormholes/10-cross-server-networking) |
| `network.replication` | Remote-view chunk tracking, hashes, bulk/delta replication, resync, and statistics | [10 - Cross-Server Networking](/wormholes/10-cross-server-networking), [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| `network.replication.capture` | Optional shadow capture and comparison instrumentation for replicated chunks | [01 - Installation & Configuration](/wormholes/01-installation-configuration), [14 - Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests) |
| `network.view` | Remote view subscriptions, block/entity capture, heartbeat, publishing, and peer session state | [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings), [10 - Cross-Server Networking](/wormholes/10-cross-server-networking) |
| `papi` | Snapshot publication, selection, formatting, resolvers, and PlaceholderAPI expansion lifecycle | [12 - PlaceholderAPI](/wormholes/12-placeholderapi), [22 - API - PlaceholderAPI](/wormholes/22-api-placeholderapi) |
| `platform` | Paper/Spigot/Folia capability and packet/scheduler boundary helpers | [01 - Installation & Configuration](/wormholes/01-installation-configuration), [13 - Runtime Architecture](/wormholes/13-runtime-architecture) |
| `portal` | Local portal model, JSON persistence, menus, settings, tunnels, linking, costs, permissions, surfaces, and traversal transforms | [02 - Concepts](/wormholes/02-concepts), [04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings) |
| `portal.rtp` | RTP editor, settings, sampler, safety validation, searches, leases, allocation, projection authorization, WorldGuard/Iris checks, and rim display | [06 - Random Teleport Portals](/wormholes/06-random-teleport-portals) |
| `portal.vanilla` | Managed Nether and End detection, pairing, frame integrity, and vanilla event replacement | [03 - Building Portals](/wormholes/03-building-portals) |
| `render` | Portal block scans, claims, blackout mesh, entities, recursive portals, light, occlusion, caching, and packet delivery | [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| `render.view` | Live, snapshot, and region-safe world-view implementations used by the projector | [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings), [13 - Runtime Architecture](/wormholes/13-runtime-architecture) |
| `service` | Commands, audiences, diagnostics, bStats, stats snapshot, telemetry, and VolmLib integration service | [09 - Commands & Permissions](/wormholes/09-commands-permissions), [15 - Integrations](/wormholes/15-integrations), [23 - API - Metrics & Integration Contract](/wormholes/23-api-metrics-integration-contract) |
| `survival.doors.dimension` | Bootstrap/datapack integration for the `wormholes:pockets` dimension | [08 - Pocket Dimensions](/wormholes/08-pocket-dimensions) |
| `util` / `util.common` / `util.project.config` | Atomic I/O, caches, reflection helpers, bounded executors, and TOML file hotload support | [01 - Installation & Configuration](/wormholes/01-installation-configuration), [13 - Runtime Architecture](/wormholes/13-runtime-architecture) |

## Internal boundaries

- Portal CRUD, menus, projection and render classes, RTP search, dimensional
  doors, and network/wire classes are implementation details. Plugins must not
  compile against them.
- `PortalTypeAccess` controls construction and type management only. Traversal
  authorization remains in the dynamic portal and door policies.
- Paper chat prompts read the signed message through an ABI-neutral reflective
  boundary. The runtime jar verification rejects relocated Adventure types in
  Bukkit or Paper method descriptors. Those platform methods retain the
  server-owned `net.kyori` types.
- The runtime schedules world and entity access through the VolmLib Folia-aware
  bridge. Network, disk, and heavy sampling work may run asynchronously. The
  runtime applies game state on the owning region or entity.
- Portal JSON, door state, routes, trust, identities, dictionaries, and the
  stats snapshot have different lifecycle and reset rules. See
  [13 - Runtime Architecture](/wormholes/13-runtime-architecture) before you
  change persistence.

## Build and verification tasks

Run tasks from `WormholesPlugin/` with Java 25.

| Task | Result |
|------|--------|
| `./gradlew test` | JUnit suite with native access enabled for zstd. Builds and verifies runtime-jar platform method descriptors |
| `./gradlew compileSpigotCompatibility` | Compiles supported source against Spigot API after excluding Paper-only bootstrap/listener/registrar classes |
| `./gradlew check` | Unit tests plus Spigot compatibility compilation |
| `./gradlew shadowJar` | Runtime plugin jar with relocated SlimJar loader classes and dependency metadata; resolved libraries are not embedded |
| `./gradlew apiJar` | Compile-only public traversal API jar. Excludes `api.traversal.internal` |
| `./gradlew build` | Full check plus runtime and API artifacts |
| `./gradlew bandwidthHarness` | Entity, transport, and replication comparison harness. Scenario settings are supplied as JVM system properties |
| `./gradlew buildPsychoLT` | Full check plus managed test-server drop-in deployment. Use this only for the workspace Multiplexor test environment |

`build/libs/Wormholes-<version>.jar` is the server artifact. Its first runtime
start needs repository access unless the SlimJar cache is already populated.
`build/libs/Wormholes-<version>-api.jar` is compile-only. A green build proves
compilation and automated behavior. It does not prove client-visible projection,
door interaction, cross-server transfer, or Folia ownership under a live
workload. Use the matching checks in
[14 - Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests).
