---
title: "HiddenOre"
description: "HiddenOre mining economy and anti-xray plugin"
published: true
date: 2026-08-14T00:00:00.000Z
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

**`seeded`** derives virtual vein positions from the world seed, chunk coordinates and each
item rule's stable configuration identity. No block is placed. Each position is recorded in
chunk persistent data and pays out at most once, ever, including across restarts.

**`pure_random`** rolls fresh odds on every eligible break, tuned to the same per-chunk
statistics. Nothing is pre-placed, so vein detection always comes up empty.

Reordering `drops:` does not move seeded veins. Inserting or deleting an unrelated rule keeps
each retained rule's pseudorandom layout stable; only positions where the rules directly
overlap can change ownership. Changing a retained item rule changes that rule's identity and
therefore its undiscovered vein layout only when the item or spatial generation fields change;
Fortune, tool-tier, and experience changes leave positions intact.

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
