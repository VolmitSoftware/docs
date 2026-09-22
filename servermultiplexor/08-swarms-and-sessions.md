---
title: "08 - Swarms and sessions"
description: "Deterministic bot swarms, stress workloads, coordinated plans, and persistent player sessions"
published: true
date: 2026-09-21T00:00:00.000Z
tags: "servermultiplexor, testing"
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Swarm runs coordinate a bounded group of ordinary-player bots; persistent sessions maintain identities across joins, departures, and resumptions. Both use deterministic behavior profiles, explicit ownership, and recorded outcomes. Install and verify the harness as described in [Gameplay checks](/servermultiplexor/07-gameplay-checks).

[ServerMultiplexor](/servermultiplexor)

## Wizard actions

An isolated Local instance's **RUNTIME → Run bot swarm** action selects idle, wander, redstone, workshop, mixed, stress, or a custom JSON recipe. Choose the bot count, duration, seed, activity radius, placement, origin, and scripted chat. Stress also offers a JSON workload, coordinate bounds, activity goals, and duration or goal completion. The wizard shows persistent arena changes before starting. A stopped target is prepared for offline loopback access, started for the run, and stopped afterward; an already running target stays running.

**RUNTIME → Persistent player sessions** offers the five bundled profiles or a custom JSON path and lists previous runs. Before starting, review identities, concurrency, session lengths, goals, world bounds, and required fixture setup. Select a run to view player activity, stop and save, resume, or read its report. Offline Velocity networks expose the same action in their network menu. Session runs continue when the wizard closes. The wizard starts stopped targets and stops only those targets when the run ends.

## Swarm commands

| Command | What it does |
|---------|--------------|
| `gameplay swarm-profiles [--json]` | List the available deterministic swarm behavior profiles. |
| `gameplay swarm <idle\|wander\|redstone\|workshop\|mixed\|stress\|plan.json> [instance] [--instance <name>] [--bots <1-256>] [--duration <seconds>] [--seed <uint32>] [--join-interval <milliseconds>] [--radius <4-64>] [--prefix <name>] [--build-arena] [--origin <x,y,z>] [--scatter <8-4096>] [--workload <path.json>] [--bounds <minX,minY,minZ:maxX,maxY,maxZ>] [--goals <activity=count,...>] [--completion <duration\|goals>] [--chat] [--prepare] [--start] [--stop-after] [--startup-timeout <seconds>] [--connect-timeout <seconds>] [--action-timeout <seconds>] [--version <version>] [--viewer-port <port>] [--no-viewer] [--json]` | Run a bounded group of ordinary-player bots on an isolated, offline, loopback-only standalone instance. Network members and proxies are refused. |

## Swarm behavior and limits

Swarm behavior comes from function-based recipes. Built-in profiles idle, wander, interact with redstone, or perform workshop tasks; `mixed` combines activities. JSON plans can coordinate phases of walking, circles, teleportation, mining, building, interaction, and scripted chat. A `circle` phase uses `positions` as centers, plus `radius`, `laps`, and `clockwise`; centers are distributed across actors like other position jobs. It reuses the observed-lap action and needs an action deadline long enough for the requested laps. Custom plans and stress workloads are validated before any server preparation or startup. `--chat` enables scripted progress messages. `--scatter` distributes workers evenly across a grid around the origin and finds the terrain height; it cannot be combined with `--build-arena` or the `stress` profile.

Swarm defaults are 4 bots, 60 seconds, seed 1, a 1,000 ms join interval, radius 16, and origin `0,80,0`. Bot count accepts 1–256. Duration accepts 1–604,800 seconds (seven days); join interval accepts 100–10,000 ms; seeds accept 0–4,294,967,295. Startup, connection, and action timeouts default to 180, 30, and 15 seconds, with limits of 1–3,600, 1–300, and 1–120 respectively. Numeric options use decimal integers. A generated per-run prefix keeps worker names separate; an explicit `--prefix` accepts 1–12 letters, numbers, or underscores, followed by worker suffixes `01` through `256`. Existing operator identities are rejected. One swarm may run on an instance at a time. The server needs enough free player slots for every worker plus one temporary controller when setup requires it.

