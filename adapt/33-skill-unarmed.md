---
title: "Skill - Unarmed"
description: "Unarmed XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T09:26:24.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Unarmed gains XP from attacks with no melee tool in the main hand; axes, pickaxes, hoes, shovels, swords, tridents, spears, and maces disable the skill, other items still count, and some adaptations also require an empty off hand. Its 12 adaptations add punch damage, sprint charges, combos, disarms, slowing, shockwaves, block breaking, grappling, recovery, and meditation; Glass Cannon scales with worn armor, and Meditation requires empty hands.

## How you earn Unarmed XP

Every hit with a non-melee main hand adds 1 to `unarmed.hits` and the raw damage to `unarmed.damage`, then pays `damageXPMultiplier` times that damage. Payouts wait on `cooldownDelay`.

A hit while falling (fall distance above zero and not on the ground) adds to `unarmed.critical`. A hit above 6 damage adds to `unarmed.heavy`. A kill while not holding a melee tool adds to `unarmed.kills`.

Nothing is credited when the victim is already dead or invulnerable, or when you are invulnerable.

## Player preferences

Every adaptation has an enable switch in the bottom settings row of its level screen. Server policy controls which choices are available; settings change only your player profile. Defaults preserve the standard behavior.

| Adaptation | Personal controls |
| --- | --- |
| Battering Charge | Use fists, a shield, or either; optionally require a sneak-right-click in air to arm the next charge for five seconds. |
| Disarm | Exclude players when the server otherwise permits them; independently disable mob armor disarming. |
| Grapple | Restrict targets to all permitted entities, hostile mobs, or non-player entities; release with either sneak release or another punch, or require another punch. |
| Iron Fists | Toggle combat damage and soft-block breaking independently. |
| Meditation | Use automatic sneaking or require the separate armed toggle. Stillness and empty hands remain required. |
| Shockwave Clap | Require being airborne; keep 0, 5, or 10 hunger after the full clap cost; restrict targets. |

Combo Chain, Glass Cannon, Pressure Point, Second Wind, Sucker Punch, and Power have the enable switch. Changing Grapple preferences releases an unthrown grab, while already committed throws retain their exhaustion and cooldown costs.

## Adaptations

"Bare hands" means neither hand holds a melee tool. Blocks and other junk items are fine.

### Sucker Punch (`unarmed-sucker-punch`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-sucker-punch-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-sucker-punch-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 2 per level

A sprinting punch with the main hand exactly `AIR` multiplies damage. XP is 6.221 times the resulting damage, plus 0.42 times that damage when the punch exceeds 5, and a kill whose final damage was at least the victim's max health counts as a one-punch kill.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `baseDamage` | `0.2` | Fraction added to your damage at level percent 0, applied as a multiplier of 1 plus this value. |
| `damageFactor` | `0.55` | Extra fraction at full level percent. |

### Unarmed Power (`unarmed-power`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-power-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-power-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 6 knowledge, then 3 per level

