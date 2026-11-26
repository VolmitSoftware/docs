---
title: "Upgrades - Agility"
description: "Agility upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you merge Agility into a mutated skill ([Mutations](/adapt/35-mutations)), and they replace the original [Agility](/adapt/11-skill-agility) adaptations.

## Upgrades

### Slipstream (`upgraded-agility-slipstream`)

3 levels · 13, 13 and 16 knowledge · Fuses Wind Up, Slipstream Slide and Marathoner

Sprinting builds movement speed up to 60, 80 or 100 percent extra at levels 1, 2 and 3: every 5 seconds of continuous running adds 15, 20 or 25 percent. The bonus resets when you stop sprinting, start swimming, flying or gliding, mount something, or leave Survival or Adventure.

Pressing sneak while sprinting, or within 0.35 seconds of sprinting, throws you into a slide along your look direction at 0.75, 0.9 or 1.05 blocks per tick for 18, 22 or 26 ticks, with 90 percent of ground friction removed. The slide recharges in 2.4, 1.8 or 1.2 seconds. The speed bonus carries through the slide and for 0.75 seconds after it, so sprinting again keeps the run going.

Sprinting costs no hunger.

Slipstream also runs [Featherfoot](/adapt/11-skill-agility) at level 2, 3 or 4, so sprinting at the top level leaves farmland, pressure plates, berry bushes and powder snow alone. Vault is kept at its only level by every Agility mutation.

Personal controls: Slide control (Tap sneak/Hold sneak). With Hold sneak, releasing sneak ends the slide.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `ticksPerStep` | `100` | Running ticks that make up one step of the speed ramp. |
| `speedPerStepBase` | `0.10` | Movement speed gained per step before level scaling, as a share of base speed. |
| `speedPerStepPerLevel` | `0.05` | Speed per step added per level. |
| `speedLerpPerTick` | `0.45` | Share of the gap to the target speed closed each tick. |
| `movementVelocityThreshold` | `0.015` | Horizontal speed in blocks per tick that counts as running at full speed for the trail and stat. |
| `slideForceBase` | `0.6` | Slide speed before level scaling, in blocks per tick. |
| `slideForcePerLevel` | `0.15` | Slide speed added per level, in blocks per tick. |
| `slideTicksBase` | `14` | Slide length before level scaling, in ticks. |
| `slideTicksPerLevel` | `4` | Slide length added per level, in ticks. |
| `slideFrictionReduction` | `0.9` | Share of ground friction removed during a slide. |
| `slideCooldownMillisBase` | `3000` | Slide cooldown before level scaling, in milliseconds. |
| `slideCooldownMillisPerLevel` | `600` | Slide cooldown removed per level, in milliseconds. |
| `minimumSlideCooldownMillis` | `900` | Shortest slide cooldown at any level, in milliseconds. |
| `carryGraceMillis` | `750` | Time after a slide ends during which the run still counts without sprinting, in milliseconds. |
| `maximumSpeedBonusBase` | `0.4` | Highest extra movement speed a run can reach before level scaling, as a share of base speed. |
| `maximumSpeedBonusPerLevel` | `0.2` | Highest extra movement speed added per level. |
| `featherfootLevelBase` | `1` | Featherfoot level at upgrade level 0; each upgrade level adds one. |

### Skyrunner (`upgraded-agility-skyrunner`)

3 levels · 15, 14 and 18 knowledge · Fuses Wall Jump, Super Jump and Air Dash

Leaving the ground gives you 1, 2 or 2 mid-air charges at levels 1, 2 and 3. A wall jump, a mid-air high jump, an air dash or a grapple spends one, and latching onto a wall gives one back, at most 3 times before you land again. Landing clears the charges.

Holding sneak in mid-air next to a wall latches you to it; releasing sneak while latched jumps off upward at 0.8, 0.9 or 1.0 blocks per tick at levels 1, 2 and 3. Pressing sneak in mid-air away from a wall launches a high jump that rises 2.6, 3.2 or 3.8 blocks and resets your fall distance. Holding sneak on the ground and jumping reaches the same height. Left-clicking air dashes where you look at 1.05, 1.2 or 1.35 blocks per tick with a small upward lift; each dash costs 1.5 hunger and saturation and needs food in your bar.

