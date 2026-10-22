---
title: "ByteCompanions: Languages"
description: "Language files, header sections, placeholders, the server default, and personal selection"
published: true
date: 2026-10-15T00:00:00.000Z
tags: "bytecompanions, languages"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

ByteCompanions ships English inside the jar. The first time another locale is selected, the plugin downloads that catalog from the pinned revision of the `VolmitSoftware/ByteCompanions` repository into the languages folder and never overwrites it afterwards. If the download fails, the console names the locale and the source and English stays active. This page lists what is specific to ByteCompanions. The picker, its permissions, the locale list, and the in-game editor are shared across Volmit plugins and described on [Languages](/languages).

## Files

| Path | Contents |
|---|---|
| `plugins/ByteCompanions/languages/<locale>.toml` | The editable catalog for one locale; English is generated, the others are downloaded on first use |
| `plugins/ByteCompanions/languages/language-preferences.properties` | Personal choices by player UUID |

Available locales: `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, `zh_TW`.

Each generated file starts with the shared four-section header comment: File editing, Prefix, Formatting, and Variables. Messages use MiniMessage. `{prefix}` inserts the styled plugin name from `runtime.prefix`. A key missing from a local file falls back to English. Saving a language file applies it through hot reload; an invalid file keeps the last accepted messages.

## Server default

`general.language` in `config.toml` is the server default. `/bytecompanions language server <locale>` writes the same key. Console output and players without a personal choice use it.

## Personal choice

`/bytecompanions language self <locale>` sets your own language and `self reset` clears it. A player needs both `bytecompanions.language.self` and `volmit.language.self`; both default to everyone.

## Editor

`/bytecompanions language server edit [locale]` opens the shared message editor for players with `bytecompanions.config` or `volmit.language.admin`. Each message shows the placeholders valid for it, taken from the table below.

## Placeholders

| Placeholder | Meaning |
|---|---|
| `{action}` | Requested action |
| `{actions}` | Available actions |
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
| `{entry}` | Entry label |
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
| `{new}` | Installed rendered value |
| `{next}` | Next value |
| `{old}` | Previous rendered value |
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
| `{required}` | Required amount |
| `{scheduler}` | Scheduler implementation |
| `{seconds}` | Duration in seconds |
| `{section}` | Language editor section |
| `{setting}` | Setting name |
| `{sources}` | Bonus sources |
| `{status}` | Status marker |
| `{step}` | Adjustment step |
| `{target}` | Selection target |
| `{tier}` | Upgrade tier |
| `{time}` | Duration text |
| `{transaction}` | Transaction identifier |
| `{type}` | Parameter type |
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
