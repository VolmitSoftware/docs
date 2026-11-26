---
title: "Mutation Blocks - Blocking"
description: "What Blocking brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Blocking brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Blocking Trigger (`block-blocking-trigger`)

Block a hit with a raised shield in either hand; the shield must take at least part of the hit. This is a fight Trigger. The attacker, or the shooter of a projectile, is the target. Blocks against spawner, egg, bucket or bred mobs, minions, grave mobs and your own pets count as farmed; pieces that pay out give nothing for them.

No block-specific config keys.

### Blocking Fight Strike (`block-blocking-strike-fight`)

The target is staggered the way Perfect Guard staggers: Slowness II and Weakness I, and a push away from you. A player target's shield also goes on cooldown for the same time, as if an axe had disabled it. The stagger lasts 2 seconds at the first level and 3 seconds at the top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `staggerMillisAtFirstLevel` | `2000` | How long the stagger and shield lockout last at the first level, in milliseconds. |
| `staggerMillisAtTopLevel` | `3000` | How long the stagger and shield lockout last at the top level, in milliseconds. |
| `slownessAmplifier` | `1` | Slowness amplifier of the stagger; 0 is Slowness I. |
| `knockback` | `0.4` | Push away from you when the stagger lands. |

### Blocking Work Strike (`block-blocking-strike-work`)

You are warded for 10 seconds. The next damage you take while the ward is up is cut by 50% at the first level and 65% at the top level, and the ward is gone. Damage of any kind, including falls and fire, uses the ward.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `wardMillis` | `10000` | How long the ward waits for a hit, in milliseconds. |
| `reductionAtFirstLevel` | `0.5` | Share of the warded hit taken off at the first level. |
| `reductionAtTopLevel` | `0.65` | Share of the warded hit taken off at the top level. |

### Blocking Boon (`block-blocking-boon`)

For 5 seconds you gain knockback resistance, and projectile damage you take is cut by the same share: 30% at the first level and 45% at the top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `5000` | How long the resistance lasts, in milliseconds. |
| `resistanceAtFirstLevel` | `0.3` | Knockback resistance and projectile damage taken off at the first level, as a fraction. |
| `resistanceAtTopLevel` | `0.45` | Knockback resistance and projectile damage taken off at the top level, as a fraction. |

### Blocking Fuel (`block-blocking-fuel`)

10 durability from the shield you hold, off hand first. It never breaks the shield: you cannot pay when the shield has 10 or less durability left, or when it is unbreakable.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durability` | `10` | Durability taken from the shield. |

### Blocking State (`block-blocking-state`)

Holds while you have a shield raised in either hand. Where a Convergence asks for this State in the last 4 seconds, it holds when your shield blocked a hit within that time.

No block-specific config keys.

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Blocking](/adapt/14-skill-blocking).
