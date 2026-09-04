---
title: "Custom Items & Item Providers"
description: "Use items from supported plugins in Gloss menus and panels"
published: true
date: 2026-09-04T00:00:00.000Z
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

Gloss passes `item` to the provider with its case preserved. The provider decides how namespaces and
letter case work.

`item` is the same key the vanilla `item` icon uses. The two icon types read alike.

### Setting one by command

```
/gloss menu seticon <menu> <row> customItem itemsadder@myitems:ruby
```

The command form packs provider and item into one value separated by `@`. A value with no `@`, an
empty provider half or an empty item half is rejected with `custom-item values must use
provider@item`. The written icon always gets `"count": 1`. Edit the document to change it.

The type token is matched after lowercasing and stripping `-` and `_`. `customItem`, `customitem` and
`custom_item` all work.

### `auto` resolution

`auto` uses the first active provider that recognizes the item. Name the provider when more than one installed plugin may use the same id.

### When an item cannot be resolved

Unknown, disabled, or not-yet-loaded items use the missing-icon checker and log a warning. The menu still opens.

## The providers

Every adapter clones each stack it successfully resolves.

| Provider id | Plugin | Id format | `isReady()` gate | Main thread only |
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
| `headdatabase` | HeadDatabase | numeric head id string, for example `7129` | always ready, but see below | no |

Provider-specific behavior:

| Provider | Behavior |
|---|---|
| `craftengine` | Enumeration maps loaded item keys to their fully namespaced form, so the catalog always lists `namespace:id` even though bare ids resolve |
| `itemsadder` | Items load asynchronously long after startup. Until they have loaded the provider is active but not ready and every lookup is skipped. Display names come from the host stack |
| `nexo` | Nexo builds lazily, so a malformed yml entry only throws at build time, not at lookup. That failure is caught and treated as a miss |
| `mmoitems` | Declared main-thread-only. Off-thread lookups are skipped, never blocked. Enumeration is every type crossed with its template names, joined as `TYPE:ID` |
| `executableitems` | The API classes are part of SCore, which ExecutableItems hard depends on, so the ExecutableItems presence check covers both |
| `ecoitems` | The eco lookup never returns null. It returns an empty testable item whose stack is `AIR`, which the adapter treats as a miss. Enumeration filters to the `ecoitems` namespace and re-emits ids as `ecoitems:key` |
| `slimefun` | Enumeration covers **enabled** items only, so a disabled Slimefun item still resolves in a menu but never appears in the catalog. Display names come from the host item |
| `mythicmobs` | The Mythic instance is null between class load and MythicMobs finishing its own enable, which is what the readiness gate covers |
| `headdatabase` | HeadDatabase dereferences its head map instead of reporting a miss until the database has downloaded, so those failures are caught and treated as "not loaded". Enumeration walks every category except online-player and disabled heads, and returns nothing until the database has landed |

Only ItemsAdder and Slimefun override the display name used by the catalog. Every other provider
reports the id itself.

### When a provider's plugin is absent

The status row reports it as not installed. You do not need to remove it from the configuration.

### Extending the provider set

Other plugins cannot add providers at runtime.

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

| Field | Source |
|---|---|
| `version` | Catalog format version, currently `1` |
| `generated` | Wall-clock milliseconds at export |
| `providers` | Provider ids that contributed at least one entry. A ready provider whose ids all failed to resolve is absent |
| `items[].provider` | The provider id |
| `items[].id` | The provider's own id, trimmed, case preserved |
| `items[].name` | The provider's display name with legacy section color codes stripped and trimmed, falling back to the id when it is null, blank or throws |
| `items[].material` | The resolved stack's lowercase vanilla key path without `minecraft:`, used for an approximate editor sprite |

The catalog includes up to 10,000 ready items per provider. Unresolved items are omitted, but they can still work in menus when entered manually. Only one export runs at a time. An export with no items still writes an empty catalog.

> `custom-items.json` is generated. After deleting it, run `/gloss item export` again. It
> is also the one file the HoloUi importer deliberately refuses to copy, for the same reason.
{.is-info}

## Container previews

Item providers do not affect container-preview access. See
[Container Previews](/gloss/15-container-previews) for its permissions and protection checks.
