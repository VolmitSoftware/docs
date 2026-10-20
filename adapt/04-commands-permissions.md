---
title: "Commands & Permissions"
description: "Adapt command syntax, effects, and permission nodes"
published: true
date: 2026-10-20T08:42:00.000Z
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

`force=true` on `claim-adaptation` skips power, knowledge, and permanence checks but never prerequisites: a level whose `requires` entries the player has not met is always refused. Lowering an adaptation that another learned adaptation requires is refused unless `force=true`; a forced change also removes the adaptations whose requirement it breaks, then any that required those.

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

Clearing learned adaptations dismisses Skeletal Servants and bound bone golems and restores their reserved maximum health. Bound bone golems return their cores, runes, and supplied equipment as described under [Bone Frame](/adapt/34-skill-golemancy#bone-frame-golem-bone-frame).

## Configuration

| Command | Permission | Purpose |
|---|---|---|
| `/adapt default skill <skill>` | `adapt.configurator` | Restore one skill config |
| `/adapt default adaptation <skill:adaptation>` | `adapt.configurator` | Restore one adaptation config |
| `/adapt default all` | `adapt.configurator` | Archive and restore all Adapt configs |

## Golems

| Command | Permission | Purpose |
|---|---|---|
| `/adapt golem roster` | `adapt.main` | Open your golem roster while Golemancy is enabled |
| `/adapt golem list [player]` | `adapt.golemancy.admin` | List a player's golems with their ids, states, and last known positions |
| `/adapt golem release <id> [player]` | `adapt.golemancy.admin` | Release one of a player's golems |
| `/adapt golem wake [player]` | `adapt.golemancy.admin` | Recheck a player's loaded golems and wake the ones that can wake |
| `/adapt golem give <item> [amount=1] [player]` | `adapt.golemancy.admin` | Give a player Golemancy items for testing; players need Adapt debug mode on |

The admin commands default to you. `list` also reads an offline player's roster without changing it; `release`, `wake`, and `give` need the player online. `id` is a golem id from `/adapt golem list`, or enough of its first characters to match exactly one of that player's golems. Releasing a loaded golem works like its owner's Release: it becomes an ordinary golem, drops its cores, runes, Masterwork Heart, and carried items, and returns its stored essence as experience. A missing, packed, or shattered golem leaves the roster at once: a released missing golem's body turns ordinary without drops if it shows up later, and a Dormant Golem or Shattered Core crumbles the next time it is used. An active golem that is not loaded is refused; release it once its chunk is loaded or it shows as missing. Waking never lifts `serverMaxActiveGolems`; golems beyond it stay asleep until room frees. See [Skill - Golemancy](/adapt/34-skill-golemancy).

`give` hands out Golemancy items for testing. `item` is one of these ids, and tab completion lists them:

| Id | Item |
|---|---|
| `crook` | Artificer's Crook |
| `blank_core`, `core/<role>` | Blank Animus Core, and the core of a role: `guardian`, `gatherer`, `harvester`, `lumber`, `breaker`, `rancher`, `sorter`, or `angler` |
| `blank_node`, `node/<type>` | Blank Node, and the node of a type: `guard`, `collection`, `deposit`, `harvest`, `lumber`, `breaker`, `pasture`, `input`, `filter`, or `fishing` |
| `blank_rune`, `rune/<aspect>/<tier>` | Blank Rune, and the rune of an aspect (`swiftness`, `might`, `ember`, `tide`, `order`, `entropy`, or `bulwark`) at tier 1, 2, or 3 |
| `masterwork_heart` | Masterwork Heart |
| `all` | One of every item above, with runes at every tier |

`amount` is 1 to 64 and defaults to 1; values outside that range are clamped. An item that stacks to fewer than `amount`, such as the Crook, arrives as that many separate items. `all` always gives one of each and ignores `amount`. Items that do not fit in the inventory drop at the player's feet. A Dormant Golem or Shattered Core belongs to the golem's owner and needs a golem id, so `give` does not offer them. A player runs `give` only with Adapt debug mode on, toggled by `/adapt debug mode` (permission `adapt.debug`); otherwise the command refuses and names that command. The console needs no debug mode and must name a player.

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
| `adapt.golemancy.admin` | List, release, and wake other players' golems, and give Golemancy items |
| `adapt.effects` | Toggle personal effects |
| `adapt.debug` | Use debug mode |
| `adapt.debugdump` | Save and optionally upload diagnostic reports; default `op` |
| `adapt.update` | Receive Adapt update notices and see Adapt in `/volmit plugins updates`; default `op`. See [Update notifications](/volmlib/api/github-releases) |

Gameplay access uses `adapt.use.<skill>` and `adapt.use.<adaptation>`. These are allowed unless explicitly denied. Operators bypass them.

## Update notifications

`/volmit plugins updates` checks registered Volmit plugins and shows installed/latest versions, release links, disabled checks, and failures in the shared Director menu. Operators, players with `volmit.update`, or players with `adapt.update` can see Adapt updates; the plugin permission defaults to `op`.

When `autoUpdateCheck` is enabled (the default), joining eligible players receive one combined notice for registered plugins with newer stable GitHub releases. Checks run asynchronously with shared caching and retry limits. Nothing is downloaded or installed. The shared report uses English; the existing language picker and message editor continue to control plugin-specific messages. See [Shared GitHub update checks](/volmlib/api/github-releases).
