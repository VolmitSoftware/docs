---
title: "Animation"
description: "Optics clips, lerp, easing, tracks, timelines and host-driven portal effects"
published: true
date: 2026-10-11T16:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

The animation package samples typed values by time. A `Clip<T>` produces a value, a `Timeline` groups clips and markers, and an `Animator` controls playback. The host supplies the clock and applies the sampled values.

## Lerp and rotation interpolation

Linear interpolation, or lerp, blends from a start value to an end value: `from + (to - from) * t`. At `t = 0`, the result is the start. At `t = 1`, it is the end. Easing changes `t` before interpolation.

| API | Blend |
|---|---|
| `Vec3d.lerp`, `Vec2d.lerp` | Linear position or vector components |
| `Rgba.lerp` | Linear RGBA components |
| `Rgba.lerpHsv` | HSV color with the shorter hue path, plus alpha |
| `Quaternion.slerp` | Spherical rotation interpolation along the shorter arc |
| `Quaternion.nlerp` | Normalized linear quaternion interpolation |
| `Affine.lerp` | Translation, quaternion rotation, scale and shear through decomposition |
| `PlaneTransform.lerp` | Offset, shortest-path angle, scale and shear |

Use `Quaternion.slerp` for rotation between orientations. A pair of equal orientations cannot describe a full revolution through shortest-arc interpolation. Use `PortalTracks.spin` for continuous turns, or supply intermediate rotation keyframes.

Direct numeric and vector lerp can extrapolate when `t` lies outside 0..1. Shape interpolation selects the start or end descriptor outside this interval. Easing with overshoot does not produce the same result for every value type.

## Easing

`EasingFunction.apply(t)` maps normalized progress to blend progress. Implement it to supply a custom curve. `reversed()` reverses its direction, and `mirrored()` applies an in/out form across the two halves.

| Easing | Behavior |
|---|---|
| `LINEAR` | Constant blend rate |
| `SMOOTH_STEP`, `SMOOTHER_STEP` | Smooth starts and stops |
| `SINE_IN`, `SINE_OUT`, `SINE_IN_OUT` | Sine acceleration and deceleration |
| `QUAD`, `CUBIC`, `QUART`, `QUINT` with `_IN`, `_OUT`, `_IN_OUT` | Increasing polynomial curvature |
| `EXPO`, `CIRC` with the same suffixes | Exponential or circular curves |
| `BACK` with the same suffixes | Overshoot around an endpoint |
| `ELASTIC` with the same suffixes | Oscillation around an endpoint |
| `BOUNCE` with the same suffixes | Repeated bounce segments |
| `Easing.steps(count)` | Discrete progress steps |
| `Easing.cubicBezier(x1, y1, x2, y2)` | A cubic Bézier curve with x control points in 0..1 |

The family names in the table expand to constants such as `CUBIC_OUT` and `BOUNCE_IN_OUT`. `Easing.parse(name)` accepts case-insensitive names with hyphens or underscores. Steps require a positive count. Bézier control points must be finite.

Back and elastic curves can exceed 0..1. Clamp host properties that require a bounded value, such as opacity or non-negative size. A curve name does not enforce those constraints.

## Clips

| Clip | Sampling contract |
|---|---|
| `Constant.of(value, duration)` | Holds one value. Duration can be zero or positive infinity |
| `Tween.of(from, to, duration, easing, interpolator)` | Blends between values over a finite, non-negative duration |
| `Tween.of(double, double, duration, easing)` | Scalar tween with the double interpolator |
| `Track.of(interpolator, keyframes)` | Sorts keyframes and interpolates between them. Requires at least one keyframe and distinct times |
| `Sequence.of(clips)` | Plays clips in order. Requires at least one clip. Only its last clip can be endless |
| `Loop.of(clip, cycles, pingPong)` | Repeats a finite clip with positive duration. `cycles <= 0` means endless |

Built-in clips clamp negative sample time to zero and finite sample time to their duration. A zero-duration tween samples its end value. A track holds its first value before its first keyframe and its last value after its final keyframe.

