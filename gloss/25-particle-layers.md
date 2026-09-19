---
title: "Particle Layers"
description: "Gloss documentation: particle geometry behind in-world displays"
published: true
date: 2026-09-19T00:00:00.000Z
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

Geometry types are `point`, `line`, `polyline`, `outline`, `filledPlane`, `cuboid`, `letterBounds`, `glyphOutline`, and `glyphFill`. Use `placement.layer` and `placement.depth` to move particles in front of or behind the display.

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
immediate. Missed emissions are never replayed. Geometry particles spawn with zero added speed, so
Minecraft's own particle movement, lifetime and the client's particle setting still apply.

A document allows up to 64 uniquely named layers. Raise `geometry.spacing` or
`emission.intervalTicks` to reduce particle work. Per-viewer and global particle budgets apply, as
does the configured particle view range, which is independent of display view range. Drop-label
range is measured from the label's vertical offset.

## Java API

API-built menus use `HoloMenuBuilder.particleLayer(layer)`. Holograms expose:

```java
List<ParticleLayer> particleLayers();
void setParticleLayers(List<ParticleLayer> layers);
```

The `ParticleLayer` records use the same fields as the JSON format.
