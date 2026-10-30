---
title: "Workspace builds"
description: "Parallel plugin builds, test workers, local dependencies, and build logs"
published: true
date: 2026-10-30T00:00:00.000Z
tags: "volmlib, development, builds, testing"
editor: markdown
dateCreated: 2026-09-03T03:00:00.000Z
---

[Multiplexor](/servermultiplexor/13-project-builds) discovers each project's Gradle targets and builds them from captured local sources. It gives each target separate writable project and dependency copies, including VolmLib, so compatible targets can compile concurrently. Use Java 25 and the additional toolchains required by the selected platform.

## Build workspace projects

Run from the Multiplexor workspace:

```sh
./start.sh projects scan /path/to/VolmitSoftware
./start.sh projects plan --all --all-targets
./start.sh projects build --all --all-targets --jobs 4 --memory 16384 --workers 8
./start.sh projects build adapt --target bukkit --wait
```

The declarations cover Adapt, BileTools, Gloss, HiddenOre, Husk, Iris, React, ShapedPortals, VolmLib, and Wormholes. Iris, Husk, and Wormholes expose loader and Minecraft targets individually. VolmLib's library and native adapter targets can be built independently. Each declaration selects the final verified artifact, including remapping and packed runtime jars.

Source snapshots include uncommitted changes and untracked source files. The manager captures declared local dependencies with each target: Adapt includes Iris and HiddenOre as well as VolmLib. ShapedPortals waits for `wormholes:api` and receives its verified compile-time artifact. A failed target blocks dependents while independent targets continue.

`projects status` shows run IDs and results; `projects logs <run> --target adapt:bukkit --follow` follows a target. `projects retry <run>` uses the captured sources from that run. Start another build to include source edits, or add `--changed` to reuse successful artifacts only when their sources, declarations, toolchain, dependencies, and hashes match.

Gradle writes artifacts under its build directories. To export runtime jars, register a named destination and preview the delivery:

```sh
./start.sh projects destination plugins-out --path /path/to/pluginsOut
./start.sh projects deploy <run> --to plugins-out --preview
./start.sh projects deploy <run> --to plugins-out
```

Managed instances and consumer drop-ins are also available as explicit destinations. See [Project builds](/servermultiplexor/13-project-builds) for destination filters, resource limits, and the `ext.multiplexor` declaration.

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

Use `com.github.VolmitSoftware.VolmLib:volmlib-localization:<version>` for language catalogs, validated message editing, locale downloads, and personal language preferences without a Bukkit dependency. Use `com.github.VolmitSoftware.VolmLib:volmlib-web:<version>` for `MclogsClient`. Use `com.github.VolmitSoftware.VolmLib:volmlib-crypto:<version>` for `Ed25519`, `Ed25519KeyFiles`, `Ed25519Tls`, and `IpRange` with no other dependencies; `shared` already contains these classes. Keep these modules on the same VolmLib version as `shared` and the native modules.

Local composite builds substitute `volmlib-localization` with `:localization`, `volmlib-web` with `:web`, and `volmlib-crypto` with `:crypto`. Builds using remote coordinates need those modules published at the selected revision. A dependency declared with `transitive = false` must list every module it bundles explicitly.

## Build selected plugin jars

Run `./gradlew packedJar` from a plugin project to write its selected jar to `build/libs/` under the artifact's normal file name. React's project root is `React/React/`. BileTools and Gloss produce one selected jar for both their server and Velocity editions, and Wormholes produces one for its server, Velocity, and BungeeCord editions.

Each build compares the complete ordinary package with its XZ package and writes only the smaller candidate to `build/libs/`. The ordinary candidate is built in `build/tmp/packaging/<artifact>/`. Selection is automatic and needs no flag. Iris includes the native adapters in both candidates, so either selected format remains portable.

When XZ wins, startup verifies and extracts the bundled runtime into the plugin's writable `cache/runtime/` directory. Later starts verify and reuse that cache. The ordinary format loads directly without extraction. Required external libraries retain their normal download and cache behavior.

