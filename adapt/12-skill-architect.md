---
title: "Skill - Architect"
description: "Architect XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Architect gains XP from placing blocks, scaled by material value; breaks advance demolition challenges and pay no Architect XP. Adaptations cover glass drops, temporary floors, face fills, wireless redstone, elevators, rotation, scaffolds, hand refills, bridge protection, build guides, placement undo, and a portable stonecutter.

## How you earn Architect XP

Placing a block credits `blocks.placed` by one and `blocks.placed.value` by the block's value times `xpValueMultiplier`. Storage blocks are skipped and pay nothing. A placement above Y 128 also credits `architect.builds.high`. Skill XP pays once per `cooldownDelay`, from `xpBase` plus the scaled block value, then multiplied by placement integrity and an adjacency bonus. A break credits `blocks.broken` and `architect.demolish.value` only.

## Adaptations

Placements and breaks re-check `adapt.use` on every block.

### Silk-Touch Glass (`architect-glass`)

1 level · 0 knowledge

Breaking a block whose material name contains `GLASS`, except `TINTED_GLASS`, with an empty main hand or a non-tool drops the block. No adaptation-specific config keys.

### Magic Foundation (`architect-foundation`)

5 levels · 1 knowledge, then 5 per level

Sneak places `TINTED_GLASS` underfoot and keeps spending the block budget on new positions while sneak is held. Release starts the cooldown. Creative and Spectator cannot activate it. Pistons, explosions, and manual breaks do not remove the blocks. A denied place check spends no budget.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `duration` | `3000` | Milliseconds each temporary block survives before it is removed. |
| `minBlocks` | `9` | Block budget granted per activation at the lowest level. |
| `maxBlocks` | `35` | Block budget granted per activation at max level. |
| `cooldown` | `5000` | Milliseconds after releasing sneak before you can activate again. |

### Builders Wand (`architect-placement`)

1 level · 4 knowledge

Sneak while aiming at the same block within 5 blocks, with a matching stack held, previews a flat-face fill. The preview updates as aim or position changes. Placing consumes one matching item per filled position, including the block that starts the fill. Containers are never targeted. Denied positions are skipped and consume nothing.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `maxBlocks` | `20` | Most blocks one wand placement will fill. |
| `useDisplayEntities` | `true` | Draws the preview with owner-only block displays instead of particles. |
| `displayEntityViewRange` | `0.75` | View range applied to those preview display entities. |

### Redstone Remote (`architect-wireless-redstone`)

1 level · 0 knowledge

Shapeless `REDSTONE_TORCH`, `TARGET`, and `ENDER_PEARL` craft a `BoundRedstoneTorch`. The adaptation is permanent and cannot be unlearned. Sneak-left-click binds a block. Right-click pulses it, then restores the previous state. A failed chunk load, target check, or schedule does not pulse and does not start cooldown. Every powered block, neighbour, and door half must pass an interaction check before the pulse.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `cooldown` | `125` | Milliseconds between pulses, tracked in the bound torch's own item cooldown group. |

### Elevator (`architect-elevator`)

1 level · 1 knowledge

Shaped recipe `XXX` / `XYX` / `XXX`, where X is any block in the vanilla `WOOL` tag and Y is `ENDER_PEARL`. A pair stacked in range links on its own. Jump on the lower block goes up. Sneak on the upper block goes down. The elevator block is found up to 2 blocks below the feet. The trip is refused without enough headroom or when the target is outside build height. Advancement `challenge_architect_elevator_penthouse` is granted on a single trip of 50 blocks or more. With the defaults the maximum trip is 32 blocks, so it cannot be earned unless `baseDistance` or `multiplier` is raised.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `baseDistance` | `32` | Maximum vertical distance in blocks a linked elevator pair can span, before level and multiplier scaling. |
| `multiplier` | `1` | Extra scaling on that distance. Multiplied by the adaptation level. |

### Smart Shape (`architect-smart-shape`)

1 level · 3 knowledge

With an empty main hand, sneak-left-click steps facing or axis to the next orientation. Directional blocks walk a fixed 16-step compass order. Axis blocks walk X, then Y, then Z.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minXpPerRotate` | `0.4` | Floor on the skill XP paid for one rotation. |
| `xpPerOrientationOption` | `0.16` | Skill XP paid per orientation the block could take, so richer block states pay more. |

### Scaffolder (`architect-scaffolder`)

5 levels · 2 knowledge, then 4 per level

Sneak-placed blocks become scaffolds, expire, and return the item. Breaking one clears the mark instead. A scaffold whose material changed before expiry is left in place.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minDurationSeconds` | `5` | Seconds a scaffold survives at the lowest level. |
| `maxDurationSeconds` | `30` | Seconds a scaffold survives at max level. |
| `maxScaffoldsPerPlayer` | `24` | Live scaffolds one player can have at once. Placements past this are ignored. |
| `blockFilterMode` | `"OFF"` | Filter mode for which materials may be scaffolded: `OFF`, `BLACKLIST`, or `WHITELIST`. |
| `blockFilterMaterials` | `[]` | Material names the filter applies to, for example `TNT` or `SAND`. |
| `hungerExhaustionPerScaffold` | `0` | Exhaustion added per scaffolded block, where 4.0 drains half a hunger point. Zero disables the cost. |

### Supply Line (`architect-supply-line`)

5 levels · 2 knowledge, then 5 per level

