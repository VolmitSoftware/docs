---
title: "Skill - Blocking"
description: "Blocking XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T01:02:13.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Blocking gains XP when damage is taken while a shield is raised. Its 14 adaptations cover timed guards, counters, projectile reflection, stationary defense, armor repair, ally protection, shield recovery, Multi-Armor, and recipes for chainmail, saddles, horse armor, and an upgraded shield.

## Earning XP

Each hit taken while blocking pays a flat XP award on a shared cooldown. The hit records blocked hits, blocked damage, projectile versus melee, and a heavy hit when one blow is more than 5 damage. If `passiveXpForUsingShield` is above zero, each skill tick also pays that amount for a shield in either hand, scaled by elapsed time, and the award is silent.

## Player preferences

Every adaptation has an enable switch in the bottom settings row of its level screen. Server policy controls which choices are available; settings change only your player profile. Defaults preserve the standard behavior.

| Adaptation | Personal controls |
| --- | --- |
| Bastion Stance | Require sneak-blocking or activate whenever blocking. |
| Bulwark Bash | Require sneaking during the jumping bash; ignore passive mobs or exclude players. Sprint first, then jump and sneak for the stricter gesture. |
| Counter Guard | Exclude players from retaliation. |
| Interpose | Protect all permitted nearby players or only the same scoreboard team; keep 0%, 25%, or 50% shield durability after the full redirect cost. |
| Mirror Block | Exclude projectiles shot by players from reflection. Excluded projectiles follow ordinary blocking and damage rules. |
| Multi Armor | Enable ground and falling swaps independently; trigger falling swaps after 4, 8, or 12 blocks. |
| Perfect Guard | Disable retaliatory stagger while retaining the timed block. |
| Shield Wall | Protect all permitted nearby players or only the same scoreboard team. |
| Shieldbearer's Resolve | Toggle resistance and faster shield recovery independently. |
| Tempered Guard | Toggle shield and armor repair independently. |

The armor, saddle, and phalanx crafting adaptations have the enable switch. Disabling Multi Armor preserves merged item contents. Personal reserve checks decline the whole action; accepted effects retain their existing costs and cooldowns.

## Adaptations

Damage to another entity also runs the normal PvP and PvE checks.

### Multi-Armor (`blocking-multiarmor`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-multiarmor-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-multiarmor-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 3 knowledge

Left-click an elytra onto a chestplate, or the reverse, to merge them. One of the two items must be an elytra. Worn, the item is a chestplate on the ground and becomes an elytra once fall distance passes 4 blocks. Swaps are limited to once every 3000 ms. Sneak-drop returns both parts with names, enchantments, and damage. A MultiArmor lore tag marks the merge. Destroying the merged item destroys its contents.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `startingSlots` | `1` | Items that can be merged into one MultiArmor before level is added. The cap is this plus your level. |

### Chains of Mephistopheles (`blocking-chainarmorer`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-chainarmorer-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-chainarmorer-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 1 knowledge

Adds the four vanilla armor shapes as `blocking-chainarmorer-helmet`, `blocking-chainarmorer-chestplate`, `blocking-chainarmorer-leggings`, and `blocking-chainarmorer-boots`, all from `IRON_NUGGET`. `permanent` defaults to `true`, so learning it cannot be undone. No adaptation-specific config keys.

### Craftable Saddle (`blocking-saddlecrafter`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-saddlecrafter-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-saddlecrafter-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 1 knowledge

Adds `blocking-saddlecrafter`: five `LEATHER` shaped `I I` over `III`. `permanent` defaults to `true`, so learning it cannot be undone. No adaptation-specific config keys.

### Craftable Horse Armor (`blocking-horsearmorer`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-horsearmorer-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-horsearmorer-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

1 level · 1 knowledge

Adds `blocking-horsearmorerleather`, `blocking-horsearmoreriron`, `blocking-horsearmorergold`, and `blocking-horsearmorerdiamond`: a center `SADDLE` ringed by eight `LEATHER`, `IRON_INGOT`, `GOLD_INGOT`, or `DIAMOND`. `permanent` defaults to `true`, so learning it cannot be undone. No adaptation-specific config keys.

