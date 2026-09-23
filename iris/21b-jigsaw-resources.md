---
title: "Jigsaw Resources"
description: "Iris documentation: Jigsaw Resources"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
The JSON behind a jigsaw graph: connectors, structure, pool and piece files, how the assembler picks pieces, how you place the structure in a world, and how a portable graph is exported as a vanilla datapack. The in-game authoring workflow is [21 - Jigsaw Structures](/iris/21-jigsaw-structures).

A graph is three resource kinds plus objects:

| File | Holds |
|---|---|
| `structures/<key>.json` | The whole structure: start pool, depth and size limits, mode, themes, workcell capacities |
| `jigsaw-pools/<key>.json` | A weighted list of pieces plus one direct fallback pool |
| `jigsaw-pieces/<key>.json` | One piece: which object it stamps, its connectors, and its rules |
| `objects/<key>.iob` | The blocks. See [19 - Objects](/iris/19-objects) |

## Connectors

Jigsaw markers are real `minecraft:jigsaw` blocks while you edit. Saving reads their tile data and orientation and stores connectors in `jigsaw-pieces/<key>.json`. The marker itself is not kept as a jigsaw block in the `.iob`.

| Connector field | Studio source | Runtime rule |
|---|---|---|
| `position` | Marker offset from the workcell origin, inverse-rotated to source orientation during planar capture | Must be inside the object's unsigned `0..size-1` bounds |
| `direction` | Jigsaw block front | Candidate must face the reverse direction after rotation |
| `top` | Jigsaw block top | Must also match after rotation when the source joint is `ALIGNED` |
| `pool` | Mojang Pool | UI value must be `iris:<owned-pool-key>`. Studio strips `iris:` and stores the internal pool used to choose the next piece |
| `name` | Mojang Name | Identity this connector exposes to a source connector |
| `targetName` | Mojang Target name | Must equal the candidate connector's stored `name` exactly. Matching is case- and whitespace-sensitive at runtime, while Studio marker capture trims both values |
| `channel` | `/iris jigsaw connector channel <channel\|none>` on a saved marker's exact local position | Values match exactly, including case and whitespace. Empty matches only empty, and any non-empty value blocks vanilla export |
| `joint` | Mojang Joint | `ROLLABLE` ignores candidate top. `ALIGNED` requires it to match |
| `finalState` | Mojang Final state | Canonical block state written into the `.iob` at the marker cell. `minecraft:structure_void` leaves the cell absent, while explicit air remains an authored block state |
| `selectionPriority` | Mojang Selection priority | Signed integer. Higher-priority connectors within one piece are processed first, and ties keep authored order |
| `placementPriority` | Mojang Placement priority | Signed integer on the source connector. Higher-priority attached child pieces expand first, and ties keep attachment order |

Runtime matching never trims either side, so whitespace in schema-authored data stays significant even though the `connector channel` command cannot author it.

## Structure: `structures/<key>.json`

```json
{
  "startPool": "village/demo/start",
  "maxDepth": 7,
  "maxSizeChunks": 8,
  "mode": "PLANAR_JIGSAW",
  "compatibility": "IRIS_EXTENDED",
  "branchFailurePolicy": "FAIL_ASSEMBLY",
  "cellSize": {"x": 15, "y": 15, "z": 15},
  "spatialWorkcellDisplayName": "",
  "planarWorkcells": [
    {"displayName": "", "archetype": "BLANK", "width": 3, "height": 3, "depth": 3, "enabled": true},
    {"displayName": "Village Entrances", "archetype": "END", "width": 16, "height": 8, "depth": 16, "enabled": true},
    {"displayName": "", "archetype": "STRAIGHT", "width": 16, "height": 3, "depth": 3, "enabled": true},
    {"displayName": "", "archetype": "CORNER", "width": 3, "height": 3, "depth": 3, "enabled": true},
    {"displayName": "", "archetype": "TEE", "width": 3, "height": 3, "depth": 3, "enabled": true},
    {"displayName": "", "archetype": "CROSS", "width": 3, "height": 3, "depth": 3, "enabled": true}
  ],
  "themeSets": [
    {"key": "variant-1", "weight": 1}
  ],
  "requireCaps": false,
  "placeMode": "STRUCTURE_PIECE",
  "edit": [],
  "loot": []
}
```

