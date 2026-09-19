---
title: "Container Previews"
description: "Show container contents in a holographic card when a player looks at them"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Container previews show a private holographic card when a player looks at a supported block or
entity. The inventory never opens and no `InventoryOpenEvent` fires.

Preview layouts are JSON documents in `plugins/Gloss/previews/`. Gloss includes 14 layouts, supports
custom ones, and reloads the folder while the server runs. `/gloss web edit container-preview <id>`
opens one in a restricted live editor session; `/gloss web workspace` includes every preview.

## What triggers a preview

Look at a container within `[preview] lookDistance` blocks (default `10.0`, range `1.0`–`24.0`). A
block card appears on the next tick; an entity card within four ticks. Fluids and passable blocks
are skipped, and the entity wins a tie with a block behind it.

A block is only a target because some loaded document names its material in `match.blocks`, exactly
or through a glob. Entities need a `match.entities` claim, or the `anyInventoryHolder` fallback,
which covers only inventory-holding minecarts and chest boats.

The preview is visible to that one player. `[features] previews = false` disables previews, and
turning the feature back on requires a restart.

## Who can see one

`gloss.preview` (singular) is the visibility permission. It gates no command, is checked when the
preview is built, and defaults to **op**. On a default install, ordinary players see no container
contents until you grant it.

The viewer must pass all of these:

1. `gloss.preview`.
2. the container is physically openable. A chest or ender chest with a solid block above it is
   blocked, as is a shulker box whose lid has no room to open.
3. the container is not locked, or the viewer holds the matching key. Locks go through Paper's own
   lock-check event when the server has it, so another plugin's ruling applies; otherwise the main-hand
   key item is compared directly. Spectators bypass a lock the event did not explicitly deny.
4. for a double chest, both halves pass 2 and 3.
5. the container protection layer allows it.

A viewer who fails any check gets the **locked card**: the padlock drawn by `previews/locked.json`,
shown instead of the contents. That includes failing the permission check, so a player without
`gloss.preview` sees a padlock on every container. Remove `previews/locked.json` and nothing is
drawn instead.

Access is rechecked every 10 ticks while a preview is open, so a newly locked chest or redefined
region drops the card and the correct one rebuilds.

### Container protection

Gloss uses WorldGuard automatically when it is available, including when WorldGuard enables later.
Block previews follow WorldGuard's block-interact decision, both halves of a double chest included;
entity previews use the `CHEST_ACCESS` flag. Bypass still applies, and worlds without regions skip
the check.

> If the WorldGuard bridge cannot be built or throws, previews **fail closed**. Everything shows the
> locked card and Gloss logs
> `Container access protection failed. Previews will remain locked until the protection provider recovers.`
{.is-warning}

After protection passes, Gloss fires `GlossContainerPreviewAccessEvent`, which another plugin can
cancel to deny access. See [API: Previews](/gloss/24-api-previews).

## Scale

| Source | Range | Scope |
|---|---|---|
| `[preview] scale` in `gloss.toml` | `0.25`–`4.0`, default `0.65` | server-wide |
| The per-player factor | `0.25`–`2.5`, default `1.0` | one player |

Both apply, and cards also shrink with distance. To resize a visible preview, double-tap sneak to
enter adjust mode, hold sneak and scroll the hotbar, then double-tap sneak to save. Each step is 10
percent and the action bar shows the current size. Adjust mode also saves when the preview closes or
after 20 seconds of inactivity, into `plugins/Gloss/preview-scales.json` by UUID.

Below 0.30 nothing is drawn at all and the action bar says so. That is the player-side opt-out;
scrolling back up restores previews. Changing `[preview] scale` re-renders open previews
immediately.

## The preview document

Each `.json` file in `plugins/Gloss/previews/` defines one preview, and its id is the filename
without `.json`. Preview documents have no `schemaVersion` or `revision`, and subfolders are
ignored. All top-level keys are optional:

```json
{
  "show":     true,
  "match":    { },
  "variants": [ ],
  "card":     { },
  "textStyle": { },
  "itemStyle": { },
  "elements": [ ],
  "particleLayers": [ ]
}
```

`match` selects targets, `variants` change variables for specific targets, `card` controls the
frame, `elements` provide the content in paint order, and `particleLayers` add viewer-only effects.
A document with no emitted elements draws nothing.

Particle targets include the whole `projection`, generated component ids such as zero-based
`element-0`, `label`, `text`, one-based text `line`, configured text `span`, and `local` geometry.
See [Particle Layers](/gloss/25-particle-layers).

The JSON Schema is at `Gloss/schema/gloss-preview.schema.json`. Runtime validation also enforces
rules JSON Schema cannot express.

### Visibility

