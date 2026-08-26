---
title: "Particle Layers"
description: "Gloss documentation: particle geometry behind in-world displays"
published: true
date: 2026-08-26
tags: "gloss"
editor: markdown
dateCreated: 2026-08-26T00:00:00.000Z
---

Particle layers draw viewer-targeted particles in the local coordinate frame of an in-world Gloss render. They can surround a complete projection, frame one component or line, fill a text plane, trace individual character cells, or draw authored points and lines. Scoreboards, tablists, MOTD, action bars and ordinary chat output are not particle-layer surfaces.

## Where layers are authored

Every supported document uses the same `particleLayers` array and the same layer object.

| Surface | Field | Supported targets |
|---|---|---|
| Persistent hologram | top-level `particleLayers` in a schema-2 hologram | `projection`, `text`, `line`, `span`, `local` |
| Temporary hologram API | inherited `Hologram#setParticleLayers` | `projection`, `text`, `line`, `span`, `local` |
| Chat bubble | top-level `particleLayers` in a schema-4 bubble style | `projection`, `text`, `line`, `span`, `local`; spans come only from the authored style prefix |
| Damage or healing indicator | `particleLayers` inside that schema-3 presentation | `projection`, `text`, `line`, `span`, `local` |
| Hologram menu or panel | top-level `particleLayers` in the menu | `projection`, `component`, `text`, `line`, `span`, `local` |
| Container preview | top-level `particleLayers` in the preview document | `projection`, `component`, `label`, `text`, `line`, `span`, `local` |
| Real Drops | `particleLayers` inside a schema-3 presentation or variant presentation | `projection`, `model`, `label`, `text`, `line`, `span`, `local` |
| Native dropped-item label | the selected Real Drops presentation while display-backed Real Drops are disabled | `projection`, `model`, `label`, `text`, `line`, `span`, `local` |

Panels use their current menu's layers. There is no particle field in a panel placement document and the panel schema remains `1`. A menu layer follows the panel's position, scale, yaw, pitch, roll and follow transform for each viewer.

Menu `component` names are normal component ids. Container previews expose their generated elements as zero-based `element-0`, `element-1`, and so on. A `text`, `line` or `span` menu target applies to every text component unless `target.component` narrows it to one component. A target that the current surface cannot resolve emits nothing.

Documents admit at most 64 layers. Layer ids are unique within the document, are normalized to lowercase and must match `[a-z0-9][a-z0-9._-]*` with at most 64 characters. Layers run in descending `priority` order; priority is clamped to `-1000..1000`.

## Complete layer contract

Only `id`, `target`, `geometry` and `particle` are required:

```json
{
  "id": "green-word",
  "target": {
    "scope": "span",
    "name": "green"
  },
  "geometry": {
    "type": "glyphFill",
    "padding": 0.01,
    "spacing": 0.05
  },
  "placement": {
    "layer": "behind",
    "depth": 0.04,
    "offset": [0.0, 0.0, 0.0]
  },
  "particle": {
    "key": "minecraft:dust",
    "color": "#00ff00",
    "size": 0.7
  },
  "emission": {
    "intervalTicks": 2,
    "pattern": "steady",
    "periodTicks": 40,
    "seed": 0
  },
  "priority": 10
}
```

### Targets

| `scope` | Selector | Meaning |
|---|---|---|
| `projection` | none | Union of the complete render's live bounds |
| `component` | `component` | One menu component or preview `element-N` |
| `text` | optional `component` on menus | Complete text block |
| `line` | `line`, optional `component` on menus | One-based rendered line |
| `span` | `name`, optional `component` on menus | Every authored text span with that name |
| `label` | none | Preview or dropped-item label |
| `model` | none | Dropped-item model bounds |
| `local` | none | Authored local geometry independent of calculated bounds |

`span` requires `name`, `component` requires `component`, and `line` requires a line number of at least `1`. Names and component selectors use the same lowercase id grammar as layer ids.

### Geometry

| `type` | Behavior |
|---|---|
| `point` | One point at each target center, or the local origin |
| `line` | Samples from required local `from` to required local `to` |
| `polyline` | Samples the required `points` array in order; at least two points |
| `outline` | Flat rectangular perimeter of each target |
| `filledPlane` | Grid across each target plane |
| `cuboid` | Twelve edges of each target's 3D bounds |
| `letterBounds` | One rectangular perimeter per character cell in a span |
| `glyphOutline` | One rectangular perimeter per character cell in a span |
| `glyphFill` | A filled rectangle per character cell in a span |

