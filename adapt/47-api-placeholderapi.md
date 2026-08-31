---
title: "API - PlaceholderAPI"
description: "Adapt documentation: API - PlaceholderAPI"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt provides read-only `%adapt_...%` placeholders when PlaceholderAPI is installed.

## Common keys

| Placeholder | Value |
|---|---|
| `%adapt_available%` | Whether Adapt data is ready |
| `%adapt_player.level%` | Overall player level |
| `%adapt_player.power%` | Used power |
| `%adapt_player.power-max%` | Maximum power |
| `%adapt_player.knowledge%` | Total knowledge |
| `%adapt_skill.<id>.level%` | Skill level |
| `%adapt_skill.<id>.xp%` | Skill XP |
| `%adapt_skill.<id>.xp-next%` | XP needed for the next level |
| `%adapt_adaptation.<id>.level%` | Learned adaptation level |
| `%adapt_mutation.slot-1%` | First equipped mutation |
| `%adapt_mutation.slot-2%` | Second equipped mutation |

Paths use lowercase letters, digits, hyphens, and dots. Use dots inside the path, not underscores.

```java
String value = PlaceholderAPI.setPlaceholders(player, "%adapt_skill.mining.level%");
```

`---` means the key is known but the player's data is unavailable. A literal placeholder means the key is unknown or the expansion is not registered.

Values come from snapshots and may be about one second behind live gameplay.
