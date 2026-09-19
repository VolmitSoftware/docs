---
title: "Languages"
description: "Choose a language, edit messages, and translate any Volmit plugin"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "languages, localization"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---

Every Volmit plugin uses the same language service. Each has a server default, each player can pick
their own, and every message can be edited in game or in a file. This page covers all of it; a
plugin's own localization page lists only what differs.

## Pick a language

| Command | Who | What it does |
|---|---|---|
| `/<plugin> language` | anyone | Opens the clickable picker |
| `/<plugin> language self <locale>` | player | Sets your own language |
| `/<plugin> language self reset` | player | Follow the server default again |
| `/<plugin> language server <locale>` | admin | Changes the server default |
| `/<plugin> language server edit [locale]` | admin | Opens the in-game message editor |
| `/volmit plugins languages [locale]` | admin | Changes the server default for **every** enabled Volmit plugin at once |

`/volmit plugins languages` keeps everyone's personal choice and offers only locales that every
enabled plugin has in common.

Your personal choice affects only you. Console output and players who have not chosen use the server
default. Choices are stored by UUID and survive restarts.

The server default is also a config key, so you can set it before first start. Most plugins call it
`language`; Iris, ShapedPortals, GamemodeSwitcher, and Static call it `general.language`. Each
plugin's own localization page names its file.

## Permissions

Personal selection needs both the plugin's own node and the shared one:

| Node | Default | Grants |
|---|---|---|
| `<plugin>.language.self` | `true` | Choosing your own language for that plugin |
| `volmit.language.self` | `true` | Shared requirement for any personal selection |
| `volmit.language.admin` | `op` | Changing a server default, and the message editor |

Denying either personal node blocks the picker, direct selection, and `self reset`. Changing a
server default accepts `volmit.language.admin` or that plugin's own administration permission.

## Available languages

```
en_US  de_DE  es_ES  fi_FI  fr_FR  he_IL  it_IT  ja-JP  ko_KR
lt_LT  nl_NL  pl_PL  pt_PT  ru_RU  tr_TR  vi_VI  zh_CN  zh_TW
```

`ja-JP` uses a hyphen where every other id uses an underscore. That is the literal identifier, so
write `language = "ja-JP"`.

English is built in. Selecting any other language downloads it once into
`plugins/<Plugin>/languages/<locale>.toml`, after which it works offline. An existing file is never
replaced, so local edits survive.

## When something is missing

Missing or invalid messages fall back to built-in English one key at a time, and the rest of the
translation keeps working. A file that will not parse at all uses English until you fix it. A
download that fails leaves your selection saved and shows English in the meantime.

## Edit messages

Either edit `plugins/<Plugin>/languages/<locale>.toml` directly, or run
`/<plugin> language server edit` for an in-game editor. Both apply on save without changing anyone's
selected language, and the editor validates before it writes.

Files use grouped TOML sections, so `[command.feedback]` with `saved = "..."` is the key
`command.feedback.saved`:

```toml
[command.feedback]
saved = "&aSaved &f{file}&a."
```

Keep every `{placeholder}` the English source uses. Order and repetition are free, but adding an
unknown name or dropping a required one makes that one message fall back to English. Values a player
supplies have their color codes stripped and are inserted as plain text, so a player name cannot
smuggle formatting into a message.

Colors are `&0`–`&f`, decorations `&k`–`&o`, `&r` to reset, and `&#RRGGBB` for hex. Each generated
file starts with comments explaining its prefix, formatting, and variables in that language.

## The plugin name label

Most plugins put their displayed name in `runtime.prefix` and reference it from messages, help, and
menus as `{prefix}`, so editing that one value renames it everywhere. Emptying `runtime.prefix` hides
the name; the `›` separator lives in each message template, so remove `{prefix}` and its separator
from a template to drop the label from that one message.

```toml
[runtime]
prefix = "<bold><gradient:#6f35c5:#35135f>ShapedPortals</gradient></bold>"
```

Wormholes is the exception: there `{prefix}` is the start of a portal import code, not a name label.

## Translating

The non-English catalogs live in each plugin's repository and are not shipped inside the jar. To
contribute a translation, edit the file there rather than only on your server. See
[Contributing](/contributing).
