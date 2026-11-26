---
title: "Mutation Blocks - Golemancy"
description: "What Golemancy brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Golemancy brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Golemancy Trigger (`block-golemancy-trigger`)

One of your golems finishes a task while you are within 32 blocks of it. This is a work Trigger, and the work happens where the golem stands. Golems working while you are away set nothing off, so the Trigger is never treated as farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `ownerRadius` | `32` | How close you must be to the golem, in blocks. |

### Golemancy Fight Strike (`block-golemancy-strike-fight`)

Your nearest golem within 24 blocks that is allowed to fight turns on the target, as the Overseer's crook commands it. It keeps after the target for 8 seconds at the first level and 15 seconds at the top level. It respects PvP and PvE protection and never targets a protected friendly target.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `golemRadius` | `24` | How far from you a golem can be to answer, in blocks. |
| `commandMillisAtFirstLevel` | `8000` | How long the golem keeps after the target at the first level, in milliseconds. |
| `commandMillisAtTopLevel` | `15000` | How long the golem keeps after the target at the top level, in milliseconds. |

### Golemancy Work Strike (`block-golemancy-strike-work`)

Your nearest golem within 24 blocks does one more job.

When Pickaxes, Excavation or Herbalism sets it off, the job is yours: the golem takes the nearest block of the type you just worked, within 6 blocks of that spot at the first level and 10 blocks at the top level. For a crop it takes only a mature one. The block drops where it stood, as if broken with the item the golem holds, or by hand when it holds nothing; your own tool never counts.

When anything else sets it off, Golemancy's own Trigger included, the job is the golem's own: it repeats the last task it finished on the next open task of that kind. A golem that has finished nothing since it loaded falls back to its core within the same range around itself: a harvester reaps the nearest mature crop, and a lumber golem cuts the nearest log. Other cores do nothing.

The golem only takes a block within 5 blocks of its eyes that it can see, so it never works through a wall. Player-placed blocks and crops grown by bone meal or by Adapt are never taken, and build protection applies. This piece pays out, so it gives nothing when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `golemRadius` | `24` | How far from you a golem can be to answer, in blocks. |
| `radiusAtFirstLevel` | `6` | How far from the job the next matching block may be at the first level, in blocks. |
| `radiusAtTopLevel` | `10` | How far from the job the next matching block may be at the top level, in blocks. |
| `blockBudget` | `4096` | Most blocks one strike checks. |
| `golemReach` | `5` | How far from the golem's eyes the block may be, in blocks. |

### Golemancy Boon (`block-golemancy-boon`)

Your golems work faster for 10 seconds: 50% faster at the first level and twice as fast at the top level, through the same speed-up as Copper Frame's overdrive. Nothing happens when you have no golem within 32 blocks.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `10000` | How long golems work faster, in milliseconds. |
| `workSpeedAtFirstLevel` | `0.5` | Extra work speed at the first level, as a fraction; 0.5 is 50% faster. |
| `workSpeedAtTopLevel` | `1` | Extra work speed at the top level, as a fraction. |
| `golemRadius` | `32` | How far from you a golem must be to count, in blocks. |

### Golemancy Fuel (`block-golemancy-fuel`)

1 copper nugget from anywhere in your inventory, or 1 iron nugget when you carry no copper nuggets. Copper nuggets exist only on Minecraft versions that have them.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `amount` | `1` | Nuggets taken per use. |

### Golemancy State (`block-golemancy-state`)

Holds while a golem of yours within 16 blocks is on a job: working, walking to work or delivering.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radius` | `16` | How close the working golem must be, in blocks. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Golemancy](/adapt/34-skill-golemancy).
