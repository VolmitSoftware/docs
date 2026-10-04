---
title: "Noise and procedural streams"
description: "Seeded noise, composition, interpolation, and procedural fields shared by Volmit plugins."
published: true
date: 2026-10-04T12:20:50.645203+00:00
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

The canonical implementations retain Iris's seed handling, noise composition, interpolation, and cache invalidation. Configure a field before sharing it between workers. Concurrent first samples of a configured `CNG` use the same scale, opacity, and fracture settings as serial samples. Do not change its configuration while workers sample it.

Deep fixed two-dimensional fracture chains reuse repeated coordinate samples within one evaluation. The bounded temporary cache clears after that evaluation and preserves the original arithmetic. Shallow chains, expressions, custom generators and injectors, child compositions, and image caches keep their existing evaluation paths.

## Native Billow backend

`FractalBillowSimplexNoise` enables its native backend by default for two-dimensional samples with 8 or 9 octaves and finite coordinates within the closed range −30,000,000 to 30,000,000. Start Java 25 with native access enabled for the containing module (`--enable-native-access=ALL-UNNAMED` for classpath deployments). Set `-Dvolmlib.noise.nativeBillow=false` to select Java. Other sample dimensions and octave counts use Java. Native results preserve Java raw floating-point bits; failed startup validation or unavailable native loading selects Java.

`FractalBillowSimplexNoise.nativeBackendStatus()` returns the selected backend status as a `String`; `"native"` indicates that startup validation passed. `nativeSampleCount()` returns a `long` count of native samples only when startup property `volmlib.noise.nativeBillowDiagnostics=true` is enabled; otherwise it returns zero. Backend selection and diagnostics are fixed at class initialization and require a process restart to change. See [Workspace builds](/volmlib/api/building#native-billow-artifacts) for packaging and the optional absolute library-path override.

## Optional native batches

`BillowBatch` is a Java 25, thread-owned, closeable context for unsigned two-dimensional Billow samples. Build its optional Rust library with `./gradlew :shared:buildBillowNative` in VolmLib and enable JVM native access with `--enable-native-access=ALL-UNNAMED`. Pass the resulting library path explicitly. The library embeds a WGSL shader and uses a supported wgpu adapter through Vulkan, DirectX 12, or Metal. Runtime availability depends on the installed GPU and driver.

```java
BillowBatch.Options options = new BillowBatch.Options(true, true, libraryPath, 65_536);
try (BillowBatch batch = new BillowBatch(options)) {
    BillowBatch.Backend backend = batch.fill(
            new BillowBatch.Request(42L, 8, coordinates, values, count));
    BillowBatch.Statistics statistics = batch.statistics();
}
```

Supply `coordinates` as packed `(x, y, z)` triples; sampling uses `x` and `z`. Supply the same seed as the `FractalBillowSimplexNoise` constructor. `count` must fit both arrays and the configured capacity, which cannot exceed 1,048,576 samples. Eight- and nine-octave requests can select GPU at 65,536 samples or exact Rust at 256 samples. Smaller requests, unsupported octave counts, and unavailable native capabilities use Java. GPU results are approximate; use the exact CPU path when bit equality is required.

Create, fill, inspect, and close each context on its owning thread. Repeated close is safe. `selection()` reports the last backend decision; `statistics()` reports batch counts and fallback reasons independently of the scalar backend's `nativeSampleCount()`. Batch options do not enable Iris terrain batching; Iris generation continues to use its scalar noise path.

## World column caches

`WorldCache2D` stores bounded 16×16 column caches. Each thread reuses its last chunk. Repeated reads across several chunks update access order periodically to reduce contention, while each such read still checks the shared cache for an existing entry. The recent-key table retains no additional chunks, and an evicted entry is recomputed when requested through the shared cache. `setMaximumChunks(int)` changes the retained chunk limit in place and requires a positive capacity. Eviction changes retention only; resolved values keep their existing contract.

## Iris bindings

Iris interprets pack `NoiseStyle` definitions and resolves expression and image-map resources. Its `generation.noise` package owns those bindings. Its `generation.stream` package owns engine context injection and caches registered with a generation runtime.

Generic VolmLib streams do not own an Iris runtime, preservation registry, or generation executor. Callers supply the executor factory for parallel fills. See [Hunks and coordinate math](/volmlib/api/hunks).
