---
title: "Axion: Languages"
description: "Language selection, local catalogs, and message variables"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "axion, automation"
editor: "markdown"
dateCreated: 2026-10-15T00:00:00.000Z
---

Axion uses `plugins/Axion/languages/<locale>.toml` for editable messages. English comes from the built-in message catalog and supplies missing or invalid entries.

## Selection and installation

`general.language` selects the server default. Players can choose a personal language through `/axion language`; their selection is stored in `languages/language-preferences.properties`.

Axion has source catalogs for English and the seventeen shared Volmit translations. Only English is included in the plugin jar. Operators can install a translated TOML catalog in `languages/` before selecting it. Automatic downloads require a published, pinned catalog revision; a build marked `unpublished` cannot download a missing catalog and keeps English available.

Local edits are preserved. The [shared language guide](/languages) covers locale names, permissions, selection, and the inventory message editor.

## Editing messages

Use `/axion language server edit <locale>` or edit the corresponding file. Generated headers explain file editing, the prefix, formatting, and variables. Message files accept legacy color codes, RGB colors, and MiniMessage formatting.

Axion messages use these variables; each message accepts only its own subset:

| Variables | Meaning |
| --- | --- |
| `{actions}`, `{visited}`, `{range}` | Work count, visited route positions, or range |
| `{fuel}`, `{ticks}` | Stored fuel or fuel duration |
| `{tier}`, `{levels}`, `{money}` | Tier and upgrade costs |
| `{owner}`, `{player}`, `{count}` | Owner, player name, or count |
| `{reason}`, `{state}`, `{scheduler}` | Result, enabled state, or scheduler |
| `{locale}`, `{version}` | Locale or plugin version |
| `{command}`, `{key}`, `{setting}`, `{value}`, `{old}`, `{new}` | Command and editor values |

Keep required variables when editing. Invalid edits retain the working message; changing languages does not require a server restart.

Configuration categories, setting labels, descriptions, and machine pause reasons use the selected language. Material names, configuration paths, and diagnostic tokens remain identifiers.

## Related pages

- [Shared language guide *Picker, permissions, locales, and editor*](/languages)
- [Configuration *Default language and hot reload*](/axion/03-configuration)
{.links-list}
