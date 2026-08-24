---
title: "Overview"
description: "Adapt documentation: Overview"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt is a skills plugin for Paper, Purpur, and Folia servers. Players earn experience in twenty-three skill lines by play and spend the knowledge on adaptations. Ability power limits how many adaptation levels a player can hold at once. Players unlock adaptations by activity, not from an operator.

In play it works like this. You mine for a while. Pickaxes levels up and pays you knowledge. You right-click the side of a bookshelf. The Adapt menu opens. You spend that knowledge on something like faster ore breaking.

Some adaptations are passive. They work from the moment you buy them. Others give you a gesture. Examples include sneak-right-click with a certain item, left-click the air mid-jump, or raise a shield just before a hit lands. The menu is the normal player-facing place to spend knowledge, commit ability power, and pay any configured Vault price for adaptation levels. Nobody needs to learn a command.

Optional systems sit around that core. Experimental Mutations add a second, late-game progression track. Protectors make adaptations respect WorldGuard regions and claim plugins. PlaceholderAPI, Vault, HiddenOre, Iris, AdvancedChests, and MagicCosmetics hook in when those plugins are present. SQL-backed servers can use backend-to-backend Redis handoff across a proxy network without a proxy plugin. A Java API lets other plugins price, deny, or watch ability use.

This file is the map. Each section below says what a piece is and which doc owns the detail.

## What is in the plugin

**Skills** are the progress lines. The lines include Agility, Pickaxes, Chronos, and twenty more. Each skill watches for its own activities. Each skill pays skill XP and owns a set of adaptations. [10 - Skills Catalog](/adapt/10-skills-catalog) indexes them. Docs `11` through `33` cover one skill each. Each skill page lists where its XP comes from. It lists how every adaptation activates.

**Adaptations** are the abilities a player buys. Each adaptation has levels. Each level has a knowledge price and may also have a configured Vault price. Each held adaptation also charges an ability power price. Each adaptation has its own file under `plugins/Adapt/adapt/adaptations/`. An operator can retune or disable one ability without change to the rest.

**Progression** converts skill XP to skill level and knowledge. Skill level also feeds a shared master level. Master level sets the ability power budget. Knowledge decides what you can afford. Power decides how much you can carry at once. See [02 - Concepts](/adapt/02-concepts) for the model and [05 - Configuration Math](/adapt/05-configuration-math) for the curves.

**Menus** carry the player experience. The menus include the skills list, one page per skill, and a level picker per adaptation. They also include the mutation menu and an in-game config editor for admins. See [03 - Player Usage](/adapt/03-player-usage) and [06 - GUI Customization](/adapt/06-gui-customization).

**Mutations** are a separate opt-in track. They have two slots, paired domains, and a combat lock that stops swaps during a fight. They also have an end-game perfect adaptation state. They are off by default. They do not use knowledge. See [34 - Mutations Overview](/adapt/34-mutations-overview) and [35 - Mutations Catalog](/adapt/35-mutations-catalog).

**Protection** runs before any adaptation changes the world. Claims and regions stay in force. WorldGuard gets custom Adapt flags. See [08 - Protection & Region Policy](/adapt/08-protection-region-policy) and [09 - Integrations](/adapt/09-integrations).

**The public API** lets other plugins deny an ability, charge for it, register a protector, or listen for activation events. None of them can grant an unlearned adaptation. Docs `41` through `50` cover it.

## Building from source

Adapt builds from the `Adapt/` directory. The build needs a JDK 25 toolchain. Run `./gradlew build` to compile and check. Run `./gradlew test` for the JVM suite alone. Run `./gradlew shadowJar` to produce the shaded jar. Use `build/libs/Adapt-*-all.jar` at runtime and as the compile-only dependency for API consumers. See [41 - API - Getting Started](/adapt/41-api-getting-started).

## Reference

### Identity

