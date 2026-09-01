---
title: "Shaped Portals: Getting Started"
description: "Build a portal, look up commands, and check permissions"
published: true
date: 2026-09-01T00:00:00.000Z
tags: "shapedportals, portals, commands, permissions"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<nav aria-label="Shaped Portals guides" style="display:flex;gap:.45rem;flex-wrap:wrap;margin:0 0 1.5rem;padding:0 0 1rem;border-bottom:1px solid rgba(127,127,127,.25)"><a href="/shapedportals" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Home</a><a href="/shapedportals/00-overview" aria-current="page" style="display:block;padding:.48rem .76rem;border:1px solid #8b5cf6;border-radius:999px;background:#7e22ce;color:#fff;text-decoration:none;font-size:.88rem;font-weight:700">Build &amp; commands</a><a href="/shapedportals/01-installation-configuration" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Configuration</a><a href="/shapedportals/02-portal-behavior-events" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Portal behavior</a><a href="/shapedportals/03-compatibility-operations" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Server setup</a><a href="/shapedportals/04-architecture-limits" style="display:block;padding:.48rem .76rem;border:1px solid rgba(127,127,127,.3);border-radius:999px;background:rgba(127,127,127,.055);color:inherit;text-decoration:none;font-size:.88rem">Developer reference</a></nav>

Shaped Portals places native Nether and End portal blocks, so Minecraft still handles travel and destination creation.

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
4. Wait for the native Nether portal blocks to appear, then walk through.

### End portal

1. Build a closed horizontal boundary from End Portal Frames. Frame facing is not part of the shaped-portal check.
2. Leave a connected interior of 1 to 256 blocks by default.
3. Insert an Eye of Ender into every frame block. The accepted final eye activates the custom surface.
4. Step into the native End portal blocks.

A normal vanilla 3×3 End portal remains owned by the server and is not added to the managed registry. Custom End surfaces can be larger, smaller, concave, or irregular within the configured limits.

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
| `/sp language [locale]` | Choose a language, or open the picker when omitted | Player |
| `/sp portals [page]` | List managed portals; page defaults to 1 | Player or console |
| `/sp teleport` | Open the portal list; `/sp teleport list` does the same | Player or console |
| `/sp teleport <UUID/prefix>` | Move to a safe spot beside the chosen portal | Player |
| `/sp debug` | Save a diagnostic report and upload it when enabled | Player or console |

{.dense}

`/sp tp` is an alias for `/sp teleport`. Configuration files reload automatically by default.

### Find and visit a portal

Run `/sp portals`, then click a portal entry to visit it. You need the list permission to view entries and the teleport permission to travel.

You can also supply its full UUID or a unique prefix of at least eight characters:

```text
/sp teleport <portal UUID>
```

Use an ID from the list. Teleportation looks for clear standing space over a solid floor.

> **Unsafe teleport confirmation:** If no safe spot exists, players with the additional unsafe permission can repeat the same teleport within 10 seconds. This can place the player inside blocks or over a drop. It does not clear space, create a platform, bypass an unavailable world, reactivate a portal, or override another plugin's teleport cancellation.
{.is-warning}

### Change the language

```text
/sp language de_DE
```

This selects German. Omit the locale to open the language picker. See [Language files](/shapedportals/01-installation-configuration#language-files) for available locales and message editing.

### Create a diagnostic report

> **Public upload is on by default.** Before running `/sp debug`, set `debug.uploadEnabled = false` in the Diagnostics editor or configuration if the report should stay on the server. Reports include server, plugin, portal, configuration, and system details.
{.is-warning}

Reports are also saved under `plugins/ShapedPortals/debug/`.

## Permissions

**Everyone** means the default is `true`; **Operators** means `op`. Permission plugins can change these grants. There is no declared wildcard or parent permission that grants the other nodes.

| Permission | Default | Allows |
|---|---|---|
| `shapedportals.create` | Everyone | Ignite shaped Nether portals or complete shaped End portals when creation permission checks are enabled |
| `shapedportals.command` | Everyone | Use help and status |
| `shapedportals.config` | Operators | Use the configuration editor and language command |
| `shapedportals.debug` | Operators | Generate diagnostic reports, including uploads when enabled |
| `shapedportals.portals` | Operators | List portals, including through bare `/sp teleport` |
| `shapedportals.teleport` | Operators | Teleport to a selected portal |
| `shapedportals.teleport.unsafe` | Operators | Confirm an unsafe landing; also needs `shapedportals.teleport` |

{.dense}

Administrative subcommands check their own permission and do not also require `shapedportals.command`. World restrictions, shape rules, and protection-plugin decisions still apply when a player has creation permission.

## Creation lifecycle

Vanilla gets the first chance to create a normal portal. Nether creation then uses a cancellable `PortalCreateEvent`. End creation waits for an accepted final eye, leaves a native 3×3 portal alone, checks every proposed interior block through `BlockCanBuildEvent`, rechecks the frame, and fills and saves the custom surface.

Ordinary terrain fires are ignored before attempt statistics and feedback. See [Portal behavior](/shapedportals/02-portal-behavior-events) for protection plugins, repairs, and persistence.

## Related pages

- [Shaped Portals home *Feature summary and documentation index*](/shapedportals)
- [Installation and configuration *Requirements, editor, and settings*](/shapedportals/01-installation-configuration)
- [Troubleshooting *Portal creation, integrity, and travel checks*](/shapedportals/02-portal-behavior-events#troubleshooting)
- [Developer reference *Geometry, persistence, and build details*](/shapedportals/04-architecture-limits)
{.links-list}
