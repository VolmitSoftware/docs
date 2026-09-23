---
title: "Regions"
description: "Iris documentation: Regions"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
A region is the middle layer of a pack. The dimension picks a region for every column. The region then decides which biomes are allowed there. Files live at `regions/<loadKey>.json`. A region carries four biome lists: land, sea, shore, and cave. It also carries a zoom for each list and the shoreline band width. Attach any content you want scoped to that part of the world.

Related:

- [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)
- [11 - Dimensions](/iris/11-dimensions)
- [13 - Biomes](/iris/13-biomes)
- [14 - Generators & Noise](/iris/14-generators-noise)
- [15 - Caves & Carving](/iris/15-caves-carving)
- [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits)
- [20 - Object Placement](/iris/20-object-placement)

## Region and biome selection

The dimension's `regions` list selects which regions can appear. Each region supplies separate `landBiomes`, `seaBiomes`, `shoreBiomes`, and `caveBiomes` lists.

Set the broad land and sea distribution with the dimension's `continentalStyle` and `landChance`. Regions supply the biome choices; include sea and shore biomes wherever terrain can reach the water line. See [Land-only dimensions](#land-only-dimensions) before leaving those lists empty.

Region zooms multiply the dimension zooms. For example, `landBiomeZoom: 3.5` makes land biome patches in that region roughly 3.5 times wider than at the dimension's base scale.

### Rarity and list order

`rarity` controls relative frequency: a candidate with `rarity: 2` has half the selection weight of one with `rarity: 1`; `rarity: 10` has a tenth. Region rarity is capped at `128`, and biome rarity at `512`. These ratios do not guarantee an exact percentage of the map.

Array order affects adjacency. Nearby entries tend to become neighbors in the world, so reordering a list can change biome borders. Distribution also depends on the dimension's `regionStyle` and `regionZoom`. Use `/iris studio regions` to measure each region's share of a sample area.

### The shore band

The dimension `fluidHeight` and the region's shore-height settings determine where sea, shore, and land biomes appear along the coast.

| Column height (relative to `fluidHeight`) | Resulting role |
|---|---|
| below `fluidHeight` | sea |
| exactly `fluidHeight` | shore |
| `fluidHeight - 1` up to `fluidHeight + shoreHeight` | shore |
| above `fluidHeight + shoreHeight` | land |

`shoreHeightMin` and `shoreHeightMax` set the vertical beach band. `shoreHeightZoom` controls how quickly its height varies along the coast: lower values give frequent changes, while higher values give longer, more uniform stretches.

Flat coastlines with a high `shoreHeightMax` produce wide beaches. Steep cliffs cross the same height band quickly, leaving narrow beaches. Set `shoreMinimumWidth` above zero to widen the band according to the local slope and preserve more beach across steep ground.

Renaming a region, changing `landBiomeZoom`, or changing the number of land biomes can also alter the shore-height pattern.

## Add a region

Start with a valid dimension and an existing root biome.

1. Create `regions/tutorial.json`:

```json
{
  "name": "Tutorial",
  "rarity": 1,
  "color": "#9BEE61",
  "landBiomes": ["starter"],
  "seaBiomes": [],
  "shoreBiomes": []
}
```

Replace `starter` with the exact load key of your existing biome. Use root parents only. Never list a biome that is already someone child.

2. Add `"tutorial"` to the dimension `regions` array.
3. Set `"focusRegion": "tutorial"` on the dimension. This selects that region for every column while you edit.
4. Validate the pack. Then open Studio on seed `1337` (`/iris studio open <pack> seed=1337` on Bukkit or `/iris studio open <pack> 1337` on mod loaders).
5. Fly into freshly generated chunks and run `/iris what region`.

Success: it reports `tutorial` everywhere. `/iris what biome` reports `starter`. Validation logs no unresolved keys.

6. Remove `focusRegion`. Reopen Studio. Travel until `tutorial` shows up on its own. Now add sea and shore biomes together, then cave biomes. Validate after each group.

## Walkthrough: make biomes bigger in one region only

