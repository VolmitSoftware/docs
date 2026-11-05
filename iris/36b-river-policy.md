---
title: "Hydrology Policy"
description: "hydrologyPolicy: rainfall, pond density, climate zones and their wetness bounds, where streams and ponds may form, the fluid of an area's streams, rivers, ponds, lakes and cave pools, and the biomes along the water"
published: true
date: 2026-11-02T23:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
`hydrologyPolicy` tunes the water of one area without changing the dimension's physical settings: how much rain falls there, how many ponds it gets, whether the dimension's wet and dry climate zones apply there and how wet they may make it, whether streams and ponds may form at all, what fluid fills its streams, rivers, ponds, lakes and cave pools, which plants grow in and beside the water, and which biomes line the water's edge. It sits on the dimension, on regions and on biomes, and every value a region or biome leaves unset is inherited, except that a `wetness` bound left out is `0` for `min` and `1` for `max` (see [Inheritance](#inheritance)). The physical settings are on [36 - Hydrology](/iris/36-rivers), and `hydrology.enabled: true` on the dimension is what makes any policy take effect.

## Workflow

1. **A pond-heavy biome.** `"pondDensity": 2.5` with `"rainfall": 1.6`. More cups are seeded in the biome, along its streams and elsewhere, and its ponds stay full. Natural hollows already keep their ponds at the default `ponds.natural.keep` of `1`. Streams there also grow larger, because the extra rainfall reaches every channel downstream.
2. **A dry desert.** `"rainfall": 0.9` thins the stream heads and, where the wet and dry zones do not apply, lowers pond surfaces by one block at the default `ponds.dryDrawdown` of `6`; inside the zones a `wetness` `max` lowers them instead (step 3). `"streams": "BLOCK"` and `"ponds": "BLOCK"` stop them starting there at all.
3. **A swamp that stays wet and a desert that stays dry.** With `hydrology.climate` on, `"wetness": {"min": 0.7}` on a swamp keeps at least 70% of its rainfall and pond density inside dry zones, and `"wetness": {"max": 0.35}` on a desert region keeps at most 35% of them inside wet zones. Their ponds drop below their freeboard by the bounded wetness: at the default `ponds.dryDrawdown` of `6`, swamp ponds in a dry zone sit at most two blocks lower and desert ponds in a wet zone four.
4. **Lava in a volcanic biome.** Define a `lava` profile in the dimension's `hydrology.fluids`, then set `"fluid": "lava"` on the biome. Its ponds and lakes fill with lava, and every stretch of stream or river that starts in the biome runs as lava to the next confluence, pond or estuary, even beyond the biome; streams that start elsewhere keep their tier's fluid while they cross it. The rest of the dimension keeps water. Give the `lava` profile a `seam` in `hydrology.fluids` to line its edges where it meets water; without one, `/iris pack validate` warns that the lava can meet the sea or a water river. Add `"climateZones": false` so the biome keeps its own streams and ponds even where a dry climate zone covers it. On a cave biome the same `fluid` setting fills its cave pools with lava; cave pools under the volcanic surface biome are unaffected by it.
5. **Beaches along the water.** List the shore biomes on the region with `shoreBiomes`, and turn the band on with `shoreBiomeWidth` on the dimension so every region shares one width. The width defaults to `0`, which places no shore biome. A biome that should keep its own ground right up to the water sets `"shoreBiomes": []`.
6. Run `/iris pack validate` after every policy edit; see [36c - Water Inspection](/iris/36c-river-inspection#validation).

## Fields

| Field | Default | Purpose |
|-------|---------|---------|
| `rainfall` | inherit, `1` | Multiplier on the water that falls in this area, `0..16`. Higher values grow more and larger streams; where the wet and dry zones do not apply, values below `1` lower pond surfaces |
| `pondDensity` | inherit, `1` | Multiplier on how many ponds form in this area, `0..16` |
| `climateZones` | inherit, `true` | Whether the dimension's wet and dry zones (`hydrology.climate`) scale this area's rainfall and pond density; `false` keeps the full values even inside a dry zone |
| `wetness` | inherit, none | Bounds `min` and `max`, `0..1`, on the wetness of the dimension's wet and dry zones in this area: `min` keeps the area wet inside a dry zone, `max` keeps it mostly dry inside a wet zone. `min` defaults to `0` and `max` to `1` |
| `streams` | inherit, `ALLOW` | Whether streams and rivers may form in this area: `ALLOW` or `BLOCK` |
| `ponds` | inherit, `ALLOW` | Whether ponds may form in this area: `ALLOW` or `BLOCK` |
| `fluid` | inherit, none | Name of a fluid profile from `hydrology.fluids` that fills the water in this area: the ponds and lakes whose floor lies here instead of `ponds.fluid`, and every stretch of stream or river whose upstream end lies here instead of its tier's `fluid`. It cannot name a seam profile. Set on a cave biome, a region or the dimension, it also fills the cave pools there instead of `cavePools.fluid`; a surface biome's value never reaches cave pools |
| `decorators` | inherit, none | Plants for the rivers, streams, ponds and lakes in this area, replacing the `tiers[].decorators` and `ponds.decorators` lists there; an empty list grows no plants |
| `shoreBiomes` | inherit, none | Biomes placed along the water's edge in this area, in a band as wide as `shoreBiomeWidth`; without a width above `0` the list places nothing. An empty list clears the inherited biomes |
| `shoreBiomeWidth` | inherit, `0` | Width in blocks of the shore biome band along the water, `0..31`; `0` places no shore biome |

```json
{
  "hydrologyPolicy": {
    "rainfall": 1.6,
    "pondDensity": 2.0,
    "climateZones": true,
    "wetness": { "min": 0.7, "max": 1 },
    "streams": "ALLOW",
    "ponds": "ALLOW",
    "fluid": "water",
    "shoreBiomes": ["temperate/shore/beach", "temperate/shore/oak-beach"],
    "shoreBiomeWidth": 4
  }
}
```

### Inheritance

A column's policy is resolved from the biome first, then from the biomes it grows inside as a [child](/iris/13-biomes#children): its parent, then that parent's own parent, back to the biome the region placed. The region comes next, then the dimension. The first scope that sets a value wins; an unset or `null` value falls through to the next scope. The parent is the biome the child grows inside at that column, so a child listed under two parents takes each parent's values inside that parent, and a biome a region lists directly has no parent where the region places it. With no value at any scope, rainfall and pond density are `1`, climate zones apply with their wetness unbounded, streams and ponds are allowed, ponds and lakes keep `ponds.fluid`, channels keep their tier's `fluid`, and no shore biome is placed.

Cave pools resolve `fluid` from the cave biome at the pool, then the region, then the dimension, and keep `cavePools.fluid` when no scope sets one. Cave biomes grow no children in caves, so a cave biome takes nothing from a biome that lists it under `children`. The surface biome above a cave never counts, even near the surface where the cave uses the surface biome.

`wetness` is inherited as one value: a scope that sets it replaces both bounds, and a bound it leaves out is `0` for `min` and `1` for `max`. A swamp biome with `"wetness": {"min": 0.7}` inside a region with `"wetness": {"max": 0.35}` is bounded by `0.7` and `1`.

`shoreBiomes` and `decorators` are lists. An explicitly empty list (`[]`) at a scope clears the inherited shore biomes, or grows no plants, in that area.

### `rainfall`

Rainfall weights the flow that drains off every column of the area, so the catchment of channels downstream of a wet area grows faster: streams start sooner and reach the river and major-river tiers earlier. It also decides how many stream heads survive `drainage.wetnessThinning` (the kept share is the larger of `rainfall` and `drainage.minHeadKeep`), and, where the wet and dry zones do not apply, how far pond and lake surfaces drop below their spill point: ponds in an area with rainfall at or above `1` stay at their freeboard, and drier areas lose up to `ponds.dryDrawdown` extra blocks, rounded, so a rainfall of `0.9` lowers ponds by one block at the default drawdown of `6` and not at all at a drawdown of `3`. Inside the zones the zone wetness at the floor sets that drop instead (see [`wetness`](#wetness)). Rainfall lies in `0..16`; `/iris pack validate` reports a value outside it at every scope, and generation fails when the first chunk that resolves to it is made.

### `pondDensity`

Pond density scales the number of free-standing seeded cups: on ground that accepts a cup, an area seeds about `ponds.seeded.density` times `pondDensity` cups per 512 by 512 blocks before `hydrology.density` thins them, so `3` seeds three times as many cups as `1` and `0` seeds none. It also multiplies the chance of each chained cup along a stream. Natural hollows keep their ponds by `ponds.natural.keep`; `pondDensity` scales that share up to every qualifying hollow, so at the default `keep` of `1` only a value below `1` changes the natural ponds. Lakes and cave pools are not affected. Pond density lies in `0..16`; `/iris pack validate` reports a value outside it at every scope, and generation fails when the first chunk that resolves to it is made.

### `climateZones`

When the dimension turns on `hydrology.climate` ([36 - Hydrology](/iris/36-rivers)), each column's rainfall and pond density are multiplied by the wetness of its climate zone, so a dry zone starts few or no streams and ponds of its own. `"climateZones": false` exempts the area: its columns keep their full rainfall and pond density in every zone, and its ponds and lakes drop by its `rainfall` as they do with the zones off. Use it for an area that always carries its own water, such as a lava biome inside a dry zone. With no value at any scope the zones apply, and the setting has no effect while `hydrology.climate.enabled` is `false`.

### `wetness`

With `hydrology.climate` on, each column's rainfall and pond density are multiplied by the wetness of its climate zone, from `dryRainfall` in a dry zone to `1` in a wet one. `wetness` holds that value between `min` and `max` in the area. `"wetness": {"min": 0.7}` keeps a swamp at 70% or more of its rainfall and pond density inside a dry zone, and `"wetness": {"max": 0.35}` keeps a desert at 35% or less inside a wet zone. The area's `rainfall` and `pondDensity` still multiply the bounded value. The bounded value also sets how far a pond or lake whose floor lies in the area drops below its freeboard: `ponds.dryDrawdown` times one minus the wetness, rounded, so a wetness of `1` keeps it full and the area's `rainfall` does not change it. The bounds act on the zone wetness only, so they have no effect while `hydrology.climate.enabled` is `false` or where `climateZones` is `false`. Both bounds lie in `0..1` with `min` at or below `max`. `/iris pack validate` reports bounds out of order or out of range at every scope, and generation fails when the first chunk that resolves to them is made.

### `streams` and `ponds`

`BLOCK` on `streams` means no stream starts in the area. Water that drains in from an allowed area upstream still flows through. `BLOCK` on `ponds` means no natural pond, lake or seeded cup is placed whose floor lies in the area. Neither permission affects sea inlets or cave pools.

### `fluid`

A fluid replaces `ponds.fluid` for every pond and lake whose floor lies in the area, and the tier's `fluid` for every stretch of stream or river whose upstream end lies in the area. A stretch runs from a source or confluence to the next confluence, pond or mouth, and keeps one fluid for its whole length up to its estuary, which holds the sea's fluid: a lava stream that starts in a volcanic biome stays lava where it flows on through other biomes, and a water river that crosses the volcanic biome stays water, so two fluids meet only where streams join, flow into a pond or lake, or enter their estuary. A lava river needs no tier of its own. The fluid cannot be a seam profile; a `seam` on the fluid's profile lines its edges where it meets another fluid, see [`hydrology.fluids[]`](/iris/36-rivers#hydrologyfluids). Set on a cave biome, a region or the dimension, it also replaces `cavePools.fluid` for every cave pool whose site lies there, in the order given under [Inheritance](#inheritance); set on a surface biome, it never reaches the cave pools below. The name must be a profile in the dimension's `hydrology.fluids`. `/iris pack validate` reports an undefined name at every scope. At world start, an undefined fluid on the dimension, a region or any biome the dimension reaches stops the engine.

### `decorators`

A list of water decorators written like `tiers[].decorators` and `ponds.decorators` ([36 - Hydrology](/iris/36-rivers#water-plants)): `partOf` `SEA_FLOOR`, `SEA_SURFACE` or `SHORE_LINE`, with the same placement rules. The first list set on the biome, on the biomes it grows inside as a child, on the region or on the dimension replaces the tier and pond lists as a whole for every water column in that area, so a biome that wants only lily pads lists only lily pads, and `"decorators": []` grows nothing in its water. Unset inherits, and with no list anywhere the tiers and ponds use their own. The list is validated like the tier and pond lists, and its blocks are resolved when the world starts.

### Shore biomes

Shore biomes are an option that `shoreBiomeWidth` turns on. The width defaults to `0`, so a policy that only lists `shoreBiomes` places nothing. With a width, `shoreBiomes` places a biome on the dry ground along the water: every column within `shoreBiomeWidth` blocks of a channel, pond or lake whose ground is at or above the local water surface. The band stops at `31` blocks. Water columns and the ground beyond the band keep their natural biome. When several biomes are listed, one is chosen per 64-block patch, so a long bank changes beach type in coherent stretches rather than block by block.

The width is a separate value from the list, so a dimension can set `shoreBiomeWidth` once and let every region supply its own `shoreBiomes`. A region or biome with `shoreBiomeWidth: 0` keeps the inherited list but places none of it.

The list and the width resolve separately for every column, as the first list and the first width set on the biome, on the biomes it grows inside as a child, on the region and on the dimension. A listed shore biome is a reachable biome only where its list resolves together with a width above `0` while hydrology is enabled: `/iris find biome` and `/iris goto biome` then accept it, and it needs no entry in a region's biome lists. A list that no width above `0` reaches places nothing and adds nothing to the reachable biomes, and `/iris pack validate` warns about it, naming the dimension, region or biome that lists it. A shore biome that does not exist fails generation with an error that names the biome, the biome, region or dimension that lists it, the biome it was resolved for and the region.

## Managed pack policies

The Overworld and Underworld packs use the same policies. The dimension sets rainfall `1.2` and pond density `1.5`, and lists the temperate beaches (`temperate/shore/beach`, `temperate/shore/oak-beach`) as shore biomes. Both dimensions set `hydrology.density` to `0.5`, which halves eligible feature frequency after these local policies apply, and turn on `hydrology.climate` with `SIMPLEX` zones at zoom `24`, dryness `0.5`, transition `0.15` and dry rainfall `0`, so the dry zones start no streams or ponds of their own and the policies below apply in full inside the wet zones.

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
| `tropical/volcanic-plains`, `tropical/volcanoes` | rainfall `1.8`, pond density `3`, fluid `lava`, `climateZones: false` |

Children of these biomes that leave a value unset take it from the biome they grow inside. Pond surfaces inside the climate zones follow the zone wetness, not rainfall, so the regions at rainfall `0.9` and `0.92` keep their ponds full inside the wet zones; their rainfall still thins stream heads and shrinks the catchment that drains off them. The volcanic biomes fill the streams, rivers, ponds and lakes inside them with lava and keep them in every climate zone. No managed policy sets `shoreBiomeWidth`, so the shore biome band is off in both packs and the water runs through each biome's own ground. A fork that sets a width on the dimension gets these beaches along every river, pond and lake.

Related:

- [11 - Dimensions](/iris/11-dimensions)
- [12 - Regions](/iris/12-regions)
- [13 - Biomes](/iris/13-biomes)
- [36 - Hydrology](/iris/36-rivers)
- [36c - Water Inspection](/iris/36c-river-inspection)
