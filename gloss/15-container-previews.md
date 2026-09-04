---
title: "Container Previews"
description: "Show container contents in a holographic card when a player looks at them"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Container previews show a private holographic card when a player looks at a supported block or entity.
They do not open the inventory or fire `InventoryOpenEvent`.

`/gloss web edit container-preview <id>` opens one preview in a restricted live editor session;
`/gloss web workspace` includes every preview document.

Preview layouts are JSON documents in `plugins/Gloss/previews/`. Gloss includes 14 layouts, supports
custom layouts, and reloads the folder while the server is running.

## What triggers a preview

Gloss checks the player's view up to `[preview] lookDistance` blocks away. The default is `10.0`,
clamped to `1.0` through `24.0`. Fluids and passable blocks are skipped. It checks:

- one against blocks, keeping the hit only when some loaded document names that material.
- one against entities within a 0.35-block ray radius. An exact or glob `match.entities` claim makes
  that entity type eligible. The `anyInventoryHolder` fallback remains limited to inventory-holding
  minecarts and chest boats.

If only one hits, that is the target. If both hit, the entity wins unless the block is closer by
more than 0.01 blocks. When the target changes, the open preview is closed and a new one is built.
When the ray hits nothing, the preview closes.

The preview is visible only to that player.

`[features] previews = false` disables previews. Turning the feature back on requires a restart.

A block's material is eligible only because a document names it, exactly or through a glob. To make
a new block type previewable, add its material to a document's `match.blocks`. The
`anyInventoryHolder` fallback contributes no materials. It exists for entities.

## Who can see one

`gloss.preview` (singular) is the visibility permission. It gates no command. It is checked when the
preview is built. It defaults to **op**. On a default install, ordinary players do not see container
contents until you grant it.

The viewer must pass all of these checks:

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

Access is rechecked every 10 ticks while a preview is open. If a chest gets locked or a region is redefined, Gloss drops the open preview. The next tick rebuilds the correct one.

### Container protection

Gloss uses WorldGuard automatically when it is available, including when WorldGuard enables later.

Block previews follow WorldGuard's block-interact decision, including both halves of a double chest.
Entity previews use the `CHEST_ACCESS` flag. WorldGuard bypass still applies, and worlds without
regions skip the check.

If the WorldGuard bridge cannot be built or throws, previews **fail closed**. Everything shows the
locked card. One line is logged:
`Container access protection failed. Previews will remain locked until the protection provider recovers.`

After protection passes, Gloss fires `GlossContainerPreviewAccessEvent`. Other plugins can cancel it
to deny access. See [API: Previews](/gloss/24-api-previews).

## Scale

The server setting and the player's saved setting both affect card size. Cards also shrink with
distance.

| Source | Range | Scope |
|---|---|---|
| `[preview] scale` in `gloss.toml` | `0.25`–`4.0`, default `0.65` | server-wide |
| The per-player factor | `0.25`–`2.5`, default `1.0` | one player |

To resize a visible preview:

1. Double-tap sneak to enter adjust mode.
2. Hold sneak and scroll the hotbar.
3. Double-tap sneak again to save.

Each scroll step changes the factor by 10 percent. The action bar shows the current size.

Below 0.30 the preview is treated as hidden. Nothing is drawn at all. The action bar says so. That
is the opt-out for players who do not want previews. Scrolling back up restores them.

Adjust mode also saves when the preview closes or after 20 seconds of inactivity. Settings are stored
by UUID in `plugins/Gloss/preview-scales.json`.

Changing `[preview] scale` in `gloss.toml` re-renders open previews immediately.

## The preview document

Each `.json` file in `plugins/Gloss/previews/` defines one preview. Its id is the filename without
`.json`. Preview documents have no `schemaVersion` or `revision`, and subfolders are ignored.

A document has five top-level keys. All are optional:

```json
{
  "match":    { },
  "variants": [ ],
  "card":     { },
  "elements": [ ],
  "particleLayers": [ ]
}
```

`match` selects targets. `variants` change variables for specific targets. `card` controls the frame,
`elements` provide the content in paint order, and `particleLayers` add viewer-only effects. A
document with no emitted elements draws nothing.

