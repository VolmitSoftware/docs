---
title: "Localization"
description: "Locales, overrides, and fallbacks"
published: true
date: 2026-09-03T07:34:52.375Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Canonical English is the typed Java catalog in `WormholesMessages` (and related
Director keys). Wormholes does **not** include an `en_US.toml` bundle. Non-English
locales download on demand into the plugin data folder and are excluded from the jar. Missing keys
fall through to code-owned English.

Wormholes supports colors, click actions, and hover text in player messages. Consoles receive readable plain text when rich formatting is unavailable.

## Language switcher

The shared switcher keeps its navigation and confirmation text in English while showing locale IDs and language names. Plugin messages use the selected translation.

The Bukkit picker uses Wormholes's Director menu theme, header, clickable controls, and pagination. Tab completion includes the `self` and `server` scopes, available locales, and personal reset according to the sender's permissions.

`/wormholes language` opens a clickable picker. `/wormholes language self de_DE` selects German for you; `/wormholes language self reset` returns to the server default. Personal language selection requires both `wormholes.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. Choices persist by UUID in `language-preferences.properties`.

`/wormholes language server de_DE` updates the server default and `language` in `wormholes.toml`. This requires `wormholes.admin` or `volmit.language.admin`. Players with an explicit override keep it when the default changes.

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

Missing official translations download from the WormholesPlugin repository when selected, including a configured default or fallback. Downloads and language files are validated before activation. If a requested download fails, is incomplete, or fails catalog preparation, the selected personal or server scope uses validated built-in English. The selected personal preference or server default is saved as `en_US`. The unavailable locale is never activated or saved, and the command reports that the language is unavailable and English is being used. Invalid command syntax and unlisted locales are rejected without changing the selection. Installed files work offline and are never automatically replaced. The source revision is pinned in each jar’s language manifest. Explicit shared-language selections require every message to come from the requested locale; configured secondary fallbacks do not make an incomplete requested pack selectable.

## Config

```toml
# plugins/Wormholes/wormholes.toml
language = "en_US"
metrics = true
language-fallbacks = ""
```

| Key | Default | Rules |
|-----|---------|--------|
| `language` | `en_US` | Locale id matching `[A-Za-z0-9][A-Za-z0-9_-]*` |
| `language-fallbacks` | `""` | Comma-separated locales tried after the primary, in order |

English is always the final fallback when a key is absent from overlays.
Setting `language = "en_US"` uses the catalog with any `languages/overrides/en_US.toml` editor overrides, without downloading an English file.

Invalid locale strings throw on load. A missing custom locale file fails the language load for that name.

## In-game language editor

`/wormholes language server edit [locale]` opens an inventory message editor with `wormholes.admin` or `volmit.language.admin`. Omit the locale to choose one. Browse up to 45 entries per page or search by key/value, then select a message and enter its replacement through private chat. List messages expose individual lines, preserving the other lines and catalog line count; plural messages expose each defined form separately. Text templates accept `\n` for a newline. Enter `cancel` or wait 60 seconds to cancel the prompt.

The editor validates message shapes and placeholders, rejects stale edits, and saves atomically to `plugins/Wormholes/languages/overrides/<locale>.toml`, using the same schema, text, lines, and plural sections as locale catalogs. A save refreshes users of that locale without changing server defaults or personal preferences. English edits work offline. Installed incomplete catalogs are editable without selecting them; missing official catalogs may download on opening, and an unsuccessful load changes no selection.

## Resolution order

For each requested locale (primary, then each fallback), overlays are applied
in this order before the catalog:

1. `plugins/Wormholes/languages/overrides/<locale>.toml` (per-language editor values)
2. `plugins/Wormholes/languages/<locale>.toml` (downloaded if absent for an official non-English locale)
3. The next configured fallback locale, with its editor overrides before its installed catalog
4. Code-owned English catalog (`WormholesMessages`)

`en_US` loads its per-language editor overrides and uses the Java catalog for all remaining keys.

## Available locales

Seventeen non-English sources are stored under `src/main/resources/languages/` in the repository. They are excluded from the jar. Each covers the typed catalog, including Director keys:

| Locale id | File |
|-----------|------|
| `de_DE` | `de_DE.toml` |
| `es_ES` | `es_ES.toml` |
| `fi_FI` | `fi_FI.toml` |
| `fr_FR` | `fr_FR.toml` |
| `he_IL` | `he_IL.toml` |
| `it_IT` | `it_IT.toml` |
| `ja-JP` | `ja-JP.toml` |
| `ko_KR` | `ko_KR.toml` |
| `lt_LT` | `lt_LT.toml` |
| `nl_NL` | `nl_NL.toml` |
| `pl_PL` | `pl_PL.toml` |
| `pt_PT` | `pt_PT.toml` |
| `ru_RU` | `ru_RU.toml` |
| `tr_TR` | `tr_TR.toml` |
| `vi_VI` | `vi_VI.toml` |
| `zh_CN` | `zh_CN.toml` |
| `zh_TW` | `zh_TW.toml` |

English is code-owned. The repository set matches
`VolmitLocales.nonEnglish()`.

### Japanese filename quirk

`ja-JP` uses a **hyphen**, not `ja_JP`. Config `language` and the override
filename must match exactly (`ja-JP.toml`). All other official ids use an
underscore between language and region.

## Operator overrides

Path: `plugins/Wormholes/languages/<locale>.toml`

- Edit the installed file directly. Partial files are accepted; missing keys fall through to configured fallbacks and English.
- Filename must equal the configured locale string + `.toml`.
- Must stay inside the languages directory (path traversal rejected).

### File schema (`WormholesLocaleLoader.SCHEMA = 1`)

```toml
schema = 1
locale = "de_DE"

[text]
"command.error.no_permission" = "<red>…"

[lines]
"command.public_help" = ["line one", "line two"]

[plural."command.admin.deleted_portals"]
one = "…"
other = "…"
```

| Root key | Required | Content |
|----------|----------|---------|
| `schema` | yes | Must be `1` |
| `locale` | yes | Must equal the requested locale (case-insensitive check) |
| `text` | optional | String message templates (MiniMessage-style as used in catalog) |
| `lines` | optional | Arrays of strings for multi-line messages |
| `plural` | optional | Nested tables of plural category → template |

Unknown root keys fail validation. Values must match the expected types
(string / string array / plural form table).

Validation rejects unknown message keys, text/lines/plural shape mismatches,
wrong line counts, per-line placeholder mismatches, and plural-category
mismatches. Missing keys warn and fall through to the next locale or English
catalog.

## Reload

| Trigger | Behavior |
|---------|----------|
| `/wormholes reload` | Reloads config and language, and clears cached player translations (`wormholes.admin.reload` + root gate. See [09 - Commands & Permissions](/wormholes/09-commands-permissions)) |
| `wormholes.toml` hotload | Reloads the selected language after the config load succeeds |
| Direct `languages/*.toml` or `languages/overrides/*.toml` edit | Not watched. Use `/wormholes reload` or touch the config file |
| Language rejected | Last valid language remains. Config may still apply. Console reports the cause |

## Related docs

- [01 - Installation & Configuration](/wormholes/01-installation-configuration), `language` and `language-fallbacks` defaults
- [09 - Commands & Permissions](/wormholes/09-commands-permissions), reload command
