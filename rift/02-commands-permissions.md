---
title: "Rift: Commands and Permissions"
description: "Rift command syntax, help behavior, aliases, and granular permission nodes"
published: true
date: 2026-10-09T17:25:00.000Z
tags: "rift, commands, permissions, help"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Use `/rift` or `/rft`. Run `/rift help` for syntax and completion.

## Commands

Arguments in brackets have defaults. Supply optional values as `argument=value`.

| Command | Permission | Effect |
|---|---|---|
| `/rift help` | `rift.command` | Show the contextual help menu |
| `/rift create <name> [environment] [generator] [seed] [type]` | `rift.create` | Create, load, and manage a new world |
| `/rift clone <source> <target> [load] [keep-policies] [keep-game-rules] [keep-border]` | `rift.clone` | Copy an unloaded managed dimension into a new identity; all options default to true |
| `/rift regenerate <name> [seed] [keep-policies] [keep-game-rules] [keep-border]` | `rift.regenerate` | Confirm twice, then replace a loaded world and keep the original in quarantine; seed defaults to `keep` and retention flags default to true |
| `/rift import <key> [generator] [auto-load] [alias] [environment] [type]` | `rift.import` | Register existing storage or adopt a loaded world; auto-load defaults to false |
| `/rift load <name-or-key>` | `rift.load` | Load validated managed storage through its lifecycle owner |
| `/rift unload <name> [save]` | `rift.unload` | Evacuate players, save if requested, and unload |
| `/rift delete <name>` | `rift.delete` | Confirm twice, then move a managed world into quarantine |
| `/rift restore <id>` | `rift.restore` | Restore the directory and complete profile without loading it |
| `/rift unmanage <name-or-key>` | `rift.unmanage` | Retire a managed profile while keeping world storage and any loaded world |
| `/rift tp <destination>` | Destination permission | Teleport the executing player to a world, coordinates, anchor, player, or bed |
| `/rift send <player> <destination>` | Destination permission for other players | Teleport another online player to a destination |
| `/rift anchor list` | `rift.anchor.list` | List saved travel anchors |
| `/rift anchor info <name>` | `rift.anchor.list` | Inspect a saved anchor |
| `/rift anchor set <name> [destination=<destination>]` | `rift.anchor.set` | Save an anchor; the destination defaults to the executing player's position |
| `/rift anchor remove <name>` | `rift.anchor.remove` | Remove a saved anchor |
| `/rift list [page]` | `rift.list` | Browse loaded, managed, discovered, and quarantined worlds in a paged Director menu |
| `/rift info <name>` | `rift.info` | Show detailed state for one world |
| `/rift generators [page]` | `rift.generators` | Browse Bukkit world types and configured generator identifiers in a paged Director menu |
| `/rift config` | `rift.config` | Open the in-game configuration editor |
| `/rift language` | Scope-dependent | Open the personal, server-default, reset, and message-editor menu |
| `/rift language self [locale\|reset]` | `volmit.language.self` and `rift.language.self` | List or select a personal locale without changing the server default, or clear that preference |
| `/rift language server [locale]` | `volmit.language.admin` or `rift.config` | List or select the server-default locale |
| `/rift language server edit [locale]` | `volmit.language.admin` or `rift.config` | Open the in-game message editor, optionally at one locale |
| `/rift status` | `rift.status` | Show platform, Java, paths, locale, and world counts in a Director menu |
| `/rift debug` | None | Open the diagnostic-tools help page |
| `/rift debug version` | `rift.command` | Show `Rift v<version>` in the help-menu gradient |
| `/rift debug dump [upload]` | `rift.debug` | Save a detailed report; `upload` defaults to `true` and may be set to `false` for this run |
| `/rift autoload <name> <enabled>` | `rift.config` | Change a managed profile's startup auto-load flag |
| `/rift protect <name> <enabled>` | `rift.config` | Change a managed profile's protection flag |

Aliases include `teleport` for `tp` and `editor` for `config`, and `/rift version` for `/rift debug version`. Config, server language, and managed-profile changes reload automatically; there is no manual reload command.

See [Destinations and anchors](/rift/06-destinations) for destination syntax and native or Multiverse teleport permission nodes. Anchor sister nodes are `multiverse.core.anchor.list`, `multiverse.core.anchor.create`, and `multiverse.core.anchor.delete`.

