---
title: "Actions Catalog"
description: "React documentation: Actions Catalog"
published: true
date: 2026-08-21T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Operator-invoked actions queue one-shot cleanup or lag-response jobs. Every action TOML contains inherited `enabled = true`. Command and API invocation parameters are separate objects created for each ticket. React does not persist them to TOML.

List actions with `/react action audit` (aliases `list`, `ls`). Disabling an action prevents new tickets from running.

The HTTP action API marks `purge-entities`, `purge-chunks`, `collect-garbage`, `action-quarantine-hot-chunks`, `action-trim-entities-by-age-priority`, and `action-incident-playbook` as destructive. Executing any of those exact IDs requires an admin token and `confirm:true`; operator tokens can execute only non-destructive actions. The canonical runtime IDs are also the authorization-gate IDs, so the three `action-`-prefixed actions cannot bypass confirmation.

### `collect-garbage`

This action requests JVM garbage collection. It reports reclaimed heap.

- **Class:** `ActionCollectGarbage`
- **Config:** `plugins/React/action/collect-garbage.toml`
- **CLI:** `/react action collect-garbage` (alias `gc`)
- **TOML fields:** `enabled`

| Execution parameter | Type | Default | Description |
|---|---|---|---|
| `postGcWaitTicks` | int | `2` | Ticks to wait after requesting GC before sampling memory. |

### `purge-chunks`

This action attempts to unload selected chunks in a world or area.

- **Class:** `ActionPurgeChunks`
- **Config:** `plugins/React/action/purge-chunks.toml`
- **CLI:** `/react action purge-chunks [world=ALL]` (alias `pc`)
- **TOML fields:** `enabled`

| Execution parameter | Type | Default | Description |
|---|---|---|---|
| `area` | `AreaActionParams` | builder defaults | Area selection for target chunks. |

### `purge-entities`

This action purges matching entities in an area. Age and filter guards apply.

- **Class:** `ActionPurgeEntities`
- **Config:** `plugins/React/action/purge-entities.toml`
- **CLI:** `/react action purge-entities [radius=0] [world=ALL]` (alias `pe`). A positive player radius is clamped to 10 chunks. Zero does not add a radius restriction.
- **Notes:** honors entity protection

TOML fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this action. |
| `blacklist` | list of entity types | built-in protected list | Entity types excluded when `defaultBlacklist` is enabled. |
| `defaultBlacklist` | boolean | `true` | Applies the built-in entity type blacklist. |
| `secondsToPurge` | int | `5` | Minimum age in seconds before matching entities are removed. |

Execution parameters:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `area` | `AreaActionParams` | builder defaults | Area selection for target entities. |
| `entityFilter` | `FilterParams<EntityType>` | builder defaults | Include/exclude entity type filter. |

### `action-quarantine-hot-chunks`

This action isolates the hottest sampled chunks. Unload and cull options are available.

- **Class:** `ActionQuarantineHotChunks`
- **Config:** `plugins/React/action/action-quarantine-hot-chunks.toml`
- **CLI:** `/react action quarantine-hot-chunks [max-chunks=24] [min-score=90] [world=ALL]` (alias `aqhc`). The command clamps chunk count to 1–256 and score to at least zero.
- **TOML fields:** `enabled`

| Execution parameter | Type | Default | Description |
|---|---|---|---|
| `world` | String | null/empty | Optional world name filter. |
| `maxChunks` | int | `24` | Maximum chunks processed. |
| `minimumChunkScore` | double | `90` | Minimum chunk score to qualify. |
| `unsafePlayerRadius` | double | `56` | Skip chunks with players within this radius (blocks). |
| `unloadChunk` | boolean | `true` | Unload qualifying chunks. |
| `cullEntities` | boolean | `true` | Cull entities in qualifying chunks. |
| `includeNeighborRing` | boolean | `true` | Include neighbor chunk ring. |
| `minEntityAgeTicks` | int | `200` | Minimum entity age before cull. |
| `protectNamed` | boolean | `true` | Protect named entities. |
| `protectTamed` | boolean | `true` | Protect tamed entities. |
| `protectBosses` | boolean | `true` | Protect boss entities. |

### `action-trim-entities-by-age-priority`

This action trims old low-priority entities. Protection guards apply.

