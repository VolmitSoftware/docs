---
title: "Icons"
description: "Gloss documentation: Icons"
published: true
date: 2026-08-26
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Each menu component has one icon visible only to its viewer. This page lists the icon types, their JSON keys, and the shared display style. Component placement and clicks are covered by
[Components & Hitboxes](/gloss/10-components-hitboxes).

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

One further enum constant, `itemStack`, exists but has no JSON form. See [The API-only type](#the-api-only-type).

These errors reject the menu file:

| Condition | Message |
|---|---|
| No `type` member | `Missing type` |
| `type` is not a JSON primitive | `Type must be a string` |
| `type` is not a known discriminator | `Unknown type: <value>` |

The previous working copy stays active. Unknown keys are ignored. A list key also accepts one bare value. A missing or `null` icon uses the fallback described below.

## The display style block

Every JSON-authorable icon type except `entity` accepts the same optional `style` object. Omission, an explicit `null` and an empty object all resolve to the same runtime defaults.

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
| `viewRange` | finite number 0.01 – 64 | `1` | Display view-range metadata |
| `shadowRadius` | finite number 0 – 64 | `0` | Entity shadow radius |
| `shadowStrength` | finite number 0 – 1 | `0` | Entity shadow strength |
| `cullingWidth`, `cullingHeight` | finite number 0 – 4096 | `0` | Render-culling box. These do not define the click plane |
| `glowColor` | `#AARRGGBB` or `null` | `null` | Sets the glowing entity flag and supplies its color override |
| `scaleX`, `scaleY`, `scaleZ` | finite number 0.01 – 64 | `1` | Multiplies the session scale per axis. Automatic click geometry uses X and Y. Z is visual only |

The text-specific keys (`shadow`, `seeThrough`, `textAlignment`, `backgroundArgb`, `textOpacity`, `lineWidth`) apply to every display produced by `text`, `textImage` and `animatedTextImage`. `item`, `playerHead`, `block` and `customItem` apply the generic display keys to their own display entity. The text keys apply only to an item's optional count label; a player head always has amount one and creates no count label.

An out-of-range value, malformed ARGB string, unpaired brightness value, or unknown enum rejects the menu file. ARGB colors require `#AARRGGBB`.

`entity` icons do not support `style`. `/gloss menu style` reports `entity icons do not support display style`, and a hand-written style is ignored.

## `text`

```json
{ "type": "text", "text": "&6Balance:\n<gold>%vault_eco_balance%" }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `text` | string | yes (schema) | `null` | `null` is treated as `""` and renders as one empty line |
| `refreshTicks` | integer 0 – 1200 | no | automatic | Explicit ticks between live re-renders. `0` freezes after the first render. When omitted, ordinary dynamic text uses 10 ticks and clock-driven or named-animation text uses 1 tick |

`text` is split on the literal newline character `\n`. Each authored line becomes its own text display entity. A `refreshTicks` outside 0 – 1200 throws `refreshTicks must be between 0 and 1200` and rejects the menu file.

The default `lineWidth` of `16384` disables practical wrapping. Set a smaller value only when that text display should wrap at an explicit font-pixel width. The automatic hitbox and the web editor preview both measure the authored line. They do not model that internal wrap.

### Text formatting

Each line first goes through the full viewer-aware text pipeline: functions, inline expressions, PlaceholderAPI, emoji and colors. The resulting legacy text is then rewritten into MiniMessage tags and deserialized. `&` and `§` are both accepted as legacy prefixes. The code letter is case-insensitive. A prefix not followed by a known code is copied through verbatim.

An authored `<particles:name>...</particles>` range can select part of a `text` icon for a menu
particle layer. `letterBounds`, `glyphOutline` and `glyphFill` use formatting-aware rectangular text
cells, not Minecraft font pixels or resource-pack glyph contours. Other icon types expose only their
component plane or authored local geometry; particle layers do not trace image alpha, item models,
block meshes or entity silhouettes. See [Particle Layers](/gloss/25-particle-layers).

| Legacy | MiniMessage tag |
|---|---|
| `&0` – `&9`, `&a` – `&f` | `<black>`, `<dark_blue>`, `<dark_green>`, `<dark_aqua>`, `<dark_red>`, `<dark_purple>`, `<gold>`, `<gray>`, `<dark_gray>`, `<blue>`, `<green>`, `<aqua>`, `<red>`, `<light_purple>`, `<yellow>`, `<white>` |
| `&k` | `<obfuscated>` |
| `&l` | `<bold>` |
| `&m` | `<strikethrough>` |
| `&n` | `<underlined>` |
| `&o` | `<italic>` |
| `&r` | `<reset>` |

Every generated tag is one MiniMessage accepts. The two notations mix freely in one string. No code leaks through as literal text. The rewrite runs after placeholder substitution. Section-sign codes emitted by a placeholder are rewritten as well. Legacy hex is accepted in both spellings. Gloss own `[rrggbb]` bracket form and the `&x&r&r&g&g&b&b` sequence both become `<#rrggbb>`, alongside MiniMessage own `<#rrggbb>`.

### Emoji

Text icon lines run the emoji stage between placeholder substitution and the MiniMessage parse. `:heart:` and any configured trigger such as `<3` resolve in a menu label and a panel row exactly as they do in a hologram line. Per-emoji permissions apply when `[emoji] emojiSpecificPermissions` is on, because a menu icon always knows its viewer. With the default `false` every viewer sees the same glyph. If you turn `[features] emoji` off, the stage is removed. `:heart:` stays as written.

Function tokens and inline expressions use the same facilities as a scoreboard. `|animation.rainbow|`, `{{ player.name }}` and `{{ papi('vault_prefix', '&7Member') }}` are valid text-icon content. See [Expressions & Placeholders](/gloss/13-expressions-placeholders) and [Emoji, Text & Animations](/gloss/07-emoji-text-animations).

### Dynamic text refresh

PlaceholderAPI tokens stay unchanged when PlaceholderAPI is unavailable or a lookup fails.

Rendering happens when the icon is constructed and then every
`refreshTicks` while that icon is visible when the source contains a complete
`%name%`, `|function|` or `{{ expression }}` token. Plain text does no periodic work at all
regardless of `refreshTicks`. A text icon whose last dynamic token is
edited away by the API stops refreshing from that point on.

A failed refresh leaves the previous text on screen.

The other points at which a text icon re-renders:

| Trigger | What happens |
|---|---|
| Component open | A new `TextMenuIcon` is built from the document |
| Visual refresh | Every open component is closed, the session rescales, then every component reopens. Fired by a `[menus] uiScale` or `[preview] scale` change and by image asset add, change or delete |
| Menu file change | Personal sessions showing that menu are destroyed. Panel views showing it reload in place and close if that fails |
| Toggle click | The toggle swaps to its other pre-built icon |
| API | `HoloIcon.Text` applied to an open component calls `updateText` |

`updateText` replaces the rendered lines and updates the click area when the text size changes.

A toggle refreshes only its visible icon. Its initial condition is checked when the toggle opens; later changes happen on click.

## `textImage`

```json
{ "type": "textImage", "path": "logo.png" }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `path` | string | yes (schema) | `null` | Record component is `relativePath`, bound to the JSON key `path`. Must resolve to a regular file inside the images folder |

### Where images live

Image assets live in `plugins/Gloss/images/`. Gloss does not create that folder at startup. Create it when needed, or let a HoloUi import or an editor sync publication containing images create it. `path` is always relative to that folder. Icon paths support local files, not URLs.

Paths must name a file inside `plugins/Gloss/images/`. Blank, absolute, missing, directory, traversal, and symlink-escape paths are rejected. API paths are limited to 256 characters and cannot contain control characters or `:`.

The images folder is its own entry on the shared hot-reload pass, at `[hotload] watchIntervalTicks` (default 5). One folder walk reports changed, added and removed files together, and any of the three refreshes the visuals of every open menu session and live panel view. Because icons are rebuilt on refresh, if you replace an image file, Gloss re-decodes it without a reload.

### Pixels to characters

One text display is emitted per pixel row, walking `x` left to right:

| Pixel | Emitted |
|---|---|
| Format is not JPEG and alpha is below 255 | A bold `" "` followed by a plain `" "` — two characters, the transparent spacer |
| Otherwise | One `█` glyph colored with the pixel's RGB, alpha discarded |

Transparency is binary. Any alpha below 255 is fully transparent. Anything else is fully opaque. The JPEG exemption exists because JPEG carries no alpha channel.

Text images are limited to 16 by 16 pixels and work best for small pixel art. Larger images use the missing-image checkerboard.

## `animatedTextImage`

```json
{ "type": "animatedTextImage", "source": ["frame0.png", "frame1.png", "frame2.png"], "speed": 4 }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `source` | array of string, or a single string | yes (schema) | `null` | Each entry is a separate image file. There is no GIF frame extraction |
| `speed` | integer from 2 through 1200 | yes | none | Ticks between frame advances |

Pixel mapping is the same as `textImage` with two differences. The JPEG
exemption is absent, so the alpha test runs for every format. Every
frame shorter than the tallest frame is padded at the bottom. The pad
is blank rows built from that frame own width, using the same
bold-space and space pair. All frames end up with the same line count.

The two-tick minimum limits animations to ten frames per second. Shorter frames are padded at the bottom so the icon keeps a stable size. Changed image files are reloaded automatically.

## `item`

```json
{ "type": "item", "item": "minecraft:diamond_sword", "count": 1, "customModelValue": 3 }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `item` | string (Bukkit `Material` key) | yes (schema) | `null` | Record component is `materialType`, bound to the JSON key `item` |
| `count` | integer | no | `0` | `0` and negatives become `1` at icon construction |
| `customModelValue` | integer | no | `0` | Applied unconditionally, including `0` |

Item IDs must be lowercase namespaced keys, such as `diamond_sword` or `minecraft:diamond_sword`. Unknown or malformed IDs use the missing icon without breaking the rest of the menu.

The stack is built at the resolved count (or `1`) and then has its custom model data set unconditionally. An item icon authored without `customModelValue` still carries an explicit custom model data of `0`. Setting model data is a no-op on materials that have no item meta.

### Item layout

Both item types use the same layout.

| Aspect | Behavior |
|---|---|
| Block test | The material reports `isBlock()` and is not on the blacklist below |
| Block blacklist | `BARRIER`, `LIGHT`, `HOPPER`, `TURTLE_EGG`, grass (`grass` / `short_grass`), `TALL_GRASS`, all sixteen stained glass panes, `GLASS_PANE`, `POPPY`, `DANDELION` |
| Block placement | Transform-local `(0, -0.95, 0.3)` from the icon position |
| Non-block placement | Transform-local `(0, -(1.0 + countOffset), 0)`, where `countOffset` is `0.0` when the amount is above 1 and `0.09` otherwise |
| Count label | Only when the amount is above 1: the number in white bold at transform-local `(0, -lineHeight - 0.37, 0)` from the icon position |
| Count changes | Adding or removing the label shifts the item display by `±0.09` in local space. Otherwise the existing label is renamed |
| Orientation | Fixed item displays follow the session transform. Display yaw and the block depth orbit are reapplied together whenever the transform changes |

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
| `refreshTicks` | integer 0 – 1200 | no | `20` | Ticks between re-reading the authored value and profile cache. `0` never refreshes |
| `style` | display style | no | defaults | The generic item-display style described above |

The authored `player` value is trimmed and runs through the viewer-aware text pipeline.
`%player_name%`, `%player%` and `{{ player.name }}` resolve to the viewer even without
PlaceholderAPI; spaces and case inside those three spellings are normalized. Other placeholders
need the integration that provides them. A result is eligible for a profile request only when it is
1–16 ASCII letters, digits or underscores. An invalid name or unresolved placeholder uses the
configured fallback without making an outbound request.

Resolution is asynchronous and cached case-insensitively. A fresh valid name first draws an
unowned player head. A later refresh swaps in the resolved profile texture, while a confirmed
unknown name draws `[playerHeads] unknownFallbackItem`. Online players reuse their live profile
without an outbound update. Offline resolution is bounded and time-limited; the full cache and
queue contract is in [Configuration](/gloss/02-configuration).

A literal name stops refreshing after it resolves. A dynamic source, pending request or unknown
name continues at `refreshTicks`, allowing cache expiry and retries to take effect. With
`refreshTicks = 0`, a request that was pending at spawn remains the unowned head until that
component is rebuilt. With `[playerHeads] enabled = false`, every player-head icon draws the
fallback and no profile request is made.

`playerHead` is authored in JSON or the web editor. The `seticon` command has no player-head type,
and the public `HoloIcon` API has no player-head factory.

## `block`

```json
{ "type": "block", "block": "minecraft:stone" }
```

`block` must be a lowercase namespaced material id whose resolved material reports `isBlock()`. The icon renders that material **default** block state as one packet-only block display. It does not create or alter a world block. There is no way to express directional or other block-state properties.

The display is drawn at `0.75` blocks square before scaling. It is
offset `0.05` blocks down from the icon anchor in local space. It is
then translated so it is centered on that point rather than hanging off
one corner. Its automatic click plane matches: `0.75` multiplied by the
session scale and the style X and Y scale. All generic display-style
keys apply.

Unknown IDs and non-block materials use the missing icon.

## `customItem`

```json
{ "type": "customItem", "provider": "itemsadder", "item": "myitems:ruby", "count": 1 }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `provider` | string | no | `null` | Provider registry id. `null`, blank and `auto` all mean "try every ready provider in activation order" |
| `item` | string | yes in practice | `null` | Provider-specific id, passed through verbatim |
| `count` | integer | no | `0` | `0` and negatives become `1` after resolution |

`provider` is trimmed and lower-cased. `item` is neither trimmed nor case-folded. Provider-native syntaxes such as `myitems:ruby` (ItemsAdder) or `SWORD:CUTLASS` (MMOItems) survive exactly as authored.

Custom-item icons use the first enabled provider that recognizes the item ID. Missing or invalid items use the configured fallback icon.

Provider ids, activation order, the `[items] customItemProviders` allowlist and the individual adapters are on [Custom Items & Item Providers](/gloss/14-custom-items).

## `entity`

```json
{ "type": "entity", "entity": "minecraft:parrot", "width": 0.5, "height": 0.9 }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `entity` | lowercase Bukkit entity id | yes | `null` | An omitted namespace defaults to `minecraft`. The type must report both `isSpawnable()` and `isAlive()` |
| `width` | finite number greater than 0, at most 64 | no | `1` | Editor silhouette and button/toggle click-plane width in blocks at session scale 1 |
| `height` | finite number greater than 0, at most 64 | no | `1` | Editor silhouette and button/toggle click-plane height in blocks at session scale 1 |

A `width` or `height` outside that range throws `width must be finite, greater than 0, and at most 64` during deserialization and rejects the menu file.

The component anchor is the entity's **feet**, not its center. The entity is visible only to the viewer and cannot push or collide with players.

Body yaw, pitch and head yaw follow the session transform. A fixed entity icon turns with a following menu as the player turns, and unchanged poses send no duplicate packets. Vanilla living entities have no arbitrary roll transform, so a rolled panel rotates the entity anchor and any authored click plane but keeps the living model upright around its own forward axis. The web editor's 3D preview follows that same distinction.

The explicit dimensions do not rescale the client model or create physical collision. For a button or toggle they center Gloss's logical click plane half the authored height above the feet and scale that plane by the session scale. A decoration has no click plane. To change how large the entity looks, pick a different entity.

Because the icon is a raw entity rather than a display entity, none of the display-style metadata applies. Billboard, brightness, culling, glow, opacity and per-axis scale are all unavailable here.

## Scale

`uiScale` is the one knob that scales an entire menu.

| Layer | Source |
|---|---|
| Session scale | `[menus] uiScale` in `gloss.toml`, default `1.0`, clamped to 0.25 – 4.0 |
| Panel multiplier | A panel's own `scale`, applied on top: a panel's menu renders at `panelScale × uiScale` |
| Per-icon scale | `style.scaleX` / `scaleY` / `scaleZ`, each 0.01 – 64, multiplied onto the session scale for that icon only |

Personal menus opened by command or by the API use `uiScale` directly. Panels multiply their own scale into it. If you raise `uiScale`, every panel grows in proportion without touching the panel documents. See [Panels](/gloss/16-panels).

Changing `[menus] uiScale` hot-reloads open menus and scales their visuals and click areas together.

Command-set styles fold two convenience properties into the JSON keys. `/gloss menu style <menu> <row> scale <value>` writes `scaleX`, `scaleY` and `scaleZ` together. `brightness <0-15>` writes `blockLight` and `skyLight` together. `value=*` clears whichever keys that property owns. A `style` object left empty by a clear is removed from the icon entirely.

## Setting icons by command

`/gloss menu seticon <menu> <row> <type> <value>` and `/gloss panel seticon <board> <row> <type> <value>` rewrite one row icon in place. Rows are one-based. Only `button` and `decoration` rows have a single editable icon. A toggle row is refused because it owns two.

| `type` argument | Aliases | `value` is | Written as |
|---|---|---|---|
| `text` | | The text, spaces and all | `{"type":"text","text":...}` |
| `image` | `textimage` | A path under `images/` | `{"type":"textImage","path":...}` |
| `animated` | `animatedimage`, `animatedtextimage` | Comma-separated frame paths | `{"type":"animatedTextImage","source":[...],"speed":5}` |
| `item` | | A material id, lower-cased for you | `{"type":"item","item":...,"count":1}` |
| `block` | | A material id, lower-cased for you | `{"type":"block","block":...}` |
| `entity` | | An entity id, lower-cased for you | `{"type":"entity","entity":...}` |
| `customItem` | `customitem` | `provider@item` | `{"type":"customItem","provider":...,"item":...,"count":1}` |

Type names are matched case-insensitively with `-` and `_` stripped. An existing `style` object is carried over onto the replacement icon, except when the new type is `entity`, which cannot hold one. `/gloss menu image <menu> <path>` is a shortcut that replaces the entire menu with a single centered decoration whose icon is that image.

## When an icon fails

An invalid icon becomes the missing icon without breaking the rest of the menu. Check these values first:

- `item` and `block` IDs are valid lowercase material keys.
- `entity` names a living entity available on the server version.
- `customItem` names an item available from an enabled provider.
- `playerHead` has a non-blank player name.
- Image paths stay inside `plugins/Gloss/images/` and name readable files.
- Animated images contain at least one valid frame.

### The missing icon

An invalid icon becomes a black-and-magenta checkerboard. Other components in the menu still open.

An absent or `null` `icon` is not an error. It produces the missing icon with no log line at all. A menu that renders as checkerboards with a clean console usually means a component is missing its `icon` key entirely.

## The API-only type

`itemStack` is available only through the API.

Use `HoloIcon.item(ItemStack)` to display an existing item stack.

`{"type":"itemStack"}` fails with `Unknown type: itemStack`. Serializing one fails the same way. There is no NBT or serialized-stack JSON form of an icon. See [API: Menus](/gloss/22-api-menus).

The API icon factories map straight onto their corresponding JSON records. `HoloIcon.text` becomes a `text`
icon with default `refreshTicks`. `block` becomes `block`. `image` becomes `textImage`.
`animatedImage` becomes `animatedTextImage` and rejects a tick speed outside 2 through 1200.
`entity` becomes `entity`. None of them carries a style block. An API-applied icon always renders
with the style defaults. JSON `customItem` and `playerHead` icons have no public `HoloIcon` factory.

## Schema

`schema/gloss.schema.json` defines `$defs.icon` as the union above. It requires `type`. It requires a namespaced block key and entity key. It requires integer item counts. It requires non-blank image, item and player-head names. It requires at least one non-blank animation source and an animation speed from 2 through 1200. It constrains text and player-head refresh intervals to 0 – 1200. It allows an integer `customModelValue` with no minimum. It constrains entity dimensions to greater than 0 and at most 64. The entity branch explicitly forbids `style`. `itemStack` is unlisted because it has no JSON form.

The schema describes the JSON format and powers validation in the web editor. The server ignores unknown icon keys. See [Web Editor & Sync](/gloss/18-web-editor).