Suppose the tutorial region biomes are too small and choppy. The rest of the dimension is fine.

```json
{
  "name": "Tutorial",
  "rarity": 1,
  "landBiomes": ["starter", "starter-hills"],
  "landBiomeZoom": 3.5
}
```

Observable result: individual land biome patches in this region become roughly 3.5x wider. Nothing outside the region changes. The dimension `biomeZoom` still applies on top. The bundled `temperate` region uses `3.5` for land, `6` for sea and `0.15` for shore. Shores are deliberately zoomed *down* so beach variants change every few dozen blocks along a coastline instead of running for hundreds of blocks.

Change one zoom at a time. Regenerate a fresh area between comparisons. Zooms do not affect already generated chunks.

## Walkthrough: widen the beaches

```json
{
  "shoreHeightMin": 1,
  "shoreHeightMax": 5.2,
  "shoreHeightZoom": 1.14
}
```

Observable result: the shore role now claims everything from one block under the water line up to about 5 blocks above it. Gently sloped coasts get much wider sand. If you lower `shoreHeightZoom`, the beach width varies more rapidly along the coast. If you raise it, you get long, uniform stretches.

For steep coastlines, set `shoreMinimumWidth` or adjust the terrain slope in the [generator](/iris/14-generators-noise).

## Land-only dimensions

`seaBiomes` and `shoreBiomes` are optional in the schema. Leaving them empty is only safe when no column can ever land at or below `fluidHeight`. That means every biome in the region uses positive generator `min` values. The dimension `landChance` must also keep the continental noise on land. Otherwise the sea or shore role has an empty candidate list at those columns.

```json
{
  "name": "Highlands",
  "rarity": 2,
  "landBiomes": ["highlands/plateau"],
  "seaBiomes": [],
  "shoreBiomes": []
}
```

`landBiomes` is always required.

## Load key

| Rule | Detail |
|------|--------|
| Folder | `regions/` |
| Key | Path relative to `regions/` with `.json` stripped |
| Example | `regions/temperate.json` -> key `temperate` |
| Referenced from | The dimension `regions` array, using that key |

## Field reference

### Identity and selection

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `name` | string | `"A Region"` | Display name shown by `/iris what region` and the studio map. Renaming can change the shore-height pattern. Required, minimum 2 characters. |
| `rarity` | int 1-128 | `1` | Controls relative selection weight. `2` gives half the weight of `1`; `8` gives an eighth. Raise it for a region you want as an occasional surprise. Leave it at `1` for the backbone of the world. |
| `color` | string | `null` | Hex color (`#9BEE61`) used by the studio map and `/iris studio map`. Set it when you are visually debugging region distribution. Without it Iris derives a color from the land biomes vanilla derivatives. |

### Biome lists

| Field | Type | Required | What it does |
|-------|------|----------|--------------|
| `landBiomes` | string[] | Yes | Candidates for columns whose height ends up above the shore band. This is the list that defines the character of the region. |
| `seaBiomes` | string[] | No | Candidates for columns below the water line. Empty is only valid if no column in this region can ever fall below `fluidHeight`. |
| `shoreBiomes` | string[] | No | Candidates for the vertical band around the water line. Usually beaches and stony shores. |
| `caveBiomes` | string[] | No | Candidates for the biome used underground for layers, decorators and cave-anchored structures. Omitted or empty lists use the surface biome for biome queries and saved generation history, unless a dimension carving band selects another biome. |

Packs without caves, including superflat packs, can omit `caveBiomes`. This fallback does not enable cave generation or add entries to the cave decoration and structure pools.

List root parents only. Child biomes are declared on their parent via `children` (see [13 - Biomes](/iris/13-biomes)). If you list a child here, it competes as a root as well and breaks the nesting you intended. Keys are load keys relative to `biomes/`. `temperate/plains` means `biomes/temperate/plains.json`.

A biome does not declare its own role. The role (`LAND`, `SEA`, `SHORE`, `CAVE`) comes from which list selected it. The same biome file can appear in more than one list. It then takes a different role in each.

### River policy

