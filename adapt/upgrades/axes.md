---
title: "Upgrades - Axes"
description: "Axes upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you [mutate](/adapt/35-mutations) Axes, and they replace the original [Axes](/adapt/13-skill-axes) adaptations they fuse. Each one needs an axe in the main hand.

## Upgrades

### Timberfall (`upgraded-axes-timberfall`)

3 levels · 13, 13 and 16 knowledge · Fuses Axe Chop, Wood-Miner and Leaf-Miner

Break a log, wood, stem, mushroom block or mangrove root block with an axe, by default while sneaking, to fell the tree. Timberfall follows the trunk up to 32 blocks and breaks blocks of the same type within 5, 6 and 7 blocks of the broken block and of the trunk top, up to 80, 112 and 144 blocks at levels 1, 2 and 3. It then finds the first leaf block within 2 blocks of the trunk top and clears touching leaves of that type within 7 blocks, up to 192, 256 and 320 blocks. Blocks you are not allowed to break stay in place.

Drops from every log and leaf block you break with an axe go straight into your inventory. Only natural logs and leaves pay skill XP; logs you placed pay nothing. Whatever does not fit drops at your feet.

Personal controls: Activation gesture (While sneaking/While not sneaking/Always); Work limit (full/half/quarter of the log and leaf limits); Collected items (All permitted/Logs and stems/Saplings and propagules/Apples only).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `maxLogsBase` | `48` | Most logs one break fells, before level scaling. |
| `maxLogsPerLevel` | `32` | Logs added to the limit per level. |
| `maxLeavesBase` | `128` | Most leaves one break clears, before level scaling. |
| `maxLeavesPerLevel` | `64` | Leaves added to the limit per level. |
| `radiusBase` | `4` | Log search radius in blocks around the broken log and the trunk top, before the level is added. |
| `trunkHeight` | `32` | Tallest trunk in blocks followed up from the broken log. |
| `leafRadius` | `7` | Leaf search radius in blocks around the canopy. |
| `xpPerLog` | `2` | Skill XP for each natural log felled. |
| `xpPerLeaf` | `0.25` | Skill XP for each natural leaf cleared. |

### Sundering Cleave (`upgraded-axes-sundering-cleave`)

3 levels · 13, 13 and 16 knowledge · Fuses Sunder and Cleave

Every axe hit adds a shred stack to the struck target. Each stack removes 2.25, 3 and 3.75 armor points at levels 1, 2 and 3, plus half that much armor toughness. A target holds up to 3, 4 and 5 stacks, and the shred wears off 6 seconds after the last stack lands.

The same swing also hits up to 16 other living entities within 4 blocks of the struck target that sit inside a cone in front of you. The cone is 110, 130 and 150 degrees wide. Each of them takes 60%, 75% and 90% of the swing's damage and gets a shred stack. Armor stands are skipped. A swing whose arc hits anything costs the axe 1 durability.

