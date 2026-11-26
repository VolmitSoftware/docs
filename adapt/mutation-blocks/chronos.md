---
title: "Mutation Blocks - Chronos"
description: "What Chronos brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Chronos brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Chronos Trigger (`block-chronos-trigger`)

Sneak and swap hands with a clock in either hand. The gesture counts even when Rewind takes it. The Trigger counts as either fight or work: with a hostile mob within 6 blocks it sets off the fight Strike, otherwise the work Strike. The gesture is never treated as farmed. Because this gesture is also Barter's, Barter in a mutation with Chronos uses a double tap of sneak instead.

No block-specific config keys.

### Chronos Fight Strike (`block-chronos-strike-fight`)

The target is slowed for 2 seconds and stopped where it stands, as Aberrant Touch roots it. Slowness is level II at the first level and level IV at the top level. It respects PvP and PvE protection and never hits a protected friendly target.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `2000` | How long the target is slowed, in milliseconds. |
| `amplifierAtFirstLevel` | `1` | Slowness amplifier at the first level; 0 is Slowness I. |
| `amplifierAtTopLevel` | `3` | Slowness amplifier at the top level; 0 is Slowness I. |

### Chronos Work Strike (`block-chronos-strike-work`)

Time skips ahead around the spot where the work happened, within 4 blocks at the first level and 6 blocks at the top level. A furnace that is lit and smelting skips 10 seconds of smelting, stopping just short of finishing the item. A brewing stand skips 10 seconds of brewing. A crop grows one stage and counts as bone-mealed afterwards. The same permission checks and growth blacklist as Accelerate apply. This piece pays out, so it gives nothing when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `advanceMillis` | `10000` | Smelting and brewing time skipped, in milliseconds. |
| `radiusAtFirstLevel` | `4` | Radius in blocks at the first level. |
| `radiusAtTopLevel` | `6` | Radius in blocks at the top level. |
| `blockBudget` | `2048` | Most blocks one strike checks. |

### Chronos Boon (`block-chronos-boon`)

Each helpful potion effect on you runs longer: 5 seconds more at the first level and 10 seconds more at the top level. The effects that count are Speed, Jump Boost, Regeneration, Resistance, Fire Resistance, Water Breathing, Invisibility, Night Vision, Health Boost, Absorption, Saturation, Luck, Slow Falling, Dolphin's Grace, Hero of the Village, Haste and Strength. Infinite effects are left alone. Each application of an effect is extended only once, and by no more than the time it has left, so it never runs past twice its length; drinking or receiving the effect again allows one more extension. Nothing happens when no effect can be extended.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `addedMillisAtFirstLevel` | `5000` | Time added to each helpful effect at the first level, in milliseconds. |
| `addedMillisAtTopLevel` | `10000` | Time added to each helpful effect at the top level, in milliseconds. |

### Chronos Fuel (`block-chronos-fuel`)

Your clocks go on a 20 second cooldown, shown as the usual cooldown sweep. You need a clock in your inventory, and you cannot pay while clocks are still cooling down from this Fuel or from Instant Recall.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `cooldownMillis` | `20000` | How long the clock cools down, in milliseconds. |

### Chronos State (`block-chronos-state`)

Holds while a clock is in your off hand.

No block-specific config keys.

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Chronos](/adapt/16-skill-chronos).