### Counter Guard (`blocking-counter-guard`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-counter-guard-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-counter-guard-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 5 per level

Each hit blocked with a shield adds a counter stack. A later incoming hit can spend stacks and damage the attacker. Projectile hits reflect onto the shooter, not the projectile. Stack gains and spends show `Counter Guard current/max` on the action bar.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `baseStacks` | `2` | Stack cap at level 1. |
| `stackFactor` | `8` | Extra stack cap added across the full level range. |
| `reflectChanceBase` | `0.08` | Chance per incoming hit to reflect at level 1, 0 to 1. |
| `reflectChanceFactor` | `0.27` | Extra reflect chance added across the full level range. |
| `maxReflectChance` | `0.6` | Ceiling on reflect chance no matter the level. |
| `baseReflectDamage` | `1` | Health points reflected at level 1 before the per-stack bonus. |
| `reflectDamageFactor` | `3.5` | Extra reflected health points added across the full level range. |
| `damagePerStack` | `0.28` | Extra reflected health points per stack you currently hold. |
| `stackCostOnReflect` | `1` | Stacks spent per reflect. |
| `xpPerReflectedDamage` | `5.0` | Skill XP per health point reflected. |

### Bastion Stance (`blocking-bastion-stance`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-bastion-stance-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-bastion-stance-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Sneak while standing still and blocking with a shield in either hand to hold knockback resistance and reduced projectile damage. The shield may be raised before or after sneak starts. The stance drops when sneak stops, blocking stops, the shield is gone, or the mode leaves Survival or Adventure. Knockback resistance is applied as `KNOCKBACK_RESISTANCE` and `EXPLOSION_KNOCKBACK_RESISTANCE` attribute modifiers.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `knockbackReductionBase` | `0.18` | Knockback resistance at level 1, 0 to 1. |
| `knockbackReductionFactor` | `0.52` | Extra knockback resistance added across the full level range. |
| `maxKnockbackReduction` | `0.75` | Ceiling on knockback resistance. |
| `projectileReductionBase` | `0.12` | Fraction of projectile damage removed at level 1. |
| `projectileReductionFactor` | `0.5` | Extra projectile damage reduction added across the full level range. |
| `maxProjectileReduction` | `0.7` | Ceiling on projectile damage reduction. |
| `projectileNegateChanceBase` | `0.05` | Chance to cancel a projectile hit outright at level 1, 0 to 1. |
| `projectileNegateChanceFactor` | `0.22` | Extra negate chance added across the full level range. |
| `maxProjectileNegateChance` | `0.35` | Ceiling on negate chance. |
| `xpPerMitigatedDamage` | `2.5` | Skill XP per health point of projectile damage removed. |
| `xpOnNegate` | `8.0` | Skill XP for a full projectile negate. |

### Mirror Block (`blocking-mirror-block`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-mirror-block-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-mirror-block-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

While blocking with a shield, an incoming projectile can be sent back at its shooter. A projectile that was already reflected cannot be reflected again.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `reflectChanceBase` | `0.1` | Chance to reflect an incoming projectile at level 1, 0 to 1. |
| `reflectChanceFactor` | `0.35` | Extra reflect chance added across the full level range. |
| `maxReflectChance` | `0.7` | Ceiling on reflect chance. |
| `reflectedDamageFactorBase` | `0.45` | Fraction of the original damage the reflected shot carries at level 1. |
| `reflectedDamageFactorIncrease` | `0.35` | Extra damage fraction added across the full level range. |
| `maxReflectedDamageFactor` | `0.95` | Ceiling on reflected damage fraction. |
| `reflectVelocityFactorBase` | `0.42` | Fraction of the original speed the reflected shot flies at, at level 1. |
| `reflectVelocityFactor` | `0.45` | Extra speed fraction added across the full level range. |
| `maxReflectVelocityFactor` | `1.1` | Ceiling on reflected speed fraction. |
| `cooldownMillisBase` | `2000` | Milliseconds between reflects at level 1. |
| `cooldownMillisFactor` | `1200` | Milliseconds of that cooldown removed at max level. |
| `minReflectedVelocitySquared` | `0.08` | Squared speed below which the incoming shot is too slow to bounce meaningfully. |
| `fallbackReflectedSpeed` | `0.95` | Speed given to a reflected shot when the incoming velocity was under that threshold. |
| `xpOnReflect` | `8` | Skill XP per projectile reflected. |

