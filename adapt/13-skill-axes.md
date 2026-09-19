---
title: "Skill - Axes"
description: "Axes XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Axes gains XP by breaking logs, wood, mushroom blocks, or mangrove roots with an axe and by dealing axe damage.

Eleven adaptations are always available. They cover tree cutting, wood and leaf vein mining, direct inventory drops, log conversion, thrown axes, area damage, armor damage, shield pressure, and absorption. Iris Feller registers only when the Iris tree-feller service is available.

## Earning XP

Two things pay out. Breaking a log, wood, mushroom block, mangrove roots or muddy mangrove roots block with an axe pays XP. The payout is based on that block's material value, plus its hardness and blast resistance up to the configured caps. Damaging a living entity while holding an axe pays XP scaled off the damage you dealt.

Both share one cooldown. Rapid-fire breaks and hits do not each pay out. Blocks with zero hardness are worth nothing. Blocks that Adapt's XP provenance system has already paid for do not pay again.

Breaking leaves with an axe only bumps the `axes.leaves` stat, which drives the leaf challenges. Leaves are not log-type blocks, so they never reach the XP branch. `leavesMultiplier` has no effect on what you actually earn with the current code.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled, the matching `adapt.use.` permission (or the `adapt.use.*` wildcard), and protection and region policy that allow the action. Anything that breaks extra blocks runs them through your own break action, so blocks in a claim you cannot build in do not break.

### Axe Ground Smash (`axe-ground-smash`)

5 levels · 8 knowledge, then 6 per level

Jump with an axe out, crouch in the air, and hit the ground. Everything living around you takes damage and gets launched. Damage and force fall off toward the edge of the radius. The middle of the crowd takes the worst of it. It is the crowd-control button for an axe build.

How to use it:

1. Hold an axe in your main hand.
2. Jump.
3. Hold sneak while you are off the ground. This arms the smash.
4. Land while still sneaking and still holding the axe.

Releasing sneak, or landing after the arm expires, cancels it. Each smash starts a cooldown that shortens as you level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `falloffFactor` | `3` | Curve exponent for how fast damage and force drop off with distance. Higher concentrates the hit near the center. |
| `radiusLevelFactorMultiplier` | `8` | Blocks of smash radius added across the full level range. |
| `damageLevelFactorMultiplier` | `8` | Health points of center damage added across the full level range. |
| `forceFactorMultiplier` | `1.15` | Launch velocity added across the full level range. |
| `forceBase` | `0.27` | Launch velocity applied at level 1. |
| `cooldownTicksBase` | `80` | Cooldown in ticks at max level. |
| `cooldownTicksInverseLevelMultiplier` | `225` | Extra cooldown ticks at level 1, removed as you level. |

### Axe Chop (`axe-chop`)

5 levels · 2 knowledge, then 3 per level

Right-click the bottom log of a tree. Adapt strips the topmost log off the column above the block you clicked. It repeats once per adaptation level. A level 3 chop takes three logs per click. Every log costs the axe durability and puts a short cooldown on that item type. The cooldown and wear both shrink as you level.

How to use it:

1. Learn Axe Chop.
2. Hold an axe in your main hand.
3. Right-click a log.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `rangeLevelMultiplier` | `5` | Blocks of column height searched per level when finding the top log. |
| `cooldownTicksBase` | `15` | Item cooldown in ticks at max level. |
| `cooldownTicksInverseLevelMultiplier` | `16` | Extra item cooldown ticks at level 1, removed as you level. |
| `damagePerBlockBase` | `1` | Durability spent per log at max level. |
| `damagePerBlockInverseLevelMultiplier` | `4` | Extra durability per log at level 1, removed as you level. |

### Axe Drop-To-Inventory (`axe-drop-to-inventory`)

1 level · 3 knowledge

Logs and leaves you break with an axe go straight into your inventory instead of landing on the ground. Anything a protection plugin blocks stays where it fell, and overflow drops at your feet with a fail sound.

