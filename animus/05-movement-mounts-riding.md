---
title: "Animus: Movement, Mounts and Riding"
description: "Navigation, routes, look-close, movement settings, mounted NPCs, player riding and hiring"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, navigation, routes, mounts, riding, hire"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

NPC movement runs on the server against real block collision. Animus never loads or generates chunks to move an NPC. On Folia each NPC moves on the region that owns its chunk; see [Folia](/animus/15-folia).

## Manual navigation

```text
/animus navigate guard 10 64 4 walk 2
/animus navigation guard status
/animus navigation guard stop
/animus look guard 12 65 4
```

`/animus navigate <id> <x> <y> <z> [walk|swim|fly] [speed]` moves an active NPC in its current world at 1-10 blocks per second. A leg may be any length. Short legs are planned whole; longer legs are planned in segments, and the NPC walks each segment to the point closest to the goal before planning the next. Climbs and descents of any height go segment by segment over stairs and slopes, or by swimming or flying when the mode allows it.

When a segment gets no closer, or is blocked while walked, Animus plans again turned 45, 90 and then 135 degrees to either side. A turned plan that reaches somewhere new is walked as a detour and later turns keep to that side, so the NPC follows a cliff, wall or shore until it can head for the goal again. After 12 plans in a row that get no closer, the leg is blocked and the server log names the NPC and the leg once. A walking goal names a block: the NPC stands on the ground in it or the block below, or on top of the block itself when it is solid, a top slab or a stair, so a point that names the ground under the feet works. When no path reaches the goal itself, such as the top of a pillar, a short leg walks to the nearest reachable place and ends there if that is within 1.5 blocks across and 2 up or down.

Missing terrain pauses navigation until the chunk loads. A world change, a definition replacement, despawn, death, shutdown or conflicting movement cancels the route. `navigation status` shows the current position, route identity and arrival count. A manual navigate or stop overrides the NPC's waypoint route until it is applied again.

### How bodies move

- Walking bodies stand on slabs, stairs, paths, snow layers and other partial blocks, step and jump within their body's limits and fall at most 3 blocks.
- Walking bodies other than armor stands climb ladders, vines and scaffolding straight up and down, and stand on top of scaffolding. An NPC on a ladder or vine does not fall.
- Ordinary bodies swim at the water surface, aquatic bodies dive and flying bodies fly. Flying and aquatic bodies do not fall.
- Every step is checked for clearance, support and hazards. Vanilla ballistic physics are not modelled.
- Terrain checks use a central hull of at most 4 blocks wide and 8 tall, so an ender dragon's wings and tail may overhang terrain.

An NPC that is not following a route falls when the block under it is broken, burnt, blown up, pushed by a piston, taken by an entity, or changed by a build or its undo. It falls to the ground or water surface below and stays put over unloaded terrain. A walking NPC whose route leg starts while it stands in the air first falls the same way, then plans the leg. A block that another plugin removes without firing an event leaves an idle NPC where it is.

## Routes

An NPC follows waypoints with the `animus:navigation` module:

```json
"modules": {
  "animus:navigation": {"enabled": true, "route": "town-patrol"}
}
```

A reusable route lives at `routes/<name>.json` in the data folder, at most 64 KiB:

```json
{
  "schemaVersion": 1,
  "mode": "walk",
  "speed": 2,
  "loop": true,
  "waitTicks": 20,
  "points": [{"x": 10, "y": 64, "z": 4}, {"x": 16, "y": 64, "z": 4}]
}
```

`mode`, `speed`, `order`, `loop`, `waitTicks`, `seed`, `startOffset`, `jitter`, `points`, `guides`, `linkDistance` and `wander` may also go directly in the module instead of a `route` reference.

