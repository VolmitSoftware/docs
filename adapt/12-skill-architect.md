---
title: "Skill - Architect"
description: "Architect XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Architect gains XP from placing blocks, scaled by material value. Breaking blocks advances demolition challenges but does not award Architect XP.

## How you earn Architect XP

Placing a block does three things at once:

1. It credits `blocks.placed` by one and `blocks.placed.value` by the block's value multiplied by `xpValueMultiplier`. Storage blocks are skipped entirely and pay nothing.
2. If the block is above Y 128, it also credits `architect.builds.high`.
3. It pays skill XP, but only once per `cooldownDelay`. The payout starts from `xpBase` plus the block's scaled value. Then it is multiplied by the block's placement integrity and by an adjacency bonus. Hollow spam-towers and re-placing the same block over and over are worth less than real building.

Breaking a block credits `blocks.broken` and `architect.demolish.value` and nothing else.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, the matching `adapt.use` permission, and protection and region policy that allow the build. Adaptations that place or break world blocks re-check that permission for every block they touch.

### Silk-Touch Glass (`architect-glass`)

1 level · 0 knowledge

Break glass with an empty hand, or with anything that is not a tool, and it drops itself instead of shattering. Tinted glass is excluded. It costs nothing to learn.

Fires only when the main hand is empty or holding a non-tool. Matches any material whose name contains `GLASS` except `TINTED_GLASS`. No adaptation-specific config knobs.

### Magic Foundation (`architect-foundation`)

5 levels · 1 knowledge, then 5 per level

Runs a temporary floor out under your feet so you can cross a gap without carrying blocks.

1. Hold shift. A charge ring plays and a block appears beneath you.
2. Keep sneaking and walk. Each new block position you enter spends part of your block budget on more tinted glass under your feet.
3. Release shift to stop. That starts a cooldown before you can charge again.

Each block dissolves on its own timer. The budget scales from 9 blocks up to 35 across the level range. Pistons, explosions, and manual breaks all leave the temporary blocks alone.

Placed blocks are `TINTED_GLASS`. Creative and Spectator cannot activate it. Every block passes a normal place check, and a denial leaves your block budget untouched.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `duration` | `3000` | Milliseconds each temporary block survives before it is removed. |
| `minBlocks` | `9` | Block budget granted per activation at the lowest level. |
| `maxBlocks` | `35` | Block budget granted per activation at max level. |
| `cooldown` | `5000` | Milliseconds after releasing sneak before you can activate again. |

### Builders Wand (`architect-placement`)

1 level · 4 knowledge

Fills a whole flat face in one placement instead of one block at a time.

1. Hold a stack of the block you want to extend.
2. Sneak and look at a surface made of that same block, within 5 blocks. A preview of the fill appears.
3. Place. Every previewed position is filled, consuming one matching item each.

Containers are never targeted. If the preview does not appear, move slightly: it only recomputes when you move. Blocked or denied positions are skipped and the item is not consumed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `maxBlocks` | `20` | Most blocks one wand placement will fill. |
| `useDisplayEntities` | `true` | Draws the preview with owner-only block displays instead of particles. |
| `displayEntityViewRange` | `0.75` | View range applied to those preview display entities. |

### Redstone Remote (`architect-wireless-redstone`)

1 level · 0 knowledge

A bound redstone torch that toggles a circuit from anywhere.

1. Craft the remote: Redstone Torch plus Target plus Ender Pearl, shapeless.
2. Sneak and left-click the block you want to toggle. The remote binds to it.
3. Right-click anywhere to pulse the bound block.

The pulse restores the block's previous state when it finishes or is cancelled. If the bound chunk cannot load, the target check fails, or the pulse cannot be scheduled, nothing fires. The remote's cooldown does not start. Free to learn and marked permanent, so it cannot be unlearned.

Recipe: shapeless `REDSTONE_TORCH` plus `TARGET` plus `ENDER_PEARL`, producing a `BoundRedstoneTorch`. Every powered block, neighbouring component, and door half passes an interaction check before the pulse begins.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `cooldown` | `125` | Milliseconds between pulses, tracked in the bound torch's own item cooldown group. |

### Elevator (`architect-elevator`)

1 level · 1 knowledge

Vertical fast travel built from a crafted block.

1. Craft Elevator Blocks: an Ender Pearl surrounded by 8 Wool.
2. Place one at the bottom and one directly above it, within range. They link automatically.
3. Stand on the lower one and jump to go up, or sneak on the upper one to go down.

Range is `baseDistance` multiplied by your level and `multiplier`, which is 32 blocks at defaults. The teleport is refused if there is not enough headroom at the far end. It is also refused if the target is outside build height.

Recipe: shaped 3x3, `XXX` / `XYX` / `XXX`, where X is any block in the vanilla `WOOL` tag and Y is `ENDER_PEARL`. An elevator block is found up to 2 blocks below your feet.