### Bulwark Bash (`blocking-bulwark-bash`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-bulwark-bash-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-bulwark-bash-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

With a shield in the off hand and not on cooldown, sprint, jump, and strike while falling. Only the struck entity takes bonus damage. Other entities in range are knocked back and slowed. The bash starts the shield cooldown.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `baseDamage` | `1.0` | Health points added to the primary hit before the level bonus. |
| `damageBonusBase` | `0.3` | Extra health points on the primary hit at level 1. |
| `damageBonusFactor` | `2.2` | Extra health points added across the full level range. |
| `rangeBase` | `2.4` | Shockwave radius in blocks at level 1. |
| `rangeFactor` | `1.8` | Extra radius in blocks added across the full level range. |
| `knockbackBase` | `0.6` | Horizontal launch strength at level 1. |
| `knockbackFactor` | `0.6` | Extra horizontal launch added across the full level range. |
| `upwardKnockbackBase` | `0.18` | Vertical launch strength at level 1. |
| `upwardKnockbackFactor` | `0.14` | Extra vertical launch added across the full level range. |
| `stunTicksBase` | `18` | Slowness duration in ticks at level 1. Never less than 10. |
| `stunTicksFactor` | `24` | Extra slowness ticks added across the full level range. |
| `stunAmplifierBase` | `2` | Slowness amplifier at level 1. |
| `stunAmplifierFactor` | `1` | Extra amplifier added across the full level range. |
| `cooldownTicksBase` | `220` | Shield cooldown in ticks applied at level 1. Never less than 20. |
| `cooldownTicksFactor` | `120` | Ticks of that cooldown removed at max level. |
| `minFallDistanceForCrit` | `0.08` | Blocks you must have fallen for the hit to count as a jump crit. |
| `recentSprintWindowMillis` | `900` | How long after you stop sprinting the bash still counts you as sprinting. |
| `xpPerTargetHit` | `8` | Skill XP per target affected by the bash. |
| `maxCandidatesPerActivation` | `16` | Nearby living entities inspected per bash. |
| `maxAffectedPerActivation` | `12` | Targets actually affected per bash, primary included. |
| `maxTargetFxPerActivation` | `6` | Affected targets that get their own impact particles. |

### Shield Wall (`blocking-shield-wall`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-shield-wall-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-shield-wall-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

While blocking, projectile damage to players behind the shield is reduced for blockers in range, inside the arc, and facing the shot. The strongest reduction wins. Only players are covered, and the XP goes to the blocker.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `rangeBase` | `3.0` | Blocks between blocker and ally allowed at level 1. |
| `rangeFactor` | `4.0` | Extra range in blocks added across the full level range. |
| `arcDegreesBase` | `60` | Width of the protection cone in degrees at level 1. |
| `arcDegreesFactor` | `90` | Extra cone degrees added across the full level range. |
| `damageReductionBase` | `0.18` | Fraction of the projectile's damage removed at level 1. |
| `damageReductionFactor` | `0.5` | Extra damage reduction added across the full level range. |
| `maxDamageReduction` | `0.6` | Ceiling on damage reduction. |
| `minFacingAlignment` | `0.1` | How squarely the blocker must face into the incoming shot to count. |
| `xpPerDamageShielded` | `3.0` | Skill XP per health point of damage taken off the ally. |

### Perfect Guard (`blocking-perfect-guard`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-perfect-guard-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-perfect-guard-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 4 per level

