---
title: "Localization"
description: "Adapt documentation: Localization"
published: true
date: 2026-09-03T07:33:50.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Adapt uses the shared VolmLib language service. English is built in; non-English TOML catalogs are excluded from the plugin jar and downloaded only when selected, with a verified cache for offline starts. The server default remains `language` in `plugins/Adapt/adapt.toml`.

## In-game language picker

The Bukkit picker uses Adapt's Director menu theme, header, clickable controls, and pagination. Tab completion includes the `self` and `server` scopes, available locales, and personal reset according to the sender's permissions.

Run `/adapt language` to open the clickable language picker. Personal language selection requires both `adapt.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. Changing the server default requires `adapt.configurator` or `volmit.language.admin`. A selection downloads and validates the requested catalog before applying it.

If a requested download fails, is incomplete, or fails catalog preparation, the selected personal or server scope uses validated built-in English. The selected personal preference or server default is saved as `en_US`. The unavailable locale is never activated or saved, and the command reports that the language is unavailable and English is being used. Invalid command syntax and unlisted locales are rejected without changing the selection.

- `/adapt language self de_DE` sets your Adapt language.
- `/adapt language self reset` follows the server default again.
- `/adapt language server de_DE` changes and saves the server default.

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

Personal choices persist in `plugins/Adapt/languages/players.properties`. Command responses and menus resolve using the viewing player; shared item names, advancement definitions, and console output use the server default. Reopen an existing menu after changing languages.

## In-game message editor

Run `/adapt language server edit` to choose a locale, or `/adapt language server edit de_DE` to edit German directly. The server language picker also offers an Edit link for each locale. The inventory editor requires `adapt.configurator` or `volmit.language.admin` and is available only to players.

Saving writes that locale's message to `plugins/Adapt/languages/overrides/<locale>.toml`, including `en_US`, after validating the message shape, placeholders, and complete candidate catalog. Invalid edits or messages changed since opening are rejected without replacing the file. The edited locale refreshes for players already using it and for the server when it is the active default; editing never changes server or personal language choices. Existing incomplete catalogs can be opened for repair without selecting them.

## Select a language

```toml
language = "de_DE"
```

Save the file. No restart is required. If the locale is unavailable or cannot be downloaded, Adapt keeps English active.

Available downloads:

`de_DE` `es_ES` `fi_FI` `fr_FR` `he_IL` `it_IT` `ja-JP` `ko_KR` `lt_LT` `nl_NL` `pl_PL` `pt_PT` `ru_RU` `tr_TR` `vi_VI` `zh_CN` `zh_TW`

## Override text

Use `languages/en_US.toml` to find keys. Do not edit that generated reference. Put local changes in `plugins/Adapt/languages/overrides/<locale>.toml`.

```toml
[gui.skills]
title = "&5Stufe {level} &7({used}/{maximum} Leistung)"
```

Copy only the keys you want to change and keep every required `{placeholder}`. Overrides reload automatically. Invalid changes leave the previous messages active.

Resolution order:

```text
local override > downloaded locale > English
```

Values may be a string, a string list, or a plural table. Match the shape shown in `languages/en_US.toml`.
