---
title: "Holograms"
description: "Gloss documentation: Holograms"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Holograms are `TextDisplay` entities driven from enveloped JSON documents in `plugins/Gloss/holograms/`.
One file is one hologram and the file name is its id. Commands and on-disk edits both apply live, and
every line runs through the full text pipeline: functions, placeholders, emoji, then colors.

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
  ]
}
```

| Key | Required | Notes |
|---|---|---|
| `schemaVersion` | yes | Must be `1`. Anything else rejects the file with `unsupported holograms schemaVersion: <n>` |
| `revision` | yes | `1` to `9007199254740991`. Gloss owns this value and bumps it by one on every write it makes |
| `anchor.world` | yes | World folder name. Missing or blank rejects the file with `hologram anchor requires a world` |
| `anchor.position` | yes | `[x, y, z]` array of doubles. Missing rejects the file with `hologram anchor requires a position` |
| `lines` | no | Absent or `null` becomes an empty list; a `null` entry becomes an empty string |

There is no `id` key. The document id is the file name with `.json` removed, so renaming the file renames
the hologram. Only files directly inside `holograms/` are read; subfolders are ignored.

A document that fails to parse is logged as `holograms/<id>.json <reason>` and skipped. The copy Gloss
already had in memory stays live, so a bad edit does not delete a working hologram — it just stops
applying until the file parses again.

> Deleting the file despawns the hologram and unregisters it. There is no undo and no backup for a
> hand-deleted file.
{.is-warning}

### The shipped baseline

`/gloss hologram create` and `/gloss hologram rendertext` seed new holograms from `baselines/hologram.json`
inside the jar. That baseline is read on demand and is **never** extracted to the data folder, so there is
no baseline file to edit. Its line list is a single `&dNew hologram`.

## Creating and editing by command

```
/gloss hologram create <id>
/gloss hologram addline <id> "&dWelcome to spawn"
/gloss hologram setline <id> 2 "%player_name%"
/gloss hologram move <id> y=0.5
/gloss hologram rendertext <id> "GLOSS" scale=2
```

Required arguments are positional in the order shown. Optional arguments must be written as `key=value`
(`x=`, `y=`, `z=`, `scale=`); a stray positional value is rejected. Quote any text containing spaces.

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

Line numbers start at 1. `create`, `movehere`, `tp` and `rendertext` are player-only. Every node above is
reachable both as `/gloss hologram ...` and through the root command `/hologram` (aliases `holo`, `h`);
`/gloss holo` and `/gloss h` work as well.

Ids may not contain `/`, `\` or `..`. Spaces are allowed but become part of the file name.

Every command edit rewrites the document with `revision` bumped by one. Writes are queued onto a single
background IO thread, and the folder watcher compares each changed file's SHA-256 against the hash Gloss
just wrote, so a command edit never bounces back through the hot-reload path. Hot reload itself is covered
in [Data Files & Hot Reload](/gloss/03-data-files).

## Rendering

Each display is spawned non-persistent with a `CENTER` billboard, no shadow and no see-through, and its
client view range is set to `[holograms] viewRange` divided by the 64-block Paper base. Text is refreshed
every `[holograms] updateIntervalTicks` (default 10) and is only re-sent when the rendered string actually
changed.

Spawning requires the anchor chunk to be loaded; an unloaded chunk simply retries on later ticks. A
hologram whose world is not loaded, or whose `lines` list is empty, despawns every display it owns and
renders nothing until that changes. Moving the anchor teleports the existing displays rather than
respawning them.

Setting `[features] holograms = false` despawns every hologram on the next driver tick. Documents still
load and hot-reload and the commands still edit them; nothing renders.

### Shared and per-viewer modes

When **any** line contains a `%` character and `[holograms] perViewerPlaceholders` is on (the default), the
hologram switches to per-viewer rendering. Every player in the anchor's world within `[holograms] viewRange`
blocks of the anchor gets a private `TextDisplay` whose placeholders resolve for that player. The copy is
hidden from everyone else through the entity's visible-by-default flag where the server API exposes it, and
otherwise by per-player hide calls issued at spawn time. Players who leave the range lose their copy.

Without a `%`, one shared display is rendered for everybody. Functions, emoji and colors still apply, but
placeholder tokens are left in the text exactly as written. Setting `[holograms] perViewerPlaceholders = false`
forces this shared mode for every hologram, so lines with `%` render once for everyone with the tokens
unresolved. Removing the last `%` from a per-viewer hologram collapses it back to a single shared display.

### The line pipeline

Each line is rendered in this order:

1. `|function|` tokens, including `|animation.<id>|`, when `[text] functions` is on.
2. PlaceholderAPI placeholders, when `[text] placeholders` is on **and** a viewer is present. Shared
   displays and temporary holograms have no viewer, so they skip this step.
3. Emoji replacement.
4. Colors: `[RRGGBB]` bracket hex first, then `&` codes.

Animation frames substitute on every refresh, so the visible frame rate is bounded by
`[holograms] updateIntervalTicks`. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations) and
[Expressions & Placeholders](/gloss/13-expressions-placeholders).

## Block-art text

```
/gloss hologram rendertext banner "GLOSS" scale=2
```

Rasterizes the text with the JVM's logical monospaced font (antialiasing off) and creates a hologram whose
lines are rows of `█` characters. `scale` multiplies the base 12 pt size and the result is clamped to
6 – 32 pt; a non-finite or non-positive scale is treated as `1`. A pixel is set when its average channel
value exceeds 128.

The raster is cropped to its ink bounding box, capped at `[holograms] textArtMaxWidth` columns (default 48)
and right-trimmed row by row. The exact shape depends on the JVM's font rendering, so the same command on
two different hosts can produce slightly different art. If the raster comes out empty nothing is created.

The result is an ordinary hologram document — editable, movable and deletable like any other.

## Orphan cleanup

Every Gloss display carries the scoreboard tag `gloss_display` and the persistent data key `gloss:hologram`.
At startup every loaded chunk is swept, and afterwards each `EntitiesLoadEvent` sweeps the chunk it loaded.
Any tagged `TextDisplay` that the running service does not currently own is removed, so leftovers from a
crash or a hard kill are purged automatically. Displays are also spawned non-persistent, so an orderly
shutdown never writes them into the region files in the first place.

## Temporary holograms

Chat bubbles and damage indicators are built on temporary holograms. They are never written to disk, they
are driven every `[holograms] temporaryUpdateIntervalTicks` (default 2), and they can be position-bound and
filtered to a whitelist or blacklist of viewers. Temporary holograms always render statically, so
placeholder tokens in their lines are not resolved.

Other plugins can create them directly — see [API: Getting Started](/gloss/21-api-getting-started). The
features built on them are covered in [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops).

## Migrating pre-envelope hologram files

The v1 hologram shape was `{"id": ..., "world": ..., "x": ..., "y": ..., "z": ..., "lines": [...]}` with no
envelope. On every boot Gloss scans `holograms/` and rewrites any file that has no `schemaVersion` key:

- the original bytes are copied to `import-backups/<yyyyMMdd-HHmmss>/holograms/<file>`;
- `x`, `y`, `z` become `anchor.position` and `world` becomes `anchor.world`;
- the embedded `id` key is dropped, so the file name is the only id from then on;
- the rewritten file starts at `revision` 1.

Files that already carry an envelope are skipped, which makes the pass a no-op on every boot after the
first. `/gloss import legacy` runs the same pass on demand.
