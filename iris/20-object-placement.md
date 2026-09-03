---
title: "Object Placement"
description: "Iris documentation: Object Placement"
published: true
date: 2026-09-03T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
A biome or region `objects[]` entry distributes objects over terrain. A dimension `staticObjects[]` entry places one saved object at an exact world position with fixed rotation, scale, and block edits. Building the objects themselves is [19 - Objects](/iris/19-objects). Multi-piece assemblies are [21 - Jigsaw Structures](/iris/21-jigsaw-structures).

## Static objects at fixed coordinates

Use dimension `staticObjects` for a landmark, spawn building, or other object that must generate at a particular position. Prerequisites: the saved `.iob` file and a Studio or disposable world whose target chunks have not generated.

1. Save the object as, for example, `objects/landmarks/tower.iob`.
2. Add this entry to `dimensions/<dimension>.json`:

```json
{
  "staticObjects": [
    {
      "object": "landmarks/tower",
      "position": { "x": 100, "y": 100, "z": -100 },
      "rotation": { "y": 90 },
      "scale": 1,
      "edit": [
        {
          "find": [{ "block": "minecraft:oak_planks" }],
          "replace": { "palette": [{ "block": "minecraft:stone_bricks" }] }
        }
      ]
    }
  ]
}
```

3. Validate with `/iris pack validate pack=<pack>` on Bukkit or `/iris pack validate <pack>` on modded, then open Studio or create a test world.
4. Visit world coordinates `100 100 -100`. That coordinate is the object's saved origin, usually its center, rather than its bottom or a terrain sample. Check the footprint on both sides of any chunk boundary.

Static objects generate after Iris terrain and decoration, regardless of biome, slope, water, caves, density, or chance. Later native structures and imported features cannot overwrite blocks written by static objects. Each destination chunk receives its own portion; visiting the far side first does not omit the rest. Entries apply in array order, and the later entry wins wherever their written blocks overlap. Saved air writes air; unsaved space stays unchanged unless `bore` or `smartBore` fills it. This can replace terrain, including the bedrock layer.

Rotation uses fixed degrees on `x`, `y`, and `z`, all zero by default. Negative and fractional angles are supported; angles other than multiples of 90 round onto the block grid and can create holes or merge voxels. Directional block states use the existing object rotation rules. Saved block-entity data, such as container or sign data, accompanies its transformed blocks. Edits apply before block-state rotation and leave the source `.iob` unchanged. Changing a block's material discards incompatible saved block-entity data.

| Field | Default | Meaning |
|-------|---------|---------|
| `object` | required | One load key under `objects/`, without `.iob` |
| `position` | required | Absolute integer world coordinates; Y is not measured from the dimension floor |
| `rotation` | `{ "x": 0, "y": 0, "z": 0 }` | Fixed degrees per axis, from -360 to 360 |
| `scale` | `1` | Fixed size multiplier, 0.01 to 50 |
| `scaleInterpolation` | `NONE` | Enlargement interpolation: `NONE`, `TRILINEAR`, `TRICUBIC`, or `TRIHERMITE` |
| `edit` | `[]` | The same material/state replacement rules described in section 6 below |
| `bore` | `false` | Clear the complete transformed bounding box before writing the object |
| `smartBore` | `false` | Fill enclosed rooms and pockets with air on a copy of the object |
| `seed` | `0` | Fixed seed for probabilistic edits and replacement palettes, independent of chunk order and world seed |

Missing objects and invalid settings are errors. The origin and the full transformed object must fit inside the dimension's build height; the runtime rejects an overflowing object instead of placing only a clipped fragment. Validate catches origin errors; full transformed bounds are checked while the world runtime loads the object.

These settings affect newly generated chunks. They do not repair objects players break, paste into existing chunks, or rewrite existing buildings after a reload. Test changes in fresh chunks or a newly created disposable world. Production worlds use their own pack snapshot; see [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout). A partially generated object can contain both old and new versions if its configuration changes between visits to its chunks.

## Tutorial: get one object into the world

Prerequisites: a saved object such as `objects/tutorial/lookout.iob`, a biome or region the target dimension actually uses, and a Studio or disposable test world. Placements only affect chunks generated after the JSON existed. Every check below needs fresh terrain.

Merge this into one focused biome, keeping the biome other fields:

```json
{
  "objects": [
    {
      "place": ["tutorial/lookout"],
      "chance": 1,
      "density": 1,
      "mode": "CENTER_HEIGHT",
      "rotation": { "enabled": false }
    }
  ]
}
```

