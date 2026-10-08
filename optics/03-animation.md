---
title: "Animation"
description: "Optics documentation: easing, clips, tracks, timelines, time sources and the animator"
published: true
date: 2026-10-08T12:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

The animation package samples values by time. A `Clip<T>` turns seconds into a value, a `Timeline` groups typed clips with named markers, and an `Animator` plays a timeline against a `TimeSource`. Nothing here renders or schedules; the host reads values when it draws.

## Easing

`Easing` implements `EasingFunction` (`apply(t)` on 0..1) with `LINEAR`, `SMOOTH_STEP`, `SMOOTHER_STEP` and the `IN`, `OUT` and `IN_OUT` forms of `SINE`, `QUAD`, `CUBIC`, `QUART`, `QUINT`, `EXPO`, `CIRC`, `BACK`, `ELASTIC` and `BOUNCE`. `Easing.steps(count)` holds each step, `Easing.cubicBezier(x1, y1, x2, y2)` is the CSS curve, and `Easing.parse(name)` accepts any case with `-` or `_`. Any easing can be `reversed()` or `mirrored()`, which eases in over the first half and out over the second.

## Clips

| Clip | Value at time `t` |
|---|---|
| `Constant.of(value, duration)` | `value`; the duration may be infinite |
| `Tween.of(from, to, duration, easing, interpolator)` | `from` blended to `to` by `easing(t / duration)`; `Tween.of(double, double, duration, easing)` uses `Interpolators.doubles()` |
| `Track.of(interpolator, keyframes)` | Piecewise: between two keyframes the later keyframe's easing shapes the blend. Times must be distinct, `with(keyframe)` replaces or adds one, and the first value holds before the first keyframe |
| `Sequence.of(clips)` | The clips one after another; only the last may be endless |
| `Loop.of(clip, cycles, pingPong)` | Repeats a finite clip; `cycles <= 0` repeats forever and `pingPong` plays every other cycle backwards |

Every clip reports `duration()` and `endless()`, clamps `sample(time)` to its range, and offers `delayed(seconds)`, `speed(factor)`, `reversed()`, `looped(cycles, pingPong)` and `then(next)`. `Keyframe(time, value, easing)` defaults to `Easing.LINEAR`.

## Interpolators

`Interpolators` supplies the blends clips use.

| Factory | Type | Blend |
|---|---|---|
| `doubles()` | `Double` | linear |
| `vectors()`, `points()` | `Vec3d`, `Vec2d` | linear |
| `rotations()` | `Quaternion` | spherical (`slerp`) |
| `affines()` | `Affine` | through the translation, rotation, scale and shear decomposition |
| `planeTransforms()` | `PlaneTransform` | rotation, scale, shear and offset blended separately |
| `colors()`, `colorsHsv()` | `Rgba` | RGB or HSV |
| `shapes()` | `ShapeDescriptor` | see below |
| `step()` | any | `from` until `t` reaches 1 |

Shape interpolation blends two descriptors of the same kind parameter by parameter: radii, widths, depths and rotations move linearly, point lists of equal length move point by point, and paths with the same segment structure move segment by segment. Whole-number counts such as polygon sides, star points and petals switch at the midpoint, as does the fit mode. Unions, intersections, differences and transformed shapes interpolate their parts recursively when their transforms agree on reflection. Two shapes of different kinds, or point lists of different lengths, switch from one to the other at the midpoint.

## Timeline

```java
Timeline timeline = Timeline.builder()
    .track(PortalTracks.OPENING, PortalTracks.opening(0.75, Easing.BACK_OUT))
    .track(PortalTracks.TRANSFORM, PortalTracks.spin(Vec3d.UNIT_Z, 30))
    .marker("open", 0.75)
    .build();
```

A `Timeline.TrackKey<T>(name, type)` names a track. A timeline holds one clip per key and any number of `Marker(name, time)` entries; `duration()` is the longest clip or marker, `endless()` is true when a clip is infinite, `sample(key, time)` reads one track (`null` for a key the timeline lacks), and `markersBetween(fromExclusive, toInclusive, out)` collects markers in a window without allocating.

`PortalTracks` defines the keys Wormholes uses: `TRANSFORM` (`Affine`), `SHAPE` (`ShapeDescriptor`), `TINT` (`Rgba`), `OPENING` and `EDGE_SOFTNESS` (`Double`), with `opening(seconds, easing)` from 0 to 1, `closing(seconds, easing)` from 1 to 0, `morph(from, to, seconds, easing)` between shapes, and the endless `spin(axis, degreesPerSecond)`. `spin` rotates about the origin; for a rigid spin of a non-square portal around its own centre, wrap the sampled rotation in `Affine.about(center, rotation)`.

## Time sources and the animator

`TimeSource` is `double seconds()`. `TimeSource.ticks(tickSupplier, secondsPerTick)` follows a game clock, `TimeSource.nanos(System::nanoTime)` follows wall time, and `TimeSource.of(doubleSupplier)` wraps anything else.

```java
Animator animator = new Animator(timeline, TimeSource.ticks(clock::ticks, 0.05));
animator.play();

List<Marker> fired = new ArrayList<Marker>();
animator.advance(fired);
Affine transform = animator.value(PortalTracks.TRANSFORM);
double opening = animator.value(PortalTracks.OPENING);
```

| Method | Effect |
|---|---|
| `play()`, `pause()`, `stop()` | Start or resume, hold, or return to time 0 |
| `seek(time)` | Jump within the timeline; a finished animator becomes paused |
| `speed(factor)` | Playback rate. A negative factor plays backwards and starts a finite timeline from its end |
| `loop(cycles, pingPong)` | What happens at the end: a negative count repeats until stopped, `0` or `1` plays once, a higher count plays that many passes. `pingPong` reverses direction at each end |
| `advance(firedOut)` | Reads the time source, moves the clock, appends every marker crossed since the last call to `firedOut` and returns how many fired. Markers fire once per pass, including a marker at the start time right after `play()` or `seek()` |
| `value(key)` | The track's value at the current time |
| `time()`, `state()`, `finished()` | Position and `STOPPED`, `PLAYING`, `PAUSED` or `FINISHED` |

An endless timeline never finishes on its own; call `stop()` or `pause()`.
