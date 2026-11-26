---
title: "Mutation Blocks - Seaborne"
description: "What Seaborne brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Seaborne brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Seaborne Trigger (`block-seaborne-trigger`)

Sets off in two ways: you drop into water from a block that is not water, or a living attacker hits you while you are wet (in water, swimming, or with rain falling on you: a storm, open sky above you, and a biome where it rains rather than snows or stays dry). It counts as either a fight or a work action. After a hit, the fight Strike lands on the attacker; otherwise, with a hostile mob within 6 blocks the fight Strike lands on the nearest one, and with none the work Strike runs where you are. A dive is never treated as farmed. A hit from a mob from a spawner, spawn egg, bucket or breeding, a minion, a grave mob or one of your own pets still sets it off, but pieces that hand out drops, healing or other rewards do nothing for it.

No block-specific config keys.

### Seaborne Fight Strike (`block-seaborne-strike-fight`)

A burst of water throws the target away from you and puts out any fire on it. The push is 1.1 at the first level of the mutated adaptation and 1.8 at its top level, with a lift of 0.35, and the target is never thrown faster than 2.2. It never pushes a protected friendly target, and it follows the PvP and PvE rules of the spot where the target stands.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `pushAtFirstLevel` | `1.1` | Horizontal push at the first level. |
| `pushAtTopLevel` | `1.8` | Horizontal push at the top level. |
| `lift` | `0.35` | Upward lift of the push. |
| `maxVelocity` | `2.2` | Fastest the target can be thrown. |

### Seaborne Work Strike (`block-seaborne-strike-work`)

Around the spot where the work happened, fire and soul fire go out and dry farmland becomes fully watered. The reach is 4 blocks at the first level of the mutated adaptation and 6 blocks at its top level. Fire goes out only where you may break blocks, and farmland is watered only where you may place them. One use checks at most 2048 blocks.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radiusAtFirstLevel` | `4` | Radius in blocks at the first level. |
| `radiusAtTopLevel` | `6` | Radius in blocks at the top level. |
| `blockBudget` | `2048` | Most blocks one use checks. |

### Seaborne Boon (`block-seaborne-boon`)

Water Breathing and Dolphin's Grace for 6 seconds at the first level of the mutated adaptation and 10 seconds at its top level. A longer effect you already have is kept.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillisAtFirstLevel` | `6000` | How long both effects last at the first level, in milliseconds. |
| `durationMillisAtTopLevel` | `10000` | How long both effects last at the top level, in milliseconds. |

### Seaborne Fuel (`block-seaborne-fuel`)

Costs 3 air bubbles from your breath bar, which holds 10 when full. You can pay only with your head under water. Rain does not let you pay: in rain your breath bar is full and refills at once, so bubbles taken there would cost nothing. Each use also costs 2 hunger points, paid together with the bubbles, and cannot be paid with less than 2 food.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `bubbles` | `3` | Air bubbles taken per use. |
| `hunger` | `2` | Hunger points taken per use. |

### Seaborne State (`block-seaborne-state`)

Holds while you are wet: in water, swimming, or with rain falling on you (open sky, in a biome where it rains).

No block-specific config keys.

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Seaborne](/adapt/28-skill-seaborne).
