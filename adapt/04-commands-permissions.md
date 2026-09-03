---
title: "Commands & Permissions"
description: "Adapt documentation: Commands & Permissions"
published: true
date: 2026-09-03T07:33:50.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Use `/adapt` for menus, progression, configuration, and player-data administration. Other root command routes require `adapt.main`; personal language selection and diagnostic reports have their own permissions.

## Language selection

`/adapt language` opens the clickable picker. Personal language selection requires both `adapt.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. `/adapt language self <locale|reset>` selects a personal language; `/adapt language server <locale>` changes the default with `adapt.configurator` or `volmit.language.admin`.

`/adapt language server edit [locale]` opens the player inventory editor for individual messages. Omit the locale to choose one. It requires `adapt.configurator` or `volmit.language.admin`, saves only the chosen locale, and preserves all language selections.

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change. See [07 - Localization](/adapt/07-localization).

## Diagnostic reports

`/adapt debugdump` saves a diagnostic report and uploads it to the public mclo.gs service by default. Use `/adapt debugdump upload=false` to save it locally without uploading. The command requires `adapt.debugdump` (default `op`), independently of the root administration permission.

Reports are written atomically under the plugin data folder's `debug/` directory before upload. An upload failure retains the local file. Players receive controls to copy the relative report path and open or copy the upload link; console receives plain text. See [Shared diagnostic reports](/volmlib/api/diagnostics) for report contents.

## Common commands

| Command | Permission | Purpose |
|---|---|---|
| `/adapt gui [target=main] [player] [force=false]` | `adapt.gui` | Open an Adapt menu |
| `/adapt debugdump [upload=true]` | `adapt.debugdump` | Save a diagnostic report, uploading by default |
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

## Configuration and mutations

| Command | Permission | Purpose |
|---|---|---|
| `/adapt default skill <skill>` | `adapt.configurator` | Restore one skill config |
| `/adapt default adaptation <skill:adaptation>` | `adapt.configurator` | Restore one adaptation config |
| `/adapt default all` | `adapt.configurator` | Archive and restore all Adapt configs |
| `/adapt mutations menu` | `adapt.mutations` | Open your mutation menu |
| `/adapt mutations cooperative [on|off|toggle]` | `adapt.mutations` | Change your group-effect preference |
| `/adapt mutations view [player]` | self: `adapt.mutations`; others: `adapt.mutations.admin` | View a mutation loadout |
| `/adapt mutations equip <mutation> <1|2> [player]` | `adapt.mutations.admin` | Force a mutation into a slot |
| `/adapt mutations clear <1|2> [player]` | `adapt.mutations.admin` | Clear a mutation slot |
| `/adapt mutations reset [player]` | `adapt.mutations.admin` | Reset mutation data |
| `/adapt mutations reload` | `adapt.mutations.admin` | Reload mutation settings |

## Permissions

Most command permissions default to operators. `adapt.effects`, `adapt.mutations`, `adapt.language.self`, and `volmit.language.self` are available to players by default.

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
| `adapt.mutations` | Manage your mutations |
| `adapt.mutations.admin` | Manage other players' mutations |
| `adapt.debug` | Use debug mode |
| `adapt.debugdump` | Save and optionally upload diagnostic reports; default `op` |

Gameplay access uses `adapt.use.<skill>`, `adapt.use.<adaptation>`, and `adapt.use.mutation.<id>`. These are allowed unless explicitly denied. Operators bypass them.

See [Player Usage](/adapt/03-player-usage), [Configuration](/adapt/01-installation-configuration), and [Mutations](/adapt/34-mutations-overview).
