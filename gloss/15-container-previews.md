---
title: "Container Previews"
description: "Gloss documentation: Container Previews"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Look at a chest and a holographic card appears in front of you. The card shows what is inside.
Nothing is clicked. No inventory is opened.

An eye raycast runs every tick. When it lands on a container, a card is built from a JSON document
in `plugins/Gloss/previews/`. Thirteen documents ship. They hot-reload. A document you write can
shadow any of them.

## What triggers a preview

Every tick, for every online player, Gloss casts a ray from the eye along the look direction. The
ray goes out to `[preview] lookDistance` blocks (default `10.0`, clamped `1.0`–`24.0`). Fluids are
ignored. Passable blocks are skipped. Two rays are cast:

- one against blocks, keeping the hit only when some loaded document names that material.
- one against entities within a 0.35-block ray radius. That hit is kept only when the entity is an
  inventory-holding minecart or chest boat that some document claims.

If only one hits, that is the target. If both hit, the entity wins unless the block is closer by
more than 0.01 blocks. When the target changes, the open preview is closed and a new one is built.
When the ray hits nothing, the preview closes.

This is not an inventory event. Nothing about the container is opened. No `InventoryOpenEvent`
fires. Other players see nothing.

`[features] previews = false` turns the whole subsystem off. The raycast returns nothing immediately.
No preview is ever built. Documents still load and hot-reload.

A block's material is eligible only because a document names it, exactly or through a glob. To make
a new block type previewable, add its material to a document's `match.blocks`. The
`anyInventoryHolder` fallback contributes no materials. It exists for entities.

## Who can see one

`gloss.preview` (singular) is the visibility permission. It gates no command. It is checked when the
preview is built. It defaults to **op**. On a default install, ordinary players do not see container
contents until you grant it.

Before the contents card is built the viewer must pass every one of these:

1. `gloss.preview`.
2. the container is physically openable. A chest or ender chest with a solid block above it is
   blocked. A shulker box whose lid has no room to open is blocked.
3. the container is not locked, or the viewer holds the matching key. Locks are evaluated through Paper's
   own lock-check event when the running server has it, so another plugin's ruling applies. Otherwise the
   key item in the main hand is compared directly. Spectators bypass a lock the event did not explicitly
   deny.
4. for a double chest, both halves pass 2 and 3.
5. the container protection layer allows it (see below).

A viewer who fails any of these gets the **locked card**. That card is the padlock drawn by
`previews/locked.json`. It is shown instead of the contents. That includes failing the permission
check. A player without `gloss.preview` sees a padlock on every container rather than nothing at
all. Remove `previews/locked.json` and nothing is drawn in that case.

Access is re-checked every 10 ticks while a preview is open. If the answer flips — a chest gets
locked, a region is redefined — the open preview is dropped. The next tick rebuilds the correct one.

### Container protection

WorldGuard is used automatically when it is installed and enabled. It is picked up live if it
enables after Gloss.

Block access goes through WorldGuard's own block-interact protection query, plus the double-chest
partner. Entity access is a region test of the `CHEST_ACCESS` flag at the entity's location. Region
checks are skipped in worlds where WorldGuard has regions disabled. A player with WorldGuard bypass
is always allowed. WorldGuard disabling drops Gloss back to allow-all.

If the WorldGuard bridge cannot be built or throws, previews **fail closed**. Everything shows the
locked card. One line is logged:
`Container access protection failed. Previews will remain locked until the protection provider recovers.`

After the protection provider allows access, Gloss fires a cancellable
`GlossContainerPreviewAccessEvent`. The event carries the viewer and either the block or the
entity. Cancelling it denies the preview. That is how a claims or locks plugin plugs in without
Gloss knowing about it. The event contract is on [API: Previews](/gloss/24-api-previews).

## Scale

Two multipliers decide how big the card is drawn. They sit on top of a distance factor that shrinks
the card as you back away from the container.

| Source | Range | Scope |
|---|---|---|
| `[preview] scale` in `config.toml` | `0.25`–`4.0`, default `0.65` | server-wide |
| The per-player factor | `0.25`–`2.5`, default `1.0` | one player |

