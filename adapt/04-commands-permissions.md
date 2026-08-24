---
title: "Commands & Permissions"
description: "Adapt documentation: Commands & Permissions"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt registers exactly one Bukkit command, `/adapt`. Everything else is a subcommand of it. Before any routing happens, the dispatcher checks `adapt.main`. A sender without that node gets a permission message and nothing else, including no help text. Once past that gate, each subcommand checks its own permission node on top.

Almost every node defaults to op. The exceptions are `adapt.effects` and `adapt.mutations`. Those default to true so ordinary players can toggle their own visuals and manage their own mutations. The whole dynamically registered `adapt.use.*` family controls gameplay rather than commands. Holding a default-true node still does not get anyone past `adapt.main`.

`/adapt help`, `/adapt ?`, and any partial path render a paginated tree of subcommands and their parameters. Player help uses the shared 19-line panel: up to 17 entries at the root, or 16 inside a subtree where one line is reserved for Back. Shorter trees print every entry without padding; console help remains a flat, unpaginated listing. Tab completion for skill and adaptation arguments only offers components that are currently enabled. Console can run most subcommands but has no implicit "you". It refuses wherever a handler needs a player and you did not name one. The player-only subcommands are `/adapt effects`, `/adapt configure`, `/adapt mutations menu`, `/adapt mutations cooperative`, `/adapt debug particle`, and `/adapt debug sound`.

Every command that reads or changes an online target requires that target's current Adapt runtime to be ready. If their profile is still loading, failed safe validation, or lost its SQL fence, the command reports that Adapt is unavailable and changes nothing. It never creates an empty or unfenced wrapper as a command fallback.

## Giving progression

`/adapt boost` gives one player a temporary additive XP multiplier. `/adapt global-boost` does it for the whole server. Both require a positive duration and a finite multiplier from `-0.99` through `999`; invalid or overflowing input is rejected. Active boosts add together, the final XP multiplier is clamped to `0.01` through `1000`, and every boost expires on its own.

`/adapt experience` and `/adapt knowledge` grant nothing directly. They put a snowball orb in the target's inventory that pays out when thrown. The skill argument takes a skill name, `all` for an orb covering every registered skill, or `random`. Both need `adapt.cheatitem`.

`/adapt determine` runs a learn or unlearn exactly as if the player did it in the menu. A `force` flag skips costs and restrictions. `/adapt claim-adaptation` is the higher-level version. Give it a target level. It works out the direction and runs the learning transaction. It names the reason when it fails. The reason can be power, knowledge, funds, or a permanent adaptation it may not lower. `/adapt claim-skill` sets a skill line's level directly by writing the XP for that level. All three need `adapt.determine`. Both claim commands reject a level outside 0 to 100 before doing anything.

## Opening menus for someone

`/adapt gui` opens the Adapt UI for yourself or a named player, targeting `main`, `skill:<name>`, or `adaptation:<name>`. Passing `force=true` skips that component's `adapt.use` check but never its enabled state, so a disabled skill or adaptation still refuses to open. The `main` target opens the root skills menu without any of those checks.

`/adapt configure` opens the config editor in a menu and needs `adapt.configurator` or op. `/adapt effects` toggles your own Adapt particles and sounds. It accepts `on`, `true`, `yes`, `enabled` and their opposites. It toggles when given nothing.

## Wiping player data

There are two tools here and they are not interchangeable.

`/adapt clear` is surgical and works on online players only. Each subcommand wipes one slice: XP, knowledge, adaptations, the stats map, discovery data, or all of the above. Clearing XP is heavier than the name suggests. It also empties every skill line's adaptations, resets the anti-farm pressure state, and resets master XP and the Inspired skill. Mutation data survives it. `/adapt mutations reset` is the way to wipe only that. There is no standalone clear for advancements or wisdom. `/adapt clear all` is the only path to those.

Commands that mutate an online target run on that player's owning scheduler. If the player retires before Folia accepts the task, Adapt reports the rejected operation instead of claiming success; a confirmed full reset also restores its confirmation window so it can be retried.

`/adapt reset confirm` is the full delete and accepts offline targets. Run it once to get the warning. Then run it again with the same target within 30 seconds. When the target is online on the initiating backend, both local JSON and SQL mode replace the profile live in place; SQL rotates and adopts the new fence before activating the empty profile. Attribute modifiers are unlearned. The mutation loadout dissolves. Adaptation recipes are un-discovered. The empty profile is saved immediately. Neither path kicks the Minecraft player. An offline target has their stored data purged instead. A different backend that receives the SQL reset notice retires its older Adapt runtime and requires reconnect, as described in [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server). Both commands need `adapt.clear`.

## Resetting configs

`/adapt default skill`, `/adapt default adaptation`, and `/adapt default all` delete the relevant TOML, regenerate it from defaults, and reconcile mutations for online players. `default all` archives what it deletes first. These need `adapt.configurator`. See [01 - Installation & Configuration](/adapt/01-installation-configuration) for what `default all` does and does not touch.

