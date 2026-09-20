---
title: "Drop Labels"
description: "Label dropped items and render them as display-backed models"
published: true
date: 2026-09-20T03:09:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss can label dropped items and render them as display-backed models.

Open the editor with `/gloss web edit real-drops default`. Documents are schema 4.

With `[features] drops = true` (the default) every item entity that spawns gets a visible custom name built from `[drops] nameFormat`:

| Token | Replaced with |
|---|---|
| `{count}` | The stack size |
| `{type}` | The material name lowercased with underscores turned into spaces, so `DIAMOND_SWORD` becomes `diamond sword`. When `[drops] useItemDisplayNames` is explicitly enabled and item meta has a display name, that renamed value is used instead |

The default is `"&7{count}x {type}"`, giving `64x cobblestone` and `1x diamond sword` even when that sword was renamed in an anvil. Set `[drops] useItemDisplayNames = true` to show `1x Excalibur` instead. A null `nameFormat` restores the default on load; an explicit empty string stays empty.

Under `[drops]` in `gloss.toml`, `show` accepts a boolean or an expression string. Use `show = false`
to hide labels, or `show = "world.time > 12000"` to show them only after that world-time threshold.
Gloss writes normalized values as quoted expression strings, so `show = false` becomes
`show = "false"`. The condition uses each viewer and the item snapshot; the underlying item remains
present. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

## Bundles

A dropped `BUNDLE` whose `BundleMeta` carries stacks keeps a horizontal fallback name from `[drops] bundleFormat`. A merged React super-stack therefore describes its contents rather than retaining the target item that existed before the merge:

| Token | Replaced with |
|---|---|
| `{total}` | The summed amount of every stack inside the bundle |
| `{contents}` | The rendered content list |

Contents are aggregated by material. Every stack of the same type is summed into one entry. They are ordered largest amount first; ties use the material name. `[drops] bundleEntryLimit` defaults to `3` and clamps to 1 – 10. The remainder counts hidden material types, not hidden items.

With `[features] realDrops = true` and `[drops] bundleVerticalLabels = true`, the visible display is vertical. `[drops] bundleHeaderFormat`, `bundleEntryFormat`, and `bundleMoreFormat` produce:

```
Bundle (12 items)
- 5x stone
- 4x dirt
- 2x oak log
+1 more
```

A bundle with no contents, or whose stacks are all empty, falls back to `nameFormat` and is named `1x bundle`.

React super-stack bundles can supply their own label formats and entry limit.

Real Drops, standalone, and conditional labels use the temporary-hologram engine for formatting, functions, animations, viewer expressions, PlaceholderAPI, and named particle spans. Gloss does not change the `ItemStack`.

With `[drops] preserveCustomNames = true`, Gloss leaves names from other plugins unchanged. Set it to `false` to allow Gloss to overwrite them.

Labels refresh after spawns, merges, partial pickups, loads, and reloads. Removing the item removes its presentation.

## Real drops

The Real Drops document accepts `show`, defaulting to `true`. It gates the display presentation
per viewer together with `audience.when` and the selected presentation settings. It does not
remove the underlying dropped item. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

`[features] realDrops` defaults to `true`. The real item entity still controls physics, merging, pickup, and despawn. Gloss hides its vanilla model and shows `BlockDisplay` or `ItemDisplay` models instead. Landing and resting animations are available on supported 26.1.2, 26.2, and 26.3 servers.

Presentation settings live in the schema-4 file `plugins/Gloss/real-drops/default.json`. A stack shows one to five models, subject to the configured per-chunk limit and a server-wide limit of 2,048 presentations. Items above a limit keep their vanilla model and name.

The document has one complete fallback `presentation`, zero or more complete conditional `variants`, and one per-viewer `audience` condition:

```json
{
  "schemaVersion": 4,
  "revision": 1,
  "presentation": { "limits": {}, "scale": {}, "motion": {}, "landing": {}, "labels": {}, "filters": {}, "physics": {}, "script": {}, "animation": {}, "particleLayers": [] },
  "variants": [
    {
      "id": "nether-valuable",
      "priority": 100,
      "when": "drop.world == 'world_nether' && drop.amount >= 16",
      "presentation": { "limits": {}, "scale": {}, "motion": {}, "landing": {}, "labels": {}, "filters": {}, "physics": {}, "script": {}, "animation": {}, "particleLayers": [] }
    }
  ],
  "audience": {
    "when": "viewer.world == drop.world && hasPermission('viewer', 'gloss.drops.view')"
  }
}
```