1. Paste the object by hand first: `/iris object paste tutorial/lookout`. If the geometry or the origin is wrong, fix the object before you touch placement JSON.
2. Validate the pack: `/iris pack validate pack=<pack>` on Bukkit, `/iris pack validate <pack>` on a modded loader.
3. Open or hotload Studio and fly into fresh chunks whose center column uses the edited biome. At `chance: 1` you get one in nearly every such chunk.
4. Confirm ownership: run `/iris find object tutorial/lookout`, or get `/iris object dust` and right-click a placed block. Iris names the placement that owns that block.
5. Pick the terrain mode that fixes what you see. Use `PAINT` for ground-hugging clutter. Use a stilt mode for support over uneven ground. Use `CEILING_HANG` for cave roofs. Use a `VACUUM` mode to pull the terrain up to a flat base.
6. Test the negative cases: steep slopes, water, cave mouths, and the neighboring biomes where the object should not appear at all.
7. Drop `chance` and `density` to production values. Validate again. Generate one more fresh area.

The placement is done when a manual paste and natural generation agree on orientation. The object must sit on the ground the way you want. It must stay absent outside its configured scope.

If validation cannot resolve the object, the `place` key does not match the path under `objects/`. If nothing generates, work section 10 top to bottom. If a non-Studio world still generates the old placement, it is reading its own pack snapshot. See [18 - Structures Overview](/iris/18-structures-overview).

## 1. Which files carry placements

`objects[]` exists on exactly two resource types:

- **Biome** (`biomes/**.json`): wherever that biome generates.
- **Region** (`regions/**.json`): every biome in the region.

Dimensions use `staticObjects[]` for fixed-coordinate placements, as described above. Random `objects[]` entries belong only to biomes and regions. Dimensions also carry two knobs that tighten every random placement underneath them (`requireObjectSurfaceSupport`, `objectSurfaceSupportBuffer`, section 4) and two that gate the inverted upper dimension (`upperDimensionObjects`, `upperObjectsForcePlace`).

Per chunk, Iris samples the biome and region once at the chunk center (block 8,8). It then walks four lists in this fixed order: biome surface, biome cave, region surface, region cave. Every entry rolls independently. A biome entry and a region entry can both fire in the same chunk. A biome that only clips the corner of a chunk contributes nothing there. The center biome objects can spill a few blocks into its neighbors.

A whole placement can be replaced by a snippet reference. `"objects": ["snippet/object-placer/my-camp"]` loads `snippet/object-placer/my-camp.json`.

Minimal entry:

```json
{
  "objects": [
    {
      "place": ["clutter/boulder1"],
      "chance": 0.05
    }
  ]
}
```

`place` entries are object keys: the path under `objects/` without `.iob`.

## 2. How often does it spawn?

Two numbers do the work. `chance` decides whether the entry runs at all in this chunk. `density` decides how many stamps it then attempts.

```json
{
  "place": ["clutter/boulder1", "clutter/boulder2"],
  "chance": 0.05,
  "density": 3
}
```

Roughly `chance x density` objects per chunk, before rejections. `chance: 0.002` is about one chunk in five hundred.

Each of the `density` attempts independently picks a random object out of `place` and a random column inside the chunk. It then runs every gate in sections 3 to 5. Density is a budget of tries, not a guarantee of placements.

`place` is an unweighted, uniform pick. To bias one object, list its key more than once or split the entry in two. A key that does not resolve costs the attempt and logs `Couldn't find Object: <key>` once per lookup.

Surface entries add uniform `+/- 0.005` jitter to `chance` before rolling. Cave entries roll the raw value. Two consequences, each worth about one chunk in eight hundred: `chance: 1` occasionally fails, and `chance: 0` occasionally succeeds. Omit an entry to disable it. Do not set it to zero.

`densityStyle` replaces `density` with a noise-driven count, so density varies across the world instead of being flat:

```json
{
  "densityStyle": { "min": 1, "max": 4, "style": { "style": "IRIS_THICK", "zoom": 8 } }
}
```

Always set `min` and `max`. The class defaults are 16 and 32. A bare `"densityStyle": {}` would ask for 16 to 32 attempts in every chunk that passes the chance roll. `/iris pack validate` rejects a densityStyle that omits both. It warns when only one is set.

## 3. Where is it allowed to land?

By default a placement is surface-only, unlimited in height, unlimited in slope, and refuses to sit over a cave mouth. Each field below narrows one of those.

**Surface or cave.** `carvingSupport` sorts the entry into the surface list, the cave list, or both.

```json
{ "carvingSupport": "CARVING_ONLY", "caveAnchorMode": "FLOOR" }
```

`SURFACE_ONLY` (the default) rejects any anchor that lands in carved space. `CARVING_ONLY` requires carved space at the anchor or within three blocks below it. The engine hunts for an anchor Y inside the cave column instead of using the terrain surface. A biome-owned cave placement accepts only cells owned by that exact cave biome. A region-owned cave placement intentionally spans every cave biome in the region. Unless `underwater: true` explicitly opts into fluid anchors, the anchor must be dry carved air above the dimension default cave-lava height. `ANYWHERE` sits in both lists. That means it rolls `chance` twice per chunk: once for the surface pass and once for the cave pass. Cave passes resolve their biome by sampling 48, 80, and 112 blocks below the surface. They take the deepest sample that differs from the surface biome and has carving objects. If none does, the surface biome is used.

