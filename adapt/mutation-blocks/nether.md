---
title: "Mutation Blocks - Nether"
description: "What Nether brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Nether brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Nether Trigger (`block-nether-trigger`)

Sets off when you take fire, burning, lava or magma block damage. It counts as either a fight or a work action: with a hostile mob within 6 blocks the fight Strike lands on the nearest one, otherwise the work Strike runs where you stand. A burn counts as farmed when a fire source within 2 blocks of you (fire, soul fire, lava, magma block or campfire) was placed by a player, or a fire burns on a placed block; burning after such a contact stays farmed for 10 seconds. A farmed burn runs no Strike that pays out.

No block-specific config keys.

### Nether Fight Strike (`block-nether-strike-fight`)

Sets the target on fire for 4 seconds at the first level of the mutated adaptation and 6 seconds at its top level. A target already burning longer keeps its longer fire. It never burns a protected friendly target, and it follows the PvP and PvE rules of the spot where the target stands.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `burnMillisAtFirstLevel` | `4000` | How long the target burns at the first level, in milliseconds. |
| `burnMillisAtTopLevel` | `6000` | How long the target burns at the top level, in milliseconds. |

### Nether Work Strike (`block-nether-strike-work`)

Primes your next 3 blocks at the first level of the mutated adaptation, or 5 at its top level, to drop smelted. Raw iron, gold and copper become ingots, silk-touched ores become their ingots, ancient debris becomes netherite scrap, logs and wood become charcoal, sand becomes glass, and other drops change as a furnace would change them (cobblestone to stone, clay to terracotta, kelp to dried kelp, cactus to green dye, and so on). A block uses a charge only when one of its drops was smelted. Player-placed blocks are left alone and use no charge. Using the piece again while charges remain sets them to the larger of the two counts; charges do not add up. Unused charges run out after 30 seconds. This piece does nothing when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `blocksAtFirstLevel` | `3` | Blocks smelted per use at the first level. |
| `blocksAtTopLevel` | `5` | Blocks smelted per use at the top level. |
| `primeMillis` | `30000` | How long unused smelting charges last, in milliseconds. |

### Nether Boon (`block-nether-boon`)

Fire Resistance for 6 seconds at the first level of the mutated adaptation and 10 seconds at its top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillisAtFirstLevel` | `6000` | How long Fire Resistance lasts at the first level, in milliseconds. |
| `durationMillisAtTopLevel` | `10000` | How long Fire Resistance lasts at the top level, in milliseconds. |

### Nether Fuel (`block-nether-fuel`)

Costs 1 blaze powder, taken from anywhere in your inventory.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `amount` | `1` | Blaze powder taken per use. |

### Nether State (`block-nether-state`)

Holds while you are in a Nether world or on fire.

No block-specific config keys.

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Nether](/adapt/24-skill-nether).
