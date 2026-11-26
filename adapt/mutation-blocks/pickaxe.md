---
title: "Mutation Blocks - Pickaxes"
description: "What Pickaxes brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Pickaxes brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Pickaxes Trigger (`block-pickaxe-trigger`)

Sets off when you break an ore with a pickaxe in your main hand. Any block whose name ends in `_ore` counts, and so does ancient debris. It counts as a work action, and the work Strike runs at the ore. A player-placed ore, or one broken and replaced too soon, still sets it off, but pieces that hand out drops, healing or other rewards do nothing for it.

No block-specific config keys.

### Pickaxes Fight Strike (`block-pickaxe-strike-fight`)

A burst of rock stuns the target: it stops and cannot move for 1 second at the first level of the mutated adaptation and 1.75 seconds at its top level. It never stuns a protected friendly target, and it follows the PvP and PvE rules of the spot where the target stands.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `stunMillisAtFirstLevel` | `1000` | How long the target is stunned at the first level, in milliseconds. |
| `stunMillisAtTopLevel` | `1750` | How long the target is stunned at the top level, in milliseconds. |

### Pickaxes Work Strike (`block-pickaxe-strike-work`)

Ores around the spot where the work happened glow for 5 seconds, seen by you alone, each in its ore's colour. The search reaches 6 blocks at the first level of the mutated adaptation and 9 blocks at its top level. At most 24 ores light up, nearest first.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radiusAtFirstLevel` | `6` | Radius searched for ores at the first level, in blocks. |
| `radiusAtTopLevel` | `9` | Radius searched for ores at the top level, in blocks. |
| `glowMillis` | `5000` | How long the ores glow, in milliseconds. |
| `maxOres` | `24` | Most ores lit by one use, nearest first. |

### Pickaxes Boon (`block-pickaxe-boon`)

Faster mining for 6 seconds: block breaking speed rises by 40% at the first level of the mutated adaptation and 80% at its top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `6000` | How long the faster mining lasts, in milliseconds. |
| `speedAtFirstLevel` | `0.4` | Block breaking speed added at the first level, as a fraction of the current speed. |
| `speedAtTopLevel` | `0.8` | Block breaking speed added at the top level, as a fraction of the current speed. |

### Pickaxes Fuel (`block-pickaxe-fuel`)

Costs 5 durability from the pickaxe in your main hand. It never breaks the pickaxe: an unbreakable pickaxe, or one with 5 durability or less left, cannot pay.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durability` | `5` | Durability taken from the pickaxe. |

### Pickaxes State (`block-pickaxe-state`)

Holds for 4 seconds after you break a block with a pickaxe.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `4000` | How long after mining a block the State holds, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Pickaxes](/adapt/25-skill-pickaxes).
