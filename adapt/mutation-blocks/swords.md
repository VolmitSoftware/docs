---
title: "Mutation Blocks - Swords"
description: "What Swords brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Swords brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Swords Trigger (`block-swords-trigger`)

Sets off when you land a critical melee hit with a sword. It counts as a fight action, and the fight Strike lands on the target you hit. A hit on a mob from a spawner, spawn egg, bucket or breeding, a minion, a grave mob or one of your own pets still sets it off, but pieces that hand out drops, healing or other rewards do nothing for it.

No block-specific config keys.

### Swords Fight Strike (`block-swords-strike-fight`)

The target bleeds for 4 seconds, taking magic damage every 5 ticks: 0.5 per pulse at the first level of the mutated adaptation and 1.25 at its top level. It never bleeds a protected friendly target.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `4000` | How long the target bleeds, in milliseconds. |
| `damagePerPulseAtFirstLevel` | `0.5` | Magic damage of each bleed pulse at the first level. |
| `damagePerPulseAtTopLevel` | `1.25` | Magic damage of each bleed pulse at the top level. |

### Swords Work Strike (`block-swords-strike-work`)

Cuts plants in an arc around the spot where the work happened, on the side you face, and puts their drops in your inventory; drops that do not fit fall at your feet. Set off by Barter or Attunement, the arc is around you. The arc reaches 3 blocks at the first level of the mutated adaptation and 4 blocks at its top level, from one block below the spot to two above. The block at the spot itself is left to the break that set the strike off. It cuts grass, ferns, leaves, flowers, vines, mushrooms, seagrass and the other plants Machete cuts, plus wheat, beetroots, carrots, potatoes and nether wart. Crops with growth stages (wheat, beetroots, carrots, potatoes, nether wart, cocoa) are cut only at their last stage. Cactus, sugar cane, bamboo and chorus are cut whatever their age, and a cactus, sugar cane or bamboo column keeps its bottom block so it grows back. Each cut is a normal break by you, so build protection, block loggers and job plugins see it, and it costs the held item 1 durability; cutting stops before the item would break. At most 32 blocks are cut per use. This piece does nothing when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radiusAtFirstLevel` | `3` | Reach of the arc in blocks at the first level. |
| `radiusAtTopLevel` | `4` | Reach of the arc in blocks at the top level. |
| `maxBlocks` | `32` | Most blocks one use cuts. |
| `durabilityPerBlock` | `1` | Durability of the held item each cut block costs. |

### Swords Boon (`block-swords-boon`)

Attack speed rises for 5 seconds: by 15% at the first level of the mutated adaptation and 30% at its top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `5000` | How long the attack speed lasts, in milliseconds. |
| `attackSpeedAtFirstLevel` | `0.15` | Attack speed added at the first level, as a fraction of base attack speed. |
| `attackSpeedAtTopLevel` | `0.3` | Attack speed added at the top level, as a fraction of base attack speed. |

### Swords Fuel (`block-swords-fuel`)

Costs 5 durability from the sword in your main hand. It never breaks the sword: an unbreakable sword, or one with 5 durability or less left, cannot pay.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durability` | `5` | Durability taken from the sword. |

### Swords State (`block-swords-state`)

Holds for 4 seconds after you hit an enemy in melee with a sword.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `4000` | How long after a sword hit the State holds, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Swords](/adapt/30-skill-swords).