`assemble` and `build` also produce the selected artifact in `build/libs/`. Multiplexor captures the exact final path declared by the project and exports only artifacts with the `runtime` role. BileTools and Gloss use the same combined jar on their supported servers and Velocity. Mod jars identify their loader and Minecraft target. Maven and API artifacts remain ordinary jars for compile-time use. Test fixtures and Iris mod jars are not packed. Install only one artifact for each plugin.

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

`packedPayloadOnlyPrefixes` defaults to an empty list. Configure resource directories needed only after plugin bootstrap to keep their complete contents in the compressed runtime without duplicating them in the outer jar:

```groovy
packedPayloadOnlyPrefixes = ['linux/x64/org/lwjgl/', 'iris-language-guides/']
```

Prefixes use relative archive paths with a trailing `/`, without empty, `.` or `..` path segments. Matching classes, required artifact entries, native-provider manifests, license or notice files, and any prefix under `META-INF/` are rejected. Plugin descriptors, service registrations, and generation metadata remain in the outer jar. Runtime classloader resource lookup exposes payload resources after bootstrap. If the ordinary jar is selected, every resource remains in that jar. Prefixes are declared build inputs, so changing them rebuilds the selected distribution.

With one packed artifact, the task is `packedJar`. Multiple packed artifacts get a `packed<ArtifactName>Jar` task each. Output uses the producer's configured directory and file name, whichever format is selected. The producer task writes its ordinary jar to `build/tmp/packaging/<artifact>/` instead.

## Native implementation boundaries

The packaging plugin checks Java sources and compiled classes for Minecraft and CraftBukkit references. By default these references are permitted only inside `art.arcane.volmlib.nativelib` and its subpackages. Plugin-specific native adapters may declare additional implementation packages:

```kotlin
extensions.configure<art.arcane.volmit.packaging.PluginPackagingExtension> {
    nativeImplementationPackages.add("com.example.plugin.nativeadapter.v1_21_1")
}
```

Declarations must be qualified Java package names with at least three segments. Blank values, wildcards, and path syntax are rejected. Matching includes the exact package and its descendants, but excludes similarly named sibling packages. Source and bytecode checks use the same policy and rerun when it changes.

Keep these declarations limited to implementation packages. Public contracts and gameplay logic must retain portable types; declaring the whole gameplay package would defeat that separation. For a multi-module plugin, include every runtime module's sources and class outputs in the verification tasks.

## Parallel builds and tests

Multiplexor's `--jobs`, `--memory`, and `--workers` limits apply across selected targets. Each target declares its memory and worker requirements. Set `sandbox: 'per-target'` and `parallelTargets: true` in its project declaration to permit targets from that project to overlap. Local composite build outputs and Gradle user homes remain separate for each target. See [Build isolation and limits](/servermultiplexor/13-project-builds#build-isolation-and-limits).

Use an individual project's wrapper for standalone tasks:

```sh
./gradlew test
./gradlew build
```

For Iris's shared mod tests, use `./gradlew moddedTest`. Its `verifyModdedMatrix` task builds and checks the loader targets declared in `gradle/mod-targets.json`; each jar is written to `adapters/<loader>/build/<minecraft-version>/libs/`. Gradle runs on Java 25, with a Java 21 toolchain also required for the 1.21.1 target.

## Local dependencies and logs

Standalone plugin builds locate VolmLib by walking up from their project root. Set `-PlocalVolmLibDirectory=/path/to/VolmLib` or `VOLMLIB_DIR` to select a checkout explicitly. Use `-PuseLocalVolmLib=false` only when remote dependency resolution is intended.

Managed builds use the captured local dependencies and retain per-target logs, exit codes, durations, and artifact hashes with the run. Source snapshots, working copies, logs, artifacts, and Gradle caches live under Multiplexor's [project build storage](/servermultiplexor/13-project-builds#dashboard-and-storage).

