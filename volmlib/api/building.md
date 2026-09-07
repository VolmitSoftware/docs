---
title: "Workspace builds"
description: "Parallel plugin builds, test workers, local dependencies, and build logs"
published: true
date: 2026-09-07T23:30:00.000Z
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

Each plugin receives a separate temporary VolmLib source copy, including the shared packaging module. The runner removes these copies after the build. Gradle can reuse its shared build cache. No Maven publication or remote VolmLib artifact is required.

Each invocation prints its log directory under `.buildlogs/<run>/`. That directory contains one log per project and a `summary.json` with results, exit codes, and durations. A failed build prints the end of its log and makes the script exit nonzero. Only one invocation of the workspace script can run at a time; an interrupt cancels its active builds and releases the lock.

Both `.build-work/` and `.buildlogs/` are local, ignored output.

## Automatic jar thinning

Every plugin build applies the `art.arcane.volmit-packaging` Gradle plugin from VolmLib's `packaging` module. The local VolmLib composite supplies this build dependency. Builds without the local checkout need the matching published packaging artifact.

The plugin runs directly on each distributable archive task, including all four Iris platforms. Normal `shadowJar`, `jar`, and build commands use it without a workspace init script. It adds no build-tool classes to the runtime jar.

Thinning follows Shadow's existing minimization. It removes unreachable classes only from explicitly selected VolmLib packages. All plugin-owned classes remain roots. The analysis follows bytecode, constant pools, descriptors, signatures, annotations, exact reflective class-name strings, nested classes, and service providers. Computed reflection names need explicit keep rules. Iris retains its Matter slices and leaves generated Caffeine classes outside pruning.

Compilation omits local-variable debug tables while retaining source locations and parameter names. Projects that already disable debug metadata keep that setting. Iris Bukkit also strips local-variable tables from bundled dependency classes after shading. This preserves executable instructions, annotations, source locations, and parameter names. Archive compaction uses level-9 DEFLATE compression, retains resources, verifies content, and replaces the archive only when smaller. Package directories remain present except in Iris Bukkit, which retains its existing directory-free archive layout.

Each archive must pass its size budget, required-entry checks, duplicate checks, CRC checks, and forbidden-package checks. Cached archives receive validation too. A failed archive build prevents dependent staging tasks.

Canonical budgets and required entries live in `VolmLib/packaging/src/main/resources/art/arcane/volmit/packaging/artifact-policies.json`. Each plugin selects its policy and dependency keep rules in `pluginPackaging` inside its build file. Review a size increase before changing its budget.

Reports under `build/reports/packaging/` record before/after sizes, removed classes, package sizes, resource bytes, and archive overhead. Reports are local build output.

To build and check a plugin without staging, run from its project directory:

```bash
./gradlew verifyPluginJars
```

For Iris, that command covers Bukkit. Use `verifyBukkitArtifact verifyModdedArtifacts` to assemble and check all four platform jars without staging.

For the smallest Bukkit release archive, run:

```bash
./gradlew verifyBukkitArtifact -PcompactRelease=true
```

Release compression compares Zopfli with level-9 DEFLATE for each entry and keeps the smaller result. It verifies decompressed contents before replacing the archive. The compressor runs entirely in the Gradle JVM and adds no runtime dependency. This step takes longer than normal packaging. The flag is an archive-task input, so switching modes rebuilds the jar. Reports record both metadata stripping and release compression.

To inspect an existing jar without building or modifying it, run from the workspace:

```bash
python3 gradle/jar_audit.py PluginOuts/Gloss-3.0.1-26.2.jar \
  --report .buildlogs/jar-audit-gloss.json
```

The standalone audit uses the same policy catalog and also lists the SlimJar runtime dependency coordinates. Runtime downloads reduce the distributed jar size but still require library files on the server.

## Logging policy check

The packaging plugin also registers `verifyLoggingPolicy` and wires it into `check`. It scans every main source directory line by line for `System.out`, `System.err`, `printStackTrace(`, `Throwable::printStackTrace`, `Bukkit.getLogger(`, `getServer().getLogger(`, and `getConsoleSender().sendMessage(`. A match fails the build and prints the file path, line number, pattern, and offending text, and the task writes `build/reports/logging-policy.txt`.

Exemptions live in `logging-policy-allowlist.txt` at the project root, one `<path>` or `<path> <pattern>` per line. A trailing `/` on the path exempts a subtree and `#` starts a comment. An entry that no longer matches anything fails the build, so exemptions only shrink. A plugin appends patterns with `forbid(...)` or replaces them with `forbiddenPatterns` inside `pluginPackaging { loggingPolicy { ... } }`, and can point `allowlistFile` or `sourceDirectories` elsewhere.
