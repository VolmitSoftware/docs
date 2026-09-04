---
title: "HiddenOre"
description: "Mining drop-control and anti-xray plugin"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "hiddenore"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

HiddenOre strips ore from world generation. Rewards come from ordinary stone and
deepslate instead. An xray client finds nothing in the world.

| | |
|---|---|
| Command | `/hiddenore` |
| Folia | Supported |
| Permission | `hiddenore.admin` |
| Integrations | PlaceholderAPI, Adapt |

## How it works

Configured stone and deepslate blocks can award hidden items, experience, or command rewards when mined.

The pipeline skips creative players, non-pickaxe breaks, unmanaged blocks, and
cancelled block-break events. Rewards commit only after Bukkit accepts the block
break. `HiddenOreDropsEvent` fires before HiddenOre delivers anything.

In `seeded` mode, rewards occupy repeatable virtual vein positions and each position pays once, including across restarts.

In `pure_random` mode, every eligible block rolls fresh odds.

HiddenOre never places ore blocks. See [Configuration](/hiddenore/configuration) for drop modes, vein stability, and limits.

- [Installation *Requirements and first-run setup*](/hiddenore/installation)
- [Commands and permissions *Commands and access*](/hiddenore/commands)
- [Configuration *Every `hiddenore.yml` key and default*](/hiddenore/configuration)
- [API Overview *Developer API index*](/hiddenore/api)
- [API events *`HiddenOreDropsEvent` and related events*](/hiddenore/api/events)
- [API service *Block and vein queries*](/hiddenore/api/service)
- [API placeholders *PlaceholderAPI integration*](/hiddenore/api/placeholders)
{.links-list}

## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/HiddenOre*](https://github.com/VolmitSoftware/HiddenOre)
{.links-list}
