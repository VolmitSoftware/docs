---
title: "Mutation Blocks - Excavation"
description: "What Excavation brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Excavation brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

Soft blocks are clay, dirt, coarse dirt, rooted dirt, farmland, grass blocks, dirt paths, gravel, mycelium, podzol, sand, red sand, soul sand, soul soil, snow, snow blocks, mud and muddy mangrove roots.

## Blocks

### Excavation Trigger (`block-excavation-trigger`)

Dig 8 soft blocks with a shovel within 5 seconds. This is a work Trigger, and the work happens at the last block you dug. The run counts as farmed when any of its blocks was placed by a player or refilled a spot broken moments before; pieces that pay out give nothing for a farmed run.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `blocks` | `8` | Soft blocks to dig inside the window. |
| `windowMillis` | `5000` | How long the digs may take, in milliseconds. |

### Excavation Fight Strike (`block-excavation-strike-fight`)

When the target stands on a soft block, its movement speed drops by 40% at the first level and 70% at the top level, for 3 seconds. If that block is dirt, coarse dirt or rooted dirt and you may break blocks there, it turns to mud until the slow ends, then turns back. Nothing happens when the target is not standing on a soft block. It respects PvP and PvE protection and never hits a protected friendly target.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `slowMillis` | `3000` | How long the target is slowed, in milliseconds. |
| `slowAtFirstLevel` | `0.4` | Movement speed taken at the first level, as a fraction. |
| `slowAtTopLevel` | `0.7` | Movement speed taken at the top level, as a fraction. |

### Excavation Work Strike (`block-excavation-strike-work`)

The soft blocks in the 3 by 3 around a shovel dig break a tick after the dig, through the plane Tunneler carves: it lies flat when you look steeply up or down, and stands upright facing you otherwise. Each block is a normal break by you, so it drops as if broken with the shovel, build protection, block loggers and job plugins see it, and it costs the shovel 1 durability; digging stops before the shovel would break.

When Excavation's own Trigger sets it off, it digs around your last dig. When another skill sets it off, the next soft block you dig with a shovel within 10 seconds breaks the 3 by 3 around it, and all of it drops. Digging a player-placed soft block uses up that prime with no effect.

This piece pays out, so it gives nothing when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `primedMillis` | `10000` | How long a dig stays primed when another skill sets this off, in milliseconds. |
| `durabilityPerBlock` | `1` | Shovel durability each extra block costs. |

### Excavation Boon (`block-excavation-boon`)

Your next fall deals no damage and lands in Soft Fall's cushion. The safe landing waits until you fall. A new grant does nothing while one is already waiting.

No block-specific config keys.

### Excavation Fuel (`block-excavation-fuel`)

8 dirt, sand, red sand or gravel from anywhere in your inventory, in any mix.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `amount` | `8` | Dirt, sand or gravel taken per use. |

### Excavation State (`block-excavation-state`)

Holds for 4 seconds after you dig a soft block with a shovel.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `4000` | How long after a dig the State holds, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Excavation](/adapt/20-skill-excavation).
