---
title: "Upgrades - Architect"
description: "Architect upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Architect (see [Mutations](/adapt/35-mutations)), and they replace the original adaptations of [Architect](/adapt/12-skill-architect).

## Upgrades

Each Architect upgrade works through the originals it fuses. While you hold the upgrade, each fused original works for you at its own top level when the upgrade is at level 3, one level lower for each upgrade level below 3, and never below level 1. The originals keep their own personal controls and config keys, and any recipe a fused original unlocks stays available to you.

### Master Builder (`upgraded-architect-master-builder`)

3 levels · 15, 14 and 18 knowledge · Fuses Builder's Wand, Supply Line and Chalk Line

While you hold Master Builder, Builder's Wand, Supply Line and Chalk Line work for you:

| Original | Upgrade level 1 | Upgrade level 2 | Upgrade level 3 |
|----------|-----------------|-----------------|-----------------|
| Builder's Wand | 1 | 1 | 1 |
| Supply Line | 3 | 4 | 5 |
| Chalk Line | 4 | 4 | 4 |

[Builder's Wand](/adapt/12-skill-architect#builders-wand-architect-placement) fills a flat face with the stack you hold while you sneak and aim at a block. Master Builder widens that face from the wand's 3x3 to 5x5 at level 2 and 7x7 at level 3, so one placement can fill up to 9, 25 or 49 blocks. You need that many blocks in your hand. Each face is laid as one build of real placements that block-logging and protection plugins see, so Wrecking Hand can undo it. [Supply Line](/adapt/12-skill-architect#supply-line-architect-supply-line) refills the stack in your hand from loose stacks, bundles, backpacks and shulker boxes when you place its last item, with more refills per minute at higher levels. [Chalk Line](/adapt/12-skill-architect#chalk-line-architect-chalk-line) gives you all four chalk wands at every upgrade level, and your Circle Compass reaches a radius of 15, 24 and 32 blocks at levels 1, 2 and 3.

**Chalk fill.** Draw a finished guide with any chalk wand, hold the wand, put a block in your off hand and sneak-right-click. The block is laid along the guide a few at a time, so you see the build run along the line. Blocks come from your off hand first, then your inventory, then the bundles, backpacks and shulker boxes you carry. One fill lays at most 64, 160 and 320 blocks at levels 1, 2 and 3. Pick the fill shape in your personal controls: Outline follows the guide, Solid disc fills a Circle Compass guide out from its center from level 2, and Wall stacks the outline 2, 4 and 6 layers high (never fewer than 2) (upwards for flat guides, towards you for an upright circle). Every block is a real placement: it fills only air and replaceable blocks, stops at the first protected block, counts as player-placed, and costs one item. There is no refund, creative mode gets no free blocks, you run one build at a time, and you can start at most 3 fills in 10 seconds. Fills pay no skill XP. The result line tells you how many blocks were placed and why the fill stopped.

Overcharge: when a fill starts and you can pay the other mutated skill's Fuel, it is spent and the fill may lay half again as many blocks (`overchargeStrength` in `[mutations]`).

Personal controls: Chalk fill shape (Outline/Solid disc/Wall), Overcharge (On/Off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `faceReachPerLevel` | `1` | Blocks the Builder's Wand face reaches out from the block you aim at, per level. Faces stop at 3, a 7x7 face. |
| `fillBlocksLevel1` | `64` | Most blocks one chalk fill lays at level 1. |
| `fillBlocksLevel2` | `160` | Most blocks one chalk fill lays at level 2. |
| `fillBlocksLevel3` | `320` | Most blocks one chalk fill lays at level 3. |
| `circleRadiusLevel1` | `15` | Largest Circle Compass radius at level 1. Chalk Line's own limit applies when it is larger. |
| `circleRadiusLevel2` | `24` | Largest Circle Compass radius at level 2. |
| `circleRadiusLevel3` | `32` | Largest Circle Compass radius at level 3. |
| `wallHeightAtFirstLevel` | `2` | Layers a wall fill stacks at level 1. |
| `wallHeightPerLevel` | `2` | Wall layers added per level after the first. |
| `discLevel` | `2` | Level from which a circle can be filled as a solid disc. |
| `fillsPerWindow` | `3` | Fills one player may start within the fill window. |
| `fillWindowSeconds` | `10` | Length of the fill window in seconds. |
| `blocksPerTick` | `4` | Blocks a fill lays per tick, before the server-wide `buildBlocksPerTick` cap. |

### Skyhook (`upgraded-architect-skyhook`)

3 levels · 15, 14 and 18 knowledge · Fuses Magic Foundation, Scaffolder and Steady Hands

While you hold Skyhook, Magic Foundation, Scaffolder and Steady Hands work for you at level 2 at upgrade level 1, level 3 at upgrade level 2 and level 4 at upgrade level 3, one level below the usual loan.

[Magic Foundation](/adapt/12-skill-architect#magic-foundation-architect-foundation) places temporary tinted glass under your feet while you sneak, from a block budget that grows with level. [Scaffolder](/adapt/12-skill-architect#scaffolder-architect-scaffolder) turns sneak-placed blocks into scaffolds that expire and return the item, lasting longer at higher levels. [Steady Hands](/adapt/12-skill-architect#steady-hands-architect-steady-hands) gives full knockback resistance, extra safe fall distance and a short mining speed boost after a sneak placement with air below, with more safe fall distance at higher levels.

**Mason's Template.** Craft it from a paper, a chalk wand and a copper or iron ingot (shapeless). It is a tool: it only works while you hold Skyhook, and craft it alone to wipe it.

- Copy: click two opposite corners of a build, up to 6, 10 and 14 blocks per side at levels 1, 2 and 3. The template stores block types and their facing, never items. Containers, spawners, signs, banners, heads, doors, beds and other two-block or multi-face blocks are left out, and states that would give something for free are reset: a double slab copies as a single slab, stacked candles and pickles as one, nothing stays waterlogged, lit, filled or charged.
- Stamp: right-click a block to see the copy where it would go, shown only to you. Blocks you are short of glow red and the action bar lists what is missing. Right-click the same spot again to build. Left-click rotates the copy a quarter turn; sneak-left-click a block mirrors it from level 2. Rotating and mirroring turn stairs, logs, rails and other directional blocks with it.
- Repeat: with a finished chalk guide on a wand in your off hand or hotbar, sneak-right-click a block to stamp the copy along the guide: fence posts, pillars, arches, window rows. Stamps are spaced by the copy's widest side plus the gap from your personal controls, at most 4, 8 and 16 stamps at levels 1, 2 and 3.
- Undo: sneak-right-click the air (needs Wrecking Hand).
- Replace brush: swap hands with the template to switch it between stamp and replace brush (needs Wrecking Hand).

Every block a stamp lays is a real placement paid from your inventory, then the bundles, backpacks and shulker boxes you carry. A stamp lays at most 216, 1000 and 2744 blocks, a repeat at most 4096. Stamps only fill air and replaceable blocks, never load a chunk, and you run one build at a time.

Overcharge: when a repeat starts and you can pay the other mutated skill's Fuel, it is spent and the repeat may lay half again as many stamps (`overchargeStrength` in `[mutations]`).

Personal controls: Gap between repeated stamps (None/1 block/2 blocks/4 blocks), Overcharge (On/Off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `lighterLoanLevels` | `1` | Levels below the usual loan at which Magic Foundation, Scaffolder and Steady Hands work, never below 1. |
| `templateSizeAtFirstLevel` | `6` | Blocks per side a template copies at level 1. One stamp lays at most this many cubed. |
| `templateSizePerLevel` | `4` | Blocks per side added per level after the first. |
| `repeatsAtFirstLevel` | `4` | Stamps one repeat lays along a chalk guide at level 1. Doubles each level. |
| `maxBlocksPerRepeat` | `4096` | Most blocks one repeat lays, however many stamps it makes. |
| `mirrorLevel` | `2` | Level from which a template can be mirrored. |
| `previewSeconds` | `30` | Seconds a stamp preview waits for the second right-click. |
| `blocksPerTick` | `8` | Blocks a stamp lays per tick, before the server-wide `buildBlocksPerTick` cap. |

### Wrecking Hand (`upgraded-architect-wrecking-hand`)

3 levels · 15, 14 and 18 knowledge · Fuses Mason's Eraser, Silk-Touch Glass and Smart Shape

While you hold Wrecking Hand, Mason's Eraser works for you at level 3 at upgrade level 1, level 4 at upgrade level 2 and level 5 at upgrade level 3. Silk-Touch Glass and Smart Shape have one level and work at all three upgrade levels.

[Mason's Eraser](/adapt/12-skill-architect#masons-eraser-architect-demolition) breaks your own recent placements instantly and returns the item and its contents. [Silk-Touch Glass](/adapt/12-skill-architect#silk-touch-glass-architect-glass) drops glass as a block when you break it with an empty hand or a non-tool. [Smart Shape](/adapt/12-skill-architect#smart-shape-architect-smart-shape) rotates a block to its next facing or axis when you sneak-punch it with an empty hand.

**Undo.** Sneak-right-click the air with the tool you built with to undo your newest build of that tool: a chalk wand undoes chalk fills, a block undoes Builder's Wand faces, the Mason's Template undoes stamps, repeats and replaces. The undo window is 60, 120 and 240 seconds and you can step back through your last 1, 3 and 5 builds at levels 1, 2 and 3. An undo removes only the blocks of that build that are still the type that was placed and gives back exactly the item each one cost, so a block you broke or changed returns nothing and no build can be undone twice. Undo history survives restarts.

**Replace.** Set a Mason's Template to the replace brush and keep it in your hotbar. Hold a mining tool, put the new block in your off hand and sneak-left-click a block of one of your recent builds or of your drawn chalk guide. Each old block is broken for real with your tool, giving what that tool would drop and taking 1 durability, then the new block is placed and paid from your supplies. A replace swaps at most 64, 160 and 320 blocks at levels 1, 2 and 3. It skips blocks your tool gets no drops from, containers, spawners, signs, banners and unbreakable blocks, and on a chalk guide it only swaps natural blocks, never player-placed ones. Replace never gives silk-touch drops without silk touch.

Overcharge: when a replace starts and you can pay the other mutated skill's Fuel, it is spent and the replace may swap half again as many blocks (`overchargeStrength` in `[mutations]`).

Personal controls: Overcharge (On/Off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `undoWindowSeconds` | `60` | Seconds after a build during which you can undo it at level 1. The window doubles each level. |
| `undoBuildsAtFirstLevel` | `1` | Builds you can undo, newest first, at level 1. |
| `undoBuildsPerLevel` | `2` | Undoable builds added per level after the first. |
| `replaceBlocksLevel1` | `64` | Blocks one replace swaps at level 1. |
| `replaceBlocksLevel2` | `160` | Blocks one replace swaps at level 2. |
| `replaceBlocksLevel3` | `320` | Blocks one replace swaps at level 3. |
| `durabilityPerBlock` | `1` | Durability a replace takes from the held tool per block it breaks. |
| `blocksPerTick` | `8` | Blocks an undo or replace changes per tick, before the server-wide `buildBlocksPerTick` cap. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Architect](/adapt/12-skill-architect).
