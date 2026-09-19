---
title: Static - Commands and languages
description: Profile commands, administrator tools, translations, and per-player languages
published: true
date: 2026-09-19T00:00:00.000Z
tags: static, commands, localization
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

`/static` opens command help. Profile and ranking shortcuts take positional arguments, and the named forms `player=Alex`, `stat=blocks_broken`, and `page=2` work too.

| Command | Permission | Default |
|---|---|---|
| `/stats [player]`, `/stat [player]`, `/static stats [player]` | `static.stats`; other profiles also require `static.stats.others` | Everyone |
| `/leaderboard [stat] [page]`, `/leaderboards [stat] [page]`, `/static top [stat] [page]` | `static.top` | Everyone |
| `/static language` | `static.language` | Everyone |
| `/static config` | `static.config` | Operator |
| `/static status` | `static.status` | Operator |
| `/static reload` | `static.reload` | Operator |
| `/static debug version`, `/static version` | `static.debug` | Operator |
| `/static debug dump upload=false` | `static.debug` | Operator |
| `/static debug dump upload=true` | `static.debug`, plus uploads enabled in config | Operator |

`/static version` is the same as `/static debug version` but hidden from help.

`static.admin` grants every node above. Console profile queries need a recorded name or UUID and print as text. Rankings default to `online_time`, use one-based pages, and include offline profiles.

The server default is `general.language`. Personal choices are stored below `languages/`, and edits to an installed locale file hot-reload.

English is generated from Static's own message catalogue. Translations are downloaded from `VolmitSoftware/Static` on `main`, at `src/main/resources/languages/<locale>.toml`, and must be published there for an install to succeed. Installed files work offline, and local changes are preserved.

A personal language never inherits a missing message from the server's non-English language or from a customized English file; it falls back to built-in English directly.

See [Languages](/languages).

[Installation and configuration](/static/01-installation-configuration) · [Statistics](/static/03-statistics)