Particle targets include the whole `projection`, generated component ids such as zero-based
`element-0`, `label`, `text`, one-based text `line`, configured text `span`, and `local` geometry.
Label text expressions inside a configured `<particles:name>...</particles>` range inherit that
range, but expression or PlaceholderAPI output cannot create a range. Layer placement follows the
preview's viewer-facing frame. See [Particle Layers](/gloss/25-particle-layers) for the complete
contract and limitations.

The JSON Schema is at `Gloss/schema/gloss-preview.schema.json`. Runtime validation also enforces
rules that JSON Schema cannot express.

### `match`

| Key | Type | Default | Meaning |
|---|---|---|---|
| `blocks` | string[] | none | Block materials this document draws |
| `entities` | string[] | none | Entity types this document draws |
| `special` | string | none | `enderChest`, `locked` or `anyInventoryHolder` |
| `priority` | int | `0` | Higher wins. Every included document uses `10` |
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

A variant accepts `blocks`, `entities`, and `vars`. It can add targets as well as change their style.

Variants are tried in declaration order. The first whose names match the target wins. Its `vars` are
merged over the document's own. A target no variant claims gets the document defaults unchanged.

For example, `chest.json` uses one slot grid for chests, barrels, copper chests, and shulker boxes;
variants supply their titles and colors.

### `vars`

`vars` values are JSON primitives, not expressions. Read them with `vars.<name>`.

A string beginning with `#` is parsed as `#RGB`, `#RRGGBB`, or `#AARRGGBB`. An invalid color is a
compile error. A value such as `"<#F2A535>"` remains text.

### `card`

Add `card` to draw the preview frame. Its `framed` field defaults to `true`.

| Key | Type | Default | Meaning |
|---|---|---|---|
| `framed` | bool or expression | `true` | Draw the frame, panel, tray and title bar |
| `title` | expression | none | Title text. Parsed for legacy `&` codes and MiniMessage tags, so it styles itself inline |
| `accent` | expression | neutral gray `#CBD0D9` | Chrome accent. Only the low 24 bits are used |
| `minHalfWidth` | int | `82` | Minimum panel half-width in pixels, so a short title does not collapse the card |

Every card field is evaluated **once**, when the preview is built.

The default title format keeps a player-named container's name and falls back to a localized theme
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
| `cell` | `size`, `color` | A square swatch used to build gauges, bars, and flames |
| `slot` | `size`, `index` | An inventory well that renders the item in that slot, with its stack count |
| `label` | `text` | Parsed text |

| Key | Applies to | Default | Notes |
|---|---|---|---|
| `x`, `y` | all | `0` | Pixels from card center |
| `z` | all | `1` panel, `4` cell and slot, `6` label | Higher draws in front |
| `width`, `height` | panel | Not applicable | Pixels |
| `size` | cell, slot | Not applicable | Square edge in pixels |
| `color` | panel, cell | Not applicable | Fill color |
| `wellColor` | slot | `#FF15151B` | Color behind the item |
| `index` | slot | Not applicable | Inventory slot index. Gloss does not clamp it, so guard it against `inventory.size` |
| `text` | label | Not applicable | Emoji triggers substituted, then parsed for legacy `&` codes and MiniMessage tags |
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

`count` controls the number of copies. `var` names the zero-based loop index and defaults to `i`.
Every field in the element can use it. This example creates a centered, nine-column slot grid:

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

A document can expand up to 4096 elements. Gloss truncates a repeat that crosses the limit and skips
later elements.

### What is live and what is not

Only two fields are re-evaluated while the preview is on screen:

- `cell.color`
- `label.text`

Both update every four ticks. Positions, sizes, `z`, panel and well colors, `visible`, repeat counts,
and card fields are evaluated once when the preview opens. Put changing conditions in `color` or
`text`.

The item shown in a `slot` is not an expression at all. The renderer re-reads that inventory slot on
the same four-tick beat. It swaps the displayed item and its count when it changes.

Each repeated live expression keeps its own loop index. Constant expressions are resolved once.

### Failure policy

If an element fails while opening, Gloss skips that element. A failed live cell becomes transparent;
a failed live label becomes empty. Each document logs at most one such failure per minute.

