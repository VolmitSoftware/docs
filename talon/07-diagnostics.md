---
title: "Talon: Diagnostics"
description: "Status, local reports, telemetry, and update notices"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "talon, diagnostics"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Use `/talon status` for runtime details and `/talon debug version` for the installed version. `/talon version` is a hidden alias for the same version result.

## Status

| Entry group | Meaning |
|---|---|
| Plugin, Minecraft, Java, server | Installed versions and runtime identity |
| Region threading | Whether Folia-style scheduling is active |
| Enabled and mining limits | Current global ability state, block budgets, and durability reserve |
| Loot and recipes | Inventory collection, protection checks, crafting availability, registered recipe count, and restart requirements |
| Job and item counters | Active mining jobs, extra blocks harvested, skipped candidates, and delivered items |
| Purchases | Pending transactions and players with unresolved transactions discovered during this session |
| Publication services | Metrics, update, and language publication state |

Recipe status is included in `/talon status` and debug dumps:

| Entry | Meaning |
|---|---|
| `book_recipes` | Whether registered recipes and current enable settings allow book crafting |
| `book_recipe_registration` | `ready` when recipe registration is available; otherwise `unavailable` |
| `book_recipe_count` | Number of registered Talon book recipes |
| `book_recipe_restart_pending` | Whether saved ingredients or missing startup registration require a server restart |
| `book_recipe_startup_only` | Whether this platform registers recipes only during server startup |

Counters describe the current runtime session. A skipped candidate can be outside the owned region, unavailable, ineligible, or denied by another plugin.

## Debug dump

`/talon debug dump` writes a report under `plugins/Talon/debug/`. Talon's contribution includes its runtime status and current settings alongside the shared server diagnostics. Creating reports requires `talon.debug`.

Reports remain local unless you run `/talon debug dump upload=true` and enable `debug.uploadEnabled`. Review the report before sharing it. Talon also participates in the shared `/volmit plugins` diagnostics tools.

## Metrics and updates

`metrics.enabled` controls bStats participation. A build with service ID `0` sends no Talon metrics even when the setting is enabled. The global bStats opt-out also applies.

`general.updateNotifications` controls GitHub release checks and `talon.update` controls who receives notices. Checks use the [Talon repository](https://github.com/VolmitSoftware/Talon) independently of language downloads. Reports distinguish no published release, a failed request, and an unrecognized version. Update notices do not install jars.

## Related pages

- [Installation *Runtime and library requirements*](/talon/01-installation)
- [Configuration *Limits and telemetry settings*](/talon/03-configuration)
- [Integrations *Protection behavior*](/talon/06-integrations)
{.links-list}
