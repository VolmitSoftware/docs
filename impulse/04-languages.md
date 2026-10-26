---
title: "Impulse languages"
description: "Select a language and edit translations"
published: true
date: 2026-10-22T00:00:00.000Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Impulse provides English and 17 translated catalogs. Player preferences are separate from the server default and persist across restarts.

## Select or edit

Run `/impulse language` for selection commands. The configuration editor also has a language shortcut. Administrators can edit messages with:

```none
/impulse language server edit de_DE
```

The server default is `general.language` in `config.toml`. Catalogs live directly under `plugins/Impulse/languages/`. Player preferences are stored in `languages/language-preferences.properties`.

## Catalogs

`en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`.

English is available locally. Selecting another language installs its catalog from the distribution's configured bundled or pinned remote source. Existing local edits are preserved.

## Message edits

Keep each message's named placeholders, such as `{level}` and `{cost}`. Invalid translations retain the last valid messages where available. Missing entries use English without changing a player's saved choice.

Formatting accepts MiniMessage and the color formats listed in the catalog header. Hot reload applies valid file changes when enabled.
