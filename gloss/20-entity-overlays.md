---
title: "Entity Overlays"
description: "Show nearby entity health, names, combat attributes, React counts, and Adapt Insight"
published: true
date: 2026-09-05T22:12:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-09-05T20:00:00.000Z
---

Gloss shows segmented health above nearby living entities by default. Named entities show their custom name above the bar. Attack damage and armor appear on the last line.

## Default behavior

The display follows the entity and uses Gloss's temporary hologram engine. One display per entity is shared by every viewer in range; rows whose values differ per viewer, such as Insight or a viewer's own recent hits, render for that viewer alone. Each viewer sees the nearest entities within their configured range, excluding themselves, invisible entities, and spectators, up to the per-viewer and server-wide limits. Gloss excludes armor stands by default. Entity death, unloading, player disconnects, and world changes remove the applicable displays. On Folia an overlay can appear one refresh interval after the viewer comes into range.

The health bar uses ten segments. A living entity retains at least one filled segment. Green means at least half health, yellow means at least one quarter, and red means less than one quarter. Empty segments are dark gray. A hit updates health, briefly marks lost segments red, and adds the damage amount. Healing updates the bar on the next refresh.

Attack and armor are current Bukkit attribute values. An entity without an attribute shows zero. Attack is the attack-damage attribute, not a prediction of damage after weapon effects, projectiles, armor, or other plugins.

## Configuration

Edit `plugins/Gloss/entity-overlays/default.json`, or open it with `/gloss web edit entity-overlays default`. Valid edits reload automatically. `/gloss reload` also applies them. Set `enabled` to `false` in this document to stop overlays.

The shared engine also requires `[features] holograms = true` in `gloss.toml`. If that engine is disabled, React can return to native stack labels.

| Field | Default | Range or meaning |
|---|---|---|
| `schemaVersion` | required | `2` |
| `revision` | required | Positive document revision |
| `enabled` | `true` | Global overlay switch |
| `show` | `true` | Boolean or expression that controls the complete pane, including decorations |
| `range` | `16` | Radius in blocks, `1` to `64` |
| `updateIntervalTicks` | `5` | Entity and viewer refresh, `1` to `40` ticks |
| `maxEntitiesPerViewer` | `16` | Maximum overlays per viewer, nearest first, `1` to `256` |
| `maxActiveOverlays` | `1024` | Server-wide maximum of entities carrying an overlay, `16` to `16384` |
| `includePlayers` | `true` | Include other visible players |
| `verticalOffset` | `0.35` | Offset above entity height, `-2` to `8` blocks |
| `healthSegments` | `10` | Segments per health bar, `1` to `40` |
| `hitHighlightMs` | `750` | Hit highlight duration, `0` to `10000` milliseconds |
| `blacklistWorlds` | `[]` | Exact world names to exclude |
| `excludedEntityTypes` | `["ARMOR_STAND"]` | Bukkit entity type names to exclude |
| `lines` | Name, health, stack, damage, Insight, stats | Ordered row definitions |
| `style` | Center billboard, `0.75` on each scale axis | Shared Gloss text-display style |
| `box` | Disabled | Background, padding, and complete border |
| `particleLayers` | `[]` | Shared Gloss particle decorations |

## Rows and text

The `lines` array determines the visible order. Add, remove, or move any row, including health, names, React counts, and Adapt details. An empty layout has no visible pane. Each row has a unique `id`, a `type`, optional `text`, and a `show` condition. A layout accepts up to 64 rows and 4,096 characters per text template.

| Type | Behavior |
|---|---|
| `text` | Renders the authored text once |
| `insight` | Repeats its template for each supplied Adapt detail; `{insight}` inserts that detail |
| `spacer` | Adds an empty line |

Rows use the normal Gloss text engine: ampersand and hex colors, MiniMessage, emoji, registered functions, `|animation.name|`, PlaceholderAPI, and `{{ expressions }}`. Viewer functions and placeholders use the player who sees the pane. Entity values are copied on the entity's owning thread before viewer text evaluates.

Tokens include `{name}`, `{bar}`, `{health}`, `{max_health}`, `{count}`, `{attack}`, `{armor}`, `{damage}`, `{type}`, `{distance}`, and `{insight}`. Numeric tokens use at most one decimal place. Expression results retain legacy colors and insert as text; place MiniMessage tags directly in the row template. Names and Insight details are literal data: their contents cannot execute functions, placeholders, expressions, MiniMessage, or particle tags.

