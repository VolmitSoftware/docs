---
title: "Mutation Blocks - Discovery"
description: "What Discovery brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Discovery brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Discovery Trigger (`block-discovery-trigger`)

Discovery records something you had never found: a block, item, creature, biome, world, recipe, food, enchantment or effect. Entering a new chunk does not count. This is a work Trigger, and the work happens where the find was made. Each find happens once, so none is treated as farmed.

No block-specific config keys.

### Discovery Fight Strike (`block-discovery-strike-fight`)

Insight's readout of the target appears on your action bar, and your next melee hit on that target within 30 seconds deals 20% more damage at the first level and 35% more at the top level. Only the last marked target gets the bonus.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `bonusAtFirstLevel` | `0.2` | Extra damage of the next hit at the first level, as a fraction. |
| `bonusAtTopLevel` | `0.35` | Extra damage of the next hit at the top level, as a fraction. |
| `weaknessMillis` | `30000` | How long the next hit stays marked, in milliseconds. |

### Discovery Work Strike (`block-discovery-strike-work`)

The nearest chest, trapped chest, spawner, trial spawner or generated structure around the spot where the work happened pings for you. The search reaches 24 blocks at the first level and 32 blocks at the top level, in loaded chunks. Sixth Sense's direction line points at what was found; a structure is pointed at its middle. A chest or spawner also glows for you alone for 4 seconds, as Keen Eye shows it. A chest or spawner counts only when you can see it from where you stand and may open chests there, so nothing shows through walls.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `rangeAtFirstLevel` | `24` | Search range in blocks at the first level. |
| `rangeAtTopLevel` | `32` | Search range in blocks at the top level. |
| `pingMillis` | `4000` | How long a found chest or spawner glows, in milliseconds. |

### Discovery Boon (`block-discovery-boon`)

You gain Night Vision, and up to 8 of the nearest chests and trapped chests within 24 blocks glow for you alone. Only chests you can see and may open glow, never through walls. Both last 8 seconds at the first level and 12 seconds at the top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillisAtFirstLevel` | `8000` | How long the Boon lasts at the first level, in milliseconds. |
| `durationMillisAtTopLevel` | `12000` | How long the Boon lasts at the top level, in milliseconds. |
| `chestRange` | `24` | How far around you chests glow, in blocks. |

### Discovery Fuel (`block-discovery-fuel`)

1 paper from anywhere in your inventory, or 1 empty map when you carry no paper.

No block-specific config keys.

### Discovery State (`block-discovery-state`)

Holds while you stand in the chunk that Discovery last recorded as one you had never entered. It stops when you step into another chunk.

No block-specific config keys.

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Discovery](/adapt/18-skill-discovery).
