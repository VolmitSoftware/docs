---
title: "Entity Overlays"
description: "Show nearby entity health, names, combat attributes, React counts, and Adapt Insight"
published: true
date: 2026-10-05T19:34:32.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-09-05T20:00:00.000Z
---

Gloss shows segmented health above nearby living entities by default.

## Default behavior

<div class="gloss-demo" data-demo="entity-overlays-pov">
<p><strong>Entity overlays</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/entity-overlays-pov.webm" aria-label="Entity overlays, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

**What you see.** A pane that follows the entity, with segmented health and, on a named entity, its
custom name above the bar. Attack damage and armor appear on the last line.

**Who sees it.** Each viewer sees the nearest entities within `range`, up to `maxEntitiesPerViewer`
and `maxActiveOverlays`. Viewer-independent presentations share a display; viewer-specific rows and conditional variants render separately for each recipient.

**What is excluded.** The viewer themselves, invisible entities, spectators, armor stands by default,
and anything in `blacklistWorlds` or `excludedEntityTypes`. Death, chunk unloading, disconnects and
world changes remove the display.

The default health bar uses ten segments. A living entity retains at least one filled segment. Green means at least half health, yellow means at least one quarter, and red means less than one quarter. Empty segments are dark gray. A hit updates health, briefly marks lost segments red, and adds the damage amount. Healing updates the bar on the next refresh.

Attack and armor are current Bukkit attribute values. An entity without an attribute shows zero. Attack is the attack-damage attribute, not a prediction of damage after weapon effects, projectiles, armor, or other plugins.

## Configuration

Edit `plugins/Gloss/entity-overlays/default.json`, or open it with `/gloss web edit entity-overlays default`. Valid edits reload automatically. Set `enabled` to `false` in this document to stop overlays.

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
| `overrideNametag` | `false` | Hide native mob nametags for Java viewers while their Gloss overlay is visible; the mob's stored name is preserved |
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

Tokens include `{name}`, `{bar}`, `{health}`, `{max_health}`, `{count}`, `{attack}`, `{armor}`, `{damage}`, `{type}`, `{distance}`, and `{insight}`. Numeric tokens use up to `healthBar.decimals` decimal places (default 1). `{typeName}` inserts the entity’s readable catalog name, while `{type}` remains its raw key. Expression results retain legacy colors and insert as text; place MiniMessage tags directly in the row template. Names and Insight details are literal data: their contents cannot execute functions, placeholders, expressions, MiniMessage, or particle tags.

Expressions and `show` conditions can read `entity.name`, `entity.named`, `entity.type`, `entity.typeName`, `entity.health`, `entity.maxHealth`, `entity.healthPercent`, `entity.damage`, `entity.damaged`, `entity.attack`, `entity.armor`, `entity.stackCount`, `entity.distance`, and `insight.active`. Health percent is `0` to `100`; distance is in blocks. Entity types use lowercase Bukkit key names, such as `zombie`. The normal viewer, server, time, metric, and PlaceholderAPI expression functions are also available.

When EcoMobs is enabled, `{name}` and `entity.name` use the EcoMobs display name for its mobs, including its resolved mob placeholders and colors. `entity.named` recognizes that name, so the default name row works without changing its condition. Other entities use their Bukkit custom name. EcoMobs is optional and requires no additional Gloss setting.

Set `overrideNametag` to `true` at the document root to replace a mob's native tag with the configured Gloss pane. Its native tag returns when the pane is hidden, the viewer leaves overlay range, or the option is disabled. Each viewer is handled independently, and name changes continue to update normally. This setting applies to mobs; player nameplates retain their own controls. Bedrock viewers keep native tags.

To leave native tags visible and show a Gloss species name only for unnamed mobs, replace the name row with:

```json
{"id": "name", "type": "text", "text": "&f{typeName}", "show": "!entity.named"}
```

Keep the other rows to retain health and statistics. This condition treats both custom and EcoMobs names as named; it does not identify who applied a name or whether the native tag is currently rendered. `{typeName}` supplies the readable species name for unnamed mobs, whose `{name}` is empty.

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

## Conditional variants

Add up to 64 `variants` to select overlay presentations per viewer and entity. Each entry needs a unique `id`, a `when` expression, and a `presentation`; `priority` defaults to `0` and is clamped to `-1000`–`1000`. The first passing entry wins in descending priority and then ascending id order. No match uses the base presentation.

