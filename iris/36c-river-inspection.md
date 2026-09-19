---
title: "River Inspection"
description: "Find accepted river features, read rejection reasons, validate a pack, run the river probes, and troubleshoot a river that did not appear"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
What to do when a river did not appear, or when you want to look at the ones that did. The physical fields are on [36 - Rivers](/iris/36-rivers) and the policy fields on [36b - River Policy](/iris/36b-river-policy).

## Accepted feature types

| Feature | Meaning |
|---------|---------|
| `SURFACE_POOL` | Level exposed reach |
| `RIFFLE` | A single one-block step |
| `CASCADE` | Rapids: consecutive one-block steps |
| `WATERFALL` | A single drop across a natural cliff of at least `flow.waterfallMinimumDrop` |
| `SINKHOLE` | Falling surface-to-underground throat into a contained inland grotto pool |
| `UNDERGROUND_POOL` | Level independently sourced cave river |
| `UNDERGROUND_DROP` | Required descending underground transition |
| `COASTAL_GROTTO` | Sea-level contained coastal chamber, at a river outlet or as a standalone sea cave opening from the ocean |
| `INLAND_GROTTO` | Permitted sinkhole outlet chamber |
| `MOUTH` | Surface or underground connection into the ocean reservoir |
| `DEEP_POOL` | Independent contained deep-fluid pool |
| `DEEP_CHANNEL` | Independent short deep-fluid channel |
| `STANDING_POOL` | Independent standing surface pool |

Feature references carry stable feature, course, and segment IDs, coordinates, flow direction, and a source marker. Vision and locator commands consume these accepted references.

## Vision

The normal **Biome** view composites accepted surface hydrology content over the natural biome field.

The **River network** view reads the accepted feature footprint and labels it `headwater / source`, `surface pool`, `riffle`, `cascade`, `waterfall`, `sinkhole`, `underground pool`, `underground drop`, `coastal grotto`, `inland grotto`, `mouth`, `deep pool`, or `deep channel`. Each accepted headwater carries a compact arrow aligned to the flow vector stored in that feature reference.

Rejected candidates use visibly separate `projected source`, `projected outlet`, and `projected deep fluid` colors. They are absent from accepted footprints, biome samples, normal render samples, and locators.

## `/iris find river`

Locate accepted features from an Iris world. On Bukkit, `goto` is an alias of `find`; `/iris goto river type=surface` searches and teleports, while `teleport=false` only reports coordinates. Changing worlds during the search cancels the pending teleport, and Iris reports teleport success only after it completes.

```text
# Bukkit
/iris find river type=surface teleport=false
/iris find river type=waterfall
/iris find river type=sinkhole
/iris find river type=underground
/iris find river type=grotto
/iris find river type=deep_lava

# Fabric, Forge, NeoForge
/iris goto river surface
/iris goto river waterfall
/iris goto river sinkhole
/iris goto river underground
/iris goto river grotto
/iris goto river deep_lava
```

Supported type selectors are `surface`, `waterfall`, `sinkhole`, `underground`, `grotto`, `coastal_grotto`, `inland_grotto`, `mouth`, `deep`, and `pool`. Any other value is treated as a deep-fluid or surface-pool ID and matches only the deep or standing pool features with that profile. Completion appends the active dimension's configured deep-fluid IDs to the built-ins, so `deep_lava` appears only when the pack declares it. **Built-in selector names are reserved and cannot be deep-fluid IDs.**

The search is bounded to the smaller of 8,192 blocks and fifteen routing tiles. It compares exact accepted feature records from generated chunks with accepted active-activation plans in eligible new terrain; historical matches require recorded river facts, and Iris does not reconstruct missing historical records. Searching for a type the active pack rarely produces can take minutes once the search leaves cached terrain, so check what the pack actually configures first — `/iris pack validate` lists the hydrology coverage a pack reaches. `/iris find biome` and `/iris goto biome` use the same recorded-history and active-prediction split.

## Rejection reasons

A candidate that fails a rule is retained in the tile diagnostics with its reason rather than silently dropped.

