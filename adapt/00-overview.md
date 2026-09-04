---
title: "Overview"
description: "How Adapt skills, knowledge, adaptations, and ability power work"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt adds skill progression to normal Minecraft actions. Players earn XP, gain knowledge, and choose adaptations from an in-game menu.

## Player progression

1. An activity awards XP to its skill. Mining raises Pickaxes, placing blocks raises Architect, and movement raises Agility.
2. Skill levels award knowledge for that skill and contribute to the player's master level.
3. Players spend knowledge on adaptations.
4. Learned adaptation levels use ability power. Master level increases the available power.

Knowledge is tied to one skill. Pickaxes knowledge cannot buy an Agility adaptation. Ability power is shared across every skill, so players may need to unlearn one adaptation before buying another.

Right-click the side of the configured activator block to open the menu. The default is a bookshelf. Players do not need a command unless the server grants access to `/adapt gui`.

## Main systems

| System | Purpose |
|---|---|
| Skills | Track gameplay activity and award XP |
| Knowledge | Buys adaptation levels within one skill |
| Adaptations | Add passive effects or player-triggered abilities |
| Master level | Combines progress from every skill |
| Ability power | Limits the total adaptation levels a player can hold |
| Mutations | Optional two-slot traits with benefits and burdens |

Adaptations only run when their skill and configuration are enabled. World rules, permissions, protection plugins, game mode, and third-party policies can also stop an ability.

## Server options

Operators can change XP curves, costs, menu icons, skill order, effects, worlds, and individual adaptations. Configuration is stored under `plugins/Adapt/`.

Optional integrations add economy charges, placeholders, region checks, hidden ore handling, custom tree felling, remote containers, and cosmetic armor handling. SQL and Redis support shared progression across backend servers.

## Continue reading

| Guide | Covers |
|---|---|
| [Installation and Configuration](/adapt/01-installation-configuration) | Requirements, files, and setup |
| [Concepts](/adapt/02-concepts) | Progression rules and formulas |
| [Player Usage](/adapt/03-player-usage) | Menus, learning, and ability use |
| [Commands and Permissions](/adapt/04-commands-permissions) | Command syntax and access |
| [Configuration Math](/adapt/05-configuration-math) | XP curves and multipliers |
| [GUI Customization](/adapt/06-gui-customization) | Menu size, icons, and ordering |
| [Localization](/adapt/07-localization) | Languages and message overrides |
| [Protection and Region Policy](/adapt/08-protection-region-policy) | Claims and WorldGuard |
| [Integrations](/adapt/09-integrations) | Optional plugin hooks |
| [Skills Catalog](/adapt/10-skills-catalog) | All 23 skills |
| [Mutations Overview](/adapt/34-mutations-overview) | Optional mutation progression |
| [Items, Orbs and Bound Objects](/adapt/36-items-orbs-bound-objects) | Adapt items and stored data |
| [Recipes, Brewing and Value](/adapt/37-recipes-brewing-value) | Crafting and brewing |
| [Cross-Server SQL and Redis](/adapt/39-velocity-cross-server) | Backend handoff |
| [Operator Runbooks](/adapt/40-operator-runbooks) | Backups, recovery, and checks |
| [Developer API](/adapt/41-api-getting-started) | Supported integration points |