The per-player factor is not a command. While a preview is on screen, **double-tap sneak** to enter
adjust mode. Then **hold sneak and scroll the hotbar** to resize. The hotbar slot does not change
while you do.

Each step multiplies the factor by 1.1 or divides it by 1.1. The action bar shows the current
percentage. Double-tap sneak again to save.

Below 0.30 the preview is treated as hidden. Nothing is drawn at all. The action bar says so. That
is the opt-out for players who do not want previews. Scrolling back up restores them.

Adjust mode also ends when the preview goes away. It also ends on the first scroll after 20 seconds
of inactivity. The value is saved either way. Values are stored per player UUID in
`plugins/Gloss/preview-scales.json`, rounded to two decimals. A player left at exactly `1.0` is not
written to the file at all.

Changing `[preview] scale` in `config.toml` re-renders open previews immediately.

## The preview document

One `.json` file in `plugins/Gloss/previews/` is one document. The file name without `.json` is its
id. Preview documents carry **no** `schemaVersion` and **no** `revision`. The envelope described on
[Data Files & Hot Reload](/gloss/03-data-files) does not apply here. Subfolders are ignored.

A document has four top-level keys. All are optional:

```json
{
  "match":    { },
  "variants": [ ],
  "card":     { },
  "elements": [ ]
}
```

`match` says what the document draws and how strongly it claims it. `variants` restyle and extend
that. `card` is the chrome. `elements` is the content, in paint order. A document that emits no
elements draws no preview.

The JSON Schema at `Gloss/schema/gloss-preview.schema.json` describes the same format for editors
that consume it. It is documentation-grade. The Java parser enforces rules the schema cannot
express.

### `match`

| Key | Type | Default | Meaning |
|---|---|---|---|
| `blocks` | string[] | none | Block materials this document draws |
| `entities` | string[] | none | Entity types this document draws |
| `special` | string | none | `enderChest`, `locked` or `anyInventoryHolder` |
| `priority` | int | `0` | Higher wins. Every shipped document uses `10` |
| `vars` | object | `{}` | Document constants, read as `vars.<name>` |

Names are uppercased before matching. `*` is the only wildcard, so `*_SHULKER_BOX` and `*_SHELF`
work. An unknown material or entity name logs `unknown block material '<NAME>' at match.blocks[n],
still compiling` and the document still loads. A document survives a version that dropped the type.

A document with no `blocks`, no `entities` and no `special` claims nothing. It is never resolved.

The three `special` markers are roles, not targets:

| `special` | What it does |
|---|---|
| `enderChest` | Draws the **viewer's own** ender chest instead of a tile entity. The block still has to be matched by `match.blocks` for the raycast to stop on it |
| `locked` | The target-less card shown when a viewer may not open the container. It has the viewing player and standard player/server expression context, but no block, entity or inventory state |
| `anyInventoryHolder` | The fallback for an inventory-holding entity no document names |

`special` and `priority` are read from the top-level `match` only.

### `variants`

A variant is the match shape again. Only `blocks`, `entities` and `vars` are read from it. A variant
both restyles **and** extends matching. A material named only in a variant makes the whole document
resolvable for it.

Variants are tried in declaration order. The first whose names match the target wins. Its `vars` are
merged over the document's own. A target no variant claims gets the document defaults unchanged.

That is how one `chest.json` covers chests, trapped chests, barrels, copper chests and all seventeen
shulker box colors. One slot grid. Twenty variants supply a title key and an accent color each.

### `vars`

`vars` values are JSON primitives. They are **never** parsed as expressions. `"vars.accent"` in an
expression resolves to exactly the literal written in the document.

The one exception is a string leading with `#`. It is read as a color literal — `#RGB`, `#RRGGBB`
or `#AARRGGBB`. JSON cannot express an ARGB value with the alpha byte set as a plain number without
it becoming negative. A leading `#` that is not a valid color literal is a compile error, not a
string. A MiniMessage tag like `"<#F2A535>"` is ordinary text, because it does not lead with the
hash.

