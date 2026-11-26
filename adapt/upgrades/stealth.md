---
title: "Upgrades - Stealth"
description: "Stealth upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you [mutate](/adapt/35-mutations) Stealth, and they replace the original [Stealth](/adapt/29-skill-stealth) adaptations they fuse. Every Stealth mutation keeps base Stealth concealment at its top level for free, and Umbral Form builds on it. Unseen follows the Stealth detection rules: you are sneaking and the creature is not looking at you, or you are invisible, covered by an active decoy, or inside a smoke cloud.

## Upgrades

### Umbral Form (`upgraded-stealth-umbral-form`)

3 levels · 13, 13 and 16 knowledge · Fuses Shadowmeld, Ghost's Armor and Sneak Speed

While you sneak and no living creature within 16 blocks can see you, you turn invisible and sneak at full walking speed. The check runs every 250 ms, and each unseen check also adds 1, 1.5 and 2 armor points to a layer that holds up to 8, 12 and 16 points at levels 1, 2 and 3. Standing up, being seen, attacking or taking damage ends the invisibility and speed. The armor layer stays after that and builds again on your next unseen sneak. The next damage you take that armor can reduce breaks the whole layer.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `watchRadius` | `16` | Radius in blocks checked for anything that could see you. |
| `maxArmorBase` | `4` | Largest armor layer in armor points before level scaling. |
| `maxArmorPerLevel` | `4` | Armor points added to the layer cap per level. |
| `armorPerPulseBase` | `0.5` | Armor built per unseen check before level scaling. |
| `armorPerPulsePerLevel` | `0.5` | Armor built per check added per level. |

### Death Mark (`upgraded-stealth-death-mark`)

3 levels · 13, 13 and 16 knowledge · Fuses Assassinate and Cutpurse

A melee hit on a mob that cannot see you kills it outright when its maximum health is 45, 60 or 75 or less at levels 1, 2 and 3. The killing blow ignores armor and every other reduction, and outright kills have a cooldown of 16, 12 and 8 seconds. Players, bosses and wardens are never killed or robbed.

An unseen hit on any other mob, or on an eligible mob while the kill is on cooldown, steals up to 1, 2 and 3 stacks from a fresh roll of its loot instead. Each mob can be robbed once, and spawner, bred or otherwise farmed mobs cannot be robbed at all. Stolen items go to your inventory, and what does not fit drops at the mob.

After a Shadow Step from Phantom Decoy, your first hit within 2 seconds on the creature you stepped behind counts as unseen, even if it turned to face you. Executions of farmed mobs still kill but pay no XP.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `healthCapBase` | `30` | Highest maximum health a mob can have to die outright, before level scaling. |
| `healthCapPerLevel` | `15` | Health cap added per level. |
| `cooldownMillisBase` | `20000` | Milliseconds between outright kills before level scaling. |
| `cooldownMillisPerLevel` | `4000` | Milliseconds of cooldown removed per level. |
| `minimumCooldownMillis` | `6000` | Shortest time in milliseconds between outright kills. |
| `lootStacksBase` | `0` | Loot stacks taken from a robbed mob, before the level is added. |
| `lootQuality` | `2` | Loot luck used when rolling stolen loot. Higher values favor rarer drops. |
| `xpOnExecution` | `45` | Skill XP for each outright kill of a natural mob. |
| `xpOnSteal` | `15` | Skill XP for each robbed natural mob. |

### Phantom Decoy (`upgraded-stealth-phantom-decoy`)

3 levels · 13, 13 and 16 knowledge · Fuses Shadow Decoy, Decoy Swap and Smoke Pellet

Both abilities spend a Smoke Pellet. Craft 4 from a gunpowder and an ink sac; the recipe unlocks at level 1. A pellet is a firework star that does nothing for anyone without this upgrade.

Press sneak twice within 350 ms with a pellet anywhere in your inventory to leave a decoy copy of yourself that lasts 6, 8 and 10 seconds at levels 1, 2 and 3. Mobs within 12 blocks turn on the decoy, and you stay invisible for its life. A new decoy replaces the old one, and the cooldown between decoys is 16, 12 and 8 seconds. Without a pellet nothing happens.

While the decoy stands, press the swap-hands key to trade places with it if it is within 48 blocks. The key does not swap your hands then, and swaps are at least 1 second apart. Swaps pay no XP.

Shadow Step: right-click with a pellet in your main hand while sneaking unseen, looking at a creature within 8, 12 or 16 blocks, or right-click the creature itself. You vanish in a smoke cloud with a radius of 3.25, 4 and 4.75 blocks and land just behind its back, facing the way it faces. The cloud blinds the living creatures inside and conceals players inside for 2 seconds, and mobs within 64 blocks cannot take a concealed player as a target. Your first hit on that creature within 2 seconds counts as an unseen Death Mark strike; bosses and wardens are still never executed. The step needs a clear line of sight to the creature and room to stand on solid ground behind it, never lands in a claim you cannot enter, and never targets players or decoys. A refused step spends no pellet, and a step whose teleport fails gives the pellet back. Steps are 20, 15 and 10 seconds apart.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `decoyTicksBase` | `80` | Decoy lifetime in ticks before level scaling. |
| `decoyTicksPerLevel` | `40` | Decoy lifetime in ticks added per level. |
| `aggroRadius` | `12` | Radius in blocks the decoy pulls mobs from. |
| `smokeRadiusBase` | `2.5` | Smoke cloud radius in blocks before level scaling. |
| `smokeRadiusPerLevel` | `0.75` | Smoke cloud radius in blocks added per level. |
| `cooldownMillisBase` | `20000` | Milliseconds between decoys before level scaling. |
| `cooldownMillisPerLevel` | `4000` | Milliseconds of cooldown removed per level. |
| `minimumCooldownMillis` | `6000` | Shortest time in milliseconds between decoys. |
| `swapRange` | `48` | Farthest in blocks the decoy can be for a swap. |
| `swapCooldownMillis` | `1000` | Milliseconds between two swaps. |
| `stepRangeBase` | `4` | Shadow Step range in blocks before level scaling. |
| `stepRangePerLevel` | `4` | Shadow Step range in blocks added per level. |
| `stepCooldownMillisBase` | `25000` | Milliseconds between Shadow Steps before level scaling. |
| `stepCooldownMillisPerLevel` | `5000` | Milliseconds of step cooldown removed per level. |
| `minimumStepCooldownMillis` | `5000` | Shortest time in milliseconds between Shadow Steps. |
| `stepBehindDistance` | `0.8` | Gap in blocks kept behind the target's back on landing, plus half its width. |
| `stepSmokePulses` | `4` | Half-second smoke pulses left where you vanish. |
| `openingWindowMillis` | `2000` | Milliseconds after a step in which the first hit on the target counts as unseen. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Stealth](/adapt/29-skill-stealth).
