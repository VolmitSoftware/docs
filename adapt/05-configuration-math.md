---
title: "Configuration Math"
description: "XP multipliers, progression curves, knowledge, and ability power"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt applies location, repetition, permission, and boost multipliers before adding XP to a skill. A denied region cancels the award. Every setting on this page is in `plugins/Adapt/adapt.toml`.

The selected `xpCurve` converts both skill XP and master XP into levels. Master XP is granted when a skill gains a level. With the default anti-farm floors, heavily repeated work can fall to about one percent of its normal XP.

## How an XP award is calculated

Every award passes through five multipliers before it reaches the skill line:

| Multiplier | What lowers it |
|---|---|
| Novelty | Repeating the same work in the same place |
| Region policy | A WorldGuard region with `adapt-xp-multiplier`, or `adapt-xp deny` |
| Monotony | Grinding one skill or one activity, from `[farmPrevention]` |
| Line freshness and line boosts | Heavy recent use of that skill |
| Player and global boosts, permission multipliers | Nothing — these only raise it |

A region that denies XP zeroes the award immediately and nothing downstream runs.

Boosts add together within a bracket and multiply across brackets. `/adapt boost` and
`/adapt global-boost` land in the player bracket; API boosts land on the line. Both brackets are
clamped to 0.01–1000, and both are snapshots refreshed about once a second, so a permission change
or a fresh boost can lag by that much.

Permission multipliers come from `[permissionXpMultipliers]`. With `stack = false` the single
highest matched value wins; with `stack = true` every match multiplies together. Values below 1
work as rank penalties.

### Final multiplier

```
final = novelty
      * regionXpMultiplier
      * monotony
      * clamp(rfreshness + lineBoosts, 0.01, 1000)
      * clamp((1 + playerBoosts + globalBoosts) * permissionMultiplier, 0.01, 1000)
```

with `final = 0` if the region denies XP.

### Payout pooling

With `xpIntegrity.pooledPayoutEnabled` on, awards collect in a pool and land together, which is why
the action bar shows one figure instead of a stream of small ones. The pool flushes when it is older
than `pooledWindowMillis` or idle longer than `pooledIdleFlushMillis`.

## Freshness

Each skill line has a freshness term that falls as you use it and recovers when you stop. Recovery
is fast and decay is slow, so a short break restores most of it. Level raises the ceiling slightly.

## Farm prevention

`[farmPrevention]` tracks *pressure*: it rises with each award and decays over time. Two trackers
run, one per skill and one per activity, and they multiply together.

With the defaults the combined floor is about 0.01, so a fully saturated farm still pays about one
percent. Setting a tracker's `decayCurve` to zero or below disables it.

## XP integrity

`[xpIntegrity]` is the anti-automation layer. Provenance answers "did this player create this block". Novelty answers "is this award actually new work".

### Provenance

Blocks a player places are stamped so they cannot be re-harvested for XP. `placedBlockTtlMillis` is how long that stamp lives. Breaking a block also stamps the spot. Re-placing there within `replaceDenyTtlMillis` earns nothing, which closes the break-and-replace loop. Bonemealed growth gets its own stamp with its own TTL. Harvest of it pays `bonemealHarvestMultiplier`.

### Novelty

Three things reduce a reward, multiplied together:

- **Spatial** — repeating in the same small area. Resets after `spatialCellTtlMillis` idle.
- **Entropy** — repeating one kind of action. Saturates once you have three distinct activities in
  your recent history.
- **Stillness** — not moving at all. Caps the combined multiplier at `stillnessFloorMultiplier`.
  Any real movement restarts the run.

### Adjacency bonus

Placing a block against one you already placed builds a streak worth `min(adjacencyBonusMax, streak * adjacencyBonusPerStreak)` on top of `1.0`. Placing somewhere not adjacent halves the streak. The streak only grows while the target cell is not already heavily repeated and the bonus has not hit its cap.

### Field cycle

Re-harvesting the same crop cell too soon pays `fieldCycleFloorMultiplier` and ramps linearly back to `1.0` over `fieldCycleMillis` since that cell was last harvested. The first harvest of a cell always pays full.

### Adaptation usage baseline

`[adaptationXp]` pays a small trickle for actually using an adaptation, so active abilities are not dead weight for progression. The reward is `usageBaselineXp + (level - 1) * usageBaselineXpPerLevel`, on a per-player, per-adaptation cooldown of `usageBaselineCooldownMillis` with a hard floor of 250 ms.

It is paid through `xpSilent` under the reward key `adaptation:<adaptation-name>:baseline-use`. That path skips stage 1 entirely: no novelty term, no region multiplier. It still passes through monotony and the multiplier snapshots. The reward key still feeds the per-activity tracker.

## Level curves

A curve is a `NewtonCurve`: one function `getXPForLevel(level)` and one inverse `computeLevelForXP(xp, maxError)`. `xpCurve` picks the family.

The default is `ADAPT_BALANCED`:

```
xp(L) = 100 * L^2 + 1200 * L
L(xp) = (sqrt(1440000 + 400 * xp) - 1200) / 200
```

Both directions are closed form. Level 1 costs 1,300 XP, level 10 costs 22,000, level 100 costs 1,120,000.

### The level cap

`experienceMaxLevel` defaults to 1000 and is checked once per second per skill line. If the line's XP exceeds `getXPForLevel(experienceMaxLevel)` and the player is not busy, the player gains 1 wisdom. The line's XP is set back to `getXPForLevel(experienceMaxLevel - 1)`.

