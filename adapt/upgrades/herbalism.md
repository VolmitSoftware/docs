---
title: "Upgrades - Herbalism"
description: "Herbalism upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Herbalism (see [Mutations](/adapt/35-mutations)), and they replace the original adaptations of [Herbalism](/adapt/21-skill-herbalism).

## Upgrades

### Wildgrowth (`upgraded-herbalism-wildgrowth`)

3 levels · 13, 13 and 16 knowledge · Fuses Growth Aura, Bee Shepherd and Seed Sower

Every 0.85 seconds a growth pulse checks up to 256 random spots around you and ages the growable blocks it finds. The aura reaches 18 blocks at level 1, 22 at level 2 and 26 at level 3. Each grown block advances 1 stage at level 1, 2 stages at level 2 and 3 stages at level 3. By default only the top block of each column grows, so crops under roofs and in caves are skipped. Every grown block costs 0.1 food, and the aura never takes your food under 10. Each bee within the aura adds 15% more checks, counting up to 5 bees. Blocks on the server growth blacklist never grow. Grown blocks count as bone-mealed, so harvesting them is not a natural harvest.

At most once every 2 seconds the pulse also sows seeds from your hotbar onto empty farmland near your feet, or soul sand for nether wart: up to 8 seeds at level 1, 12 at level 2 and 16 at level 3, within 4, 5 or 6 blocks. Wheat, beetroot, melon, pumpkin and torchflower seeds, carrots, potatoes and nether wart can be sown, taken from the first hotbar stack that finds a free spot.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radiusBase` | `14` | Aura radius before the level is added, in blocks. |
| `radiusPerLevel` | `4` | Aura radius added per level, in blocks. |
| `strengthBase` | `0` | Growth stages per grown block before the level is added; fractions round down. |
| `strengthPerLevel` | `1` | Growth stages per grown block added per level. |
| `foodCost` | `0.1` | Food charged for each grown block. |
| `foodFloor` | `10` | Food level the aura never takes you under. |
| `surfaceOnly` | `true` | Grow only the top block of each column, skipping roofed and cave crops. |
| `growthBonusPerBee` | `0.15` | Extra growth checks per nearby bee, as a share of the base checks. |
| `maxBonusBees` | `5` | Most nearby bees that count toward the bonus. |
| `plantRadiusShare` | `0.25` | Sowing radius as a share of the aura radius. |
| `plantedBase` | `4` | Seeds planted per sowing before the level is added. |
| `plantedPerLevel` | `4` | Seeds planted per sowing added per level. |
| `plantIntervalMillis` | `2000` | Time between two sowings, in milliseconds. |

### Harvest Moon (`upgraded-herbalism-harvest-moon`)

3 levels · 15, 14 and 18 knowledge · Fuses Harvest & Replant, Compost Cascade and Herbalist's Luck

Right-clicking a mature crop while holding a hoe harvests every mature crop within 6 blocks at level 1, 8 at level 2 and 10 at level 3. A hoe in the off hand is used first. Each crop is replanted at its first stage when its drops include a seed, which is taken from those drops; otherwise the block is cleared. Each harvested crop has a 10% chance at level 1, 15% at level 2 and 20% at level 3 to drop a potato, carrot, beetroot or apple as well, unless it was grown with bone meal or by another Adapt growth effect.

The hoe loses 1 durability per crop and goes on a 3 second cooldown after each sweep. Each crop that grew on its own pays 1 skill XP on top of the normal harvest XP. Crops grown with bone meal or by another Adapt growth effect pay no skill XP at all, not even the harvest XP. Bonus drops pay no skill XP.

Sneak-right-clicking a composter runs Compost Cascade at level 4, 5 and 6 for Harvest Moon level 1, 2 and 3: it pulls in nearby scraps, harvests and composts mature crops, composts your inventory and returns bone meal, with the chance of a valuable when the composter fills. Scraps from crops grown with bone meal or by another Adapt growth effect, and every loose scrap and inventory item, count toward the fill but never toward a valuable, and the cascade pays no skill XP.

Scarecrow: crafted from a carved pumpkin, two sticks, a hay bale and a leather tunic (pumpkin on top, sticks either side of the hay bale, tunic below). Right-click a block with it to stand it there as a hay bale; you can stand 1 at level 1, 2 at level 2 and 3 at level 3. While you are within 64 blocks and its chunk is loaded, every two seconds it harvests up to 8 mature crops in its square (9 by 9 at level 1, 13 by 13 at level 2, 17 by 17 at level 3, one block above and below it), replants them from their own drops and puts the produce in a chest or barrel touching one of its sides. Each pass checks part of a large square and the next pass carries on from there, so a full sweep takes up to 8 seconds at level 3. It needs that chest, it stops when the chest has no free slot, and it only harvests where you could break and place. Crops grown with bone meal or by another Adapt growth effect are left standing, it never makes anything grow, and it pays no skill XP. Mobs cannot trample farmland in its square while it works. After 2000 harvests it wears out; right-click it with a hay bale to give back 250 harvests per bale. Breaking it gives the Scarecrow back with its wear and no hay bale; fire, explosions and pistons leave it standing. Scarecrows are kept across restarts.

Personal controls: enable switch; `materials` limits the sweep to all plants or one family: wheat, carrot, potato, beetroot, melon, pumpkin, nether wart, flowers, fungi, leaves, berries or kelp.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `fieldRadiusBase` | `4` | Field radius before the level is added, in blocks. |
| `fieldRadiusPerLevel` | `2` | Field radius added per level, in blocks. |
| `fieldBlockBudget` | `8192` | Most blocks one sweep checks. |
| `bonusChanceBase` | `5` | Bonus drop chance per crop before the level is added, in percent. |
| `bonusChancePerLevel` | `5` | Bonus drop chance added per level, in percent. |
| `cooldownTicks` | `60` | Hoe cooldown after a sweep, in ticks. |
| `xpPerCrop` | `1` | Skill XP for each harvested crop. |
| `scarecrowsPerLevel` | `1` | Scarecrows a player may stand per level. |
| `scarecrowHalfBase` | `2` | Distance from a scarecrow to the edge of its square before the level is added, in blocks. |
| `scarecrowHalfPerLevel` | `2` | Distance added to the square per level, in blocks. |
| `scarecrowWearLimit` | `2000` | Harvests a scarecrow makes before it wears out. |
| `scarecrowRepairPerHay` | `250` | Harvests one hay bale gives back to a worn scarecrow. |
| `scarecrowHarvestsPerPass` | `8` | Most crops one scarecrow harvests every two seconds. |
| `scarecrowRange` | `64` | How near you must be for a scarecrow to work, in blocks. |

### Iron Stomach (`upgraded-herbalism-iron-stomach`)

3 levels · 13, 13 and 16 knowledge · Fuses Hungry Shield and Herbalist's Hippo

Your hunger takes part of every hit before your health: 50% at level 1, 65% at level 2 and 80% at level 3, from any damage type. Each point of damage absorbed costs one point of food and saturation, and absorption stops when your food and saturation together would fall below 6. Fire, lava, campfires, magma, poison, wither, drowning and freezing are charged at most once per second, and the hits in between land in full.

Eating a food adds the food it gave a second time, up to a full bar, with the same amount of saturation.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `effectivenessBase` | `0.35` | Share of each hit paid from hunger before the level is added. |
| `effectivenessPerLevel` | `0.15` | Share of each hit paid from hunger added per level. |
| `maxEffectiveness` | `0.9` | Highest share of a hit paid from hunger at any level. |
| `dotChargeIntervalMs` | `1000` | Milliseconds between hunger charges for damage over time such as fire, poison and drowning. |
| `extraMealShare` | `1.0` | Food a meal adds again, as a share of what it gave; 1 doubles every meal. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Herbalism](/adapt/21-skill-herbalism).
