---
title: "Projection and Visibility"
description: "Optics block sampling, scan lifecycle, view volumes, occlusion and nested views"
published: true
date: 2026-10-13T16:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-11T16:00:00.000Z
---

Projection APIs sample destination content into a local portal view. The host supplies world data and endpoints, selects view limits, and sends the resulting claims or stream content. These APIs do not contain a Minecraft renderer.

## Sampling destination content

`Sampler<B, M, W, P, V>` uses `BlockStates`, `SampleMemo`, `RecursiveEndpoints` and host world/view lookup functions. `B` and `M` are block and material types, `W` is the world key, `P` is an endpoint, and `V` is a content view.

`resolve(...)` reads a destination sample and follows eligible nested endpoints within the supplied recursion depth. `prepareTransform(permutation)` selects the display orientation, and `transformProjectedBlockData(source)` rewrites directional state through the host's block adapter.

| Sample.Kind | Meaning |
|---|---|
| `BLOCK` | Destination block data |
| `BACKING_BLOCK` | Backing surface data |
| `REMOTE_AIR` | Air from the destination |
| `MASK_AIR` | Air used to mask a portal opening |
| `OCCLUDED` | Content hidden by the sampling policy |
| `NO_SAMPLE` | No usable sample |

`Sample.noSample()` and `maskAir(airData)` create sentinel samples. `withData` replaces the block value. `asClaim` creates a block claim, and `matchesClaim` compares it with an existing claim. A sample can carry its light view and remote cell key.

`SampleMemo` caches remote samples, local air checks and occlusion depth. `destinationStale`, `destinationOverBudget`, `localStale` and `localRegionDirty` describe reuse eligibility. Use `refreshDestination`, `refreshLocal`, `clearDestinationSamples` and `discard` to manage that state.

`Sampler.recursiveIndex` prepares nested endpoint lookup for a world and eye. `clearRecursivePortals` discards it. Buried-cell culling and recursive-sample counters expose the selected sampling behavior.

## Affine projection sampling

`AffineProjection.Options(Shape aperture, Affine apertureToSource, Affine sourceToDestination, Vec3d camera)` supplies a shape in aperture-local u/v coordinates on z=0 and a source-world camera. `Options` itself performs no validation. The projection constructor requires non-null inputs, finite transforms and camera, an invertible aperture pose, and a camera at least `1e-12` from the plane in aperture coordinates. The destination map may be singular for this sampling helper. Streamed `PortalAffine` values require both maps to be invertible.

`contains(x, y, z)` tests whether the camera-to-point segment crosses the raw shape. Call it before `destinationInto(x, y, z, out3)`: the latter maps any point without clipping or allocating a vector and requires at least three output slots. The host supplies its destination sampler, source bounds and output transport. Block-packet output samples whole Minecraft cells, so sub-block motion and aperture edges remain approximate. A renderer that implements the negotiated affine protocol can apply these transforms to its geometry.

## Cell scans

Construct `CellScan` with its typed `Context`: endpoint, aperture, sampler, memo, blackout provider and settings supplier. Supply a `ScanDestination` for local/destination views, destination anchor and mirror state.

| Method | Use |
|---|---|
| `run(...)` | Run a complete scan |
| `begin(...)`, `advance(deadlineNanos)` | Start and continue a scan within host deadlines |
| `hasPending`, `cancelPending` | Inspect or cancel an unfinished scan |
| `commit()` | Commit the pending projection result |
| `claims()`, `claimDelta()`, `blockEntities()` | Read projected claims, changed claims and block-entity output |
| `entityOcclusion()` | Reuse destination visibility checks for entity projection |
| `canResumeOcclusion`, `resumeOcclusion`, `invalidateOcclusionContinuation` | Continue unresolved visibility work when geometry permits |
| `remoteFootprint`, `restartRemoteFootprint` | Track sampled destination cells |
| `invalidateContent`, `dropHolds`, `clear` | Invalidate samples, release held claims or clear scan state |
| `exposeLosingClaims`, `revokeConeHolds`, `holdsExposed` | Manage claims displaced by overlapping portal views |

`ScanMode(buriedCellCulling, observerOcclusion)` selects the two visibility policies. `ScanSettings` clamps recursion depth to 3..64, reveal margin to 0..15 degrees and aperture padding to 0..8 blocks. Its held-claim limit clamps to 0..50000000. It also controls debug counts, invisible-claim retention and completion within a slot.

`hasProjection`, local/remote frames and `eyeDot` describe the result. Counters report entered, exited, retained, masked, held, losing, rejected and unresolved cells. The host can inspect them without changing output policy.

`RemoteFootprint` implements `WorldChangeFilter`. Record sampled cells, merge footprints and query affected blocks or chunk columns. `markNested()` marks a footprint that includes nested sampling. `clear()` resets it.

## View volumes

| Type | Use |
|---|---|
| `Frustum` | Test point containment in a bounded perspective volume |
| `ViewVolume` | Fit an observer eye and aperture with axial/lateral range and padding |
| `FrustumFit` | Fit depth and lateral extent under a candidate-cell budget |
| `FrustumRow` | Prepare a row and test its cell coordinates against a volume |
| `PlaneWindow` | Test rays, block silhouettes, slab windows and rows against the aperture plane |
| `ApertureSlab` | Describe the depth interval behind a viewed aperture |
| `LocalEntityEnvelope` | Test whether an entity envelope lies fully in projected geometry |