| Property | Value |
|---|---|
| Plugin version | `2.0.0-26.2` |
| Declared `api-version` | `26.1` |
| Main class | `art.arcane.adapt.Adapt` |
| Command root | `/adapt` |
| Folia | `folia-supported: true` |
| Java toolchain / release | 25 |
| Skill lines | 23 |
| Adaptation types | 312 declared, 311 active without Iris |

### Documentation index

| File | Covers |
|------|--------|
| [00 - Overview](/adapt/00-overview) | This file |
| [01 - Installation & Configuration](/adapt/01-installation-configuration) | Install, data folder, `adapt.toml` |
| [02 - Concepts](/adapt/02-concepts) | Skills, adaptations, XP, knowledge, power |
| [03 - Player Usage](/adapt/03-player-usage) | Activator block, menus, learning |
| [04 - Commands & Permissions](/adapt/04-commands-permissions) | Commands and permission nodes |
| [05 - Configuration Math](/adapt/05-configuration-math) | Curves, XP, power, farm prevention |
| [06 - GUI Customization](/adapt/06-gui-customization) | Icons, order, window size |
| [07 - Localization](/adapt/07-localization) | Languages and overrides |
| [08 - Protection & Region Policy](/adapt/08-protection-region-policy) | WorldGuard and claim protectors |
| [09 - Integrations](/adapt/09-integrations) | Soft depends and bridges |
| [10 - Skills Catalog](/adapt/10-skills-catalog) | All skills index |
| `11`-`33` | Per-skill adaptation reference |
| [34 - Mutations Overview](/adapt/34-mutations-overview) | Mutation system |
| [35 - Mutations Catalog](/adapt/35-mutations-catalog) | All mutation types |
| [36 - Items, Orbs & Bound Objects](/adapt/36-items-orbs-bound-objects) | Orbs and skill items |
| [37 - Recipes, Brewing & Value](/adapt/37-recipes-brewing-value) | Recipes and brewing |
| [38 - Runtime Architecture](/adapt/38-runtime-architecture) | Boot, tick, data, Folia |
| [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server) | Backend handoff and ownership fencing |
| [40 - Operator Runbooks](/adapt/40-operator-runbooks) | Pre-launch and upgrade procedures |
| `41`-`50` | Public API |

Docs `00` through `40` are written for operators and players in reading order. Docs `41` through `50` are for plugin developers.

### Project layout

| Path | Role |
|------|------|
| `src/main/java/art/arcane/adapt/Adapt.java` | Plugin entry |
| `src/main/java/art/arcane/adapt/AdaptConfig.java` | `adapt.toml` model and defaults |
| `src/main/java/art/arcane/adapt/api/` | Registries, XP, ability pipeline, mutations, world/player types |
| `src/main/java/art/arcane/adapt/content/skill/` | Skill implementations |
| `src/main/java/art/arcane/adapt/content/adaptation/` | Adaptation implementations |
| `src/main/java/art/arcane/adapt/content/gui/` | Inventory menus |
| `src/main/java/art/arcane/adapt/content/item/` | Orbs and adaptation-created items |
| `src/main/java/art/arcane/adapt/content/protector/` | Claim and region protectors |
| `src/main/java/art/arcane/adapt/content/integration/` | HiddenOre and Iris bridges |
| `src/main/java/art/arcane/adapt/command/` | Director command tree |
| `src/main/java/art/arcane/adapt/localization/` | English catalogs and language writer |
| `src/main/java/art/arcane/adapt/papi/` | PlaceholderAPI expansion |
| `src/main/java/art/arcane/adapt/service/` | Hotload, mutation, command services |
| `src/main/resources/` | `plugin.yml` and the shipped locale TOMLs |
| `src/main/java/art/arcane/adapt/util/project/redis/` | SQL-fenced backend Redis handoff and wire codec |

Soft depends declared in `plugin.yml`: PlaceholderAPI, WorldGuard, Factions, ChestProtect, Residence, GriefDefender, GriefPrevention, LockettePro, HiddenOre, Iris, Vault, AdvancedChests, MagicCosmetics.

## See also

- [01 - Installation & Configuration](/adapt/01-installation-configuration)
- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