| Field | Default / range | What it does in world |
|---|---|---|
| `startPool` | required | Everything grows out of whatever piece this pool produces first |
| `maxDepth` | `7`, range `1..30` | How many connector hops the assembler may chain outward before it stops adding rooms. Higher values allow larger settlements |
| `maxSizeChunks` | `8`, range `1..32` | A hard leash: no piece may sit further than this many chunks (times 16 blocks) from the start, no matter how much depth is left |
| `mode` | Hand-authored schema fallback `SPATIAL_JIGSAW`. Studio `create` default `PLANAR_JIGSAW` | `PLANAR_JIGSAW` forces every piece onto a flat grid with face-center sockets and validates that shape. `SPATIAL_JIGSAW` lets pieces stack and branch in three dimensions |
| `compatibility` | `IRIS_EXTENDED` | `VANILLA_PORTABLE` locks the graph down to what vanilla jigsaw resources can express, which is what makes datapack export possible |
| `branchFailurePolicy` | `FAIL_ASSEMBLY` | Decides what a dead-end arm costs you. Throw away the whole structure, or leave a stub where that arm stopped. `TERMINATE_BRANCH` is required for vanilla portability |
| `cellSize` | `15 x 15 x 15`. Studio X/Z `1..128`, Y `1..192`, volume `<=2,097,152` | The editing volume for spatial cells, and the uniform editing volume for a legacy planar graph that has no `planarWorkcells`. It does not constrain runtime assembly |
| `spatialWorkcellDisplayName` | empty | Text shown over the spatial editing cell. Empty shows `Spatial` |
| `planarWorkcells` | Six unique archetypes. Width/depth `3..128`, height `1..192`, volume `<=2,097,152`. `displayName` empty | How large each connector shape may be built. What it is called in the GUI. Whether pieces of that shape are allowed into assemblies and exports at all |
| `themeSets` | Empty means implicit unthemed. Positive unique key weights | Splits the kit into visual families so one assembly comes out all-stone or all-timber instead of a mix. The weight is that family's share of assemblies |
| `requireCaps` | `false` | Forces every open doorway to be closed off with a real terminal piece instead of being left hanging |
| `placeMode` | `STRUCTURE_PIECE` | How each piece object meets the ground when stamped |
| `edit` | empty | Block find-and-replace applied across every piece, for reskinning a kit without re-authoring objects. Not portable |
| `loot` | empty | Loot tables injected into containers the pieces place. Not portable |
| `vanillaSource` | empty | Records which registered structure this graph was imported from. Not something you author |

## Pool: `jigsaw-pools/<key>.json`

```json
{
  "pieces": [
    {"piece": "village/demo/hall", "weight": 4, "chance": 0.75, "empty": false},
    {"weight": 1, "chance": 1.0, "empty": true}
  ],
  "fallback": "village/demo/end",
  "mandatoryFallback": false
}
```

`weight` must be positive. `chance` is a finite `0..1` value that independently gates that membership before weighting; zero never passes and one always passes.

An `empty: true` entry canonically omits `piece`. It terminates its branch only when empty termination is allowed, and it stops later primary or fallback candidates from being tried.

`fallback` names one direct pool tried after ordinary primary failure, or used alone at maximum depth. Its own fallback is not chained into the same selection. A pool with no entries terminates when no fallback is required. `mandatoryFallback: true` applies the physical-terminal requirement to this pool even when structure `requireCaps` is false.

Converted native graphs set `branchFailurePolicy: TERMINATE_BRANCH`. Conversion emits `empty: true` only when a non-start pool has one all-air connectorless source member and either no fallback or a self-fallback; other connectorless nonempty members in such pools are omitted as inert, with the loss recorded in the manifest.

## Piece: `jigsaw-pieces/<key>.json`

```json
{
  "object": "village/demo/hall",
  "displayName": "Market Hall",
  "connectors": [
    {
      "position": {"x": 8, "y": 8, "z": 0},
      "direction": "NORTH_NEGATIVE_Z",
      "top": "UP_POSITIVE_Y",
      "pool": "village/demo/start",
      "name": "iris:planar",
      "targetName": "iris:planar",
      "channel": "",
      "joint": "ALIGNED",
      "finalState": "minecraft:structure_void",
      "selectionPriority": 0,
      "placementPriority": 0
    }
  ],
  "rotatable": true,
  "collidable": true,
  "themes": ["variant-1"],
  "rules": {
    "minimumDepth": 0,
    "maximumDepth": 30,
    "minimumPlacements": 0,
    "maximumPlacements": 0,
    "terminal": false
  }
}
```

