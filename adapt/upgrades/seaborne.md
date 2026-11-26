---
title: "Upgrades - Seaborne"
description: "Seaborne upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Seaborne (see [Mutations](/adapt/35-mutations)), and they replace the [Seaborne](/adapt/28-skill-seaborne) adaptations they fuse.

## Upgrades

### Leviathan (`upgraded-seaborne-leviathan`)

3 levels · 15, 14 and 18 knowledge · Fuses Organic Oxygen Tank, Dolphin's Grace, Tidal Ward, Brine Skin and Rain-Fed

Leviathan refreshes once a second and combines these effects:

- **Air:** you use less air underwater, saving 20, 40 or 60 of every 75 ticks at levels 1, 2 and 3 (27%, 53% or 80%).
- **Swimming:** in water you gain +0.6, +0.8 or +1.0 water movement efficiency, and while swimming you get Dolphin's Grace for 3, 4 or 5 seconds after each refresh. Neither applies while you wear Depth Strider boots.
- **Wet regeneration:** while you are in water, swimming or with rain falling on you, you have Regeneration I, II or III.
- **Tidal Ward:** you have Tidal Ward at level 3, 4 or 5 without learning it: absorption that builds while you are wet, up to 4, 5 or 6 hearts, pauses after any hit and drains once you dry off. See [Tidal Ward](/adapt/28-skill-seaborne) for the rules.
- **Rain-Fed:** you have Rain-Fed at level 3, 4 or 5: while wet your activity costs no hunger, and 6, 8 or 10 food and saturation points a minute refill what regeneration and abilities spend, with 5, 10 or 15 seconds of grace after drying off.

Air needs a server version with the oxygen bonus attribute, swimming speed needs the water movement efficiency attribute, and Tidal Ward needs the max absorption attribute or Adapt's stand-in for it. On older versions those parts do nothing. Getting wet pays no skill XP.

**Tide Shrine:** Leviathan unlocks the Tide Shrine, crafted from 4 prismarine, 4 sea lanterns and 1 nautilus shell (`PLP / LNL / PLP`). Right-click a block face underwater with it, where the spot and the block above it are both water, to set a shrine there: it places a sea lantern and costs 1 nautilus shell each time. You can have 1 shrine placed at levels 1 and 2 and 2 at level 3, and only where you can build. The shrine reaches 8, 12 or 16 blocks. Inside your own shrine's reach:

- In water you breathe without running out of air (Water Breathing on versions without the oxygen bonus attribute), have Night Vision, and mine at full speed whether you stand or float. Full-speed mining needs the submerged mining speed and block break speed attributes and does nothing on older versions.
- Drowned, guardians and elder guardians stop targeting you, unless you attack them first.
- Coral nearby never dies while you are online.

The effects are yours alone; other players in the water get nothing from your shrine, and it does not harm mobs. Breaking the shrine drops nothing and frees its slot; a shrine removed any other way frees its slot when you place the next one. Explosions and pistons cannot move or destroy it. Entering your shrine outlines it and shows its reach.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `airTicksPerLevel` | `20` | Air ticks saved per level out of every 75 ticks underwater; 25 per level means air never runs out at level 3. |
| `swimEfficiencyBase` | `0.4` | Water movement efficiency before level scaling. |
| `swimEfficiencyPerLevel` | `0.2` | Water movement efficiency added per level; the total caps at 1. |
| `graceTicksBase` | `40` | Dolphin's Grace ticks granted while swimming, before level scaling. |
| `graceTicksPerLevel` | `20` | Dolphin's Grace ticks added per level. |
| `maxRegenAmplifier` | `2` | Highest Regeneration amplifier while wet; level 1 starts at amplifier 0. |
| `shrineRadiusBase` | `4` | Tide Shrine radius in blocks before level scaling. |
| `shrineRadiusPerLevel` | `4` | Tide Shrine radius added per level, in blocks. |
| `shrinesBelowTopLevel` | `1` | Tide Shrines you can have placed below the top level. |
| `shrinesAtTopLevel` | `2` | Tide Shrines you can have placed at the top level. |
| `shrineMiningMultiplier` | `5` | Underwater mining speed multiplier inside your shrine; 5 cancels the vanilla underwater penalty. |
| `shrineFloatingMultiplier` | `5` | Block break speed multiplier while floating inside your shrine; 5 cancels the vanilla floating penalty. |
| `shrineEffectTicks` | `220` | Length of each refreshed breathing, Night Vision and mining effect inside your shrine, in ticks. |

### Maelstrom (`upgraded-seaborne-maelstrom`)

3 levels · 13, 13 and 16 knowledge · Fuses Tidecaller, Hydro Jet, Trident Mastery and Storm Strike

Surge and jet spend charges from one pool of 4, 5 or 6 charges at levels 1, 2 and 3. One charge refills every 2 seconds.

- **Surge:** swing a trident in your main hand while in water to dash where you look, with strength 1.4, 1.7 or 2.0 and a small upward push. A wall within 1.2 blocks ahead blocks the surge, and a surge leaves you at most at speed 2.4. A swing with anything else, or while you look at a block within 4.5 blocks, does not surge.
- **Jet:** start sneaking while swimming to launch forward with force 1.3, 1.6 or 1.9. Each jet costs 1.5 hunger exhaustion and fails when your food is too low.