### `card`

Declaring a `card` object at all asks for the chrome. `framed` defaults to `true` there.

| Key | Type | Default | Meaning |
|---|---|---|---|
| `framed` | bool or expression | `true` | Draw the frame, panel, tray and title bar |
| `title` | expression | none | Title text. Parsed for legacy `&` codes and MiniMessage tags, so it styles itself inline |
| `accent` | expression | neutral gray `#CBD0D9` | Chrome accent. Only the low 24 bits are used |
| `minHalfWidth` | int | `82` | Minimum panel half-width in pixels, so a short title does not collapse the card |

Every card field is evaluated **once**, when the preview is built.

The shipped title idiom keeps a player-named container's name and falls back to a localized theme
title:

```
"'&f&l' + (customName != '' ? customName : plain(lang(vars.titleKey)))"
```

Omit `card` entirely for bare content with no chrome. That is what `locked.json` does with
`"framed": false`.

### `elements`

Coordinates are **pixels from the card center**: `x` positive right, `y` positive up, `z` a depth
order where higher draws in front. The card sizes itself around whatever the elements occupy.

| `type` | Required | What it draws |
|---|---|---|
| `panel` | `width`, `height`, `color` | A flat rectangle |
| `cell` | `size`, `color` | A square swatch — the unit every gauge, bar and flame is built from |
| `slot` | `size`, `index` | An inventory well that renders the item in that slot, with its stack count |
| `label` | `text` | Parsed text |

| Key | Applies to | Default | Notes |
|---|---|---|---|
| `x`, `y` | all | `0` | Pixels from card center |
| `z` | all | `1` panel, `4` cell and slot, `6` label | Higher draws in front |
| `width`, `height` | panel | — | Pixels |
| `size` | cell, slot | — | Square edge in pixels |
| `color` | panel, cell | — | Fill color |
| `wellColor` | slot | `#FF15151B` | Color behind the item |
| `index` | slot | — | Inventory slot index. Nothing clamps it — guard it against `inventory.size` yourself |
| `text` | label | — | Emoji triggers substituted, then parsed for legacy `&` codes and MiniMessage tags |
| `background` | label | transparent | Text background color |
| `visible` | all | `true` | `false` skips the element |
| `repeat` | all | none | Emit the element once per index |

Colors as JSON numbers are the unsigned 32-bit ARGB value. A number with no high byte set is fully
transparent. As strings, `#RGB` and `#RRGGBB` are made opaque by prefixing `FF`. Only `#AARRGGBB`
carries its own alpha. `rgb()` packs an opaque alpha. `argb()` and `alpha()` set it explicitly.

### `repeat`

```json
"repeat": { "count": "min(vars.slots, inventory.size)", "var": "i" }
```

`count` is how many copies to emit. `var` names the 0-based loop index, defaulting to `i`. Every
field of the element can read it. That is what makes a whole grid a single element. This is the
entire body of `chest.json`, a 9-wide grid capped at 6 rows and centered on the card:

```json
{
  "type": "slot",
  "repeat": {
    "count": "min(vars.cols * clamp(ceil(inventory.size / vars.cols), 1, vars.maxRows), inventory.size)",
    "var": "i"
  },
  "x": "round((mod(i, vars.cols) - (vars.cols - 1) / 2) * 20)",
  "y": "round(((clamp(ceil(inventory.size / vars.cols), 1, vars.maxRows) - 1) / 2 - floor(i / vars.cols)) * 20)",
  "size": 18,
  "index": "i"
}
```

The loop variable name must be a valid identifier. It must not collide with `vars` or with a state
variable name. That collision would make it unreachable.

Counts are evaluated once at build. A grid sizes itself from `inventory.size` when the preview
opens. A **constant** count above 1024 is a compile error and rejects the document. A **dynamic**
count above 1024 is truncated at build with a reported error.

Across the whole document the expansion is bounded at 4096 elements. A repeat that would cross it is
truncated. Every element after it is skipped. The preview renders what it managed to expand.

