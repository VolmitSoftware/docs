---
title: "Brimstone: Launchers and effects"
description: "Launching, crafting, the twelve effects, and cleanup"
published: true
date: 2026-11-07T00:00:00.000Z
tags: "brimstone, gameplay, effects"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

This page covers how players get and launch TNT, what each effect does, and how Brimstone cleans up what it spawns.

## Launching

Hold a launcher in your main hand and left-click the air. A launch needs, in this order:

1. `brimstone.launch` and `brimstone.launch.<id>`.
2. A world allowed by `access.worldMode`.
3. Permission from [WorldGuard](/brimstone/06-integrations#worldguard) and [other protection plugins](/brimstone/06-integrations#other-protection-plugins), when they apply.
4. A finished cooldown. The default is 30 ticks, and leaving and rejoining does not reset it.
5. Enough fuel. The default is one gunpowder, and the `love` launcher uses one redstone.
6. Capacity under the [entity limits](/brimstone/03-configuration#limits).

A successful launch consumes one launcher item plus the fuel. Launchers are recognized by data stored on the item, so ordinary TNT renamed in an anvil does not become a launcher.

The TNT appears just in front of the player's eyes and flies in the aimed direction at the launcher's `velocity`, plus its `lift` straight up. When a wall or low ceiling leaves no room in front of the player, it starts one block above their feet instead. The player's own movement is not added.

## Crafting

When `gameplay.craftingEnabled` is on, each launcher with a `craftingCount` above zero has a shapeless recipe: one ordinary TNT plus its configured material and count. Crafting needs `brimstone.craft`, `brimstone.craft.<id>`, and an allowed world.

Launchers cannot be placed or dispensed as ordinary TNT, and automated crafters cannot produce them.

## Effects

Each effect has its own launch sound and presentation. Particle and secondary-entity budgets still limit the output.

| Effect | Presentation |
|---|---|
| `notch` | TNT priming sound, flames, and smoke |
| `creeper` | Firework launch sound, repeated hisses, a green flickering creeper-shaped firework, and charged creepers |
| `firework` | Firework launch sound and up to five rockets within 1.5 times the radius, launched three ticks apart; rockets vary their shapes, colors, fades, flicker, and trails |
| `love` | Amethyst chime launch sound, hearts, and critical-hit particles |
| `dj` | Piston launch sound, a 477-position note sequence at two ticks per position, and a bass drum and bass note at detonation |
| `rainbow` | Horse-jump launch sound, chimes that fall steadily in pitch until detonation, and pastel particle colors |
| `water` | Swimming launch sound, dripping water and splash particles, and a swimming sound at detonation |
| `impact` | Arrow launch sound and critical-hit particles; explodes as soon as it lands, hits a wall, or touches a mob or another player |
| `cluster` | Higher TNT priming sound and small flames; scatters four smaller charges at detonation |
| `bouncy` | Slime launch sound and slime particles; rebounds three times, then explodes on the next landing |
| `frost` | Snowball launch sound and snowflakes; freezes and slows nearby mobs and players without breaking blocks |
| `smoke` | Fire-extinguish launch sound and smoke; leaves a cloud that blinds everyone in it except the launching player |

Trail particles are spread along the path the TNT covered since the previous pulse, centered on the TNT, so fast launchers leave a continuous line. Explosion particles arrive in three waves over four ticks, each wider than the last.

The default `creeper` and `firework` launchers have a `lift` that makes them arc upward even when aimed level. The `creeper` effect spawns one charged creeper per two blocks of radius, rounded up, from one to eight. Each creeper is placed on solid ground within three blocks above or below its spot, so it does not start inside a crater wall. Firework rockets that would start inside a block move up to three blocks higher. With `effects.creeperAI` off, those creepers stand still and cannot explode until they expire.

`impact`, `bouncy`, and `cluster` still explode when their fuse ends first. Each `bouncy` rebound keeps most of its horizontal speed, and the TNT also rebounds off walls.

A `cluster` detonation scatters four charges with half-second to one-and-a-half-second fuses. Each explodes with 40 percent of the radius, at least 1, and never starts fires. The charges count against the secondary [limits](/brimstone/03-configuration#limits), and `/brimstone clear` removes them.

`frost` and `smoke` never break blocks or deal explosion damage, and their `radius` sets how far they reach. `frost` reaches at least 1.5 blocks. It freezes each mob or player in reach, the launching player included, for 15 seconds and gives them Slowness II for 5 seconds. `smoke` reaches 1.5 to 8 blocks. Its cloud lasts eight seconds and gives Blindness for 2.5 seconds each second to everyone in reach except the launching player. `/brimstone clear` stops a cloud early.

The `dj` sequence stops at detonation or after one pass. The full sequence needs a `fuseTicks` of at least 954, and the default 80-tick fuse plays about the first 39 positions, roughly four seconds.

A radius of zero is not a harmless mode: an effect can still create secondary entities, sounds, and particles.

## Cleanup

`/brimstone clear` removes owned TNT, cluster charges, creepers, and fireworks, and stops smoke clouds. It leaves other entities alone. `/brimstone status` reports TNT and secondary effects separately.

Owned effects are not saved with the world. Secondary effects expire after `effects.secondaryLifetimeTicks`, and chunk unload releases their place in the limits. Any owned effect found at startup or on chunk load that Brimstone is not tracking is removed.

When the plugin is disabled, Brimstone removes its owned effects. A full Folia shutdown only releases its counts, because the regions have already stopped.

## Related pages

- [Configuration *Launcher definitions, limits, and particle settings*](/brimstone/03-configuration)
- [Commands and permissions *`give`, `clear`, and launch permissions*](/brimstone/02-commands-permissions)
- [Integrations *How WorldGuard flags apply to each effect*](/brimstone/06-integrations)
{.links-list}