Personal controls: Ignore passive mobs (on/off); Affect players (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `ignorePassiveMobs` | `false` | Leaves passive and neutral mobs out of the arc and its shred. The struck target is unaffected. |
| `halfArcDegreesBase` | `45` | Half the cone width in degrees before level scaling. |
| `halfArcDegreesPerLevel` | `10` | Half-cone degrees added per level. |
| `radius` | `4` | Reach in blocks around the struck target. |
| `maxTargets` | `16` | Most extra targets one swing hits. |
| `damageShareBase` | `0.45` | Share of the swing's damage dealt to each arc target, before level scaling. |
| `damageSharePerLevel` | `0.15` | Damage share added per level. |
| `shredPerStackBase` | `1.5` | Armor points removed per stack before level scaling. |
| `shredPerStackPerLevel` | `0.75` | Armor points per stack added per level. |
| `toughnessShredPerStackRatio` | `0.5` | Share of each stack's armor shred also removed from armor toughness. 0 leaves toughness alone. |
| `maxStacksBase` | `2` | Shred stacks a target can carry, before the level is added. |
| `shredDurationTicks` | `120` | Ticks the shred lasts after the last stack. |
| `durabilityCost` | `1` | Axe durability spent when the arc hits something. |
| `xpPerTarget` | `4` | Skill XP for each natural mob or player the arc hits. |

### Worldsplitter (`upgraded-axes-worldsplitter`)

3 levels · 13, 13 and 16 knowledge · Fuses Axe Ground Smash and Throwing Axe

Left-click air with an axe to throw it. The axe leaves your hand, costs 3 durability and flies at 2 blocks per tick. A living entity it hits takes the axe's melee damage times 1.1, 1.3 and 1.5 at levels 1, 2 and 3, using 10 for netherite, 9 for diamond, iron and stone, and 7 for wooden and golden axes. The throw cooldown is 2, 1.5 and 1 seconds and also puts that axe type on an item cooldown. The swing that breaks a block never throws.

Where the axe lands on a block or entity, it smashes the ground: living entities within 4, 5 and 6 blocks take 6, 8 and 10 damage at the center, falling to 40% at the edge, and are knocked away from the impact. The smash never hits you or your own tamed pets. The axe then returns to your hand, or to your inventory if your hand is full.

On its way back the axe strikes the creatures within 1.25 blocks of the line from the impact to your eyes, nearest the impact first: up to 3, 5 and 8 of them at levels 1, 2 and 3, each once, for half the throw's damage. Each creature struck costs the returning axe 1 durability, and the return stops striking before the axe would break. Player targets follow PvP rules, protected areas are respected, and the return breaks no blocks. If you also hold Sundering Cleave, every creature struck takes one of its armor shred stacks at your Sundering Cleave level. An axe that flies 4 seconds without landing returns without a smash, and an axe that breaks from the throw's durability cost does not return.

Personal controls: Require sneaking (on/off); Ignore passive mobs (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `ignorePassiveMobs` | `false` | Leaves passive and neutral mobs out of the smash and of bounced axes. Direct throws and player targeting are unchanged. |
| `damageMultiplierBase` | `0.9` | Share of the axe's melee damage dealt by a throw, before level scaling. |
| `damageMultiplierPerLevel` | `0.2` | Melee-damage share added per level. |
| `throwSpeed` | `2.0` | Flight speed of a thrown axe in blocks per tick. |
| `smashDamageBase` | `4` | Smash damage at the impact point before level scaling. |
| `smashDamagePerLevel` | `2` | Smash damage added per level. |
| `smashEdgeDamageRatio` | `0.4` | Share of the smash damage dealt at the edge of the radius. |
| `smashRadiusBase` | `3` | Smash radius in blocks before level scaling. |
| `smashRadiusPerLevel` | `1` | Smash radius in blocks added per level. |
| `smashForce` | `1.0` | Knockback at the impact point, falling to none at the edge. |
| `cooldownMillisBase` | `2500` | Throw cooldown in milliseconds before level scaling. |
| `cooldownMillisPerLevel` | `500` | Milliseconds of cooldown removed per level. |
| `minimumCooldownMillis` | `1000` | Shortest throw cooldown in milliseconds at any level. |
| `durabilityCost` | `3` | Axe durability spent on each throw. |
| `maxFlightTicks` | `80` | Ticks a thrown axe stays airborne before it returns on its own. |
| `xpPerHit` | `6` | Skill XP for each thrown-axe hit on a natural mob or a player. |
| `xpPerSmashTarget` | `4` | Skill XP for each natural mob or player the smash hits. |
| `returnTargetsLevel1` | `3` | Most creatures the returning axe strikes at level 1. |
| `returnTargetsLevel2` | `5` | Most creatures the returning axe strikes at level 2. |
| `returnTargetsLevel3` | `8` | Most creatures the returning axe strikes at level 3. |
| `returnDamageRatio` | `0.5` | Share of the throw damage each creature on the return path takes. |
| `returnPathWidth` | `1.25` | How far from the line between the impact and you a creature is struck, in blocks. |
| `returnDurabilityPerHit` | `1` | Axe durability each creature struck on the return costs; the return never breaks the axe. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Axes](/adapt/13-skill-axes).
