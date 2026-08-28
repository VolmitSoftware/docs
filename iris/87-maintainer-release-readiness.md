---
title: "Maintainer - Release Readiness"
description: "Iris documentation: Maintainer - Release Readiness"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
**Internal living tracker.** Engineering checklist for preparing Iris for
a public release on Bukkit-family servers, Fabric, Forge, and NeoForge.
Complete this checklist before running
[86 - Maintainer - Release Checklist](/iris/86-maintainer-release-checklist).
Checkbox state and the run history below are maintained as work proceeds.
They are not a frozen product manual for operators.

The goal is to correct confirmed defects without silently changing valid
pack output, public behavior, or platform parity. A behavior change is
acceptable when it fixes a documented defect, is covered by a regression
test, and is recorded in `MasterChangelog.MD`.

The current runtime pass prioritizes isolated world creation, deterministic
generation, pregeneration, and profiling. Hotload, reload, and shutdown
refinement remains in the later lifecycle gates. Automated release builds,
tagged bundles, and publishing infrastructure are deferred. Public-beta
work uses manually built artifacts and focuses on plugin/mod correctness
and stability.

Cross-links: GoldenHash
([32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)),
operator runbooks ([31 - Operator Runbooks](/iris/31-operator-runbooks)),
performance knobs
([33 - Performance Tuning](/iris/33-performance-tuning)), MC bump
([85 - Maintainer - MC Version Bump](/iris/85-maintainer-mc-version-bump)).

## How to maintain this tracker

Work from the first incomplete blocking section. For each checked item,
preserve the exact commit, platform artifact, input pack/seed, command or
workload, and result outside this document. Summarize only stable
conclusions here. When a fix supersedes an earlier note, rewrite the note
instead of stacking contradictory history.

Automated tests, server startup, real-player gameplay, profiler captures,
and publishing are distinct checks. Mark only what was actually observed,
and leave client-operated or cross-server checks open until they have
been run.

## Completion rules

- [ ] Work through the sections in order. A later section does not
      override a failed earlier gate.
- [ ] Add a failing regression test or deterministic reproduction before
      each P0/P1 correctness fix.
- [ ] Run the focused test while developing, then run the full gate for
      the affected platform.
- [ ] Compare fixed-pack, fixed-seed golden hashes before and after every
      world-generation change.
- [ ] Treat an unexpected deterministic output change as a release
      blocker until explained.
- [ ] Keep loader-specific behavior behind the platform boundary.
      Reusable behavior belongs in core or SPI.
- [ ] Do not add compatibility shims, temporary adapters, or swallowed
      failure paths.
- [ ] Preserve full stack traces for engine, lifecycle, persistence, and
      operator-critical failures.
- [ ] Update `MasterChangelog.MD` (workspace root,
      `../MasterChangelog.MD` from this repo. Section `## Plugin: Iris`)
      as operator-visible fixes become final. Merge superseded entries.
- [ ] Do not publish while any required release gate is failed, pending,
      or waived without an explicit reason.

## 0. Secure and freeze the release baseline

- [ ] Rotate the GitHub credential that was embedded in the local origin
      URL.
- [x] Replace the local origin with a credential-free SSH or HTTPS URL.
- [ ] Regenerate the dev-server management secret before enabling the
      management interface.
- [ ] Select and record the exact release commit, Minecraft version, JDK,
      and loader versions.
- [x] Pin VolmLib to an immutable release/tag/commit rather than
      `master-SNAPSHOT`.
- [x] Make sure `useLocalVolmLib` and `volmLibCoordinate` propagate into
      every nested adapter build.
- [x] Make the manual release build disable local VolmLib substitution by
      default.
- [x] Capture a baseline build and test record, running these as separate
      invocations:
  - [x] `./gradlew :core:check :spi:build :probe:deserializationProbe -PuseLocalVolmLib=false`
  - [x] `./gradlew :adapters:bukkit:plugin:test --rerun-tasks -PuseLocalVolmLib=false`
  - [x] `./build-all.sh`
- [x] Confirm all four baseline jars pass archive integrity checks.
- [ ] Confirm the current CraftBukkit candidate passes its strict
      7,000,000-byte ceiling and cold/cached Paper and Spigot runtime-library
      bootstrap checks.
- [x] Capture baseline golden hashes for the same pack, seed, radius, and
      thread counts on all platforms.
- [ ] Preserve a copy of the baseline performance results described in
      section 8.

Done when: the source, dependencies, generated terrain baseline, and test
results are reproducible on a second clean checkout.

## 1. P0 - Make concurrent generation deterministic

- [x] Fix the reproducible order/state-dependent generation defect. Cave
      painting relabeled shared, loader-cached biome objects as `CAVE`.
      Shallow cave resolution can return the surface biome, so later
      height and biome decisions changed until `IrisComplex` was rebuilt.
      Carving now passes explicit cave context to surface and ceiling
      decorators without mutating the shared biome, preserving cave fluid
      behavior. Focused isolation and decorator tests plus a 2,025-chunk
      warm-sequence reproducer pass.
- [x] Scope the confirmed height-bounds cache to its owning
      `IrisComplex`. The previous static thread-local cache keyed entries
      only by grid coordinates and interpolator index. Another engine or
      a hotloaded complex could reuse bounds from a different generator
      set. Focused coverage protects both cross-complex
      isolation and same-complex cache reuse.
- [x] Scope the cave carver's scratch cache to each `IrisCaveCarver3D`.
      The warp cache was thread-local but shared by every cave profile
      and keyed only by sample coordinates. A second profile on the same
      worker could reuse warp values from the first profile's noise
      generator. Focused same-thread coverage now proves distinct carvers
      retain their own warp samples while preserving per-carver scratch
      reuse.
