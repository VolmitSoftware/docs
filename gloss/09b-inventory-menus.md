---
title: "Inventory Menus"
description: "Build item-slot menus with masks, actions, conditional layouts, and paged lists"
published: true
date: 2026-10-03T13:23:12.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-10-03T00:00:00.000Z
---

Inventory menus open a normal Minecraft container screen. Each schema-1 document under `plugins/Gloss/inventories/` defines its title, size, item slots, and click actions. The file name without `.json` is its menu id.

## The inventory document

<div class="gloss-demo" data-demo="inventory-editor">
<p><strong>Inventory menu authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/inventory-editor.webm" aria-label="Inventory menu authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Save this example as `inventories/supplies.json`, then run `/gloss inventory open supplies`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "title": "&6Supplies",
  "resolution": "9x3",
  "show": "true",
  "mask": [".........", "....B....", "........."],
  "keys": {
    "B": {
      "type": "button",
      "icon": {"type": "item", "item": "minecraft:bread", "count": 1},
      "actions": [{"type": "message", "message": "&aBread selected"}]
    }
  },
  "slots": {},
  "variants": []
}
```

| Key | Default | Meaning |
|---|---|---|
| `schemaVersion` | Required | `1` |
| `revision` | Required | Positive document revision |
| `title` | Empty | Viewer-aware text for the container title |
| `resolution` | `9x3` | `9x1` through `9x6`, `5x1`, or `3x3` |
| `mask` | `[]` | Rows of characters describing the slot layout; each row must have exactly the window width |
| `keys` | `{}` | A component body for each named mask character |
| `slots` | `{}` | Component bodies keyed by zero-based slot index; these override mask entries |
| `show` | `true` | Boolean or viewer condition checked when opening |
| `closeOnTeleport` | `true` | Close when the viewer teleports, when also enabled in `[inventories]` |
| `variants` | `[]` | Conditional presentations selected for the viewer |

An unmapped mask character leaves an empty slot. Fewer mask rows are allowed; unspecified rows stay empty. Use [component bodies](/gloss/10-components-hitboxes) directly inside `keys` and `slots`, without the in-world component's `id`, `offset`, or `data` wrapper.

## Slot icons and actions

<div class="gloss-demo" data-demo="inventory-menus-pov">
<p><strong>Inventory menu interaction</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/inventory-menus-pov.webm" aria-label="Inventory menu interaction, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Buttons use their `icon` and `actions`. Decorations supply an item without click actions. A toggle supplies its `trueIcon` and `trueActions` as a clickable slot; inventory slots do not switch between toggle states. Slider and field components belong to [hologram menus](/gloss/09-menus).

Vanilla items, blocks, player heads, and supported custom items have item forms. A `text` icon becomes paper named with that text. `textImage`, `animatedTextImage`, and entity icons use `[inventories] unsupportedIconItem`, with a lore line identifying the unsupported icon type. Use item icons when the screen must show an actual model.

Slots accept the shared [Actions](/gloss/12-actions), including command, message, prompt, and navigation actions. Left, right, shift-left, and shift-right clicks map to the same trigger names as hologram buttons. A `navigate` action ends the current action chain.

`navigate` modes `push`, `replace`, `back`, `home`, and `close` operate on inventory menus. An inventory session keeps its own navigation history and opening arguments. Use `args.<key>` in expressions for values passed through the command's `args=` argument.

## Paged lists

A `list` fills every occurrence of one mask character with entries from a source expression. The expression must return a list. Each entry is available under the variable named by `var` when the template icon renders.

```json
"mask": ["LLLLLLLLL", ".........", "P.......N"],
"keys": {
  "P": {"type": "button", "icon": {"type": "text", "text": "Previous"},
        "actions": [{"type": "navigate", "mode": "page", "target": "prev"}]},
  "N": {"type": "button", "icon": {"type": "text", "text": "Next"},
        "actions": [{"type": "navigate", "mode": "page", "target": "next"}]}
},
"list": {
  "area": "L",
  "var": "supply",
  "source": "['Bread', 'Apple', 'Carrot', 'Potato', 'Melon', 'Berry', 'Stew', 'Cookie', 'Cake', 'Honey']",
  "pageSize": 9,
  "refreshTicks": 20,
  "template": {"type": "decoration", "icon": {"type": "text", "text": "{{ supply }}"}}
}
```

`area` must be exactly one character present in the mask. `var` must match `[a-z][a-z0-9_]*`. `pageSize` defaults to the number of matching cells; a positive override determines the entries per page. Use `navigate` with `mode: "page"` and `target: "next"`, `"prev"`, or a zero-based page number. Page targets clamp to the available range.

Viewer-dependent sources refresh at `refreshTicks`, default 20 and clamped to 0–1200. Zero disables those refreshes. Constant lists render when opening or changing pages.

## Conditional layouts and reload

Each variant has a unique `id`, `priority`, `when`, and `presentation` containing `title`, `mask`, `keys`, and `slots`. The highest-priority passing variant wins; equal priorities use id order. An empty variant title, mask, or key map uses the corresponding base value; its slot overrides replace the base overrides. Resolution and list settings belong to the base document.

Gloss watches inventory files. New and edited documents become available automatically; reopen a menu to use its changed definition. A malformed edit retains the last valid definition.

## Commands and settings

| Command | Permission | Result |
|---|---|---|
| `/gloss inventory list [page=1]` | `gloss.inventories` | List loaded menus |
| `/gloss inventory info <id>` | `gloss.inventories.info` | Show size and configured slot count |
| `/gloss inventory open <id> [player=] [args=]` | `gloss.inventories.open` | Open for yourself or the named online player |
| `/gloss inventory reset [name=*]` | `gloss.inventories.reset` | Restore selected shipped defaults |

`inventories` is an alias of `inventory`. Optional arguments use `key=value`. `[features] inventories` defaults to `true`; `[inventories] closeOnTeleport` defaults to `true`, and `unsupportedIconItem` defaults to `minecraft:paper`.
