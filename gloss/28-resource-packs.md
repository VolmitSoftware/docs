---
title: "Resource Packs & Glyph Fonts"
description: "Author bitmap glyphs, build named fonts, and deliver the Gloss resource pack"
published: true
date: 2026-10-07T22:10:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-10-07T00:00:00.000Z
---

Gloss builds Java resource packs from PNG images and `glyphs/*.json` documents. Glyph expressions use the declared font only after the viewer reports the current Gloss pack successfully loaded. Other viewers receive the declared text fallback.

In the [web editor](/gloss/18-web-editor), create a **Glyphs** document or open one with `/gloss web edit glyph <id>`. Its inspector edits font identity, bitmaps, overlays, spacing, and waypoint styles. Import PNG files through the image manager and use their paths relative to `images/`. Code view provides the same fields with validation and completion; exporting and live sync retain additional authored fields.

## Enable and deliver a pack

Set `[features] forge = true` in `gloss.toml`. Put PNG files under `images/` and create a glyph document. `/gloss forge build` prepares the pack in the background and reports success or failure when it finishes; simultaneous build requests share the pending build. File changes also trigger a build after `[forge] buildDebounceTicks` without further changes (five seconds by default).

| `[forge]` setting | Default | Meaning |
| --- | --- | --- |
| `url` | `""` | Public download URL; `{sha1}` expands to the current pack hash |
| `serve` | `false` | Start the embedded HTTP pack listener |
| `serveBind` | `"0.0.0.0"` | Listener bind address |
| `servePort` | `8085` | Listener port, clamped to `1024`–`65535` |
| `listenerThreads` | `4` | Concurrent HTTP workers, clamped to `1`–`32` |
| `listenerBacklog` | `32` | Connection backlog and bounded queued HTTP work, clamped to `1`–`4096` |
| `buildDebounceTicks` | `100` | Quiet ticks before a file-change rebuild, clamped to `1`–`1200` |
| `buildQueueCapacity` | `1` | Waiting build/export jobs behind the active job, clamped to `1`–`64`; restart to change |
| `required` | `false` | Mark the Java pack request as required; the client disconnects if it declines |
| `prompt` | `"Gloss glyphs and icons"` | Text shown with the pack request |
| `packFormat` | `0` | Positive values override the resource-pack format; zero uses the server-version table |
| `codepointBase` | `57344` | Starting private-use codepoint, clamped to `57344`–`63488` |

For external hosting, upload `forge/out/gloss-pack.zip` to the configured URL after building it. For the embedded listener, choose an address and port reachable by your players; a wildcard bind is not a public hostname. A configured `url` takes precedence over the listener's inferred URL.

The mergeable pack tree is `forge/out/pack/`; the ZIP and hash are `forge/out/gloss-pack.zip` and `forge/out/gloss-pack.sha1`. The listener serves immutable hash-addressed ZIPs retained under `forge/out/artifacts/`. Keep `forge/ledger.json` with server backups: it preserves existing glyph codepoints when files are reordered or edited. Raising `codepointBase` affects future allocations and does not renumber existing entries.

## Glyph documents

This example declares two glyphs in `glyphs/hud.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "namespace": "example",
  "font": "hud",
  "glyphs": [
    {
      "id": "coin",
      "image": "icons/coin.png",
      "height": 8,
      "ascent": 7,
      "fallback": "$",
      "emoji": "coin"
    },
    {
      "id": "meter",
      "image": "hud/meter.png",
      "height": 8,
      "ascent": 7,
      "frames": 8,
      "fallback": "|"
    }
  ],
  "space": { "enabled": true, "range": [-256, 256] },
  "overlays": []
}
```

`namespace` defaults to `gloss`; `font` defaults to `glyphs`. Both use lowercase letters, digits, underscores, dots, and hyphens. Different documents can target different fonts in the same pack. Documents targeting the same font contribute providers to that font. Glyph IDs remain unique across all documents and fonts.

| Glyph field | Default | Accepted values |
| --- | --- | --- |
| `id` | Required | At most 64 lowercase letters, digits, underscores or hyphens; starts with a letter or digit |
| `image` | Required | Relative `.png` path inside `images/`, without traversal or symlink escape |
| `height` | `8` | Declared display height from `1` through `256` pixels |
| `ascent` | `height - 1` | Vertical offset at or below `height`; negative values are allowed |
| `fallback` | `""` | Text for viewers without the current loaded Java pack |
| `emoji` | Absent | Emoji ID to substitute with this glyph for pack viewers |
| `width` | Derived from image | Optional advance-width override from `0` through `1024` for Gloss text measurements |
| `frames` | `1` | `1`–`256` equal-width horizontal cells; image width must divide evenly |

Each document accepts at most 1024 glyphs and overlays combined. Gloss accepts font PNGs up to 256 pixels tall, subject also to `[images] maxFileBytes`, `maxDimension`, and `maxPixels`. The configured text raster limit does not restrict glyph textures. A `width` override changes Gloss measurements; it does not change how the client rasterizes the bitmap.