`workshop` and `mixed` require explicit `--build-arena`. Arena setup replaces a square of `12 × ceil(sqrt(bots))` blocks per side starting at `--origin`: the floor is at origin Y, worker feet are at Y+1, and the five blocks above the floor are cleared. Each worker gets a 12×12 tile with setup materials and an iron pickaxe. These changes remain after the run. Origin coordinates are integers, X/Z within ±29,999,000 and Y from -48 through 256. Use a disposable world or make a stopped backup first.

Workers never receive operator access. Arena, custom-plan, and stress workers use survival mode; other runs retain the server-assigned game mode. Only a separate temporary controller receives operator access for arena setup, scattering, a custom plan, or stress workloads; Multiplexor revokes that access in cleanup, including failed runs. Runs without those operations do not grant operator access. `--stop-after` stops only a server started by the same run. Viewer URLs, reports, and runtime-log references use the existing gameplay artifact directory, and the viewer closes when the run ends.

Ctrl+C and termination signals interrupt the Node runner, wait for its bot/viewer cleanup, then revoke the controller's access. Cancellation returns a nonzero exit code and keeps the same server ownership rules as an ordinary run.

## Stress workloads

The `stress` profile runs repeated activity jobs for extended tests. Role weights assign workers, and activity weights choose each worker's next job. A shared scheduler tracks completed goals, reserves targets, changes the active worker count on a schedule, and stops stalled or failing workloads. This is a reproducible synthetic workload. It is not a statistical model of average human players or a claim that this machine can sustain 256 clients for seven days.

Without a workload file, `stress` uses patrol, exploration, chat, and idle periods in the existing world. With `--build-arena`, its default workload includes every supported activity. `--workload <path.json>` loads a workload with custom roles, pacing, targets, goals, and load stages. Stress always requires one temporary controller in addition to the worker slots.

### Stress controls

| Control | Meaning |
|---------|---------|
| `--bounds minX,minY,minZ:maxX,maxY,maxZ` | Override the workload's allowed box. Integer X/Z coordinates stay within ±29,999,000, Y within -48–256, and corners must be ordered. The box must include worker feet, head space, and the complete arena when one is requested. |
| `--goals mine=1000,build=1000` | Replace the workload's complete goal map. Counts are aggregate successful activity jobs across all workers, from 1–1,000,000,000 per activity. Every goal needs an enabled activity. |
| `--completion duration` | Run until the duration expires. Goal counts remain acceptance requirements. |
| `--completion goals` | Stop after all goals pass. The duration remains a hard deadline, and unmet goals fail the run. |
| `--workload path.json` | Select a stress workload. This file is separate from a coordinated phase plan. |

These four controls require `stress`. CLI bounds, goals, and completion override the corresponding workload fields. Without explicit bounds, an arena uses its complete footprint and height. An outdoor workload uses origin ± radius in X/Z and Y from -48 to 256. `--scatter` is not available for stress. Use bounds and patrol or exploration jobs to control where activity occurs.

### Workload schema

Stress workload JSON requires `schemaVersion: 1`, a printable `name`, and `roles`. The validator rejects unknown fields. Optional fields use these defaults and limits:

| Field | Shape and rules |
|-------|-----------------|
| `bounds` | `{"min":[x,y,z],"max":[x,y,z]}`. Uses the same coordinate limits as `--bounds`. |
| `roles` | 1–32 objects with a unique `name`, a positive `weight` (default 1), and an `activities` map. Role and activity weights accept integers up to 10,000; zero activity weights disable that activity. |
| `goals` | An activity-to-count map, default `{}`. |
| `completion` | `"duration"` (default) or `"goals"`. Goal completion requires a nonempty goal map. |
| `pacing` | `{"minMs":250,"maxMs":1750}`. A seeded pause between jobs, from 0–60,000 ms. |
| `failurePolicy` | `{"maxConsecutive":5,"maxTotal":100}`. Limits consecutive worker failures and total failed jobs. |
| `schedule` | `[{"atSeconds":0,"activeBots":4}]`. Starts at zero and increases by time, with 1–256 stages before the run deadline. Active counts range from zero to `--bots`. |
| `reportIntervalSeconds` | Aggregate report interval, default 10, from 1–3,600 seconds. |
| `stallTimeoutSeconds` | Progress deadline, default 120, from 5–3,600 seconds. |
| `targets` | Maps `mine`, `build`, `redstone`, `farm`, or `storage` to 1–2,048 distinct `[x,y,z]` positions inside bounds. Enabled target activities require positions when no arena is requested. |
| `messages` | 1–128 plain chat messages, at most 160 characters each. Supports `{bot}`, `{index}`, `{role}`, `{activity}`, and `{completed}`. Slash commands are rejected. |

