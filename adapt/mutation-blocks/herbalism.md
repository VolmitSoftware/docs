---
title: "Mutation Blocks - Herbalism"
description: "What Herbalism brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Herbalism brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

## Blocks

### Herbalism Trigger (`block-herbalism-trigger`)

Break or pick a fully grown crop. This is a work Trigger, and the work happens at the crop. A crop grown with bone meal or by an Adapt growth effect counts as farmed, and so does placed bamboo or a placed mangrove propagule, which can be placed already fully grown; pieces that pay out give nothing for it.

No block-specific config keys.

### Herbalism Fight Strike (`block-herbalism-strike-fight`)

Vines hold the target in place: its movement stops completely for 2 seconds at the first level and 3 seconds at the top level. It respects PvP and PvE protection and never hits a protected friendly target.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `rootMillisAtFirstLevel` | `2000` | How long the target is rooted at the first level, in milliseconds. |
| `rootMillisAtTopLevel` | `3000` | How long the target is rooted at the top level, in milliseconds. |

### Herbalism Work Strike (`block-herbalism-strike-work`)

Crops around the spot where the work happened grow one stage, within 4 blocks at the first level and 6 blocks at the top level. Saplings in their first growth stage move on to the second. The same permission checks as Growth Aura apply. Grown crops count as bone-mealed, so harvesting them is not a natural harvest. This piece pays out, so it gives nothing when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radiusAtFirstLevel` | `4` | Radius in blocks at the first level. |
| `radiusAtTopLevel` | `6` | Radius in blocks at the top level. |
| `blockBudget` | `2048` | Most blocks one strike checks. |

### Herbalism Boon (`block-herbalism-boon`)

You regain 2 hunger points at the first level and 4 at the top level. Nothing happens when your hunger bar is full. TragOul's Work Strike cannot turn this hunger into health.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `foodAtFirstLevel` | `2` | Hunger points restored at the first level. |
| `foodAtTopLevel` | `4` | Hunger points restored at the top level. |

### Herbalism Fuel (`block-herbalism-fuel`)

3 seeds or crop produce from anywhere in your inventory, in any mix.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `amount` | `3` | Seeds or crops taken per use. |

### Herbalism State (`block-herbalism-state`)

Holds while the block at your feet is a crop, grass, a fern or a flower.

No block-specific config keys.

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Herbalism](/adapt/21-skill-herbalism).
