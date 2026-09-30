---
title: "Features - Governors & Mechanics"
description: "Activation, view distance, hopper, redstone, farm, pathfinding, and incident controls"
published: true
date: 2026-09-30T00:00:00.000Z
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

This feature lowers the activation radius when tick time rises, pausing distant living entities. It honors `SLEEP` protection, wakes the entities it paused when they take damage, target something, or are targeted, and does not re-enable AI disabled by another plugin.

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

Looking at a container preview does not reset the player's idle timer.

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

This feature scores hot chunks from spawns, redstone, physics, and hoppers, and quarantines a chunk whose score reaches `scoreTrigger` within one `windowMS` window. For `quarantineMS`, a quarantined chunk has its tracked spawns, sampled physics updates (1 in `samplePhysicsEveryN`), and hopper moves cancelled and its redstone held, for each kind whose `track*` option is enabled. With `bypassNearPlayers` enabled, nothing is cancelled or held while a player is within `bypassPlayerRadius`. Tracked spawns are natural spawns when `trackNaturalSpawns` is enabled and spawner spawns when `trackSpawnerSpawns` is enabled. With `onlyDuringPressure` enabled, chunks are scored only while tick time or incident score is above the pressure thresholds, or while a quarantine is still running; at other times the feature does no per-event work.

The feature tracks at most `maxTrackedChunks` chunks. When the table is full, the chunk with the oldest activity is dropped to make room for a new one. A chunk entry is stale once it has had no activity for the longer of 8 × `windowMS` and 2 × `quarantineMS` and is not quarantined; each maintenance cycle removes stale entries oldest first, up to `maxExpiryRemovalsPerCycle`.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2500` | Evaluation interval (ms). |
| `windowMS` | int | `1600` | Scoring window (ms). |
| `quarantineMS` | int | `12000` | Quarantine duration (ms). |
| `scoreTrigger` | double | `145` | Score to quarantine. |
| `maxTrackedChunks` | int | `4096` | Max tracked chunks; when full, the chunk with the oldest activity is dropped for a new one. |
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
| `maxExpiryRemovalsPerCycle` | int | `192` | Max stale entries removed per maintenance cycle (at least 16). |
| `maxExpiryScansPerCycle` | int | `1024` | Max entries checked per maintenance cycle (at least `maxExpiryRemovalsPerCycle`). |
| `maintenanceIntervalMS` | int | `1000` | Maintenance cadence (ms). |

### `circuit-manager`

Tracks groups of adjacent blocks that fire redstone or piston events, and throttles the busiest one when the server's total redstone time crosses `maxCircuitMS`. Redstone is held at its current state and piston events are cancelled until the throttle expires.

This is an observed-activity model, not a reconstruction of Minecraft's full redstone graph.

When total redstone time passes `maxCircuitMS`, React throttles the single busiest component for
`throttleDurationMS`: its redstone is held at its current state and its piston events are cancelled.
Further activity does not extend the throttle. Each one is recorded as an incident in React Web,
with the world, coordinate, event count and measured time.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `maxCircuitMS` | double | `15` | Global redstone event-span threshold before throttling the busiest current component. |
| `throttleDurationMS` | int | `10000` | Fixed redstone and piston throttle duration. |
| `activityRetentionMS` | int | `15000` | Inactivity time before an observed component and its topology are forgotten. |

### `hopper-chain-coalescing`

Detects linear hopper chains and reports what skipping their intermediate ticks would save. Measurement-only by default; set `featureActMode` and supply an NMS hopper hook to actually skip them.

Placing or breaking a hopper, comparator, repeater, or any inventory block (chests, copper chests, barrels, shulker boxes, furnaces, brewing stands, droppers, dispensers, crafters, lecterns, jukeboxes, decorated pots, chiseled bookshelves, and shelves) queues a chain repair for the surrounding chunks. While accounting is engaged, the `hopper-chain-coalescing` sampler reports HC/s: each second it adds the length minus one of every fast-path-eligible chain outside `bypassRadius`. The reported rate does not depend on `tickIntervalMS`.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms); runtime values are at least `250`. |
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

This feature maintains spatial indices of dropped items and hoppers for `TweakHopperIndex`. Item and hopper relocation is serialized by UUID, and chunk/world removal clears both the primitive index and its reverse references. An item leaves the index as soon as it is removed from the world for any reason, including merging, burning, despawning, pickup, and chunk unload. Hopper discovery works on Paper, Folia, and Spigot. Each distinct reconcile failure is reported to the console with its stack trace the first time it occurs; repeats of the same failure are reported at most once per minute, with a count of the repeats suppressed since the previous report.

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

This feature advances crop and sapling growth in chunks that players return to after a long absence. It **silences under high load**. That polarity is the opposite of most governors. A chunk counts as active while it is within the world's simulation distance of any player, because the server grows crops there itself; only the time a chunk spends outside that distance is fast-forwarded. Absences shorter than `minElapsedTicks` are ignored and the total is capped at `maxFastForwardTicks`. The pending growth is applied once a player comes within `activeRange` blocks of the chunk, at most 128 chunks per pass, each on its owning server or region thread. A chunk that unloads or reloads discards its pending growth. Chunk activity keeps being tracked while the feature is silenced.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this feature. |
| `tickIntervalMS` | int | `2500` | Evaluation interval (ms). |
| `activeRange` | int | `64` | Player distance from a chunk's center column at which its pending fast-forward is applied (blocks). |
| `minElapsedTicks` | int | `200` | Minimum time outside simulation distance before a chunk fast-forwards (ticks). |
| `maxFastForwardTicks` | int | `24000` | Cap on dormant ticks fed into growth math. |
| `engageOnIncident` | double | `30` | Incident score **above** which feature stops. |
| `engageOnTickMs` | double | `50` | Tick ms **above** which feature stops. |
| `releaseOnIncident` | double | `22` | Incident score to resume after silence. |
| `releaseOnTickMs` | double | `42` | Tick ms to resume after silence. |
| `maxTrackedChunks` | int | `32768` | Max tracked chunks. |
| `maxAdvancesPerPass` | int | `1024` | Max block updates per pass. |
| `saplingGrowthChance` | double | `0.142` | Sapling growth probability for proportional math. |

### `farm-burst-smoother`

When farm growth bursts, this feature defers the growth instead of dropping it and reapplies it on
a budget. Nothing is lost: lowering `maxPendingUpdates` only stops new intake until the queue drains
below the cap, and turning the feature off force-applies whatever is still queued, waiting up to
`shutdownDrainTimeoutMS`. A shutdown that cannot finish that drain fails loudly rather than
silently losing growth.

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

Skips intermediate furnace and brewing-stand ticks away from players while the server is under pressure, then advances each block by its skipped ticks the next time it runs normally. Skipped-tick debt belongs to one world and block position and is dropped when that block is broken or its chunk or world unloads. Furnaces and brewing stands in newly loaded chunks join the index through the `reseedChunksPerTick` budget, so during heavy chunk loading they can take a few evaluation intervals to be picked up. Without an NMS bridge it stays measurement-only.

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
| `reseedChunksPerTick` | int | `32` | Chunks scanned per evaluation. Newly loaded chunks are scanned first, with a quarter of the budget (at least one chunk when the budget is above `1`) held back for the loaded-chunk rotation; runtime values are clamped to `1..256`. |

### `fast-leaf-decay`

Decays leaves around a break instead of waiting for vanilla's timer. Work is budgeted per evaluation, so a large tree spreads over several ticks rather than spiking one.

Cancelled break and decay events are ignored, and fast block removal is optional.

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