Positions are unsigned object coordinates, so `(0,0,0)` is the object's minimum corner. The referenced `.iob` is the geometry source and owns this variant's exact width, height, and depth.

| Field | Default / range | What it does in world |
|---|---|---|
| `object` | required | The blocks this piece stamps |
| `displayName` | empty, at most 64 code points | Label shown in the Studio GUI. Falls back to the piece key's final segment |
| `connectors` | empty | Where other pieces may attach, which way they face, and which pool they come from |
| `rotatable` | `true` | Lets the assembler spin the piece to cardinal Y rotations so it can meet a connector. `false` pins it to the orientation you built |
| `collidable` | `true` | Whether this piece's volume reserves space against other pieces. Set `false` only for a connector scaffold meant to sit inside a physical piece |
| `themes` | empty | Which visual families may use this piece. Empty makes it usable by every family |
| `rules.minimumDepth` / `rules.maximumDepth` | `0` / `30`, range `0..30` | Keeps a piece out of the town square or out of the far outskirts. The start piece is depth zero |
| `rules.minimumPlacements` | `0`, range `0..512` | Forces at least this many copies to exist, so a required well or church is not missing. An unmet minimum fails the assembly |
| `rules.maximumPlacements` | `0`, range `0..512` | Caps how many copies appear. `0` means unbounded within the 512-piece safety cap |
| `rules.terminal` | `false` | Marks the piece as a dead end: it can be placed on a connector but never opens new ones |

## How assembly chooses pieces

Jigsaw pieces retain their authored size. The dimension's `allObjectScaleFactor` does not affect structure generation, manual structure placement, or Jigsaw Studio.

1. Iris selects one declared structure theme by positive relative weight. With no declared themes the assembly is unthemed, and a piece with no theme list is eligible for every theme.
2. It filters the start pool by enabled planar workcell, theme, depth and placement rules, then rolls each membership's independent chance. No passing membership is an intentional empty result, and an explicit `empty: true` winner also produces no structure.
3. It chooses one positively weighted passing start entry and applies a random cardinal rotation when the piece is rotatable. A terminal start is placed but does not expand.
4. It processes connectors on the current piece in descending `selectionPriority` order, filtering the primary pool by the same rules and trying passing entries in weighted random order. An eligible piece can still fail because its connectors are incompatible, it collides, or it exceeds bounds.
5. Entries that still need their declared minimum placement count take precedence over other entries. After expansion, an unmet graph-wide minimum produces `FAILED_RULES` rather than silently accepting the assembly.
6. A candidate connector is compatible when source `targetName` exactly equals candidate `name` and source `channel` exactly equals candidate `channel`, case and whitespace preserved. The faces must oppose after rotation, and an `ALIGNED` source also needs a matching top direction.
7. Two pieces whose `collidable` values are both `true` may not overlap. A piece with `collidable: false` neither blocks nor is blocked, but every piece must still stay inside `maxSizeChunks x 16` blocks of the origin. Attached children are queued by the source connector's `placementPriority`, and Iris finishes one piece's connectors before expanding its children.
8. Before maximum depth, Iris tries the primary pool and then that pool's one direct fallback; at maximum depth it skips the primary. An allowed explicit empty entry or an empty primary pool ends the branch immediately without continuing into the fallback. When `requireCaps` or `mandatoryFallback` is true, the fallback must place a compatible terminal piece and an empty entry cannot satisfy it. Otherwise primary-plus-fallback exhaustion returns `FAILED_UNCAPPED` under `FAIL_ASSEMBLY`, or ends only that branch under `TERMINATE_BRANCH`. A fallback's own fallback is never traversed in the same selection.

The runtime hard cap is 512 pieces. The compiler reports missing resources, invalid workcells, bounds, connectors, themes, chances, and rules, plus fallback cycles, unreachable resources, uncappable required connectors, incompatible candidates, and sampled hard-cap failures. Studio reevaluates automatically after every committed mutation, so there is no separate validation action.

## Natural placement

Place an Iris jigsaw by adding an `IrisStructurePlacement` object to `structures[]` on a dimension, region, or biome. Surface-biome placements apply where that surface biome owns the start chunk. A cave biome contributes only placements whose resolved anchor is one of the cave modes. Region and dimension placements stay broader scopes.

```json
{
  "structures": [
    {
      "structures": ["village/demo"],
      "placementId": "village-demo-surface",
      "distribution": "RANDOM_SPREAD",
      "spacing": 32,
      "separation": 8,
      "salt": 165745296,
      "anchor": "SURFACE",
      "minHeight": -64,
      "maxHeight": 320,
      "terrain": {"mode": "SOURCE"},
      "underwater": false
    }
  ]
}
```

