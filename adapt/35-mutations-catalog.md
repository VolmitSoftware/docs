---
title: "Mutations Catalog"
description: "Benefits, burdens, controls, and settings for every Mutation"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Adapt has fifteen mutations; perfect adaptation removes burdens at master level 200 by default, and losing a crafted Temperbound or Masterwork Bond item drops that binding. A control effect is Glowing, Weakness, Slowness, or Levitation from the weapon or tool family, and setup is on [Mutations Overview](/adapt/34-mutations-overview).

## The fifteen Mutations

### Gale Lung (`gale-lung`)

Sprinting and airborne movement fill Momentum; standing still drains it, and blocking empties it at any level. A hit at full Momentum moves you behind a melee target or shoves a projectile target off its line. Hits you take at full Momentum knock you harder, and perfect adaptation removes that extra knockback.

### Bastion Spine (`bastion-spine`)

Standing still on solid ground, not flying, gliding, swimming, or in liquid, braces you and stores incoming damage as Stability. A swing with an empty hand, a shield, an axe, a pickaxe, a shovel, a hoe, or a block in the main hand releases that force as a cone shove; swords and other items do not. While braced you cannot sprint or jump, a hit from behind always breaks the stance and dumps the stored force, and perfect adaptation restores sprint and jump.

### Verdant Molt (`verdant-molt`)

Crouch and hold still on natural, unplaced ground to remove every potion effect on you; moving, taking damage, or releasing sneak cancels the charge. The cleanse is not selective and also removes saturation, then new effects are refused for a short window, so a re-buff does not land at once. Perfect adaptation keeps beneficial effects and saturation; the refusal window remains.

### Temperbound (`temperbound`)

Link four armor pieces you personally crafted, from the Temperbound card in `/adapt mutations menu` after right-clicking the Adapt activator, and they share durability; a piece that would break becomes Cracked instead of vanishing. Removing or swapping a linked piece shuts the set off, and only one set stays linked. Perfect adaptation removes that shutdown; the card action is Link Current Armor, and the same slot later shows Unlink Armor.

### Paradox Scar (`paradox-scar`)

A move or teleport of at least the minimum distance leaves one return point that everyone can see, and sneak plus swap-hands returns you to it once, only in the same world, within the maximum return distance, and only if protection allows both ends. Enemies can break it by damaging it, and while it exists no other return point forms. Perfect adaptation stops it from blocking other mutation return effects.

### Arsenal Cortex (`arsenal-cortex`)

Switching weapon or tool type between hits builds a combo that carries one control effect into the next hit. Two hits with the same type break the chain and lock it briefly. Perfect adaptation removes that lock; switching types is still what builds the chain.

### Packmind (`packmind`)

Your first hit marks a target; each pet, or player who opted in with `/adapt mutations cooperative on`, that hits the same mark slows it and builds Tempo, and a full meter applies a stronger slow and then resets. Until someone else joins, your damage is multiplied by `waitingDamageFactor`, and Tempo clears when you are alone on the mark. Perfect adaptation removes that damage cut.

### Trophy Crucible (`trophy-crucible`)

Kill a naturally spawned monster or slime yourself and one drop can carry a hidden trophy mark; sneak-right-click a crafting table while holding it to store one control effect for that mob family, or do the same with an empty hand to clear a stored trophy after confirmation. That family then notices you from farther away and sees through mutation stealth. Perfect adaptation removes that notice; you still store only one trophy effect, and six deaths of the same family in the same chunk within 60 seconds grant nothing.

### Umbral Echo (`umbral-echo`)

A hit from a new angle bucket or a new weapon type repeats a weaker copy of your control effect after a delay. Repeating the same approach reveals you and shuts off mutation stealth briefly. Perfect adaptation removes that reveal.

### Living Lattice (`living-lattice`)

Breaking a fully grown crop, or a natural log or stem, then replanting that exact spot within 30 seconds banks one Root Charge: a crop must be the same crop, and a log wants its matching sapling or a mangrove propagule. Sneak-use a sapling to spend one charge and place a temporary path straight ahead where protection allows. Fire and lava can wipe stored charge; collapsing a path early spends hunger and briefly locks new paths, and perfect adaptation prevents only the wipe.

### Masterwork Bond (`masterwork-bond`)

