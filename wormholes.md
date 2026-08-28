---
title: "Wormholes"
description: "Live destination views, portal travel, random teleport, and dimensional doors"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

![Wormholes](/home-assets/wormholes.png =112x){.align-center .radius-16}

## See the destination before you cross. {.text-center}

Wormholes creates portals with live destination views, local and cross-server
travel, random teleport routes, and survival Dimensional Doors.
{.text-center}

[Install Wormholes](/wormholes/01-installation-configuration) ·
[Build a portal](/wormholes/03-building-portals) ·
[Commands and permissions](/wormholes/09-commands-permissions)
{.text-center}

## Start here

- [Overview *Learn what each portal system does and where to continue.*](/wormholes/00-overview)
- [Installation and configuration *Install the runtime jar, create schema 3 config, and choose a quality profile.*](/wormholes/01-installation-configuration)
- [Concepts *Understand portal types, tunnels, projection, travel direction, and access.*](/wormholes/02-concepts)
- [Build your first portal *Use the Portal Wand or a connected set of runes.*](/wormholes/03-building-portals)
{.grid-list}

## Choose what you are building

- [Linked frame portals *Show a live view and walk between two local destinations.*](/wormholes/04-portal-types-menus-settings)
- [Random teleport portal *Search for a safe destination by world, radius, height, and biome.*](/wormholes/06-random-teleport-portals)
- [Dimensional Door *Craft paired, personal, or public doors and trapdoors.*](/wormholes/07-dimensional-doors)
- [Cross-server gateway *Exchange signed codes, link peers, stream a remote view, and transfer players.*](/wormholes/10-cross-server-networking)
{.grid-list}

## At a glance

| Item | Current source behavior |
|---|---|
| Version audited | `2.0.1-26.2`, source reviewed 2026-08-28 |
| Runtime | Java 25; Paper and Folia metadata; Spigot 26.2 compatibility build |
| Config | `plugins/Wormholes/wormholes.toml`, schema `3` |
| Root command | `/wormholes`, aliases `/wh` and `/wormhole` |
| Portal rendering | `VENTICULAR` by default, with `PANOPTIC` available per portal |
| Optional plugins | PlaceholderAPI, Iris, Vault, Citizens; WorldGuard is detected for RTP admission |

> All 15 permissions declared in the plugin descriptors default to `op`.
> Grant the required portal and door nodes explicitly before expecting
> non-operators to build, craft, or place them.
{.is-info}

## Player and operator reference

- [Portal menus and settings](/wormholes/04-portal-types-menus-settings)
- [Projection modes and performance](/wormholes/05-projection-modes-settings)
- [Pocket dimensions](/wormholes/08-pocket-dimensions)
- [Commands and permissions](/wormholes/09-commands-permissions)
- [Localization](/wormholes/11-localization)
- [PlaceholderAPI](/wormholes/12-placeholderapi)
- [Integrations](/wormholes/15-integrations)
- [Operator checks and recovery](/wormholes/14-operator-runbooks-smoke-tests)
{.grid-list}

## Developer and maintainer reference

- [Runtime architecture](/wormholes/13-runtime-architecture)
- [Component and build reference](/wormholes/16-maintainer-component-build-reference)
- [API getting started](/wormholes/20-api-getting-started)
- [Traversal cost and events API](/wormholes/21-api-traversal-cost-events)
- [PlaceholderAPI integration notes](/wormholes/22-api-placeholderapi)
- [Metrics integration contract](/wormholes/23-api-metrics-integration-contract)
{.grid-list}

## Support and source

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [GitHub *Wormholes source repository*](https://github.com/VolmitSoftware/Wormholes)
{.links-list}
