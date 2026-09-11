---
title: "Localization"
description: "Select languages and edit message files"
published: true
date: 2026-09-09T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Adapt uses the shared VolmLib language service. English is built in and creates an editable `languages/en_US.toml` on startup when missing. Non-English TOML catalogs are excluded from the plugin jar and downloaded from the current `master` language sources only when their local file is missing. Installed files work offline and preserve local edits. The server default remains `language` in `plugins/Adapt/adapt.toml`.

## In-game language picker

The Bukkit picker uses Adapt's Director menu theme, header, clickable controls, and pagination. Tab completion includes the `self` and `server` scopes, available locales, and personal reset according to the sender's permissions.

Run `/adapt language` to open the clickable language picker. Personal language selection requires both `adapt.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. Changing the server default requires `adapt.configurator` or `volmit.language.admin`. A selection downloads and validates the requested catalog before applying it.

Partial catalogs remain selectable. Missing messages and invalid message values use built-in English individually while valid translations remain active, and the selected locale stays saved. An unavailable download uses English. Invalid command syntax and unlisted locales are rejected without changing the selection.

- `/adapt language self de_DE` sets your Adapt language.
- `/adapt language self reset` follows the server default again.
- `/adapt language server de_DE` changes and saves the server default.

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

Personal choices persist in `plugins/Adapt/languages/language-preferences.properties`. Command responses and menus resolve using the viewing player; shared item names, advancement definitions, and console output use the server default. Reopen an existing menu after changing languages.

## In-game message editor

Run `/adapt language server edit` to choose a locale, or `/adapt language server edit de_DE` to edit German directly. The server language picker also offers an Edit link for each locale. The inventory editor requires `adapt.configurator` or `volmit.language.admin` and is available only to players.

The inventory uses 36 left-aligned content slots across the first four rows, with navigation along the bottom. Skill and adaptation categories use their configured menu models.

Saving writes that locale's message to `plugins/Adapt/languages/<locale>.toml`, including `en_US`, after validating the edited message shape and placeholders. Invalid edits or messages changed since opening are rejected without replacing the file. The edited locale refreshes for players already using it and for the server when it is the active default; editing never changes server or personal language choices. Existing incomplete catalogs can be opened for repair without selecting them.

## Select a language

```toml
language = "de_DE"
```

Save the file. No restart is required. If the locale is unavailable or cannot be downloaded, Adapt keeps English active.

Language downloads, in-game message saves, and server language selection acknowledge their own file changes. They do not produce the operator hotload diff announcements used for external edits. A queued older config snapshot cannot replace a completed server language selection. Configured languages are prepared through the same selection service: a partial catalog stays selected, while a download failure or unreadable catalog selects and saves `en_US`.

Available downloads:

`de_DE` `es_ES` `fi_FI` `fr_FR` `he_IL` `it_IT` `ja-JP` `ko_KR` `lt_LT` `nl_NL` `pl_PL` `pt_PT` `ru_RU` `tr_TR` `vi_VI` `zh_CN` `zh_TW`

## Edit language files

Edit `plugins/Adapt/languages/<locale>.toml` directly, including `en_US.toml`. Startup creates English only when missing and never replaces local changes. Each language starts with translated comments describing formatting, prefixes and runtime variables.

Language files use grouped TOML sections. Generated English, downloaded source catalogs, and in-game editor saves share the same layout and header sections: file editing, prefix, formatting, and variables.

```toml
[gui.skills]
title = "&5Stufe {level} &7({used}/{maximum} Leistung)"
```

Keep every required `{placeholder}`. Active language files reload automatically. Invalid message values fall back to built-in English individually; other valid translations stay active. An unreadable file uses English at startup or selection. During hot reload, a file with invalid TOML syntax keeps the last readable snapshot until the file is repaired.

Resolution order:

```text
languages/<locale>.toml > built-in English
```

Values may be a string, a string list, or a plural table. Match the shape shown in `languages/en_US.toml`.
