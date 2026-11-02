---
title: "Localization"
description: "Editable locales, repository language updates, and English fallbacks"
published: true
date: 2026-11-01T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes' server default is the `language` key in `wormholes.toml`, with
`language-fallbacks` as a comma-separated list tried before built-in English. The data folder is
`plugins/Wormholes` on Bukkit and `config/wormholes` on Fabric, Forge, and NeoForge. Personal selection
uses `wormholes.language.self`.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

## Language files

Only English ships in the jar. The seventeen translated catalogs live in the `VolmitSoftware/Wormholes` repository under `src/main/resources/languages` on the `master` branch.

| Path | Contents |
|------|----------|
| `languages/en_US.toml` | Editable English reference, written on first start |
| `languages/<locale>.toml` | Installed repository locales and custom locales; every top-level `<id>.toml` whose id matches `[A-Za-z0-9_-]{2,32}` is a locale |
| `languages/language-preferences.properties` | Personal language choices |
| `languages/.upstream/` | Pristine copies of the repository files last merged, the English reference last written, and `upstream.properties` (`repository`, `branch`, `revision`, `etag`, `checked`, and a `sha256.<locale>` per stored file) |

A repository locale downloads when it is selected, set as the server default, or opened in the message editor, at the revision stored in `languages/.upstream/upstream.properties`. If the configured `language` is not installed at startup, it downloads in the background and becomes active when the download finishes; until then built-in English and installed files stay active.

### Language updates

Wormholes checks the repository at startup and when an operator runs `/wormholes language update`, at most once every five minutes. A check asks GitHub for the newest commit touching the language folder, then fetches every installed repository locale at that commit. Each key is merged three ways: a value you changed is kept, a value you left alone takes the repository's new value, new keys are added, and keys removed upstream are removed when you had not changed them. Custom locale files are never touched. The console logs one `Updated Wormholes language <locale> ...` line per changed file, or `Wormholes languages match VolmitSoftware/Wormholes@master (<commit>).` when nothing changed. A failed check logs once and keeps every installed file active.

`en_US.toml` merges the same way against the built-in catalog when Wormholes starts, so keys added by a plugin update appear without losing your edits. Wormholes applies merged and installed messages directly, without a restart.

The update command is available on Paper, Purpur, and Folia. Fabric, Forge, and NeoForge servers run the same check at startup.

### Custom locales

A custom file can start with a `[meta]` table:

```toml
[meta]
name = "Pirate Speak"
base = "de_DE"
```

`name` is shown in the language picker and the message editor, up to 64 characters. `base` names another locale whose file is used for messages the custom file does not define, up to four levels deep; cycles stop at the first repeated locale. Without `name`, the picker shows the standard locale name or the file id.

## Resolution order

Messages resolve from `languages/<locale>.toml`, then the files of its `[meta]` base chain, then each configured fallback locale (with its own base chain) in order, then `languages/en_US.toml`, then the built-in English catalog. The in-game editor writes to the selected locale file.

Each language file starts with four localized sections explaining file editing, prefix behavior, formatting, and the meaning of each available variable. `{prefix}` is the start of a portal import code, rather than a global chat prefix. Other variables are specific to the messages that declare them.

## Menu text

Chest menus and native menu screens use the same locale files and the same resolution order, and the server renders every menu string in the viewing player's selected locale. Labels, descriptions, and messages shared with chest menus use the same keys on both. Text specific to native screens uses `menu.native.*` keys:

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
