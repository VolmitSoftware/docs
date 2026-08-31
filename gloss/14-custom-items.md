---
title: "Custom Items & Item Providers"
description: "Gloss documentation: Custom Items & Item Providers"
published: true
date: 2026-08-24
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
A menu or panel icon can draw an item that belongs to another plugin. Examples are an ItemsAdder
ruby, an MMOItems sword, or a HeadDatabase head. The icon does not need a vanilla `Material`.

Ten adapters resolve a foreign item id into a Bukkit `ItemStack` on the server. Resolution happens
when the icon is built. The stack is sent to the client as it is. Players see the model, name, lore
and data components that the host plugin put on it. This page also covers the catalog export that
feeds the web editor.

## The `customItem` icon

`customItem` is one of the icon types described on [Icons](/gloss/11-icons). Record component names
are the JSON keys verbatim. No naming policy is applied.

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
| `type` | string | yes | — | Literally `customItem` |
| `provider` | string | no | treated as `auto` | A provider id, trimmed and lowercased before matching, or `auto` to try every active provider in activation order |
| `item` | string | yes | — | The provider's own id, passed through verbatim with case preserved |
| `count` | int | no | `0`, rendered as `1` | Stack size. The icon applies `count > 0 ? count : 1` |
| `style` | object | no | icon defaults | The shared display-style block every icon type accepts |

Gloss never parses, splits or case-folds `item`. Splitting on `:` is provider behavior (MMOItems
`TYPE:ID`, EcoItems namespacing), not registry behavior. `namespace:id` means whatever the named
provider means by it. Whether `MY_ITEM` and `my_item` are the same id is decided by the plugin that
owns the id, not by Gloss.

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

`auto` walks the active provider list in **activation order**. It takes the first non-null result.
That order equals the declaration order only when every host plugin was already enabled when Gloss
enabled.

Hosts that enable later, typically ItemsAdder and HeadDatabase, are appended in the order their
`PluginEnableEvent` fires. Name the provider explicitly when the order matters, or when more than
one provider is installed.

Each `auto` hit is cached under its own key. That cache is separate from the same item resolved
under an explicit provider id.

### When an item cannot be resolved

Resolution returns nothing for a disabled integration layer, an unknown provider id, an inactive or
not-ready provider, and an unknown item id. Icon creation then:

1. logs the failure under `An error occurred while creating a Menu Icon for the component "<componentId>":`,
   whose message is `Unable to resolve custom item "<item>" from provider "<provider>"` with `auto`
   substituted when `provider` was null or blank.
2. logs `Falling back to missing icon.` at `WARNING`.
3. draws the missing-icon checker in that slot.

Two lines are therefore logged per failure. The first names the component id, not the provider. The
menu still opens. Failed lookups are never cached. The icon is re-attempted every time it is built.
It appears on its own as soon as its provider becomes ready.

## The provider registry
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

Per-provider behavior worth knowing:

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

Nothing is class-loaded. No adapter exists. Lookups against that provider id resolve to nothing. The
status row reports it as not installed. There is no startup error. You do not need to remove anything
from the config.

### Extending the provider set

The definition list is fixed at compile time. There is no registration method. Another plugin cannot
add an item provider at runtime.

## Configuration

`gloss.toml`, table `[items]`:

| Key | Default | Meaning |
|---|---|---|
| `customItems` | `true` | Master switch. False blocks provider activation, makes every lookup resolve to nothing, and refuses both `/gloss item` subcommands |
| `customItemProviders` | `[]` | Allowlist. An empty list allows every provider |

Allowlist entries are trimmed, lowercased and de-duplicated when the config is normalized. The
normalized list is written back to disk. Each entry is matched against **either** the provider id
**or** the plugin name. `ItemsAdder` and `itemsadder` are equally valid. Both land in the file as
`itemsadder`.

Changing either key rebuilds the provider list in place. No restart is needed. Config reload rules
are on [Configuration](/gloss/02-configuration).

