---
title: "Holograms"
description: "Create, edit, position, and format persistent Gloss holograms"
published: true
date: 2026-10-08T15:12:00Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Each JSON file in `plugins/Gloss/holograms/` defines one persistent hologram. The file name is the hologram ID, and command or file edits apply live.

Hologram text, object lines and box parts share the limits in `[visibility]`. Each entity shown to one viewer consumes one unit; a world display shown to ten viewers consumes ten units. Existing groups reconcile their membership and admission on each refresh; a refused group stays hidden and retries on its next refresh. Reduced and minimal detail omit boxes and particle layers; culled detail hides the hologram. Text and object-line groups are admitted independently of optional boxes. World displays require a server API that can hide an entity before viewer admission; Gloss does not publish a display when that capability fails.

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
| `viewDistance` | no | Viewing radius in blocks, default `48`, range `4`–`128` |
| `refreshTicks` | no | Ordinary text refresh interval, default `10`, range `1`–`200` ticks |
| `refresh` | no | Optional independent `contentTicks`, `visibilityTicks`, and `motionTicks`, each `1`–`1200` |
| `style` | no | Shared display style. An omitted object uses `center` billboard, see-through text, unit XYZ scale, transparent text background and full opacity |
| `box` | no | Optional measured panel with a complete perimeter; disabled by default |
| `yaw` | no | Finite degrees from `-180` through `180`; defaults to `0` |
| `pitch` | no | Finite degrees from `-90` through `90`; defaults to `0` |
| `particleLayers` | no | Up to 64 viewer-targeted layers; absent or `null` becomes an empty list |

There is no `id` key. The document id is the file name with `.json` removed, so renaming the file renames the hologram. Only files directly inside `holograms/` are read. If an edit is invalid, Gloss logs the reason and keeps the last valid version active.

> If you delete the file, Gloss despawns the hologram and unregisters it. There is no undo and no backup for a hand-deleted file.
{.is-warning}

### Visibility

Set document-level `"show": false` to hide the hologram, or use a boolean expression to decide per viewer. Gloss reevaluates viewer conditions on the viewer's owning region and hides text, decorations and particles when false, even when the lines are static or `perViewerPlaceholders` is off. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

### The default

`/gloss hologram create` starts with `&dNew hologram`, `seeThrough` enabled, scale `1.0`, `CENTER` billboard mode, and no particle layers.

## Mixed lines and pages

<div class="gloss-demo" data-demo="holograms-pov">
<p><strong>Mixed hologram lines and pages</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/holograms-pov.webm" aria-label="Mixed hologram lines and pages, first person" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/gloss-assets/demos/holograms-observer.webm" aria-label="Mixed hologram lines and pages, third person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="native-object-bounds-pov">
<p><strong>Heads and scaled entity lines</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/native-object-bounds-pov.webm" aria-label="Heads and scaled entity lines, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="hologram-mixed-editor">
<p><strong>Mixed hologram authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/hologram-mixed-editor.webm" aria-label="Mixed hologram authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="hologram-editor">
<p><strong>Hologram text and pages authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/hologram-editor.webm" aria-label="Hologram text and pages authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A line can be a string or an object with exactly one content key: `text`, `item`, `head`, `block`, or `entity`. Item content uses the [icon contract](/gloss/11-icons); the other object values are strings. Object lines accept `show` as a boolean or viewer expression and `scale` from `0.01` to `64`, default `1`.

Lines run from top to bottom in authored order, above the hologram's anchor. Object rows reserve space according to their size and the text's vertical scale; blocks are centered in their reserved row. Living entity scales clamp to the client's `0.0625`–`16` range; nonliving entities require scale `1`. Entity rows reserve space across tilted views, and upright entities face their viewer. Chicken spacing follows its visible model; other entity types use native collision dimensions to estimate their row bounds. Changing text scale recalculates that spacing.

