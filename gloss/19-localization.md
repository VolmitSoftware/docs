---
title: "Localization"
description: "Select server and player languages and edit message files"
published: true
date: 2026-09-10T02:57:34.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss has a server default language and persistent per-player language choices. `/gloss language` opens the shared clickable switcher. Translations download on demand into `plugins/Gloss/languages/`, and startup creates an editable English file there when missing.

## The catalog

The catalog covers command help, errors, chat feedback, container previews, and shared labels.
English (`en_US`) is built in and written to `languages/en_US.toml` at startup when missing.

## Locale selection

The language switcher, its navigation and confirmations, and plugin messages use the selected translation. Locale identifiers stay unchanged.

`/gloss language self de_DE` sets your language for Gloss. `/gloss language self reset` returns to the server default. Player choices are stored by UUID in `languages/language-preferences.properties`; the client language setting is not read.

`/gloss language server de_DE` changes the default for players without an override and updates the leading `language` key in `plugins/Gloss/gloss.toml`. Server selection requires `gloss.admin` or `volmit.language.admin`. Personal language selection requires both `gloss.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`.

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

```toml
language = "de_DE"
```

An absent or blank setting becomes `en_US`. Official translations download when first selected, then
work offline without automatic replacement. Missing or invalid messages use built-in English while the selected locale remains active. If a translation cannot be downloaded, Gloss uses English for that selection. Invalid and unlisted locale ids do
not change the current language. Downloads use the maintained master-branch translations. Custom locale
ids can use their own TOML file with English fallback.

The web editor keeps a separate browser-local language. It does not read or change server or player
settings. It supports the same 18 locale ids; `he_IL` uses a right-to-left layout. See
[Web Editor & Sync](/gloss/18-web-editor).

## The fallback chain

Gloss resolves each key in this order:

```
languages/<locale>.toml  >  English text in GlossMessages
```

Fallback is per key. Missing or invalid entries use the next valid source without blocking the locale. Unknown keys are ignored. A malformed locale file uses English until corrected.

At startup, Gloss creates a complete `languages/en_US.toml` if it is missing. Edit it directly to customize English. Existing English and downloaded files are preserved. Every generated English file and repository translation begins with comments explaining prefixes, formatting and variables.

## Available locales

Seventeen non-English source files are maintained in the repository and excluded from the plugin jar:

```
de_DE.toml   es_ES.toml   fi_FI.toml   fr_FR.toml
he_IL.toml   it_IT.toml   ja-JP.toml   ko_KR.toml
lt_LT.toml   nl_NL.toml   pl_PL.toml   pt_PT.toml
ru_RU.toml   tr_TR.toml   vi_VI.toml   zh_CN.toml
zh_TW.toml
```

`ja-JP.toml` uses a hyphen where every other file uses an underscore. That is the literal
identifier. `language = "ja-JP"` is the correct spelling in `gloss.toml`.

## Key names

Key ids are dot-delimited and map onto TOML sections with short leaf keys. For example, `[gloss.message.menu]` with `unavailable = "&cMenu indisponible: {menu}"` defines `gloss.message.menu.unavailable`. Where a message key is also the parent of other keys, dotted leaf names stay quoted within the same section.

| Prefix | Contents |
|---|---|
| `director.*` | Director's own help navigation labels and runtime errors |
| `language.*` | Shared language picker, selection feedback and message editor |
| `command.help.*` | Command, subcommand and parameter descriptions shown in `/gloss help` |
| `command.*` (other) | Hologram and scoreboard command feedback, permission and usage errors |
| `gloss.message.*` | Chat feedback for menus, panels, previews, items, sync, imports and preview scaling |
| `gloss.preview.*` | Container preview status lines, statistic lines and card titles |
| `gloss.error.*` | Argument validation errors raised while parsing a command |

Use `command.help.*` to change command and parameter descriptions.

## Message formatting

Templates use legacy `&` color codes, not MiniMessage. Each template carries its own prefix where
it needs one. Two render paths exist:

| Path | Behavior | Used for |
|---|---|---|
| `legacy` | Substitutes placeholders, then translates `&` codes | Strings sent straight to a player or the console |
| `text` | Substitutes placeholders with no color translation | Strings handed to the mini-menu renderer |

