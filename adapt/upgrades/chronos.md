---
title: "Upgrades - Chronos"
description: "Chronos upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you merge Chronos into a mutated skill ([Mutations](/adapt/35-mutations)), and they replace the original [Chronos](/adapt/16-skill-chronos) adaptations.

## Upgrades

### Second Chance (`upgraded-chronos-second-chance`)

3 levels · 13, 13 and 16 knowledge · Fuses Rewind, Instant Recall and Hourglass Guard

Your position, health and hunger are recorded as you move. Sneak and press swap-hands (F by default) to rewind to where you stood 4, 5 or 6 seconds ago at levels 1, 2 and 3, with the health, hunger and fire you had then. No clock is needed. Inventory is not restored.

A hit that would kill you also spends the charge. The hit is cancelled, you keep the health you had before that hit but never more than half your maximum, you get 2.5 seconds of invulnerability, enemies within 6 blocks get Slowness III for 3 seconds, and the rewind follows. This rewind brings back your position, hunger and fire from then; your health stays at what the save left.

Part of every hit of 1 damage or more is owed later instead: 15, 25 or 35 percent at levels 1, 2 and 3, paid back over the next 10 seconds in one-second pulses. With Borrowed Time also active, the two together owe this share, not more. Any rewind, chosen or from a killing blow, clears everything still owed, including Borrowed Time's debt. Logging out never clears the debt; it is paid after you return. Dying clears it.

The charge returns after 200, 160 or 120 seconds and shares its cooldown with Hourglass Guard. With Clock sounds on, pressing the gesture while it recharges plays a reject sound.