## Developer tools

`/adapt debug` (alias `dev`) holds the tools you should not hand out. `/adapt debug mode` reveals every skill and adaptation regardless of progression. It makes learning free and uncapped, by short-circuit of the power budget, the knowledge spend, and the over-budget pruner. It uses `adapt.debug`.

Everything else under `debug` sits behind `adapt.idontknowwhatimdoingiswear`. `verbose` flips diagnostic logging in memory without writing the config file. `pap` and `psp` print the generated `adapt.use` nodes for adaptations and skills to the console. `particle` and `sound` fire one at your feet for testing. `perf` prints ability-check rates, cache hit ratio, the rolling 60-second guard-check timing cost and budget, and the top ticker hotspots. It can reset those counters afterwards.

## Mutations

`/adapt mutations menu` opens the mutation UI. `/adapt mutations cooperative` sets your own opt-in for group effects. Both are player-only and need `adapt.mutations`. `/adapt mutations view` shows a snapshot. Viewing yourself needs `adapt.mutations`. Viewing anyone else needs `adapt.mutations.admin`.

Everything else is admin-only. Admins can force a mutation into a slot or clear a slot. They can mark a mutation discovered or not. They can clear the switch and combat cooldowns. They can reconcile a player against current requirements. They can force a slot's unlock state. They can wipe only mutation data. They can force perfect adaptation on or off. They can reload `mutations.toml`. Several still work while the feature is disabled. They will tell you the choice was saved but is not active.

## How use permissions work

Adapt registers a permission node per skill, per adaptation, and per mutation type once skills have loaded. These control gameplay, not commands. An unset node counts as granted. The check tests whether the node is explicitly set before it looks at the value. Removal of a node from a permission plugin denies nothing. You have to set it to false. Ops and anyone in debug mode bypass the check entirely.

If you turn on `permissionXpMultipliers`, those nodes are registered too. Unlike the use nodes they default to false.

## Reference

### Root

| Property | Value |
|---|---|
| Command | `/adapt` |
| Declared in | `plugin.yml` (no aliases) |
| Dispatcher gate | `adapt.main` |
| Nested roots | `clear`, `reset`, `default`, `debug` (alias `dev`), `mutations` |
| Handler classes | `CommandSVC`, `CommandAdapt` |

### `CommandAdapt` subcommands

| Syntax | Origin | Permission |
|---|---|---|
| `/adapt boost [seconds=10] [multiplier=10] [player]` | both | `adapt.boost` |
| `/adapt global-boost [seconds=10] [multiplier=10]` | both | `adapt.boost.global` |
| `/adapt gui [target=main] [player] [force=false]` | both | `adapt.gui` |
| `/adapt effects [enabled=toggle]` | player | `adapt.effects` |
| `/adapt configure` (`config`, `cfg`) | player | `adapt.configurator` or op |
| `/adapt experience <skill> [amount=10] [player]` | both | `adapt.cheatitem` |
| `/adapt knowledge <skill> [amount=10] [player]` | both | `adapt.cheatitem` |
| `/adapt determine <skill:adaptation> <assign> <force> <level> [player]` | both | `adapt.determine` |
| `/adapt claim-skill <skill> <level> [player]` | both | `adapt.determine` |
| `/adapt claim-adaptation <skill:adaptation> <level> [force=false] [player]` | both | `adapt.determine` |

`claim-skill` accepts levels 0-100 and writes `XP.getXpForLevel(level)` onto the line. `claim-adaptation` accepts 0-100 and then clamps to `adaptation.getMaxLevel()`.

### `/adapt clear` (`CommandClear`)

Permission on every subcommand: `adapt.clear`. Online targets only.

| Syntax | Effect |
|---|---|
| `/adapt clear all [player]` | Runs every clear below, then also empties advancements, XP multipliers, wisdom, and mutation data |
| `/adapt clear xp [player]` | Zeroes XP, pooled XP, last-level tracking, and monotony on every line. Empties adaptations. Resets Inspired. Sets master XP to 1 |
| `/adapt clear knowledge [player]` | Zeroes knowledge on every skill line |
| `/adapt clear adaptations [player]` | Empties every skill line's adaptations and the region-granted count |
| `/adapt clear stats [player]` | Empties the stats map |
| `/adapt clear discoveries [player]` | Replaces every discovery set: biomes, mobs, foods, items, recipes, enchants, worlds, people, environments, potion effects, blocks |

### `/adapt reset` (`CommandReset`)

| Syntax | Permission | Effect |
|---|---|---|
| `/adapt reset confirm [player]` | `adapt.clear` | Two-step confirm within 30 seconds, then `AdaptServer.resetPlayerData`; an online target on this backend receives the empty profile live, including adoption of a new SQL fence |