From level 1 you can craft a Grappling Line from a fishing rod, a string and an iron ingot. Right-click a block in sight within 16, 24 or 32 blocks to hook it and be reeled toward it along a slight arc; right-click again to let go and keep your momentum. The reel ends when you reach the hook, or after at most 3 seconds. Each grapple costs 1 durability and a mid-air charge; a grapple from the ground leaves your next airtime one charge short. The line never hooks through a block, past another player or onto a block in a claim you may not use. Fall distance is cleared while the line pulls you. The line does nothing for anyone without Skyrunner.

Wall latching needs the gravity attribute and high jumps need the jump strength attribute. On a server version without one of them, that part does nothing.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `highJumpHeightBase` | `2.0` | High jump height before level scaling, in blocks. |
| `highJumpHeightPerLevel` | `0.6` | High jump height added per level, in blocks. |
| `wallJumpVelocityBase` | `0.7` | Upward speed of a wall jump before level scaling, in blocks per tick. |
| `wallJumpVelocityPerLevel` | `0.1` | Wall jump speed added per level, in blocks per tick. |
| `dashForceBase` | `0.9` | Air dash speed before level scaling, in blocks per tick. |
| `dashForcePerLevel` | `0.15` | Air dash speed added per level, in blocks per tick. |
| `dashUpwardLift` | `0.12` | Upward speed added to every air dash. |
| `dashHungerCost` | `1.5` | Saturation and hunger spent per air dash. |
| `wallRefreshesPerJump` | `3` | Walls that give back a mid-air charge before you touch the ground again. |
| `midAirChargesBase` | `1` | Mid-air charges at level 1. |
| `midAirChargesPerLevel` | `1` | Mid-air charges added per level above 1. |
| `maxMidAirCharges` | `2` | Most mid-air charges at any level. |
| `grappleRangeBase` | `8` | Grappling line reach before level scaling, in blocks. |
| `grappleRangePerLevel` | `8` | Grappling line reach added per level, in blocks. |
| `reelSpeedBase` | `0.8` | Reel speed before level scaling, in blocks per tick. |
| `reelSpeedPerLevel` | `0.1` | Reel speed added per level, in blocks per tick. |
| `reelMomentumCarry` | `0.35` | Share of your own momentum kept on each reel tick. |
| `reelArcLift` | `0.08` | Upward speed added on each reel tick while far from the hook, in blocks per tick. |
| `maxReelTicks` | `60` | Longest a reel pulls, in ticks. |
| `grappleDurabilityCost` | `1` | Durability spent per grapple. |

### Untouchable (`upgraded-agility-untouchable`)

3 levels · 13, 13 and 16 knowledge · Fuses Cat Reflexes, Roll Landing and Kip-Up

While you sprint, 50, 70 or 90 percent of the projectiles that would hit you at levels 1, 2 and 3 are cancelled and you sidestep them. Fall damage from falls up to 12, 20 or 30 blocks is cancelled; you drop into a short roll on landing instead. Taller falls hurt as usual. Ender pearl landings are not rolled and deal their normal damage. Dodges, rolls and recovery pushes pay no skill XP.

Any damage from a mob, player or projectile that does land gives you a speed burst of +20 percent movement speed at level 1 and +40 percent at levels 2 and 3, for 2, 2.5 or 3 seconds. Jumping within 0.8, 1.0 or 1.2 seconds of that hit pushes you 0.6 blocks per tick toward where you are moving, or where you look if you are standing still. The push works in Survival and Adventure while not flying, gliding, swimming or riding.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `speedAmplifierBase` | `0` | Speed burst strength at level 1; one step is added every second level, and each step is +20 percent speed. |
| `speedDurationTicksBase` | `30` | Speed burst duration before level scaling, in ticks. |
| `speedDurationTicksPerLevel` | `10` | Speed burst duration added per level, in ticks. |
| `recoveryWindowMillisBase` | `600` | Time after a hit in which a jump pushes you on, before level scaling, in milliseconds. |
| `recoveryWindowMillisPerLevel` | `200` | Recovery window added per level, in milliseconds. |
| `recoverySpeed` | `0.6` | Horizontal speed of the recovery push, in blocks per tick. |
| `jumpVelocityThreshold` | `0.2` | Lowest upward speed that counts as a jump for the recovery push. |
| `rollProneTicks` | `8` | Ticks spent in the roll pose after a landing. |
| `dodgeChanceBase` | `0.3` | Chance to sidestep a projectile while sprinting, before level scaling. |
| `dodgeChancePerLevel` | `0.2` | Dodge chance added per level. |
| `maxRolledFallByLevel` | `[12, 20, 30]` | Highest fall in blocks that ends in a roll, one entry per level. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Agility](/adapt/11-skill-agility).