A document that fails to compile logs `previews/<name>.json: <message>` with the exact field path,
such as `elements[3].color`, and is skipped. On a hot reload the previously compiled version
stays live. A half-saved edit never blanks a preview.

## State variables

Expressions read container state through the variables below. Values are numbers, strings, or
booleans sampled once per refresh.

A document gets the `universal` group always. It gets the `inventory` group whenever the target has
an inventory (furnaces, brewing stands and jukeboxes included). It also gets the group for its own
category.

Gloss assigns one category from the target and adds its variables to the universal and inventory
groups.

| Group | Variables |
|---|---|
| universal | `time`, `blockType`, `customName` |
| inventory | `inventory.size`, `inventory.occupied` |
| furnace | `cookTime`, `cookTimeTotal`, `burnTime`, `fuelSeconds`, `bankedXp`, `lit`, `surge.active`, `surge.gain` |
| brewing | `brewTime`, `brewTotal`, `fuelLevel`, `maxFuel`, `surge.active`, `surge.gain` |
| beehive | `bees`, `maxBees`, `honey`, `maxHoney` |
| cauldron | `level`, `maxLevel`, `fluid` |
| jukebox | `playing`, `record` |
| poweredMinecart | `fuelTicks`, `fuelSeconds`, `powered` |

Notes that matter when writing a document:

- `time` is the world game tick, or a wall-clock tick counter for a target with no world.
- `blockType` is the material name (`"CHEST"`). For an entity it is the material the entity maps to, which
  is how a minecart names itself. It is `""` when neither exists, as with a bare ender-chest inventory or the
  locked card.
- `customName` is the name a player gave the container, or `""`. A whitespace-only name collapses to `""`,
  so `customName != ''` is the idiom.
- The default chest card falls back to `readable(blockType)` when both `customName` and the resolved
  localized title are empty, so an unnamed ordinary chest still says `Chest`.
- `fuelSeconds` is whole seconds, truncated.
- `bankedXp` is `-1` on a server whose API cannot report banked experience.
- `brewTotal` is fixed at `400` ticks and `maxFuel` at `20` blaze powder because Bukkit exposes neither value.
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

Check the id against the catalog rather than expecting it to render as itself. The included documents
use `gloss.preview.theme.title.*`, `gloss.preview.state.*` and `gloss.preview.stat.*` keys, all
overridable. See [Localization](/gloss/19-localization).

The full grammar, operator set and general function list are on
[Expressions & Placeholders](/gloss/13-expressions-placeholders).

Another plugin can publish its own variables under its own namespace through `PreviewStateProvider`.
See [API: Previews](/gloss/24-api-previews). A namespace that would shadow a built-in name is
rejected whole with one warning. A provider that throws is dropped with one warning rather than
taking the preview down.

## Furnace expression walkthrough

This example uses one layout for a furnace, blast furnace, and smoker:

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

The first matching variant replaces only its listed variables, so all three targets share the same
layout with different colors and titles.

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

The gauge works as follows:

- `vars.segments` controls how many cells exist. Changing it changes the gauge without copying JSON.
- `i` is the repeat index. The position formula centers any segment count automatically.
- `cookTime / cookTimeTotal` converts the furnace timers to a ratio. The boolean guard prevents
  division by zero while the furnace is idle.
- `ceil(... * vars.segments)` converts the ratio to a filled-cell count.
- `sin(time / vars.pulseRate + i)` supplies a different phase for each cell.
- `mix(vars.fill, vars.pulse, ...)` converts that phase into a smooth color pulse.

`cell.color` refreshes every four ticks. Fields such as `visible` and `x` do not, so use the color
expression when an existing cell needs to change while the preview is open.

### Inventory, formatting and state labels

The furnace input, fuel, and output slots use indexes `0`, `1`, and `2`:

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

`occupied`, `item`, and `count` inspect an inventory slot. `readable` formats a material id, `fixed`
controls decimal places, `bar` draws a text gauge, and `lang` supplies localized text.

