---
title: "Upgrades - Blocking"
description: "Blocking upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you [mutate](/adapt/35-mutations) Blocking, and they replace the original [Blocking](/adapt/14-skill-blocking) adaptations they fuse. Each one needs a vanilla shield in either hand.

## Upgrades

### Mirror Guard (`upgraded-blocking-mirror-guard`)

3 levels · 13, 13 and 16 knowledge · Fuses Perfect Guard, Mirror Block and Counter Guard

Raise your shield no more than 350, 450 and 550 ms before a hit lands, at levels 1, 2 and 3, while facing its source, to cancel the hit completely. One raise cancels one hit, and the cooldown between cancelled hits is 2.5, 2 and 1.5 seconds.

A cancelled melee hit deals 80%, 100% and 120% of its damage back to the attacker. A cancelled projectile flies back the way it came at the same speed, and deals that same share of its damage to whatever it hits. A projectile too slow to send back is launched along your view instead, and a projectile that was already reflected is not reflected again.

Personal controls: Affect players (on/off). With it off, hits from players are still cancelled but not sent back.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `windowMillisBase` | `250` | Timing window in milliseconds before level scaling. |
| `windowMillisPerLevel` | `100` | Timing window in milliseconds added per level. |
| `minFacingAlignment` | `0.15` | Lowest alignment between your view and the direction to the attacker that still counts as facing it. |
| `reflectShareBase` | `0.6` | Share of the cancelled hit sent back, before level scaling. |
| `reflectSharePerLevel` | `0.2` | Share sent back added per level. |
| `reflectVelocityFactor` | `1.0` | Speed of a reflected projectile relative to its incoming speed. |
| `minReflectedVelocitySquared` | `0.08` | Squared speed under which a projectile is launched along your view instead. |
| `fallbackReflectedSpeed` | `1.2` | Speed of a projectile launched along your view. |
| `cooldownMillisBase` | `3000` | Cooldown in milliseconds before level scaling. |
| `cooldownMillisPerLevel` | `500` | Milliseconds of cooldown removed per level. |
| `minimumCooldownMillis` | `1000` | Shortest cooldown in milliseconds at any level. |
| `xpOnNegate` | `16` | Skill XP for each cancelled hit from a natural mob or a player. |

### Living Wall (`upgraded-blocking-living-wall`)

3 levels · 13, 13 and 16 knowledge · Fuses Shield Wall, Interpose and Bastion Stance

Sneak without moving for 1 second with your shield raised, then let go of sneak: the shield is planted in front of you as a wall of tinted glass, 3, 3 and 5 blocks wide at levels 1, 2 and 3 and 2 blocks high, that stands for 10, 15 and 20 seconds. Planting costs 20 shield durability and has a cooldown of 40, 30 and 20 seconds. The wall only goes up where you can build, only fills empty space, and if no block of it fits nothing is planted and nothing is spent. Its blocks cannot be broken, pushed or blown up and never drop.

The wall stops projectiles and slows hostile mobs standing against it. You and other players behind it, up to 4, 5 and 6 blocks back and no farther to the side than its ends plus one, take 30%, 40% and 50% less damage from blows, sweeping blows, projectiles, explosions and falling blocks, capped at 60%. Where PvP is on, only players on your scoreboard team count as allies; elsewhere any permitted nearby player does. A hit you dealt yourself is never reduced.

While the wall stands both your hands are free. Right-click the wall to pick it up. It also comes down, and the shield comes back to your off hand (or main hand, or inventory), when it expires, when you walk 24 blocks away or leave the world, when you log out, or when you respawn after dying. The shield is kept in your player data while it is planted, so a restart or crash gives it back the next time you join, and it can only come back once.

While your shield is raised you take the same reduction yourself from those kinds of damage, your shield loses 1 durability per point it takes off you, at least 1 per hit, and is never broken by it. You also have full knockback resistance and full explosion knockback resistance while blocking. On server versions without explosion knockback resistance, only normal knockback is resisted.

