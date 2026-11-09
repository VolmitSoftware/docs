---
title: "Animus: Movement, Mounts and Riding"
description: "Navigation, routes, look-close, movement settings, mounted NPCs, player riding and hiring"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, navigation, routes, mounts, riding, hire"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

NPC movement runs on the server against real block collision. Animus never loads or generates chunks to move an NPC. On Folia each NPC moves on the region that owns its chunk; see [Folia](/animus/15-folia).

## Manual navigation

<div class="animus-demo">
<p><strong>Navigation commands</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/17-navigation-command-ingame.webm" aria-label="Walking an NPC to the player and turning it to face him" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus navigation go guard 10 64 4 mode=walk speed=2
/animus navigation status guard
/animus navigation stop guard
/animus navigation look guard 12 65 4
```

`/animus navigation go <npc> <x> <y> <z> [mode=walk] [speed=2.0]` moves an active NPC in its current world at 1-10 blocks per second. A leg may be any length. Short legs are planned whole; longer legs are planned in segments, and the NPC walks each segment to the point closest to the goal before planning the next. Climbs and descents of any height go segment by segment over stairs and slopes, or by swimming or flying when the mode allows it. An NPC whose `movement.style` is `fly` or `glide` flies the leg whatever `mode` says.

When a plan gets no closer:

- Animus searches a wider area, then tries ways round to either side, so the NPC follows a cliff, wall or shore until it can head for the goal again.
- When none of that gets closer, the leg is blocked. The server log names the NPC and the leg once, saying whether terrain blocks it (a closed space, or a step blocked while walked) or no way round was found.
- When no path reaches the goal itself, such as the top of a pillar, a short leg walks to the nearest reachable place and ends there if that is within 1.5 blocks across and 2 up or down.

A walking goal names a block: the NPC stands on the ground in it or the block below, or on top of the block itself when it is solid, a top slab or a stair, so a point that names the ground under the feet works. A walking NPC crosses a gap in its footing narrower than a quarter block, such as the open front of a shelf beside a slab.

Missing terrain pauses navigation until the chunk loads. A world change, a definition replacement, despawn, death, shutdown or conflicting movement cancels the route. `navigation status` shows what the NPC is doing, its goal, its position and the arrival count, such as `Navigation guard: moving to 4.5 64 2.5, now at 3.25 64 1`. A walking goal rounds its feet height to the block, so `^ ^ ^5` works. A manual `navigation go` or `navigation stop` overrides the NPC's route until its definition is applied again. See [commands](/animus/02-commands-permissions#movement-and-riding) for the rest of the movement commands.

### How bodies move

- Walking bodies stand on slabs, stairs, paths, snow layers and other partial blocks, step and jump within their body's limits and fall at most 3 blocks.
- Walking bodies other than armor stands climb ladders, vines and scaffolding straight up and down, and stand on top of scaffolding. An NPC on a ladder or vine does not fall.
- Ordinary bodies swim at the water surface, aquatic bodies dive and flying bodies fly. Flying and aquatic bodies do not fall.
- Every step is checked for clearance, support and hazards. Vanilla ballistic physics are not modeled.
- Terrain checks use a central hull of at most 4 blocks wide and 8 tall, so an ender dragon's wings and tail may overhang terrain.

An NPC that is not following a route falls when the block under it is broken, burnt, blown up, pushed by a piston, taken by an entity, or changed by a build or its undo. It falls to the ground or water surface below and stays put over unloaded terrain. A walking NPC whose route leg starts while it stands in the air first falls the same way, then plans the leg. A block that another plugin removes without firing an event leaves an idle NPC where it is.

## Routes

<div class="animus-demo">
<p><strong>Route capture</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/15-route-capture-ingame.webm" aria-label="Walking a path and dropping four route points" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

An NPC follows a route, a list of points, with the `animus:navigation` module:

```json
"modules": {
  "animus:navigation": {"enabled": true, "route": "town-walk"}
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

`mode`, `speed`, `style`, `order`, `loop`, `waitTicks`, `seed`, `startOffset`, `jitter`, `points`, `guides`, `linkDistance` and `wander` may also go directly in the module instead of a `route` reference.

| Field | Values | Meaning |
|---|---|---|
| `style` | A [movement style](#movement-styles) | How NPCs move on this route, instead of each NPC's own `movement.style` |
| `order` | `sequence` (default), `pingpong`, `random`, `wander` | How the next point is chosen |
| `loop` | Boolean, `sequence` only | `false` walks the points once and stops; `true` returns to the first point after the last |
| `waitTicks` | 0-12000 or `[min, max]`, default 20 | Wait before the first leg and after each arrival. A range draws a new wait each time |
| `seed` | `npc` (default), `random` | Where the route's random choices come from (see below) |
| `startOffset` | `first` (default), `random` | `random` starts at a random point after a random wait of 0 up to `waitTicks` |
| `jitter` | 0-8 blocks, default 0, not `wander` | Each leg aims at a random whole-block x/z offset within this radius of the point |
| `points` | 1-256 of `{x, y, z}`; 0-64 for `wander` | Points in the NPC's world. Each may set its own `waitTicks` (0-12000 or `[min, max]`) and `jitter` (0-8) instead of the route's |
| `points[i].style` | A [movement style](#movement-styles), not on a recording step | How the NPC moves on the leg that ends at this point, instead of the route's `style`. Legs to guides use the route's |
| `points[i].weight` | 1-1000, default 1, `random` only | How often `random` picks this point compared with the others |
| `points[i].next` | 1-8 of `{"to": index, "weight": 1-1000}`, `sequence` only | A junction: after this point the next point is drawn from these by weight instead of `i + 1` |
| `points[i].recording` | `{"recording": id, "fromTick": 0, "toTick": durationTicks, "playback": "once"}`, not `wander` | A recording step instead of a position: the NPC walks to the segment's first frame, plays ticks `fromTick` to `toTick` once, then goes on to the next point from the segment's last frame |
| `guides` | 0-1024 of `{x, y, z}`, `random` only | Helper points a path may pass through, with no waits |
| `linkDistance` | 1-256, default 32, `random` only | The longest link between two points or guides |
| `wander` | `{"radius": 1-32, "height": 0-8}`, default 25 and 3, `wander` only | How far from a center a wander target may be |

Points and guides together allow at most 1280 coordinates; a recording step counts as a point. Walking routes need whole-block heights for position points, except points whose leg flies: a point with `style` `fly` or `glide`, any point and guide of a route with that `style`, and the unstyled points of a module's own route when the NPC's `movement.style` is `fly` or `glide`. A field used with the wrong order is reported against that field.

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
- `wander` picks a center at random each leg (a point, or the NPC's definition position when there are no points) and walks to a random block within `radius` on x and z and within `height` blocks up or down. A center's own `waitTicks` applies after reaching a target around it.

With `seed: npc` each NPC draws its route choices (destinations, junctions, wait ranges, jitter and start offset) from its own UUID and the route's identity, the reusable route id or the inline module, so NPCs sharing a route make different choices and each NPC makes the same ones again after a restart. `seed: random` mixes in the clock, so choices differ after every restart. Give a shared route `startOffset: random` so NPCs that start together spread over its points and do not walk in a stack. When a jittered goal cannot be planned, the leg walks to the exact point once instead, without counting as stuck.

The `waypoint` trigger and `VirtualNpcWaypointEvent` report point `i` as `i` and guide `j` as the number of points plus `j`. A wander arrival reports the center it used, or 0 without points.

A `sequence` or `pingpong` leg that terrain blocks stops the route. A `random` route waits the larger of its `waitTicks` and 100 ticks, then picks a new destination; a `wander` route waits the larger of its `waitTicks` and 20 ticks and picks a new target. Neither stops on its own. A behavior that waits for a route refuses one that never finishes: a looping `sequence`, a `sequence` whose junctions can reach a point with no way to the end, a `pingpong` over more than one point, and every `random` or `wander` route.

Instead of route points, the module can replay a player's recorded movement with `recording`, the id of a file under `recordings/`. A module sets only one of `recording`, `route` and inline `points`. `playback` is `once`, `loop` or `pingpong`; without it the recording's own `playback` applies, then `loop`:

```json
"animus:navigation": {"enabled": true, "recording": "market-loop", "playback": "loop"}
```

See [performance recordings](/animus/19-performance-recordings) for capturing a recording and how playback handles terrain, interruptions and resuming.

An invalid route edit is reported with its field, such as `$.points[3].next[1].to: out of range` or `$.points[2].waitTicks: min above max`, and the NPC keeps the last valid route. A restart starts declared routes from their first point, or from a random one with `startOffset: random`. A navigation module on an imported definition runs only with literal `"reviewAccepted": true`.

### How many routes run

There is no limit on how many NPCs follow a route. A route with no player within `[npcs] viewDistance` sleeps: it holds no turn and no path plan, its status says `sleeping`, and it continues from where it stood when a player comes near (checked about once a second). A manual `/animus navigation go` leg and a route a behavior waits for never sleep.

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

<div class="animus-demo">
<p><strong>Routes</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/07-routes-editor.webm" aria-label="Setting a random route with a wait range and adding points on the grid" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A definition's `movement` object applies wherever the NPC walks a route:

```json
"movement": {"speed": 1.29, "avoidWater": false, "openDoors": true, "stepHeight": 1, "maximumFall": 1,
             "pathRange": 60, "arrivalMargin": 0.5, "stuck": {"afterTicks": 120, "teleport": true},
             "style": "walk", "onLand": "walk", "auto": {"swim": true, "crawl": false}}
```

| Field | Values | Meaning |
|---|---|---|
| `speed` | 1-5 blocks/second | Used by a route that sets no speed of its own, instead of the `movement_speed` attribute |
| `avoidWater` | Boolean | `false` lets a walking route cross water at the surface |
| `openDoors` | Boolean | Walking routes go through closed wooden and copper doors, fence gates and upper trapdoors |
| `stepHeight` | 0-1.5 | Replaces the body's own climb height and the `step_height` attribute |
| `maximumFall` | 0-16 | Replaces the body's own drop height and the `safe_fall_distance` attribute, counted in levels: a drop onto a slab one level down is a fall of 1, and a surface lower than half a block, such as a carpet or closed trapdoor, is part of the level of the block under it |
| `pathRange` | 1-256 blocks | Reach of each plan; longer legs are walked in segments |
| `arrivalMargin` | 0-4 blocks | A point this close counts as reached |
| `stuck.afterTicks` | 1-12000 | A leg that has not moved closer for this long, or cannot be planned, is stuck |
| `stuck.teleport` | Boolean | `true` teleports the NPC onto the point's ground and continues; `false` ends the leg. A point buried by later building lifts to the first place the NPC fits up to 10 blocks above it, as Citizens does |
| `style` | A [movement style](#movement-styles), default `walk` | How the NPC moves on a leg whose route and point set no `style` |
| `onLand` | `walk` (default), `avoid` | Style `swim` only: `walk` walks the land between stretches of water; `avoid` keeps the NPC in water, so a leg that starts or ends on land is blocked |
| `auto.swim` | Boolean, default `true` | A player body shows the swimming pose while it moves through water, whatever its style |
| `auto.crawl` | Boolean, default `false` | A player body plans through gaps one block high and crawls while its standing height does not fit there |

Every field is optional. With `openDoors`, the NPC opens each door just before it reaches it, after protection allows it (WorldGuard's `use` flag on Bukkit and any module protection hook), and closes it once it is clear, or when the route ends, is cancelled, sleeps or the NPC despawns. A refused door ends the leg as blocked. Iron doors and trapdoors stay closed, and the NPC never closes a door it did not open.

### Movement styles

A style says how an NPC moves along a leg: the pose viewers see, its speed and where the path may go. The leg's style is the point's `style`, else the route's `style`, else the NPC's `movement.style`. A trait group's `movement.style` applies like any other movement field. Set it with the editor's Movement, route and point dropdowns, the in-game Edit screen (`/animus tools`), or `/animus edit guard {"movement": {"style": "sneak"}}`, which changes only `movement.style`.

| Style | Speed | Player body | Other bodies | Path |
|---|---|---|---|---|
| `walk` | 1x | Its own pose | Its own pose | As the route mode allows |
| `sneak` | 0.3x | Crouches, also while it waits at a point | Name dimmed, as a sneaking player's | As walk |
| `sprint` | 1.3x | Sprinting, with sprint dust | Sprint dust | As walk |
| `swim` | 1.3x in water, 1x on land | Swimming pose in water | Its own pose | Crosses water; with `onLand: avoid` stays in it |
| `crawl` | 0.3x | Crawling pose, also while it waits | Its own pose | Passes gaps one block high, player bodies only |
| `fly` | 1x | Its own pose | Its own pose | Flies |
| `glide` | 2x | Elytra pose while airborne | Its own pose | Flies |

Speeds are vanilla's ratios to walking and multiply the leg's speed: the route's `speed`, else `movement.speed`, else the speed the `movement_speed` attribute gives. So a player NPC with `movement_speed` 0.1 (4.3 blocks per second) sneaks at 1.3 blocks per second. `glide` moves at twice walking speed, close to a vanilla elytra cruise of about 8.6 blocks per second against a walk of 4.3. No style moves faster than 10 blocks per second, so a glide at the route maximum of 5 reaches that cap. A body that sinks, such as an armor stand, never swims; a leg in `swim` walks for it.

A leg in `fly` or `glide` flies on any route: it plans through the air, does not fall, opens no doors and may end in the air. A leg with a ground style, such as a point set to `walk` on a route of an NPC whose own style is `fly`, walks as the route's `mode` allows. A route with `mode: fly` flies every leg whatever its style. Flying NPCs used to set `"fly": true`; that field is gone, and a definition that still has it is refused as an unknown field.

The look changes only while the NPC follows a route or a `navigation go` leg. When the route ends or is stopped, the NPC shows its own `pose` again, except that a player body left in a gap too low to stand in keeps crawling. A route that sets no style changes nothing on its own, so a `pose: sneaking` NPC still walks crouched at full speed, as an imported Citizens sneaking NPC does.

With `auto.crawl`, every leg of a player body plans at crawling height, so it may take a low gap even where a slightly longer path stands upright the whole way. The crawl check reads the blocks above each step and counts against `motionCellsPerTick`. Bodies other than players have no swimming or crawling pose, so `auto` changes nothing for them.

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

The NPC prefers players who can already see it and keeps its facing when nobody is in range. An NPC that rides another NPC or carries a player does not look. Each NPC looks again at most every 5 ticks, within the `[npcs] lookUpdatesPerTick` budget. `animus:look` still turns the NPC; look-close turns it back on its next look. The module does not need `reviewAccepted` on imported definitions. `/animus npc look <npc> off` turns it off and keeps its settings; `on` turns it back on.

## Mounted NPCs

<div class="animus-demo">
<p><strong>Mounts</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/20-mounts-ingame.webm" aria-label="Seating an NPC on a horse NPC and dismounting it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

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
| Vehicle missing or dormant, or an imported reference recorded as missing, ambiguous or invalid | Reported; spawning is still allowed. The NPC attaches once the vehicle becomes active |
| An imported vehicle id that now belongs to a different NPC | Reported; never attached |
| Riding itself, a cycle, a chain too deep or a full vehicle | Refused by `/animus spawn` and by `/animus edit` of a spawned NPC. A hand-edited file that creates one is reported, and every member of a cycle stays unattached |

## Riding an NPC

<div class="animus-demo">
<p><strong>Riding</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/21-riding-ingame.webm" aria-label="Changing a horse NPC's riding speed and riding it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

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

The player mounts with a right-click on the NPC. The click passes the same reach, line-of-sight and rate checks as any interaction, and a plugin can stop it by cancelling `VirtualNpcInteractionEvent`. A sneak-right-click does not mount, and the wand selects a rideable NPC as any other. The NPC needs room for its body and rider where it stands: on ground, at a water surface it can swim, or in open air when it flies. Each NPC carries one player, each player rides one NPC, and at most 8 players ride at once. Mounting cancels the NPC's route until the definition is applied again.

Press a movement key after mounting to start moving; a key already held while mounting does not count. Steering follows the player's look direction. Sprint and jump give no extra speed. Movement happens only on the server, through the same clearance check as navigation, against the real height of each block; the client's coordinates are never used. How the NPC moves depends on its body:

- A walking body climbs onto anything up to its step or jump height, whichever is higher, and drops at most three blocks. A block it cannot climb or pass stops it next to that block.
- A body that swims stays at the water surface. A body that cannot walk does not leave the water.
- A flying body follows the player's look direction up and down as well, through clear air, and settles on a surface it flies into.

Reaching the leash holds the NPC in place without ending the ride. The NPC stays where the ride ended.

Sneaking dismounts. A ride also ends on excess input, a stale connection, expiry, losing permission, entering a real vehicle, sleeping, spectator mode, unavailable terrain, a step into a region the player may not enter, the NPC's despawn, death or definition change, and plugin shutdown. The player is placed beside the NPC, or at its feet when nothing beside it is clear, and is told the reason unless they chose to sneak off. Death, logout, an outside teleport and a world change end the ride without moving the player further. Rides do not survive a restart, and a player who logs out or crashes while riding is saved at the NPC's feet.

While riding, the player's server position is the NPC's feet, not its seat, so vanilla does not treat the rider as flying. Block reach, other players' hits and anything else measured from the server position use the ground, which is most noticeable on a tall body. Plugins do not see `PlayerMoveEvent` for the ride's motion, so riding bypasses their region entry rules unless Animus checks them itself. With WorldGuard installed, Animus checks the `entry` flag for the rider on each block the ride steps into, as when the player walks in: members and players with region bypass enter, and a denied step ends the ride with "Dismounted: region entry denied". A WorldGuard that is disabled or fails to answer ends the ride too. Other claim and region plugins, and movement checks such as flight, see none of the ride's motion, so keep ridable NPCs away from areas they guard.

```none
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
