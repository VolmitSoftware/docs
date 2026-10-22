---
title: "ByteCompanions: Commands and permissions"
description: "The /bytecompanions command tree, every permission node, and the shared /volmit plugins line"
published: true
date: 2026-10-15T00:00:00.000Z
tags: "bytecompanions, commands, permissions"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

The command root is `/bytecompanions`. `/companions` and `/bc` are aliases. Running it without arguments shows the help page for the commands the sender may use. There is no reload command: saving a file applies it, see [Configuration](/bytecompanions/03-configuration#hot-reload).

## Commands

| Command | What it does | Run from |
|---|---|---|
| `/bytecompanions [help] [page]` | Shows help, one page at a time | Console or player |
| `/bytecompanions status` | Shows the configuration line, runtime counts, features and storage, integrations, and compatibility | Console or player |
| `/bytecompanions config` | Opens the in-game configuration editor | Player |
| `/bytecompanions language` | Opens the shared language picker | Console or player |
| `/bytecompanions language self <locale\|reset>` | Chooses or clears your personal language | Player |
| `/bytecompanions language server <locale>` | Changes the server default language | Console or player |
| `/bytecompanions language server edit [locale]` | Opens the in-game message editor | Player |
| `/bytecompanions debug version` | Shows the installed version | Console or player |
| `/bytecompanions debug dump [upload=true]` | Writes a diagnostic report and uploads it when allowed | Console or player |
| `/bytecompanions menu [companion]` | Opens the named dashboard; without an ID, the only equipped companion's dashboard, otherwise the collection | Player |
| `/bytecompanions collection` | Opens the collection with favorite, access, and category filters | Player |
| `/bytecompanions outfits` | Opens saved outfits | Player |
| `/bytecompanions interact <pet\|wave\|sit\|stay\|call> [companion]` | Acts on an equipped companion; the ID is required when more than one is equipped | Player |
| `/bytecompanions edit [companion]` | Opens Companion Studio for a definition, or resumes your draft | Player |
| `/bytecompanions setup` | Opens the starter setup menu | Player |
| `/bytecompanions spawn <companion>` | Equips a companion | Player |
| `/bytecompanions despawn [companion]` | Removes the named companion, or every equipped companion | Player |
| `/bytecompanions settings [visibility\|particles] [value]` | Opens viewer settings, or sets one directly: `visibility all\|own\|none`, `particles full\|reduced\|off` | Player |
| `/bytecompanions particles menu <companion>` | Opens the particle menu for an equipped companion | Player |
| `/bytecompanions particles equip <companion> <effect>` | Selects a particle effect for an equipped companion | Player |
| `/bytecompanions particles unequip [companion]` | Removes one companion's effect, or every selected effect | Player |
| `/bytecompanions upgrades <companion>` | Opens the upgrade tracks of a companion | Player |
| `/bytecompanions boosts` | Opens personal and server boosters | Player |
| `/bytecompanions progression give <player> <companion> <xp>` | Grants whole companion XP to an online, loaded player | Console or player |
| `/bytecompanions booster give <player> <booster> <count>` | Grants booster credits to an online, loaded player | Console or player |
| `/bytecompanions booster start <booster>` | Starts or queues a `SERVER` booster without a purchase | Console or player |
| `/bytecompanions booster cancel <activation>` | Cancels a personal or server activation by its ID | Console or player |
| `/bytecompanions transactions list` | Lists purchases waiting for review | Console or player |
| `/bytecompanions transactions resolve <transaction> <grant\|cancel>` | Settles a reviewed purchase without charging or refunding | Console or player |
{.dense}

`/bytecompanions version` is the same as `debug version` and hidden from help. Arguments also work in `name=value` form, for example `/bytecompanions spawn companion=bee`.

The `particles` commands exist only while `features.particles` is on. `upgrades` and `progression` exist only while `features.progression` is on, `boosts` and `booster` only while `features.boosters` is on, and `transactions` while either is on. A disabled route disappears from help and tab completion; running it anyway reports that the feature is disabled.

Help is a Director page with a fixed number of entries per page, sorted by name and filtered to the sender's permissions. `/bytecompanions help 2` opens the second page; players get clickable entries and console gets plain lines.

## Permissions

`Everyone` means the node defaults to `true`, `Operators` means `op`. `Unset` nodes are not declared in `plugin.yml` and must be granted explicitly.

| Permission | Default | Allows |
|---|---|---|
| `bytecompanions.command` | Everyone | Help, status, and version |
| `bytecompanions.config` | Operators | The configuration editor, the server language, and the message editor |
| `bytecompanions.language.self` | Everyone | Choosing a personal language, together with `volmit.language.self` |
| `bytecompanions.debug` | Operators | Writing and uploading diagnostic reports |
| `bytecompanions.update` | Operators | Update notices on join and this plugin's entry in the shared update report |
| `bytecompanions.command.menu` | Everyone | The collection and dashboards |
| `bytecompanions.command.spawn` | Everyone | Equipping companions the player has access to |
| `bytecompanions.command.despawn` | Everyone | Removing equipped companions |
| `bytecompanions.command.settings` | Everyone | Viewer settings; does not need the menu node |
| `bytecompanions.command.outfits` | Everyone | Saving and wearing outfits; also needs the menu node |
| `bytecompanions.command.personalize` | Everyone | Personal names, variants, and formations; also needs the menu node and access to the companion |
| `bytecompanions.command.interact` | Everyone | Pet, wave, sit, stay, and call; also needs the menu node |
| `bytecompanions.command.trial` | Everyone | Private trials of companions, including locked ones; also needs the menu node |
| `bytecompanions.command.particles.menu` | Everyone | The particle selection menu |
| `bytecompanions.command.particles.equip` | Everyone | Selecting particle effects the player has access to |
| `bytecompanions.command.particles.unequip` | Everyone | Removing selected particle effects |
| `bytecompanions.command.upgrades` | Everyone | Browsing and buying upgrades; also needs the menu node |
| `bytecompanions.command.boosts` | Everyone | Browsing boosters; also needs the menu node |
| `bytecompanions.command.booster.start` | Everyone | Starting an owned booster activation |
| `bytecompanions.command.booster.cancel` | Everyone | Cancelling an owned booster activation |
| `bytecompanions.command.edit` | Operators | Companion Studio and private previews |
| `bytecompanions.command.setup` | Operators | Installing missing starters and applying a profile |
| `bytecompanions.command.progression.give` | Operators | Granting companion XP |
| `bytecompanions.command.booster.give` | Operators | Granting booster credits |
| `bytecompanions.command.transactions.list` | Operators | Listing unresolved purchases |
| `bytecompanions.command.transactions.resolve` | Operators | Settling unresolved purchases |
| `bytecompanions.companion.<id>` | Unset | Equipping, upgrading, and counting one companion as owned |
| `bytecompanions.particle.<id>` | Unset | Selecting one particle effect |
| `bytecompanions.variant.<companion>.<variant>` | Unset | Choosing one configured variant |
| `bytecompanions.booster.<id>` | Unset | Buying and activating one booster |
| `volmit.language.self` | Everyone | Shared node also required for a personal language |
| `volmit.language.admin` | Operators | Server language and message editing across Volmit plugins |
| `volmit.update` | Operators | The shared update report for every participating plugin |

A player who should use the `bee` companion through the dashboard needs `bytecompanions.command.menu`, `bytecompanions.command.spawn`, `bytecompanions.command.despawn`, and `bytecompanions.companion.bee`. To also pick the Angel Ring effect, add the three `particles` nodes and `bytecompanions.particle.angel_ring_effect`.

See [Languages](/languages) for the language subcommands and their permissions.

## Shared Volmit commands

`/volmit plugins` lists the enabled Volmit plugins. `/volmit plugins languages [locale]` changes the server default for all of them, `/volmit plugins debug` writes a combined report, and `/volmit plugins updates` shows the release report. ByteCompanions takes part when it is enabled.

## Related pages

- [Configuration *The settings behind `config`*](/bytecompanions/03-configuration)
- [Companions and collections *What the player menus do*](/bytecompanions/05-companions-and-collections)
- [Progression and boosters *The administrative progression commands*](/bytecompanions/07-progression-and-boosters)
- [Shared language controls *Picker, permissions, and editor*](/languages)
{.links-list}
