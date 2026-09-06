---
title: "Determinism & Goldenhash"
description: "Iris documentation: Determinism & Goldenhash"
published: true
date: 2026-09-06T08:19:20.988Z
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

## Generation build revisions

Each build captures generation source and resolved dependency hashes as an implementation revision. Source or dependency changes produce a new revision automatically. Packaging does not require a manual seal refresh.

```sh
./gradlew :core:generateGenerationBuildRevision
./gradlew :core:verifyGenerationBuildRevision
```

Verification checks that the packaged revision matches that build's inputs. These include generation code, native bindings, VolmLib, and the agent artifact. It does not require the current source to match an older world's revision.

On startup, a changed implementation revision creates a new activation for future terrain, even when the pack bytes remain unchanged. Existing terrain supplies the saved boundary. Iris does not execute an archived generator to reconstruct it.

Generation history retains the revision as provenance. The current persistent format and registry contracts govern whether Iris can read the world. Changes to those formats still require deliberate format design.

Offline generation probes provide decorator support through their stub platform without loading Bukkit classes. Their simplified block predicates do not establish native block-shape or client-rendering parity.

Cross-chunk object overlaps can still depend on generation order when no object collision rules apply. Competing objects from different origin chunks can write different final blocks at the same destination. GoldenHash can expose this difference even when biome hashes match.

GoldenHash checks generated output for selected inputs. Compare identical builds, packs, seeds, and generation histories when testing determinism. For upgrades, also test expansion from saved terrain and repeated Studio edits. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle#generation-updates-and-retained-terrain).
