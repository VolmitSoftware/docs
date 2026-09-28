---
title: "Commands & Permissions"
description: "Adapt command syntax, effects, and permission nodes"
published: true
date: 2026-09-28T22:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

`/adapt` covers menus, progression, configuration, and player data. Command routes need `adapt.main`, except personal language selection and diagnostic reports.

`/adapt language` opens the picker. Permissions and locales: [Localization](/adapt/07-localization) and [Languages](/languages).

`/adapt debug dump` writes `debug/` and uploads to mclo.gs. `upload=false` keeps the file local. Permission `adapt.debugdump` (default op). An upload failure keeps the local file. Report contents: [Shared diagnostic reports](/volmlib/api/diagnostics).

## Commands

| Command | Permission | Purpose |
|---|---|---|
| `/adapt gui [target=main] [player] [force=false]` | `adapt.gui` | Open an Adapt menu |
| `/adapt debug version` | `adapt.main` | Show the installed plugin version |
| `/adapt debug dump [upload=true]` | `adapt.debugdump` | Save a diagnostic report, uploading by default |
| `/adapt effects [enabled=toggle]` | `adapt.effects` | Toggle your particles and sounds |
| `/adapt configure` | `adapt.configurator` | Open the configuration menu |
| `/adapt boost [seconds=10] [multiplier=10] [player]` | `adapt.boost` | Add a temporary player XP multiplier |
| `/adapt global-boost [seconds=10] [multiplier=10]` | `adapt.boost.global` | Add a temporary server XP multiplier |
| `/adapt experience <skill> [amount=10] [player]` | `adapt.cheatitem` | Give an XP orb item |
| `/adapt knowledge <skill> [amount=10] [player]` | `adapt.cheatitem` | Give a knowledge orb item |
| `/adapt claim-skill <skill> <level> [player]` | `adapt.determine` | Set a skill to level 0–100 |
| `/adapt claim-adaptation <skill:adaptation> <level> [force=false] [player]` | `adapt.determine` | Set an adaptation level |

Boosts stack. The final XP multiplier is limited to `0.01`–`1000`.

## Clearing data

| Command | Effect |
|---|---|
| `/adapt clear xp [player]` | Clear skill XP and learned adaptations |
| `/adapt clear knowledge [player]` | Clear knowledge |
| `/adapt clear adaptations [player]` | Clear learned adaptations |
| `/adapt clear stats [player]` | Clear recorded stats |
| `/adapt clear discoveries [player]` | Clear discovery data |
| `/adapt clear all [player]` | Clear the complete Adapt profile |
| `/adapt reset confirm [player]` | Permanently reset an online or offline profile after a second confirmation within 30 seconds |

These commands require `adapt.clear`. `clear` targets online players; `reset confirm` also accepts offline players.

## Configuration

| Command | Permission | Purpose |
|---|---|---|
| `/adapt default skill <skill>` | `adapt.configurator` | Restore one skill config |
| `/adapt default adaptation <skill:adaptation>` | `adapt.configurator` | Restore one adaptation config |
| `/adapt default all` | `adapt.configurator` | Archive and restore all Adapt configs |

## Permissions

Most command permissions default to operators. `adapt.effects`, `adapt.language.self`, and `volmit.language.self` are available to players by default.

| Permission | Purpose |
|---|---|
| `adapt.main` | Use `/adapt` |
| `adapt.language.self` | Choose or reset your Adapt language; also requires `volmit.language.self` |
| `volmit.language.self` | Shared requirement for personal language selection |
| `adapt.gui` | Open menus by command |
| `adapt.configurator` | Edit or restore configs |
| `adapt.boost` / `adapt.boost.global` | Apply XP boosts |
| `adapt.cheatitem` | Give XP and knowledge orbs |
| `adapt.determine` | Set skills and adaptations |
| `adapt.clear` | Clear or reset profiles |
| `adapt.effects` | Toggle personal effects |
| `adapt.debug` | Use debug mode |
| `adapt.debugdump` | Save and optionally upload diagnostic reports; default `op` |

Gameplay access uses `adapt.use.<skill>` and `adapt.use.<adaptation>`. These are allowed unless explicitly denied. Operators bypass them.