The preview expression lexer treats `%` as modulo, so raw `%player_name%` is not placeholder syntax.
Use `player.name`, `papi('player_name')` or `papiNumber('player_ping', 0)` instead. Use a registered
`PreviewStateProvider` for typed domain state not exposed by PAPI.

In the web editor, right-click a container-preview document and choose **Create random preview** to
insert an editable example using all four element types.

## The included documents

Gloss extracts 14 documents into `previews/` when the feature is enabled. Existing files are left
unchanged. All included documents use `priority: 10`.

| Document | Matches | Notes |
|---|---|---|
| `chest.json` | `CHEST`, `TRAPPED_CHEST`, `BARREL`, plus `*COPPER_CHEST` and every shulker box through 20 variants | One 9-wide slot grid capped at 6 rows. Variants supply the title and accent |
| `ender_chest.json` | `ENDER_CHEST`, `special: enderChest` | Draws the viewer's own ender chest |
| `dispenser.json` | `DISPENSER`, `DROPPER` | 3×3 grid |
| `hopper.json` | `HOPPER` | 5 slots in a row |
| `furnace.json` | `FURNACE`, `BLAST_FURNACE`, `SMOKER` | Three slots, a progress bar, an animated flame, fuel and state lines |
| `furnace_minecart.json` | `FURNACE_MINECART` | Dedicated no-inventory card with an animated heat strip and remaining fuel |
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

`previews/hopper.json` is the smallest complete document, with one repeated slot:

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

`previews/cauldron.json` has variants, a gauge built from cells, and a live label:

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

`previews/locked.json` is a role document with no target or chrome:

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

## Shadowing an included document

Documents are never merged. For any one target exactly one document wins, chosen in this order:

1. **highest `match.priority`**.
2. within one priority, an **exact name** beats a **glob**, which beats the `anyInventoryHolder` fallback.
3. an exact tie is broken by document name, alphabetically, and warned about once per pair:
   `previews: <a> and <b> match the same targets at priority 10, using <a>.`

Every included document sits at priority `10`. The way to override one is a new file at a higher
priority:

```json
{
  "match": { "blocks": ["CHEST"], "priority": 20, "vars": { "cols": 9 } },
  "elements": [ ... ]
}
```

Write it as a **new file**, not as an edit to an included one. `/gloss preview reset` overwrites
included files and would discard your work. It never touches or removes a file you added. It says so
when it runs.

Editing an included document in place also works and hot-reloads. A reset undoes that edit.

## Hot reload

Gloss checks `previews/` at `[hotload] watchIntervalTicks` and reloads edits, additions, and deletions.

A recompiled document logs `Preview document "<name>" changed and was recompiled.`, a new one
`Preview document "<name>" was detected and compiled.`, and a deleted one
`Preview document "<name>" was removed.`

Any preview-document change closes open previews so they can rebuild from the new files. Menus are
unaffected.

## Commands

| Command | Permission | What it does |
|---|---|---|
| `/gloss preview list` | `gloss.previews` | Every loaded document with `blocks=<n> entities=<n> special=<s> priority=<n>` |
| `/gloss preview reset [name=*]` | `gloss.previews.reset` | Re-extracts included documents from the jar |
| `/gloss preview dump <name>` | `gloss.previews.dump` | Builds one document once and reports its element counts and build errors |

`previews` is an alias of `preview`. `gloss.previews` and its two children are separate from the
`gloss.preview` visibility permission. A player may see previews without being able to inspect the
documents, and vice versa.

`list` counts matchers, not materials. The number is the document's own exact names and globs plus
every variant's. `chest.json` reports far more than three blocks. `special` shows `-` when the
document has none.

`reset` accepts only included document names and never deletes custom files.

> `/gloss preview reset` overwrites the named included file on disk. Local edits to that file are gone and
> there is no backup.
{.is-warning}

`dump` tests the named document against the player's current target when it matches. Otherwise it
uses a targetless context. Console dumps have no viewer or target.

Output is the element total broken down into panels, cells, slots and labels. Then up to three build
errors with a `+N more (see console log)` tail. A trailing `.json` in the name is accepted. `No
build errors.` means the document expanded cleanly under that context.

Preview scale uses the sneak gesture described above, not a command.
