---
title: "Hydrology Policy"
description: "hydrologyPolicy: rainfall, pond density, where streams and ponds may form, the fluid of an area's ponds, lakes and cave pools, and the biomes along the water"
published: true
date: 2026-10-26T02:45:59.200Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
`hydrologyPolicy` tunes the water of one area without changing the dimension's physical settings: how much rain falls there, how many ponds it gets, whether streams and ponds may form at all, what fluid fills its ponds, lakes and cave pools, which plants grow in and beside the water, and which biomes line the water's edge. It sits on the dimension, on regions and on biomes, and every value a region or biome leaves unset is inherited. The physical settings are on [36 - Hydrology](/iris/36-rivers), and `hydrology.enabled: true` on the dimension is what makes any policy take effect.

## Workflow

1. **A pond-heavy biome.** `"pondDensity": 2.5` with `"rainfall": 1.6`. More cups are seeded in the biome, along its streams and elsewhere, and its ponds stay full. Natural hollows already keep their ponds at the default `ponds.natural.keep` of `1`. Streams there also grow larger, because the extra rainfall reaches every channel downstream.
2. **A dry desert.** `"rainfall": 0.9` thins the stream heads, and at the default `ponds.climateDrawdown` of `6` lowers pond surfaces by one block; `"streams": "BLOCK"` and `"ponds": "BLOCK"` stop them starting there at all.
3. **Lava ponds in a volcanic biome.** Define a `lava` profile in the dimension's `hydrology.fluids`, then set `"fluid": "lava"` on the biome. Its ponds and lakes fill with lava while the rest of the dimension keeps water; streams and rivers keep their tier's fluid. On a cave biome the same setting fills its cave pools with lava.
4. **Beaches along the water.** List the shore biomes on the region with `shoreBiomes`, and turn the band on with `shoreBiomeWidth` on the dimension so every region shares one width. The width defaults to `0`, which places no shore biome. A biome that should keep its own ground right up to the water sets `"shoreBiomes": []`.
5. Run `/iris pack validate` after every policy edit; see [36c - Water Inspection](/iris/36c-river-inspection#validation).

## Fields

| Field | Default | Purpose |
|-------|---------|---------|
| `rainfall` | inherit, `1` | Multiplier on the water that falls in this area, `0..16`. Higher values grow more and larger streams and keep ponds fuller |
| `pondDensity` | inherit, `1` | Multiplier on how many ponds form in this area, `0..16` |
| `streams` | inherit, `ALLOW` | Whether streams and rivers may form in this area: `ALLOW` or `BLOCK` |
| `ponds` | inherit, `ALLOW` | Whether ponds may form in this area: `ALLOW` or `BLOCK` |
| `fluid` | inherit for ponds and lakes, none | Name of a fluid profile from `hydrology.fluids` that fills the ponds and lakes whose floor lies in this area instead of `ponds.fluid`. Set on a cave biome, it also fills that biome's cave pools instead of `cavePools.fluid`; cave pools read only the cave biome's own value. Channels always use the fluid of their tier |
| `decorators` | inherit, none | Plants for the rivers, streams, ponds and lakes in this area, replacing the `tiers[].decorators` and `ponds.decorators` lists there; an empty list grows no plants |
| `shoreBiomes` | inherit, none | Biomes placed along the water's edge in this area; an empty list clears the inherited biomes |
| `shoreBiomeWidth` | inherit, `0` | Width in blocks of the shore biome band along the water, `0..31`; `0` places no shore biome |

```json
{
  "hydrologyPolicy": {
    "rainfall": 1.6,
    "pondDensity": 2.0,
    "streams": "ALLOW",
    "ponds": "ALLOW",
    "fluid": "water",
    "shoreBiomes": ["temperate/shore/beach", "temperate/shore/oak-beach"],
    "shoreBiomeWidth": 4
  }
}
```

### Inheritance

A column's policy is resolved from the biome first, then the region, then the dimension. The first scope that sets a value wins; an unset or `null` value falls through to the next scope. With no value at any scope, rainfall and pond density are `1`, streams and ponds are allowed, ponds and lakes keep `ponds.fluid`, and no shore biome is placed.

Cave pools are the exception: they read `fluid` from the cave biome's own policy only, with no fall-through, so a region or dimension `fluid` leaves them on `cavePools.fluid`.

`shoreBiomes` and `decorators` are lists. An explicitly empty list (`[]`) at a scope clears the inherited shore biomes, or grows no plants, in that area.

### `rainfall`

Rainfall weights the flow that drains off every column of the area, so the catchment of channels downstream of a wet area grows faster: streams start sooner and reach the river and major-river tiers earlier. It also decides how many stream heads survive `drainage.wetnessThinning` (the kept share is the larger of `rainfall` and `drainage.minimumHeadKeep`), and how far pond surfaces drop below their spill point: ponds in an area with rainfall at or above `1` stay at their freeboard, and drier areas lose up to `ponds.climateDrawdown` extra blocks, rounded, so a rainfall of `0.9` lowers ponds by one block at the default drawdown of `6` and not at all at a drawdown of `3`. Rainfall must be a finite value of `0` or more.

### `pondDensity`

Pond density multiplies the chance of each seeded cup and of each chained cup along a stream. Natural hollows keep their ponds by `ponds.natural.keep`; `pondDensity` scales that share too, so at the default `keep` of `1` only a value below `1` changes the natural ponds. Lakes and cave pools are not affected. Pond density must be a finite value of `0` or more.

### `streams` and `ponds`

`BLOCK` on `streams` means no stream starts in the area. Water that drains in from an allowed area upstream still flows through. `BLOCK` on `ponds` means no natural pond, lake or seeded cup is placed whose floor lies in the area. Neither permission affects sea inlets or cave pools.

### `fluid`

A fluid replaces `ponds.fluid` for every pond and lake whose floor lies in the area, and, when it is set on a cave biome itself, `cavePools.fluid` for every cave pool whose site lies in that biome. Channels are not affected: a stream or river always carries its tier's `fluid`, so a lava river needs a tier of its own. The name must be a profile in the dimension's `hydrology.fluids`. `/iris pack validate` reports an undefined name at every scope. At world start, a biome's undefined fluid stops the engine while cave pools are enabled; an undefined fluid on the dimension or a region, or on a biome with cave pools off, fails generation when the first chunk that resolves to it is made.

### `decorators`

A list of water decorators written like `tiers[].decorators` and `ponds.decorators` ([36 - Hydrology](/iris/36-rivers#water-plants)): `partOf` `SEA_FLOOR`, `SEA_SURFACE` or `SHORE_LINE`, with the same placement rules. The first list set on the biome, region or dimension replaces the tier and pond lists as a whole for every water column in that area, so a biome that wants only lily pads lists only lily pads, and `"decorators": []` grows nothing in its water. Unset inherits, and with no list anywhere the tiers and ponds use their own. The list is validated like the tier and pond lists, and its blocks are resolved when the world starts.

### Shore biomes

Shore biomes are an option that `shoreBiomeWidth` turns on. The width defaults to `0`, so a policy that only lists `shoreBiomes` places nothing. With a width, `shoreBiomes` places a biome on the dry ground along the water: every column within `shoreBiomeWidth` blocks of a channel, pond or lake whose ground is at or above the local water surface. The band stops at `31` blocks. Water columns and the ground beyond the band keep their natural biome. When several biomes are listed, one is chosen per 64-block patch, so a long bank changes beach type in coherent stretches rather than block by block.

The width is a separate value from the list, so a dimension can set `shoreBiomeWidth` once and let every region supply its own `shoreBiomes`. A region or biome with `shoreBiomeWidth: 0` keeps the inherited list but places none of it.

Listed shore biomes are reachable biomes while hydrology is enabled, whatever the width: they appear in schema suggestions, `/iris find biome` and `/iris goto biome` accept them, and they need no entry in a region's biome lists. A shore biome that does not exist fails generation with an error that names the biome, the biome it was resolved for and the region.

## Managed pack policies

The Overworld and Underworld packs use the same policies. The dimension sets rainfall `1.2` and pond density `1.5`, and lists the temperate beaches (`temperate/shore/beach`, `temperate/shore/oak-beach`) as shore biomes. Both dimensions set `hydrology.density` to `0.5`, which halves eligible feature frequency after these local policies apply.

| Region | `rainfall` | `pondDensity` | `shoreBiomes` |
|--------|-----------:|--------------:|---------------|
| `estranged` | `1.28` | inherit | `temperate/shore/beach`, `temperate/shore/oak-beach`, `ocean/shore/beach` |
| `forests` | `1.35` | inherit | `temperate/shore/beach`, `temperate/shore/oak-beach` |
| `frozen` | `1.05` | inherit | `frozen/shore/beach` |
| `hot` | `0.9` | inherit | `hot/shore/beach`, `hot/shore/beach-grass`, `mesa/shore/beach`, `savanna/shore/beach` |
| `magnetics` | `0.9` | inherit | `temperate/shore/beach`, `ocean/shore/beach` |
| `mushroom` | `1.69` | `2` | `mushroom/shore/beach` |
| `prismatics` | `0.92` | inherit | `prismatics/shore` |
| `swamp` | `1.8` | `2` | `swamp/shore/beach` |
| `temperate` | `1.44` | inherit | `temperate/shore/beach`, `temperate/shore/oak-beach`, `ocean/shore/beach` |
| `terralost` | `1.6` | `2` | `tundra/shore/beach` |
| `tropical` | `1.77` | `2.5` | `tropical/island-beach`, `tropical/beach`, `tropical/beach-bamboo`, `tropical/beach-charred` |
| `tundra` | `1.21` | inherit | `tundra/shore/beach`, `tundra/shore/beach-stone` |

| Biome | Policy |
|-------|--------|
| `frozen/mountains/large-mountain`, `tundra/frosted-peaks` | rainfall `1.53`, pond density `2` |
| `mountain/mountain` | rainfall `1.64`, pond density `2` |
| `terralost/alpine-highlands` | rainfall `1.77`, pond density `2` |
| `hot/mountain-middle` | rainfall `1.44` |
| `hot/desert-dunes` | rainfall `0.9` |
| `ocean/deep`, `prismatics/white` | `streams: BLOCK` |
| `tropical/volcanic-plains`, `tropical/volcanoes` | rainfall `1.8`, pond density `3`, fluid `lava` |

With the managed `ponds.climateDrawdown` of `3`, the regions at rainfall `0.9` and `0.92` keep their ponds full; their rainfall still thins stream heads and shrinks the catchment that drains off them. No managed policy sets `shoreBiomeWidth`, so the shore biome band is off in both packs and the water runs through each biome's own ground. A fork that sets a width on the dimension gets these beaches along every river, pond and lake.

Related:

- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [36 - Hydrology](/iris/36-rivers)
- [36c - Water Inspection](/iris/36c-river-inspection)