| Activity | Repeated player work |
|----------|----------------------|
| `patrol` | Short local routes of roughly 2–8 blocks. |
| `explore` | Routes of roughly 2–32 blocks that follow headings across the allowed area. |
| `mine` / `build` | Workers share stone targets. Mining frees a target; building refills it. Target leases prevent conflicting edits. |
| `redstone` | Lever, button, and pressure-plate interactions with observed state changes. |
| `farm` | Grow wheat with bone meal when needed, harvest it, and plant seeds again. |
| `craft` | Craft oak planks from logs, then sticks, with inventory confirmations. |
| `storage` | Open a chest or barrel, deposit eight cobblestone, and withdraw it. A target lease covers the full transaction. |
| `chat` | Send a scripted plain message and wait for its server echo. |
| `idle` | Pause between periods of activity. |

Stress workers use survival mode and eat when hungry. The controller supplies missing materials and removes excess test outputs to keep inventories usable. The report separates support operations from successful player activity. The stress arena adds a chest, crafting table, wheat field, water, and shared work blocks to the ordinary tiles. Without `--build-arena`, targets must identify existing fixtures. Farming edits wheat and mining/building edit the supplied stone targets. Block and inventory changes remain after the run.

Final reports and periodic checkpoints include role assignments, active worker counts, goals, successful/skipped/failed jobs, walking distance, and action latency histograms. `newChunkVisits` counts per-worker destination chunks absent from that worker's last 4,096 destinations; it is not a global unique-chunk count. Reported p50/p95 values are histogram bucket upper bounds. Node process memory, CPU, and event-loop measurements describe the load generator. Correlate them with server runtime logs and server metrics to identify the bottleneck. Reports retain bounded event and metric history for long runs.