MiniMessage tags in locale files are escaped and displayed literally.

Keys consumed through the plain-text path are therefore written as plain text
(`[gloss.message.builder]` with `header = "Web Editor"`). Keys consumed through the legacy path carry `&`
codes (`[gloss.message.panels]` with `deleted = "&8[&dGloss&8]: &aDeleted panel &f{board}&a."`). Keep a key's
existing style when you translate it. Help text also has all color stripped.

Placeholders are named and brace-delimited: `{menu}`, `{count}`, `{url}`, `{percent}`. A name starts
with a letter and continues with letters, digits, `_`, `.` or `-`. A translation must use exactly
the same **set** of placeholders as the English source. Order and repetition are free. Adding an
unknown name or dropping a required one makes that message fall back. The in-game editor rejects invalid replacements before saving.

Player-supplied and dynamic values have color codes removed. Trusted values keep their `&` codes.
Inserted values are not scanned again for placeholders.

## Editing files

Edit `plugins/Gloss/languages/<locale>.toml` directly. The filename selects the locale. Translations use grouped TOML sections with short leaf keys, following ShapedPortals. The generated English file provides the complete current catalog.

```toml
[gloss.message.menu]
unavailable = "&cMenu indisponible: {menu}"
```

The file must be a regular file of at most 2 MiB. Missing, incorrectly typed, or invalid message values use built-in English.

## In-game language editor

`/gloss language server edit [locale]` opens an inventory editor, requiring `gloss.admin` or `volmit.language.admin`. Omit the locale to choose one. The editor lists up to 45 message keys per page, supports search, and lets you replace a value through private chat. Plural forms are edited individually. Enter `cancel` or wait 60 seconds to abandon the prompt.

Gloss validates placeholders before saving to `plugins/Gloss/languages/<locale>.toml`.
Concurrent changes to the same message require reopening it. Saved text updates immediately without changing anyone's selected language.

## Hot reload

The configured server locale reloads automatically after two identical file reads. A successful automatic reload sends a localized action-bar notice to online players with `gloss.admin`. Selecting another server locale switches the file watcher to that locale. Direct edits to other locale files apply after a language selection; in-game editor saves refresh the edited locale immediately.

Invalid message values fall back independently. Malformed TOML uses English for the file until it is corrected. A missing automatic snapshot keeps the current messages; startup creates the English file again if it is missing. File failures include context and exception diagnostics in the console.

| Condition | Result |
|---|---|
| Key is not declared by the catalog | Ignored |
| Value shape or required placeholders differ from the declaration | That entry uses English |
| Missing key | That entry uses English |
| Locale file is malformed | Locale messages use English |
| Locale file exceeds 2 MiB | Locale messages use English |
| Invalid or stale in-game edit | Save rejected; file remains unchanged |

## Preview documents reference the catalog

Container previews use the same catalog through `lang(key, ...)`:

```json
{ "text": "lang('gloss.preview.state.smelting_item', item, percent)" }
```

Arguments fill the English template's placeholders in declaration order. With
`Smelting {item} {percent}%`, the example renders `Smelting Iron Ore 42%`. Extra arguments are
ignored, and inserted values cannot add color codes.

The `gloss.preview.*` keys split into `gloss.preview.state.*` for status lines,
`gloss.preview.stat.*` for statistic lines, and `gloss.preview.theme.title.*` for card titles.
Retranslating them changes every included preview card at once. No document edit is needed.

A `lang()` key the catalog does not declare is a build error for that document. It is surfaced by
`/gloss preview dump <name>` as `lang: Unknown message key: <id>`. See
[Container Previews](/gloss/15-container-previews).

## Changing one string

1. Find the message key in the generated `languages/en_US.toml` or the selected translation.
2. Edit the corresponding value in `languages/<locale>.toml`, preserving its required placeholder names and formatting.
3. Save the file. Changes to the configured server locale apply after two matching captures. For another locale, select it again to apply the edit.
4. If a message uses English unexpectedly, compare its value type and placeholders with the English catalog. Check the console for file-level parsing failures.
