---
title: "Icons"
description: "Use text, images, items, blocks, heads, and entities as menu icons"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Each menu component has one icon. See [Components & Hitboxes](/gloss/10-components-hitboxes) for placement and clicks.

## Icon types

The `type` key selects the icon.

| `type` | Result |
|---|---|
| `text` | Text, one display per line |
| `textImage` | Small pixel image |
| `animatedTextImage` | Animated pixel image |
| `item` | Vanilla item, with a count label above one |
| `playerHead` | Player head or configured fallback |
| `block` | Default state of a block |
| `customItem` | Item supplied by another plugin |
| `entity` | Living-entity model visible only to the viewer |

These errors reject the menu file:

| Condition | Message |
|---|---|
| No `type` member | `Missing type` |
| `type` is not a JSON primitive | `Type must be a string` |
| `type` is not a known discriminator | `Unknown type: <value>` |

An invalid edit keeps the previous menu active. Unknown keys are ignored, and a missing or `null` icon shows the missing-icon checkerboard.

## Display style and boxes

This is the shared display contract. Holograms, entity overlays, previews, indicators and drop labels all use the same `style` and `box` objects.

Every JSON icon except `entity` accepts the optional `style` object:

```json
{
  "type": "text",
  "text": "<gold>Shop</gold>",
  "style": {
    "billboard": "center",
    "shadow": true,
    "seeThrough": false,
    "textAlignment": "center",
    "backgroundArgb": "#80000000",
    "textOpacity": 220,
    "lineWidth": 160,
    "blockLight": 15,
    "skyLight": 15,
    "viewRange": 2.0,
    "shadowRadius": 0.25,
    "shadowStrength": 0.6,
    "cullingWidth": 4.0,
    "cullingHeight": 2.0,
    "glowColor": "#FFFFAA00",
    "scaleX": 1.4,
    "scaleY": 0.8,
    "scaleZ": 1.0
  }
}
```

| Key | Accepted values | Default | Effect |
|---|---|---|---|
| `billboard` | `fixed`, `vertical`, `horizontal`, `center` | `fixed` | Display billboard metadata. An unknown or non-string value rejects the file |
| `shadow` | boolean | `false` | Text glyph shadow. On item icons this reaches only the count label |
| `seeThrough` | boolean | `false` | Text see-through. On item icons this reaches only the count label |
| `textAlignment` | `center`, `left`, `right` | `center` | Text alignment flag. An unknown or non-string value rejects the file |
| `backgroundArgb` | `#AARRGGBB` | `#00000000` | Text background color including alpha |
| `textOpacity` | integer 0 – 255 | `255` | Text opacity metadata |
| `lineWidth` | integer 1 – 16384 | `16384` | Client text-wrap width; the default is effectively full width |
| `blockLight`, `skyLight` | paired integers 0 – 15, or both omitted | omitted | Packed brightness override. Supplying only one rejects the file with `blockLight and skyLight must be supplied together` |
| `viewRange` | finite number 0.01 – 64 | `1` | Display view-range metadata; `1.0` is 64 blocks before other visibility limits |
| `shadowRadius` | finite number 0 – 64 | `0` | Entity shadow radius |
| `shadowStrength` | finite number 0 – 1 | `0` | Entity shadow strength |
| `cullingWidth`, `cullingHeight` | finite number 0 – 4096 | `0` | Render-culling box. These do not define the click plane |
| `glowColor` | `#AARRGGBB` or `null` | `null` | Sets the glowing entity flag and supplies its color override |
| `scaleX`, `scaleY`, `scaleZ` | finite number 0.01 – 64 | `1` | Multiplies the session scale per axis. Automatic click geometry uses X and Y. Z is visual only |

A style object is a whole override, not a field-by-field merge: an explicit partial object uses the shared defaults above for everything it omits. Surfaces with their own documented defaults, such as a hologram's `center` billboard and see-through text, only apply them when `style` is omitted entirely.

Text style fields apply to `text`, `textImage` and `animatedTextImage`. Item, head, block and custom-item icons use the shared display fields, and text fields reach only an item's count label. `entity` icons support no `style` at all. Invalid ranges, colors, brightness pairs or enum values reject the file.

### Boxes

A `box` adds a measured panel and a complete perimeter around a text block. It follows the icon's position, rotation, scale and visibility, resizes when the rendered text changes size, and does not enlarge the component's click plane.

