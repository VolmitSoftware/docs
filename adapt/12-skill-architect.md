---
title: "Skill - Architect"
description: "Architect XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Architect gains XP from placing blocks, scaled by material value. Breaking blocks advances demolition challenges but does not award Architect XP.

Its 12 adaptations include builder tools, chalk guides, temporary scaffolding, inventory refills, bridge safety, elevators, and demolition. Architect uses an aqua icon and a 3100 ms skill pulse.

## How you earn Architect XP

Placing a block does three things at once:

1. It credits `blocks.placed` by one and `blocks.placed.value` by the block's value multiplied by `xpValueMultiplier`. Storage blocks are skipped entirely and pay nothing.
2. If the block is above Y 128, it also credits `architect.builds.high`.
3. It pays skill XP, but only once per `cooldownDelay`. The payout starts from `xpBase` plus the block's scaled value. Then it is multiplied by the block's placement integrity and by an adjacency bonus. Hollow spam-towers and re-placing the same block over and over are worth less than real building.

Breaking a block credits `blocks.broken` and `architect.demolish.value` and nothing else.

## Adaptations

All of these need the same four things before they do anything. You have learned the adaptation to level 1 or higher in the Adapt menu. Both the Architect skill and that adaptation are enabled in config. You hold the matching `adapt.use` permission. Protection plugins or region policy allow the build at that spot. Adaptations that place or break world blocks re-check that permission for every block they touch. On Folia the whole footprint has to belong to your current region or the action is skipped. That list is not repeated below.

### Silk-Touch Glass (`architect-glass`)

Break glass with an empty hand, or with anything that is not a tool, and it drops itself instead of shattering. Tinted glass is excluded. It works on its own once learned. It costs nothing to learn. It is marked permanent so you cannot unlearn it afterward.

### Magic Foundation (`architect-foundation`)

Runs a temporary floor out under your feet so you can cross a gap without carrying blocks.

1. Hold shift. A charge ring plays and a block appears beneath you.
2. Keep sneaking and walk. Each new block position you enter spends part of your block budget on more tinted glass under your feet.
3. Release shift to stop. That starts a cooldown before you can charge again.

Each block dissolves on its own timer. The budget scales from 9 blocks up to 35 across the level range. Pistons, explosions, and manual breaks all leave the temporary blocks alone.

### Builders Wand (`architect-placement`)

Fills a whole flat face in one placement instead of one block at a time.

1. Hold a stack of the block you want to extend.
2. Sneak and look at a surface made of that same block, within 5 blocks. A preview of the fill appears.
3. Place. Every previewed position is filled, consuming one matching item each.

Containers are never targeted. If the preview does not appear, move slightly. The preview only recomputes when you move and on a short cycle. Blocked or denied positions are skipped and the item is not consumed.

### Redstone Remote (`architect-wireless-redstone`)

A bound redstone torch that toggles a circuit from anywhere.

1. Craft the remote: Redstone Torch plus Target plus Ender Pearl, shapeless.
2. Sneak and left-click the block you want to toggle. The remote binds to it.
3. Right-click anywhere to pulse the bound block.

The pulse restores the block's previous state when it finishes or is cancelled. If the bound chunk cannot load, the target check fails, or the pulse cannot be scheduled, nothing fires. The remote's cooldown does not start. Free to learn and marked permanent, so it cannot be unlearned.

### Elevator (`architect-elevator`)

Vertical fast travel built from a crafted block.

1. Craft Elevator Blocks: an Ender Pearl surrounded by 8 Wool.
2. Place one at the bottom and one directly above it, within range. They link automatically.
3. Stand on the lower one and jump to go up, or sneak on the upper one to go down.

Range is `baseDistance` multiplied by your level and `multiplier`, which is 32 blocks at defaults. The teleport is refused if there is not enough headroom at the far end. It is also refused if the target is outside build height.

### Smart Shape (`architect-smart-shape`)

Fix a stair or log you placed facing the wrong way without breaking and replacing it.

1. Empty your main hand.
2. Sneak and left-click the block.

Each click steps the block's facing or axis to its next orientation. XP scales with how many orientations the block actually has. Rotating a 16-way sign pays more than flipping a log axis.

### Scaffolder (`architect-scaffolder`)

Temporary building blocks that clean themselves up.

1. Sneak.
2. Place blocks normally.

