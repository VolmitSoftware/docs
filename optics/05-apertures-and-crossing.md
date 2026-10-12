---
title: "Apertures and Crossing"
description: "Optics cell apertures, geometry descriptors, crossing queries and arrival policies"
published: true
date: 2026-10-12T01:06:17.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-11T16:00:00.000Z
---

An aperture describes the cells through which a view or traveller can pass. A geometry descriptor adds the plane, mask and presentation policies. Crossing helpers calculate arrival state, while the host performs travel and applies entity scale.

## Aperture interfaces

| Type | Use |
|---|---|
| `Aperture` | Supply an area, center and cached faces for view-volume construction |
| `CellAperture` | Add a revision, whole-cuboid flag and integer cell membership |
| `ApertureCells` | Store an aperture from a rectangle or explicit cell positions |
| `Endpoint` | Supply a portal id, frame and plane origin |
| `EndpointDirectory<W, P>` | Resolve worlds, apertures, destination endpoints, mirror rules, view bounds and travel scale |

`ApertureCells.setArea(box)` fills the area. `setBlocks(cells)` derives an area from cells. `restore(area, cells)` retains a supplied rectangle with selected open cells. `getRevision()` changes when the aperture changes.

`containsBlock` tests a cell, and `containsOrAdjoinsBlock` also admits adjacent cells. `getBlockPositions`, `randomBlockPosition`, `randomCellCentre`, `getCachedApertureFaces` and `captureZone(radius)` support host geometry and effects. A block position and a cell center differ by half a block per axis.

`PortalRegistry.directory()` supplies a `PortalDirectory` implementation of `EndpointDirectory`. A custom host can implement the directory for its own endpoint type.

## ApertureDescriptor

`ApertureDescriptor.fromPortal(source)` returns an `Optional`. It requires a planar, cardinal aperture with dimensions within the descriptor limits. The direct record constructor stores values, while `valid()` checks their validity. Validate directly constructed descriptors before use.

```java
Optional<ApertureDescriptor> geometry = ApertureDescriptor.fromPortal(gate.source(true, 32));
```

`gate` is a [PortalDefinition](/optics/04-portals). Its `source` method supplies a default presentation policy. Construct `ApertureDescriptor.Source` when the host needs explicit padding, fidelity, lighting, recursion or blackout settings.

| Descriptor fields | Meaning |
|---|---|
| `originX`, `originY`, `originZ`, `facing`, `frontSide`, `planeOffset` | Integer corner cell, cardinal front, viewed side and plane displacement |
| `quarterTurns` | Frame orientation in its low two bits and mirror turn in the next two bits |
| `mirror`, `apertureWidth`, `apertureHeight`, `apertureMask`, `shape` | Reflection, dimensions, row-major open-cell bitset and exact shape descriptor |
| `nearPlanePadding`, `aperturePadding`, `frustumCullingRatio`, `depthBlocks` | View-volume limits and margins |
| `recursionDepth`, `parentPortalKey`, `nested` | Nested-view relationships |
| `blackoutPolicy`, `blackoutState`, `maskAirPolicy`, `lightingPolicy` | Backing, air and lighting rules |
| `fidelityFlags`, `kind`, `targetIdentity` | Fidelity flags, host kind byte and destination content identity |

Dimensions must be 1..65535 per edge, with at most 1048576 cells. Depth is 0..65535. The mask must have the required word count and at least one open cell. Stream encoding applies additional limits, including 1024 mask words.

`apertureMask(width, height, open)` packs row-major booleans. `packQuarterTurns(frameTurns, mirrorTurns)` packs the orientations. `apertureOpen` tests the raw bitset, while `containsCell` and `containsPoint` apply the geometry's membership rules.

| Method | Use |
|---|---|
| `frame`, `frameOrientation`, `facingDirection`, `planeCoordinate`, `signedDistance` | Resolve the world plane |
| `cellCoordinates`, `planeShape` | Map coordinates into the fitted mask |
| `apertureArea`, `aperture`, `openCellCount` | Obtain the rectangle and usable cells |
| `mirrorTransform` | Obtain the reflected map |
| `withParent`, `withNested`, `withShape`, `withDepth` | Return a descriptor with replaced fields |
| `sameSurface`, `sameContentSurface` | Compare geometry or content-surface identity |
| `hasFidelity`, `lightingPolicyType` | Read the encoded policy |