### What is live and what is not

Only two fields are re-evaluated while the preview is on screen:

- `cell.color`
- `label.text`

Both are polled every **four ticks**. Everything else — positions, sizes, `z`, panel and well
colors, `visible`, repeat counts, the card's `framed`, `title` and `accent` — is evaluated exactly
**once**, when the preview is built. An element hidden at build time stays hidden for the life of
that preview. Move the condition into `color` or `text` if it has to change while the player
watches.

The item shown in a `slot` is not an expression at all. The renderer re-reads that inventory slot on
the same four-tick beat. It swaps the displayed item and its count when it changes.

A live expression that captured a loop variable keeps the value it was expanded with. Repeat
instance 3 still reads `i == 3` on every poll, rather than whatever the loop ended on. A live
expression that folds to a constant is resolved at build time and returned unchanged by every poll.

### Failure policy

A preview never takes a frame down. An element whose build-time expressions fail is skipped. The
rest of the document still renders. A live cell color that fails renders transparent. A live label
text that fails renders empty. Each document logs at most one such failure per minute. The
alternative is a log line every four ticks for as long as somebody is looking at the block.

A document that fails to compile logs `previews/<name>.json: <message>` — with the exact field path,
for example `elements[3].color` — and is skipped. On a hot reload the previously compiled version
stays live. A half-saved edit never blanks a preview.

## State variables

Expressions read live container state through flat variable names. Every reading is sampled once per
refresh. It is handed to the document as a plain number, string or boolean. An expression never
touches a Bukkit object.

A document gets the `universal` group always. It gets the `inventory` group whenever the target has
an inventory (furnaces, brewing stands and jukeboxes included). It also gets the group for its own
category.

The category is chosen once from the target. The order is ender chest, brewing stand, furnace,
container, jukebox, other inventory holder, beehive or bee nest, cauldron, then static.

| Group | Variables |
|---|---|
| universal | `time`, `blockType`, `customName` |
| inventory | `inventory.size`, `inventory.occupied` |
| furnace | `cookTime`, `cookTimeTotal`, `burnTime`, `fuelSeconds`, `bankedXp`, `lit`, `surge.active`, `surge.gain` |
| brewing | `brewTime`, `brewTotal`, `fuelLevel`, `maxFuel`, `surge.active`, `surge.gain` |
| beehive | `bees`, `maxBees`, `honey`, `maxHoney` |
| cauldron | `level`, `maxLevel`, `fluid` |
| jukebox | `playing`, `record` |

Notes that matter when writing a document:

- `time` is the world game tick, or a wall-clock tick counter for a target with no world.
- `blockType` is the material name (`"CHEST"`). For an entity it is the material the entity maps to, which
  is how a minecart names itself. It is `""` when there is neither — a bare ender-chest inventory, or the
  locked card.
- `customName` is the name a player gave the container, or `""`. A whitespace-only name collapses to `""`,
  so `customName != ''` is the idiom.
- `fuelSeconds` is whole seconds, truncated.
- `bankedXp` is `-1` on a server whose API cannot report banked experience.
- `brewTotal` is fixed at `400` ticks and `maxFuel` at `20` blaze powder — neither is exposed by Bukkit.
- `surge.active` and `surge.gain` come from a flow tracker that watches the timer between samples, so a
  document can highlight a furnace that just got faster. Brewing counts its timer down, a furnace counts
  up. The tracker knows which.
- `record` is the readable disc name (`"Music Disc Cat"`) or `""` when the jukebox is empty.
- `fluid` is `empty`, `water`, `lava` or `powder_snow`.

Four functions read the previewed inventory directly, on top of the general expression function set:

| Call | Returns |
|---|---|
| `count(slot)` | Stack size in that slot, `0` when empty or out of range |
| `occupied(slot)` | Whether that slot holds something |
| `item(slot)` | Material id in that slot (`"IRON_ORE"`), or `""`. Wrap it in `readable()` for text |
| `lang(key, ...)` | A localized message. Positional arguments fill the key's placeholders in order |

