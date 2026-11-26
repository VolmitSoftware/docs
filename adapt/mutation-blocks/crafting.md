---
title: "Mutation Blocks - Crafting"
description: "What Crafting brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Crafting brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Crafting Trigger (`block-crafting-trigger`)

Craft a pickaxe, axe, shovel, hoe, sword, helmet, chestplate, leggings or boots. Other gear, such as bows, tridents or shields, does not count, and neither does a piece made from an ingredient you crafted yourself in the last 10 seconds, so a loop of planks, sticks and wooden tools never sets it off. This is a work Trigger.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `freshPartsMillis` | `10000` | How long after you craft an item it cannot count as an ingredient of a crafted piece, in milliseconds. |

### Crafting Fight Strike (`block-crafting-strike-fight`)

A sharpened edge: your next hit within 5 seconds ignores 20% of the target's armor at the first level and 40% at the top level, using the vanilla armor formula. The hit that set it off is never the one it lands on, and it works with any weapon or a bare hand.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `armorPierceAtFirstLevel` | `0.2` | Share of the target's armor the next hit ignores at the first level. |
| `armorPierceAtTopLevel` | `0.4` | Share of the target's armor the next hit ignores at the top level. |
| `windowMillis` | `5000` | How long the edge waits for a hit, in milliseconds. |

### Crafting Work Strike (`block-crafting-strike-work`)

The pickaxe, axe, shovel or hoe in your main hand mines as if it had one more level of Efficiency for 20 seconds at the first level and 40 at the top level. It is a timed bonus on you, never written to the item. On versions without the mining efficiency attribute (before 1.21) it is a 25% break speed bonus instead. With an empty hand or a sword it does nothing.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillisAtFirstLevel` | `20000` | How long the extra Efficiency level lasts at the first level, in milliseconds. |
| `durationMillisAtTopLevel` | `40000` | How long the extra Efficiency level lasts at the top level, in milliseconds. |
| `breakSpeedFallback` | `0.25` | Break speed added where the mining efficiency attribute does not exist, as a share. |

### Crafting Boon (`block-crafting-boon`)

The item in your main hand repairs 6 durability at the first level and 12 at the top level. With an empty main hand, your most damaged armor piece repairs instead. In a Barter whose Fuel is Swords, Axes or Pickaxes durability, which has just worn the item in your hand, every armor piece you wear repairs by that amount instead.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durabilityAtFirstLevel` | `6` | Durability repaired at the first level. |
| `durabilityAtTopLevel` | `12` | Durability repaired at the top level. |

### Crafting Fuel (`block-crafting-fuel`)

1 iron nugget from anywhere in your inventory.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `amount` | `1` | Iron nuggets taken per use. |

### Crafting State (`block-crafting-state`)

Holds for 10 seconds after you craft anything.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `10000` | How long after a craft the State holds, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Crafting](/adapt/17-skill-crafting).
