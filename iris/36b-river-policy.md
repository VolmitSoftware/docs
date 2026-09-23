---
title: "River Policy"
description: "riverPolicy: where rivers may start, transit and end, their local budgets and geometry scales, and what content they carry"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
`riverPolicy` decides where rivers may start, transit and end, how many of them an area gets, how their geometry scales locally, and what biome content they carry. The physical system they are made of is on [36 - Rivers](/iris/36-rivers); river locators and Vision are on [36c - River Inspection](/iris/36c-river-inspection).

The effective policy is resolved in this order:

1. dimension
2. selected region
3. selected natural biome

A non-null field at the later scope replaces the inherited value. Omitted or `null` fields inherit. **An explicitly empty array clears an inherited profile or biome pool.**

```json
{
  "riverPolicy": {
    "placement": "PREFERRED_HEADWATER",
    "routing": "ALLOW",
    "outletAdmission": true,
    "profiles": ["water"],
    "surfaceBiomes": ["tundra/sea/river"],
    "mouthBiomes": ["ocean/deep"],
    "shoreBiomes": ["tundra/shore/snow"],
    "bankBiomes": ["tundra/frosted-peaks"],
    "floodedCaveBiomes": ["carving/ice-cave"],
    "surfacePools": [],
    "widthMultiplier": 0.8,
    "depthMultiplier": 1.1,
    "routingMultiplier": 0.7,
    "bankMultiplier": 1.5,
    "shoreBiomeWidth": 6,
    "shoreWidth": 4,
    "erosion": true,
    "confined": false
  }
}
```

## Placement and routing modes

| `placement` | Source and transit behavior |
|-------------|-----------------------------|
| `DISABLED` | No source, transit, or outlet through this policy area |
| `TRANSIT_ONLY` | May carry an accepted route but cannot begin one |
| `NATURAL` | Ordinary deterministic source admission |
| `PREFERRED_HEADWATER` | Eligible source sites receive higher priority |
| `REQUIRED_HEADWATER` | Enforces a deterministic minimum when a qualifying site can reach a physically legal outlet |

| `routing` | Route behavior |
|-----------|----------------|
| `BLOCK` | Prohibits transit |
| `AVOID` | Adds a strong route cost |
| `ALLOW` | Uses ordinary terrain-guided cost |

`outletAdmission` is a nullable Boolean independent of transit. `false` prevents a coastal or inland outlet from being anchored in that policy area without necessarily blocking a course through it.

`REQUIRED_HEADWATER` requests at least one source where terrain permits a complete river. `sources.minimumPerTile` raises that minimum and may override ordinary source spacing. It does not impose a minimum on areas using only `NATURAL` placement.

## Fields

