---
title: "Mutation Blocks - Enchanting"
description: "What Enchanting brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Enchanting brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Enchanting Trigger (`block-enchanting-trigger`)

Enchant an item at an enchanting table, or gain 10 or more vanilla XP points in one pickup. This is a work Trigger. An XP pickup fires at most once every 30 seconds. It counts as farmed when a spawner, bred or otherwise farmed mob dropped XP within 16 blocks of you in the 15 seconds before, so a mob grinder cannot set off pieces that pay out.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `experience` | `10` | Vanilla XP points that must arrive at once. |
| `experienceCooldownMillis` | `30000` | Shortest time between two XP pickups that fire, in milliseconds. |
| `farmRadius` | `16` | Distance from a farmed mob's death within which picked-up XP counts as farmed, in blocks. |
| `farmWindowMillis` | `15000` | How long after a farmed mob's death picked-up XP counts as farmed, in milliseconds. |

### Enchanting Fight Strike (`block-enchanting-strike-fight`)

The target glows for 5 seconds. For those 5 seconds, every natural mob you kill drops more vanilla XP: 1.5 times as much at the first level and 2 times as much at the top level. Spawner, egg, bucket and bred mobs, minions, grave mobs and your own pets drop their usual XP. This piece pays out, so it gives nothing against a farmed target.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `5000` | How long the glow and the XP bonus last, in milliseconds. |
| `xpMultiplierAtFirstLevel` | `1.5` | Multiplier on dropped XP at the first level. |
| `xpMultiplierAtTopLevel` | `2` | Multiplier on dropped XP at the top level. |

### Enchanting Work Strike (`block-enchanting-strike-work`)

You are primed for 30 seconds. The next natural block you break while holding an item drops what that item would drop with Fortune one level higher. Player-placed blocks, and the extra blocks another strike or upgrade breaks for you, keep their usual drops and leave the prime in place. This piece pays out, so it gives nothing when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `primeMillis` | `30000` | How long the prime waits for a block break, in milliseconds. |

### Enchanting Boon (`block-enchanting-boon`)

You gain Luck for 8 seconds: Luck I at the first level and Luck II at the top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `8000` | How long the luck lasts, in milliseconds. |
| `amplifierAtFirstLevel` | `0` | Luck amplifier at the first level; 0 is Luck I. |
| `amplifierAtTopLevel` | `1` | Luck amplifier at the top level; 0 is Luck I. |

### Enchanting Fuel (`block-enchanting-fuel`)

1 vanilla XP level, spent the way Tome Rebinding spends levels.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `levels` | `1` | Vanilla XP levels taken per use. |

### Enchanting State (`block-enchanting-state`)

Holds while you carry 20 or more vanilla XP levels.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `levels` | `20` | Vanilla XP levels you must carry. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Enchanting](/adapt/19-skill-enchanting).
