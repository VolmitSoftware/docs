---
title: "Localization"
description: "Gloss documentation: Localization"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Every string Gloss shows a player or an operator comes from one typed message catalog. The catalog
is declared in code and overlaid by YAML. One locale is active for the whole server.

The locale is chosen by the `locale` key in `plugins/Gloss/language.yml`. Seventeen translations
ship inside the jar. You override individual strings in that same file. This page covers the
catalog, the fallback order, the override file, hot reload and what happens when a translation is
wrong.

## The catalog

`GlossMessages` declares 451 keys in code. Each key carries its own English source text. That is
the whole surface: command help, parameter descriptions, validation errors, chat feedback and the
container preview status lines.

The catalog Gloss actually runs with is those 451 keys plus VolmLib's `director.*` keys for the
shared command framework. Those keys are added first. Director's own labels and errors then
translate through the same file.

English is not a locale file. It lives in the key declarations. The catalog's base locale is
`en_US`. There is deliberately no `en_US.yml` anywhere. When the active locale is `en_US`, only
your own overrides sit on top of the code defaults.

## Locale selection

Selection is server-wide. Gloss does not read a player's client locale. No message is ever resolved
for a specific player. The active locale is the top-level `locale` key of
`plugins/Gloss/language.yml`:

```yaml
locale: "de_DE"
```

An absent, blank or freshly generated file means `en_US`.

If `locale` names a locale in the shared fleet manifest but the matching file is missing from the
jar, loading fails and the reload is rejected. If it names something outside the manifest, the
missing bundled resource is tolerated. No bundled overlay is added. Every string comes from the
English catalog plus whatever your own overrides supply.

## The fallback chain

Loading assembles up to two overlays on top of the code defaults: the `messages` section of
`language.yml`, and the bundled classpath resource `/languages/<locale>.yml`. The bundled resource
is only read when the locale is not `en_US`. Precedence per key is:

```
language.yml  >  bundled /languages/<locale>.yml  >  English text in GlossMessages
```

Fallback is per key, not per file. A locale file that omits a key falls through to the next level.
The omission is a warning, not an error. It does not block loading.

## Shipped locales

Seventeen non-English files ship under `resources/languages/`:

```
de_DE.yml   es_ES.yml   fi_FI.yml   fr_FR.yml
he_IL.yml   it_IT.yml   ja-JP.yml   ko_KR.yml
lt_LT.yml   nl_NL.yml   pl_PL.yml   pt_PT.yml
ru_RU.yml   tr_TR.yml   vi_VI.yml   zh_CN.yml
zh_TW.yml
```

`ja-JP.yml` uses a hyphen where every other file uses an underscore. That is the literal
identifier. `locale: "ja-JP"` is the correct spelling in `language.yml`.

The list is not Gloss's. It comes from `VolmitLocales.nonEnglish()` in VolmLib. It is shared across
the Volmit plugin fleet. Adding a locale means adding it in VolmLib and mirroring the file into
every plugin. Each bundled file must declare its own `locale` matching its filename. A mismatch
fails the load.

## Key names

Key ids are dot-delimited and map onto YAML nesting. Two top-level namespaces exist because the
command framework has its own.

| Prefix | Count | Contents |
|---|---|---|
| `director.*` | from VolmLib | Director's own help navigation labels and runtime errors |
| `command.help.*` | 197 | Command, subcommand and parameter descriptions shown in `/gloss help` |
| `command.*` (other) | 63 | Hologram and scoreboard command feedback, permission and usage errors |
| `gloss.message.*` | 126 | Chat feedback for menus, panels, previews, items, sync, imports and preview scaling |
| `gloss.preview.*` | 55 | Container preview status lines, statistic lines and card titles |
| `gloss.error.*` | 9 | Argument validation errors raised while parsing a command |

The `command.help.*` family is what Director resolves. The command classes name those ids directly
in their annotations. Change a command or parameter description through its `command.help.*` key.

> The `gloss.command.*` (68 keys) and `gloss.parameter.*` (41 keys) families were deleted from the
> catalog and from all seventeen bundled locales. They were a duplicate set of command and parameter
> descriptions that Director never resolved, so editing them changed nothing. A locale override file
> that still sets one of those ids is now an unknown key and will be rejected on load — delete those
> entries and use `command.help.*` instead.
{.is-warning}

Every key Gloss declares is plain text. The underlying framework also supports multi-line and plural
keys. The loader handles plural sub-keys. Gloss declares none.

## Message formatting

Templates use legacy `&` color codes, not MiniMessage. Each template carries its own prefix where
it needs one. Two render paths exist:

| Path | Behavior | Used for |
|---|---|---|
| `legacy` | Substitutes placeholders, then translates `&` codes | Strings sent straight to a player or the console |
| `text` | Substitutes placeholders with no color translation | Strings handed to the mini-menu renderer |

