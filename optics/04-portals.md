---
title: "Portals"
description: "Optics documentation: PortalDefinition, PortalBuilder, PortalLink, PortalRegistry and crossing queries"
published: true
date: 2026-10-08T12:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

The `portal` package is the gateway API: a `PortalDefinition` describes one portal, a `PortalLink` connects it to another or makes it a mirror, and a `PortalRegistry` holds the portals of any number of worlds and answers geometric queries. It depends on nothing outside Optics, so the same objects drive a server, a client or a test.

## PortalDefinition

A definition is immutable and keeps its `UUID` through every change.

| Part | Meaning |
|---|---|
| `frame()` | The `Frame` of the front face |
| `originX()`, `originY()`, `originZ()` | The cell at the rectangle's corner with the smallest coordinates |
| `columns()`, `rows()` | Cells along the canonical right and up of the frame's normal. For a floor or ceiling portal columns run along X and rows along Z |
| `planeOffset()` | Blocks the crossing plane sits from the cell centres along the normal; `0` puts it through the middle of the cells |
| `shape()` | The `ShapeDescriptor` masking the rectangle, `ShapeDescriptor.FULL` by default |
| `link()` | A `PortalLink`, or `null` for an unlinked portal |
| `metadata()` | An immutable string map for the host's own keys |

Derived views: `origin()` and `center()` are the centre of the rectangle on the plane, `area()` is the cell `Box`, `width()` and `height()` are the counts as doubles, `planeShape()` is the fitted [shape](/optics/02-shapes), `aperture()` is the `ApertureCells` holding the open cells, `affine()` maps the unit square -1..1 onto the portal plane, `source(frontSide, depthBlocks)` is the `ApertureDescriptor.Source` the projection packages read, `sizeRatio(destination)` compares two portals, and `toward(destination, frontSide)` is the `Similarity` that carries space in front of this portal behind the destination, including the link's travel scale.

A portal needs 1 to 65535 cells per edge and at most 1048576 cells in total, and its shape must leave at least one cell open; the constructor throws `IllegalArgumentException` otherwise.

### Building one

```java
PortalDefinition gate = PortalDefinition.builder()
    .facing(Face.N)
    .center(new Vec3d(0.5, 65.5, 10.5))
    .size(3, 3)
    .shape("circle")
    .build();
```

| Builder call | Effect |
|---|---|
| `id(uuid)` | A fixed id; otherwise a random one |
| `frame(frame)`, `frame(normal, up)`, `facing(normal)` | The frame; `facing` uses `Frame.canonical` |
| `origin(x, y, z)` or `center(vec)` | Place by corner cell or by centre point; the later call wins and one is required |
| `size(columns, rows)` | Default 1×1 |
| `planeOffset(blocks)` | Default 0 |
| `shape(descriptor)`, `shape(text)` | Default full |
| `link(link)`, `linkTo(uuid)`, `mirror(turns)` | The initial link |
| `metadata(key, value)` | Host data |

`PortalDefinition.builder(existing)` starts from a copy of another definition.

### Changing one

Every operation returns a new definition with the same id, or the same instance when nothing changes.

| Operation | Effect |
|---|---|
| `moved(dx, dy, dz)`, `movedTo(x, y, z)`, `centeredAt(center)` | Relocate the cells |
| `rotated(turns)` | Turn the frame clockwise about its normal around the centre; a non-square portal swaps its column and row counts as needed |
| `rotatedAbout(axis, turns)` | Turn the whole portal, frame and position, around its centre |
| `facing(normal)` | Point the front another way, keeping the centre |
| `flipped()` | Swap front and back; the plane stays where it was |
| `scaled(factor)`, `scaled(factorU, factorV)` | Multiply the cell counts (rounded, at least 1) around the centre |
| `resized(columns, rows)`, `stretched(dColumns, dRows)` | Set the counts around the centre, or grow them along the frame's right and up |
| `withShape(descriptor)`, `withShape(text)`, `shapeRotated(degrees)`, `shapeScaled(factor)`, `mirroredU()`, `mirroredV()` | Change the mask |
| `withPlaneOffset(blocks)` | Move the crossing plane |
| `linked(link)`, `unlinked()` | Change the link |
| `withMetadata(key, value)`, `withoutMetadata(key)` | Change host data |
| `transformed(opticTransform)` | Apply a rigid map to frame and position |

### Queries

