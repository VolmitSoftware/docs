---
title: "Features - Governors & Mechanics"
description: "Activation, view distance, hopper, redstone, farm, pathfinding, and incident controls"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Pressure-aware governors and world mechanics cover activation ranges, view ranges, hoppers, redstone, farms, furnaces, pathfinding, random ticks, quarantine, and incident mode. Config: `plugins/React/feature/<id>.toml`. Base `enabled` defaults to `true`.

## Governors and mechanics

Most governors engage only after sustained tick or incident thresholds. They release through configured hysteresis.

### `activation-range-governor`

This feature scales down per-world Spigot entity activation ranges under sustained pressure. It restores those ranges on release. The range change is instant and server-wide. That differs from continuous `dynamic-activation-range`.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2000` | Evaluation interval (ms). |
| `engageTickTimeMs` | double | `55` | Tick ms to engage. |
| `releaseTickTimeMs` | double | `42` | Tick ms to release. |
| `sustainEngageMs` | long | `6000` | Sustained pressure before engage (ms). |
| `sustainReleaseMs` | long | `30000` | Sustained recovery before release (ms). |
| `animalRangeFactor` | double | `0.5` | Animal range scale while engaged. |
| `monsterRangeFactor` | double | `0.6` | Monster range scale. |
| `raiderRangeFactor` | double | `0.8` | Raider range scale. |
| `miscRangeFactor` | double | `0.5` | Misc range scale. |
| `waterRangeFactor` | double | `0.5` | Water-mob range scale. |
| `villagerRangeFactor` | double | `0.5` | Villager range scale. |
| `flyingMonsterRangeFactor` | double | `0.6` | Flying-monster range scale. |
| `minimumRangeBlocks` | int | `8` | Minimum activation range after scaling. |
| `suspendInactiveVillagerTicking` | boolean | `true` | Suspend inactive villager ticking while engaged. |

### `dynamic-activation-range`

This feature lowers the activation radius when tick time rises, pausing distant living entities. It honors `SLEEP` protection, wakes entities for damage and targeting, and does not re-enable AI disabled by another plugin.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `maxEntitiesSampledPerCycle` | int | `240` | Max entities sampled per cycle. |
| `minimumActivationRange` | double | `18` | Min activation range. |
| `maximumActivationRange` | double | `64` | Max activation range. |
| `currentActivationRange` | double | `64` | Current activation radius (blocks). |
| `targetTickMS` | double | `45` | Target tick-time threshold (ms). |
| `criticalTickMS` | double | `70` | Critical tick-time threshold (ms). |
| `minimumEntityAgeTicks` | double | `100` | Minimum entity age. |
| `ignoreTamedEntities` | boolean | `true` | Skip tamed. |
| `ignoreNamedEntities` | boolean | `true` | Skip named. |

### `dynamic-view-distance`

This feature adjusts each world's view and simulation distance from tick time and player count. It restores the previous values when disabled and requires Paper or Purpur.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `updateCooldownSeconds` | int | `120` | Per-world update cooldown (seconds). |
| `warmupSeconds` | int | `45` | Warmup before touching worlds (seconds). |
| `viewDistance` | MinMax | min `6`, max `16` | View distance interpolation range. |
| `simulationDistance` | MinMax | min `4`, max `10` | Simulation distance range. |
| `lerpTickTime` | MinMax | min `45`, max `140` | Tick-time interpolation domain. |
| `lerpPlayersOnline` | MinMax | min `3`, max `100` | Player-count interpolation domain. |

### `afk-view-shedding`

This feature lowers view distance for idle players. It can also cap every player's view distance during pressure, then restores previous values when the conditions clear. Unsupported servers disable it automatically.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `5000` | Evaluation interval (ms). |
| `idleAfterSeconds` | int | `180` | Idle timeout (seconds). |
| `idleSendViewDistance` | int | `4` | Idle send view distance (chunks). |
| `minTickTimeMs` | double | `0` | Tick ms before idle shedding. `0` = always. |
| `pressureNotch` | boolean | `true` | Cap all send view distances under pressure. |
| `pressureSendViewDistanceCap` | int | `8` | Pressure cap (chunks). |
| `pressureEngageTickTimeMs` | double | `70` | Pressure engage tick ms. |
| `pressureReleaseTickTimeMs` | double | `45` | Pressure release tick ms. |
| `pressureSustainEngageMs` | long | `12000` | Sustain engage (ms). |
| `pressureSustainReleaseMs` | long | `30000` | Sustain release (ms). |
| `pressureWarmupSeconds` | int | `45` | Warmup before pressure notch (seconds). |

### `tracker-range-governor`

This feature reduces Spigot entity tracking ranges under pressure and restores them afterward. Unsupported servers disable it automatically.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2000` | Evaluation interval (ms). |
| `engageTickTimeMs` | double | `55` | Tick ms to engage. |
| `releaseTickTimeMs` | double | `42` | Tick ms to release. |
| `sustainEngageMs` | long | `6000` | Sustain engage (ms). |
| `sustainReleaseMs` | long | `30000` | Sustain release (ms). |
| `itemRangeFactor` | double | `0.5` | Item tracking scale. |
| `miscRangeFactor` | double | `0.5` | Misc tracking scale. |
| `displayRangeFactor` | double | `0.6` | Display tracking scale. |
| `animalRangeFactor` | double | `0.75` | Animal tracking scale. |
| `monsterRangeFactor` | double | `0.75` | Monster tracking scale. |
| `otherRangeFactor` | double | `0.75` | Other tracking scale. |
| `minimumRangeBlocks` | int | `16` | Minimum tracking range after scaling. |

