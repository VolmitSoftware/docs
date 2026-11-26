---
title: "Mutation Blocks - Stealth"
description: "What Stealth brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Stealth brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Stealth Trigger (`block-stealth-trigger`)

Sets off when you land a melee hit, with any weapon or bare-handed, on a target that is not looking at you. It counts as a fight action, and the fight Strike lands on the target you hit. A hit on a mob from a spawner, spawn egg, bucket or breeding, a minion, a grave mob or one of your own pets still sets it off, but pieces that hand out drops, healing or other rewards do nothing for it.

No block-specific config keys.

### Stealth Fight Strike (`block-stealth-strike-fight`)

Every mob within 8 blocks of you loses track of you. Mobs targeting you drop you, and none of them can target you again for 3 seconds at the first level of the mutated adaptation and 4 seconds at its top level. It does nothing when no mob is within reach.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radius` | `8` | Reach around you in blocks. |
| `millisAtFirstLevel` | `3000` | How long the mobs cannot find you at the first level, in milliseconds. |
| `millisAtTopLevel` | `4000` | How long the mobs cannot find you at the top level, in milliseconds. |

### Stealth Work Strike (`block-stealth-strike-work`)

For 5 seconds at the first level of the mutated adaptation and 7 seconds at its top level, you make no sound, sculk does not react to anything you do, and no mob can take you as a target. Mobs within 32 blocks that are already hunting you drop you when it starts. Leaving the server or a reload of Adapt ends it. If the server stops before it ends, it ends when you next join.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `millisAtFirstLevel` | `5000` | How long you stay silent and ignored at the first level, in milliseconds. |
| `millisAtTopLevel` | `7000` | How long you stay silent and ignored at the top level, in milliseconds. |
| `aggroRadius` | `32` | Reach in blocks within which mobs already hunting you drop their aggression. |

### Stealth Boon (`block-stealth-boon`)

Invisibility without particles for 3 seconds at the first level of the mutated adaptation and 5 seconds at its top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `millisAtFirstLevel` | `3000` | How long the invisibility lasts at the first level, in milliseconds. |
| `millisAtTopLevel` | `5000` | How long the invisibility lasts at the top level, in milliseconds. |

### Stealth Fuel (`block-stealth-fuel`)

Spends your cover. You can pay while you are invisible, or while you sneak with no mob within 32 blocks targeting you. Paying removes your invisibility and makes you glow for 5 seconds. Each use also costs 2 hunger points, paid together with your cover, and cannot be paid with less than 2 food. While a Phantom Decoy is up, sneak and swap hands swaps you with the decoy instead, and this piece cannot pay.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `revealMillis` | `5000` | How long you glow after spending your cover, in milliseconds. |
| `huntRadius` | `32` | Reach in blocks within which a mob targeting you breaks your cover. |
| `hunger` | `2` | Hunger points taken per use. |

### Stealth State (`block-stealth-state`)

Holds while you sneak and no mob within 32 blocks targets you. Convergences that ask whether you "were sneaking unseen" in the last 4 seconds hold while that is true now, or when you were seen sneaking unhunted within those 4 seconds. That is checked at most every 0.25 seconds while you sneak and move, and once when you stand up.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `huntRadius` | `32` | Reach in blocks within which a mob targeting you counts. |
| `sampleMillis` | `250` | Least time between two checks while you sneak and move, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Stealth](/adapt/29-skill-stealth).