`Keyframe(time, value, easing)` requires a finite, non-negative time and non-null value. The two-argument constructor uses `LINEAR`. The later keyframe's easing controls the interval leading into it. `Track.with(keyframe)` returns a track with that time added or replaced.

Every `Clip<T>` provides these composition methods:

| Method | Result |
|---|---|
| `delayed(seconds)` | Holds `sample(0)` before starting. Delay must be finite and non-negative |
| `speed(factor)` | Scales sample time. Factor must be finite and positive |
| `reversed()` | Plays a finite clip backwards. Endless clips cannot reverse |
| `looped(cycles, pingPong)` | Wraps `Loop.of` |
| `then(next)` | Creates a sequence |
| `duration()`, `endless()` | Reports the clip's time extent |

## Interpolators

An `Interpolator<T>` implements `interpolate(from, to, t)`. Use the supplied factories or implement a blend for a host value type.

| Factory | Type |
|---|---|
| `doubles()` | `Double` |
| `vectors()`, `points()` | `Vec3d`, `Vec2d` |
| `rotations()` | `Quaternion` through slerp |
| `affines()` | `Affine` through decomposition |
| `planeTransforms()` | `PlaneTransform` |
| `colors()`, `colorsHsv()` | `Rgba` |
| `shapes()` | `ShapeDescriptor` |
| `step()` | Any type. Holds the start until `t >= 1` |

Shape interpolation blends matching shape parameters, equal-length point lists and paths with matching segment structures. Boolean shapes interpolate corresponding operands recursively. Transformed shapes interpolate when their transforms have matching reflection signs.

Integer counts, such as petals or polygon sides, switch at the midpoint. Fit modes also switch there. Different shape kinds, point lists or structures that do not match switch rather than produce a smooth geometric morph.

## Timelines and portal track keys

A `Timeline.TrackKey<T>(name, type)` identifies one typed clip. The builder rejects a duplicate key. A timeline's duration includes its longest clip and latest marker. Any endless track makes the timeline endless.

```java
Timeline timeline = Timeline.builder()
    .track(PortalTracks.OPENING, PortalTracks.opening(0.75, Easing.CUBIC_OUT))
    .track(PortalTracks.TRANSFORM, PortalTracks.spin(Vec3d.UNIT_Z, 30.0))
    .marker("open", 0.75)
    .build();
```

`keys()`, `track(key)` and `markers()` expose the contents. `sample(key, time)` returns `null` when the key is absent. `markersBetween(fromExclusive, toInclusive, out)` appends markers in an increasing time window.

`PortalTracks` supplies shared key names and helper clips. Wormholes does not consume these tracks. A host defines what each value changes.

| Key or helper | Value or result |
|---|---|
| `TRANSFORM` | `Affine` |
| `SHAPE` | `ShapeDescriptor` |
| `TINT` | `Rgba` |
| `OPENING`, `EDGE_SOFTNESS` | `Double` |
| `opening(seconds, easing)` | Scalar 0 to 1 |
| `closing(seconds, easing)` | Scalar 1 to 0 |
| `morph(from, to, seconds, easing)` | Shape descriptor tween |
| `spin(axis, degreesPerSecond)` | Endless rotation about a finite non-zero axis |

`spin` rotates about the coordinate origin and permits either direction or a zero rate. Wrap its sample in `Affine.about(center, rotation)` to rotate about a portal center. Opening and edge softness have no built-in rendering behavior.

## Grow from small to big, then vanish

Keep a valid definition and animate its rendered image separately. This example grows from 5% to 160%, shrinks again, and fades to transparent. It uses positive scale throughout.

