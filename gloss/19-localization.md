---
title: "Localization"
description: "Set server and player languages, translations, and message overrides"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss has a server default language and persistent per-player language choices. `/gloss language` opens the shared clickable switcher. Translations download on demand into `plugins/Gloss/languages/`; English remains in the Java catalog.

## The catalog

The catalog covers command help, errors, chat feedback, container previews, and shared labels.
English (`en_US`) is built in, so there is no bundled `en_US.yml` file.

## Locale selection

The shared switcher keeps its navigation and confirmation text in English while showing locale IDs and language names. Plugin messages use the selected translation.

`/gloss language self de_DE` sets your language for Gloss. `/gloss language self reset` returns to the server default. Player choices are stored by UUID in `language-preferences.properties`; the client language setting is not read.

`/gloss language server de_DE` changes the default for players without an override and updates the leading `language` key in `plugins/Gloss/gloss.toml`. Server selection requires `gloss.admin` or `volmit.language.admin`. Personal language selection requires both `gloss.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`.

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

```toml
language = "de_DE"
```

An absent or blank setting becomes `en_US`. Official translations download when first selected, then
work offline without automatic replacement. If a translation cannot be downloaded or validated,
Gloss keeps English active and saves `en_US` for that selection. Invalid and unlisted locale ids do
not change the current language. Each jar selects a compatible translation snapshot. Custom locale
ids can use their own YAML file or `language.yml` overrides over English.

The web editor keeps a separate browser-local language. It does not read or change server or player
settings. It supports the same 18 locale ids; `he_IL` uses a right-to-left layout. See
[Web Editor & Sync](/gloss/18-web-editor).

## The fallback chain

Gloss resolves each key in this order:

```
languages/overrides/<locale>.yml  >  language.yml  >  languages/<locale>.yml  >  English text in GlossMessages
```

Fallback is per key. Missing keys use the next source and produce a warning without blocking the
locale.

## Available locales

Seventeen non-English source files are maintained in the repository and excluded from the plugin jar:

```
de_DE.yml   es_ES.yml   fi_FI.yml   fr_FR.yml
he_IL.yml   it_IT.yml   ja-JP.yml   ko_KR.yml
lt_LT.yml   nl_NL.yml   pl_PL.yml   pt_PT.yml
ru_RU.yml   tr_TR.yml   vi_VI.yml   zh_CN.yml
zh_TW.yml
```

`ja-JP.yml` uses a hyphen where every other file uses an underscore. That is the literal
identifier. `language = "ja-JP"` is the correct spelling in `gloss.toml`.

## Key names

Key ids are dot-delimited and map onto YAML nesting.

| Prefix | Contents |
|---|---|
| `director.*` | Director's own help navigation labels and runtime errors |
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
(`gloss.message.builder.header: "Web Editor"`). Keys consumed through the legacy path carry `&`
codes (`gloss.message.panels.deleted: "&7[&bGloss&7]: &aDeleted panel &f{board}&a."`). Keep a key's
existing style when you translate it. Help text also has all color stripped.

Placeholders are named and brace-delimited: `{menu}`, `{count}`, `{url}`, `{percent}`. A name starts
with a letter and continues with letters, digits, `_`, `.` or `-`. A translation must use exactly
the same **set** of placeholders as the English source. Order and repetition are free. Adding an
unknown name or dropping a declared one rejects the reload.

Player-supplied and dynamic values have color codes removed. Trusted values keep their `&` codes.
Inserted values are not scanned again for placeholders.

## The override file

`plugins/Gloss/language.yml` is the sparse override file shared across locales. Per-language editor values have higher priority. If it is missing at
startup or during an explicit locale change, Gloss writes a documented empty override:

```yaml
messages: {}
```

The generated header points back to the authoritative `language` key in `gloss.toml`. Add only the
keys you want to change, in either nested or flattened dotted form. Both are accepted. They can be
mixed in one file:

```yaml
messages:
  gloss.message.menu.unavailable: "&cMenu indisponible: {menu}"
  gloss:
    message:
      boards:
        deleted: "&7[&bGloss&7]: &aPanneau &f{board}&a supprimé."
```

With `language = "fr_FR"` in `gloss.toml`, those two keys beat the installed `fr_FR.yml`. Other keys use their per-language override when present, then the installed file.
Anything the installed file omits still comes from the English defaults.

The file must be a regular file of at most 2 MiB. Every value under `messages` must be text. A list
or a number where a string is expected fails the load.

## In-game language editor

`/gloss language server edit [locale]` opens an inventory editor, requiring `gloss.admin` or `volmit.language.admin`. Omit the locale to choose one. The editor lists up to 45 message keys per page, supports search, and lets you replace a value through private chat. Plural forms are edited individually. Enter `cancel` or wait 60 seconds to abandon the prompt.

Gloss validates placeholders before saving to `plugins/Gloss/languages/overrides/<locale>.yml`.
Concurrent changes to the same message require reopening it. Saved text updates immediately without
changing anyone's selected language.

## Hot reload

`language.yml` reloads automatically after two identical file reads. Direct edits to locale or
per-language override files apply after `/gloss reload` or the next language selection.

A successful automatic reload sends a localized action-bar notice to online players with
`gloss.admin`.

An invalid, unreadable or missing automatic snapshot keeps the last-good locale. Deleting
`language.yml` does not recreate or rewrite it; startup restores the default file if it is still
missing after a restart.

Invalid reloads keep the last working messages active.

A rejected reload logs `Rejected language reload; continuing with <locale>.` at `SEVERE`. Then up
to twelve individual issues as `<source> [<key>]: <detail>`. Then a count of any omitted remainder.

| Condition | Result |
|---|---|
| Key is not declared by the catalog | Rejected, reported as `UNUSED_KEY` |
| Value shape differs from the declaration | Rejected, reported as `SHAPE_MISMATCH` |
| Placeholder set differs from the English source | Rejected, reported as `PLACEHOLDER_MISMATCH` |
| Non-string value under `messages` | Rejected, fails during load |
| File is not a regular file, or exceeds 2 MiB | Rejected, fails during load |
| YAML does not parse | Rejected, fails during load |
| Locale file whose internal `locale` does not match its name | Rejected, fails during load |
| Key declared in the catalog but absent from an overlay | Accepted. Warning only, falls through |

A typo rejects the file until it is fixed.

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

## Overriding one string

1. Find the key. Its id is what you need, not the English text. The namespace table above narrows it
   down: chat feedback is `gloss.message.*`, a command or parameter description in `/gloss help` is
   `command.help.*`, a preview card line is `gloss.preview.*`.
2. Copy the English template exactly, including its `&` codes or its lack of them, and its
   placeholders.
3. Select the server locale with `language` in `plugins/Gloss/gloss.toml`, then open
   `plugins/Gloss/language.yml` and add the key under `messages`:

   ```yaml
   messages:
     gloss.message.menu.closed: "&8» &7Closed."
   ```

4. Keep every placeholder the original had. You may reorder or repeat them. You may not add or drop
   one.
5. Save. The change applies after two matching captures and the next eligible 3-second batch.
6. If nothing changes, read the console. A `Rejected language reload` line names the offending key
   and the exact mismatch. The previous text keeps serving until you fix it.

Overriding on top of a translated locale works the same way. Set `language` in `gloss.toml` to the
translation you want. Add only the handful of strings you disagree with. Your entries win over the installed file
key by key. You never have to copy a whole translation to change one line.
