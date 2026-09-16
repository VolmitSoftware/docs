---
title: "Noise and procedural streams"
description: "Seeded noise, composition, interpolation, and procedural fields shared by Volmit plugins."
published: true
date: 2026-09-14T22:50:00.000Z
tags: "volmlib, api"
editor: markdown
dateCreated: 2026-09-11T20:00:00.000Z
---

VolmLib owns the noise, interpolation, and procedural stream implementations used by Iris. Other plugins use the same classes from their VolmLib dependency. These algorithm packages do not require Iris, Bukkit, or Paper to sample fields.

## Packages

| Package | Responsibility |
|---|---|
| `art.arcane.volmlib.util.noise` | Seeded samplers, noise types, and `CNG` composition |
| `art.arcane.volmlib.util.interpolation` | Interpolation methods, sampling, and bounds |
| `art.arcane.volmlib.util.stream` | Procedural fields, arithmetic, conversion, and interpolation |
| `art.arcane.volmlib.util.math` | Random sources, coordinate math, and rarity selection |
| `art.arcane.volmlib.util.hunk` | Three-dimensional storage and field fills |

## Sample a field

```java
import art.arcane.volmlib.util.math.RNG;
import art.arcane.volmlib.util.noise.CNG;
import art.arcane.volmlib.util.noise.NoiseType;
import art.arcane.volmlib.util.stream.ProceduralStream;

CNG noise = new CNG(new RNG(42L), NoiseType.SIMPLEX, 1D, 1);
ProceduralStream<Double> heights = noise.stream().multiply(40D).add(72D);
double height = heights.get(128.5D, -32.25D);
```

`NoiseGenerator` and `ProceduralStream` expose coordinate-specific sampling methods. Preserve the intended dimensions when choosing an overload. A two-dimensional sample and a three-dimensional sample with a zero coordinate are not interchangeable contracts.

The canonical implementations retain Iris's seed handling, noise composition, interpolation, and cache invalidation. Configure a field before sharing it between workers. Do not change its configuration while workers sample it.

Deep fixed two-dimensional fracture chains reuse repeated coordinate samples within one evaluation. The bounded temporary cache clears after that evaluation and preserves the original arithmetic. Shallow chains, expressions, custom generators and injectors, child compositions, and image caches keep their existing evaluation paths.

## World column caches

`WorldCache2D` stores bounded 16×16 column caches. Each thread reuses its last chunk. Repeated reads across several chunks update access order periodically to reduce contention, while each such read still checks the shared cache for an existing entry. The recent-key table retains no additional chunks, and an evicted entry is recomputed when requested through the shared cache. `setMaximumChunks(int)` changes the retained chunk limit in place and requires a positive capacity. Eviction changes retention only; resolved values keep their existing contract.

## Iris bindings

Iris interprets pack `NoiseStyle` definitions and resolves expression and image-map resources. Its `generation.noise` package owns those bindings. Its `generation.stream` package owns engine context injection and caches registered with a generation runtime.

Generic VolmLib streams do not own an Iris runtime, preservation registry, or generation executor. Callers supply the executor factory for parallel fills. See [Hunks and coordinate math](/volmlib/api/hunks).
