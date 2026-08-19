---
title: "Overview"
description: "What Wormholes is, feature map, runtime, and build"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes is a through-portal projection and traversal plugin for Paper and
Folia. Frame portals show a live destination view and move travelers. Related
systems cover random teleport, Dimensional Doors with pocket dimensions,
cross-server gateways, PlaceholderAPI keys, and a public traversal pricing API.

## Feature map

| Area | Summary | Doc |
|------|---------|-----|
| Frame portals | Wand/rune construction, types, menus, skins | [03 - Building Portals](/wormholes/03-building-portals), [04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings) |
| Projection | ON/OFF, PanOptic vs Venticular, budgets | [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| Concepts | Types, tunnels, travel, local vs remote | [02 - Concepts](/wormholes/02-concepts) |
| Random teleport | RTP portal type and editor | [06 - Random Teleport Portals](/wormholes/06-random-teleport-portals) |
| Dimensional doors | Pair / Personal / Public doors and trapdoors | [07 - Dimensional Doors](/wormholes/07-dimensional-doors) |
| Pocket dimensions | Shared void pocket world and return doors | [08 - Pocket Dimensions](/wormholes/08-pocket-dimensions) |
| Commands & permissions | `/wormholes` tree and nodes | [09 - Commands & Permissions](/wormholes/09-commands-permissions) |
| Cross-server | Gateway codes, trust, handoff | [10 - Cross-Server Networking](/wormholes/10-cross-server-networking) |
| Localization | Bundled locales and overrides | [11 - Localization](/wormholes/11-localization) |
| PlaceholderAPI | Operator `%wormholes_…%` keys | [12 - PlaceholderAPI](/wormholes/12-placeholderapi) |
| Runtime architecture | Managers, Folia, storage | [13 - Runtime Architecture](/wormholes/13-runtime-architecture) |
| Operator runbooks | Manual smoke checks | [14 - Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests) |
| Integrations | Vault, Iris, soft depends | [15 - Integrations](/wormholes/15-integrations) |
| Maintainer reference | Production packages, boundaries, build tasks | [16 - Maintainer Component & Build Reference](/wormholes/16-maintainer-component-build-reference) |
| Public API | apiJar, traversal cost, metrics | `20`–`23` API docs |

Install and `config/wormholes.toml` are in
[01 - Installation & Configuration](/wormholes/01-installation-configuration).

## Documentation index

| File | Covers |
|------|--------|
| [00 - Overview](/wormholes/00-overview) | What Wormholes is, feature map, runtime, build |
| [01 - Installation & Configuration](/wormholes/01-installation-configuration) | Install, data folder, `config/wormholes.toml`, quality profiles |
| [02 - Concepts](/wormholes/02-concepts) | Portals, projection, tunnels, RTP, doors, pockets, cross-server |
| [03 - Building Portals](/wormholes/03-building-portals) | Wand, runes, construction, skins, vanilla portal replace |
| [04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings) | Types, menus, travel, access, costs, cosmetics |
| [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings) | Projection ON/OFF, PanOptic vs Venticular, budgets, render |
| [06 - Random Teleport Portals](/wormholes/06-random-teleport-portals) | RTP type, editor options, safety, rotation |
| [07 - Dimensional Doors](/wormholes/07-dimensional-doors) | Pair/Personal/Public, OpenState, access, recipes, transit |
| [08 - Pocket Dimensions](/wormholes/08-pocket-dimensions) | Pocket world, layout, return door, rescue |
| [09 - Commands & Permissions](/wormholes/09-commands-permissions) | Every `/wormholes` command and permission node |
| [10 - Cross-Server Networking](/wormholes/10-cross-server-networking) | Codes, trust, handoff, transfer modes, doctor |
| [11 - Localization](/wormholes/11-localization) | Locales, overrides, fallbacks |
| [12 - PlaceholderAPI](/wormholes/12-placeholderapi) | `%wormholes_…%` keys for operators |
| [13 - Runtime Architecture](/wormholes/13-runtime-architecture) | Boot, managers, Folia, storage layout |
| [14 - Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests) | Manual verification checklists |
| [15 - Integrations](/wormholes/15-integrations) | Vault, Iris, React metrics, soft depends |
| [16 - Maintainer Component & Build Reference](/wormholes/16-maintainer-component-build-reference) | Production package map, internal boundaries, build tasks |
| [20 - API - Getting Started](/wormholes/20-api-getting-started) | apiJar, service registration, public surface map |
| [21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) | TraversalCostProvider and traversal events |
| [22 - API - PlaceholderAPI](/wormholes/22-api-placeholderapi) | Integrator notes for placeholders |
| [23 - API - Metrics & Integration Contract](/wormholes/23-api-metrics-integration-contract) | IntegrationServiceContract metrics |

Docs `00`–`15` are for operators and players. Doc `16` is for maintainers.
Docs `20`–`23` are for plugin developers. Numbers `17`–`19` are reserved.

## Runtime requirements

| Item | Value |
|------|--------|
| Java | 25 (compiled with `-parameters`, release 25) |
| Servers | Paper, Purpur, and Folia **26.1.2–26.2** (`folia-supported: true` in paper-plugin metadata) |
| Spigot | 26.2 compile (`compileSpigotCompatibility`) and runtime fallbacks. Paper and Folia keep native paths |
| Soft depends | PlaceholderAPI, Iris, Vault (optional). Load them before Wormholes when they are present |
| Runtime library | `zstd-jni` 1.5.7-11 via SlimJar plus `plugin.yml` `libraries`. Not shaded into the jar |

Include `--enable-native-access=ALL-UNNAMED` on the server JVM and the test JVM.
Then zstd-jni can load its native library without restricted-access warnings.

## Build

From `WormholesPlugin/`:

| Task | Purpose |
|------|---------|
| `./gradlew build` | Full gate. Also builds shadow jar and api jar |
| `./gradlew test` | Unit tests (uses `--enable-native-access=ALL-UNNAMED`) |
| `./gradlew shadowJar` | Shaded runtime plugin jar |
| `./gradlew apiJar` | Compile-only public API (`art.arcane.wormholes.api/**`, excluding `internal`) |
| `./gradlew compileSpigotCompatibility` | Compile supported source against Spigot API |
| `./gradlew bandwidthHarness` | Run the transport/entity/replication comparison harness |

Use the shaded jar on servers. Use `*-api.jar` for third-party compile-only
consumers.

## Commands

Base command aliases. The full tree is in
[09 - Commands & Permissions](/wormholes/09-commands-permissions):

| Alias | Notes |
|-------|--------|
| `/wormholes` | Primary |
| `/wh` | Short alias |
| `/wormhole` | Singular alias |