No adaptation-specific config keys.

### Leaf-miner (`axe-leaf-veinminer`)

5 levels · 1 knowledge, then 6 per level

Sneak and break a leaf block with an axe. Every connected leaf of the same type inside your range goes with it. Range is your level plus the base range. The chain stops at the block cap. Mangrove roots and muddy mangrove roots count as leaves here.

How to use it:

1. Learn Leaf-miner.
2. Hold an axe in your main hand.
3. Hold sneak.
4. Break a leaf block.

You have to still be holding the axe when the chain fires. Blocks you are not allowed to break stay put and do not count toward the stat.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `baseRange` | `5` | Blocks of chain radius before level is added. Effective radius is level plus this. |
| `maxBlocks` | `128` | Hard cap on leaves taken by one chain. |

### Iris Feller (`axe-iris-feller`)

3 levels · 4 knowledge, then 3 per level

Only present when Iris is installed. Sneak-break a log that Iris recognizes as part of one of its trees. Iris erodes the whole tree outward for you. The run keeps going only while you keep sneaking and keep holding the same axe you started with. You also need hunger left to pay for the next log. Higher levels give a growing chance to skip the durability hit on each felled log.

How to use it:

1. Learn Iris Feller.
2. Hold an axe in your main hand.
3. Hold sneak.
4. Break a log that belongs to an Iris tree.
5. Keep sneaking and keep that axe held while the tree comes down.

Hunger is reserved before each log and only spent once that log actually comes out. A refused break costs you nothing. Once Iris accepts the run, the activation cooldown starts.

Durability preservation chance is fixed per effect tier: level 1 gives 0 percent, level 2 gives 25 percent, and level 3 or higher gives 75 percent. `maxLevel` remains operator-configurable.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `hungerCost` | `2` | Hunger points reserved per log and spent only after that log actually comes out. Clamped to 0 through 20. 0 disables the cost. |
| `cooldownSeconds` | `30` | Seconds before another fell can be accepted. 0 disables the cooldown. |

### Wood-miner (`axe-wood-veinminer`)

5 levels · 4 knowledge, then 3 per level

Sneak and break a log or wood block with an axe. Every matching block inside your range goes with it. Planks are not logs, so a plank wall is safe. Range is your level plus the base range, capped at the block limit. It stacks with Drop-To-Inventory.

How to use it:

1. Learn Wood-miner.
2. Hold an axe in your main hand.
3. Hold sneak.
4. Break a log or wood block.

Like Leaf-miner, it skips anything you are not allowed to break.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `maxBlocks` | `20` | Hard cap on logs taken by one chain. |
| `baseRange` | `3` | Blocks of chain radius before level is added. Effective radius is level plus this. |

### Lucy's Log-Swapper (`axe-logswap`)

1 level · 2 knowledge

Adds shapeless crafting recipes that convert wood types. Eight logs of one kind plus one sapling gives you eight logs of the sapling's tree. Handy when a build needs dark oak and you are standing in a birch forest.

How to use it:

1. Learn Lucy's Log-Swapper.
2. Open a crafting table.
3. Place eight logs of one type plus one sapling of the type you want.
4. Take the result.

It registers up to 70 shapeless recipes under the `adapt` namespace with keys of the form `axe-swap<from><to>`. Cherry and pale oak entries are skipped when the running Minecraft version lacks those materials. `permanent` defaults to `true` here, unlike every other Axes adaptation, so once you learn it you cannot unlearn it and get the knowledge back.

No adaptation-specific config keys.

### Throwing Axe (`axe-throwing-axe`)

4 levels · 5 knowledge

Left-click the air. Your axe leaves your hand as a spinning projectile that deals a fraction of its melee damage. It is a real throw. The axe comes out of your inventory. Below max level it lands on the ground where it hit, so you have to go pick it up. At max level it flies back to your hand instead.

How to use it:

