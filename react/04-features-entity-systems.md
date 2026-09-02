---
title: "Features - Entity Systems"
description: "React documentation: Features - Entity Systems"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Entity-side features cover stacking, sleep, trim, items, spawns, vehicles, portals, and explosions. Config: `plugins/React/feature/<id>.toml`. Base field `enabled` defaults to `true`.

Stacking, trim, and sleep honor the protection API. See [17 - API - Entity Protection](/react/17-api-entity-protection). The operations are `STACK`, `TRIM`, and `SLEEP`.

### `mob-stacking`

This feature merges compatible living entities into stacks. Stack count uses health or `ReactEntity`. Optional custom names and vacuum collect packets are available. The feature processes dirty chunks on a batch interval.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxStackSize` | int | `10` | Maximum stack size. |
| `maxHealth` | double | `100` | Maximum health for stack targets. |
| `stackableTypes` | `Set<EntityType>` | see notes | Types allowed to stack. |
| `customNames` | boolean | `true` | Apply custom stack names. |
| `searchRadius` | double | `6` | Search radius (blocks). |
| `vacuumEffect` | boolean | `true` | Send vacuum/collect packet effect. |
| `skipCustomMobs` | boolean | `true` | Skip custom/plugin mobs. |
| `onlySpawnerMobs` | boolean | `false` | Only stack spawner-origin mobs. |
| `batchIntervalMs` | int | `250` | How often queued chunks process (ms). |

### `adaptive-entity-sleep`

This feature puts distant living entities into sleep or pause under load. Optional mid-range duty-cycling uses `Mob#setAware` when available. It wakes on damage or target when configured.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `maxEntitiesSampledPerCycle` | int | `320` | Max entities sampled per cycle. |
| `minimumEntityAgeTicks` | int | `200` | Minimum age before sleep eligible. |
| `sleepBeyondNearestPlayer` | double | `48` | Distance from players to sleep (blocks). |
| `ignoreNamedEntities` | boolean | `true` | Skip named entities. |
| `ignoreTamedEntities` | boolean | `true` | Skip tamed entities. |
| `ignorePersistentEntities` | boolean | `true` | Skip persistent entities. |
| `ignoreVillagers` | boolean | `true` | Skip villagers. |
| `ignoreBosses` | boolean | `true` | Skip bosses. |
| `wakeOnDamage` | boolean | `true` | Wake on damage. |
| `wakeOnTarget` | boolean | `true` | Wake on target. |
| `dutyCycleEnabled` | boolean | `true` | Duty-cycle awareness between duty and sleep distance under load. |
| `dutyCycleStartDistance` | double | `24` | Distance where duty-cycling begins (blocks). |
| `dutyCycleSlots` | int | `4` | Rotating awareness slots. |
| `dutyCycleMinTickMs` | double | `42` | Tick ms required before duty-cycling engages. |

### `entity-trimmer`

When entity counts exceed soft caps, this feature removes lowest-priority eligible entities in batches. Soft caps apply per chunk, per player, and per world.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `skipCustomMobs` | boolean | `false` | Skip custom mobs. |
| `protectNamedEntities` | boolean | `true` | Protect entities with nonblank custom names. Disable to make them eligible for trimming. |
| `playerMobBlockDistance` | int | `32` | Player proximity radius (blocks). |
| `blacklist` | `List<EntityType>` | displays, player, armor stands, frames, carts, boats, projectiles, items, TNT, … | Types never trimmed. |
| `printEntityPurgeSuccess` | boolean | `true` | Log successful purges. |
| `softMaxEntitiesPerChunk` | int | `11` | Soft max entities per chunk. |
| `softMaxEntitiesPerPlayer` | int | `100` | Soft max entities per player. |
| `softMaxEntitiesPerWorld` | int | `1000` | Soft max entities per world. |
| `priorityPercentCutoff` | double | `0.1` | Priority cutoff fraction when ordering targets; finite values clamp to `0..1`. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `opporunityThreshold` | double | `0.25` | Opportunity threshold for trim passes. |
| `minKillBatchSize` | int | `100` | Minimum kill batch size; values above the 512-removal cycle limit prevent a trim pass. |

