---
title: "Upgrades - Nether"
description: "Nether upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Nether (see [Mutations](/adapt/35-mutations)), and they replace the [Nether](/adapt/24-skill-nether) adaptations they fuse.

## Upgrades

### Hellwalker (`upgraded-nether-hellwalker`)

3 levels · 13, 13 and 16 knowledge · Fuses Lava Walker, Fire Resistance, Ashwalker and Soul Strider

- **Lava strides:** in a Nether world, standing on lava or in it up to your waist pushes you the way you face, ignoring whether you look up or down, with strength 0.6, 0.75 or 0.9 at levels 1, 2 and 3, once every 400, 300 or 200 ms. Each stride costs 1 food point and grants Fire Resistance for 5 seconds. Strides stop when your food is empty, and while you fly, glide or ride. The lava stays liquid: strides carry you across it, so stop striding and you sink.
- **Fire:** fire and burning damage is cancelled, and magma block and campfire damage is negated and puts you out.
- **Lava swimming:** in any world, while you are in lava (in the Nether: with your head under), lava damage is cancelled, you get Fire Resistance and Night Vision so you see clearly, and moving pushes you along at 60%, 80% or 100% of water swim speed at levels 1, 2 and 3. Steep looks up or down swim you up or down. Every 10 seconds in lava costs 1 food point; with no food left, lava burns you as usual. The Night Vision is taken back when you leave the lava; Night Vision from potions or other sources is never taken.
- **Floating items:** from level 2, an item you drop within 2 blocks of lava cannot burn for 5 seconds and floats while it sits in lava. Other players' items and your mount are not covered.
- **Soul ground:** walking on soul sand or soul soil does not slow you, and you move 10%, 20% or 30% faster there. This part needs a server version with the movement efficiency attribute.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `strideBase` | `0.45` | Lava stride push before level scaling. |
| `stridePerLevel` | `0.15` | Lava stride push added per level. |
| `strideCooldownMillisBase` | `500` | Time between two lava strides before level scaling, in milliseconds. |
| `strideCooldownMillisPerLevel` | `100` | Time between strides removed per level, in milliseconds. |
| `minimumStrideCooldownMillis` | `150` | Shortest time between two lava strides at any level, in milliseconds. |
| `hungerPerStride` | `1` | Food points each lava stride costs. |
| `fireResistTicks` | `100` | Fire Resistance granted by each lava stride, in ticks. |
| `soulSpeedBonusPerLevel` | `0.10` | Movement speed bonus on soul sand and soul soil per level, as a fraction. |
| `waterSwimSpeed` | `0.2` | Water swim speed that lava swimming is measured against, in blocks per tick. |
| `swimShareBase` | `0.4` | Share of water swim speed in lava before level scaling. |
| `swimSharePerLevel` | `0.2` | Share of water swim speed added per level. |
| `lavaMillisPerHunger` | `10000` | Time in lava that costs one food point, in milliseconds. |
| `itemFloatLevel` | `2` | Level from which items you drop near lava float instead of burning. |
| `itemFloatTicks` | `100` | How long a dropped item floats in lava before it can burn, in ticks. |

### Wither King (`upgraded-nether-wither-king`)

3 levels · 13, 13 and 16 knowledge · Fuses Wither Skull Throw, Wither Resistance and Wither Harvest

- **Skull throw:** right-click with a wither skeleton skull in your main hand to throw a wither skull. Each throw uses one skull, pays 60 skill XP and starts a cooldown of 9, 6 or 3 seconds at levels 1, 2 and 3.
- **Wither resistance:** each tick of Wither damage has a 60%, 80% or 100% chance to be cancelled, plus 5% for each piece of netherite armor you wear.
- **Harvest:** wither skeletons you kill drop 3, 4 or 5 extra bones and 2, 3 or 4 extra coal, and have a 14%, 19% or 25% chance to drop a skull when they did not already drop one. Each harvest pays 15 skill XP. Golem kills and spawned or otherwise farmed skeletons do not count.