Personal controls: Protected allies (All permitted nearby players/Same scoreboard team); Shield durability remaining (No extra reserve/Keep 25%/Keep 50%).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `damageReductionBase` | `0.2` | Damage reduction behind the wall and while blocking, before level scaling. |
| `damageReductionPerLevel` | `0.1` | Damage reduction added per level. |
| `maxDamageReduction` | `0.6` | Highest damage reduction at any level. |
| `rangeBase` | `3.0` | Depth in blocks of the sheltered area behind the wall, before level scaling. |
| `rangePerLevel` | `1.0` | Sheltered depth in blocks added per level. |
| `widthBelowTopLevel` | `3` | Wall width in blocks at levels 1 and 2. |
| `widthAtTopLevel` | `5` | Wall width in blocks at level 3. |
| `durationMillisBase` | `5000` | How long the wall stands in milliseconds, before level scaling. |
| `durationMillisPerLevel` | `5000` | Milliseconds the wall stands added per level. |
| `cooldownMillisBase` | `50000` | Cooldown between plants in milliseconds, before level scaling. |
| `cooldownMillisPerLevel` | `10000` | Milliseconds of cooldown removed per level. |
| `stillTicks` | `20` | Ticks you sneak still with the shield raised before letting go plants it. |
| `plantDurability` | `20` | Shield durability each plant costs. |
| `returnDistance` | `24` | Distance in blocks from the wall at which it comes down and the shield returns. |
| `slowAmplifier` | `1` | Slowness amplifier given to hostile mobs against the wall. |
| `durabilityPerDamage` | `1.0` | Shield durability worn per point of damage the raised shield takes off you. |
| `xpPerDamageShielded` | `3.0` | Skill XP per point of damage taken off you or an ally from a natural mob or a player. |

### Tempered Aegis (`upgraded-blocking-tempered-aegis`)

3 levels · 13, 13 and 16 knowledge · Fuses Tempered Guard and Shieldbearer's Resolve

A hit you block from a natural mob or a player gives durability back: the shield gets up to 4, 6 and 8 at levels 1, 2 and 3, off hand first, and whatever the shield repair left of the hit's wear goes to the first damaged armor piece, boots first, up to 2, 3 and 4. Together they never get back more than the hit took from the shield, so blocking never adds durability. Hits from spawner, bred and other farmed mobs, from dispensers and from anything that is not a mob or a player repair nothing. When an attacker holding an axe hits you while you block and puts your shield on cooldown, that cooldown is cleared 2 ticks later, so you can raise the shield again at once.

Sprint, jump and raise your shield in the air: the first creature within 2 blocks in front of you is slammed for 3, 4.5 and 6 damage, shoved back and slowed for 1.5 seconds. The bash costs 5 shield durability and has a cooldown of 6, 5 and 4 seconds. It follows PvP and protection rules and spares your own pets.

Repairs pay no skill XP. Clearing the cooldown and bashing pay skill XP only against a natural mob or a player.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `shieldRepairBase` | `2` | Shield durability restored per blocked hit from a natural mob or a player, before level scaling, never more than the hit wore off. |
| `shieldRepairPerLevel` | `2` | Shield durability restored added per level. |
| `armorRepairBase` | `1` | Armor durability restored per blocked hit, before level scaling, from what the shield repair left of the hit's wear. |
| `armorRepairPerLevel` | `1` | Armor durability restored added per level. |
| `xpOnShrug` | `12` | Skill XP each time an axe from a natural mob or a player fails to disable your shield. |
| `bashDamageBase` | `1.5` | Bash damage before level scaling. |
| `bashDamagePerLevel` | `1.5` | Bash damage added per level. |
| `bashCooldownMillisBase` | `7000` | Bash cooldown in milliseconds, before level scaling. |
| `bashCooldownMillisPerLevel` | `1000` | Milliseconds of bash cooldown removed per level. |
| `bashDurability` | `5` | Shield durability each bash costs. |
| `recentSprintWindowMillis` | `900` | How long after sprinting a raised shield in the air still bashes, in milliseconds. |
| `bashKnockback` | `1.0` | Horizontal shove given to the bashed target. |
| `bashUpwardKnockback` | `0.25` | Upward shove given to the bashed target. |
| `bashStaggerTicks` | `30` | Ticks the bashed target is slowed. |
| `bashStaggerAmplifier` | `2` | Slowness amplifier of the stagger. |
| `xpPerBash` | `8` | Skill XP per bash on a natural mob or a player. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Blocking](/adapt/14-skill-blocking).