The space provider accepts a `[minimum, maximum]` range within `-256`–`256`. The combined range from enabled documents is available in every generated font. `shift()` uses the font of the first document by filename.

## Use glyphs in text and menus

Use these expressions anywhere Gloss supports expressions:

```text
{{ glyph('coin') }} Balance
{{ shift(8) }}Indented
{{ at(32, 'Label') }}
{{ meter('meter', 6, 8) }}
{{ overlay('frame') }}
```

| Function | Result |
| --- | --- |
| `glyph(id)` | First cell of the named glyph, or its fallback |
| `shift(pixels)` | Horizontal movement using space glyphs; whole numbers within `-4096`–`4096`; empty without the pack |
| `at(pixels, text)` | Places text at an offset, then restores the measured cursor position; plain text without the pack |
| `meter(id, value, maximum)` | Uses the first and last sheet cells as empty/full segments; segment count is `frames`; repeats fallback for filled segments without the pack |
| `overlay(id)` | Renders the named overlay's bitmap at the text position; empty without the pack |

`frames` supplies cells; it does not make the font animate automatically. Use Gloss text animations or expressions to change text over time. Resource-pack glyphs cannot add arbitrary interactive screen widgets or change the client's input rules.

A `textImage` menu icon whose path matches a declared glyph uses one text display for a viewer with the loaded pack. Other viewers use the configured text raster when the source fits `[images] rasterMaxDimension`, otherwise the checkerboard. Animated text-image icons use their separate image frames and the text raster path.

Use `pack.loaded`, `pack.status`, and `pack.sha1` in expressions to select a presentation. `pack.loaded` becomes true only for a successful response to the current offered Gloss pack. Acceptance or download in progress is not success. Rebuilding invalidates old statuses, and delayed responses to older offers do not authorize the new glyphs. Gloss does not offer this Java resource pack to detected Bedrock viewers.

## Overlays

An overlay uses `id`, `image`, `height`, `ascent`, and `anchor`:

```json
{
  "id": "frame",
  "image": "hud/frame.png",
  "height": 64,
  "ascent": 60,
  "anchor": "bottom"
}
```

`anchor` accepts `top`, `center`, or `bottom` and defaults to `center`. It records the declared alignment; `overlay()` itself renders at the current text position using `height` and `ascent`. Use `at()` and the destination surface's positioning settings to place it.

## Commands

| Command | Permission | Result |
| --- | --- | --- |
| `/gloss forge build` | `gloss.forge.build` | Prepare and publish the current glyph pack |
| `/gloss forge status` | `gloss.forge` | Show documents, glyphs, spaces, pack hash and delivery state |
| `/gloss forge export <path>` | `gloss.forge.export` | Copy the mergeable pack tree in the background |
| `/gloss forge serve <on\|off>` | `gloss.forge.serve` | Start or stop the embedded listener; configuration controls the next startup |
| `/gloss forge reset [name=*]` | `gloss.forge.reset` | Restore a shipped glyph document or all shipped glyph documents |

Font providers belong to the Java resource pack; see Mojang's [font-provider reference changes](https://feedback.minecraft.net/hc/en-us/articles/15245037698701-Minecraft-Java-Edition-Snapshot-23w17a). Java pack status notifications identify the pack request, as documented by the [Bukkit resource-pack status API](https://jd.papermc.io/paper/26.1.2/org/bukkit/event/player/PlayerResourcePackStatusEvent.html).

## Waypoint styles

Add `waypointStyles` to a `glyphs/<id>.json` document to supply native locator-bar sprites. The style uses the document’s namespace and a stable style ID; sprites use that same namespace. Each sprite ID must map to the same source image wherever it is reused.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "namespace": "trails",
  "waypointStyles": [
    {
      "id": "quest",
      "nearDistance": 128,
      "farDistance": 332,
      "sprites": [
        {"id": "quest-near", "image": "waypoints/quest-near.png"},
        {"id": "quest-far", "image": "waypoints/quest-far.png"}
      ]
    }
  ]
}
```

`nearDistance` defaults to 128 blocks; `farDistance` defaults to 332 and must exceed `nearDistance`. Distances must be finite and nonnegative. A style declares 1–64 ordered sprites, and a glyph document may contain up to 128 styles. PNG files use the configured `[images]` source limits. Style and sprite IDs use lowercase letters, digits, underscores and hyphens, start with a letter or digit, and contain at most 64 characters.

Set a waypoint document’s `style` to `trails:quest` and optionally set `fallbackStyle` to `default` or `bowtie`. Gloss uses the fallback until the viewer has loaded the current pack and that pack contains the requested style. A pack rebuild returns viewers to their fallback until loading succeeds again.

The pack emits `assets/trails/waypoint_style/quest.json` and textures under `assets/trails/textures/gui/sprites/hud/locator_bar_dot/`. Minecraft selects an ordered sprite according to distance between the near and far thresholds. This controls the native locator icon; it does not create a freely positioned screen overlay or timed animation. See [Minecraft’s locator-bar resource format](https://feedback.minecraft.net/hc/en-us/articles/37432144057997-Minecraft-Java-Edition-1-21-6-Chase-the-Skies).