Every preview also has the standard text-expression functions `papi(key, fallback?)`,
`papiNumber(key, fallback?)` and `metric(key, fallback?)`, plus `time.ms`, `time.seconds`,
`time.ticks`, `server.online`, `server.maxPlayers`, `server.tps`, `player.name`, `player.ping`,
`player.health` and `player.level`. Player values are available for block, entity, ender-chest and
locked cards. They are absent in console/static diagnostics; use an explicit typed fallback there.

`lang` resolves through the same catalog the rest of the plugin uses. A document renders in each
viewer's locale. A key the catalog does not declare is a hard failure on a running server. The label
reports `label text: lang: Unknown message key: <id>` and renders empty. The rest of the preview is
unaffected. The previously compiled document stays live.

Check the id against the catalog rather than expecting it to render as itself. The shipped documents
use `gloss.preview.theme.title.*`, `gloss.preview.state.*` and `gloss.preview.stat.*` keys, all
overridable — see [Localization](/gloss/19-localization).

The full grammar, operator set and general function list are on
[Expressions & Placeholders](/gloss/13-expressions-placeholders).

Another plugin can publish its own variables under its own namespace through `PreviewStateProvider`.
See [API: Previews](/gloss/24-api-previews). A namespace that would shadow a built-in name is
rejected whole with one warning. A provider that throws is dropped with one warning rather than
taking the preview down.

## Furnace expression walkthrough

The furnace family is the most complete small example because it combines inventory slots, live
timers, a repeated progress gauge, animated colors, localized labels and material-specific variants.
One document can claim all three targets:

```json
{
  "match": {
    "blocks": ["FURNACE", "BLAST_FURNACE", "SMOKER"],
    "priority": 10,
    "vars": {
      "style": "furnace",
      "segments": 9,
      "segmentGap": 7,
      "segmentSize": 5,
      "pulseRate": 5,
      "fill": "#FFF2A535",
      "pulse": "#FFFFD978",
      "wellColor": "#FF15151B",
      "titleKey": "gloss.preview.theme.title.furnace",
      "accent": "#F2A535"
    }
  },
  "variants": [
    {
      "blocks": ["BLAST_FURNACE"],
      "vars": {
        "style": "blast",
        "fill": "#FF6FB8E8",
        "pulse": "#FFE8F7FF",
        "titleKey": "gloss.preview.theme.title.blast_furnace",
        "accent": "#6FEAEA"
      }
    },
    {
      "blocks": ["SMOKER"],
      "vars": {
        "style": "smoker",
        "fill": "#FFC8893A",
        "pulse": "#FFF2C878",
        "titleKey": "gloss.preview.theme.title.smoker",
        "accent": "#F2D451"
      }
    }
  ]
}
```

The top-level values are defaults. The first matching variant overlays only its listed values. Every
element continues to read the same `vars.style`, `vars.fill`, `vars.titleKey` and `vars.accent`
names, so the layout is shared while the blast furnace and smoker acquire their own appearance.

### A repeated, animated cook gauge

```json
{
  "type": "cell",
  "repeat": { "count": "vars.segments", "var": "i" },
  "x": "round((i - (vars.segments - 1) / 2) * vars.segmentGap)",
  "y": 14,
  "size": "vars.segmentSize",
  "color": "cookTime > 0 && cookTimeTotal > 0 ? (i < ceil(cookTime / cookTimeTotal * vars.segments) ? mix(vars.fill, vars.pulse, (sin(time / vars.pulseRate + i) + 1) / 2) : vars.wellColor) : vars.wellColor"
}
```

This one template demonstrates several independent parts of the language:

- `vars.segments` controls how many cells exist. Changing it changes the gauge without copying JSON.
- `i` is the repeat index. The position formula centers any segment count automatically.
- `cookTime / cookTimeTotal` converts the furnace timers to a ratio. The boolean guard prevents
  division by zero while the furnace is idle.
