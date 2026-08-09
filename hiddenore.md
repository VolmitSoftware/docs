---
title: "HiddenOre"
description: "HiddenOre mining economy and anti-xray plugin"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "hiddenore"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

# HiddenOre

Ore is removed from world generation and paid out of ordinary stone and deepslate instead, so
there is nothing in the world for an xray client to find.

| | |
|---|---|
| Command | `/hiddenore` |
| Load | `STARTUP` |
| Folia | Supported |
| Permission | `hiddenore.admin` |
| Integrations | PlaceholderAPI, Adapt |

## How it works

Configured base blocks enter the mining pipeline. Breaking one may yield hidden items,
experience, or command rewards on top of its normal drop.

The pipeline excludes creative players, non-pickaxe breaks, unmanaged blocks, and cancelled
block-break events. Rewards commit only after Bukkit completes an accepted block break, and
`HiddenOreDropsEvent` fires before anything is delivered.

**`seeded`** derives virtual vein positions from the world seed, chunk coordinates and rule
order. No block is placed. Each position is recorded in chunk persistent data and pays out at
most once, ever, including across restarts.

**`pure_random`** rolls fresh odds on every eligible break, tuned to the same per-chunk
statistics. Nothing is pre-placed, so vein detection always comes up empty.

> Seeded vein positions derive from the order of the `drops:` list. Reordering, inserting or
> deleting an item rule reshuffles every undiscovered vein in the world. Appending to the end
> is the safe edit. Back up worlds first.
{.is-danger}

- [Installation *Requirements and first-run setup*](/hiddenore/installation)
- [Commands & Permissions *`/hiddenore` and its one node*](/hiddenore/commands)
- [Configuration *Every `config.yml` key and default*](/hiddenore/configuration)
- [API Overview *Developer API index*](/hiddenore/api)
- [API — Events *`HiddenOreDropsEvent` and others*](/hiddenore/api/events)
- [API — Service *The service interface*](/hiddenore/api/service)
- [API — Placeholders *PlaceholderAPI integration*](/hiddenore/api/placeholders)
{.links-list}

## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/HiddenOre*](https://github.com/VolmitSoftware/HiddenOre)
{.links-list}
