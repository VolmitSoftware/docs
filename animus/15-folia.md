---
title: "Animus: Folia"
description: "How saved NPCs run on Folia regions, what differs from Paper, and the stationary preview command"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, folia, regions, compatibility"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

On Folia 26.1.2, 26.2 and 26.3, each saved NPC runs on the region that owns its chunk. Commands, definitions, limits and events are the same as on Paper. This page covers what differs.

## What runs

| Feature | On Folia |
|---|---|
| Activation, despawn, edits, skins, `/animus inspect`, `/animus status` | Yes |
| Presentation: equipment, text lines and long names, nameplate visibility, poses including sitting, armor stand parts, runtime equipment and appearance changes | Yes, same as Paper |
| Use and attack interactions, `VirtualNpcInteractionEvent`, administrator selection | Yes, when the player's region also owns the NPC |
| Triggers: spawn, despawn, interaction, waypoint, proximity, timers | Yes |
| Built-in behavior actions that touch the world or a player | Yes |
| Navigation: `/animus navigate`, `look`, stop, waypoint patrols, reusable routes, waiting behaviors | Yes |
| Riding an NPC (`animus:riding`) | Yes; see [riding](#riding) |
| Mounted NPCs (`animus:mount`) | Yes; see [mounted groups](#mounted-groups) |
| Combat module, `/animus combat`, the `animus:combat` action, hiring | Yes; see [combat](#combat) |
| Ender dragon wing phases | Yes |
| `/animus attack`, `/animus target` | Yes; see [manual attack and mob control](#manual-attack-and-mob-control) |
| Builds (`/animus build`, `animus:build`), scaffolding, doors and beds | Yes; see [builds](#builds) |
| Packet preview (`/animus proof`) | No. Use the [stationary preview](#stationary-preview) |
| Recording (`/animus record`), the recording ghost and previews | Yes; every session and preview runs on the recording player's own thread |

Changing `npcs.enabled` needs a restart on Folia. Every other `config.toml` key applies live, on each region's next tick.

## Ownership

Each NPC has one owner: the region that owns the chunk under its feet. That region reads terrain, plans routes, moves the NPC and runs its queued work. Before each turn it checks that it owns every chunk the NPC's body covers and that all of them are loaded.

An NPC whose chunk is not loaded waits. It starts when that chunk loads, or when a player whose region owns the chunk comes within view distance. Animus never loads or generates a chunk to start, move or show an NPC. A waiting NPC is not counted as `active` in `/animus status`; `/animus inspect` shows it as waiting.

Players still see NPCs whose chunks their client has received, even when another region owns the NPC. An interaction counts only when the player's region also owns the NPC; otherwise it is rejected and counted in `/animus status` as `rejected`.

Behavior actions run on the NPC's region:

- A message, sound, particle, choice or command for a player on another region is handed to that player and not awaited, so a rejected player command is not reported.
- A console command runs on the global region thread.
- `nearby` audiences include only players on the NPC's region.
- `has-permission` and look-at-player fail with `player-in-other-region` when the player is on another region.

## Moving between chunks

When an NPC moves into a chunk another region owns, the new region adopts it after checking that it owns the whole body and the chunk is loaded. The route and its goal, waypoint progress, a behavior waiting for the route, queued behavior actions and pending skin or route reads move with the NPC. The new owner plans the route again from where the NPC stands, and each crossing pauses the NPC for at least one tick.

If the new chunk is not loaded, or the new region has not adopted the NPC within 5 seconds, the NPC waits where it stands. A waiting behavior is told the route is unavailable; any other route continues when the NPC starts again. Queued actions for a waiting NPC are refused with the reason. The same happens if a chunk unloads under an NPC. When regions split or merge, the NPC moves with its chunk.

A long leg walks to the edge of its region and the handoff carries the route on. A short leg whose terrain belongs to more than one region waits and retries after 2 seconds; a waiting behavior is told the route is unavailable instead. Folia keeps neighbouring loaded chunks in one region, so this normally happens only while regions merge.

## Mounted groups

A vehicle and every NPC riding it share one owner: the region that owns the root vehicle. Passengers move right after their vehicle, so they always sit on the current seat. When the root crosses into another chunk, the whole group is handed over at once. When the group goes dormant, every passenger goes dormant with it and wakes on its own later.

A passenger whose vehicle is on another region steps onto the vehicle's seat, which hands it to the vehicle's region, and it joins the group there. A passenger whose vehicle is not active waits where it stands; `/animus inspect` shows `mounted-on=<vehicle> (not seated yet ...)`. When a relation ends or its vehicle is removed, the passenger returns to the position in its definition. Cycles, chains deeper than 8 and full vehicles are refused as on Paper.

## Riding

A ride runs on the NPC's region and moves with the NPC on every handoff. The rider stands at the NPC's feet, so the same region owns both. If the NPC's region does not hold the rider for 2 seconds, the ride ends. A right-click mounts only when the player's region also owns the NPC.

A logout, death, teleport or world change ends the ride without moving the rider further. A rider that something else moved more than 3 blocks from the NPC's feet, including Folia's same-region teleport that fires no event, is dismounted where it is. Steering into terrain the NPC's region does not hold ends the ride as unavailable terrain. At most 8 players ride at once on the whole server. When Animus stops, rides end without a dismount teleport.

## Combat

Each combat NPC fights on its own region, and its combat state moves with it. An NPC only chooses targets that its region owns. A hit on a real entity another region holds is checked again by that entity's region (still alive, same world, within reach, protection) before it applies. A hit on another NPC goes to that NPC's region, which applies its own armor and defense and makes it fight back. Healing potions and squad alerts work the same way. A fight reaches the guards of either side and the NPCs that watch fights, at most 64 per fight; dropped messages are counted in `/animus combat status` as `messages-dropped`.

Helper projectiles spawn only in chunks the NPC's region holds. A helper that flies into another region keeps its last known position until it lands or expires. Protection is checked on the region that owns the hit's target.

A player's hit on an NPC counts only when the player's region also owns the NPC. `/animus combat status npc=<npc>` reads the NPC's published combat state; `engage`, `disengage`, `release`, `target` and `guard` run on the NPC's region and log their result. A guard teleport, a knockback and a respawn hand the NPC over like any chunk crossing.

The `[combat]` limits `brainsPerTick`, `targetScansPerTick`, `pathRequestsPerTick`, `squadAlertsPerTick` and `helperUpdatesPerTick` apply to each region tick. `maximumNpcs` does not apply on Folia. `helpersPerNpc` applies to each NPC. When a region is short of combat turns, the NPCs that waited longest go first. Damage and death triggers fire as on Paper.

## Manual attack and mob control

`/animus attack` and `/animus target` answer `QUEUED` at once; the result follows in the server log as `Attack <npc>: <status> ...` or `Mob control ...`, with the same statuses as on Paper. `target` on a player is refused, as on Paper.

An attack is captured on the NPC's region, where the NPC stands at that moment, and handed to the target's own region. That region checks that the target is alive in the same world, that the NPC has not moved more than 2 blocks since, reach, line of sight and protection, fires `VirtualNpcDamageEvent` and applies the damage. When the line to the target crosses chunks the target's region does not own, the attack is refused as `UNAVAILABLE_CHUNK`. Each NPC has at most one attack on its way at a time, and the cooldown counts from when it began.

A controlled mob runs on its own region and reads the NPC only from its published state. It walks to the NPC through chunks its region owns and stops where that region ends. Its hits go to the NPC's region, which checks the reach again and applies the NPC's own defense; `VirtualNpcDamagedByMobEvent` fires on the mob's region. `target <npc> stop` lets each mob go on its own region. At most 32 mobs are controlled at once, and their path plans count against the region's `pathRequestsPerTick`. A mob removed or unloaded while controlled is released without being touched. When Animus stops, controlled mobs have no goals until their chunks load again. `/animus combat status` counts `attacks`, `applied`, `refused`, `controlled-mobs` and `mob-hits`.

## Builds

The global region keeps every build's record, runs build commands and saves progress. It sends each build out for one turn at a time to the region that owns where the build works now: the next team member in turn, the next change while undoing, standing scaffolding, or the origin. That turn places blocks, moves the NPC, puts up and takes down scaffolding and reads the material container, all in chunks its region owns. A door, bed or other two-block object is placed in one turn, never one half alone.

While a build is out on a turn, only its region touches it. A command for that build waits until the turn comes back, for at most 10 seconds; at most 64 commands wait at once. A turn no region started within 10 seconds is taken back and sent again. `/animus build` counts `region-turns`, `out` and `lost`. The `[builds]` limits `placementsPerTick`, `checksPerTick` and `undoPerTick` apply to each build's turn.

A team member on another region keeps its claim and scaffolding and works when a turn reaches its region. When the block it claims, or the other half of the object, is in a loaded chunk another region owns, the NPC walks towards it, and the block is checked and placed by a turn on the region that holds both. A material container on another region makes the build wait with `the material container at ... is in chunk X Z, which another region owns`. A turn goes only to a chunk Animus knows is loaded; otherwise the build waits with `waiting for chunk X Z to load`.

Build commands answer through your own region a moment later, and `animus:build` answers `queued` and logs its result. A donation takes the stack from your hand first; what the build does not need goes back into your inventory, and what does not fit drops at your feet. When Animus stops, standing scaffolding stays and comes down after the restart.

## Viewers

A player's view of NPCs is rebuilt after a teleport (including Folia's same-region teleport that fires no event), a world change, death and respawn, and is removed at logout. A player who leaves the range, or whose client loses the chunk, stops seeing the NPC. An NPC that starts waiting or is removed disappears for every viewer on their next tick.

## Limits

These limits apply to each region tick rather than to the whole server:

| Work per region tick | Limit |
|---|---:|
| Queued NPC actions run | 64 (8 per NPC) |
| Route turns | `[navigation] routesPerTick` (128) |
| Live collision cells | `[navigation] motionCellsPerTick` (16384) |
| New path plans | `[navigation] planningStartsPerTick` (16) |
| Terrain capture reads | `[navigation] captureReadsPerTick` (2048) |
| Viewer updates | `[npcs] updatesPerTick`; with more viewers, they take turns |
| Packet operations | `[npcs] packetsPerTick` (32), shared by the viewers updating |
| Look-close turns | `[npcs] lookUpdatesPerTick` (32) |
| Idle fall and rig animation steps | `[npcs] simulationPerTick` (512) |
| NPC starts | 16 |
| Combat brains, target scans, path requests, squad alerts, helper updates | The `[combat]` limits of the same names |

A region that runs short of simulation steps or route turns slows its own cosmetic updates and distant moves, as described under [NPC definitions](/animus/04-npc-definitions); other regions keep their rate. Waiting behavior runs slow every region. These stay server-wide: `maximumViewers`, `viewDistance`, 10,000 active NPCs, 8 concurrent route and appearance reads, 8 skin reads and 8 path plans. `maximumVisible` applies to each viewer, and each NPC queues at most 32 actions. Work over a limit waits for the next tick.

Route turns go to the NPCs that waited longest, so no patrol waits forever. Every player marks the NPCs within `viewDistance` once a second, also on other regions; a patrol that nobody marked for 3 seconds sleeps until a player comes near. `/animus status` shows `routes-sleeping` and `navigation-pressure`, and the console logs once when regions start to run short of route turns and once when the shortage ends.

## Stationary preview

`/animus foliaproof` shows one stationary player-shaped NPC privately to an administrator. It does not use or activate saved definitions. Enable it with `packetProofEnabled = true` in `config.toml`; the change applies when the file is saved, and turning it off clears existing preview bodies.

```none
/animus foliaproof spawn [skin-sha256]
/animus foliaproof status
/animus foliaproof clear
```

All three require `animus.admin`. The console can read `status`; `spawn` and `clear` need a player. Skin references use existing content-hashed JSON files under `skins/`. The NPC appears about three blocks ahead, centred on a block, on full-block support with clear space; nearby partial or unknown block shapes can cause a refusal.

The whole body and its support must be owned by the player's region, loaded and sent to the client. A pending spawn is cancelled when the player teleports. A visible preview is removed after a teleport (including a same-position teleport), logout, death or respawn, a world change, losing permission, unavailable terrain or expiry.

Interactions use the server's eye position and direction, the preview's hitbox, reach and line of sight. `VirtualNpcInteractionEvent` fires on the player's region with `preview=true` and can be cancelled. The preview changes no health and runs no commands.

| Limit | Value |
|---|---|
| Players with a preview at once | 8 |
| Bodies per player | 1 |
| Spawn attempts per server start | 64; restart the server to reset |
| Pending command requests | 8 |
| Skin reads at once | 2 |
| Lifetime / view distance | 120 seconds / 16 blocks |
| Interaction rate / reach | 10 per second / 4.5 blocks |

Clearing a preview frees its slot but does not reset the attempt count. An invalid skin can use up an attempt. The preview limits are separate from the saved-NPC limits above.