| Field | Meaning |
|-------|---------|
| `profiles` | Permitted river fluid-profile IDs |
| `surfaceBiomes` | Content of the wet channel |
| `mouthBiomes` | Sea mouth and coastal-grotto content |
| `shoreBiomes` | Content of the shore band beside the water |
| `bankBiomes` | Content of the eroded bank and valley blend outside the shore; leave it empty to keep the parent biome |
| `floodedCaveBiomes` | Underground, grotto, and deep-fluid content |
| `surfacePools` | Standing pool ids from `hydrology.surfacePools` allowed in this area; an empty list disables them |
| `surfaceSourceDensity` | Expected surface sources per fully covered tile, `0..64`; unset inherits the dimension surface source density |
| `surfaceSourceSpacing` | Minimum surface source spacing in blocks, `0..8192`; unset inherits `surface.sources.minimumSpacing` |
| `surfaceTributaries` | Extra surface courses per outlet, `0..4`; unset inherits `routing.tributaries` |
| `surfaceInlandOutlets` | Surface inland outlet budget per fully covered tile, `0..256`; unset inherits `routing.maximumOutletsPerTile` |
| `surfaceCoastalOutlets` | Surface coastal outlet budget per fully covered tile, `0..64`; unset inherits `routing.maximumCoastalOutletsPerTile` |
| `surfaceMinimumCourseLength` | Minimum complete surface course length from this area, `16..4096` blocks; unset inherits `routing.minimumSurfaceCourseLength` |
| `surfaceMaximumIncision` | Maximum surface channel cut at this terrain column, `1..32` blocks; also caps bank fill. Unset inherits `surface.channel.maximumIncision`. Ocean inlets retain their separately configured incision allowance |
| `widthMultiplier` | Channel-width scale, greater than zero through `16` |
| `depthMultiplier` | Channel-depth scale, greater than zero through `16` |
| `incisionMultiplier` | Local scale on the resolved surface incision cap, `0..16`; it may tighten the permitted cut but cannot exceed that cap |
| `routingMultiplier` | Local route-cost scale, `0..64` |
| `bankMultiplier` | Local scale on `banks.blendSlope`, `0..4`; below `1` gives steeper, narrower valleys and above `1` wider, gentler ones |
| `shoreBiomeWidth` | Width in blocks of the shore biome band beside the water, `0..32`; unset areas use `banks.shoreWidth` |
| `shoreWidth` | Width in blocks of the flattened shore bench beside the water, `0..16`; unset areas use `banks.shoreWidth`, and `0` starts the eroded valley side at the waterline |
| `erosion` | `false` stops rivers eroding a valley in this area, leaving only the channel and the bench; unset areas follow `surface.erosion.enabled` |
| `confined` | `true` keeps rivers inside this region (or biome): see [confined](#confined) |

## Local surface budgets

The `surfaceSource*`, `surfaceTributaries`, and `surface*Outlets` controls override surface river density, spacing, tributaries, and outlet limits for this area. Counts scale with the area covered. `surfaceMinimumCourseLength` and `surfaceMaximumIncision` control course length and channel depth. These settings do not change underground source or tributary settings.

**Density is a target, not a guaranteed river count** — terrain, minimum course length, and containment still limit acceptance.

## Shore geometry versus shore content

`shoreWidth` is the geometry: the flattened bench cut level with the bank top. It is the same measurement as `banks.shoreWidth` and replaces it for one area, so a desert region can be given a four-block beach while a jungle biome inside it is given none and its valley side starts at the waterline.

`shoreBiomeWidth` sizes the band of `shoreBiomes` content beside the water without touching that geometry. The flattened shore and the eroded valley keep following `banks.shoreWidth` and the bank settings while the shore biome reaches as far as the policy says — over untouched ground when the band is wider than the valley, and not at all when it is `0`, which leaves the geometric shore carrying the bank biome.

The two are independent: a wide `shoreWidth` with `shoreBiomeWidth` at `0` gives a broad bench made of the bank biome, and a narrow `shoreWidth` with a wide `shoreBiomeWidth` gives a thin bench with shore content running out over untouched ground.

## `erosion`

The per-area form of `surface.erosion.enabled`. Set it to `false` to keep only the channel and shore bench, with no eroded valley beyond them. Terrain outside the bench keeps its natural height.

## `confined`

`confined` turns an area into a closed drainage basin. A course whose source lies in a confined region keeps its whole route inside that region, up to and including its outlet: a sea it reaches must lie in the same region, an inland outlet must sit inside it, and a source with no outlet reachable inside the area is rejected with the `CONFINED_NO_OUTLET` diagnostic instead of borrowing an outlet elsewhere. Set on a biome, the confines are that biome.

Containment applies to both surface and underground rivers.

Water that enters a confined area from outside stays there too: an unconfined river may flow into a confined region, but from that point it must end at one of that region's own outlets, **so an area with no outlet also blocks rivers from passing through it.**

## Content selection

Biome find/goto commands also support river-only surface biomes.

## Managed pack policies

The built-in tropical region uses density `8`, spacing `160`, tributaries `3`, inland outlets `3`, and coastal outlets `4`. It permits 64-block courses with a 32-block incision cap, uses width multiplier `0.65`, depth multiplier `1.15`, bank multiplier `1`, and a 1-block shore bench, and adds `tropical_lake` pools with radius `8..16` and depth `3`.

Volcanic Plains and Volcanoes select `volcanic_lava`, density `6`, spacing `128`, tributaries `2`, inland outlets `3`, and no coastal outlets. Their courses require 128 blocks, allow a 24-block incision cap, and use width multiplier `0.5` and depth multiplier `1.25`. Both use lava in both packs, with independent `volcanic_pool` bowls of radius `6..12` and depth `3`, and their empty content-biome lists retain volcanic layers along channels. The ambient tropical profile remains water in Overworld and lava in Underworld.

Region and biome policies override the dimension's defaults for their own areas.

## Authoring a policy

Give the dimension a default with `placement: NATURAL`, `routing: ALLOW`, a profile, and the content pools you want everywhere. Then in regions and biomes override only what differs:

- `placement: DISABLED` for deserts that should stay dry
- `routing: AVOID` for terrain rivers should skirt
- `PREFERRED_HEADWATER` on mountain biomes
- `bankBiomes` and `shoreBiomes` where the valley should read differently from its surroundings
- `bankMultiplier` above `1` for soft, wide valleys, below `1` for gorges

Run `/iris pack validate` after every policy edit — see [36c - River Inspection](/iris/36c-river-inspection#validation).
