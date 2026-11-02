---
title: "Brimstone: Launchers and effects"
description: "Launching, crafting, the seven effects, and cleanup"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "brimstone, gameplay, effects"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

This page covers how players get and launch TNT, what each effect does, and how Brimstone cleans up what it spawns.

## Launching

Hold a launcher in your main hand and left-click the air. A launch needs, in this order:

1. `brimstone.launch` and `brimstone.launch.<id>`.
2. A world allowed by `access.worldMode`.
3. Permission from [WorldGuard](/brimstone/06-integrations#worldguard), when it applies.
4. A finished cooldown. The default is 30 ticks.
5. Enough fuel. The default is one gunpowder, and the `love` launcher uses one redstone.
6. Capacity under the [entity limits](/brimstone/03-configuration#limits).

A successful launch consumes one launcher item plus the fuel. Launchers are recognized by data stored on the item, so ordinary TNT renamed in an anvil does not become a launcher.

## Crafting

When `gameplay.craftingEnabled` is on, each launcher with a `craftingCount` above zero has a shapeless recipe: one ordinary TNT plus its configured material and count. Crafting needs `brimstone.craft`, `brimstone.craft.<id>`, and an allowed world.

Launchers cannot be placed or dispensed as ordinary TNT, and automated crafters cannot produce them.

## Effects

Each effect has its own launch sound and presentation. Particle and secondary-entity budgets still limit the output.

| Effect | Presentation |
|---|---|
| `notch` | TNT priming sound, flames, and smoke |
| `creeper` | Firework launch sound, repeated hisses, a green flickering creeper-shaped firework, and charged creepers |
| `firework` | Firework launch sound and up to five rockets within 1.5 times the radius; rockets vary their shapes, colors, fades, flicker, and trails |
| `love` | Explosion launch sound, hearts, and critical-hit particles |
| `dj` | Piston launch sound and a 477-position note sequence at two ticks per position |
| `rainbow` | Horse-jump launch sound, chimes, and pastel particle colors |
| `water` | Swimming launch sound, dripping water and splash particles, and a swimming sound at detonation |

The `creeper` and `firework` launchers gain extra upward speed at launch. The `creeper` effect spawns one charged creeper per two blocks of radius, rounded up, from one to eight.

The `dj` sequence stops at detonation or after one pass. The full sequence needs a `fuseTicks` of at least 954, and the default 80-tick fuse plays about the first 39 positions, roughly four seconds.

A radius of zero is not a harmless mode: an effect can still create secondary entities, sounds, and particles.

## Cleanup

`/brimstone clear` removes owned TNT, creepers, and fireworks, and leaves other entities alone. `/brimstone status` reports TNT and secondary effects separately.

Owned effects are not saved with the world. Secondary effects expire after `effects.secondaryLifetimeTicks`, and chunk unload releases their place in the limits. Any owned effect found at startup or on chunk load that Brimstone is not tracking is removed.

When the plugin is disabled, Brimstone removes its owned effects. A full Folia shutdown only releases its counts, because the regions have already stopped.

## Related pages

- [Configuration *Launcher definitions, limits, and particle settings*](/brimstone/03-configuration)
- [Commands and permissions *`give`, `clear`, and launch permissions*](/brimstone/02-commands-permissions)
- [Integrations *How WorldGuard flags apply to each effect*](/brimstone/06-integrations)
{.links-list}
