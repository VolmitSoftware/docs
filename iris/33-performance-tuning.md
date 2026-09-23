---
title: "Performance Tuning"
description: "Iris documentation: Performance Tuning"
published: true
date: 2026-09-23T10:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Pregenerate your world's playable area before opening it to players. Use [Pregeneration](/iris/07-pregeneration) for the start, status, pause, and stop commands.

Performance and pregeneration settings are in `iris.json`. Stop an active pregeneration before changing settings, and change one setting at a time. The full reference is in [Configuration](/iris/03-configuration).

## Iris settings

| Setting | Default | User effect |
|---|---|---|
| `performance.objectLoaderCacheSize` | `4096` | Larger values reduce repeated loading of objects and images but use more memory |
| `performance.resourceLoaderCacheSize` | `1024` | Larger values reduce repeated loading of pack resources but use more memory |
| `performance.noiseCacheSize` | `1024` | Larger values reuse more terrain samples but use more memory |
| `pregen.saveIntervalMs` | `30000` | Milliseconds between pregeneration saves; shorter intervals save progress more often and increase disk activity |
| `pregen.moddedPregenInFlight` | `0` | Mod loaders only: maximum concurrent chunk requests; `0` selects automatically. Lower values reduce generation concurrency |

On Bukkit servers, pregeneration adjusts concurrent chunk requests to the available generation workers and slows admission when memory is constrained. The same limits apply from the start of each job. River planning also limits concurrency according to available processors and the JVM maximum heap; it admits more work as individual plans finish.

Keep `pregen.runtimeSchedulerMode` and `pregen.paperLikeBackendMode` at `AUTO` unless you need a specific supported platform mode.

## Sampling for a new world

If changed terrain is acceptable, set `terrainSamplingStep` and `caveDensitySamplingStep` in the pack's dimension before creating the world. Each accepts `1`, `2`, `4`, or `8`; `1` preserves the original sampling. Larger values trade small terrain and cave details for fewer noise evaluations while retaining configured generation features. See [Terrain sampling](/iris/11-dimensions#terrain-sampling) for the fields and their limits.

`biomeBoundsSamplingStep` separately controls the horizontal sampling of blended biome height ranges. It accepts `4`, `8`, `16`, or `32`, with `4` preserving the original interval. Larger values reduce sampling and smooth height-range transitions while retaining each generator's configured interpolation method and radius.

For the coarsest supported sampling, add these fields to the dimension JSON before creating a fresh world:

```json
{
  "terrainSamplingStep": 8,
  "caveDensitySamplingStep": 8,
  "biomeBoundsSamplingStep": 32
}
```

These settings change the seed's terrain and apply to both server generation and the [standalone region exporter](/iris/07-pregeneration#offline-region-generation). Keep the same dimension settings when importing an offline checkpoint. Inspect the new world before opening it to players; performance depends on the pack and hardware.

## Optional vector support

To enable vector support, keep `performance.simdKernels` set to `true` and add this flag before `-jar` in the server's Java command:

```text
--add-modules jdk.incubator.vector
```

The benefit depends on the hardware. Iris also runs without this flag.

## Server configuration

On Paper-compatible servers, chunk worker settings are in `config/paper-global.yml` under `chunk-system.worker-threads`. Restart the server after changing them. Run large pregenerations when player activity is low.

During nonserial Paper-family pregeneration with at least 16 GiB of maximum Java heap, Iris temporarily raises a smaller native worker pool to twice the available processor count, capped at 32 unless the processor count is already higher. Larger configured pools remain unchanged. The original count returns after the last active pregeneration closes. Folia and strict serial generation retain their existing worker targets.

On Purpur 26.3-2639, or LEAF 26.2-99 with the faster random generator disabled, set `world-settings.default.settings.entity.shared-random` to `false` in `purpur.yml` before parallel pregeneration, then restart. Each entity then receives its own random source for UUID creation. Check any world-specific override of this setting.
