---
title: "HiddenOre"
description: "Mining drop-control and anti-xray plugin"
published: true
date: 2026-08-27T00:00:00.000Z
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

Configured base blocks enter the mining pipeline. A break may add hidden items,
experience, or command rewards to the normal drop.

The pipeline skips creative players, non-pickaxe breaks, unmanaged blocks, and
cancelled block-break events. Rewards commit only after Bukkit accepts the block
break. `HiddenOreDropsEvent` fires before HiddenOre delivers anything.

**`seeded`** derives virtual vein positions from the world seed, chunk
coordinates, and each item rule's stable identity. HiddenOre places no block.
HiddenOre stores each position in chunk persistent data. A position pays at most
once, including across restarts.

**`pure_random`** rolls fresh odds on every eligible break. The odds match the
same per-chunk statistics. HiddenOre places nothing in advance. Vein detection
finds nothing.

Reordering `drops:` does not move seeded veins. Inserting or deleting an
unrelated rule keeps each retained rule's layout stable. Positions change
ownership only where the rules overlap. A retained item rule gets a new
undiscovered layout only when the item or spatial generation fields change.
Fortune, tool-tier, and experience changes leave positions intact.

- [Installation *Requirements and first-run setup*](/hiddenore/installation)
- [Commands & Permissions *`/hiddenore` and its one node*](/hiddenore/commands)
- [Configuration *Every `hiddenore.yml` key and default*](/hiddenore/configuration)
- [API Overview *Developer API index*](/hiddenore/api)
- [API — Events *`HiddenOreDropsEvent` and others*](/hiddenore/api/events)
- [API — Service *The service interface*](/hiddenore/api/service)
- [API — Placeholders *PlaceholderAPI integration*](/hiddenore/api/placeholders)
{.links-list}
## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/HiddenOre*](https://github.com/VolmitSoftware/HiddenOre)
{.links-list}
