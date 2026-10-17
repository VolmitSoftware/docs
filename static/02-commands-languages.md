---
title: Static - Commands and languages
description: Player commands, operator tools, and downloadable translations
published: true
date: 2026-10-16T00:00:00.000Z
tags: static, commands, localization
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

`/static` opens command help. Commands accept positional arguments or named values such as `player=Alex`, `stat=blocks_broken`, and `page=2`. Pages start at 1.

## Player commands

These permissions default to everyone. Commands that accept another player also require the corresponding `.others` permission and respect profile visibility.

| Command | Permission | Purpose |
|---|---|---|
| `/static stats [player] [period]` | `static.stats` | Profile for `lifetime`, `day`, `week`, or `month` |
| `/static top [stat] [page] [period]` | `static.top` | Rankings; defaults to `online_time` |
| `/static details [player] [category] [page]` | `static.details` | Selected lifetime activity breakdowns |
| `/static detailtop <counter> [page]` | `static.detailtop` | Ranking for one detailed counter |
| `/static modules [page]` | `static.modules` | Active and retained plugin modules |
| `/static module <module> [player] [page]` | `static.modules` | Lifetime module values; opens an inventory for players |
| `/static sessions [player] [page]` | `static.sessions` | Recent retained sessions |
| `/static bests [player] [period] [page]` | `static.bests` | Records for `day`, `week`, `month`, or `session` |
| `/static milestones [player] [page]` | `static.milestones` | Lifetime thresholds and completed badges |
| `/static seasons [page]` | `static.seasons` | Scheduled, active, and archived events |
| `/static season <id> [player]` | `static.seasons` | Player progress in an event |
| `/static seasontop <id> [page]` | `static.seasons` | Live or archived event rankings |
| `/static privacy [mode] [player]` | `static.privacy` | View or choose `private`, `server`, or `public` visibility |
| `/static language` | `static.language` | Select a personal language |

`/stats` and `/stat` are profile shortcuts. `/leaderboard` and `/leaderboards` are ranking shortcuts. Omitted players mean yourself; console queries need a recorded name or UUID and return text.

The `.others` permissions are `static.stats.others`, `static.details.others`, `static.sessions.others`, `static.bests.others`, `static.milestones.others`, and `static.seasons.others`. They default to everyone. Changing someone else's visibility requires the operator permission `static.privacy.others`.

## Operator commands

Viewing another player's module values requires `static.modules.others`, which defaults to operators. Module views respect profile visibility; this permission does not bypass private profiles.

| Command | Permission |
|---|---|
| `/static config` | `static.config` |
| `/static participation [period] [offset]` | `static.participation` |
| `/static moduletop <module> <stat>` | `static.modules` and `static.modules.others` |
| `/static status` | `static.status` |
| `/static debug version` | `static.debug` |
| `/static debug dump [upload=false]` | `static.debug` |

`/static version` is a hidden alias for `/static debug version`. Dumps stay local unless `upload=true` is supplied and `debug.uploadEnabled` permits it. `/static config` opens the settings and language editors; stable disk edits apply through hot reload. There is no separate reload command.

`static.admin` grants the listed permissions, including `static.privacy.bypass`, which lets administrators inspect private profiles. All operator permissions default to operators. `static.update` receives release notifications; the shared `volmit.update` permission is also accepted.

## Languages

Only `languages/en_US.toml` is generated at startup. Selecting another language downloads its catalogue from the Static GitHub repository. Installed files work offline and retain local edits. Personal selections live in `languages/language-preferences.properties`; `general.language` supplies the server default.

Downloads use the revision embedded in the JAR's `static-language-source.properties`, currently `054dca9a12149c324d29023abc7def9fa1e528bf`, from `VolmitSoftware/Static/src/main/resources/languages/`. New catalogue entries and gradient corrections in the local source need publication and a new pinned build revision before remote installations receive them. Missing new messages still use English.

The 17 downloadable translations are German (`de_DE`), Spanish (`es_ES`), Finnish (`fi_FI`), French (`fr_FR`), Hebrew (`he_IL`), Italian (`it_IT`), Japanese (`ja-JP`), Korean (`ko_KR`), Lithuanian (`lt_LT`), Dutch (`nl_NL`), Polish (`pl_PL`), Portuguese (`pt_PT`), Russian (`ru_RU`), Turkish (`tr_TR`), Vietnamese (`vi_VI`), Simplified Chinese (`zh_CN`), and Traditional Chinese (`zh_TW`).

A missing or invalid message falls back directly to built-in English. It does not inherit another player's language, the server's translated catalogue, or edits to the English file. The language editor validates message markup and placeholders before saving, and rejects a conflicting disk change during the save. Installed catalogue edits also hot-reload.

Changing `general.language` to a downloadable locale applies it after installation. Set it back to `en_US` to restore English through hot reload; downloaded catalogues remain installed.

[Language controls](/languages) · [History and records](/static/05-history-records) · [Dashboard and privacy](/static/07-dashboard-privacy)