`riverPolicy` overrides the dimension policy anywhere this region is selected; a biome policy overrides it again. Omitted policy members inherit. An explicit empty biome or profile list clears the inherited list.

| Policy field | What it controls |
|--------------|------------------|
| `placement` | `DISABLED`, `TRANSIT_ONLY`, `NATURAL`, `PREFERRED_HEADWATER`, or `REQUIRED_HEADWATER` source and transit admission |
| `routing` | `BLOCK`, `AVOID`, or `ALLOW` terrain-routing treatment |
| `outletAdmission` | Whether accepted river outlets may terminate in this region |
| `profiles` | Preferred dimension-owned hydrology profile ids |
| `surfaceBiomes`, `mouthBiomes`, `shoreBiomes` | Biomes selected for the wet channel, outlet, and shore bench |
| `bankBiomes`, `floodedCaveBiomes` | Biomes selected for the eroded bank outside the bench and for flooded underground or grotto volume |
| `surfacePools` | Standing pool ids from `hydrology.surfacePools` allowed in this region; an empty list disables them |
| `widthMultiplier`, `depthMultiplier` | Accepted channel-size multipliers |
| `incisionMultiplier` | Maximum terrain-incision multiplier; zero forbids incision |
| `routingMultiplier` | Terrain-guided route-cost multiplier |
| `bankMultiplier` | Multiplier on the eroded bank width outside the shore bench |
| `shoreBiomeWidth` | Width in blocks of the `shoreBiomes` band beside the water; unset regions use `banks.shoreWidth` |
| `shoreWidth` | Width in blocks of the flattened shore bench beside the water; unset regions use `banks.shoreWidth`, and `0` starts the eroded valley side at the waterline |
| `erosion` | `false` stops rivers eroding a valley in this region, leaving only the channel and the bench; unset regions follow `surface.erosion.enabled` |
| `confined` | `true` makes this region a closed drainage basin: a river born here keeps its whole route and its outlet inside it, and a river that flows in never leaves |

