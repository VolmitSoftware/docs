---
title: "Holograms"
description: "Gloss documentation: Holograms"
published: true
date: 2026-08-26T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Holograms are `TextDisplay` entities driven from enveloped JSON documents in `plugins/Gloss/holograms/`. One file is one hologram. The file name is its id. Commands and on-disk edits both apply live. Every line runs through the full text pipeline: functions, placeholders, emoji, then colors.

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

A document that fails to parse is logged as `holograms/<id>.json <reason>` and skipped. The copy Gloss already had in memory stays live. A bad edit does not delete a working hologram. It stops applying until the file parses again.

> If you delete the file, Gloss despawns the hologram and unregisters it. There is no undo and no backup for a hand-deleted file.
{.is-warning}

### The shipped baseline

`/gloss hologram create` seeds its line from `baselines/hologram.json` inside the jar. That schema-2 baseline is read on demand. It is **never** extracted to the data folder. There is no baseline file to edit. Its line list is a single `&dNew hologram`, with `seeThrough` enabled, scale `1.0` and an empty `particleLayers` array. It omits the orientation keys, so new holograms use `CENTER`, yaw `0` and pitch `0`.

## Particle layers

A persistent hologram can frame the complete text, one one-based line, a named authored span or explicit local geometry. Billboarded layers calculate their plane independently for each viewer; fixed layers use the hologram orientation. For example, this text and layer place green dust behind the character cells occupied by the dark-red word:

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

Every command edit publishes a new document revision. One keyed slot per hologram retains the
latest pending state for the single background IO thread, so rapid edits do not grow an unbounded
write queue. A delete supersedes older queued writes and a stale deleted object cannot recreate its
file. The folder watcher compares each changed file SHA-256 against the hash Gloss just wrote. A
command edit never bounces back through the hot-reload path. Hot reload itself is covered in [Data
Files & Hot Reload](/gloss/03-data-files).

## Rendering

Each display is spawned non-persistent with the document's uniform native scale, billboard, yaw,
pitch and `seeThrough` values, and with no shadow. The shipped baseline uses scale `1.0`, `CENTER`,
yaw `0`, pitch `0` and see-through enabled. Editing scale or any orientation key hot-reloads the
existing display without respawning it. Its client view range is set to `[holograms] viewRange`
divided by the 64-block Paper base. Ordinary text refreshes every `[holograms]
updateIntervalTicks` (default 10). If any persistent hologram contains a clock-driven expression or
complete named-animation token, the persistent driver samples every tick until that content is
removed. Text is only re-sent when the rendered string actually changed.

Spawning requires the anchor chunk to be loaded. An unloaded chunk retries on later ticks. A hologram whose world is not loaded, or whose `lines` list is empty, despawns its display. It renders nothing until that changes. If you move the anchor, Gloss teleports the existing display. It does not respawn it.

If you set `[features] holograms = false`, Gloss despawns every hologram on the next driver tick. Documents still load and hot-reload. The commands still edit them. Nothing renders.

### Shared and personalized modes

When a line contains a complete `%name%` placeholder, viewer-backed expression, or non-animation
`|function|` token and `[holograms] perViewerPlaceholders` is on (the default), the hologram switches
to per-viewer rendering. A named animation also switches when any of its clip frames contains one
of those viewer dependencies. The hologram still owns one real `TextDisplay`, whose server-side
text is blank. Every player in the anchor world within `[holograms] viewRange` receives text
metadata for that same entity id with player variables, PlaceholderAPI and viewer-aware functions
resolved for that player. Leaving the configured range clears that player's metadata, while join,
teleport, world-change, respawn and a bounded reconciliation sweep repair client retracking. This
keeps the server entity count at one per persistent hologram rather than one per viewer. A player
who tracks the entity without an addressed update sees only its blank authoritative text.

Plain viewer-independent lines use shared text on that one display. Functions, expressions, emoji and colors still apply in that static context. If you set `[holograms] perViewerPlaceholders = false`, Gloss forces shared mode; player-backed values then remain unresolved, while native server/time values and explicit fallbacks still work. Removing the last complete dynamic token switches the entity back to shared text. A lone percent sign such as `100%` does not enable personalized metadata.

Persistent and temporary hologram displays use the native maximum line width of `16384`, so Gloss does not impose automatic wrapping or character termination. Authored entries remain separate logical lines, and an explicit legacy reset between them prevents `&k` and other styles from bleeding into the next line.

### The line pipeline

Each line is rendered in this order:

1. `|function|` tokens, including `|animation.<id>|`, when `[text] functions` is on.
2. Inline `{{ expression }}` blocks, with the standard time, server, player, PAPI and metric facilities available for the current context.
3. PlaceholderAPI placeholders, when `[text] placeholders` is on **and** a viewer is present. Shared displays and temporary holograms have no viewer, so they skip this step.
4. Emoji replacement.
5. Colors: `[RRGGBB]` bracket hex first, then `&` codes.