### `item-super-stacker`

This feature merges nearby dropped items into flagged bundles. Pickup explodes the bundle into inventory. Matching ordinary stacks consolidate directly up to their native stack limit instead of waiting for Minecraft's item-merge timer. Spawn and sampled signals feed a capped weak chunk index and one queued flight per bucket instead of starting a nearby-entity enumeration for every item; at most 64 buckets dispatch per 50 ms evaluation, and one owner pass acquires no more than the configured merge budget plus its collector, hard-capped at 65 candidates. Adjacent indexed chunks preserve radius coverage, while Folia filters ownership before reading a target. One pass can consume several nearby entities but stops at its configured budget; only its first merge emits the particle trail. Merge sounds use the immutable nearby-player index, reach at most 64 recipients within a 32-block horizontal radius, and run each send on that player's owner. When Gloss is present, React immediately refreshes the surviving entity after creating a bundle or changing a hopper residual bundle, so the visible label describes the current contents instead of retaining the previous target item. React removes the Gloss presentation before deleting a bundle, republishes loaded flagged bundles, and reconciles sampled bundles through a 30-second per-entity cache. Gloss owns display creation and renders the React-configured bundle header, material rows, and remainder row vertically while real drops are active.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxItemsPerBundle` | int | `64` | Max items per bundle. |
| `searchRadius` | double | `3` | Search radius (blocks). |
| `mergeMatchingStacks` | boolean | `true` | Immediately consolidate similar ordinary stacks up to the material's native maximum. |
| `maxMergesPerPass` | int | `16` | Nearby entities one pass may consume; runtime use is bounded to 1 – 64. |
| `spawnMergeDelayTicks` | int | `1` | Delay before the first post-spawn cluster pass; runtime use is bounded to 1 – 20 ticks. |
| `glossBundleHeaderFormat` | string | `"&eBundle &8(&e{total} items&8)"` | First vertical line. `{total}` is the summed item count. |
| `glossBundleEntryFormat` | string | `"&7- &f{count}x {type}"` | One vertical line per aggregated material. |
| `glossBundleMoreFormat` | string | `"&8+{remaining} more"` | Final line when material types were hidden by the limit. |
| `glossBundleEntryLimit` | int | `3` | Material rows shown before the remainder row; clamped to 1 – 10. |

These settings are available in React Web and the in-game configurator. Gloss is optional; without it, bundling and pickup still work but use no Gloss display.

### `item-backpressure`

Under high tick time or entity count, this feature removes remote ground items away from players. Per-world pressure can also trigger it. Age, name, and valuable protections apply.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `triggerTickTimeMS` | double | `60` | Tick-time trigger (ms). |
| `triggerEntityCount` | int | `5000` | Entity-count trigger. |
| `maxItemsScannedPerWorld` | int | `220` | Aggregate candidate scan budget per evaluation. The retained config key predates the cross-world budget. |
| `maxItemsRemovedPerCycle` | int | `90` | Max items removed per cycle. |
| `minimumItemAgeTicks` | int | `200` | Minimum item age. |
| `noPlayerRadius` | double | `40` | No-player radius (blocks). |
| `protectNamedItems` | boolean | `true` | Protect named items. |
| `protectValuables` | boolean | `true` | Protect valuable materials. |
| `valuables` | `Set<Material>` | netherite, nether star, diamond, elytra, totem, … | Valuable materials set. |

### `spawn-burst-limiter`

This feature cancels `CreatureSpawnEvent` bursts per chunk over a rolling window. Caps cover total, spawner, and monster spawns. It can push spawner delay when spawner spawns are limited.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `5000` | Evaluation interval (ms). |
| `windowMS` | int | `1200` | Rolling window (ms). |
| `maxSpawnsPerChunkWindow` | int | `22` | Max spawns per chunk window. |
| `maxSpawnerSpawnsPerChunkWindow` | int | `10` | Max spawner spawns per chunk window. |
| `maxMonsterSpawnsPerChunkWindow` | int | `15` | Max monster spawns per chunk window. |
| `enforceNaturalSpawns` | boolean | `true` | Enforce natural spawns. |
| `enforceSpawnerSpawns` | boolean | `true` | Enforce spawner spawns. |
| `enforceMonsterSpawns` | boolean | `true` | Enforce monster spawns. |
| `ignoreNamedEntities` | boolean | `true` | Skip named entities. |
| `spawnerBackoff` | boolean | `true` | Delay spawners that hit the burst limit. |
| `spawnerBackoffTicks` | int | `600` | Backoff delay (ticks). |

### `spawner-light-cache`

This feature caches dark-candidate light snapshots per chunk for spawner and `TRIAL_SPAWNER` monster spawns. It stays measurement-only until engaged under pressure. Then it cancels spawns when no dark candidate matches.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2000` | Evaluation interval (ms). |
| `bypassRadius` | int | `8` | Player bypass radius (blocks). |
| `darkLightMax` | int | `7` | Max block light for dark candidate. |
| `invalidationIntervalTicks` | int | `200` | Snapshot TTL (ticks). |
| `maxTrackedChunks` | int | `4096` | Max cached chunk snapshots. |
| `engageIncidentScore` | double | `60` | Incident score to engage cancellation. |
| `engageTickTimeMs` | double | `58` | Tick ms to engage cancellation. |
| `releaseTickTimeMs` | double | `45` | Tick ms to release to measurement-only. |