Each sneak-placed block is marked as a scaffold. It ticks away. It coughs a warning puff shortly before it goes. Then it vanishes and returns the item to you. Breaking a scaffold yourself just un-marks it. Levels extend the lifetime from 5 seconds up to 30. Operators can whitelist or blacklist which materials qualify. Operators can charge exhaustion per scaffold.

### Supply Line (`architect-supply-line`)

When the stack in your hand runs out mid-build, Adapt refills it from your own storage instead of making you stop. It looks for loose stacks first, then bundles, then Adapt backpacks, then shulker boxes. There is a refills-per-minute budget that grows with level. When you exceed it you hear a dispenser-fail click instead. It works on its own once learned.

### Steady Hands (`architect-steady-hands`)

Bridging insurance. Sneak-place a block with nothing under it. For a few seconds you get full knockback resistance, full explosion knockback resistance, extra safe fall distance, and a short mining-speed boost. Sneaking again while the grace is still running re-applies the knockback resistance. Letting go of sneak drops it. It works on its own once learned. Build the way you already do.

### Chalk Line (`architect-chalk-line`)

Draws the shape in the air before you build it. Each level unlocks a new wand and immediately reveals its recipe in your vanilla recipe book. All four are one Stick plus one String, arranged differently in the grid.

1. Craft the wand for the shape you want. Use Chalk Straightedge at level 1, Polyline Wand at level 2, Circle Compass at level 3, and Arc Bow at level 4.
2. Hold it and left-click a block face to set the start point.
3. Right-click to set the end point, add polyline vertices, or set the arc endpoint.
4. The guide appears as private block markers only you can see, and only while that wand is held.
5. Sneak-click the air to clear that wand's saved plan.

Guides have no timer. Each wand keeps its own plan, so you can carry several.

### Mason's Eraser (`architect-demolition`)

Undo for building. Blocks you placed recently break near-instantly for you. They drop nothing on the ground. Instead they hand you back the exact item you placed plus whatever the block was holding. The window starts at 10 seconds and grows to 60 with level. Only your own most recent placements are tracked.

### Stonecutter Savant (`architect-stonecutter-savant`)

A stonecutter you never have to place.

1. Carry a stonecutter item.
2. Empty your main hand.
3. Sneak and left-click.

The stonecutter menu opens where you stand. Operators can require the stonecutter to sit in your offhand specifically.

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

### Skill milestones

| Advancement key | Stat tracked | Threshold | Reward source |
|-----------------|--------------|-----------|---------------|
| `challenge_place_1k` | `blocks.placed` | 1000 | `challengePlace1kReward` |
| `challenge_place_5k` | `blocks.placed` | 5000 | `challengePlace1kReward` |
| `challenge_place_50k` | `blocks.placed` | 50000 | `challengePlace1kReward` |
| `challenge_demolish_500` | `blocks.broken` | 500 | `challengePlace1kReward` |
| `challenge_demolish_5k` | `blocks.broken` | 5000 | `challengePlace1kReward` x 2 |
| `challenge_value_placed_10k` | `blocks.placed.value` | 10000 | `challengePlace1kReward` |
| `challenge_value_placed_100k` | `blocks.placed.value` | 100000 | `challengePlace1kReward` x 2 |
| `challenge_demolish_val_5k` | `architect.demolish.value` | 5000 | `challengePlace1kReward` |
| `challenge_demolish_val_50k` | `architect.demolish.value` | 50000 | `challengePlace1kReward` x 2 |
| `challenge_high_build_100` | `architect.builds.high` | 100 | `challengePlace1kReward` |
| `challenge_high_build_1k` | `architect.builds.high` | 1000 | `challengePlace1kReward` x 2 |

`architect.builds.high` counts placements above Y 128.

### Shared adaptation keys

Every adaptation TOML at `plugins/Adapt/adaptations/<id>.toml` also
carries `enabled`, `permanent`, `showParticles`, and `showSounds`. The
learn-cost fields `baseCost`, `costFactor`, `maxLevel`, and `initialCost` are
listed per adaptation below. `permanent` means the adaptation cannot be unlearned once bought, and the menu asks for a confirmation click before selling you the first level.

### Silk-Touch Glass

