---
title: "Animus: Debug and React Metrics"
description: "Reading Animus network and server-time measurements with /animus debug and React"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, debug, metrics, react, performance"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus measures its own network traffic and server-thread time all the time, at low cost. Operators read the numbers with `/animus debug summary` and the other `/animus debug` commands. When [React](/react) is installed on a Bukkit-family server, Animus also publishes them to React. Every value describes the server it runs on.

Byte counts are estimates: Animus counts packets by kind and multiplies each count by a typical size for that kind, without encoding packets to measure them. Per-NPC time is sampled on every 4th tick and scaled up.

## /animus debug

The readings require `animus.debug` (operators by default) and work from the console. Optional values are keyed, such as `player=Alex`.

| Command | Shows |
|---|---|
| `/animus debug summary` | Summary: definitions, active, dormant and sleeping NPCs, viewers, network totals, server time per tick and the busiest subsystems, navigation, presentation and combat pressure, and a rough memory estimate |
| `/animus debug network` | Outgoing packets and estimated bytes by packet kind over 1, 10 and 60 seconds, totals, incoming NPC clicks and rate-limited clicks, and the busiest viewers |
| `/animus debug network player=<player>` | One player's packets, estimated bytes and clicks over the last second and since tracking began, by kind |
| `/animus debug performance` | Server time per subsystem over 1, 10 and 60 seconds |
| `/animus debug npc <npc>` | One NPC's share of the measured time and traffic |
| `/animus debug watch` | Toggles a live action-bar line with the main numbers. Players only |
| `/animus debug mode [enabled=toggle]` | Logs every per-NPC route, activation and packet diagnostic until the server restarts; off, they are summarized every five minutes. Needs `animus.debug.mode`; see [commands](/animus/02-commands-permissions#debug-mode) |

Tab completion offers the subcommands and the names of players with recorded traffic.

### Reading the summary

`/animus debug summary` prints one line per area. Values are averages over the last 10 seconds unless a line says otherwise. Right after a start it answers `No measurement yet; try again in a second`.

| Line | What it tells you |
|---|---|
| `NPCs` | The runtime in use, then definitions on disk, active NPCs, dormant NPCs and routes asleep because no player is near |
| `Viewers` | Players receiving NPCs, and NPC bodies shown across all of them |
| `Network` | Packets per second and per tick, estimated bytes per second, and NPC clicks coming in |
| `Server time` | Milliseconds of server-thread time per tick and its share of a 50 ms tick, then the three busiest subsystems |
| `Pressure` | `ok` or `short` for navigation, with routes waiting for a turn and path plans running; `normal` or `strained` for presentation; fights waiting for a combat slot |
| `Memory` | A rough estimate of what the runtime holds |

The web editor's state follows, then a reminder that byte counts are estimates. A `short` or `strained` value means a per-tick budget in [`config.toml`](/animus/03-configuration) is full: the work still happens, spread over more ticks. `/animus debug performance` and `/animus debug npc <npc>` show where the time goes.

## React metrics

Animus has no hard dependency on React. When React is present, Animus registers the metric source `animus` with 24 metrics and publishes every value once a second. React shows a value as unavailable when it is older than 15 seconds. React carries single server-wide numbers only; per-chunk NPC density, per-player bandwidth and per-NPC cost are available in `/animus debug` only.

React turns each key into a sampler ID by replacing every non-alphanumeric character with `-`. For example, `animus.npcs.active` becomes the sampler `animus-npcs-active` and the placeholder `%react_sampler.animus-npcs-active%`.

Rates and times are rolling averages over the last 10 seconds. Counts and pressures are taken once a second.

| Key | React kind | Unit | Meaning |
|---|---|---|---|
| `animus.cost.presentation_ms` | MILLIS | ms | Milliseconds per second of server-thread time spent on viewer updates, spawns, moves, looks and passengers |
| `animus.cost.navigation_ms` | MILLIS | ms | Milliseconds per second on route turns, motion, footing and riders |
| `animus.cost.combat_ms` | MILLIS | ms | Milliseconds per second on combat brains |
| `animus.cost.behaviors_ms` | MILLIS | ms | Milliseconds per second on behavior triggers, behavior ticks and hire desks |
| `animus.cost.rigs_ms` | MILLIS | ms | Milliseconds per second on rig playback and animation planning |
| `animus.cost.gui_ms` | MILLIS | ms | Milliseconds per second on shop screens, holograms and holographic menus |
| `animus.cost.hotload_ms` | MILLIS | ms | Milliseconds per second on reloads after a file change. This work runs on the file thread, not the tick thread |
| `animus.cost.editor_ms` | MILLIS | ms | Milliseconds per second on web editor requests. This work runs on the editor's threads, not the tick thread |
| `animus.pressure.navigation` | PERCENT | % | 0 to 100: the share of the per-tick motion budget used over the last second. It is 100 while routes wait for a turn |
| `animus.pressure.presentation` | PERCENT | % | 0 to 100: the share of the per-tick packet budget used over the last second |
| `animus.pressure.combat` | PERCENT | % | 0 to 100: combat slots in use out of `[combat] maximumNpcs`. It is 100 while any NPC waits for a slot |
| `animus.net.bytes_per_second` | BYTES | B | Estimated bytes Animus sent per second |
| `animus.net.packets_per_second` | RATE | pkt | Packets Animus sent per second |
| `animus.net.player_peak.bytes_per_second` | BYTES | B | Estimated bytes per second sent to the busiest player over the last second |
| `animus.net.kind.spawn.bytes_per_second` | BYTES | B | Body spawns: add-entity, player info, initial metadata, team, seat and nameplate packets |
| `animus.net.kind.despawn.bytes_per_second` | BYTES | B | Remove-entities, player-info removal and team cleanup |
| `animus.net.kind.move.bytes_per_second` | BYTES | B | Position sync, seat moves and head rotation |
| `animus.net.kind.metadata.bytes_per_second` | BYTES | B | Pose, swing, dragon-phase, equipment and passenger-list updates |
| `animus.net.kind.hologram.bytes_per_second` | BYTES | B | Display spawns, updates and removals for holograms and holographic menus |
| `animus.net.kind.rig_bones.bytes_per_second` | BYTES | B | Rig bone spawns, transforms and removals |
| `animus.net.kind.gui_window.bytes_per_second` | BYTES | B | Shop and menu window opens |
| `animus.npcs.active` | GAUGE | | NPCs with a live body |
| `animus.npcs.sleeping` | GAUGE | | Routes that sleep because no player is near |
| `animus.npcs.viewers` | GAUGE | | Players that watch NPCs |

### On Folia

- Every `animus.cost.*` value is summed across all regions. It is not the load of one region thread.
- `animus.pressure.navigation` and `animus.pressure.presentation` are 100 while any region waits for budget, and 0 otherwise.
- `animus.pressure.combat` is 0, because each region keeps its own combat queue.

## Typical packet sizes

Byte estimates use these sizes per packet:

| Kind | Typical bytes per packet |
|---|---:|
| spawn | 96 |
| despawn | 16 |
| move | 32 |
| metadata | 28 |
| equipment | 48 |
| passengers | 16 |
| hologram | 72 |
| rig_bones | 40 |
| gui_window | 256 |