## Automatic jar thinning

Every plugin build applies the `art.arcane.volmit-packaging` Gradle plugin from VolmLib's `packaging` module. The local VolmLib composite supplies this build dependency. Builds without the local checkout need the matching published packaging artifact.

The plugin runs directly on each distributable archive task, including all four Iris platforms. Normal `shadowJar`, `jar`, and build commands use it without a workspace init script. It adds no build-tool classes to the runtime jar.

Packaging runs three passes inside the archive task, in this order: a ProGuard shrink, VolmLib dependency pruning, and archive compaction. The archive is final when the task completes.

### ProGuard shrink

Director parameter handlers are retained as reflective command entry points, including nested handlers referenced by parameter annotations. Their nest membership remains intact, so packaged handlers can call private methods on their enclosing command class.

Non-modded profiles pass the assembled archive through ProGuard 7.10 in shrink-only mode (`-dontobfuscate -dontoptimize`), so package, class, and member names never change. The pass removes classes and members that nothing reachable references. Generated keep rules start from these entry points and reflective uses:

- The `main`, `bootstrapper`, and `loader` classes declared in `plugin.yml` and `paper-plugin.yml`.
- Every `keepPrefixes` entry and `required_entries` class.
- Every `META-INF/services` interface and provider.
- Classes named by string constants in bytecode or text resources.
- Annotation types, constructors of retained classes, enum `values` and `valueOf`, and record members.
- Members with Gson `SerializedName`/`Expose` or `ConfigDoc`/`ConfigDescription` annotations, and fields in classes named `*Config*` or `*Settings*`.
- `EventHandler` and `Subscribe` methods, Java serialization hooks, and `ConfigurationSerializable` hooks.
- Shared reflective families matched by `**.slimjar.**`, `**.bstats.**`, `**.packetevents.**`, `**.bytebuddy.**`, `**.caffeine.**`, `**.director.**`, `**.matter.slices.**`, and `**.papi.**`.
- Classes and members annotated with `**.director.annotations.Director` or `Param`.
- Per-profile `shrink_keep` rules from `artifact-policies.json`.

Iris Bukkit keeps its annotated pack models, NMS bindings, scanned services, command handlers, mantle components, SIMD kernels, and embedded agent. The artifact gate requires each command handler and mantle component discovered in the source packages.

The library classpath is the JDK of the Gradle JVM (exported once from the runtime image into `<gradle user home>/caches/volmit-packaging/`) plus the project's resolved `compileClasspath`. Library jars whose class entries overlap the archive, such as project-built modules already shaded in, are excluded automatically.

A build can add more library jars with `shrinkLibraries.from(...)` inside its artifact block; projects whose NMS bindings live in a subproject add that subproject's compile classpath so preverification sees the server hierarchy. `shrinkRelocations` maps original packages to their relocated names so runtime-downloaded SlimJar libraries are analysed under the relocated hierarchy the jar actually references.

Unresolved references fail the build unless the referenced or referencing class matches a shared default (`javax.annotation.**`, `org.jetbrains.annotations.**`, `org.checkerframework.**`, `edu.umd.cs.findbugs.annotations.**`, `com.google.errorprone.annotations.**`, `kotlin.**`, `android.**`, `dalvik.**`, `org.apache.logging.log4j.**`, `java.lang.invoke.**`, `me.clip.placeholderapi.**`, `lombok.**`) or a per-profile `shrink_dontwarn` pattern; every tolerated warning is listed in the JSON report.

Classes that carry ByteBuddy `Advice` annotations are kept whole and their original bytes are written back over ProGuard's output, because the preverifier rewrites their stack-map frames in a form ByteBuddy refuses to inline; the report lists them as restored. The shrunk archive replaces the original only when ProGuard succeeded and the result is smaller.

Four controls can disable shrinking:

