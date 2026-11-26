---
title: "Mutation Blocks - Taming"
description: "What Taming brings to every mutation it joins"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These six pieces are what Taming brings to every [mutation](/adapt/35-mutations) it joins. The Mutations page shows which mutated adaptations use which piece.

## Blocks

### Taming Trigger (`block-taming-trigger`)

Sets off when one of your tamed pets damages a living thing other than you while you are online. Any tamed pet counts, however you got it. It counts as a fight action, and the fight Strike lands on the creature your pet hit. A pet's hit on a mob from a spawner, spawn egg, bucket or breeding, a minion, a grave mob or another of your pets still sets it off, but pieces that hand out drops, healing or other rewards do nothing for it.

No block-specific config keys.

### Taming Fight Strike (`block-taming-strike-fight`)

Your nearest wolf, cat, llama or trader llama within 16 blocks stands up if it was sitting, leaps at the target's chest and takes it as its target. The leap speed is 0.9 at the first level of the mutated adaptation and 1.3 at its top level. It does nothing without such a pet nearby. It never sends a pet at your own pets or at a protected friendly target, and it follows the PvP and PvE rules of the spot where the target stands.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `petRadius` | `16` | How far from you a pet can be to answer, in blocks. |
| `leapStrengthAtFirstLevel` | `0.9` | Leap speed at the first level. |
| `leapStrengthAtTopLevel` | `1.3` | Leap speed at the top level. |

### Taming Work Strike (`block-taming-strike-work`)

Each of your pets within 8 blocks heals 1 heart at the first level of the mutated adaptation and 2 hearts at its top level, and moves 20% faster for 5 seconds. It does nothing without a pet nearby, or when the action that set it off was farmed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radius` | `8` | Radius around you in which pets are tended, in blocks. |
| `healingAtFirstLevel` | `2` | Health each pet regains at the first level (2 health is 1 heart). |
| `healingAtTopLevel` | `4` | Health each pet regains at the top level. |
| `speedMillis` | `5000` | How long pets keep the speed bonus, in milliseconds. |

### Taming Boon (`block-taming-boon`)

Heals you for each of your pets within 8 blocks, counting at most 3 pets: 2 hearts per pet at the first level of the mutated adaptation and 3 hearts per pet at its top level, up to 3 hearts per grant at the first level and 4 hearts at the top level. It does nothing with no pet nearby or at full health.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radius` | `8` | Radius around you in which pets count, in blocks. |
| `maxPets` | `3` | Most pets that count toward one heal. |
| `healingPerPetAtFirstLevel` | `4` | Health restored per pet at the first level (2 health is 1 heart). |
| `healingPerPetAtTopLevel` | `6` | Health restored per pet at the top level. |
| `maxHealingAtFirstLevel` | `6` | Most health one grant restores at the first level, however many pets are near. |
| `maxHealingAtTopLevel` | `8` | Most health one grant restores at the top level, however many pets are near. |

### Taming Fuel (`block-taming-fuel`)

Costs 1 bone or 1 piece of meat, taken from anywhere in your inventory. Raw or cooked beef, porkchop, mutton, chicken and rabbit count, and so does rotten flesh. When the cost is raised above 1, every piece paid is of one kind.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `amount` | `1` | Bones or pieces of meat taken per use, all of one kind. |

### Taming State (`block-taming-state`)

Holds for 5 seconds after one of your pets hits a living thing, or is hit by anything other than you.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillis` | `5000` | How long after a pet's last hit given or taken it still counts as fighting, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Taming](/adapt/31-skill-taming).