- [x] Bind the dimension-carving resolver's worker-local state by weak
      identity to the exact engine, dimension, and pack data. A worker
      switching worlds or generations clears every cached Y-band entry,
      selection plan, biome result, entry index, and child seed. That
      prevents cross-world cave selection and allows retired engines to
      be collected. Focused identity-switch and weak-lifetime coverage
      protects the contract.
- [x] Make cross-chunk cave-wall painting independent of adjacent mantle
      load order. All 37 block differences in the two focused
      mantle-reset diagnoses were on local chunk edges (`x=0`, `x=15`,
      or `z=15`). `IrisCarveModifier` paints the neighboring cave wall
      only when that neighbor's mantle chunk contains carving data.
      The carving component now declares a minimal one-block radius,
      which schedules the full adjacent chunk pass through the mantle
      radius conversion. Focused coverage protects that contract.
      Packaged-runtime regeneration now retains the same fixed-seed hash
      on every available platform.
- [x] Repeat the fixed-seed, reset-mantle GoldenHash sequence from clean
      startup and after a complete pregeneration on every available
      platform. Paper 26.2-56, Fabric Loader 0.19.3, Forge 65.0.3, and
      NeoForge 26.2.0.8-beta all produced the exact combined hash
      `783cf831486858129a3730e93c2823b773a40af78442ba3ebe373425eb80fab4`.
      Every strict single-thread 2,025-chunk pregeneration completed with
      zero failures and every post-pregeneration verification matched.
      Fabric also matched after a controlled restart. Folia was not part
      of this earlier GoldenHash sequence. Its later targeted replacement
      acceptance is recorded in section 11.
- [x] Explain and fix the separate 50-chunk Paper-versus-modded
      biome-hash difference for byte-identical packs. All 131 differing
      sampled columns were exactly `minecraft:forest` versus
      `minecraft:plains`. Bukkit's NMS biome source seeded the shared
      scatter generator from its first coordinate-derived RNG. Modded
      generation seeded it from the engine biome seed. Every runtime path
      now passes its owning engine explicitly. Shared registrants cache
      by canonical engine biome seed in a bounded eight-entry cache.
      Engine-less tooling preserves supplied-seed behavior. Concurrent interleaved-engine coverage protects exact
      engine ownership, seed isolation, same-seed reuse, and bounded
      eviction.
- [x] Sample direct Bukkit/modded biome derivatives at each world column,
      matching Bukkit NMS resolution. The actuator previously reused the
      chunk origin for every local column, so scatter selection could
      differ even after both platforms used the same generator seed.
      Focused actuator coverage verifies all four coordinates in a
      two-by-two chunk section are distinct world positions.
- [ ] Add a two-thread barrier test that generates two chunks through the
      same `IrisEngine` concurrently.
- [ ] Assert each generation observes its own chunk coordinates,
      `ChunkContext`, and generation session.
- [ ] Add a repeated parallel golden-hash test that fails on any
      cross-run difference.
- [x] Remove the shared mutable `chunkContext`/session state from the
      engine-wide `IrisContext` path.
- [x] Give each active generation thread or lease an isolated context
      with explicit lifetime cleanup.
- [ ] Verify maintenance, pregeneration, Bukkit multicore, and modded
      generation use the isolated context.
- [ ] Run sequential and parallel generation for the same seed and
      assert identical hashes.
- [ ] Run the test under high concurrency and with generation-session
      close/hotload activity.

Done when: repeated concurrent generation is deterministic,
context-isolated, and hash-identical to the single-threaded result.

## 2. P0 - Make hotload and shutdown transactional

This section is retained for the later lifecycle refinement pass and is
not part of the current public-beta runtime gate. Controlled restarts
remain in scope only for existing-world persistence verification.

- [ ] Add a regression test: malformed dimension edit -> failed hotload
      -> old engine remains usable.
- [ ] Extend the test: corrected edit -> next hotload succeeds without
      restarting the server.
- [ ] Build candidate dimension, loader, complex, mode, mantle, and
      world-manager state privately.
- [ ] Validate the complete candidate before changing the live engine.
- [ ] Seal new generation and drain active leases before clearing or
      replacing live resources.
- [ ] Publish the validated candidate atomically, then activate the next
      generation session.
- [ ] Keep the previous engine state intact when candidate loading or
      setup fails.
- [ ] Make `setupEngine()` fail closed and propagate fatal initialization
      failures.
- [ ] Route `hotloadComplex()` through the same generation-session and
      transactional rules.
- [ ] Make sure Bukkit exclusive-control permits are released after
      success, failure, and interruption.
- [ ] Restructure `IrisEngine.close()` so every cleanup stage runs even
      when lease draining times out.
- [ ] Add startup, failed-hotload recovery, successful-hotload, close,
      and restart tests.

Done when: no failed hotload can poison the live engine, admit generation
into partial state, leak permits, or skip shutdown cleanup.

## 3. P0 - Make `.iris` packaging complete and lossless

- [ ] Define the complete pack resource graph in one shared traversal
      used by Bukkit and modded Studio.
- [ ] Traverse dimensions, regions, biomes, generators, blocks, objects,
      entities, spawners, loot, structures, jigsaw pools/pieces,
      snippets, and every other referenced registrant.
- [ ] Include objects referenced directly by regions, not only objects
      reached through biomes.
- [x] Include entity resources referenced only by spawner `initialSpawns`
      entries, alongside normal `spawns` dependencies, with focused
      export dependency regression coverage.
- [ ] Fail packaging when any required resource is missing or malformed.
      Never report partial success.
- [ ] Stop obfuscation/export from mutating loader-cached biome or
      placement objects.
- [ ] Give Bukkit and modded packaging the same graph, validation, and
      error semantics.
- [ ] Implement the modded import/unpack path or explicitly remove the
      unsupported claim from the UI/docs.
- [ ] Add a minimal pack fixture containing at least one resource from
      every supported category.