Raising a shield inside the parry window, facing the incoming melee or projectile hit, cancels that hit. A living attacker that can be damaged is slowed and knocked back.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillisBase` | `120` | Milliseconds after raising the shield in which a hit is parried, at level 1. |
| `windowMillisFactor` | `240` | Extra window milliseconds added across the full level range. |
| `staggerTicksBase` | `20` | Slowness duration in ticks put on the attacker at level 1. |
| `staggerTicksFactor` | `40` | Extra stagger ticks added across the full level range. |
| `staggerAmplifierBase` | `1` | Slowness amplifier at level 1. |
| `staggerAmplifierFactor` | `2` | Extra amplifier added across the full level range. |
| `staggerKnockback` | `0.55` | Shove strength applied to the staggered attacker. |
| `minFacingAlignment` | `0.15` | How squarely you must face the attacker for the parry to count. |
| `cooldownMillis` | `1500` | Milliseconds between successful parries. |
| `xpOnNegate` | `14` | Skill XP per hit negated. |

### Tempered Guard (`blocking-tempered-guard`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-tempered-guard-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-tempered-guard-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 4 per level

When a blocked hit spends shield durability, a roll may repair the shield first, then the first damaged armor piece.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `repairChanceBase` | `0.15` | Chance per blocked hit to repair something at level 1, 0 to 1. |
| `repairChanceFactor` | `0.4` | Extra repair chance added across the full level range. |
| `maxRepairChance` | `0.55` | Ceiling on repair chance. |
| `repairAmountBase` | `2` | Durability points restored per proc at level 1. |
| `repairAmountFactor` | `6` | Extra durability points added across the full level range. |
| `xpPerDurabilityRepaired` | `2.0` | Skill XP per durability point restored. |

### Shieldbearer's Resolve (`blocking-shieldbearers-resolve`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-shieldbearers-resolve-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-shieldbearers-resolve-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

An axe swing that puts the shield on cooldown grants Resistance and removes part of that cooldown. No recovery happens unless the attacker swung an axe and the shield actually entered cooldown.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `recoverySpeedBase` | `0.2` | Fraction of the remaining shield cooldown removed at level 1. |
| `recoverySpeedFactor` | `0.45` | Extra fraction removed across the full level range. |
| `maxRecoverySpeed` | `0.7` | Ceiling on how much of the cooldown can be removed. |
| `resistanceAmplifierBase` | `0` | Resistance amplifier granted at level 1. |
| `resistanceAmplifierFactor` | `2.2` | Extra amplifier added across the full level range. |
| `minResistanceTicks` | `40` | Shortest Resistance duration in ticks, whatever the cooldown was. |
| `minCooldownTicks` | `20` | Shortest shield cooldown the recovery can leave behind. |
| `reprocessGuardMillis` | `500` | Milliseconds before another disable can be processed, so one axe hit does not fire twice. |
| `xpOnResolve` | `12` | Skill XP per recovery. |

### Phalanx Crafter (`blocking-phalanx-crafter`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-phalanx-crafter-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-phalanx-crafter-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

2 levels · 2 knowledge, then 3 per level

Level 1 adds a shaped crafting-table recipe for an ordinary shield. Level 2 upgrades an existing shield into a Netherite-Reinforced Shield that blocks like a normal shield, has 1,200 maximum durability, is fully repaired, keeps the input enchantments and banner face, and uses a gold display name. Crafting the netherite recipe below level 2 is cancelled with a deny sound. Any existing banner base color or pattern, including an explicitly white face, is preserved. A shield with no banner face receives a black face with an orange border and a light-gray rhombus.

Level 1 field shield (`W` = white wool, `P` = oak planks, `I` = iron ingot):

```text
WWW
PIP
.P.
```

Level 2 reinforced shield (`N` = netherite ingot, `S` = any shield):

```text
.N.
NSN
.N.
```

Recipe keys are `blocking-phalanx-field-shield` (`WHITE_WOOL` x3 on top, `OAK_PLANKS` / `IRON_INGOT` / `OAK_PLANKS` in the middle, one `OAK_PLANKS` below center, giving a plain `SHIELD`) and `blocking-phalanx-netherite-shield` (four `NETHERITE_INGOT` around a `SHIELD`, level 2 only). No adaptation-specific config keys.

### Interpose (`blocking-interpose`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/blocking/blocking-interpose-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/blocking/blocking-interpose-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Sneak while blocking to pull part of a nearby ally's damage onto the shield instead of health. If several blockers qualify, the closest one takes it.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `redirectShareBase` | `0.22` | Fraction of the ally's damage pulled onto your shield at level 1. |
| `redirectShareFactor` | `0.4` | Extra redirect fraction added across the full level range. |
| `maxRedirectShare` | `0.6` | Ceiling on the redirect fraction. |
| `rangeBase` | `3.5` | Blocks between you and the ally allowed at level 1. |
| `rangeFactor` | `4.5` | Extra range in blocks added across the full level range. |
| `lowHealthThreshold` | `0.4` | Fraction of max health the ally must be at or below before Interpose fires. |
| `durabilityPerDamage` | `1.0` | Shield durability spent per health point redirected, rounded up, minimum 1. |
| `exhaustionPerRedirect` | `1.0` | Exhaustion added to you per redirect. |
| `xpPerDamageRedirected` | `3.0` | Skill XP per health point redirected. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/blocking.toml` on first load.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `enabled` | `true` | Turns the whole Blocking skill off when false. |
| `skillColor` | `"&8"` | Legacy ampersand color code used for this skill in menus and text. |
| `xpOnBlockedAttack` | `25` | Flat XP paid for each hit taken while blocking, subject to the cooldown below. |
| `challengeBlock1kReward` | `500` | XP paid by the smaller tier of each Blocking milestone pair, and by `challenge_block_5k`. |
| `challengeBlock5kReward` | `2000` | XP paid by the larger tier of each Blocking milestone pair. |
| `cooldownDelay` | `1500` | Milliseconds between blocked-hit XP awards. |
| `passiveXpForUsingShield` | `0` | XP per skill interval just for holding a shield in either hand. 0 turns it off. Awarded silently under the `blocking:shield-hold` source tag. |

