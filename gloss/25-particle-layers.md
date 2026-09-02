---
title: "Particle Layers"
description: "Gloss documentation: particle geometry behind in-world displays"
published: true
date: 2026-08-26
tags: "gloss"
editor: markdown
dateCreated: 2026-08-26T00:00:00.000Z
---

Particle layers add viewer-only particles around holograms, menus, panels, previews, bubbles, indicators, and drop displays.

Add them through a document's top-level `particleLayers` array:

```json
{
  "id": "green-frame",
  "target": { "type": "projection" },
  "geometry": { "type": "box" },
  "placement": { "type": "behind", "depth": 0.04 },
  "particle": { "type": "minecraft:dust", "color": "#00ff00", "size": 0.7 },
  "emission": { "count": 2, "mode": "steady", "intervalTicks": 40 }
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

## Geometry

Common geometry types are `line`, `frame`, `box`, `plane`, `glyphFill`, and authored points. Use `placement.depth` to move particles in front of or behind the display.

Documents allow up to 64 uniquely named layers. Keep emission counts and intervals low; Gloss applies the configured per-viewer and global particle budgets.

## Java API

API-built menus use `HoloMenuBuilder.particleLayer(layer)`. Holograms expose:

```java
List<ParticleLayer> particleLayers();
void setParticleLayers(List<ParticleLayer> layers);
```

The `ParticleLayer` records use the same fields as the JSON format.