Blackout policies are off, shell, or shell plus buried cells. Air policy either projects air or keeps real cells. Fidelity bits identify display entities, lighting, weather and sounds. These fields select host behavior rather than perform output themselves.

## Polygon and boundary outputs

`AperturePolygon.from(geometry)` combines open-cell rectangles with the fitted shape. `rectangles()` returns merged open regions. `point(column, row)` maps a plane coordinate to world space, and `vertices(rectangle)` supplies its corners.

`plane()`, `servesEye(eye)` and `contains(column, row)` support side and mask queries. `planeShape()`, `hasShape()` and `mesh(subdivisions)` supply shape-aware drawing data.

`project(rectangle, matrix, clipDepth)` returns clipped homogeneous `ClipVertex` values. Use `ClipDepth.NEGATIVE_ONE_TO_ONE` or `ZERO_TO_ONE` to match the graphics projection convention.

`BoundarySamples.append` samples exposed block-cell edges. `ShapeBoundarySamples.append(out, geometry, spacing, factory)` samples fitted shape outlines on the world plane. `PointFactory<R>` converts coordinates into the host's point type.

`ObserverGeometry.isLookingTowardPortal` checks whether an observer looks toward a plane. `hasStablePortalSide` supports side selection near it.

## Crossing and pose transfer

`PlaneCrossing.intersection(frame, origin, start, end)` returns a segment-plane intersection, or `null`. It does not check aperture membership. `PortalDefinition.crossing` adds open-cell and exact mask checks.

`PlaneCrossing.create(frame, origin, motion)` creates crossing context from a `Motion` record. Its `point` stores the motion endpoint. A `PortalCrossing` separately provides the intersection fraction and `point()`.

| Helper | Use |
|---|---|
| `PlaneCrossing.toward`, `outPoint`, `outVelocity`, `outLook` | Map endpoint state into the exit frame |
| `PlaneCrossing.planePoint` | Map a point projected onto the source plane |
| `PlaneCrossing.rejectionPoint` | Calculate a point displaced toward the source side |
| `PlaneCrossing.sourceSideDistance` | Measure signed distance from the stored endpoint |
| `Pose` | Position, previous and old positions, velocity, yaw/pitch and body/head angle history |
| `Pose.moved`, `withVelocity` | Return a modified pose |
| `PoseTransform.apply` | Transfer a complete pose through a rigid or similarity map |
| `PoseTransform.orient` | Rotate pose angle history while retaining world positions and velocity |
| `PoseTransform.arrive`, `arrivalRoll` | Apply arrival policies and report camera roll |

The host must perform collision checks, choose a destination and apply the resulting pose. These helpers do not teleport a player or enforce travel permission.

## Arrival rules

`ArrivalOrientation` supplies `apply`, `transfer` and `direction`. `transfer` includes roll and maps the camera's forward and up vectors together.

| OrientationRule | Arrival direction |
|---|---|
| `FRAME` | Rotate forward and camera up between frames |
| `LOOK` | Preserve world look and camera up |
| `SNAP` | Face against the exit view's normal |
| `MIRROR` | Rotate, then reflect forward and camera up about the exit plane |

An optional gravity flip adjusts upright orientation for vertical exits except under `LOOK`.

`MomentumRule(mode, factor, maxSpeed, impulse)` selects velocity handling after coordinate transfer. `ArrivalMomentum.apply(outVelocity, rule, defaultMaxSpeed)` evaluates it.

| Momentum mode | Effect |
|---|---|
| `PRESERVE` | Keep mapped velocity |
| `SCALE` | Multiply mapped velocity and apply the speed ceiling |
| `CLAMP` | Apply the speed ceiling |
| `ZERO` | Return zero velocity |
| `IMPULSE` | Add the impulse vector |

A positive rule maximum overrides the default ceiling. A non-positive ceiling disables clamping. `ArrivalMomentum.reflect` reflects a velocity about a supplied normal and applies a multiplier.

## Size ratio and traveller scale

