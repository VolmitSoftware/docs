---
title: "Holograms"
description: "Create, edit, position, and format persistent Gloss holograms"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Each JSON file in `plugins/Gloss/holograms/` defines one persistent text hologram. The file name is the hologram ID, and command or file edits apply live.

`/gloss web edit hologram <id>` opens one hologram in a restricted live editor session;
`/gloss web workspace` includes every hologram.

## The hologram document

`plugins/Gloss/holograms/spawn.json`:

```json
{
  "schemaVersion": 2,
  "revision": 4,
  "anchor": {
    "world": "world",
    "position": [0.5, 82.0, 0.5]
  },
  "lines": [
    "&d&lSpawn",
    "Welcome, %player_name%!"
  ],
  "seeThrough": true,
  "scale": 2.0,
  "billboard": "FIXED",
  "yaw": 45.0,
  "pitch": -10.0,
  "particleLayers": []
}
```

| Key | Required | Notes |
|---|---|---|
| `schemaVersion` | yes | Must be `2`. Any other version is silently ignored |
| `revision` | yes | `1` to `9007199254740991`. Gloss owns this value and bumps it by one on every write it makes |
| `anchor.world` | yes | World folder name. Missing or blank rejects the file with `hologram anchor requires a world` |
| `anchor.position` | yes | `[x, y, z]` array of doubles. Missing rejects the file with `hologram anchor requires a position` |
| `lines` | no | Absent or `null` becomes an empty list. A `null` entry becomes an empty string |
| `seeThrough` | no | Defaults to `true`. When true, solid blocks do not occlude the TextDisplay |
| `scale` | yes | Uniform native `TextDisplay` scale from `0.05` through `16.0` |
| `billboard` | no | `CENTER`, `FIXED`, `HORIZONTAL` or `VERTICAL`, matched after trimming and uppercasing. Blank or absent defaults to `CENTER`; any other value rejects the file |
| `yaw` | no | Finite degrees from `-180` through `180`; defaults to `0` |
| `pitch` | no | Finite degrees from `-90` through `90`; defaults to `0` |
| `particleLayers` | no | Up to 64 viewer-targeted layers; absent or `null` becomes an empty list |

There is no `id` key. The document id is the file name with `.json` removed. If you rename the file, you rename the hologram. Only files directly inside `holograms/` are read. Subfolders are ignored.

If an edit is invalid, Gloss logs the reason and keeps the last valid version active.

> If you delete the file, Gloss despawns the hologram and unregisters it. There is no undo and no backup for a hand-deleted file.
{.is-warning}

### The default

`/gloss hologram create` starts with `&dNew hologram`, `seeThrough` enabled, scale `1.0`, `CENTER` billboard mode, and no particle layers. The baseline stays inside the jar.

## Particle layers

A particle layer can target the complete hologram, one line, a named text span, or local geometry. This example places green dust behind a marked word:

```json
{
  "schemaVersion": 2,
  "revision": 1,
  "anchor": {"world": "world", "position": [0.5, 82.0, 0.5]},
  "lines": ["This is: <particles:green>&4GREEN</particles> Colored!"],
  "scale": 1.0,
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

Line numbers start at 1. `create`, `movehere`, `tp` and `rendertext` are player-only. Every node above is reachable both as `/gloss hologram ...` and through the root command `/hologram` (aliases `holo`, `h`). `/gloss holo` and `/gloss h` work as well.

`orient` accepts `CENTER`, `VERTICAL`, `HORIZONTAL` or `FIXED`. Yaw must be finite and between `-180` and `180`; pitch must be finite and between `-90` and `90`. Gloss validates all three values before changing the live display or document, so a rejected command changes nothing.

Ids may not contain `/`, `\` or `..`. Spaces are allowed but become part of the file name.

Command edits save automatically. See [Data Files & Hot Reload](/gloss/03-data-files).

## Rendering

Gloss applies scale, orientation, and visibility edits to the existing display. Ordinary text refreshes every `[holograms] updateIntervalTicks` (default 10); clock expressions and named animations can refresh every tick. Empty holograms and holograms in unloaded worlds do not render.

If you set `[features] holograms = false`, Gloss despawns every hologram on the next driver tick. Documents still load and hot-reload. The commands still edit them. Nothing renders.

### Shared and personalized modes

With `[holograms] perViewerPlaceholders = true`, player placeholders and viewer expressions render separately for each nearby player. Viewer-independent text remains shared. Setting the option to `false` forces shared text and leaves player-only values unresolved.

Persistent and temporary hologram displays use the native maximum line width of `16384`, so Gloss does not impose automatic wrapping or character termination. Configured entries remain separate logical lines, and an explicit legacy reset between them prevents `&k` and other styles from bleeding into the next line.

### The line pipeline

Each line is rendered in this order:

1. `|function|` tokens, including `|animation.<id>|`, when `[text] functions` is on.
2. Inline `{{ expression }}` blocks, with the standard time, server, player, PAPI and metric facilities available for the current context.
3. PlaceholderAPI placeholders, when `[text] placeholders` is on **and** a viewer is present. Shared displays and temporary holograms have no viewer, so they skip this step.
4. Emoji replacement.
5. Colors: `[RRGGBB]` bracket hex first, then `&` codes.

Animation frames update at the refresh rate of the hologram. Clips faster than 20 fps can use the high-frequency animator below. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations) and [Expressions & Placeholders](/gloss/13-expressions-placeholders).

### High-frequency animations

With `[holograms] highFrequencyAnimations = true`, clips above 20 fps use packet updates up to `[holograms] maxAnimationFps` (default 120). `[holograms] animationPacketBudget` limits the total work across viewers. No animation work runs when nobody is in range.

Set `highFrequencyAnimations` to `false` to keep every clip on the normal tick refresh. Use `[debug] animator = true` for periodic diagnostics.

## Native text scaling

```
/gloss hologram rendertext banner "GLOSS" scale=2
```

This creates a normal one-line hologram and applies native display scale. Scale must be between `0.05` and `16.0`; blank text or an invalid scale creates nothing.

The result is an ordinary hologram document. You can edit its text, scale, position and
orientation on disk, and move or delete it by command like any other hologram.
## Temporary holograms

Chat bubbles and damage indicators use temporary holograms. They are not saved to disk and update every `[holograms] temporaryUpdateIntervalTicks` (default 2). They can follow an entity and use viewer allowlists or denylists. Player placeholders do not resolve in their static text.

`[holograms] interpolatedMotion` smooths movement, scale, and rotation between updates where the server supports it. Raising the update interval still reduces how often Gloss updates the display.

Temporary holograms also accept particle layers through the inherited API. Source lines retain named span metadata; already-rendered frames do not. Other plugins can create them directly. See [API: Getting Started](/gloss/21-api-getting-started) and [Particle Layers](/gloss/25-particle-layers). The features built on them are covered in [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops).

## Migrating pre-envelope hologram files

Schema 1 hologram files are ignored. Rewrite them as schema 2 and add `"particleLayers": []` when no effect is wanted.

The pre-envelope hologram shape was `{"id": ..., "world": ..., "x": ..., "y": ..., "z": ..., "lines": [...]}`. Startup no longer scans or rewrites it; an unversioned document is silently ignored. Convert it only through the explicit legacy import command:

- the original bytes are copied to `import-backups/<yyyyMMdd-HHmmss>/holograms/<file>`
- `x`, `y`, `z` become `anchor.position` and `world` becomes `anchor.world`
- the embedded `id` key is dropped, so the file name is the only id from then on
- the rewritten file starts at `revision` 1

Files that already use an envelope are skipped. Run `/gloss import legacy` to convert the older envelope-free format.