| Property | Default |
|----------|---------|
| Icon | `GLASS` |
| Max level | 1 |
| Initial knowledge cost | 0 |
| Base knowledge cost | 3 |
| Cost factor | 5 |
| Permanent | `true` |
| Tick interval (ms) | 25000 |
| Menu lines | Your hands gain silk touch for Glass |
| Milestones | `challenge_architect_glass_200` on `architect.glass.blocks-recovered` at 200, reward 300. `challenge_architect_glass_5k` at 5000, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-glass.toml` |

Fires only when the main hand is empty or holding a non-tool. Matches any material whose name contains `GLASS` except `TINTED_GLASS`. No adaptation-specific config knobs.

### Magic Foundation

| Property | Default |
|----------|---------|
| Icon | `TINTED_GLASS` |
| Max level | 5 |
| Initial knowledge cost | 1 |
| Base knowledge cost | 5 |
| Cost factor | 0.40 |
| Tick interval (ms) | 988 |
| Menu lines | Magically create N blocks beneath you. |
| Milestones | `challenge_architect_foundation_1k` on `architect.foundation.blocks-placed` at 1000, reward 300. `challenge_architect_foundation_10k` at 10000, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-foundation.toml` |

Placed blocks are `TINTED_GLASS`. Creative and Spectator cannot activate it. Every block passes a normal place authorization check before it is journaled or placed, and a denial leaves the block budget untouched. Expiry cleanup runs regardless of that authorization.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `duration` | `3000` | Milliseconds each temporary block survives before it is removed. |
| `minBlocks` | `9` | Block budget granted per activation at the lowest level. |
| `maxBlocks` | `35` | Block budget granted per activation at max level. |
| `cooldown` | `5000` | Milliseconds after releasing sneak before you can activate again. |

### Builders Wand

| Property | Default |
|----------|---------|
| Icon | `SCAFFOLDING` |
| Max level | 1 |
| Initial knowledge cost | 4 |
| Base knowledge cost | 6 |
| Cost factor | 2 |
| Tick interval (ms) | 500, adjusted down while preview batches are still being drawn |
| Menu lines | You need N blocks in your hand to place this. A Material Builders Wand |
| Milestones | `challenge_architect_placement_1k` on `architect.placement.blocks-placed` at 1000, reward 300. `challenge_architect_placement_25k` at 25000, reward 1500 |
| Config file | `plugins/Adapt/adaptations/architect-placement.toml` |

Target block range is 5. Containers are excluded. Every replicated block passes a normal place authorization check before Adapt consumes the matching item or changes the world. On Folia the whole source and destination footprint must share your current owning region, or the original placement is left alone. Preview display entities are budgeted globally at 256 spawn or refresh operations per tick and 2048 live displays.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `maxBlocks` | `20` | Most blocks one wand placement will fill. |
| `useDisplayEntities` | `true` | Draws the preview with owner-only block displays instead of particles. |
| `displayEntityViewRange` | `0.75` | View range applied to those preview display entities. |

### Redstone Remote