```json
{
  "type": "text",
  "text": "<gold>Balance</gold>\n%vault_eco_balance%",
  "box": {
    "enabled": true,
    "padding": 4,
    "borderWidth": 1,
    "backgroundArgb": "#B31B1B22",
    "borderArgb": "#FFAAAAAA"
  }
}
```

| Key | Default | Contract |
|---|---|---|
| `enabled` | `false` | Show the box |
| `padding` | `4` | Integer `0` through `64`, in Minecraft text pixels |
| `borderWidth` | `1` | Integer `0` through `16`, in Minecraft text pixels. Zero removes the border |
| `backgroundArgb` | `#B31B1B22` | Panel color in `#AARRGGBB` format. Zero alpha hides the panel fill |
| `borderArgb` | `#FFAAAAAA` | Border color in `#AARRGGBB` format. Zero alpha hides the border |

`style.backgroundArgb` is the text display's own background and stays separate from the box colors, so a transparent panel can carry an opaque border. A box uses at most five parts — the inner panel and four perimeter edges — and transparent or zero-width parts allocate none. Boxes apply to text; image icons keep their pixel presentation.

## `text`

```json
{ "type": "text", "text": "&6Balance:\n<gold>%vault_eco_balance%" }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `text` | string | yes (schema) | `null` | `null` is treated as `""` and renders as one empty line |
| `refreshTicks` | integer 0 – 1200 | no | automatic | Explicit ticks between live re-renders. `0` freezes after the first render. When omitted, ordinary dynamic text uses 10 ticks and clock-driven or named-animation text uses 1 tick |
| `box` | object | no | disabled | Panel and border around the rendered text block |

`text` splits on `\n`, with one display per line. The default `lineWidth` of `16384` avoids wrapping; smaller values use the client's font-pixel width, and automatic hitboxes still measure the configured line.

### Text formatting

Text icons support functions, expressions, PlaceholderAPI, emoji, legacy colors, bracket hex and MiniMessage. Both `&` and `§` work as legacy prefixes, the two can be mixed, and placeholder output goes through the same formatting pass.

| Legacy | MiniMessage tag |
|---|---|
| `&0` – `&9`, `&a` – `&f` | `<black>`, `<dark_blue>`, `<dark_green>`, `<dark_aqua>`, `<dark_red>`, `<dark_purple>`, `<gold>`, `<gray>`, `<dark_gray>`, `<blue>`, `<green>`, `<aqua>`, `<red>`, `<light_purple>`, `<yellow>`, `<white>` |
| `&k` | `<obfuscated>` |
| `&l` | `<bold>` |
| `&m` | `<strikethrough>` |
| `&n` | `<underlined>` |
| `&o` | `<italic>` |
| `&r` | `<reset>` |

A configured `<particles:name>...</particles>` range can select part of a `text` icon for a menu particle layer. `letterBounds`, `glyphOutline` and `glyphFill` use formatting-aware rectangular text cells, not font pixels or resource-pack glyph contours. Other icon types expose only their component plane or configured local geometry. See [Particle Layers](/gloss/25-particle-layers).

Emoji tokens, function tokens and inline expressions work exactly as they do on a scoreboard: `|animation.rainbow|`, `{{ player.name }}` and `{{ papi('vault_prefix', '&7Member') }}` are all valid text-icon content. Per-emoji permissions apply when enabled, and disabling emoji leaves tokens unchanged. See [Expressions & Placeholders](/gloss/13-expressions-placeholders) and [Emoji, Text & Animations](/gloss/07-emoji-text-animations).

### Dynamic text refresh

Dynamic text re-renders at `refreshTicks` while visible; plain text never refreshes periodically. A failed refresh leaves the previous text on screen, and unresolved PlaceholderAPI tokens stay as written. Changed text updates the click area with it.

Text also re-renders when the component opens, when the session rescales after a `[menus] uiScale` or `[preview] scale` change, when an image asset is added or changed, when the menu file changes, and when the API applies a new icon. A toggle refreshes only its visible icon: its condition is read when it opens, and later changes happen on click.

## `textImage`

```json
{ "type": "textImage", "path": "logo.png" }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `path` | string | yes (schema) | `null` | Record component is `relativePath`, bound to the JSON key `path`. Must resolve to a regular file inside the images folder |

Image assets live in `plugins/Gloss/images/`. Paths are relative to that folder and cannot be URLs. Blank, absolute, missing, directory, traversal and symlink-escape paths are rejected, and API paths are limited to 256 characters with no control characters or `:`. Adding, replacing or removing an image refreshes open menus and panels automatically.

