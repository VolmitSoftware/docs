---
title: "Animus: Rigs and Animations"
description: "Bone rigs, keyframe animations, playback commands, resource pack layout and sampling rules"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, rigs, animations, resource-pack, blockbench"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

A rig is a tree of bones shown on an NPC's body with packet-only item, block and text displays. Animations move those bones with keyframes. Rigs are cosmetic: hits always use the body's hitbox.

## Using a rig

A definition with `"rig": {"id": "town:golem"}` shows the rig at `rigs/town/golem.json`. Animations live at `animations/<namespace>/<path>.json`. The schemas are `schema/rig-v1.schema.json` and `schema/animation-v1.schema.json` in the Animus repository.

Player bodies keep their vanilla body. A rig with `"body": "shown"` adds its parts to the body; `"body": "hidden"` (the default) makes the body invisible while it keeps the hitbox.

Each visible bone rides the body in its passenger list, so it follows movement without teleports. The server plans the animation in segments and sends each changed bone's transform once per segment, and the client interpolates between them. Segments start at `sampleTicks` and grow up to 20 ticks while every bone moves in a straight line within 0.01 blocks and 0.5 degrees. A turn of the body starts a new segment at once. Bones are removed with the body, when the viewer leaves and at shutdown.

## Rig documents

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "town:golem",
  "units": "blocks",
  "body": "hidden",
  "bones": [
    {"id": "root", "pivot": [0, 0, 0]},
    {"id": "torso", "parent": "root", "pivot": [0, 1.1, 0],
     "visual": {"type": "item", "item": {"id": "minecraft:paper", "components": "[item_model=\"animus:golem/torso\"]"},
                "translation": [0, 0.3, 0], "scale": [1, 1, 1]}},
    {"id": "head", "parent": "torso", "pivot": [0, 1.6, 0], "rotation": [0, 0, 0],
     "visual": {"type": "block", "block": "minecraft:carved_pumpkin", "scale": [0.6, 0.6, 0.6]}},
    {"id": "label", "parent": "head", "pivot": [0, 2.1, 0],
     "visual": {"type": "text", "text": "&6Golem", "billboard": "center"}}
  ],
  "sockets": {"main_hand": "torso"},
  "animations": {"idle": "town:golem/idle", "walk": "town:golem/walk"}
}
```

- `body`: `hidden` or `shown`, as above.
- Visual types: `item` (any item, including `item_model` and `custom_model_data` from a resource pack), `block` (any block state), `text` (a text display) and `none` for pivot-only bones. A visual may set its own `translation`, `rotation` and `scale`.
- `sockets` attach equipment slots to bones. The NPC's item in a socketed slot (from its definition, `animus:set-equipment` or a recording) shows on that bone and follows its animation, and the body no longer shows it. Main and off hand items are posed as held in the right and left hand, head items as worn on the head, and other slots as fixed items. An empty slot shows nothing, and a hidden bone hides its item.
- `animations` names the rig's clips. `idle` and `walk` are played automatically; see [playback](#playback).
- Limits: 64 bones per rig, depth 16, 256 KiB per document. Bone ids must be unique and parents are listed before their children.

## Animation documents

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "town:golem/walk",
  "rig": "town:golem",
  "durationTicks": 20,
  "loop": "loop",
  "tracks": [
    {"bone": "torso", "target": "rotation", "blend": "replace",
     "keyframes": [
       {"tick": 0,  "value": [0, 0, -4], "easing": "ease_in_out"},
       {"tick": 10, "value": [0, 0, 4],  "easing": "ease_in_out"},
       {"tick": 20, "value": [0, 0, -4]}
     ]},
    {"bone": "head", "target": "translation", "blend": "add",
     "keyframes": [{"tick": 0, "value": [0, 0, 0]}, {"tick": 5, "value": [0, 0.05, 0], "easing": "back_out"}]}
  ]
}
```

