---
title: "Tweaks Catalog"
description: "Event and NMS tweaks with configuration defaults"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
This catalog lists lightweight event and NMS accelerations. Config: `plugins/React/tweak/<id>.toml`. Tweaks default to enabled except `shorthands`.

## Tweaks

Several tweaks fail closed or stay passive to vanilla when required NMS bridges are missing. Inspect with `/react bridge status`.

### `entity-bubbler`

This tweak removes selected projectile and utility entities stuck in bubble columns or soul-sand bubble lifts. It honors `DESPAWN` protection.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `entitiedToPreventFromBeingBubbled` | `List<EntityType>` | ARROW, ARMOR_STAND, MINECART, ENDER_PEARL, SNOWBALL | Types removed in bubble paths. |

### `entity-crowd-prevention`

This tweak trims overcrowded livestock-style clusters. It honors `PURGE` protection and protects player-named entities by default. Config field `preventEntityBubbling` is currently unused at runtime.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `maxEntitiesPerClusterCrowd` | int | `10` | Max entities per cluster. |
| `mobsToPreventFromCrowding` | `List<EntityType>` | COW, CHICKEN, PIG, SHEEP, PIG | Monitored types. |
| `preventEntityBubbling` | boolean | `true` | Declared. Not referenced by runtime logic. |
| `protectNamedEntities` | boolean | `true` | Protect entities with nonblank custom names. Disable to make them eligible for crowd removal. |

### `entity-hardstop`

This tweak caps the entity population per chunk. It cancels spawns, breeding, and drops at the limit. Spawn denial uses the `SPAWN_CAP` protection operation. See [17 - API - Entity Protection](/react/17-api-entity-protection).

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `maxEntitiesPerChunk` | int | `100` | Max entities per chunk. |
| `allowItemDrops` | boolean | `true` | Allow item drops past the cap. |
| `cacheIntervalTicks` | int | `200` | Rejected-chunk cache duration (ticks). |

### `experience-orb-merge`

On XP orb spawn, this tweak merges owner-local nearby orbs into the new orb. A capped collector takes only the experience it can hold and leaves any overflow on the source orb; Folia skips foreign-region orbs instead of risking cross-owner experience loss.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `mergeRadius` | double | `2.75` | Merge radius (blocks). |
| `maxNearbyOrbsPerMerge` | int | `24` | Max orbs merged per spawn. |
| `maxExperiencePerOrb` | int | `10000` | Max XP per orb after merge. |

### `fast-columns`

This tweak collapses bamboo, sugar cane, cactus, and kelp columns on break or physics. Hard-coded `maxColumnSize = 16` (not in TOML).

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |

### `fast-drops`

This tweak sends eligible item drops and XP directly to the player. Each setting controls only its named source.

For block drops, Fast Drops claims individual entries from `BlockDropItemEvent` before transfer. It does not cancel the whole event. It ignores an event another plugin already canceled. This lets another drop-routing plugin own the event first. Adapt Drop-To-Inventory adaptations are one such plugin. Duplicate transfers and deleted items do not occur.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `teleportBlockDrops` | boolean | `true` | Teleport block drops to player. |
| `teleportBlockXP` | boolean | `true` | Teleport block XP. |
| `teleportEntityDrops` | boolean | `true` | Teleport entity drops. |
| `teleportEntityXP` | boolean | `true` | Teleport entity XP. |
| `allowContainerDrops` | boolean | `false` | Allow container block drops path. |

### `fast-entity-incineration`

This tweak instantly removes burning monsters on FIRE_TICK when no player is within radius. It honors `DESPAWN` protection.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `incinerationBeyondNearestPlayer` | double | `32` | Min distance from players (blocks). |

### `fast-falling-blocks`

This tweak cancels normal falling-block settle. It queues accelerated column fall and land work budgeted by ms/tick.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `maxFallMS` | double | `1.5` | Max fall processing ms per tick. |

### `fast-fire`

This tweak short-circuits fire spread, fade, and burn into `FastWorld` set and break ops.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |

### `fast-fluids`

This tweak queues bounded extra vanilla fluid ticks via NMS bridges. Drain acceleration is optional. **Fail-passive** without fluid bridges or after consecutive bridge failures.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `accelerateWater` | boolean | `true` | Accelerate water. |
| `accelerateLava` | boolean | `true` | Accelerate lava. |
| `extraVanillaTicksPerEvent` | int | `2` | Extra fluid ticks per flow event. |
| `maxExtraVanillaTicksPerServerTick` | int | `256` | Max extra fluid ticks per server tick. |
| `maxBurstTicksPerLocationPerServerTick` | int | `16` | Max burst ticks per location per flush. |
| `accelerateDrain` | boolean | `true` | Accelerate drain/retract neighbors. |

### `fast-snow`

This tweak short-circuits snow form and fade into `FastWorld` set and break.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |

### `hopper-index`

This tweak pre-ticks hoppers using `FeatureHopperItemIndex` to short-circuit vanilla AABB scans. A rotating cursor inspects at most 64 item-bearing chunks across all worlds per tick by default, caches each world's chunk snapshot until that rotation is exhausted, and permits only one in-flight pickup task per chunk until that task completes, is rejected, or the tweak lifecycle resets. Hopper chunks adjacent to an item-bearing chunk are included when an edge pickup box crosses the chunk boundary. Each task resolves an indexed item once, maps it into only the geometrically reachable hopper pickup cells, rechecks the exact pickup boundary, and preserves hopper scan order when pickup areas overlap. Dense-chunk candidate work therefore follows reachable pickup pairs instead of multiplying every hopper by every item. Optional idle empty-hopper cooldown stretch is spread across the index, hard-capped at 256 probes per tick, and clamped below the probe interval so each hopper reaches vanilla's zero-cooldown path before React can stretch it again. **Fail-closed** without NMS bridges.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `idleStretch` | boolean | `true` | Stretch cooldown on empty idle hoppers under load. |
| `idleStretchTicks` | int | `40` | Requested stretch cooldown; runtime uses at most `idleStretchSpreadPasses - 1`. |
| `idleStretchSpreadPasses` | int | `40` | Spread passes for idle probes; values at or below `1` disable stretching so vanilla probes every tick. |
| `idleStretchMinTickMs` | double | `45` | Tick ms before idle stretch engages. |
| `itemChunkBudgetPerTick` | int | `64` | Global item-bearing chunk inspection budget per tick; clamped to `1..4096`. |