- [ ] Add Bukkit export -> import -> export round-trip tests.
- [ ] Add modded export -> import -> export round-trip tests.
- [ ] Compare normalized JSON, binary objects, dependency counts, and
      final resource hashes.

Done when: a complete fixture survives round-trip packaging without
missing resources, mutated source state, or unexplained byte/content
changes.

## 4. P0 - Make Object Studio Folia-safe and atomic

- [ ] Add a test cell that crosses multiple chunks and multiple Folia
      regions.
- [ ] Capture each chunk/region snapshot only on its owning region
      thread.
- [ ] Assemble the final `IrisObject` only after all owned snapshots
      complete successfully.
- [ ] Serialize the object once and reuse the bytes for hashing and
      persistence.
- [ ] Write to a temporary file, flush/close it, then atomically move it
      over the destination.
- [ ] Commit the saved hash only after the atomic move succeeds.
- [ ] Leave the prior hash and file untouched after capture,
      serialization, or write failure.
- [ ] Confirm a failed write is retried on the next save rather than
      reported as “no changes.”
- [ ] Test empty cells, unchanged cells, partial chunk availability,
      failure recovery, and concurrent saves.

Done when: Object Studio performs no cross-region Bukkit access, never
exposes a partial file, and can always retry a failed save.

## 5. P1 - Make validation and schemas trustworthy

- [x] Split `PackValidator` into a read-only validator and an explicit
      cleanup command.
- [x] Make unused-resource cleanup preview changes before moving files.
- [x] Prevent restore from overwriting a newer live file without an
      explicit conflict decision.
- [ ] Discover nested dimensions and resources using the same key rules
      as `ResourceLoader`.
- [ ] Parse and validate every referenced dependency rather than checking
      only file existence.
- [ ] Promote malformed referenced JSON to a blocking validation error.
- [x] Validate nested spawner `spawns` and `initialSpawns` entries
      against same-pack entity resources, blocking malformed containers
      and entries, missing files, unsafe paths, and malformed referenced
      JSON.
- [ ] Validate nested unknown properties where the schema disallows them.
- [ ] Preserve namespaces for non-Minecraft enchantments and potion
      effects in generated schemas.
- [ ] Add deliberate cross-namespace collision fixtures.
- [ ] Make the schema executor lifecycle-owned and restartable after
      Bukkit reload and integrated-server stop/start.
- [ ] Add validator tests for nested resources, malformed dependencies,
      cleanup preview, and restore conflicts.
- [ ] Add schema tests for vanilla shorthand and fully namespaced modded
      values.

Done when: validation is read-only by default, rejects broken dependency
graphs, accepts valid nested packs, and schema completion never changes
registry identity.

## 6. P1 - Harden modded generation and lifecycle

- [ ] Make generation-session teardown cancel/retry the chunk stage
      instead of completing an empty chunk.
- [ ] Add a test proving a sealed engine cannot persist a blank chunk.
- [ ] Bound the modded chunk-generation queue and expose
      queue/backpressure metrics.
- [ ] Complete or cancel every queued future during shutdown. Leave no
      unresolved chunk pipeline.
- [ ] Stop and await maintenance work before closing the engines it can
      access.
- [ ] Await executor termination and report tasks that exceed the
      shutdown deadline.
- [ ] Add negative-min-Y tests for sea level, base height, and
      base-column stone/water/air spans.
- [ ] Verify custom biome cache invalidation after a successful Studio
      hotload.
- [ ] Make engine-data persistence synchronized and atomic.
- [ ] Make persisted statistics safe under parallel generation.
- [ ] Test dedicated-server start/stop, integrated-server start/stop/start,
      and world unload/reload.
- [x] Modded entity spawners enforce time/weather gates and apply AI
      awareness, spawn effects, and raw commands. Parity tests cover
      these paths and
      [23 - Loot, Entities, Spawners, Markers](/iris/23-loot-entities-spawners-markers)
      documents them.

Done when: modded shutdown/hotload cannot save blank chunks, strand
futures, race maintenance, or retain stale world state across a second
server lifecycle.

## 7. P1 - Harden pregeneration, Folia, and scheduling

- [ ] Remove direct world/chunk/IO fallback when a Folia region
      scheduling call fails.
- [ ] Retry, defer, or fail the operation without touching region-owned
      state from the wrong thread.
- [ ] Wrap pregenerator initialization and total-count calculation in
      the cleanup lifecycle.
- [ ] Make sure every shutdown step runs even when `generator.close()`
      fails.
- [ ] Clear `regionPending` and related bookkeeping on every
      load/generation callback failure.
- [ ] Make the pregen cache executor restartable in the same JVM.
- [x] Distinguish cancelled or aborted partial pregeneration from full
      completion after the generator drains. Cancellation now reports
      generated, total, failed, and remaining counts without emitting a
      successful `Pregen finished` summary. Focused tests cover
      cancellation after the first chunk, normal async-close completion,
      and completion with a failed chunk.
- [ ] Replace modded scheduler `CallerRunsPolicy` with explicit
      backpressure that cannot move async work onto the server thread.
- [ ] Add a bounded per-tick main-thread drain budget.
- [ ] Replace full delayed-task scans with a due-time queue or equivalent
      bounded scheduler.
- [ ] Stress cancellation, pause/resume, failure, shutdown, and restart
      under Paper and Folia.
- [ ] Verify chunk tickets, regions, files, protocol sessions, and
      executor threads are released afterward.
- [x] Publish the runtime, generation session, `RUNNING` state, cleared
      closing flag, and background-task admission before starting each
      engine's world manager. Three consecutive Folia 26.2 cold boots of
      the retained exact Overworld and Nether replacements loaded both
      engines. They showed no `bukkit_world_manager_loop` rejection,
      engine-closing warnings, `GenerationSessionException`, or startup
      failure. A Paper cold-boot smoke retained both canonical engines
      and seeds.