While neither hand holds a melee tool, attack damage gains a `MULTIPLY_SCALAR_1` modifier of level percent times `damageFactor`, reapplied when your hands change. XP per hit is 0.321 times level percent times damage.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageFactor` | `2.57` | Attack-damage multiplier reached at full level percent. |

### Glass Cannon (`unarmed-glass-cannon`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-glass-cannon-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-glass-cannon-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 6 knowledge, then 3 per level

With no armor, damage is `damage * (maxDamageFactor + level * maxDamagePerLevelMultiplier)` plus `perLevelBonusMultiplier` per learned level; with any armor, damage is `damage - (damage * armor)` plus that same flat bonus, and both branches keep the higher of the result and the original damage. Armor is Adapt's fraction summed across the four slots; a leather helmet is 0.04, an iron helmet is 0.08, and a diamond helmet is 0.12.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `perLevelBonusMultiplier` | `0.25` | Flat health points of bonus damage per learned level, added in both branches. |
| `maxDamageFactor` | `4.0` | Damage multiplier at zero armor before the per-level term. |
| `maxDamagePerLevelMultiplier` | `0.15` | Extra zero-armor multiplier per learned level. |

### Battering Charge (`unarmed-battering-charge`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-battering-charge-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-battering-charge-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

A sprinting hit with empty hands, or with a shield in either hand, adds flat damage and knockback along your look; the movement sample must be under 750 ms old, so a sprint flag while standing still does not count. A shield shows the cooldown on that item, fists use an internal cooldown, and riding disables the charge.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageBase` | `0.5` | Flat health points added to the impact at level percent 0. |
| `damageFactor` | `4.2` | Extra flat damage at full level percent. |
| `knockbackBase` | `0.5` | Velocity added to the target along your look direction at level percent 0. |
| `knockbackFactor` | `1.2` | Extra knockback velocity at full level percent. |
| `cooldownTicksBase` | `80` | Ticks between charges at level percent 0. |
| `cooldownTicksFactor` | `50` | Ticks removed at full level percent, floored at 10. |
| `minimumVelocitySquared` | `0.05` | Squared horizontal blocks per tick you must actually be moving. Sprinting is roughly 0.08. |
| `xpPerDamage` | `3.3` | Unarmed XP per point of the resulting hit damage. |
| `primedTrailIntervalMillis` | `120` | Milliseconds between dust puffs while the charge is primed. |

### Combo Chain (`unarmed-combo-chain`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-combo-chain-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-combo-chain-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

6 levels · 4 knowledge, then 3 per level

Only the main hand is checked: consecutive punches add stacks of bonus damage, and a missed swing after the grace window clears the chain.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxStacksBase` | `2` | Stack ceiling at level percent 0. |
| `maxStacksFactor` | `8` | Extra stack ceiling at full level percent. |
| `damagePerStackBase` | `0.2` | Flat health points of bonus damage per stack at level percent 0. |
| `damagePerStackFactor` | `0.85` | Extra damage per stack at full level percent. |
| `comboWindowMillisBase` | `1300` | Milliseconds allowed between hits at level percent 0. |
| `comboWindowMillisFactor` | `1400` | Extra window milliseconds at full level percent, floored at 250. |
| `missResetGraceMillis` | `280` | Milliseconds after a hit during which a whiffed swing does not break the chain. |
| `xpPerBonusDamage` | `4.1` | Unarmed XP per point of combo bonus damage dealt. |

### Disarm (`unarmed-disarm`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-disarm-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-disarm-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 4 per level

A bare-hand hit can knock the target's main-hand item to the ground, or an off-hand shield if the main hand is empty. Players never lose armor, and skeletal servants are never disarmed.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `allowDisarmPlayers` | `true` | False limits disarms to mobs. |
| `mobArmorDropChance` | `0.5` | Chance a successful disarm on a mob also knocks off one worn armor piece, 0-1. |
| `chanceBase` | `0.04` | Disarm chance per hit at level percent 0, 0-1. |
| `chanceFactor` | `0.18` | Extra chance at full level percent, capped at 1. |
| `pickupDelayTicks` | `60` | Ticks before anyone can pick the knocked item back up. |
| `targetCooldownMillis` | `8000` | Milliseconds before the same target can be disarmed again. |
| `xpPerDisarm` | `28` | Unarmed XP per successful disarm. |

### Pressure Point (`unarmed-pressure-point`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-pressure-point-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-pressure-point-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

Bare-hand hits apply Slowness, and Weakness once it is unlocked, raising the current amplifier by one up to the cap and refreshing the duration.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxSlownessAmplifierBase` | `0` | Highest Slowness amplifier at level percent 0. |
| `maxSlownessAmplifierFactor` | `2` | Extra amplifier headroom at full level percent. |
| `slownessDurationTicks` | `60` | Ticks of Slowness applied per strike. |
| `weaknessUnlockPercent` | `0.6` | Level percent at which Weakness starts being applied too. |
| `maxWeaknessAmplifier` | `1` | Highest Weakness amplifier once unlocked. |
| `weaknessDurationTicks` | `50` | Ticks of Weakness applied per strike. |
| `xpPerStrike` | `3.1` | Unarmed XP per strike. |

