---
title: "Mutation Blocks - Hunter"
description: "What Hunter brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Hunter brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Hunter Trigger (`block-hunter-trigger`)

Sets off when you kill a mob. Killing a player does not count. It counts as a fight action. Because the killed mob is dead, the fight Strike lands on the nearest other hostile mob within 6 blocks; with none there, nothing happens. A kill of a mob from a spawner, spawn egg, bucket or breeding, a minion, a grave mob or one of your own pets still sets it off, but pieces that hand out drops, healing or other rewards do nothing for it.

No block-specific config keys.

### Hunter Fight Strike (`block-hunter-strike-fight`)

Marks the target for 6 seconds. While the mark lasts, your hits on it, melee or projectile, deal 15% more damage at the first level of the mutated adaptation and 25% more at its top level. Hits from anyone else are unchanged. A new mark on the same target replaces the old one. It never marks a protected friendly target, and it follows the PvP and PvE rules of the spot where the target stands.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `6000` | How long the mark lasts, in milliseconds. |
| `bonusAtFirstLevel` | `0.15` | Extra damage from you at the first level, as a fraction of the hit. |
| `bonusAtTopLevel` | `0.25` | Extra damage from you at the top level, as a fraction of the hit. |

### Hunter Work Strike (`block-hunter-strike-work`)

Animals and mobs within 16 blocks of you glow red for 5 seconds, seen by you alone. Players and golems are left out. If the server cannot show a glow to a single player, this piece does nothing.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radius` | `16` | Reach around you in blocks. |
| `durationMillis` | `5000` | How long the glow lasts, in milliseconds. |

### Hunter Boon (`block-hunter-boon`)

Speed for 5 seconds: Speed I at the first level of the mutated adaptation and Speed II at its top level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationMillis` | `5000` | How long the speed lasts, in milliseconds. |
| `amplifierAtFirstLevel` | `0` | Speed amplifier at the first level; 0 is Speed I. |
| `amplifierAtTopLevel` | `1` | Speed amplifier at the top level. |

### Hunter Fuel (`block-hunter-fuel`)

Costs 2 points of hunger, one drumstick on the food bar. You cannot pay with less than that.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `hunger` | `2` | Hunger points taken per use. |

### Hunter State (`block-hunter-state`)

Holds while you are alive and at or under half your maximum health.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `healthFraction` | `0.5` | Share of maximum health at or under which the State holds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Hunter](/adapt/22-skill-hunter).