Bind one tool you crafted, from the Masterwork Bond card after right-clicking the Adapt activator, and it stops at 1 durability instead of breaking, then refuses to work until repaired. Only that tool is protected, losing it starts the replacement cooldown, and Unlink Masterwork frees the slot and starts that cooldown. Perfect adaptation lets your other tools keep working with mutation effects; the bind action is Bind Held Tool.

### Deepblood (`deepblood`)

Mining naturally placed deepslate, obsidian, crying obsidian, or any material ending in `_ORE`, at or below the depth line, builds Deep Charge, which pays for food-based healing down there and can stop a bound tool from breaking. With no charge, food regeneration below that line is cancelled, and stored charge halves on a timer once you are back above the line. Perfect adaptation restores underground healing at zero charge; saving the tool still costs charge, and the tool is bound from the Deepblood card with Bind Held Tool after right-clicking the Adapt activator.

### Mycelial Nerve (`mycelial-nerve`)

A beneficial, non-instant potion effect you apply to yourself also reaches nearby tamed animals and players who opted in with `/adapt mutations cooperative on` or the menu toggle, at a shorter shared duration. Your own copy is shorter than normal, and fire damage stops sharing for a few seconds. Perfect adaptation removes both of those costs.

### Gravebloom (`gravebloom`)

Killing a naturally spawned monster or slime yourself, under the same anti-farm rule as Trophy Crucible, grows a short-lived bloom where it died that pushes nearby crops and heals your tamed animals. While a bloom is active your food-based healing is weaker, and past half its life it pulls monsters toward it. Perfect adaptation stops both of those.

### Resonant Formula (`resonant-formula`)

Crafting, brewing, and enchanting once each inside the sigil window, in any order and with no step repeated, arms a combo. Your next non-damaging Anomaly effect then repeats at half strength after a short delay. Repeating a step breaks the combo and strips your oldest helpful potion effect, and perfect adaptation removes that strip.

## Reference

### Catalog identity

Every type also has the permission `adapt.use.mutation.<id>`.

| Id | Enum | Display | Domains | Icon | PvP relevant |
|----|------|---------|---------|------|--------------|
| `gale-lung` | `GALE_LUNG` | Gale Lung | BODY + HUNT | `FEATHER` | true |
| `bastion-spine` | `BASTION_SPINE` | Bastion Spine | BODY + INDUSTRY | `DEEPSLATE_BRICKS` | true |
| `verdant-molt` | `VERDANT_MOLT` | Verdant Molt | BODY + WILD | `MOSS_BLOCK` | false |
| `temperbound` | `TEMPERBOUND` | Temperbound | BODY + CRAFT | `ANVIL` | false |
| `paradox-scar` | `PARADOX_SCAR` | Paradox Scar | BODY + ANOMALY | `RECOVERY_COMPASS` | true |
| `arsenal-cortex` | `ARSENAL_CORTEX` | Arsenal Cortex | HUNT + INDUSTRY | `SMITHING_TABLE` | true |
| `packmind` | `PACKMIND` | Packmind | HUNT + WILD | `LEAD` | true |
| `trophy-crucible` | `TROPHY_CRUCIBLE` | Trophy Crucible | HUNT + CRAFT | `SKELETON_SKULL` | true |
| `umbral-echo` | `UMBRAL_ECHO` | Umbral Echo | HUNT + ANOMALY | `ECHO_SHARD` | true |
| `living-lattice` | `LIVING_LATTICE` | Living Lattice | INDUSTRY + WILD | `MANGROVE_ROOTS` | false |
| `masterwork-bond` | `MASTERWORK_BOND` | Masterwork Bond | INDUSTRY + CRAFT | `NETHERITE_PICKAXE` | false |
| `deepblood` | `DEEPBLOOD` | Deepblood | INDUSTRY + ANOMALY | `DEEPSLATE_DIAMOND_ORE` | false |
| `mycelial-nerve` | `MYCELIAL_NERVE` | Mycelial Nerve | WILD + CRAFT | `SPORE_BLOSSOM` | false |
| `gravebloom` | `GRAVEBLOOM` | Gravebloom | WILD + ANOMALY | `WITHER_ROSE` | false |
| `resonant-formula` | `RESONANT_FORMULA` | Resonant Formula | CRAFT + ANOMALY | `ENCHANTED_BOOK` | true |