- [x] Resolve and persist a replacement Overworld spawn on dry
      collision-supporting ground with two collision- and fluid-free body
      blocks, inside the already owned spawn chunk. A fresh Paper exact
      replacement moved the unsafe water-column spawn to a
      coarse-dirt-supported location, and the same location and block
      states survived a cold boot. Durable per-player entry receipts and
      one-time collision redirect have focused automated coverage. A
      returning-player real-login run remains separate gameplay
      acceptance.

Done when: pregeneration remains thread-correct and bounded under
saturation, cancellation, failure, and restart.

## 8. Performance and regression proof

### Current verification coverage

These runs validate packaged-artifact generation and establish a
profiling candidate. They are not the final 5,000-10,000-chunk
performance baseline required by this section. They predate the current
`gradle.properties` loader pins on two platforms. This historical run
used Forge `65.0.3` and NeoForge `26.2.0.8-beta`. Current artifacts
target Forge `26.2-65.1.1` and NeoForge `26.2.0.59`. Treat the results
below as historical evidence. Current-loader acceptance is recorded
separately in the platform matrix.

- [x] Fixed inputs: Iris seed `1337`, GoldenHash radius `22`, one hash
      thread, and a 352-block serial/sync pregeneration radius covering
      exactly 2,025 chunks.
- [x] Fixed host: Apple M3 Max, 128 GiB RAM, Temurin 25.0.2, 8 GiB
      instance heap.
- [x] Paper 26.2-56: serial pregeneration completed 2,025/2,025 with
      zero failed chunks. Cancellation, pause/status/resume, cache
      resume, restart persistence, and untouched far-chunk generation
      passed.
- [x] Fabric Loader 0.19.3: sync pregeneration completed 2,025/2,025
      with zero failed chunks and strict `peakInFlight=1 finalLimit=1`.
      Controls, cache resume, restart persistence, and far generation
      passed.
- [x] Forge 26.2-65.0.3: sync pregeneration completed 2,025/2,025 with
      zero failed chunks and strict `peakInFlight=1 finalLimit=1`.
      Controls, cache resume, restart persistence, and untouched
      far-chunk generation passed.
- [x] NeoForge 26.2.0.8-beta: sync pregeneration completed 2,025/2,025
      with zero failed chunks. Pause/cancel, checkpoint resume, fresh
      generation, and GoldenHash capture completed against the corrected
      pack.
- [x] GoldenHash parity/determinism: Paper, Fabric, Forge, and NeoForge
      all captured the exact block+biome hash
      `783cf831486858129a3730e93c2823b773a40af78442ba3ebe373425eb80fab4`
      from the manually built candidate artifacts. Every platform then
      completed a strict single-thread 2,025-chunk pregeneration with
      zero failures and retained that hash. Fabric retained it across
      restart. The historical divergent hashes are superseded by later
      fixes. Those fixes cover cross-complex height bounds, cross-profile
      cave warp, cave-boundary scheduling, engine-owned biome generation,
      per-column biome sampling, and shared-biome cave relabeling.
- [x] Paper JProfiler CPU, heap, and GC snapshots captured. Explicit
      post-run GC reduced used heap from a sampled peak near 5.94 GiB to
      approximately 475 MiB, with no retained-heap leak indicated by this
      run.
- [x] Plain Spigot 26.2 build 4645 completed fresh-center
      1,000-block-radius pregenerations for managed Overworld and
      Underworld worlds. Each finished 16,129/16,129 chunks with zero
      failures under a 4 GiB heap and `-XX:+DisableExplicitGC`. Six automatic
      diagnostic reclaims required no operator GC. The Underworld resumed
      after the bounded 60-second below-high-water release and completed
      without OOM, unsafe terrain reads, far writes, or critical errors.
- [x] Fabric JProfiler sampled-allocation snapshot captured. Profiling
      overhead made that run unsuitable for throughput comparison.
- [x] Real content-mod fixture: Fabric, Forge, and NeoForge loaded
      Nerospace beta.7 with Neroland Core 1.4.0 (plus Fabric API 0.154.2
      on Fabric). Iris resolved a custom entity, item, and block. It
      generated the exact named structure chest item. It performed
      once-per-chunk initial spawning with zero players, replaced the
      entity's death loot, and generated seven custom ore blocks in the
      forced test area. Every loader completed strict synchronous
      2,025/2,025 pregeneration with zero failed chunks.

- [ ] Choose one fixed release pack, seed, world height, radius, JVM
      configuration, and hardware profile.
- [ ] Warm at least 256 chunks before measuring.
- [ ] Run a 5,000-10,000 chunk pregeneration baseline on Paper.
- [ ] Run the same workload on Fabric. Repeat on Forge and NeoForge
      before final release.
- [ ] Capture JProfiler CPU, allocation, GC, retained-object, thread,
      and executor-queue profiles.
- [ ] Record chunks/second, total duration, p50/p95 chunk time,
      allocations/chunk, peak heap, and GC pause time.
- [ ] Profile nested chunk prefill parallelism before changing it.
- [ ] Profile modded block/biome buffer allocation before pooling or
      changing representation.
- [ ] Profile height-bound sampling, custom biome caches, mantle tasks,
      and pregen region-drain complexity.
- [ ] Benchmark each optimization against the unchanged baseline with
      the same inputs.
- [ ] Reject or revise changes that regress median throughput by more
      than 5% or p95 latency/allocations by more than 10%. Document the
      correctness benefit and accepted tradeoff if you keep such a
      change.
- [ ] Confirm optimized and baseline runs produce identical golden
      hashes where behavior should be unchanged.

Done when: representative generation and pregeneration have repeatable
baselines, no unexplained regression, and no unbounded queue, allocation,
or retained-memory growth.

## 9. CI and deterministic test infrastructure

