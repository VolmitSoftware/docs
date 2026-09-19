---
title: "Holograms"
description: "Create, edit, position, and format persistent Gloss holograms"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Each JSON file in `plugins/Gloss/holograms/` defines one persistent text hologram. The file name is the hologram ID, and command or file edits apply live.

`/gloss web edit hologram <id>` opens one hologram in a restricted live editor session; `/gloss web workspace` includes every hologram. Check text size and placement in a Minecraft client, since the browser preview does not reproduce the client renderer.

## The hologram document

`plugins/Gloss/holograms/spawn.json`:

```json
{
  "schemaVersion": 3,
  "revision": 4,
  "anchor": {
    "world": "world",
    "position": [0.5, 82.0, 0.5]
  },
  "lines": [
    "&d&lSpawn",
    "Welcome, %player_name%!"
  ],
  "style": {"billboard": "fixed", "seeThrough": true, "scaleX": 2.0, "scaleY": 2.0, "scaleZ": 2.0},
  "box": {"enabled": true, "padding": 4, "borderWidth": 1, "backgroundArgb": "#B31B1B22", "borderArgb": "#FFAAAAAA"},
  "yaw": 45.0,
  "pitch": -10.0,
  "particleLayers": []
}
```

| Key | Required | Notes |
|---|---|---|
| `schemaVersion` | yes | Must be `3`. Any other version is silently ignored |
| `revision` | yes | `1` to `9007199254740991`. Gloss owns this value and bumps it by one on every write it makes |
| `anchor.world` | yes | World folder name. Missing or blank rejects the file with `hologram anchor requires a world` |
| `anchor.position` | yes | `[x, y, z]` array of doubles. Missing rejects the file with `hologram anchor requires a position` |
| `show` | no | Boolean or boolean expression; defaults to `true` |
| `lines` | no | Absent or `null` becomes an empty list. A `null` entry becomes an empty string |
| `style` | no | Shared display style. An omitted object uses `center` billboard, see-through text, unit XYZ scale, transparent text background and full opacity |
| `box` | no | Optional measured panel with a complete perimeter; disabled by default |
| `yaw` | no | Finite degrees from `-180` through `180`; defaults to `0` |
| `pitch` | no | Finite degrees from `-90` through `90`; defaults to `0` |
| `particleLayers` | no | Up to 64 viewer-targeted layers; absent or `null` becomes an empty list |

There is no `id` key. The document id is the file name with `.json` removed, so renaming the file renames the hologram. Only files directly inside `holograms/` are read. If an edit is invalid, Gloss logs the reason and keeps the last valid version active.

> If you delete the file, Gloss despawns the hologram and unregisters it. There is no undo and no backup for a hand-deleted file.
{.is-warning}

### Visibility

Set document-level `"show": false` to hide the hologram, or use a boolean expression to decide per viewer. Gloss reevaluates it during updates and hides text, decorations and particles when false, even when the lines are static or `perViewerPlaceholders` is off. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

### The default

`/gloss hologram create` starts with `&dNew hologram`, `seeThrough` enabled, scale `1.0`, `CENTER` billboard mode, and no particle layers.

## Display style and boxes