1. Learn Throwing Axe.
2. Hold an axe in your main hand.
3. Left-click the air.

Each throw spends durability, starts a cooldown, and puts a matching item cooldown on that axe type. If the axe hits nothing, it is recovered automatically once its flight timer runs out. Left-clicking a block does not throw, and the swing Minecraft emits right after an axe block break is filtered out so mining does not fling your tool.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `damageMultiplierBase` | `0.6` | Fraction of the axe's melee damage dealt on a hit at level 1. |
| `damageMultiplierFactor` | `0.6` | Extra fraction added across the full level range. |
| `throwSpeedBase` | `1.2` | Launch velocity in blocks per tick at level 1. |
| `throwSpeedFactor` | `0.8` | Extra launch velocity added across the full level range. |
| `cooldownMsBase` | `1200` | Throw cooldown in milliseconds at level 1. |
| `cooldownMsLevelReduction` | `600` | Milliseconds of cooldown removed at max level. The result never drops below 250. |
| `durabilityCost` | `3` | Durability spent from the axe on each throw. |
| `maxFlightTicks` | `80` | Ticks a thrown axe stays airborne before it is recovered automatically. |
| `returnUnlockLevelPercent` | `1.0` | Level progress, 0 to 1, needed before thrown axes return to your hand instead of dropping. |
| `xpPerHit` | `6` | Skill XP per thrown-axe hit on an entity. |

### Sunder (`axe-sunder`)

5 levels · 4 knowledge

Every axe hit strips armor and a share of armor toughness from the target. The layers stack up to a cap. Each new hit refreshes the timer on the whole stack. A target you keep working on gets softer and softer. Stop hitting and it wears off. Just hit things with an axe.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `shredPerStackBase` | `1.5` | Armor points removed per stack at level 1. |
| `shredPerStackFactor` | `1.5` | Extra armor points per stack added across the full level range. |
| `toughnessShredPerStackRatio` | `0.5` | Fraction of the armor shred also taken off armor toughness. |
| `maxStacksBase` | `2` | Stack cap at level 1. |
| `maxStacksFactor` | `3` | Extra stack cap added across the full level range. |
| `durationTicks` | `120` | Ticks before the whole stack expires. Every fresh hit restarts this. |
| `xpPerStack` | `3` | Skill XP per stack applied. |

### Cleave (`axe-cleave`)

3 levels · 6 knowledge, then 5 per level

Your axe swings splash a share of the primary hit's damage onto other living things standing in a cone in front of you. The arc, reach and number of extra targets all grow with level. Each connect costs a point of axe durability. Armor stands are skipped. A target that was just cleaved is not double-hit by the same swing.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `halfArcDegreesBase` | `25` | Half the cone width in degrees at level 1. The menu shows double this. |
| `halfArcDegreesFactor` | `25` | Extra half-arc degrees added across the full level range. |
| `radiusBase` | `2.5` | Cleave reach in blocks at level 1. |
| `radiusFactor` | `1.5` | Extra reach in blocks added across the full level range. |
| `targetCapBase` | `2` | Secondary targets one swing can hit at level 1. |
| `targetCapMaxBonus` | `2` | Extra secondary targets at max level. |
| `damageShareBase` | `0.25` | Fraction of the primary hit's damage dealt to each cleaved target at level 1. |
| `damageShareFactor` | `0.45` | Extra damage-share fraction added across the full level range. |
| `durabilityCost` | `1` | Durability spent from the axe when a cleave connects. |
| `xpPerTarget` | `4` | Skill XP per cleaved target. |

### Bark Hide (`axe-bark-hide`)

5 levels · 4 knowledge

Chopping logs with an axe layers on absorption hearts. Each log adds a stack, up to a level-scaled cap. The stacks stick around for a grace period after your last chop. A woodcutting trip becomes a small buffer of temporary health. That matters when a creeper finds you in the trees. Dying clears the ceiling. Your next chop refills it.

