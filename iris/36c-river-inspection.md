---
title: "River Inspection"
description: "Find river features, inspect them in Vision, and validate hydrology settings"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
Use Vision and the river locator to view rivers in an Iris world. The physical fields are on [36 - Rivers](/iris/36-rivers) and the policy fields on [36b - River Policy](/iris/36b-river-policy).

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

The **River network** view reads the accepted feature footprint and labels it `headwater / source`, `surface pool`, `riffle`, `cascade`, `waterfall`, `sinkhole`, `underground pool`, `underground drop`, `coastal grotto`, `inland grotto`, `mouth`, `deep pool`, or `deep channel`. Arrows at river sources show the flow direction.

Rejected candidates use visibly separate `projected source`, `projected outlet`, and `projected deep fluid` colors. These candidates do not generate as rivers or appear in locator results.

## `/iris find river`

Locate accepted features from an Iris world. On Bukkit, `goto` is an alias of `find`; `/iris goto river type=surface` searches and teleports, while `teleport=false` only reports coordinates. Changing worlds during the search cancels the pending teleport.

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
