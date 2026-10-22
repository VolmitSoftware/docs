---
title: "ByteCompanions: Feature map"
description: "Implemented, partial, and planned work, each with its acceptance criterion"
published: true
date: 2026-10-21T00:00:00.000Z
tags: "bytecompanions, features, roadmap"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

This page records the state of each feature area in three groups. Each entry names the condition under which it counts as done.

## Implemented

| Area | Acceptance criterion |
|---|---|
| Runtime gate | The constructor rejects any server outside Minecraft 26.1 through 26.3 or Java 25 before downloading libraries, naming the found version. |
| Native adapters | 26.1 and 26.2 share one Paper and one Spigot adapter; 26.3 has its own pair; the selected family appears in `status`. |
| Companion runtime | Client-side head and full-body companions with equipment, overlays, animations, viewer tracking, and companion limits on all six server families. |
| Collection and dashboard | 54-slot collection with favorite, access, and category filters; dashboards with equip, particles, bonuses, personalization, actions, trials, and viewer settings. |
| Outfits | Up to `collections.maximumOutfits` named outfits that restore companions, names, variants, particles, and formation order in one step. |
| Personalization and interactions | Personal names, permitted variants, formations, and the pet, wave, sit, stay, and call actions with cooldown and hold distance. |
| Private trials | A locked companion can be previewed by its player alone for `collections.trialSeconds` without bonuses or saved changes. |
| Starter setup | Eight starter companions install on first start; `/bytecompanions setup` applies a cosmetic or survival profile through the validated reload. |
| Companion Studio | Definitions and base bonuses are edited in game with drafts, private previews, review pages, and a validated save. |
| Feature packs | Attributes, buffs, decorations, potion effects, and 34 particle effects, each switched in `config.toml` and configured in its own file. |
| Progression and boosters | Companion levels, upgrade tracks, level rewards, personal and server boosters, journaled purchases, and review commands. |
| Configuration | Typed `config.toml` with validation, the in-game editor with section and setting labels in all 18 locales, and hot reload of every file under the data folder. |
| Languages | English in the jar, 17 locales downloaded from the repository on first use, generated language files, personal selection, and the shared editor. |
| Storage | One `storage.backend` (`json` by default, `sqlite`, `h2`, or `mysql`) for companion selections, collections, particle choices, and progression. |
| Integrations | PlaceholderAPI keys, WorldGuard flags, Vault costs, and Nexo and ItemsAdder item IDs. |
| Diagnostics | Status entries, debug dump with upload, bStats, and GitHub release notices. |
| Public API | `ByteCompanions.getAPI()`, the type registry, the companion manager, and nine Bukkit events. |

## Partial

| Area | Missing piece | Acceptance criterion |
|---|---|---|
| Particle budget | There is no operator-facing setting that caps particle traffic; the debug dump reports `Particle budget: not configured`. `performance.maximumParticleIntensity` and personal viewer settings are the available limits. | An operator-facing particle budget setting exists and is validated at reload. |

## Planned

Nothing beyond the partial items above is planned.

## Related pages

- [Overview *What the plugin does*](/bytecompanions/00-overview)
- [Configuration *The settings behind the implemented areas*](/bytecompanions/03-configuration)
{.links-list}