Every runtime XP-to-level conversion clamps its result to this value, including the closed-form curve families. Level-to-XP conversion also clamps its input, so callers cannot request a threshold above the configured cap. Overflow still grants wisdom and resets the skill line on its one-second progression tick, but no public level lookup can report a value above the cap while that reset is pending.

## Master XP, master level and power

Master XP comes only from skill level-ups. On the one-second tick, for every level `i` the line just crossed (`lastLevel <= i < level`):

```
knowledge += (i / 13) + 1                                     // integer division
masterXp  += playerXpPerSkillLevelUpBase + (i * playerXpPerSkillLevelUpLevelMultiplier)
```

`i` is the level being left, not the level reached. The step from 9 to 10 uses `i = 9`. It grants `489 + 9*44 = 885` master XP. It also grants `(9 / 13) + 1 = 1` knowledge. The step from 49 to 50 grants `2645` master XP and `4` knowledge. A line that gains several levels in one tick runs the loop once per level.

Master level uses the same `xpCurve`:

```
masterLevel = xpCurve.computeLevelForXP(masterXp)
```

Power follows from it:

```
maxPower  = max(0, (int)(masterLevel * powerPerLevel) + regionPowerBonus)
usedPower = sum of the level of every learned adaptation that is NOT region granted
available = maxPower - usedPower
```

The `(int)` truncates. The default `powerPerLevel = 0.65` yields one power point roughly every other master level at low levels. `regionPowerBonus` is the transient WorldGuard `adapt-power-bonus` contribution. It is refreshed on the same tick and never persisted. See [08 - Protection & Region Policy](/adapt/08-protection-region-policy).

When your power budget drops below what you hold — usually after leaving a region that granted a
bonus — Adapt demotes your lowest-level adaptations one level at a time until it fits. Nothing is
refunded. Region-granted adaptations cost no power and are never pruned.

Debug mode (`/adapt debug mode`) short-circuits `hasPowerAvailable`, `spendKnowledge`, and the pruner entirely.

## Reference

### Progression keys

| Key | Default | What it does |
|---|---:|---|
| `xpCurve` | `ADAPT_BALANCED` | Curve family used by every skill line and by master level |
| `experienceMaxLevel` | `1000` | Skill level cap, and the ceiling the bisection cursor clamps to |
| `playerXpPerSkillLevelUpBase` | `489` | Finite non-negative flat master XP per skill level crossed |
| `playerXpPerSkillLevelUpLevelMultiplier` | `44` | Finite non-negative extra master XP per level already reached |
| `powerPerLevel` | `0.65` | Finite non-negative power per master level, truncated to a whole number |

### Curve families

Accepted values for `xpCurve`. `ADAPT_BALANCED` is the default and the shipped balance point; the
rest are alternatives, from near-linear (`L1K`, `L4K`, `L8K`, `L16K`) through polynomial (`X1D2`,
`X1D5`, `X2` through `X7`) to preset curves borrowed from other games (`SKYRIM`, `WOW`).

```
ADAPT_BALANCED  LINEAR_EXPONENTIAL_1  LINEAR_EXPONENTIAL_2  LINEAR_EXPONENTIAL_3
QLOG  ELIN  CUBRT  HYPER  SIGM  SKYRIM  WOW
X1D2  X1D5  X2  X3  X4  X5  X6  X7
L1K  L4K  L8K  L16K
XL05L7  XL1L7  XL15L7  XL2L7  XL3L7  XL4L7  XL5L7  XL6L7  XL7L7  XL8L7  XL9L7
XL20L7  XL40L7  XL80L7  XL100L7  XL160L7
```

The default reaches level 1 at 1,300 XP, level 10 at 22,000, and level 100 at 1,120,000.

### `[farmPrevention]`

| Key | Default | What it does |
|---|---:|---|
| `enabled` | `true` | Master switch. Off pins monotony at `1.0` |
| `perActivityTracking` | `true` | Adds the per-reward-key tracker on top of the skill tracker |
| `skillRecoveryMillis` | `180000` | Milliseconds for skill pressure to decay by a factor of e |
| `activityRecoveryMillis` | `300000` | Same, for a per-key activity tracker |
| `activityStateTtlMillis` | `1800000` | Idle time after which an activity tracker is discarded |
| `skillBasePressure` | `1.0` | Flat pressure added per award |
| `skillXpPressure` | `0.02` | Extra pressure per point of awarded XP |
| `skillDecayCurve` | `14.0` | Pressure divisor in the exponent. Larger means pressure bites more slowly |
| `skillFloorMultiplier` | `0.08` | Lowest multiplier the skill tracker can reach |
| `activityBasePressure` | `1.0` | Flat pressure added per keyed award |
| `activityXpPressure` | `0.03` | Extra pressure per point of awarded XP, per key |
| `activityDecayCurve` | `9.0` | Pressure divisor for the activity tracker |
| `activityFloorMultiplier` | `0.12` | Lowest multiplier the activity tracker can reach |
| `crossSkillRecoveryFactor` | `0.9` | Every other line's pressure is scaled by this on a skill switch |

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
| `stillnessEnabled` | `true` | Enables the not-moving override |
| `stillnessWindowMillis` | `60000` | How long a still run must span before the override applies |
| `stillnessMinEvents` | `20` | How many awards a still run must contain |
| `stillnessEpsilon` | `0.75` | Blocks of positional drift allowed before the run restarts |
| `stillnessFloorMultiplier` | `0.25` | Cap applied to the combined multiplier while still |

Yaw drift tolerance is a fixed 10 degrees and is not configurable.

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

## See also

- [01 - Installation & Configuration](/adapt/01-installation-configuration)
- [08 - Protection & Region Policy](/adapt/08-protection-region-policy)
- [00 - Overview](/adapt/00-overview)