### `pathfinder-budget`

This feature reduces the pathfinding budget for distant mobs while the server is under pressure. It restores normal pathfinding afterward and stays inactive when the server bridge is unavailable.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `maxEntitiesSampledPerCycle` | int | `240` | Max mobs sampled per cycle. |
| `engageTickTimeMs` | double | `48` | Tick ms before budgets shrink. |
| `budgetMultiplier` | double | `0.4` | A* budget multiplier for distant mobs. |
| `fullBudgetWithinDistance` | double | `16` | Full budget within this player distance (blocks). |

### `random-tick-governor`

This feature lowers `randomTickSpeed` under sustained pressure. It restores the speed on release.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2000` | Evaluation interval (ms). |
| `engageTickTimeMs` | double | `60` | Tick ms to engage. |
| `engageIncidentScore` | double | `62` | Incident score to engage. |
| `releaseTickTimeMs` | double | `45` | Tick ms to release. |
| `sustainEngageMs` | long | `6000` | Sustain engage (ms). |
| `sustainReleaseMs` | long | `30000` | Sustain release (ms). |
| `reducedRandomTickSpeed` | int | `1` | Random tick speed while engaged. |

### `per-world-tick-budget`

This feature measures per-world tick share. It publishes NORMAL, PRESSURE, or PANIC. Adaptive entity sleep, dynamic activation range, item backpressure, and pathfinder budget consume that per-world state when they apply pressure behavior.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `50` | Evaluation interval (ms). |
| `budgetMs` | double | `35` | PRESSURE threshold (ms). |
| `panicMs` | double | `50` | PANIC threshold (ms). |
| `engageSustainTicks` | int | `60` | Cycles above threshold before engage. |
| `releaseSustainTicks` | int | `60` | Cycles below release before relax. |
| `releaseMs` | double | `28` | Release threshold (ms). |
| `worldOverrides` | `Map<String, WorldBudgetOverride>` | empty | Per-world budget/panic/release overrides. |

### `chunk-quarantine`

This feature scores hot chunks from spawns, redstone, physics, and hoppers. It quarantines those chunks. Under pressure it cancels or freezes activity.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2500` | Evaluation interval (ms). |
| `windowMS` | int | `1600` | Scoring window (ms). |
| `quarantineMS` | int | `12000` | Quarantine duration (ms). |
| `scoreTrigger` | double | `145` | Score to quarantine. |
| `maxTrackedChunks` | int | `4096` | Max tracked chunks. |
| `onlyDuringPressure` | boolean | `true` | Only under pressure. |
| `pressureIncidentScore` | double | `48` | Pressure incident threshold. |
| `pressureTickMS` | double | `58` | Pressure tick threshold (ms). |
| `bypassNearPlayers` | boolean | `true` | Bypass near players. |
| `bypassPlayerRadius` | double | `18` | Bypass radius (blocks). |
| `trackNaturalSpawns` | boolean | `true` | Track natural spawns. |
| `trackSpawnerSpawns` | boolean | `true` | Track spawner spawns. |
| `trackRedstone` | boolean | `true` | Track redstone. |
| `trackPhysics` | boolean | `true` | Track physics. |
| `samplePhysicsEveryN` | int | `3` | Physics sample cadence. |
| `trackHoppers` | boolean | `true` | Track hoppers. |
| `maxExpiryRemovalsPerCycle` | int | `192` | Max stale removals per cycle. |
| `maxExpiryScansPerCycle` | int | `1024` | Max expiry scans per cycle. |
| `maintenanceIntervalMS` | int | `1000` | Maintenance cadence (ms). |