- **Class:** `ActionTrimEntitiesByAgePriority`
- **Config:** `plugins/React/action/action-trim-entities-by-age-priority.toml`
- **CLI:** `/react action trim-entities-by-age-priority [max-entities=600] [min-age-seconds=300] [world=ALL]` (alias `ateap`). The command clamps the maximum to 1–10,000 and age to at least one second.
- **Notes:** honors entity protection
- **TOML fields:** `enabled`

| Execution parameter | Type | Default | Description |
|---|---|---|---|
| `world` | String | null/empty | Optional world name filter. |
| `maxTrim` | int | `600` | Maximum entities trimmed total. |
| `maxTrimPerChunk` | int | `12` | Maximum trimmed per chunk. |
| `minEntityAgeTicks` | int | `6000` | Minimum entity age (`20 * 60 * 5` ticks). |
| `protectNamed` | boolean | `true` | Protect named entities. |
| `protectTamed` | boolean | `true` | Protect tamed entities. |
| `protectVillagers` | boolean | `true` | Protect villagers. |
| `protectBosses` | boolean | `true` | Protect bosses. |
| `protectNearPlayers` | boolean | `true` | Protect entities near players. |
| `playerProtectRadius` | double | `24` | Player protect radius (blocks). |
| `allowItems` | boolean | `true` | Allow trimming items. |
| `allowMonsters` | boolean | `true` | Allow trimming monsters. |
| `allowNonLiving` | boolean | `false` | Allow trimming non-living entities. |

### `action-hopper-network-normalize`

This action normalizes hopper hotspots. It merges nearby transfer items. It can unload idle hot chunks.

- **Class:** `ActionHopperNetworkNormalize`
- **Config:** `plugins/React/action/action-hopper-network-normalize.toml`
- **CLI:** `/react action hopper-network-normalize [max-chunks=20] [min-hopper-updates=25] [world=ALL]` (alias `ahnn`). The command clamps the chunk count to 1–256 and update threshold to at least one.
- **TOML fields:** `enabled`

| Execution parameter | Type | Default | Description |
|---|---|---|---|
| `world` | String | null/empty | Optional world name filter. |
| `maxChunks` | int | `20` | Maximum chunks processed. |
| `minimumHopperUpdatesPerChunk` | double | `25` | Minimum hopper activity to qualify. |
| `unsafePlayerRadius` | double | `24` | Skip near players (blocks). |
| `itemMergeRadius` | double | `2` | Item merge radius (blocks). |
| `maxMergedItemEntitiesPerChunk` | int | `48` | Cap on merged item entities per chunk. |
| `unloadIdleHotChunks` | boolean | `true` | Unload idle hot chunks after normalize. |

### `action-prewarm-critical-chunks`

This action preloads critical sampled chunks and neighbors.

- **Class:** `ActionPrewarmCriticalChunks`
- **Config:** `plugins/React/action/action-prewarm-critical-chunks.toml`
- **CLI:** `/react action prewarm-critical-chunks [max-chunks=40] [neighbor-radius=1] [world=ALL]` (alias `apcc`). The command clamps chunk count to 1–512 and radius to 0–4 chunks.
- **TOML fields:** `enabled`

| Execution parameter | Type | Default | Description |
|---|---|---|---|
| `world` | String | null/empty | Optional world name filter. |
| `maxChunks` | int | `40` | Maximum chunks processed. |
| `neighborRadius` | int | `1` | Neighbor ring radius (chunks). |
| `includePlayerChunks` | boolean | `true` | Include chunks around players. |
| `playerChunkRadius` | int | `1` | Player chunk radius. |
| `generateMissingChunks` | boolean | `true` | Generate missing chunks when prewarming. |
| `touchChunkSnapshot` | boolean | `true` | Touch chunk snapshot during prewarm. |

### `action-incident-playbook`

This action queues quarantine, trim, hopper normalization, prewarm, and optional garbage-collection tickets. Tickets are scaled by tier. The child tickets are queued independently and may overlap. The playbook ticket does not wait for them to finish.

- **Class:** `ActionIncidentPlaybook`
- **Config:** `plugins/React/action/action-incident-playbook.toml`
- **CLI:** `/react action incident-playbook [include-gc=true] [tier=-1] [world=ALL]` (alias `aip`). Tier is clamped to `-1`–`2`.
- **TOML fields:** `enabled`

| Execution parameter | Type | Default | Description |
|---|---|---|---|
| `world` | String | null/empty | Optional world name filter. |
| `includeGarbageCollection` | boolean | `true` | Include GC in the playbook. |
| `tierOverride` | int | `-1` | Force mitigation tier. `-1` infers from incident score and tick MS. |
