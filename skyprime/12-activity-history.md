---
title: 12 - Island Activity History
description: Searchable island membership, permissions, progression and administrative records
published: true
date: 2026-10-14T00:00:00.000Z
tags: skyprime, history, administration, storage
editor: markdown
dateCreated: 2026-10-09T13:05:37.155Z
---

Island activity history records supported changes with their time, category, actor, target and structured details. Records become visible after the associated island transaction is saved. Owners, managers and authorized custom roles can inspect their island; administrators can inspect retained records for any island UUID, including deleted islands.

## Browsing and access

Use `/is history`, or the History button in the island menu. Optional named filters are `category`, `actor`, `search` and `page`:

```text
/is history category=permissions
/is history category=progression search=upgrade
/is history actor=00000000-0000-0000-0000-000000000001 page=2
/is admin history <island UUID> category=administration
```

Categories are `membership`, `permissions`, `progression`, `settings`, `administration` and `lifecycle`; `all` removes the category filter. Actor filtering accepts a player UUID or `all`. Search is case-insensitive and matches stored action/category identifiers, actor kinds, player or target UUIDs, and detail keys or values. `search=*` clears it. Search text is limited to 80 characters. Player actors are shown by UUID; use UUIDs for actor filtering.

The menu provides category cycling, actor and search prompts, Clear filters, Refresh and page navigation. Chat prompts expire after 60 seconds; `cancel` returns to the previous filters. Prompt input is consumed by the editor instead of being sent as island chat.

Results contain up to 45 records per page, newest first. A saved sequence orders records with equal timestamps. Filters apply before pagination, and a page beyond the last result opens the last available page. Command pages start at 1. The menu rechecks current access for queued actions; losing membership or permission does not retain access through an old menu.

| Access | Requirements |
| --- | --- |
| Own-island history | `skyprime.use`, `skyprime.history` and the island `HISTORY` action |
| Any-island history | `skyprime.use` and `skyprime.history.admin` |
| Console history | `/is admin history <island UUID>` with the administrative history permission |

`skyprime.history` defaults to everyone, while `skyprime.history.admin` defaults to operators. Owners and managers have the island action; ordinary members do not receive it by default. The owner can grant `HISTORY` to a custom role through `/is roles permission <role> HISTORY true`. Administrative access is separate from team membership and works for retained deleted-island UUIDs. Console output uses the same filters and page size.

## Recorded changes

| Category | Recorded operations |
| --- | --- |
| Membership | Accepted team invitations, leaving, kicking, bans, unbans and accepted ownership transfer |
| Permissions | Custom-role creation/deletion, permission changes, assignments, protection flags and permanent trusted-guest grants/revocations |
| Settings | Island renaming and saved-home changes |
| Progression | Specialization selections, upgrade purchases, research, mission and milestone claims, dimension unlocks, purchased/token boosters, completed contracts and external bank outcomes |
| Administration | Credit grants, booster-token grants, wallet-booster stops, and explicit bank/reward/contract/creation recovery decisions |
| Lifecycle | Island reservation, activation, requested reset, and requested/completed deletion |

Player actors carry their UUID. Console and system actions have distinct actor kinds; system completion does not appear as a player action. Details include the identifiers and amounts relevant to each operation, such as an upgrade track, role permission, renamed island value or recovery receipt. A rejected action does not produce a successful-change record, and supported idempotent changes do not add duplicate records.

This history does not capture block edits, inventories, chat, raw command text, value scans, individual objective-counter updates, temporary invitations/ownership offers/cooperative access, visitor-policy changes, biome selections, time/weather/difficulty/gamerule preferences, social favorites/ratings, or the separate manual event timer store. It provides no undo or terrain rollback. The island bank ledger remains the detailed balance history.

## Configuration and retention

`config/activity.toml` contains:

```toml
enabled = true
retentionDays = 90
maxEntriesPerIsland = 1000
maxTotalEntries = 100000
```

| Field | Accepted range | Effect |
| --- | --- | --- |
| `enabled` | `true` or `false` | Enables recording new events; existing retained records remain readable when disabled |
| `retentionDays` | 1–3650 | Maximum age of retained events |
| `maxEntriesPerIsland` | 1–10,000 | Maximum retained records for one island |
| `maxTotalEntries` | 1000–1,000,000 | Maximum retained records across all islands |

Fields reload live and use `activity.<field>` in the configuration editor. The oldest records are evicted when a count limit is reached. An additional encoded-content budget of 120 MiB bounds storage growth; it can evict older entries before the configured count limit. Lowering retention removes older records, so increasing the limits later cannot restore them.

Queries immediately hide expired records and apply the current per-island limit. Loading, recording and configuration reload prune stored history. Reset and ownership transfer retain records under the permanent island UUID; deletion retains bounded history for administrator inspection. Retention includes deleted islands and continues while recording is disabled.

## Persistence and recovery

`storage/activity.json` version 1 stores the sequence and per-island records. The canonical `storage/island-state.pending.json` version 2 transaction journal coordinates activity with island, role, bank-transfer and reward state. Island schema 9 includes specialization selections. The serial writer coalesces saves, and history publishes a new read snapshot only after the entire transaction succeeds. Queries use immutable memory snapshots and never load worlds or read files.

Startup validates record shapes, identities, sequence ordering and storage bounds. Invalid current storage prevents initialization. A transaction failure suspends domain writes and history reads; its pending journal remains available for startup recovery after the storage fault is corrected. Include activity and any pending journal in a stopped-server backup alongside the other island metadata and terrain. See [Operations and recovery](/skyprime/04-operations-recovery#activity-history-storage).

