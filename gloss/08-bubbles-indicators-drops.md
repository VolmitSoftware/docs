---
title: "Chat Bubbles, Indicators & Drops"
description: "Configure chat bubbles, health indicators, drop labels, and display-backed items"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss can show chat above players, health changes beside entities, labels above drops, and display-backed item models.

Use `/gloss web edit bubble-style <id>`, `/gloss web edit real-drops default`, or `/gloss web edit damage-indicators default` to open a focused editor.

## Chat bubbles

### Style documents

Each JSON file in `plugins/Gloss/bubbles/` defines one bubble style. Gloss restores a missing `default.json` while chat bubbles are enabled.

`plugins/Gloss/bubbles/default.json` by default:

```json
{
  "schemaVersion": 4,
  "revision": 1,
  "prefix": "&7",
  "offset": [0, 0.3, 0],
  "wordWrapChars": 32,
  "maxAliveMs": 5000,
  "followPlayer": true,
  "hideOwn": true,
  "motion": {
    "translation": {
      "x": "0",
      "y": "10 * pow(clamp((ageMs - lifetimeMs + 2000) / 2000, 0, 1), 16)",
      "z": "0"
    },
    "scale": {"x": "1", "y": "1", "z": "1"},
    "rotation": {"x": "0", "y": "0", "z": "0"},
    "opacity": "1"
  },
  "shimmer": {
    "spawn": true,
    "flyAway": true,
    "color": "#ffffff",
    "width": 3,
    "durationMs": 700,
    "spawnDelayMs": 400,
    "flyAwayLeadMs": 700
  },
  "particleLayers": []
}
```

| Key | Default when absent | Clamp / notes |
|---|---|---|
| `schemaVersion` | required | Must be `4`. Any other version is silently ignored |
| `revision` | required | `1` to `9007199254740991` |
| `prefix` | `"&7"` | Configured text prepended to the already-formatted chat message. `null` or absent becomes `"&7"`. An explicit `""` stays empty |
| `offset` | `[0.0, 0.3, 0.0]` | Literal `[x, y, z]` added to the speaker's eye position before stack and motion translation. There is no hidden base lift. The full offset remains applied while a bubble follows its speaker |
| `wordWrapChars` | `0` clamped to `8` | Visible characters per wrapped row. Color and format codes do not consume the width. Clamped to `8`..`128` |
| `maxAliveMs` | `0` clamped to `500` | Milliseconds a bubble lives. Clamped to `500`..`60000` |
| `followPlayer` | `false` | When true the bubble tracks the speaker. When false it stays where it spawned |
| `hideOwn` | `false` | When true the speaker cannot see their own bubbles |
| `motion` | default late-fly motion shown above | Expression-driven translation, scale, rotation and opacity over the bubble lifetime; see below |
| `shimmer` | default shine shown above | One solid white three-glyph wave crosses the complete wrapped message after a short delay, then crosses it again during fly-away; see below |
| `select` | absent | Auto-match rules, see below. Absent means the style never auto-matches |
| `particleLayers` | `[]` | Up to 64 layers attached to the one multiline temporary hologram |

Write `followPlayer` and `hideOwn` explicitly because an omitted value is `false`. Bubble movement belongs in `motion`; `shimmer.flyAway` controls only the shine pass.

There is no config table for bubble styles. `gloss.toml` carries exactly one bubble knob, `[chatBubbles] blacklistWorlds` (default `[]`). That is a list of world folder names matched exactly and case-sensitively. A speaker in a listed world produces no bubbles at all.

### The `select` block

```json
"select": {
  "priority": 10,
  "when": "subject.world == 'survival' && oneOf(subject.group, ['vip', 'admin'])"
}
```

| Key | Notes |
|---|---|
| `priority` | Integer, default `0`. Higher wins |
| `when` | Required boolean condition evaluated with the speaker as `subject`; see [Expressions & Placeholders](/gloss/13-expressions-placeholders) |

The condition can use the speaker, world, permissions, groups, regions, PlaceholderAPI, time, and supported metrics.

### Style resolution

For each chat message Gloss resolves one style, in this order:

