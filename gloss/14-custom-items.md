---
title: "Custom Items & Item Providers"
description: "Use items from supported plugins in Gloss menus and panels"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss menus and panels can show items from ten supported item plugins. The resulting icon keeps the
model, name, lore, and data components supplied by that plugin.

## The `customItem` icon

`customItem` is one of the icon types described on [Icons](/gloss/11-icons). Record component names
are the JSON keys.

```json
{
  "type": "customItem",
  "provider": "itemsadder",
  "item": "myitems:ruby",
  "count": 1
}
```

| Key | Type | Required | Omitted | Meaning |
|---|---|---|---|---|
| `type` | string | yes | Not applicable | Literally `customItem` |
| `provider` | string | no | treated as `auto` | A provider id, trimmed and lowercased before matching, or `auto` to try every active provider in activation order |
| `item` | string | yes | Not applicable | The provider's own id, passed through verbatim with case preserved |
| `count` | int | no | `0`, rendered as `1` | Stack size. The icon applies `count > 0 ? count : 1` |
| `style` | object | no | icon defaults | The shared display-style block every icon type accepts |

`item` is passed to the provider with its case preserved, and the provider decides how namespaces
and letter case work. It is the same key the vanilla `item` icon uses.

### Setting one by command

```
/gloss menu seticon <menu> <row> customItem itemsadder@myitems:ruby
```

The command form packs provider and item into one value separated by `@`. A value with no `@`, an
empty provider half or an empty item half is rejected with `custom-item values must use
provider@item`. The written icon always gets `"count": 1`. Edit the document to change it.

The type token is matched after lowercasing and stripping `-` and `_`. `customItem`, `customitem` and
`custom_item` all work.

`auto` uses the first active provider that recognizes the item, so name the provider when more than
one installed plugin may use the same id. An unknown, disabled or not-yet-loaded item shows the
missing-icon checker and logs a warning; the menu still opens.

## The providers

Every adapter clones each stack it successfully resolves.

| Provider id | Plugin | Id format | Ready when | Main thread only |
|---|---|---|---|---|
| `craftengine` | CraftEngine | `namespace:id`. A bare id is also accepted and resolved by a cross-namespace path search | always ready | no |
| `itemsadder` | ItemsAdder | `namespace:id`, lowercase by ItemsAdder's own validation | items finished loading | no |
| `oraxen` | Oraxen | bare yml key, no namespace, case sensitive | always ready | no |
| `nexo` | Nexo | bare yml key, no namespace, case sensitive | always ready | no |
| `mmoitems` | MMOItems | `TYPE:ID`, split on the first colon. Anything without two halves is a miss | plugin instance present | **yes** |
| `executableitems` | ExecutableItems | bare config id | item manager present | no |
| `ecoitems` | EcoItems | `ecoitems:my_item`. A bare id is namespaced for you, and eco lowercases keys so ids are case insensitive | always ready | no |
| `slimefun` | Slimefun | bare `UPPER_SNAKE_CASE` id, exact map lookup, case sensitive | always ready | no |
| `mythicmobs` | MythicMobs | bare item config name, no namespace | item manager present | no |
| `headdatabase` | HeadDatabase | numeric head id string, for example `7129` | its head database has downloaded | no |

Each adapter waits for its own plugin to finish loading, so lookups miss until then. ItemsAdder
loads its items asynchronously long after startup, and HeadDatabase returns nothing until its
database has downloaded.

Only ItemsAdder and Slimefun override the display name used by the catalog. Every other provider
reports the id itself.

A provider whose plugin is absent reports as not installed in `/gloss item status`. You do not need
to remove it from the configuration.

## Configuration

`gloss.toml`, table `[items]`:

| Key | Default | Meaning |
|---|---|---|
| `customItems` | `true` | Master switch. False blocks provider activation, makes every lookup resolve to nothing, and refuses both `/gloss item` subcommands |
| `customItemProviders` | `[]` | Allowlist. An empty list allows every provider |

Allowlist entries can use either the provider id or plugin name. Gloss trims, lowercases, removes
duplicates, and writes the normalized list back to the file.

Changing either key rebuilds the provider list in place. No restart is needed. Config reload rules
are on [Configuration](/gloss/02-configuration).

## Commands

| Command | Permission | Behavior |
|---|---|---|
| `/gloss item status` | `gloss.items` | One row per definition, always ten rows in declaration order, showing provider id and state |
| `/gloss item export` | `gloss.items.export` | Writes the catalog. Refuses while an export is already running |

`items` is an alias of `item`. `/gloss items status` works too. Both subcommands abort with
`Custom items are disabled. Set customItems to true in gloss.toml.` when `[items] customItems` is
false.

`status` shows four states per provider:

| State | Meaning |
|---|---|
| `not installed` | The plugin is absent, or present but not enabled |
| `present, no adapter` | The plugin is enabled but no adapter is registered because the allowlist excluded it or activation failed |
| `present, still loading` | An adapter is registered but the host registry is not ready yet |
| `ready, <n> ids` | Active and ready. `<n>` is what the provider enumerates right now |

When the sender also has `gloss.items.export`, the status output includes `/gloss item export`.

## The custom item catalog

`/gloss item export` writes `plugins/Gloss/custom-items.json`. In the web editor, open **Settings**,
choose **Import custom item catalog**, and select that file. Without a catalog, the custom-item field
accepts free text.

The catalog adds autocomplete and offline checks, but the server performs the final lookup when a
menu opens. Unknown ids log a warning and show the missing-icon checker without breaking the menu.
See [Web Editor & Sync](/gloss/18-web-editor).

### Shape

`version` is the format version, `generated` is wall-clock milliseconds at export, `providers` lists
the ids that contributed an entry, and each item carries its provider, the provider's own id, a
display name with color codes stripped, and the resolved vanilla material for an editor sprite.

```json
{
  "version": 1,
  "generated": 1755561600000,
  "providers": ["itemsadder"],
  "items": [
    { "provider": "itemsadder", "id": "myitems:ruby", "name": "Ruby", "material": "diamond" }
  ]
}
```

The catalog includes up to 10,000 ready items per provider. Unresolved items are omitted, but they can still work in menus when entered manually. Only one export runs at a time. An export with no items still writes an empty catalog.

> `custom-items.json` is generated. After deleting it, run `/gloss item export` again. It
> is also the one file the HoloUi importer deliberately refuses to copy, for the same reason.
{.is-info}

Item providers do not affect container-preview access; see
[Container Previews](/gloss/15-container-previews).
