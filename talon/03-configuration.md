---
title: "Talon: Configuration"
description: "Settings, editor controls, and automatic reload behavior"
published: true
date: 2026-10-25T07:15:44.815Z
tags: "talon, configuration"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Edit `plugins/Talon/config.toml` or open `/talon config` with `talon.config`. Choose another document with `/talon config abilities`, `acquisition`, `harvest`, or `progression`; `/talon abilities` also opens the ability editor. In the tables, `section.key` means `key` inside the TOML `[section]`. Settings use camel-case names.

## General

| Setting | Default | What it changes |
|---|---|---|
| `general.enabled` | `true` | Enable abilities; stored tool data remains when disabled |
| `general.language` | `en_US` | Server language used without a personal choice |
| `general.updateNotifications` | `true` | Check releases when the build has a published repository configured |

## Metrics

| Setting | Default | What it changes |
|---|---|---|
| `metrics.enabled` | `true` | Allow bStats reporting; service ID `0` prevents submission |

## Presentation

| Setting | Default | What it changes |
|---|---|---|
| `presentation.splashScreen` | `true` | Print the startup splash |
| `presentation.alternateSplashes` | `true` | Allow seasonal startup taglines |
| `presentation.commandSounds` | `true` | Play success or failure feedback for configuration saves |

## Hot reload

| Setting | Default | What it changes |
|---|---|---|
| `hotReload.enabled` | `true` | Watch the config and installed language files |
| `hotReload.pollIntervalMillis` | `1000` | File-check interval, 250 through 60000 milliseconds |
| `hotReload.cooldownMillis` | `1500` | Wait for edits to settle, 250 through 60000 milliseconds |
| `hotReload.notifyOperators` | `true` | Send an action-bar notice to players with `talon.config` after a reload |

## Debug

| Setting | Default | What it changes |
|---|---|---|
| `debug.uploadEnabled` | `false` | Permit an explicitly requested public report upload |

## Mining

| Setting | Default | What it changes |
|---|---|---|
| `mining.maxBlocksPerAction` | `64` | Cap extra breaks per action, 1 through 128; ability level may impose a lower limit |
| `mining.blocksPerTick` | `8` | Candidate blocks checked per tick, 1 through 16 |
| `mining.cooldownMillis` | `500` | Delay between mining actions, 0 through 60000 milliseconds |
| `mining.sneakToDisable` | `true` | Pause abilities while sneaking |
| `mining.allowCreative` | `false` | Allow abilities in creative as well as survival |
| `mining.deniedWorlds` | `[]` | Exact world names where abilities are disabled |
| `mining.durabilityReserve` | `1` | Durability kept before extra breaks, 0 through 4096; does not protect the original break |
| `mining.groupOreVariants` | `false` | Let Vein Miner join stone and deepslate variants of the same ore |
| `mining.allowedBlocks` | `[]` | Materials, block tags, or state rules; empty allows all otherwise eligible blocks |
| `mining.deniedBlocks` | `[]` | Materials, block tags, or state rules to exclude; deny takes precedence |

Use uppercase material names such as `STONE` or tags such as `#minecraft:coal_ores`. Add lowercase block-state properties in brackets to match particular states: `WHEAT[age=7]` or `OAK_STAIRS[facing=north,half=top]`. A block must match every property in one rule; unspecified properties are unrestricted. Matching any rule in a list is enough. Deny rules take precedence, and a material-only deny excludes every state of that material.

Unknown materials, tags, properties, or values reject the edit and keep the current configuration. A state rule on a tag must be valid for every block in that tag. For mature crops, list `WHEAT[age=7]`, `CARROTS[age=7]`, `POTATOES[age=7]`, and `BEETROOTS[age=3]` separately because their maximum ages differ. Filters do not override the selected ability's own block rules.

## Remote Loot

| Setting | Default | What it changes |
|---|---|---|
| `remoteLoot.enabled` | `true` | Enable drop delivery |
| `remoteLoot.range` | `64` | Maximum container distance, 1 through 256 blocks; ability level also limits range |
| `remoteLoot.blacklist` | `CHEST`, `TRAPPED_CHEST`, `BARREL`, `FURNACE`, `HOPPER` | Item materials left at the drop source |
| `remoteLoot.inventoryCollection` | `true` | Allow player inventory as the delivery destination |
| `remoteLoot.protectionChecks` | `true` | Query WorldGuard, GriefPrevention, and ChestShop before container access; the cancellable access event still applies when disabled |

## Books

| Setting | Default | What it changes |
|---|---|---|
| `books.recipesEnabled` | `true` | Enable ability-book crafting for players with `talon.craft` |

## In-game editor

`abilities.toml` provides a section for each built-in ability. `/talon abilities` opens its editor with `talon.config`. Each ability defaults to enabled, a maximum level of 3, 128 blocks per action, 16 candidates per tick, no additional cooldown, and empty allowed/denied block lists. Ability limits combine with the global limits; the stricter limit applies. The same material, tag, and state-rule syntax works here.

