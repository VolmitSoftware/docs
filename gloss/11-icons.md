---
title: "Icons"
description: "Gloss documentation: Icons"
published: true
date: 2026-08-22T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

An icon is the visual payload of a menu component. Every drawing
component owns exactly one icon. That icon owns the client-side entities
that are sent as packets to the viewer alone. Nothing an icon draws
exists as a world entity. This page covers every icon type reachable
from a menu document. It lists the keys each type accepts and the shared
display style block. It also covers what happens when an icon cannot be
built. Where components live and how they are clicked is on
[Components & Hitboxes](/gloss/10-components-hitboxes).

## Icon types

`icon` is a discriminated union. The `type` member selects the record. The remaining members are deserialized into it.

| `type` | Runtime class | Client entities produced |
|---|---|---|
| `text` | `TextMenuIcon` | One text display per line |
| `textImage` | `TextImageMenuIcon` | One text display per image row |
| `animatedTextImage` | `AnimatedTextImageMenuIcon` | One text display per row of frame 0 |
| `item` | `ItemMenuIcon` | One item display, plus one text display when the stack amount is above 1 |
| `block` | `BlockMenuIcon` | One block display using the material's default block state |
| `customItem` | `ItemMenuIcon` | Same as `item` |
| `entity` | `EntityMenuIcon` | One packet-only living entity |