| Placement rule | Fields | Behavior |
|---|---|---|
| Random spread | `spacing`, `separation`, `salt` | One deterministic attempt per spacing grid cell. `spacing` must exceed `separation` |
| Density | `density` | Independent deterministic per-chunk probability `0..1` |
| Concentric rings | `ringCount`, `ringDistance`, `ringSpread` | Stronghold-like deterministic rings around world origin |
| Surface | `anchor: SURFACE` | Surface Y must pass the inclusive `minHeight..maxHeight` gate |
| Height band | `anchor: HEIGHT_BAND` | Deterministic random Y inside the inclusive band |
| Legacy | `anchor: LEGACY` | `underground=false` resolves to `SURFACE`. `underground=true` resolves to `HEIGHT_BAND` |

`placementId` is the stable authored identity used for distribution. Set it when multiple placements share the same structure, or when you want field and list reordering to leave existing starts where they are. A placement listing several `structures` keys chooses one uniformly. Pool weights control pieces inside the chosen graph, not world-level start frequency.

Only newly generated chunks use a changed placement. `/iris structure place` and the Jigsaw Studio preview place assemblies directly without the natural placement settings.

### Cave anchors

```json
{
  "structures": [
    {
      "structures": ["stronghold/demo"],
      "placementId": "stronghold-demo-deep-caves",
      "distribution": "RANDOM_SPREAD",
      "spacing": 24,
      "separation": 8,
      "salt": 984211,
      "anchor": "CAVE_FLOOR",
      "minHeight": -48,
      "maxHeight": 80,
      "caveBiomes": ["carving/deep"],
      "caveAnchorAttempts": 12,
      "caveAnchorScanStep": 1,
      "caveMinimumClearance": 5,
      "terrain": {"mode": "PRESERVE"}
    }
  ]
}
```

| Anchor | Required carved-space geometry | Assembly alignment |
|---|---|---|
| `CAVE_FLOOR` | Solid/non-carved cell immediately below plus an upward carved run | Lowest assembled piece bound moves to the anchor Y |
| `CAVE_CEILING` | Solid/non-carved cell immediately above plus a downward carved run | Highest assembled piece bound moves to the anchor Y |
| `CAVE_CENTER` | Candidate is the actual midpoint of its contiguous carved cavern run, which must meet the clearance requirement | Assembly bounding-box midpoint moves to the anchor Y |
| `CAVE_ANY` | A clearance-sized carved run is centered around the candidate | Assembly bounding-box midpoint moves to the anchor Y |

Iris tests up to `caveAnchorAttempts` unique X/Z columns in the start chunk and scans the clipped `minHeight..maxHeight` band in increments of `caveAnchorScanStep`, stopping at the first column with matches. Runtime clamps attempts to `1..64`, scan step to `1..16`, and clearance to `1..64`, and visits at most 64 of the chunk's 256 columns. `caveMinimumClearance` is the required vertical carved run. Empty `caveBiomes` accepts any resolved cave biome; otherwise keys are rechecked against the cave biome at the actual anchor.