`caveAnchorMode` picks which carved cells count. `FLOOR` needs solid support below. `CEILING` needs solid above. `CENTER` needs neither. `ANY` takes anything carved. `PROFILE_DEFAULT` defers to the cave profile ([15 - Caves & Carving](/iris/15-caves-carving)). `CEILING_HANG` overrides this to `CEILING` regardless of what you wrote.

**Height band.** `clamp` rejects placements whose resolved top or bottom leaves the band.

```json
{ "clamp": { "minimumHeight": 40, "maximumHeight": 225 } }
```

These are engine-internal Y values: 0 to (dimension height), not world Y. In a `-64..320` dimension, world Y 0 is internal Y 64.

**Slope.** `slopeCondition` gates on the terrain slope sampled around the anchor column.

```json
{ "slopeCondition": { "minimumSlope": 0, "maximumSlope": 2 } }
```

The default (`0` to `10`) is treated as "no condition" and skips the check entirely. `maximumSlope: 2` keeps buildings off hillsides. Going below about 1 excludes nearly all natural terrain. `rotateTowardsSlope: true` finds whichever of the four footprint edges sits lowest. It rotates the object to face that way in 90 degree steps. It adds the `yAxis` `min`. It discards `yAxis` `max` and `interval`.

**Neighbors.** `forbiddenCollisions` lists object keys this object refuses to intersect. If any block of an already-placed object with that key falls inside this object transformed bounding box, the attempt is dropped. Rotation, rotated translation, warp reach, ceiling inversion, and random Y translation are included. `allowedCollisions` names exceptions that win over the forbidden list. Both are empty by default. The check only runs when at least one of them is non-empty.

**Overrides.** `forcePlace: true` (JSON also accepts `"force"`) skips the usual placement gates. Those gates are the slope check, the carving-anchor check, surface support, underwater rejection, fluid-height and cave-height checks, `clamp`, the bedrock guard, and the collision lists. It does **not** skip the native-structure veto or the automatic surface-river veto. An object whose blocks would land inside a vanilla or datapack structure piece is always rejected, forced or not.

## 4. Surface support: the silent rejection

Iris refuses surface objects that roof over, bridge, or overhang a carved opening. It takes the object lowest solid non-foliage layer and rasterizes those columns. It dilates the stencil by `surfaceSupportBuffer`. Every column in the result must have `surfaceSupportDepth` blocks of un-carved, surface-solid ground. A failure drops the placement with **no log line at all**. That makes it the usual cause of "my object never appears" near caves, canyon rims, and ravines.

Natural biome and region scatter also rejects an automatic surface placement when any transformed support column intersects accepted surface-river water or lava. `forcePlace`, `underwater`, `onwater`, and `requireSurfaceSupport: false` do not bypass this river exclusion. It applies only while world generation is choosing the surface Y. An explicit-Y call such as `/iris object paste` remains allowed inside a river so authors can intentionally build there.

```json
{ "requireSurfaceSupport": true, "surfaceSupportBuffer": 2, "surfaceSupportDepth": 2 }
```

The dimension acts as a floor, not a ceiling. The effective buffer is `max(placement, dimension)` and the guard is on only if both the placement and the dimension ask for it. A dimension can therefore widen the ring or force the guard on pack-wide. It can never loosen it. `surfaceSupportDepth` is not merged. The placement value is used as written.

The check is skipped entirely for `forcePlace`, `fromBottom`, `mode: FLOATING`, `mode: STRUCTURE_PIECE`, `underwater`, `onwater`, cave-anchored placements, and `requireSurfaceSupport: false`.

Loosen in this order, stopping as soon as the object appears: `surfaceSupportBuffer: 0`, then `surfaceSupportDepth: 1`, then `requireSurfaceSupport: false`, then `force: true`, and only then the dimension-wide switch.

A second guard rejects surface-anchored placements that resolve to y <= 1 in a bedrock dimension. That one does log, throttled to one line per object and mode every five seconds: `Implausible object placement rejected`.

## 5. How does it sit on the terrain?

`mode` decides how the object Y is chosen and whether the terrain moves to meet it. The default, `CENTER_HEIGHT`, takes a single height sample at the anchor column and uses it for the whole object. Cheap, and fine for anything small or anything on flat ground.

**Height sampling.** These four modes only change which sample wins.

```json
{ "mode": "MAX_HEIGHT" }
```

`MAX_HEIGHT` samples every column in the transformed footprint and takes the highest. The footprint includes rotation, rotated translation, and warp reach. Nothing gets buried but the object floats off cliffs. `MIN_HEIGHT` takes the lowest. Nothing overhangs but slopes swallow it. The `FAST_` variants sample representative edge points instead of the full footprint. `PAINT` is the outlier. It drops each column of the object to that column own surface height. The object melts over the terrain rather than placing as a rigid block. Vines are exempt so they keep hanging.