`show`, `card.show` and `elements[].show` take booleans or preview expressions and default to
`true`. The document gate hides the whole preview without selecting another document; `card.show`
combines with `card.framed` and hides only the frame and title chrome; element `show` combines with
`visible`. Dynamic gates update every four ticks while open, so hidden content returns without
reopening.

Use preview state and declared `vars.*` values, as in `"show": "cookTime > 0"` or `"show":
"vars.display"` with `"display": true` in `match.vars`. See
[Show conditions](/gloss/13-expressions-placeholders#show-conditions).

### `match`

| Key | Type | Default | Meaning |
|---|---|---|---|
| `blocks` | string[] | none | Block materials this document draws |
| `entities` | string[] | none | Entity types this document draws |
| `special` | string | none | `enderChest`, `locked` or `anyInventoryHolder` |
| `priority` | int | `0` | Higher wins. Every included document uses `10` |
| `vars` | object | `{}` | Document constants, read as `vars.<name>` |

Names are uppercased before matching and `*` is the only wildcard, so `*_SHULKER_BOX` and `*_SHELF`
work. An unknown name logs `unknown block material '<NAME>' at match.blocks[n], still compiling` and
the document still loads, so it survives a version that dropped the type. A document with no
`blocks`, `entities` or `special` claims nothing.

| `special` | What it does |
|---|---|
| `enderChest` | Draws the **viewer's own** ender chest instead of a tile entity. The block must still be in `match.blocks` for the raycast to stop on it |
| `locked` | The target-less card shown when a viewer may not open the container. It has the viewing player and standard player/server context, but no block, entity or inventory state |
| `anyInventoryHolder` | The fallback for an inventory-holding entity no document names |

`special` and `priority` are read from the top-level `match` only.

### `variants`

A variant accepts `blocks`, `entities` and `vars`, and can add targets as well as restyle them.
Variants are tried in declaration order; the first match wins and its `vars` are merged over the
document's own. A target no variant claims keeps the document defaults. `chest.json` uses this for
one slot grid across chests, barrels, copper chests and shulker boxes.

### `vars`

`vars` values are JSON primitives, not expressions, read as `vars.<name>`. A string beginning with
`#` is parsed as `#RGB`, `#RRGGBB` or `#AARRGGBB`, and an invalid color is a compile error. A value
such as `"<#F2A535>"` remains text.

### Shared display styles

`textStyle` supplies the shared display style for labels, card chrome, cells, slot wells and stack
counts; `itemStyle` supplies it for slot item displays. An element's `style` replaces the inherited
style for its text, fill or item, while slot wells and counts keep the root `textStyle`. Omitted
text style uses fixed billboard, unit XYZ scale, full opacity, transparent background and natural
brightness; omitted item style adds paired block/sky brightness `15`/`15`. Style scales multiply the
existing preview size and depth scaling. Every field is listed under
[Display style and boxes](/gloss/11-icons#display-style-and-boxes).

Style objects are whole overrides, not field merges: a label with `"style": {"scaleX": 1.2}` uses
shared defaults for every other field. Style and box fields are typed constants — use the element's
expression fields for changing text, colors and visibility.

A label accepts `box` for a measured panel and a complete perimeter that resizes with dynamic text
and follows preview motion, scaling and closure. An explicit `background` overrides
`style.backgroundArgb`:

```json
{
  "type": "label",
  "text": "'<gold>Contents</gold>'",
  "background": "#00000000",
  "box": {
    "enabled": true,
    "padding": 5,
    "borderWidth": 1,
    "backgroundArgb": "#B31B1B22",
    "borderArgb": "#FFFFCC66"
  }
}
```

### `card`

Add `card` to draw the preview frame. Omit it entirely for bare content with no chrome, which is
what `locked.json` does with `"framed": false`.

| Key | Type | Default | Meaning |
|---|---|---|---|
| `show` | bool or expression | `true` | Additional gate for the frame and title chrome |
| `framed` | bool or expression | `true` | Draw the frame, panel, tray and title bar |
| `title` | expression | none | Title text. Parsed for legacy `&` codes and MiniMessage tags |
| `accent` | expression | neutral gray `#CBD0D9` | Chrome accent. Only the low 24 bits are used |
| `minHalfWidth` | int | `82` | Minimum panel half-width in pixels, so a short title does not collapse the card |
| `padding` | int | `7` | Content padding, `0`–`256` pixels |
| `borderWidth` | int | `3` | Complete frame width, `0`–`256` pixels |
| `trayPadding` | int | `4` | Grid tray padding, `0`–`256` pixels |
| `titleHeight` | int | `17` | Title bar height, `0`–`256` pixels |
| `titleGap` | int | `6` | Gap above content, `0`–`256` pixels |
| `backgroundArgb` | ARGB | `#F21B1B22` | Card panel color |
| `trayArgb` | ARGB | `#FF33333E` | Grid tray color |
| `borderArgb` | ARGB or null | null | Explicit frame color; null uses accent RGB with `CC` alpha |
| `titleArgb` | ARGB or null | null | Explicit title bar color; null uses accent RGB with `E6` alpha |

Explicit chrome fills take precedence over the text style background, so a translucent panel can
reveal the frame beneath it. The default title keeps a player-named container's name and falls back
to a localized theme title:

```
"'&f&l' + (customName != '' ? customName : plain(lang(vars.titleKey)))"
```

### `elements`

Coordinates are **pixels from the card center**: `x` positive right, `y` positive up, `z` a depth
order where higher draws in front. The card sizes itself around whatever the elements occupy.

| `type` | Required | What it draws |
|---|---|---|
| `panel` | `width`, `height`, `color` | A flat rectangle |
| `cell` | `size`, `color` | A square swatch used to build gauges, bars and flames |
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
| `background` | label | `style.backgroundArgb` | Explicit text background color overrides the style |
| `style` | all | inherited | Full display style; a slot override applies to the item |
| `box` | label | disabled | Measured panel and perimeter with independent ARGB colors |
| `show` | all | `true` | Boolean or expression; false skips the element |
| `visible` | all | `true` | `false` skips the element |
| `repeat` | all | none | Emit the element once per index |

A color as a JSON number is the unsigned 32-bit ARGB value, and one with no high byte is fully
transparent. As strings, `#RGB` and `#RRGGBB` are made opaque; only `#AARRGGBB` carries its own
alpha.

### `repeat`

```json
"repeat": { "count": "min(vars.slots, inventory.size)", "var": "i" }
```

`count` is the number of copies and `var` names the zero-based loop index, default `i`. Every field
in the element can use it. The loop name must be a valid identifier that does not collide with
`vars` or a state variable. This makes a centered, nine-column slot grid:

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

Counts are evaluated once at build, so a grid sizes itself from `inventory.size` when the preview
opens. A constant count above 1024 rejects the document; a dynamic one is truncated at build with a
reported error. A document can expand to 4096 elements, after which repeats truncate and later
elements are skipped.

### What is live and what is not

`cell.color`, `label.text` and the visibility fields update every four ticks, and a visibility
change rebuilds the layout. Positions, sizes, `z`, panel and well colors, repeat counts and the
other card fields are evaluated at build. The item in a `slot` is not an expression: the renderer
re-reads that inventory slot on the same four-tick beat and swaps the item and count when it
changes.

### Failure policy

A failed element is skipped while opening; a failed live cell becomes transparent and a failed live
label empty. A document that fails to compile logs `previews/<name>.json: <message>` with the exact
field path, such as `elements[3].color`, and is skipped — on a hot reload the previously compiled
version stays live, so a half-saved edit never blanks a preview.

## State variables

Expressions read container state through the variables below, sampled once per refresh as numbers,
strings or booleans. Every document gets `universal`, plus `inventory` whenever the target has an
inventory (furnaces, brewing stands and jukeboxes included), plus the one group for its category.

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

`world.name` and `world.time` are the preview target's world folder name and time of day in ticks.

- `blockType` is the material name (`"CHEST"`), or the material an entity maps to, and `""` when
  neither exists, as on a bare ender-chest inventory or the locked card.
- `customName` is the name a player gave the container, or `""`. A whitespace-only name collapses to
  `""`, so `customName != ''` is the idiom. The default chest card falls back to
  `readable(blockType)` when the name and the localized title are both empty.
- `fuelSeconds` is whole seconds, truncated. `bankedXp` is `-1` where the server API cannot report
  it.
- `fluid` is `empty`, `water`, `lava` or `powder_snow`. `record` is the readable disc name
  (`"Music Disc Cat"`) or `""`.
- `surge.active` and `surge.gain` flag a timer that just got faster, whether it counts up like a
  furnace or down like a brewing stand.

Four functions read the previewed inventory directly:

| Call | Returns |
|---|---|
| `count(slot)` | Stack size in that slot, `0` when empty or out of range |
| `occupied(slot)` | Whether that slot holds something |
| `item(slot)` | Material id in that slot (`"IRON_ORE"`), or `""`. Wrap it in `readable()` for text |
| `lang(key, ...)` | A localized message. Positional arguments fill the key's placeholders in order |

Every preview also has `papi(key, fallback?)`, `papiNumber(key, fallback?)`,
`metric(key, fallback?)`, `time.ms`, `time.seconds`, `time.ticks`, `server.online`,
`server.maxPlayers`, `server.tps`, `player.name`, `player.ping`, `player.health` and
`player.level`. Player values exist for block, entity, ender-chest and locked cards, but not in
console or static diagnostics — use an explicit typed fallback there. The operator set and general
function list are on [Expressions & Placeholders](/gloss/13-expressions-placeholders).

A `lang` key the catalog does not declare fails that label with
`label text: lang: Unknown message key: <id>` and renders it empty; the rest of the preview is
unaffected. The included documents use `gloss.preview.theme.title.*`, `gloss.preview.state.*` and
`gloss.preview.stat.*` keys, all overridable. See [Localization](/gloss/19-localization).

Another plugin can publish its own variables under its own namespace through `PreviewStateProvider`.
A namespace that would shadow a built-in name is rejected whole, and a provider that throws is
dropped, each with one warning. See [API: Previews](/gloss/24-api-previews).

## Furnace expression walkthrough

One layout covers a furnace, blast furnace and smoker. The first matching variant replaces only its
own variables, so all three share the layout with different colors and titles:

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

- `vars.segments` controls how many cells exist, so the gauge resizes without copying JSON.
- `i` is the repeat index, and the position formula centers any segment count.
- `cookTime / cookTimeTotal` is the progress ratio; the boolean guard prevents division by zero on
  an idle furnace. `ceil(... * vars.segments)` turns it into a filled-cell count.
- `sin(time / vars.pulseRate + i)` gives each cell its own phase, and `mix(vars.fill, vars.pulse,
  ...)` turns that phase into a color pulse.

`cell.color` refreshes every four ticks; `x` is evaluated when the layout builds. Recolor an
existing cell with a color expression, or use `show`/`visible` to remove and restore it.

### Inventory, formatting and state labels

The furnace input, fuel and output slots are indexes `0`, `1` and `2`:

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

`occupied`, `item` and `count` inspect an inventory slot, `readable` formats a material id, `fixed`
sets decimal places, `bar` draws a text gauge, and `lang` supplies localized text.

The preview lexer treats `%` as modulo, so raw `%player_name%` is not placeholder syntax. Use
`player.name`, `papi('player_name')` or `papiNumber('player_ping', 0)` instead, and a registered
`PreviewStateProvider` for typed domain state PAPI does not expose.

In the web editor, right-click a container-preview document and choose **Create random preview** to
insert an editable example using all four element types.

## The included documents

Gloss extracts 14 documents into `previews/` when the feature is enabled, leaving existing files
alone. All of them use `priority: 10`.

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

Read `cauldron.json` for variants and a cell gauge, and `locked.json` for a role document with no
target or chrome.

## Shadowing an included document

Documents are never merged. Exactly one wins per target: highest `match.priority` first, then an
exact name over a glob over the `anyInventoryHolder` fallback. An exact tie goes to the
alphabetically first document name and is warned about once per pair.

Every included document sits at priority `10`, so override one with a **new file** at a higher
priority:

```json
{
  "match": { "blocks": ["CHEST"], "priority": 20, "vars": { "cols": 9 } },
  "elements": [ ... ]
}
```

Editing an included document in place also works and hot-reloads, but a reset undoes that edit.

## Hot reload

Gloss checks `previews/` at `[hotload] watchIntervalTicks` and applies edits, additions and
deletions. Any preview-document change closes open previews so they rebuild from the new files.
Menus are unaffected.

## Commands

| Command | Permission | What it does |
|---|---|---|
| `/gloss preview list` | `gloss.previews` | Every loaded document with `blocks=<n> entities=<n> special=<s> priority=<n>` |
| `/gloss preview reset [name=*]` | `gloss.previews.reset` | Re-extracts included documents from the jar |
| `/gloss preview dump <name>` | `gloss.previews.dump` | Builds one document once and reports its element counts and build errors |

`previews` is an alias of `preview`. `gloss.previews` and its two children are separate from the
`gloss.preview` visibility permission, so a player can see previews without inspecting documents,
and the reverse.

`list` counts matchers rather than materials: the document's own exact names and globs plus every
variant's, so `chest.json` reports far more than three blocks. `special` shows `-` when there is
none.

`reset` accepts only included document names and never deletes or touches custom files.

> `/gloss preview reset` overwrites the named included file on disk. Local edits to that file are gone and
> there is no backup.
{.is-warning}

`dump` tests the named document against the player's current target when it matches, otherwise
against a targetless context; console dumps have no viewer or target. Output is the element total
broken down into panels, cells, slots and labels, then up to three build errors with a
`+N more (see console log)` tail. A trailing `.json` is accepted, and `No build errors.` means the
document expanded cleanly under that context.

Preview scale uses the sneak gesture above, not a command.