`pvpRelevant` is a catalog flag the GUI reads for labeling. The switch that actually blocks player-versus-player effects is `pvpEnabled`, global and per type.

### Type config

Each type has its own camel-case section in `mutations.toml`, such as `[galeLung]`. That section holds the shared profile keys from [34 - Mutations Overview](/adapt/34-mutations-overview) plus the keys below. All millisecond values clamp to a maximum of 31,536,000,000 (one year). All tick values clamp to a maximum of 72,000. Only the per-key minimum is listed where that is the only bound.

#### Gale Lung

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `maximumMomentum` | `100` | 1 to 100 | Momentum ceiling |
| `sprintMomentumPerBlock` | `8` | 0 to `maximumMomentum` | Momentum gained per block sprinted |
| `airborneMomentumPerBlock` | `4` | 0 to `maximumMomentum` | Momentum gained per block moved off the ground |
| `stationaryVentMillis` | `1250` | minimum 100 ms | How fast Momentum drains once you stop moving |
| `burdenKnockbackMultiplier` | `1.35` | 1 to 2 | Knockback taken at full Momentum. 1.35 is 35 percent more. |
| `meleeFlankDistance` | `1.5` | 0 to 3 blocks | How far you are moved around a target on a charged melee hit |
| `projectileDisplacement` | `0.45` | 0 to 1.5 | How far a charged projectile shoves its target |

#### Bastion Spine

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `anchorChargeMillis` | `1500` | minimum 250 ms | Time standing still before you brace |
| `maximumStability` | `8` | 1 to 8 | Cap on stored force |
| `stabilityPerDamage` | `0.5` | 0.01 to 4 | Stored force gained per point of damage taken while braced |
| `waveRange` | `5` | 1 to 12 blocks | Reach of the push |
| `waveAngleDegrees` | `90` | 15 to 180 degrees | Full width of the push cone |
| `maximumVelocity` | `0.85` | 0.1 to 1.5 | Top push speed applied to a target |
| `maximumTargets` | `12` | 1 to 12 | Entities one push can move |

#### Verdant Molt

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `chargeTicks` | `50` | 10 to 72,000 ticks | Ticks crouched and still before the cleanse fires |
| `cooldownMillis` | `90000` | minimum 0 ms | Wait between cleanses |
| `saturationCost` | `6` | 0 to 20 | Saturation removed by a cleanse, skipped at perfect adaptation |
| `recoveryTicks` | `40` | 1 to 72,000 ticks | Ticks where new potion effects are refused after a cleanse |
| `maximumEffects` | `32` | 1 to 32 | Potion effects examined by one cleanse |

#### Temperbound

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `rejectionMillis` | `30000` | minimum 0 ms | How long the linked set stops working after a piece is removed or swapped |

#### Paradox Scar

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `minimumDistance` | `8` | 1 to 64 blocks | Move or teleport distance that creates a return point |
| `echoLifetimeMillis` | `12000` | minimum 1,000 ms | How long a return point stays usable |
| `maximumReturnDistance` | `64` | `minimumDistance` to 128 blocks | Furthest you can stand and still return |
| `hostileCollapseTicks` | `60` | 1 to 72,000 ticks | Delay before an enemy-damaged return point breaks |

#### Arsenal Cortex

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `chainTimeoutMillis` | `5000` | minimum 250 ms | Time allowed between hits of different types |
| `maximumChain` | `4` | 2 to 4 steps | Steps stored in one combo |
| `dullnessMillis` | `3000` | minimum 0 ms | Lockout after repeating the same type |

#### Packmind

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `quarryMillis` | `20000` | minimum 1,000 ms | How long your mark stays on a target |
| `participationRange` | `16` | 2 to 32 blocks | How close a pet or ally must be to count |
| `maximumTempo` | `6` | 1 to 6 | Cap on teamwork charge |
| `maximumMembers` | `8` | 1 to 8 | Pets and players counted for one target |
| `waitingDamageFactor` | `0.8` | 0.1 to 1 | Your damage before anyone helps. 0.8 is 20 percent less. |

#### Trophy Crucible

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `imprintLifetimeMillis` | `1800000` | minimum 1,000 ms | How long a prepared trophy effect stays ready |
| `recognitionRange` | `16` | 2 to 32 blocks | Extra distance at which the imprinted mob family notices you |