Surges and jets pay no skill XP. A failed surge or jet fizzles.

Trident hits, thrown or melee, deal 43%, 57% or 70% more damage, and each hit on a natural mob or a player pays 6 skill XP. Every trident you throw comes back to you at speed 1.7, 2.1 or 2.4: right after it hits a creature, or after 30 ticks of flight when it hits nothing.

**Storm Strike:** you have Storm Strike at level 3, 4 or 5 without learning it, so in rain or water your melee and trident hits call lightning by its rules: the first hit on each target, then every 3, 2 or 2 hits, for 5, 6 or 7 extra damage (half again in a thunderstorm). Farmed mobs, your pets and targets you may not hurt are never struck. See [Storm Strike](/adapt/28-skill-seaborne).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `chargesBase` | `3` | Charges shared by surge and jet before level scaling. |
| `chargesFactor` | `3` | Charges added across the levels. |
| `chargeRegenMillis` | `2000` | Time to regain one charge, in milliseconds. |
| `jetForceBase` | `1.0` | Jet force before level scaling. |
| `jetForcePerLevel` | `0.3` | Jet force added per level. |
| `hungerCost` | `1.5` | Hunger exhaustion each jet costs. |
| `surgeStrengthBase` | `1.1` | Surge strength before level scaling. |
| `surgeStrengthPerLevel` | `0.3` | Surge strength added per level. |
| `surgeLift` | `0.04` | Upward push added to each surge. |
| `maxSurgeVelocity` | `2.4` | Fastest speed a surge can leave you with. |
| `wallCheckDistance` | `1.2` | Distance ahead checked for walls before a surge, in blocks. |
| `tridentBonusBase` | `0.3` | Trident bonus damage before level scaling, as a fraction. |
| `tridentBonusFactor` | `0.4` | Trident bonus damage added across the levels. |
| `recallSpeedBase` | `1.4` | Speed of a returning trident before level scaling. |
| `recallSpeedFactor` | `1.0` | Return speed added across the levels. |
| `flightTicks` | `30` | Ticks a thrown trident flies before turning back when it hits nothing. |
| `recallDelayTicks` | `1` | Ticks after a throw before the return checks start. |
| `xpPerTridentHit` | `6` | Skill XP for each trident hit on a natural target. |

### Deep Fortune (`upgraded-seaborne-deep-fortune`)

3 levels · 13, 13 and 16 knowledge · Fuses Fisher's Fantasy, Fish Whisperer and Deep Salvager

- **Luck:** you have +2, +3 or +4 Luck at levels 1, 2 and 3, refreshed every 3 seconds.
- **Bonus catches:** each fish you catch has a 30%, 45% or 60% chance to drop a bonus catch at your feet, at most once every 3 seconds. The bonus is a random fishing item, mostly fish, and comes with 4, 6 or 8 vanilla XP.
- **Sea life:** when you hit a mob, up to 8 dolphins and axolotls within 13, 16 or 19 blocks of it join in. Dolphins charge at it and axolotls target it.
- **Glowing containers:** while you are in water, chests and barrels within 7, 8 or 9 blocks of you glow, rescanned every 3 seconds.
- **Salvage cast:** reel in your fishing rod with the bobber in water inside a shipwreck or an ocean ruin to pull up one roll of Deep Salvager's treasure, which can be a heart of the sea. Each level adds one more draw at the heart (1, 2 or 3). Each structure pays you once, stamped on the structure, and each salvage costs 10 rod durability; a rod that would break, or an unbreakable rod, salvages nothing. The first salvage of each structure pays 20 skill XP.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `catchChanceAtLevelOne` | `0.3` | Chance of a bonus catch at level 1. |
| `catchChanceAtMaxLevel` | `0.6` | Chance of a bonus catch at the top level. |
| `catchCooldownMillis` | `3000` | Shortest time between two bonus catches, in milliseconds. |
| `vanillaXpAtLevelOne` | `4` | Vanilla XP dropped with a bonus catch at level 1. |
| `vanillaXpPerLevel` | `2` | Vanilla XP added per level after the first. |
| `maximumVanillaXp` | `16` | Most vanilla XP a single bonus catch drops. |
| `luckBase` | `1` | Luck before level scaling; each level adds one. |
| `assistRangeBase` | `10` | Range in blocks within which dolphins and axolotls join a fight, before level scaling. |
| `assistRangePerLevel` | `3` | Assist range added per level, in blocks. |
| `dolphinChargeStrength` | `1.0` | Push given to a dolphin charging your target. |
| `glowRangeBase` | `5` | Radius in which chests and barrels glow, before level scaling; capped at 9. |
| `glowRangePerLevel` | `1.5` | Glow radius added per level, in blocks. |
| `glowScanMillis` | `3000` | Time between container glow scans, in milliseconds. |
| `salvageLuckPerLevel` | `1` | Extra draws at the heart of the sea per level on a salvage cast. |
| `salvageRodDurability` | `10` | Rod durability each salvage cast costs. |
| `salvageXp` | `20` | Skill XP for the first salvage of each structure. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Seaborne](/adapt/28-skill-seaborne).
