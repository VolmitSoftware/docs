---
title: Volmit Software
description: Documentation for Iris, Adapt, React, HoloUI, Wormholes, HiddenOre and BileTools
published: true
date: 2026-08-09T00:00:00.000Z
tags: index
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

# Volmit Software

Seven Paper plugins, documented here. Command trees, permission nodes and config references are
extracted from the sources at [github.com/VolmitSoftware](https://github.com/VolmitSoftware)
rather than written by hand, so they match what the jar actually does.

- [**Iris** *World generation engine. Dimensions, biomes and structures as data packs, with a live studio and three pregenerators.*](/iris)
- [**Adapt** *Passive skills on a bookshelf GUI. 21 skill lines, each with its own unlockable adaptations.*](/adapt)
- [**React** *Performance tooling. 30+ live samplers, opt-in optimisations, and a "which chunk is killing me" command.*](/react)
- [**Wormholes** *Portals that show you the other side before you step through. Plus RTP, dimensional doors and cross-server gateways.*](/wormholes)
- [**HoloUI** *Holographic menus and container previews, packet-only and per-viewer. JSON-driven, with a web editor.*](/holoui)
- [**HiddenOre** *Mining economy and anti-xray. Ore comes out of plain stone, so there is nothing for xray to find.*](/hiddenore)
- [**BileTools** *Dev utility. Rebuild a jar and it is already reloaded in game.*](/biletools)
{.links-list}

## Which one do I want

| If you want to… | Use |
|---|---|
| Replace vanilla terrain with something custom | [Iris](/iris) |
| Give players progression without RPG power creep | [Adapt](/adapt) |
| Find out why TPS is bad | [React](/react) |
| Link two servers, or build portal networks | [Wormholes](/wormholes) |
| Build menus that float in the world instead of an inventory GUI | [HoloUI](/holoui) |
| Kill xray as a problem instead of fighting it | [HiddenOre](/hiddenore) |
| Stop restarting your test server every build | [BileTools](/biletools) |

## Compatibility

| Plugin | Java | Folia | Notes |
|---|---|---|---|
| [Iris](/iris) | 21+ | No | `load: STARTUP`, downloads libraries on first boot |
| [Adapt](/adapt) | 17+ | No | Optional WorldGuard, Factions, Residence, ChestProtect |
| [React](/react) | 17+ | No | Downloads libraries on first boot |
| [Wormholes](/wormholes) | 21+ | Yes | Ships both `paper-plugin.yml` and `plugin.yml` |
| [HoloUI](/holoui) | 21+ | Yes | Integrates with 10 custom-item plugins |
| [HiddenOre](/hiddenore) | 25 | Yes | Paper API 26.1.2 – 26.2 |
| [BileTools](/biletools) | 25+ | Yes | Paper API 26.2, hot-unload is best-effort |
{.dense}

> Wormholes ships two descriptors and they do not agree. Paper reads `paper-plugin.yml` and
> bootstraps at `STARTUP`; Spigot falls back to `plugin.yml` at `POSTWORLD`. Worth knowing
> before you debug a load-order problem.
{.is-info}

> BileTools can delete plugin jars and reloads anything that changes on disk. It belongs on a
> dev box, not on production.
{.is-warning}

## Starting points

### Common tasks {.tabset}

#### Setting up

- [Create your first Iris world *Install, download a pack, pregenerate*](/iris/installation)
- [Configure HiddenOre before players mine *Generation modes and the ordering trap*](/hiddenore/configuration)
- [Install HoloUI and open a menu *Data folder, settings.json, first menu*](/holoui/01-installation-configuration)
- [Build your first portal *Wand, runes, frame rules*](/wormholes/03-building-portals)
{.links-list}

#### Permissions

- [Adapt blacklist nodes *Inverted: granting a node disables that skill*](/adapt/blacklist)
- [Wormholes permission tree *`wormholes.portals` defaults to true for everyone*](/wormholes/commands)
- [HoloUI command permissions *Per-subcommand nodes*](/holoui/02-commands-permissions)
{.links-list}

#### Developers

- [Iris — IrisToolbelt *Access engines and create worlds in code*](/iris/api)
- [Wormholes — traversal cost & events *Price and intercept player travel*](/wormholes/21-api-traversal-cost-events)
- [HoloUI — HoloUiService *Build and open menus from your plugin*](/holoui/13-api-getting-started)
- [HiddenOre — events & service *Hook the mining reward pipeline*](/hiddenore/api)
{.links-list}

#### Troubleshooting

- [Find your worst chunk *React chunk sampling*](/react/samplers)
- [Wormholes operator runbooks *Manual smoke checks*](/wormholes/14-operator-runbooks-smoke-tests)
- [Why network peers will not connect *`/wormholes network doctor`*](/wormholes/10-cross-server-networking)
{.links-list}

## Two gotchas worth reading first

**Adapt's blacklist permissions are backwards from what you expect.** Granting
`adapt.blacklist.axes` does not give access to the Axes skill, it removes it. All ~450 nodes
default to `false`, meaning nothing is blocked out of the box.

**HiddenOre's seeded veins depend on config order.** Vein positions derive from the order of
the `drops:` list. Reorder, insert or delete an entry on a live server and every undiscovered
vein in the world reshuffles. Appending to the end is the safe edit.

## Help

- [Discord *Support and development chat*](https://discord.gg/volmit)
- [GitHub *Sources, issues, releases*](https://github.com/VolmitSoftware)
- [Contributing to these docs *This wiki takes pull requests*](/contributing)
{.links-list}