The mini-menu renderer escapes what it is given before embedding it in its own markup. MiniMessage
tags written into a locale file are never interpreted. They show up literally.

Keys consumed through the plain-text path are therefore written as plain text
(`gloss.message.builder.header: "Web Editor"`). Keys consumed through the legacy path carry `&`
codes (`gloss.message.panels.deleted: "&7[&bGloss&7]: &aDeleted panel &f{board}&a."`). Keep a key's
existing style when you translate it. Director help output additionally has all color stripped.

Placeholders are named and brace-delimited: `{menu}`, `{count}`, `{url}`, `{percent}`. A name starts
with a letter and continues with letters, digits, `_`, `.` or `-`. A translation must use exactly
the same **set** of placeholders as the English source. Order and repetition are free. Adding an
unknown name or dropping a declared one rejects the reload.

Values are substituted in one of two ways. Untrusted values — anything player-supplied or dynamic,
which is nearly everything — have all color stripped, including raw section characters. A menu name
can never inject formatting. Trusted values keep their `&` codes. Substitution is sentinel-based.
An inserted value that itself looks like a placeholder is never rescanned as one.

## The override file

`plugins/Gloss/language.yml` is the only localization file on disk. If it is missing at startup or
at reload, Gloss writes a minimal default containing exactly one line:

```yaml
locale: en_US
```

The generated file has no `messages` block. Add only the keys you want to change, in either nested
or flattened dotted form. Both are accepted. They can be mixed in one file:

```yaml
locale: "fr_FR"
messages:
  gloss.message.menu.unavailable: "&cMenu indisponible: {menu}"
  gloss:
    message:
      boards:
        deleted: "&7[&bGloss&7]: &aPanneau &f{board}&a supprimé."
```

Those two keys now beat the bundled `fr_FR.yml`. Every other key still comes from the bundled file.
Anything the bundled file omits still comes from the English defaults.

The file must be a regular file of at most 2 MiB. Every value under `messages` must be text. A list
or a number where a string is expected fails the load.

## Hot reload

The same 5-tick pass that watches `menus/` and `images/` checks `language.yml` by last-modified time
and size. It reloads it on any change. No command and no restart is needed. A save applies within a
few ticks. `/gloss reload` does not reload `language.yml`. The file watch is the only path. It is
always running.

Reloads are atomic. The new snapshot is built and validated in full. It is swapped in only if it
passes. If it does not, the previously loaded snapshot stays live. Nothing changes.

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
| Bundled file whose internal `locale` does not match its name | Rejected, fails during load |
| Key declared in the catalog but absent from an overlay | Accepted. Warning only, falls through |

A typo in a key name is therefore not a silent no-op. It takes the whole file out until you fix it.
That is the intended behavior. A half-applied language file is worse than none.

## Preview documents reference the catalog

Container preview documents pull their text out of this same catalog through the expression
function `lang(key, ...)`:

```json
{ "text": "lang('gloss.preview.state.smelting_item', item, percent)" }
```

The key is looked up in the Gloss catalog. The call's positional arguments are bound onto that
key's own placeholder names in the order the English template declares them. With the template
`Smelting {item} {percent}%`, the call above renders `Smelting Iron Ore 42%`. Arguments past the
last placeholder are simply unused. Values are inserted as untrusted text. A container's custom
name can never smuggle color codes into a preview card.

The 55 `gloss.preview.*` keys split into `gloss.preview.state.*` for status lines,
`gloss.preview.stat.*` for statistic lines, and `gloss.preview.theme.title.*` for card titles.
Retranslating them changes every shipped preview card at once. No document edit is needed.

A `lang()` key the catalog does not declare is a build error for that document. It is surfaced by
`/gloss preview dump <name>` as `lang: Unknown message key: <id>`. See
[Container Previews](/gloss/15-container-previews).

## Overriding one string

1. Find the key. Its id is what you need, not the English text. The namespace table above narrows it
   down: chat feedback is `gloss.message.*`, a command or parameter description in `/gloss help` is
   `command.help.*`, a preview card line is `gloss.preview.*`.
2. Copy the English template exactly, including its `&` codes or its lack of them, and its
   placeholders.
3. Open `plugins/Gloss/language.yml` and add the key under `messages`, leaving `locale` alone:

   ```yaml
   locale: en_US
   messages:
     gloss.message.menu.closed: "&8» &7Closed."
   ```

4. Keep every placeholder the original had. You may reorder or repeat them. You may not add or drop
   one.
5. Save. The change applies within a few ticks.
6. If nothing changes, read the console. A `Rejected language reload` line names the offending key
   and the exact mismatch. The previous text keeps serving until you fix it.

Overriding on top of a translated locale works the same way. Set `locale` to the translation you
want. Add only the handful of strings you disagree with. Your entries win over the bundled file
key by key. You never have to copy a whole translation to change one line.