Personal controls: Require sneak to throw (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `skullCooldownSecondsBase` | `12` | Skull throw cooldown before level scaling, in seconds. |
| `skullCooldownSecondsPerLevel` | `3` | Skull throw cooldown removed per level, in seconds; never below 1 second. |
| `xpPerSkull` | `60` | Skill XP for each skull thrown. |
| `ignorePassiveMobs` | `false` | Spares passive and neutral mobs from skull blasts. |
| `shrugChanceBase` | `40` | Percent chance to cancel a Wither tick before level scaling. |
| `shrugChancePerLevel` | `20` | Percent chance added per level. |
| `shrugChancePerNetheritePiece` | `5` | Percent chance added per netherite armor piece worn. |
| `bonusBonesBase` | `2` | Bonus bones from a wither skeleton before level scaling. |
| `bonusBonesFactor` | `3` | Bonus bones added across the levels. |
| `bonusCoalBase` | `1` | Bonus coal from a wither skeleton before level scaling. |
| `bonusCoalFactor` | `3` | Bonus coal added across the levels. |
| `skullChanceBase` | `0.08` | Skull drop chance before level scaling. |
| `skullChanceFactor` | `0.17` | Skull drop chance added across the levels. |
| `maxSkullChance` | `0.25` | Highest skull drop chance at any level. |
| `xpPerHarvest` | `15` | Skill XP for each wither skeleton harvested. |

### Brimstone (`upgraded-nether-brimstone`)

3 levels · 13, 13 and 16 knowledge · Fuses Magma Skin, Blaze Leech and Ghast Ward

- **Ignite:** a creature that hits you in melee is set on fire for 4.5, 6 or 7.5 seconds at levels 1, 2 and 3, whether or not you are burning. Each ignite pays 5 skill XP when the attacker is a natural mob or a player.
- **Fire feeding:** taking fire, burning, lava or magma block damage restores 2, 3 or 4 food points and 1 saturation and gives Regeneration I for 3, 4 or 5 seconds, or Regeneration II at level 3. Feeding happens at most once every 2, 1.6 or 1.2 seconds.
- **Blasts:** explosion damage and ghast fireball hits drop by 60%, 70% or 80%. After a fireball hit you burn for at most 1 second.
- **Piglin trades:** when a piglin within 18 blocks barters, it gives one of its items again (half as many again, up to a stack) with a 55% chance, and adds a rare bonus item (an ender pearl, 2 obsidian, 4 string, 6 iron nuggets or 2 spectral arrows) with a 23% chance, at every level. Piglin Broker does not roll again on top. Piglins from spawn eggs or other farmed sources get no bonus. No skill XP is paid.
- **Piglin truce:** piglins do not attack you for lacking gold armor. For 30 seconds after you hit a piglin, open a chest, barrel, ender chest or shulker box, or break gold blocks, gold ore or gilded blackstone, they may attack as usual. Piglin brutes are not affected.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `igniteTicksBase` | `60` | Burn time set on a melee attacker before level scaling, in ticks. |
| `igniteTicksPerLevel` | `30` | Burn time added per level, in ticks. |
| `xpPerIgnite` | `5` | Skill XP for each natural mob or player attacker ignited. |
| `foodRestoreBase` | `1` | Food restored by fire before level scaling. |
| `foodRestorePerLevel` | `1` | Food restored by fire added per level. |
| `saturationRestore` | `1.0` | Saturation restored by fire. |
| `regenTicksBase` | `40` | Regeneration from fire before level scaling, in ticks. |
| `regenTicksPerLevel` | `20` | Regeneration added per level, in ticks. |
| `regenAmplifierAtMaxLevel` | `1` | Regeneration amplifier at the top level; lower levels use amplifier 0. |
| `feedCooldownMillisBase` | `2400` | Time between two fire feedings before level scaling, in milliseconds. |
| `feedCooldownMillisPerLevel` | `400` | Time between fire feedings removed per level, in milliseconds. |
| `minimumFeedCooldownMillis` | `500` | Shortest time between two fire feedings at any level, in milliseconds. |
| `blastReductionBase` | `0.5` | Damage removed from explosions and ghast fireballs before level scaling. |
| `blastReductionPerLevel` | `0.1` | Blast damage reduction added per level. |
| `maxBlastReduction` | `0.85` | Highest blast damage reduction at any level. |
| `maxFireTicksAfterFireball` | `20` | Longest burn left after a ghast fireball hit, in ticks. |
| `brokerRange` | `18` | Distance from a bartering piglin within which you broker its trade, in blocks. |
| `barterExtraRollChance` | `0.55` | Chance a barter gives one of its items again. |
| `barterRareBonusChance` | `0.23` | Chance a barter adds a rare bonus item. |
| `barterAmountMultiplier` | `1.5` | Size of an extra barter roll compared to the item it repeats. |
| `provokedMillis` | `30000` | Time piglins may attack you after you hit one, open a container they guard or break their gold, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Nether](/adapt/24-skill-nether).
