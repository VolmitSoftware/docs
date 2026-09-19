---
title: Static - Statistics
description: Counter identifiers, units, calculated values, and tracking boundaries
published: true
date: 2026-09-19T00:00:00.000Z
tags: static, statistics
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Static starts recording when installed; it does not import Minecraft's existing statistics. Each UUID owns one profile with a remembered name, 30 base counters, and eight calculated values. The same identifiers are used by rankings, the API, and PlaceholderAPI.

| Identifiers | Meaning |
|---|---|
| `blocks_broken`, `blocks_placed` | Successful player block actions; multi-block placements count affected blocks |
| `online_time` | Eligible connected time in milliseconds, including the active session |
| `pvp_kills`, `pvp_deaths` | Player kills and deaths attributed by the server to another player |
| `deaths`, `mob_kills` | All player deaths and non-player living-entity kills, excluding armor stands |
| `melee_damage_dealt`, `melee_damage_taken` | Final PvP melee damage after damage modifiers |
| `melee_hits_dealt`, `melee_hits_taken` | Successful PvP melee hits with positive final damage |
| `arrows_fired`, `critical_arrows`, `noncritical_arrows` | Player-fired arrows and their critical flag |
| `arrow_hits_dealt` | Distinct tracked arrows that successfully damage another player |
| `arrow_hits_taken` | Distinct tracked arrow/victim pairs with positive final damage |
| `arrow_damage_dealt`, `arrow_damage_taken` | Final tracked PvP arrow damage, including piercing victims |
| `chat_messages`, `commands_executed` | Uncancelled chat events and command submissions; submissions include commands later rejected as invalid |
| `distance_walked`, `distance_sneaked`, `distance_sprinted` | Measured movement in metres classified by movement state |
| `distance_traveled` | Total measured player-move distance |
| `distance_flown`, `distance_fallen`, `distance_swum` | Flight/gliding distance, descending airborne vertical distance, and swimming/water movement |
| `votes` | Votifier events matched to recorded players, including known offline profiles |
| `joins`, `quits` | Eligible connection events; enabling or disabling the plugin does not synthesize connections |

Cancelled events are ignored. Creative and spectator play are excluded by default, and can be re-enabled independently. An excluded world accumulates nothing, including online time. Movement measures actual distance, not block crossings, and ignores teleports and world changes; movement in a vehicle is not filed under walking, swimming, or flight.

| Calculated identifier | Formula |
|---|---|
| `kill_death_ratio` | Player kills / player combat deaths |
| `melee_damage_ratio`, `melee_hit_ratio` | Melee dealt / taken |
| `arrow_damage_ratio`, `arrow_hit_ratio` | Arrow dealt / taken |
| `arrows_missed` | Maximum of zero and arrows fired minus arrows that hit a player |
| `arrow_accuracy` | Player-hit arrows / arrows fired, clamped to 0–1; displayed as a percentage |
| `votes_per_day` | Votes / eligible online days |

A zero denominator produces zero. “Arrows without a player hit” includes arrows still in flight and arrows that hit a mob or a block. An arrow stops being tracked after five minutes. A piercing arrow can contribute at most one player hit to accuracy.

Rankings sort values descending, then names case-insensitively and UUIDs for stable ties. Ratios can favor small samples; they are direct ratios without a minimum-activity threshold.

[Commands and languages](/static/02-commands-languages) · [API and placeholders](/static/90-api-placeholders)
