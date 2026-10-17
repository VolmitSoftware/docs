---
title: Static - Statistics
description: Counter identifiers, units, calculated values, and tracking boundaries
published: true
date: 2026-10-16T00:00:00.000Z
tags: static, statistics
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Static starts recording when installed. Each UUID owns a profile with a remembered name, 32 base counters, and eight calculated values. Rankings, the API, and PlaceholderAPI use the identifiers below.

| Identifiers | Meaning |
|---|---|
| `blocks_broken`, `blocks_placed` | Successful player block actions; multi-block placements count affected blocks |
| `online_time` | Eligible connected time in milliseconds, including the active session |
| `active_time`, `afk_time` | Eligible online time split by observed activity and the configured AFK threshold |
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

## Rankings

Rankings sort values descending, then names case-insensitively and UUIDs for stable ties. Equal values share a rank; list positions remain distinct. Profiles show the gap to the next higher value and let players save up to eight favorite statistics.

Ratio rankings require a positive denominator and the configured minimum sample. Profile values remain visible before qualification.

| Setting under `ranking` | Default |
|---|---|
| `minPvpDeaths` | 10 deaths |
| `minMeleeDamageTaken` | 100 damage |
| `minMeleeHitsTaken` | 25 hits |
| `minArrowDamageTaken` | 100 damage |
| `minArrowHitsTaken` | 25 hits |
| `minArrowsFired` | 50 arrows |
| `minOnlineHours` | 1 eligible online hour |

## Detailed counters

`/static details` shows selected lifetime breakdowns for mined and placed blocks, killed mobs, fishing, breeding, crafting, villager trading, consumption, enchanting, taming, and shearing. The catalog contains 72 counters, with 58 selected by default. `/static detailtop mined_diamond_ore` ranks one counter. These are separate from the base totals and have their own observation dates.

Choose counters with `details.selectedKeys`; `details.enabled` defaults to `true`. The catalogue includes identifiers such as `mined_diamond_ore`, `killed_zombie`, `caught_items`, `bred_cow`, `crafted_bread`, and `traded_emerald`. The editor offers the supported choices, up to 64 selections. Removing a selection keeps its stored values but stops collecting new ones.

Detailed counters use the same world and game-mode filters as base statistics. Mining does not distinguish naturally generated blocks from player-placed blocks. Historical Minecraft statistics are not imported.

| New identifiers | What is recorded |
|---|---|
| `consumed_items`, `consumed_bread`, `consumed_cooked_beef`, `consumed_golden_apple`, `consumed_potion`, `consumed_milk_bucket` | One accepted item-consumption event, regardless of stack size. The total includes consumables beyond the named breakdowns |
| `enchanted_items`, `enchanted_book`, `enchanted_diamond_pickaxe`, `enchanted_diamond_sword` | One accepted enchantment-table operation with nonempty enchantments and sufficient levels. Anvils and direct plugin enchantments are excluded |
| `tamed_animals`, `tamed_wolf`, `tamed_cat`, `tamed_horse` | One accepted tame event attributed to a player owner |
| `sheared_entities`, `sheared_sheep`, `sheared_mooshroom` | One accepted player shear event; counts actions, not the number of dropped items |

Cancelled events contribute nothing. Existing explicit selections stay unchanged; add the new IDs through the Details editor to record them on an existing installation.

Other plugins can register their own counters through [tracking modules](/static/08-tracking-modules). Module data is stored separately from these built-in counters.

[Commands and languages](/static/02-commands-languages) · [API and placeholders](/static/90-api-placeholders)