**Stilts.** Stilt modes take a height mode, then repeat the object bottom blocks downward until they hit ground.

```json
{
  "mode": "CENTER_STILT",
  "stiltSettings": { "yMax": 4, "yRand": 1, "overStilt": 1 }
}
```

`STILT` is `MAX_HEIGHT` plus columns. `MIN_STILT` is `MIN_HEIGHT` plus columns. `CENTER_STILT` is `CENTER_HEIGHT` plus columns and is the cheapest one worth using. The `FAST_` variants are cheaper and less accurate, so pair them with `overStilt` to drive the legs further under the surface. `ERODE_STILT` tapers the legs like a cone: deepest at the footprint centroid, dropping off toward the edges, with the lower portion randomly broken up.

Only occluding blocks stilt. Stairs, slabs, and dirt paths are excluded. Grass, mycelium, podzol, and dirt-path bottoms are substituted with dirt so you do not get grass columns. A `palette` overrides the column material entirely. A column stops as soon as it hits a fluid, so stilts never punch through a lake floor.

`ORGANIC_STILT` and `CEILING_HANG` are for caves. `ORGANIC_STILT` scans down to the first solid block and fills the gap with noise-varied roots. `CEILING_HANG` flips the object vertically, anchors its top to the roof, and grows the same organic column up into the ceiling. Both read `organicMaxScan`, `organicJitter`, and `organicScratch`.

**Terrain shaping.** The vacuum modes bend the terrain instead of extending the object.

```json
{
  "mode": "VACUUM_ORGANIC",
  "vacuumSettings": { "radius": 14, "falloff": 2.0, "organicJitter": 4 }
}
```

They anchor like `CENTER_HEIGHT`. They then raise or carve every column out to a radius so the surface meets the object lowest placed block. They ease off by `falloff` (1 is a cone, 2 a parabolic bowl, higher stays flat near the object then drops). Raised columns are filled with the biome rock. Lowered columns are cleared to air. Inside the footprint the carve never eats into the object. `VACUUM` uses radius 12, `VACUUM_HIGH` 20, `VACUUM_FAST` 8 with every other column sampled. `VACUUM_ORGANIC` jitters the radius per column for a ragged edge. `VACUUM_WAVY` adds a smooth simplex wave that fades to zero under the object and at the rim.

**Two cases where Iris overrides your `mode`.** An object whose key contains `imports/` (anything brought in by `/iris structure import` or `/iris studio importvanilla`) is forced to `FAST_MIN_STILT` unless you asked for `FLOATING` or `STRUCTURE_PIECE`. And a cave placement left at the default `CENTER_HEIGHT` takes the active cave profile `defaultObjectPlaceMode` instead, if the profile sets one. Write any other mode and it is honored as-is.

**Special.** `FLOATING` ignores terrain entirely. Y comes from the rotated object center plus `translate.y` and `translate.yRandom`. The terrain, water, cave-anchor, and surface-support checks are all skipped. Use it for sky islands and anything that must not fall to the ground. `STRUCTURE_PIECE` is a raw stamp at caller-supplied coordinates used internally for native structure pieces. Do not write it into `objects[]`.

**Fine positioning.** `translate` shifts the object after rotation, so the offsets rotate with it.

```json
{ "translate": { "x": 0, "y": -1, "z": 0, "yRandom": 0 } }
```

`translate.y: -1` seats clutter one block into the ground and is the standard fix for objects riding on top of grass. `yRandom` adds a random `0..yRandom` per placement. A negative value randomizes downward instead.

`rotation` is on by default, with free Y rotation in 90-degree steps.

```json
{ "rotation": { "enabled": true, "yAxis": { "enabled": true, "min": 0, "max": 270, "interval": 90 } } }
```

Per axis (`xAxis`, `yAxis`, `zAxis`, each `{enabled, min, max, interval}`): `min == max == 0` means any multiple of `interval`. `min == max` at some other value locks the object to that angle. Anything else picks a multiple of `interval` and clips it into `[min, max]`. In the free case an `interval` below 1 is treated as 1 (one-degree steps). In a clipped range always set a real `interval`. Non-90-degree angles look bad at block resolution. Turn rotation off with `"rotation": { "enabled": false }`. X and Z rotation are incompatible with `bottom: true`.

`scale` is inert until you ask for something other than 1.

```json
{ "scale": { "size": 1, "minimumScale": 0.75, "maximumScale": 1.25, "variations": 7, "interpolation": "TRILINEAR" } }
```