- `ceil(... * vars.segments)` converts the ratio to a filled-cell count.
- `sin(time / vars.pulseRate + i)` supplies a different phase for each cell.
- `mix(vars.fill, vars.pulse, ...)` converts that phase into a smooth color pulse.

`cell.color` is one of the two fields Gloss refreshes every four ticks, so both timer progress and
the pulse remain live. A `visible` condition or `x` expression is build-once. If a flame needs to
turn on after the card has already opened, keep the cell present and make its live `color` expression
return the idle color instead of toggling `visible`.

### Inventory, formatting and state labels

The three furnace slots use indexes `0`, `1` and `2`. Expressions can inspect them without touching
Bukkit objects:

```json
{
  "type": "label",
  "x": 0,
  "y": -32,
  "text": "cookTime > 0 && cookTimeTotal > 0 ? '<#F2A535>' + bar(cookTime, cookTimeTotal, 12, '■', '□') + ' &f' + fixed(cookTime * 100 / cookTimeTotal, 1) + '%' : (occupied(0) && !occupied(1) ? '&c' + lang('gloss.preview.state.needs_fuel') : (!occupied(0) ? '&7' + lang('gloss.preview.state.no_input') : '&7' + lang('gloss.preview.state.waiting')))"
}
```

```json
{
  "type": "label",
  "x": 0,
  "y": -46,
  "text": "(occupied(0) ? '&f' + readable(item(0)) + ' &8×&f' + str(count(0)) : '&8Empty input') + ' &8• &7Fuel &f' + str(fuelSeconds) + 's' + ' &8• &7XP &a' + fixed(max(bankedXp, 0), 1)"
}
```

`occupied`, `item` and `count` query an inventory slot. `readable` changes `IRON_ORE` to `Iron Ore`.
`str` makes a number safe for string concatenation, `fixed` controls decimal places, `bar` draws a
clamped text gauge, and `lang` keeps server-owned status copy localized. The furnace snapshot also
provides `burnTime`, `fuelSeconds`, `bankedXp`, `lit`, `surge.active` and `surge.gain`. A color
expression can use `palette([...], floor(time / 4))` for a stepped flame or test `surge.active` to
flash a boosted state.

The preview expression lexer treats `%` as modulo, so raw `%player_name%` is not placeholder syntax.
Use `player.name`, `papi('player_name')` or `papiNumber('player_ping', 0)` instead. Use a registered
`PreviewStateProvider` for typed domain state not exposed by PAPI.

In the web editor, right-click a container-preview document and choose `Create random preview`.
The generator emits all four element types, selects the furnace simulation through its
match, and procedurally varies the palette, segment geometry, pulse timing and card dimensions. The
result is normal editable JSON and one undo step, not a preview-only effect.

## The shipped documents

Thirteen documents are extracted into `previews/` on first run, only where the file is missing. All
thirteen use `priority: 10`.

| Document | Matches | Notes |
|---|---|---|
| `chest.json` | `CHEST`, `TRAPPED_CHEST`, `BARREL`, plus `*COPPER_CHEST` and every shulker box through 20 variants | One 9-wide slot grid capped at 6 rows. Variants supply the title and accent |
| `ender_chest.json` | `ENDER_CHEST`, `special: enderChest` | Draws the viewer's own ender chest |
| `dispenser.json` | `DISPENSER`, `DROPPER` | 3×3 grid |
| `hopper.json` | `HOPPER` | 5 slots in a row |
| `furnace.json` | `FURNACE`, `BLAST_FURNACE`, `SMOKER` | Three slots, a progress bar, an animated flame, fuel and state lines |
| `brewing_stand.json` | `BREWING_STAND` | Three bottle slots, a brew bar, a fuel gauge, state lines |
| `beehive.json` | `BEEHIVE`, `BEE_NEST` | Honey cells plus a bee and honey count |
| `cauldron.json` | `CAULDRON`, `WATER_CAULDRON`, `LAVA_CAULDRON`, `POWDER_SNOW_CAULDRON` | Fill cells colored per fluid through variants |
| `jukebox.json` | `JUKEBOX` | One slot and a playing / loaded / empty line |
| `chiseled_bookshelf.json` | `CHISELED_BOOKSHELF` | 3×2 grid |
| `shelf.json` | `*_SHELF` | One glob covers every shelf wood type |
| `minecart.json` | `CHEST_MINECART`, `HOPPER_MINECART`, `*_CHEST_BOAT`, `*_CHEST_RAFT`, `special: anyInventoryHolder` | Grid or row depending on the variant. The fallback for any other inventory-holding cart or boat |
| `locked.json` | `special: locked` | Four cells drawing a padlock, `framed: false` |

