---
title: "Animus: Performance Recordings"
description: "Recording a player's movement and replaying it on an NPC: files, capture commands, the ghost, playback and settings"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, recordings, playback, navigation, ghost"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

A performance recording is a stretch of a player's movement saved to a file: where they walked, where they looked, when they sneaked, sprinted, swam, glided or jumped, when they swung their arm, what they held and which doors they opened. An NPC replays it through the `animus:navigation` module the way it would follow a route, so a market vendor can pace behind a stall, check a door and wave at customers without a single waypoint.

Recordings move NPCs through the same collision checks as [routes](/animus/05-movement-mounts-riding#routes). Animus never loads or generates a chunk to play one.

## The recording file

Each recording lives at `recordings/<id>.json` in the data folder. The id uses 1-64 lowercase letters, digits, `_` or `-`, starts with a letter or digit, and must match the file name.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "market-loop",
  "recordedBy": "8667ba71-b85a-4004-af54-457a9734eed7",
  "world": "world",
  "origin": {"x": 100.5, "y": 64, "z": -20.5, "yaw": 90, "pitch": 0},
  "sampleTicks": 2,
  "durationTicks": 80,
  "frames": [
    [0, 0, 0, 0, 90, 0, 1],
    [20, 1.5, 0, 0.25, 92.5, -3, 5],
    [40, 3.2, 0, 0.1, 179.5, -3, 5],
    [60, 3.2, 0.42, 0.1, -175.5, 10, 33],
    [80, 0, 0, 0, 90, 0, 1]
  ],
  "events": [
    {"tick": 0, "type": "equipment", "slot": "main_hand", "item": {"id": "minecraft:iron_sword"}},
    {"tick": 20, "type": "swing"},
    {"tick": 40, "type": "use", "x": 104, "y": 64, "z": -18, "block": "minecraft:oak_door"},
    {"tick": 60, "type": "equipment", "slot": "main_hand", "item": null}
  ]
}
```

| Field | Meaning |
|---|---|
| `schemaVersion` | Always `1` |
| `revision` | Starts at 1 and goes up with each save, like other documents |
| `id` | The recording's id, matching the file name |
| `recordedBy` | UUID of the player who recorded it |
| `world` | The world it was recorded in: its Bukkit world name, or a dimension key such as `minecraft:the_nether`. A world UUID is also accepted, but only works on the server that made it. A recording plays only for NPCs in that world; when the world is not loaded, the NPC reports why in `route-error` and does not play it |
| `origin` | `x`, `y`, `z`, `yaw` and `pitch` where the recording started. Frame positions are relative to it |
| `sampleTicks` | 1-20 ticks between two captured frames |
| `durationTicks` | The tick of the last frame, at most 72000 |
| `frames` | The movement, at least 2 frames (see below) |
| `events` | Arm swings, equipment changes and door uses, at most 4096 |

### Frames

Each frame is a compact array with no keys: `[tick, dx, dy, dz, yaw, pitch, flags]`.

- `tick` counts from the start of the recording. The first frame is tick 0, the last is `durationTicks`, and each frame's tick is higher than the one before.
- `dx`, `dy` and `dz` are the position relative to `origin`, rounded to 0.01 blocks.
- `yaw` (-360 to 360) and `pitch` (-90 to 90) are the absolute look direction, rounded to 0.5 degrees.
- `flags` adds up the states that were on at that moment:

| Flag | State |
|---:|---|
| 1 | On the ground |
| 2 | Sneaking |
| 4 | Sprinting |
| 8 | Swimming |
| 16 | Gliding |
| 32 | Jumping |

So `5` means on the ground and sprinting, and `33` means on the ground and jumping. Between two frames the NPC moves smoothly from one pose to the next.

### Events

Events are objects sorted by `tick`, then by `type`. No event may come after `durationTicks`.

| Type | Fields | Meaning |
|---|---|---|
| `swing` | `tick` | The main arm swung |
| `equipment` | `tick`, `slot`, `item` | A slot changed. `slot` is `main_hand`, `off_hand`, `head`, `chest`, `legs` or `feet`. `item` has `id` and optional `count` (1-99) and `components`, the same shape as definition items, or is `null` when the slot was emptied |
| `use` | `tick`, `x`, `y`, `z`, `block` | The recorder opened or closed the door, fence gate or trapdoor at that block |

Nothing else is recorded: other right-clicks, block breaking, chat and inventory moves are left out.

### Limits

- A recording holds at most `durationTicks / sampleTicks + 1` frames and 4096 events.
- The file may be at most `[recordings] maximumFileBytes` (1 MiB by default). A larger file is refused without being read.
- An invalid file is reported with its field, and NPCs keep the last valid version.

### How files are saved

Animus writes recordings in a fixed layout: keys in the order shown above, one frame per line, one event per line and numbers without trailing zeros. Reading a file Animus wrote and saving it again gives the same bytes, so a recording that has not changed never shows up as changed in hotload, backups or version control.

Before saving, Animus drops frames that add nothing. A frame is left out when its pose lies within 0.02 blocks and 2 degrees of the straight line between its neighbours and no flag changes. A frame is always kept at every event and at every flag change. A player who stands still for ten seconds therefore costs two frames, not a hundred.

Saves go through the same document store as definitions and routes, so hotload, [web editor](/animus/14-web-editor) undo and [rollback](/animus/12-storage-recovery) all see them.

## Recording a performance

```none
/animus record start <id>
/animus record stop
/animus record cancel
/animus record status
/animus record ghost on|off
/animus record preview <id> [stop]
```

All of them need `animus.admin`. Every command except `status` must be run by a player.

| Command | Effect |
|---|---|
| `record start <id>` | Starts recording you as `recordings/<id>.json`. Your current position becomes the origin |
| `record stop` | Ends the recording and saves it |
| `record cancel` | Ends the recording and throws it away |
| `record status` | Shows who is recording, for how long and how many frames are captured |
| `record ghost on\|off` | Shows or hides your ghost while you record |
| `record preview <id> [stop]` | Plays a saved recording to you as a ghost. `stop` ends the preview early |

While recording, Animus reads your position, look direction, ground contact, sneaking, sprinting, swimming, gliding and jumps every `sampleTicks` ticks. It also notes each arm swing, each change to your hands and armour, and each door, fence gate or trapdoor you open or close with a right-click. At most `maximumSessions` players record at once.

A recording ends and saves when you run `record stop` or when it reaches `maximumTicks` (12000 ticks, 10 minutes, by default). It also ends and saves what it has, and tells you why, when you:

- quit,
- die,
- change world,
- or are teleported more than 8 blocks at once. An NPC cannot teleport mid-performance, so a jump like that cannot be replayed.

A recording shorter than 20 ticks is thrown away instead of saved. When the saved file would be larger than `maximumFileBytes`, the save is refused with the size and the recording stays open: raise the limit and run `record stop` again, or `record cancel`.

## The ghost

The ghost is a copy of the recorder that only the recorder can see. Nobody else receives it, and it never becomes a real entity, so it cannot be hit, does not block anything and does not show in the tab list. It wears the recorder's skin (a player without a signed skin, such as on an offline-mode server, gets a plain body) and has no nameplate. When `ghostGlow` is on it glows in `ghostColor`. Player bodies cannot be made see-through, so the glow is what marks it as a ghost.

While you record with the ghost on, every `ghostIntervalTicks` ticks the ghost appears where you were `ghostStretchTicks` ticks ago and replays that stretch at the speed you moved, walking behind you, then disappears. Use it to check how a movement reads from outside while you are still recording. Each recorder has one ghost, so when a replay is still running at the next interval, that interval is skipped.

`/animus record preview <id>` plays a saved recording once, at the place it was recorded, as a ghost only you can see, then removes it. Each player can run one preview at a time and at most `maximumPreviews` run at once. A preview also ends when you quit, die, change world, teleport, lose `animus.admin`, or the server stops.

## Playing a recording on an NPC

A recording is a movement source of the `animus:navigation` module, alongside a `route` reference and inline `points`:

```json
"modules": {
  "animus:navigation": {"enabled": true, "recording": "market-loop", "playback": "loop"}
}
```

`recording` cannot be combined with `route` or `points`; a module that sets more than one of them is refused.

| `playback` | Effect |
|---|---|
| `once` | Plays the recording one time and stops at the last frame |
| `loop` (default) | Starts again from the first frame after the last |
| `pingpong` | Plays forward, then backward, then forward again, forever |

For a clean `loop`, end the recording close to where you started it.

### From a behavior

[Behaviors](/animus/07-behaviors) start and stop recordings with these actions:

| Capability | Arguments | Result |
|---|---|---|
| `animus:play-recording` | `recording` (an id under `recordings/`), optional `playback` (`once`, `loop`, `pingpong`), `wait`, and with it `timeoutTicks` (20-12,000, default 1,200) | Plays the recording on the NPC. Completes when started unless `wait` is true. `wait` needs `playback: once` |
| `animus:resume-patrol` | None | Starts the NPC's declared route or recording again, continuing from where it was interrupted. Reports `resumed`, or `nothing-to-resume` when the NPC has no declared route or recording |
| `animus:stop-navigation` | None | Stops a playing recording like any route |

With `wait`, the action completes at the last frame and fails with the same codes as [walking a patrol](/animus/07-behaviors#walking-a-patrol). A loop or pingpong never reaches an end, which is why `wait` is refused with them.

`animus:resume-patrol` lets a behavior stop an NPC for a conversation and send it back to work afterwards:

```json
{"type": "sequence", "steps": [
  {"type": "action", "capability": "animus:stop-navigation"},
  {"type": "action", "capability": "animus:say", "arguments": {"text": "Fresh bread, just out of the oven!"}},
  {"type": "wait", "ticks": 60},
  {"type": "action", "capability": "animus:resume-patrol"}
]}
```

## How playback behaves

**Walking in.** The NPC first walks to the recording's first frame on a normal planned path at 4 blocks a second, or at its own `movement.speed` when the [movement settings](/animus/05-movement-mounts-riding#movement-settings) set one. An NPC already standing on the frame starts at once. From there it plays one recording tick per server tick, so the performance runs at the speed it was recorded.

**Terrain.** Every step is checked against real blocks, like a route step. When a step is refused because the terrain changed, the body would stand inside a block or it has nothing to stand on, the NPC switches to catching up: it walks a planned path to its pose 40 ticks further on and continues the recording from there. If that spot cannot be reached either, it tries 40 ticks further, up to five times. A walk counts as unreachable when it fails to plan or takes longer than three times the straight walk plus ten seconds.

**Stuck.** After five failed catch-ups, the definition's `movement.stuck` rules apply. With `stuck.teleport` on, the NPC is placed at the frame and the performance continues. Otherwise the playback is blocked and tries to catch up again after 100 ticks. A `once` playback that becomes blocked ends there.

**Unloaded terrain.** When the next frame is in a chunk that is not loaded, the playback pauses as unavailable and continues once the chunk loads.

**Sleeping.** With no player near, a playback sleeps like a [patrol](/animus/05-movement-mounts-riding#how-many-routes-run): it holds its place in the recording and continues when a player comes near. Playbacks take turns within the same `[navigation]` budgets as routes.

**Poses.** Sneaking, swimming and gliding frames put the NPC in that pose, and sprinting frames show it sprinting. Every viewer sees the same pose.

**Events.** Arm swings play as swings. Equipment changes show on the NPC the way `animus:set-equipment` shows them, without editing the definition. Door uses open and close the door after protection allows it (WorldGuard's `use` flag on Bukkit and any module protection hook); a refused door stays as it is and the performance carries on. At most 8 events run per NPC per tick, and the rest run on the next tick.

### Interruptions and resuming

Combat, `/animus navigate` and `/animus navigation stop <id>` stop a playback the same way they stop a route, but the NPC remembers where it was in the recording. When combat releases the NPC, or a behavior runs `animus:resume-patrol`, the performance continues from that point instead of from the start.

Changing the NPC's definition or the recording file starts the performance again from the first frame. Editing a recording applies within about a second, like any [hotloaded](/animus/03-configuration#live-apply) file; every NPC playing it picks up the new version.

### Inspecting a playback

`/animus inspect <id>` shows the playback:

```none
recording=market-loop playback=loop cursor=420/1180 state=playing
```

`cursor` is the current tick and the recording's length. `state` is one of:

| State | Meaning |
|---|---|
| `playing` | Performing frame by frame |
| `walking-in` | Walking to the first frame |
| `catching-up` | Walking ahead after a refused step |
| `blocked` | Stuck, retrying after 100 ticks |
| `unavailable` | Waiting for the next frame's chunk to load |
| `sleeping` | No player near |
| `stopped` | Stopped by combat, a manual route or `navigation stop`; the cursor is kept for resuming |
| `finished` | A `once` playback reached its last frame |

A missing or invalid recording is shown as `route-error=` with the reason. The NPC keeps playing its last valid recording, or stands at its position when it never had one. With `recordings.enabled = false`, NPCs with a recording stand still and show `route-error=recordings are disabled in config.toml`.

### Recording steps in routes

A [route](/animus/05-movement-mounts-riding#routes) point can play a segment of a recording instead of naming a position, so a patrol can walk to the bakery, perform the recorded stretch of kneading and serving, and walk on:

```json
{"recording": "market-loop", "fromTick": 120, "toTick": 520, "playback": "once"}
```

`fromTick` defaults to 0, `toTick` to the recording's `durationTicks`, and `playback` can only be `once`. When the route reaches the step, the NPC walks a planned path to the segment's first frame, plays ticks `fromTick` to `toTick` with every rule on this page (catch-up, the stuck rules, events, sleeping and unloaded chunks), and goes on to the next point from where the segment ends. The step's `waitTicks` applies after it, as after any point, and the `waypoint` trigger reports the step's index when the segment has played.

A route reads each recording its steps name once when the route loads, within `maximumFileBytes`, and keeps them while the route runs. Editing one of those recordings restarts a step that is playing it from `fromTick`. A recording that cannot be read, was made in another world, or ends before `toTick` blocks the step with `route-error=recording step <index>: <reason>`, and the route's usual failure rules apply: a `sequence` or `pingpong` route stops, a `random` route waits and picks again. A step that becomes blocked while playing does the same.

Combat, `/animus navigate` and `navigation stop` stop a step the way they stop any playback, and `animus:resume-patrol` continues it from where it stopped, then carries on with the route. While a step plays, `/animus inspect <id>` shows it:

```none
step=recording:market-loop cursor=318/520 state=playing
```

## Folia

Recording and the ghost run on the recorder's region; a ghost belongs to its player and never crosses regions. A playback runs on the region that owns the NPC. When the NPC walks into a chunk another region owns, its place in the recording, the playback mode and direction move with it in the same handoff as route progress. The new region plans the walk to the current pose from where the NPC stands, then carries on; a route step keeps its segment, so it still ends on `toTick`. A handoff that times out or reaches an unloaded chunk waits as it does for a route. See [Folia](/animus/15-folia).

## [recordings] settings

These keys live in `config.toml`. Every key applies live; lowering a cap lets recordings and previews already running finish.

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | | `false` refuses `record`, previews and `animus:play-recording` as unavailable, and removes ghosts |
| `sampleTicks` | `2` | 1-20 | Ticks between two captured frames |
| `maximumTicks` | `12000` | 200-72000 | The longest a recording session captures before it saves |
| `maximumFileBytes` | `1048576` | 65536-4194304 | The largest recording file read or saved |
| `maximumSessions` | `4` | 1-16 | Players recording at once |
| `ghostEnabled` | `true` | | Show ghosts at all |
| `ghostIntervalTicks` | `100` | 40-1200 | Ticks between two ghost replays while recording |
| `ghostStretchTicks` | `100` | 20-600 | How far behind the recorder a ghost replay starts |
| `ghostGlow` | `true` | | Make the ghost glow |
| `ghostColor` | `aqua` | One of the sixteen chat colours | The ghost's glow colour, such as `aqua` or `gold` |
| `maximumPreviews` | `8` | 1-32 | `record preview` ghosts at once |

## Example: a looping market vendor

1. Stand behind the stall where the vendor should start and run `/animus record start market-loop`.
2. Walk the performance: pace to the crates, pick up a sword, swing it, open the shop door, and walk back to where you started. A glowing ghost follows a few seconds behind so you can watch the movement.
3. Run `/animus record stop`. The file is saved as `recordings/market-loop.json`.
4. Run `/animus record preview market-loop` to watch it once from outside.
5. Add the recording to the vendor's definition:

```json
"modules": {
  "animus:navigation": {"enabled": true, "recording": "market-loop", "playback": "loop"}
}
```

The vendor walks to the first frame and repeats the performance for as long as players are nearby. To try a different take, record again under the same id; the vendor restarts with the new version.
