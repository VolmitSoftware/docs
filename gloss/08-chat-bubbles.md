---
title: "Chat Bubbles"
description: "Show a player's chat above their head"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss can show chat above the player who sent it.

Open the editor with `/gloss web edit bubble-style <id>`. Styles are schema 5, in `bubbles/<id>.json`.

A player who cannot see the speaker does not see their bubble. Vanish works.

## Style documents

Each JSON file in `plugins/Gloss/bubbles/` defines one bubble style. Gloss restores a missing `default.json` while chat bubbles are enabled.

`plugins/Gloss/bubbles/default.json` by default:

```json
{
  "schemaVersion": 5,
  "revision": 1,
  "prefix": "&7",
  "style": {"billboard": "center", "seeThrough": true},
  "box": {"enabled": false},
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
| `schemaVersion` | required | Must be `5`. Any other version is silently ignored |
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
| `style` | center, see-through, unit XYZ scale | Full shared display settings, including line width, opacity, background, brightness, glow and alignment |
| `box` | disabled | Shared measured panel and complete perimeter settings |
| `particleLayers` | `[]` | Up to 64 layers attached to the one multiline temporary hologram |

Write `followPlayer` and `hideOwn` explicitly — an omitted value is `false`, not the default shown above. Put bubble movement in `motion`; `shimmer.flyAway` only controls the shine pass. The [shared style and box settings](/gloss/11-icons#display-style-and-boxes) apply unchanged.

There is no config table for bubble styles. `gloss.toml` carries exactly one bubble knob, `[chatBubbles] blacklistWorlds` (default `[]`). That is a list of world folder names matched exactly and case-sensitively. A speaker in a listed world produces no bubbles at all.

## Visibility

A bubble style accepts `show`, defaulting to `true`. After style selection, it gates each viewer
while the bubble lives and combines with `hideOwn`, world restrictions, and other viewer rules.
False hides the bubble; it does not select a different style. Use [Show conditions](/gloss/13-expressions-placeholders#show-conditions) for expressions.

## The `select` block

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

## Style resolution

For each chat message Gloss resolves one style, in this order:

1. The player's saved choice, when the file exists and the player has `gloss.bubbles.style.<id>`.
2. The matching `select` block with the highest priority. Ties use the lexicographically smallest style ID.
3. The style named `default`.
4. The built-in default values shown above.

A style without `select` is opt-in only unless its ID is `default`. Use `"when": "true"` for a server-wide automatic style.

Gloss selects the style once per message. Changes apply to new bubbles, not ones already visible.

## From message to bubbles

The bubble keeps the formatting already allowed in chat. It does not grant color formatting that the sender lacks permission to use.

Wrapping counts visible characters and keeps color and decoration state. One message uses one multiline display. Older messages move upward to make room for newer ones.

`prefix` takes expressions, PlaceholderAPI, emoji, legacy colors and MiniMessage. A closed tag styles only the label, an open one carries into the message:

- `"prefix": "<gold>[Chat]</gold> "` colors the label
- `"prefix": "<gold>"` colors the whole message

The bubble lives for `maxAliveMs`. Player chat is never interpreted as Gloss code.

Particle layers can follow the bubble or target a line, prefix span, or local geometry. Chat text cannot create particle ranges. See [Particle Layers](/gloss/25-particle-layers).

Gloss keeps at most four bubbles per speaker and 2,048 across the server. New bubbles above those limits are dropped or replace the speaker's oldest bubble.

## Shimmer

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

A missing `shimmer` block uses the defaults above. Set both `spawn` and `flyAway` to `false` to
disable it.

## Motion

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

`translation.x/y/z` add blocks to the base position, clamped to `-64`..`64`. `scale.x/y/z` are size multipliers clamped to `0`..`16`. `rotation.x/y/z` are degrees. `opacity` runs `0` to `1`. Each expression is limited to 512 characters. The available variables are:

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

Motion uses the normal Gloss operators and math functions. Use `translation.y = "4 * t"` to rise, `opacity = "1 - t"` to fade, or `1 - t` on the scale axes to shrink.

Motion is re-evaluated every `[holograms] temporaryUpdateIntervalTicks` (default `2`), with interpolation in between.

## Commands and permissions

```
/gloss bubbles style <style>
/gloss bubbles style clear
/gloss bubbles reset [name=*]
```

`bubble` is an alias for `bubbles`. `style` is player-only and needs `gloss.bubbles.style`. `clear` removes the stored choice and returns the player to automatic selection.

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

## Stored player choices

Player style choices save automatically to `plugins/Gloss/bubble-styles.json`. Delete it to return everyone to automatic selection.

## Turning bubbles off

`[features] chatBubbles = false` removes live bubbles and stops new ones from rendering. Style documents remain editable.

## Reference

Styles are schema 5. Changes apply live; an invalid file is logged and the last valid version
stays active. See [Data Files & Hot Reload](/gloss/03-data-files).

See also [Damage Indicators](/gloss/08b-damage-indicators) and [Drop Labels](/gloss/08c-drop-labels).