### `lazy-gravity`

This feature tracks falling blocks on clear vertical paths. With an NMS bridge and pressure gate, it can `SKIP` falling-block ticks away from players.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `bypassRadius` | int | `24` | Player bypass radius (blocks). |
| `engageIncidentScore` | double | `55` | Incident score to engage. |
| `engageTickTimeMs` | double | `55` | Tick ms to engage. |
| `releaseTickTimeMs` | double | `42` | Tick ms to release. |
| `sustainEngageMs` | long | `6000` | Sustained pressure before engage (ms). |
| `sustainReleaseMs` | long | `30000` | Sustained recovery before release (ms). |
| `maxTrackedTasks` | int | `8192` | Max tracked falling-block tasks. |
| `reapPerTick` | int | `1024` | Max reaped expired tasks per maintenance tick. |

### `minecart-tether`

This feature zeroes velocity on minecart entity types when no player is within `maxBlockDistance`.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxBlockDistance` | double | `32` | Max distance without player (blocks). |

### `portal-traffic-smoother`

This feature atomically throttles player and non-player portal traffic per destination chunk over a window. When over caps, it first claims global delayed capacity, then cancels the portal and starts an asynchronous teleport after a short entity-owned delay, allowing Paper or Folia to marshal cross-region and cross-world traversal safely. A full queue, zero capacity, or duplicate entity claim leaves the event uncancelled for vanilla handling. An accepted claim stays held until the teleport future settles; expired, retired, failed, or completed work releases its exact claim. Delayed callbacks are generation-gated and cannot start traversal after the feature is deactivated or restarted.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2000` | Evaluation interval (ms). |
| `windowMS` | int | `1000` | Rolling window (ms). |
| `maxPlayerPortalsPerChunkWindow` | int | `6` | Max player portals per chunk window. |
| `maxEntityPortalsPerChunkWindow` | int | `16` | Max entity portals per chunk window. |
| `cooloffMS` | int | `5000` | Cool-off after throttle (ms). |
| `playerDelayTicks` | int | `2` | Player re-teleport delay (ticks). |
| `entityDelayTicks` | int | `4` | Entity re-teleport delay (ticks). |
| `maxQueuedDelays` | int | `512` | Global maximum number of delayed teleports across all regions. Rejected admission leaves vanilla portal handling unchanged. |
| `onlyDuringPressure` | boolean | `true` | Only under pressure. |
| `pressureIncidentScore` | double | `40` | Pressure incident threshold. |
| `pressureTickMS` | double | `52` | Pressure tick-time threshold (ms). |
| `bypassNearPlayers` | boolean | `true` | Bypass near players. |
| `bypassPlayerRadius` | double | `10` | Bypass radius (blocks). |