| Field | Values | Meaning |
|---|---|---|
| `order` | `sequence` (default), `pingpong`, `random`, `wander` | How the next point is chosen |
| `loop` | Boolean, `sequence` only | `false` walks the points once and stops; `true` returns to the first point after the last |
| `waitTicks` | 0-12000 or `[min, max]`, default 20 | Wait before the first leg and after each arrival. A range draws a new wait each time |
| `seed` | `npc` (default), `random` | Where the route's random choices come from (see below) |
| `startOffset` | `first` (default), `random` | `random` starts at a random point after a random wait of 0 up to `waitTicks` |
| `jitter` | 0-8 blocks, default 0, not `wander` | Each leg aims at a random whole-block x/z offset within this radius of the point |
| `points` | 1-256 of `{x, y, z}`; 0-64 for `wander` | Points in the NPC's world. Each may set its own `waitTicks` (0-12000 or `[min, max]`) and `jitter` (0-8) instead of the route's |
| `points[i].weight` | 1-1000, default 1, `random` only | How often `random` picks this point compared with the others |
| `points[i].next` | 1-8 of `{"to": index, "weight": 1-1000}`, `sequence` only | A junction: after this point the next point is drawn from these by weight instead of `i + 1` |
| `points[i].recording` | `{"recording": id, "fromTick": 0, "toTick": durationTicks, "playback": "once"}`, not `wander` | A recording step instead of a position: the NPC walks to the segment's first frame, plays ticks `fromTick` to `toTick` once, then goes on to the next point from the segment's last frame |
| `guides` | 0-1024 of `{x, y, z}`, `random` only | Helper points a path may pass through, with no waits |
| `linkDistance` | 1-256, default 32, `random` only | The longest link between two points or guides |
| `wander` | `{"radius": 1-32, "height": 0-8}`, default 25 and 3, `wander` only | How far from a centre a wander target may be |

Points and guides together allow at most 1280 coordinates; a recording step counts as a point. Walking routes need whole-block heights for position points. A field used with the wrong order is reported against that field.

