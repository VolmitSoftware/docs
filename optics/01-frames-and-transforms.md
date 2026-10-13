---
title: "Frames and Transforms"
description: "Map portal frames, position, scale, rotation, and camera orientation"
published: true
date: 2026-10-13T00:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

A portal is a plane with a frame, and travel or projection maps the space in front of one frame onto the space behind another. Optics keeps that map in three forms: `OpticTransform` for rigid, cell-aligned maps between portals, `Similarity` when the pair also scales, and `Affine` for anything else. `Quaternion` and `EulerAngles` describe rotations, and `LookTransfer` carries a view direction through any of them.

## Conventions

| | |
|---|---|
| Axes | `Axis.X`, `Axis.Y`, `Axis.Z`. `Face.E` and `Face.W` are +X and -X, `Face.U` and `Face.D` are +Y and -Y, `Face.S` and `Face.N` are +Z and -Z |
| Positions | `Vec3d(x, y, z)` records; `Vec3d.ZERO`, `UNIT_X`, `UNIT_Y`, `UNIT_Z` |
| Cells | Integer block positions. A cell's centre is at `+0.5` on each axis |
| Look | `Angles.Look(yaw, pitch)` in degrees with Minecraft's convention: pitch `90` looks straight down, `-90` straight up |
| Angles | Degrees in `QuarterTurn`, `EulerAngles`, `Quaternion.axisAngleDegrees` and `PlaneTransform.rotation`; radians in `Quaternion.axisAngle` and `Affine.rotation(axis, radians)` |

## Frame

`Frame` is three perpendicular faces: `normal` (the direction the front of the portal faces), `up` (screen-up on the portal plane) and `right`, which is always `normal × up`. The constructor rejects any other combination.

| Factory | Result |
|---|---|
| `Frame.canonical(normal)` | Walls use `U` as up. A floor portal (`normal == U`) uses `S`; a ceiling portal (`normal == D`) uses `N` |
| `Frame.fromNormalUp(normal, up)` | Explicit up; right is derived |
| `Frame.derive(area, normal)` | Canonical, except that a floor or ceiling area wider along X than along Z uses `E` as up |
| `Frame.fromDirectionAndLook(normal, look)` | Floor and ceiling portals take their up from the horizontal part of the look; walls stay canonical |

| Method | Result |
|---|---|
| `flipNormal()` | Same up, opposite normal: the back of the portal |
| `view(frontSide)` | `this` for the front, `flipNormal()` for the back |
| `rotateClockwise()`, `rotateCounterClockwise()` | Turn up onto right, or onto -right, around the normal |
| `withNormal(face)` | Keeps up when it is still perpendicular, otherwise uses the old normal as up, otherwise canonical |

`QuarterTurn` holds `DEGREES_0`, `DEGREES_90`, `DEGREES_180` and `DEGREES_270`. Only frames with a vertical normal support all four. For wall frames, `coherentFor(frame)` folds 90 and 270 onto 0 and 180. `clockwiseFor(frame)` and `counterClockwiseFor(frame)` step within supported turns.

## AxisPermutation

`AxisPermutation` is one of the 48 signed permutations of the world axes: 24 rotations and 24 reflections. It is the linear part of every portal map.

| Factory | Result |
|---|---|
| `AxisPermutation.between(from, to)` | Maps `from`'s right, up and normal onto `to`'s |
| `AxisPermutation.mirror(plane, turns)` | Reflects across the plane and turns the image by the quarter turns the plane supports |
| `AxisPermutation.of(imageOfEast, imageOfUp, imageOfSouth)` | Any perpendicular triple |
| `AxisPermutation.ofIndex(index)` | By stable index 0..47; `IDENTITY` is 0 |

`face(face)`, `axis(axis)`, `vectorInto(x, y, z, out3)` and `cellInto(x, y, z, out3)` apply it. `reflects()` is true for the 24 reflections, `flipsWorldUp()` when +Y lands on `D`, `quarterTurnsClockwise()` gives the horizontal turn, `rotation16(rotation)` maps a 16-step block rotation, and `compose(inner)` and `inverse()` combine permutations.

## OpticTransform