- Targets: `rotation` (Euler degrees, applied X then Y then Z), `translation`, `scale`, `visible`.
- Blends: `replace`, `add`, `multiply`.
- `loop`: `once`, `loop`, `pingpong`, `hold` (stay on the last frame).
- Easings: `linear`, `hold`, `ease_in`, `ease_out`, `ease_in_out`, `back_out`, `bezier(x1,y1,x2,y2)`. These match Gloss clip easings.
- Keyframe ticks strictly increase and stay within `durationTicks`, and every track names a bone of the rig.
- Limits: 1,200 ticks, 64 tracks, 256 keyframes per track.
- `events`: up to 256 entries of `{"tick": 10, "capability": "animus:play-sound", "arguments": {...}}`. Only `animus:play-sound` and `animus:spawn-particle` run here, with the same arguments and checks as in [behaviors](/animus/07-behaviors). See [animation events](#animation-events).

## Loading and playback

Rigs and animations load at startup, on save (see [hand edits apply live](/animus/04-npc-definitions#hand-edits-apply-live)), on `/animus reload` and on `/animus rigs reload`. A broken or refused edit keeps the last valid document, and a changed document needs a higher `revision`. After a restart the last valid copy comes from `state/rig-catalog/`.

```text
/animus rigs status
/animus rigs problems [page]
/animus rigs reload
/animus rigs play <npc> <animation> [layer=0] [speed=1] [loop=default]
/animus rigs stop <npc> [layer] [fadeTicks]
```

`status` and `problems` show what was loaded and what was refused. `play` and `stop` test clips. There are 4 layers (0-3); speed is 0.25-4, `loop` is `once`, `loop`, `pingpong` or `hold`, and `fadeTicks` is 0-40. Higher layers blend over lower ones by each track's `blend`.

### Playback

Layer 0 plays the rig's `idle` clip, and `walk` while the NPC follows a route, unless a played clip uses that layer. Behaviors use [`animus:play-animation` and `animus:stop-animation`](/animus/07-behaviors) and the `animation_finished` trigger:

| Capability | Arguments | Result |
|---|---|---|
| `animus:play-animation` | `animation`, optional `speed` (0.25-4), `loop` override, `layer` (0-3) | Starts the clip on that layer |
| `animus:stop-animation` | Optional `layer`, optional `fadeTicks` (0-40) | Stops the layer and returns to the rig's `idle` clip |

### Animation events

An event runs when its clip reaches the event's tick, at the clip's speed. Every playing layer runs its events, the `idle` and `walk` clips included:

- `loop` clips run each event once per cycle, and `pingpong` clips on the way out and on the way back.
- `once` and `hold` clips run each event once; an event on the last tick runs before the clip ends.
- A clip that is stopped, or fading out after `animus:stop-animation`, runs no more events.
- After a pause, such as an NPC that was asleep, each event of a looping clip runs at most once.
- One NPC runs at most 16 events per tick.

Events play at the NPC to nearby players, 16 blocks unless `radius` is set. An animation has no triggering player, so `player`, `at: player` and `audience: trigger` are refused. Events count against the `[behaviors.actions]` limits like any action. An event that cannot run, such as an unknown sound, is skipped and logged once.

## Settings

| `[rigs]` setting | Default | Range |
|---|---:|---|
| `enabled` | `true` | Boolean |
| `maximumBones` | 512 | 1-4096 bones shown per viewer |
| `updatesPerTick` | 64 | 1-512 bone transform packets per viewer per tick |
| `sampleTicks` | 2 | 1-20 ticks, the shortest segment |
| `plansPerTick` | 64 | 1-1024 NPCs that plan a segment per tick (per region on Folia) |

A viewer short of budget receives the newest transforms on later ticks with the interpolation time that is left. Bone updates are cosmetic and give way to despawns, moves and spawns when the packet budget is short; see [work and visibility limits](/animus/04-npc-definitions#work-and-visibility-limits).

## Resource pack layout

Bones that show vanilla items and blocks need no resource pack. A custom bone shows `minecraft:paper` with `item_model="animus:<rig path>/<bone>"`, where the rig path is the rig id after its colon (`town:golem` gives `animus:golem/head`). Pack sources live in the data folder under `pack/assets/`, laid out like a resource pack's `assets/` folder:

| Data-folder path | Contents |
|---|---|
| `pack/assets/animus/items/<rig path>/<bone>.json` | Item definition: `{"model": {"type": "minecraft:model", "model": "animus:item/<rig path>/<bone>"}}` |
| `pack/assets/animus/models/item/<rig path>/<bone>.json` | The bone's cubes as an item model, centred on the bone's pivot at (8, 8, 8) and shrunk to the -16..32 model bounds when needed; the bone's visual `scale` makes up the difference |
| `pack/assets/animus/textures/item/<rig path>/<texture>.png` | Embedded Blockbench textures |

The [web editor](/animus/14-web-editor)'s Blockbench import and its Download server files button write exactly these files; unzip an exported `<rig>-server-files.zip` into the data folder and run `/animus pack build`. The editor's import also keeps Blockbench sound keyframes that name a vanilla sound as `animus:play-sound` events, and keeps both values of a two-value keyframe as two keyframes a thousandth of a tick apart.

### Blockbench models on the server

The server also reads `models/<namespace>/<name>.bbmodel` and converts each into rig `namespace:name` with the same rules as the editor:

- Every group becomes a bone.
- A cube rotation that is not on one axis in 22.5-degree steps up to 45 degrees becomes a bone of its own.
- The model turns 180 degrees to face +Z: pivots become `(-x, y, -z) / 16` and rotations `(-x, y, -z)`. Item displays turn their models back.
- Each Blockbench animation becomes an animation document.

Only embedded PNG textures are read, and nothing is downloaded. Models over 16 MiB, more than 64 models, 64 bones, 4,096 cubes, 16 textures, textures over 4 MiB or 1,024 pixels wide, 64 animations, 256 keyframes per channel or 16,384 source files are refused. Molang keyframe values play as 0, and `catmullrom` and `bezier` keyframes play as `ease_in_out`.

### Building the pack

```text
/animus pack build
```

This writes:

- `pack/out/animus-rigs.zip`: a resource pack with `pack.mcmeta`, every file under `pack/assets/` (as `assets/...`) and the files made from `models/`. A file already under `pack/assets/` wins over one made from a model.
- `pack/out/animus-rigs.zip.sha1`: the zip's SHA-1.
- `pack/out/pack/`: the same files as a folder, for merging into an existing server pack.
- `pack/out/documents/`: rigs and animations made from models. Copy them into `rigs/` and `animations/`.

The zip holds stored entries in sorted path order, each dated 1980-01-01 00:00, so the same files always give the same bytes and the same hash. `pack.mcmeta` is `{"pack": {"description": "Animus rig models", "min_format": 84, "max_format": 97}}`, covering 26.1.2 (84), 26.2 (88) and 26.3 (97).

Animus does not host the pack. Serve the zip through your own resource pack URL, or merge the folder into the pack your server already sends.

## Animation sampling

The server and the web editor sample animations with the same rules, so the editor timeline shows what players see. Reference samples in `schema/fixtures/animation/samples/` match within 0.0001 for translations, scales and matrix entries and 0.01 degrees for rotations.

1. **Playback time.** A layer plays a clip at `speed`. At `t` ticks after it started, clip time comes from `t * speed` and the clip's duration `D` (below, `t` stands for `t * speed`):
   - `once` and `hold`: `min(max(t, 0), D)`. They differ only after the end: `once` ends the layer, `hold` keeps the last pose.
   - `loop`: `t - D * floor(t / D)`.
   - `pingpong`: `p = t - 2D * floor(t / 2D)`, then `p` if `p <= D`, else `2D - p`.
2. **Track value.** At or before the first keyframe the value is the first keyframe's value; at or after the last, the last one's. Between keyframes `a` and `b`, `u = (time - a.tick) / (b.tick - a.tick)` and the value is `a + (b - a) * ease(u)` per component, using `a`'s easing (default `linear`). `visible` tracks step: the value is `a`'s.
3. **Easings,** with `u` clamped to 0..1:
   - `linear`: u
   - `hold`: 0
   - `ease_in`: u^3
   - `ease_out`: 1 - (1 - u)^3
   - `ease_in_out`: 4u^3 below 0.5, else 1 - (-2u + 2)^3 / 2
   - `back_out`: 1 + 2.70158 s^3 + 1.70158 s^2 with s = u - 1
   - `bezier(x1,y1,x2,y2)`: the CSS cubic Bezier from (0,0) to (1,1); solve x(s) = u for s and return y(s)
4. **Channels.** Every bone starts each sample with rotation (0,0,0), translation (0,0,0), scale (1,1,1) and visible true. Layers apply in order, and within a clip tracks apply in document order: `replace` sets the channel, `add` adds per component, `multiply` multiplies per component. `visible` always replaces. Animation channels are relative to the rest pose.
5. **Bone transform.** With `R(e) = Rz(e.z) * Ry(e.y) * Rx(e.x)` (Euler degrees, X applied first, right-handed, column vectors), a bone's local transform is `T(pivot - parentPivot) * T(translation) * R(restRotation) * R(rotation) * S(scale)`, with parent pivot (0,0,0) for bones without a parent. Its model transform is the parent's model transform times the local one. Bones without a parent start from `Ry(-yaw)`, the body yaw in Minecraft degrees (0 faces +Z, 90 faces -X). A bone is visible when it and every ancestor are visible.
6. **Visual transform.** A visual's display transform is `model * T(visual.translation) * R(visual.rotation) * S(visual.scale)`. Display entities take it as translation, left rotation, scale and right rotation; any decomposition that reproduces the matrix is correct, so the reference samples record the matrix (12 numbers, rows of `[r0 r1 r2 t]`).

The server's segment merging (2-tick samples merged while linear within 0.01 blocks and 0.5 degrees) is built on these rules and only affects how often transforms are sent.