Automated build and release-pipeline work in this section is deferred.
The current beta pass uses manual artifacts. Only correctness tests and
deterministic reproducers that directly protect runtime behavior apply.

- [x] Add `:adapters:bukkit:plugin:test` to CI.
- [x] Expand the broad classload probe across all top-level and nested
      core classfiles. Use an exact reviewed class and
      dependency-category allowlist. It rejects new classes, changed
      dependency namespaces, non-missing-class failures, and stale
      entries.
- [ ] Move the core Bukkit purity ratchet below its current ceiling.
      `core/purity-allowlist.txt` holds 188 entries.
      `:core:bukkitPurityRatchet` (wired into `:core:check`) fails on any
      new `org.bukkit`-coupled file outside it and prints how far under
      the ceiling the tree sits.
- [ ] Give `genProbe` a repository fixture or require an explicit
      portable pack path.
- [ ] Add a deterministic fixed-seed Iris-world task for Fabric, Forge,
      and NeoForge.
- [x] Make worldcheck return a failing process result when its internal
      result is FAIL.
- [x] Prevent `buildAllToOut` nested builds from racing root tasks over
      `core/build`.
- [x] Verify nested adapter builds honor the selected VolmLib
      source/coordinate.
- [x] Add packaged-jar server boots. Manually assembled Bukkit, Fabric,
      Forge, and NeoForge artifacts all reached their runtime-ready state
      in isolated instances, including a real multi-mod classpath.

Done when: a clean CI run proves tests, deterministic generation,
packaging, and server startup from the actual release artifacts.

## 10. Full platform acceptance matrix

Use the exact packaged release jars, not development classes.

The runs completed so far prove fresh non-empty generation, exact
fixed-seed block-and-biome parity, and complete serial/sync 2,025-chunk
pregeneration on Paper, Fabric, Forge, and NeoForge. A separate
exact-replacement acceptance loaded the shipping Overworld at seed
`123456789` and Underworld at seed `-987654321`. Those worlds used the
canonical vanilla keys on Paper, Folia, Leaf, and Canvas. Every platform then
completed both 1,000-block-radius pregenerations at 16,129/16,129 chunks
with zero failures. Plain Spigot 26.2 build 4645 separately created
managed `iris:qa-overworld` and `iris:qa-underworld` worlds with those
same seeds. It completed both 16,129-chunk pregenerations. It retained
exact identities, seeds, canonical storage paths, and region inode
fingerprints. It also retained registry entries, frozen packs, and
pregen caches across repeated cold boots, including the final shared
artifact. Current-target
modded acceptance used Fabric Loader 0.19.3, Forge 26.2-65.1.1, and
NeoForge 26.2.0.59. The runtime-accepted jars passed packaging and mixin
audits. They reinjected `irisworldgen:accept_overworld` seed `123456789`
and `irisworldgen:accept_underworld` seed `-987654321` before and after
their final cold restart. They completed both valid-center
1,000-block-radius pregenerations at 16,129/16,129 with zero failures on
every loader. After the later Bukkit-only exact-slot storage correction,
all three modded artifacts were rebuilt from that source and passed
packaging and mixin verification again. That historical rebuild predates
the current modded dynamic-level lifecycle and Studio transition changes.
A second real content-mod fixture also passes entity, item, block,
structure loot, death loot, headless initial-spawn, and 2,025-chunk
pregeneration gates on all three mod loaders. These targeted runs do not
satisfy every minimum/latest loader, client, lifecycle, Studio, or
pregen-control item below, so the broader matrix remains open.

**Previously recorded world lifecycle and 1,000-block pregen acceptance:
PASS-WITH-WARN**. Paper, Folia, Leaf, Canvas, Spigot, Fabric, Forge, and
NeoForge all pass the requested world, seed, restart, and storage
scenarios. They also pass the requested pregeneration scenarios. That tested source passed every Bukkit and
modded packaging verifier. The warning is external: the optional
third-party Dungeons & Taverns fixture still loses 35 functions on Folia,
and the modded logs retain the classified authored-content fallbacks
described above. This targeted
decision does not close the broader client, Studio, minimum/latest-loader,
performance-baseline, distribution, or publication gates below.

The current candidate changes Bukkit initial-spawn readiness, Studio
arrival deadlines, modded dynamic-level lifecycle events, and Bukkit
runtime-library packaging. The historical result above does not cover
those paths. Re-run the packaged-artifact matrix below before assigning a
current GO or GO-WARN decision.

**Fresh-process strict Paper Studio timing at source `05a27f17`: PASS.**
On the reference machine, standard Overworld arrival completed in 8.115
seconds by player packet and 8.021 seconds by the plugin timer. The
serialized Underworld replacement completed in 6.336 seconds by player
packet and 6.255 seconds by the plugin timer. The exact output signatures
remained `f01487204b1f738b` for Overworld and `12dbddeddcadcbab` for
Underworld. Both runs kept canonical generation enabled, overlapped the
lifecycle-tracked generation-cache warm with native structure-ring
activation, temporarily limited only the entering player's view distance
to 2 during native teleport, and restored the saved value afterward. This
targeted proof does not close the wider server and loader matrix below.

**Current 26.2 mod-loader Studio timing: NO-GO pending player proof.**
The final teleport path now requests only its canonical FULL destination
chunk instead of a 3x3 FULL range. On the final artifacts, prepared-pack
console Studio open took 3.850 seconds for Fabric Overworld, 6.112 and
5.358 seconds for Forge Overworld and Underworld, and about 4 seconds and
1.874 seconds for NeoForge Overworld and Underworld. The smallest public
pregen command covers four FULL chunks, not one; those sequential
four-chunk Studio batches completed without failures in 15 seconds on
Fabric, 13-15 seconds on Forge, and 14-15 seconds on NeoForge. Persistent
Forge and NeoForge Overworld/Underworld creation, four-chunk generation,
region persistence, save, and clean shutdown also passed. A 26.2
player-arrival capture remains required because the automated player
harness does not support that protocol; the four-chunk average is not a
substitute for the exact single-chunk native teleport measurement.

