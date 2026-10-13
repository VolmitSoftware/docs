---
title: "Portals"
description: "Create, link, update, and query portal definitions across worlds"
published: true
date: 2026-10-13T16:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

`PortalDefinition` describes one portal. `PortalLink` connects it to another or makes it a mirror. `PortalRegistry` stores portals across worlds and answers geometric queries. These objects have no platform dependencies.

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

| Derived view | Meaning |
|---|---|
| `origin()`, `center()` | Center of the rectangle on the crossing plane |
| `area()` | Cell bounds as a `Box` |
| `width()`, `height()` | Column and row counts as doubles |
| `planeShape()` | Fitted shape |
| `aperture()` | Open-cell `ApertureCells` |
| `affine()` | Map from the -1..1 unit square onto the portal plane |
| `source(frontSide, depthBlocks)` | Projection descriptor source |
| `sizeRatio(destination)` | Destination/source size ratio |
| `toward(destination, frontSide)` | Travel `Similarity`, including link scale |

A portal needs 1..65535 cells per edge and at most 1048576 cells total. Its shape must leave at least one raster cell open. The constructor rejects invalid size, offset, self-link or empty aperture with `IllegalArgumentException`.

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
| `flipped()` | Swap front and back while preserving the aperture in world space |
| `scaled(factor)`, `scaled(factorU, factorV)` | Multiply the cell counts (rounded, at least 1) around the centre |
| `resized(columns, rows)`, `stretched(dColumns, dRows)` | Set the counts around the centre, or grow them along the frame's right and up |
| `withShape(descriptor)`, `withShape(text)`, `shapeRotated(degrees)`, `shapeScaled(factor)`, `mirroredU()`, `mirroredV()` | Change the mask |
| `withPlaneOffset(blocks)` | Move the crossing plane |
| `linked(link)`, `unlinked()` | Change the link |
| `withMetadata(key, value)`, `withoutMetadata(key)` | Change host data |
| `transformed(opticTransform)` | Apply a rigid map to the frame, position and aperture shape, including reflections |

### Queries

| Query | Result |
|---|---|
| `containsCell(x, y, z)` | Whole-cell raster membership |
| `containsPoint(point, planeTolerance)` | Open raster cell and exact shape containment within plane tolerance |
| `cellCoordinates(x, y, z, out2)` | Point column and row |
| `crossing(start, end, velocity, look)` | Open-plane segment crossing or `null` |

`PortalCrossing` carries the intersection column, row, fraction and `point()`. Its `PlaneCrossing` carries the viewed frame, segment endpoint, velocity, look and entered side. Null velocity uses segment displacement. Null look uses that motion.

## PortalLink

```java
PortalLink to = PortalLink.to(hub.id());
PortalLink mirror = PortalLink.mirror(QuarterTurn.DEGREES_90);
PortalLink scaled = to.withScale(ScaleRule.ratio(0.25, 4.0));
```

A link names a `target` id or is a `mirror` with `mirrorTurns`, and carries the travel rules: `orientation` (`OrientationRule.FRAME` by default), `momentum` (preserve by default) and `scale` (`ScaleRule.OFF` by default). `ScaleRule.motion()` maps position and velocity by the size ratio. `ScaleRule.ratio(min, max)` also changes the traveller's size, clamped to the bounds, which themselves lie within 0.0625..16. `SizeRatio.between(frameA, columnsA, rowsA, frameB, columnsB, rowsB)` divides the destination's cells by the source's along each axis of the map and keeps the smaller ratio, with `exact()` true when both agree.

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

`portal.source(frontSide, depthBlocks)` feeds `ApertureDescriptor.fromPortal`. `portals.directory()` supplies endpoint lookup for scanning, recursion and plate capture.

`portal.toward(destination, frontSide)` supplies a travel map. `PoseTransform.apply` maps a complete pose. `PoseTransform.arrive` also applies orientation and momentum policies. Apply an entity scale factor separately through the host.

`Affine.of(similarity)` converts the map for render or animation use. See [05 - Apertures and Crossing](/optics/05-apertures-and-crossing) and [06 - Projection and Visibility](/optics/06-projection-and-visibility).

## Size, rotation and motion limits

Definitions use whole cell counts and cardinal `Frame` axes. `rotated` and `rotatedAbout` accept `QuarterTurn`, not an arbitrary angle. `centeredAt` and `transformed` snap placement to integer origin cells. A requested center can therefore differ from `center()`.

`scaled(factorU, factorV)` scales the frame's right and up dimensions. It rounds each dimension to the nearest cell and retains at least one cell. `resized` rejects a zero dimension. `stretched` retains at least one cell and grows toward the frame's right and up.

`shapeRotated(degrees)` supports arbitrary mask rotation inside the block-aligned rectangle. It does not rotate the crossing plane. `shapeScaled` changes the mask rather than the rectangle, and the result must retain an open raster cell.

To move a definition, call a change method and publish the result through `PortalRegistry.update`. The registry stores the new definition and advances its revisions. These calls do not move blocks, entities or a rendered image in a host application.

For fractional size and continuous movement, animate a separate [Affine render transform](/optics/03-animation#grow-from-small-to-big-then-vanish). Hide or remove the host's render object when the effect ends. Do not represent disappearance with a zero-sized definition or an empty aperture mask.

A direct link cannot target the definition's own id. Use `PortalLink.mirror` for a self-reflection. Construct a `PortalLink` record to set orientation or momentum rules, and use `withScale` to replace its scale policy.