The highest-priority matching variant wins; ties use the lexicographically smallest ID. Variants are complete presentations and do not inherit from the fallback. `audience.when` decides which nearby players see the Gloss presentation; other players see the vanilla item.

Selection conditions can read `drop.*`, item `subject.*`, source identity, event, world, server, time, and metrics. Audience conditions also have a live `viewer` role and can check permissions, groups, regions, and PlaceholderAPI. See [Expressions & Placeholders](/gloss/13-expressions-placeholders).

The table below uses paths relative to `presentation`; the same fields exist inside every variant presentation.

| Key | Default | Range / behavior |
|---|---:|---|
| `[features] realDrops` | `true` | Enables the complete physical presentation |
| `limits.updateIntervalTicks` | `2` | Airborne transformation cadence; 1 – 20 |
| `limits.settledPollIntervalTicks` | `20` | Grounded state and stack check; 2 – 200 |
| `limits.maxVisualsPerStack` | `3` | Item models per stack; 1 – 5 |
| `limits.maxVisualsPerChunk` | `128` | Gloss-owned item and text displays per chunk; 8 – 1024 |
| `limits.viewRange` | `32.0` | Item-model tracking range; 4 – 128 blocks |
| `limits.spread` | `0.18` | Separation of additional stack models; 0 – 1 block |
| `scale.defaultScale` | `0.4` | Ordinary three-dimensional block models; 0.05 – 2 |
| `scale.flatItems` | `0.65` | Non-block ItemDisplay models; 0.05 – 2 |
| `scale.thinBlocks` | `0.45` | Slabs, carpets, pressure plates, and snow layers; 0.05 – 2 |
| `motion.tumble` | `true` | Rotates airborne models |
| `motion.speedMultiplier` | `1.35` | Multiplies all three axis speeds; 0.1 – 4 |
| `motion.degreesPerSecondX` | `160.0` | X speed; -1440 – 1440 |
| `motion.degreesPerSecondY` | `120.0` | Y speed; -1440 – 1440 |
| `motion.degreesPerSecondZ` | `100.0` | Z speed; -1440 – 1440 |
| `motion.variance` | `0.2` | Deterministic per-item speed variation; 0 – 1 |
| `motion.changeOnBounce` | `true` | Selects another deterministic spin after an upward bounce |
| `motion.velocityInfluence` | `0.35` | Throw-speed contribution to tumble; 0 – 4 |
| `motion.submergedSpinMultiplier` | `0.35` | Angular-speed multiplier in water; 0 – 1 |
| `motion.groundRollMultiplier` | `1.0` | Rotation generated from supported travel; 0 – 4 |
| `landing.mode` | `"NATURAL"` | `NATURAL`, `FLAT`, or `UPRIGHT` |
| `landing.tiltDegrees` | `10.0` | Maximum in-face variation for stationary/rebuilt NATURAL blocks; momentum landings preserve their physical heading; 0 – 45 degrees |
| `landing.randomYaw` | `true` | Gives direct landing modes and stationary/rebuilt models a stable yaw |
| `landing.transitionTicks` | `4` | Client interpolation between continuous pose samples; 0 – 20 |
| `landing.faceAttraction` | `0.55` | Nearly-still attraction toward the stable face; 0 – 1 |
| `landing.movingFaceAttraction` | `0.15` | Face attraction retained during rolling; 0 – 1 |
| `landing.alignmentDegrees` | `0.5` | Final subvisual alignment tolerance; 0.05 – 10 degrees |
| `landing.settleDelayTicks` | `4` | Stable ticks before sparse polling; 0 – 100 |
| `labels.enabled` | `true` | Shows the effective drop name through the Gloss text engine |
| `labels.yOffset` | `0.55` | Label translation above the item; -4 – 16 blocks |
| `labels.style` | See below | Shared Gloss display style, including independent XYZ scale, billboard, alignment, opacity, lights, view range, culling, and glow |
| `labels.box` | Disabled | Shared padded background and uniform border; colors use `#AARRGGBB` |
| `filters.disabledWorlds` | `[]` | Case-insensitive world folder names that retain vanilla rendering |
| `filters.materialBlacklist` | `["BEDROCK", "BARRIER"]` | Case-insensitive material names that retain vanilla rendering |
| `filters.onlyPlayerDrops` | `false` | Requires a non-null item thrower UUID |
| `particleLayers` | `[]` | Layers targeting the whole projection, model, label, line, span or local geometry |