- [ ] Bukkit-family server matrix:
  - [x] Paper current target
  - [ ] Purpur current target
  - [x] Folia current target
  - [x] Leaf current target
  - [x] Canvas current target
  - [x] Spigot/CraftBukkit managed-world path
- [ ] Mod-loader matrix:
  - [x] Fabric Loader 0.19.3 current target
  - [x] Forge 26.2-65.1.1 current target
  - [x] NeoForge 26.2.0.59 current target
  - [ ] Fabric declared minimum loader
  - [ ] Fabric latest compatible loader
  - [ ] Forge declared minimum loader
  - [ ] Forge latest compatible loader
  - [ ] NeoForge declared minimum loader
  - [ ] NeoForge latest compatible loader
- [ ] On every server target:
  - [ ] Fresh Iris world creation and non-empty chunk generation
  - [ ] Immediate Overworld then Underworld creation after each truthful
        initial-spawn-ready success, with no false busy or restart result
  - [ ] Existing Iris world restart and new-chunk generation
  - [ ] Custom biome registration and client synchronization
  - [ ] Structures, objects, loot, spawners, and entities
  - [ ] Golden-hash match for the shared pack/seed
  - [ ] Pregeneration start, pause, resume, cancel, restart, and
        shutdown
  - [ ] Studio validation, hotload failure recovery, and successful
        hotload where supported
  - [ ] Overworld and Underworld Studio player arrival under 10 seconds
        from command admission, with serialized replacement and no late
        teleport after timeout
  - [ ] Bukkit standard entry temporarily limits only the entering
        player's view distance to 2, restores it after success and failure,
        and keeps every requested chunk on canonical FULL generation
  - [ ] Ordinary Bukkit Studio overlaps its lifecycle-tracked asynchronous
        canonical generation-cache warm with native structure-ring
        activation; generation, Matter generation, hotload, and entry
        teleport await it, runtime-world warming remains synchronous, and
        `generation_cache_warm` reports `skipped=false`
  - [ ] Dynamic modded level load/unload events and rollback load event
        where applicable
  - [ ] Clean startup and shutdown without leaked threads or incomplete
        futures
- [x] Content-mod gate on Fabric, Forge, and NeoForge using Nerospace
      beta.7 and Neroland Core 1.4.0 with authored
      `nerospace:meadow_loper`, `nerospace:raw_nerosium`, and
      `nerospace:nerosium_ore` resources.
- [ ] Client matrix:
  - [ ] Modded Iris server + Iris client mod
  - [ ] Modded Iris server + client without Iris where loader rules
        permit
  - [ ] Bukkit Iris server + Iris client mod over plugin messaging
  - [ ] Non-Iris server + Iris client mod remains inert
  - [ ] Integrated singleplayer create, leave, and create/join again in
        the same client process
  - [ ] Pregen HUD, Vision map, cursor overlay, keybinds, and Studio
        toasts

Done when: every advertised server, loader, client, and content path
completes the same acceptance scenario or has a clearly documented
intentional capability difference.

## 11. Documentation and repository hygiene

- [x] Make runtime splash/version identity match the artifact version.
      Remove stale `4.0 RC.1.1.6` text.
- [x] Correct README pregen syntax, including the required radius.
- [ ] Document how to select an Iris world preset on each mod loader.
- [x] Remove automatic pack installation. Startup never downloads a world
      pack, and pack acquisition is an explicit `/iris download` operation
      followed by a manual restart. Document separately that a fresh
      Bukkit installation provisions four runtime libraries before Iris
      starts, while cached Bukkit boots and self-contained mod jars do not.
- [ ] Publish an accurate Bukkit-versus-modded Studio capability matrix.
- [ ] Document intentional entity-spawn and tooling differences that
      remain.
- [x] Remove tracked generated SIMD benchmark `.class` files and jar
      outputs.
- [x] Keep generated server worlds, caches, credentials, and build
      artifacts ignored.
- [x] Consolidate the Iris section of `MasterChangelog.MD` to the final
      shipped behavior.
- [ ] Review store/listing copy, screenshots, commands, supported
      platforms, and Java requirements.
- [ ] Write release notes with upgrade instructions, known limitations,
      and rollback guidance.

### Confirmed release blockers and follow-ups

- [ ] Revalidate both embedded stable assets:
      `https://github.com/IrisDimensions/overworld/releases/download/4002/overworld.zip`
      and
      `https://github.com/IrisDimensions/underworld/releases/download/1005/underworld.zip`.
- [x] Make modded GoldenHash metadata use the active Iris engine seed.
      Fabric, Forge, and NeoForge generated identical output from Iris
      seed `1337`. Filenames and headers recorded each vanilla level
      seed. That prevented one captured baseline file from being reused
      directly across loaders.
- [x] Correct the default overworld pack's slime spawn category from
      implicit `MISC` to explicit `MONSTER` in
      `biomes/vanilla/mangrove_swamp.json`,
      `biomes/swamp/cambian-drift.json`,
      `biomes/swamp/cambian-drift-extended.json`,
      `biomes/swamp/marsh.json`, and `biomes/swamp/marsh-rotten.json`.
      NeoForge exposes the bad category at startup. All loaders generate
      the same bad datapack entry, which can affect natural slime
      spawning and mob-cap accounting.
- [x] Extend `PackValidator` to reject authored custom-biome spawn
      categories that disagree with the live entity category. Do not
      allow the bad datapack to reach loader validation.
- [x] Restore exactly the 36 standard entity resources required by the
      overworld's retained spawner library from their last authored
      revision. Preserve their type and surface values without restoring
      deleted unique entities. Detach every regional and
      spider-infestation ambient spawner so the library remains dormant
      unless a pack author explicitly references it.
