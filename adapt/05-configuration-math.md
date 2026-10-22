---
title: "Configuration Math"
description: "XP multipliers, progression curves, knowledge, and ability power"
published: true
date: 2026-10-22T22:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

XP settings are in `plugins/Adapt/adapt.toml`. A region that denies XP zeroes the award. `xpCurve` converts skill XP and master XP into levels.

## XP multiplier

```
eligible = baseXp
      * novelty
      * regionXpMultiplier
      * monotony
      * clamp(freshness + lineBoosts, 0.01, 1000)
      * clamp((1 + playerBoosts + globalBoosts) * permissionMultiplier, 0.01, 1000)
```

`eligible` is 0 when the region denies XP. The earning allowances below determine how much eligible XP is credited. `/adapt boost` and `/adapt global-boost` are player boosts. API boosts are line boosts. Both brackets clamp to 0.01 through 1000 and refresh about once a second. Visible, silent, spatial, and Unity awards follow this policy.

`[permissionXpMultipliers]`: `stack = false` uses the highest match. `stack = true` multiplies every match. Values below 1 reduce XP.

`xpIntegrity.pooledPayoutEnabled` holds credited awards until the pool is older than `pooledWindowMillis` or idle longer than `pooledIdleFlushMillis`. An award consumes its allowance once, when credited; flushing or saving the pool does not charge it again.

Collecting vanilla XP refreshes a single `+0.03` line boost for recently used skills for 10 seconds. Repeated pickups extend its duration. The rested login bonus uses time since the previous logout. Redeeming an Adapt experience orb credits its displayed face value without gameplay multipliers or earning allowances.

Line freshness falls while that skill is used and recovers while it is idle.

`[farmPrevention]` tracks skill pressure and, when `perActivityTracking` is true, activity pressure. The two multiply. Each award is priced using the decayed existing pressure, then adds pressure for subsequent awards. A `decayCurve` at or below 0 disables that tracker. The default floors are `0.08` and `0.12`.

## Provenance and novelty

Placed blocks are stamped for `placedBlockTtlMillis` and pay no harvest XP while the stamp lasts. Provenance follows piston moves and falling blocks. A break stamps the position for `replaceDenyTtlMillis`. Re-placing there inside that window pays nothing. Bonemealed growth uses `bonemealTtlMillis` and pays `bonemealHarvestMultiplier`.

Novelty is three multipliers. Spatial repeats reset after `spatialCellTtlMillis` idle. Activity variety depends on the frequencies in recent reward history; a dominant repeated activity receives less than an evenly varied history. Stillness multiplies the award by `stillnessFloorMultiplier` after a continuous run spanning `stillnessWindowMillis` and at least `stillnessMinEvents` awards. Positional movement beyond `stillnessEpsilon` or a world change restarts the run; turning the camera does not.

Novelty, pressure, and earning allowance usage are saved with the player profile. Reconnecting or reloading does not clear them. Pressure recovers with elapsed time; changing skills does not grant extra recovery.

Placing against your own block adds `min(adjacencyBonusMax, streak * adjacencyBonusPerStreak)`. A non-adjacent place halves the streak. The streak grows only while that cell is under the spatial cap and the bonus is under `adjacencyBonusMax`.

A crop cell harvested again before `fieldCycleMillis` pays from `fieldCycleFloorMultiplier` back to 1. The first harvest of a cell pays full.

## Adaptation use XP

`[adaptationXp]` adds `usageBaselineXp + (level - 1) * usageBaselineXpPerLevel` to a successful adaptation reward after `usageBaselineCooldownMillis` (minimum 250 ms). Adaptations with an explicit successful-use reward can pay this baseline on its own through reward key `adaptation:<id>:baseline-use`. The cooldown is saved per player and adaptation. Eligibility checks do not award XP. Baselines follow region policy, novelty, pressure, boosts, and earning allowances.

## Earning allowances

`[xpEarningLimits]` provides a per-skill allowance, a shared player allowance, and an absolute player allowance. Each permits an initial burst and refills continuously at its configured XP per minute. Skill and shared allowances count credited XP divided by the active multiplier, with that divisor clamped from 1 to `maximumAllowanceBoost`. The absolute allowance counts the full credited amount. Boosts can accelerate progression within these bounds.

Once more than half a skill or shared burst is used, a multiplier falls linearly from 1 toward 0.25. Credit is also limited to the remaining allowance. Exhausted allowances recover with elapsed time, including offline time. Switching sources, skills, or sessions cannot reset usage. Ordinary gameplay uses all three allowances; explicit administrative grants and redeemed experience orbs do not.

