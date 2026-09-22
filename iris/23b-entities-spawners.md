---
title: "Entities & Spawners"
description: "Iris documentation: Entities & Spawners"
published: true
date: 2026-09-21T10:36:56.240Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
Entities describe a mob and its gear. Spawners decide when and where those entities appear. Ambient effects are the sounds, particles and potions a biome applies to players standing in it. Loot tables are [23 - Loot](/iris/23-loot). Pinning a spawner to a block inside a placed object is [23c - Markers](/iris/23c-markers).

Related: [11 - Dimensions](/iris/11-dimensions), [12 - Regions](/iris/12-regions), [13 - Biomes](/iris/13-biomes), [03 - Configuration](/iris/03-configuration), [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

## The mental model

A background loop ticks each Iris world roughly twice a second. If there is room, it picks a handful of loaded chunks and tries one spawn in each. A spawn attempt gathers every spawner the dimension, region, and surface biome list, throws out the ones whose time, weather, rate, or crowding gates fail, pools their entries, picks exactly one, and places one to a few mobs.

Vanilla natural spawning is a separate pipeline. It stays on via the biome `vanillaDerivative` unless you replace that table. Iris spawners do not turn it off, and nothing deduplicates between the two — a zombie spawner in your pack adds to whatever the server would have spawned anyway. Custom biome `spawns` merge with vanilla. See [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

| Path | Class | Role |
|------|-------|------|
| `entities/<key>.json` | `IrisEntity` | One mob: type, gear, flags, drops, passengers |
| `spawners/<key>.json` | `IrisSpawner` | The gates and rates that decide when entity keys appear |

Keys are the pack-relative path without `.json`. Dimensions, regions, and biomes list spawner keys in `entitySpawners`; ambient spawning needs `world.ambientEntitySpawningSystem` true.

The bundled Overworld pack wires its spawners at region scope (`regions/*.json` list `<climate>/cave`, `/hostile`, `/passive`, `/water`). It also includes `standard/passive/sulfur-cube`, a native 26.2 sulfur cube entity template; [Sulfur Galleries and Hollows](/iris/biomes/carving/sulfur) inherit the vanilla sulfur-cave spawn table instead of an Iris ambient spawner.

## Walkthrough: make a custom mob spawn in one biome

The goal is a geared zombie that appears at night in one biome and drops a custom item. Prerequisites: a validating pack, a land biome with load key `tutorial/meadow`, and `world.ambientEntitySpawningSystem: true` (the default).

**1. Drop table.** `loot/tutorial/zombie-drops.json`:

```json
{
  "name": "Tutorial Zombie Drops",
  "minPicked": 1,
  "maxPicked": 1,
  "maxTries": 4,
  "loot": [
    { "type": "iron_nugget", "rarity": 1, "minAmount": 1, "maxAmount": 3 }
  ]
}
```

**2. Entity.** `entities/tutorial/zombie.json`:

```json
{
  "type": "minecraft:zombie",
  "surface": "LAND",
  "customName": "&cMeadow Stalker",
  "helmet": { "type": "leather_helmet", "rarity": 3, "leatherColor": "#3B5323" },
  "loot": { "tables": ["tutorial/zombie-drops"] }
}
```

The entity's `loot` replaces the mob's vanilla drop table outright. Only `tables` is read here; `mode` and `multiplier` on an entity are ignored.

**3. Spawner.** `spawners/tutorial/night-zombies.json`:

```json
{
  "group": "NORMAL",
  "maxEntitiesPerChunk": 3,
  "timeBlock": { "startHour": 20, "endHour": 5 },
  "weather": "ANY",
  "allowedLightLevels": { "min": 0, "max": 7 },
  "maximumRate": { "amount": 4, "per": { "seconds": 30 } },
  "spawns": [
    { "entity": "tutorial/zombie", "rarity": 1, "minSpawns": 1, "maxSpawns": 2 }
  ]
}
```

`timeBlock` hours are clock hours where 6 is sunrise and 18 is sunset, so `20` to `5` is night wrapping past midnight. `maximumRate` of 4 per 30 seconds becomes one attempt every 7.5 seconds for this spawner across the whole world.

**4. Attach it.** In `biomes/tutorial/meadow.json`, add the spawner key. This is a field excerpt, not a new file:

```json
{
  "entitySpawners": ["tutorial/night-zombies"]
}
```

**5. Verify.** Validate the pack first — the validator resolves the spawner-to-entity edge and names a broken link before you load a world. Then open Studio, focus `tutorial/meadow`, set night, and stand somewhere with block light under 8. Success is named zombies appearing within a few seconds and dropping iron nuggets when killed. On Bukkit you can prove the entity file loads on its own with `/iris studio spawn tutorial/zombie`; that command is not registered on Fabric/Forge/NeoForge.

**6. If nothing spawns.** Work down the gate list in order rather than raising `rarity` or the rate:

- **Difficulty.** Iris skips native entity types the server forbids in Peaceful. This is an expected rejection and logs nothing. Passive entities and native Peaceful exceptions remain eligible.
- **World-wide crowding.** If living entities divided by loaded chunks exceeds `world.targetSpawnEntitiesPerChunk` (0.95 by default, scaled by 1.28), Iris stops spawning for five seconds. A test world full of mobs will starve your spawner.
- **Chunk crowding.** `maxEntitiesPerChunk` is compared against the living entities already in that chunk.
- **Time and weather.** Both are read from the world at attempt time.
- **Light.** The check only runs when `allowedLightLevels` is narrower than 0-15, and it reads the combined maximum of sky and block light, not block light alone. A `max: 7` spawner will not fire on a surface block in daylight.
- **Group versus biome.** A `NORMAL` spawner listed on a *dimension* is rejected in sea, shore, and cave biomes. Region- and biome-level spawners skip that check entirely. A mismatched `group` there produces mobs at odd heights rather than no mobs.
- **Placement viability.** The chosen block's `surface` must match the entity's `surface`, and the entity's bounding box must be clear air.

## Entities (`IrisEntity`)

Folder: `entities/`. A minimal entity is one field:

```json
{ "type": "ZOMBIE" }
```

`entities/standard/hostile/zombie.json` is referenced as `standard/hostile/zombie`.

For a MythicMobs entity, keep the required base type explicit and route the custom key through the provider:

```json
{
  "type": "unknown",
  "specialType": "mythicmobs:JumpingSpider"
}
```

The `mythicmobs` namespace selects Iris's MythicMobs provider, and `JumpingSpider` must be an existing MythicMobs mob key. By default the provider-created entity is returned untouched; set `applySettingsToCustomMobAnyways` to `true` only when Iris should also apply the remaining entity fields.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `type` | string | null | Required. The entity type key (`minecraft:zombie`, `alexsmobs:grizzly_bear`, or a bare name). Set it to `unknown` and fill `specialType` when the mob comes from a plugin instead |
| `specialType` | string | `""` | `PluginName:MobName`, spawned through the external-data service. Mythic Mobs and similar providers plug in here |
| `applySettingsToCustomMobAnyways` | boolean | `false` | By default Iris hands a `specialType` mob straight back to its provider untouched. Turn this on to layer Iris gear, names, and flags on top |
| `reason` | string | null | The `SpawnReason` reported to other plugins. Unset or unrecognised becomes `NATURAL`. Change it when another plugin gates on spawn reason |
| `customName` | string | `""` | Name tag, with `&` color codes |
| `customNameVisible` | boolean | `false` | Show the name without looking at the mob |
| `aware` | boolean | `true` | Whether the mob reacts to the world. Off makes a decorative mob that stands still but still animates |
| `ai` | boolean | `true` | Whether the mob has AI goals at all. Off is a harder freeze than `aware: false` |
| `glowing` | boolean | `false` | Outline visible through blocks |
| `gravity` | boolean | `true` | Off leaves the mob floating where it spawned |
| `invulnerable` | boolean | `false` | Only creative-mode players can damage it |
| `silent` | boolean | `false` | Suppresses the mob's sounds |
| `pickupItems` | boolean | `false` | Whether it can pick up dropped gear |
| `removable` | boolean | `false` | Whether the server may despawn it when players leave. Off keeps a set-piece mob alive |
| `keepEntity` | boolean | `false` | Forces persistence. Also forced globally by `world.forcePersistEntities` |
| `baby` | boolean | `false` | Spawns the baby variant for ageable types |
| `helmet` / `chestplate` / `leggings` / `boots` / `mainHand` / `offHand` | `IrisLoot` | null | One equipment slot each, built like a loot entry. The entry's own `rarity` is a 1-in-N roll for whether the slot gets filled at all. That is how you get "one in five wears a helmet" |
| `passengers` | `IrisEntity[]` | `[]` | Riders, spawned and mounted after the host. Nests, so a rider can carry a rider |
| `attributes` | `IrisAttributeModifier[]` | `[]` | Attribute modifiers applied to the mob |
| `loot` | `IrisLootReference` | empty | Drop tables. Replaces the mob's vanilla drops. Only `tables` is read |
| `leashHolder` | `IrisEntity` | null | Spawns a second entity and leashes this one to it. No effect on ender dragons, withers, players, or bats |
| `spawnEffect` | `IrisEffect` | null | A one-shot effect fired at the spawn position |
| `spawnEffectRiseOutOfGround` | boolean | `false` | Spawns the mob five blocks lower when a player is nearby and walks it up out of the ground with block-crack particles. The mob is invulnerable and AI-less for up to five seconds while rising |
| `pandaMainGene` / `pandaHiddenGene` | string | null | Panda genes. Unrecognised names fall back to `NORMAL` |
| `surface` | `IrisSurface` | `LAND` | What the block under the spawn point must be — see below. Marker-driven spawns skip this check |
| `rawCommands` | `IrisCommand[]` | `[]` | Console commands run after the mob spawns |

`IrisSurface` values, checked against the block directly below the spawn position:

| Value | Matches |
|-------|---------|
| `LAND` | Any solid block |
| `ANIMAL` | Grass block, dirt, dirt path, coarse dirt, rooted dirt, podzol, mycelium, or snow block. Narrower than `LAND` on purpose, for passive mobs |
| `WATER` | Water, seagrass, kelp, or any waterlogged block |
| `OVERWORLD` | Any solid block or any water block — use it when a spawner should work on shore and in shallows |
| `LAVA` | Lava |

### Entity drops in practice

Both platforms replace the mob's vanilla drop table rather than adding to it. The tables are rolled at the mob **spawn** coordinates with the `STORAGE` slot type. Because entry rarity is position-derived, every mob spawned on the same block rolls identical drops. Vary `minAmount`/`maxAmount` if you want visible variation from a single-entry table.

On Bukkit a synthetic loot table is bound to the mob. On modded the mob carries an `iris_loot|…` tag and Iris emits the items on death instead of the base table, and chest-carrying vehicles are filled directly at spawn. Any entity type that exposes no lootable path logs one warning per type and is skipped.

### Entity commands (`IrisCommand`, snippet type `command`)

`rawCommands` runs console commands after a mob spawns. The same object is used by ambient effect command registries.

| Field | Default | What it does |
|-------|---------|--------------|
| `commands` | `[]` | Required. Command strings. A leading `/` is stripped, and `{x}`, `{y}`, `{z}` are replaced with the spawn block coordinates |
| `delay` | `0` | Server ticks before the first run. Negative values clamp to zero |
| `repeat` | `false` | Repeat forever after the first run. There is no cancel handle. Repeats do not survive a restart |
| `repeatDelay` | `100` | Server ticks between repeats. Values below 1 clamp to 1 |
| `timeBlock` | any time | World-time window the command is allowed in |
| `weather` | `ANY` | Required weather: `NONE`, `DOWNFALL`, `DOWNFALL_WITH_THUNDER`, or `ANY` |

`timeBlock` and `weather` are evaluated once, when the command object first runs. A repeating command keeps repeating after its window closes.

## Ambient effects (`IrisEffect`, snippet type `effect`)

Biomes and regions accept `effects[]`. Each entry runs at most once per `interval` milliseconds and has a 1-in-`chance` shot at firing. A single entry can apply a potion, play a sound, emit particles, and run commands. The whole system is gated by `world.effectSystem` in `iris.json`. An effect whose biome no longer exists in the running pack is skipped rather than substituted.

| Field | Default / range | What it does |
|-------|-----------------|--------------|
| `interval` | `150` ms, >= 0 | Minimum gap between attempts. Raise it for anything expensive or loud |
| `chance` | `50`, >= 1 | One attempt in this many actually fires. Combined with `interval` this is your real frequency |
| `potionEffect` | `""` | Potion effect registry key. An unknown key falls back to `LUCK` and logs a warning |
| `potionStrength` | `-1` (-1..1024) | Amplifier. `-1` disables potion application entirely, which is the default |
| `potionTicksMin` / `potionTicksMax` | `75` / `155` | Random potion duration in ticks |
| `sound` | null | Sound registry key |
| `soundDistance` | `12` (0..512) | How far from the player the sound origin can be offset. Larger values make the source feel distant and directionless |
| `minPitch` / `maxPitch` | `0.5` / `1.5` (0.01..1.99) | Random pitch range |
| `volume` | `1.5` (0.001..512) | Sound volume |
| `particleEffect` | null | Particle registry key. Modded supports particle types that need no extra particle data |
| `particleOffset` | `0` (-32..32) | Random vertical offset from the sampled surface |
| `particleCount` | `0` (0..512) | Particle count. Zero is meaningful: on Bukkit it makes the alt XYZ values behave as velocity instead of spread |
| `particleDistance` | `20` (0..64) | How far ahead of the player particles are sampled |
| `particleDistanceWidth` | `24` (0..128) | Sampling radius left and right of the player |
| `particleAway` | `5` (0..16) | Minimum forward offset, so particles do not spawn in the player's face |
| `particleAltX` / `particleAltY` / `particleAltZ` | `0` (-8..8) | Spread, or velocity when `particleCount` is 0 |
| `randomAltX` / `randomAltY` / `randomAltZ` | `true` / `false` / `true` | Randomize each alt component between its negative and positive value. Y defaults off so vertical drift stays deliberate |
| `extra` | `0` | Particle-specific extra value, meaningful only for some particle types |
| `commandRegistry` | null | Commands to cast alongside the effect |

`IrisCommandRegistry` (snippet type `command-registry`):

| Field | Default | What it does |
|-------|---------|--------------|
| `rawCommands` | `[]` | `IrisCommand[]` to run |
| `commandOffsetX` / `commandOffsetY` / `commandOffsetZ` | `0` (-8..8) | Offsets from the player for the `{x} {y} {z}` substitutions |
| `commandRandomAltX` / `commandRandomAltY` / `commandRandomAltZ` | `true` / `false` / `true` | Randomize each coordinate within its signed offset |
| `commandAllRandomLocations` | `true` | Re-roll the coordinate for each command object. Set false to fire every command at one shared point |

```json
{
  "particleEffect": "minecraft:ash",
  "particleCount": 8,
  "sound": "minecraft:ambient.cave",
  "interval": 1000,
  "chance": 8,
  "commandRegistry": {
    "commandOffsetX": 4,
    "commandOffsetZ": 4,
    "rawCommands": [{ "commands": ["particle minecraft:smoke {x} {y} {z}"] }]
  }
}
```

## Spawners (`IrisSpawner`)

Folder: `spawners/`.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `spawns` | `IrisEntitySpawn[]` | `[]` | The ongoing spawn pool. Every entry competes with entries from every other eligible spawner in the same chunk |
| `initialSpawns` | `IrisEntitySpawn[]` | `[]` | A separate pool used once per chunk, the first time that chunk is maintained. For set dressing that should exist from the moment a chunk appears |
| `maxEntitiesPerChunk` | int | `1` | Skip this spawner when the target chunk already holds this many living entities. The single most common reason a spawner looks dead — the default of 1 means almost any occupied chunk blocks it |
| `timeBlock` | `IrisTimeBlock` | any time | World-time window. Clock hours, 6 = sunrise, 18 = sunset |
| `weather` | `IrisWeather` | `ANY` | `NONE`, `DOWNFALL`, `DOWNFALL_WITH_THUNDER`, or `ANY` |
| `maximumRate` | `IrisRate` | infinite | World-wide throttle for this spawner. Stamped only when a spawn actually succeeds |
| `maximumRatePerChunk` | `IrisRate` | infinite | Same throttle, tracked per chunk. Use it to stop one chunk hogging a generous global rate |
| `allowedLightLevels` | `IrisRange` | `0`..`15` | Inclusive light range. Skipped entirely when left at the full range. Measured as the combined maximum of sky and block light |
| `group` | `IrisSpawnGroup` | `NORMAL` | Where in the column mobs are placed, and which biomes accept this spawner at dimension scope |

`IrisSpawnGroup`:

| Value | Position chosen | Biome check (dimension scope only) |
|-------|-----------------|------------------------------------|
| `NORMAL` | Random x/z in the chunk, one block above the fluid-inclusive surface | Land biomes only |
| `CAVE` | A random `cave_floor` mantle marker in the chunk, one block up | Accepted in every biome type |
| `UNDERWATER` | Random x/z, random Y between the solid top and the water surface | Sea biomes only |
| `BEACH` | Same water-column position as `UNDERWATER` | Shore biomes only |

The biome check only applies to spawners listed on a **dimension**. Region and biome `entitySpawners` bypass it, so a `CAVE`-group spawner listed on a surface biome still looks for cave floor markers and quietly does nothing if there are none.

> `CAVE` group spawners are unavailable on Folia.
{.is-warning}

`IrisRate` (snippet type `rate`):

| Field | Default | What it does |
|-------|---------|--------------|
| `amount` | `0` | How many firings the duration allows. The effective cooldown is `per` divided by `amount` (or by 1 when `amount` is 0) |
| `per` | empty | The window. **An empty `per` means unlimited** — that is what makes a rate infinite, not `amount` |

`IrisDuration` (snippet type `duration`) sums every field you fill in:

| Field | Real time per unit |
|-------|--------------------|
| `milliseconds` | 1 ms |
| `minecraftTicks` | 50 ms |
| `seconds` / `minutes` / `hours` / `days` | Real-world units |
| `minecraftHours` | 50 s |
| `minecraftDays` | 20 min |
| `minecraftWeeks` | 2 h 20 min (7 Minecraft days) |
| `minecraftLunarCycles` | 2 h 40 min (8 Minecraft days) |

`IrisTimeBlock` (snippet type `time-block`): `startHour` and `endHour` in 24-hour clock time, where the world's tick 0 reads as hour 6. Setting both to the same value means any time. Setting both to `-1` means never. A `startHour` greater than `endHour` wraps past midnight.

### Entity spawn entry (`IrisEntitySpawn`, snippet type `entity-spawn`)

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `entity` | string | `""` | Required. The entity key |
| `rarity` | int >= 1 | `1` | Inverse weight. All eligible entries from all eligible spawners go into one pool. Each entry gets `totalRarity / rarity` slots. Low numbers are common, high numbers are rare. Exactly one entry wins per chunk attempt |
| `minSpawns` / `maxSpawns` | int >= 1 | `1` / `1` | Inclusive range of placement attempts once this entry wins. Each attempt can still fail the surface, light, or clearance check, so this is a ceiling not a guarantee |

Rarity is applied exactly once, as pool weighting, on both platforms.

Real Overworld spawner, `spawners/temperate/hostile.json`:

```json
{
  "group": "NORMAL",
  "maximumRate": { "amount": 8, "per": { "seconds": 15 } },
  "timeBlock": { "startHour": 20, "endHour": 3 },
  "maxEntitiesPerChunk": 2,
  "weather": "ANY",
  "spawns": [
    { "entity": "standard/hostile/zombie", "rarity": 5, "maxSpawns": 4, "minSpawns": 2 },
    { "entity": "standard/hostile/skeleton", "rarity": 30, "maxSpawns": 2, "minSpawns": 1 },
    { "entity": "standard/neutral/enderman", "rarity": 60, "maxSpawns": 2, "minSpawns": 1 }
  ]
}
```

Attach it on a dimension, region, or biome:

```json
{
  "entitySpawners": ["temperate/hostile", "temperate/passive"]
}
```

### The ambient tick

The loop runs once per Iris world every `world.asyncTickIntervalMS` milliseconds (700 by default, 3000 when both spawn systems are off). Each pass recounts living entities, computes saturation against `world.targetSpawnEntitiesPerChunk`, and — if there is room — runs one spawn attempt in each of 2 to 12 random loaded chunks. If the entity count cannot be completed, Iris pauses spawning rather than guessing. Pregeneration and world maintenance suppress spawning for that world entirely while they run.

In Studio worlds, spawning also requires `studio.entitySpawning`.

`initialSpawns` runs from the chunk-maintenance pass, once per chunk, guarded so it never repeats. That pass returns early when `world.markerEntitySpawningSystem` is off, so `initialSpawns` needs **both** spawn settings enabled even though it is not marker-driven.

## Content unavailable on this Minecraft version

Entity types and potion effects added in a newer Minecraft do not exist on an older server. Iris checks each key against the live registry when the pack loads and removes only what cannot work. See [25 - Pack Management](/iris/25-pack-management) for the gate, the startup listing, and `/iris pack compat`.

| What is missing | Effect |
|-----------------|--------|
| `type` on an `IrisEntity` | The entity is excluded and never spawns. Every `IrisEntitySpawn` naming it is dropped, and a spawner left with no `spawns` and no `initialSpawns` is excluded in turn. `entitySpawners` lists and object markers naming the excluded spawner skip it at runtime |
| An entity in a biome `customDerivitives` spawn | The spawn entry is dropped **before** the custom-biome datapack JSON is written, so the generated datapack stays loadable and the custom biome keeps generating |
| A potion effect in an `IrisEffect` | That effect is dropped. The rest of the biome or region ambience keeps running |

Dropping is silent at runtime. The complete list is printed once at startup and available from `/iris pack compat`. A spawner pointing at an entity file that does not exist in the pack is still a blocking validation error — that is an authoring mistake, not a version gap.

## Runtime settings that gate these systems

From `iris.json` under `world` (see [03 - Configuration](/iris/03-configuration)):

| Key | Default | Effect |
|-----|---------|--------|
| `ambientEntitySpawningSystem` | `true` | Dimension, region, and biome `entitySpawners` |
| `markerEntitySpawningSystem` | `true` | Marker-driven spawners, and the chunk pass that runs `initialSpawns` |
| `effectSystem` | `true` | Biome and region `effects[]` |
| `targetSpawnEntitiesPerChunk` | `0.95` | Saturation ceiling. Lower it on busy servers to stop Iris adding to entity load |
| `asyncTickIntervalMS` | `700` | How often the spawn loop runs per world |
| `forcePersistEntities` | `true` | Marks every Iris-spawned entity persistent regardless of `keepEntity` |

## Add entity spawns to a pack

1. Write `entities/<key>.json` with at least `type`. Set `surface` to match where the mob belongs.
2. Write `spawners/<key>.json`. Raise `maxEntitiesPerChunk` above the default of 1 unless you want one mob per chunk.
3. Add spawner keys to `entitySpawners` on a dimension, region, or biome, or attach them through [markers](/iris/23c-markers) on an object placement.
4. Validate the pack: the spawner-to-entity edge is a blocking check, so a typo is caught before you load a world.
5. Open Studio and confirm in-world.
