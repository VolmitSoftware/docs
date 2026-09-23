---
title: "Procedural Objects"
description: "Iris documentation: Procedural Objects"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Procedural objects are structures Iris builds from JSON parameters instead of loading from `.iob` files. Six families exist, all under `proceduralObjects` on a biome or a region: trees, fungi, coral, crystals, formations, ruins.

Trees have their own page: [17b - Procedural Trees](/iris/17b-procedural-trees). This page covers the shared model, the other five families, and sapling overrides.

Related: [12 - Regions](/iris/12-regions), [13 - Biomes](/iris/13-biomes), [15 - Caves & Carving](/iris/15-caves-carving), [16 - Surfaces, Decorators & Deposits](/iris/16-surfaces-decorators-deposits), [18 - Structures Overview](/iris/18-structures-overview), [19 - Objects](/iris/19-objects), [20 - Object Placement](/iris/20-object-placement), [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

## Placement

Each entry generates `variants` different shapes from its settings and `seed`. Increase `variants` for more shapes, or change `seed` for a different set.

`chance` controls how often an entry places in a chunk. `density` is the number of attempts in a chunk that passes. `chance: 0.5, density: 4` gives four attempts in half the chunks.

Surface biome, region, and cave biome lists all contribute. A biome-owned `CARVING_ONLY` entry places only in that cave biome. Region-owned entries apply throughout the region. Use the [object placement settings](/iris/20-object-placement) to control terrain support and anchoring.

## Container (`IrisProceduralObjects`)

Snippet key: `procedural-objects`. Valid on biomes and regions.

| Field | Type | Family |
|-------|------|--------|
| `trees` | `IrisProceduralTree[]` | Trunk plus canopy, optionally branches, roots and forks. See [17b](/iris/17b-procedural-trees) |
| `fungi` | `IrisFungus[]` | Stem plus cap, or sideways shelf brackets |
| `coral` | `IrisCoral[]` | Waterlogged reef structures in five forms |
| `crystals` | `IrisCrystal[]` | Budding base with tapered shards. Cave-first |
| `formations` | `IrisFormation[]` | Natural rock landmarks with strata and erosion |
| `ruins` | `IrisRuin[]` | Man-made shapes with weathering, erosion and burial |

```json
{
  "proceduralObjects": {
    "trees": [ { "...": "..." } ],
    "crystals": [ { "...": "..." } ]
  }
}
```

## Shared placement fields

Every family supports these placement fields. Defaults differ per family and are noted where they diverge.

| Field | Default | What it does |
|-------|---------|--------------|
| `name` | family name | Used in logs and as the variant load key. Must be unique within a pack if you want to identify variants in debug output |
| `chance` | 0.4 (trees, fungi, coral), 0.2 (crystals), 0.05 (ruins), 0.02 (formations) | Probability the entry attempts anything at all in a given chunk. 0 never attempts. 1 attempts every chunk |
| `density` | `1` | Attempts once the chance roll passes. Raising this clusters objects. Raising `chance` spreads them |
| `variants` | 8 (trees), 6 (all others) | Number of distinct shapes, 1 to 64 |
| `seed` | `1337` | Bake seed. Change it to get an entirely different set of shapes from identical settings |
| `mode` | `CENTER_HEIGHT`, except ruins `MIN_HEIGHT` | Terrain anchor mode. `MIN_HEIGHT` plants the lowest footprint corner, good for slabs and rubble on slopes. `CENTER_HEIGHT` averages, good for tall pillars |
| `rotation` | identity | Rotates placements so variants do not all face the same direction |
| `clamp` | unlimited | Min and max terrain height at which the entry may place |
| `carvingSupport` | `SURFACE_ONLY`, except crystals `CARVING_ONLY` | `SURFACE_ONLY` places on terrain. `CARVING_ONLY` searches carved cave space. `ANYWHERE` uses the surface path without the surface-only rejection |
| `underwater` | `false`, except coral `true` | Anchors on terrain height ignoring the water surface, so the object grows from the seafloor instead of the waterline |
| `translate` | zero | XYZ offset. A negative Y sinks the object into the ground |
| `stiltSettings` | unset | Configuration for `STILT`, `MIN_STILT`, `FAST_STILT`, `FAST_MIN_STILT`, `CENTER_STILT`, `ERODE_STILT`, `ORGANIC_STILT` |
| `vacuumSettings` | unset | Configuration for `VACUUM`, `VACUUM_HIGH`, `VACUUM_FAST`, `VACUUM_ORGANIC`, `VACUUM_WAVY` |
| `surfaceSupportBuffer` | `3` (formations only) | Solid ground required around the footprint. Iris uses the larger of this and the dimension `objectSurfaceSupportBuffer` |

Only `CARVING_ONLY` entries take the cave path. Those search the chunk for an anchor using the active cave profile's `defaultObjectAnchor`, `anchorScanStep`, `anchorSearchAttempts`, and `objectMinDepthBelowSurface`; an entry that finds no anchor is skipped for that attempt. Dry entries reject water, explicit lava, and ordinary carved cells at or below the dimension cave-lava height. Set `underwater: true` only when a procedural object is intentionally allowed to anchor in cave fluid. The profile's `defaultObjectPlaceMode` overrides the entry `mode`, but only when the entry left `mode` at the default `CENTER_HEIGHT`. See [15 - Caves & Carving](/iris/15-caves-carving).

`plausible` is a **tree-only** field. Every other family places with decay prevention active.

## Fungi (`IrisFungus`)

Snippet key: `fungus`. A stem column with a cap grown on top, or a sideways shelf bracket.

| Field | Default | What it does |
|-------|---------|--------------|
| `stem` / `stemPalette` | `minecraft:mushroom_stem` | Stem material. Palette wins |
| `cap` / `capPalette` | `minecraft:red_mushroom_block` | Cap material. Palette wins |
| `stemHeightMin` / `stemHeightMax` | `5` / `9` | Stem height range spread over the variant pool |
| `stemWidth` | `1` (1–3) | 1 is a single column, 3 a chunky trunk |
| `stemCurve` | `0` | Degrees of lean off vertical |
| `stemLeanAzimuth` | `0` | Direction of that lean |
| `stemWaveAmplitude` | `0.4` | Blocks of sideways wobble up the stem, so it is not a ruler |
| `stemWavePeriods` | `1` | Full sine wobbles over the stem height |
| `capShape` | `DOME` | `DOME`, `FLAT`, `FUNNEL`, `CONICAL`, `FLAT_WIDE` |
| `capRadiusMin` / `capRadiusMax` | `3` / `5` | Cap radius from center to rim |
| `capThickness` | `1` (1–3) | Shell thickness. 1 is a thin skin, 3 a fleshy slab |
| `capSquish` | `0.4` | Vertical flatten, 0 full height and 1 a flat disc |
| `capDroop` | `20` | Degrees the rim curls toward the ground |
| `capOverhang` | `2` | Blocks the cap extends past the stem before the rim begins |
| `gillBlock` / `gillPalette` | unset | Underside layer — gills, or shroomlight for a glowing cap |
| `gillChance` | `0.85` | Share of underside blocks replaced when a gill block is set |
| `spotBlock` / `spotPalette` | unset | Speckles across the cap top |
| `spotChance` | `0.18` | Share of top blocks replaced, selected by value noise so spots cluster |
| `shelf` | `false` | Switches to a bracket polypore: a flat sideways fan off a very short or absent stem |
| `shelfRadius` | `3` | Fan radius in shelf mode |

## Coral (`IrisCoral`)

Snippet key: `coral`. Defaults to `underwater: true` and `waterlogged: true`, so it grows from the seafloor and stays alive.

| Field | Default | What it does |
|-------|---------|--------------|
| `waterlogged` | `true` | Forces every waterloggable block in the structure waterlogged. Set false for dead, dry coral on a beach |
| `form` | `BRANCHING` | `BRANCHING`, `FAN`, `BRAIN`, `PILLAR`, `TENDRIL`. Each runs a different generator |
| `block` / `blockPalette` | `minecraft:tube_coral_block` | Structural body. A palette mixes tube/brain/bubble/fire/horn tones across one reef |
| `tipBlock` / `tipPalette` | unset | Placed at branch tips and the top. `FAN` uses the highest occupied cell in each column, keeping tips on its silhouette |
| `tipChance` | `0.6` | Per eligible tip position |
| `heightMin` / `heightMax` | `4` / `8` | Overall height |
| `spread` | `3` | Horizontal reach. Arm length for `BRANCHING`, base footprint for the others |
| `sway` | `0.5` | Lateral wobble, 0 ruler-straight and 1 heavily wandering |
| `branchCount` | `4` (1–12) | `BRANCHING`: arms off the central stalk |
| `branchLength` | `3` | `BRANCHING`: arm length before the tip |
| `branchElevation` | `55` | `BRANCHING`: degrees up from horizontal. 90 is straight up |
| `branchAzimuth` | `GOLDEN_ANGLE` | `BRANCHING`: `GOLDEN_ANGLE`, `EVEN`, or `RANDOM` distribution around the stalk |
| `subBranches` | `true` | `BRANCHING`: split each arm once for a bushier reef |
| `subBranchCount` | `2` (1–5) | Sub-arms per arm |
| `subBranchScale` | `0.5` | Sub-arm length as a fraction of the parent |
| `tipClusterRadius` | `1` (0–4) | `BRANCHING` and `PILLAR`: tip cluster size |
| `brainRadius` | `3` (1–8) | `BRAIN`: blob radius |
| `brainRoughness` | `0.35` | `BRAIN`: surface wrinkling. 0 is a smooth dome |
| `pillarRadius` | `1` (1–12) | `PILLAR`: column radius |
| `fanWidth` | `3` (1–8) | `FAN`: half-width of the upright plane |
| `tendrilCount` | `4` (1–12) | `TENDRIL`: number of thin wavy stalks |

## Crystals (`IrisCrystal`)

Snippet key: `crystal`. A budding base blob with tapered shards radiating from it. Defaults to `carvingSupport: CARVING_ONLY` and `chance: 0.2`, so it needs carved cave space to place at all. See [15 - Caves & Carving](/iris/15-caves-carving) for the anchor settings that govern it.

| Field | Default | What it does |
|-------|---------|--------------|
| `growthSurface` | `FLOOR` | `FLOOR` points shards up, `CEILING` down, `WALL` outward. This orients the baked geometry only. Use the cave anchor mode to actually land it on a ceiling |
| `block` / `blockPalette` | `minecraft:amethyst_block` | Shard body. A palette mixes amethyst, calcite and tinted glass into one prismatic cluster |
| `tipBlock` / `tipPalette` | unset | Different block at the very point of each shard |
| `tipChance` | `0.6` | Per shard |
| `glow` | `false` | With no tip block set, sprinkles `glowBlock` among the tips instead |
| `glowBlock` | `minecraft:glowstone` | The light source used by `glow` |
| `baseBlock` / `basePalette` | `minecraft:budding_amethyst` | The blob the shards grow from |
| `baseRadius` | `1.6` | Blob radius. 0 makes shards spring from a single point |
| `baseNoise` | `0.35` | Surface lumpiness of the blob, so it is not a clean sphere |
| `shardCountMin` / `shardCountMax` | `5` / `11` | Shards per cluster |
| `shardLengthMin` / `shardLengthMax` | `3` / `8` | Shard length from base to tip |
| `shardBaseRadius` | `1.4` | Thickness at the shard base end |
| `shardTaper` | `0.85` | How aggressively it narrows. 0 is a near-constant column, 1 a sharp spike. Every shard ends in a single block regardless |
| `spreadAngle` | `45` | Half-angle of the cone the shards fan within. 0 makes them all parallel. Large values give a starburst |
| `distribution` | `GOLDEN_ANGLE` | `GOLDEN_ANGLE` for an evenly spaced rosette, `RANDOM` for a chaotic clump |
| `jitter` | `0.25` | Angular randomness on top of the distribution, so the cluster never looks mechanical |

## Formations (`IrisFormation`)

Snippet key: `formation`. Natural and magical landmarks. Default `chance: 0.02` — these are meant to be rare, and they are the family most likely to widen the pack's mantle radius.

| Field | Default | What it does |
|-------|---------|--------------|
| `form` | `SPIRE` | `SPIRE`, `HOODOO`, `ARCH`, `SEA_STACK`, `BOULDER`, `BASALT_COLUMN`, `ICEBERG`, `FISSURE`, `SPIRAL`, `OVERHANG` |
| `block` / `blockPalette` | `minecraft:stone` | Main rock body |
| `capBlock` / `capPalette` | unset | Caprock on the crown, and the overhanging cap for `HOODOO`. Unset means the main rock everywhere |
| `strataPalette` | unset | Horizontal color bands. Every `strataThickness` blocks the palette advances, which is what produces the badlands look |
| `strataThickness` | `3` (1–32) | Band thickness |
| `heightMin` / `heightMax` | `14` / `26` | Total height |
| `baseWidthMin` / `baseWidthMax` | `3` / `6` | Base radius |
| `topWidth` | `0` | Radius at the very top before the profile applies. 0 tapers to a point |
| `profile` | `TAPER` | `CONSTANT`, `LINEAR`, `TAPER`, `PARABOLIC`, `BULGE` — how the radius changes with height |
| `profileWaist` | `0.55` | Normalized height of the pinch for `PARABOLIC`, used by hoodoos |
| `profileWaistFloor` | `0.35` | Minimum radius fraction at that waist. Lower pinches tighter |
| `lean` | `0` | Degrees off vertical. The whole body is sheared |
| `leanAzimuth` | `0` | Lean direction |
| `roughness` | `0.3` | 3D noise perturbation of the radius, 0 clean and 1 heavily eroded. This is the main "does it look like rock" control |
| `jitter` | `0.15` | Per-block surface noise that adds and removes isolated edge blocks |
| `surfaceSupportBuffer` | `3` (0–16) | Solid ground required beyond the lowest footprint blocks. Iris takes the larger of this and the dimension `objectSurfaceSupportBuffer` |
| `hoodooCapRadius` | `3` | `HOODOO`: extra cap radius for the mushroom overhang. 0 disables it |
| `hoodooCapHeight` | `3` (1–6) | `HOODOO`: cap slab thickness |
| `archSpan` | `10` | `ARCH`: gap width between the legs |
| `archThickness` | `3` | `ARCH`: leg and span thickness |
| `archAsymmetry` | `0.35` (0–1) | `ARCH`: deterministic variation in leg steepness, crown position, depth bow and tube width. 0 mirrors the two sides. 1 is strongly organic |
| `basaltColumns` | `5` (2–12) | `BASALT_COLUMN`: columns per cluster |
| `basaltColumnRadius` | `1` | `BASALT_COLUMN`: radius of each column |
| `basaltHeightVariance` | `0.45` | `BASALT_COLUMN`: how much column heights differ, 0 all equal and 1 highly varied |
| `icebergPeaks` | `3` (1–12) | `ICEBERG`: irregular tapered summits above the broad faceted body |
| `fractureCount` | `3` (2–8) | `FISSURE`: separated shards divided by open cracks |
| `fractureSeparation` | `2` (1–16) | `FISSURE`: clear-air gap between neighboring shards |
| `spiralTurns` | `1.5` (0.25–6) | `SPIRAL`: complete turns from the grounded base to the curled tip |
| `spiralRadius` | `4` (1–32) | `SPIRAL`: starting distance from the open center. The radius tightens toward the tip |
| `spiralThickness` | `2` (1–8) | `SPIRAL`: radius of the swept tube |
| `overhangReach` | `8` (1–32) | `OVERHANG`: horizontal reach of the hooked cantilever |
| `overhangDrop` | `3` (0–16) | `OVERHANG`: downward curl at the free tip |

`ICEBERG` combines a low, wide body with independently varied summits. `FISSURE` keeps its shards disconnected so the cracks remain real negative space. `SPIRAL` sweeps a tightening helix with an open center. `OVERHANG` grows vertically before curling outward and down. `ARCH` sweeps one connected bridge between independently shaped feet, its configured height is the actual top bound, and the opening stays traversable. A pointed `SPIRE` always retains its final tip even at a zero-width top.

## Ruins (`IrisRuin`)

Snippet key: `ruin`. Man-made shapes that are weathered, eroded, and partly buried. Default `chance: 0.05` and `mode: MIN_HEIGHT`.

| Field | Default | What it does |
|-------|---------|--------------|
| `form` | `PILLAR` | `PILLAR` broken column, `WALL` gapped segment, `ARCH` two legs and a span, `FLOOR_SLAB` foundation patch, `RUBBLE` low scattered pile |
| `block` / `blockPalette` | `minecraft:cobblestone` | Bulk material before weathering |
| `heightMin` / `heightMax` | `4` / `9` | Structure height, or slab thickness and mound height for the flat forms |
| `widthMin` / `widthMax` | `1` / `3` | Footprint along X |
| `lengthMin` / `lengthMax` | `3` / `7` | Footprint along Z |
| `weatheredBlock` | `minecraft:mossy_cobblestone` | The weathered swap, used when no palette is set |
| `weatheringPalette` | unset | Palette of weathered variants, overriding the single block |
| `mossiness` | `0.45` | Share of the structure that weathers. The mask is noise-driven and biased toward lower rows, so moss climbs from the ground |
| `weatheringScale` | `1.0` (0–8) | Weathering noise scale. Higher gives busy speckles. Lower gives broad mossy zones |
| `erosion` | `0.25` | How crumbled it is. Blocks below this noise threshold are deleted. The bottom row and core legs are never eroded, so the shape does not collapse into confetti |
| `erosionScale` | `1.5` (0–8) | Erosion noise scale. Higher knocks out small holes. Lower carves large missing chunks |
| `buriedFraction` | `0.2` | Fraction of the height that sits below the surface, so the ruin reads as settled |
| `accents` | `[]` | `IrisRuinDecorator` entries applied after erosion |

### Ruin decorator (`IrisRuinDecorator`)

Snippet key: `ruin-decorator`.

| Field | Default | What it does |
|-------|---------|--------------|
| `target` | `TOP` | `TOP` sits on the highest block of each column. `SURFACE` clings to air-facing vertical faces. `BASE_SCATTER` rings the ground around the base |
| `block` | required | Block id. Ignored when `palette` is set |
| `palette` | unset | Noise palette, wins over `block` |
| `chance` | `0.4` | Per candidate position |
| `scatterRadius` | `2` | For `BASE_SCATTER`, how far beyond the footprint the ring extends |

## Sapling overrides (`IrisTree`) — a different system

`IrisTree` lives on **object placements** (`IrisObjectPlacement.trees`), not under `proceduralObjects`. It maps a grown sapling to that placement's objects. This is a gameplay growth replacement, not worldgen scatter, and it never touches procedural trees.

| Field | What it does |
|-------|--------------|
| `treeTypes` | Bukkit `TreeType` names this placement replaces, matched case-insensitively |
| `sizes` | `IrisTreeSize` entries (`width` by `depth`) describing the sapling footprints it applies to. Width and depth are matched either way round, so a 1x2 entry also matches 2x1 |
| `anyTree` | Removed. It was never read at runtime. Matching is by `treeTypes` only |
| `anySize` | Removed. It was never read at runtime. Matching is by `sizes` only |

Vanilla sapling growth continues until this is on. The enable recipe is [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough) Task 4.

Dimension `treeSettings` gates the whole feature:

| Field | Default | What it does |
|-------|---------|--------------|
| `enabled` | `false` | Off by default. Nothing replaces grown trees until this is true |
| `mode` | `FIRST` | `FIRST` uses biome matches and only falls back to region matches when the biome has none. `ALL` pools biome and region matches and picks randomly from the combined list. Dimension-level object placements are not consulted in either mode |

## Adding a family to a biome

1. Pick the family that matches the shape: trees for forests, fungi for mushroom biomes, coral for warm oceans, crystals for cave biomes, formations for deserts and coastlines, ruins for sparse land.
2. Add one entry with a single material, `chance: 1`, `density: 1`, `variants: 4`, and a fixed `seed`. Focus the biome and generate.
3. Get the silhouette right before you touch frequency. Dimensions, profile, and roughness change what the thing *is*; chance and density only change how often you meet it.
4. Add palettes, accents, and decorators once the shape holds up from several angles.
5. Match `carvingSupport` to the environment. Cave props also want a stilt place mode, either on the entry or through the cave profile's `defaultObjectPlaceMode`.
6. Drop `chance` to production values, remove the dimension `focus`, and verify the family stays inside the biomes and regions that declare it.
