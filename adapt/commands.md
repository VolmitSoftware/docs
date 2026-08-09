---
title: Adapt — Commands & Permissions
description: Adapt command tree and functional permission nodes
published: true
date: 2026-08-09T00:00:00.000Z
tags: adapt, commands, permissions
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt registers the root command `/adapt`. Argument notation: `<required>`, `[optional]`.

## /adapt

*Basic Command*

| Command | Description |
|---|---|
| `/adapt boost [seconds] [multiplier]` | Boost Target player Experience gain. |
| `/adapt global-boost [seconds]` | Boost Global Experience gain. |
| `/adapt gui [target] [player]` | Open the Adapt GUI |
| `/adapt configure` | Open the in-game Adapt config editor *(alias: config, cfg)* |
| `/adapt experience <skill> [amount]` | Give yourself an experience orb |
| `/adapt knowledge <skill> [amount]` | Give yourself a knowledge orb |
| `/adapt determine <adaptationTarget> <assign> <force> <level>` | Assign a skill, or UnAssign a skill as if you are learning / unlearning a skill. |
| `/adapt migrate-configs` | Force migrate and rewrite all skill/adaptation configs to canonical TOML with comments. |

## /adapt clear

*Clear player progression data*

| Command | Description |
|---|---|
| `/adapt clear xp` | Clear XP across all skill lines |
| `/adapt clear knowledge` | Clear knowledge across all skill lines |
| `/adapt clear adaptations` | Unlearn all adaptations across all skill lines |
| `/adapt clear stats` | Clear the stats map |

## /adapt debug

*Adapt Debug Command*

| Command | Description |
|---|---|
| `/adapt debug verbose` | Toggle verbose mode |
| `/adapt debug pap` | Generate Perms for Adaptations! |
| `/adapt debug psp` | Generate Perms for Skills! |
| `/adapt debug particle` | Summon a particle in front of you for testing! |
| `/adapt debug particle` | Summon a particle in front of you for testing! |
| `/adapt debug perf [top]` | Show Adapt ticker hotspots |

## /adapt default

*Reset configs to defaults*

| Command | Description |
|---|---|
| `/adapt default skill` | Reset a skill config to defaults |
| `/adapt default adaptation` | Reset an adaptation config to defaults |
| `/adapt default all` | Reset ALL configs to defaults and archive the old settings |

## /adapt reset

*Permanently delete all Adapt data for a player*

| Command | Description |
|---|---|
| `/adapt reset confirm` | Permanently delete all Adapt data for a player. Requires op. Run twice to confirm. |

## Functional permissions

| Node | Default | Description |
|---|---|---|
| `adapt.boost` | `op` | Allows for you to use the Boost command to boost XP gains |
| `adapt.cheatitem` | `op` | Allows for you to create a Cheat Item (one time use Xp Items) |
| `adapt.clear` | `op` | Allows clearing player progression data |
| `adapt.config` | `False` | Legacy alias for adapt.configurator |
| `adapt.configurator` | `op` | Allows opening and using the in-game Adapt config editor |
| `adapt.idontknowwhatimdoingiswear` | `op` | This is for the Adapt Testing command DEVELOPERS ONLY |
| `adapt.listboosts` | `op` | Allows for you to view the boosts on a player |
| `adapt.main` | `op` | Allows for you to use the main command |
| `adapt.opengui` | `op` | Open the GUI without needing a Bookshelf |


## Blacklist permissions

Adapt ships 21 blacklist nodes. They all default to `false`, meaning nothing is
blacklisted out of the box. Granting a node **removes** that skill or adaptation from the
player — this is a deny-by-grant system, which is the opposite of how most permission nodes work.

Granting a skill-level node (for example `adapt.blacklist.axes`) implies all of its child
adaptation nodes, because the children are declared as `children:` in `plugin.yml`.

See [Blacklist Reference](/adapt/blacklist) for the complete node list.
