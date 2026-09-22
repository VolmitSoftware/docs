---
title: "River Inspection"
description: "Find river features, inspect them in Vision, and validate hydrology settings"
published: true
date: 2026-09-21T08:06:52.361Z
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

Searches cover at most 8,192 blocks or fifteen routing tiles, whichever is smaller. Rare features can take longer to find. Use `/iris pack validate` to check which feature types your pack enables. Older generated areas without saved river information may not appear in locator results.

## Rejection reasons

Vision can show rejected candidates and their rejection reasons.

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
- surface-sinkhole settings and allowed inland outlets;
- ordered styled ranges and dimension-height fit;
- `minimumBlendWidth` no greater than `maximumBlendWidth`;
- unique river-profile and deep-fluid IDs with nonempty fluid palettes, and no deep-fluid ID that collides with a built-in feature selector;
- deep-fluid spacing, footprint, depth, headroom, and height relationships;
- valid policy enums, nullable Boolean and numeric fields, unique references, and known profile IDs;
- existing biome references, including `bankBiomes`, and the complete reachable policy/child/carving closure;
- required mantle and carving capabilities.

At most 64 river profiles, 64 deep-fluid entries, and 128 references in each policy profile or biome list are permitted. **Fix validation errors before creating a world, opening Studio, or packaging the pack.**

## Adjusting a pack

| Symptom | Check |
|---------|-------|
| No surface features | `hydrology.rivers.enabled`, `surface.enabled`, source density/floor, `minimumElevation`, effective placement/routing policy, and legal outlets |
| No underground features | `underground.enabled`, its independent source budget, fluid-level fit, effective policy, and a legal coastal or inland outlet within that head range |
| A route through hills is absent | The course needed a cut deeper than `channel.maximumIncision`; raise it, raise `routing.slopePenalty` so routes stay in valleys, or accept that the source has no open-air path |
| Valleys look too wide or too narrow | `banks.blendSlope` and the per-area `bankMultiplier`; the blend width is the cut depth times the slope |
| Water sits below the bank instead of flush with it | `channel.sink` is above `0`; set it to `0` |
| Banks repeat the surface layer down the cut | `banks.exposeCutStrata` is `false` |
| No inland grotto | Include `SINKHOLE_GROTTO` in `routing.inlandOutlets` and keep `grottos.inland.enabled` true |
| No coastal grotto | It needs a coastal cliff candidate (`grottos.coastal.enabled` and ground at least the grotto's vertical radius above the sea), an available outlet slot, and `routing.maximumCoastalOutletsPerTile` of at least `2` when the same coast also has beaches, since the first sea slot goes to a mouth |
| Unexpected content | Check effective dimension → region → biome policy inheritance and whether an empty array cleared a pool |
| Missing biome in find/goto | Reference it from a reachable policy and ensure every child/carving key exists |
| No deep lava | Check the `deepFluids` entry density, height envelope, spacing/footprint relationship, and both `containedPools` / `shortChannels` switches |
| No sea caves | `grottos.coastal.enabled` and `grottos.coastal.seaCaves.enabled` must both be true; the coast must stand `seaCaves.minimumCoastHeight` above the sea across the whole chamber (lower it on gentle coasts, or shrink `horizontalRadius`); `seaCaves.minimumSpacing` and the clearance from river mouths must leave room on the tile's coast; the swept chamber must fit `maximumVolume`; `CAVE_CONTAINMENT` rejections mean the chamber breaks out of the coast somewhere other than its ocean face, so lower `depth` or `headroom` |
| Hard boundary between generated areas | Check `generator.generationTransitionWidthBlocks` and use the [world update command](/iris/06-worlds-lifecycle#update-a-worlds-pack) to apply pack changes |