`size` is a fixed multiplier and overrides the range when it is not 1. With `size: 1` and a min/max spread, Iris pre-builds `variations` evenly spaced copies across the range and picks one per placement. The copies are cached and shared, so a large `variations` costs memory. `interpolation` only matters when scaling up. `NONE` gives blocky output. `TRILINEAR` smooths it. `TRICUBIC` and `TRIHERMITE` are smoother and much slower.

`heightmap` replaces terrain height sampling with a noise generator, so the object seats against a virtual surface. Surface support still samples the real terrain.

## 6. Water, snow, and air pockets

**Water.** A surface placement whose anchor column is submerged is rejected unless you opt in.

```json
{ "underwater": true, "waterloggable": true, "isDolphinTarget": true }
```

`underwater: true` places on the terrain floor and ignores the fluid surface. It additionally rejects the placement if the resolved Y is at or above the solved head at that X/Z, so it really is an underwater-only switch. Ordinary columns use the dimension fluid height; an accepted wet hydrology layer uses its exact local head, and a dry footprint exposes no fluid. Structure placements invert this flag: `underwater: true` **allows** submerged starts, and `false` skips underwater columns. See [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough). `onwater: true` places on the fluid surface instead, for boats and docks. `waterloggable: true` waterlogs any placed block that can be waterlogged and lands in water. `underwater` implies the same behavior. `isDolphinTarget: true` combined with `underwater` marks placed storage chests as buried-treasure points of interest so dolphins swim players to them.

**Snow.** `snow` caps the snow layer depth dripped over the top of every column the object writes.

```json
{ "snow": 0.5 }
```

The value scales to vanilla eight layers. Each column gets a random count from 0 to `floor(snow * 7)`, placed one block above the highest block that the placement wrote in that column. Schematic air and blocks skipped by placement rules do not raise the snow surface. Small values are effectively fixed. `snow: 0.1` is always a single layer.

**Air pockets and interiors.** By default the object only writes its own blocks. Terrain left standing inside a hollow object stays there.

```json
{ "bore": true, "boreExtendMaxY": 4, "boreExtendMinY": 0 }
```

`bore: true` clears the whole transformed bounding cuboid to air before the object writes, which is blunt but predictable. The cuboid follows rotation, rotated translation, warp reach, ceiling inversion, and random Y translation. `boreExtendMaxY` and `boreExtendMinY` grow that final box upward and downward. `smartBore: true` instead raytraces the volume on three axes and fills only the enclosed interior. A house keeps its rooms clear without erasing the trees around it. Smart boring is a one-time cost per object at load, not per placement. Debug rendering changes only the current placement and does not alter the loader-cached object.

`meld: true` inverts the rule. The object only writes where a solid block already exists, which carves the object into terrain rather than adding to it. It is expensive. The placer samples the world per block.

`edit` rewrites materials at placement time, so one saved object can serve several biomes:

```json
{
  "edit": [
    { "find": [{ "block": "minecraft:oak_planks" }], "replace": { "palette": ["minecraft:spruce_planks"] }, "chance": 1, "exact": false }
  ]
}
```