`padding` expands every target uniformly and defaults to `0`; it accepts `0..16`. `spacing` is the approximate distance between samples and defaults to `0.15`; it accepts `0.02..16`. Explicit `width`, `height` and `depth` accept `0..128` and supply local bounds when no calculated target is used. Vectors are three-number arrays in local `[right, up, back]` coordinates.

The current text geometry is a formatting-aware, monospaced approximation: each visible UTF-16 character cell is `0.1` blocks wide and each line is `0.26` blocks high at scale `1`. Legacy color sequences do not consume cells. `glyphOutline` and `glyphFill` do not rasterize the actual vanilla or resource-pack font; they outline or fill those character rectangles. Custom fonts, emoji, wide Unicode glyphs and client resource packs can therefore differ from the particle geometry.

### Placement

`placement.layer` is `behind`, `front` or `center`. It defaults to `behind` with `depth: 0.04` and zero `offset`. `depth` accepts `0..16`. Behind moves along the surface's local back axis, away from that viewer; front uses the opposite direction; center ignores depth. `offset` is always applied in local `[right, up, back]` coordinates.

Billboarded renders calculate that frame separately for every viewer. A fixed render uses its authored orientation. Particles are independent client effects, not display children, and Minecraft has no particle z-index: `behind` controls spawn position but cannot force compositor ordering through opaque blocks or TextDisplay backgrounds.

### Particle

`particle.key` is a canonical namespaced registry key such as `minecraft:dust` or `minecraft:soul`. Gloss accepts ordinary particles whose Bukkit particle type needs no extra data. Particles requiring another data object are rejected when first emitted.

`minecraft:dust` additionally accepts `color` as `#RRGGBB` and `size` from `0.01..4`; they default to white and `1`. `color` and `size` are invalid on every other particle. Particle motion remains the particle's native client behavior, so soul particles drift while dust is better for precise frames and letters.

### Emission

| `pattern` | Behavior |
|---|---|
| `steady` | Emits every sampled point |
| `chase` | Advances one emitted sample through the ordered geometry |
| `scan` | The same ordered one-sample sweep as `chase` |
| `pulse` | Emits the complete geometry for half the period, then nothing for half |
| `twinkle` | Emits a deterministic changing subset of about one eighth of the samples |
| `corners` | Emits up to four evenly selected points from the ordered samples |

`intervalTicks` defaults to `4` and clamps to `1..200`. `periodTicks` defaults to `40` and clamps to `1..72000`. `seed` defaults to `0` and shifts or randomizes deterministic patterns.

## Named text spans

Mark authored source with `<particles:name>...</particles>` and target the same normalized `name` from a layer. The tags are metadata and never appear in the visible text.

```text
This is: <particles:green>&4GREEN</particles> Colored!
```

The `&4` still makes `GREEN` dark red. The layer in the complete example above puts green dust behind only those five character cells. To draw five individual green frames instead, change `glyphFill` to `letterBounds`. To draw one rectangle around the whole word, use `outline`.

Span tags are parsed before functions, inline expressions, PlaceholderAPI, emoji and colors. Dynamic output inside a span inherits that span:

```text
Welcome <particles:player>&6%player_name%</particles>!
```

Placeholder values, function output, player chat and other resolved content cannot introduce new span tags because only the authored source is scanned. Spans cannot nest. An unclosed tag, a closing tag without an opening tag, a nested span, or an invalid name rejects that authored text path. Repeating the same name in separate spans is allowed and targets all of them.

Already-rendered temporary hologram frames created with `setRenderedLines` or `bindRenderedFrames` do not infer span metadata. Use ordinary authored lines, or explicitly attach ranges with `setRenderedParticleText`, when span targeting is required. Chat bubbles preserve ranges from the authored BubbleStyle prefix beside their wrapped frames, but cannot target a named portion of the player message.

## Common effects

### A line behind text