`containsCell(x, y, z)` tests a whole cell against the raster, `containsPoint(point, planeTolerance)` tests a point against the exact shape, `cellCoordinates(x, y, z, out2)` gives the column and row of a point, and `crossing(start, end, velocity, look)` returns a `PortalCrossing` when the segment passes through an open part of the plane, or `null`. The crossing carries the `PlaneCrossing` (frame view, hit point, motion, look and which side was entered), the `column` and `row` of the hit, the `fraction` along the segment and `point()`.

## PortalLink

```java
PortalLink to = PortalLink.to(hub.id());
PortalLink mirror = PortalLink.mirror(QuarterTurn.DEGREES_90);
PortalLink scaled = to.withScale(ScaleRule.ratio(0.25, 4.0));
```

A link names a `target` id or is a `mirror` with `mirrorTurns`, and carries the travel rules: `orientation` (`OrientationRule.FRAME` by default), `momentum` (preserve by default) and `scale` (`ScaleRule.OFF` by default). `ScaleRule.motion()` maps position and velocity by the size ratio; `ScaleRule.ratio(min, max)` also changes the traveller's size, clamped to the bounds, which themselves lie within 0.0625..16. `SizeRatio.between(frameA, columnsA, rowsA, frameB, columnsB, rowsB)` divides the destination's cells by the source's along each axis of the map and keeps the smaller ratio, with `exact()` true when both agree.

## PortalRegistry

`PortalRegistry<W>` is generic in the world key, so the host decides what identifies a world.

```java
PortalRegistry<String> portals = new PortalRegistry<String>();
portals.add("overworld", gate);
portals.add("overworld", hub);
portals.link(gate.id(), hub.id());
portals.update(hub.id(), p -> p.rotated(QuarterTurn.DEGREES_90).flipped().scaled(2.0).withShape("flower(petals=6)"));

PortalCrossing hit = portals.firstCrossing("overworld", from, to, null, null);
if (hit != null) {
    PortalDefinition destination = portals.destination(hit.portal());
    Similarity toward = hit.portal().toward(destination, hit.crossing().frontSide());
}
```

| Method | Effect |
|---|---|
| `add(world, portal)` | Adds, or replaces the portal with that id (moving it between worlds when needed); returns the previous definition or `null` |
| `remove(id)`, `get(id)`, `world(id)`, `contains(id)`, `size()` | Lookup |
| `all()`, `in(world)` | Immutable snapshots, cached until the next change |
| `update(id, change)` | Applies a function to the current definition; the result must keep the id |
| `link(from, to)`, `linkOneWay(from, to)` | Connect two portals both ways or one way, keeping each side's existing rules |
| `unlink(id)` | Removes the portal's link and every link that targets it |
| `mirror(id, turns)` | Makes the portal a mirror |
| `destination(portal)` | The linked portal, the portal itself for a mirror, or `null` |
| `at(world, point, planeTolerance)` | The nearest portal whose open shape contains the point within the tolerance; the `out` overload collects all of them |
| `firstCrossing(world, start, end, velocity, look)` | The earliest crossing along a segment, or `null` |
| `crossings(world, start, end, velocity, look, out)` | Every crossing, ordered by fraction |
| `visible(world, eye, look, fovDegrees, range, out)` | Portals within range whose centre lies inside the field of view |
| `intersecting(world, box, out)` | Portals whose cells overlap the box |
| `revision()`, `revision(id)` | Counters that advance on every change |
| `addListener(listener)`, `removeListener(listener)` | `added`, `removed` and `changed(world, previous, current)` callbacks |
| `directory()` | A `PortalDirectory`, the `EndpointDirectory` adapter the scan, recursion and plate packages consume. A portal is eligible when it is a mirror or its destination is present, and `travelScale` follows the link's scale rule |

Queries that take an `out` list append to it and return how many entries they added. The registry indexes portals by chunk column per world, so a query touches only the portals near its point, segment or box.

## From a definition to a projection

`portal.source(frontSide, depthBlocks)` feeds `ApertureDescriptor.fromPortal(...)`, the geometry record every scan, plate and ClientView stream starts from, and `portals.directory()` lets `RecursiveEndpoints`, `CellScan` and the plate pipeline resolve destinations and nested views. `portal.toward(destination, frontSide)` is the map a traveller or a camera follows: `PoseTransform.apply(pose, similarity)` moves a full pose through it, and `PoseTransform.arrive(...)` applies the link's orientation, momentum and scale rules on top. `Affine.of(similarity)` lifts the same map into the matrix form the [animation tracks](/optics/03-animation) work with.
