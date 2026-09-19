---
title: "HiddenOre"
description: "Mining drop-control and anti-xray plugin"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "hiddenore"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

HiddenOre strips ore from world generation. Rewards come from ordinary stone and
deepslate instead. An xray client finds nothing in the world.

| | |
|---|---|
| Server software | Paper, Purpur, or Folia |
| Java | 25 |
| Main command | `/hiddenore` |
| Config file | `plugins/HiddenOre/hiddenore.toml` |
| Permission | `hiddenore.admin` |
| Integrations | PlaceholderAPI, Adapt, Iris |

## How it works

Mine stone or deepslate and you may get an ore reward. Explosions can pay too, once you turn [blast mining](/hiddenore/configuration#blast-mining) on.

Choose `seeded` mode for repeatable hidden veins that each pay once, or `pure_random` for fresh odds on every block. HiddenOre never places an ore block in the world.

See [Configuration](/hiddenore/configuration) for drop modes, vein stability, and limits.

## Start here

- [Installation *Requirements and first-run setup*](/hiddenore/installation)
- [Commands and permissions *Commands and access*](/hiddenore/commands)
- [Configuration *Every `hiddenore.toml` key and default*](/hiddenore/configuration)
- [Languages *Choosing a language and editing messages*](/languages)
{.links-list}

## Developer API

- [API overview *Developer API index*](/hiddenore/api)
- [Events *`HiddenOreDropsEvent` and related events*](/hiddenore/api/events)
- [Service *Block and vein queries*](/hiddenore/api/service)
- [Placeholders *PlaceholderAPI integration*](/hiddenore/api/placeholders)
{.links-list}

## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/HiddenOre*](https://github.com/VolmitSoftware/HiddenOre)
{.links-list}