## Level curve

Default `xpCurve` is `ADAPT_BALANCED`:

```
xp(L) = 100 * L^2 + 1200 * L
L(xp) = (sqrt(1440000 + 400 * xp) - 1200) / 200
```

Level 1 is 1,300 XP. Level 10 is 22,000. Level 100 is 1,120,000. Other names are listed under Reference.

`experienceMaxLevel` defaults to 1000. On the one-second tick, XP past the cap grants 1 wisdom and sets that line to the XP for one level under the cap. Level lookups clamp to the cap.

## Master XP and power

On that tick, for each level `i` just left (`lastLevel <= i < level`):

```
knowledge += (i / 13) + 1
masterXp  += playerXpPerSkillLevelUpBase + (i * playerXpPerSkillLevelUpLevelMultiplier)
```

The step from 9 to 10 uses `i = 9`: 885 master XP and 1 knowledge. The step from 49 to 50 grants 2,645 master XP and 4 knowledge. Several levels in one tick each run once.

```
maxPower  = max(0, floor(masterLevel * powerPerLevel) + regionPowerBonus)
usedPower = sum of learned adaptation levels that are not region-granted
```

`regionPowerBonus` is the current WorldGuard `adapt-power-bonus`. It is not saved. See [Protection and region policy](/adapt/08-protection-region-policy).

If max power falls below used power, the lowest learned adaptation levels are removed until it fits. Nothing is refunded. Region grants cost no power and are not removed. `/adapt debug mode` skips the power check, knowledge spend, and that removal.

## Reference

### Progression keys

| Key | Default | What it does |
|---|---:|---|
| `xpCurve` | `ADAPT_BALANCED` | Curve family used by every skill line and by master level |
| `experienceMaxLevel` | `1000` | Skill level cap. Lookups clamp to this value |
| `playerXpPerSkillLevelUpBase` | `489` | Flat master XP per skill level crossed |
| `playerXpPerSkillLevelUpLevelMultiplier` | `44` | Extra master XP per level already reached |
| `powerPerLevel` | `0.65` | Power per master level, truncated to a whole number |

### Curve families

Accepted values for `xpCurve`. `ADAPT_BALANCED` is the default.

```
ADAPT_BALANCED  LINEAR_EXPONENTIAL_1  LINEAR_EXPONENTIAL_2  LINEAR_EXPONENTIAL_3
QLOG  ELIN  CUBRT  HYPER  SIGM  SKYRIM  WOW
X1D2  X1D5  X2  X3  X4  X5  X6  X7
L1K  L4K  L8K  L16K
XL05L7  XL1L7  XL15L7  XL2L7  XL3L7  XL4L7  XL5L7  XL6L7  XL7L7  XL8L7  XL9L7
XL20L7  XL40L7  XL80L7  XL100L7  XL160L7
```

### `[farmPrevention]`

| Key | Default | What it does |
|---|---:|---|
| `enabled` | `true` | Master switch. Off pins monotony at `1.0` |
| `perActivityTracking` | `true` | Adds the per-reward-key tracker on top of the skill tracker |
| `skillRecoveryMillis` | `180000` | Milliseconds for skill pressure to decay by a factor of e |
| `activityRecoveryMillis` | `300000` | Same, for a per-key activity tracker |
| `activityStateTtlMillis` | `1800000` | Idle time after which an activity tracker is discarded |
| `skillBasePressure` | `0.01` | Flat pressure added per award |
| `skillXpPressure` | `0.0002` | Extra pressure per point of contextual XP, before boosts |
| `skillDecayCurve` | `14.0` | Pressure divisor in the exponent. Larger means pressure bites more slowly |
| `skillFloorMultiplier` | `0.08` | Lowest multiplier the skill tracker can reach |
| `activityBasePressure` | `0.01` | Flat pressure added per keyed award |
| `activityXpPressure` | `0.0003` | Extra pressure per point of contextual XP, per key |
| `activityDecayCurve` | `9.0` | Pressure divisor for the activity tracker |
| `activityFloorMultiplier` | `0.12` | Lowest multiplier the activity tracker can reach |

### `[xpEarningLimits]`