`/gloss preview reset [name=*]` re-extracts them and overwrites local edits. Details and the warning
are on [Data Files & Hot Reload](/gloss/03-data-files).

### Three of them in full

`previews/hopper.json` — the smallest complete document, one repeated slot:

```json
{
  "match": {
    "blocks": ["HOPPER"],
    "priority": 10,
    "vars": {
      "slots": 5,
      "titleKey": "gloss.preview.theme.title.hopper",
      "accent": "#6E747E"
    }
  },
  "card": {
    "title": "'&f&l' + (customName != '' ? customName : plain(lang(vars.titleKey)))",
    "accent": "vars.accent"
  },
  "elements": [
    {
      "type": "slot",
      "repeat": { "count": "min(vars.slots, inventory.size)", "var": "i" },
      "x": "round((i - (vars.slots - 1) / 2) * 20)",
      "y": 0,
      "size": 18,
      "index": "i"
    }
  ]
}
```

`previews/cauldron.json` — variants, a gauge built from cells, and a live label:

```json
{
  "match": {
    "blocks": ["CAULDRON", "WATER_CAULDRON", "LAVA_CAULDRON", "POWDER_SNOW_CAULDRON"],
    "priority": 10,
    "vars": {
      "cells": 3,
      "fluidColor": "#FF2E5E8C",
      "wellColor": "#FF15151B",
      "titleKey": "gloss.preview.theme.title.cauldron",
      "accent": "#A6ACB6"
    }
  },
  "variants": [
    {
      "blocks": ["WATER_CAULDRON"],
      "vars": {
        "fluidColor": "#FF2E5E8C",
        "titleKey": "gloss.preview.theme.title.water_cauldron",
        "accent": "#5E82FF"
      }
    },
    {
      "blocks": ["LAVA_CAULDRON"],
      "vars": {
        "fluidColor": "#FFA14C16",
        "titleKey": "gloss.preview.theme.title.lava_cauldron",
        "accent": "#F2A535"
      }
    },
    {
      "blocks": ["POWDER_SNOW_CAULDRON"],
      "vars": {
        "fluidColor": "#FFD8E5EF",
        "titleKey": "gloss.preview.theme.title.powder_snow_cauldron",
        "accent": "#CBD0D9"
      }
    }
  ],
  "card": {
    "title": "'&f&l' + plain(lang(vars.titleKey))",
    "accent": "vars.accent"
  },
  "elements": [
    {
      "type": "cell",
      "repeat": { "count": "vars.cells", "var": "i" },
      "x": "round((i - (vars.cells - 1) / 2) * 20)",
      "y": 0,
      "size": 18,
      "color": "i < ceil(level / maxLevel * vars.cells) ? vars.fluidColor : vars.wellColor"
    },
    {
      "type": "label",
      "x": 0,
      "y": 21,
      "text": "level <= 0 ? '&7' + lang('gloss.preview.stat.cauldron_empty', level, maxLevel) : '&b' + lang('gloss.preview.stat.cauldron_level', level, maxLevel)"
    }
  ]
}
```

`previews/locked.json` — a role document with no target and no chrome:

```json
{
  "match": {
    "special": "locked",
    "priority": 10
  },
  "card": {
    "framed": false
  },
  "elements": [
    { "type": "cell", "x": 0, "y": 10, "z": 4, "size": 16, "color": "#FFFFB000" },
    { "type": "cell", "x": 0, "y": 10, "z": 6, "size": 8, "color": "#FF21170A" },
    { "type": "cell", "x": 0, "y": -4, "z": 7, "size": 24, "color": "#FFFFB000" },
    { "type": "cell", "x": 0, "y": -4, "z": 8, "size": 5, "color": "#FF21170A" }
  ]
}
```

