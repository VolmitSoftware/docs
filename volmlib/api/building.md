---
title: "Workspace builds"
description: "Parallel plugin builds, test workers, local dependencies, and build logs"
published: true
date: 2026-10-04T16:29:12.907453+00:00
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

The script includes Adapt, BileTools, Gloss, HiddenOre, Iris, React, ShapedPortals, and Wormholes. Each plugin runs its tests and `buildPsychoLT`; Iris runs `build buildAll buildAllToOut`. Wormholes also produces its compile-time API jar with `apiJar`. Successful output tasks stage the plugin jars in the managed `[Minecraft Server]/consumers/` dropin directories and the workspace `PluginOuts/` directory.

VolmLib must pass its build before plugins start. Other project failures are reported while the remaining projects continue. ShapedPortals starts after Wormholes finishes so it can compile against the current Wormholes API jar. Adapt starts after Iris and HiddenOre finish because its build includes those checkouts. A failure in an Iris loader does not prevent Adapt from attempting its own build. Iris runs independent modules in parallel and retains its internal loader ordering.

## Native Billow artifacts

The optional native Billow library requires Java 25 and `rustc` with Rust 2024 edition support on the build host. Native builds support macOS and GNU Linux on aarch64 or x86_64. The JVM and Rust compiler must use the same host architecture. Build on the target operating system and architecture; each artifact includes that host's library only.

From the VolmLib project root:

```bash
./gradlew :shared:build -PincludeNativeBillow=true
```

`shared:buildNativeBillow` compiles `shared/src/main/rust/billow.rs` as an optimized dynamic library. `-PincludeNativeBillow=true` packages the library in the shared jar, and must also be supplied to the consuming plugin build when it builds VolmLib through the local composite. Iris forwards this property to its nested Fabric, Forge, and NeoForge builds so every platform uses the selected native packaging setting. Without this property, ordinary builds require no Rust toolchain and omit the native library.

At runtime, the bundled matching library is selected by default; `-Dvolmlib.noise.nativeBillow=false` disables it. Native access must be enabled for the containing Java module. An absolute `-Dvolmlib.noise.nativeBillowLibrary=/opt/noise/libvolmlib-billow.so` selects a separately built compatible library instead. Keep that library's exported interface aligned with the bundled VolmLib version. Missing or unusable libraries leave Java sampling active. See [Noise and procedural streams](/volmlib/api/noise#native-billow-backend).

### Portable batch library

The separate `BillowBatch` API uses Cargo to build a Rust/wgpu library with an embedded WGSL shader. From VolmLib, run:

```bash
./gradlew :shared:buildBillowNative
```

The library is written to `shared/native/billow/target/release/` as `libvolmlib_billow.dylib` on macOS, `libvolmlib_billow.so` on Linux, or `volmlib_billow.dll` on Windows. Supply its absolute path in `BillowBatch.Options` and enable JVM native access. This library is separate from the bundled scalar Billow library and is not included by `includeNativeBillow`.

