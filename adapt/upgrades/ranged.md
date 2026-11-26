---
title: "Upgrades - Ranged"
description: "Ranged upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you [mutate](/adapt/35-mutations) Ranged, and they replace the original [Ranged](/adapt/26-skill-ranged) adaptations they fuse.

## Upgrades

### Stormshot (`upgraded-ranged-stormshot`)

3 levels · 15, 14 and 18 knowledge · Fuses Force Shot, Heavy Draw and Arrow Piercing

Arrows, spectral arrows and thrown tridents you launch leave 65%, 90% and 115% faster at levels 1, 2 and 3 and pierce 1, 2 and 3 extra targets. Every entity they hit takes 60%, 90% and 120% more damage, except protected targets. Stormshot applies no slowness or other drawback while you shoot.

Stormshot also lets you craft a Quiver from leather, string and an arrow. Keep it anywhere in your inventory. It holds plain arrows, spectral arrows, Snare Arrows and Ricochet Arrows, 128, 192 and 256 in all at levels 1, 2 and 3. Right-click with it to store the loose arrows in your inventory, and sneak and right-click to take out a stack of each kind. When you shoot the last loose arrow of a kind, a stack of that kind moves from the Quiver to your inventory. Of the arrows you shoot that hit a creature, 30%, 45% and 60% go back into the Quiver, and those arrows cannot also be picked up. Arrows shot with Infinity, arrows the shot did not spend, misses, and hits on spawner, spawn egg, bred and other farmed mobs return nothing, and a piercing arrow counts once. Without Stormshot the Quiver does nothing and keeps what it holds.

Personal controls: Eligible projectiles (All permitted/Bow arrows/Crossbow arrows/All arrows/Tridents/Thrown projectiles).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `speedBonusBase` | `0.4` | Extra launch speed before level scaling. |
| `speedBonusPerLevel` | `0.25` | Extra launch speed added per level. |
| `damageBonusBase` | `0.3` | Extra damage before level scaling. |
| `damageBonusPerLevel` | `0.3` | Extra damage added per level. |
| `pierceBase` | `0` | Targets pierced before the level is added. |
| `xpPerHit` | `3` | Skill XP for each hit on a natural target. |
| `returnShareBase` | `0.15` | Share of hitting arrows the Quiver takes back, before level scaling. |
| `returnSharePerLevel` | `0.15` | Share of hitting arrows the Quiver takes back, added per level. |
| `quiverStacksBase` | `1` | Stacks of 64 the Quiver holds before the level is added. |

### Hunter's Web (`upgraded-ranged-hunters-web`)

3 levels · 13, 13 and 16 knowledge · Fuses Web Snare, Pinning Shot and Floaters

Hunter's Web lets you craft four Snare Arrows from four arrows and a cobweb. A Snare Arrow you shoot from a bow or crossbow cages the living entity it hits for 2.5, 3.5 and 4.5 seconds at levels 1, 2 and 3. The cage fills the empty blocks at the target's body height, the blocks above and below it, and the four blocks beside it with cobwebs where you are allowed to place blocks. While caged, the target loses 75% of its movement speed, keeps only 15% of its sideways momentum, and floats with Levitation I. The cobwebs disappear when the cage ends and cannot be broken, pushed by pistons or destroyed by explosions before then. The same target cannot be caged again for 4 seconds. You, your own tamed pets and protected targets are never caged. Plain arrows, tridents, snowballs and eggs cage nothing, and neither does a Snare Arrow the shot did not spend, such as one shot with Infinity or in creative mode. Anyone without Hunter's Web shoots a Snare Arrow as a plain arrow.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `durationTicksBase` | `30` | Cage duration in ticks before level scaling. |
| `durationTicksPerLevel` | `20` | Cage duration in ticks added per level. |
| `liftAmplifier` | `0` | Levitation amplifier that lifts the caged target. |
| `pinAmplifier` | `4` | Strength of the pin. Each step removes 15% movement speed. |
| `horizontalVelocityFactor` | `0.15` | Share of the target's sideways speed kept when caged. |
| `recageMillis` | `4000` | Milliseconds before the same target can be caged again. |
| `xpPerCage` | `8` | Skill XP for each caged natural mob or player. |