Images are limited to 16 by 16 pixels; anything larger shows the missing-image checkerboard. Transparency is binary — any pixel below full alpha becomes a transparent spacer, and JPEG has no alpha channel at all.

## `animatedTextImage`

```json
{ "type": "animatedTextImage", "source": ["frame0.png", "frame1.png", "frame2.png"], "speed": 4 }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `source` | array of string, or a single string | yes (schema) | `null` | Each entry is a separate image file. There is no GIF frame extraction |
| `speed` | integer from 2 through 1200 | yes | none | Ticks between frame advances |

Animated images use the same pixel mapping, so the two-tick minimum caps them at ten frames per second. Short frames are padded at the bottom to keep a stable size, and changed files reload automatically.

## `item`

```json
{ "type": "item", "item": "minecraft:diamond_sword", "count": 1, "customModelValue": 3 }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `item` | string (Bukkit `Material` key) | yes (schema) | `null` | Record component is `materialType`, bound to the JSON key `item` |
| `count` | integer | no | `0` | `0` and negatives become `1` at icon construction |
| `customModelValue` | integer | no | `0` | Applied unconditionally, including `0` |

Item ids must be lowercase namespaced keys, such as `diamond_sword` or `minecraft:diamond_sword`. Unknown or malformed ids use the missing icon without breaking the rest of the menu. A count above 1 adds a white bold count label above the item.

A material that reports `isBlock()` renders as a block model, except for `BARRIER`, `LIGHT`, `HOPPER`, `TURTLE_EGG`, grass (`grass` / `short_grass`), `TALL_GRASS`, `GLASS_PANE` and the sixteen stained glass panes, `POPPY` and `DANDELION`, which stay flat.

## `playerHead`

```json
{
  "type": "playerHead",
  "player": "%player_name%",
  "refreshTicks": 20
}
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `player` | string | yes | none | Literal Minecraft username or a viewer-aware text-pipeline value. Blank fails icon construction |
| `refreshTicks` | integer 0 – 1200 | no | `20` | Ticks between re-reading the configured value and profile cache. `0` never refreshes |
| `style` | display style | no | defaults | The shared display style above |

The `player` value is trimmed and run through the viewer-aware text pipeline. `%player_name%`, `%player%` and `{{ player.name }}` resolve to the viewer even without PlaceholderAPI; spaces and case inside those three spellings are normalized. Other placeholders need the integration that provides them.

A result is eligible for a profile request only when it is 1–16 ASCII letters, digits or underscores. An invalid name or unresolved placeholder uses `[playerHeads] unknownFallbackItem` without making an outbound request, as does `[playerHeads] enabled = false`. See [Configuration](/gloss/02-configuration).

A literal name stops refreshing once it resolves; dynamic or unresolved names follow `refreshTicks`.

`playerHead` is configured in JSON or the web editor. The `seticon` command has no player-head type, and the public `HoloIcon` API has no player-head factory.

## `block`

```json
{ "type": "block", "block": "minecraft:stone" }
```

`block` must be a lowercase namespaced material id whose material reports `isBlock()`. The icon renders that material's **default** block state as one packet-only block display. It does not create or alter a world block, and there is no way to express directional or other block-state properties. Block icons are centered on the component with a matching automatic click area, and unknown or non-block ids use the missing icon.

## `customItem`

```json
{ "type": "customItem", "provider": "itemsadder", "item": "myitems:ruby", "count": 1 }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `provider` | string | no | `null` | Provider registry id. `null`, blank and `auto` all mean "try every ready provider in activation order" |
| `item` | string | yes in practice | `null` | Provider-specific id, passed through verbatim |
| `count` | integer | no | `0` | `0` and negatives become `1` after resolution |

`provider` is trimmed and lower-cased. `item` is neither trimmed nor case-folded, so provider-native syntaxes such as `myitems:ruby` (ItemsAdder) or `SWORD:CUTLASS` (MMOItems) stay as written. Missing or invalid items use the configured fallback icon.

Provider ids, activation order and the `[items] customItemProviders` allowlist are on [Custom Items & Item Providers](/gloss/14-custom-items).

## `entity`

