---
title: "Localization"
description: "Editable locales and English fallbacks"
published: true
date: 2026-10-16T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes' server default is the `language` key in `wormholes.toml`, with
`language-fallbacks` as a comma-separated list tried before built-in English. The data folder is
`plugins/Wormholes` on Bukkit and `config/wormholes` on Fabric, Forge, and NeoForge. Personal selection
uses `wormholes.language.self`.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

## Resolution order

Messages resolve from `languages/<locale>.toml`, then each configured fallback locale in order, then the built-in English catalog. The in-game editor writes to the same locale file. English edits apply when `en_US` is selected or explicitly listed as a fallback.

Each language file starts with four localized sections explaining file editing, prefix behavior, formatting, and the meaning of each available variable. `{prefix}` is the start of a portal import code, rather than a global chat prefix. Other variables are specific to the messages that declare them.

## Menu text

Chest menus and native menu screens use the same locale files and the same resolution order, and the server renders every menu string in the viewing player's selected locale. Labels, descriptions, and messages shared with chest menus keep their existing keys. Text added for native screens uses `menu.native.*` keys:

| Keys | Text |
|------|------|
| `menu.native.title.*` | Screen titles |
| `menu.native.context.*` | The portal, door, or network line under the title |
| `menu.native.chrome.*` | Back, Close, Apply, Confirm, Cancel, page controls, **Use held item**, **Aim**, and the message shown when the server does not answer |
| `menu.native.action.*` | Row buttons such as Rotate, Reset, Clear, Colors, Remove, Favorite, Whitelist, and Use server default |
| `menu.native.confirm.*` | Confirmation dialog text and confirm button labels |
| `menu.native.feedback.*` | Feedback line messages |
| `menu.native.placeholder.*` | Text box hints |
| `menu.native.transit.*` | Labels of the Transit menu text boxes |
| `menu.native.nexus.comparator` | The comparator output row in the Network menu |
| `menu.native.list.page` | Page label of the Access and door access lists, also used in chest menus |

## Message editor

`/wormholes language server edit [locale]` opens the in-game message editor and requires `volmit.language.admin` or `wormholes.admin`. Players with the client mod get the editor as native screens. On Fabric, Forge, and NeoForge, other players get the same editor as a chest menu; on Paper, Purpur, and Folia, they get the shared editor described on [Languages](/languages#edit-messages). Other `/wormholes language` commands work as described on [Languages](/languages) for every player.

| Screen | Contents |
|--------|----------|
| Locales | Every available locale, with the server default marked. Select one to load it. Opens first when no locale is given |
| Groups | A search box, then the locale's message groups with their message counts. Opens first when a locale is given |
| Keys | The messages in a group, or those matching the search, each with a text box and **Apply**. Plural and multi-line messages open the forms screen instead. **Clear search** returns to the groups |
| Forms | One text box per plural form or line of the selected message |

In the chest menu, the search and each value use a chat prompt instead of a text box. Saving a value writes it to the locale file. A value longer than 256 characters is listed, and its description says it is too long, but it cannot be edited in this editor.
