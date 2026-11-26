---
title: "Mutation Blocks - Rift"
description: "What Rift brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Rift brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Rift Trigger (`block-rift-trigger`)

Sets off when you teleport by ender pearl, chorus fruit or Rift blink. It acts a tick after you arrive, at the spot where you landed. It counts as either a fight or a work action: with a hostile mob within 6 blocks the fight Strike lands on the nearest one, otherwise the work Strike runs where you landed. A teleport is never treated as farmed.

No block-specific config keys.

### Rift Fight Strike (`block-rift-strike-fight`)

The target is blinked straight away from you, 4 blocks at the first level of the mutated adaptation and 6 blocks at its top level. If that spot is unsafe, it tries one block shorter at a time, down to 1 block, and misses if none is safe. It never blinks a protected friendly target, and both the target's spot and its landing spot must allow you to fight there. You must see the target, and nothing solid may lie between the target and its landing spot, so it never passes through walls.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `distanceAtFirstLevel` | `4` | How far the target is blinked at the first level, in blocks. |
| `distanceAtTopLevel` | `6` | How far the target is blinked at the top level, in blocks. |

### Rift Work Strike (`block-rift-strike-work`)

Dropped items around the spot where the work happened go straight into your ender chest, up to 32 stacks per use. The reach is 6 blocks at the first level of the mutated adaptation and 8 blocks at its top level. What does not fit in the ender chest stays on the ground. Items you could not pick up yourself, such as drops reserved for another player or display items, are left alone, and nothing moves where you lack chest access. The piece only moves drops that already exist, so it also runs when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radiusAtFirstLevel` | `6` | Reach around the work spot at the first level, in blocks. |
| `radiusAtTopLevel` | `8` | Reach around the work spot at the top level, in blocks. |
| `maxStacks` | `32` | Most drops one use gathers. |

### Rift Boon (`block-rift-boon`)

Resistance for 3 seconds: Resistance I at the first level of the mutated adaptation and Resistance II at its top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `3000` | How long the resistance lasts, in milliseconds. |
| `amplifierAtFirstLevel` | `0` | Resistance amplifier at the first level; 0 is Resistance I. |
| `amplifierAtTopLevel` | `1` | Resistance amplifier at the top level. |

### Rift Fuel (`block-rift-fuel`)

Costs 1 plain ender pearl, taken from anywhere in your inventory. Bound and taglocked pearls are never spent.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `pearls` | `1` | Ender pearls taken per use. |

### Rift State (`block-rift-state`)

Holds for 5 seconds after you teleport by ender pearl, chorus fruit or Rift blink.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `5000` | How long after a teleport the State holds, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Rift](/adapt/27-skill-rift).
