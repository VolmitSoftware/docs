---
title: "Brimstone: Languages"
description: "Language files, repository updates, custom locales, and placeholders"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "brimstone, languages"
editor: markdown
dateCreated: 2026-11-02T00:00:00.000Z
---

This page covers Brimstone's language files and placeholders. The shared picker, permissions, locale list, and editor are described on [Languages](/languages).

## Choosing a language

`general.language` sets the server default, and `/brimstone language` opens the picker. Personal choices persist in `languages/language-preferences.properties`. Players with `brimstone.config` or `volmit.language.admin` can change the server default, edit messages in game, and run `/brimstone language update`.

## Language files

English is built into the plugin and written to `plugins/Brimstone/languages/en_US.toml`. After a plugin update, new English messages are added to that file without replacing your edits.

The jar contains no other catalogs. These locales install from the default branch of [VolmitSoftware/Brimstone](https://github.com/VolmitSoftware/Brimstone) the first time one is selected: `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`.

| Path under `plugins/Brimstone/languages/` | Purpose |
|---|---|
| `<locale>.toml` | Editable messages for one locale |
| `.upstream/` | Last downloaded copy of each repository locale, the English reference, and `upstream.properties` with the repository, branch, revision, and last check; do not edit, the file watcher ignores it |
| `language-preferences.properties` | Saved personal choices |

Each language file starts with a comment header in four parts: where to edit the file, the prefix, color and formatting codes, and the placeholders valid in the file. Messages are grouped into tables by area, such as `[command.feedback]`, `[launch.denied]`, `[status]`, and `[gui.setting.gameplay]`, and keys use lowercase words joined by underscores.

## Repository updates

Brimstone checks the repository once in the background after startup, and `/brimstone language update` runs the same check on demand. When the catalogs have changed, it downloads every installed repository locale and merges it into the local file:

- A message that still matches the previous download takes the new value.
- A message you edited keeps your text.
- New messages are added. Entries that do not fit this build, such as ones with the wrong placeholders, are ignored and use English.
- `[meta]` and other keys Brimstone does not know are kept.

The console logs one line per changed locale. At most one check runs every five minutes, including across restarts, and an earlier request answers with the remaining wait. A failed check logs one warning and can retry after 30 seconds. English and every installed file stay active when GitHub cannot be reached.

## Custom languages

Any `languages/<id>.toml` whose ID has 2 to 32 letters, digits, `_`, or `-` is a locale. It appears in the picker and is accepted by `general.language`. Setting `general.language` to an ID without a file creates one with the English messages. Update checks never change custom files.

An optional `[meta]` table names the language and chooses a base locale:

```toml
[command.feedback]
no_permission = "{prefix}&r &7› &7&cArr, ye lack the rank fer that.&r"

[meta]
name = "Pirate Speak"
base = "en_US"
```

`name` is the picker label, up to 64 characters. `base` names another installed locale whose messages fill in what this file leaves out, up to four levels deep, before English. Every Brimstone message sits in a table, so `[meta]` can go before or after them.

## Editing messages

`runtime.prefix` supplies the styled plugin name for `{prefix}`. Chat messages start with `{prefix}&r &7› &7`; remove that from a message to hide its name and separator.

Messages accept `&0` to `&f`, `&k` to `&r`, RGB colors such as `&#RRGGBB`, and MiniMessage. Put a backslash before `&` or `[` to display it literally.

`/brimstone language server edit [locale]` opens the translation editor. Edits apply to the selected locale and must keep the message's required placeholders. A save is refused if the same value changed after you opened the editor.

## Placeholders

| Placeholder | Meaning |
|---|---|
| `{active}` | Active owned TNT count |
| `{added}` | Messages added by a language update |
| `{after}` | Value after the change |
| `{amount}` | Number of launchers given |
| `{argument}` | Unexpected command argument |
| `{before}` | Value before the change |
| `{command}` | Command path |
| `{count}` | Number of entries |
| `{crafting}` | Crafting recipe state |
| `{enabled}` | Launch switch state |
| `{group}` | Message category name |
| `{hot_reload}` | File watching state |
| `{id}` | TNT type identifier |
| `{kept}` | Local edits kept by a language update |
| `{key}` | Parameter or message key |
| `{language}` | Server default locale |
| `{line}` | Message line number |
| `{locale}` | Locale identifier |
| `{maximum}` | Maximum accepted value |
| `{metrics}` | bStats state |
| `{new}` | Setting value after an editor save |
| `{number}` | Entry number |
| `{old}` | Setting value before an editor save |
| `{page}` | Current page |
| `{pages}` | Total pages |
| `{parameter}` | Parameter name |
| `{path}` | Local report path |
| `{permission}` | Required permission |
| `{personal}` | Personal locale when it differs from the server default |
| `{player}` | Player name |
| `{plugin}` | Plugin name |
| `{prefix}` | Styled plugin name from `runtime.prefix` |
| `{protection}` | Protection plugin check state |
| `{range}` | Supported Minecraft versions |
| `{reason}` | Failure reason |
| `{remaining}` | Time until the next language check is allowed |
| `{scheduler}` | Scheduler in use |
| `{secondary}` | Secondary effect count |
| `{section}` | Language editor section |
| `{setting}` | Setting path |
| `{step}` | Editor step |
| `{target}` | Language selection target |
| `{type}` | Parameter type |
| `{types}` | Configured TNT types |
| `{updated}` | Messages changed by a language update |
| `{updates}` | Update notice state |
| `{url}` | Public report URL |
| `{value}` | Current, default, or raw value |
| `{variables}` | Placeholders valid for the selected message |
| `{version}` | Plugin version |
| `{worldguard}` | WorldGuard integration state |
{.dense}

## Related pages

- [Languages *Shared picker, permissions, locale list, and editor*](/languages)
- [Configuration *The `general.language` setting and file watching*](/brimstone/03-configuration)
{.links-list}