Goal counts are minimum requirements. Goal mode favors unmet quotas while continuing other enabled activities, so builders can replenish mining targets after their own quota passes. Execution uses the existing [Mineflayer inventory, crafting, and interaction APIs](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md) and [pathfinder movement exclusions](https://github.com/PrismarineJS/mineflayer-pathfinder#exclusionareasstep); role selection and coordination use deterministic functions.

Supported activity keys are `patrol`, `explore`, `mine`, `build`, `redstone`, `farm`, `craft`, `storage`, `chat`, and `idle`. The workload must enable at least one activity other than idle. A schedule changes which connected workers perform jobs. It does not repeatedly reconnect clients. Join pacing remains controlled by `--join-interval`. Workload files cannot exceed 256 KiB.

```json
{
  "schemaVersion": 1,
  "name": "Overnight arena activity",
  "roles": [
    {"name": "builder", "weight": 2, "activities": {"build": 4, "mine": 4, "patrol": 2, "chat": 1}},
    {"name": "operator", "weight": 1, "activities": {"redstone": 4, "farm": 3, "craft": 2, "storage": 2, "patrol": 2}}
  ],
  "pacing": {"minMs": 250, "maxMs": 1500},
  "goals": {"mine": 1000, "build": 1000, "redstone": 1000},
  "completion": "duration",
  "schedule": [
    {"atSeconds": 0, "activeBots": 4},
    {"atSeconds": 300, "activeBots": 8},
    {"atSeconds": 900, "activeBots": 16},
    {"atSeconds": 1800, "activeBots": 32}
  ],
  "failurePolicy": {"maxConsecutive": 5, "maxTotal": 100},
  "reportIntervalSeconds": 10,
  "stallTimeoutSeconds": 120
}
```

Run this workload with `--bots 32 --duration 43200 --build-arena`. The bundled mixed endurance workload (`MultiplexorApp/tool/mineflayer/workloads/mixed-endurance.json`) includes three roles and eight hours of load stages. Outdoor endurance (`MultiplexorApp/tool/mineflayer/workloads/outdoor-endurance.json`) uses a bounded existing world. Mixed goals (`MultiplexorApp/tool/mineflayer/workloads/mixed-goals.json`) stops after its activity quotas pass. Start with a smaller run and compare action throughput, latency, failed jobs, process memory, and server metrics before increasing the population. Bot pathfinding and protocol handling also consume CPU and memory on the generator machine.

## Coordinated JSON plans

Custom JSON plans contain a `name` and 1–128 `phases`. Each phase has an `action`, optional `actors` (distinct worker numbers from 1 through `--bots`), and its action fields below. Omitting `actors` selects every worker. Position jobs are distributed round-robin among the selected workers; the next phase waits until every selected worker has completed its current jobs. `--duration` is a hard deadline for the complete plan.

| Action | Fields | Behavior |
|--------|--------|----------|
| `teleport` | `positions: [[x,y,z], ...]` | Controller teleports workers; Y is the worker's feet coordinate. |
| `walk` | `positions: [[x,y,z], ...]` | Workers pathfind to assigned targets. |
| `circle` | `positions: [[x,y,z], ...]`, `radius`, `laps`, `clockwise` | Positions are circle centers distributed among workers. Uses observed lap completion on clear level terrain; allow enough action time for every lap. |
| `mine` | `positions: [[x,y,z], ...]` | Workers receive iron pickaxes and mine the assigned blocks. |
| `build` | `positions: [[x,y,z], ...]`, `block: "stone"` | Controller supplies materials; workers place the assigned block type. |
| `interact` | `positions: [[x,y,z], ...]` | Workers interact with the assigned blocks. |
| `scatter` | `radius: 8–4096` | Controller distributes selected workers over terrain around the run origin. |
| `chat` | `messages: ["Worker {index} ready", ...]` | Workers send plain messages; `{bot}`, `{index}`, and `{phase}` expand to their current values. Slash commands are rejected. |
| `wait` | `seconds: 0.1–300` | Wait before the next coordinated phase. |

Positions are integer world coordinates, bounded like `--origin`, with 1–1,024 distinct positions per phase. Scatter origin plus radius must remain inside the X/Z bounds. Plans use an existing world fixture and cannot pass `--build-arena`; create the fixture in a separate run. The four-worker coordinated demo (`MultiplexorApp/tool/mineflayer/plans/coordinated-demo.json`) expects four arena tiles at origin `0,80,0` and includes teleport, walking, building, mining, interaction, and chat phases.

```json
{
  "name": "Two worker readiness",
  "phases": [
    {"action": "teleport", "actors": [1, 2], "positions": [[2, 81, 5], [14, 81, 5]]},
    {"action": "chat", "actors": [1, 2], "messages": ["Worker {index} reached its station."]},
    {"action": "walk", "actors": [1, 2], "positions": [[6, 81, 6], [18, 81, 6]]}
  ]
}
```

## Persistent session commands

| Command | What it does |
|---------|--------------|
| `gameplay sessions validate <profile.json> [--instance <name>] [--network <name>] [--prepare] [--json]` | Validate the profile, routes, identities, and target without changing it. `--prepare` previews offline loopback preparation of a stopped standalone instance. Exactly one target selector is required. |
| `gameplay sessions start <profile.json> [--instance <name>] [--network <name>] [--prepare] [--start] [--stop-after] [--startup-timeout <seconds>] [--viewer-port <port>] [--no-viewer] [--json]` | Start a detached persistent simulation and print its run ID. `--prepare` applies only to a stopped standalone instance. `--start` starts stopped targets; `--stop-after` stops only processes started by this run. Startup timeout defaults to 180 seconds. Exactly one target selector is required. |
| `gameplay sessions list [--json]` | List runs for the selected consumer, with target, population, host state, and artifact paths. |
| `gameplay sessions status <run> [--json]` | Show host cleanup state, player activities and waiting reasons, project progress, measurements, and the current viewer URL. |
| `gameplay sessions stop <run> [--json]` | Request bounded action cancellation, save a checkpoint, disconnect workers, and finish owned runtime cleanup. Waits up to 45 seconds; a nonzero result with `active: true` means cleanup is still pending. |
| `gameplay sessions resume <run> [--json]` | Resume the same identities and evolving world from its checkpoint. Rejects an active run, changed profile, changed target, or reset world identity. Retains the original startup and cleanup policy. |
| `gameplay sessions report <run> [--json]` | Read the final worker report with the supervisor's cleanup result. |

## Persistent player sessions

`gameplay sessions` models persistent identities with separate online sessions. Players join, leave, return, eat, store supplies, gather resources, craft, build verified structures, and visit their social group. A seeded population scheduler controls actual connections independently of action completion. Role functions coordinate through project requirements and bounded reservations. Saved intent survives reconnects; Minecraft remains authoritative for inventory, position, and world state. Decisions run locally without an external decision service.

### Session profiles

Session JSON is separate from a swarm plan or stress workload. The validator rejects unknown fields and profiles over 1 MiB. Bundled profiles provide complete world descriptions:

| Profile | Purpose |
|---------|---------|
| Settlement (`MultiplexorApp/tool/mineflayer/session-profiles/settlement.json`) | One hour, eight persistent identities, four concurrent players, real resource delivery and construction. Creates a disposable settlement fixture. |
| Settlement goals (`MultiplexorApp/tool/mineflayer/session-profiles/settlement-goals.json`) | Four players construct two shelters and meet resource-transfer goals, with a one-hour deadline. |
| Plugin circuits (`MultiplexorApp/tool/mineflayer/session-profiles/plugin-circuits.json`) | Four ordinary players verify the installed Gloss version, walk a circle, and verify the version again. Select its path through the wizard's custom-profile option. |
| Dispersed established world (`MultiplexorApp/tool/mineflayer/session-profiles/dispersed-established.json`) | Eight-hour template for two prepared bases separated by 256 blocks. Requires an existing baseline. |
| Frontier (`MultiplexorApp/tool/mineflayer/session-profiles/frontier.json`) | Four-hour exploration template for an existing starting base and surrounding terrain. Requires an existing baseline. |
| Velocity settlement (`MultiplexorApp/tool/mineflayer/session-profiles/velocity-settlement.json`) | Settlement work through a proxy, with lobby visits and backend switches. Edit `lobby` and `survival` aliases to match the network. |

The existing-world templates describe the fixtures they expect; they do not create a mature server world. Restore a representative baseline before a comparison, and use `resume` to continue the same evolving world. A checkpoint is not a world backup. Each run copies its normalized profile and records world identity markers inside the target's world directory.

| Profile field | Shape and meaning |
|---------------|-------------------|
| `schemaVersion`, `name`, `seed` | Version `1`, a printable name, and a seeded decision stream. Reproduces decisions and schedules, not identical concurrent server execution. |
| `durationSeconds`, `completion`, `goals` | Duration is 1–604,800 seconds. Completion is `duration` or `goals`; duration remains the deadline. Goals are minimum verified counters. |
| `population.identities`, `concurrent` | Persistent roster size, 1–256, and initial intended population. A roster can exceed concurrent connections. |
| `population.usernamePrefix` | Stable 1–12 character letters/digits/underscore prefix; names append `001` onward. Choose distinct prefixes for independent populations. Existing operator identities are refused. |
| `population.arrivalIntervalSeconds` | Minimum spacing between connection attempts, including setup controllers, returning players, and retries. Scheduling is independent of action completion, and slow handshakes can overlap. Choose an interval that respects the configured proxy/server login limit; the Velocity profile uses four seconds. |
| `population.sessionSeconds`, `offlineSeconds` | `[minimum, maximum]` ranges for online sessions and time before returning. |
| `population.stages` | Increasing `{ "atSeconds": 300, "concurrent": 8 }` population stages. Changes connections, including departures when the target falls. |
| `population.groupSize` | Size of stable social groups. Meetings have bounded attendance waits. |
| `population.minimumAchievedFraction` | Optional minimum fraction of requested player-time that must reach the playing state. Leaving it unset records achieved load without making it an acceptance limit. |
| `playerRoles`, `playerWorlds` | Cycling role names and world IDs assigned to roster identities. Roles: `miner`, `lumberjack`, `builder`, `farmer`, `crafter`, `courier`, `explorer`, `social`, `mechanic`. Construction worlds require assigned producers and builders. |
| `pacing` | `minSeconds` and `maxSeconds` pauses between tasks. |
| `recovery` | `maxConsecutiveFailures`, `maxTotalFailures`, `retrySeconds`, and death policy `respawn` or `retire`. Failures remain recorded when a player recovers. |
| `timeouts` | `connectSeconds`, `actionSeconds`, and `settleSeconds`. Expired work must settle before a new owner uses the same target. |
| `checkpointSeconds` | Atomic checkpoint interval, default 10 seconds. |
| `worlds` | 1–32 named world agendas, described below. |
| `network` | `routes` backend aliases and `switchEverySeconds: [minimum, maximum]`. Only valid against a Velocity target. |
| `telemetry` | `required`, `maxAgeSeconds`, `warmupSeconds` (default 60), and optional `maxP95TickMs` / `maxP99TickMs` limits. Missing, stale, or warming-up measurements remain unavailable. |
| `pluginActivities` | Optional command, inventory-menu, movement, and world-transition workflows, described below. |

Supported goal counters are `projectsCompleted`, `blocksVerified`, `resourceTransfers`, `foodCrafted`, `sessionsCompleted`, `joins`, `switches`, `exploredChunks`, `gatherings`, `cropsHarvested`, and `pluginActions`. Counters measure different outcomes and must not be added into a single player-load score. Exploration counts distinct chunks visited by each player, capped at 2,048 per player and world without evicting older visits. It does not prove new terrain generation.

### World agendas and fixtures

Each world agenda specifies `id`, `backend`, `dimension`, `bounds: {min: [x,y,z], max: [x,y,z]}`, `home`, `storage`, `craftingTable`, and `meetingPoint`. `backend: "standalone"` resolves to the selected standalone or entry backend. `resourceAreas` describe named `mine` or `wood` boxes. `farmAreas`, `protectedAreas`, and `frontiers` describe named boxes. `buildPlots` contain an `id`, `origin`, and supported `blueprint`. `redstone` identifies existing controls and the blocks whose changes must be observed. Use the bundled files as complete examples. Regions constrain movement and edits; surrounding chunk simulation still depends on server settings.

`setup: {"kind":"settlement","origin":[0,80,0]}` authorizes persistent fixture construction in the described area, plus initial starter supplies. `setup: {"kind":"existing"}` uses prepared fixtures and inventory. During the measured workload, workers collect and consume real resources; there is no recurring administrative replenishment or output clearing. Shortages, full storage, depleted resource regions, blocked paths, and completed build plots are visible waiting conditions. Fixture setup is skipped on resume.

### Velocity sessions

Velocity sessions require a managed, offline, loopback network with every proxy and backend isolated. They preserve modern forwarding and join through the proxy port. Destination verification uses fresh server-side routing evidence; a respawn event alone is insufficient. Inventories, reservations, and world agendas stay backend-specific. `--prepare` is refused for networks and their members. A run holds exclusive leases for all its target members and the proxy, shared with swarm ownership checks.

### Plugin activities

Plugin activities use ordinary player commands and inventory operations. Each activity contains `id`, `backend`, optional `roles`, `everySeconds: [min,max]`, `timeoutSeconds`, and either `command` or `steps`. `expect` is a case-insensitive literal reply substring. `{player}` and `{id}` expand from the player identity. Optional `menu` contains `title`, `clicks: [{slot,item,nextTitle?}]`, and `expect`: every click checks the expected item in that slot; `nextTitle` waits for and verifies a replacement menu before continuing. A menu mutation requires an expected reply. Configure activities for the installed plugins; no claim, economy, or shop behavior is assumed automatically.

Activity `backend: "standalone"` resolves to the selected instance or network entry backend, just as it does for world agendas.

A workflow's `steps` contains 1–32 actions. Each step has one of `command` (with `expect`/`menu`), `route: [{x,y,z},...]`, or `circle: {center:{x,y,z},radius,laps,clockwise}`. Routes allow at most 256 waypoints. Movement reuses the scenario actions and their observed completion checks. An optional `transition: {worldName?,worldId?,position?,radius?}` declares a destination and requires fresh server-observer proof after that step. Specify at least a name or UUID. Persistent workflows must return to their starting world before resuming ordinary tasks. Unexpected respawns still fail; failed declared arrivals close the connection. Both the activity deadline and the profile's action deadline apply, so allow enough time for the complete sequence.

### Server measurements

For server measurements, build the optional [session observer](/servermultiplexor/12-session-observer) with `gradle -p MultiplexorApp/tool/session-observer clean test jar` and install its jar in the stopped QA proxy and backends. Session runs automatically read each local observer file. Paper supplies tick-time percentiles, loaded chunk/entity totals, chunk events, JVM CPU/heap/GC, and world membership. Folia supplies entity-scheduler player samples, sampled world changes, chunk-event counters, and process metrics; region timings and aggregate loaded chunk/entity totals remain unavailable. Required tick thresholds fail as unavailable on Folia. Performance is reported as `measured` until tick-time acceptance limits are configured. Recorded breaches survive stop and resume. The observer reference lists supported APIs and measurement limits.

### Session reports and cleanup

Artifacts live under `consumers/<profile>/state/gameplay-sessions/<run>/`: the copied `profile.json`, runtime `configuration.json`, supervisor `host.json` and `host.log`, worker `status.json`, atomic `checkpoint.json`, and final `report.json`. Reports separate workload goals, scheduled versus achieved population, operation latency, server performance, generator resources, and cleanup. `status` shows the active viewer URL; the viewer closes during cleanup. Startup failure rolls back processes started by that attempt. Ordinary completion retains started servers unless `--stop-after` was selected, and never stops preexisting servers.

These are synthetic session profiles. Long configured durations are not evidence of endurance, and passing bot counts are not a human-player capacity rating. Compare against aggregate real-session behavior and server profiles on the same world and plugin stack before treating a mix as representative. Running the generator beside the server also shares CPU and memory.

## Swarm workflow

```bash
./start.sh --consumer plugin server create swarm-qa --type paper --mc 1.21.11 --auto-build --isolated
./start.sh --consumer plugin gameplay swarm wander swarm-qa --bots 8 --duration 120 --seed 42 --prepare --start --stop-after
# Replace a bounded test area with workshop tiles, then exercise ordinary-player actions
./start.sh --consumer plugin gameplay swarm mixed swarm-qa --bots 4 --duration 60 --build-arena --origin 0,80,0 --start --stop-after
# Spread workers through the world and send scripted progress messages
./start.sh --consumer plugin gameplay swarm wander swarm-qa --bots 8 --scatter 128 --chat --start --stop-after
# Build the fixture, then run the bundled coordinated recipe
./start.sh --consumer plugin gameplay swarm idle swarm-qa --bots 4 --duration 1 --build-arena --origin 0,80,0 --start --stop-after
./start.sh --consumer plugin gameplay swarm MultiplexorApp/tool/mineflayer/plans/coordinated-demo.json swarm-qa --bots 4 --duration 60 --start --stop-after
```

## Extended stress workflow

```bash
# An eight-hour arena run with repeatable activity selection
./start.sh --consumer plugin gameplay swarm stress swarm-qa --bots 16 --duration 28800 --seed 42 --build-arena --origin 0,80,0 --start --stop-after
# Require completed work, stopping early once both goals pass
./start.sh --consumer plugin gameplay swarm stress swarm-qa --bots 8 --duration 7200 --build-arena --goals mine=1000,build=1000 --completion goals --start --stop-after
# Apply custom roles, pacing, load stages, and acceptance goals
./start.sh --consumer plugin gameplay swarm stress swarm-qa --bots 32 --duration 28800 --workload MultiplexorApp/tool/mineflayer/workloads/mixed-endurance.json --build-arena --start --stop-after
# Keep outdoor movement inside a coordinate box
./start.sh --consumer plugin gameplay swarm stress swarm-qa --bots 8 --duration 3600 --origin 0,80,0 --bounds -128,60,-128:128,120,128 --start --stop-after
```

Increase the isolated server's `max-players` before launch to cover every worker, the controller, and any observers. For long runs, use a persistent terminal session. Final reports and periodic checkpoints stay in the consumer's `state/gameplay-tests/<instance>` directory. World edits remain after the run.

## Persistent session workflow

```bash
./start.sh --consumer plugin server create settlement-qa --type paper --mc 1.21.11 --auto-build --isolated
./start.sh --consumer plugin gameplay sessions start MultiplexorApp/tool/mineflayer/session-profiles/settlement-goals.json --instance settlement-qa --prepare --start --stop-after
# With Gloss installed, four ordinary players verify its version, walk a circle, and verify again.
./start.sh --consumer plugin gameplay sessions start MultiplexorApp/tool/mineflayer/session-profiles/plugin-circuits.json --instance settlement-qa --prepare --start --stop-after
# Use the printed run ID for these commands. Closing the wizard does not stop it.
./start.sh --consumer plugin gameplay sessions list
./start.sh --consumer plugin gameplay sessions status <run-id>
./start.sh --consumer plugin gameplay sessions stop <run-id>
./start.sh --consumer plugin gameplay sessions resume <run-id>
./start.sh --consumer plugin gameplay sessions report <run-id> --json
```

For proxy sessions, create isolated `lobby` and `survival` backends and use `network create session-lab --members lobby,survival --default lobby --offline`. Start Velocity settlement (`MultiplexorApp/tool/mineflayer/session-profiles/velocity-settlement.json`) with `--network session-lab --start --stop-after`. Do not add `--prepare` to network runs.