1. The player's saved choice, when the file exists and the player has `gloss.bubbles.style.<id>`.
2. The matching `select` block with the highest priority. Ties use the lexicographically smallest style ID.
3. The style named `default`.
4. The built-in default values shown above.

A style without `select` is opt-in only unless its ID is `default`. Use `"when": "true"` for a server-wide automatic style.

Gloss selects the style once per message. Changes apply to new bubbles, not ones already visible.

### From message to bubbles

The bubble keeps the formatting already allowed in chat. It does not grant color formatting that the sender lacks permission to use.

Wrapping counts visible characters and keeps color and decoration state. One message uses one multiline display. Older messages move upward to make room for newer ones.

The configured `prefix` supports functions, expressions, PlaceholderAPI, emoji, and colors. Player chat is not interpreted as Gloss code. The bubble remains for `maxAliveMs` while the feature and permission checks pass.

Particle layers can follow the bubble or target a line, prefix span, or local geometry. Chat text cannot create particle ranges. See [Particle Layers](/gloss/25-particle-layers).

Gloss keeps at most four bubbles per speaker and 2,048 across the server. New bubbles above those limits are dropped or replace the speaker's oldest bubble.

### Shimmer

`shimmer` moves a colored band across the bubble text. It changes text color, not particles.

The band crosses the complete wrapped message. By default it runs shortly after spawn and again before expiry.

| Key | Default | Clamp / notes |
|---|---|---|
| `spawn` | `true` | Run one bounded pass after `spawnDelayMs` |
| `flyAway` | `true` | Run a second bounded pass beginning `flyAwayLeadMs` before expiry |
| `color` | `"#ffffff"` | Color applied to every lit glyph. Strict `#RRGGBB`; invalid values reject the style |
| `width` | `3` | Highlighted visible glyphs, clamped to `1`..`16` |
| `durationMs` | `700` | Milliseconds for one complete pass across the whole multiline block, clamped to `100`..`10000` |
| `spawnDelayMs` | `400` | Delay before the spawn pass starts, clamped to `0`..`60000` |
| `flyAwayLeadMs` | `700` | Departure starts this many milliseconds before expiry, clamped to `0`..`60000` |

A missing `shimmer` block uses the defaults above. Set both `spawn` and `flyAway` to `false` to disable it. Shimmer timing is independent of bubble motion.

High-frequency animations make shimmer smoother. When disabled, shimmer follows the temporary hologram update interval.

### Motion

The base position is the speaker's eye plus `offset`. Newer messages push older ones upward by `[holograms] stackDistance` per wrapped row. `followPlayer` controls whether that base follows the speaker.

`motion` contains four expression surfaces:

```json
"motion": {
  "translation": {"x": "0", "y": "4 * t", "z": "0"},
  "scale": {"x": "1 - 0.65 * t", "y": "1 - 0.65 * t", "z": "1"},
  "rotation": {"x": "0", "y": "0", "z": "360 * t"},
  "opacity": "1 - smoothstep(0.65, 1, t)"
}
```

`translation.x/y/z` add blocks to the base position and clamp to `-64`..`64`. `scale.x/y/z` are display-size multipliers clamped to `0`..`16`. `rotation.x/y/z` are finite degrees normalized modulo 360. `opacity` is normalized and clamped from `0` (transparent) to `1` (opaque). Each expression source is limited to 512 characters. Expressions are compiled with the style and evaluated on the temporary-hologram cadence. The available variables are:

| Variable | Value |
|---|---|
| `t` | Normalized lifetime progress from `0` at spawn to `1` at expiry |
| `remaining` | Normalized lifetime remaining, `1 - t` |
| `ageMs` | Milliseconds since this bubble spawned |
| `lifetimeMs` | Effective `maxAliveMs` |
| `stackIndex` | This message's zero-based position in the speaker's live bubble stack |
| `stackCount` | Number of live message bubbles for the speaker |
| `lineCount` | Number of wrapped text rows in this one display |
| `stackY` | Vertical stack lift already assigned to this message |
| `seed` | Stable per-bubble numeric seed for deterministic variation |
| `pi` | Mathematical π |

