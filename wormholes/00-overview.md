---
title: Overview
description: Wormholes documentation: Overview
published: true
date: 2026-08-09T00:00:00.000Z
tags: wormholes
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes is a through-portal projection and traversal plugin for Paper and Folia. Frame portals show a live destination view and move travelers; related systems cover random teleport, survival Dimensional Doors with pocket dimensions, cross-server gateways, PlaceholderAPI keys, and a public traversal pricing API.

## Feature map

| Area | Summary | Doc |
|------|---------|-----|
| Frame portals | Wand/rune construction, types, menus, skins | [Building Portals](/wormholes/03-building-portals), [Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings) |
| Projection | ON/OFF, PanOptic vs Venticular, budgets | [Projection Modes & Settings](/wormholes/05-projection-modes-settings) |
| Concepts | Types, tunnels, travel, local vs remote | [Concepts](/wormholes/02-concepts) |
| Random teleport | RTP portal type and editor | [Random Teleport Portals](/wormholes/06-random-teleport-portals) |
| Dimensional doors | Pair / Personal / Public doors and trapdoors | [Dimensional Doors](/wormholes/07-dimensional-doors) |
| Pocket dimensions | Shared void pocket world and return doors | [Pocket Dimensions](/wormholes/08-pocket-dimensions) |
| Commands & permissions | `/wormholes` tree and nodes | [Commands & Permissions](/wormholes/09-commands-permissions) |
| Cross-server | Gateway codes, trust, handoff | [Cross-Server Networking](/wormholes/10-cross-server-networking) |
| Localization | Bundled locales and overrides | [Localization](/wormholes/11-localization) |
| PlaceholderAPI | Operator `%wormholes_…%` keys | [PlaceholderAPI](/wormholes/12-placeholderapi) |
| Runtime architecture | Managers, Folia, storage | [Runtime Architecture](/wormholes/13-runtime-architecture) |
| Operator runbooks | Manual smoke checks | [Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests) |
| Integrations | Vault, Iris, soft depends | [Integrations](/wormholes/15-integrations) |
| Maintainer reference | Production packages, boundaries, build tasks | [Maintainer Component & Build Reference](/wormholes/16-maintainer-component-build-reference) |
| Public API | apiJar, traversal cost, metrics | `20`–`23` API docs |

Install and `config/wormholes.toml` are covered in [Installation & Configuration](/wormholes/01-installation-configuration).

## Documentation index

| File | Covers |
|------|--------|
| [Overview](/wormholes/00-overview) | What Wormholes is, feature map, runtime, build |
| [Installation & Configuration](/wormholes/01-installation-configuration) | Install, data folder, `config/wormholes.toml`, quality profiles |
| [Concepts](/wormholes/02-concepts) | Portals, projection, tunnels, RTP, doors, pockets, cross-server |
| [Building Portals](/wormholes/03-building-portals) | Wand, runes, construction, skins, vanilla portal replace |
| [Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings) | Types, menus, travel, access, costs, cosmetics |
| [Projection Modes & Settings](/wormholes/05-projection-modes-settings) | Projection ON/OFF, PanOptic vs Venticular, budgets, render |
| [Random Teleport Portals](/wormholes/06-random-teleport-portals) | RTP type, editor options, safety, rotation |
| [Dimensional Doors](/wormholes/07-dimensional-doors) | Pair/Personal/Public, OpenState, access, recipes, transit |
| [Pocket Dimensions](/wormholes/08-pocket-dimensions) | Pocket world, layout, return door, rescue |
| [Commands & Permissions](/wormholes/09-commands-permissions) | Every `/wormholes` command and permission node |
| [Cross-Server Networking](/wormholes/10-cross-server-networking) | Codes, trust, handoff, transfer modes, doctor |
| [Localization](/wormholes/11-localization) | Locales, overrides, fallbacks |
| [PlaceholderAPI](/wormholes/12-placeholderapi) | `%wormholes_…%` keys for operators |
| [Runtime Architecture](/wormholes/13-runtime-architecture) | Boot, managers, Folia, storage layout |
| [Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests) | Manual verification checklists |
| [Integrations](/wormholes/15-integrations) | Vault, Iris, React metrics, soft depends |
| [Maintainer Component & Build Reference](/wormholes/16-maintainer-component-build-reference) | Production package map, internal boundaries, build tasks |
| [API - Getting Started](/wormholes/20-api-getting-started) | apiJar, service registration, public surface map |
| [API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events) | TraversalCostProvider and traversal events |
| [API - PlaceholderAPI](/wormholes/22-api-placeholderapi) | Integrator notes for placeholders |
| [API - Metrics & Integration Contract](/wormholes/23-api-metrics-integration-contract) | IntegrationServiceContract metrics |

Docs `00`–`15` are for operators and players, doc `16` is for maintainers, and docs `20`–`23` are for plugin developers. Numbers `17`–`19` are reserved.

## Runtime requirements

| Item | Value |
|------|--------|
| Java | 25 (compiled with `-parameters`, release 25) |
| Folia | Supported (`folia-supported: true` in paper-plugin metadata) |
| Soft depends | PlaceholderAPI, Iris, Vault (optional; load before Wormholes when present) |
| Runtime library | `zstd-jni` is supplied by the legacy plugin library declaration (`com.github.luben:zstd-jni:1.5.7-11`), not shaded into the jar |

JVM tip: include `--enable-native-access=ALL-UNNAMED` on the server (and test) JVM so zstd-jni can load its native library without restricted-access warnings.

## Build

From `WormholesPlugin/`:

| Task | Purpose |
|------|---------|
| `./gradlew build` | Full gate; also builds shadow jar and api jar |
| `./gradlew test` | Unit tests (uses `--enable-native-access=ALL-UNNAMED`) |
| `./gradlew shadowJar` | Shaded runtime plugin jar |
| `./gradlew apiJar` | Compile-only public API (`art.arcane.wormholes.api/**`, excluding `internal`) |
| `./gradlew compileSpigotCompatibility` | Compile supported source against Spigot API |
| `./gradlew bandwidthHarness` | Run the transport/entity/replication comparison harness |

Prefer the shaded jar for servers. Prefer `*-api.jar` for third-party compile-only consumers.

## Commands

Base command aliases (see [Commands & Permissions](/wormholes/09-commands-permissions) for the full tree):

| Alias | Notes |
|-------|--------|
| `/wormholes` | Primary |
| `/wh` | Short alias |
| `/wormhole` | Singular alias |