### `circuit-manager`

This feature tracks components of adjacent blocks that produced redstone or piston events. It is an observed-activity model rather than a claim that React reconstructed Minecraft's complete electrical graph. One Bukkit callback counts as one event. Adjacent active components merge completely, a successful block break splits disconnected components, and inactive topology expires deterministically instead of being sampled or randomly discarded.

Once per second React rolls the component event window. If the global `redstone-event-span` exceeds `maxCircuitMS`, React temporarily throttles the busiest unblocked component from that same current window. Redstone current changes are restored and piston events are cancelled until `throttleDurationMS` expires. Attempted events never extend that deadline. The world, representative coordinate, bounds, active-node count, event count, measured span, threshold, and throttle action are stored as a structured incident for React Web.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxCircuitMS` | double | `15` | Global redstone event-span threshold before throttling the busiest current component. |
| `throttleDurationMS` | int | `10000` | Fixed redstone and piston throttle duration. |
| `activityRetentionMS` | int | `15000` | Inactivity time before an observed component and its topology are forgotten. |

### `hopper-chain-coalescing`

This feature detects linear hopper chains and projects savings. Default mode is measurement-only. `featureActMode` plus an NMS hopper hook skips intermediate ticks. Chunk load, unload, and hopper movement events maintain an incremental chain index. Maintenance admits at most `repairChunksPerTick` deduplicated coordinates from an 8,192-entry queue, reads each chunk only on its owner, and never performs a full-world rebuild. Act mode submits at most 128 synthesized transfer tasks per tick. When `featureBucketBypass` is `false`, a synthesized transfer consumes the active hopper token bucket's source-chunk budget; a rejected or incomplete transfer leaves that chain on vanilla ticking.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `bypassRadius` | int | `16` | Player bypass radius (blocks). |
| `minChainLength` | int | `4` | Minimum chain length. |
| `rebuildIntervalTicks` | int | `200` | Minimum age before an Observer coordinate becomes eligible for another maintenance repair. It does not trigger a full rebuild. |
| `repairChunksPerTick` | int | `32` | Coordinate repairs admitted per tick; runtime values are clamped to `1..256`. |
| `engageOnIncident` | double | `60` | Incident score to engage accounting. |
| `engageOnTickMs` | double | `58` | Tick ms to engage. |
| `releaseOnTickMs` | double | `45` | Tick ms to release. |
| `featureActMode` | boolean | `false` | Skip intermediate hopper ticks when eligible. |
| `featureBucketBypass` | boolean | `false` | Bypass the active hopper token bucket for synthesized transfers (act mode). |

### `hopper-item-index`

This feature maintains spatial indices of dropped items and hoppers for `TweakHopperIndex`. Item and hopper relocation is serialized by UUID, and chunk/world removal clears both the primitive index and its reverse references.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `reconcileIntervalMs` | int | `2000` | Reconciliation interval (ms). |

### `hopper-token-bucket`

This feature applies a per-chunk token bucket that limits hopper item moves. It cancels event-driven moves when the bucket is empty and supplies the same source-chunk budget to hopper-chain synthesized transfers.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `3000` | Evaluation interval (ms). |
| `bucketCapacity` | double | `120` | Bucket capacity. |
| `refillPerSecond` | double | `55` | Token refill rate. |
| `costPerMove` | double | `1` | Cost per hopper move. |
| `bypassWhenNearbyPlayers` | boolean | `true` | Bypass near players. |
| `bypassPlayerRadius` | double | `16` | Bypass radius (blocks). |

### `redstone-clock-governor`

This feature throttles high-frequency redstone clocks via `BlockRedstoneEvent` (hold current). No NMS.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2000` | Evaluation interval (ms). |
| `windowMS` | int | `1000` | Transition window (ms). |
| `maxTransitionsPerWindow` | int | `12` | Max transitions per window. |
| `cooloffMS` | int | `6000` | Cool-off after throttle (ms). |
| `bypassWithinPlayerRadius` | double | `16` | Player bypass radius (blocks). |
| `onlyThrottleWithoutNearbyPlayers` | boolean | `true` | Only throttle remote clocks. |

