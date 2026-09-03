---
title: "Workspace builds"
description: "Parallel plugin builds, test workers, local dependencies, and build logs"
published: true
date: 2026-09-03T03:00:00.000Z
tags: "volmlib, development, builds, testing"
editor: markdown
dateCreated: 2026-09-03T03:00:00.000Z
---

The workspace `build-psycho-lt.sh` builds VolmLib first, then runs the plugin builds concurrently. It uses each project's Gradle wrapper and current local VolmLib sources. Java 25, Python 3.10 or newer, and `rsync` are required.

## Build and stage the plugins

Run from the VolmitSoftware workspace:

```bash
./build-psycho-lt.sh
```

The script includes Adapt, BileTools, Gloss, HiddenOre, Iris, React, ShapedPortals, and Wormholes. Each plugin runs its tests and `buildPsychoLT`; Iris runs `test buildAll buildAllToOut`. Successful output tasks stage the plugin jars in the managed `[Minecraft Server]/consumers/` dropin directories and the workspace `PluginOuts/` directory.

VolmLib must pass its build before plugins start. Other project failures are reported while the remaining projects continue. Adapt starts after Iris and HiddenOre finish because its build includes those checkouts. A failure in an Iris loader does not prevent Adapt from attempting its own build. Iris retains its internal loader ordering and `--no-parallel` setting.

## Parallelism

| Option | Default | Meaning |
|---|---|---|
| `--jobs` | Up to 4, capped at the logical CPU count | Concurrent plugin builds |
| `--max-workers` | Logical CPU count divided by jobs, rounded down, minimum 1 | Gradle worker limit per build |
| `--test-forks` | 2, capped at the Gradle worker limit | Separate JVMs per test task |

On a machine with 16 logical CPUs, the defaults are four plugin builds and four Gradle workers per build. The worker limit also reaches Iris's nested loader builds. Gradle workers cover build tasks and test processes; these limits do not cap every thread created by compiler plugins or application code.

React uses one test JVM because its jqwik property tests share a replay database. Other suites can use two JVMs without enabling JUnit concurrency inside a JVM.

```bash
./build-psycho-lt.sh --jobs 4 --max-workers 4 --test-forks 2
./build-psycho-lt.sh --jobs 2 --max-workers 4
./build-psycho-lt.sh --jobs 1 --test-forks 1 --no-parallel
```

Other arguments are forwarded to each top-level Gradle invocation. The runner controls the local dependency paths, worker limit, and Iris's `--no-parallel` setting. Use an individual project's wrapper for a build with different dependency resolution.

## Run only tests

```bash
./build-psycho-lt.sh --tests-only
./build-psycho-lt.sh --tests-only --rerun
```

This runs `test` in VolmLib and every plugin. It does not request plugin staging tasks or Iris loader artifacts. Compilation and dependency jars required by the tests still run. Project ordering, concurrency limits, and failure reporting are the same as for the full build.

Add `--rerun` to execute the tests again even when their previous results are up to date, without forcing all compilation tasks to rerun.

## Local dependencies and logs

Each plugin receives a separate cached VolmLib source copy under `.build-work/volmlib/<project>/VolmLib/`. Before that job starts, `rsync` updates the copy from the local VolmLib checkout and removes source files deleted there. Each copy keeps its own Gradle state and build outputs between runs, and Gradle can reuse the shared build cache. No Maven publication or remote VolmLib artifact is required.

Each invocation prints its log directory under `.buildlogs/<run>/`. That directory contains one log per project and a `summary.json` with results, exit codes, and durations. A failed build prints the end of its log and makes the script exit nonzero. Only one invocation of the workspace script can run at a time; an interrupt cancels its active builds and releases the lock.

Both `.build-work/` and `.buildlogs/` are local, ignored output. To discard the cached VolmLib copies, remove `.build-work/volmlib/` while the script is stopped.
