---
title: Overview
description: Adapt documentation: Overview
published: true
date: 2026-08-09T00:00:00.000Z
tags: adapt
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt is a Paper/Purpur/Folia skills plugin for the Minecraft 26.1 API line. Players earn experience on skill lines, spend knowledge and ability power to learn adaptations, and open the main menu through a configured activator block or command. Optional Mutations, protection plugins, PlaceholderAPI, Vault, HiddenOre, Iris, AdvancedChests, MagicCosmetics, Redis/Velocity, and a Java API extend the runtime.

## Feature map

- **Skills** — twenty-three lines (Agility through Unarmed). Each awards XP from gameplay and owns adaptations. [Skills Catalog](/adapt/10-skills-catalog) indexes them; docs `11`–`33` list each line's XP sources, milestones, adaptations, events, costs, and settings.
- **Adaptations** — three hundred-plus purchasable abilities; each skill doc states what they do and **how they activate**, plus levels, costs, events, and TOML under `plugins/Adapt/adapt/adaptations/`.
- **Progression** — skill XP, knowledge, master XP/level, ability power budget, optional wisdom on cap. See [Concepts](/adapt/02-concepts) and [Configuration Math](/adapt/05-configuration-math).
- **GUI** — skills list, adaptation lists, level pickers, mutation menu, in-game config editor. Activator block and `/adapt gui`. See [Player Usage](/adapt/03-player-usage) and [GUI Customization](/adapt/06-gui-customization).
- **Mutations** — experimental dual-slot traits with domains, combat lock, and perfect adaptation. See `34`–`35`.
- **Protection** — WorldGuard flags and claim plugins via `ProtectorRegistry`. See [Protection & Region Policy](/adapt/08-protection-region-policy).
- **Integrations** — PlaceholderAPI, Vault, HiddenOre, Iris, AdvancedChests, MagicCosmetics, and Velocity/Redis. See [Integrations](/adapt/09-integrations).
- **Public API** — ability use policy, ability cost providers, protectors, events, PlaceholderAPI. See docs `41`–`50`.

## Documentation index

| File | Covers |
|------|--------|
| [Overview](/adapt/00-overview) | This file |
| [Installation & Configuration](/adapt/01-installation-configuration) | Install, data folder, `adapt.toml` |
| [Concepts](/adapt/02-concepts) | Skills, adaptations, XP, knowledge, power |
| [Player Usage](/adapt/03-player-usage) | Bookshelf, GUI, learning |
| [Commands & Permissions](/adapt/04-commands-permissions) | Commands and permission nodes |
| [Configuration Math](/adapt/05-configuration-math) | Curves, XP, power, farm prevention |
| [GUI Customization](/adapt/06-gui-customization) | Icons, order, window size |
| [Localization](/adapt/07-localization) | Languages and overrides |
| [Protection & Region Policy](/adapt/08-protection-region-policy) | WorldGuard and claim protectors |
| [Integrations](/adapt/09-integrations) | Soft depends and bridges |
| [Skills Catalog](/adapt/10-skills-catalog) | All skills index |
| `11`–`33` | Per-skill adaptation reference |
| [Mutations Overview](/adapt/34-mutations-overview) | Mutation system |
| [Mutations Catalog](/adapt/35-mutations-catalog) | All mutation types |
| [Items, Orbs & Bound Objects](/adapt/36-items-orbs-bound-objects) | Orbs and skill items |
| [Recipes, Brewing & Value](/adapt/37-recipes-brewing-value) | Recipes and brewing |
| [Runtime Architecture](/adapt/38-runtime-architecture) | Boot, tick, data, Folia |
| [Velocity & Cross-Server](/adapt/39-velocity-cross-server) | Proxy module |
| [Operator Runbooks & Smoke Tests](/adapt/40-operator-runbooks-smoke-tests) | Checklists |
| `41`–`50` | Public API |

Docs `01`–`40` are for operators and players; `41`–`50` are for plugin developers.

## Project layout

| Path | Role |
|------|------|
| `src/main/java/art/arcane/adapt/Adapt.java` | Plugin entry |
| `src/main/java/art/arcane/adapt/api/` | Registries, XP, ability pipeline, mutations, world/player types |
| `src/main/java/art/arcane/adapt/content/skill/` | Skill implementations |
| `src/main/java/art/arcane/adapt/content/adaptation/` | Adaptation implementations |
| `src/main/java/art/arcane/adapt/content/gui/` | Inventory GUIs |
| `src/main/java/art/arcane/adapt/content/protector/` | Claim protectors |
| `src/main/java/art/arcane/adapt/command/` | Director command tree |
| `src/main/java/art/arcane/adapt/localization/` | English catalogs and language writer |
| `src/main/java/art/arcane/adapt/papi/` | PlaceholderAPI expansion |
| `src/main/java/art/arcane/adapt/service/` | Hotload, mutation, command services |
| `velocity/` | Velocity/Redis companion module |
| `docs/` | This documentation tree |

## Building

Java 25. From `Adapt/`:

```bash
./gradlew build
./gradlew test
./gradlew shadowJar
```

Runtime and API consumers should use the shaded `build/libs/Adapt-*-all.jar`. See [API - Getting Started](/adapt/41-api-getting-started).

## See also

- [Installation & Configuration](/adapt/01-installation-configuration)
