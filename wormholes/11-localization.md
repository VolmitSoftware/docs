---
title: "Localization"
description: "Locales, overrides, and fallbacks"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

English is built into Wormholes; other locales download when selected and are stored in the plugin data folder. Missing messages fall back to English. Player messages support colors, click actions, and hover text, while consoles receive plain text.

## Language switcher

`/wormholes language` opens a clickable picker. `/wormholes language self de_DE` selects German for you; `/wormholes language self reset` returns to the server default. Personal language selection requires both `wormholes.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. Choices persist by UUID in `language-preferences.properties`.

`/wormholes language server de_DE` updates the server default and `language` in `wormholes.toml`. This requires `wormholes.admin` or `volmit.language.admin`. Players with an explicit override keep it when the default changes.

`/volmit plugins languages` manages the server default for every enabled Volmit plugin. It offers only locales supported by all providers and leaves personal selections unchanged.

Downloaded languages are validated before use. An incomplete or unavailable locale is not activated; Wormholes uses and saves `en_US` for that selection instead. Installed files work offline and are not replaced automatically. An explicitly selected locale must contain the full catalog, even when `language-fallbacks` is configured.

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

English is always the final fallback. Selecting `en_US` also applies `languages/overrides/en_US.toml` when present. Invalid locale IDs and missing custom locale files are rejected.

## In-game language editor

`/wormholes language server edit [locale]` opens the message editor with `wormholes.admin` or `volmit.language.admin`. Search or browse messages, select one, then enter its replacement in private chat. Use `\n` for a newline. Enter `cancel` or wait 60 seconds to close the prompt.

Edits are validated and saved to `plugins/Wormholes/languages/overrides/<locale>.toml`. They take effect for that locale without changing the server default or personal selections.

## Resolution order

For each requested locale (primary, then each fallback), overlays are applied
in this order before the catalog:

1. `plugins/Wormholes/languages/overrides/<locale>.toml` (per-language editor values)
2. `plugins/Wormholes/languages/<locale>.toml` (downloaded if absent for an official non-English locale)
3. The next configured fallback locale, with its editor overrides before its installed catalog
4. Code-owned English catalog (`WormholesMessages`)

`en_US` loads its per-language editor overrides and uses the Java catalog for all remaining keys.

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

`ja-JP` uses a **hyphen**, not `ja_JP`. Config `language` and the override
filename must match exactly (`ja-JP.toml`). All other official ids use an
underscore between language and region.

## Operator overrides

Path: `plugins/Wormholes/languages/<locale>.toml`

- Edit the installed file directly. Partial files are accepted; missing keys fall through to configured fallbacks and English.
- Filename must equal the configured locale string + `.toml`.
- Must stay inside the languages directory (path traversal rejected).

### File schema

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

Validation rejects unknown keys, wrong value types, changed line counts, placeholder mismatches, and invalid plural forms. Missing keys use the next fallback or English.

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
