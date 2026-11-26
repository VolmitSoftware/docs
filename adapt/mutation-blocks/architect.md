---
title: "Mutation Blocks - Architect"
description: "What Architect brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Architect brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Architect Trigger (`block-architect-trigger`)

Place 8 blocks within 5 seconds. Placements where you are not allowed to build do not count. This is a work Trigger. The run counts as farmed when any of its placements refills a spot that was broken moments before, the same rule Architect's own XP uses; pieces that pay out give nothing for a farmed run.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `blocks` | `8` | Blocks to place inside the window. |
| `windowMillis` | `5000` | How long the placements may take, in milliseconds. |

### Architect Fight Strike (`block-architect-strike-fight`)

A wall 2 blocks high rises halfway between you and the target, across the line between you. It is 3 blocks wide at the first level and 5 blocks wide at the top level. The wall fills only empty space, never the blocks you or the target stand in, and respects build protection. The target must be at least 2 blocks away. The wall is the same temporary glass Magic Foundation uses and goes away after 3 seconds. It works whether or not Magic Foundation is enabled. While it stands it cannot be broken, pushed by pistons or blown up, and any left over after a restart is cleared when its chunk loads.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `widthAtFirstLevel` | `3` | Width of the wall in blocks at the first level. |
| `widthAtTopLevel` | `5` | Width of the wall in blocks at the top level. |
| `minDistance` | `2` | Closest the target may be for a wall to fit, in blocks. |
| `wallMillis` | `3000` | How long the wall stands, in milliseconds. |

### Architect Work Strike (`block-architect-strike-work`)

For 5 seconds your placements reach farther: 3 more blocks at the first level and 5 more at the top level. On servers that have the block reach attribute (Minecraft 1.20.5 and later) the bonus is added to it. On older servers a right-click into the air with a block in your hand places it where you look, within the longer reach.

During the same 5 seconds, a placement aimed near your chalk guide snaps onto it. Your guide is the one drawn with a planned chalk wand you carry in your off hand or hotbar. When an open spot of the guide lies within your reach and within 1.5 blocks of where you look, the block goes on that spot instead. Every block placed this way takes one block from your hand, needs build rights and counts as player-placed. No item is ever given back.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `5000` | How long the longer reach lasts, in milliseconds. |
| `reachAtFirstLevel` | `3` | Blocks of extra placement reach at the first level. |
| `reachAtTopLevel` | `5` | Blocks of extra placement reach at the top level. |

### Architect Boon (`block-architect-boon`)

Your next placements are reinforced: 8 at the first level, 10 at the second and 12 at the top level. For 60 seconds after it is placed, a reinforced block is skipped by explosions and does not burn. After that it is an ordinary block again. Breaking one by hand drops it as usual. A new grant fills the stock back up, and does nothing while it is already full. No item is ever given back.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `placementsAtFirstLevel` | `8` | Placements reinforced at the first level. |
| `placementsAtTopLevel` | `12` | Placements reinforced at the top level. |
| `reinforcedMillis` | `60000` | How long a placement stays blast and fire proof, in milliseconds. |

### Architect Fuel (`block-architect-fuel`)

4 blocks from the stack in your main hand. You must hold a placeable block with at least 4 in the stack. Shulker boxes are never spent.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `amount` | `4` | Blocks taken from the held stack per use. |

### Architect State (`block-architect-state`)

Holds for 4 seconds after you place a block where you are allowed to build.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `4000` | How long after a placement the State holds, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Architect](/adapt/12-skill-architect).