Motion supports the normal Gloss operators and math functions. Use `translation.y = "4 * t"` to rise, `opacity = "1 - t"` to fade, or `1 - t` on the scale axes to shrink.

Position and presentation are re-evaluated on the temporary hologram driver, which ticks every `[holograms] temporaryUpdateIntervalTicks` (default `2`). Teleport and transformation interpolation smooth supported changes between those evaluations.

`hideOwn` adds the speaker to the bubble viewer exclusion list. Everyone except the speaker sees it.

### Commands and permissions

```
/gloss bubbles style <style>
/gloss bubbles style clear
/gloss bubbles reset [name=*]
```

`bubble` is an alias for `bubbles`. `style` is player-only and needs `gloss.bubbles.style` (op by default). Tab completion offers `clear` plus every style id on disk. A style id that does not exist on disk is rejected with an unknown-style message. `clear` removes the stored choice and returns the player to automatic selection.

> `/gloss bubbles style <id>` checks only `gloss.bubbles.style`. It does **not** check `gloss.bubbles.style.<id>`. That node is tested at resolution time. A player can store a choice they are not permitted to use. Their bubbles will silently fall back to automatic selection with no further message.
{.is-info}

`reset` needs `gloss.bubbles.reset` (op) and restores the included bubble styles.

> `/gloss bubbles reset` overwrites `bubbles/default.json`. Edits to that file are lost. Style ids you created yourself are never touched.
{.is-warning}

| Permission | Default | Grants |
|---|---|---|
| `gloss.bubbles.send` | `true` | This player's chat messages spawn bubbles |
| `gloss.bubbles.style` | `op` | `/gloss bubbles style` |
| `gloss.bubbles.style.<id>` | undeclared (op) | Actually using style `<id>` once chosen |
| `gloss.bubbles.reset` | `op` | `/gloss bubbles reset` |

`gloss.bubbles.style.<id>` is operator-only until a permission plugin grants it.

### Stored player choices

Player choices are stored in `plugins/Gloss/bubble-styles.json`, a flat object of player UUID to style id, pretty-printed with the keys sorted:

```json
{
  "0b1d5f6e-9a2c-4d18-9f3a-77c1f2a4b901": "vip",
  "3c8a1e44-51f7-4a90-8d22-b6e0c9d13455": "neon"
}
```

Gloss writes this file when a player sets or clears a style. Deleting it returns every player to automatic selection.

### Turning bubbles off

`[features] chatBubbles = false` removes live bubbles and stops new ones from rendering. Style documents remain editable.

## Damage and heal indicators

### Profile document

Damage and healing share `plugins/Gloss/damage-indicators/default.json`. Gloss creates it while the feature is enabled and reloads valid edits automatically.

The included document is:

```json
{
  "schemaVersion": 3,
  "revision": 1,
  "limits": {
    "maxPerSecond": 40,
    "lifetimeMs": 3000,
    "minimumDelta": 0.009,
    "decimals": 0
  },
  "damage": {
    "when": "true",
    "presentation": {
      "format": "&c&l{amount}",
      "offset": [0, 0.7, 0],
      "motion": {
        "horizontalSpeed": 0.8,
        "verticalSpeed": 1.3,
        "verticalAcceleration": -0.93,
        "spinDegreesPerSecond": 0
      },
      "transform": {
        "startScale": 1,
        "endScale": 0.82,
        "fadeStartFraction": 0.68
      },
      "particleLayers": []
    },
    "variants": []
  },
  "healing": {
    "when": "true",
    "presentation": {
      "format": "&a&l{amount}",
      "offset": [0, -0.1, 0],
      "motion": {
        "horizontalSpeed": 0.45,
        "verticalSpeed": 0.65,
        "verticalAcceleration": 0.05,
        "spinDegreesPerSecond": 0
      },
      "transform": {
        "startScale": 1,
        "endScale": 1.1,
        "fadeStartFraction": 0.62
      },
      "particleLayers": []
    },
    "variants": []
  },
  "audience": {
    "when": "hasPermission('viewer', 'gloss.indicators.show')"
  }
}
```

