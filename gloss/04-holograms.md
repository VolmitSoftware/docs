---
title: "Holograms"
description: "Gloss documentation: Holograms"
published: true
date: 2026-08-20T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Holograms are `TextDisplay` entities driven from enveloped JSON documents in `plugins/Gloss/holograms/`. One file is one hologram. The file name is its id. Commands and on-disk edits both apply live. Every line runs through the full text pipeline: functions, placeholders, emoji, then colors.

## The hologram document

`plugins/Gloss/holograms/spawn.json`:

```json
{
  "schemaVersion": 1,
  "revision": 4,
  "anchor": {
    "world": "world",
    "position": [0.5, 82.0, 0.5]
  },
  "lines": [
    "&d&lSpawn",
    "Welcome, %player_name%!"
  ],
  "seeThrough": true
}
```

| Key | Required | Notes |
|---|---|---|
| `schemaVersion` | yes | Must be `1`. Anything else rejects the file with `unsupported holograms schemaVersion: <n>` |
| `revision` | yes | `1` to `9007199254740991`. Gloss owns this value and bumps it by one on every write it makes |
| `anchor.world` | yes | World folder name. Missing or blank rejects the file with `hologram anchor requires a world` |
| `anchor.position` | yes | `[x, y, z]` array of doubles. Missing rejects the file with `hologram anchor requires a position` |
| `lines` | no | Absent or `null` becomes an empty list. A `null` entry becomes an empty string |
| `seeThrough` | no | Defaults to `true`. When true, solid blocks do not occlude the TextDisplay |

There is no `id` key. The document id is the file name with `.json` removed. If you rename the file, you rename the hologram. Only files directly inside `holograms/` are read. Subfolders are ignored.

A document that fails to parse is logged as `holograms/<id>.json <reason>` and skipped. The copy Gloss already had in memory stays live. A bad edit does not delete a working hologram. It stops applying until the file parses again.

> If you delete the file, Gloss despawns the hologram and unregisters it. There is no undo and no backup for a hand-deleted file.
{.is-warning}

### The shipped baseline

`/gloss hologram create` and `/gloss hologram rendertext` seed new holograms from `baselines/hologram.json` inside the jar. That baseline is read on demand. It is **never** extracted to the data folder. There is no baseline file to edit. Its line list is a single `&dNew hologram`, with `seeThrough` enabled.

## Creating and editing by command

```
/gloss hologram create <id>
/gloss hologram addline <id> "&dWelcome to spawn"
/gloss hologram setline <id> 2 "%player_name%"
/gloss hologram move <id> y=0.5
/gloss hologram rendertext <id> "GLOSS" scale=2
```

Required arguments are positional in the order shown. Optional arguments must be written as `key=value` (`x=`, `y=`, `z=`, `scale=`). A stray positional value is rejected. Quote any text that contains spaces.

| Node | Arguments | Permission |
|---|---|---|
| `create` | `<id>` | `gloss.holograms.create` |
| `rendertext` | `<id> <text> [scale=1]` | `gloss.holograms.create` |
| `addline` | `<id> <text>` | `gloss.holograms.edit` |
| `setline` | `<id> <line> <text>` | `gloss.holograms.edit` |
| `removeline` | `<id> <line>` | `gloss.holograms.edit` |
| `clear` | `<id>` | `gloss.holograms.edit` |
| `delete` | `<id>` | `gloss.holograms.delete` |
| `movehere` | `<id>` | `gloss.holograms.move` |
| `move` | `<id> [x=0] [y=0] [z=0]` | `gloss.holograms.move` |
| `tp` | `<id>` | `gloss.holograms.teleport` |
| `list` | none | none |
| `info` | `<id>` | none |

Line numbers start at 1. `create`, `movehere`, `tp` and `rendertext` are player-only. Every node above is reachable both as `/gloss hologram ...` and through the root command `/hologram` (aliases `holo`, `h`). `/gloss holo` and `/gloss h` work as well.