```json
{
  "id": "underline",
  "target": {"scope": "local"},
  "geometry": {
    "type": "line",
    "from": [-1.2, -0.18, 0.0],
    "to": [1.2, -0.18, 0.0],
    "spacing": 0.08
  },
  "particle": {"key": "minecraft:dust", "color": "#33ddff", "size": 0.65}
}
```

### A frame around the whole projection

```json
{
  "id": "projection-frame",
  "target": {"scope": "projection"},
  "geometry": {"type": "outline", "padding": 0.08, "spacing": 0.1},
  "placement": {"layer": "behind", "depth": 0.06},
  "particle": {"key": "minecraft:soul"},
  "emission": {"intervalTicks": 3, "pattern": "chase", "periodTicks": 60}
}
```

### A 3D box around a dropped model or full projection

```json
{
  "id": "drop-box",
  "target": {"scope": "model"},
  "geometry": {"type": "cuboid", "padding": 0.06, "spacing": 0.08},
  "particle": {"key": "minecraft:dust", "color": "#ff2020", "size": 0.55},
  "emission": {"intervalTicks": 2, "pattern": "corners", "periodTicks": 40}
}
```

Use `projection` instead of `model` to include the dropped model and its label. The same `projection` plus `cuboid` pairing boxes a complete menu, panel or preview.

## Configuration and budgets

Particle layers are enabled by default:

```toml
[features]
particles = true

[particles]
viewRange = 48.0
samplesPerViewerPerTick = 128
samplesPerTick = 4096
maxCachedSamplesPerLayer = 512
```

| Key | Clamp | Meaning |
|---|---:|---|
| `viewRange` | `4..128` | Independent maximum distance from a layer origin |
| `samplesPerViewerPerTick` | `1..4096` | Points admitted for one viewer in one server tick |
| `samplesPerTick` | `16..65536` | Points admitted across the server in one tick |
| `maxCachedSamplesPerLayer` | `4..4096` | Maximum sampled local points generated for one layer geometry |

Gloss sends particles to each intended player with `Player.spawnParticle`; it never broadcasts a product layer through `World.spawnParticle`. Geometry is cached, and the per-viewer and server-wide budgets truncate a layer when the tick ceiling is reached. Higher-priority layers in the same owner run first. A tighter `spacing`, faster `intervalTicks`, large filled plane and broad audience consume the budget fastest.

Client particle settings can reduce or disable what a player sees. Walls, translucent backgrounds, native particle drift, camera motion and client resource packs also affect the result. These settings do not alter display entities or their hitboxes.

## Java API

`art.arcane.gloss.api.ParticleLayer` and its nested records are the same typed contract used by JSON documents. Persistent and temporary holograms expose:

```java
List<ParticleLayer> particleLayers();
void setParticleLayers(List<ParticleLayer> particleLayers);
```

Temporary holograms can pair final rendered text with explicit UTF-16 ranges:

```java
void setRenderedParticleText(String text, List<ParticleTextSpan> spans);
```

`ParticleTextSpan(name, start, end)` uses a zero-based inclusive start and exclusive end. Its name
uses the layer-id grammar, entries may not be null, and an end beyond the rendered text length is
rejected. This method supplies metadata for rendered frames; it does not parse tags from the text.

API-built menus accept layers through `HoloMenuBuilder.particleLayer(ParticleLayer)`. A minimal green span layer is:

```java
ParticleLayer green = new ParticleLayer(
    "green-word",
    new ParticleLayer.Target("span", "green", null, null),
    new ParticleLayer.Geometry("glyphFill", null, null, List.of(),
        null, null, null, 0.01D, 0.05D),
    new ParticleLayer.Placement("behind", 0.04D, new Vector()),
    new ParticleLayer.ParticleSpec("minecraft:dust", "#00ff00", 0.7D),
    new ParticleLayer.Emission(2, "steady", 40, 0L),
    10
);

HoloMenu menu = HoloMenu.builder()
    .id("particle-demo")
    .component(HoloComponent.decoration(
        "title", 0.0D, 0.0D, 0.0D,
        HoloIcon.text("This is: <particles:green>&4GREEN</particles> Colored!")))
    .particleLayer(green)
    .build();
```

The API applies the same 64-layer cap, duplicate-id rejection, normalization, clamps, particle restrictions and runtime budgets as file-backed layers.
