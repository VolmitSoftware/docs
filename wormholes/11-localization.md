---
title: "Localization"
description: "Editable locales and English fallbacks"
published: true
date: 2026-09-10T02:34:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes creates editable `languages/en_US.toml` during startup, regardless of the selected language. Other locales download when selected. Missing or invalid messages fall back to English without discarding valid translations. Player messages support colors, click actions, and hover text, while consoles receive plain text.

## Language switcher

`/wormholes language` opens a clickable picker. `/wormholes language self de_DE` selects German for you; `/wormholes language self reset` returns to the server default. Personal language selection requires both `wormholes.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. Choices persist by UUID in `languages/language-preferences.properties`.

`/wormholes language server de_DE` updates the server default and `language` in `wormholes.toml`. This requires `wormholes.admin` or `volmit.language.admin`. Players with an explicit override keep it when the default changes.

`/volmit plugins languages` manages the server default for every enabled Volmit plugin. It offers only locales supported by all providers and leaves personal selections unchanged.

Partial downloaded and installed languages remain selectable. Missing or invalid entries use fallback values; unknown message keys are ignored. Installed files work offline and are not replaced automatically.

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

Built-in English is always the final fallback. Selecting `en_US` loads `languages/en_US.toml`. Unreadable current language files use fallback values and report the failure in the console; their bytes remain untouched.

## In-game language editor

`/wormholes language server edit [locale]` opens the message editor with `wormholes.admin` or `volmit.language.admin`. Search or browse messages, select one, then enter its replacement in private chat. Use `\n` for a newline. Enter `cancel` or wait 60 seconds to close the prompt.

Edits are validated and saved to `plugins/Wormholes/languages/<locale>.toml`. They take effect for that locale without changing the server default or personal selections.

## Resolution order

Messages resolve from `languages/<locale>.toml`, then each configured fallback locale in order, then the built-in English catalog. The in-game editor writes to the same locale file. English edits apply when `en_US` is selected or explicitly listed as a fallback.

Each language file starts with four localized sections explaining file editing, prefix behavior, formatting, and the meaning of each available variable. `{prefix}` is the start of a portal import code, rather than a global chat prefix. Other variables are specific to the messages that declare them.

## Available locales

Wormholes provides these non-English locales:

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

### Japanese locale filename

`ja-JP` uses a **hyphen**, not `ja_JP`. Config `language` and the language
filename must match exactly (`ja-JP.toml`). All other official ids use an
underscore between language and region.

## Editing language files

Path: `plugins/Wormholes/languages/<locale>.toml`

- Edit the installed file directly. Partial files are accepted; missing keys fall through to configured fallbacks and English.
- Filename must equal the configured locale string + `.toml`.
- Must stay inside the languages directory (path traversal rejected).

Wormholes translations use Minecraft ampersand codes, including `&c` for red, `&l` for bold, and `&r` to reset formatting. Keep color codes inside quoted TOML strings and preserve each message's declared placeholders, such as `{count}`. A color code clears active formatting; repeat `&l` after a color change to keep text bold.

### File structure

Messages are grouped by their dotted key. Text is a string, a multi-line message is an array, and plural forms have a table beneath the message key:

```toml
[command.error]
no_permission = "&c…"

[command]
public_help = ["line one", "line two"]

[command.admin.deleted_portals]
one = "{count} portal deleted"
other = "{count} portals deleted"
```

The locale comes from the filename. Each known message is validated against its expected type. An unreadable document uses fallback values. The editor preserves leading comments and writes grouped keys while retaining other values. Existing installed files are not rewritten solely to change their layout.

Unknown message keys are ignored. Wrong value types, changed line counts, placeholder mismatches, and invalid plural forms fall back for that message. Missing keys use the next fallback or English. In-game edits still reject invalid replacements before saving.

## Reload

| Trigger | Behavior |
|---------|----------|
| `/wormholes reload` | Reloads config and language, and clears cached player translations (`wormholes.admin.reload` + root gate. See [09 - Commands & Permissions](/wormholes/09-commands-permissions)) |
| `wormholes.toml` hotload | Reloads the selected language after the config load succeeds |
| Direct `languages/*.toml` edit | Not watched. Use `/wormholes reload` or touch the config file |
| Invalid language entries or unreadable document | Valid translations remain active; affected messages use fallback values. Console reports unreadable files |

## Related docs

- [01 - Installation & Configuration](/wormholes/01-installation-configuration), `language` and `language-fallbacks` defaults
- [09 - Commands & Permissions](/wormholes/09-commands-permissions), reload command