| Reason | Meaning |
|---|---|
| `OUTLET_LEVEL` | A sea outlet an underground river cannot reach because the sea sits above `underground.fluidLevel` |
| `SURFACE_HEAD_RANGE` | On a sea-cave `OUTLET` candidate, a coast too low for `seaCaves.minimumCoastHeight` |
| `SOURCE_SPACING` | A site too close to another source, sea cave, or river outlet |
| `SOURCE_QUOTA` | The tile already has its configured budget of this kind |
| `VOLUME_LIMIT` | The candidate exceeds `maximumVolume` for a grotto, or the 262,144-position containment transaction cap |
| `CAVE_CONTAINMENT` | The volume would break out of the rock — for a sea cave, out of the coast anywhere but its ocean face |
| `CONFINED_NO_OUTLET` | A source in a `confined` area has no outlet reachable inside that area |
| `TRIBUTARY` | A draft that could not be joined to its stem: no junction within reach, too short a reach, or arriving below the stem |

## How the planner works

For each bounded hydrology tile Iris samples natural height, slope, ocean classification, cave suitability, and effective policy on the coarse lattice; selects its sea outlets and then its permitted inland outlets from two independent budgets; builds one acyclic drainage potential toward those outlets; admits surface and underground sources from separate budgets; routes toward valleys and refines each accepted route into a terrain-following centerline; shapes every course and compiles its exact terrain, fluid, shore, bank, biome, cave, render, and locator footprints; validates every subterranean footprint as one containment transaction; and prunes any rejected course before publishing the rest.

Surface routing bounds each uphill lattice step by the available channel incision, but a cumulative climb can still fail the refined channel and bank checks. Every drainage edge lowers potential, so accepted graphs are acyclic.

**Tile arbitration.** Overlapping river claims resolve to one deterministic owner, so tile request order cannot produce duplicate mouths, stacked main stems, or detached edge fragments.

## Runtime queries

`IrisHydrologyRuntime` exposes the accepted plan through `sample(x, z)`, `renderSample(x, z)`, `tile(HydrologyTileKey)`, and `nearestFeature(...)`, composing overlapping immutable tile footprints before returning a final sample. `HydrologyTile.localDiagnosticCandidates()` returns the candidates stored with that tile, and `IrisHydrologyRuntime.diagnosticCandidates(HydrologyTileKey)` returns the complete sorted list including regional basin rejections. A cold complete query can run regional planning, so call it from a thread allowed to wait — it rejects a cold call on a protected server thread. Opening a cold diagnostic view therefore takes longer than reading an already generated tile.

## Validation

Run the shared pack validator after every hydrology or policy edit:

```text
# Bukkit
/iris pack validate pack=<pack-key>

# Fabric, Forge, NeoForge
/iris pack validate <pack-key>
```

The hydrology validator checks:

- object types and numeric bounds for every routing, channel, bank, flow, mouth, underground, grotto, and deep-fluid field;
- routing divisibility and at most 65,536 coarse lattice nodes;
- complete surface and underground course floors that do not exceed `maximumRouteLength`;
- at least one enabled outlet family;
- canonical inland surface-sinkhole enablement and outlet selection;
- ordered styled ranges and dimension-height fit;
- `minimumBlendWidth` no greater than `maximumBlendWidth`;
- unique river-profile and deep-fluid IDs with nonempty fluid palettes, and no deep-fluid ID that collides with a built-in feature selector;
- deep-fluid spacing, footprint, depth, headroom, and height relationships;
- valid policy enums, nullable Boolean and numeric fields, unique references, and known profile IDs;
- existing biome references, including `bankBiomes`, and the complete reachable policy/child/carving closure;
- required mantle and carving capabilities.

At most 64 river profiles, 64 deep-fluid entries, and 128 references in each policy profile or biome list are permitted. **Validation failure is blocking for world construction, Studio admission, and packaging.**

## Probes

To look at the rivers of a pack without a server, run the probes with Java 25 against the real pack:

```bash
./gradlew --no-daemon :probe:genProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key>

./gradlew --no-daemon :probe:riverTransectProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key> \
  -PprobeSeed=77 \
  -PprobeTileX=3 \
  -PprobeTileZ=-2 \
  -PprobeOutput=/absolute/path/to/output

./gradlew --no-daemon :probe:hydrologyPackProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key> \
  -PprobeSeeds=1,19,331,1337 \
  -PprobeMinimumTileX=8 \
  -PprobeMaximumTileX=23 \
  -PprobeMinimumTileZ=8 \
  -PprobeMaximumTileZ=23 \
  -PprobeRequiredCoverage=<feature@profile,...> \
  -PprobeStudio=true

./gradlew --no-daemon :probe:generationOrderProbe \
  -PprobePack=/absolute/path/to/pack \
  -PprobeDimension=<dimension-key> \
  -PprobeSeed=77 \
  -PprobeMinimumChunkX=2048 \
  -PprobeMaximumChunkX=2051 \
  -PprobeMinimumChunkZ=2048 \
  -PprobeMaximumChunkZ=2051 \
  -PprobeParallelism=4 \
  -PprobeShuffleSeed=1337 \
  -PprobeMulticore=false \
  -PprobeStudio=true
```