A `chance: 1` rule whose `find` matches a block that does not exist on this Minecraft version also rescues the object from the version content gate, because the block is rewritten before it is ever written to the world. See [11. Content unavailable on this Minecraft version](#11-content-unavailable-on-this-minecraft-version).

`exact: false` matches on material alone. `exact: true` requires a full block-data match. When the replacement resolves to the *same* material as the matched block, Iris merges the two block states. It does not overwrite. Facing and other properties survive. A different material replaces outright and clears saved block-entity data unless the replacement supplies its own. `chance` is rolled once per rule per block.

`warp` displaces each block X and Z through a noise field, so a rigid object ripples like a flag. The displacement range is `+/- multiplier / 2` and is truncated to whole blocks. The default `multiplier: 1` gives at most a one-block jitter. Raise `multiplier` for a warp you can actually see.

```json
{ "warp": { "style": "IRIS_DOUBLE", "zoom": 0.4, "multiplier": 6 } }
```

## 7. Loot, markers, and saplings

**Loot.** Two arrays attach loot tables to container blocks inside the placed object. Only storage chests receive them.

```json
{
  "loot": [
    { "name": "global-treasure", "filter": [{ "block": "minecraft:chest" }], "exact": false, "weight": 3 },
    { "name": "global-tools", "weight": 1 }
  ],
  "vanillaLoot": [
    { "name": "minecraft:chests/simple_dungeon", "weight": 1 }
  ],
  "overrideGlobalLoot": false
}
```

`loot[].name` is a key under the pack `loot/` folder. `vanillaLoot[].name` is a vanilla or datapack loot-table key. For each chest, an `exact: true` full block-data match wins over a material match, which wins over an entry with no `filter` at all. Among the survivors one table is picked by `weight`. `overrideGlobalLoot: true` makes the placement table the only one, suppressing dimension, region, and biome loot for the containers it matched. An unresolvable name logs `Couldn't find loot table <name>` and is skipped.

Iris fills these chests during the post-generation chunk update pass, reading the placement recorded in the mantle at that block. It does not fill when a player opens the chest. Separately, a chest saved into the `.iob` with a vanilla loot table already on it keeps that table ([19 - Objects](/iris/19-objects)).

**Markers.** Placements have no entity field. `markers[]` tags matching blocks with a marker resource. The marker carries the spawners.

```json
{
  "markers": [
    { "mark": [{ "block": "minecraft:mossy_cobblestone" }], "marker": "camp-spawns", "maximumMarkers": 4, "exact": false }
  ]
}
```

Candidate blocks are shuffled, so which ones get marked varies per placement. `maximumMarkers` (default 8, hard max 16) caps the count. `markers/camp-spawns.json` lists the spawner resources. Its `emptyAbove` (default true) requires two air blocks above the marked block inside the object.

**Saplings.** When a sapling grows, Iris scans the biome `objects[]` for placements whose `trees[]` matches the grown tree type and the sapling square size. It falls back to the region list if the biome had no match. It picks one and stamps it. A single placement can serve both natural generation and sapling override. Procedural tree generation (`proceduralObjects`) is a separate system. See [17 - Trees, Fungi, Coral, Crystals, Formations, Ruins](/iris/17-trees-fungi-coral-crystals-formations-ruins).

## 8. Reference

### Frequency

| Field | Default | Effect |
|---|---|---|
| `place` | required | Object keys to stamp. One is picked at random per attempt, with no weighting |
| `chance` | `1` | Probability that the entry runs in a given chunk. Surface entries jitter by `+/- 0.005`. Cave entries do not |
| `density` | `1` | Stamp attempts once the entry runs, each at its own random column with its own random object |
| `densityStyle` | unset | Noise-driven attempt count that supersedes `density`. Class defaults are 16 to 32 |

### Scope and rejection

| Field | Default | Effect |
|---|---|---|
| `carvingSupport` | `SURFACE_ONLY` | Whether the entry runs on the terrain surface, inside carved space, or in both passes |
| `caveAnchorMode` | `PROFILE_DEFAULT` | Which carved cells qualify: floor, ceiling, open middle, anything, or whatever the cave profile says |
| `clamp` | `-2048` / `2048` | Height band the resolved object must fit inside, in engine-internal Y |
| `slopeCondition` | `0` / `10` | Terrain steepness window. The default pair disables the check outright |
| `forbiddenCollisions` | `[]` | Object keys already in the world that veto this placement when they fall inside its bounding box |
| `allowedCollisions` | `[]` | Keys exempted from the veto above |
| `requireSurfaceSupport` | `true` | Whether to refuse to bridge or roof a carved opening |
| `surfaceSupportBuffer` | `2` (0..16) | How far past the footprint the ground must stay solid and un-carved |
| `surfaceSupportDepth` | `2` (1..16) | How thick that un-carved ground must be under each column |
| `forcePlace` | `false` | Skips every gate above plus water and bedrock guards. Never skips the native-structure veto |
| `heightmap` | unset | Substitutes a noise field for terrain height when resolving Y |

### Terrain fit

| Field | Default | Effect |
|---|---|---|
| `mode` | `CENTER_HEIGHT` | How Y is chosen and whether the terrain moves. See section 5 |
| `translate` | `0,0,0` | Post-rotation offset. `y: -1` is the usual fix for clutter riding on grass |
| `translate.yRandom` | `0` | Random vertical spread per placement, downward if negative |
| `rotation` | Y free, 90 degree steps | Random orientation per placement |
| `rotateTowardsSlope` | `false` | Turns the object to face downhill, in 90 degree steps |
| `scale` | `1` | Resizes the object. A min/max spread pre-builds `variations` cached copies |
| `bottom` | `false` | On explicit-Y paths (cave, structure, sapling), seats the object bottom-up instead of centered |
| `fromBottom` | `false` | Anchors near the world floor. An unfinished code path. Avoid it |
| `warp` | flat | Noise displacement of each block X and Z. Inert until `multiplier` is raised |

### Terrain interaction

| Field | Default | Effect |
|---|---|---|
| `bore` | `false` | Empties the whole bounding cuboid before writing |
| `boreExtendMaxY` / `boreExtendMinY` | `0` | Grows that emptied box upward and downward |
| `smartBore` | `false` | Raytraces the object once at load and clears only its enclosed interior |
| `meld` | `false` | Writes only where solid terrain already exists, carving the object in rather than adding it |
| `edit` | `[]` | Material find-and-replace applied as the object is written |
| `snow` | `0` | Depth cap for a snow dusting laid over the object top blocks |
| `underwater` | `false` | Ignores the water surface and seats on the sea floor. Also refuses to place above fluid height |
| `onwater` | `false` | Seats on the fluid surface instead of the floor |
| `waterloggable` | `false` | Waterlogs placed blocks that end up in water |
| `isDolphinTarget` | `false` | With `underwater`, registers placed chests as buried treasure for dolphins |

### `stiltSettings`

| Field | Default | Effect |
|---|---|---|
| `yMax` | `0` | Caps how far a leg extends before the random and over-stilt terms apply |
| `yRand` | `0` | Random extra leg length per column |
| `overStilt` | `0` | Pushes every leg this much further under the surface. Use it with the `FAST_` modes |
| `palette` | unset | Material for the legs. Without it Iris repeats the object bottom block and swaps grass-family blocks for dirt |
| `organicMaxScan` | `48` | How far `ORGANIC_STILT` and `CEILING_HANG` search for solid rock before giving up |
| `organicJitter` | `3` | Random shortening per column, so the underside is ragged instead of a flat disc |
| `organicScratch` | `0.55` | Fraction of the deepest part randomly punched out for a broken, rooty tip |

### `vacuumSettings`

| Field | Default | Effect |
|---|---|---|
| `radius` | `0` (mode default: 12 / 20 high / 8 fast) | How far past the footprint the terrain is bent before returning to its natural height |
| `falloff` | `2.0` | Shape of that blend: 1 is a straight cone, 2 a gentle bowl, higher stays flat near the object then drops sharply |
| `organicJitter` | `4` | Per-column wobble in the meeting edge, for `VACUUM_ORGANIC` |
| `waveAmplitude` | `3` | Height of the rolling wave in `VACUUM_WAVY`. 0 removes it |
| `waveScale` | `5.0` | Tightness of that wave. Wavelength is roughly `100 / waveScale` blocks |

### `mode` values

| Mode | In-world result |
|---|---|
| `CENTER_HEIGHT` | One height sample under the middle carries the whole object. Cheap, and correct on flat ground |
| `MAX_HEIGHT` / `FAST_MAX_HEIGHT` | Nothing gets buried, but the object hangs off the downhill side of cliffs |
| `MIN_HEIGHT` / `FAST_MIN_HEIGHT` | Nothing overhangs, but slopes swallow the uphill side |
| `PAINT` | Every column drops to its own surface, so the object melts over whatever it lands on |
| `STILT` / `FAST_STILT` | Highest-point seating with legs dropped to the ground under every bottom block |
| `MIN_STILT` / `FAST_MIN_STILT` | Lowest-point seating with the same legs |
| `CENTER_STILT` | Center seating with legs. The cheapest stilt worth using |
| `ERODE_STILT` | Legs taper away from the centroid and break up near the tips, like eroded rock |
| `ORGANIC_STILT` | Legs grow down to the first solid block with noise-varied lengths, connecting cave-floor objects to the floor |
| `CEILING_HANG` | Object is flipped, hung from the cave roof, and rooted upward into it |
| `VACUUM` | Terrain around the object is pulled up or cut down to meet its base, easing back out to radius 12 |
| `VACUUM_HIGH` | Same, blended out to radius 20 for the smoothest transition |
| `VACUUM_FAST` | Same at radius 8 with every other column sampled, for bulk use |
| `VACUUM_ORGANIC` | Same with a per-column jittered edge, so the bowl reads as natural ground |
| `VACUUM_WAVY` | Same with a smooth wave rolling across the slope, flat under the object and at the rim |
| `FLOATING` | Placed in mid-air at an absolute height. Terrain, water, cave, and support checks all skipped |
| `STRUCTURE_PIECE` | Raw stamp at caller coordinates. Internal to native structure routing, not for `objects[]` |

## 9. Worked examples

Rare surface camp:

```json
{
  "place": ["clutter/camp1"],
  "chance": 0.00175,
  "rotation": { "enabled": true, "yAxis": { "enabled": true, "min": 0, "max": 270, "interval": 90 } }
}
```

Pine forest, kept off the steep ground and lightly dusted:

```json
{
  "place": ["trees/spruce/pine1", "trees/spruce/pine2", "trees/spruce/pine3"],
  "chance": 0.6,
  "density": 1,
  "slopeCondition": { "maximumSlope": 2 },
  "rotation": { "enabled": true, "yAxis": { "enabled": true, "interval": 90, "min": 0, "max": 270 } },
  "snow": 0.1
}
```

Ruins on stilts with loot:

```json
{
  "place": ["structures/ruin-small-a", "structures/ruin-small-b"],
  "chance": 0.08,
  "density": 2,
  "mode": "CENTER_STILT",
  "stiltSettings": { "yMax": 4, "yRand": 1, "overStilt": 1 },
  "translate": { "y": -1 },
  "slopeCondition": { "maximumSlope": 3 },
  "loot": [
    { "name": "global-treasure", "filter": [{ "block": "minecraft:chest" }], "weight": 2 },
    { "name": "global-clutter", "weight": 1 }
  ]
}
```

Cave floor clutter:

```json
{
  "place": ["clutter/stoneclutt4", "clutter/stoneclutt5"],
  "chance": 0.21,
  "density": 6,
  "carvingSupport": "CARVING_ONLY",
  "caveAnchorMode": "PROFILE_DEFAULT",
  "translate": { "y": -1 },
  "bottom": true,
  "force": true,
  "scale": { "size": 0.75 }
}
```

Ground-hugging mushroom carpet:

```json
{
  "place": ["trees/mushroom/mushclut1", "trees/mushroom/mushclut2"],
  "chance": 0.15,
  "density": 2,
  "mode": "PAINT",
  "translate": { "y": -1 },
  "rotation": { "enabled": true, "yAxis": { "enabled": true, "min": 0, "max": 270, "interval": 90 } }
}
```

## 10. Troubleshooting

**It never appears.** Work these in order.

1. Wrong key. `place` paths are case-sensitive and relative to `objects/`. A miss logs `Couldn't find Object: <key>` and burns the attempt.
2. Chance too low to see. Prove the wiring with `"chance": 1, "density": 4` first, then dial back.
3. Not actually in that biome. The chunk-center sample decides, not what you are standing on.
4. Wrong list. `CARVING_ONLY` never places on the surface. The default `SURFACE_ONLY` never places in caves.
5. Surface support (section 4). This one is silent. If the object appears with `force: true` but not without, a guard rejected it, and surface support is the likely one.
6. Water. A submerged surface placement needs `underwater` or `onwater`.
7. `clamp` too tight, or written in world Y instead of engine-internal Y.
8. `slopeCondition` too strict. `maximumSlope` under about 1 excludes most terrain.
9. Native structure overlap. Objects never write into a vanilla or datapack structure piece, not even with `force`.
10. Console lines worth grepping: `Implausible object placement rejected` (bedrock-row anchor) and `Couldn't find loot table`.

**It appears but sits wrong.**

- Floating off a cliff: you are on `MAX_HEIGHT`. Switch to a stilt mode or a `VACUUM` mode.
- Buried in a hillside: `MIN_HEIGHT`, or too much negative `translate.y`.
- Hovering in a cave: `ORGANIC_STILT` for the floor or `CEILING_HANG` for the roof, with `carvingSupport: "CARVING_ONLY"`.
- Standing on a flat disc of stilt blocks: use `VACUUM`, `VACUUM_ORGANIC`, or `VACUUM_WAVY` instead.
- Riding one block above the grass: `translate.y: -1`, or `PAINT` for clutter.
- Interior packed with terrain: `bore` for a blunt clear, `smartBore` to keep only the rooms.
- `warp` does nothing: raise `warp.multiplier`. At the default of 1 the displacement truncates to roughly nothing.

**Loot never fills.** Only storage chests receive placement loot. Check the console for `Couldn't find loot table`. Drop `exact: true` if the filter block data does not match the saved block exactly.

**Iterating quickly.**

- Studio worlds hotload both JSON and `.iob` edits within about a second, into newly generated chunks only. Non-studio worlds do not hotload at all.
- Separate the object from the placement. `/iris object paste` proves geometry. Natural generation proves the placement.
- Deep forensics: write `chunkX,chunkZ[,radius]` into `plugins/Iris/goldendebug.txt` (or set `-Diris.goldendebug=`), enable `/iris debug`, then restart. The target is read once at startup. Every attempt, height query, pick, and rejection in those chunks is logged at debug level. Extremely verbose. Use radius 0.

## 11. Content unavailable on this Minecraft version

A `.iob` saved on a newer Minecraft can contain blocks an older server does not have. Iris reads only the object palette header when it builds a placement's pool, checks every key against the live registry, and decides per object per placement. There are no version fields; see [25 - Pack Management](/iris/25-pack-management) for the gate, the startup listing, and `/iris pack compat`.

| Situation | Result |
|-----------|--------|
| An object palette needs a block the server does not have | That object is dropped from **this placement's** `place` pool. The same object stays in another placement whose rules do cover the block |
| An `edit` rule type-replaces the missing block with `chance: 1` and a matching `find` | The block never reaches the world, so the object stays in the pool |
| A dimension `blockFallbacks` entry or a per-entry `backup` covers the block | The object stays in the pool and generates with the substitute |
| An `edit` `replace` palette entry needs a missing block | The whole placement is excluded, every object in it included. The owning biome, region, or dimension keeps generating |
| A block only appears on the `find` side of an `edit` rule, or in a `markers[].mark` list | Nothing happens. Both lists only select blocks that already exist in the object; a block that cannot exist matches nothing |
| Dropping objects empties the `place` pool | The placement is excluded and skipped entirely |

The decision is made once when the pool is first built, and again on Studio hotload. An `edit` rule with `chance` below 1 does not save an object, because the missing block would still be written on the rolls that fail. `exact: true` only saves it when the rule actually matches the saved block state.