The limits are clamped when the document loads:

| Key | Range |
|---|---|
| `maxPerSecond` | `1`..`1000` |
| `lifetimeMs` | `250`..`30000` |
| `minimumDelta` | `0`..`1000` |
| `decimals` | `0`..`4` |

The base `when` condition enables each event type. The matching variant with the highest priority wins; ties use the lexicographically smallest ID. `format` must contain `{amount}`. `offset` is measured from the affected entity and clamps each axis to `-32`..`32`.

Each presentation can include particle layers that follow the indicator. A named span can limit particles to part of the format. See [Particle Layers](/gloss/25-particle-layers).

Motion fields use continuous units rather than per-tick impulses:

| Key | Range |
|---|---|
| `horizontalSpeed` | `0`..`16` blocks per second |
| `verticalSpeed` | `-16`..`16` blocks per second |
| `verticalAcceleration` | `-32`..`32` blocks per second squared |
| `spinDegreesPerSecond` | `-1440`..`1440` |

Gloss chooses a random horizontal direction when the indicator spawns. The fields above control its path and rotation over time.

`transform.startScale` and `transform.endScale` accept `0`..`16` and interpolate linearly
over the indicator lifetime. Opacity stays full until `fadeStartFraction` (`0`..`1`), then falls
linearly to zero at expiry. World, entity, source, cause and amount filtering belongs in `when`
conditions rather than a separate disabled-world list.

### Runtime behavior

Gloss handles uncancelled damage and healing on living entities, then checks the matching `when` condition.

The number is the applied health change, not the raw event amount. Armor, resistance, absorption, and changes from other plugins are included. A neutralized event produces no indicator.

Filtering before an indicator spawns:

- A per-entity 3-tick debounce coalesces bursts. One entity produces at most one indicator per 3 ticks.
- A delta at or below `limits.minimumDelta` is discarded.
- A server-wide sliding window drops anything over `limits.maxPerSecond`.
- Live admission is the smaller of `ceil(maxPerSecond * lifetimeMs / 1000)` and `2048`. The default settings therefore allow at most 120 simultaneous indicators. A new indicator is dropped while that capacity is full.

`limits.decimals` controls the displayed precision. Reloading the profile removes current indicators; new ones use the updated presentation.

