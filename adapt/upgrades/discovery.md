---
title: "Upgrades - Discovery"
description: "Discovery upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Discovery (see [Mutations](/adapt/35-mutations)), and they replace the [Discovery](/adapt/18-skill-discovery) adaptations they fuse.

## Upgrades

### Omniscience (`upgraded-discovery-omniscience`)

3 levels · 15, 14 and 18 knowledge · Fuses Insight, Keen Eye and Sixth Sense

One action bar line, refreshed every half second, shows what is around you. Each part appears only when it has something to show.

- **Creature:** the creature you look at within 18, 24 or 30 blocks at levels 1, 2 and 3, with Insight's readout. Level 1 shows health, armor, attack and owner; level 2 adds effects and movement; level 3 adds defenses, detection range and nearby creatures. Players you cannot see are skipped.
- **Chests and spawners:** how many chests, trapped chests, spawners and trial spawners within the same range you have line of sight to, counting up to 8. Each one you can see also glows for you, as Keen Eye's outlines do. Containers behind walls never count or glow.
- **Structure:** the nearest structure of the types Sixth Sense detects, with its compass direction and distance. The search reaches about 231, 365 or 500 blocks at levels 1, 2 and 3 and runs every 4 seconds.
- **Pins:** every Atlas entry you pinned in this world, with its direction and distance, and a short direction line only you see.

#### Explorer's Atlas (`tool-discovery-explorers-atlas`)

Craft it from a book, an empty map and a compass (shapeless). Right-click it to open your Atlas. For anyone without Omniscience it is an inert book.

- **Finds:** every 1.5 seconds the Atlas adds the biome you stand in and any structure whose bounds you stand in. Opening a loot chest inside a structure adds it too and marks it looted; the list shows each structure as looted or not. It keeps up to 256 structures and drops the oldest unpinned one past that.
- **Cover:** the top of the Atlas shows the same readout as your action bar, with your biome, structure and pin counts.
- **Pins:** left-click an entry to pin or unpin it. You can pin 1, 3 or 5 entries at levels 1, 2 and 3.
- **Waypoints:** click New waypoint and type a name in chat; the waypoint is set where you stand when you answer. You keep 5, 10 or 20 waypoints at levels 1, 2 and 3. Shift-right-click a waypoint to delete it. Waypoints and the whole Atlas are stored with you, not on the item, so nobody else sees them.
- **Search (level 3):** left-click Search to find the nearest structure of the chosen type within 2000 blocks that is not in your Atlas yet; right-click it to change the type. A search costs 1 plain paper (never a named, marked or tool paper) and 3 hunger, paid when it starts, and has a 60 second cooldown. It reads only chunks that were already generated, so it never loads or generates terrain, and it runs in the background. The find appears at the top of the Atlas and on your readout until you reach it.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `readoutRangeBase` | `12` | Creature, chest and spawner range before level scaling, in blocks. |
| `readoutRangePerLevel` | `6` | Creature, chest and spawner range added per level, in blocks. |
| `viewConeCos` | `-1` | Cosine of the view cone for counting chests and spawners; -1 counts every direction. |
| `outlineTicks` | `16` | Ticks a chest or spawner you can see stays outlined after each readout. |
| `structureRangeBase` | `96` | Structure search range at the bottom of the level range, in blocks. |
| `structureRangeFactor` | `404` | Structure search range gained across the levels, in blocks. |
| `maxStructureRange` | `500` | Largest structure search range, in blocks; clamped to 16-500. |
| `readoutIntervalMillis` | `500` | Time between readout refreshes, in milliseconds. |
| `structurePulseMillis` | `4000` | Time between structure searches, in milliseconds. |
| `recordIntervalMillis` | `1500` | Time between Atlas checks of the biome and structures you stand in, in milliseconds. |
| `maxStructures` | `256` | Most structures one Atlas keeps; past it the oldest unpinned one is dropped. |
| `pinsAtFirstLevel` | `1` | Pins at level 1. |
| `pinsPerLevel` | `2` | Pins added per level after the first. |
| `waypointsAtFirstLevel` | `5` | Waypoints at level 1; doubles each level. |
| `searchLevel` | `3` | Level that unlocks the unfound-structure search. |
| `searchRange` | `2000` | Unfound-structure search radius, in blocks. Only chunks that were already generated are read. |
| `searchCooldownMillis` | `60000` | Cooldown between unfound-structure searches, in milliseconds. |
| `searchHunger` | `3` | Hunger each unfound-structure search costs, besides one paper. |

### Unity Prime (`upgraded-discovery-unity-prime`)

3 levels · 13, 13 and 16 knowledge · Fuses Experimental Unity and Polymath

