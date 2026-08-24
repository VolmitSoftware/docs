---
title: "Localization"
description: "Adapt documentation: Localization"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt's English text lives in typed Java catalogs, not in a file you can edit. Seventeen translations ship inside the jar. Everything on disk under `plugins/Adapt/languages/` is either a generated reference you read, or an override you write.

Pick a language with one key in `adapt.toml`. If you want to change wording, put only the keys you care about in an override file. Adapt resolves each key on its own. An override falls back to the bundled translation. A key missing from the bundle falls back to English.

Reloads are all-or-nothing and validated before anything goes live. A bad override never reaches players. Adapt logs what was wrong and keeps running on the last good language. Nothing that reads text ever touches disk at runtime. A reload cannot stall gameplay.

```
plugins/Adapt/
  adapt.toml                  language = "en_US"
  languages/
    en_US.toml                generated reference, always present, never read back
    <locale>.toml             generated copy of the active bundled locale, never read back
    overrides/
      <locale>.toml           yours, sparse, the only file Adapt reads
```

## Picking a language

1. Open `plugins/Adapt/adapt.toml`.
2. Set `language` to one of the bundled names in the Reference below, matching the spelling exactly. `ja-JP` uses a hyphen. The other sixteen use an underscore.
3. Save. The hotload watcher sees the `adapt.toml` change, reloads the config, and reloads the language with it.

Setting `language` to a name with no bundled translation is not an error. Adapt warns that no bundled locale exists for that name. Code-owned English is used. Your overrides for that name still apply on top.

```
No bundled locale exists for <locale>; code-owned English will be used.
```

A name that is not made of letters, digits, underscores and hyphens is rejected outright and the previously loaded language stays live.

## Reading the generated reference

`languages/en_US.toml` is written first thing in every reload, before the locale is even resolved. It is a dump of the code-owned English catalog in the same TOML shape as the bundled files. It is the authoritative list of every key that exists. Start here when you want to know what a key is called.

`languages/<locale>.toml` appears after a successful reload when `language` is not `en_US`. It holds the bundled translation for that locale exactly as it ships. Only the active locale is extracted. The other sixteen stay in the jar. Set `language = "de_DE"` and you get `languages/de_DE.toml` on the next boot. A rejected reload leaves the previous extraction in place.

Both files are regenerated on every boot and every language reload, through a temp file plus an atomic move. Editing them accomplishes nothing. Your edits are overwritten and were never read in the first place. Each carries a four-line header saying so. A failed write warns and is otherwise ignored. It never blocks language loading.

## Overriding text

1. Find the key you want in `languages/en_US.toml`.
2. Create `plugins/Adapt/languages/overrides/<locale>.toml`, where `<locale>` matches your configured `language` exactly. The folder is created on startup if it is missing.
3. Copy in just that key, keeping its table path and its value shape.
4. Keep every placeholder the original has. Placeholders are `{name}` and the reload validates them before publishing.
5. Save. The watcher notices any `.toml` change in the overrides folder and reloads the language.

```toml
# languages/overrides/de_DE.toml
[gui.skills]
title = "&5Stufe {level} &7({used}/{maximum} Leistung)"
```

Overrides are sparse by design. Copy in only the keys you want to change. Everything absent resolves through the fallback chain.

Colors use `&` codes and are translated when the message renders. Runtime values substituted into a message are trusted or untrusted. Trusted values render as markup. Untrusted values have colors stripped. `&` becomes a full-width `＆`. The code that raises the message decides which. An override cannot promote an untrusted value.

Adapt delivers the rendered result as a component for chat, command replies, action bars, GUI feedback, and the startup splash. Paper-family senders retain colors, RGB, decorations, and authored click or hover events. Plain Bukkit, console, RCON, and Java-logger fallbacks receive a serializer appropriate to that destination, so formatting is preserved for players but raw `§` markers are never printed to an operator terminal.

## Watching a reload

A successful reload logs `Loaded locale <name> with N fallback entries.` `N` is the validator's warning count. There is one warning per key that an overlay does not define. Overlays are sparse on purpose. A large `N` is normal and is not a problem signal.

A rejected reload logs that the locale reload was rejected and that the active language continues. Then it logs up to twelve specific issues formatted as `source [key]: detail`. Then it logs a count of any omitted issues. The last good language stays live.

```
Rejected locale reload for <locale>; continuing with <active>.
```

An override reload triggered by the watcher also re-synchronizes advancement titles, so new text reaches the advancement tree.

## Reference

### Bundled locales

Seventeen translations ship inside the jar. English is not one of them. It comes from code.

`de_DE` `es_ES` `fi_FI` `fr_FR` `he_IL` `it_IT` `ja-JP` `ko_KR` `lt_LT` `nl_NL` `pl_PL` `pt_PT` `ru_RU` `tr_TR` `vi_VI` `zh_CN` `zh_TW`

### Config keys

| Key | Default | What it does |
|---|---|---|
| `language` | `"en_US"` | Locale name to load. Must match `[A-Za-z0-9_-]+`. An invalid name rejects the reload |
| `automaticGradients` | `false` | Applies a gradient pass over rendered markup after `&` codes are translated |

### Value shapes

The key's declaration in the catalog dictates the shape. Use the shape you see in `languages/en_US.toml`.

| Shape | TOML |
|---|---|
| Text | `key = "one line"` |
| Lines | `key = ["first", "second"]` |
| Plural | `[path.key]` table with one entry per plural form |

### Precedence

```
languages/overrides/<locale>.toml   >   bundled <locale>.toml   >   code-owned English
```

Resolution is per key, not per file.

### What rejects a reload

Any one of these fails validation and keeps the previous language:

| Condition | Reported as |
|---|---|
| Key not declared by the message catalog | `Locale overlay key is not declared by the message catalog` |
| Wrong value shape for the key | `Expected <shape> but found <shape>` |
| Lines value with a different line count than English | `Expected N lines but found M` |
| Plural table whose form keys differ from English | `Expected plural forms [...] but found [...]` |
| Placeholder set differs from the key's declaration | `Expected {...} but found {...}` |
| A `null` value anywhere in the file | `Locale value cannot be null: <key>` |
| File is not valid TOML | `Locale source is not valid TOML: <source>` |
| Override file larger than 2 MiB | `Locale override is too large: <path>` |
| `language` value not matching `[A-Za-z0-9_-]+` | `Invalid locale name: <value>` |

Missing keys are warnings, not errors. Only errors block a reload.

### Limits and behavior

| Item | Value |
|---|---|
| Maximum override file size | 2 MiB |
| Issues logged per rejected reload | 12, then a count of the remainder |
| Override watcher poll interval | 500 ms |
| Watched for language reloads | `languages/overrides/*.toml`. `adapt.toml` also reloads the language as part of its config reload |
| Not watched | `languages/en_US.toml`, `languages/<locale>.toml` |
| Generated file write | Temp file plus atomic move, falling back to a plain move |

### Catalog layout

Message keys are declared in `art.arcane.adapt.localization.catalog`. There is one class per area: `GuiMessages`, `CommandMessages`, `RuntimeMessages`, `SnippetsMessages`, `AdvancementMessages`, `MutationMessages`, `ItemsMessages`, and `ConfigMessages`. There is also one class per skill (`AgilityMessages`, `AxeMessages`, and so on). Key ids are dotted paths. Those paths become the TOML table structure in the generated files.

## See also

- [01 - Installation & Configuration](/adapt/01-installation-configuration)
- [06 - GUI Customization](/adapt/06-gui-customization)
- [00 - Overview](/adapt/00-overview)