## Shadowing a shipped document

Documents are never merged. For any one target exactly one document wins, chosen in this order:

1. **highest `match.priority`**.
2. within one priority, an **exact name** beats a **glob**, which beats the `anyInventoryHolder` fallback.
3. a genuine tie is broken by document name, alphabetically, and warned about once per pair:
   `previews: <a> and <b> match the same targets at priority 10, using <a>.`

Every shipped document sits at priority `10`. The way to override one is a new file at a higher
priority:

```json
{
  "match": { "blocks": ["CHEST"], "priority": 20, "vars": { "cols": 9 } },
  "elements": [ ... ]
}
```

Write it as a **new file**, not as an edit to a shipped one. `/gloss preview reset` overwrites
shipped files and would discard your work. It never touches or removes a file you added. It says so
when it runs.

Editing a shipped document in place also works and hot-reloads. A reset undoes that edit.

## Hot reload

`previews/` has its own watcher on a fixed 5-tick pass. That pass handles edits, creations and
deletions together. It does **not** honor `[hotload] watchIntervalTicks`.

A recompiled document logs `Preview document "<name>" changed and was recompiled.`, a new one
`Preview document "<name>" was detected and compiled.`, and a deleted one
`Preview document "<name>" was removed.`

Any change closes **every** open preview on the server. They rebuild from the new snapshot on the
next tick. A preview holds the element list it was built from and cannot be re-pointed in place. A
priority change can also move a target from one document to another. Menus are untouched.

## Commands

| Command | Permission | What it does |
|---|---|---|
| `/gloss preview list` | `gloss.previews` | Every loaded document with `blocks=<n> entities=<n> special=<s> priority=<n>` |
| `/gloss preview reset [name=*]` | `gloss.previews.reset` | Re-extracts shipped documents from the jar |
| `/gloss preview dump <name>` | `gloss.previews.dump` | Builds one document once and reports its element counts and build errors |

`previews` is an alias of `preview`. `gloss.previews` and its two children are separate from the
`gloss.preview` visibility permission. A player may see previews without being able to inspect the
documents, and vice versa.

`list` counts matchers, not materials. The number is the document's own exact names and globs plus
every variant's. `chest.json` reports far more than three blocks. `special` shows `-` when the
document has none.

`reset` runs off the main thread because it can perform thirteen file writes plus a full reparse. A
name that is not a shipped document writes nothing and reports so. It never deletes documents you
added.

> `/gloss preview reset` overwrites the named shipped file on disk. Local edits to that file are gone and
> there is no backup.
{.is-warning}

`dump` is the tool for debugging a document. For a player it builds against the block being looked
at when that block is one the named document matches. Otherwise it builds target-less but retains
that player for standard player/PAPI expressions. From the console it is viewerless and target-less,
so player and target-state expressions are unavailable.

Output is the element total broken down into panels, cells, slots and labels. Then up to three build
errors with a `+N more (see console log)` tail. A trailing `.json` in the name is accepted. `No
build errors.` means the document expanded cleanly under that context.

Preview scale is **not** a command. It is the sneak gesture described above.

## Notes

- Previews are drawn with per-viewer display entities. Nobody else sees your card.
- The card is rebuilt whenever the target changes. The raycast cost is one ray pair per online
  player per tick. The content cost is one sample every four ticks per open preview.
- A preview whose target is an ender chest reads the viewer's own ender chest, dispatched onto the
  viewer's thread. The block itself only decides that the ender-chest document won.
- Removing `special` from `ender_chest.json` makes ender chests take the ordinary block path rather than
  breaking them.
- The arithmetic that lays the card out — panel padding, title bar height, tray insets, the integer
  divisions — is frozen and pinned by non-regenerable golden files. See
  [Runtime Architecture](/gloss/20-runtime-architecture).
