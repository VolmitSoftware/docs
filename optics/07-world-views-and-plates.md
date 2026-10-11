---
title: "World Views and Plates"
description: "Optics world access, section caches, destination plates, chunk leases and claim output"
published: true
date: 2026-10-11T17:27:43.915Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-11T16:00:00.000Z
---

World views expose host content without platform types. Plates retain sampled destination content for reuse. Claim sets resolve overlapping portal output and identify the cells and lighting that the host must update.

## World access contracts

| Interface | Host responsibility |
|---|---|
| `BlockView<B>` | Supply height limits, block samples, chunk readiness/request and content revision |
| `ContentView<B, M>` | Add world id, material, biome, block entity, light, sky darkness and optional buried depth |
| `BlockStates<B, M>` | Define air/occluded values, materials, opacity, orientation rewriting and property conversion |
| `SectionSource<B, M>` | Capture sections into a builder, report available columns and release captures |

`ContentView.LIGHT_UNAVAILABLE` identifies missing light. Its default `blockEntitiesComplete` returns true. Override it when captures can omit block entities that still exist in the source.

`BlockStates.transform` receives an `AxisPermutation`. `properties` and `withProperties` bridge host block values to [state rules](/optics/09-fidelity-and-block-states#block-state-orientation).

A view can represent a live world, a captured snapshot or remote content. The host determines thread ownership and data freshness. A cache does not make live world access safe from an arbitrary worker thread.

## Section captures

`CachedSection<B, M>` stores 4096 cells in a 16×16×16 section. `CachedSection.index(localX, localY, localZ)` addresses a local cell. A `Builder` accepts block/material pairs with `set` and creates a section with `build`.

Captured sections expose coordinates, fill tick, palette size, byte estimate, data/material values, opacity and optional buried depth. `sameOpacity` compares opacity content between captures.

`SectionCache` manages captures under `Limits(enabled, maxBytes, chunksPerTick, ttlTicks)`. `Limits.from` converts a megabyte limit. `world(source, minSectionY, maxSectionY)` returns a `WorldSections` handle.

| Method | Use |
|---|---|
| `WorldSections.section`, `buriedDepth` | Read or request captured content |
| `capture`, `hasColumn`, `size` | Capture and inspect column availability |
| `blockChanged`, `columnChanged` | Invalidate host changes |
| `WorldSections.clear` | Release one world's cached content |
| `SectionCache.tick`, `configure` | Advance capture/expiry and update limits |
| `bytes`, `sectionCount` | Inspect retained content |
| `release`, `clear` | Release a world handle or the entire cache |

## World changes

`WorldChangeTracker.markChanged(worldId, x, y, z)` records a block change. Its x/z overload records a column change. `currentVersion()` supplies the current revision.

`dirtySince`, `collectDirtySince` and `unaffectedThrough` query a chunk rectangle since a prior revision. The `AFFECTED` sentinel identifies an affected query. Use `clearWorld` when the host drops that world.

`WorldChangeListener` receives block, column and world-clear callbacks. `WorldChangeFilter` limits which blocks or columns affect a consumer. Add or remove listeners explicitly.

## Plates and plate cells

| Type | Use |
|---|---|
| `ViewPlateKey` | Identify a source portal, destination view identity, viewed side, mirror turn and target identity |
| `ViewPlate<B>` | Retain the sampled grid, environment and destination/transform revisions |
| `PlateGrid<B>` | Store a bounded cell grid through palette references |
| `PlateCell<B>` | Store sample kind, source block, transformed block and optional block entity |
| `PlateEnvironment` | Capture destination biomes and light for the plate |

`PlateGrid.NO_CELL` means no stored cell. `ref`, `paletteCell`, `cell`, `cellKeys`, `cellCount`, `paletteSize` and `bytes` expose the grid. Read `cell(key)` for block-entity cells: `blockEntityRef(ref)` identifies their sentinel, which is not a palette index.

Create `new PlateGrid.Writer<B>(bounds)` and populate it with `void put(int x, int y, int z, PlateCell<B> cell)` using world cell coordinates. An out-of-bounds cell raises `IllegalArgumentException`. Finish after all writes and discard the writer: the returned grid shares its cell storage and block-entity map. Hosts can use this writer to build virtual destination sections without a live world capture.

The writer reuses ordinary entries by source state within its kind buckets, with one shared remote-air entry. Use consistent transformed data for each source state. The ordinary palette admits at most 65534 entries. The writer skips further distinct ordinary entries.

`PlateCell.sample(lightView, remoteKey)` restores source block data. `data()` supplies the transformed value. `PlateCell.isAir` distinguishes air content. `ViewPlate.cell`, `cellRef` and `paletteCell` provide access without a world read.

A plate tracks world id, tracker version and affected chunk bounds. `refreshDirt`, `collectDirt`, `dirty`, `dirtyChunks` and `cleanCell` let a host preserve clean content while replacing affected captures. `ChangeRegion` exposes the associated change query.

`PlateEnvironment.capture(box, transform, view)` captures environment data. It implements `BrickLightSource` for streamed light and supplies `SectionBiomes` for mesh content.

## Building plates

`ViewPlateBuilder.Request` specifies aperture, destination view, local/remote frames and origins, mirror rules, ranges, padding, LOD and block-entity policy. It also carries revisions, air data and the block adapter.

| Builder method | Use |
|---|---|
| `build(request)` | Build a complete plate synchronously |
| `job(request)` | Build through repeated `Job.step(cellBudget)` calls |
| `patch(request, previous, dirtyChunks)` | Replace affected content in a prior plate |
| `sectionJob(request, clip)` | Build a clipped section for mesh output |
| `footprint`, `patchFootprint`, `sectionFootprint` | Estimate affected chunks and retained bytes |
| `sectionDestinationBox` | Map a display clip into destination capture bounds |

A `Job` exposes its key, urgency, predicted bytes and result. `markUrgent()` raises its scheduling priority. Call `result()` after the job reports completion.

For live worlds, capture data through `ChunkCapture<W, S>` before background computation. Its `loaded`, `hold`, `capture` and optional `cached` methods define chunk access. The snapshot type `S` must permit the reads used by the build job.

`PlateCaptureJob.Plan` supplies the world, footprint, capture source and a build factory. `capture(budget)` gathers chunks. `step(cellBudget)` builds from captured data. `phase()` is `CAPTURING`, `CAPTURED` or `FAILED`. `abort()` releases unfinished work.

## Plate cache and pipeline

`ViewPlateCache.current(...)` returns current retained content and can queue a replacement through the supplied job factory. `peek` reads an existing plate. `isRefused` identifies a key/revision refused by the byte budget.

`publish` installs a completed job result, while `buildFailed` clears a failed build. `invalidate`, `invalidatePortal` and `invalidateTarget` remove stale identities. `refreshDirt` applies world changes, and `recap` changes the byte cap.

`PlatePipeline` supplies a cache and runs plate build jobs through `OpticsScheduler.compute()`. Call `tickCaptures(chunkBudget, urgentChunkBudget)` from the host's capture context. `queuedCaptures` reports pending captures, and `clear` aborts queued captures and releases cached results.

`PlateWorkers` is a resizable executor for computation. Use `execute`, `resize`, `threads` and `shutdown`. Host world capture still requires the owning context.

## Chunk leases

`ChunkLeaseRegistry` retains a chunk through `ChunkLeasePlatform.add` and releases it through `remove`. `Options` supplies idle delay, retry delay and maximum attempts. The platform receives failures through `reportFailure`.

`retain(world, worldId, chunkX, chunkZ)` returns an `AutoCloseable` `ChunkLease`. `ready()` resolves chunk readiness, and `isValid()` reports lease validity. Close the lease when its consumer finishes.

Call `worldUnloaded(worldId)` when a world closes, and `shutdown()` when the host stops. Optics does not choose a platform ticket implementation.

## Overlapping block claims

`BlockClaim<B, V>` carries projected data, remote light context, mask-air status, lighting policy and held status. `blackout(...)` creates a backing claim. `withLightingPolicy`, `withFullBright` and `withHeld` return adjusted claims.

Lighting policies are `LOCAL`, `SOURCE` and `FULL_BRIGHT`. `requiresLightOverlay` and `hasRemoteLight` describe the light output needed. `getGlobalId` and `setGlobalId` retain a resolved host block-state id.

`Claim<C>` defines the comparison and policy contract. `ClaimSet<C>` tracks per-portal claims and selects one winner per cell. A non-mask-air claim outranks mask air. A fresh claim outranks a held claim. Within those tiers, nearer distance wins, with the string tie key resolving near-equal distances.

| ClaimSet method | Use |
|---|---|
| `replacePortalClaims`, `replacePortalDelta` | Replace one portal's claims or changed subset |
| `stagePortalClaims`, `stagePortalDelta`, `stagePortalRelease`, `resolveStaged` | Batch ownership changes before resolving affected keys |
| `releasePortal` | Remove one portal's claims |
| `getWinningClaims`, `getWinningClaim` | Read resolved output |
| `drainLosingTransitions` | Collect displaced or restored claim keys |
| `clear`, `isEmpty`, `hasFullBrightClaims` | Release or inspect state |

`ClaimDelta` carries prior claims and changed/removed keys. `Result` reports packet-change keys, dirty-lighting keys, conflicts, winner changes and reverts. `requiresImmediateLightingUpdate` identifies an urgent light change.

`Blackout<B>` supplies enabled status and backing block data. `WorldOutput<O>` supplies the host's light, block-entity, biome, weather and sound output. It also reports observer availability, sent chunks, light budget, ambient support and endpoint observers. The host sends actual block changes from the winning claims.
