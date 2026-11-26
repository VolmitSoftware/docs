---
title: "Mutation Blocks - TragOul"
description: "What TragOul brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what TragOul brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### TragOul Trigger (`block-tragoul-trigger`)

Sets off when a single source of damage takes 2 hearts or more from you after armor and other reductions. Any damage counts, including falls and fire. It counts as a fight action. The fight Strike lands on whoever hurt you, or on the shooter of a projectile; with no attacker, it lands on the nearest hostile mob within 6 blocks, and with none there nothing happens. A hit from a mob from a spawner, spawn egg, bucket or breeding, a minion, a grave mob or one of your own pets still sets it off, but pieces that hand out drops, healing or other rewards do nothing for it.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minimumHearts` | `2` | Hearts one hit must take, after armor and other reductions. |

### TragOul Fight Strike (`block-tragoul-strike-fight`)

You drain the target: it takes 1 heart of damage at the first level of the mutated adaptation and 1.5 hearts at its top level, and you regain the health it actually lost. It never drains a protected friendly target, it follows the PvP and PvE rules of the spot where the target stands, and it does nothing when the action or the target was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `drainAtFirstLevel` | `2` | Health drained at the first level (2 health is 1 heart). |
| `drainAtTopLevel` | `3` | Health drained at the top level. |

### TragOul Work Strike (`block-tragoul-strike-work`)

Turns 1 point of hunger into health: half a heart at the first level of the mutated adaptation and 1 heart at its top level. Only food you ate counts: hunger a boon restored, such as Herbalism's, is never turned into health, since Barter can buy that hunger with health. It does nothing at full health, with too little eaten food, or when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `hunger` | `1` | Hunger points spent. |
| `healingAtFirstLevel` | `1` | Health restored at the first level (2 health is 1 heart). |
| `healingAtTopLevel` | `2` | Health restored at the top level. |

### TragOul Boon (`block-tragoul-boon`)

Heals you 1.5 hearts at the first level of the mutated adaptation and 2.5 hearts at its top level. It does nothing at full health.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `healingAtFirstLevel` | `3` | Health restored at the first level (2 health is 1 heart). |
| `healingAtTopLevel` | `5` | Health restored at the top level. |

### TragOul Fuel (`block-tragoul-fuel`)

Costs 1 heart of your own health. It is taken directly, so there is no hurt effect or knockback. It never takes your last half heart: you need at least 1.5 hearts to pay.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `health` | `2` | Health taken per use (2 health is 1 heart). |

### TragOul State (`block-tragoul-state`)

Holds while you are alive and at 3 hearts or less.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `hearts` | `3` | Hearts at or below which the State holds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [TragOul](/adapt/32-skill-tragoul).