Accepts offline targets. The pending confirmation is keyed by sender and target. Console uses the zero UUID as its sender key. Online resets initiated on the hosting backend replace the profile in place in both local and SQL mode; the SQL path adopts its newly rotated fence. The target receives the configured deletion notice in chat without being kicked. Only an older runtime on another backend retires until reconnect when it receives the reset notice.

### `/adapt default` (`CommandDefault`)

Permission on every subcommand: `adapt.configurator`.

| Syntax | Effect |
|---|---|
| `/adapt default skill <skill>` | Deletes the skill TOML, hot-reloads it, reconciles mutations |
| `/adapt default adaptation <skill:adaptation>` | Deletes the adaptation TOML, hot-reloads it, reconciles mutations |
| `/adapt default all` | Archives `adapt.toml` plus every skill and adaptation TOML under `config-archive/<timestamp>/`, deletes them, reloads from defaults, reconciles mutations |

The `skill` and `adaptation` subcommands only accept `SimpleSkill` and `SimpleAdaptation` components. Anything else reports that reset is unsupported. `default all` deletes every `.toml` in both folders regardless.

### `/adapt debug` (`dev`) (`CommandDebug`)

| Syntax | Origin | Permission |
|---|---|---|
| `/adapt debug mode [enabled=toggle] [player]` | both | `adapt.debug` |
| `/adapt debug verbose` | both | `adapt.idontknowwhatimdoingiswear` |
| `/adapt debug pap` | both | `adapt.idontknowwhatimdoingiswear` |
| `/adapt debug psp` | both | `adapt.idontknowwhatimdoingiswear` |
| `/adapt debug particle <particle>` | player | `adapt.idontknowwhatimdoingiswear` |
| `/adapt debug sound <sound>` | player | `adapt.idontknowwhatimdoingiswear` |
| `/adapt debug perf [top=12] [reset=false]` | both | `adapt.idontknowwhatimdoingiswear` |

`particle` refuses any particle whose Bukkit data type is not `Void`.

### `/adapt mutations` (`CommandMutation`)

| Syntax | Origin | Permission |
|---|---|---|
| `menu` | player | `adapt.mutations` |
| `view [player]` | both | `adapt.mutations` for yourself, `adapt.mutations.admin` for anyone else |
| `cooperative [on\|off\|toggle]` | player | `adapt.mutations` |
| `equip <mutation> <1\|2> [player]` | both | `adapt.mutations.admin` |
| `clear <1\|2> [player]` | both | `adapt.mutations.admin` |
| `discover <mutation> [discovered=true] [player]` | both | `adapt.mutations.admin` |
| `cooldown [player]` | both | `adapt.mutations.admin` |
| `refresh [player]` | both | `adapt.mutations.admin` |
| `slot-override <1\|2> <on\|off\|clear> [player]` | both | `adapt.mutations.admin` |
| `reset [player]` | both | `adapt.mutations.admin` |
| `perfect-test [on\|off\|clear] [player]` | both | `adapt.mutations.admin` |
| `reload` | both | `adapt.mutations.admin` |

### Static permissions (`plugin.yml`)

| Node | Default | Covers |
|---|---|---|
| `adapt.main` | op | The `/adapt` root gate |
| `adapt.idontknowwhatimdoingiswear` | op | Developer debug tools |
| `adapt.cheatitem` | op | XP and knowledge orbs |
| `adapt.boost` | op | Per-player XP boost |
| `adapt.boost.global` | op | Server-wide XP boost |
| `adapt.gui` | op | Opening the GUI via command |
| `adapt.determine` | op | `determine`, `claim-skill`, `claim-adaptation` |
| `adapt.debug` | op | Debug mode |
| `adapt.configurator` | op | Config editor and config resets |
| `adapt.effects` | true | Toggling your own effects |
| `adapt.mutations` | true | Your own mutations, once the feature is enabled |
| `adapt.mutations.admin` | op | Mutation admin tools |
| `adapt.clear` | op | `clear` and `reset` subcommands |

### Dynamic use permissions

Registered by `AdaptPermissionRegistrar` once skills have loaded.

| Pattern | Default | Covers |
|---|---|---|
| `adapt.use.<skillNameWithoutHyphens>` | true | A skill and, as children, its adaptations |
| `adapt.use.<adaptationNameWithoutHyphens>` | true | One adaptation. `agility-air-dash` becomes `adapt.use.agilityairdash` |
| `adapt.use.mutation.<mutation-id>` | true | One mutation type, hyphens kept, for example `adapt.use.mutation.gale-lung` |
| `adapt.use.*` | true | Parent of every skill and mutation node |
| `permissionXpMultipliers` nodes | false | Registered only while that feature is enabled |

An unset use node is treated as granted, because the check tests `isPermissionSet` first and returns true when the node is absent. Ops and players in debug mode skip the check.

## See also

- [03 - Player Usage](/adapt/03-player-usage)
- [01 - Installation & Configuration](/adapt/01-installation-configuration)
- [34 - Mutations Overview](/adapt/34-mutations-overview)
- [40 - Operator Runbooks](/adapt/40-operator-runbooks)
