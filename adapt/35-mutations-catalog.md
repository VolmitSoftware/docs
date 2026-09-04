---
title: "Mutations Catalog"
description: "Benefits, burdens, controls, and settings for every Mutation"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Adapt has fifteen Mutations. Each entry lists its benefit, burden, qualifying skill domains, controls, and configuration. See [Mutations Overview](/adapt/34-mutations-overview) for setup and slot rules.

Perfect adaptation removes burdens at master level 200 by default. Temperbound and Masterwork Bond bind to player-crafted items, so losing the item also loses access to that binding.

## The fifteen Mutations

Everything below assumes the same starting conditions. The Mutation feature is enabled in `mutations.toml`. The type's own `enabled` flag is true. The player holds `adapt.mutations` and `adapt.use.mutation.<id>`. The type is equipped in an unlocked slot and reads as `EXPRESSED`.

The player is in survival or adventure mode. The world is not blacklisted globally or for that type. Any protection plugin allows the block or entity action involved. PvP-facing effects also need both the global and per-type `pvpEnabled` flags. Where an entry says "control effect", that is a short potion effect on the target. The effect is chosen from the weapon or tool family: glowing, weakness, slowness, or levitation.

### Gale Lung (`gale-lung`)

Sprinting and airborne travel fill Momentum. A hit at full Momentum slings you behind a melee target or knocks a projectile target off its line. Hits you take at full Momentum knock you harder. Perfect adaptation removes that burden. If you stand still, Momentum drains. Blocking empties it at any level. Teal wind gathers around your feet and weapon.

How to use it:

1. Keep moving. Sprinting fills Momentum fastest. Airborne movement fills it more slowly.
2. Land a melee hit or a shot while Momentum is full.
3. Keep off the shield. The shield clears the meter.

### Bastion Spine (`bastion-spine`)

If you stand still, you brace. While braced, you soak incoming damage into Stability. Your next heavy swing releases it as a cone-shaped shove. It suits a player who holds a doorway, not one who chases. While braced you cannot sprint or jump. Perfect adaptation gives sprint and jump back. A hit from behind always breaks the stance and dumps the stored force. Stone ribs and bright cracks show the charge.

How to use it:

1. Stand on solid ground. Do not fly, glide, swim, or stand in liquid. Hold still for the anchor time.
2. Let enemies hit you. Each point of damage adds Stability.
3. Attack with an empty hand, a shield, an axe, a pickaxe, a shovel, a hoe, or any block in your main hand. Swords and other items do not release the wave.

### Verdant Molt (`verdant-molt`)

Crouch on natural ground and hold still to shed every potion effect on you. This clears poison, wither, and stacked debuffs. It is not selective. Your good effects go with the bad. It also eats saturation. Perfect adaptation spares both. Either way, new effects are refused for a short window afterward. A friendly re-buff will not land at once. Leaves, scales, or spores burst away from you.

How to use it:

1. Stand on natural, unplaced ground.
2. Hold sneak and stay in place for the charge time. Moving, taking damage, or letting go cancels it.
3. Wait out the cooldown before the next cleanse.

### Temperbound (`temperbound`)

Link four armor pieces you crafted yourself. They share durability as one set. A piece that would break becomes Cracked instead of vanishing. If you remove or swap a linked piece, the set switches off for a while. Perfect adaptation removes that shutdown. Only one set stays linked at a time. Glowing lines connect the linked pieces.

How to use it:

1. Craft and wear all four pieces yourself. The Mutation only accepts items you personally crafted.
2. Right-click the Adapt activator block to authorize Mutation editing.
3. In `/adapt mutations menu`, open the Temperbound card and click Link Current Armor. The same slot later shows Unlink Armor.

### Paradox Scar (`paradox-scar`)

A long move or a teleport leaves a return point behind you. Sneak plus swap-hands snaps you back to it once. It turns an ender pearl or a bad landing into a round trip. The point is visible to everyone. Enemies can break it early by damaging it. While it exists, no other one forms. Perfect adaptation stops it blocking other Mutation return effects. A bright afterimage marks the spot.

How to use it:

1. Move or teleport at least the minimum distance in one go.
2. While the afterimage is up, sneak and press the swap-hands key.
3. You return only in the same world, within the maximum return distance, and only if protection allows both ends.

### Arsenal Cortex (`arsenal-cortex`)

If you switch weapon or tool types between hits, you build a combo. The combo carries one control effect into your next hit. It rewards juggling your hotbar mid-fight. If you hit twice with the same type, the chain breaks and locks briefly. Perfect adaptation removes that lock. Switching types is still what builds the chain. A changing symbol spins around the held item.

How to use it:

1. Hit with one weapon or tool type.
2. Switch to a different type and hit again before the chain times out.
3. Keep alternating.

### Packmind (`packmind`)

Your first hit marks a target. Every pet or opted-in ally that hits the same mark slows it and builds Tempo. When Tempo fills, the mark takes a stronger slow and the meter resets. Until someone else joins in, your own damage is cut by `waitingDamageFactor`. Perfect adaptation removes that cut. Tempo clears whenever you are alone on the mark. Amber lines link the group to the mark.

How to use it:

1. Hit a target to mark it.
2. Have a pet, or a player who opted in with `/adapt mutations cooperative on`, attack the same target within range.
3. Keep the pressure on before the mark expires.

### Trophy Crucible (`trophy-crucible`)

Kill naturally spawned hostiles. One of their drops comes away with a hidden trophy mark. Take that drop to a crafting table and you prepare a control effect aimed at that mob family. In exchange, that family notices you from farther away and sees through Mutation stealth. Perfect adaptation removes that notice. You still store only one trophy effect at a time. A mask of the stored mob type appears behind you.

How to use it:

1. Kill a naturally spawned monster or slime yourself. Six deaths of the same family in the same chunk within a minute count as farming and stop granting trophies.
2. Pick up the drop that carries the mark.
3. Sneak-right-click a crafting table while holding it. Doing the same with an empty hand clears a stored trophy after a confirmation.

### Umbral Echo (`umbral-echo`)

Attack from a new angle or with a new weapon type. A weaker copy of your control effect fires again a moment later. This rewards circling a target instead of standing in front of it. If you repeat the same approach, it reveals you and shuts down Mutation stealth briefly. Perfect adaptation removes that reveal. A dark purple afterimage replays the effect.

How to use it:

1. Hit a target.
2. Move so your next hit comes from a different angle bucket, or switch weapon type.
3. Hit again before the technique memory expires.

### Living Lattice (`living-lattice`)

Harvesting and replanting earns Root Charge. Spend it to grow a short temporary walkway straight ahead at your feet. Use it as a bridge or a way over a gap. Then watch it rot. Fire and lava can wipe your charge. Perfect adaptation prevents that wipe. If you force a path to collapse early, you spend hunger and briefly lock new paths. Green roots turn brown just before they go.

How to use it:

1. Break a fully grown crop, or a natural log or stem, then replant on that exact spot within 30 seconds. A crop wants the same crop back, a log wants its matching sapling or a mangrove propagule. Each accepted replant banks one Root Charge.
2. Face where you want the path.
3. Sneak and use a sapling to spend one charge. The path only forms where protection allows placement.

### Masterwork Bond (`masterwork-bond`)

Bind one tool you crafted. It stops at one durability instead of breaking. It refuses to work until repaired. For a favorite pickaxe that is the difference between a repair trip and a loss. Only the bound tool is protected. If you lose it, you wait a long time before you bind another. Perfect adaptation lets your other tools work normally with Mutation effects. Runes on the tool crack as it approaches the limit.

How to use it:

1. Craft the tool yourself.
2. Right-click the Adapt activator block, then open the Masterwork Bond card in `/adapt mutations menu`.
3. Hold the tool and click Bind Held Tool. Unlink Masterwork frees the slot and starts the replacement cooldown.

### Deepblood (`deepblood`)

Mining deep, undisturbed stone and ore builds Deep Charge. That charge pays for your food-based healing while you are down there. It can also spend itself to save your bound tool from breaking. Underground healing is something you fund. With no charge and no perfect adaptation, food regeneration is cancelled below the depth line. Charge also decays on a half-life once you are back above it. Perfect adaptation restores underground healing at zero charge. Saving the tool still costs charge. Red cracks spread across you and the bound tool.

How to use it:

1. Mine naturally placed deepslate, obsidian, crying obsidian, or any ore at or below the configured depth.
2. Right-click the Adapt activator block, open the Deepblood card, and click Bind Held Tool to link a durable tool.
3. Stay underground to make the charge count.

### Mycelial Nerve (`mycelial-nerve`)

Beneficial potion effects you give yourself spread, at reduced duration, to nearby tamed animals and to players who opted in to cooperative effects. One brewing stand can carry a small group. Your own copy runs shorter than normal. Fire damage severs the link for a few seconds. Perfect adaptation removes both of those costs. Spore trails carry the effect outward.

How to use it:

1. Have the players you want covered run `/adapt mutations cooperative on`, or use the menu toggle.
2. Stand within range of them or your tamed animals.
3. Apply a beneficial, non-instant potion effect to yourself. Sharing happens on its own.

### Gravebloom (`gravebloom`)

Kill a naturally spawned hostile. A short-lived bloom grows where it died. The bloom pushes nearby crops along and heals your tamed animals. Your own food-based healing is weaker while a bloom is active. Past the halfway point of its life, a bloom starts pulling monsters toward it. Perfect adaptation stops both. Pale flowers and soul particles rise from the kill spot.

How to use it:

1. Kill a naturally spawned monster or slime yourself, subject to the same anti-farm rule as Trophy Crucible.
2. Stay near the bloom for the crop growth and pet healing.
3. Expect company late in a bloom's life.

### Resonant Formula (`resonant-formula`)

Craft once, brew once, and enchant once inside the same window and you arm a combo. Your next non-damaging Anomaly effect then repeats at half strength after a short delay. If you repeat a step you already did, the combo breaks and strips your oldest helpful potion effect. Perfect adaptation removes that strip. Three symbols join when the combo is armed.

How to use it:

1. Craft any item.
2. Brew a potion.
3. Enchant an item. Order does not matter, but all three must land within the sigil lifetime and none may repeat.

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

- [34 - Mutations Overview](/adapt/34-mutations-overview)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
- [48 - API - Mutations](/adapt/48-api-mutations)