- [x] Delegate ongoing natural spawn tables in custom Iris biomes to
      each `vanillaDerivative` on Bukkit, Fabric, Forge, and NeoForge.
      Explicit custom entries replace the same native entity type and
      extend the rest, while structure overrides remain authoritative
      and cached tables avoid hot-path allocation.
- [x] Add validated custom-biome tag opt-ins and put all five explicit
      overworld slime biomes in `minecraft:allows_surface_slime_spawns`,
      allowing Minecraft's native surface-slime checks to succeed.
- [x] Add Minecraft 26.2 default-clock metadata to generated Iris
      overworld and End dimension types. Then `/time set`, `/time add`,
      time queries, and clock controls work in Iris overworld
      dimensions. An isolated Paper 26.2 runtime loaded a dimension
      using `iris:overworld`, reported the `minecraft:overworld` clock,
      accepted day and night time markers, and returned the clock time.
- [x] Make synchronous modded pregen completion diagnostics report
      meaningful concurrency values. The successful runs reported
      `peakInFlight=0 finalLimit=32` despite a strict `inFlightCap=1`
      sync mode.
- [ ] Pin or fix the isolated test harness behavior before trusting it
      for a release: setting an instance isolated currently leaves
      consumer-content symlinks in place. This pass used a fresh,
      dedicated harness root. Those links pointed only to test-local
      content and did not contaminate the test. The isolation flag alone
      is insufficient.
- [x] Resolve the fixed-seed order/state-dependent block generation and
      Paper-versus-modded biome-hash difference. The manually built
      candidate produced one exact full hash before and after
      2,025-chunk pregeneration on Paper, Fabric, Forge, and NeoForge.
      Fabric also retained it after restart.
- [x] Run current Folia 26.2 after a compatible upstream build became
      available. Exact Overworld and Nether replacement, both
      independent seeds, and both 16,129-chunk pregenerations completed.
      Three consecutive post-race-fix cold boots completed without an
      Iris lifecycle rejection or engine-closing exception.
- [x] Track the upstream Folia 26.2 incompatibility with the optional
      third-party Dungeons & Taverns 5.3.0 fixture. A no-Iris Folia control
      confirms its command
      dispatcher lacks or restricts commands used by the unchanged
      datapack. That produces 35 `nova_structures:*` function-load
      failures and incomplete load/tick tags. Paper, Leaf, and Canvas load the
      same bytes. Iris world loading and pregeneration pass, but
      affected Dungeons & Taverns functions remain unavailable until
      Folia or the datapack changes.
- [ ] Nerospace beta.7's bundled `nerospace:guide/new_life` advancement
      uses the obsolete `minecraft:entity_sub_predicate_type` /
      `minecraft:type` shape and logs one datapack parse error on
      Fabric, Forge, and NeoForge 26.2. Iris's custom block, item,
      entity, chest loot, death loot, and pregeneration integration all
      pass despite that independent content-mod error. Update Nerospace
      before using it as a clean-log beta recommendation.
- [x] Preserve structure-level loot through placement persistence. Newly
      placed structure containers receive a versioned, delimiter-safe
      marker containing the piece object, deterministic placement id,
      and owning structure. `Engine.getObjectPlacement()` reconstructs
      authored loot in order at weight 1 for the existing Bukkit and
      modded application paths without overriding global loot. Legacy
      `object@id` markers remain readable, malformed and unknown-version
      markers fail safely, and marker writes are storage-container-only.
- [x] Remove the unsupported `IrisStructurePlacement` `rotation`,
      `translate`, and `scale` fields from beta authoring and generated
      schemas. Read-only pack validation now blocks those keys
      specifically inside dimension, region, and biome `structures[]`
      entries instead of accepting settings with no runtime effect.
      Ordinary object-placement transforms remain valid and are not
      inspected by this check.

Done when: documentation and distribution metadata describe the behavior
users will actually receive.

## 12. Final GO/NO-GO gate

- [x] `unit-tests`: pass.
- [ ] `qa-validation`: pass across the full matrix.
- [ ] `edge-case-review`: pass or all remaining risks explicitly
      accepted.
- [ ] `perf-regression`: pass against the recorded baseline.
- [ ] `release-dry-run`: pass using final packaged artifacts.
- [x] `changelog-ready`: pass.
- [x] `manual-runbooks`: pass.
- [x] `docs-updated`: pass.
- [x] `known-issues-reviewed`: pass.
- [ ] Working tree is clean on the exact release commit.
- [ ] CI is green on that commit and all supporting artifacts are
      retained.
- [ ] Complete every item in
      [86 - Maintainer - Release Checklist](/iris/86-maintainer-release-checklist)
      without rebuilding from different source.

Release decision:

- [ ] **GO** - every required check passes and no unresolved warning
      remains.
- [ ] **GO-WARN** - every required check passes and each warning is
      documented and explicitly accepted.
- [x] **NO-GO** - any required check fails or remains pending.

## Fixes already completed in the current working tree

- [x] Concurrent generation binds immutable engine/session/chunk context
      per worker scope and restores or removes that binding at scope
      close.
- [x] Context-backed stream caches reject the wrong engine, a stale
      generation session, and coordinates outside the bound chunk.
- [x] Registry-backed mantle and `.mat` reads bind the owning pack data
      explicitly, and heightmap object placement no longer depends on
      ambient generation context.
- [x] Configured Matter placements use the initialized canonical Matter
      loader instead of a duplicate null field.
- [x] Deterministic barrier, worker-reuse, nested-scope, close-order,
      and context-cache regression tests pass.
- [x] Bukkit/Paper pregeneration accepts small positive radii and a
      strict one-in-flight `serial=true` mode without changing normal
      Paper/Folia concurrency.