A point may play part of a [performance recording](/animus/19-performance-recordings#recording-steps-in-routes) instead of naming a position:

```json
"points": [
  {"x": 10, "y": 64, "z": 4},
  {"recording": "market-loop", "fromTick": 0, "toTick": 400, "waitTicks": 40},
  {"x": 16, "y": 64, "z": 4}
]
```

A step counts as a point for `order`, `next`, `weight`, `loop` and the `waypoint` trigger, which reports it by its index once the segment has played. It takes `waitTicks`, `weight` and `next` like a position point, has no `jitter` and no `x`, `y` or `z`, and only plays `once`: `loop` and `pingpong` are refused because the route has to go on. `fromTick` defaults to 0 and `toTick` to the recording's `durationTicks`; `fromTick` must be below `toTick`. A recording that cannot be read, was made in another world, or does not hold the range blocks the step like a blocked leg, with the reason in `route-error`.

- `sequence` walks 0, 1, ..., n-1, then stops or, with `loop`, starts again at 0. A point with `next` leads to one of its listed points instead; the route ends, or with `loop` returns to 0, only after the last point when it has no `next`.
- `pingpong` walks 0, 1, ..., n-1, n-2, ..., 1, 0, 1, ... forever without repeating an end point. With one point it walks there once and stops.
- `random` picks a point at random each time, never the one it just reached, and walks the shortest path to it over points and guides linked within `linkDistance`. When links do not reach the chosen point, the NPC follows them to the closest reachable point or guide and walks the rest as one long leg. From a position that is not a point or guide, the first step goes to a guide when the route has any. Points and guides passed on the way get no wait.
- `wander` picks a centre at random each leg (a point, or the NPC's definition position when there are no points) and walks to a random block within `radius` on x and z and within `height` blocks up or down. A centre's own `waitTicks` applies after reaching a target around it.

With `seed: npc` each NPC draws its route choices (destinations, junctions, wait ranges, jitter and start offset) from its own UUID and the route's identity, the reusable route id or the inline module, so NPCs sharing a route make different choices and each NPC makes the same ones again after a restart. `seed: random` mixes in the clock, which is how every route chose before `seed` existed. Give a shared route `startOffset: random` so NPCs that start together spread over its points and do not walk in a stack. When a jittered goal cannot be planned, the leg walks to the exact point once instead, without counting as stuck.

The `waypoint` trigger and `VirtualNpcWaypointEvent` report point `i` as `i` and guide `j` as the number of points plus `j`. A wander arrival reports the centre it used, or 0 without points.

A `sequence` or `pingpong` leg that terrain blocks stops the route. A `random` route waits the larger of its `waitTicks` and 100 ticks, then picks a new destination; a `wander` route waits the larger of its `waitTicks` and 20 ticks and picks a new target. Neither stops on its own. A behavior that waits for a route refuses one that never finishes: a looping `sequence`, a `sequence` whose junctions can reach a point with no way to the end, a `pingpong` over more than one point, and every `random` or `wander` route.

Instead of waypoints, the module can replay a player's recorded movement with `recording`, the id of a file under `recordings/`. A module sets only one of `recording`, `route` and inline `points`. `playback` is `once`, `loop` (default) or `pingpong`:

```json
"animus:navigation": {"enabled": true, "recording": "market-loop", "playback": "loop"}
```

See [performance recordings](/animus/19-performance-recordings) for capturing a recording and how playback handles terrain, interruptions and resuming.

An invalid route edit is reported with its field, such as `$.points[3].next[1].to: out of range` or `$.points[2].waitTicks: min above max`, and the NPC keeps the last valid route. A restart starts declared routes from their first point, or from a random one with `startOffset: random`. A navigation module on an imported definition runs only with literal `"reviewAccepted": true`.

### How many routes run

There is no limit on how many NPCs follow a route. A patrol with no player within `[npcs] viewDistance` sleeps: it holds no turn and no path plan, its status says `sleeping`, and it continues from where it stood when a player comes near (checked about once a second). A manual `/animus navigate` route and a route a behavior waits for never sleep.

Awake routes take turns. Each tick at most `routesPerTick` of them plan or take a step, and a route that missed its turn goes first on the next tick, so with more walking NPCs than the budget they all move, only slower. On Folia these budgets apply to each region tick.

| `[navigation]` setting | Default | Range |
|---|---:|---|
| `routesPerTick` | 128 | 1-4096 routes that plan or take a step per tick |
| `motionCellsPerTick` | 16384 | 512-1048576 collision cells their steps check per tick |
| `planningStartsPerTick` | 16 | 1-1024 new path plans per tick |
| `wakeChecksPerTick` | 64 | 1-4096 sleeping routes that look for a nearby player per tick (not used on Folia) |
| `planningJobs` | 32 | 1-256 path plans in progress at once |
| `captureReadsPerTick` | 2048 | 256-65536 terrain reads those plans make per tick (per region on Folia) |

`/animus status` shows `routes`, `routes-sleeping`, `routes-waiting` (waiting out a pause or a retry) and `navigation-pressure`: `none`, or how many awake routes went without a turn or a free planning job in the last tick. When routes go without a turn for a second, the console logs one warning naming the budgets to raise, and one line when the shortage has been gone for 5 seconds.

## Movement settings

A definition's `movement` object applies wherever the NPC walks a route:

```json
"movement": {"speed": 1.29, "avoidWater": false, "fly": false, "openDoors": true, "stepHeight": 1, "maximumFall": 1,
             "pathRange": 60, "arrivalMargin": 0.5, "stuck": {"afterTicks": 120, "teleport": true}}
```

| Field | Values | Meaning |
|---|---|---|
| `speed` | 1-5 blocks/second | Used by a route that sets no speed of its own |
| `avoidWater` | Boolean | `false` lets a walking route cross water at the surface |
| `fly` | Boolean | Routes fly |
| `openDoors` | Boolean | Walking routes go through closed wooden and copper doors, fence gates and upper trapdoors |
| `stepHeight` | 0-1.5 | Replaces the body's own climb height |
| `maximumFall` | 0-16 | Replaces the body's own drop height |
| `pathRange` | 1-256 blocks | Reach of each plan; longer legs are walked in segments |
| `arrivalMargin` | 0-4 blocks | A point this close counts as reached |
| `stuck.afterTicks` | 1-12000 | A leg that has not moved closer for this long, or cannot be planned, is stuck |
| `stuck.teleport` | Boolean | `true` teleports the NPC onto the point's ground and continues; `false` ends the leg |

Every field is optional. With `openDoors`, the NPC opens each door just before it reaches it, after protection allows it (WorldGuard's `use` flag on Bukkit and any module protection hook), and closes it once it is clear, or when the route ends, is cancelled, sleeps or the NPC despawns. A refused door ends the leg as blocked. Iron doors and trapdoors stay closed, and the NPC never closes a door it did not open.

### Named poses

`poses` names look directions that the behavior action `animus:pose` turns the NPC to:

```json
"poses": {"rest": {"yaw": 90, "pitch": 0}, "door": {"yaw": -180, "pitch": 10}}
```

Names are 1-32 lowercase letters, digits, `_` or `-`, at most 64 poses. `yaw` is -360 to 360 degrees and `pitch` -90 to 90, default 0. A pose turns only the head and body, like `animus:look`. Citizens named poses convert into this field.

## Looking at nearby players

An NPC with `animus:look-close` turns toward the nearest player in range while it is spawned:

```json
"modules": {
  "animus:look-close": {"range": 10, "lineOfSight": false, "whileNavigating": false, "npcs": false,
                        "randomLook": {"enabled": true, "delayTicks": 60, "yaw": [0, 360], "pitch": [-8, 8]}}
}
```

| Field | Default | Meaning |
|---|---|---|
| `enabled` | `true` when the object is present | Turns the module on |
| `range` | 10 | 1-64 blocks |
| `lineOfSight` | `false` | The player must be visible from the NPC's eyes |
| `whileNavigating` | `false` | Also look while planning or moving along a route. The NPC always looks while waiting at a point |
| `npcs` | `false` | With no player in range, look at the nearest other NPC |
| `randomLook` | off | With nobody to look at, turn to a random `yaw` and `pitch` from the ranges every `delayTicks` (1-12000) |

The NPC prefers players who can already see it and keeps its facing when nobody is in range. An NPC that rides another NPC or carries a player does not look. Each NPC looks again at most every 5 ticks, within the `[npcs] lookUpdatesPerTick` budget. `animus:look` still turns the NPC; look-close turns it back on its next look. The module does not need `reviewAccepted` on imported definitions.

## Mounted NPCs

An NPC rides another NPC through `animus:mount`:

```json
"modules": {
  "animus:mount": {"vehicle": "town-horse"}
}
```

`vehicle` is the other NPC's id. An imported Citizens `mountedon` reference applies the same way from `migration.references`. A native module takes priority, and `{"enabled": false}` turns an imported relation off without touching the preserved data.

Relations return after a restart, a join, a world change or a chunk leaving and re-entering view. A passenger sits on its vehicle's seat as the client draws it, so hits land where players see it. A chain can be 8 deep and a vehicle can carry 16 passengers. A mounted NPC cannot navigate. When a relation ends, the NPC returns to the position in its definition.

A relation that cannot be honoured leaves the NPC standing at its own position without changing the definition. `/animus inspect <id>` shows `mount-problem=` with the exact field, `/animus status` counts them and the server log reports new ones.

| Problem | Effect |
|---|---|
| Vehicle missing or dormant, or an imported reference recorded as missing, ambiguous or invalid | Reported; activation is still allowed. The NPC attaches once the vehicle becomes active |
| An imported vehicle id that now belongs to a different NPC | Reported; never attached |
| Riding itself, a cycle, a chain too deep or a full vehicle | Refused by `/animus spawn` and by `/animus edit` of a spawned NPC. A hand-edited file that creates one is reported, and every member of a cycle stays unattached |

## Riding an NPC

A player can ride an NPC whose definition opts in:

```json
"modules": {
  "animus:riding": {"enabled": true, "permission": "animus.ride.town", "speed": 4, "leash": 64, "lifetimeSeconds": 600}
}
```

| Field | Default | Range |
|---|---:|---|
| `permission` | `animus.ride` (operators by default) | Lowercase permission node |
| `speed` | 4 | 0.5-8 blocks/second |
| `leash` | 64 | 4-256 blocks horizontally from where the ride began |
| `lifetimeSeconds` | 600 | 30-3600 |

Imported definitions also need literal `"reviewAccepted": true`. An imported Citizens `controllable` trait stays preserved and does not turn riding on.

The player mounts with a right-click on the NPC. The click passes the same reach, line-of-sight and rate checks as any interaction, and a plugin can stop it by cancelling `VirtualNpcInteractionEvent`. Sneak-right-click keeps its usual meaning, so an administrator can still select a rideable NPC. The NPC needs room for its body and rider where it stands: on ground, at a water surface it can swim, or in open air when it flies. Each NPC carries one player, each player rides one NPC, and at most 8 players ride at once. Mounting cancels the NPC's route until the definition is applied again.

Press a movement key after mounting to start moving; a key already held while mounting does not count. Steering follows the player's look direction. Sprint and jump give no extra speed. The body steps up one full block and down at most three. Movement happens only on the server, through the same clearance check as navigation; the client's coordinates are never used. Block shapes the check does not recognize stop the ride, so plants, slabs, stairs and fences stop the NPC next to them. Reaching the leash holds the NPC in place without ending the ride. The NPC stays where the ride ended. Flying and swimming control are not available.

Sneaking dismounts. A ride also ends on excess input, a stale connection, expiry, losing permission, entering a real vehicle, sleeping, spectator mode, unavailable terrain, the NPC's despawn, death or definition change, and plugin shutdown. The player is placed beside the NPC, or at its feet when nothing beside it is clear, and is told the reason unless they chose to sneak off. Death, logout, an outside teleport and a world change end the ride without moving the player further. Rides do not survive a restart, and a player who logs out or crashes while riding is saved at the NPC's feet.

While riding, the player's server position is the NPC's feet, not its seat, so vanilla does not treat the rider as flying. Block reach, other players' hits and anything else measured from the server position use the ground, which is most noticeable on a tall body. Plugins do not see `PlayerMoveEvent` for the ride's motion, so region and movement-checking plugins may need an exemption.

```text
/animus ride status
/animus ride stop <player>
```

A saddled body is steered by the rider's own client while it rides. When the ride ends, every viewer is sent the NPC's position again, so the rider sees it where the server holds it and can click it to ride again.

## Hiring an NPC

`animus:hire` turns a [combat](/animus/08-combat) NPC into a bodyguard players can hire. A right-click opens a chest window that shows the NPC, its cost, how long a hire lasts and the time left, with Hire (or Renew), Dismiss and Cancel buttons. A sneaking administrator's click still selects the NPC.

```json
"animus:hire": {"items": [{"id": "minecraft:emerald", "count": 5}], "price": 0, "durationMinutes": 30, "permission": "animus.hire.guard"}
```

| Field | Meaning |
|---|---|
| `items` | Up to 6 items taken from the hirer's inventory. Works on every platform |
| `price` | Money taken through the economy (Vault on Bukkit). With no economy, a priced hire fails and takes nothing. Mod servers have no economy, so use `items` there |
| `durationMinutes` | Length of one hire, 1-10080, default 60. A renewal adds this to the time left |
| `permission` | Needed to hire, when set |
| `enabled` | `false` turns the module off |

Payment is all or nothing: items and money are returned if any part fails or the NPC cannot guard now. A hire makes the NPC guard the hirer through its `animus:combat` module, so the NPC needs one. One player hires an NPC at a time; others see who it works for. Only the hirer can renew or dismiss. Contracts are kept in `state/hire/contracts.json` and survive restarts; when the hirer comes back online the NPC guards them again. When the time runs out, the NPC stops guarding and the hirer is told.
