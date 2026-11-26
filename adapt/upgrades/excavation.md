---
title: "Upgrades - Excavation"
description: "Excavation upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Excavation (see [Mutations](/adapt/35-mutations)), and they replace the original adaptations of [Excavation](/adapt/20-skill-excavation).

## Upgrades

### Landshaper (`upgraded-excavation-landshaper`)

3 levels · 15, 14 and 18 knowledge · Fuses Tunneler, Burrow and Hasty Excavator

Digging a soft block with a shovel also breaks soft blocks from the 3 by 3 plane around it: 4 of the 8 at level 1, 6 at level 2 and all 8 at level 3. The plane stands upright across your view, or lies flat when you look 50 degrees or more up or down. Soft blocks are dirt, coarse dirt, rooted dirt, farmland, grass, dirt path, mycelium, podzol, sand, red sand, gravel, clay, mud, muddy mangrove roots, soul sand, soul soil, snow and snow blocks.

Digging while sneaking sinks a shaft straight down instead, starting under the dug block: 8 blocks at level 1, 12 at level 2 and 16 at level 3, one block every 2 ticks. The shaft stops at a block that is not soft, above lava, above a drop of two or more air blocks, and 16 blocks above the bottom of the world. It starts only when the shovel can pay for every block, and you can sink one shaft every 6 seconds.

Each extra block costs 1 shovel durability, and each natural one pays 1.5 skill XP; blocks you placed pay nothing. Hitting a soft block with a shovel also raises your break speed by 20% per level for 5 seconds after each hit, on server versions that have the break speed attribute.

Sneak-right-click the ground with a shovel to slam it: a line of earth heaves 6 blocks forward, hitting hostile mobs and players (where PvP is allowed) within 1.25 blocks of the line for 3, 5 and 7 damage at levels 1, 2 and 3, throwing them up and giving them Slowness II for 3 seconds. The ground does not change. A slam costs 4 shovel durability and can be used every 10, 8 and 6 seconds; it hits at most 12 targets, and each natural mob hit pays 2 skill XP. While you hold Landshaper, the slam replaces the kept Earth Mover wave on clicks on the top of a block while the slam is ready and the shovel can pay; Earth Mover answers every other click.

Landshaper also unlocks Grading Stakes, crafted shapeless from two sticks, string and a clay ball. Right-click a block to plant the first stake: that block's height is the height the ground is levelled to. Right-click a second block to set the far corner. The area may be at most 8 by 8 at level 1, 12 by 12 at level 2 and 16 by 16 at level 3. An outline shows the plane for 3 seconds, then the ground in the area is levelled over a few seconds. You need a shovel in your hotbar, which comes to your hand for the work; switching away from it stops the grade.

In each column, soft ground above the plane is dug, up to 3 blocks at level 1, 5 at level 2 and 8 at level 3, and its drops go to your inventory. Each dug block costs 1 shovel durability and each natural one pays 1.5 skill XP. Holes below the plane are filled with dirt, then sand, then gravel from your inventory, one item per block, lowest first; the grade stops when you run out. A column whose ground rises past that reach, or whose hole goes deeper, is left as it is, and a column stops at the first block that stays, so no ground is left hanging. The stakes never dig stone, logs, farmland, blocks a player placed, or soft ground holding up a plant or other block, and skip protected blocks. Sneak-right-click with the stakes to pull them and stop a grade.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `planeBlocksBase` | `2` | Plane blocks carved before the level is added; the plane holds at most 8. |
| `planeBlocksPerLevel` | `2` | Plane blocks added per level. |
| `shaftDepthBase` | `4` | Shaft depth in blocks before the level is added. |
| `shaftDepthPerLevel` | `4` | Shaft depth added per level, in blocks. |
| `shaftCooldownMillis` | `6000` | Time between two shafts, in milliseconds. |
| `ticksPerBlock` | `2` | Ticks between two shaft blocks. |
| `safeFloorMargin` | `16` | Blocks above the bottom of the world where shafts stop. |
| `durabilityCostPerBlock` | `1` | Shovel durability spent on each extra block. |
| `hasteDurationTicks` | `100` | How long the break speed lasts after each hit, in ticks, kept between 40 and 600. |
| `xpPerBlock` | `1.5` | Skill XP for each natural extra block. |
| `gradeSideBase` | `4` | Side of the graded area in blocks before level scaling. |
| `gradeSidePerLevel` | `4` | Side added to the graded area per level, in blocks. |
| `gradeHeightAtFirstLevel` | `3` | Most blocks the ground is raised or lowered at level 1. |
| `gradeHeightPerLevel` | `2.5` | Height change added per level after the first, rounded down. |
| `gradePreviewTicks` | `60` | Ticks the outline shows before the ground is levelled. |
| `gradeBlocksPerTick` | `8` | Blocks dug or filled per tick while grading. |
| `gradeMaxBlocks` | `2048` | Most blocks one grade digs and fills together. |
| `slamLength` | `6` | Length of the slam line in blocks. |
| `slamWidth` | `1.25` | Blocks to either side of the line that are still hit. |
| `slamHeight` | `2` | Blocks above or below you that the slam still hits. |
| `slamDamageBase` | `1` | Slam damage before the level is added. |
| `slamDamagePerLevel` | `2` | Slam damage added per level. |
| `slamCooldownMillisBase` | `12000` | Time between slams before level scaling, in milliseconds. |
| `slamCooldownMillisPerLevel` | `2000` | Cooldown removed per level, in milliseconds. |
| `slamDurability` | `4` | Shovel durability each slam costs. |
| `slamLift` | `0.6` | Upward speed given to each target hit. |
| `slamPush` | `0.3` | Forward speed given to each target hit. |
| `slamSlowTicks` | `60` | How long slammed targets are slowed, in ticks. |
| `slamSlowAmplifier` | `1` | Slowness amplifier on slammed targets (0 is Slowness I). |
| `slamXpPerMob` | `2` | Skill XP for each natural mob the slam hits. |

