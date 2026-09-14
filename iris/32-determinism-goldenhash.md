---
title: "Determinism & Goldenhash"
description: "Iris documentation: Determinism & Goldenhash"
published: true
date: 2026-09-14T00:37:56.518Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
GoldenHash compares terrain generated from the same pack, seed, center, radius, and height range. Use it when checking whether an update changed generation. River plans are part of the hash: the same pack and seed must produce the same rivers on every platform.

## Bukkit

Run the command twice in a disposable Iris world. The first run captures a baseline. The second verifies it.

```text
/iris developer goldenhash world=<world> radius=8 threads=1 center-x=0 center-z=0 reset-mantle=true deep=false
```

## Fabric, Forge and NeoForge

```text
/iris goldenhash 8 1 capture
/iris goldenhash 8 1 verify
```

`MATCH` means the generated blocks and biomes match the baseline. `MISMATCH` means at least one generated value changed. Compare only runs that use identical inputs.

## Generation updates

A new Iris implementation revision creates a new activation for future terrain, even when the pack is unchanged. Existing terrain remains the saved boundary. See [Worlds & Lifecycle](/iris/06-worlds-lifecycle#generation-updates-and-retained-terrain).

Cross-chunk object overlaps can depend on generation order when no object collision rules apply. GoldenHash can report that difference even when biome hashes match.
