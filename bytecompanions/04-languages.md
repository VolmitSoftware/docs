---
title: "ByteCompanions: Languages"
description: "Language files, header sections, placeholders, the server default, and personal selection"
published: true
date: 2026-11-01T00:00:00.000Z
tags: "bytecompanions, languages"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

ByteCompanions ships English inside the jar. The 17 translated catalogs download from the `master` branch of the `VolmitSoftware/ByteCompanions` repository (folder `platform/paper/src/main/resources/languages`) the first time a locale is used, and installed files merge repository changes afterwards while keeping your edits. If a download fails, the console names the locale and the source and English stays active. This page lists what is specific to ByteCompanions. The picker, its permissions, the locale list, and the in-game editor are shared across Volmit plugins and described on [Languages](/languages).

## Files

| Path | Contents |
|---|---|
| `plugins/ByteCompanions/languages/<locale>.toml` | The editable catalog for one locale; English is generated, repository locales are downloaded on first use, any other name is a custom language |
| `plugins/ByteCompanions/languages/.upstream/` | Pristine repository copies and the check state used to merge translation updates; managed by the plugin, not for editing |
| `plugins/ByteCompanions/languages/language-preferences.properties` | Personal choices by player UUID |

Repository locales: `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, `zh_TW`.

Each generated file starts with the shared four-section header comment: File editing, Prefix, Formatting, and Variables. Messages use MiniMessage. `{prefix}` inserts the styled plugin name from `runtime.prefix`. A key missing from a local file falls back to English. Saving a language file applies it through hot reload; an invalid file keeps the last accepted messages.

## Repository updates

Installed translations merge repository changes at startup and whenever an operator runs `/bytecompanions language update`, which needs `bytecompanions.config` or `volmit.language.admin`. New and changed messages arrive, keys you edited by hand stay as you wrote them, and retired keys you never touched are removed. `en_US.toml` gains new built-in messages the same way after a plugin update, with your edits kept. The pristine copies used for that comparison live in `languages/.upstream/`; leave that directory alone. Plugin-written updates and the `.upstream/` directory do not trigger hot reload.

Checks run at most once every five minutes. A restart or a repeated command inside that window skips the request, and the command reports the remaining wait. A failed check, including one blocked by the GitHub rate limit, leaves the installed files and the selected language as they were. The console logs one line per updated locale with its counts, or this line when nothing changed:

```none
ByteCompanions languages match VolmitSoftware/ByteCompanions@master (<commit>).
```

`/bytecompanions status` shows the last checked commit next to the server language, and the debug report has `Language source` and `Language source state` lines.

## Custom languages

Any other `languages/<name>.toml` whose name uses 2 to 32 letters, digits, `_` or `-` is a custom language. It appears in the picker and the message editor, and updates never change it. An optional `[meta]` table sets the display name and a locale to use before English for keys the file leaves out:

```toml
"errors.no-permission" = "Arr, ye can't do that."

[meta]
name = "Pirate Speak"
base = "de_DE"
```

Put `[meta]` after the messages: every key below a table header belongs to that table. A base can name its own base, up to four levels. A base of `en_US`, or none, uses built-in English for missing keys. Without `[meta]`, the picker shows the file name. Selecting a custom name that has no file creates one with the English messages and `[meta]` set to that name with `base = "en_US"`.

## Server default

`general.language` in `config.toml` is the server default and accepts any repository or custom locale name. `/bytecompanions language server <locale>` writes the same key. Console output and players without a personal choice use it. When the configured repository locale is not installed yet, English stays active while it downloads in the background, then the console logs `Activated ByteCompanions language <locale>.` and the locale takes over.

## Personal choice

`/bytecompanions language self <locale>` sets your own language and `self reset` clears it. A player needs both `bytecompanions.language.self` and `volmit.language.self`; both default to everyone.

## Editor

`/bytecompanions language server edit [locale]` opens the shared message editor for players with `bytecompanions.config` or `volmit.language.admin`. Each message shows the placeholders valid for it, taken from the table below.

## Placeholders

| Placeholder | Meaning |
|---|---|
| `{activation}` | Booster activation identifier |
| `{added}` | Messages added by a language update |
| `{after}` | Value after the change |
| `{amount}` | Amount or count |
| `{argument}` | Unexpected command argument |
| `{before}` | Value before the change |
| `{bonus}` | Bonus name |
| `{booster}` | Booster identifier |
| `{category}` | Category name |
| `{change}` | Described change |
| `{channel}` | Booster channel |
| `{choice}` | Selected option |
| `{command}` | Command path |
| `{companion}` | Companion identifier |
| `{companions}` | Companion identifiers |
| `{count}` | Number of items |
| `{created}` | Creation time |
| `{current}` | Current value |
| `{definition}` | Companion definition |
| `{detail}` | Failure detail |
| `{effect}` | Particle effect identifier |
| `{enabled}` | Whether companions are enabled |
| `{feature}` | Feature name |
| `{features}` | Enabled features |
| `{field}` | Studio field name |
| `{formation}` | Formation name |
| `{group}` | Message category name |
| `{hot_reload}` | Hot reload state |
| `{index}` | Position number |
| `{integrations}` | Integration states |
| `{item}` | Item name |
| `{items}` | Item list |
| `{java}` | Java major version |
| `{kept}` | Local edits kept by a language update |
| `{key}` | Message or setting key |
| `{kind}` | Transaction kind |
| `{language}` | Active language |
| `{level}` | Level number |
| `{limit}` | Configured limit |
| `{line}` | Message line number |
| `{locale}` | Locale identifier |
| `{maximum}` | Maximum accepted value |
| `{mode}` | Combining rule |
| `{model}` | Companion model |
| `{money}` | Money amount |
| `{name}` | Display name |
| `{next}` | Next value |
| `{number}` | List entry number |
| `{operation}` | Bonus operation |
| `{page}` | Current page number |
| `{pages}` | Total page count |
| `{parameter}` | Parameter name |
| `{path}` | File path or setting path |
| `{percent}` | Percentage value |
| `{permission}` | Required permission |
| `{personal}` | Personal locale when it differs |
| `{player}` | Player name |
| `{players}` | Loaded player count |
| `{plugin}` | Plugin name |
| `{prefix}` | Styled plugin name from `runtime.prefix` |
| `{provider}` | Payment provider |
| `{range}` | Supported Minecraft range |
| `{reason}` | Failure reason |
| `{remaining}` | Time until the next language check is allowed |
| `{required}` | Required amount |
| `{scheduler}` | Scheduler implementation |
| `{seconds}` | Duration in seconds |
| `{section}` | Language editor section |
| `{sources}` | Bonus sources |
| `{status}` | Status marker |
| `{step}` | Adjustment step |
| `{target}` | Selection target |
| `{tier}` | Upgrade tier |
| `{time}` | Duration text |
| `{transaction}` | Transaction identifier |
| `{type}` | Parameter type |
| `{updated}` | Messages changed by a language update |
| `{url}` | Public report URL |
| `{usage}` | Command usage |
| `{value}` | Current or raw value |
| `{variables}` | Placeholders valid for the message |
| `{variant}` | Appearance variant |
| `{version}` | Plugin version |
| `{xp}` | Companion experience |

## Related pages

- [Shared language controls *Picker, permissions, locale list, and editor*](/languages)
- [Configuration *The `general.language` key*](/bytecompanions/03-configuration#general)
- [Commands and permissions *The language subcommands*](/bytecompanions/02-commands-permissions)
{.links-list}