Conditions can read event values, the affected entity as `subject`, the direct damager as `source` when available, world and time values, PlaceholderAPI, and metrics. See [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Paper-derived servers provide the exact `event.critical` value. Spigot sets `event.critical` and `event.criticalKnown` to `false`. Use `event.criticalKnown && event.critical` for a portable critical-hit condition.

`audience.when` decides which nearby players see an indicator. The default requires `gloss.indicators.show`.

### Web renderer

The web editor previews damage, healing, critical conditions, motion, scale, and fading. Check the final appearance in Minecraft because browser text and camera rendering differ from the client.

### Commands and permissions

| Permission | Default | Grants |
|---|---|---|
| `gloss.indicators.show` | `true` | This player sees damage and heal indicators |
| `gloss.indicators.reset` | `op` | `/gloss indicators reset`, which restores the default file |

`/gloss web edit damage-indicators default` opens the document. Disabling `[features] damageIndicators` removes current indicators and stops new ones; enabling it again does not require a restart.

## Dropped item labels

With `[features] drops = true` (the default) every item entity that spawns gets a visible custom name built from `[drops] nameFormat`:

| Token | Replaced with |
|---|---|
| `{count}` | The stack size |
| `{type}` | The material name lowercased with underscores turned into spaces, so `DIAMOND_SWORD` becomes `diamond sword`. When `[drops] useItemDisplayNames` is explicitly enabled and item meta has a display name, that renamed value is used instead |

The default is `"&7{count}x {type}"`, giving `64x cobblestone` and `1x diamond sword` even when that sword was renamed in an anvil. Set `[drops] useItemDisplayNames = true` to show `1x Excalibur` instead. A null `nameFormat` restores the default on load; an explicit empty string stays empty.

### Bundles

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

A bundle with no contents, or whose stacks are all empty, falls back to `nameFormat` and is named `1x bundle`. The horizontal fallback remains on the hidden item entity, so turning real drops off immediately returns to a readable vanilla nametag.

React super-stack bundles can supply their own label formats and entry limit.

Labels support colors, emoji, and static functions. Viewer placeholders do not resolve, and Gloss does not change the `ItemStack`.

With `[drops] preserveCustomNames = true`, Gloss leaves names from other plugins unchanged. Set it to `false` to allow Gloss to overwrite them.

Labels refresh after spawns, merges, partial pickups, loads, and reloads. Removing the item removes its presentation.

### Real drops

`[features] realDrops` defaults to `true`. The real item entity still controls physics, merging, pickup, and despawn. Gloss hides its vanilla model and shows `BlockDisplay` or `ItemDisplay` models instead.

Presentation settings live in the schema-3 file `plugins/Gloss/real-drops/default.json`. A stack shows one to five models, subject to the configured per-chunk limit and a server-wide limit of 2,048 presentations. Items above a limit keep their vanilla model and name.

The document has one complete fallback `presentation`, zero or more complete conditional `variants`, and one per-viewer `audience` condition:

```json
{
  "schemaVersion": 3,
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
| `labels.enabled` | `true` | Mirrors the effective drop name through one TextDisplay |
| `labels.yOffset` | `0.55` | Label translation above the model; 0 – 4 blocks |
| `labels.scale` | `0.85` | Label scale; 0.1 – 4 |
| `labels.viewRange` | `32.0` | Label tracking range; 4 – 128 blocks |
| `labels.billboard` | `"CENTER"` | `CENTER`, `FIXED`, `HORIZONTAL`, or `VERTICAL` |
| `labels.seeThrough` | `true` | Draws through blocks when on |
| `labels.shadow` | `true` | Draws the glyph shadow |
| `labels.background` | `true` | Enables the full label background |
| `labels.backgroundRed/Green/Blue/Alpha` | `0/0/0/80` | Channels clamp to 0 – 255 |
| `filters.disabledWorlds` | `[]` | Case-insensitive world folder names that retain vanilla rendering |
| `filters.materialBlacklist` | `["BEDROCK", "BARRIER"]` | Case-insensitive material names that retain vanilla rendering |
| `filters.onlyPlayerDrops` | `false` | Requires a non-null item thrower UUID |
| `particleLayers` | `[]` | Layers targeting the whole projection, model, label, line, span or local geometry |

`NATURAL` keeps the airborne rotation and settles the nearest face toward the ground. Partial blocks are positioned against their actual bounds instead of intersecting the surface.

The optional `animation` block adds event-driven tracks for position, rotation, scale, glow, visibility, physics, and light. Profiles can match material globs and run from spawn, movement phases, impacts, fluid changes, rolling, or settling.

`animation.materialProperties` can map materials or globs to glow colors and light levels. Temporary light blocks use air only and are limited to eight per chunk.

Presentations are removed when the item merges, is picked up, despawns, unloads, or when the feature stops. Display entities are not persistent.

Disabling `drops` removes Gloss-owned labels. Disabling `realDrops` removes display models and restores vanilla item visibility. The config and presentation document reload automatically. See [Particle Layers](/gloss/25-particle-layers).

## Reference

Bubble schema 4, damage-indicator schema 3 and real-drop schema 3 are hard breaks. Older documents are silently ignored rather than migrated; rewrite custom files to the current shapes or reset them to the defaults.

| Command | Arguments | Permission |
|---|---|---|
| `/gloss bubbles style` | `<style>` (a style id, or `clear`) | `gloss.bubbles.style` |
| `/gloss bubbles reset` | `[name=*]` | `gloss.bubbles.reset` |
| `/gloss drops reset` | `[name=*]` | `gloss.drops.reset` |

Optional arguments must be written as `key=value`. A stray positional value is rejected. The drop
reset overwrites matching included `real-drops/` documents without deleting extra documents;
indicators have no command subtree.

Bubble style changes apply live. Invalid files are logged while the last valid version remains active. See [Data Files & Hot Reload](/gloss/03-data-files) and [Holograms](/gloss/04-holograms).