### `hopper-limit`

This tweak cancels inventory transfers whose destination holder is a hopper. It does so when the within-tick `hopper-event-span` sampler exceeds the threshold. Transfers out of hoppers into non-hopper destinations are not handled by this tweak.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `maxHopperEventSpan` | double | `0.75` | Maximum observed within-tick hopper-event span before canceling. The former field is not read or migrated. |

### `item-despawn-accelerator`

On item spawn, if no player is within radius, this tweak forces high `ticksLived` toward despawn. It skips named items and valuables when configured.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `targetTicksLived` | int | `5600` | Forced ticks lived. |
| `noPlayerRadius` | double | `48` | No-player radius (blocks). |
| `ignoreNamedItems` | boolean | `true` | Skip named items. |
| `ignoreValuables` | boolean | `true` | Skip valuable materials. |
| `valuableItems` | `List<Material>` | netherite, nether star, diamond, ancient debris, elytra, totem, … | Valuable materials. |

### `projectile-limiter`

This tweak caps projectile launches per player and per chunk over rolling windows.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `playerWindowMS` | int | `1000` | Player window (ms). |
| `chunkWindowMS` | int | `1000` | Chunk window (ms). |
| `maxProjectilesPerPlayerWindow` | int | `40` | Max per player window. |
| `maxProjectilesPerChunkWindow` | int | `160` | Max per chunk window. |
| `cleanupIntervalMS` | int | `5000` | Cleanup/tick interval (ms). |
| `limitPlayerProjectiles` | boolean | `true` | Enforce per-player limits. |
| `limitChunkProjectiles` | boolean | `true` | Enforce per-chunk limits. |
| `bypassPermission` | String | `react.bypass.projectile-limit` | Bypass permission. |

### `server-hibernator`

Experimental empty-server hibernation. When its safety gate is enabled and the server is empty, it runs `save-all` once. It then calls `Thread.sleep` from a synchronous repeating task every tick. That call blocks the main or global server thread for `secondsPerTick`. The safety gate defaults **off**.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `imACloudServerEnableMe` | boolean | `false` | Safety gate. Must be true to hibernate. |
| `secondsPerTick` | double | `1.0` | Sleep seconds per tick while empty. |

### `shorthands`

This tweak adds optional operator shortcuts and is off by default. Built-in labels replace matching bare commands while active. Custom entries skip occupied labels unless `overrideExisting` is enabled.

- **Permissions:** `react.shorthands.*` and children. See [02 - Commands & Permissions](/react/02-commands-permissions).

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `false` | Enables or disables this tweak. Review command-label conflicts before enabling it. |
| `gms` | boolean | `true` | Register `/gms`. |
| `gmsp` | boolean | `true` | Register `/gmsp`. |
| `gmc` | boolean | `true` | Register `/gmc`. |
| `give` | boolean | `true` | Register React `/give`. |
| `more` | boolean | `true` | Register `/more`. |
| `rl` | boolean | `true` | Register `/rl` → server reload. |
| `customCommands` | `Map<String, CustomShorthand>` | empty | Custom label → command entries. |

#### `customCommands` entry fields

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enable this custom entry. |
| `command` | String | `""` | Command without leading slash. Use `{args}` or appended args. |
| `permission` | String | `react.shorthands.custom` | Extra permission (blank = none). |
| `overrideExisting` | boolean | `false` | Replace existing bare labels. |

### `spawner-player-radius`

This tweak cancels spawner and trial-spawner creature spawns when no player is within range.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `requiredPlayerDistance` | double | `32` | Required player radius (blocks). |
| `onlyMonsters` | boolean | `true` | Only monsters. |
| `enforceSpawnerSpawns` | boolean | `true` | Enforce SPAWNER reason. |
| `enforceTrialSpawnerSpawns` | boolean | `true` | Enforce TRIAL_SPAWNER reason. |

### `vehicle-idle-brake`

This tweak zeroes velocity on distant empty minecarts and boats. Evaluations are single-flight and use one rotating aggregate vehicle budget across all worlds. Paper consumes a bounded weak vehicle index populated by EntityController sampling instead of materializing every vehicle in each world. Folia rotates unique player anchors, de-duplicates vehicles seen by overlapping anchors, and applies changes only from the current activation on the owning region.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enables or disables this tweak. |
| `tickIntervalMS` | int | `1000` | Evaluation interval (ms). |
| `maxVehiclesSampledPerWorld` | int | `180` | Aggregate vehicles sampled per evaluation, clamped to 1–4096. The retained config key predates the cross-world budget. |
| `minVelocitySquared` | double | `0.0004` | Min velocity² to consider. |
| `maxDistanceWithoutPlayer` | double | `48` | Max distance without player. |
| `onlyEmptyVehicles` | boolean | `true` | Only empty vehicles. |
| `brakeMinecarts` | boolean | `true` | Brake minecarts. |
| `brakeBoats` | boolean | `true` | Brake boats. |