`style` and `box` are the shared display contract documented once on [Icons](/gloss/11-icons#display-style-and-boxes): billboard, alignment, shadow, see-through, ARGB background, opacity, line width, paired brightness, view range, shadow size and strength, culling bounds, glow color, independent XYZ scale, and the box panel and border. An explicit partial `style` uses the shared defaults, so include `"billboard": "center"` and `"seeThrough": true` to keep the hologram defaults above.

The `lines` array is the display order — move entries to reorder rows. Boxes disappear with their text, viewer conditions, unloaded worlds or feature disablement.

## Particle layers

A particle layer can target the complete hologram, one line, a named text span, or local geometry. This example places green dust behind a marked word:

```json
{
  "schemaVersion": 3,
  "revision": 1,
  "anchor": {"world": "world", "position": [0.5, 82.0, 0.5]},
  "lines": ["This is: <particles:green>&4GREEN</particles> Colored!"],
  "particleLayers": [
    {
      "id": "green-word",
      "target": {"scope": "span", "name": "green"},
      "geometry": {"type": "glyphFill", "spacing": 0.05},
      "placement": {"layer": "behind", "depth": 0.04},
      "particle": {"key": "minecraft:dust", "color": "#00ff00", "size": 0.7},
      "emission": {"intervalTicks": 2, "pattern": "steady"}
    }
  ]
}
```

The complete target, geometry, placement, particle, pattern and budget contract is on [Particle Layers](/gloss/25-particle-layers).

## Creating and editing by command

```
/gloss hologram create <id>
/gloss hologram addline <id> "&dWelcome to spawn"
/gloss hologram setline <id> 2 "%player_name%"
/gloss hologram move <id> y=0.5
/gloss hologram orient <id> billboard=FIXED yaw=45 pitch=-10
/gloss hologram rendertext <id> "GLOSS" scale=2
```

Required arguments are positional in the order shown. Optional arguments must be written as `key=value` (`x=`, `y=`, `z=`, `scale=`, `billboard=`, `yaw=`, `pitch=`). A stray positional value is rejected. Quote any text that contains spaces.

| Node | Arguments | Permission |
|---|---|---|
| `create` | `<id>` | `gloss.holograms.create` |
| `rendertext` | `<id> <text> [scale=1]` | `gloss.holograms.create` |
| `addline` | `<id> <text>` | `gloss.holograms.edit` |
| `setline` | `<id> <line> <text>` | `gloss.holograms.edit` |
| `removeline` | `<id> <line>` | `gloss.holograms.edit` |
| `clear` | `<id>` | `gloss.holograms.edit` |
| `orient` | `<id> [billboard=CENTER] [yaw=0] [pitch=0]` | `gloss.holograms.edit` |
| `delete` | `<id>` | `gloss.holograms.delete` |
| `movehere` | `<id>` | `gloss.holograms.move` |
| `move` | `<id> [x=0] [y=0] [z=0]` | `gloss.holograms.move` |
| `tp` | `<id>` | `gloss.holograms.teleport` |
| `list` | `[page=1]` | none |
| `info` | `<id>` | none |

Line numbers start at 1. `create`, `movehere`, `tp` and `rendertext` are player-only. Every node is reachable as `/gloss hologram ...` and through the root command `/hologram` (aliases `holo`, `h`); `/gloss holo` and `/gloss h` work too.

`orient` accepts `CENTER`, `VERTICAL`, `HORIZONTAL` or `FIXED`. All three values are validated before anything changes, so a rejected command changes nothing.

Ids may not contain `/`, `\` or `..`. Spaces are allowed but become part of the file name. Command edits save automatically. See [Data Files & Hot Reload](/gloss/03-data-files).

## Rendering

Style, orientation and visibility edits apply to the existing display, and box geometry follows text, animation frames, orientation and scale. Ordinary text refreshes every `[holograms] updateIntervalTicks` (default 10); clock expressions and named animations can refresh every tick. Empty holograms and holograms in unloaded worlds do not render. Lines are rendered by the shared text pipeline described on [Emoji, Text & Animations](/gloss/07-emoji-text-animations#the-text-pipeline).

`[features] holograms = false` despawns every hologram on the next driver tick. Documents still load, hot-reload and accept command edits. Nothing renders.

With `[holograms] perViewerPlaceholders = true`, each nearby player sees their own placeholder and viewer-expression values; viewer-independent text stays shared. Set it to `false` and player-only values stay unresolved unless a dynamic `show` needs per-viewer rendering.

Displays default to the native maximum line width of `16384`. Set `style.lineWidth` to wrap at a smaller pixel width. Configured entries stay separate logical lines, with a reset between them so `&k` and other styles cannot bleed into the next line.

### High-frequency animations

Clips above 20 fps play smoothly by default, up to `[holograms] maxAnimationFps` (default 120) and within `[holograms] animationPacketBudget`. Set `[holograms] highFrequencyAnimations = false` to cap every clip at the tick refresh. Use `[debug] animator = true` for periodic diagnostics.

## Native text scaling

```
/gloss hologram rendertext banner "GLOSS" scale=2
```

This creates a normal one-line hologram and applies native display scale. Scale must be between `0.05` and `16.0`; blank text or an invalid scale creates nothing. The result is an ordinary hologram document you can edit, move or delete like any other.

## Temporary holograms

Chat bubbles, damage indicators, entity overlays and drop labels use temporary holograms. They are never written to disk, update every `[holograms] temporaryUpdateIntervalTicks` (default 2), and can follow an entity and use viewer allowlists or denylists. With `perViewerPlaceholders` enabled, their authored placeholders and expressions receive the viewer context; other text stays shared.

`[holograms] interpolatedMotion` smooths movement, scale and rotation between updates where the server supports it. Raising the update interval still reduces how often Gloss updates the display.

Temporary holograms also accept particle layers through the API, and rendered-only lines can supply their own measured span ranges with `setRenderedParticleText`. See [API: Getting Started](/gloss/21-api-getting-started), [Particle Layers](/gloss/25-particle-layers) and [Chat Bubbles](/gloss/08-chat-bubbles).

## Migrating pre-envelope hologram files

The pre-envelope shape was `{"id": ..., "world": ..., "x": ..., "y": ..., "z": ..., "lines": [...]}`. Startup ignores it silently. Run `/gloss import legacy` to convert: `x`, `y`, `z` become `anchor.position`, `world` becomes `anchor.world`, the embedded `id` is dropped so the file name is the only id, and the rewritten file starts at `revision` 1. The original bytes are copied to `import-backups/<yyyyMMdd-HHmmss>/holograms/<file>`, and files that already use an envelope are skipped.
