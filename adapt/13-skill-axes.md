---
title: "Skill - Axes"
description: "Axes XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T09:26:23.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Axes gains XP by breaking logs, wood, mushroom blocks, or mangrove roots with an axe and by dealing axe damage. Eleven adaptations cover tree cutting, wood and leaf vein mining, inventory drops, log conversion, thrown axes, area damage, armor shred, shield pressure, and absorption; Iris Feller registers only when the Iris tree-feller service is available.

## Earning XP

Breaking a log, wood, mushroom block, mangrove roots, or muddy mangrove roots block with an axe pays XP from that block's material value plus hardness and blast resistance, up to the configured caps. Damaging a living entity with an axe pays XP scaled to the damage dealt. Both share one cooldown. Blocks with zero hardness pay nothing, and blocks already paid by XP provenance do not pay again. Breaking leaves with an axe only increments `axes.leaves` and does not pay XP. `leavesMultiplier` does not change earnings.

## Player preferences

Every adaptation has an enable switch in the bottom settings row of its level screen. Server policy controls which choices are available; settings change only your player profile. Defaults preserve the standard behavior.

| Adaptation | Personal controls |
| --- | --- |
| Chop | Require sneaking for right-click chopping; full, half, or quarter of learned work per activation. |
| Drop to Inventory | Collect all permitted drops, logs/stems, saplings/propagules, or apples. |
| Ground Smash | Ignore passive mobs; require at least 5, 10, or 15 hunger before activation. |
| Cleave | Ignore passive mobs; exclude other players from secondary hits. |
| Iris Feller | Hold sneak or latch the run. A latched run starts with a sneak-break; sneak again, change the held slot, swap hands, or disconnect to stop. Keep 0, 5, 10, or 15 hunger after each full log cost. Full work adds no personal cap; half and quarter stop at 128 and 64 committed logs. Iris limits still apply. |
| Leaf Veinminer, Wood Veinminer | Activate while sneaking, while not sneaking, or always; use full, half, or quarter of the server block cap. |
| Throwing Axe | Require sneaking to throw; ignore passive mobs after ricochets. Direct intentional hits keep their normal targeting rules. |

Bark Hide, Craft Log Swap, Shield Splitter, and Sunder have the enable switch. Disabling a thrown axe effect does not discard its recovery record or return another copy of the axe. Felling stops before the next unpaid log; committed hunger and cooldown remain spent.

## Adaptations

Extra broken blocks use the player's own break action. A denied claim does not break.

### Axe Ground Smash (`axe-ground-smash`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-ground-smash-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-ground-smash-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 8 knowledge, then 6 per level

With a main-hand axe, jump, hold sneak in the air, and land while still sneaking to damage and launch nearby living entities. Releasing sneak, or landing after the arm expires, cancels it. When `ignore passiveMobs` is true, neutral mobs stay excluded even if provoked.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from smash damage and launch. |
| `falloffFactor` | `3` | Curve exponent for how fast damage and force drop off with distance. Higher concentrates the hit near the center. |
| `radiusLevelFactorMultiplier` | `8` | Blocks of smash radius added across the full level range. |
| `damageLevelFactorMultiplier` | `8` | Health points of center damage added across the full level range. |
| `forceFactorMultiplier` | `1.15` | Launch velocity added across the full level range. |
| `forceBase` | `0.27` | Launch velocity applied at level 1. |
| `cooldownTicksBase` | `80` | Cooldown in ticks at max level. |
| `cooldownTicksInverseLevelMultiplier` | `225` | Extra cooldown ticks at level 1, removed as you level. |

### Axe Chop (`axe-chop`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-chop-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-chop-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 2 knowledge, then 3 per level

Right-click a log with a main-hand axe to remove the top log of the column above the clicked block, once per adaptation level.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `rangeLevelMultiplier` | `5` | Blocks of column height searched per level when finding the top log. |
| `cooldownTicksBase` | `15` | Item cooldown in ticks at max level. |
| `cooldownTicksInverseLevelMultiplier` | `16` | Extra item cooldown ticks at level 1, removed as you level. |
| `damagePerBlockBase` | `1` | Durability spent per log at max level. |
| `damagePerBlockInverseLevelMultiplier` | `4` | Extra durability per log at level 1, removed as you level. |

### Axe Drop-To-Inventory (`axe-drop-to-inventory`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-drop-to-inventory-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-drop-to-inventory-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 3 knowledge