`OpticTransform` is the rigid map between two portals: an `AxisPermutation` anchored at a source point and a target point. It is exact on cells, so block coordinates round-trip without drift.

| Factory | Result |
|---|---|
| `OpticTransform.between(fromFrame, fromOrigin, toFrame, toOrigin)` | Carries the space in front of one portal behind the other |
| `OpticTransform.mirror(plane, origin, turns)` | A mirror on the plane |
| `OpticTransform.translation(tx, ty, tz)`, `OpticTransform.of(permutation, tx, ty, tz)` | Explicit parts |
| `OpticTransform.decode(bytes)` | The 25-byte form written by `encode()`: one permutation index and three doubles |

| Method | Result |
|---|---|
| `point(v)`, `pointInto(...)`, `snappedPointInto(...)` | Map a position; the snapped form rounds values within floating-point noise of an integer |
| `vector(v)`, `face(face)`, `axis(axis)`, `frame(frame)` | Map directions and frames |
| `cell(key)`, `cellInto(x, y, z, out3)`, `box(blockBox, margin)`, `box(box)` | Map whole cells and boxes |
| `look(look)`, `yaw(yaw)` | Map a view direction through `LookTransfer` |
| `compose(inner)`, `inverse()` | Combine and invert |
| `normalized()`, `cellAligned()` | Re-anchor at the origin, or round the translation to whole cells |
| `isTranslation()`, `isIdentity()`, `reflects()`, `flipsWorldUp()`, `quarterTurnsClockwise()` | Properties of the linear part |

## Similarity

`Similarity` is an `OpticTransform` plus a uniform positive scale about the anchor pair. `Similarity.between(fromFrame, fromOrigin, toFrame, toOrigin, scale)` and `Similarity.of(rigid, scale)` build it, and [`PortalDefinition.toward`](/optics/04-portals) returns one. `point` scales the offset from the source anchor, `vector` scales lengths, `direction` only rotates, and `look` goes through the rigid part. `inverse()` divides the scale, `compose(inner)` multiplies it, and `isRigid()` is true at scale 1.

## Affine

`Affine` is a general 3×4 matrix: rotation, scale, shear, reflection and translation in one object. Use it for animation, rendering and anything an `OpticTransform` cannot express.

| Factory | Result |
|---|---|
| `Affine.translation(...)`, `scale(...)`, `shear(...)`, `reflection(axis)`, `reflection(planeNormal, planePoint)` | Elementary transforms |
| `Affine.rotation(quaternion)`, `rotation(axis, radians)`, `rotation(eulerAngles)` | Rotations about the origin |
| `Affine.trs(translation, rotation, scale)` | Scale, then rotate, then translate |
| `Affine.about(pivot, local)` | `local` applied around `pivot` instead of the origin |
| `Affine.lookAt(eye, target, up)` | A camera placement |
| `Affine.of(opticTransform)`, `Affine.of(similarity)` | The portal maps as matrices |
| `Affine.of(m00 ... m23)` | Twelve row-major elements |

| Method | Result |
|---|---|
| `compose(inner)`, `then(outer)`, `inverse()` | `a.compose(b)` applies `b` first; `inverse()` rejects a singular matrix |
| `point`, `vector`, `normal`, `box`, `frame` | Map geometry. `frame` snaps the mapped normal and up to faces and rejects a map that folds them onto one axis |
| `decompose()` | `Decomposition(translation, rotation, scale, shear)`; `affine()` rebuilds it and `lerp` blends two decompositions |
| `lerp(to, t)` | Blends through the decomposition, so rotations interpolate as rotations |
| `rigid(tolerance)` | The `OpticTransform` this matrix equals, or `null` when its axes do not land on signed world axes |
| `isRigid(tolerance)`, `reflects()`, `determinant()`, `isIdentity()`, `isFinite()` | Properties |
| `columnMajor16(out16)`, `rowMajor12(out12)` | Export for graphics APIs |

## Quaternion and EulerAngles

