---
title: "Particle Layers"
description: "Gloss documentation: particle geometry behind in-world displays"
published: true
date: 2026-10-03T15:34:39.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-26T00:00:00.000Z
---

Particle layers add viewer-only particles around holograms, menus, panels, previews, bubbles, indicators, and drop displays.

Add them through a document's top-level `particleLayers` array:

```json
{
  "id": "green-frame",
  "target": { "scope": "projection" },
  "geometry": { "type": "outline", "padding": 0.05, "spacing": 0.15 },
  "placement": { "layer": "behind", "depth": 0.04 },
  "particle": { "key": "minecraft:dust", "color": "#00ff00", "size": 0.7 },
  "emission": { "pattern": "steady", "intervalTicks": 40 }
}
```

## Targets

| Target | Use |
|---|---|
| `projection` | The complete display |
| `component` | One menu or preview component |
| `model` | A dropped-item model |
| `label` | A preview or drop label |
| `text` | Text content |
| `line` | One text line |
| `span` | A named text span |
| `local` | Explicit local coordinates |

Wrap authored text in `<particles:name>text</particles>` and use `{"scope":"span","name":"name"}` to target it. Rich formatting resolves before measuring glyphs and span offsets, including spans inside gradients. The `label` target also works on standalone temporary drop labels. Player chat cannot create spans.

## Geometry

<div class="gloss-demo" data-demo="particle-layers-pov">
<p><strong>Particle layer geometry</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/particle-layers-pov.webm" aria-label="Particle layer geometry, first person" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/gloss-assets/demos/particle-layers-observer.webm" aria-label="Particle layer geometry, third person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Geometry types are `point`, `line`, `polyline`, `outline`, `filledPlane`, `cuboid`, `letterBounds`, `glyphOutline`, and `glyphFill`. Hologram text targets follow the native font advances, bold formatting, wrapping width, paragraph alignment, and text display scale. Use `placement.layer` and `placement.depth` to move particles in front of or behind the display.

Particle layers attached to text displays follow the display's billboard mode. Gloss uses the player's look yaw and pitch for camera rotation:

| Billboard | Yaw | Pitch |
|---|---|---|
| `center` | Camera | Camera |
| `vertical` | Camera | Display |
| `horizontal` | Display | Camera |
| `fixed` | Display | Display |

Moving without changing the player's look direction keeps the particle plane's orientation unchanged. Local geometry and placement offsets follow billboard and presentation rotation. After presentation rotation, `front` points toward the text's readable face and `behind` points away.

## Emission

Each layer emits on its own `emission.intervalTicks`, per viewer, with the first emission
immediate. Missed emissions are never replayed. `particle.count` defaults to 1 (range 1–64),
`particle.spread` defaults to `[0, 0, 0]` (each axis 0–16), and `particle.speed` defaults to 0
(range 0–10). These control the number of particles per sampled point, random positional spread,
and added speed. Minecraft’s own particle movement, lifetime and the client’s particle setting
also apply. Particle budgets count emitted particles, including `particle.count`.

A document allows up to 64 uniquely named layers. Raise `geometry.spacing` or
`emission.intervalTicks` to reduce particle work. Per-viewer and global particle budgets apply, as
does each layer’s `viewDistance` (default 48 blocks, range 4–128), independent of display view range.
A layer’s `show` accepts a boolean or condition expression; false suppresses its emission for that viewer. Drop-label
range is measured from the label's vertical offset.

## Java API

API-built menus use `HoloMenuBuilder.particleLayer(layer)`. Holograms expose:

```java
List<ParticleLayer> particleLayers();
void setParticleLayers(List<ParticleLayer> layers);
```

The `ParticleLayer` records use the same fields as the JSON format.
