---
title: "Math and Host Interfaces"
description: "Optics vectors, colors, bounds, packed cells and platform scheduling, metrics and scale hooks"
published: true
date: 2026-10-11T16:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-11T16:00:00.000Z
---

Math helpers define positions, colors, bounds and coordinate keys without platform types. Host interfaces connect Optics to scheduling, metrics and entity scale. Implement these contracts with the ownership rules of the target platform.

## Vectors

| Type | Operations |
|---|---|
| `Vec3d` | Add, subtract, scalar/component multiply, negate, dot, cross, normalize, lengths, distance and lerp |
| `Vec2d` | Add, subtract, scalar multiply, dot, scalar cross, normalize, lengths, distance, lerp, radians rotation and perpendicular |

`Vec3d` supplies `ZERO`, `UNIT_X`, `UNIT_Y`, `UNIT_Z`, `of(double[])` and `into(out3)`. `component(axis)` reads a world axis. `blockX`, `blockY` and `blockZ` floor coordinates to cell positions, including negative coordinates. `isFinite()` checks all components.

`Vec2d` uses `u` and `v`, with `ZERO` as its origin. Both vector types return new records. Their zero-vector normalization leaves a zero vector.

## Faces, axes and look

`Face` names `U`, `D`, `N`, `S`, `E` and `W`. It supplies integer components, axis index, sign, vector, reverse, vertical status and byte conversion. `closest` selects the dominant cardinal direction.

`Axis` names `X`, `Y` and `Z`. Its component helpers read a coordinate by axis index. `positive()` and `negative()` return unit vectors.

`Angles.direction(yaw, pitch)` maps Minecraft yaw/pitch into a vector. `look`, `yaw` and `pitch` perform the inverse. `directionInto` writes to a supplied array, and `Angles.Look.of(direction)` creates a look record.

`rotateYaw` rotates yaw or a vector around the vertical axis. `unwrap(angle, reference)` selects an equivalent angle near a reference. `reflect(vector, normal)` reflects a vector about a supplied normal.

Use [LookTransfer](/optics/01-frames-and-transforms#looktransfer) when the portal map can alter pitch or roll. A yaw-only turn cannot represent every frame mapping.

## Colors

`Rgba(red, green, blue, alpha)` stores float channels. `WHITE`, `BLACK` and `TRANSPARENT` supply common values.

| Method | Use |
|---|---|
| `rgb(int)`, `argb(int)` | Read packed colors |
| `rgb()`, `argb()` | Write packed colors |
| `hsv(hue, saturation, value, alpha)` | Construct a color in HSV space |
| `hue`, `saturation`, `value` | Inspect HSV components |
| `withAlpha`, `clamped`, `premultiplied` | Replace alpha, clamp channels or multiply RGB by alpha |
| `lerp`, `lerpHsv` | Interpolate RGBA or HSV with a shorter hue path |

Construction and interpolation can produce channels outside 0..1. Call `clamped()` when the host output requires bounded channels. Match premultiplied or straight alpha to the host renderer's blend convention.

## Bounds

`Box` is a mutable floating-point axis-aligned box. Its constructor groups bounds by axis: `(xa, xb, ya, yb, za, zb)`. A copy constructor avoids sharing a box that the consumer will expand.

`encapsulate` expands bounds around another box, coordinates or points. `contains`, `containsPrimitive`, `intersects`, `getFace`, `getThinAxis`, `center`, `min`, `max`, dimensions and `volume` support geometric queries. `random(randomGenerator)` samples a point.

`BlockBox(minX, minY, minZ, sizeX, sizeY, sizeZ)` stores integer bounds and non-negative sizes. `EMPTY` has zero extent. `spanning` accepts inclusive minimum/maximum coordinates, while `maxX`, `maxY` and `maxZ` report inclusive maxima.

`cells()` uses a long count. `contains`, `isEmpty`, center coordinates and `union` support spatial operations. `index(x, y, z)` uses Z as the fastest axis, followed by Y and then X.

`Bounds2` supplies shape-plane bounds. See [02 - Shapes](/optics/02-shapes#planetransform-and-bounds2). Coordinate bounds, cell counts and section bounds are different representations. Use explicit conversion before indexing content.

## Packed cell keys

`CellKeys.pack(x, y, z)` uses a 64-bit key with 26 bits each for X/Z and 12 bits for Y. Signed ranges are -33554432..33554431 for X/Z and -2048..2047 for Y. Values outside those bit widths wrap rather than retain their original coordinates.

`unpackX`, `unpackY` and `unpackZ` recover signed cell coordinates. `chunkKey`, `chunkX` and `chunkZ` address two-dimensional chunk columns. `sectionKey` packs three section coordinates for consumers that use that key space.

Keys do not contain a world id. Keep world identity in a separate map or request context. Do not mix cell, chunk and section key formats.

## Scheduling

`OpticsScheduler<O, W>` exposes the following host services:

| Method | Contract |
|---|---|
| `runForObserver(observer, task)` | Submit observer-owned work and report whether it was accepted |
| `runForRegion(world, chunkX, chunkZ, task)` | Submit region-owned work and report acceptance |
| `compute()` | Return the executor for non-world computation |
| `schedule(task, delayMillis)` | Submit delayed work and report acceptance |
| `tick()` | Return the host tick clock |

On Folia, use entity scheduling for observer state and region scheduling for chunk-bound world state. On a modded logical server, marshal authoritative mutations to the server thread. Capture immutable content before worker computation.

Do not read live entity, inventory or world state from `compute()` jobs. A `false` return means the adapter did not accept the scheduled work. Handle that result in host lifecycle code.

Optics does not select a global scheduler or load one through services. The host supplies it to the components that need it.

## Metrics

`OpticsMetrics.failure(reason)`, `packet()` and `count(key, delta)` report host metrics. `nanoTime()` supplies the timing clock used by metric-aware consumers.

`OpticsMetrics.none()` ignores counters and failures while retaining a nanosecond clock. Supply an implementation when the host needs diagnostic counters. Metric callbacks do not replace failure logging in the host adapter.

## Entity scale

`ScaleAccess<E>` reads the current and default scale, writes a factor, and resets it. Write/reset return whether the host applied the action.

Use this interface with [ScaleRule](/optics/05-apertures-and-crossing#size-ratio-and-traveller-scale). The scale rule computes a factor. The adapter applies the platform attribute or equivalent state on the owning thread.

A platform can reject scale changes. Preserve that result in the host's travel policy instead of treating a computed factor as proof of an applied change.