Logs and leaves broken with an axe go into the inventory. Drops blocked by protection stay on the ground. Overflow drops at the feet with a fail sound. No adaptation-specific config keys.

### Leaf-miner (`axe-leaf-veinminer`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-leaf-veinminer-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-leaf-veinminer-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 1 knowledge, then 6 per level

Sneak-break a leaf with a main-hand axe to break connected leaves of the same type in range. Mangrove roots and muddy mangrove roots count as leaves. The axe must still be held when the chain runs. Blocks the player cannot break stay in place and do not count toward the stat.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `baseRange` | `5` | Blocks of chain radius before level is added. Effective radius is level plus this. |
| `maxBlocks` | `128` | Hard cap on leaves taken by one chain. |

### Iris Feller (`axe-iris-feller`)

3 levels · 4 knowledge, then 3 per level

Registers only when Iris is installed. Sneak-break an Iris tree log with a main-hand axe to erode the tree while sneak and that same axe stay held. A refused break spends nothing, and the cooldown starts once Iris accepts the run. Durability preservation is 0 percent at level 1, 25 percent at level 2, and 75 percent at level 3 or higher. `maxLevel` stays configurable.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `hungerCost` | `2` | Hunger points reserved per log and spent only after that log actually comes out. Clamped to 0 through 20. 0 disables the cost. |
| `cooldownSeconds` | `30` | Seconds before another fell can be accepted. 0 disables the cooldown. |

### Wood-miner (`axe-wood-veinminer`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-wood-veinminer-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-wood-veinminer-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

Sneak-break a log or wood block with a main-hand axe to break matching blocks in range. Planks do not match. Blocks the player cannot break are skipped. Drops still follow Drop-To-Inventory when that adaptation is learned.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `maxBlocks` | `20` | Hard cap on logs taken by one chain. |
| `baseRange` | `3` | Blocks of chain radius before level is added. Effective radius is level plus this. |

### Lucy's Log-Swapper (`axe-logswap`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-logswap-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-logswap-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 2 knowledge

Shapeless crafting turns eight logs of one type plus one sapling into eight logs of that sapling's tree. Up to 70 recipes are registered in the `adapt` namespace as `axe-swap<from><to>`. Cherry and pale oak entries are skipped when those materials do not exist. `permanent` defaults to `true`, unlike the other Axes adaptations, so it cannot be unlearned. No adaptation-specific config keys.

### Throwing Axe (`axe-throwing-axe`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-throwing-axe-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-throwing-axe-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 5 knowledge

Left-click air with a main-hand axe to throw it. The axe leaves the inventory, and the throw also starts an item cooldown on that axe type. A left-click on a block does not throw, and the swing immediately after an axe block break is ignored. When `ignore passiveMobs` is true, provoked neutral mobs stay excluded from ricochets.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from ricochet hits; the initial aimed throw is unchanged. |
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

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-sunder-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-sunder-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Each axe hit strips armor and a share of armor toughness, stacking up to the cap.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-cleave-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-cleave-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 6 knowledge, then 5 per level

An axe hit also damages other living entities in a forward cone. Armor stands are skipped. A target already cleaved by that swing is not hit again. When `ignore passiveMobs` is true, provoked neutral mobs stay excluded from secondary hits.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `ignorePassiveMobs` | `false` | Exclude passive and neutral mobs from secondary cleave damage; the directly struck target is unchanged. |
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

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-bark-hide-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-bark-hide-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Each log broken with an axe adds one absorption stack. One stack is 4 absorption points, or 2 hearts. Death clears the stored absorption. The next chop starts it again.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `absorptionCapBase` | `1` | Stack cap at level 1. |
| `absorptionCapFactor` | `3` | Extra stack cap added across the full level range. |
| `gracePeriodTicksBase` | `100` | Ticks the absorption survives after your last chop at level 1. Never less than 20. |
| `gracePeriodTicksFactor` | `200` | Extra grace ticks added across the full level range. |
| `xpPerStack` | `2` | Skill XP each time a fresh stack is added. |

### Shield Splitter (`axe-shield-splitter`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/axes/axe-shield-splitter-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/axes/axe-shield-splitter-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge

An axe hit against an actively blocking target deals bonus damage. A player shield stays disabled for at least the configured duration, including after a vanilla axe shield break, and a longer existing cooldown is kept. At maximum level the default duration is 120 ticks (6 seconds). Mobs that raise a shield also take the bonus damage.

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

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