| Key | Default | What it does |
|---|---:|---|
| `enabled` | `true` | Applies earning allowances to gameplay XP |
| `skillBurstXp` | `10000` | Initial base-normalized allowance for each skill |
| `skillXpPerMinute` | `6000` | Continuous refill rate for each skill |
| `playerBurstXp` | `20000` | Shared base-normalized allowance across skills |
| `playerXpPerMinute` | `12000` | Continuous refill rate shared across skills |
| `absoluteBurstXp` | `80000` | Initial allowance counted in final credited XP |
| `absoluteXpPerMinute` | `48000` | Continuous refill rate counted in final credited XP |
| `maximumAllowanceBoost` | `4` | Largest multiplier used to normalize skill and shared allowance usage |

### `[xpIntegrity]`, provenance

| Key | Default | What it does |
|---|---:|---|
| `provenanceEnabled` | `true` | Master switch for the placed-block ledger |
| `placedBlockTtlMillis` | `86400000` | How long a placement stamp survives, 24 hours |
| `replaceDenyTtlMillis` | `900000` | Window after a break in which re-placing there earns no XP |
| `bonemealTrackingEnabled` | `true` | Stamps growth caused by bonemeal |
| `bonemealTtlMillis` | `600000` | How long the bonemeal stamp lasts |
| `bonemealHarvestMultiplier` | `0.5` | Payout scale for harvesting bonemealed growth |

### `[xpIntegrity]`, novelty

| Key | Default | What it does |
|---|---:|---|
| `noveltyEnabled` | `true` | Master switch for the whole novelty term |
| `spatialCellShift` | `2` | Cube size exponent. Cells are `2^shift` blocks on a side |
| `spatialCellCap` | `256` | Cubes remembered per player, evicted least-recently-used |
| `spatialCellTtlMillis` | `900000` | Idle time after which a cube's repeat count resets to zero |
| `spatialRepeatDecay` | `0.3` | How fast payout falls with each repeat in the same cube |
| `spatialFloorMultiplier` | `0.25` | Lowest the spatial term can reach |
| `entropyWindow` | `48` | How many recent reward keys the variety ring holds |
| `entropyFloorMultiplier` | `0.7` | Lowest the variety term can reach, hit when every key is the same |
| `stillnessEnabled` | `true` | Enables the stationary activity multiplier |
| `stillnessWindowMillis` | `60000` | How long a still run must span before its multiplier applies |
| `stillnessMinEvents` | `20` | How many awards a still run must contain |
| `stillnessEpsilon` | `0.75` | Blocks of positional drift allowed before the run restarts |
| `stillnessFloorMultiplier` | `0.25` | Additional multiplier applied during a qualifying still run |

### `[xpIntegrity]`, bonuses, cycling, pooling

| Key | Default | What it does |
|---|---:|---|
| `adjacencyBonusEnabled` | `true` | Enables the place-against-your-own-work streak |
| `adjacencyBonusMax` | `0.25` | Cap on the added fraction, so at most 1.25x |
| `adjacencyBonusPerStreak` | `0.05` | Added fraction per streak step |
| `fieldCycleMillis` | `240000` | Time for a re-harvested crop cell to ramp back to full payout |
| `fieldCycleFloorMultiplier` | `0.15` | Payout for an immediate re-harvest of the same cell |
| `pooledPayoutEnabled` | `true` | Batches awards instead of applying each one to the line |
| `pooledWindowMillis` | `30000` | Pool age that forces a flush |
| `pooledIdleFlushMillis` | `8000` | Idle time since the last award that forces a flush |
| `inspiredPopupEnabled` | `false` | Shows the Inspired action-bar popup on a skill switch |
| `inspiredCooldownMillis` | `300000` | Minimum time between Inspired assignments |

### `[adaptationXp]`

| Key | Default | What it does |
|---|---:|---|
| `usageBaselineEnabled` | `true` | Pays a small silent award for using an adaptation |
| `usageBaselineXp` | `0.8` | Award at adaptation level 1 |
| `usageBaselineXpPerLevel` | `0.18` | Added per level above 1 |
| `usageBaselineCooldownMillis` | `12000` | Per-player, per-adaptation cooldown. Values below 250 are raised to 250 |

### `[permissionXpMultipliers]`

| Key | Default | What it does |
|---|---:|---|
| `enabled` | `false` | Enables the table and registers its nodes as permissions defaulting to false |
| `stack` | `false` | False takes the single highest matched value. True multiplies every matched value together |
| `multipliers` | empty | Permission node to multiplier. Values at or below zero are ignored |

```toml
[permissionXpMultipliers]
enabled = false
stack = false

[permissionXpMultipliers.multipliers]
"adapt.xpmultiplier.vip" = 1.5
"adapt.xpmultiplier.mvp" = 2.0
```