| Property | Default |
|----------|---------|
| Icon | `REDSTONE_TORCH` |
| Max level | 1 |
| Initial knowledge cost | 0 |
| Base knowledge cost | 5 |
| Cost factor | 1 |
| Permanent | `true` |
| Tick interval (ms) | 1000 (framework default) |
| Menu lines | Target + Redstone Torch + Ender Pearl = 1 Redstone Remote |
| Milestones | `challenge_architect_wireless_100` on `architect.wireless-redstone.pulses` at 100, reward 300. `challenge_architect_wireless_5k` at 5000, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-wireless-redstone.toml` |

Recipe: shapeless `REDSTONE_TORCH` plus `TARGET` plus `ENDER_PEARL`, producing a `BoundRedstoneTorch`. Binding requires sneak plus a main-hand left-click and re-validates the target, your held slot, and the item snapshot before it links. Every powered block, neighbouring component, and door half passes an interaction check before the pulse begins. On Folia the whole pulse footprint and the player must share the target region. Denied, stale, or unschedulable pulses do not start the cooldown.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `cooldown` | `125` | Milliseconds between pulses, tracked in the bound torch's own item cooldown group. |

### Elevator

| Property | Default |
|----------|---------|
| Icon | `HEAVY_WEIGHTED_PRESSURE_PLATE` |
| Max level | 1 |
| Initial knowledge cost | 1 |
| Base knowledge cost | 5 |
| Cost factor | 0.40 |
| Tick interval (ms) | 988 |
| Menu lines | Unlocks elevator recipe. X is wool. Y is an ender pearl. Pattern XXX / XYX / XXX |
| Milestone | `challenge_architect_elevator_100` on `architect.elevator.trips` at 100, reward 300 |
| Config file | `plugins/Adapt/adaptations/architect-elevator.toml` |

Recipe: shaped 3x3, `XXX` / `XYX` / `XXX`, where X is any block in the vanilla `WOOL` tag and Y is `ENDER_PEARL`. Travel distance is `baseDistance` times level times `multiplier`, so 32 blocks at defaults. An elevator block is found up to 2 blocks below your feet. Teleports use Paper's async teleport when available.

A `challenge_architect_elevator_penthouse` advancement is registered and granted on a single trip of 50 blocks or more. With the defaults the maximum trip is 32 blocks, so it cannot be earned unless an operator raises `baseDistance` or `multiplier`.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `baseDistance` | `32` | Maximum vertical distance in blocks a linked elevator pair can span, before level and multiplier scaling. |
| `multiplier` | `1` | Extra scaling on that distance. Multiplied by the adaptation level. |

### Smart Shape

| Property | Default |
|----------|---------|
| Icon | `BRICKS` |
| Max level | 1 |
| Initial knowledge cost | 3 |
| Base knowledge cost | 3 |
| Cost factor | 0.6 |
| Tick interval (ms) | 800 |
| Menu lines | Rotates directional and axis block states. Requires empty main hand |
| Milestones | `challenge_architect_smart_shape_200` on `architect.smart-shape.rotations` at 200, reward 300. `challenge_architect_smart_shape_5k` at 5000, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-smart-shape.toml` |

Rotation walks a fixed 16-step compass order for directional blocks and an X, Y, Z order for axis blocks.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minXpPerRotate` | `0.4` | Floor on the skill XP paid for one rotation. |
| `xpPerOrientationOption` | `0.16` | Skill XP paid per orientation the block could take, so richer block states pay more. |

### Scaffolder

| Property | Default |
|----------|---------|
| Icon | `SCAFFOLDING` |
| Max level | 5 |
| Initial knowledge cost | 2 |
| Base knowledge cost | 4 |
| Cost factor | 0.5 |
| Tick interval (ms) | 9220 |
| Menu lines | Sneak-placed blocks dissolve automatically. Seconds before a scaffold dissolves and refunds |
| Milestones | `challenge_architect_scaffolder_500` on `architect.scaffolder.blocks-scaffolded` at 500, reward 300. `challenge_architect_scaffolder_5k` at 5000, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-scaffolder.toml` |

A scaffold with more than 30 ticks of life left plays a warning puff 20 ticks before it dissolves. A scaffold whose material changed before expiry is left in place.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minDurationSeconds` | `5` | Seconds a scaffold survives at the lowest level. |
| `maxDurationSeconds` | `30` | Seconds a scaffold survives at max level. |
| `maxScaffoldsPerPlayer` | `24` | Live scaffolds one player can have at once. Placements past this are ignored. |
| `blockFilterMode` | `"OFF"` | Filter mode for which materials may be scaffolded: `OFF`, `BLACKLIST`, or `WHITELIST`. |
| `blockFilterMaterials` | `[]` | Material names the filter applies to, for example `TNT` or `SAND`. |
| `hungerExhaustionPerScaffold` | `0` | Exhaustion added per scaffolded block, where 4.0 drains half a hunger point. Zero disables the cost. |

### Supply Line

| Property | Default |
|----------|---------|
| Icon | `SHULKER_BOX` |
| Max level | 5 |
| Initial knowledge cost | 2 |
| Base knowledge cost | 5 |
| Cost factor | 0.5 |
| Tick interval (ms) | 13780 |
| Menu lines | Hand auto-refills from shulkers and bundles. Refills per minute |
| Milestones | `challenge_architect_supply_line_100` on `architect.supply-line.refills` at 100, reward 300. `challenge_architect_supply_line_1k` at 1000, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-supply-line.toml` |