## Commands

| Command | Permission | Behavior |
|---|---|---|
| `/gloss item status` | `gloss.items` | One row per definition — always ten rows, in declaration order — showing provider id and state |
| `/gloss item export` | `gloss.items.export` | Writes the catalog. Refuses while an export is already running |

`items` is an alias of `item`. `/gloss items status` works too. Both subcommands abort with
`Custom items are disabled. Set customItems to true in gloss.toml.` when `[items] customItems` is
false.

`status` shows four states per provider:

| State | Meaning |
|---|---|
| `not installed` | The plugin is absent, or present but not enabled |
| `present, no adapter` | The plugin is enabled but no adapter is registered — excluded by the allowlist, or activation threw |
| `present, still loading` | An adapter is registered but the host registry is not ready yet |
| `ready, <n> ids` | Active and ready.`<n>` is what the provider enumerates right now |

Counting ids is the one place enumeration cost is paid. It is only paid for this command. It is
never paid while a menu is open. HeadDatabase can enumerate tens of thousands of ids. When the
sender also holds `gloss.items.export`, the output appends a clickable `/gloss item export` line.

`export` runs off the main thread. It reports back long after Director has already returned. It
plays its own completion tone and re-dispatches its result message onto the sender's scheduler. That
tone is one of the two that `[commands] sounds = false` does not silence.

## The custom item catalog

`/gloss item export` writes `plugins/Gloss/custom-items.json`. Its consumer is the web editor. The
editor has no connection to your server. You must hand it the file: open **Settings**, choose
**Import custom item catalog** and pick the file. Without a catalog the editor's custom item field
degrades to free text.

The editor cannot verify ids offline. With a catalog loaded it can autocomplete and tell you an id
is not in it. Without one it accepts anything typed. Either way the id is only really checked by the
server when the menu opens. An unknown id is a console warning and a checkered icon. It is never a
broken menu. See [Web Editor & Sync](/gloss/18-web-editor).

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
| `items[].material` | The resolved stack's vanilla key path only — lowercase, `minecraft:` stripped — so the editor can draw an approximate sprite |

### Harvest rules

- Providers are visited in activation order. Ids within one provider are sorted before probing, so repeat
  exports of an unchanged server produce the same file and truncation is deterministic.
- Every id is probed by resolving it directly against the provider. The probe bypasses the icon
  prototype cache so an export does not fill it with ids nobody opened. A null stack, an `AIR` stack
  or a thrown exception drops the id and increments the discarded count. The catalog therefore never
  advertises an id that would render as the missing-icon checker.
- The per-provider cap is **10000 accepted entries**. Discarded ids do not consume the budget, so a
  provider can be probed well past 10000 ids before the cap is reached. On hitting it the export logs
  `[items] provider <id> exposes <n> ids, the catalog keeps the first 10000` and moves on. Truncated ids
  still resolve in a menu. They are only missing from editor autocomplete. HeadDatabase is the provider
  that hits this in practice.
- Providers that are not ready contribute nothing.
- One export runs at a time for the whole server. A second request is refused with
  `A catalog export is already running.`
- Providers that declare themselves main-thread-only are hopped onto the global scheduler for the duration
  of their enumeration only, with a 30 second join. A scheduling failure or a timeout drops that provider
  from the catalog and logs why. Everything else stays off the main thread.
- On success the console logs
  `[items] catalog written to <path> providers=<n> items=<n> discarded=<n>`.

An export that resolves nothing still writes the file. Gloss reports it separately as an empty
export. Only a failed write is reported as an error.

> `custom-items.json` is generated. After deleting it, run `/gloss item export` again. It
> is also the one file the HoloUi importer deliberately refuses to copy, for the same reason.
{.is-info}

## Container previews

Item providers take no part in container-preview authorization. The permission, lock, double-chest,
WorldGuard and access-event sequence is documented once on
[Container Previews](/gloss/15-container-previews).
