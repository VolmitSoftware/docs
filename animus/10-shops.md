---
title: "Animus: Shops"
description: "Buy, sell and trade shops, container shops, money, and importing from dtlTraders"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, shops, trading, economy, vault, dtltraders"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

A shop is a JSON file of pages. Each page has up to three grids: **buy** (the player pays money for items), **sell** (the player is paid for items) and **trade** (items for items, with an optional money price). An NPC opens a shop on click, a behavior opens it with `animus:open-shop`, and a [chest GUI](/animus/11-guis-holograms-menus) opens it with the `animus:open-shop` action.

Shop files live in `plugins/Animus/shops/` (`config/animus/shops/` on mod servers). A file at `town/baker.json` has the id `town:baker`, and its `id` field must say so.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "town:baker",
  "title": "&6Bakery",
  "modes": ["trade", "buy", "sell"],
  "pages": [
    {
      "name": "Bread",
      "rows": 3,
      "trade": {
        "11": {"id": "bread-for-emerald", "type": "trade", "item": {"id": "minecraft:bread", "count": 4},
               "needs": [{"item": {"id": "minecraft:emerald"}, "amount": 1}],
               "gives": [{"item": {"id": "minecraft:bread"}, "amount": 4}]}
      },
      "buy": {
        "11": {"id": "bread", "type": "buy", "item": {"id": "minecraft:bread", "count": 4}, "price": 12, "allowStack": true,
               "limit": {"perPlayer": 64, "resetSeconds": 86400}}
      },
      "sell": {
        "13": {"id": "wheat", "type": "sell", "item": {"id": "minecraft:wheat", "count": 16}, "price": 4, "sellPartial": true}
      }
    }
  ]
}
```

Bind it to an NPC in the NPC definition:

```json
"modules": {"animus:shop": {"shop": "town:baker", "openOn": "right"}}
```

`openOn` is `right` (default), `left` or `both`. A sneaking player with `animus.admin` selects the NPC instead of opening the shop.

The module can also set `style` (`native` or `chest`), which replaces the shop's own style for this NPC, and `villager`, which a villager body shows in the trading screen title:

```json
"modules": {"animus:shop": {"shop": "town:baker", "style": "native", "villager": {"profession": "minecraft:farmer", "level": 2}}}
```

`profession` defaults to `minecraft:none` and `level` (1 to 5) to 1. Other bodies ignore `villager`. Because the module is an ordinary definition field, a [trait group](/animus/18-trait-groups) can set `style` and `villager` for every NPC that lists it.

## Window styles

<div class="animus-demo">
<p><strong>Shops</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/25-shops-ingame.webm" aria-label="Opening a shop as a chest window and switching it to the trading screen" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A shop opens in one of two windows:

- `native`: the villager trading screen, with every offer in one scrolling list.
- `chest`: the chest window described below.

The style comes from the first of these that sets one: `style=` on `/animus shop open`, the NPC's `animus:shop` module, the shop's `style` field, and `style` under `[shops]` in `config.toml` (default `chest`).

### The trading screen

Every buy, sell, trade and command entry on the pages the player can see becomes one offer, in `modes` order, then page order, then slot order. Static entries are left out. A player picks an offer and clicks the result slot; shift click takes a full stack when `allowStack` is true. Nothing moves into the window: the payment slots stay empty and the result slot shows what the offer gives. The trade then runs exactly as a chest click does, with the same limits, stock, money, permission checks and messages.

| Entry | First cost | Second cost | Result |
| --- | --- | --- | --- |
| `trade` | The first need | The second need, if any | The first give |
| `buy`, `command` | A gold nugget named with the price, or "Free" | | The entry's item |
| `sell` | The entry's item | | A gold nugget named "Pays" and the payment |

The trading screen has no money slot and room for two costs and one result, so the closest faithful picture is used: the result's tooltip is the same tooltip the chest window shows, listing every need and give, the price, the limit and the stock. A trade with more than two needs still takes all of them, and one with more than one give still gives all of them. Money is taken from or paid to the player's balance, as in the chest window.

An offer counts down the tightest of its per-player limit, global limit and stock, and is crossed out when it runs out. An entry the player has no permission for is crossed out too. No experience is given, to the player or the NPC, as in Shopkeepers. With `confirm` on, a chest window asks first and the trading screen comes back after. A shop with nothing but static entries does not open in this style.

When a villager NPC opens the shop, the title gets the villager's level, such as `Bakery - Apprentice`, as vanilla shows it. A shop without a `title` takes the profession's name instead of its id. Both are only for show. The level names and the title format are the `level1` to `level5` and `merchantTitle` messages.

`/animus shop problems` and the log list notes, without refusing the shop, for each entry the trading screen cannot show exactly: static entries, trades with more than two needs or more than one give, and money prices.

## The chest window

The bottom row holds the controls: previous page in slot 2, close in slot 4, next page in slot 6 and the mode switch in slot 8. Each shows only when it does something, and an entry under a shown control is hidden. Pages a player has no permission for are skipped, and a mode with no entries on any visible page is not offered. Left and right click take the entry's amount; shift click takes a full stack when `allowStack` is true. With `confirm` on, a purchase waits for a click on the confirm button.

### Layout GUIs

`layout` names a [chest GUI](/animus/11-guis-holograms-menus#chest-guis) to draw the shop in. Its `list` area shows every offer, in the same order as the trading screen, and its own buttons turn the pages with `navigate` `page` actions. The list's `source` and `template` are required by the GUI format but not used. `{{ args.shop }}` and `{{ args.title }}` are the shop's id and title, and `{{ page }}` and `{{ pages }}` count its pages.

```json
{
  "schemaVersion": 1, "revision": 1, "title": "{{ args.title }} &8{{ page }}/{{ pages }}", "resolution": "9x6",
  "mask": ["#########", "#.......#", "#.......#", "#.......#", "#.......#", "<###X###>"],
  "keys": {
    "#": {"type": "decoration", "icon": {"type": "item", "item": "minecraft:gray_stained_glass_pane", "name": " "}},
    "<": {"type": "button", "icon": {"type": "item", "item": "minecraft:arrow", "name": "Previous"}, "actions": [{"type": "navigate", "mode": "page", "target": "prev"}]},
    ">": {"type": "button", "icon": {"type": "item", "item": "minecraft:arrow", "name": "Next"}, "actions": [{"type": "navigate", "mode": "page", "target": "next"}]},
    "X": {"type": "button", "icon": {"type": "item", "item": "minecraft:barrier", "name": "Close"}, "actions": [{"type": "close"}]}
  },
  "list": {"area": ".", "var": "offer", "source": "[]", "template": {"type": "decoration", "icon": {"type": "item", "item": "minecraft:stone"}}}
}
```

A layout applies to the chest style only. When the GUI is not loaded or has no list area, the shop shows its own pages and `/animus shop problems` says why.

## Shop fields

| Field | Meaning |
| --- | --- |
| `schemaVersion`, `revision`, `id` | Version 1, a revision of 1 or more, and the id that matches the file. |
| `title` | Window title, with `&` color codes. Defaults to the id. |
| `permission` | Needed to open the shop. |
| `style` | `native` (trading screen) or `chest`. Defaults to `[shops] style`. See [window styles](#window-styles). |
| `layout` | A chest GUI id whose list area shows the offers, for the chest style. See [layout GUIs](#layout-guis). |
| `modes` | Which of `buy`, `sell` and `trade` are on, in switch order. Default all three. |
| `defaultMode` | The mode shown first. Default the first in `modes`. |
| `match` | How sold and traded items are compared: `strict` (default; every piece of item data) or `legacy` (type, damage, name, lore, enchantments, potion and book text; used by imports). |
| `closeAfterPurchase`, `confirm`, `log` | Close after a completed purchase, ask before each purchase, and write each completed purchase to `logs/shops/<namespace>/<path>/<date>.log`. |
| `pages` | 1 to 64 pages of `name`, `rows` (1 to 6, default 3), optional `permission`, and the `buy`, `sell` and `trade` grids, each a map of slot number to entry. |
| `owner` | `uuid` and an optional `name` of the player who owns a [container shop](#container-shops). Required with `containers`. |
| `containers` | 1 to 8 blocks (`world`, `x`, `y`, `z`) that hold the stock of a container shop. |
| `imported` | Source data an importer kept. Never read. |

## Entry fields

<div class="animus-demo">
<p><strong>Shop offers</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/06-shop-offers-editor.webm" aria-label="Adding a trade and a buy offer and attaching the shop to an NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

| Field | Meaning |
| --- | --- |
| `id` | Unique in the shop. Limits and stock are kept under it, so keep it when you edit the entry. |
| `type` | `static` (decoration), `buy`, `sell`, `trade` or `command`. Buy and command entries belong in the buy grid, sell in the sell grid, trade in the trade grid. |
| `item` | The icon, and for buy and sell the goods: `id`, `count` (1 to 99) and `components` in `/give` syntax such as `[custom_name="Fresh"]`. |
| `price` | Money for `item.count` items, from 0 to 1,000,000,000,000 with at most 4 decimals. A full stack costs the price per item times the stack. Optional for trades. |
| `display` | `name`, `lore` lines, `showPrice` and `showLimit` (both default true). |
| `needs`, `gives` | For trades: 1 to 27 items each, as `{"item": {...}, "amount": n}`. |
| `allowStack`, `sellPartial`, `dropWhenFull` | Shift click takes a full stack; a sale may take fewer items than listed (never zero); items that do not fit drop at the player's feet instead of refusing. |
| `commands` | Up to 16 `{"command": "...", "as": "console"}` (or `"player"`) run after the purchase completes. `{player}` is the player's name, `{uuid}` their UUID, `{amount}` and `{price}` what they took and paid. A `command` entry sells only its commands. |
| `limit` | `perPlayer` and `global` counts with an optional `resetSeconds`. A window starts at the first purchase after the last one ended. |
| `stock` | `maximum` units for everyone, refilled every `restockSeconds` when given. |
| `permission` | Needed to buy; other players see a "needs permission" line. |
| `broadcast` | Chat line to every player after a purchase, with `{player}`, `{item}` and `{price}`. |
| `closeAfterPurchase` | Close after this entry is bought. |
| `discount` | `price` between the optional ISO-8601 `start` and `end`, such as `2026-12-20T00:00:00Z`. |
| `match` | Overrides the shop's `match`. |

Limits count items for buy and sell entries and purchases for trade and command entries. Counts are saved in `state/shops/` within a few seconds of each purchase and survive restarts and crashes. `/animus shop reset <shop> [player=]` clears them.

## How a purchase works

Every purchase runs on the player's own thread and either completes fully or changes nothing.

- **Buy**: checks permission, limits and stock, checks that the items fit (partial stacks count as room), takes the money, then gives the items. If giving fails, the items are taken back and the money is refunded.
- **Sell**: counts matching items anywhere in the 36 main slots, takes them from as many stacks as needed, then pays. If the payment fails, the items are put back.
- **Trade**: takes every needed item, gives every reward, then takes any money price. If any step fails, the player gets back exactly what they had.
- **Trade in a container shop**: takes the rewards out of the shop's containers, takes every needed item from the player, puts the needed items into the containers, then gives the rewards. If the containers lack a reward the trade is out of stock; if they have no room for the needed items it is refused with `containerFull`. Either way both sides keep exactly what they had.

Only the hotbar and the three storage rows are used; armor, the offhand and the cursor are never touched. Every click in either window is cancelled, so no item can be taken out of it; see [chest GUI safety](/animus/11-guis-holograms-menus#safety).

## Container shops

A shop with `owner` and `containers` is a player's shop: its stock is whatever is in those chests, barrels or other container blocks, and its earnings go into them. It trades items for items only, so its entries are `trade` or `static`, with no money price and no `stock` field.

A trade runs only when every container is in a loaded chunk on the buyer's thread, still holds an inventory, and protection lets the owner open it; otherwise the buyer sees `containerUnavailable` with the reason. On Bukkit the protection check is WorldGuard's `build` and `chest-access` rules for the owner, online or not. Without WorldGuard every container can be used, and if WorldGuard is installed but disabled or cannot be used, container shops stay closed. Two listed halves of one double chest count once. Container shops refuse on mod servers, which do not open containers. Shopkeepers player shops import as container shops; see [migrating from Citizens](/animus/13-migrating-from-citizens#shopkeepers).

## Money

| Platform | Money prices |
| --- | --- |
| Bukkit, Paper, Spigot | Through Vault, when Vault and an economy plugin are installed. Animus finds the economy plugin even if it starts later. |
| Folia | Through Vault, called on the player's region. Whether the economy plugin is safe to call from a region thread is up to that plugin. |
| Fabric, NeoForge, Forge | Unavailable: mod servers have no standard economy API. |

Without money, every entry with a price above 0 refuses with "Money trades are unavailable" and nothing changes. Free entries and item trades always work. `[shops] economy = "none"` turns money off on purpose.

## Settings

```toml
[shops]
enabled = true
economy = "auto"
style = "chest"
priceFormat = "#,##0.##"
flushMillis = 2000