### Shockwave Clap (`unarmed-shockwave-clap`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-shockwave-clap-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-shockwave-clap-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 6 knowledge, then 5 per level

With both hands free of tools, sneak and left-click air or a block to shove entities in a cone backward and upward, dealing no damage. Hunger is spent before targets are resolved, and your pets are never thrown.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `rangeBase` | `3.5` | Cone reach in blocks at level percent 0. |
| `rangeFactor` | `3` | Extra reach in blocks at full level percent. |
| `forceBase` | `0.8` | Outward velocity applied to each target at level percent 0. |
| `forceFactor` | `1.2` | Extra outward velocity at full level percent. |
| `upwardForceBase` | `0.25` | Upward velocity component at level percent 0. |
| `upwardForceFactor` | `0.2` | Extra upward velocity at full level percent. |
| `coneDotThreshold` | `0.45` | Dot product against your look direction a target must exceed. Lower widens the cone. |
| `cooldownMillisBase` | `10000` | Milliseconds between claps at level percent 0. |
| `cooldownMillisFactor` | `6000` | Milliseconds removed at full level percent, floored at 1000. |
| `hungerCost` | `2` | Food points spent per clap. The clap fails if you have less. |
| `xpPerTargetHit` | `14` | Unarmed XP per target actually knocked back. |
| `maxCandidatesPerActivation` | `16` | Nearby living entities inspected per clap, hard-capped at 32. |
| `maxAffectedPerActivation` | `12` | Targets knocked back per clap, hard-capped at 16 and by the candidate limit. |
| `maxTargetFxPerActivation` | `8` | Knocked-back targets that get their own cloud particles, hard-capped at 12. |

### Iron Fists (`unarmed-iron-fists`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-iron-fists-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-iron-fists-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

