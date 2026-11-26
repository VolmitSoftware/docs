---
title: "Mutation Blocks - Kinetics"
description: "What Kinetics brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Kinetics brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece. Kinetics cannot be merged on Minecraft 1.20.1, so none of these pieces run there.

## Blocks

### Kinetics Trigger (`block-kinetics-trigger`)

Sets off when you land from a fall of 4 blocks or more. The landing counts even when its fall damage was prevented. It counts as either a fight or a work action: with a hostile mob within 6 blocks the fight Strike lands on the nearest one, otherwise the work Strike runs where you landed. A landing is never treated as farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minFallDistance` | `4` | Shortest fall that counts, in blocks. |

### Kinetics Fight Strike (`block-kinetics-strike-fight`)

Throws the target straight up at 0.9 blocks per tick at the first level of the mutated adaptation and 1.3 at its top level. The target keeps a fifth of its sideways motion. It never launches a protected friendly target, and it follows the PvP and PvE rules of the spot where the target stands.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `launchAtFirstLevel` | `0.9` | Upward speed given to the target at the first level, in blocks per tick. |
| `launchAtTopLevel` | `1.3` | Upward speed given to the target at the top level, in blocks per tick. |

### Kinetics Work Strike (`block-kinetics-strike-work`)

Primes your next jump. If you jump within 5 seconds, the jump reaches 3 blocks high at the first level of the mutated adaptation and 4 blocks at its top level. The boost ends with that jump, or after 5 seconds if you do not jump.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `5000` | How long the primed jump waits, in milliseconds. |
| `jumpHeightAtFirstLevel` | `3` | Height of the primed jump at the first level, in blocks. |
| `jumpHeightAtTopLevel` | `4` | Height of the primed jump at the top level, in blocks. |

### Kinetics Boon (`block-kinetics-boon`)

Slow Falling for 3 seconds at the first level of the mutated adaptation and 5 seconds at its top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillisAtFirstLevel` | `3000` | How long Slow Falling lasts at the first level, in milliseconds. |
| `durationMillisAtTopLevel` | `5000` | How long Slow Falling lasts at the top level, in milliseconds. |

### Kinetics Fuel (`block-kinetics-fuel`)

Spends the fall you have built up. You can pay only in mid-air, not flying, after falling at least 2 blocks. Paying resets your fall, so the landing deals no fall damage and does not count as a fall for the Kinetics Trigger. Each use also costs 2 hunger points, paid together with the fall, and cannot be paid with less than 2 food.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minFallDistance` | `2` | Fall distance needed before it can be spent, in blocks. |
| `hunger` | `2` | Hunger points taken per use. |

### Kinetics State (`block-kinetics-state`)

Holds while you are off the ground on your own: not flying, gliding, swimming, climbing, riding or in water. Convergences that ask whether you "landed from a jump or fall" in the last 4 seconds hold while you are airborne, or when you landed from a jump or fall within those 4 seconds.

No block-specific config keys.

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Kinetics](/adapt/23-skill-kinetics).