Each stack is 4 absorption points, which is 2 hearts.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `absorptionCapBase` | `1` | Stack cap at level 1. |
| `absorptionCapFactor` | `3` | Extra stack cap added across the full level range. |
| `gracePeriodTicksBase` | `100` | Ticks the absorption survives after your last chop at level 1. Never less than 20. |
| `gracePeriodTicksFactor` | `200` | Extra grace ticks added across the full level range. |
| `xpPerStack` | `2` | Skill XP each time a fresh stack is added. |

### Shield Splitter (`axe-shield-splitter`)

4 levels · 4 knowledge

Hitting someone who is actively blocking deals bonus damage. It also puts their shield on a much longer cooldown than a vanilla axe would. It also works against mobs that raise a shield.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `disableTicksBase` | `60` | Shield cooldown in ticks applied at level 1. Never less than 20. |
| `disableTicksFactor` | `60` | Extra shield-cooldown ticks added across the full level range. |
| `bonusDamagePctBase` | `0.15` | Extra damage fraction against a blocking target at level 1. |
| `bonusDamagePctFactor` | `0.35` | Extra damage fraction added across the full level range. |
| `xpPerBreak` | `5` | Skill XP per shield broken open. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/axes.toml` on first load.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `enabled` | `true` | Turns the whole Axes skill off when false. |
| `skillColor` | `"&e"` | Legacy ampersand color code used for this skill in menus and text. |
| `getXpForAttackingWithTools` | `true` | When false, axe combat damage stops paying XP. Block breaking still pays. |
| `maxHardnessBonus` | `9` | Cap on how much of a block's hardness is added to its XP value. |
| `maxBlastResistanceBonus` | `10` | Cap on how much of a block's blast resistance is added to its XP value. |
| `challengeChopReward` | `1750` | XP paid by the Axes milestones. The larger tier of each pair pays double this. |
| `logOrWoodXPMultiplier` | `2.0` | Flat bonus added to the value of any `_LOG` or `_WOOD` block. |
| `leavesMultiplier` | `0.75` | Flat bonus that would be added to the value of any `_LEAVES` block. The Axes block-break path never asks for a leaf block's value, so this knob is inert. |
| `cooldownDelay` | `1500` | Milliseconds between XP awards from this skill, shared by breaking and combat. |
| `valueXPMultiplier` | `0.175` | Multiplier applied to the base material value before the hardness and resistance bonuses. |
| `axeDamageXPMultiplier` | `7.0` | XP per point of damage dealt with an axe. |

### Challenges

| Challenge | Threshold |
|---|---|
| `challenge_chop_1k` | 1000 |
| `challenge_chop_5k` | 5000 |
| `challenge_chop_50k` | 50000 |
| `challenge_axe_damage_1k` | 1000 |
| `challenge_axe_damage_10k` | 10000 |
| `challenge_axe_value_5k` | 5000 |
| `challenge_axe_value_50k` | 50000 |
| `challenge_leaves_500` | 500 |
| `challenge_leaves_5k` | 5000 |
| `challenge_axe_ground_smash_500` | 500 |
| `challenge_axe_chop_100` | 100 |
| `challenge_axe_chop_2500` | 2500 |
| `challenge_axe_dti_5k` | 5000 |
| `challenge_axe_leaf_5k` | 5000 |
| `challenge_axe_wood_vein_2500` | 2500 |
| `challenge_axe_log_swap_500` | 500 |
| `challenge_axe_throw_500` | 500 |
| `challenge_axe_throw_5k` | 5000 |
| `challenge_axe_sunder_500` | 500 |
| `challenge_axe_sunder_5k` | 5000 |
| `challenge_axe_cleave_1k` | 1000 |
| `challenge_axe_cleave_10k` | 10000 |
| `challenge_axe_bark_hide_2500` | 2500 |
| `challenge_axe_shield_splitter_250` | 250 |

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