`presentation` can replace `lines`, `style`, `box`, `particleLayers`, `verticalOffset`, `healthSegments`, and `healthBar`. Omitted fields inherit the base; empty line or particle arrays clear those fields. Conditions can use the same viewer and entity values as line visibility.

```json
"variants": [{
  "id": "wounded",
  "priority": 10,
  "when": "entity.healthPercent < 25",
  "presentation": {
    "lines": [{"id": "warning", "text": "&c{typeName}: {health}/{max_health}"}],
    "verticalOffset": 0.6
  }
}]
```

## Health bar formatting

Overlays configure `healthBar` at the document root; nameplates configure it inside `presentation`.
`glyph` and `emptyGlyph` select filled and empty segments, each up to 64 characters. `healthyColor`,
`warningColor`, `criticalColor`, `damageColor`, and `emptyColor` accept text color codes. Defaults
are `|` for both glyphs and `&a`, `&e`, `&c`, `&c`, and `&8` for those colors.

`warningThreshold` defaults to `0.5` and `criticalThreshold` to `0.25`, expressed as fractions of
maximum health from 0 to 1. The critical threshold cannot exceed the warning threshold.
`decimals` controls numeric tokens from 0 to 6 decimal places; trailing zeroes are omitted.

```json
"healthBar": {
  "glyph": "■",
  "emptyGlyph": "□",
  "healthyColor": "&b",
  "warningColor": "&e",
  "criticalColor": "&c",
  "warningThreshold": 0.6,
  "criticalThreshold": 0.2,
  "decimals": 2
}
```

## Style and decorations

