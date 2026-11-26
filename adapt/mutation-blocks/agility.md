---
title: "Mutation Blocks - Agility"
description: "What Agility brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Agility brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Agility Trigger (`block-agility-trigger`)

Sprint-jump on foot in Survival or Adventure mode. Jumps while sneaking, swimming, flying, gliding or riding do not count. The Trigger counts as either fight or work: with a hostile mob within 6 blocks it sets off the fight Strike, otherwise the work Strike. A jump is never treated as farmed.

No block-specific config keys.

### Agility Fight Strike (`block-agility-strike-fight`)

You dash along the direction you face, flat across the ground with a small upward lift, thrown the way Air Dash throws you. The dash speed is 0.3 blocks per tick (about 3 blocks) at the first level of the mutated adaptation and 0.4 at the top level. Nothing happens while you fly, glide or ride.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `forceAtFirstLevel` | `0.3` | Horizontal dash speed at the first level, in blocks per tick. |
| `forceAtTopLevel` | `0.4` | Horizontal dash speed at the top level, in blocks per tick. |
| `upwardLift` | `0.12` | Upward speed added to the dash, in blocks per tick. |

### Agility Work Strike (`block-agility-strike-work`)

You gain Speed II. It lasts 4 seconds at the first level and 6 seconds at the top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `amplifier` | `1` | Speed amplifier; 1 is Speed II. |
| `durationMillisAtFirstLevel` | `4000` | How long the speed lasts at the first level, in milliseconds. |
| `durationMillisAtTopLevel` | `6000` | How long the speed lasts at the top level, in milliseconds. |

### Agility Boon (`block-agility-boon`)

You gain Jump Boost for 4 seconds, and any fall damage you take in that time is cancelled with Roll Landing's roll. Jump Boost is level I at the first level and level II at the top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `4000` | How long the jump boost and the safe landing last, in milliseconds. |
| `amplifierAtFirstLevel` | `0` | Jump Boost amplifier at the first level; 0 is Jump Boost I. |
| `amplifierAtTopLevel` | `1` | Jump Boost amplifier at the top level. |

### Agility Fuel (`block-agility-fuel`)

The price is your running momentum. You can pay only while moving on foot in Survival or Adventure mode, not swimming, flying, gliding or riding, and only within 0.3 seconds of your last step. Paying ends your sprint and stops your horizontal movement at once. Each use also costs 2 hunger points, paid together with the momentum, and cannot be paid with less than 2 food.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minStride` | `0.03` | Shortest horizontal step in one movement, in blocks, that counts as moving. |
| `momentumWindowMillis` | `300` | How long after the last step the momentum can still be spent, in milliseconds. |
| `hunger` | `2` | Hunger points taken per use. |

### Agility State (`block-agility-state`)

Holds while one sprint has lasted 3 seconds without stopping. Where a Convergence asks for this State in the last 4 seconds, it holds when you ended a sprint of 3 seconds or more within that time, or are still in one.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `sprintMillis` | `3000` | How long one sprint must last, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Agility](/adapt/11-skill-agility).