Each vanilla XP pickup also feeds your lowest skills, ordered by level and then by XP. Your lowest 1, 2 or 3 skills at levels 1, 2 and 3 each get 4, 8 or 12 skill XP per vanilla XP point, counting at most 5 points per pickup.

Every skill at level 1 or higher also raises all your skill XP gains by 3.3%, 4.7% or 6% at levels 1, 2 and 3. The total bonus is capped at 100% and refreshes every 2 seconds.

At every level it also runs World Armor at level 3 and Better Mending at level 6, with their own rules and settings: armor from the hardness of the blocks around you, refreshed every 2 seconds, and sneak-left-click with a damaged Mending item to spend vanilla XP on it. Better Mending's XP reserve and repair limit preferences are on this upgrade. Every mutated Discovery player keeps both originals at level 1; while Unity Prime is active they stand down so the effects never stack.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `xpPerOrb` | `12` | Skill XP per vanilla XP point at the top level; lower levels get a share of it. |
| `maxOrbsPerGain` | `5` | Most vanilla XP points counted from one pickup. |
| `lowestSkillsBase` | `0` | Lowest skills fed by each pickup, before adding the level. |
| `levelledSkillThreshold` | `1` | Skill level a skill must reach to count toward the XP-gain bonus. |
| `perSkillBonusBase` | `0.02` | XP-gain bonus per counted skill before level scaling. |
| `perSkillBonusFactor` | `0.04` | XP-gain bonus per counted skill gained across the levels. |
| `maxTotalBonus` | `1.0` | Largest combined XP-gain bonus. |

### Explorer's Luck (`upgraded-discovery-explorers-luck`)

3 levels · 13, 13 and 16 knowledge · Fuses Trailblazer, Field Notes and Relic Appraiser

Three kinds of discovery pay Discovery XP:

- **First visits:** standing in a biome you have never visited pays about 93, 147 or 200 XP at levels 1, 2 and 3. The first visit to a structure type pays 2.5 times that. Biomes and structure types are checked every 1.2 seconds, and places already recorded by Trailblazer do not pay again.
- **First kills:** your first kill of a creature species pays 200, 280 or 360 XP. Every kill of a species, first or not, banks 0.25 extra damage against that species, up to 2, 3 or 4 damage. The banked damage is added to your melee and projectile hits on that species. Players, golem kills, spawner, egg, bred and other farmed mobs, minions and your own pets do not count, and species already recorded by Field Notes do not pay the first-kill XP again.
- **Relics:** sneak-right-click with a music disc, pottery sherd, armor trim template, mob head or skull in your main hand to appraise it. Each item can be appraised once, by this upgrade or by Relic Appraiser. It pays 120, 180 or 240 XP times the item's rarity weight, and a random other skill gets 30 to 90 XP.

Every discovery payout is multiplied by 1.5, 1.75 or 2 at levels 1, 2 and 3, and then by your bank. Each discovery adds 1% to the bank, which is permanent and holds up to 50%.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `payoutBase` | `1.25` | Payout multiplier on every discovery before level scaling. |
| `payoutPerLevel` | `0.25` | Payout multiplier added per level. |
| `bankPerDiscovery` | `0.01` | Permanent payout bonus each discovery banks. |
| `maxBank` | `0.5` | Largest permanent payout bonus the bank holds. |
| `visitXpBase` | `40` | First-visit XP before level scaling. |
| `visitXpFactor` | `160` | First-visit XP gained across the levels. |
| `structureXpMultiplier` | `2.5` | Multiplier for a first visit to a structure type instead of a biome. |
| `killXpBase` | `120` | First-kill XP before level scaling. |
| `killXpFactor` | `240` | First-kill XP gained across the levels. |
| `bonusPerKill` | `0.25` | Damage banked against a species per kill, up to its cap. |
| `speciesCapBase` | `1.0` | Banked damage cap per species before level scaling. |
| `speciesCapFactor` | `3.0` | Banked damage cap per species gained across the levels. |
| `relicXpBase` | `60` | Relic appraisal XP before level scaling. |
| `relicXpFactor` | `180` | Relic appraisal XP gained across the levels. |
| `randomSkillXpMin` | `30` | Least XP an appraisal gives a random other skill; clamped to 0-10,000. Set both bounds to 0 to turn it off. |
| `randomSkillXpMax` | `90` | Most XP an appraisal gives a random other skill; clamped to 0-10,000. |
| `discRarityWeight` | `1.5` | Rarity multiplier for music discs. |
| `headRarityWeight` | `1.4` | Rarity multiplier for heads and skulls. |
| `trimRarityWeight` | `1.25` | Rarity multiplier for armor trim templates. |
| `sherdRarityWeight` | `1.0` | Rarity multiplier for pottery sherds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Discovery](/adapt/18-skill-discovery).