| Probe | What it does |
|---|---|
| `genProbe` | Constructs the real engine and generates chunks into buffers |
| `riverTransectProbe` | Plans one tile and writes, per surface course, a top-down plan image (natural height in gray, eroded banks darker, water in blue, shore in tan), a cross-section image with five transects, and a summary listing the cut range, the largest step between adjacent bank columns, ocean writes, and channel cells whose water is not contained. Exits non-zero when any course writes the ocean or spills |
| `hydrologyPackProbe` | Scans explicit seed-tile combinations and fails unless every feature/profile selector required by that pack's enabled outlet topology is present for every seed. Also checks that no land column near a mouth has river writes below sea level, that exposed courses cut at least one block into the ground on average, and that adjacent bank columns never step by more than one block except across the water edge |
| `generationOrderProbe` | Hashes complete block and biome output across forward, reverse, shuffled, and bounded-parallel generation |

Before moving a release tag: validate the candidate tree, package the canonical closure, extract and validate the archive, then run the probes.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| No surface features | `hydrology.rivers.enabled`, `surface.enabled`, source density/floor, `minimumElevation`, effective placement/routing policy, and legal outlets |
| No underground features | `underground.enabled`, its independent source budget, fluid-level fit, effective policy, and a legal coastal or inland outlet within that head range |
| A route through hills is absent | The course needed a cut deeper than `channel.maximumIncision`; raise it, raise `routing.slopePenalty` so routes stay in valleys, or accept that the source has no open-air path |
| Valleys look too wide or too narrow | `banks.blendSlope` and the per-area `bankMultiplier`; the blend width is the cut depth times the slope |
| Water sits below the bank instead of flush with it | `channel.sink` is above `0`; set it to `0` |
| Banks repeat the surface layer down the cut | `banks.exposeCutStrata` is `false` |
| No inland grotto | Include `SINKHOLE_GROTTO` in `routing.inlandOutlets` and keep `grottos.inland.enabled` true |
| No coastal grotto | It needs a coastal cliff candidate (`grottos.coastal.enabled` and ground at least the grotto's vertical radius above the sea), outlet admission, and `routing.maximumCoastalOutletsPerTile` of at least `2` when the same coast also has beaches, since the first sea slot goes to a mouth |
| Unexpected content | Check effective dimension → region → biome policy inheritance and whether an empty array cleared a pool |
| Missing biome in find/goto | Reference it from a reachable policy and ensure every child/carving key exists |
| No deep lava | Check the `deepFluids` entry density, height envelope, spacing/footprint relationship, and both `containedPools` / `shortChannels` switches |
| No sea caves | `grottos.coastal.enabled` and `grottos.coastal.seaCaves.enabled` must both be true; the coast must stand `seaCaves.minimumCoastHeight` above the sea across the whole chamber (lower it on gentle coasts, or shrink `horizontalRadius`); `seaCaves.minimumSpacing` and the clearance from river mouths must leave room on the tile's coast; the swept chamber must fit `maximumVolume`; `CAVE_CONTAINMENT` rejections mean the chamber breaks out of the coast somewhere other than its ocean face, so lower `depth` or `headroom` |
| Hard boundary between generated areas | Confirm the world was updated through generation history, then check `generator.generationTransitionWidthBlocks` and the first generation-history error in the log. **Do not replace an epoch pack by hand** |
| `Hydrology tile x,z failed to plan` in the log | Terrain there generated without rivers. The error report names the column and lists the region, biome, fluid height, overlay, and every interpolator's bounds and generator heights, so check the generator or biome it names. The world stays usable |

Entry latency and the settings that drive it are in [33 - Performance Tuning](/iris/33-performance-tuning#symptom-entering-a-fresh-world-or-a-new-studio-takes-tens-of-seconds).
