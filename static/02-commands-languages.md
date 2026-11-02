---
title: Static - Commands and languages
description: Player commands, operator tools, and translations
published: true
date: 2026-11-02T00:00:00.000Z
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
| `/static language update` | `static.config` or `volmit.language.admin` |
| `/static participation [period] [offset]` | `static.participation` |
| `/static moduletop <module> <stat>` | `static.modules` and `static.modules.others` |
| `/static status` | `static.status` |
| `/static debug version` | `static.debug` |
| `/static debug dump [upload=false]` | `static.debug` |

`/static version` is a hidden alias for `/static debug version`. Dumps stay local unless `upload=true` is supplied and `debug.uploadEnabled` permits it. `/static config` opens the settings and language editors; stable disk edits apply through hot reload. There is no separate reload command.

`static.admin` grants the listed permissions, including `static.privacy.bypass`, which lets administrators inspect private profiles. All operator permissions default to operators. `static.update` receives release notifications; the shared `volmit.update` permission is also accepted.

## Languages

English is generated from the built-in catalogue into `languages/en_US.toml`, and new built-in keys merge into that file without changing your edits. Deleting it regenerates it. Personal selections live in `languages/language-preferences.properties`; `general.language` supplies the server default and accepts any locale id of 2 to 32 letters, digits, `_`, or `-`.

The 17 translations are German (`de_DE`), Spanish (`es_ES`), Finnish (`fi_FI`), French (`fr_FR`), Hebrew (`he_IL`), Italian (`it_IT`), Japanese (`ja-JP`), Korean (`ko_KR`), Lithuanian (`lt_LT`), Dutch (`nl_NL`), Polish (`pl_PL`), Portuguese (`pt_PT`), Russian (`ru_RU`), Turkish (`tr_TR`), Vietnamese (`vi_VI`), Simplified Chinese (`zh_CN`), and Traditional Chinese (`zh_TW`).

They live in `src/main/resources/languages/` on the `master` branch of the `VolmitSoftware/Static` repository and install when first selected. Startup and `/static language update` check that branch in the background, at most once every five minutes. When it has moved, Static downloads each installed repository locale and merges it into the local file: keys you edited stay as you wrote them, unedited keys take the repository's text, and new keys are added. If the repository cannot be reached, the check logs one failure and installed languages stay active.

| Path under `languages/` | Purpose |
|---|---|
| `<locale>.toml` | Editable messages for one locale |
| `.upstream/` | Static's record of the last download for each repository locale, the English reference, and `upstream.properties` (repository, branch, revision, last check). Do not edit it; hot reload ignores it. |
| `language-preferences.properties` | Saved player choices |

Any other `languages/<id>.toml` is a custom locale. Its id may use letters, digits, `_`, and `-`, from 2 to 32 characters. It appears in the pickers and editor, and repository updates never change it. Setting `general.language` to an unknown id creates that file from the English reference. An optional `[meta]` table names the locale and chooses a base locale:

```toml
[meta]
name = "Pirate Speak"
base = "de_DE"
```

`name` is the picker label. `base` names another installed locale that fills in missing keys before English. Place `[meta]` after the top-level keys.

A missing or invalid message falls back to its `base` chain and then to built-in English. It does not inherit another player's language, the server's translated catalogue, or edits to the English file. The language editor validates message markup and placeholders before saving, and rejects a conflicting disk change during the save. Installed catalogue edits also hot-reload.

Setting `general.language` to a repository locale that is not installed applies your other settings at once, keeps English active, and switches to the locale after it installs. Set it back to `en_US` to restore English through hot reload; installed catalogues remain on disk. Deleting the active repository locale downloads it again.

[Language controls](/languages) · [History and records](/static/05-history-records) · [Dashboard and privacy](/static/07-dashboard-privacy)
