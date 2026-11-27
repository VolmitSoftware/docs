---
title: "API - PlaceholderAPI"
description: "Read Adapt player, skill and adaptation values through PlaceholderAPI on Bukkit servers"
published: true
date: 2026-11-26T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

On Bukkit servers with PlaceholderAPI installed, Adapt registers the read-only expansion `adapt`. Placeholders are `%adapt_<path>%`, with dot-separated paths, such as `%adapt_skill.example:geology.level%` for a player's level in the example's Geology skill.

## Ids in placeholders

Skill and adaptation placeholders take a content id. A bare id is in the `adapt` namespace, so `%adapt_skill.agility.level%` and `%adapt_skill.adapt:agility.level%` are the same. Content of other addons uses its full id: `%adapt_skill.example:geology.level%`, `%adapt_adaptation.example:geology/prospect.level%`. Ids never contain a dot, so the first dot after the id starts the attribute.

## Player

| Placeholder | Value |
|---|---|
| `%adapt_available%` | Whether the player's Adapt data is ready |
| `%adapt_player.level%` | Master level |
| `%adapt_player.max-level%` | Highest master level |
| `%adapt_player.master-xp%` | Master XP |
| `%adapt_player.multiplier%` | The player's XP multiplier |
| `%adapt_player.wisdom%` | Wisdom |
| `%adapt_player.power%`, `%adapt_player.power-used%`, `%adapt_player.power-max%` | Power, power in use and maximum power |
| `%adapt_player.known-skills%` | Skills the player has a level in |
| `%adapt_player.learned-adaptations%` | Adaptations the player has learned |

## Catalog

| Placeholder | Value |
|---|---|
| `%adapt_catalog.available%` | Whether the content catalog is ready |
| `%adapt_catalog.skills%` | Registered skills |
| `%adapt_catalog.adaptations%` | Registered adaptations |

## Skills

`%adapt_skill.<id>.<attribute>%`:

| Attribute | Value |
|---|---|
| `level`, `xp`, `knowledge`, `multiplier` | The player's level, XP, unspent knowledge and multiplier in the skill |
| `progress`, `progress-percent` | Progress toward the next level |
| `xp-to-next`, `current-level-xp`, `next-level-xp` | XP still missing, and the XP thresholds of the current and next level |
| `learned-adaptations` | Adaptations the player learned in the skill |
| `known` | Whether the player has a level in the skill |
| `has-level.<n>` | Whether the player's level is at least `n` |
| `name`, `enabled`, `adaptations` | The skill's name, whether it is enabled, and its adaptation count |

## Adaptations

`%adapt_adaptation.<id>.<attribute>%`:

| Attribute | Value |
|---|---|
| `level`, `max-level` | The player's learned level, and the highest level |
| `learned` | Whether the player learned it |
| `can-use` | Whether the player learned it and the adaptation and its skill are enabled on the server |
| `name`, `enabled` | The adaptation's name, and whether it is enabled |
| `skill` | The full id of the skill it belongs to |
| `cost-next`, `power-next`, `can-claim-next` | Knowledge and power for the next level, and whether the player can afford it |
| `cost-to.<n>`, `power-to.<n>`, `can-claim.<n>` | The same for reaching level `n` |

## Values

Values come from snapshots refreshed about once a second, so they may trail gameplay slightly. A known key reads `---` while the player's data is unavailable, and for 60 seconds after a player leaves it keeps the last values before turning to `---`. Skill and adaptation keys also read `---` while Adapt is starting, before its first catalog snapshot exists. After that, an unknown key, or an id that is not registered, is left unreplaced.