```json
"lines": [
  {"item": {"type": "item", "item": "minecraft:diamond", "count": 1}, "scale": 0.5},
  "&bTreasure",
  {"entity": "minecraft:pig", "show": "viewer.gameMode == 'creative'"}
]
```

Text and objects retain their authored row order. Each object reserves space for its authored scale in the text layout, including when its condition hides it, so conditional objects do not shift neighboring rows.

For multiple pages, replace `lines` with `pages`. Each page needs a unique `id` and nonempty `lines`, and accepts its own `show`. A document supports up to 64 pages. Each viewer starts on the first visible page; navigation skips hidden pages and wraps. With no visible page, the hologram is hidden.

```json
"pages": [
  {"id": "welcome", "lines": ["Welcome"]},
  {"id": "creative", "show": "viewer.gameMode == 'creative'", "lines": ["Creative tools"]}
]
```

Use `/gloss hologram page id=spawn page=next player=Alex`, `page=prev`, or an exact page id. `actions` accepts up to 32 [actions](/gloss/12-actions); a hologram with actions creates an interaction box. `hitbox.width` defaults to `1.2`, `height` to `0.35`, and `perLine` to `false`. Width and height must be positive and at most `64`.

## Conditional variants

`variants` selects a presentation independently for each viewer. Each entry has a unique `id`, optional `priority` (default `0`, clamped to `-1000`–`1000`), a boolean expression in `when`, and a `presentation`. Up to 64 variants are allowed. The first matching variant wins, ordered by descending priority then ascending id; without a match, the base presentation applies.

A presentation can replace `lines`, `style`, `box`, and `particleLayers`. Omitted fields inherit the base or current page; explicit empty arrays clear lines or particles. Conditions and selected presentations update while the viewer remains nearby.

```json
"variants": [{
  "id": "creative",
  "priority": 10,
  "when": "viewer.gameMode == 'creative'",
  "presentation": {"lines": ["&bCreative tools"]}
}]
```

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

Style, orientation and visibility edits apply to the existing display, and box geometry follows text, animation frames, orientation and scale. Ordinary text refreshes every document `refreshTicks` (default 10, range 1–200); clock expressions and named animations can refresh every tick. Optional `refresh.contentTicks` sets the interval for dynamic content, `refresh.visibilityTicks` sets condition and presentation selection intervals, and `refresh.motionTicks` sets object-line and box update intervals. Each accepts 1–1200 ticks. Omitted fields retain the normal cadence. Conditional lines may refresh sooner when needed for visibility. Particle emission and animation playback retain their own clocks; direct document edits apply without waiting for these intervals. Empty holograms and holograms in unloaded worlds do not render. Lines are rendered by the shared text pipeline described on [Emoji, Text & Animations](/gloss/07-emoji-text-animations#the-text-pipeline).

`[features] holograms = false` despawns every hologram on the next driver tick. Documents still load, hot-reload and accept command edits. Nothing renders.

With `[holograms] perViewerPlaceholders = true`, each nearby player sees their own placeholder and viewer-expression values; viewer-independent text stays shared. Set it to `false` and player-only values stay unresolved unless a dynamic `show` or conditional variant needs per-viewer rendering.

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

## Import

`/gloss import legacy mode=preview` lists conversions of old hologram files without writing. `/gloss import legacy mode=apply` validates the complete import and saves the original files under `editor-sync-backups/<transaction>/backup/holograms/` before replacing them. Current envelopes remain unchanged. Resolve reported conversion errors or conflicts before applying.

## World markers

<div class="gloss-demo" data-demo="markers-waypoints-pov">
<p><strong>World markers and waypoints</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/markers-waypoints-pov.webm" aria-label="World markers and waypoints, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="marker-editor">
<p><strong>Marker authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/marker-editor.webm" aria-label="Marker authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Marker parts use the `MARKER` limits in `[visibility]`, including every image row in an icon. Reduced detail keeps the label and icon; minimal detail keeps the label; culled detail hides the marker. Beams, edge arrows and particle trails require full detail. Native locator entries have no display-entity cost.

Files in `markers/<id>.json` use schema 1 and require an `anchor`. A fixed anchor has `world`, `x`,
`y`, and `z`; a following anchor has either a player account name in `player` or an entity UUID in
`entity`. Specify exactly one anchor form. Following locations are captured on the target entity’s owning region and shared between viewers; the `[markers]` anchor settings control their refresh interval, maximum age, and cache size. An unavailable or expired target hides until a fresh capture succeeds.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "anchor": {"world": "world", "x": 24, "y": 72, "z": 16},
  "label": "Meeting point",
  "icon": {"type": "item", "item": "minecraft:compass", "count": 1},
  "lifetimeTicks": 200,
  "edge": {"enabled": true, "margin": 0.8, "arrow": "&f>"}
}
```

`icon` accepts the shared [icon types](/gloss/11-icons) and renders above the anchor. Its position
and size follow `distanceScale`. `label` accepts Gloss text formatting and expressions. The marker’s
`style` and `box` control its label display and border, using the shared [icon style](/gloss/11-icons#display-style-and-boxes).

`beam` accepts `enabled`, `height` (default 48, range 1–384), `width` (default 0.25, range
0.02–8), a block `material`, and optional `glowColor` in `#RRGGBB`. `trail` accepts `enabled`,
`particle` (default `minecraft:end_rod`), `spacing` (default 2, range 0.25–16), `maxPoints`
(default 48, range 1–256), and `color` in `#RRGGBB` (default white). Trail color applies to dust;
particles without color data retain their native color. Trails refresh as the viewer moves.

