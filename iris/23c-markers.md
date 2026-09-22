---
title: "Markers"
description: "Iris documentation: Markers"
published: true
date: 2026-09-21T10:36:56.240Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
A marker is a tag written at a block position. An object placement tags specific blocks it places, and the marker file says which spawners fire there. That is how you get mobs that appear inside a specific ruin rather than anywhere in the biome.

Spawner and entity fields are on [23b - Entities & Spawners](/iris/23b-entities-spawners). Object placements are [20 - Object Placement](/iris/20-object-placement).

Marker spawning needs `world.markerEntitySpawningSystem` true in `iris.json` (the default). The bundled Overworld pack has no `markers/` folder.

## Marker definition (`IrisMarker`)

Folder: `markers/`. The key is the pack-relative path without `.json`.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `spawners` | string[] | `[]` | Spawner keys. One is picked at random each time the marker fires |
| `removeOnChange` | boolean | `true` | Delete the marker when a player breaks the block it sits on. Leave on unless you want a spawn point that survives being mined out |
| `emptyAbove` | boolean | `true` | Require two non-solid blocks above. Checked twice — see below |
| `exhaustionChance` | double | `0` | Odds the marker deletes itself when it fires. `0.25` averages four uses. Anything at or below 0 never exhausts. 1 or higher exhausts on the first use |

`emptyAbove` requires two clear blocks above the marker in the object and in the live world. A marker that becomes obstructed is removed.

## Placing markers from objects (`IrisObjectMarker`, snippet type `object-marker`)

On an object placement's `markers[]`:

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `mark` | `IrisBlockData[]` | required | Block types to tag. Candidate blocks are shuffled, so which matching blocks get tagged varies by placement |
| `marker` | string | required | The marker key to attach |
| `maximumMarkers` | int 1..16 | `8` | Cap for this entry across all its `mark` types. Keep it low — each marker is a per-block write and a per-chunk scan cost |
| `exact` | boolean | `false` | Match the full block state instead of just the material |

```json
{
  "place": ["dungeons/crypt"],
  "chance": 0.01,
  "markers": [
    { "mark": [{ "block": "minecraft:spawner" }], "marker": "crypt-spawns", "maximumMarkers": 4 }
  ]
}
```

## Marker spawning

When marker spawning is enabled, an unobstructed marker uses one of its configured spawners at random. The names `cave_floor` and `cave_ceiling` are reserved and cannot be used for marker spawning.

Marker spawns **bypass** the entity `surface` check and the bounding-box clearance check — the marker is taken as authoritative about the position being valid. They still honor `allowedLightLevels` and the spawner's time, weather, and rate gates. `exhaustionChance` is rolled once per firing, before the mobs are placed.

A block in a placement's `markers[].mark` list that does not exist on the running Minecraft version simply matches nothing; the placement keeps generating. See [25 - Pack Management](/iris/25-pack-management).