An omitted `labels.style` uses center billboard, glyph shadow, see-through, center alignment, background `#50000000`, opacity 255, line width 16384, view range 0.5, and scale 0.85 on each axis. Display-style view range is a native multiplier: 0.5 corresponds to 32 blocks. Fields omitted from an explicitly supplied style use the shared display defaults. See [Icons](/gloss/11-icons) for field ranges.

`labels.box` accepts `enabled`, `padding` (0–64 font pixels), `borderWidth` (0–16 font pixels), `backgroundArgb`, and `borderArgb`. A visible box uses up to five extra display parts. The Real Drops chunk budget reserves the label and its maximum box parts; personalized boxes are sent only to their viewer. The box follows the item, label scale, billboard, and audience; it is removed with the label. Ordinary Gloss-owned drop names also use the shared style and box when Real Drops models are disabled. Externally authored item names remain subject to `preserveCustomNames`.

Labels retain their authored functions, viewer expressions, and named particle spans. Viewer-dependent formats keep a literal count/type name on the underlying item; their authored text is evaluated only for the player viewing the label. Label particles use the label's vertical offset and the configured global particle range; a larger display view range does not increase the particle range.

The editor's **Presentation** selector edits the default or any conditional variant with the same forms, including display style, box, particles, physics, script, and animation. On the drop stage, a cube draws the block's real model and a flat item draws the item's extruded texture, both over the rendered world.

`NATURAL` keeps the airborne rotation and settles the nearest face toward the ground. Partial blocks are positioned against their actual bounds instead of intersecting the surface.

### `physics`

| Key | Default | Range | Meaning |
|---|---:|---|---|
| `enabled` | `false` | Not applicable | Permit Gloss to modify the authoritative item entity |
| `gravityMultiplier` | `1.0` | 0 – 4 | Gravity scale; `0` clears vertical velocity and gravity while active |
| `bounce` | `0.0` | 0 – 0.9 | Restitution applied from the measured downward impact speed |
| `waterBuoyancy` | `0.0` | 0 – 1 | Additional upward velocity while submerged |
| `waterDrag` | `0.0` | 0 – 1 | Fraction of velocity removed per submerged tick |

### `animation`

`animation.enabled` turns on ordered animation profiles. Each profile has an `id`, a `priority`, a material glob list, and clips. Higher priority matches first.

A clip has a `trigger`, `durationTicks`, `loop`, and ordered tracks. Triggers are `SPAWN`, each runtime phase, and `IMPACT`, `BOUNCE`, `ENTER_FLUID`, `EXIT_FLUID`, `START_ROLL`, `SETTLE`, `WAKE`. Targets are `OFFSET_X/Y/Z`, `ROTATION_X/Y/Z`, `SCALE_X/Y/Z`, `GLOW`, `VISIBLE`, `PHYSICS`, and `LIGHT_LEVEL`. Keyframes take a `tick`, a `value`, an optional `materialMap`, and `LINEAR`, `HOLD`, `EASE_IN`, `EASE_OUT`, `EASE_IN_OUT` or `BACK_OUT` easing. `REPLACE` works on every target, `ADD` on offsets and rotations, `MULTIPLY` on scales.

`animation.materialProperties` maps materials or globs to a `glow` ARGB and a `lightLevel` of 0-15. Temporary light blocks use air only, at most eight per chunk.

### `script`

The optional modifier compiles expression-driven `offset`, `rotation`, `scale`, `glow` and `visible` outputs, with `phase`, `stateTime` and `impactSpeed` available alongside the motion, fluid, material and stack inputs. It composes over the animation timeline: offsets and rotations add, scales multiply, and a non-zero script glow wins. Scripted offsets are visual only — the pickup entity does not move.

A label goes away with the item it belongs to, however the item goes away. Nothing is persisted.

Disabling `drops` removes Gloss-owned labels. Disabling `realDrops` removes display models and restores vanilla item visibility. When drop labels remain enabled, the item keeps its styled standalone label, including viewer expressions and its configured box. The config and presentation document reload automatically. See [Particle Layers](/gloss/25-particle-layers).

## Reference

| Command | Arguments | Permission |
|---|---|---|
| `/gloss drops reset` | `[name=*]` | `gloss.drops.reset` |

Optional arguments must be written as `key=value`. The reset overwrites matching included `real-drops/` documents without deleting extra ones.

Real Drops documents are schema 4. Changes apply live; an invalid file is logged and the
last valid version stays active. See [Data Files & Hot Reload](/gloss/03-data-files).

See also [Chat Bubbles](/gloss/08-chat-bubbles) and [Damage Indicators](/gloss/08b-damage-indicators).