When the placed stack was on its last item, the main hand or offhand refills from loose stacks, then bundles, then Adapt backpacks, then shulker boxes. Over the per-minute budget, the refill is refused and a dispenser-fail sound plays.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minRefillsPerMinute` | `4` | Hand refills allowed per minute at the lowest level. |
| `maxRefillsPerMinute` | `20` | Hand refills allowed per minute at max level. |
| `xpPerRefill` | `2` | Skill XP paid per successful refill. |

### Steady Hands (`architect-steady-hands`)

5 levels · 2 knowledge, then 4 per level

A sneak-placement with air below grants full knockback resistance, full explosion knockback resistance, extra safe fall distance, and a short mining-speed boost for the grace window. Sneaking again during that window reapplies the knockback resistance. Releasing sneak removes it.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minShieldedBlocks` | `3` | Extra safe fall distance in blocks at the lowest level. |
| `maxShieldedBlocks` | `12` | Extra safe fall distance in blocks at max level. |
| `bridgeGraceMillis` | `4000` | How long the protections stay up after a bridge placement, in milliseconds. |
| `hasteDurationTicks` | `40` | Duration in ticks of the mining-speed boost per bridge placement. Zero skips the boost. |
| `hasteAmplifier` | `0` | Amplifier of that mining-speed boost. |

### Chalk Line (`architect-chalk-line`)

4 levels · 1 knowledge, then 3 per level

Each level unlocks one shaped wand and reveals its recipe in the vanilla recipe book. `S` is `STRING` and `T` is `STICK`. Left-click a block face to set the start. Right-click sets the end, a polyline vertex, or the arc endpoint. Guides are private block markers with no timer, drawn only while that wand is held, and each wand keeps its own plan. Sneak-click air clears that wand's plan.

| Wand | Required level | Shape |
|------|----------------|-------|
| Chalk Straightedge | 1 | `S` over `T` |
| Chalk Polyline Wand | 2 | `S ` over ` T` |
| Chalk Circle Compass | 3 | `T` over `S` |
| Chalk Arc Bow | 4 | `TS` |

| Key | Code default | What it does |
|-----|--------------|--------------|
| `maxSelectionDistance` | `96` | Furthest apart in blocks two control points may be. |
| `maxPolylineVertices` | `12` | Control vertices one polyline wand will store. |
| `maxCircleRadius` | `15` | Largest circle radius in blocks. |
| `maxArcRadius` | `64` | Largest computed radius in blocks for a three-point arc. |
| `maxGuideBlocks` | `96` | Block-display markers one guide may use. Guides that need more are refused. |
| `renderRangeBlocks` | `64` | Furthest distance in blocks at which a held wand still draws its guide. |
| `xpPerGuide` | `3` | Skill XP paid whenever a complete guide is drafted or extended. |

### Mason's Eraser (`architect-demolition`)

5 levels · 2 knowledge, then 4 per level

The player's own recent placements break instantly for that player only, return the placed item plus the block's contents, and drop nothing and no XP. Overflow that does not fit falls at the player's feet.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minWindowSeconds` | `10` | Seconds a placement stays erasable at the lowest level. |
| `maxWindowSeconds` | `60` | Seconds a placement stays erasable at max level. |
| `maxTrackedPerPlayer` | `64` | Recent placements tracked per player. The oldest are dropped past this. |
| `xpPerDemolish` | `1` | Skill XP paid per erased block. |

### Stonecutter Savant (`architect-stonecutter-savant`)

1 level · 2 knowledge

With an empty main hand, sneak-left-click air or a block to open a stonecutter at the player's position when interaction is permitted.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `requireOffhand` | `false` | When true, the stonecutter must be held in the offhand rather than anywhere in the inventory. |
| `xpPerUse` | `2` | Skill XP paid per stonecutter opened. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/architect.toml` on first load.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `enabled` | `true` | Turns the whole Architect line off when false. |
| `skillColor` | `"&b"` | Legacy ampersand color code used for Architect in menus and text. |
| `challengePlace1kReward` | `1750` | Skill XP paid for every Architect challenge. The larger tier of the demolish, value-placed, demolish-value, and high-build pairs pays double this. |
| `xpValueMultiplier` | `1.5` | Multiplier applied to a placed block's value before it is added to `blocks.placed.value` and folded into the XP payout. |
| `cooldownDelay` | `1000` | Minimum milliseconds between placement XP awards. Stats are still credited on every placement. |
| `xpBase` | `3` | Flat skill XP added to the scaled block value before integrity and adjacency multipliers. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_place_1k` | 1000 | `challengePlace1kReward` |
| `challenge_place_5k` | 5000 | `challengePlace1kReward` |
| `challenge_place_50k` | 50000 | `challengePlace1kReward` |
| `challenge_demolish_500` | 500 | `challengePlace1kReward` |
| `challenge_demolish_5k` | 5000 | `challengePlace1kReward` x 2 |
| `challenge_value_placed_10k` | 10000 | `challengePlace1kReward` |
| `challenge_value_placed_100k` | 100000 | `challengePlace1kReward` x 2 |
| `challenge_demolish_val_5k` | 5000 | `challengePlace1kReward` |
| `challenge_demolish_val_50k` | 50000 | `challengePlace1kReward` x 2 |
| `challenge_high_build_100` | 100 | `challengePlace1kReward` |
| `challenge_high_build_1k` | 1000 | `challengePlace1kReward` x 2 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