#### Umbral Echo

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `angleBucketDegrees` | `45` | 15 to 180 degrees | Angle change that counts as attacking from a new side |
| `techniqueMemoryMillis` | `5000` | minimum 250 ms | How long your last angle and weapon type are remembered |
| `echoDelayTicks` | `8` | 1 to 72,000 ticks | Delay before the repeated effect lands |
| `exposureTicks` | `60` | 1 to 72,000 ticks | How long repeating an approach reveals you |
| `maximumTargetMemories` | `8` | 1 to 8 | Attack histories kept per player |

#### Living Lattice

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `maximumRootCharge` | `12` | 1 to 12 | Cap on Root Charge |
| `pathLength` | `5` | 1 to 8 blocks | Blocks attempted per path |
| `blockLifetimeMillis` | `15000` | minimum 1,000 ms | How long path blocks remain |
| `collapseLockMillis` | `4000` | minimum 0 ms | Lockout after an early collapse |
| `maximumBlocks` | `16` | 1 to 16 | Temporary blocks tracked per player |
| `maximumStructures` | `3` | 1 to 3 | Paths tracked per player |

#### Masterwork Bond

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `abandonCooldownMillis` | `86400000` | minimum 0 ms | Wait before binding a replacement tool. The default is 24 hours. |

#### Deepblood

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `maximumDepthY` | `16` | -2048 to 2048 | Highest Y that counts as deep, for both charge gain and the healing rule |
| `ichorPerBlock` | `1` | 0 to 100 | Deep Charge earned per qualifying natural block |
| `maximumIchor` | `100` | 1 to 100 | Deep Charge cap |
| `regenerationCost` | `4` | 0 to `maximumIchor` | Charge spent per underground food-regeneration step |
| `toolPreservationCost` | `25` | 0 to `maximumIchor` | Charge spent to stop the bound tool from breaking |
| `aboveGroundHalfLifeMillis` | `300000` | minimum 1,000 ms | Time above the depth line for stored charge to halve |

Qualifying blocks are naturally placed deepslate, obsidian, crying obsidian, or any material ending in `_ORE`, broken at or below `maximumDepthY`.

#### Mycelial Nerve

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `range` | `16` | 2 to 32 blocks | Sharing radius |
| `copiedDurationFactor` | `0.5` | 0.05 to 1 | Shared effect duration against the original. 0.5 is half. |
| `rootDurationFactor` | `0.75` | 0.05 to 1 | Your own effect duration before perfect adaptation |
| `maximumRecipients` | `8` | 1 to 8 | Pets and opted-in players reached by one effect |
| `reconnectLockMillis` | `5000` | minimum 0 ms | How long fire damage stops sharing |

#### Gravebloom

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `lifetimeMillis` | `20000` | minimum 1,000 ms | How long each bloom stays active |
| `radius` | `6` | 1 to 12 blocks | Range in which a bloom helps crops and animals |
| `maximumBlooms` | `3` | 1 to 3 | Active blooms per player |
| `regenerationFactor` | `0.5` | 0 to 1 | Your food-based healing while a bloom is active. 0.5 is half. |
| `pulseTicks` | `20` | 5 to 72,000 ticks | Ticks between bloom pulses |
| `maximumCrops` | `16` | 1 to 16 | Crops checked by one pulse |
| `maximumAnimals` | `8` | 1 to 8 | Animals checked by one pulse |

Monster attraction starts once a bloom has less than half its lifetime left. It does not happen at perfect adaptation.

#### Resonant Formula

| Key | Default | Range | What it does |
|-----|---------|-------|--------------|
| `sigilLifetimeMillis` | `600000` | minimum 1,000 ms | Time allowed to craft, brew, and enchant once each |
| `collapseLockMillis` | `30000` | minimum 0 ms | Lockout after repeating a step |
| `echoFactor` | `0.5` | 0.05 to 1 | Strength of the repeated effect. 0.5 is half. |
| `echoDelayTicks` | `10` | 1 to 72,000 ticks | Delay before the repeated effect lands |

### Anti-farm limits

Trophy Crucible and Gravebloom both need a kill the player landed on a naturally spawned, untamed monster or slime. Six deaths of the same mob family in the same chunk within 60 seconds are treated as farming. Farming stops granting trophies and blooms.

## See also

Setup: [Mutations Overview](/adapt/34-mutations-overview).
