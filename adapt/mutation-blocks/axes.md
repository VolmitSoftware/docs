---
title: "Mutation Blocks - Axes"
description: "What Axes brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Axes brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Axes Trigger (`block-axes-trigger`)

Land a fully charged melee hit with an axe. A hit counts as fully charged when it deals at least 95% of your attack damage. This is a fight Trigger, and the mob you hit is the target. Hits on spawner, egg, bucket or bred mobs, minions, grave mobs and your own pets count as farmed; pieces that pay out give nothing for them.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `chargedDamageRatio` | `0.95` | Share of your attack damage a hit must deal to count as fully charged. Lower values accept hits swung before the axe has fully recharged. |

### Axes Fight Strike (`block-axes-strike-fight`)

The target's armor drops by 15% of its total at the first level and 25% at the top level, for 6 seconds. Targets without armor, and targets you may not damage, are not affected.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `6000` | How long the armor stays cut, in milliseconds. |
| `armorCutAtFirstLevel` | `0.15` | Share of the target's armor removed at the first level. |
| `armorCutAtTopLevel` | `0.25` | Share of the target's armor removed at the top level. |

### Axes Work Strike (`block-axes-strike-work`)

You are primed for 30 seconds. The next natural log you break fells the connected logs of the same kind around it: up to 6 at the first level and 10 at the top level, within 8 blocks of the broken log. Each felled log is a normal break by you, so build protection, block loggers and job plugins see it, and it costs the axe 1 durability; felling stops before the axe would break. The felled logs, the one you broke included, drop as stripped logs, or as planks at the crafting table's 4 per log if the Felled logs setting of the mutated adaptation that fired the strike is Planks; nothing else is added. Sneaking has no effect here, so it never competes with Timberfall or the tree feller.

The tree then replants itself. Up to 32 of its natural leaves within 6 blocks of the canopy break as normal breaks until one drops a sapling (or a mangrove propagule or azalea). That one sapling is taken from the drops and planted where the broken log stood, if the block below is dirt, grass, podzol, mycelium, moss, mud or farmland (clay too for propagules and azaleas) and you may build there. If it cannot be planted, the sapling goes to your inventory. Player-placed logs neither use the prime nor fall, and player-placed leaves are never broken. This piece pays out, so it gives nothing when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `logsAtFirstLevel` | `6` | Connected logs felled at the first level. |
| `logsAtTopLevel` | `10` | Connected logs felled at the top level. |
| `radius` | `8` | Farthest a felled log may be from the broken one, in blocks. |
| `primedMillis` | `30000` | How long the prime waits for a log, in milliseconds. |
| `durabilityPerLog` | `1` | Axe durability each felled log costs. |
| `leavesSearched` | `32` | Most of the tree's leaves broken while looking for a sapling. |
| `leafRadius` | `6` | Farthest a searched leaf may be from the canopy, in blocks. |

### Axes Boon (`block-axes-boon`)

You gain absorption hearts for 6 seconds: 2 hearts at the first level and 4 at the top level, granted in steps of 2.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `6000` | How long the absorption lasts, in milliseconds. |
| `heartsAtFirstLevel` | `2` | Absorption hearts at the first level, in steps of 2. |
| `heartsAtTopLevel` | `4` | Absorption hearts at the top level, in steps of 2. |

### Axes Fuel (`block-axes-fuel`)

5 durability from the axe in your main hand. It never breaks the axe: you cannot pay when the axe has 5 or less durability left, or when it is unbreakable.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durability` | `5` | Durability taken from the axe. |

### Axes State (`block-axes-state`)

Holds for 4 seconds after you break a log or wood block with an axe, or land a melee hit with an axe.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `4000` | How long after chopping or an axe hit the State holds, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Axes](/adapt/13-skill-axes).
