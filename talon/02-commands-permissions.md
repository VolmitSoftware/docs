---
title: "Talon: Commands and permissions"
description: "Player controls, administration, and access defaults"
published: true
date: 2026-10-25T07:15:44.815Z
tags: "talon, commands, permissions"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Use `/talon` or `/tl` to open the Director help menu. Help shows the command tree and paginates longer lists with clickable navigation.

## Commands

`<required>` arguments must be supplied; `[optional]` arguments have defaults.

| Command | What it does | Run from |
|---|---|---|
| `/talon` | Show help | Player or console |
| `/talon status` | Show runtime details and ability counters | Player or console |
| `/talon version` | Hidden alias for `debug version` | Player or console |
| `/talon books` | Open the book catalog, or list abilities in console | Player or console |
| `/talon recipe <ability> [level]` | Describe a recipe; level defaults to 1 | Player or console |
| `/talon buy <ability> [level]` | Buy one book; level defaults to 1, and higher levels consume one previous-level book | Player |
| `/talon inspect` | Inspect the held tool | Player |
| `/talon preview` | Preview the held tool's mining area and estimated durability use | Player |
| `/talon harvest` | Harvest nearby mature crops and replant from inventory seeds | Player |
| `/talon toggle` | Enable or pause the held tool | Player |
| `/talon glint <enabled>` | Enable ability glint with `true`, or restore the tool's original appearance with `false` | Player |
| `/talon mode` | Cycle the held tool's mining mode | Player |
| `/talon pattern <mode>` | Select an available mining mode directly | Player |
| `/talon activation <mode>` | Save a personal activation preference | Player |
| `/talon loot <inventory\|container>` | Choose the held tool's loot destination | Player |
| `/talon unlink` | Remove the held tool's container link | Player |
| `/talon give <player> <ability> [level] [amount]` | Give an online player books; level and amount default to 1 | Player or console |
| `/talon config [section]` | Open `main`, `abilities`, `acquisition`, `harvest`, or `progression`; defaults to `main` | Player |
| `/talon abilities` | Edit per-ability limits, recipes, and optional patterns | Player |
| `/talon set <setting> <value>` | Validate, save, and apply a configuration setting | Player or console |
| `/talon language` | Open language controls | Player or console |
| `/talon debug` | Show diagnostic command help | Player or console |
| `/talon debug version` | Show the installed version | Player or console |
| `/talon debug dump [upload=true]` | Save a local report; upload only when explicitly requested and enabled | Player or console |
{.dense}

Ability IDs are `multi_tool`, `remote_loot`, `blast`, `vein_miner`, and `excavation`. Book levels are 1 through 3, and grants accept 1 through 64 books.

Configuration and language edits reload automatically. Recipe ingredient changes on region-threaded servers require a server restart; see [Configuration](/talon/03-configuration). There is no plugin reload command. Shared language subcommands and editor controls are covered by the [language guide](/languages).

## Permissions

Everyone means `true`; Operators means `op`. All command paths also require `talon.command`.

| Permission | Default | Allows |
|---|---|---|
| `talon.command` | Everyone | Basic help, status, and version |
| `talon.language.self` | Everyone | Personal language selection |
| `talon.use` | Everyone | Apply books and control tool abilities and glint |
| `talon.books` | Everyone | Book catalog and recipe descriptions |
| `talon.craft` | Everyone | Craft ability books |
| `talon.buy` | Everyone | Purchase books when paid progression is enabled |
| `talon.ability.<ability>.use` | Everyone | Use the named ability, alongside `talon.use` |
| `talon.ability.<ability>.craft` | Everyone | Craft the named ability's books, alongside `talon.craft` |
| `talon.pattern.tunnel` | Everyone | Select the tunnel pattern when enabled |
| `talon.pattern.staircase` | Everyone | Select staircase patterns when enabled |
| `talon.harvest` | Everyone | Use optional crop harvesting with a Multi Tool III hoe |
| `talon.give` | Operators | Give ability books |
| `talon.config` | Operators | Configuration and server-language editing |
| `talon.debug` | Operators | Diagnostic report creation |
| `talon.update` | Operators | Update notifications |
| `talon.admin` | Operators | All Talon permissions above |

## Related pages

- [Configuration *Setting names and defaults*](/talon/03-configuration)
- [Languages *Personal language choices*](/talon/04-languages)
- [Diagnostics *Status and report contents*](/talon/07-diagnostics)
{.links-list}