Each ability's `recipes.level1`, `level2`, and `level3` tables contain an `enabled` flag and nine `ingredients` entries in row order. Use item material names, `AIR` for empty slots, and `PREVIOUS_BOOK` for the previous level's book. Upgrade recipes require `PREVIOUS_BOOK` in the centre. The default recipes match the [ability recipes](/talon/05-abilities-recipes).
On Folia, Canvas, and other region-threaded servers, recipes register during server startup. Saved ingredient or shape changes wait for a full server restart. Crafting checks, `/talon recipe`, and book menus keep using the registered ingredients while a restart is pending; the menus show a translated notice. Restoring the configured ingredients to the registered values clears the pending state.

Global enable switches, per-recipe enable flags, ability limits, and crafting permissions apply immediately. On main-thread platforms, changed ingredients register after reload. Reloading unchanged ingredient definitions leaves registrations untouched on every platform. If Talon is enabled after startup on a region-threaded server, book crafting remains unavailable until the server restarts.

The `[patterns]` table enables optional Blast patterns with `tunnelEnabled` and `staircaseEnabled`; both default to `false`.

## Book acquisition

`acquisition.toml` controls optional book sources. All three sources are disabled by default. Each source has `enabled`, `chance` from 0 to 1, `minLevel` and `maxLevel` from 1 to 3, and an `abilities` list containing one to five distinct built-in ability IDs. The default level range is 1–1 and the list includes all five abilities. Disabled abilities are excluded and ability level caps still apply.

| Section | Default chance | Additional settings |
|---|---|---|
| `[loot]` | `0.02` | Native chest loot tables only |
| `[trading]` | `0.05` | `emeraldCost = 16` and `maxUses = 4`, each from 1 to 64 |
| `[enchanting]` | `0.02` | `minimumOfferLevel = 30`, from 1 to 30 |

These sources respect the global enable switch and denied worlds. They do not depend on crafting being enabled. See [abilities and recipes](/talon/05-abilities-recipes) for eligible events and delivery behavior.

## Crop harvesting

`harvest.toml` controls `/talon harvest`. The feature is disabled by default and yields entirely while Verdant is enabled. It requires a Multi Tool III hoe and plain seeds in the player's inventory.

| Setting | Default | Range or effect |
|---|---|---|
| `enabled` | `false` | Enable mature crop harvesting and replanting |
| `radius` | `2` | 1–5 blocks around the aimed crop, at the same height |
| `maxBlocksPerAction` | `32` | 1–128 successful crop breaks |
| `blocksPerTick` | `4` | 1–16 candidate positions checked per tick |
| `cooldownMillis` | `1000` | 0–60000 milliseconds between actions |

Global and Multi Tool limits still apply. The smallest block budgets and largest cooldown win. Global and Multi Tool material filters both apply; lowering Multi Tool's level cap below III disables harvesting. Break and replant protection checks can reject individual crops.

## Paid progression

`progression.toml` enables optional Vault purchases. `enabled` defaults to `false`. `level1Cost`, `level2Cost`, and `level3Cost` default to `250.00`, `1000.00`, and `4000.00`; each accepts a positive price from `0.01` through `1000000000` with at most two decimal places. The selected economy provider must support two decimal places and, on Folia, declare Folia support.

`/talon buy <ability> [level]` buys one book, defaulting to level I. A level II or III purchase also consumes exactly one book of the same ability at the preceding level. Inventory capacity, global restrictions, ability caps, and permissions are checked before payment and again before delivery. See [paid books](/talon/05-abilities-recipes#paid-books) for transaction behavior.

## Editor controls

The editor groups settings by section and includes a Languages entry. Navigation uses Back at the bottom left, paging controls in the bottom row, and Close at the bottom right.

| Control | Action |
|---|---|
| Boolean | Click to toggle |
| Number | Left-click to increase; right-click to decrease |
| Shift with number adjustment | Use ten times the normal step |
| Drop key on a number | Enter an exact value in chat |
| Text or list | Click, then enter a value in chat |
| List input | Enter a TOML array such as `["STONE", "OAK_LOG[axis=y]"]`; use `[]` to clear |
| Cancel | Type `cancel` or wait for the prompt to expire |

Edits validate before saving. Invalid values keep the current settings. Valid editor changes apply immediately, including when file watching is disabled, except recipe ingredient changes that require a server restart on region-threaded servers. If the file changes while an editor is open, reopen the editor before saving.

`/talon set` and server-language changes preserve unrelated settings already saved on disk. A file changed again while an edit is being prepared rejects that save.

## File changes

The watcher monitors `config.toml`, `abilities.toml`, `acquisition.toml`, `harvest.toml`, `progression.toml`, and installed `languages/*.toml` files. Related configuration documents validate and apply together; an invalid document keeps the previous settings active. Invalid personal translations retain their last valid messages; missing message keys use English. Deleting a configuration document restores its defaults on the next reload.

If file watching is disabled, restart after editing files on disk. Splash settings take effect on the next startup. Library coordinates and publication IDs are build settings, not editable server settings.

## Related pages

- [Commands and permissions *Configuration commands*](/talon/02-commands-permissions)
- [Languages *Default and personal languages*](/talon/04-languages)
- [Diagnostics *Upload and telemetry controls*](/talon/07-diagnostics)
{.links-list}