On a structure placement, `underwater: true` **allows** submerged starts and `false` skips them. That is the opposite of object placement, where `underwater: true` means seafloor-only. See [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

For cave anchors, `underwater` is checked at the actual anchor rather than the surface ocean height. With `underwater: false`, ordinary cavern air must be above the dimension `caveLavaHeight`, and explicit water and lava are rejected. With `underwater: true`, ordinary fluid cavern cells are allowed. Hydrology-owned mantle cells always reject anchors because a later structure stamp could breach the containment footprint; see [36 - Rivers](/iris/36-rivers).

Cave placement scope is sampled at the start chunk's center, and a cave-biome `structures[]` list contributes cave anchors only. Lookup uses existing carved-space data, so a locator cannot resolve an ungenerated distant cave anchor.

> The anchor test reads one vertical column, not the complete assembled volume, so `SOURCE` and `PRESERVE` can leave pieces intersecting cave walls. Use `BORE` or `FORCE_CARVE` when the structure must create a reliable envelope. Cave anchors apply to editable Iris `structures`, not the `nativeStructures` backend.
{.is-warning}

## Vanilla datapack export

Create the project with `compatibility=vanilla`, then keep the graph inside the strict subset below. An existing graph is exportable only when its saved compatibility is `VANILLA_PORTABLE` and its branch policy is `TERMINATE_BRANCH`. Studio has no compatibility-toggle or branch-policy control.

Export reads the committed graph, not pending workcell blocks. Wait for autosave to finish and confirm the automatic evaluation is no longer `PENDING`, `STALE`, or `INVALID`:

```text
/iris jigsaw export namespace=demo output=village-demo format=zip replace=false
```

Output is written under `<Iris data>/packs/exports/`. Wait for the export's completion message before using the files. One player cannot start a second export while their first is running.

`output` is one direct artifact name: 1-128 characters, starting with a letter, number, `_`, or `-`, then only letters, numbers, `.`, `_`, or `-`. Whitespace, leading `.`, absolute paths, slashes, nested paths, and traversal names are rejected. `format=zip` adds `.zip` when needed. The destination is replaced atomically only when `replace=true`; an existing output is otherwise rejected.

The command emits a Minecraft 26.2 datapack whose `pack.mcmeta` uses `min_format: [107, 1]` and `max_format: 107`, with template pools, compressed structure-template NBT, one jigsaw worldgen structure, and one random-spread structure set.

| Vanilla setting | Export default |
|---|---|
| Biomes | `minecraft:plains` |
| Start height | absolute `0`, projected to `WORLD_SURFACE_WG` |
| Generation step | `surface_structures` |
| Terrain adaptation | `none` |
| Expansion hack | `false` |
| Maximum vertical distance | `4064` |
| Structure-set placement | random spread: spacing `32`, separation `8`, salt `0`, frequency `1`, linear spread |

Those defaults are fixed. Edit the emitted datapack afterward if they are not the vanilla placement you want.

### Strict export blockers

Export fails rather than dropping or approximating any of these:

- Structure compatibility is not `VANILLA_PORTABLE`, or `branchFailurePolicy` is not `TERMINATE_BRANCH`.
- Structure themes, piece theme membership, non-default depth/placement/terminal rules, structure `requireCaps`, pool `mandatoryFallback`, or a membership `chance` other than `1` are present.
- `placeMode` is not `STRUCTURE_PIECE`, or structure-wide `edit` or `loot` is non-empty.
- `maxDepth` is outside `1..20`, or `maxSizeChunks x 16` exceeds Minecraft's 128-block horizontal limit.
- A piece has `rotatable: false`, or `collidable: false`. Vanilla templates have no per-piece collision flag.
- A pool weight is outside `1..150`.
- A resource key, connector name or target, namespace, orientation, block state, or final state is not vanilla-valid.
- A connector has a non-empty Iris channel, duplicates another connector position, or has a `finalState` that does not exactly match the `.iob` block at that cell (`minecraft:structure_void` for an absent cell).
- An object contains tile payloads, a block entity, a custom-content block, or retained `jigsaw`, `structure_block`, or `structure_void` marker blocks.

The exporter does not export tile or block-entity NBT, so a chest, spawner, or sign blocks strict export even though it works fine inside Iris.

To use the export, place it in an unmodded Minecraft 26.2 world's `datapacks/` directory and restart the server. `/reload` does not register newly added worldgen structures. Use `/locate structure <namespace>:<resourcePath>` to find a generated start.

## Content unavailable on this Minecraft version

A jigsaw graph authored on a newer Minecraft may use objects containing blocks an older server does not have. Iris checks object palettes against the live registry when the pack loads and removes the affected graph nodes in a cascade. See [25 - Pack Management](/iris/25-pack-management) for the gate, the startup listing, and `/iris pack compat`.

| Level | Rule |
|-------|------|
| Piece | A piece whose `object` needs a block the server does not have is excluded, unless a dimension `blockFallbacks` entry or a per-entry `backup` covers the block |
| Pool | Every pool entry naming an excluded piece is dropped. Weighting and `chance` are evaluated over what is left. A pool whose entries are all dropped is excluded |
| Structure | A structure whose start pool is excluded is excluded, and every structure placement referencing it drops the reference |

A dropped pool entry changes that pool's weight distribution, so a graph that loses pieces assembles differently on the older version rather than failing. `empty: true` entries and `fallback` pools are unaffected unless their own pieces are excluded. An excluded structure simply never places; the biomes and regions that listed it keep generating.

Pack validation loads every piece, pool and structure through the gate, so a structure left without a usable start pool is reported at startup (`excluded structure <key> at start pool <pool> is unavailable`) rather than at first generation.