Animation frames substitute on every refresh. For tick-driven clips the visible frame rate is bounded by `[holograms] updateIntervalTicks`. Clips faster than 20 fps are driven by the high-frequency animator below. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations) and [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Animation and text-pipeline reload generations invalidate compiled hologram templates, including a
clip replaced under the same id. Literal segments are memoized only when they are independent of
time, functions and viewer state, so a dynamic expression beside an animation keeps updating.

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

The loop is adaptive. It mirrors the legacy Gloss scheduler. It starts at `1000 / [holograms] maxAnimationFps` milliseconds (default 120 fps, so ~8 ms, clamped to at least 4 ms). It backs off by one floor step whenever a pass exceeds 1.25x its budget. It recovers by one step when it does not. It never exceeds 250 ms. The thread only exists while hologram text work is pending and exits by itself shortly after the last target or personalized update goes away. `[holograms] animationPacketBudget` (default 20000) is a hard recipient ceiling shared by fast animation frames, personalized metadata updates and personalized clears. The loop rotates fairly across targets and coalesces each pending viewer/entity update to its latest text; large aggregate audiences therefore degrade animation frame rate instead of multiplying the ceiling. All three knobs hot-reload. `[debug] animator = true` emits a `FINE` diagnostic with the settled interval, target count and send count every 10 seconds; it does not add routine `INFO` traffic.

The animator is gated on proximity before it is gated on anything else. A hologram with nobody inside `[holograms] viewRange` never spawns a display at all, so it never publishes an animator target, so the animator thread is never started. A hologram carrying a 125 fps clip on an empty server costs nothing: `/gloss status` reports it under `Holograms` with `0 entities`, no `Gloss Animator` thread exists, and `[debug] animator = true` prints nothing because there is no loop to report on. When the last viewer walks out of range the target is dropped and the thread exits shortly after. Every target-recipient pair draws from one server-wide animation budget.

If you set `[holograms] highFrequencyAnimations = false`, Gloss restores the previous behavior exactly. Every clip is substituted by the tick refresh. The animator thread stops.

## Native text scaling

```
/gloss hologram rendertext banner "GLOSS" scale=2
```

This command stores `GLOSS` as one ordinary hologram line and applies `scale=2` directly to the
single `TextDisplay` entity's transformation. The client renders its normal font at twice the
display size; Gloss does not convert glyphs into block characters or create one entity per pixel.
Scale must be finite and between `0.05` and `16.0`. Blank text or a scale outside that range creates
nothing.

The result is an ordinary hologram document. You can edit its text, scale, position and
orientation on disk, and move or delete it by command like any other hologram.

## Orphan cleanup

Every Gloss display carries the scoreboard tag `gloss_display` and the persistent data key `gloss:hologram`. At startup loaded chunks are queued and swept at no more than 32 chunks per tick. Afterwards each `EntitiesLoadEvent` sweeps the chunk it loaded. Any tagged `TextDisplay` that the running service does not currently own is removed. Leftovers from a crash or a hard kill are purged. Displays are also spawned non-persistent. An orderly shutdown never writes them into the region files.

## Temporary holograms

Chat bubbles and damage indicators are built on temporary holograms. They are never written to
disk. They are driven every `[holograms] temporaryUpdateIntervalTicks` (default 2). They can be
position-bound and filtered to a whitelist or blacklist of viewers. Each binding names its source
entity; Gloss samples the supplier on that entity's owner scheduler, and samples position plus
presentation together when both use the same owner. Temporary holograms always render statically.
Placeholder tokens in their lines are not resolved. Lines that contain fast animation clips ride
the same high-frequency animator as persistent holograms. During one temporary-driver pass,
effects in the same 16-block spatial cell and with the same range reuse one immutable audience
snapshot. Players guaranteed to be in range for every anchor in that cell are reused directly;
only cell-edge candidates receive an exact distance check for the individual anchor. A nonempty
whitelist or blacklist is then applied to that exact audience. This keeps a new animated temporary
populated on its first drive without repeating a 1,000-player index query for every clustered
effect or exposing an out-of-range player. A temporary with no exact eligible nearby viewer defers
its spawn and retries on later drives.
On servers without the visible-by-default entity API, a whitelist performs one full reconciliation
when the mode or display resets. Later drives apply only membership diffs, while player lifecycle
events reconcile the joining or moving player directly instead of rescanning the online roster for
every temporary.

One chat message is one temporary `TextDisplay`. Its visible-character wrapper inserts newlines into that display instead of spawning one entity per row, so its formatting, background, position and lifetime remain one unit. BubbleStyle schema 4 can also bind translation, scale, three-axis rotation and opacity expressions and particle layers to that display. These presentation values are applied on the entity-owning thread with the same dirty checks as position and text.

A moving temporary hologram is driven at that same tick cadence, but with `[holograms] interpolatedMotion` on (the default) the client is told to interpolate between drive ticks instead of snapping. Gloss sets the display teleport duration to `temporaryUpdateIntervalTicks` and then teleports on schedule; changing scale or rotation uses display transformation interpolation over the same cadence. This changes how the motion looks, not how often it is driven: raising `temporaryUpdateIntervalTicks` still means fewer position and presentation updates, just with longer client interpolation between them. Servers whose API does not expose the interpolation controls fall back to immediate updates automatically, with no configuration change needed.

Temporary holograms also accept particle layers through the inherited API. Authored lines retain named span metadata; already-rendered frames do not. Other plugins can create them directly. See [API: Getting Started](/gloss/21-api-getting-started) and [Particle Layers](/gloss/25-particle-layers). The features built on them are covered in [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops).

## Migrating pre-envelope hologram files

Schema 2 is also a hard break from the former schema-1 envelope. A schema-1 hologram is silently
ignored; rewrite it as schema 2 and add `"particleLayers": []` when no effect is wanted. The legacy
import command below handles only the older envelope-less shape and is not a schema upgrader.

The pre-envelope hologram shape was `{"id": ..., "world": ..., "x": ..., "y": ..., "z": ..., "lines": [...]}`. Startup no longer scans or rewrites it; an unversioned document is silently ignored. Convert it only through the explicit legacy import command:

- the original bytes are copied to `import-backups/<yyyyMMdd-HHmmss>/holograms/<file>`
- `x`, `y`, `z` become `anchor.position` and `world` becomes `anchor.world`
- the embedded `id` key is dropped, so the file name is the only id from then on
- the rewritten file starts at `revision` 1

Files that already carry an envelope are skipped. That makes the pass a no-op on every boot after the first. `/gloss import legacy` runs the same pass on demand.