`style` and `box` are the shared display contract documented on
[Icons](/gloss/11-icons#display-style-and-boxes). The overlay default is a center billboard at `0.75`
on each scale axis, with the box disabled.

```json
"box": {
  "enabled": true,
  "padding": 4,
  "borderWidth": 1,
  "backgroundArgb": "#B31B1B22",
  "borderArgb": "#FFAAAAAA"
}
```

The box follows the pane's movement, scale, orientation and visibility, and stays behind the
foreground text so health-bar colors survive rotation and scaling. With no visible content, Gloss
removes the text and its decorations together.

`particleLayers` uses the shared particle contract. Target the pane, a rendered line, or a named `<particles:name>text</particles>` span. Particle emission remains subject to Gloss's normal feature switches and budgets. See [Particles](/gloss/25-particle-layers).

## React mob stacking

When React is active, stacks with more than one member show their count on the default stack row. Place `{count}` in any text row to change its position. React keeps the stack count in its own entity data, while Gloss owns the display.

Gloss preserves actual custom names. React removes only native labels it owns when Gloss accepts presentation. If Gloss is absent or overlays are disabled, React can use its configured native stack labels. See [React entity systems](/react/04-features-entity-systems).

## Adapt Discovery Insight

By default, players who learn Discovery Insight get extra information when they look at an eligible entity. Adapt adds species, movement, supported attributes, and applicable Stable Hand details to that viewer's Gloss overlay. Other players continue to see the default health display. The default Insight row expands before the final attack and armor line. Move that row to change the position of the entire detail block, or edit its text to decorate each detail.

Set `restrictGlossToInsight = true` in Adapt's Discovery Insight adaptation configuration to restrict Gloss overlays to learned Insight viewers and their current eligible target. This option is false by default. React counts remain part of eligible displays. The restriction does not enable a disabled Gloss overlay document. Disabling Adapt releases its restriction.

An Insight target can appear beyond the ordinary overlay radius, and the hologram engine's
`viewRange` still limits visibility. See [Adapt Discovery](/adapt/18-skill-discovery).

## Web editor

<div class="gloss-demo" data-demo="entity-overlays-editor">
<p><strong>Entity overlay authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/entity-overlays-editor.webm" aria-label="Entity overlay authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Import, export, undo and live sync use the singleton id `default`, exported to
`entity-overlays/default.json`. Sample controls change the preview only, never Adapt or React
configuration. Check text size and placement in a Minecraft client — the browser preview does not
reproduce the client renderer. See [Web Editor & Sync](/gloss/18-web-editor).

## Permission-selected nametags

<div class="gloss-demo" data-demo="nametag-editor">
<p><strong>Nametag authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/nametag-editor.webm" aria-label="Nametag authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Enable `nametags = true` under `[features]` in `gloss.toml`. Edit schema-1 `nametags/<id>.json` documents with `/gloss web edit nametags <id>`. A nametag controls the player's prefix, account-name color, suffix, vanilla label visibility, and collision rule.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "show": "true",
  "select": { "priority": 10, "when": "true", "permission": "ranks.member" },
  "presentation": {
    "prefix": "&6[Member] ",
    "suffix": "",
    "color": "gold",
    "nameTagVisibility": "always",
    "collision": "always"
  },
  "variants": [
    {
      "id": "staff",
      "priority": 20,
      "when": "true",
      "permission": "ranks.staff",
      "presentation": {
        "prefix": "&c[Staff] ",
        "suffix": "",
        "color": "red",
        "nameTagVisibility": "always",
        "collision": "never"
      }
    }
  ]
}
```

Grant `ranks.member` to eligible players through your permissions plugin. Grant `ranks.staff` as well for the staff variant. `select.permission` and each variant's `permission` check the player wearing the tag, not the viewer. Blank or omitted permission fields impose no permission requirement. Permission, `when`, and document `show` must all allow the selection. Omitted `when` is `true`; an omitted `select` is unrestricted at priority zero.

The highest-priority matching document wins; equal priorities use the alphabetically first document ID. Variants follow the same priority and ID ordering and replace the whole presentation. The shipped default requires `gloss.nametag.default`, and its staff variant additionally requires `gloss.nametag.staff`. These are assignment nodes, separate from administration permissions.

`color` accepts Minecraft named colors such as `white`, `gold`, and `dark_red`. `nameTagVisibility` accepts `always`, `never`, `hide_for_other_teams`, or `hide_for_own_team`. `collision` accepts `always`, `never`, `push_other_teams`, or `push_own_team`. Prefix and suffix accept MiniMessage, legacy colors, and the Gloss text pipeline, and can refer to `subject` and `viewer`. Their styling is preserved in both rich chat and legacy text surfaces. Their player names resolve as raw account names while the tag itself is composed, preventing a tag from including itself.

The selected prefix, name color, and suffix also appear in rendered player-name references across Gloss, including chat, tablist, nameplates, boards, menus, holograms, and connection messages. See [Player names](/gloss/13-expressions-placeholders#player-names) for formatted and raw tokens. Disabling nametags or selecting no document returns the account name on these text surfaces. Visibility and collision apply to the vanilla overhead label, not to names shown in chat or other text.

## Permission-selected nameplates

<div class="gloss-demo" data-demo="player-identities-pov">
<p><strong>Nametag and nameplate live updates</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/player-identities-pov.webm" aria-label="Nametag and nameplate live updates, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="nameplate-editor">
<p><strong>Nameplate authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/nameplate-editor.webm" aria-label="Nameplate authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Enable `nameplates = true` under `[features]`; the hologram and entity-overlay engine must also be enabled. Nameplates are schema-1 documents under `nameplates/<id>.json`, opened with `/gloss web edit nameplates <id>`. They replace the vanilla overhead label with ordered text rows and shared Gloss display styling.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "show": "true",
  "select": { "priority": 10, "when": "true", "permission": "ranks.member" },
  "presentation": {
    "lines": [
      { "text": "{{ subject.name }}", "show": "true" },
      { "text": "&c{{ fixed(subject.health, 0) }} HP", "show": "subject.health < subject.maxHealth" }
    ],
    "offset": 0.3,
    "hideSneaking": true,
    "relations": []
  },
  "variants": []
}
```

Nameplate document and variant permissions use the same assignment, condition, and priority rules as nametags. Each variant contains `id`, `priority`, `permission`, `when`, and a complete `presentation`. Use `subject.name` to include the selected nametag or `subject.username` for only the account name. The `subject` is the player wearing the plate; `viewer` is its reader.

A presentation accepts up to 16 `lines`, each with `text` and `show`; `style` and `box` use the [shared display settings](/gloss/11-icons#display-style-and-boxes). `offset` defaults to `0.3` and clamps to `-2` through `8`. `hideSneaking` defaults to `true`. Ordered `relations` contain `when` and `color`, with the first matching relation supplying the row color. A player cannot see their own plate, and spectators, invisible players, or players hidden from that viewer have no visible plate.

Use `/gloss nametag refresh` or `/gloss nameplate refresh` to request a refresh. Valid document edits reload automatically, including the first saved change; deleting a document removes its assignment. Changing assignment permissions takes effect on the next feature refresh.
