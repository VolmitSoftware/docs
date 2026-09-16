---
title: "Hunks and coordinate math"
description: "Shared three-dimensional storage, views, parallel computation, and integer coordinates."
published: true
date: 2026-09-14T13:42:11.591Z
tags: "volmlib, api"
editor: markdown
dateCreated: 2026-09-11T20:00:00.000Z
---

`art.arcane.volmlib.util.hunk.Hunk<T>` provides three-dimensional storage and views over shared storage. Array, atomic, mapped, and palette implementations live under `util.hunk.storage`. Minecraft world and registry bindings remain the caller's responsibility.

## Storage and views

`Hunk.newArrayHunk(width, height, depth)` creates dense storage. `Hunk.newAtomicHunk(...)` creates atomic reference storage. The integer, long, and double variants use their corresponding atomic storage types. Dimensions must be positive.

`set(x, y, z, value)` ignores out-of-bounds writes. `setRaw(...)` and `getRaw(...)` require valid coordinates. `crop(...)` copies a region. `croppedView(...)` reads and writes through to the original storage. Both use inclusive minimum coordinates and exclusive maximum coordinates. Read-only views reject writes, while converted views apply the supplied conversion functions when reading or writing.

Mapped hunks retain full-coordinate traversal through `iterateSync(...)` and `iterateSyncIO(...)`, including cells with no stored value. Their `empty(value)` operation fills all coordinates with that value. Use `iterateEntriesSync(...)` or `iterateEntriesSyncIO(...)` to visit only stored entries, `clear()` to discard all entries, and `getEntryCount()` to inspect the number stored. Mantle slices use these explicit sparse operations internally.

## Parallel computation

The caller supplies the executor factory to parallel computation and iteration methods. VolmLib does not create or own a generation pool for these operations. Section computation completes before the call returns. Non-atomic computation uses copied sections and merges the results. Atomic two-dimensional sections write through to their source.

```java
Hunk<Integer> values = Hunk.newArrayHunk(8, 8, 8);
ExecutorService executor = Executors.newFixedThreadPool(4);
try {
    values.compute3D(8, size -> new BurstExecutorSupport(executor, size),
            (offsetX, offsetY, offsetZ, section) -> section.iterateSync(
                    (x, y, z) -> section.setRaw(x, y, z, offsetY + y)));
} finally {
    executor.shutdownNow();
}
```

The example uses `java.util.concurrent.ExecutorService`, `java.util.concurrent.Executors`, and `art.arcane.volmlib.util.parallel.BurstExecutorSupport`. Long-lived generation services should pass their existing executor factory and close that executor during service shutdown. `ProceduralStream` parallel fill methods accept the same factory.

`MultiBurstSupport` owns reusable burst pools. Subclasses can override the protected `createPool(parallelism, factory, handler)` method to select pool scheduling behavior. The default retains the standard asynchronous fork/join pool. Reuse the supplied worker factory and exception handler to preserve thread naming, priority, and failure reporting.

## Coordinate helpers

`util.math.Vector3i` stores immutable integer coordinates and preserves coordinate equality, hashing, and cloning. `util.math.ChunkSpiral.centerOut(centerX, centerZ, radius)` returns the square of integer coordinates ordered by squared distance from its center. Equal distances retain their original X-then-Z traversal order. Radius zero returns the center and a negative radius returns an empty list.

`util.math.DirectionBasis` provides cardinal directions, reversal, byte encoding, and Bukkit vector, face, axis, and cuboid-direction conversion. Use `getCuboidDirection()` when expanding a shared `Cuboid` in a selected direction.
