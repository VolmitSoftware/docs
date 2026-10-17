---
title: "Rift: Integrations and Developer Reference"
description: "Current shared services, generator support, and API boundaries"
published: true
date: 2026-10-16T00:00:00.000Z
tags: "rift, api, integrations"
editor: markdown
dateCreated: 2026-10-09T00:00:00.000Z
---

Rift uses shared VolmLib services for commands, localization, configuration, feedback, diagnostics, and update notices. It does not publish a separate Rift API artifact or register a public world-manager service.

## Current integrations

| Integration | Behavior |
|---|---|
| Bukkit generators | `PluginName[:generator-id]` selects an enabled generator for world operations |
| Volmit languages | Personal preferences, server defaults, and the shared message editor |
| Volmit debug | Rift participates in the shared diagnostic-provider menu |
| Volmit updates | GitHub release checks and combined update notices |
| Volmit HUD | Coordinated title and action-bar feedback |
| bStats | Standard anonymous metrics with local and global opt-outs |
| mclo.gs | Optional public upload of locally saved debug reports |
| PlaceholderAPI | Optional built-in `rift` expansion; no eCloud download required |

Rift does not take lifecycle ownership of another plugin's dimensions. Generator availability is separate from an ownership contract.

## PlaceholderAPI

Install PlaceholderAPI alongside Rift and restart the server. Rift registers its expansion when PlaceholderAPI is enabled and keeps it registered through `/papi reload`. Removing PlaceholderAPI does not prevent Rift from starting. The API is not bundled in Rift.

| Placeholder | Value |
|---|---|
| `%rift_version%` | Rift version |
| `%rift_worlds_known%` | Known world entries |
| `%rift_worlds_loaded%` | Loaded world entries |
| `%rift_worlds_managed%` | Managed profiles |
| `%rift_worlds_missing%` | Managed worlds neither loaded nor found in the last storage discovery |
| `%rift_operations_active%` | Active locked world operations |
| `%rift_world_name%` | Player's current logical world name |
| `%rift_world_loaded%` | Whether that world is loaded |
| `%rift_world_managed%` | Whether Rift has a profile for it |
| `%rift_world_protected%` | Profile protection flag, not the separate primary-world safeguard |
| `%rift_world_autoload%` | Profile's startup-load flag |
| `%rift_world_generator%` | Saved generator, or `vanilla` for a managed world without a custom generator |
| `%rift_world_environment%` | World environment |
| `%rift_world_busy%` | Whether that world has an active operation |

Append a logical world name to any `world_` field to query it explicitly, for example `%rift_world_loaded_lobby%` or `%rift_world_name_build_world%`. Matching is case-insensitive. Booleans return `true` or `false`. An unknown world or missing player context returns empty text; an unknown placeholder stays unresolved. An unmanaged world's generator can be empty because Rift has no saved generator setting.

World values refresh every 20 server ticks while PlaceholderAPI is available. Requests read cached snapshots, not world files; filesystem presence follows Rift's background discovery. Current-world placeholders need an online player context. No player counts or policy values are exposed in this first set. `/rift debug dump upload=false` includes expansion registration state.

## Developer boundaries

Treat Rift's internal classes and saved profile implementation as private. There are no supported `RiftWorldManager`, `RiftTeleportManager`, lifecycle-provider, economy, or Multiverse compatibility APIs in this release.

A public API needs exact world identity, defined ownership, asynchronous completion, failure handling, and lifecycle events before other plugins can depend on it. Those requirements and optional React, backup, and pregeneration integrations are tracked in the [roadmap](/rift/07-feature-audit-roadmap).

For builds and dependency packaging, see [Installation and compatibility](/rift/01-installation-compatibility).