### `crop-fast-forward`

When a chunk wakes after long dormancy, this feature advances crop and sapling growth. It **silences under high load**. That polarity is the opposite of most governors. Each pass consumes at most 128 immutable coordinates from the Observer rotation, evaluates each loaded chunk only on its owning server or region thread, and retires queued work from an older activation. It does not enumerate every loaded chunk.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2500` | Evaluation interval (ms). |
| `activeRange` | int | `64` | Player range classifying chunk active (blocks). |
| `minElapsedTicks` | int | `200` | Min dormant ticks before fast-forward. |
| `maxFastForwardTicks` | int | `24000` | Cap on dormant ticks fed into growth math. |
| `engageOnIncident` | double | `30` | Incident score **above** which feature stops. |
| `engageOnTickMs` | double | `50` | Tick ms **above** which feature stops. |
| `releaseOnIncident` | double | `22` | Incident score to resume after silence. |
| `releaseOnTickMs` | double | `42` | Tick ms to resume after silence. |
| `maxTrackedChunks` | int | `32768` | Max tracked chunks. |
| `maxAdvancesPerPass` | int | `1024` | Max block updates per pass. |
| `saplingGrowthChance` | double | `0.142` | Sapling growth probability for proportional math. |

### `farm-burst-smoother`

When farm growth events burst, this feature cancels only growth changes that it successfully queues, then reapplies them on a delayed budgeted schedule. Lowering `maxPendingUpdates` stops new intake until the queue falls below the new cap; it does not prune already-cancelled growth. A stale entry becomes immediately eligible and bypasses the nearby-player delay instead of being discarded. A successful world unload retires that world's queued changes and any owner-task claims because their blocks are leaving runtime; a cancelled unload preserves them. Deactivation stops intake first and force-applies valid pending changes on the Paper server thread or Folia owning regions for up to `shutdownDrainTimeoutMS`; failed or temporarily unavailable changes are retried during that drain and retained if it cannot finish. A nonempty remainder throws a deactivation failure so shutdown cannot report success after losing cancelled growth.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `100` | Evaluation interval (ms). |
| `burstWindowMS` | int | `1200` | Burst window (ms). |
| `burstTriggerCount` | int | `72` | Growth events to trigger smoothing. |
| `minApplyDelayTicks` | int | `2` | Min apply delay (ticks). |
| `maxApplyDelayTicks` | int | `16` | Max apply delay (ticks). |
| `maxAppliesPerCycle` | int | `24` | Max applies per cycle. |
| `maxPendingUpdates` | int | `2500` | Max pending updates. |
| `stalePendingMS` | int | `15000` | Age at which pending growth is force-applied (ms). |
| `shutdownDrainTimeoutMS` | int | `2000` | Bounded owner-thread drain deadline during deactivation (ms). |
| `onlyDuringPressure` | boolean | `true` | Only under pressure. |
| `pressureIncidentScore` | double | `42` | Pressure incident threshold. |
| `pressureTickMS` | double | `52` | Pressure tick threshold (ms). |
| `bypassNearPlayers` | boolean | `true` | Bypass near players. |
| `bypassPlayerRadius` | double | `10` | Bypass radius (blocks). |

### `furnace-brew-batching`

This feature tracks furnaces and brewing stands. With NMS hooks, it skips intermediate ticks away from players under pressure. Without a bridge it stays measurement-only. Load and unload events maintain a world-qualified block-entity index; startup and repair consume at most `reseedChunksPerTick` Observer coordinates per tick, clamped to `1..256`. One measurement tick inspects at most 512 indexed entries through at most 32 owner-region tasks, so activation and dense worlds cannot create an unbounded chunk or task fan-out.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `bypassRadius` | int | `16` | Player bypass radius (blocks). |
| `engageIncidentScore` | double | `55` | Incident score to engage. |
| `engageTickTimeMs` | double | `55` | Tick ms to engage. |
| `releaseTickTimeMs` | double | `42` | Tick ms to release. |
| `sustainEngageMs` | long | `6000` | Sustain engage (ms). |
| `sustainReleaseMs` | long | `30000` | Sustain release (ms). |
| `maxTrackedEntries` | int | `8192` | Max tracked block entities. |
| `reseedChunksPerTick` | int | `32` | Max chunks reseeded per maintenance tick. |

### `fast-leaf-decay`

This feature accelerates leaf decay around break and decay events. It drains a bounded number of roots per evaluation, groups each radius scan by owning chunk, and de-duplicates overlapping block coordinates inside each chunk batch. One shared `maxSyncSpikeMS` budget bounds the combined owned-thread work admitted by that evaluation, including across Folia regions. Every root and chunk task is tied to the activation that claimed it, so deactivation prevents queued scans from breaking more leaves. Cancelled break and decay events are ignored. Fast block removal is optional. Decay sounds use the world's native localized sound delivery rather than one send per online player.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `leafDecayDistance` | int | `6` | Leaf distance threshold for decay eligibility. |
| `leafDecayRadius` | int | `5` | Scan radius around seed (blocks). |
| `maxAsyncMS` | double | `10` | Max async work (ms). |
| `maxSyncSpikeMS` | double | `10` | Max sync spike (ms). |
| `tickIntervalMS` | int | `250` | Evaluation interval (ms). |
| `decayTriggerCooldownMS` | int | `250` | Trigger cooldown (ms). |
| `decayTickSpread` | int | `20` | Maximum decay roots admitted to chunk batches per evaluation; clamped to at least one. |
| `soundChance` | double | `0.25` | Sound probability. |
| `soundVolume` | double | `0.26` | Sound volume. |
| `soundPitch` | double | `0.2` | Sound pitch. |
| `forceDecayPersistent` | boolean | `false` | Force decay persistent leaves. |
| `playSounds` | boolean | `true` | Play decay sounds. |
| `fastBlockChanges` | boolean | `true` | Use fast block changes. |
| `decaySound` | String | `minecraft:block.azalea_leaves.fall` | Decay sound key. |

### `incident-mode`

This feature enters a sustained incident state from high incident score or tick time. It waits for startup grace first. Then it rate-limits spawner and natural spawns, portals, hopper moves, and redstone until calm. See also [12 - Incident Mode & Playbooks](/react/12-incident-mode-playbooks).

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `enterIncidentScore` | double | `58` | Enter on incident score. |
| `exitIncidentScore` | double | `35` | Exit below this score. |
| `enterTickMS` | double | `60` | Enter on tick ms. |
| `exitTickMS` | double | `46` | Exit below this tick ms. |
| `minimumIncidentDurationMS` | int | `8000` | Minimum incident duration (ms). |
| `startupGraceMS` | int | `60000` | Startup grace (ms). |
| `rateWindowMS` | int | `1000` | Rate-limit window (ms). |
| `maxSpawnerSpawnsPerWindow` | int | `28` | Max spawner spawns per window. |
| `maxNaturalSpawnsPerWindow` | int | `70` | Max natural spawns per window. |
| `maxPortalEventsPerWindow` | int | `18` | Max portal events per window. |
| `maxHopperMovesPerWindow` | int | `120` | Max hopper moves per window. |
| `maxRedstoneTransitionsPerWindow` | int | `220` | Max redstone transitions per window. |
| `bypassNearPlayers` | boolean | `true` | Bypass near players. |
| `bypassPlayerRadius` | double | `14` | Bypass radius (blocks). |
| `verboseTransitions` | boolean | `true` | Log transitions. |