[shops.messages]
bought = "&aBought {item} for {price}."
```

`economy` is `auto` or `none`. `style` is `chest` or `native`, for shops and NPCs that do not choose. `priceFormat` is a Java decimal pattern. `flushMillis` (100 to 60,000) is how long counter changes wait before they are written. Any message can be replaced under `[shops.messages]`; an unknown key stops `config.toml` from loading and the error names it. Changes apply when `config.toml` is saved; `flushMillis` applies to the next counter write.

A shop that runs commands needs its id or namespace on the command allow-list (`commandBehaviors` or `commandNamespaces` under `[behaviors.actions]`), the same list [behaviors](/animus/07-behaviors#commands) use. Without it the file is refused.

## Commands

All need `animus.admin`; see [commands](/animus/02-commands-permissions#shops-and-guis) for the full list. The ones you use most:

```none
/animus shop open <shop> [player=] [style=]
/animus shop problems
/animus shop reset <shop> [player=]
```

Run `/animus shop reload` after editing files by hand. Editor applies, `/animus rollback`, and import apply, accept and rollback reload shops and GUIs on their own.

## Importing from dtlTraders

Copy the dtlTraders data folder (the one with `shops/` or `guis.yml`, and `data.dat`) to `plugins/Animus/imports/inbox/dtltraders/`, and optionally the Citizens `saves.yml` beside it in `imports/inbox/`. Then run these, where `<preview>` is the id the first command prints:

```none
/animus shop import preview dtltraders saves=saves.yml
/animus shop import apply <preview>
```

The [Citizens migration](/animus/13-migrating-from-citizens) also installs dtlTraders shops it finds, in the same apply step as the NPCs. The offline converter does the same as these commands:

```sh
converter shops-preview <dtlTraders-folder> <data-dir> [saves.yml]
converter shops-apply <data-dir> <import-id>
```

The preview writes everything to `imports/shops/<import-id>/`: the original files under `originals/` (from `saves.yml` only the `trader` and `wallet` traits), the converted shops, the limit counts and `report.json`, with a report per shop that classifies every source field as `CONVERTED`, `CONVERTED_WITH_CHANGES`, `REQUIRES_REVIEW` or `UNSUPPORTED_PRESERVED`. Apply installs the shops as `shops/dtltraders/<name>.json` in one transaction that `/animus rollback` can undo, and refuses if a shop file with other content already exists. Imported limit counts load at the next start.

| dtlTraders | Animus |
| --- | --- |
| Shop file `shops/<name>/<name>.yml` (version 6) or a root key of `guis.yml` (version 5) | `shops/dtltraders/<name>.json`, the name lowercased with other characters as `-` |
| `title`, `permission`, `default-shop`, `buy-shop-enabled`, `sell-shop-enabled`, `trade-shop-enabled`, `close-after-purchase`, `confirmation-window-enabled`, `logging-enabled` | Shop fields above. Item matching is `legacy`. |
| `command` | Not created; use `/animus shop open` or `animus:open-shop`. |
| `pages.page-N` with `size`, `page-name`, `page-permission` | `pages`, in order of N. A size that is not 9 to 54 in steps of 9 becomes 3 rows, as dtlTraders uses 27 slots. An empty name becomes `Page N`. |
| `item-<slot>` of `type: tradable` in `buy-items` or `sell-items` | `buy` or `sell` entry with id `dtl-<id>` |
| `type: trade` with `needed-items` and `obtainable-items` | `trade` entry |
| `type: static` | `static` entry |
| Tradable with `commands` and `run-mode` | `command` entry. `%player%` becomes `{player}`. `OP` commands run from the console and are reported. `BUY_AND_KEEP` runs on purchase and is reported, since no tokens are made. |
| `trade-price`, `trade-limit`, `limit-reset-seconds`, `stack-sale-enabled`, `sell-all-when-not-enough-items`, `drop-item-on-full-inventory`, `permission`, `broadcast-message`, `close-after-purchase`, `description`, `display-name`, `display-lore`, `show-price`, `show-trade-limit` | The matching entry fields |
| `Discount` with `discount-enabled`, `discount-price`, `discount-start`, `discount-end` | `discount`. Dates are read in the server's time zone. A percentage alone is reported for review. |
| `custom-input-enabled`, `custom-display-text` | Not available; reported |
| Bukkit item (`type`, `amount`, `meta` with `display-name`, `lore`, `enchants`, `Damage`, `Unbreakable`) | `item` with components. Any other item data is kept in `item.imported` and reported for review. Amounts above 99 show as 99. |
| `trader` trait in `saves.yml` | `modules["animus:shop"]` through the [Citizens import](/animus/13-migrating-from-citizens). The shop import checks each link and reports NPCs that name a shop the folder does not have. |
| Version 3 `trader` trait with its own `sell` and `buy` lists | Shop `dtltraders:converted-<npc name>`; the old `sell` list becomes the buy grid and `buy` the sell grid. Only money entries convert: `a:` amount, `p:` price (times the amount unless `.sp`), `s:` slot. Everything else is reported. `wallet` traits are kept for review. |
| `data.dat` | Read only when its whole structure reads to the end. Per-player counts become limit counts for entries that have a limit; the shared uptime clock is not kept, so each player's window starts at their next purchase. If it cannot be read, it is kept as it is and the report says why. |
| `BUY_AND_KEEP` tokens already in player inventories | Not recognised. |
| `config.yml`, `messages.yml` | Copied as originals; set the matching `[shops]` settings by hand. |

Imported shops with commands need `commandNamespaces = ["dtltraders"]` under `[behaviors.actions]`.

### Differences from dtlTraders

- A purchase that fits into partial stacks is allowed; dtlTraders needs an empty slot.
- Limit windows run per player in real time instead of on one server-uptime clock.
- Right click buys the listed amount instead of asking for a typed amount.
- Shops are edited as files or in the [web editor](/animus/14-web-editor); there is no in-game shop editor.
- The [web editor](/animus/14-web-editor#gui-editors) offers only trade and static entries in a shop that lists containers, and removes the fields an entry's new type cannot use when you change its type. It also shows the notes `/animus shop problems` gives for the window style, at the offer they are about.
