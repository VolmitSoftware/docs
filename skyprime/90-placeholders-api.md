---
title: 90 - Placeholders & API
description: Optional PlaceholderAPI values and island service boundaries
published: true
date: 2026-09-05T16:24:00.000Z
tags: skyprime, placeholders, api
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

SkyPrime registers its expansion only when PlaceholderAPI is enabled. Resolution uses the player's cached island snapshot and performs no disk I/O. A player without an island receives an empty value.

| Placeholder | Value |
| --- | --- |
| `%skyprime_id%` | Permanent island UUID |
| `%skyprime_name%` | Island name |
| `%skyprime_owner%` | Owner UUID |
| `%skyprime_owner_name%` | Owner name observed since plugin startup, falling back to the UUID when unknown |
| `%skyprime_members%` | Team size including the owner |
| `%skyprime_members_max%` | Current team capacity including upgrades |
| `%skyprime_homes%` / `%skyprime_homes_max%` | Saved home count / current home capacity |
| `%skyprime_upgrade_expansion%` | Purchased island-size levels |
| `%skyprime_upgrade_team%` | Purchased team-capacity levels |
| `%skyprime_upgrade_homes%` | Purchased home-capacity levels |
| `%skyprime_upgrade_generator%` | Purchased generator levels |
| `%skyprime_generator_boost%` | Extra generator tiers from upgrades |
| `%skyprime_value%` | Last reconciled block value |
| `%skyprime_level%` | Integer value divided by the configured level divisor |
| `%skyprime_size%` | Current square width, `2 × radius + 1` |
| `%skyprime_size_max%` | Configured maximum square width |
| `%skyprime_bank%` | Internal credit balance |
| `%skyprime_votes%` | Vote count |
| `%skyprime_state%` | Current lifecycle state |
| `%skyprime_rank%` | Cached one-based leaderboard position, or zero when unranked |

Prefix any suffix with `current_` to read the island the player is physically visiting, for example `%skyprime_current_name%` or `%skyprime_current_owner_name%`. Presence updates on player movement, travel and joining. These placeholders read the cached presence and island records without accessing another region's player location. They return an empty value outside active islands.

The source exposes immutable `Island` and `Home` records through `SkyPrime.islands()`. `byId`, `forPlayer`, `at`, `top` and `rank` use in-memory indexes. Location lookup requires the caller to establish that the world is managed; `SkyPrime.worlds().islandAt(Location)` includes that check.

Player-facing domain mutations enforce ownership, membership, limits and persistence health. Privileged methods such as `credit`, `setValue`, `activate`, `beginDeleteById` and `finishDelete` assume a trusted caller; integrations must authorize those operations themselves. After a persisted mutation, await `IslandService.flush()` if another system needs durability before acknowledging its own operation. Invitations, ownership offers and coops are transient. `mayVisit` and `mayAct` recheck the current island, bans, lifecycle, guest expiry and storage health. `quoteUpgrade(actor, track)` returns an immutable island/track/level/price quote. `upgrade(actor, quote)` checks all quoted values again before spending. `claimMission(actor, id, inventoryCheckpoint)` accepts a material-name/count map for a one-time inventory checkpoint; event objectives use persisted progress. Trusted integrations submitting that map must read the player inventory on its owning thread. `credit(islandId, actor, amount, detail)` records an explicit actor; console callers use `IslandService.SYSTEM_ACTOR`.

World operations return completion futures and must be used for terrain creation, reset, deletion and safe teleports. External consumers must still observe Bukkit/Folia ownership for entity, inventory and world access.

The source API is part of this project version. No stable binary compatibility contract is promised for future releases.