| Control | Effect |
|---|---|
| `-PvolmitPackaging=dev` or `VOLMIT_PACKAGING=dev` | Select development packaging for the build. Skip shrinking and report size overages as warnings |
| `-PvolmitShrink=false` or `VOLMIT_SHRINK=false` | Skip shrinking and continue enforcing the size gate |
| `shrink = false` in an artifact block | Skip shrinking for that artifact |
| `"modded": true` in a policy profile | Skip shrinking for that profile. Iris Fabric, Forge, and NeoForge use this setting |

The report records which control applied. Development packaging is never the default, cannot be declared by a policy profile or an artifact block, and accepts only `dev` or `release`; any other value fails the build at plugin application.

Every other audit check still fails the build in development packaging, including required entries, duplicate entries, CRC and size integrity, forbidden bundled packages, and the logging policy, and a non-modded profile still cannot declare a `max_bytes` above the cap. Each verified development jar prints a `DEVELOPMENT packaging` line naming the flag. Non-modded jars also report their advisory budget and any size overage. Modded jars have no size budget or size warnings. Reports record `"mode": "dev"` and the shrink skip reason in `shrink.reason`. Release builds record `"mode": "release"` and an empty `warnings` list.

### Dependency pruning and compaction

Pruning follows Shadow's existing minimization. It removes unreachable classes only from explicitly selected VolmLib packages. All plugin-owned classes remain roots. The analysis follows bytecode, constant pools, descriptors, signatures, annotations, exact reflective class-name strings, nested classes, and service providers. Computed reflection names need explicit keep rules. Iris retains its Matter slices and leaves generated Caffeine classes outside pruning. Bundled VolmLib native noise libraries are removed when their native library loader class is absent after pruning. Libraries remain byte-identical when the loader is retained, including relocated and multi-release classes.

Compilation omits local-variable debug tables while retaining source locations and parameter names. Projects that already disable debug metadata keep that setting. Adapt, BileTools, Gloss, HiddenOre, Iris Bukkit, React, and ShapedPortals also strip local-variable tables from bundled dependency classes after shading and omit archive directory entries. This preserves executable instructions, annotations, source locations, parameter names, and resources. Archive compaction verifies content and replaces the archive only when smaller.

### Size gate

Every final non-modded plugin distribution uses the same 7,500,000-byte upload cap. All bundled plugin profiles set `max_bytes` to 7,500,000, and project builds use that ceiling without smaller plugin-specific budgets. A non-modded profile cannot declare `max_bytes` above the cap; the build fails at configuration time if one does. Intermediate archives receive size warnings and retain all content checks; the cap is enforced on their final distribution. Fabric, Forge, and NeoForge distributions have no size restriction. Their profiles use `"modded": true` and omit `max_bytes`. Each archive must also pass its required-entry checks, duplicate checks, CRC checks, and forbidden-package checks. Cached archives receive validation too. A failed archive build prevents dependent build targets and artifact collection.

Canonical profiles, required entries, `modded` flags, `shrink_keep` rules, and `shrink_dontwarn` patterns live in `VolmLib/packaging/src/main/resources/art/arcane/volmit/packaging/artifact-policies.json`. Each plugin selects its policy, dependency keep rules, extra ProGuard include files (`shrinkRules`), extra library jars (`shrinkLibraries`), and relocation mappings (`shrinkRelocations`) in `pluginPackaging` inside its build file. Use `authoritativeShrinkLibraries.from(...)` when a separately shipped library contains patched definitions that replace inherited compile-classpath definitions. These jars resolve first; unrelated inherited types remain available. Missing authority, overlap with program classes, or competing authoritative definitions fails the build. An authority generated inside the archive task must be registered as that task’s output and produced before shrinking.