`SizeRatio.between` compares source and destination dimensions in their frames. It uses the smaller mapped-axis ratio. `exact()` reports whether both ratios agree within `1e-6`. `inverse()` reverses it, and `isUnit()` tests a unit ratio.

The ratio is destination size divided by source size. `percentage()` expresses that ratio as a percentage: `0.5` is `50%`, and `2` is `200%`. `SizeRatio.fromPercentage(50)` constructs an exact ratio of `0.5`. Its inverse is `200%`. Percentages describe the resulting size relative to entry size, rather than a fraction of the resizing effect.

| ScaleRule | Travel and entity behavior |
|---|---|
| `OFF` | Unit travel scale and unchanged entity factor |
| `motion()` | Size-ratio position and velocity mapping, unchanged entity factor |
| `ratio(min, max)` | Size-ratio mapping and a multiplied, clamped entity factor |

Scale bounds clamp to 0.0625..16 and must remain ordered. `entityFactor(currentFactor, ratio)` requires a finite positive current factor in every mode. Ratio mode multiplies the current factor on each crossing, then applies the bounds. `changesEntity()` identifies ratio mode. Use the host's `ScaleAccess` to read, apply or reset actual entity scale.

`PoseTransform.arrive` maps a pose, but does not apply an entity scale attribute. A host must perform that separate action.

## Directional gravity and traveller state

`GravityFrame` stores a proper `AxisPermutation`. Its 24 orientations support all six cardinal down directions and quarter turns around them. Reflections, affine shear and arbitrary-angle gravity are outside this contract. `WORLD` uses ordinary world-down gravity. `transformed(portalRotation)` composes a portal's proper rotation with the current frame.

| GravityFrame method | Use |
|---|---|
| `down()`, `up()` | Read cardinal gravity and support directions |
| `toWorld`, `toLocal`, and their `Into` forms | Convert vectors between gravity-local and world coordinates |
| `projectMovement(worldVector)` | Remove the component perpendicular to the locomotion plane |
| `acceleration(magnitude)`, `jump(speed)` | Produce world-space downward acceleration and upward jump velocity |
| `look(yaw, pitch)` | Convert local view angles into a world camera basis |
| `eyePosition(feet, height)`, `bounds(feet, width, height)` | Place the eye and collision box along the frame's up direction |
| `modelRotation(bodyYaw)` | Rotate a local model by its body yaw and gravity orientation |

`TravellerState(pose, scale, gravity)` keeps positions, position history and velocity in world coordinates. All pose view, body and head angles use the gravity-local basis. Scale must be finite and positive. `scalePercentage()` reads the factor as a percentage, and `withScalePercentage(percentage)` returns a state with that scale.

`TravellerTransform.apply(state, toward, rule)` maps world positions and velocity through the supplied `Similarity`, rotates gravity, and applies the rule's entity factor. It preserves local angle history, so a traveller remains upright relative to the new floor. Construct `toward` with `rule.travelScale(sizeRatio)` to select scaled or rigid travel.

```java
SizeRatio ratio = SizeRatio.between(sourceFrame, 4, 6, destinationFrame, 2, 3);
ScaleRule rule = ScaleRule.ratio(0.25D, 4.0D);
Similarity toward = Similarity.between(sourceFrame, sourceOrigin, destinationFrame, destinationOrigin, rule.travelScale(ratio));
TravellerState departure = new TravellerState(pose, 1.0D, GravityFrame.WORLD);
TravellerState arrival = TravellerTransform.apply(departure, toward, rule);
```

This pair produces a `50%` scale from the entry state. The host applies the arrival pose and scale, changes actual gravity, and synchronizes the camera and character model. `camera()`, `eyePosition`, `bounds` and `modelTransform()` provide the corresponding geometry. See [Entity Projection](/optics/08-entity-projection#traveller-model-orientation) and [Gravity access](/optics/11-math-and-host-interfaces#gravity-access).

## Straddling geometry

`StraddleGeometry.straddles` tests whether a box spans the portal plane. `clipToFront` clips a box to the source-facing side. `exclusionSlab` creates a depth-limited area behind the aperture.

`mappedBox`, `mappedMove` and `unmappedMove` transfer collision bounds and movement through either an `OpticTransform` or a `Similarity`. The host supplies collision data and applies movement.