Rift also answers `/volmit plugins languages` and `/volmit plugins debug`. See [Languages](/languages).

## Create arguments

| Argument | Default | Values |
|---|---|---|
| `environment` | `NORMAL` | Bukkit `World.Environment` value |
| `generator` | `vanilla` | `vanilla`, built-in `void`, or `PluginName[:generator-id]` |
| `seed` | `random` | `random` or a signed 64-bit integer |
| `type` | `NORMAL` | Bukkit `WorldType` value |

Examples:

```none
/rift create resource
/rift create flat_build environment=NORMAL generator=vanilla seed=12345 type=FLAT
/rift create empty_build environment=NORMAL generator=void seed=8675309 type=NORMAL
/rift import minecraft:resource generator=vanilla auto-load=false alias=resource environment=NORMAL type=NORMAL
```

The built-in `void` generator creates empty `THE_VOID` biome chunks and a bedrock spawn platform. An external generator must be available for explicit creation or loading. Import and adoption do not request a generator. Imported unloaded worlds require an exact namespaced key in current Paper storage; provide a unique command alias when another namespace uses the same name.

## Permission defaults

`rift.command`, `rift.language.self`, and the dynamically registered `volmit.language.self` default to everyone. Every operational node, `rift.config`, `rift.debug`, the dynamically registered `volmit.language.admin`, and `rift.admin` default to operators. The Bukkit command registration does not impose a second root-permission gate: a specifically granted subcommand node is sufficient. `rift.admin` grants all Rift capabilities.

`/rift debug dump` writes `plugins/Rift/debug/rift-v<version>-debugdump-<UTC timestamp>.txt`. Upload requires both `debugUploadEnabled` and the command's `upload` argument. Review reports before sharing them when world names or server layout are private.

World settings use `/rift policy set <world> <setting> <value>` and `/rift policy <world>` for the editor. See [World policies](/rift/05-world-policies).

Rift accepts either native or Multiverse permission grants. Native grants also expose their Multiverse sister nodes to plugins that check Bukkit permissions directly. Permission defaults remain defined by each native node.

| Rift node | Multiverse sister |
|---|---|
| `rift.create` | `multiverse.core.create` |
| `rift.clone` | `multiverse.core.clone` |
| `rift.regenerate` | `multiverse.core.regen` |
| `rift.import` | `multiverse.core.import` |
| `rift.load` | `multiverse.core.load` |
| `rift.unload` | `multiverse.core.unload` |
| `rift.delete` | `multiverse.core.delete` |
| `rift.unmanage` | `multiverse.core.remove` |
| `rift.list` | `multiverse.core.list.worlds`, `multiverse.core.list` |
| `rift.info` | `multiverse.core.info` |
| `rift.generators` | `multiverse.core.generator` |
| `rift.config` | `multiverse.core.config` |
| `rift.status` | `multiverse.core.version` |
| `rift.debug` | `multiverse.core.debug` |
| `rift.policy` | `multiverse.core.modify` |
| `rift.check` | `multiverse.core.check` |
| `rift.login.bypass` | `mv.bypass.joinlocation` |
| `rift.world.access.<alias>` | `multiverse.access.<original-name>` |
| `rift.gamemode.bypass.<alias>` | `mv.bypass.gamemode.<original-name>` |
| `rift.capacity.bypass.<alias>` | `mv.bypass.playerlimit.<original-name>` |

World access, teleport, gamemode bypass, and player-limit bypass retain their world scope. Converted profiles retain the original MV world name for these checks. Native nodes use the RIFT command alias.

`multiverse.teleport.self.w.<original-name>` permits teleporting yourself to that world's spawn. `multiverse.teleport.other.w.<original-name>` permits sending another player there. The corresponding native nodes are `rift.teleport.w.<alias>` and `rift.teleport.others.w.<alias>`. MV spawn grants, `multiverse.core.spawn.self.<original-name>` and `multiverse.core.spawn.other.<original-name>`, also permit world-spawn travel. A world-spawn grant does not permit coordinate, anchor, player, or bed destinations.

Global `rift.teleport` and `rift.teleport.others` permit all supported destinations in their respective scopes. Bukkit wildcard grants include registered worlds and destinations. A grant for one world or player does not permit another target.

Next: [Storage and operations](/rift/03-storage-operations)