- [x] Pregeneration drains the final backend callback before reporting
      completion, eliminating the observed 2,024/2,025 success summary.
      Delayed final success and failure paths have regression coverage.
- [x] Modded synchronous and asynchronous completion counters count only
      successful chunks, and final summaries include generated, total,
      failed, and duration values.
- [x] Reject a pregeneration whose `center ± radius` exceeds
      ±29,999,984 before runtime mutation. Shared bounds tests cover
      exact-edge acceptance and every overflow direction. Modded command
      admission constructs and validates the task before cache-profile
      changes, tickets, job state, or pregen files. The first
      asynchronous chunk failure now logs its complete unwrapped stack
      once before compact repeats.
- [x] Bound modded native structure post-processing to the current 3×3
      chunks. Beyond that, use deterministic Iris terrain or empty
      ephemeral reads, and no far mutations. Existing POI-bearing
      protochunk states are registered before shifted native placement.
      Ordinary transitions then remove or replace them correctly. The
      vanilla structure-template palette uses a concurrent boot-audited
      lookup cache. Current-loader cold replays completed all six
      16,129-chunk worlds. Those runs had zero unsafe reads, far writes,
      POI mismatches, cave-key fallbacks, native-volume concurrency
      failures, failed chunks, OOMs, or crashes.
- [x] Classify the remaining external-content warnings instead of hiding
      or migrating them. Unresolved grass forms, invalid authored block
      properties, and empty third-party template pools remain visible.
      The stale `chisled_polished_blackstone` replacement and stale
      block-attached-entity positions continue through Minecraft's safe
      fallback where available.
- [x] GoldenHash null-biome fallback is explicitly `minecraft:plains` on
      Bukkit and modded adapters.
- [x] GoldenHash metadata uses the active Iris seed across every
      platform. GitHub pack downloads accept validated immutable commit
      and tag references in preparation for freezing the default pack.
- [x] Runtime splash identity derives from the packaged artifact version
      instead of a stale release label.
- [x] Pack validation is read-only. Cleanup and restore require explicit
      preview/apply flows with fresh scans, direct-child containment,
      conflict refusal, per-pack serialization, truthful rollback
      reporting, and no-overwrite quarantine handling.
- [x] Custom-biome spawn groups validate against live platform entity
      categories, including `AXOLOTLS`, and the default overworld slime
      records are explicitly `MONSTER` with isolated NeoForge proof.
- [x] Spawner entity dependency validation covers both runtime spawn
      lists, malformed entry/container shapes, missing or malformed
      referenced entities, nested resource keys, and path containment.
      The default pack's dormant spawner library resolves to exactly 36
      standard entities and no restored unique entities.
- [x] `.iris` packaging collects entity dependencies from both normal
      and initial spawner lists. An entity used only during initial chunk
      spawning remains present after export.
- [x] Newly placed structure containers persist versioned structure
      ownership. They resolve the structure's authored loot through the
      shared Bukkit/modded placement path. They do not replace global
      loot or consume generation RNG.
- [ ] Iris still pins VolmLib commit
      `e6574cf814b3dd670385a4d632a63fde2038e186`, which predates the
      purpose-scoped action-bar retirement API used by foreground job
      progress. Publish the current VolmLib change, update every Iris
      fallback coordinate to that immutable commit, then rerun the clean
      `-PuseLocalVolmLib=false` gates. Local composite-build mode passes;
      remote mode currently fails at the two scoped `HudActionBar.retire`
      calls in `JobProgressDisplay`.
- [x] Headless classload validation scans all 1,166 compiled core
      classes, including all 353 nested classfiles. 331 nested classes
      initialize without server APIs. The remaining 22 match exact
      reviewed class and dependency-namespace entries.
- [x] Modded worldcheck uses a daemon coordinator with bounded waits on
      every server task. It stops the server before exiting. It returns
      nonzero for internal failure, timeout, interruption, thrown
      checks, and shutdown failure. Its exit contract is covered by the
      Fabric shared-source test gate.
- [x] Fabric protocol startup tolerates the pre-player-list server
      phase.
- [x] NeoForge registers the shared payload once as bidirectional.
- [x] Fabric distributable metadata declares the bundled transitive
      access-widener.
- [x] Fabric, Forge, and NeoForge resolve Minecraft 26.2's supplied
      OSHI, JNA, JNA Platform, and LZ4 implementations without embedding
      or relocating them. The distribution gate scans outer classes and
      nested jars for private rewritten references or duplicate runtime
      libraries before accepting each artifact.
- [x] Headless force-loaded chunks receive structure loot and initial
      entity spawning on Bukkit and every mod loader without requiring a
      player to enter the world. Bukkit target collection is
      global/region-safe, bounded, rotating, and deduplicated. Modded
      initial-spawn requests retry and recover without caller-runs disk
      work on the server tick.
- [x] Bukkit world creation preserves explicit `pack:dimensionKey`
      selection through pack installation and engine creation, matching
      the modded command behavior and preventing same-key cross-pack
      collisions.
- [x] Bukkit/Folia world-manager snapshots keep world, player, entity,
      chunk, and force-load API access on the appropriate global,
      entity, or region scheduler. They refresh saturation before its
      early-return gate.
- [x] Multicore Perfection waits for isolated worker completion.
- [x] Bukkit exclusive-control permits release after failures and
      interruptions.
- [x] Modded sea-level/base-column calculations use absolute world Y.
- [x] Low-risk map drawing, post-processing, base-column, and
      block-buffer loop costs were reduced.
- [x] Core tests, Bukkit plugin tests, all-platform assembly, archive
      integrity, and fresh Iris-world checks on Fabric, Forge, and
      NeoForge passed for this fix set.

These completed items remain subject to the final packaged-artifact,
Bukkit/Folia, concurrency, and performance gates above.
