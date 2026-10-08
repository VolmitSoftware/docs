---
title: "Shapes"
description: "Optics documentation: aperture shape masks, fit modes, presets, the text grammar and the raster, mesh and outline outputs"
published: true
date: 2026-10-08T12:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

A shape is a two-dimensional mask laid over a portal's rectangle of cells. Optics defines shapes in a unit space, fits them to a column and row count, and derives three things from the fit: a raster that says which whole cells are open, a mesh that draws the exact edge, and outlines for effects that follow the boundary. The same shape text is accepted by Wormholes' [aperture shape](/wormholes/04-portal-types-menus-settings#aperture-shape) menu and commands.

## Unit space

Shapes live on a `u`, `v` plane centred on the origin. `Shapes.FULL` is the 2×2 rectangle covering -1..1 on both axes, and the presets are sized to fit inside it: a `circle` has radius 1 and a `star` reaches 1 at its points. `u` runs along the portal frame's right and `v` along its up, so a shape stays upright when the frame rotates.

`Shape` exposes `bounds()`, `contains(u, v)`, `signedDistance(u, v)` (negative inside, zero on the edge) and `outlines(tolerance)`. Every shape also has `union`, `intersect`, `subtract`, `transformed(planeTransform)`, `rotated(degrees)`, `scaled(factor)`, `scaled(u, v)`, `translated(du, dv)`, `flippedU()` and `flippedV()`, each returning a new shape.

## Presets

Factories live on `Shapes`; the grammar names, argument order and defaults are below.

| Grammar | Java | Arguments and defaults | Limits |
|---|---|---|---|
| `full` | `Shapes.FULL` | none | the whole rectangle |
| `rectangle` | `Shapes.rectangle(width, height)` | `width=2`, `height=2` | each in 0..4 |
| `rounded` | `Shapes.roundedRectangle(width, height, radius)` | `width=2`, `height=2`, `radius=0.25` | radius 0..half the shorter side |
| `circle` | `Shapes.circle(radius)` | `radius=1` | 0..2 |
| `ellipse` | `Shapes.ellipse(radiusU, radiusV)` | `radiusU=1`, `radiusV=1` | each 0..2 |
| `polygon` | `Shapes.regularPolygon(sides, radius, rotation)` | `sides=6`, `radius=1`, `rotate=0` | 3..64 sides |
| `polygon` | `Shapes.polygon(points)` | `points=u:v;u:v;...` | 3..512 points |
| `star` | `Shapes.star(points, outer, inner, rotation)` | `points=5`, `outer=1`, `inner=0.45`, `rotate=0` | 3..32 points, inner below outer |
| `flower` | `Shapes.flower(petals, radius, depth, rotation)` | `petals=5`, `radius=1`, `depth=0.6`, `rotate=0` | 2..32 petals, depth 0..1 |
| `heart` | `Shapes.heart(size)` | `size=1`, `rotate=0` | size 0..2 |
| `feather` | `Shapes.feather(length, width, curve)` | `length=2`, `width=1`, `curve=0.25`, `rotate=0` | curve -1..1 |
| `ring` | `Shapes.ring(outer, inner)` | `outer=1`, `inner=0.6` | inner below outer |
| `spline` | `Shapes.spline(points)` | `points=u:v;...`, `segments=8` | 3..256 control points, 2..32 segments per span |
| `path` | `Shapes.path()` builder | `d=` commands | up to 512 segments |

`Shapes.presetNames()` lists the names the grammar accepts, for command completion. `rotate` arguments are degrees counter-clockwise in unit space. Extents are exclusive of 0.

## Fit modes

`FitMode` decides how the unit square meets a `columns × rows` rectangle. The shape's centre always lands on the rectangle's centre.

| Mode | Unit square becomes |
|---|---|
| `CONTAIN` | The largest centred square that fits, `min(columns, rows)` cells wide. Default for every shape except `full` |
| `COVER` | A centred square `max(columns, rows)` cells wide, so the shape overflows the shorter side |
| `STRETCH` | The whole rectangle, scaling each axis independently. Default for `full` |

`ShapeDescriptor` pairs a shape with its fit. `ShapeDescriptor.of(shape, fit)`, `ShapeDescriptor.parse(text)`, `withFit(fit)` and `fitTo(columns, rows)` build and apply it; `ShapeDescriptor.FULL` is the full rectangle.

## Text grammar

`ShapeDescriptor.parse(text)` reads a shape with an optional fit. `Shapes.parse(text)` reads a bare shape and rejects `@fit`. `Shapes.format(shape)` and `descriptor.format()` write the canonical text back, and parsing that text yields an equal descriptor.

| Form | Meaning |
|---|---|
| `name` or `name(args)` | A preset. Arguments are positional in the table order above, or keyed `name=value`; keyed arguments follow positional ones and names ignore case |
| `u:v;u:v;u:v` | A point list, used by `polygon(points=...)` and `spline(points=...)` |
| `path(d=M u:v L u:v Q cu:cv;u:v C c1u:c1v;c2u:c2v;u:v Z)` | Move, line, quadratic and cubic segments; every subpath closes with `Z` |
| `a+b`, `a&b`, `a-b` | Union, intersection and difference, left to right; parentheses group |
| `@rotate(degrees)` | Rotate the preceding shape |
| `@scale(f)`, `@scale(u,v)` | Scale uniformly or per axis |
| `@offset(du,dv)` | Translate in unit space |
| `@flipU`, `@flipV` | Mirror across an axis |
| `@transform(a,b,c,d,tu,tv)` | An explicit plane transform |
| `@fit(contain\|cover\|stretch)` | The fit mode: once, at the end, only through `ShapeDescriptor.parse` |

Modifiers chain and apply in the order written. Numbers accept a leading `-`, decimals and exponents, and whitespace is ignored. Errors name the position in the text, for example `Unknown argument 'radius' at position 5 in "star(radius=2)"`.

```
circle
circle(0.8)
polygon(sides=8)@rotate(22.5)
star(points=6,outer=1,inner=0.5)
ring(outer=1,inner=0.7)+rectangle(width=0.3,height=2)
heart-circle(radius=0.3)@offset(0,0.2)
(circle&rectangle(width=2,height=1))@fit(stretch)
polygon(points=0:1;0.95:0.31;0.59:-0.81;-0.59:-0.81;-0.95:0.31)
path(d=M -1:-1 L 1:-1 L 0:1 Z)
```

## Encoding and limits

`descriptor.encode()` writes a compact binary form and `ShapeDescriptor.decode(bytes)` reads it; an empty array decodes to `FULL`. Descriptors compare equal when their bytes match. The encoding bounds every shape: at most 2048 bytes, 64 nodes, a nesting depth of 8 and 512 points in total. `nodeCount()`, `depth()`, `pointCount()` and `encodedSize()` report where a descriptor stands.

## Outputs

`PlaneShape.fit(shape, fit, columns, rows)` or `fit(..., frameOrientation)` places a shape over a rectangle; [`PortalDefinition`](/optics/04-portals) and `ApertureDescriptor` do this for you. In plane space one unit is one cell and the origin is the rectangle's corner.

| Type | What it gives |
|---|---|
| `PlaneShape` | `contains(column, row)` exact containment, `signedDistance(column, row)` in cells, `unitCoordinates`, `outlines(toleranceCells)`, `raster(subsamples)`, `mesh(subdivisions, cellMask)`, `isFull()` |
| `ShapeRaster` | Which whole cells are open. Each cell is sampled on a `subsamples × subsamples` grid (1..8, default 4) and counts as inside when at least `threshold` (default 0.5) of its samples are. `coverage(column, row)` is `EMPTY`, `PARTIAL` or `FULL`; `inside`, `insideCount`, `insideMask`, `intersect(cellMask)` and `cells(...)` turn the mask into block positions |
| `ShapeMesh` | Triangles for drawing the exact edge: `positions()` in cell units, a signed `distances()` value per vertex, `indices()`, `outlines()` and `bounds()`. Subdivisions run 1..16 per cell. The mesh follows the signed distance by marching squares, so a curve stays smooth where the raster steps, and cells outside `cellMask` are left out |
| `Outline` | A closed polyline. Presets, polygons, splines and paths emit outer boundaries counter-clockwise and holes clockwise. `size`, `u(i)`, `v(i)`, `signedArea`, `length`, `bounds`, `contains`, `distance`, `reversed`, `transformed` and `sample(spacing, out)` for evenly spaced points |
| `ShapeRasterCache` | A bounded least-recently-used cache of plane shapes, rasters and meshes keyed by descriptor, size, orientation and detail; `hits()` and `misses()` count lookups |

A shape that leaves no cell open is invalid for a portal: `PortalDefinition` rejects it, and Wormholes refuses it in the menu and command.