Bare-hand hits deal flat bonus damage. Punching dirt, sand, leaves, or any block at or under the softness threshold applies a block-break-speed modifier of `0.2 * (amplifier + 1)`, not a Haste potion.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageBase` | `0.5` | Flat health points added per hit at level percent 0. |
| `damageFactor` | `2.5` | Extra flat damage at full level percent. |
| `softBlockMaxHardness` | `0.8` | Highest block hardness that still counts as soft. |
| `hasteDurationTicks` | `25` | Ticks the mining buff lasts after each punch. 0 disables it. |
| `hasteAmplifierFactor` | `2` | Amplifier reached at full level percent. |
| `xpPerHit` | `2.4` | Unarmed XP per bare-hand hit. |

### Grapple (`unarmed-grapple`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-grapple-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-grapple-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 6 knowledge, then 5 per level

With both hands free of tools, sneak-punch to grab a target, then punch again or release sneak to throw it along your look; players can be grabbed when PvP policy allows, and bosses cannot. The cooldown is spent on the hurl, not the grab, and you get one hurl per second.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `forceBase` | `0.9` | Throw velocity along your look direction at level percent 0. |
| `forceFactor` | `1.4` | Extra throw velocity at full level percent. |
| `upwardBoost` | `0.2` | Upward velocity component at level percent 0. |
| `upwardBoostFactor` | `0.25` | Extra upward component at full level percent. |
| `maxHurlRange` | `6` | Blocks the target may be from you when the hurl resolves, or it is cancelled. |
| `grabTimeoutMillis` | `5000` | Milliseconds an unused grab stays held. |
| `cooldownMillisBase` | `9000` | Milliseconds between grapples at level percent 0. |
| `cooldownMillisFactor` | `5000` | Milliseconds removed at full level percent, floored at 1000. |
| `exhaustionPerThrow` | `2.0` | Exhaustion added to you per throw. 0 disables the cost. |
| `xpPerHurl` | `32` | Unarmed XP per throw. |

### Second Wind (`unarmed-second-wind`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-second-wind-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-second-wind-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 3 per level

A direct bare-hand kill on a non-player mob restores hunger and saturation and starts Regeneration. Friendly targets, including your pets, are skipped, food is clamped to 20, and saturation is clamped to your current food level.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `foodRestoreBase` | `1` | Food points restored per kill at level percent 0. |
| `foodRestoreFactor` | `4` | Extra food points at full level percent. |
| `saturationRestore` | `1.5` | Saturation restored per kill. |
| `regenDurationTicksBase` | `40` | Ticks of Regeneration at level percent 0. |
| `regenDurationTicksFactor` | `80` | Extra ticks at full level percent, floored at 20. |
| `regenAmplifier` | `0` | Amplifier of the Regeneration burst. |
| `cooldownMillis` | `3000` | Milliseconds between triggers. |
| `xpPerSecondWind` | `18` | Unarmed XP per trigger. |

### Meditation (`unarmed-meditation`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/unarmed/unarmed-meditation-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/unarmed/unarmed-meditation-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 4 per level

With both hands completely empty, after the combat lockout, sneak and stand still to gain absorption once per second up to the cap. Moving, releasing sneak, picking an item up, or dealing or taking a hit ends it.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `absorptionCapBase` | `2` | Absorption health points you can hold at level percent 0. |
| `absorptionCapFactor` | `10` | Extra absorption cap at full level percent. |
| `gainPerPulse` | `0.5` | Absorption health points gained each second while meditating. |
| `combatLockoutMillis` | `8000` | Milliseconds after any combat before meditation can resume. |
| `stationaryEpsilonSquared` | `0.01` | Squared blocks of drift per pulse still treated as standing still. |
| `xpPerPulse` | `1.2` | Silent Unarmed XP per pulse. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/unarmed.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole Unarmed skill on or off. |
| `skillColor` | `"&e"` | Legacy ampersand color code used for Unarmed in menus and text. |
| `damageXPMultiplier` | `4.5` | Skill XP per point of damage you deal without a melee tool. |
| `cooldownDelay` | `1250` | Milliseconds between XP awards for unarmed damage. |
| `challengeUnarmedReward` | `500` | Knowledge paid by the hit-count challenges. |
| `challengeUnarmedDmgReward` | `500` | Knowledge paid by the damage challenges. |
| `challengeUnarmedKillsReward` | `750` | Knowledge paid by the kill challenges. |
| `challengeUnarmedCritReward` | `750` | Knowledge paid by the falling-hit challenges. |
| `challengeUnarmedHeavyReward` | `750` | Knowledge paid by the heavy-hit challenges. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_unarmed_100` | 100 | `challengeUnarmedReward` |
| `challenge_unarmed_1k` | 1000 | `challengeUnarmedReward` x 2 |
| `challenge_unarmed_10k` | 10000 | `challengeUnarmedReward` x 5 |
| `challenge_unarmed_dmg_1k` | 1000 | `challengeUnarmedDmgReward` |
| `challenge_unarmed_dmg_10k` | 10000 | `challengeUnarmedDmgReward` x 3 |
| `challenge_unarmed_kills_25` | 25 | `challengeUnarmedKillsReward` |
| `challenge_unarmed_kills_250` | 250 | `challengeUnarmedKillsReward` x 3 |
| `challenge_unarmed_crit_25` | 25 | `challengeUnarmedCritReward` |
| `challenge_unarmed_crit_250` | 250 | `challengeUnarmedCritReward` x 3 |
| `challenge_unarmed_heavy_25` | 25 | `challengeUnarmedHeavyReward` |
| `challenge_unarmed_heavy_250` | 250 | `challengeUnarmedHeavyReward` x 3 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
