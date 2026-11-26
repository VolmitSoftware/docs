---
title: "Mutation Blocks - Brewing"
description: "What Brewing brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Brewing brings to each [mutation](/adapt/35-mutations) it joins. The Mutations page lists which mutated adaptations use which piece.

Several pieces draw a quarter-bottle dose from a potion you carry. The potion is the active one of an Alchemist's Bandolier you carry while you hold Master Distiller (see [Brewing upgrades](/adapt/upgrades/brewing)), otherwise the one in your off hand. When your off hand holds a shield or a clock, it is the first brewed potion in your hotbar instead. Each bottle gives four doses; the last one leaves an empty glass bottle for a drinkable potion and nothing for a splash or lingering potion. The first dose opens the bottle: from then on it has no effects when drunk, thrown or brewed, and only gives its remaining doses. When the opened bottle is part of a stack, the rest of the stack keeps its potion.

## Blocks

### Brewing Trigger (`block-brewing-trigger`)

Drink a brewed potion, or have a splash or lingering potion you threw break. Water, mundane, thick and awkward potions do not count unless they carry extra effects. This is a work Trigger. Using a potion is never treated as farmed.

No block-specific config keys.

### Brewing Fight Strike (`block-brewing-strike-fight`)

One dose of your carried potion splashes on the target with its full strength and duration. It respects PvP and PvE protection and never hits a protected friendly target.

No block-specific config keys.

### Brewing Work Strike (`block-brewing-strike-work`)

One dose of your carried potion applies to you at half its duration. Instant effects such as Instant Health apply in full.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationFraction` | `0.5` | Fraction of the potion's duration the effects last. |

### Brewing Boon (`block-brewing-boon`)

You gain one helpful effect at level I, picked at random from the list. It lasts 6 seconds at the first level and 10 seconds at the top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `effects` | `speed, haste, strength, jump_boost, regeneration, resistance, fire_resistance, water_breathing, night_vision, absorption` | Effects the Boon picks from, as effect ids (each with the `minecraft:` prefix). |
| `durationMillisAtFirstLevel` | `6000` | How long the effect lasts at the first level, in milliseconds. |
| `durationMillisAtTopLevel` | `10000` | How long the effect lasts at the top level, in milliseconds. |

### Brewing Fuel (`block-brewing-fuel`)

One dose of your carried potion.

No block-specific config keys.

### Brewing State (`block-brewing-state`)

Holds while any effect of the last brewed potion you drank is still on you.

No block-specific config keys.

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Brewing](/adapt/15-skill-brewing).