```java
Track<Double> size = Track.of(Interpolators.doubles(), List.of(
    new Keyframe<Double>(0.0, 0.05),
    new Keyframe<Double>(1.0, 1.6, Easing.CUBIC_OUT),
    new Keyframe<Double>(1.4, 1.6),
    new Keyframe<Double>(2.0, 0.05, Easing.CUBIC_IN)
));
Track<Rgba> tint = Track.of(Interpolators.colors(), List.of(
    new Keyframe<Rgba>(0.0, Rgba.WHITE),
    new Keyframe<Rgba>(1.4, Rgba.WHITE),
    new Keyframe<Rgba>(2.0, Rgba.TRANSPARENT, Easing.SINE_IN)
));
Timeline.TrackKey<Double> sizeKey = new Timeline.TrackKey<Double>("size", Double.class);
Timeline effect = Timeline.builder()
    .track(sizeKey, size)
    .track(PortalTracks.TINT, tint)
    .marker("peak", 1.0)
    .marker("remove", 2.0)
    .build();
Animator animator = new Animator(effect, TimeSource.nanos(System::nanoTime));
animator.play();
```

On each host update, advance playback and sample the values:

```java
List<Marker> fired = new ArrayList<Marker>();
animator.advance(fired);
double factor = animator.value(sizeKey);
Affine rendered = Affine.about(gate.center(), Affine.scale(factor)).compose(gate.affine());
Rgba color = animator.value(PortalTracks.TINT);
boolean visible = !animator.finished();
```

`gate` is a valid `PortalDefinition`. Apply `rendered`, `color` and `visible` through the host renderer. Use `remove` to release the host object when appropriate. Optics does not create or destroy that object.

Do not call `resized(0, 0)` or replace the definition with an empty mask. Definitions reject both. A zero render scale is valid for point mapping and interpolation, but produces a singular matrix. `inverse()` rejects it, and a collapsed normal returns zero. A small positive scale plus visibility or alpha keeps the render transform invertible.

## Motion, spin and independent size

Use `Tween.of(start, end, seconds, easing, Interpolators.vectors())` for eased translation. Sample an offset and apply `Affine.translation(offset)`. Use `Affine.scale(x, y, z)` for independent render-axis size.

For a portal-local stretch, apply scale before the portal placement: `gate.affine().compose(Affine.scale(uScale, vScale, 1.0))`. For a world-axis stretch, apply it outside the placement with an explicit pivot.

Combine motion and rotation with `Affine.trs(translation, rotation, scale)`. It applies scale, rotation, then translation. `outer.compose(inner)` applies the inner transform first. Render transforms do not change `PortalDefinition.crossing` or its cell mask.

Use shape and transform tracks together for a moving mask. The host must decide whether to update render geometry, crossing geometry, or both. Any sampled shape applied to a definition must still leave an open raster cell.

## Time sources and playback

`TimeSource.seconds()` supplies time. `ticks(tickSupplier, secondsPerTick)` follows a game clock. `nanos(longSupplier)` converts nanoseconds, and `of(doubleSupplier)` wraps a custom clock.

| Animator method | Effect |
|---|---|
| `play()` | Starts or resumes. Restarts a finished timeline |
| `pause()` | Holds the current sampled time |
| `stop()` | Returns to time zero and clears pass progress |
| `seek(time)` | Clamps to the timeline range. A finished animator becomes paused |
| `speed(factor)` | Finite rate. Zero holds time. Negative rates play backwards |
| `loop(cycles, pingPong)` | Negative count repeats forever. Zero or one plays once. Higher counts specify passes |
| `advance(firedOut)` | Reads the clock, moves time and appends crossed markers |
| `value(key)` | Reads a track at the current sampled time |
| `timeline()`, `time()`, `speed()`, `state()`, `finished()` | Playback inspection |

`Animator.loop` and `Loop.of` use different rules for zero cycles. A negative playback rate starts a finite timeline at its end when playback starts from stopped time zero. An endless timeline starts at zero.

Markers include the playback start or seek position on the next advance with non-zero finite elapsed time. Reverse playback emits crossed markers in descending time order. A repeated pass can fire the same marker again. Clear a reused output list before each advance if you only need new events.

`advance` does not schedule itself. Call it at the host's update cadence. Call `pause` or `stop` to end an endless timeline.
