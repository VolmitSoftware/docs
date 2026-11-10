---
title: "Animus: NPC Schedules"
description: "Places an NPC goes at set times of the Minecraft day, what it does there, and importing NPC Destinations"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, schedules, navigation, npc destinations, citizens"
editor: markdown
dateCreated: 2026-11-09T00:00:00.000Z
---

A schedule gives an NPC a place for each part of the Minecraft day. A baker can stand in the shop from morning, walk home at nightfall and lie down in bed, then walk back at sunrise. The NPC walks with Animus [navigation](/animus/05-movement-mounts-riding#manual-navigation), so its `movement` settings apply: speed, doors, falls and stuck handling.

## The schedule module

<div class="animus-demo">
<p><strong>NPC schedule</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/37-schedule-ingame.webm" aria-label="The Baker walking home to sleep, then to a newly added place" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```json
"modules": {
  "animus:schedule": {
    "speed": 3,
    "locations": [
      {"name": "shop", "time": 1000, "x": 10, "y": 64, "z": 4, "yaw": 90,
       "equipment": {"head": {"id": "minecraft:leather_helmet"}}, "wander": {"radius": 4, "waitSeconds": [5, 15]}},
      {"name": "bed", "time": 13000, "x": -20, "y": 64, "z": 8, "pose": "sleeping", "clearEquipment": true},
      {"name": "tavern", "time": 13000, "x": 30, "y": 64, "z": -6, "chance": 25, "weather": "storm"}
    ]
  }
}
```

| Field | Values | Meaning |
|---|---|---|
| `enabled` | Boolean, `true` when the object is present | `false` keeps the locations and stops the schedule |
| `speed` | 1-10 blocks per second | How fast the NPC walks between places. The NPC's `movement.speed` by default, else 2 |
| `locations` | 1-64 locations | The places, in any order |
| `reviewAccepted` | Boolean | An imported schedule runs only once this is `true`; see [importing NPC Destinations](#importing-npc-destinations) |

Each location:

| Field | Values | Meaning |
|---|---|---|
| `name` | 1-32 lowercase letters, digits, `_` or `-` | A name for commands and replies |
| `time` | 0-23999 | World time the NPC sets out for this place: 0 is sunrise, 1000 morning, 6000 noon, 13000 night, 18000 midnight |
| `x`, `y`, `z` | Whole numbers | The block the NPC stands in, in the NPC's own world |
| `yaw`, `pitch` | -360 to 360, -90 to 90 | The way it faces on arrival |
| `chance` | 1-100, default 100 | Draw weight among locations with the same `time` |
| `weather` | `any` (default), `clear`, `storm` | Only in this weather. `storm` counts rain and thunder |
| `staySeconds` | Seconds, or `[min, max]` | How long it stays before it draws again among the locations with the same `time` |
| `wander` | `{"radius": 1-32}` or `{"area": [x1, y1, z1, x2, y2, z2]}`, with optional `waitSeconds` | Walks to random blocks around the place: within `radius` on x and z at the place's height, or anywhere in the area. `waitSeconds` (seconds or `[min, max]`, default 1) is the pause between wander legs |
| `pose` | `standing`, `sneaking`, `sleeping`, `sitting` | Pose on arrival, player bodies only |
| `equipment` | Slot to [item](/animus/04-npc-definitions#appearance-text-and-inventory) | Items put on at arrival |
| `clearEquipment` | Boolean | Empties every other slot on arrival |
| `skin` | A skin file hash from `skins/` | Skin shown on a player body |
| `skinOnDeparture` | Boolean | Shows the skin as the NPC sets out instead of on arrival |
| `commands` | 0-16 console commands, without the slash | Run from the console on arrival |

An NPC follows a schedule or an `animus:navigation` route, not both: turning both on is refused with the field named.

## Which place the NPC goes to

Once a second the schedule reads the world time and weather where the NPC is. The location whose `time` passed most recently is in effect; before the first `time` of the day, the latest one still holds from the evening before. Locations whose `weather` does not match are skipped. When the time in effect changes, or the weather rules out the current place, the NPC walks to the new one.

Several locations may share a `time`. The NPC draws one of them by `chance`: with 25 and 75, the first is picked one time in four. With `staySeconds`, it draws again among them when the stay ends, so it moves between the stalls of a market until the time changes.

A leg that cannot reach its place, such as one through a wall that was built later, is tried again after 30 seconds. With `movement.stuck.teleport` the NPC is placed at the location instead.

Nothing is saved between restarts: after a restart, or when its chunk loads again, the NPC walks to the place the clock gives it. `/time set` moves NPCs as soon as their next check runs.

## Arriving

On arrival the NPC turns to `yaw` and `pitch`, puts on `equipment` (after emptying the other slots with `clearEquipment`), shows `skin`, takes `pose` and runs `commands`. Equipment, skin and pose last until the NPC's definition is applied again, as with the [appearance actions](/animus/07-behaviors#actions). The pose lasts while the NPC stays: before it moves again it stands up in its own pose. A sitting NPC cannot also ride another NPC.

A location with `wander` starts wandering after its first `waitSeconds` and keeps wandering until the time changes. Wandering stands the NPC up, so give a sleeping place no `wander`.

## Commands

```none
/animus schedule add baker 1000 name=shop
/animus schedule add baker night -20 64 8 name=bed pose=sleeping
/animus schedule list baker
/animus schedule remove baker bed
/animus schedule off baker
/animus schedule on baker
```

| Command | Meaning |
|---|---|
| `/animus schedule add <npc> <time> [x] [y] [z] [name=] [chance=100] [stay=] [wander=0] [pose=]` | Adds a location where you stand, facing your way, or at `x y z`. `time` is 0-23999 or one of `day` (1000), `noon` (6000), `sunset` (12000), `night` (13000), `midnight` (18000) and `sunrise` (23000). `stay` is seconds such as `60` or `60-120`; `wander` is a radius in blocks |
| `/animus schedule list <npc>` | Lists the locations by time, with their numbers |
| `/animus schedule remove <npc> <location>` | Removes a location by name or number. Removing the last one removes the schedule |
| `/animus schedule on <npc>`, `/animus schedule off <npc>` | Turns the schedule on or off and keeps its locations. `on` also accepts the review of an imported schedule |

They need `animus.npc.edit`. Every change is saved as a new revision, so `/animus rollback` undoes it. Any other field, such as `equipment` or `commands`, is set with `/animus edit` or in the web editor.

## Web editor

The NPC's **Modules** section adds a schedule from **Add a known module**: it starts with one location at the block the NPC stands on, at time 1000. Each location is a form with its fields, and the list has add, move and remove buttons. The NPC browser turns `animus:schedule` on and off for several NPCs at once.

## Importing NPC Destinations

[NPC Destinations](https://www.spigotmc.org/resources/13863/) (nuNPCDestinations) keeps its locations in the Citizens save, under each NPC's `npcdestinations` trait. The [Citizens import](/animus/13-migrating-from-citizens) converts that trait into `animus:schedule`. The schedule stays off until you accept `schedules`:

```text
/animus import citizens accept schedules
```

| NPC Destinations | Animus |
|---|---|
| Location and its facing | `x`, `y`, `z`, `yaw`, `pitch`. A location in another world than the NPC's is left out with a warning |
| Time of day | `time`. A location with time -1, which only other plugins chose, is left out |
| Alias | `name`, lowercased with other characters changed to `-` |
| Chance percent | `chance`, when it is between 1 and 99 |
| Timed minimum and maximum | `staySeconds` |
| Wander distance, wait minimum and maximum | `wander.radius` (at most 32) and `wander.waitSeconds` |
| Weather (clear only, storms only) | `weather` |
| Items and clear items | `equipment` and `clearEquipment` |
| Skin with its texture | A file in `skins/` and `skin`. Without "apply on arrival" it becomes `skinOnDeparture` |
| Arrival commands | `commands` |
| Animations add-on sleep and sit | `pose: sleeping` and `pose: sitting` |
| Opens gates and wooden doors | `movement.openDoors` |
| Teleport when no path is found | `movement.stuck.teleport` |
| The older `x:y:z:time` location list | Locations in the NPC's world |

Arrival commands run only once `citizens` is in `[behaviors.actions] commandNamespaces`, which `/animus import citizens accept commands` adds; read them first. A Citizens route the NPC had is left out, because NPC Destinations walked the NPC instead.

Some settings have no Animus equivalent and stay in `modules["citizens:review"]`, each with its reason in the NPC's report: pausing for nearby players, iron doors, wandering only onto allowed blocks, the per-location Citizens pathfinder settings, and the other animations of the Animations add-on. A WorldGuard wander region is reported for review: give the location `wander.area` with the region's corners. The Sentinel and Jobs Reborn add-on settings of a location are reported as needing an integration Animus does not have.