### `explosion-packet-batching`

This feature collects pressure-gated explosions and clusters them by `mergeRadius`. Cluster lookup uses a three-dimensional spatial index, so a full per-world buffer does not compare every explosion with every other explosion. The NMS hook binds its suppression decision to the exact packet object and marks which candidates actually had their vanilla packets intercepted; only those candidates can produce a merged broadcast. Suppression admission reserves one slot from the global `maxSuppressedExplosionDebt`; saturation leaves additional packets vanilla. Merged clusters are retained and a Paper main-thread task successfully broadcasts at most `maxMergedBroadcastsPerTick` across all worlds each server tick, so a worst-case 4096-cluster debt takes at most 64 successful ticks to flush with the defaults. A failed send stays at the head for a later tick without releasing its debt. A collected world is resolved again by UUID if its weak reference expires; transient resolution failures retain the batch, while a world that Bukkit confirms is no longer loaded records the affected suppressed-explosion count, emits a full contextual error, and releases only that world's remaining debt so later worlds can continue. Deactivation serializes against an in-flight drain and attempts every retained replacement broadcast for at most `shutdownDrainTimeoutMS`; a send failure, unresolved world or bridge, or timeout fails deactivation while retaining all unsent debt for an exact retry. Near-player candidates, buffer overflow, hook mismatches, and lifecycle races keep vanilla packets.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `bypassRadius` | int | `16` | Player bypass radius in blocks; negative values act as `0`. |
| `mergeRadius` | int | `12` | Cluster merge radius in blocks; values below `1` act as `1`. |
| `engageIncidentScore` | double | `55` | Incident score to engage. |
| `engageTickTimeMs` | double | `55` | Tick ms to engage. |
| `releaseTickTimeMs` | double | `42` | Tick ms to release. |
| `sustainEngageMs` | long | `6000` | Sustained pressure before engage (ms). |
| `sustainReleaseMs` | long | `30000` | Sustained recovery before release (ms). |
| `maxBufferedPerWorld` | int | `4096` | Per-world candidate buffer; values below `64` act as `64`. |
| `mergedBroadcastRangeBlocks` | int | `64` | Merged broadcast range in blocks; values below `16` act as `16`. |
| `maxMergedBroadcastsPerTick` | int | `64` | Global retained-cluster broadcasts per server tick; clamped to `1..1024`. |
| `maxSuppressedExplosionDebt` | int | `4096` | Global suppressed explosions awaiting merged delivery; clamped to `0..65536`. |
| `shutdownDrainTimeoutMS` | int | `2000` | Maximum deactivation drain time; negative values act as `0`. A timeout retains debt and fails deactivation. |

### `fast-explosions`

This feature spreads expensive block destruction across multiple ticks. Explosion modes that do not destroy blocks remain unchanged.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxPrimesPerTick` | int | `3` | Max TNT blocks retained for vanilla chain priming per 50 ms budget window. |
| `spreadPrimedFuseTicks` | int | `7` | Fuse spread between chained primed TNT (ticks). |
| `maxExplosionChainsPerTick` | int | `3` | Max optional TNT chain explosions per 50 ms budget window. |
| `fastBlockUpdates` | boolean | `true` | Fast block updates. |
| `disableEntityChainReactions` | boolean | `false` | Disable entity chain reactions. |
| `explosionChainReactions` | boolean | `false` | Allow limited chain explosions. |
| `shutdownDrainTimeoutMS` | int | `2000` | Maximum disable drain time for admitted work (ms). |
| `maxPendingBlocksGlobal` | int | `16384` | Maximum admitted blocks retained across all worlds. |
| `maxPendingBlocksPerWorld` | int | `8192` | Maximum admitted blocks retained for one world. |
| `maxBlocksPerOwnerExecution` | int | `128` | Maximum blocks processed by one owner callback, hard-capped at `4096`. |
