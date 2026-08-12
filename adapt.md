---
title: "Adapt"
description: "Adapt passive skills and abilities for Paper and Folia"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

# Adapt

Passive skills and abilities layered on vanilla rather than replacing it. Players open the
skill tree by right-clicking a **bookshelf face**; skills level from the matching activity and
award knowledge, which is spent on individual adaptations.

| | |
|---|---|
| Command | `/adapt` |
| Folia | Supported |
| Skills | 23 |
| Adaptations | 331 |
| Player entry point | Right-click a bookshelf face |

## Skills

| Skill | Adaptations |
|---|---|
| [Agility](/adapt/11-skill-agility) | 14 |
| [Architect](/adapt/12-skill-architect) | 14 |
| [Axes](/adapt/13-skill-axes) | 14 |
| [Blocking](/adapt/14-skill-blocking) | 14 |
| [Brewing](/adapt/15-skill-brewing) | 13 |
| [Chronos](/adapt/16-skill-chronos) | 17 |
| [Crafting](/adapt/17-skill-crafting) | 15 |
| [Discovery](/adapt/18-skill-discovery) | 14 |
| [Enchanting](/adapt/19-skill-enchanting) | 14 |
| [Excavation](/adapt/20-skill-excavation) | 12 |
| [Herbalism](/adapt/21-skill-herbalism) | 15 |
| [Hunter](/adapt/22-skill-hunter) | 14 |
| [Kinetics](/adapt/23-skill-kinetics) | 19 |
| [Nether](/adapt/24-skill-nether) | 14 |
| [Pickaxes](/adapt/25-skill-pickaxes) | 13 |
| [Ranged](/adapt/26-skill-ranged) | 15 |
| [Rift](/adapt/27-skill-rift) | 15 |
| [Seaborne](/adapt/28-skill-seaborne) | 14 |
| [Stealth](/adapt/29-skill-stealth) | 15 |
| [Swords](/adapt/30-skill-swords) | 14 |
| [Taming](/adapt/31-skill-taming) | 15 |
| [TragOul](/adapt/32-skill-tragoul) | 15 |
| [Unarmed](/adapt/33-skill-unarmed) | 12 |
{.dense}

Every skill and every adaptation is independently configurable and can be disabled. Mutations
are a separate system layered on top — see [Mutations Overview](/adapt/34-mutations-overview).

## Permissions

| Node | Default | Description |
|---|---|---|
| `adapt.boost` | `op` | Allows for you to use the Boost command to boost XP gains |
| `adapt.boost.global` | `op` | Allows boosting XP gains for every player on the server |
| `adapt.cheatitem` | `op` | Allows for you to create a Cheat Item (one time use Xp Items) |
| `adapt.clear` | `op` | Allows clearing player progression data |
| `adapt.configurator` | `op` | Allows using the config editor and resetting configs to defaults |
| `adapt.debug` | `op` | Allows Adapt debug tools including debug mode and config migration |
| `adapt.determine` | `op` | Allows directly assigning skill lines and adaptations to players |
| `adapt.effects` | `True` | Allows toggling Adapt effect visibility for yourself |
| `adapt.gui` | `op` | Allows opening the Adapt GUI via /adapt gui |
| `adapt.idontknowwhatimdoingiswear` | `op` | This is for the Adapt Testing command DEVELOPERS ONLY |
| `adapt.main` | `op` | Allows for you to use the main command |
| `adapt.mutations` | `True` | Allows using personal experimental Mutations after the server opts in |
| `adapt.mutations.admin` | `op` | Allows inspecting and managing experimental Mutation state |

Full command syntax is in [Commands & Permissions](/adapt/04-commands-permissions).

### Getting started

- [Overview](/adapt/00-overview)
- [Installation & Configuration](/adapt/01-installation-configuration)
- [Concepts](/adapt/02-concepts)
- [Player Usage](/adapt/03-player-usage)
- [Commands & Permissions](/adapt/04-commands-permissions)
- [Configuration Math](/adapt/05-configuration-math)
- [GUI Customization](/adapt/06-gui-customization)
- [Localization](/adapt/07-localization)
- [Protection & Region Policy](/adapt/08-protection-region-policy)
- [Integrations](/adapt/09-integrations)
{.links-list}

### Skills

- [Skills Catalog](/adapt/10-skills-catalog)
- [Skill - Agility](/adapt/11-skill-agility)
- [Skill - Architect](/adapt/12-skill-architect)
- [Skill - Axes](/adapt/13-skill-axes)
- [Skill - Blocking](/adapt/14-skill-blocking)
- [Skill - Brewing](/adapt/15-skill-brewing)
- [Skill - Chronos](/adapt/16-skill-chronos)
- [Skill - Crafting](/adapt/17-skill-crafting)
- [Skill - Discovery](/adapt/18-skill-discovery)
- [Skill - Enchanting](/adapt/19-skill-enchanting)
- [Skill - Excavation](/adapt/20-skill-excavation)
- [Skill - Herbalism](/adapt/21-skill-herbalism)
- [Skill - Hunter](/adapt/22-skill-hunter)
- [Skill - Kinetics](/adapt/23-skill-kinetics)
- [Skill - Nether](/adapt/24-skill-nether)
- [Skill - Pickaxes](/adapt/25-skill-pickaxes)
- [Skill - Ranged](/adapt/26-skill-ranged)
- [Skill - Rift](/adapt/27-skill-rift)
- [Skill - Seaborne](/adapt/28-skill-seaborne)
- [Skill - Stealth](/adapt/29-skill-stealth)
- [Skill - Swords](/adapt/30-skill-swords)
- [Skill - Taming](/adapt/31-skill-taming)
- [Skill - TragOul](/adapt/32-skill-tragoul)
- [Skill - Unarmed](/adapt/33-skill-unarmed)
{.links-list}

### Mutations, items and recipes

- [Mutations Overview](/adapt/34-mutations-overview)
- [Mutations Catalog](/adapt/35-mutations-catalog)
- [Items, Orbs & Bound Objects](/adapt/36-items-orbs-bound-objects)
- [Recipes, Brewing & Value](/adapt/37-recipes-brewing-value)
{.links-list}

### Architecture and operations

- [Runtime Architecture](/adapt/38-runtime-architecture)
- [Velocity & Cross-Server](/adapt/39-velocity-cross-server)
- [Operator Runbooks](/adapt/40-operator-runbooks)
{.links-list}

### Developer API

- [API - Getting Started](/adapt/41-api-getting-started)
- [API - Skills & Adaptations](/adapt/42-api-skills-adaptations)
- [API - Ability Use Policy](/adapt/43-api-ability-use-policy)
- [API - Ability Cost](/adapt/44-api-ability-cost)
- [API - Events](/adapt/45-api-events)
- [API - Protection](/adapt/46-api-protection)
- [API - PlaceholderAPI](/adapt/47-api-placeholderapi)
- [API - Mutations](/adapt/48-api-mutations)
- [API - Player Data, XP & World](/adapt/49-api-player-data-xp-world)
- [API - Recipes, FX, Telemetry & Utilities](/adapt/50-api-recipes-fx-telemetry-utilities)
{.links-list}


## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/Adapt*](https://github.com/VolmitSoftware/Adapt)
- [Translations *gitlocalize.com/repo/8085*](https://gitlocalize.com/repo/8085)
{.links-list}