`Quaternion(x, y, z, w)` is a rotation. Factories: `axisAngle(axis, radians)`, `axisAngleDegrees(axis, degrees)`, `euler(eulerAngles)`, `fromTo(from, to)` for the shortest arc, `lookAlong(forward, up)`, `of(axisPermutation)` for the 24 rotations (reflections are rejected) and `between(fromFrame, toFrame)`. Methods: `multiply`, `rotate`, `rotateInto`, `conjugate`, `inverse`, `normalize`, `slerp`, `nlerp`, `angle`, `axis`, `euler(order)`, `affine()`, and `permutation(tolerance)`, which returns the nearest axis permutation when the rotation lies within the tolerance of one and `null` otherwise.

`EulerAngles(x, y, z, order)` holds degrees applied in the intrinsic `EulerOrder` (`XYZ`, `XZY`, `YXZ`, `YZX`, `ZXY`, `ZYX`). `EulerAngles.yawPitchRoll(yaw, pitch, roll)` converts Minecraft's look convention to `YXZ` angles, `quaternion()` builds the rotation, and `wrapped()` folds every component into -180..180.

## LookTransfer

`LookTransfer.of(look, permutation)`, `of(look, opticTransform)` and `of(look, similarity)` return mapped yaw, pitch and roll. The map carries both forward direction and camera screen-up.

When forward becomes vertical, pitch snaps to `90` or `-90`. Yaw comes from mapped screen-up, which preserves heading through floor and ceiling transitions. Roll describes the remaining tilt relative to the mapped forward direction's natural up.

`hasRoll(toleranceDegrees)` tests that tilt. `of(forward, up)` resolves raw vectors, `cameraUp(yaw, pitch)` supplies screen-up, and `look()` returns yaw/pitch without roll.

`ArrivalOrientation` and `PoseTransform` apply orientation rules to a complete pose, including position history, velocity and head/body angle history. The optional upright flip carries forward and screen-up together. See [05 - Apertures and Crossing](/optics/05-apertures-and-crossing#arrival-rules).

## Which one to use

| Need | Type |
|---|---|
| Where a block or entity in front of portal A appears behind portal B | `OpticTransform.between`, or `PortalDefinition.toward` |
| The same pair when the portals differ in size | `Similarity` |
| A mirror portal | `OpticTransform.mirror` or `ViewWindow.mirror` |
| Spin, scale or shear a portal view over time | `Affine`, driven by an [animation track](/optics/03-animation) |
| Describe or interpolate a rotation | `Quaternion`; `EulerAngles` to read or write it as angles |
| Snap a free rotation back to block axes | `Quaternion.permutation(tolerance)` or `Affine.rigid(tolerance)` |
| Carry a view direction through a portal | `LookTransfer`, or `PoseTransform.arrive` for the full pose |

## ViewWindow and transform direction

`ViewWindow` stores a display transform with its local and remote origins, frames, side, mirror flag and depth. `between(...)` maps remote content into local display space. `toward()` returns its inverse, from local space toward the destination. `mirror(...)` creates a reflected window, and `withDepth(value)` changes the depth.

This direction differs from a travel map created by `PortalDefinition.toward`. Use the display map for drawing destination content. Use the travel map for crossing or sampling destination coordinates.

## Free render geometry and block-aligned definitions

`Affine` supports arbitrary-angle rotation, independent axis scale and shear. It does not update a portal's definition, aperture cells, registry or crossing tests. The host must apply it to render geometry or sampled scene content.

`Affine.scale` can produce a singular matrix, including a zero scale. Such a matrix can map points and supports degenerate decomposition, but `inverse()` rejects it. `normal()` uses cofactors and returns zero when the transformed normal collapses. Use positive scale when the host needs an inverse.

Quaternion interpolation follows the shorter rotation arc. `normalize` and `isNormalized(tolerance)` let a consumer check a rotation before reuse. `angle()` uses radians. `permutation(tolerance)` and `rigid(tolerance)` recognize cardinal transforms within a numerical tolerance.

`LookTransfer.onBranchOf(reference)` selects an equivalent camera-angle branch near a reference. `PoseTransform` uses this to preserve continuity across current and previous pose angles. `PoseTransform.arrivalRoll(...)` reports the arrival camera roll separately from the yaw/pitch pose.
