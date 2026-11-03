---
title: "Talon: Languages"
description: "Talon language files, placeholders, and personal preferences"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "talon, languages"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Talon supports the eighteen suite locales and custom language files. `/talon language` opens personal selection, server default, reset, and message editing; shared controls and locale codes are in the [language guide](/languages).

## Files and selection

English is generated from the built-in catalog into `plugins/Talon/languages/en_US.toml`, and merges new messages after a plugin update while keeping your edits. The server default is `general.language`, which accepts a locale id of letters, digits, `_` and `-`, up to 32 characters. Personal choices are saved in `languages/language-preferences.properties`.

The other 17 catalogs live on the default branch of the `VolmitSoftware/Talon` repository and install when first selected. A `general.language` value naming a repository locale that is not installed downloads in the background, and the current messages stay active until it arrives. Startup and `/talon language update` check that branch in the background, at most once every five minutes. When it has moved, Talon downloads each installed repository locale and merges it into the local file: keys you edited stay as you wrote them, unedited keys take the repository's text, and new keys are added. If the repository cannot be reached, the check logs one failure and installed languages stay active.

| Path under `languages/` | Purpose |
|---|---|
| `<locale>.toml` | Editable messages for one locale |
| `.upstream/` | Talon's record of the last download for each repository locale, the English reference, and `upstream.properties` (repository, branch, revision, last check). Do not edit it; hot reload ignores it. |
| `language-preferences.properties` | Saved personal choices |

Any other `languages/<id>.toml` is a custom locale. It appears in the pickers and editor, and repository updates never change it. An optional `[meta]` table names it and chooses a base locale:

```toml
[meta]
name = "Pirate Speak"
base = "de_DE"
```

`name` is the picker label. `base` names another installed locale that fills in missing keys before English.

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

`{added}`, `{updated}`, `{kept}`, and `{remaining}` appear in `/talon language update` replies: messages added, messages changed, local edits kept, and the wait until the next allowed check.

Each generated file includes four header sections: File editing, Prefix, Formatting, and Variables. Shared menu and diagnostic messages have their own placeholders listed in that reference.

## Reload behavior

Installed default and personal language files reload with the config watcher. An invalid personal file keeps its last valid messages while other valid files can refresh. Missing keys in a valid file use English.

Deleting English or a custom catalog recreates the English message reference. Deleting an installed repository translation retains its last valid messages. If it is the server default, Talon downloads it again in the background; a personal locale downloads the next time it is selected or Talon starts. When downloads are unavailable, those messages remain active; restoring the file by hand refreshes it on the next reload. Personal language choices are retained.

## Related pages

- [Shared language guide *Picker and editor controls*](/languages)
- [Configuration *Default locale and file watching*](/talon/03-configuration)
- [Diagnostics *Language status and reports*](/talon/07-diagnostics)
{.links-list}