### Deep Sight (`upgraded-excavation-deep-sight`)

3 levels · 13, 13 and 16 knowledge · Fuses Super-Seeing Spelunker and Seismic Ping

Breaking any block with a shovel or pickaxe scans the ground around it and outlines the nearest ores through the blocks, nearest first, for 5 seconds. No glow berries or ore in hand are needed. Only you see the outlines, colored by ore type, and ancient debris counts as an ore. On servers with a hidden-ore plugin, the nearest hidden vein in range is outlined as well.

| Level | Scan radius | Ores outlined | Cooldown |
|-------|-------------|---------------|----------|
| 1 | 12 blocks | 7 | 5 s |
| 2 | 16 blocks | 10 | 4 s |
| 3 | 20 blocks | 13 | 3 s |

| Key | Code default | What it does |
|-----|--------------|--------------|
| `scanRadiusBase` | `8` | Scan radius in blocks before the level is added, capped at 32. |
| `scanRadiusPerLevel` | `4` | Scan radius added per level, in blocks. |
| `highlightsBase` | `4` | Ores outlined per scan before the level is added, capped at 16. |
| `highlightsPerLevel` | `3` | Ores outlined per scan added per level. |
| `maxBlockChecks` | `4096` | Most blocks one scan reads, capped at 8192. |
| `denseScanRadius` | `6` | Radius searched completely before the rest of the checks spread over the full radius. |
| `highlightDurationTicks` | `100` | How long each outline stays, in ticks, kept between 20 and 600. |
| `displayViewRange` | `1.0` | View range multiplier for the outlines, kept between 0.5 and 2.0. |
| `cooldownMillisBase` | `6000` | Time between two scans before the level is applied, in milliseconds. |
| `cooldownMillisPerLevel` | `1000` | Cooldown removed per level, in milliseconds. |
| `minimumCooldownMillis` | `2000` | Shortest time between two scans at any level, in milliseconds. |

### Gravekeeper (`upgraded-excavation-gravekeeper`)

3 levels · 13, 13 and 16 knowledge · Fuses Treasure Hunter, Grave Digger and Mudlark

Digging with a shovel rolls up to three separate finds, depending on the block:

| Find | Blocks | Level 1 | Level 2 | Level 3 |
|------|--------|---------|---------|---------|
| Treasure | Sand, red sand, gravel, mud, clay | 5% | 7% | 9% |
| Bone loot | Dirt, grass, coarse dirt, rooted dirt, podzol, mycelium, dirt path | 5% | 7% | 9% |
| One extra block item | Clay (a clay ball), mud and muddy mangrove roots (mud), soul sand, soul soil | 17% | 24% | 31% |

Treasure draws from bones, flint, clay balls, angler, arms up and skull pottery sherds, and emeralds. Bone loot draws from bones, bone meal, rotten flesh, bone blocks and skeleton skulls. Each find pays 6 skill XP. Only ground that was never placed rolls: blocks a player placed turn up nothing.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `treasureChanceBase` | `0.03` | Treasure chance per dig before the level is added. |
| `treasureChancePerLevel` | `0.02` | Treasure chance added per level. |
| `boneChanceBase` | `0.03` | Bone loot chance per dig before the level is added. |
| `boneChancePerLevel` | `0.02` | Bone loot chance added per level. |
| `bonusChanceBase` | `0.10` | Extra block chance per dig before the level is added. |
| `bonusChancePerLevel` | `0.07` | Extra block chance added per level. |
| `treasureTable` | `BONE:30:1:2, FLINT:30:1:2, CLAY_BALL:15:1:3, ANGLER_POTTERY_SHERD:6:1:1, ARMS_UP_POTTERY_SHERD:6:1:1, SKULL_POTTERY_SHERD:4:1:1, EMERALD:3:1:1` | Weighted treasure entries as `MATERIAL:weight:min:max`. |
| `boneTable` | `BONE:40:1:2, BONE_MEAL:25:2:4, ROTTEN_FLESH:20:1:2, BONE_BLOCK:6:1:1, SKELETON_SKULL:2:1:1` | Weighted bone loot entries as `MATERIAL:weight:min:max`. |
| `xpPerFind` | `6` | Skill XP for each find. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Excavation](/adapt/20-skill-excavation).
