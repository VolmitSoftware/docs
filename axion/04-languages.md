---
title: "Axion: Languages"
description: "Language selection, local catalogs, and message variables"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "axion, automation"
editor: "markdown"
dateCreated: 2026-10-15T00:00:00.000Z
---

Axion uses `plugins/Axion/languages/<locale>.toml` for editable messages. English comes from the built-in message catalog and supplies missing or invalid entries.

## Selection and installation

`general.language` selects the server default and accepts any id of 2 to 32 letters, digits, `_` or `-`. Players can choose a personal language through `/axion language`; their selection is stored in `languages/language-preferences.properties`.

English is generated locally from the built-in catalog into `languages/en_US.toml`, and new messages merge into it after a plugin update. The other 17 catalogs live on the `main` branch of the `VolmitSoftware/Axion` repository and install when first selected. A configured repository locale that is not installed downloads in the background while English stays active. Any other configured id creates a starter file.

Startup and `/axion language update` check that branch in the background, at most once every five minutes. When it has moved, Axion downloads each installed repository locale and merges it into the local file: keys you edited stay as you wrote them, unedited keys take the repository's text, and new keys are added. If the repository cannot be reached, the check logs one failure and installed languages stay active. A translated TOML file placed in `languages/` works without any download.

| Path under `languages/` | Purpose |
| --- | --- |
| `<locale>.toml` | Editable messages for one locale |
| `.upstream/` | Axion's record of the last download for each repository locale, the English reference, and `upstream.properties` (repository, branch, revision, last check). Do not edit it; hot reload ignores it. |
| `language-preferences.properties` | Saved player choices |

Any other `languages/<id>.toml` is a custom locale. It appears in the pickers and editor, and repository updates never change it. An optional `[meta]` table names it and chooses a base locale:

```toml
[meta]
name = "Pirate Speak"
base = "de_DE"
```

`name` is the picker label. `base` names another installed locale that fills in missing keys before English. Place `[meta]` after the top-level keys.

The [shared language guide](/languages) covers locale names, permissions, selection, and the inventory message editor.

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
| `{added}`, `{updated}`, `{kept}`, `{remaining}` | Language update counts and the wait until the next check |
| `{command}`, `{key}`, `{setting}`, `{value}`, `{old}`, `{new}` | Command and editor values |

Keep required variables when editing. Invalid edits retain the working message; changing languages does not require a server restart.

Configuration categories, setting labels, descriptions, and machine pause reasons use the selected language. Material names, configuration paths, and diagnostic tokens remain identifiers.

## Related pages

- [Shared language guide *Picker, permissions, locales, and editor*](/languages)
- [Configuration *Default language and hot reload*](/axion/03-configuration)
{.links-list}