### Challenges

| Challenge | Threshold |
|---|---|
| `challenge_block_1k` | 1000 |
| `challenge_block_5k` | 5000 |
| `challenge_block_50k` | 50000 |
| `challenge_block_dmg_1k` | 1000 |
| `challenge_block_dmg_10k` | 10000 |
| `challenge_block_proj_100` | 100 |
| `challenge_block_proj_1k` | 1000 |
| `challenge_block_melee_500` | 500 |
| `challenge_block_melee_5k` | 5000 |
| `challenge_block_heavy_50` | 50 |
| `challenge_block_heavy_500` | 500 |
| `challenge_blocking_multi_200` | 200 |
| `challenge_blocking_multi_5k` | 5000 |
| `challenge_blocking_chain_25` | 25 |
| `challenge_blocking_saddle_25` | 25 |
| `challenge_blocking_horse_armor_10` | 10 |
| `challenge_blocking_counter_500` | 500 |
| `challenge_blocking_bastion_500` | 500 |
| `challenge_blocking_mirror_100` | 100 |
| `challenge_blocking_bulwark_500` | 500 |
| `challenge_blocking_shieldwall_500` | 500 |
| `challenge_blocking_shieldwall_5k` | 5000 |
| `challenge_blocking_perfect_100` | 100 |
| `challenge_blocking_perfect_1k` | 1000 |
| `challenge_blocking_tempered_500` | 500 |
| `challenge_blocking_tempered_5k` | 5000 |
| `challenge_blocking_resolve_100` | 100 |
| `challenge_blocking_resolve_1k` | 1000 |
| `challenge_blocking_phalanx_25` | 25 |
| `challenge_blocking_interpose_250` | 250 |
| `challenge_blocking_interpose_2k` | 2000 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