One further enum constant, `itemStack`, exists but has no JSON form. See [The API-only type](#the-api-only-type).

The union adapter raises `JsonParseException` before the rest of the document is read:

| Condition | Message |
|---|---|
| No `type` member | `Missing type` |
| `type` is not a JSON primitive | `Type must be a string` |
| `type` is not a known discriminator | `Unknown type: <value>` |

Any of those aborts the whole menu file. The file is logged as `An error occurred while parsing menu config "<id>.json":`. The previously registered copy stays live. Record component names are the JSON keys verbatim. No field-naming policy is applied. Unknown members are ignored by Gson. Any list-typed key also accepts a single bare value in place of an array.

Dispatch to the runtime class is a type test over the parsed record. Data that matches nothing — including an absent or `null` `icon` — produces the missing-icon fallback described below, silently and with no warning.

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
| `lineWidth` | integer 1 – 16384 | `2000` | Client text-wrap width |
| `blockLight`, `skyLight` | paired integers 0 – 15, or both omitted | omitted | Packed brightness override. Supplying only one rejects the file with `blockLight and skyLight must be supplied together` |
| `viewRange` | finite number 0.01 – 64 | `1` | Display view-range metadata |
| `shadowRadius` | finite number 0 – 64 | `0` | Entity shadow radius |
| `shadowStrength` | finite number 0 – 1 | `0` | Entity shadow strength |
| `cullingWidth`, `cullingHeight` | finite number 0 – 4096 | `0` | Render-culling box. These do not define the click plane |
| `glowColor` | `#AARRGGBB` or `null` | `null` | Sets the glowing entity flag and supplies its color override |
| `scaleX`, `scaleY`, `scaleZ` | finite number 0.01 – 64 | `1` | Multiplies the session scale per axis. Automatic click geometry uses X and Y. Z is visual only |

The text-specific keys (`shadow`, `seeThrough`, `textAlignment`, `backgroundArgb`, `textOpacity`, `lineWidth`) apply to every display produced by `text`, `textImage` and `animatedTextImage`. `item`, `block` and `customItem` apply the generic display keys to their own display entity. The text keys apply only to an item optional count label.

An out-of-range number, a malformed ARGB string, an unpaired brightness value or an unknown enum constant throws during deserialization. The whole menu file fails to load rather than the one icon. ARGB strings must match `#` followed by exactly eight hex digits. Anything else fails with `ARGB colors must use #AARRGGBB`.

`entity` icons have no `style` component at all. The schema forbids the key on them. `/gloss menu style` refuses with `entity icons do not support display style`. The runtime does not validate menu files against the schema. A hand-written entity `style` is simply ignored by Gson. The entity renders with the defaults.

## `text`

```json
{ "type": "text", "text": "&6Balance:\n<gold>%vault_eco_balance%" }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `text` | string | yes (schema) | `null` | `null` is treated as `""` and renders as one empty line |
| `refreshTicks` | integer 0 – 1200 | no | automatic | Explicit ticks between live re-renders. `0` freezes after the first render. When omitted, ordinary dynamic text uses 10 ticks and clock-driven or named-animation text uses 1 tick |

`text` is split on the literal newline character `\n`. Each authored line becomes its own text display entity. A `refreshTicks` outside 0 – 1200 throws `refreshTicks must be between 0 and 1200` and rejects the menu file.

The default `lineWidth` of `2000` effectively prevents wrapping. A smaller styled value lets the client wrap inside that one entity. The automatic hitbox and the web editor preview both measure the authored line. They do not model that internal wrap.

### Text formatting

Each line first goes through the full viewer-aware text pipeline: functions, inline expressions, PlaceholderAPI, emoji and colors. The resulting legacy text is then rewritten into MiniMessage tags and deserialized. `&` and `§` are both accepted as legacy prefixes. The code letter is case-insensitive. A prefix not followed by a known code is copied through verbatim.

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

Substitution reaches PlaceholderAPI reflectively. It is a no-op when the viewer is `null` or the string contains no `%`. Plugin presence is re-probed at most once per second. A lookup or invocation failure is logged once. The text is served unresolved.

Rendering happens when the icon is constructed and then every
`refreshTicks` while that icon is visible when the source contains a complete
`%name%`, `|function|` or `{{ expression }}` token. Plain text does no periodic work at all
regardless of `refreshTicks`. A text icon whose last dynamic token is
edited away by the API stops refreshing from that point on.

A refresh that throws is logged once per icon with the menu id and player name. The previous text stays on screen. The next successful refresh clears the one-shot log latch.

The other points at which a text icon re-renders:

| Trigger | What happens |
|---|---|
| Component open | A new `TextMenuIcon` is built from the document |
| Visual refresh | Every open component is closed, the session rescales, then every component reopens. Fired by a `[menus] uiScale` or `[preview] scale` change and by image asset add, change or delete |
| Menu file change | Personal sessions showing that menu are destroyed. Panel views showing it reload in place and close if that fails |
| Toggle click | The toggle swaps to its other pre-built icon |
| API | `HoloIcon.Text` applied to an open component calls `updateText` |

`updateText` re-renders all lines and pushes only the lines that actually changed as metadata packets when the line count is stable. A changed line count removes and respawns that icon alone. Either path bumps the icon geometry revision. The owning clickable rebuilds its click plane on the next tick, before the next hover or click test. It returns `false` only when the icon display-entity state is missing or inconsistent.

A toggle builds its `trueIcon` and `falseIcon` once in its constructor and ticks only the visible one. A hidden text icon resumes its configured refresh after it becomes visible. The toggle `condition` placeholder is still evaluated exactly once, in the constructor. The state only flips on click.

## `textImage`

```json
{ "type": "textImage", "path": "logo.png" }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `path` | string | yes (schema) | `null` | Record component is `relativePath`, bound to the JSON key `path`. Must resolve to a regular file inside the images folder |

### Where images live

Image assets live in `plugins/Gloss/images/`. Gloss does not create that folder at startup — make it yourself when you have something to put in it, or let a HoloUi import or an editor sync publication carrying images create it. `path` is always relative to that folder. There is no URL support anywhere in the icon path. Sources are local files only.

Resolution canonicalizes both the images root and the requested file. It requires the result to still start with the root path **and** to be a regular file. Blank paths, absolute paths, missing files, directories, `..` escapes and symlink escapes all fail with `FileNotFoundException`. Traversal cannot read anything outside `plugins/Gloss/images/`. Format detection and decoding use Apache Commons Imaging. Any format it recognizes works.

Paths supplied through the API are checked twice. First the API own
sanitizer rejects blank values, values over 256 characters, and control
characters. It also rejects absolute paths, values containing `:`, and
any `..` segment. During that pass it normalises `\` to `/`. Then the
canonical containment check above runs again.

The images folder is its own entry on the shared hot-reload pass, at `[hotload] watchIntervalTicks` (default 5). One folder walk reports changed, added and removed files together, and any of the three refreshes the visuals of every open menu session and live panel view. Because icons are rebuilt on refresh, if you replace an image file, Gloss re-decodes it without a reload.

### Pixels to characters

One text display is emitted per pixel row, walking `x` left to right:

| Pixel | Emitted |
|---|---|
| Format is not JPEG and alpha is below 255 | A bold `" "` followed by a plain `" "` — two characters, the transparent spacer |
| Otherwise | One `█` glyph colored with the pixel's RGB, alpha discarded |

Transparency is binary. Any alpha below 255 is fully transparent. Anything else is fully opaque. The JPEG exemption exists because JPEG carries no alpha channel.

Text images are limited to 16 by 16 pixels. The limit is deliberate: every source row is a text
display and every source pixel is still a font glyph. Consecutive pixels with the same color are
encoded as one text run to reduce component and packet work. The vanilla full-block glyph retains
font advance and line spacing, so this renderer is intended for small pixel art rather than
continuous photographs. An oversized local image fails the icon and renders the missing-image
checkerboard.

A seamless raster cannot be substituted transparently with vanilla maps. Map pixels render only on
item frames, which snap to the block grid and cannot honor menu scale, arbitrary rotation,
billboarding or follow-player movement. Gloss therefore does not expose a map renderer on ordinary
menu image icons.

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

The frame counter increments every server tick and advances when it reaches `speed`. The two-tick
minimum caps the renderer at ten frames per second. The tick source is the menu session one-tick
task. It reaches only components that are currently open.

A frame advance sends metadata only for rows whose rendered component changed, and submits those
packets as one batch to the viewer. There is no respawn and no repositioning. The entity count is
fixed at spawn from frame 0 line count. The bottom padding guarantees that count matches every
other frame.

Each frame file is decoded once while the icon is constructed. Icons are reconstructed on component open and on every visual refresh. An image hot reload re-reads every frame of each affected icon.

## `item`

```json
{ "type": "item", "item": "minecraft:diamond_sword", "count": 1, "customModelValue": 3 }
```

| Key | Type | Required | Default | Notes |
|---|---|---|---|---|
| `item` | string (Bukkit `Material` key) | yes (schema) | `null` | Record component is `materialType`, bound to the JSON key `item` |
| `count` | integer | no | `0` | `0` and negatives become `1` at icon construction |
| `customModelValue` | integer | no | `0` | Applied unconditionally, including `0` |

`item` is read by a registry-backed adapter. The string is parsed as a namespaced key and then looked up in the Bukkit registry. The adapter is lenient. An id it cannot resolve becomes `null` instead of an exception. That has three consequences:

- Ids must be legal namespaced keys, which means lower case: `diamond_sword` or `minecraft:diamond_sword`. `DIAMOND_SWORD` is not a legal key string and resolves to nothing.
- A well-formed but unknown key also resolves to nothing.
- Either way the menu file still parses and every other component in it still builds. The icon itself fails at construction and falls back to the missing icon.

The stack is built at the resolved count (or `1`) and then has its custom model data set unconditionally. An item icon authored without `customModelValue` still carries an explicit custom model data of `0`. Setting model data is a no-op on materials that have no item meta.

### Item layout

Both item flavours render through the same runtime class. They differ only in how the `ItemStack` is obtained.

| Aspect | Behavior |
|---|---|
| Block test | The material reports `isBlock()` and is not on the blacklist below |
| Block blacklist | `BARRIER`, `LIGHT`, `HOPPER`, `TURTLE_EGG`, grass (`grass` / `short_grass`), `TALL_GRASS`, all sixteen stained glass panes, `GLASS_PANE`, `POPPY`, `DANDELION` |
| Block placement | Transform-local `(0, -0.95, 0.3)` from the icon position |
| Non-block placement | Transform-local `(0, -(1.0 + countOffset), 0)`, where `countOffset` is `0.0` when the amount is above 1 and `0.09` otherwise |
| Count label | Only when the amount is above 1: the number in white bold at transform-local `(0, -lineHeight - 0.37, 0)` from the icon position |
| Count changes | Adding or removing the label shifts the item display by `±0.09` in local space. Otherwise the existing label is renamed |
| Orientation | Fixed item displays follow the session transform. Display yaw and the block depth orbit are reapplied together whenever the transform changes |

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

If the registry lookup itself is unavailable the adapter falls back to an upper-cased enum lookup. An unnamespaced lowercase id still resolves on servers where the registry is not reachable. Unknown ids and non-block materials fail at construction and use the missing-icon fallback.

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

Resolution goes through the provider registry. Results are cached per
provider and item id and handed out as clones. No caller ever holds a
live registry instance. The registry returns nothing in several cases.
That result becomes an icon failure and the missing-icon fallback. It
happens when the item id is null or blank, or when
`[items] customItems` is off in `config.toml`. It also happens when no
provider matches the id or the named provider is not ready. A
main-thread-only provider called off-thread returns nothing as well. A
skipped off-thread provider is warned once per provider.

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

The component anchor is the entity **feet**, not its center. That is the one placement rule that differs from every other icon type. Gloss sends a private client team with collision set to `never`, a spawn packet, base entity metadata with gravity off, movement and orientation packets, and a destroy and team-removal packet, all to the one viewer. No Bukkit world entity is ever created, and the entity cannot physically push or collide with a player. Its ordinary client interaction outline is separate from physical collision; Gloss intercepts interaction packets for its own fake ids and routes them through the owning button or toggle logical-plane click path.

Body yaw, pitch and head yaw follow the session transform. A fixed entity icon turns with a following menu as the player turns, and unchanged poses send no duplicate packets. Vanilla living entities have no arbitrary roll transform, so a rolled panel rotates the entity anchor and any authored click plane but keeps the living model upright around its own forward axis. The web editor's 3D preview follows that same distinction.

The explicit dimensions do not rescale the client model or create physical collision. For a button or toggle they center Gloss's logical click plane half the authored height above the feet and scale that plane by the session scale. A decoration has no click plane. To change how large the entity looks, pick a different entity.

Because the icon is a raw entity rather than a display entity, none of the display-style metadata applies. Billboard, brightness, culling, glow, opacity and per-axis scale are all unavailable here.

## Scale

`uiScale` is the one knob that scales an entire menu.

| Layer | Source |
|---|---|
| Session scale | `[menus] uiScale` in `config.toml`, default `1.0`, clamped to 0.25 – 4.0 |
| Panel multiplier | A panel's own `scale`, applied on top: a panel's menu renders at `panelScale × uiScale` |
| Per-icon scale | `style.scaleX` / `scaleY` / `scaleZ`, each 0.01 – 64, multiplied onto the session scale for that icon only |

Personal menus opened by command or by the API use `uiScale` directly. Panels multiply their own scale into it. If you raise `uiScale`, every panel grows in proportion without touching the panel documents. See [Panels](/gloss/16-panels).

If you change `[menus] uiScale` on disk, Gloss hot-reloads and triggers a visual refresh. Every open component closes. The session picks up the new scale. Every component reopens. The custom-item prototype cache is invalidated at the same time. Session scale feeds the rendered line height, the character width used for automatic hitbox width, and the display entity scale metadata. A scale change moves the click plane along with the visuals.

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

Validation and loading failures inside an icon constructor are reported as `MenuIconException`. Any unchecked exception a constructor lets out is treated the same way:

| Type | Message | Cause |
|---|---|---|
| `item` | `Item icon has an unknown or invalid item id` | `item` is absent, is not a legal namespaced key, or names nothing in the registry |
| `item` | `Unable to build an item icon from "%s"` | The material resolved but no stack could be built from it |
| `block` | `Block icon has an unknown or invalid block id` | `block` is absent, malformed, or names nothing |
| `block` | `Block icon material "%s" is not a block` | The material resolves but cannot be represented as a block display |
| `block` | `Unable to create the default block state for "%s"` | The server could not create the material's default block data |
| `customItem` | `Unable to resolve custom item "%s" from provider "%s"` | The provider registry returned nothing. A blank provider is reported as `auto` |
| `entity` | `Entity icon has an unknown or invalid entity id` | `entity` is absent, malformed, or absent from the entity registry |
| `entity` | `Entity icon type "%s" is not a spawnable living entity` | The id resolves to a player, item, projectile, display, interaction or another unsafe type |
| `entity` | `Unable to resolve packet entity type "%s"` | The packet layer threw while mapping the type |
| `entity` | `Entity type "%s" is unavailable on this server version` | Bukkit accepts the type but the packet layer has no mapping for the running server version |
| `textImage` | `Image icon has no path` | `path` is absent or blank |
| `textImage` | `Failed to load relative image "%s"!` | The path is absolute, escapes the images root, is missing, is a directory, or could not be decoded |
| `animatedTextImage` | `Animated icon has no source frames` | `source` is absent or empty |
| `animatedTextImage` | `Animated icon has a frame without a path` | One `source` entry is null or blank |
| `animatedTextImage` | `Failed to construct animated icon!` | A frame path is absolute, escapes the images root, is missing, or could not be decoded |

### The missing icon

Icon creation catches all of the above. It logs the stack with the owning component id (`An error occurred while creating a Menu Icon for the component "%s":`). It logs `Falling back to missing icon.` It returns the missing icon in its place. That fallback is an eight-row, eight-glyph checkerboard: rows 1 – 4 are four `#000000` glyphs then four `#f800f8` glyphs, and rows 5 – 8 are the reverse. Black and magenta, in the shape of the icon that should have been there.

A broken icon never costs more than that icon. Unresolvable ids are tolerated by the parser. The menu file is still registered. Every other component in it still builds. No icon failure reaches spawn.

If constructing the fallback itself throws, an `IllegalStateException` carrying both failures is raised instead. The session open path then removes any entities it had already spawned and refuses the open. A half-drawn menu is never left on a player screen.

An absent or `null` `icon` is not an error. It produces the missing icon with no log line at all. A menu that renders as checkerboards with a clean console usually means a component is missing its `icon` key entirely.

## The API-only type

`itemStack` is a declared icon type with no data class. The union adapter filters it out of its map in both directions.

| Constant | State |
|---|---|
| `itemStack` | API only. It wraps a live `org.bukkit.inventory.ItemStack` and is reachable through `HoloIcon.item(ItemStack)`, which clones on the way in and again on read. The renderer clones once more before drawing |

`{"type":"itemStack"}` fails with `Unknown type: itemStack`. Serializing one fails the same way. There is no NBT or serialized-stack JSON form of an icon. See [API: Menus](/gloss/22-api-menus).

The other API icon factories map straight onto the JSON records. `HoloIcon.text` becomes a `text`
icon with default `refreshTicks`. `block` becomes `block`. `image` becomes `textImage`.
`animatedImage` becomes `animatedTextImage` and rejects a tick speed outside 2 through 1200.
`entity` becomes `entity`. None of them carries a style block. An API-applied icon always renders
with the style defaults.

## Schema

`schema/gloss.schema.json` defines `$defs.icon` as the union above. It requires `type`. It requires a namespaced block key and entity key. It requires integer item counts. It requires non-blank image and item paths. It requires at least one non-blank animation source and an animation speed from 2 through 1200. It constrains text refresh intervals to 0 – 1200. It allows an integer `customModelValue` with no minimum. It constrains entity dimensions to greater than 0 and at most 64. The entity branch explicitly forbids `style`. `itemStack` is unlisted because it has no JSON form.

The schema is advisory. It is not read at runtime. No JSON Schema validator runs in the loader. Gson is the behavioral authority. That is why unknown icon keys are silently ignored in a running server even though the style object marks them invalid. The schema is what the web editor validates against. See [Web Editor & Sync](/gloss/18-web-editor).
