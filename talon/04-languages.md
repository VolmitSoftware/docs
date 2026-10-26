---
title: "Talon: Languages"
description: "Talon language files, placeholders, and personal preferences"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "talon, languages"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Talon supports the eighteen suite locales. `/talon language` opens personal selection, server default, reset, and message editing; shared controls and locale codes are in the [language guide](/languages).

## Files and selection

Editable files live at `plugins/Talon/languages/<locale>.toml`. English is generated from the built-in catalog. The server default is `general.language`; personal choices are saved in `languages/language-preferences.properties`.

English is built in. Other translations install on demand from the build's pinned GitHub source and are checked before use. A build without a published catalog source accepts locale files installed by hand and reports unavailable downloads for missing files. Existing local translations retain edits, and missing messages fall back to English.

## Editing

Use the shared message editor through `/talon language`, or edit TOML files on disk. Keep placeholders inside braces; MiniMessage color tags and gradients are supported. The language editor title uses `{plugin}` and `{section}` to identify the product and current page.

| Placeholder | Meaning |
|---|---|
| `{ability}`, `{abilities}`, `{level}`, `{amount}` | Ability names, book levels, and quantities |
| `{mode}`, `{enabled}`, `{linked}`, `{destination}` | Held-tool state |
| `{x}`, `{y}`, `{z}` | Linked-container coordinates |
| `{position}`, `{slots}`, `{age}` | Last checked loot position, empty storage slots, and age in seconds |
| `{count}`, `{skipped}`, `{damage}` | Extra block count, skipped candidates, and estimated durability use |
| `{reserve}`, `{limit}`, `{range}`, `{width}` | Durability, mining, and distance limits |
| `{row}`, `{ingredients}` | Recipe row and ingredient names |
| `{setting}`, `{before}`, `{value}`, `{reason}` | Configuration path, previous and current value, or validation detail |
| `{key}`, `{result}` | Status label or command result |
| `{plugin}`, `{section}` | Editor identity and section |
| `{prefix}` | Talon's formatted name; removing it from a message hides that message's prefix |
| `{version}` | Installed Talon version |

Each generated file includes four header sections: File editing, Prefix, Formatting, and Variables. Shared menu and diagnostic messages have their own placeholders listed in that reference.

## Reload behavior

Installed default and personal language files reload with the config watcher. An invalid personal file keeps its last valid messages while other valid files can refresh. Missing keys in a valid file use English.

Deleting English or a custom catalog recreates the English message reference. Deleting an installed repository translation retains its last valid messages while Talon attempts to restore the file from its published source. When downloads are unavailable, those messages remain active; restoring the file by hand refreshes it on the next reload. Personal language choices are retained.

## Related pages

- [Shared language guide *Picker and editor controls*](/languages)
- [Configuration *Default locale and file watching*](/talon/03-configuration)
- [Diagnostics *Language status and reports*](/talon/07-diagnostics)
{.links-list}
