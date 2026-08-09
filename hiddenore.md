---
title: HiddenOre
description: HiddenOre mining economy and anti-xray plugin — overview
published: true
date: 2026-08-09T00:00:00.000Z
tags: hiddenore
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

HiddenOre is a mining economy and anti-xray plugin. It removes ore from world generation and
pays rewards out of ordinary stone and deepslate instead, so there is nothing for an xray
client to find.

**Root command:** `/hiddenore`
**Soft dependency:** PlaceholderAPI
**Load order:** `STARTUP`
**Folia:** supported

## How it works

Configured base blocks — stone and deepslate by default — enter HiddenOre's mining pipeline.
Breaking one may yield hidden items, experience, or command rewards on top of its normal drop.

The pipeline deliberately excludes creative players, non-pickaxe breaks, unmanaged blocks, and
cancelled block-break events. Rewards commit only after Bukkit has completed an accepted
block break, and `HiddenOreDropsEvent` fires before anything is delivered.

### Two generation modes

**`seeded`** derives virtual vein positions from the world seed, chunk coordinates, and rule
order. No block is ever placed. Each discovered position is recorded in chunk persistent data
and pays out at most once, ever — including across restarts. Other plugins can detect and
outline veins.

**`pure_random`** rolls fresh odds on every eligible break, tuned to the same per-chunk
statistics. Nothing is pre-placed, so vein detection always comes up empty.

> **Seeded mode is order-sensitive.** Vein positions are derived from the order of the `drops:`
> list. Reordering, inserting, or deleting item rules reshuffles every undiscovered vein.
> Back up worlds before touching that list on an established server.

## Where to go next

| Page | Covers |
|---|---|
| [Installation](/hiddenore/installation) | Requirements and setup |
| [Commands & Permissions](/hiddenore/commands) | `/hiddenore` and its permission node |
| [Configuration](/hiddenore/configuration) | Every `config.yml` key |
| [API Overview](/hiddenore/api) | Developer API index |
| [API — Events](/hiddenore/api/events) | `HiddenOreDropsEvent` and others |
| [API — Service](/hiddenore/api/service) | The service interface |
| [API — Placeholders](/hiddenore/api/placeholders) | PlaceholderAPI integration |

## Support

[Discord](https://discord.gg/volmit) · [Source](https://github.com/VolmitSoftware/HiddenOre)