The refill only triggers when the placed stack was down to its last item. Search order is loose inventory stacks, then bundles, then Adapt backpacks, then shulker boxes. It works for both the main hand and the offhand.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minRefillsPerMinute` | `4` | Hand refills allowed per minute at the lowest level. |
| `maxRefillsPerMinute` | `20` | Hand refills allowed per minute at max level. |
| `xpPerRefill` | `2` | Skill XP paid per successful refill. |

### Steady Hands

| Property | Default |
|----------|---------|
| Icon | `LIGHTNING_ROD` |
| Max level | 5 |
| Initial knowledge cost | 2 |
| Base knowledge cost | 4 |
| Cost factor | 0.45 |
| Tick interval (ms) | 10440 |
| Menu lines | No knockback while bridging. Blocks of fall damage shielded |
| Milestones | `challenge_architect_steady_hands_500` on `architect.steady-hands.bridge-blocks` at 500, reward 300. `challenge_architect_steady_hands_5k` at 5000, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-steady-hands.toml` |

It only triggers on a sneak-placement whose block below is air. It applies timed modifiers for knockback resistance, explosion knockback resistance, safe fall distance, and block break speed.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minShieldedBlocks` | `3` | Extra safe fall distance in blocks at the lowest level. |
| `maxShieldedBlocks` | `12` | Extra safe fall distance in blocks at max level. |
| `bridgeGraceMillis` | `4000` | How long the protections stay up after a bridge placement, in milliseconds. |
| `hasteDurationTicks` | `40` | Duration in ticks of the mining-speed boost per bridge placement. Zero skips the boost. |
| `hasteAmplifier` | `0` | Amplifier of that mining-speed boost. |

### Chalk Line

| Property | Default |
|----------|---------|
| Icon | `STRING` |
| Max level | 4 |
| Initial knowledge cost | 1 |
| Base knowledge cost | 3 |
| Cost factor | 0.4 |
| Tick interval (ms) | Parked at `Long.MAX_VALUE` while idle. Drops to roughly 250 ms while a chalk wand is held |
| Menu lines | New wand recipes appear in your vanilla recipe book |
| Milestones | `challenge_architect_chalk_line_50` on `architect.chalk-line.guides-drafted` at 50, reward 300. `challenge_architect_chalk_line_500` at 500, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-chalk-line.toml` |

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

### Mason's Eraser

| Property | Default |
|----------|---------|
| Icon | `TNT` |
| Max level | 5 |
| Initial knowledge cost | 2 |
| Base knowledge cost | 4 |
| Cost factor | 0.45 |
| Tick interval (ms) | 10880 |
| Menu lines | Your fresh placements break near-instantly. Seconds a placement counts as fresh |
| Milestones | `challenge_architect_demolition_500` on `architect.demolition.blocks-demolished` at 500, reward 300. `challenge_architect_demolition_5k` at 5000, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-demolition.toml` |

Only the placing player can insta-break their own mark. The break suppresses normal drops and dropped XP. It then hands back the
snapshotted placed item plus any inventory the block was holding. Overflow goes
to the ground after your inventory fills. The effective window is floored at 1000 ms regardless of config.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minWindowSeconds` | `10` | Seconds a placement stays erasable at the lowest level. |
| `maxWindowSeconds` | `60` | Seconds a placement stays erasable at max level. |
| `maxTrackedPerPlayer` | `64` | Recent placements tracked per player. The oldest are dropped past this. |
| `xpPerDemolish` | `1` | Skill XP paid per erased block. |

### Stonecutter Savant

| Property | Default |
|----------|---------|
| Icon | `STONECUTTER` |
| Max level | 1 |
| Initial knowledge cost | 2 |
| Base knowledge cost | 4 |
| Cost factor | 0.5 |
| Tick interval (ms) | 24420 |
| Menu lines | Portable stonecutter on demand. Then either Requires a stonecutter item in your inventory or Requires a stonecutter in your offhand, depending on `requireOffhand` |
| Milestones | `challenge_architect_stonecutter_savant_50` on `architect.stonecutter-savant.uses` at 50, reward 300. `challenge_architect_stonecutter_savant_500` at 500, reward 1000 |
| Config file | `plugins/Adapt/adaptations/architect-stonecutter-savant.toml` |

| Key | Code default | What it does |
|-----|--------------|--------------|
| `requireOffhand` | `false` | When true, the stonecutter must be held in the offhand rather than anywhere in the inventory. |
| `xpPerUse` | `2` | Skill XP paid per stonecutter opened. |
## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
