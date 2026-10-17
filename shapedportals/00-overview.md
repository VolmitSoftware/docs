---
title: "Shaped Portals: Getting started"
description: "Build a portal, look up commands, and check permissions"
published: true
date: 2026-10-14T00:00:00.000Z
tags: "shapedportals, portals, commands, permissions"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/shapedportals">Shaped Portals</a><span aria-hidden="true">/</span><span aria-current="page">Getting started</span></nav>

Shaped Portals places native portal blocks for Minecraft to handle travel. When Wormholes accepts a Nether shape, Shaped Portals supplies its interior positions and Wormholes handles the projection, destination, and travel.

- [Build a portal](#build-your-first-portal)
- [Shape rules](#valid-shapes)
- [Commands](#commands)
- [Permissions](#permissions)
{.grid-list}

## Build your first portal

Install Shaped Portals first, then choose the portal type.

### Nether portal

1. Build a closed, upright frame using a configured frame material. Obsidian and crying obsidian are allowed by default.
2. Leave a connected interior of 2 to 256 blocks by default.
3. Light an interior block with an allowed ignition source. Flint and steel, fireballs, and directly placed fire are enabled by default.
4. Wait for the portal surface or Wormholes projection to appear, then walk through.

### End portal

1. Build a closed horizontal boundary from End Portal Frames. Frame facing is not part of the shaped-portal check.
2. Leave a connected interior of 1 to 256 blocks by default.
3. Insert an Eye of Ender into every frame block. The accepted final eye activates the custom surface.
4. Step into the native End portal blocks.

For example, surround a 4×4 empty interior with End Portal Frames on all four sides, then insert every eye. The four diagonal corner blocks do not matter. Vanilla 3×3 End portals remain server-owned; managed surfaces may be smaller, larger, concave, or irregular within the configured limits.

## Valid shapes

| Rule | What to build |
|---|---|
| Flat plane | Nether portals use a vertical X or Z plane; End portals use a horizontal X/Z plane |
| Closed boundary | Configured frame blocks for Nether portals; fully eyed End Portal Frames for End portals |
| Connected interior | Interior blocks touch by an edge; diagonal contact alone is not enough |
| Replaceable inside | Nether and End portals use separate configured interior-material lists |
| Within limits | Nether defaults to 64×64 and 2–256 cells; End defaults to 64×64 and 1–256 cells |
| One Folia region | The full shape must be owned by one active region during creation |

Stepped edges and concave corners are allowed as long as the interior stays connected. A Nether shape that is valid in both vertical axes is rejected as ambiguous.

Server owners can change these limits in [Portal settings](/shapedportals/01-installation-configuration#portal-rules). The hard ceilings are 4,096 interior blocks and 512 blocks per dimension.

## Commands

Use `/shapedportals`, `/shapedportal`, or `/sp`.

| Command | What it does | Run from |
|---|---|---|
| `/sp` | Open command help | Player or console |
| `/sp status` | Show portal counts and creation statistics | Player or console |
| `/sp config` | Open the in-game configuration and language editor | Player |
| `/sp language` | Open the language controls | Player or console |
| `/sp language self <locale\|reset>` | Select or reset your personal ShapedPortals language | Player |
| `/sp language server <locale>` | Change the ShapedPortals server default | Player or console |
| `/sp language server edit [locale]` | Open the per-language message editor | Player |
| `/volmit plugins` | Open shared Volmit language, diagnostic, and update tools | Player or console |
| `/volmit plugins updates` | Check permitted registered Volmit plugins and show one update report | Player or console |
| `/volmit plugins languages [lang]` | Open the shared picker or change every enabled provider's server default | Player or console |
| `/volmit plugins debug [plugin] [upload=true\|false]` | List shared debug providers or request one report | Player or console |
| `/volmit plugins debug all [upload=true\|false]` | Start reports for every permitted registered provider | Player or console |
| `/sp portals [page]` | List managed portals; page defaults to 1 | Player or console |
| `/sp teleport` | Open the portal list; `/sp teleport list` does the same | Player or console |
| `/sp teleport <UUID/prefix>` | Move to a safe spot beside the chosen portal | Player |
| `/sp debug` | Open the diagnostic command help menu | Player or console |
| `/sp debug version` | Show the installed ShapedPortals version | Player or console |
| `/sp debug dump [upload=true]` | Save a diagnostic report and upload it when enabled | Player or console |

{.dense}

`/sp tp` is an alias for `/sp teleport`, and `/sp version` for `/sp debug version`. Configuration files reload automatically by default.

### Find and visit a portal

Run `/sp portals` and click an entry, or supply its full UUID or a unique prefix of at least eight characters. Listing and teleportation require their separate permissions:

```none
/sp teleport <portal UUID>
```

Use an ID from the list. Teleportation looks for clear standing space over a solid floor.

> **Unsafe teleport confirmation:** If no safe spot exists, players with the additional unsafe permission can repeat the same teleport within 10 seconds. This can place the player inside blocks or over a drop. It does not clear space, create a platform, bypass an unavailable world, reactivate a portal, or override another plugin's teleport cancellation.
{.is-warning}

### Create a diagnostic report

`/sp debug dump` saves a report under `plugins/ShapedPortals/debug/` and uploads it to mclo.gs by default. Use `upload=false` for a local-only report, or set `debug.uploadEnabled = false` to block all uploads. A failed upload leaves the local file in place. See [Diagnostic reports](/shapedportals/03-compatibility-operations#diagnostic-reports).

## Permissions

**Everyone** means the default is `true`; **Operators** means `op`. Permission plugins can change these grants. There is no declared wildcard or parent permission that grants the other nodes.

| Permission | Default | Allows |
|---|---|---|
| `shapedportals.create` | Everyone | Ignite shaped Nether portals or complete shaped End portals when creation permission checks are enabled |
| `shapedportals.command` | Everyone | Use help and status |
| `shapedportals.config` | Operators | Use the configuration and language-message editors and change the server language |
| `shapedportals.language.self` | Everyone | Choose or reset your ShapedPortals language; also requires `volmit.language.self` |
| `volmit.language.self` | Everyone | Shared requirement for personal language selection |
| `volmit.language.admin` | Operators | Change language defaults across enabled plugins |
| `shapedportals.debug` | Operators | Generate diagnostic reports, including uploads when enabled |
| `shapedportals.update` | Operators | Include ShapedPortals in combined join notices and shared update reports |
| `volmit.update` | Operators | Access update notices and reports for all registered Volmit plugins |
| `shapedportals.portals` | Operators | List portals, including through bare `/sp teleport` |
| `shapedportals.teleport` | Operators | Teleport to a selected portal |
| `shapedportals.teleport.unsafe` | Operators | Confirm an unsafe landing; also needs `shapedportals.teleport` |

{.dense}

Operators get update notices even when a permission plugin denies `shapedportals.update`. Grant that node to let non-operators receive them, or set `general.updateNotifications = false` to turn the checks off for everyone. See [Update notifications](/shapedportals/03-compatibility-operations#update-notifications).

Administrative subcommands check their own permission and do not also need `shapedportals.command`. World restrictions, shape rules, and protection plugins still apply to a player who has creation permission.

For the language picker and message editing, see [Languages](/languages).

## Creation lifecycle

Minecraft gets the first chance to make a normal portal. Shaped Nether creation offers the shape to Wormholes first. If Wormholes is unavailable, Shaped Portals fires a cancellable `PortalCreateEvent` before placing native blocks; a rejected handoff stops creation. Shaped End creation starts once the final eye is accepted. See [Portal behavior](/shapedportals/02-portal-behavior-events).

## Related pages

- [Shaped Portals home *Feature summary and documentation index*](/shapedportals)
- [Installation and configuration *Requirements, editor, and settings*](/shapedportals/01-installation-configuration)
- [Troubleshooting *Portal creation, integrity, and travel checks*](/shapedportals/02-portal-behavior-events#troubleshooting)
- [Developer reference *Geometry, persistence, and build details*](/shapedportals/04-architecture-limits)
- [Languages *Choosing a language and editing messages*](/languages)
{.links-list}