The physical drainage graph, density, channel dimensions, and legal outlet families remain dimension-owned. See [11 - Dimensions](/iris/11-dimensions#terrain-first-hydrology) and [36 - Rivers](/iris/36-rivers).

### Zooms and the shore band

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `landBiomeZoom` | double >= 0.0001 | `1` | Multiplies the land biome patch size in this region only. Raise it for continent-scale biomes. Lower it for a busy patchwork. |
| `seaBiomeZoom` | double >= 0.0001 | `1` | Same for ocean-floor biomes. Oceans usually want a larger value than land so a single ocean type does not change every 200 blocks. |
| `shoreBiomeZoom` | double >= 0.0001 | `1` | Same for beach variants. Values well below 1 give a coastline that alternates between beach types frequently, which reads as natural variety. |
| `caveBiomeZoom` | double >= 0.0001 | `1` | Same for cave biomes. Larger values give long stretches of one cave character. |
| `shoreHeightMin` | double >= 0 | `1.2` | Lower bound, in blocks above the water line, of the shore band. |
| `shoreHeightMax` | double >= 0 | `3.2` | Upper bound of the shore band. Raise both to get taller, and therefore usually wider, beaches. |
| `shoreHeightZoom` | double >= 0.0001 | `3.14` | Horizontal scale of the noise that picks the band height per column. Small values make the beach width vary rapidly along the coast. Large values make it uniform. |
| `shoreMinimumWidth` | double 0-64 | `0` | Minimum beach width in blocks across the ground. `0` keeps the band purely vertical. Above zero the band also climbs with the local slope so a steep coast still gets a beach; the climb is capped at three blocks of height per block of width. Distinct from `riverPolicy.shoreWidth`, which is the river bench. |

### Content attached to the region

Everything here applies anywhere this region is selected, on top of what the biome contributes.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `objects` | object-placement array | empty | `.iob` placements that should exist across the whole region rather than in one biome. Regional landmarks, scattered wrecks. Use `carvingSupport` to choose surface or cave placement. See [20 - Object Placement](/iris/20-object-placement). |
| `proceduralObjects` | procedural-object settings | empty | Trees, ruins, formations, coral, fungi and crystals generated from parameters rather than `.iob` files. See [17 - Procedural Objects](/iris/17-procedural-objects). |
| `structures` | structure-placement array | empty | Jigsaw and native structure placements evaluated where this region owns the chunk center. Use this instead of copying a placement onto every biome in the region. See [21 - Jigsaw Structures](/iris/21-jigsaw-structures). |
| `entitySpawners` | string[] | empty | Keys under `spawners/` that keep replenishing mobs while a player is in this region. See [23b - Entities & Spawners](/iris/23b-entities-spawners). |
| `effects` | effect array | empty | Client-side ambience (potion effects, sounds, particles) delivered per player by packet. Use for regional mood. No two players see each other effects. |
| `loot` | loot settings | empty | Loot tables that apply to containers generated in this region. |
| `blockDrops` | block-drop array | empty | Overrides what blocks drop when broken inside this region. |
| `deposits` | deposit array | empty | Blob-style deposits added on top of the dimension deposits. Use for regional stone variants and ore pockets. |
| `depositVariants` | deposit-variant array | empty | Remaps deposit blocks inside a Y band. Evaluated after the biome variants and before the dimension. First matching rule in this tier wins. |
| `ores` | noise-ore array | empty | Vein-style ores. Use `generateSurface` to choose surface or underground placement. |
| `caveProfile` | cave profile | default profile | Cave density, thresholds and surface behavior for this region. Biome profiles override this. See [15 - Caves & Carving](/iris/15-caves-carving). |
| `riverPolicy` | river policy or null | inherit | Overrides the dimension hydrology policy for this region. See "River policy" above. |

Deposit precedence across tiers: biome variants, then region variants, then dimension variants. First match wins within each tier.

## Overworld sample: `temperate`

Path in the bundled pack: `packs/overworld/regions/temperate.json`.

| Field | Value | Why |
|-------|-------|-----|
| `name` / `color` | `Temperate` / `#9BEE61` | |
| `rarity` | `1` | Most common region. The world default character. |
| `landBiomes` | 28 keys, e.g. `temperate/plains`, `temperate/cherry-blossom-forest`, `vanilla/cherry_grove` | A large list keeps a single region visually varied without needing many regions. |
| `seaBiomes` | 6 keys, e.g. `ocean/deep`, `temperate/sea/ocean` | Natural below-sea-level biome selection. Hydrology surface, mouth, shore, bank, and flooded-cave content comes from the effective `riverPolicy`. |
| `shoreBiomes` | 5 keys, e.g. `temperate/shore/beach`, `vanilla/stony_shore` | |
| `caveBiomes` | 5 keys, e.g. `carving/drip`, `carving/moss-pillars` | |
| `landBiomeZoom` / `seaBiomeZoom` | `3.5` / `6` | Oceans stay recognisable across long swims. |
| `shoreBiomeZoom` / `caveBiomeZoom` | `0.15` / `3.3` | Beaches change type often. Caves keep one character for a while. |
| `shoreHeightMin` / `Max` / `Zoom` | `1` / `5.2` / `1.14` | Noticeably wide beaches with rapidly varying width. |
| `deposits`, `loot`, `caveProfile` | present | Iron/coal bands, `FALLBACK` loot mode, an enabled cave profile. |

The file sets no `objects`, `structures`, `ores`, `entitySpawners` or `effects`. All of that lives on the biomes.

Region keys listed by the bundled overworld dimension: `frozen`, `hot`, `terralost`, `mushroom`, `forests`, `tundra`, `magnetics`, `temperate`, `estranged`, `tropical`, `swamp`, `prismatics`.

## Placement rules

Region objects obey each placement's `carvingSupport`; cave-only placements do not appear on the surface. Structure placements from the dimension, region, surface biome, and cave biome can all apply to a chunk. The region and biome choices use the chunk center; cave biomes contribute only structures with cave anchors.

Region changes affect newly generated chunks. Use fresh terrain when comparing rarity, zoom, or content settings.