Expressions and `show` conditions can read `entity.name`, `entity.named`, `entity.type`, `entity.health`, `entity.maxHealth`, `entity.healthPercent`, `entity.damage`, `entity.damaged`, `entity.attack`, `entity.armor`, `entity.stackCount`, `entity.distance`, and `insight.active`. Health percent is `0` to `100`; distance is in blocks. Entity types use lowercase Bukkit key names, such as `zombie`. The normal viewer, server, time, metric, and PlaceholderAPI expression functions are also available.

For example, this layout puts combat statistics above health and adds a conditional warning:

```json
"lines": [
  {"id": "name", "type": "text", "text": "<gold>{name}</gold>", "show": "entity.named"},
  {"id": "stats", "type": "text", "text": "&7ATK &f{attack} &8| &7ARM &f{armor}"},
  {"id": "health", "type": "text", "text": "{bar} &f{health}&7/{max_health}"},
  {"id": "warning", "type": "text", "text": "<red>Low health</red>", "show": "entity.healthPercent < 25"},
  {"id": "insight", "type": "insight", "text": "{insight}"}
]
```

## Style and decorations

`style` uses the same fields as Gloss text icons: billboard, text alignment, background ARGB, opacity, shadow, see-through, line width, block and sky light, view range, shadow radius and strength, culling dimensions, glow color, and independent X/Y/Z scale. Supply block and sky light together. Center billboard keeps the default pane facing its viewer.

Enable `box` for an automatically sized panel behind the text. Padding and border width are measured in Minecraft text pixels. The complete border surrounds the panel on every side and follows the same movement, scale, orientation, and visibility as the pane.

```json
"box": {
  "enabled": true,
  "padding": 4,
  "borderWidth": 1,
  "backgroundArgb": "#B31B1B22",
  "borderArgb": "#FFAAAAAA"
}
```

Padding accepts `0` to `64`; border width accepts `0` to `16`. Colors use `#AARRGGBB`. A zero border width leaves the panel background. With no visible content, Gloss removes both the text and its decorations.

`particleLayers` uses the shared particle contract. Target the pane, a rendered line, or a named `<particles:name>text</particles>` span. Particle emission remains subject to Gloss's normal feature switches and budgets. See [Particles](/gloss/25-particle-layers).

## React mob stacking

When React is active, stacks with more than one member show their count on the default stack row. Place `{count}` in any text row to change its position. React keeps the stack count in its own entity data, while Gloss owns the display.

Gloss preserves actual custom names. React removes only native labels it owns when Gloss accepts presentation. If Gloss is absent or overlays are disabled, React can use its configured native stack labels. See [React entity systems](/react/04-features-entity-systems).

## Adapt Discovery Insight

By default, players who learn Discovery Insight get extra information when they look at an eligible entity. Adapt adds species, movement, supported attributes, and applicable Stable Hand details to that viewer's Gloss overlay. Other players continue to see the default health display. The default Insight row expands before the final attack and armor line. Move that row to change the position of the entire detail block, or edit its text to decorate each detail.

Set `restrictGlossToInsight = true` in Adapt's Discovery Insight adaptation configuration to restrict Gloss overlays to learned Insight viewers and their current eligible target. This option is false by default. React counts remain part of eligible displays. The restriction does not enable a disabled Gloss overlay document. Disabling Adapt releases its restriction.

Adapt owns learning, target selection, range, and XP. Its selected target can appear beyond the ordinary overlay radius. Gloss owns rendering, health segments, name placement, hit updates, and combat statistics. The hologram engine's `viewRange` also limits display visibility. See [Adapt Discovery](/adapt/18-skill-discovery).

## Web editor

The HUI editor provides ordered rows, text formatting, show expressions, full display styling, box decorations, and particle controls. Its sample preview can show damage, a named entity, a React stack, and Adapt Insight with or without the exclusive restriction, against a textured rig where the sample entity has one and a catalog sprite otherwise, over the same rendered world every stage shares. Sample controls do not change Adapt or React configuration.

Import, export, undo, and live sync use the singleton ID `default`. The exported server path is `entity-overlays/default.json`. Check text size and placement in a Minecraft client. A browser preview does not reproduce the client renderer.
