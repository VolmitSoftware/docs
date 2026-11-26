---
title: "Mutation Blocks - Ranged"
description: "What Ranged brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Ranged brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Ranged Trigger (`block-ranged-trigger`)

Sets off when a projectile you shot hits a living target standing 15 blocks or more from you. Arrows fired by the Ranged Fight Strike never set it off. It counts as a fight action, and the fight Strike lands on the target you hit. A hit on a mob from a spawner, spawn egg, bucket or breeding, a minion, a grave mob or one of your own pets still sets it off, but pieces that hand out drops, healing or other rewards do nothing for it.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minDistance` | `15` | Least distance between you and the target, in blocks. |

### Ranged Fight Strike (`block-ranged-strike-fight`)

A spectral arrow leaves your eyes aimed at the target's chest and flies at 3 blocks per tick. Its base damage is 2 at the first level of the mutated adaptation and 3 at its top level. The arrow cannot be picked up. It never fires at a protected friendly target, and it follows the PvP and PvE rules of the spot where the target stands.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `speed` | `3` | Speed of the arrow in blocks per tick. |
| `damageAtFirstLevel` | `2` | Base damage of the arrow at the first level. |
| `damageAtTopLevel` | `3` | Base damage of the arrow at the top level. |

### Ranged Work Strike (`block-ranged-strike-work`)

Dropped items around the spot where the work happened fly into your inventory, within 8 blocks at the first level and 12 blocks at the top level, up to 16 stacks per use. Set off by Barter or Attunement, the pull is around you. Only what fits in your inventory moves; the rest stays on the ground. Items you could not pick up yourself, such as drops reserved for another player, are left alone, and nothing moves where you lack chest access. Up to 4 of the gathered stacks draw a trail to you. The piece only moves drops that already exist, so it also runs when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radiusAtFirstLevel` | `8` | Reach around the work spot in blocks at the first level. |
| `radiusAtTopLevel` | `12` | Reach around the work spot in blocks at the top level. |
| `maxDrops` | `16` | Most dropped stacks one use gathers. |
| `maxTrails` | `4` | Most gathered stacks that draw a trail to you. |

### Ranged Boon (`block-ranged-boon`)

Your next bow or crossbow shot within 10 seconds flies as if fully drawn, however briefly you drew it, and is a critical arrow. The next shot uses it up even if you had drawn fully.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `10000` | How long the instant draw waits for a shot, in milliseconds. |

### Ranged Fuel (`block-ranged-fuel`)

Costs 1 plain arrow, taken from anywhere in your inventory. Tipped and spectral arrows do not count.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `arrows` | `1` | Arrows taken per use. |

### Ranged State (`block-ranged-state`)

Holds while you have drawn a bow or crossbow for at least 1 second and are still holding the draw. Convergences that ask whether you "loosed a fully drawn shot" in the last 4 seconds hold while you are at full draw, or when you released a fully drawn shot within those 4 seconds.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `fullDrawMillis` | `1000` | How long a bow must be drawn to count as full draw, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Ranged](/adapt/26-skill-ranged).