`lifetimeTicks` defaults to 0 for unlimited duration; a positive value starts when the marker is
first offered to that viewer, including while hidden or out of range, and removes its label,
icon, beam and edge indicator when it expires. Moving or editing the marker does not restart it;
changing its duration or removing and reintroducing it does. Expiry is checked every 10 ticks.

`edge.arrow` is a right-pointing glyph. Gloss rotates it toward the marker's off-screen direction.
An empty arrow hides the indicator. `show`, audience conditions, `hideWithin`, and `maxDistance`
control visibility without pausing its lifetime.

## Waypoints

<div class="gloss-demo" data-demo="waypoint-editor">
<p><strong>Waypoint authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/waypoint-editor.webm" aria-label="Waypoint authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Files in `waypoints/<id>.json` describe native locator-bar entries for Java clients from 1.21.6 onward. They use the same fixed, player-following, or entity-following anchor forms as world markers. Valid edits reload automatically, including icon colors and styles for connected viewers; deleting a file withdraws its locator entry.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "anchor": {"world": "world", "x": 24, "y": 72, "z": 16},
  "color": "#e6b84c",
  "style": "default",
  "range": 128,
  "show": true
}
```

`style` accepts `default`, `bowtie`, or a namespaced style such as `trails:quest` declared in [resource-pack waypoint styles](/gloss/28-resource-packs#waypoint-styles). Custom styles appear after the viewer loads the current Gloss pack; `fallbackStyle` selects `default` or `bowtie` while the style or pack is unavailable. `range` defaults to zero for an exact position; crossing a positive range switches between an exact position and direction only without requiring a reconnect. `show` and `audience.when` limit which viewers receive the entry. Enable the waypoint module in `gloss.toml`; Bedrock clients do not receive locator-bar packets.

`/gloss waypoint set <name>` saves a player's current position, and `/gloss waypoint remove <name>` deletes that personal entry; both require `gloss.waypoints.self`. `/gloss waypoint list` requires `gloss.waypoints.list`. `/gloss waypoint info <id>` inspects a file-backed entry and requires `gloss.waypoints.info`. Plugin authors can register viewer-specific entries with `Waypoints.track(...)`; see [API: Getting Started](/gloss/21-api-getting-started).
