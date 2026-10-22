---
title: "ByteCompanions: Particles and features"
description: "Feature switches, particle effects, decorations, attributes, buffs, potion effects, and the Spigot experience limit"
published: true
date: 2026-10-16T00:00:00.000Z
tags: "bytecompanions, particles, features"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

The `[features]` section of `config.toml` switches seven feature packs on and off. Each pack reads its own file under `plugins/ByteCompanions/features/`. This page describes the particle, decoration, attribute, buff, and potion effect packs; progression and boosters have [their own page](/bytecompanions/07-progression-and-boosters).

## Feature switches

| Switch | Default | File |
|---|---|---|
| `features.attributes` | `false` | `features/attributes/config.toml` |
| `features.buffs` | `false` | `features/buffs/config.toml` |
| `features.decorations` | `true` | `features/decorations/config.toml` |
| `features.effects` | `false` | `features/effects/config.toml` |
| `features.particles` | `true` | `features/particles/config.toml`, `features/particles/icons.toml` |
| `features.progression` | `false` | `features/progression/config.toml` |
| `features.boosters` | `false` | `features/progression/config.toml` |

A disabled pack keeps its saved records and hides its commands and dashboard pages. Every file is validated before a reload, even for a disabled pack, so a bad file is reported while the pack is off. The starter setup menu sets these switches as a group.

## Particles

Thirty-four built-in effects can be attached to an equipped companion: `angel_ring_effect`, `aura_effect`, `autumn_leaves_effect`, `batman_effect`, `candy_cane_swirl_effect`, `cherry_blossom_effect`, `christmas_lights_effect`, `cloud_effect`, `double_helix_effect`, `dragon_wing_effect`, `ember_trail_effect`, `emerald_charm_effect`, `fireworks_burst_effect`, `halo_sparks_effect`, `harvest_glow_effect`, `haunted_wisps_effect`, `jack_o_lantern_effect`, `lightning_crackle_effect`, `love_particle_effect`, `magic_aura_effect`, `magic_effect`, `midnight_confetti_effect`, `music_effect`, `orb_effect`, `pendulum_effect`, `pulse_effect`, `rainbow_effect`, `rainbow_umbrella_effect`, `rotating_ring_effect`, `scanner_effect`, `snowfall_effect`, `soul_flame_spiral_effect`, `star_crown_effect`, and `umbrella_effect`. All of them keep emitting while the companion moves. The seasonal set covers Halloween (`jack_o_lantern_effect`, `haunted_wisps_effect`), Thanksgiving (`autumn_leaves_effect`, `harvest_glow_effect`), Christmas (`christmas_lights_effect`, `candy_cane_swirl_effect`), and New Year (`fireworks_burst_effect`, `midnight_confetti_effect`); operators gate them with the same per-effect permission as any other effect.

Players choose an effect from the dashboard or with `/bytecompanions particles equip <companion> <effect>`, and need `bytecompanions.particle.<effect>` for each one. The choice is saved per companion and survives removing and re-equipping that companion; `particles unequip` clears it. Personal viewer settings and `performance.maximumParticleIntensity` decide how many frames each viewer receives.

`features/particles/icons.toml` holds one `items.<effect>` table per effect with `material`, `name`, `amount`, `lore`, and `custom-model-data` for the menu. `features/particles/config.toml` holds the text format and the movement settling thresholds. Particle choices are saved through the root `storage.backend` beside companions, collections, and progression; see [Configuration](/bytecompanions/03-configuration#storage).

Companion definitions can also list built-in effects under `animations.post-tracking`; Companion Studio toggles them. With `features.particles` off those entries are skipped.

## Decorations

A decoration is a companion definition anchored at a fixed location for everyone to see. Add one table per decoration in `features/decorations/config.toml`:

```toml
[decorations.spawn_bee]
enabled = true
companion = "bee"
world = "world"
x = 100.5
y = 64.0
z = -200.5
yaw = 90.0
pitch = 0.0
body-yaw = 90.0
eye-height = 1.4
height = 1.8
```

| Setting | Default | What it changes |
|---|---|---|
| `settings.update-interval` | `3` | Ticks between decoration animation updates |
| `settings.view-distance` | `32` | Blocks within which players see a decoration |
| `settings.view-refresh-delay` | `3` | Ticks between viewer distance checks |

Decorations respect `serverRules.hiddenWorlds` and each viewer's visibility setting. The WorldGuard flags do not apply to decoration locations.

## Attributes

`features/attributes/config.toml` adds attribute modifiers while a companion is equipped. Each entry names an `attribute`, an `amount`, and an `operation` of `ADD_NUMBER`, `ADD_SCALAR`, or `MULTIPLY_SCALAR_1`. The bundled file has only commented examples.

```toml
[[companions.bee]]
attribute = "armor"
amount = 10
operation = "ADD_NUMBER"
```

## Buffs

`features/buffs/config.toml` changes vanilla rewards while a companion is equipped. Each companion has a `default-priority` and eight `vanilla.<category>` tables: `experience`, `experience-mob`, `experience-block`, `experience-furnace`, `experience-fishing`, `mob-loot`, `block-drops`, and `fishing-loot`. A category has `enabled`, `operation` (`SUM`, `MULTIPLY`, or `ADD_PERCENT`), `value`, and `cooldown` in milliseconds. When several companions buff the same category the higher priority wins. Cooldowns are kept in memory only.

```toml
[companions.copper]
default-priority = 10

[companions.copper.vanilla.experience-block]
enabled = true
operation = "ADD_PERCENT"
value = 10
cooldown = 0
```

The bundled file gives `copper` +10% block experience, `warrior` +10% mob experience, and `scout` +10% fishing experience. On Paper, an active source-specific buff suppresses the general `experience` buff for the same pickup.

## Potion effects

`features/effects/config.toml` applies potion effects while a companion is equipped. Each entry has `effect`, `amplifier`, `priority`, and `stack-mode` (`SUM` or `HIGHEST`). Summed amplifiers are capped at 255. An equal or stronger effect from another source is kept; when a companion effect that replaced a weaker external effect ends, the external effect returns with its remaining time.

```toml
[[companions.mushroom]]
effect = "NIGHT_VISION"
amplifier = 0
priority = 10
stack-mode = "HIGHEST"
```

The bundled file gives `bee`, `myself`, and `rainbow` Speed I with highest-value stacking and `mushroom` Night Vision I.

## Spigot experience limit

Spigot has no event for the general experience pickup. With `features.buffs` on, every `companions.<id>.vanilla.experience.enabled` in the buff file must be `false`; with `features.boosters` on, no booster may use the `experience` channel. A file that breaks this is rejected with the companion or booster path in the console, and the last good runtime stays active. The four source-specific experience categories and channels work on Spigot.

## Related pages

- [Configuration *The `features` and `performance` sections*](/bytecompanions/03-configuration)
- [Companions and collections *Viewer settings and particle selection*](/bytecompanions/05-companions-and-collections)
- [Companion Studio *Editing attribute, potion, and buff entries in game*](/bytecompanions/06-companion-studio)
- [Progression and boosters *Upgrades that build on these bonuses*](/bytecompanions/07-progression-and-boosters)
{.links-list}