Personal controls: Death-save priority (First/Normal/Last); Clock sounds (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `rewindSecondsBase` | `3` | How far back the rewind goes before level scaling, in seconds. |
| `rewindSecondsPerLevel` | `1` | Seconds added to the rewind per level. |
| `snapshotIntervalMillis` | `100` | Milliseconds between two recorded positions. |
| `cooldownMillisBase` | `240000` | Charge cooldown before level scaling, in milliseconds. |
| `cooldownMillisPerLevel` | `40000` | Charge cooldown removed per level, in milliseconds. |
| `minimumCooldownMillis` | `90000` | Shortest charge cooldown at any level, in milliseconds. |
| `saveHealthShare` | `0.5` | Most health a killing blow's save leaves, as a share of your maximum health; never more than you had before the blow. |
| `invulnerabilityMillis` | `2500` | Invulnerability after a killing blow is stopped, in milliseconds. |
| `enemySlowRadius` | `6` | Radius in blocks of the slow on nearby enemies after a killing blow; never above 12. |
| `enemySlowTicks` | `60` | Duration of that slow, in ticks. |
| `enemySlowAmplifier` | `2` | Slowness amplifier on nearby enemies. |
| `deferShareBase` | `0.05` | Share of each hit owed later, before level scaling. |
| `deferSharePerLevel` | `0.1` | Share of each hit owed later added per level; never above 0.9 in total. |
| `deferMinimumDamage` | `1` | Smallest hit that is partly owed later. |
| `deferPaybackPulses` | `10` | One-second pulses the owed damage is paid over. |

### Time Lord (`upgraded-chronos-time-lord`)

3 levels · 13, 13 and 16 knowledge · Fuses Time in a Bottle, Accelerate and Overtime

Chrono bottles you carry work as they do with Time in a Bottle but hold 3 times as much time and charge twice as fast. With Time in a Bottle's default settings that is 54, 63 or 72 minutes of storage at levels 1, 2 and 3, gaining 0.24, 0.28 or 0.32 seconds per second. Time in a Bottle's bottle recipe stays craftable while you hold this upgrade.

A time aura pulses every 2 seconds and picks 8, 10 or 12 blocks within 8.5, 10 or 11.5 blocks of you. A sampled crop grows one stage with a 55, 65 or 75 percent chance, and a sampled furnace, smoker, blast furnace or brewing stand skips 45, 55 or 65 percent of its remaining cook or brew time. Crops need block-place permission and those stations need container access. Crops the aura grows count as bone-mealed.

Beneficial potion effects applied to you last 75, 100 or 125 percent longer, adding at most 10 minutes. Effects shorter than 3 seconds or longer than 1 hour are left alone. Harmful effects are not shortened.

Restoration: sneak and right-click a block with a clock to bring back what explosions, fire and endermen destroyed within 6, 8 or 10 blocks of it in the last 60, 120 or 300 seconds at levels 1, 2 and 3. Blocks come back one layer per tick from the bottom up and need block-place permission; a block you may not build at is skipped and the rest continue. Every 16 blocks cost 60 seconds of time from the chrono bottles you carry. Blocks are remembered only while someone holding Time Lord is within 32 blocks when they are destroyed. Blocks broken by players are never remembered, and neither are containers, blocks with stored data (signs, banners, spawners), doors, beds, tall plants, TNT and respawn anchors. When a block's own drop landed in its spot, that drop must still lie within reach and is taken back with that block; other items, and named or marked ones, are never taken. A block an enderman carried off needs one of its own item on the ground, which is taken. Burned blocks drop nothing and need nothing. Restored blocks count as placed by you.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `bottleCapacityMultiplier` | `3` | How many times more time a bottle holds than Time in a Bottle allows. |
| `bottleChargeMultiplier` | `2` | How many times faster bottles gather time than with Time in a Bottle. |
| `auraPulseMillis` | `2000` | Time between two aura pulses, in milliseconds. |
| `auraRadiusBase` | `7` | Aura radius before level scaling, in blocks. |
| `auraRadiusPerLevel` | `1.5` | Aura radius added per level, in blocks. |
| `auraSamplesBase` | `6` | Blocks sampled per pulse before level scaling. |
| `auraSamplesPerLevel` | `2` | Blocks sampled per pulse added per level. |
| `auraGrowChanceBase` | `0.45` | Chance a sampled crop grows a stage, before level scaling. |
| `auraGrowChancePerLevel` | `0.1` | Crop growth chance added per level. |
| `auraCookBoostBase` | `0.35` | Share of the remaining cook or brew time skipped per hit, before level scaling; never above 0.9. |
| `auraCookBoostPerLevel` | `0.1` | Cook and brew share added per level. |
| `potionExtensionBase` | `0.5` | Beneficial potion extension before level scaling, as a share of its duration. |
| `potionExtensionPerLevel` | `0.25` | Potion extension added per level. |
| `potionMaxExtension` | `1.5` | Highest potion extension at any level, as a share of its duration. |
| `potionMaxBonusTicks` | `12000` | Most ticks added to one potion. |
| `potionMinimumDurationTicks` | `60` | Shortest potion that gets extended, in ticks. |
| `potionMaximumBaseDurationTicks` | `72000` | Longest potion that gets extended, in ticks. |
| `restoreWindowSecondsLevel1` | `60` | How long destroyed blocks can still be restored at level 1, in seconds. |
| `restoreWindowSecondsLevel2` | `120` | How long destroyed blocks can still be restored at level 2, in seconds. |
| `restoreWindowSecondsLevel3` | `300` | How long destroyed blocks can still be restored at level 3, in seconds. |
| `restoreRadiusBase` | `4` | Restoration radius before level scaling, in blocks. |
| `restoreRadiusPerLevel` | `2` | Restoration radius added per level, in blocks. |
| `restoreChargeSeconds` | `60` | Stored bottle seconds one restoration charge costs. |
| `restoreBlocksPerCharge` | `16` | Blocks one restoration charge restores. |
| `restoreRecordRadius` | `32` | Blocks destroyed within this distance of a holder are remembered, in blocks. |
| `restoreMaxLoggedBlocks` | `20000` | Most destroyed blocks remembered across the server. |

### Frozen Moment (`upgraded-chronos-frozen-moment`)

3 levels · 13, 13 and 16 knowledge · Fuses Stasis Field, Time Bomb and Aberrant Touch

Sneak and right-click with an amethyst shard to throw it, spending one shard. Where it lands, a stasis field opens for 5, 6 or 7 seconds with a radius of 4.25, 5 or 5.75 blocks at levels 1, 2 and 3. Mobs inside get Slowness V and cannot jump, and projectiles inside hang frozen until the field ends, then fall. Players, your pets and mobs protected as friendly are not affected. Throws recharge in 15 seconds; if the landing spot is protected, no field opens and the recharge is cleared.

Your melee hits on a target inside your own field root it with Slowness VII for 2 seconds. The same target can be rooted at most once every 3 seconds.

Creatures in the field can still jump on server versions without the jump strength attribute.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `radiusBase` | `3.5` | Field radius before level scaling, in blocks; never above 12. |
| `radiusPerLevel` | `0.75` | Field radius added per level, in blocks. |
| `durationMillisBase` | `4000` | Field duration before level scaling, in milliseconds; never above 30 seconds. |
| `durationMillisPerLevel` | `1000` | Field duration added per level, in milliseconds. |
| `throwCooldownMillis` | `15000` | Time between two throws, in milliseconds. |
| `fieldSlownessAmplifier` | `4` | Slowness amplifier on creatures inside the field. |
| `fieldJumpLockAmplifier` | `-6` | Jump strength change inside the field, in sixths; negative values lower jumps. |
| `rootTicks` | `40` | Root duration from a hit inside the field, in ticks. |
| `rootAmplifier` | `6` | Slowness amplifier of the root. |
| `rootCooldownMillis` | `3000` | Time before the same target can be rooted again, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Chronos](/adapt/16-skill-chronos).
