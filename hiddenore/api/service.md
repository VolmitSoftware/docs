---
title: "service"
description: "HiddenOreService read API"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "hiddenore, api"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
`HiddenOreService` reads block provenance and seeded vein data. Acquire it as shown in [API Overview](/hiddenore/api).

## Methods

| Method | Result |
|---|---|
| `isSeeded()` | Whether generation uses seeded veins |
| `isManagedBase(Material)` | Whether a material is listed under `blocks:` |
| `originOf(Block)` | `PLAYER_PLACED`, `PRESUMED_GENERATED`, or `UNTRACKED` |
| `provenanceOf(Chunk)` | Snapshot of tracked placements in one chunk |
| `veinAt(Block)` | Unconsumed seeded vein at the block, or `null` |
| `veinSiblings(Block)` | Remaining positions in the same vein and chunk |
| `veinsNear(Location, int)` | Up to 4,096 unconsumed positions within 128 blocks |
| `isVeinConsumed(Block)` | Whether the seeded position was spent |
| `ownsRegion(World, int, int)` | Whether the current thread owns the chunk |

`PRESUMED_GENERATED` means HiddenOre has no player-placement record for a managed block. It does not prove vanilla world generation created the block.

## Threading

`isSeeded()`, `isManagedBase(...)`, and `ownsRegion(...)` are safe from any thread. Other methods must run on the thread that owns the target block or chunk.

```java
int chunkX = block.getX() >> 4;
int chunkZ = block.getZ() >> 4;

if (!hiddenOre.ownsRegion(block.getWorld(), chunkX, chunkZ)) {
    return;
}

BlockOrigin origin = hiddenOre.originOf(block);
```

On Paper and Folia, use the region scheduler when you need to move the call to the owning region.

## Vein limits

Vein queries return no positions in `pure_random` mode. `veinsNear(...)` skips unloaded or unowned chunks, returns results in scan order, and throws when the radius exceeds `HiddenOreService.MAX_NEARBY_RADIUS` (`128`). Treat large searches as scans, not per-tick lookups.
