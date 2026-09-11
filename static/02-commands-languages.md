---
title: Static - Commands and languages
description: Profile commands, administrator tools, translations, and per-player languages
published: true
date: 2026-09-11T00:00:00.000Z
tags: static, commands, localization
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

`/static` opens Director command help with clickable usage and nested diagnostic help. Profile and ranking shortcuts support positional arguments; Director forms such as `player=Alex`, `stat=blocks_broken`, and `page=2` are also accepted.

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

`/static debug version` prints `Static v<version>` using the Director help heading gradient. The nested command appears in debug help; `/static version` is an executable shortcut hidden from help and suggestions.

`static.admin` grants all permissions above. Console profile queries require a recorded player name or UUID and print statistics as text. Unknown players produce an error. Rankings default to `online_time`, use one-based pages, and include offline profiles. Profile inventory entries can open the selected statistic's rankings; refresh and close controls occupy the bottom row.

Language commands use the shared Volmit picker. A player can select a personal language or return to the server default. Operators with `static.config` can select the server default and use the nested language editor. The editor lists messages, previews their current values and placeholders, and validates edited text before saving.

English is generated from the code-owned message catalogue. Repository languages are German (`de_DE`), Spanish (`es_ES`), Finnish (`fi_FI`), French (`fr_FR`), Hebrew (`he_IL`), Italian (`it_IT`), Japanese (`ja-JP`), Korean (`ko_KR`), Lithuanian (`lt_LT`), Dutch (`nl_NL`), Polish (`pl_PL`), Portuguese (`pt_PT`), Russian (`ru_RU`), Turkish (`tr_TR`), Vietnamese (`vi_VI`), simplified Chinese (`zh_CN`), and traditional Chinese (`zh_TW`).

Translation sources live in `VolmitSoftware/Static`, branch `main`, at `src/main/resources/languages/<locale>.toml`. They must be published there for remote installation to succeed. Downloads are bounded and asynchronous. Installed files work offline and local changes are preserved. Network failures leave the existing language or English available.

Every missing or invalid translation entry falls back directly to built-in English. A personal language never inherits missing entries from the server's non-English language or from a customized English file. Language preferences are stored below `languages/`; installed locale edits are watched by hot reload.

[Installation and configuration](/static/01-installation-configuration) · [Statistics](/static/03-statistics)