Ids may not contain `/`, `\` or `..`. Spaces are allowed but become part of the file name.

Every command edit rewrites the document with `revision` bumped by one. Writes are queued onto a single background IO thread. The folder watcher compares each changed file SHA-256 against the hash Gloss just wrote. A command edit never bounces back through the hot-reload path. Hot reload itself is covered in [Data Files & Hot Reload](/gloss/03-data-files).

## Rendering

Each display is spawned non-persistent with a `CENTER` billboard, no shadow, and the document's `seeThrough` value. The shipped baseline and the absent-key fallback both enable see-through, so terrain does not hide a hologram unless its document explicitly sets `false`. The value hot-reloads on an existing shared or per-viewer display. Its client view range is set to `[holograms] viewRange` divided by the 64-block Paper base. Text is refreshed every `[holograms] updateIntervalTicks` (default 10). Text is only re-sent when the rendered string actually changed.

Spawning requires the anchor chunk to be loaded. An unloaded chunk retries on later ticks. A hologram whose world is not loaded, or whose `lines` list is empty, despawns every display it owns. It renders nothing until that changes. If you move the anchor, Gloss teleports the existing displays. It does not respawn them.

If you set `[features] holograms = false`, Gloss despawns every hologram on the next driver tick. Documents still load and hot-reload. The commands still edit them. Nothing renders.

### Shared and per-viewer modes

When any line contains a complete `%name%` placeholder, `|function|` token or `{{ expression }}` block and `[holograms] perViewerPlaceholders` is on (the default), the hologram switches to per-viewer rendering. Every player in the anchor world within `[holograms] viewRange` blocks of the anchor gets a private `TextDisplay`. Player variables, PlaceholderAPI and viewer-aware functions resolve for that player. The copy is hidden from everyone else through the entity visible-by-default flag where the server API exposes it. Otherwise Gloss issues per-player hide calls at spawn time. Players who leave the range lose their copy.

Plain viewer-independent lines use one shared display. Functions, expressions, emoji and colors still apply in that static context. If you set `[holograms] perViewerPlaceholders = false`, Gloss forces shared mode; player-backed values then remain unresolved, while native server/time values and explicit fallbacks still work. Removing the last complete dynamic token collapses the hologram back to one shared display. A lone percent sign such as `100%` does not create private displays.

### The line pipeline

Each line is rendered in this order:

1. `|function|` tokens, including `|animation.<id>|`, when `[text] functions` is on.
2. Inline `{{ expression }}` blocks, with the standard time, server, player, PAPI and metric facilities available for the current context.
3. PlaceholderAPI placeholders, when `[text] placeholders` is on **and** a viewer is present. Shared displays and temporary holograms have no viewer, so they skip this step.
4. Emoji replacement.
5. Colors: `[RRGGBB]` bracket hex first, then `&` codes.

Animation frames substitute on every refresh. For tick-driven clips the visible frame rate is bounded by `[holograms] updateIntervalTicks`. Clips faster than 20 fps are driven by the high-frequency animator below. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations) and [Expressions & Placeholders](/gloss/13-expressions-placeholders).

### High-frequency animations

While `[holograms] highFrequencyAnimations` is on (the default), fast
clips leave the tick driver. A hologram line with an `|animation.<id>|`
call faster than 20 fps is animated by a daemon thread named
`Gloss Animator`. It is not driven by the tick driver. Clips at 20 fps
or below stay on the tick path. Slow animations are never double-driven.
The threshold is the clip `1000 / frameIntervalMs` rate.

The split is two-phase. The regular tick refresh keeps doing the full
render — functions, placeholders, emoji, colors. For fast-animated lines
it produces a *template*. That template is the fully rendered text with
the animation call sites left as slots. It also holds a snapshot of the
display entity id and current audience. That snapshot is captured on the
owning region thread. The async thread never touches world state. The
animator thread then splices the wall-clock frame into the template on
every pass. It sends only the text metadata index of the existing
display entity to the snapshot viewers as packets. Sends are
dirty-checked per entity. An animated hologram whose visible frame did
not change costs zero packets. The server-side entity text is left
untouched while the animator owns the line.

The loop is adaptive. It mirrors the legacy Gloss scheduler. It starts at `1000 / [holograms] maxAnimationFps` milliseconds (default 120 fps, so ~8 ms, clamped to at least 4 ms). It backs off by one floor step whenever a pass exceeds 1.25x its budget. It recovers by one step when it does not. It never exceeds 250 ms. The thread only exists while at least one fast-animated display is live. It exits by itself shortly after the last one goes away. `[holograms] animationPacketBudget` (default 20000) caps text packets per second per animated display. With large audiences the effective frame rate degrades in proportion. One hologram in a crowd cannot flood the connection. All three knobs hot-reload. `[debug] animator = true` logs the loop settled interval, target count and send count every 10 seconds.

The animator is gated on proximity before it is gated on anything else. A hologram with nobody inside `[holograms] viewRange` never spawns a display at all, so it never publishes an animator target, so the animator thread is never started. A hologram carrying a 125 fps clip on an empty server costs nothing: `/gloss status` reports it under `Holograms` with `0 entities`, no `Gloss Animator` thread exists, and `[debug] animator = true` prints nothing because there is no loop to report on. When the last viewer walks out of range the target is dropped and the thread exits shortly after. Frame rate is bought per audience, never per hologram.

If you set `[holograms] highFrequencyAnimations = false`, Gloss restores the previous behavior exactly. Every clip is substituted by the tick refresh. The animator thread stops.

## Block-art text

```
/gloss hologram rendertext banner "GLOSS" scale=2
```

This command rasterizes the text with the JVM logical monospaced font (antialiasing off). It creates a hologram whose lines are rows of `█` characters. `scale` multiplies the base 12 pt size. The result is clamped to 6 – 32 pt. A non-finite or non-positive scale is treated as `1`. A pixel is set when its average channel value exceeds 128.

The raster is cropped to its ink bounding box. It is capped at `[holograms] textArtMaxWidth` columns (default 48) and right-trimmed row by row. The exact shape depends on the JVM font rendering. The same command on two different hosts can produce slightly different art. If the raster comes out empty, nothing is created.

The result is an ordinary hologram document. You can edit it, move it and delete it like any other.

## Orphan cleanup

Every Gloss display carries the scoreboard tag `gloss_display` and the persistent data key `gloss:hologram`. At startup every loaded chunk is swept. Afterwards each `EntitiesLoadEvent` sweeps the chunk it loaded. Any tagged `TextDisplay` that the running service does not currently own is removed. Leftovers from a crash or a hard kill are purged. Displays are also spawned non-persistent. An orderly shutdown never writes them into the region files.

## Temporary holograms

Chat bubbles and damage indicators are built on temporary holograms. They are never written to disk. They are driven every `[holograms] temporaryUpdateIntervalTicks` (default 2). They can be position-bound and filtered to a whitelist or blacklist of viewers. Temporary holograms always render statically. Placeholder tokens in their lines are not resolved. Lines that contain fast animation clips ride the same high-frequency animator as persistent holograms. The audience snapshot honors the viewer whitelist or blacklist.

One chat message is one temporary `TextDisplay`. Its visible-character wrapper inserts newlines into that display instead of spawning one entity per row, so its formatting, background, position and lifetime remain one unit. BubbleStyle schema 2 can also bind translation, scale, three-axis rotation and opacity expressions to that display. These presentation values are applied on the entity-owning thread with the same dirty checks as position and text.

A moving temporary hologram is driven at that same tick cadence, but with `[holograms] interpolatedMotion` on (the default) the client is told to interpolate between drive ticks instead of snapping. Gloss sets the display teleport duration to `temporaryUpdateIntervalTicks` and then teleports on schedule; changing scale or rotation uses display transformation interpolation over the same cadence. This changes how the motion looks, not how often it is driven: raising `temporaryUpdateIntervalTicks` still means fewer position and presentation updates, just with longer client interpolation between them. Servers whose API does not expose the interpolation controls fall back to immediate updates automatically, with no configuration change needed.

Other plugins can create them directly. See [API: Getting Started](/gloss/21-api-getting-started). The features built on them are covered in [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops).

## Migrating pre-envelope hologram files

The v1 hologram shape was `{"id": ..., "world": ..., "x": ..., "y": ..., "z": ..., "lines": [...]}` with no envelope. On every boot Gloss scans `holograms/` and rewrites any file that has no `schemaVersion` key:

- the original bytes are copied to `import-backups/<yyyyMMdd-HHmmss>/holograms/<file>`
- `x`, `y`, `z` become `anchor.position` and `world` becomes `anchor.world`
- the embedded `id` key is dropped, so the file name is the only id from then on
- the rewritten file starts at `revision` 1

Files that already carry an envelope are skipped. That makes the pass a no-op on every boot after the first. `/gloss import legacy` runs the same pass on demand.