A `challenge_architect_elevator_penthouse` advancement is registered and granted on a single trip of 50 blocks or more. With the defaults the maximum trip is 32 blocks, so it cannot be earned unless an operator raises `baseDistance` or `multiplier`.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `baseDistance` | `32` | Maximum vertical distance in blocks a linked elevator pair can span, before level and multiplier scaling. |
| `multiplier` | `1` | Extra scaling on that distance. Multiplied by the adaptation level. |

### Smart Shape (`architect-smart-shape`)

1 level · 3 knowledge

Fix a stair or log you placed facing the wrong way without breaking and replacing it.

1. Empty your main hand.
2. Sneak and left-click the block.

Each click steps the block's facing or axis to its next orientation. XP scales with how many orientations the block actually has. Rotating a 16-way sign pays more than flipping a log axis.

Rotation walks a fixed 16-step compass order for directional blocks and an X, Y, Z order for axis blocks.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minXpPerRotate` | `0.4` | Floor on the skill XP paid for one rotation. |
| `xpPerOrientationOption` | `0.16` | Skill XP paid per orientation the block could take, so richer block states pay more. |

### Scaffolder (`architect-scaffolder`)

5 levels · 2 knowledge, then 4 per level

Temporary building blocks that clean themselves up.

1. Sneak.
2. Place blocks normally.

Each sneak-placed block is marked as a scaffold. It ticks away. It coughs a warning puff shortly before it goes. Then it vanishes and returns the item to you. Breaking a scaffold yourself just un-marks it. Levels extend the lifetime from 5 seconds up to 30. Operators can whitelist or blacklist which materials qualify. Operators can charge exhaustion per scaffold.

A scaffold whose material changed before expiry is left in place.

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

When the stack in your hand runs out mid-build, Adapt refills it from your own storage instead of making you stop. It looks for loose stacks first, then bundles, then Adapt backpacks, then shulker boxes. There is a refills-per-minute budget that grows with level. When you exceed it you hear a dispenser-fail click instead.

The refill only triggers when the placed stack was down to its last item, and it works for both the main hand and the offhand.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minRefillsPerMinute` | `4` | Hand refills allowed per minute at the lowest level. |
| `maxRefillsPerMinute` | `20` | Hand refills allowed per minute at max level. |
| `xpPerRefill` | `2` | Skill XP paid per successful refill. |

### Steady Hands (`architect-steady-hands`)

5 levels · 2 knowledge, then 4 per level

Bridging insurance. Sneak-place a block with nothing under it. For a few seconds you get full knockback resistance, full explosion knockback resistance, extra safe fall distance, and a short mining-speed boost. Sneaking again while the grace is still running re-applies the knockback resistance. Letting go of sneak drops it. Build the way you already do.

It only triggers on a sneak-placement whose block below is air.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minShieldedBlocks` | `3` | Extra safe fall distance in blocks at the lowest level. |
| `maxShieldedBlocks` | `12` | Extra safe fall distance in blocks at max level. |
| `bridgeGraceMillis` | `4000` | How long the protections stay up after a bridge placement, in milliseconds. |
| `hasteDurationTicks` | `40` | Duration in ticks of the mining-speed boost per bridge placement. Zero skips the boost. |
| `hasteAmplifier` | `0` | Amplifier of that mining-speed boost. |

### Chalk Line (`architect-chalk-line`)

4 levels · 1 knowledge, then 3 per level

Draws the shape in the air before you build it. Each level unlocks a new wand and immediately reveals its recipe in your vanilla recipe book. All four are one Stick plus one String, arranged differently in the grid.

1. Craft the wand for the shape you want. Use Chalk Straightedge at level 1, Polyline Wand at level 2, Circle Compass at level 3, and Arc Bow at level 4.
2. Hold it and left-click a block face to set the start point.
3. Right-click to set the end point, add polyline vertices, or set the arc endpoint.
4. The guide appears as private block markers only you can see, and only while that wand is held.
5. Sneak-click the air to clear that wand's saved plan.

Guides have no timer. Each wand keeps its own plan, so you can carry several.

All four recipes are shaped, using `S` for `STRING` and `T` for `STICK`:

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

Undo for building. Blocks you placed recently break near-instantly for you. They drop nothing on the ground. Instead they hand you back the exact item you placed plus whatever the block was holding. The window starts at 10 seconds and grows to 60 with level. Only your own most recent placements are tracked.

Only you can insta-break your own marks. The break drops nothing on the ground and no XP, and overflow that does not fit in your inventory falls at your feet.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minWindowSeconds` | `10` | Seconds a placement stays erasable at the lowest level. |
| `maxWindowSeconds` | `60` | Seconds a placement stays erasable at max level. |
| `maxTrackedPerPlayer` | `64` | Recent placements tracked per player. The oldest are dropped past this. |
| `xpPerDemolish` | `1` | Skill XP paid per erased block. |

### Stonecutter Savant (`architect-stonecutter-savant`)

1 level · 2 knowledge

A stonecutter you never have to place.

1. Carry a stonecutter item.
2. Empty your main hand.
3. Sneak and left-click.

The stonecutter menu opens where you stand. Operators can require the stonecutter to sit in your offhand specifically.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