Reports under `build/reports/packaging/` record before/after sizes, removed classes, package sizes, resource bytes, and archive overhead; `<artifact>.json` identifies the jar in its `artifact` field by file name rather than by absolute path, so a report restored from the build cache in another checkout still names the archive sitting beside it. `<artifact>.json` carries a `shrink` block with the applied state or skip reason, bytes before and after, the removed class count, the restored advice classes, and the tolerated warnings. `<artifact>-shrink-rules.txt`, `-seeds.txt`, `-usage.txt`, `-configuration.txt`, and `-warnings.txt` hold the generated rules, the ProGuard seeds, everything ProGuard removed, the effective configuration, and the classified warnings. Reports are local build output.

To build and check a plugin, run from its project directory:

```bash
./gradlew verifyPluginJars
```

For Iris, that command covers Bukkit. Use `verifyBukkitArtifact verifyModdedArtifacts` to assemble and check all four platform jars in their build directories.

The shared packaging plugin enables stronger compression by default for every release artifact. Plugin build files do not need a compression declaration. `-PcompactRelease=true` or `false` sets the shared default; an explicit artifact-level `releaseCompression` setting takes precedence.

Release compression compares Zopfli with level-9 DEFLATE for ordinary jar entries and the packed jar's bootstrap entries. Packed runtimes also compare XZ preset 9 with deeper-search settings and keep the smallest result. The complete ordinary and packed candidates still compete for the final artifact. Stronger compression spends more build CPU without changing runtime contents, extraction settings, or the size limit.

Verified DEFLATE results are reused from `caches/volmit-packaging/compression/` under the Gradle user home, including across temporary source copies. An empty cache requires the full compression pass. Decompressed contents are verified before reuse and before replacing the archive. The compressors run entirely in the Gradle JVM and add no runtime dependency. Development packaging skips stronger compression by default. Compression is a declared input of both the archive and packed-jar tasks, so changing it rebuilds the affected jars. Reports record both metadata stripping and release compression.

For Iris, build the release artifact with stronger compression from its project root:

```bash
./gradlew packedJar -Prelease -PvolmitPackaging=release
```

Keep shrinking enabled for the smallest release artifact; remove any `VOLMIT_SHRINK=false` environment override or `-PvolmitShrink=false` argument.

To inspect an ordinary jar without building or modifying it, run from the workspace:

```bash
python3 gradle/jar_audit.py "Gloss/build/libs/Gloss-<version>.jar" \
  --report Gloss/build/reports/packaging/standalone-audit.json
```

The standalone audit uses the same policy catalog and also lists the SlimJar runtime dependency coordinates. Runtime downloads reduce the distributed jar size but still require library files on the server.

## Logging policy check

The packaging plugin also registers `verifyLoggingPolicy` and wires it into `check`. It scans every main source directory line by line for `System.out`, `System.err`, `printStackTrace(`, `Throwable::printStackTrace`, `Bukkit.getLogger(`, `getServer().getLogger(`, and `getConsoleSender().sendMessage(`. A match fails the build and prints the file path, line number, pattern, and offending text, and the task writes `build/reports/logging-policy.txt`.

Exemptions live in `logging-policy-allowlist.txt` at the project root, one `<path>` or `<path> <pattern>` per line. A trailing `/` on the path exempts a subtree and `#` starts a comment. An entry that no longer matches anything fails the build, so exemptions only shrink. A plugin appends patterns with `forbid(...)` or replaces them with `forbiddenPatterns` inside `pluginPackaging { loggingPolicy { ... } }`, and can point `allowlistFile` or `sourceDirectories` elsewhere.

## Native access check

`verifyNativeBoundary` runs as part of `check`. It scans main Java sources in the project and its subprojects. Native Minecraft, CraftBukkit, Moonrise, and server-configuration references must live in VolmLib native implementation packages.

Use [Native server access](/volmlib/api/native-access) interfaces from plugin code. The check also accepts native sources supplied by VolmLib for mod-loader compilation. Test fixtures are outside this check.

The packaging plugin retains version providers declared by bundled `NativeBinding` capability interfaces during shrinking and dependency pruning. Relocated native packages are supported. Broad keep rules for the entire native library are unnecessary.
