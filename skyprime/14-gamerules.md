---
title: 14 - Island Gamerules
description: Boolean and numeric island rules, operator defaults, limits and live editing
published: true
date: 2026-10-14T00:00:00.000Z
tags: skyprime, gamerules, environment
editor: markdown
dateCreated: 2026-10-10T10:49:11.887Z
---

SkyPrime exposes 34 native gamerules for each island: 29 Boolean rules and five integer rules. A saved choice applies to every loaded dimension belonging to that island. Operators control which rules teammates may change and the permitted numeric ranges.

## Commands and menus

`/is gamerules` opens the paginated catalog. Each rule has a detail screen showing the saved preference, effective value, operator default and permitted range. Boolean choices and integer adjustments are drafts until Save is clicked; the menu's Cancel button discards the draft. The numeric input control opens a 60-second chat prompt; enter a whole number or `cancel`. A valid number updates the draft and still requires Save; typing `cancel` returns to the previous draft. Locked and unsupported rules explain why editing is unavailable.

`/is gamerule <rule> <value>` saves directly. Boolean rules accept `server`, `enabled` or `disabled`; numeric rules accept `server` or a whole number in the configured range. For example:

```text
/is gamerule spawn_phantoms disabled
/is gamerule fall_damage disabled
/is gamerule random_tick_speed 5
/is gamerule random_tick_speed server
```

Browsing requires membership in an active island and `skyprime.use`. Saving also requires the island `ENVIRONMENT` action, available to owners/managers and delegated custom roles. Open menus recheck membership, permissions, the saved preference and the rule's configuration before saving. A teammate's pending change also invalidates a stale draft.

## Rule catalog

| Group | Boolean rule IDs |
| --- | --- |
| Player survival | `keep_inventory`, `natural_health_regeneration`, `drowning_damage`, `fall_damage`, `fire_damage`, `freeze_damage`, `immediate_respawn` |
| Spawning | `spawn_mobs`, `spawn_monsters`, `spawn_phantoms`, `spawn_patrols`, `spawn_wandering_traders`, `spawn_wardens`, `raids` |
| Mobs and crafting | `mob_griefing`, `forgive_dead_players`, `universal_anger`, `limited_crafting` |
| Drops and explosions | `block_drops`, `entity_drops`, `mob_drops`, `block_explosion_drop_decay`, `mob_explosion_drop_decay`, `tnt_explosion_drop_decay`, `tnt_explodes`, `projectiles_can_break_blocks` |
| Fluids and growth | `water_source_conversion`, `lava_source_conversion`, `spread_vines` |

These are native Minecraft rules and retain their native interactions. Enabling a rule does not bypass SkyPrime protection, resource caps, difficulty or another plugin's restrictions. `spawn_mobs` still controls spawning alongside the more specific spawning rules. SkyPrime's time/weather modes, PvP protection and portal access remain separate controls. Command administration, movement checks, spectator chunk generation and experimental minecart settings are outside this catalog.

| Integer rule | Initial editable range | Maximum configurable range |
| --- | --- | --- |
| `random_tick_speed` | 0 through 10 | 0 through 1000 |
| `players_sleeping_percentage` | 0 through 100 | 0 through 100 |
| `max_snow_accumulation_height` | 0 through 8 | 0 through 8 |
| `max_entity_cramming` | 1 through 64 | 0 through 256 |
| `fire_spread_radius_around_player` | -1 through 128 | -1 through 256 |

For fire spread, zero disables the native spread/ticking path, positive values set the player-distance radius in blocks, and -1 removes that distance restriction.

Higher random-tick settings increase native block-tick work. The initial range limits player choices to ten; only operators can raise that bound. A cramming value of zero disables cramming damage, so operators must explicitly lower its minimum to allow that choice. The limits constrain explicit island choices and configured defaults, not values inherited from the operator-controlled primary world.

## Operator configuration

`config/gamerules.toml` contains one entry for every catalog rule. Fields are live-editable under `gamerules.rules.<id>` in the configuration editor. Invalid types, missing rules, unknown IDs, reversed bounds or defaults outside the bounds reject the candidate and retain the active configuration.

```toml
[rules.random_tick_speed]
editable = true
defaultValue = "server"
minimum = 0
maximum = 10

[rules.fall_damage]
editable = false
defaultValue = "disabled"
minimum = 0
maximum = 1
```

The generated file contains all 34 entries; the example shows two entries to edit. Boolean bounds stay at zero and one. `defaultValue` is a string using the same values as the command. Every rule initially allows island edits and has a `server` default.

Choosing `server` removes the island override and uses the configured default. When that default is also `server`, the rule follows the primary `minecraft:overworld` value. Setting `editable = false` applies the operator default even to islands with a saved override. The stored choice remains intact and takes effect again when unlocked. Narrowing an integer range clamps the effective override without rewriting the stored choice; widening it restores that choice.

## Persistence and world application

`storage/gamerules.json` version 2 stores typed selections by permanent island UUID. An atomic background write must succeed before a new selection becomes visible to gameplay or a save success is reported. Reset, ownership transfer, unloading and restart preserve choices. Deleting an island removes its saved gamerules.

World application runs separately every 40 server ticks and after world loading. It only changes loaded worlds belonging to active islands; it never loads terrain to apply a rule, scans blocks or edits the primary/unrelated worlds. Optional Nether and End dimensions receive the same choices when loaded. A successful save confirms durability; the next refresh applies it to the worlds.

Native registry lookup checks each rule's value type. A missing or mismatched rule is unavailable in the menu and skipped during application, with an operator warning. A storage failure suspends changes and world refreshes; full failures appear in the console. See [Operations and recovery](/skyprime/04-operations-recovery) and [API](/skyprime/90-placeholders-api).

Build and runtime verification are recorded in the [feature map](/skyprime/07-feature-map#verification-checkpoint).