```json
{ "type": "entity", "entity": "minecraft:parrot", "width": 0.5, "height": 0.9 }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `entity` | lowercase Bukkit entity id | yes | `null` | An omitted namespace defaults to `minecraft`. The type must report both `isSpawnable()` and `isAlive()` |
| `width` | finite number greater than 0, at most 64 | no | `1` | Editor silhouette and button/toggle click-plane width in blocks at session scale 1 |
| `height` | finite number greater than 0, at most 64 | no | `1` | Editor silhouette and button/toggle click-plane height in blocks at session scale 1 |

A `width` or `height` outside that range throws `width must be finite, greater than 0, and at most 64` and rejects the menu file. They size only the click area — they do not resize the entity or create collision.

The component anchor is the entity's **feet**, not its center. The entity is visible only to the viewer and cannot push or collide with players. Yaw and pitch follow the menu, and living entities stay upright when a panel uses roll, though the anchor and hitbox still rotate.

Because this is a raw entity rather than a display entity, none of the display-style metadata applies: no billboard, brightness, culling, glow, opacity or per-axis scale.

## Scale

| Layer | Source |
|---|---|
| Session scale | `[menus] uiScale` in `gloss.toml`, default `1.0`, clamped to 0.25 – 4.0 |
| Panel multiplier | A panel's own `scale`, applied on top: a panel's menu renders at `panelScale × uiScale` |
| Per-icon scale | `style.scaleX` / `scaleY` / `scaleZ`, each 0.01 – 64, multiplied onto the session scale for that icon only |

Personal menus opened by command or API use `uiScale` directly, so raising it grows every panel in proportion without touching the panel documents. Changing `[menus] uiScale` hot-reloads open menus and scales visuals and click areas together. See [Panels](/gloss/16-panels).

The `scale` command property sets all three scale axes and `brightness` sets both light values. Use `value=*` to clear a property.

## Setting icons by command

`/gloss menu seticon <menu> <row> <type> <value>` and `/gloss panel seticon <board> <row> <type> <value>` rewrite one row icon in place. Rows are one-based. Only `button` and `decoration` rows have a single editable icon; a toggle row is refused because it owns two.

| `type` argument | Aliases | `value` is | Written as |
|---|---|---|---|
| `text` | | The text, spaces and all | `{"type":"text","text":...}` |
| `image` | `textimage` | A path under `images/` | `{"type":"textImage","path":...}` |
| `animated` | `animatedimage`, `animatedtextimage` | Comma-separated frame paths | `{"type":"animatedTextImage","source":[...],"speed":5}` |
| `item` | | A material id, lower-cased for you | `{"type":"item","item":...,"count":1}` |
| `block` | | A material id, lower-cased for you | `{"type":"block","block":...}` |
| `entity` | | An entity id, lower-cased for you | `{"type":"entity","entity":...}` |
| `customItem` | `customitem` | `provider@item` | `{"type":"customItem","provider":...,"item":...,"count":1}` |

Type names ignore case, hyphens and underscores. Replacing an icon keeps its style unless the new type is `entity`. `/gloss menu image <menu> <path>` replaces the component list with one centered image.

## When an icon fails

An invalid icon becomes a black-and-magenta checkerboard and the rest of the menu still opens. A missing or `null` `icon` shows the same checkerboard without logging an error. Check that:

- `item` and `block` ids are valid lowercase material keys.
- `entity` names a living entity available on the server version.
- `customItem` names an item available from an enabled provider.
- `playerHead` has a non-blank player name.
- image paths stay inside `plugins/Gloss/images/` and name readable files.
- animated images contain at least one valid frame.

## The API-only type

One further enum constant, `itemStack`, exists with no JSON form: `{"type":"itemStack"}` fails with `Unknown type: itemStack`. Use `HoloIcon.item(ItemStack)` to display an existing stack, and `updateText` on an open text component to replace its lines and resize its click area. API icon factories otherwise match the JSON behavior and default styles; `animatedImage` requires 2 to 1200 ticks, and JSON `customItem` and `playerHead` icons have no public `HoloIcon` factory. See [API: Menus](/gloss/22-api-menus).

## Schema

`schema/gloss.schema.json` describes the JSON icon fields and powers validation in the web editor. `itemStack` is not listed because it has no JSON form, and the server ignores unknown icon keys. See [Web Editor & Sync](/gloss/18-web-editor).

In the menu preview, `item`, `block`, `entity` and `playerHead` icons render as 3D models drawn from the client's own asset pack; an entity with no rig shows its catalog sprite instead.