Build for the target host with its Rust toolchain. wgpu selects an available supported hardware adapter; a GPU or driver that does not satisfy the required compute capabilities leaves the exact CPU paths available. Ordinary Java builds do not compile this optional library. See [Noise and procedural streams](/volmlib/api/noise#optional-native-batches) for the batch API.

## Loader-neutral dependencies

Use `com.github.VolmitSoftware.VolmLib:volmlib-localization:<version>` for language catalogs, validated message editing, locale downloads, and personal language preferences without a Bukkit dependency. Use `com.github.VolmitSoftware.VolmLib:volmlib-web:<version>` for `MclogsClient`. Keep these modules on the same VolmLib version as `shared` and the native modules.

Local composite builds substitute `volmlib-localization` with `:localization` and `volmlib-web` with `:web`. Builds using remote coordinates need those modules published at the selected revision. A dependency declared with `transitive = false` must list every module it bundles explicitly.

## Build selected plugin jars

Run `./gradlew packedJar` from a plugin project to create its selected `-packed.jar` beside the ordinary artifact in `build/libs/`. React's project root is `React/React/`. BileTools and Gloss produce one selected jar for both their server and Velocity editions. For the separate Wormholes proxy plugin, run `./gradlew :wormholes-proxy:packedJar` from `WormholesPlugin/`.

Each build compares the complete ordinary package with its XZ package and writes the smaller candidate to `-packed.jar`. Selection is automatic and needs no flag. Iris includes the native adapters in both candidates, so either selected format remains portable.

When XZ wins, startup verifies and extracts the bundled runtime into the plugin's writable `cache/runtime/` directory. Later starts verify and reuse that cache. The ordinary format loads directly without extraction. Required external libraries retain their normal download and cache behavior.

`assemble` and `build` also produce the selected artifact. Existing plugin export tasks copy it under their usual filenames. Maven and API artifacts remain ordinary jars for compile-time use. Test fixtures and Iris mod jars retain their existing format. Install only one artifact for each plugin.

Enable automatic package selection on the final runtime artifact in the shared packaging configuration:

```groovy
pluginPackaging {
    artifacts {
        create('distribution') {
            taskName = 'shadowJar'
            policyName = 'Adapt'
            packed = true
            packedJarAccessors = ['art/arcane/adapt/Adapt#getJarFile']
        }
    }
}
```

Set `packed = true` on the final distribution only. For a combined Bukkit and Velocity jar, select `universalJar`. Descriptors supply the entrypoints automatically. Use `packedEntrypoints` to add class names when a platform loads additional startup classes.

Gloss and BileTools shrink their combined server and Velocity distribution before choosing its compression format. Their shrink configuration includes both platforms' compile libraries and preserves each platform's relocated dependencies.

Set `intermediate = true` only on an archive consumed by a separately audited final distribution, such as the Bukkit input to `universalJar`. Its size overage becomes a warning, while shrinking and all content checks remain active. The final distribution enforces its configured byte budget; intermediate reports identify that budget as applying to the `final distribution`.

`packedJarAccessors` lists methods as `owner/internal/Class#method`. Each method must return `java.io.File` without parameters. The XZ candidate redirects these methods to the extracted runtime archive. Use them for class scanners that need the complete archive. Keep installed-jar identity and update paths separate.

With one packed artifact, the task is `packedJar`. Multiple packed artifacts get a `packed<ArtifactName>Jar` task each. Output uses the producer's directory and filename with `-packed` before `.jar`, regardless of the selected format.

## Parallelism

| Option | Default | Meaning |
|---|---|---|
| `--jobs` | Up to 4, capped at the logical CPU count | Concurrent plugin builds |
| `--max-workers` | Iris: logical CPU count; other projects: CPU count divided by jobs, minimum 1 | Gradle worker limit per build |
| `--test-forks` | Iris: half the logical CPUs, maximum 8; other projects: 2; React: 1 | Separate JVMs per test task, capped by the worker limit |

On a machine with 16 logical CPUs, the defaults are four plugin builds. Iris receives sixteen Gradle workers and up to eight test JVMs per task; other projects receive four workers and two test JVMs, except React, which uses one. The worker limit also reaches Iris's nested loader builds. Gradle workers cover build tasks and test processes; these limits do not cap every thread created by compiler plugins or application code.

Iris automatically uses all logical CPUs as its Gradle worker limit and half the logical CPUs, capped at eight, as its test JVM limit. Its Bukkit test modules use at most two JVMs and its probe module uses at most four. Explicit `--test-forks` and `--max-workers` values override the automatic overall limits; the Bukkit and probe module limits still apply. React uses one test JVM because its jqwik property tests share a replay database. Other suites honor `--test-forks`, capped by `--max-workers`; `--test-forks 1` runs one JVM per test task. This does not enable JUnit concurrency inside a JVM.

```bash
./build-psycho-lt.sh --jobs 4 --max-workers 4 --test-forks 2
./build-psycho-lt.sh --jobs 2 --max-workers 4
./build-psycho-lt.sh --jobs 1 --test-forks 1 --no-parallel
```

Other arguments are forwarded to each top-level Gradle invocation, including `--no-parallel` when serial execution is needed. The runner controls the local dependency paths and worker limit. Use an individual project's wrapper for a build with different dependency resolution.

From the Iris checkout, its Gradle test tasks use the same automatic test JVM limit. Set `-PtestForks=<count>` to override it, capped by Gradle’s `--max-workers` limit and the Bukkit/probe module limits. Artifact copies default to `../PluginOuts/`; `-PpluginOutDirectory=<directory>` overrides that destination. `-Plocation=<consumer-root>` sets the consumer dropin root.

## Run only tests

```bash
./build-psycho-lt.sh --tests-only
./build-psycho-lt.sh --tests-only --rerun
```

Iris's `moddedTest` is part of `check`, not `test`, so `--tests-only` does not run the `adapters/modded-common` suite. Run `./gradlew moddedTest` or `./gradlew build` from `Iris/` for that.


This runs `test` in VolmLib and every plugin. It does not request plugin staging tasks or Iris loader artifacts. Compilation and dependency jars required by the tests still run, including the Wormholes API jar consumed by ShapedPortals. Project ordering, concurrency limits, and failure reporting are the same as for the full build.

Add `--rerun` to execute the tests again even when their previous results are up to date, without forcing all compilation tasks to rerun.

## Local dependencies and logs

Each plugin receives a separate temporary VolmLib source copy, including the shared packaging module. The runner removes these copies after the build. Gradle can reuse its shared build cache. No Maven publication or remote VolmLib artifact is required.

Each invocation prints its log directory under `.buildlogs/<run>/`. That directory contains one log per project and a `summary.json` with results, exit codes, and durations. A failed build prints the end of its log and makes the script exit nonzero. Only one invocation of the workspace script can run at a time; an interrupt cancels its active builds and releases the lock.

Both `.build-work/` and `.buildlogs/` are local, ignored output.

## Automatic jar thinning

Every plugin build applies the `art.arcane.volmit-packaging` Gradle plugin from VolmLib's `packaging` module. The local VolmLib composite supplies this build dependency. Builds without the local checkout need the matching published packaging artifact.

The plugin runs directly on each distributable archive task, including all four Iris platforms. Normal `shadowJar`, `jar`, and build commands use it without a workspace init script. It adds no build-tool classes to the runtime jar.

Packaging runs three passes inside the archive task, in this order: a ProGuard shrink, VolmLib dependency pruning, and archive compaction. The archive is final when the task completes.

### ProGuard shrink

Director parameter handlers are retained as reflective command entry points, including nested handlers referenced by parameter annotations. Their nest membership remains intact, so packaged handlers can call private methods on their enclosing command class.

Non-modded profiles pass the assembled archive through ProGuard 7.10 in shrink-only mode (`-dontobfuscate -dontoptimize`), so package, class, and member names never change. The pass removes classes and members that nothing reachable references. Reachability starts from generated keep rules: the `main`, `bootstrapper`, and `loader` classes of `plugin.yml` and `paper-plugin.yml`; every `keepPrefixes` entry and every `required_entries` class; every `META-INF/services` interface and provider; every class whose full name appears as a string constant in bytecode or inside a text resource; every annotation type; all constructors of retained classes; enum `values` and `valueOf`; members carrying Gson `SerializedName`/`Expose` or `ConfigDoc`/`ConfigDescription` annotations; the fields of classes named `*Config*` or `*Settings*`; record members; `EventHandler` and `Subscribe` methods; Java serialization and `ConfigurationSerializable` hooks; the shared reflective families matched by relocated-package wildcards (`**.slimjar.**`, `**.bstats.**`, `**.packetevents.**`, `**.bytebuddy.**`, `**.caffeine.**`, `**.director.**`, `**.matter.slices.**`, `**.papi.**`); classes and members annotated with any `**.director.annotations.Director` or `Param`; and the per-profile `shrink_keep` rule lines from `artifact-policies.json`. Iris Bukkit keeps its annotated pack models, NMS bindings, scanned services, command handlers, mantle components, SIMD kernels, and embedded agent. The artifact gate requires each command handler and mantle component discovered in the source packages.

The library classpath is the JDK of the Gradle JVM (exported once from the runtime image into `<gradle user home>/caches/volmit-packaging/`) plus the project's resolved `compileClasspath`. Library jars whose class entries overlap the archive, such as project-built modules already shaded in, are excluded automatically. A build can add more library jars with `shrinkLibraries.from(...)` inside its artifact block; projects whose NMS bindings live in a subproject add that subproject's compile classpath so preverification sees the server hierarchy. `shrinkRelocations` maps original packages to their relocated names so runtime-downloaded SlimJar libraries are analysed under the relocated hierarchy the jar actually references. Unresolved references fail the build unless the referenced or referencing class matches a shared default (`javax.annotation.**`, `org.jetbrains.annotations.**`, `org.checkerframework.**`, `edu.umd.cs.findbugs.annotations.**`, `com.google.errorprone.annotations.**`, `kotlin.**`, `android.**`, `dalvik.**`, `org.apache.logging.log4j.**`, `java.lang.invoke.**`, `me.clip.placeholderapi.**`, `lombok.**`) or a per-profile `shrink_dontwarn` pattern; every tolerated warning is listed in the JSON report. Classes that carry ByteBuddy `Advice` annotations are kept whole and their original bytes are written back over ProGuard's output, because the preverifier rewrites their stack-map frames in a form ByteBuddy refuses to inline; the report lists them as restored. The shrunk archive replaces the original only when ProGuard succeeded and the result is smaller.

The shrink can be switched off four ways. `-PvolmitPackaging=dev`, or the environment variable `VOLMIT_PACKAGING=dev`, selects development packaging for every project in that build: the shrink is skipped and the size gate is downgraded to a warning, so a local jar that is over budget still builds. `-PvolmitShrink=false` or `VOLMIT_SHRINK=false` disables only the shrink and leaves the size gate enforcing. `shrink = false` inside an artifact block disables it for one artifact. `"modded": true` on a policy profile disables it for that profile; Iris Fabric, Forge, and NeoForge are modded profiles. The report records which of these applied. Development packaging is never the default, cannot be declared by a policy profile or an artifact block, and accepts only `dev` or `release`; any other value fails the build at plugin application. Every other audit check still fails the build in development packaging, including required entries, duplicate entries, CRC and size integrity, forbidden bundled packages, and the logging policy, and a non-modded profile still cannot declare a `max_bytes` above the cap. Each verified development jar prints a `DEVELOPMENT packaging` line naming the flag and the advisory budget, and its `<artifact>.json` records `"mode": "dev"`, the skip reason in `shrink.reason`, and the budget overage in `warnings` rather than `errors`. Release builds record `"mode": "release"` and an empty `warnings` list.

### Dependency pruning and compaction

Pruning follows Shadow's existing minimization. It removes unreachable classes only from explicitly selected VolmLib packages. All plugin-owned classes remain roots. The analysis follows bytecode, constant pools, descriptors, signatures, annotations, exact reflective class-name strings, nested classes, and service providers. Computed reflection names need explicit keep rules. Iris retains its Matter slices and leaves generated Caffeine classes outside pruning.

Compilation omits local-variable debug tables while retaining source locations and parameter names. Projects that already disable debug metadata keep that setting. Adapt, BileTools, Gloss, HiddenOre, Iris Bukkit, React, and ShapedPortals also strip local-variable tables from bundled dependency classes after shading and omit archive directory entries. This preserves executable instructions, annotations, source locations, parameter names, and resources. Archive compaction verifies content and replaces the archive only when smaller.

### Size gate

Every final non-modded plugin distribution must fit the Spigot upload cap of 7,600,000 bytes. A non-modded profile cannot declare `max_bytes` above that cap; the build fails at configuration time if one does. The audit enforces the smaller of the profile's `max_bytes` and the cap on the final archive, so plugins with tighter budgets keep them. Intermediate archives receive size warnings and retain all content checks. Modded profiles keep their own larger budgets. Each archive must also pass its required-entry checks, duplicate checks, CRC checks, and forbidden-package checks. Cached archives receive validation too. A failed archive build prevents dependent staging tasks.

Canonical budgets, required entries, `modded` flags, `shrink_keep` rules, and `shrink_dontwarn` patterns live in `VolmLib/packaging/src/main/resources/art/arcane/volmit/packaging/artifact-policies.json`. Each plugin selects its policy, dependency keep rules, extra ProGuard include files (`shrinkRules`), extra library jars (`shrinkLibraries`), and relocation mappings (`shrinkRelocations`) in `pluginPackaging` inside its build file. Review a size increase before changing its budget.

Reports under `build/reports/packaging/` record before/after sizes, removed classes, package sizes, resource bytes, and archive overhead; `<artifact>.json` identifies the jar in its `artifact` field by file name rather than by absolute path, so a report restored from the build cache in another checkout still names the archive sitting beside it. `<artifact>.json` carries a `shrink` block with the applied state or skip reason, bytes before and after, the removed class count, the restored advice classes, and the tolerated warnings. `<artifact>-shrink-rules.txt`, `-seeds.txt`, `-usage.txt`, `-configuration.txt`, and `-warnings.txt` hold the generated rules, the ProGuard seeds, everything ProGuard removed, the effective configuration, and the classified warnings. Reports are local build output.

To build and check a plugin without staging, run from its project directory:

```bash
./gradlew verifyPluginJars
```

For Iris, that command covers Bukkit. Use `verifyBukkitArtifact verifyModdedArtifacts` to assemble and check all four platform jars without staging.

Adapt, BileTools, Gloss, HiddenOre, Iris Bukkit, React, and ShapedPortals release builds enable stronger compression by default.

Release compression compares Zopfli with level-9 DEFLATE for each entry and keeps the smaller result. Verified results are reused from `caches/volmit-packaging/compression/` under the Gradle user home, including across temporary source copies. An empty cache requires the full compression pass. Decompressed contents are verified before reuse and before replacing the archive. The compressor runs entirely in the Gradle JVM and adds no runtime dependency. Development packaging skips stronger compression by default in these projects. Set `-PcompactRelease=true` or `false` to override the choice. Compression is an archive-task input, so changing it rebuilds the jar. Reports record both metadata stripping and release compression.

To inspect an existing jar without building or modifying it, run from the workspace:

```bash
python3 gradle/jar_audit.py PluginOuts/Gloss-3.0.4-26.2.jar \
  --report .buildlogs/jar-audit-gloss.json
```

The standalone audit uses the same policy catalog and also lists the SlimJar runtime dependency coordinates. Runtime downloads reduce the distributed jar size but still require library files on the server.

## Logging policy check

The packaging plugin also registers `verifyLoggingPolicy` and wires it into `check`. It scans every main source directory line by line for `System.out`, `System.err`, `printStackTrace(`, `Throwable::printStackTrace`, `Bukkit.getLogger(`, `getServer().getLogger(`, and `getConsoleSender().sendMessage(`. A match fails the build and prints the file path, line number, pattern, and offending text, and the task writes `build/reports/logging-policy.txt`.

Exemptions live in `logging-policy-allowlist.txt` at the project root, one `<path>` or `<path> <pattern>` per line. A trailing `/` on the path exempts a subtree and `#` starts a comment. An entry that no longer matches anything fails the build, so exemptions only shrink. A plugin appends patterns with `forbid(...)` or replaces them with `forbiddenPatterns` inside `pluginPackaging { loggingPolicy { ... } }`, and can point `allowlistFile` or `sourceDirectories` elsewhere.

## Native access check

`verifyNativeBoundary` runs as part of `check`. It scans main Java sources in the project and its subprojects. Native Minecraft, CraftBukkit, Moonrise, and server-configuration references must live in VolmLib native implementation packages.

Use [Native server access](/volmlib/api/native-access) interfaces from plugin code. The check also accepts native sources supplied by VolmLib for mod-loader compilation. Test fixtures are outside this check.

The packaging plugin retains version providers declared by bundled `NativeBinding` capability interfaces during shrinking and dependency pruning. Relocated native packages are supported. Broad keep rules for the entire native library are unnecessary.