`ViewVolume.Options` carries axial range, lateral range, near-plane padding, culling ratio and aperture padding. `contains`, `containsPrimitive` and `containsRow` test the resulting region. `getRegion` and `getFaceCount` expose its bounds.

`FrustumFit.Options` clamps cell budget to 0..50000000, near-plane padding to 0..16, culling ratio to 0..1 and aperture padding to 0..8. `capDistance` limits a requested range by server and client chunk ranges.

`fit`, `frustumFor` and `estimateCandidateWork` provide volume selection. `fittedDepth`, `fittedLateral`, `fittedCoarse` and `fittedCandidateWork` report the selected result. `setOptions` and `setLodPolicy` update future fitting.

`ApertureSlab` supplies signed distance, depth indices, axis bounds and a `BlockBox`. `withinDepth`, `containsSlab`, `contains`, `encloses` and `reaches` compare geometry against that interval. Its static plane, side and clearance helpers use cell-center conventions.

## Level of detail and gaze selection

`LodPolicy` controls distant slab merging and detail omission. `NONE` disables both. `mergesSlab(depth)`, `dropsDetail(depth, material)` and `coarsenedWork` report its decisions.

`LodProfile` names `NEAR`, `BALANCED` and `FAR` profiles. `forProfile` derives policy distances, while `configName`, `parse` and `next` support host controls. These policies affect sampled content rather than graphics quality settings in a Minecraft client.

`GazeScheduler.select(observerId, eye, candidates, limit, frameTick, options)` selects portal candidates under a per-frame limit. `Eye` carries position and look, and each `Candidate<T>` supplies its id, bounds and host value.

`GazeScheduler.Options` clamps FOV to 30..170 degrees, lookahead to 0..20 ticks and maximum starvation to 1..200 ticks. `retain`, `forget` and `clear` release selection state when portals or observers disappear.

## Occlusion

`ViewOcclusion<B>` tests destination cells against blocking content. Begin each pass with plane and observer geometry. `visibility(...)` returns `VISIBLE`, `HIDDEN` or `UNRESOLVED`. An exhausted trace budget is not proof that a cell is hidden.

`setRevealMarginDegrees` widens the reveal boundary, and `restartTraceBudget` starts another bounded trace batch. The API exposes voxel steps, budget exhaustion and cache/proof counters.

`EntityOcclusion` applies those visibility checks to entity bounds or an `EntitySnapshot`. `beginPass`, `updateEye`, `retainRevision`, `startBatch` and `disable` manage the current context. `fullyHidden` tests the supplied envelope.

`LocalOcclusionArbiter` coordinates hide/show requests for real local entities across portal owners. Use `beginFrame`, `replace` and `flushFrame` to update desired hidden entities. `release`, `discardObserver` and `clear` release ownership. The host implements the actual visibility output.

## Nested views

`RecursiveEndpoints` uses an `EndpointDirectory` to locate eligible portals in a world. `indexFor` builds an eye-relative index, and `revalidate` refreshes its endpoint data. `Options` supplies aperture padding and depth.

| Nested-view API | Use |
|---|---|
| `Index.paths`, `find`, `reach`, `maskHit` | Enumerate paths, locate a nested hit or classify reach as `NONE`, `MASK` or `RECURSIVE` |
| `Candidate.transform`, `covers`, `clipLine` | Map and clip a candidate path |
| `Hit` | Destination world, portal, transformed point/eye, traversal state and cycle flag |
| `RecursionPath.push`, `contains`, `pop`, `clear` | Track visited endpoint ids |
| `EntityPath` | Carry a root or child transform and remaining depth for entity visibility |
| `ClientRecursionPlanner.plan` | Derive bounded nested cones from descriptor geometry |

Nested planning checks aperture overlap with every ancestor view cone. A child can remain visible when its center and corners are outside. Exact point visibility still checks the complete ancestor chain.

`EntityPath.visible`, `visibleBounds`, `fullyHidden` and `point` apply path geometry to entities or points. `ClientRecursionPlanner.NestedCone` exposes geometry, depth, transform, reflections, ancestors and the content-space eye.

Recursion requires a host depth limit and cycle handling. `Sampler.shouldMaskRecursivePortalAperture` decides whether the opening becomes mask air when traversal is unavailable, cyclic or exhausted.

## Refresh and pass selection

| API | Use |
|---|---|
| `ViewCadence` | Depth, heartbeat, entity interval and global cadence values |
| `ResampleSchedule` | Decide cell, entity, lighting and remote resend intervals |
| `ResampleSchedule.Cadence` | Supply refresh, stable-cell, lighting and remote resend intervals |
| `PassInputs` | Capture camera, geometry, limits, LOD, content revisions and pending work |
| `PassPlanner.plan` | Select `REUSE`, `RESUME_OCCLUSION` or `RESCAN` |
| `PassPlan` | Carry the kind, flags, reasons and revision |
| `PassRevision` | Hash transform inputs and combine revision values |
| `ResampleReasons` | Collect named resample-reason bits |
| `BlockSlices` | Divide a frame deadline into scheduled scan slices |
| `CommitLatency` | Collect begin/commit timing and report percentile ticks |
| `FrustumFailures` | Count consecutive and total failed frustum builds and emit a failure metric |

Update revisions when host data changes. Call `beginBlockPass`, note remote/source revisions, and invalidate destination state when needed. The schedule can query `WorldChangeTracker` with a sampled footprint to decide whether destination content remains current.

These APIs select work and expose its state. The host owns the update loop and must keep live world reads on the correct server or region thread.
