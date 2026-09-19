---
title: "Localization"
description: "Editable locales and English fallbacks"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes' server default is the `language` key in `plugins/Wormholes/wormholes.toml`, with
`language-fallbacks` as a comma-separated list tried before built-in English. Its own permission
node is `wormholes.language.self`.

See [Languages](/languages) for the picker, permissions, the full locale list, fallback rules, and how to edit or translate messages.

## Resolution order

Messages resolve from `languages/<locale>.toml`, then each configured fallback locale in order, then the built-in English catalog. The in-game editor writes to the same locale file. English edits apply when `en_US` is selected or explicitly listed as a fallback.

Each language file starts with four localized sections explaining file editing, prefix behavior, formatting, and the meaning of each available variable. `{prefix}` is the start of a portal import code, rather than a global chat prefix. Other variables are specific to the messages that declare them.