### Trueflight (`upgraded-ranged-trueflight`)

3 levels · 13, 13 and 16 knowledge · Fuses Heartseeker, Ricochet Bolt and Trajectory Sight

Start drawing a bow while looking at a living creature within 32, 40 and 48 blocks at levels 1, 2 and 3 to lock it for 4 seconds. Invisible creatures, protected targets and passive or neutral mobs cannot be locked. While you draw, the curved path to the target is drawn in particles. An arrow fired from that bow while the lock holds curves onto the target for up to 6 seconds of flight.

Trueflight lets you craft four Ricochet Arrows from four arrows and a slime ball. When a locked Ricochet Arrow hits a living entity, it bounces once to the nearest other eligible creature within 8, 10 and 12 blocks, flying 20% faster and curving onto it. The bounced hit deals 2, 3 and 4 extra damage, and an arrow sped up by Stormshot keeps its extra damage and pierce on the bounce. Other arrows curve but do not bounce, and a Ricochet Arrow the shot did not spend does not bounce. The bounced arrow cannot be picked up. Crossbows and tridents do not lock.

Volley: after a full second of drawing, sweep the crosshair across creatures in line of sight within the lock range to lock 2, 3 and 4 of them in all at levels 1, 2 and 3, counting the first lock. Releasing at full draw sends the drawn arrow at the first lock and one more arrow at each other lock, each paid with a plain arrow from your inventory. A lock you cannot pay for gets no arrow. After a Volley, the next one waits 6 seconds.

Personal controls: Trajectory trail (on/off); Impact marker (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `lockRangeBase` | `24` | Lock range in blocks before level scaling. |
| `lockRangePerLevel` | `8` | Lock range in blocks added per level. |
| `lockMillis` | `4000` | Milliseconds a lock waits for the shot. |
| `bounceRadiusBase` | `6` | Bounce search radius in blocks around the first target, before level scaling. |
| `bounceRadiusPerLevel` | `2` | Bounce search radius in blocks added per level. |
| `bounceDamageBase` | `1` | Extra damage on the bounced hit before level scaling. |
| `bounceDamagePerLevel` | `1` | Extra bounced damage added per level. |
| `bounceSpeedBonus` | `0.2` | Speed the arrow gains when it bounces. |
| `ignorePassiveMobs` | `true` | Leaves passive and neutral mobs out of locks and bounces, so only hostile mobs and players are chosen. |
| `initialArcDistance` | `12` | Distance in blocks the opening curve lasts. |
| `initialArcControlDistance` | `8` | Distance in blocks ahead that the opening curve bends from. Higher values leave straighter. |
| `lungeRadius` | `2.5` | Distance in blocks from the target where the arrow turns hardest. |
| `turnDegreesPerTick` | `10` | Steering per tick in flight, in degrees. |
| `lungeTurnDegreesPerTick` | `18` | Steering per tick near the target, in degrees. |
| `maxFlightMillis` | `6000` | Longest a locked arrow steers, in milliseconds. |
| `previewIntervalMillis` | `150` | Milliseconds between redraws of the curve while drawing. |
| `previewSegments` | `24` | Points sampled when drawing the curve. |
| `xpPerHit` | `6` | Skill XP for each locked or bounced hit on a natural target. |
| `volleyLocksBase` | `1` | Volley locks before the level is added. |
| `fullDrawMillis` | `1000` | Milliseconds of drawing before sweeping adds Volley locks. |
| `volleyCooldownMillis` | `6000` | Milliseconds between Volleys. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Ranged](/adapt/26-skill-ranged).
