---
title: "Multiplexor: Project builds"
description: "Discover Gradle targets, build isolated source snapshots, and deliver verified artifacts"
published: true
date: 2026-10-28T00:00:00.000Z
tags: servermultiplexor, development, builds
editor: markdown
dateCreated: 2026-10-21T00:00:00.000Z
---

Multiplexor builds declared Gradle projects in separate working copies and records their artifacts, logs, and results. A project can expose plugins, loader and Minecraft version combinations, APIs, and libraries. Each successful target automatically delivers compatible runtime artifacts to saved directory and drop-ins destinations, including when it reuses verified artifacts.

## Register and select projects

Run these commands from the Multiplexor workspace. Downloaded executables accept the same arguments through `multiplexor` or `multiplexor.exe`.

```sh
./start.sh projects scan /path/to/VolmitSoftware
./start.sh projects list
./start.sh projects plan iris --all-targets
./start.sh projects plan iris --target bukkit,fabric-26.3
./start.sh projects plan --targets iris:bukkit,biletools:bukkit
./start.sh projects build iris --target fabric-26.3 --wait
./start.sh projects build iris --target bukkit,fabric-26.3 --jobs 2 --wait
./start.sh projects build --targets iris:bukkit,biletools:bukkit --jobs 2 --wait
./start.sh projects build iris --target bukkit --packaging compact --wait
./start.sh projects build --all --all-targets --jobs 4 --memory 16384 --workers 8
```

Scan a source directory containing the projects and their local dependencies. Discovery finds Gradle roots that contain a wrapper and `gradle/multiplexor.gradle`, reads their declarations in temporary source copies, and saves a catalog in the active Multiplexor workspace. Scan again to register new projects or a changed project ID.

Each build captures current sources, including build declarations. When a captured project's Gradle scripts, properties, version catalogs, or JSON files differ from its catalog entry, the build reads that project's declaration from the captured copy, builds its current targets and artifact paths, and updates the catalog. Version bumps, target matrix changes, and build settings apply on the next build without a scan. A selected target that the current declaration no longer contains fails, and newly required targets and source dependencies join the run. If a changed declaration cannot be read, that project's targets fail with the Gradle output in their log, targets that require them are blocked, and other targets continue.

Select a project by its ID or display name. `--target <id,...>` selects one or more target IDs separated by commas. Each ID must be non-empty and unique. Without `--target`, all targets in the selected project are selected. `--all` selects every registered project.

Use `--targets <project:target,...>` to select exact targets across projects, such as `iris:bukkit,biletools:bukkit`. Each complete key must be non-empty, unique, and present in the catalog. This option cannot be combined with a project argument, `--target`, `--all`, or `--all-targets`. Required artifact-producing targets are included automatically. `plan` lists the resulting targets without building them.

| Command | Form |
|---|---|
| Set up | `projects init <path> [--id <id>] [--name <name>] [--java <major>] [--apply] [--json]` |
| Plan | `projects plan [project] [--all] [--target <id,...>] [--all-targets] [--targets <project:target,...>] [--json]` |
| Build | `projects build [project] [--all] [--target <id,...>] [--all-targets] [--targets <project:target,...>] [--changed] [--packaging <local\|compact>] [--jobs <count>] [--memory <total-MiB>] [--workers <total-count>] [--wait] [--json]` |
| Scan | `projects scan <path> [--json]` |
| List | `projects list [--json]` |
| Limits | `projects limits [--jobs <count>] [--memory <total-MiB>] [--workers <total-count>] [--json]` |
| Status | `projects status [run] [--json]` |
| Logs | `projects logs <run> [--target <project:target>] [--follow]` |
| Cancel | `projects cancel <run>` |
| Retry | `projects retry <run> [--packaging <local\|compact>] [--wait] [--json]` |
| Destinations | `projects destinations [--json]` |
| Destination | `projects destination <name> (--path <path>\|--instance <name>\|--dropins) [--platform <platform>] [--mc <version>] [--json]` |
| Remove destination | `projects destination <name> --remove [--json]` |
| Deliver | `projects deploy <run> --to <name> [--target <project:target>] [--preview] [--json]` |
| Dashboard | `projects dashboard` |

| Project | Targets |
|---|---|
| Adapt, HiddenOre, React, ShapedPortals | `bukkit` |
| BileTools | `bukkit`, producing the combined server and Velocity jar |
| Gloss | `bukkit` for the combined server and Velocity jar; `api` |
| Iris | `bukkit`, `api`, `spi`, and `fabric-<version>`, `forge-<version>`, `neoforge-<version>` |
| Wormholes | `core` for the shared core and optics checks, `bukkit`, `api`, `proxy`, and one target per loader and Minecraft version; Bukkit and loader targets require `core` |
| Husk | `core` for the shared runtime checks, `bukkit`, and one target per loader and Minecraft version; Bukkit and loader targets require `core`, and Forge 1.20.1 also serves NeoForge 1.20.1 |
| VolmLib | `library`, `native-common`, and one target per native server adapter |

`projects list --json` contains the exact target IDs, tasks, requirements, and artifact paths from the registered checkout. Install the JDKs and any native toolchains required by the selected targets. The Volmit Gradle wrappers run on Java 25; older Minecraft targets can also require Java 17 or 21 toolchains.

The wrapper uses the inherited `JAVA_HOME`, and Gradle resolves each project's compilation toolchains. The target's `java` metadata declares its requirement; it does not select the wrapper's Java executable.

Builds expose installed JDKs as `JAVA_HOME_<major>` for dependency tools such as Forge's Mavenizer. Discovery uses `JAVA_HOME`, the macOS Java installation list, and `/usr/lib/jvm` on Linux. A discovered home must contain Java, the Java compiler, and version metadata from its release file or macOS bundle. Explicit `JAVA_HOME_<major>` values take precedence. Selected JDK version metadata and explicit overrides participate in artifact reuse checks.

## Build isolation and limits

Each run captures current source files, including uncommitted changes and untracked source files. Git-ignored files, build output, Gradle caches, Git metadata, environment files, and local tooling output are excluded. A source symlink must resolve inside the registered source root. Keep sources stable while capture is in progress.

Each target receives a writable copy of its project and the full set of declared local source dependencies. Local VolmLib, Iris, and HiddenOre composite paths point into that copy. Targets use separate Gradle user homes, retained for later runs, so their writable build directories and Gradle locks do not overlap. These are source working copies on the host, not containers or a security boundary.

Projects can declare additional files or directories through `sourceInputs`, relative to the registered source root. These inputs must exist and remain inside that root, including symlink destinations. They are captured with the run and copied to the same relative paths in every relevant target's sandbox. Changes to them invalidate artifact reuse. For example, Adapt includes `docs/adapt` for its documentation checks. The Gradle tasks that read these files must also declare them as task inputs so Gradle can invalidate cached outputs.

A target that needs a produced API jar waits for its declared dependency. For example, `shapedportals:bukkit` waits for `wormholes:api` and receives that exact jar through `wormholesApiJar`. Source dependencies alone do not impose build ordering: each target compiles its own local composite as needed.

| Build option | Meaning | Built-in default |
|---|---|---|
| `--jobs <count>` | Maximum concurrent targets | Up to four, capped at logical CPU count |
| `--memory <MiB>` | Total memory reservations available to running targets | Half physical memory, bounded to 4096–65536 MiB; 8192 MiB if unavailable |
| `--workers <count>` | Total Gradle workers shared across running targets | Logical CPU count |
| `--wait` | Keep the command open until the run finishes and return its result | Return after queuing the run |
| `--changed` | Reuse matching successful artifacts; build other selected targets | Build each selected target |
| `--packaging <local\|compact>` | Select local or maximum-compression jar packaging | `compact` |

Save workspace defaults or inspect the current limits:

```sh
./start.sh projects limits --jobs 4 --memory 16384 --workers 8
./start.sh projects limits
```

Each supplied setting replaces its saved value; omitted settings remain unchanged. New builds use the saved limits, with command-line build flags taking precedence. Retry retains the original run's limits.

Ready targets start in order of their longest remaining dependency chain. Each target's duration is the median of its five most recent successful builds; a target without history counts as the longest known build. A target starts when a job slot, its declared memory reservation, and its worker allocation fit. When the first ready target in that order does not fit, its capacity is reserved: other targets start only if they are expected to finish before that capacity frees or if they fit beside it. The worker allocation is capped by the run's total and passed to Gradle through `--max-workers`. Iris mod targets divide that allocation among concurrent nested builds and use each share for the nested JVM's processor count. Test-fork limits preserve lower project settings and are capped by the allocated Gradle workers. Memory reservations govern scheduling; they are not an operating-system memory limit.

Iris Forge targets declare 8 Gradle workers and a 16384 MiB scheduling reservation. They use up to 4 test JVMs, capped by the allocated workers.

`--changed` compares captured project and local dependency sources, additional source inputs, the target declaration, packaging mode, toolchain and host details, and dependency artifact hashes. Reuse also requires the saved artifact files to pass their recorded size and SHA-256 checks. A changed or missing input causes a build.

Project builds default to Compact packaging, which passes `-PcompactRelease=true` for aggressive compression. Select `--packaging local` to pass `-PcompactRelease=false`. Local mode uses faster compression for the supported Volmit targets. A packed jar that exceeds its size limit also tries compact ZIP compression before enforcing that limit. Compact mode spends more work compressing release jars. Both run the declared tests, shrinking, and artifact-size checks. The mode applies to every target in the run and is recorded with the run.

Gradle task caching is enabled for builds in either packaging mode. Targets share a local task-output cache while retaining separate writable Gradle homes. Completed local builds supply reusable wrapper distributions and a read-only dependency-cache snapshot for later targets. Iris Forge targets retain their Minecraft dependency cache in their private Gradle homes across sandbox builds. Turning artifact reuse off still allows Gradle to reuse valid task outputs when it runs.

Sandbox builds pass `-Ppaperweight.experimental.genSources=false` by default. Paperweight prepares binary Minecraft dependencies without decompiling or attaching Minecraft sources. Compilation and declared tests remain enabled. This worker default does not affect ordinary builds or IDE use in the original checkout.

When Minecraft sources are needed, add `'-Ppaperweight.experimental.genSources=true'` to the target's `arguments` list; the next build reads the changed declaration. Iris forwards the property into its nested builds.

Only one project run is active per Multiplexor workspace. Its worker continues when the dashboard or invoking terminal closes. A failed target blocks its dependents while independent targets continue.

## Inspect and control runs

```sh
./start.sh projects status
./start.sh projects status <run> --json
./start.sh projects logs <run> --target iris:fabric-26.3 --follow
./start.sh projects cancel <run>
./start.sh projects retry <run> --wait
```

Status includes each target's state, current Gradle task, log path, collected artifacts, and delivery results. JSON job records expose `deliveries` and `deliveryError`. Delivery failures appear in target logs and the dashboard and make the run fail, so `--wait` exits nonzero. The compiled artifacts remain reusable, and other builds and destinations continue. Logs can be selected by the complete `project:target` key. Cancellation stops the run's active builds and prevents queued targets from starting.

Retry uses the previous run's captured source snapshot, additional source inputs, target declarations, and packaging mode. When the previous run stopped before capturing its sources, retry captures the current sources and keeps the run's artifact reuse setting. Use `--packaging local` or `--packaging compact` to select a different mode for the retry. Reuse applies the same full comparison as `--changed`: captured inputs, target declaration, packaging mode, toolchain and host details, and dependency artifact hashes must match. Successful artifacts are verified and copied into the new run; other targets rebuild. Use `build` to capture source and declaration edits.

## Named destinations

Register a directory for exported jars, a managed instance, or a consumer's drop-ins:

```sh
./start.sh projects destination plugins-out --path /path/to/pluginsOut
./start.sh projects destination paper-test --instance paper-test --platform plugin
./start.sh projects destination fabric-dropins --dropins --platform fabric --mc 26.3
./start.sh projects destinations --json
```

The destination list shows saved names, kinds, paths, platforms, and Minecraft compatibility. Run `projects destination` with an existing name and the complete desired settings to replace that configuration. Remove a saved destination with `projects destination <name> --remove`; this removes configuration only and leaves jars and ownership records at the destination unchanged. `--remove` cannot be combined with destination settings.

A directory can receive all runtime artifacts or filter them with `--platform` and `--mc`. Every successful target delivers compatible runtime artifacts to all saved directories and drop-ins destinations. Verified artifact reuse also triggers delivery. Drop-ins require a platform and exact Minecraft version; their usual subscriptions and watcher behavior apply when jars change.

Managed instance destinations require manual delivery. An instance supplies its platform and Minecraft version from server metadata and must be stopped and unlocked, including for preview.

In the dashboard, **LOCATIONS** (`o`) shows the saved location selector and editable fields on one screen. Wide terminals also show the saved list on the left; compact terminals keep the selector above the fields. Use Up/Down or Tab to move focus, Left/Right to cycle locations, kinds, or platforms, and Enter or a field click to edit text inline. Enter accepts a text edit; Esc cancels it. Existing location names remain fixed. **Minecraft version** is the delivery compatibility filter. An export directory may use **Any version (optional)**. A blank instance value uses server metadata, and an entered value must match the instance. Shared drop-ins require an exact version, such as `26.3`.

For an export directory, click **[...]** to the right of **Path**, or press `f` outside a text edit, to choose a folder. The native macOS or Windows dialog starts at the current path or its nearest existing parent; Linux desktop sessions use Zenity or KDialog when available. A choice changes the draft until **Save**. Cancel retains the path. Enter paths manually over SSH or when no desktop picker is available.

The editor actions are `a` **New**, `s` **Save**, `r` **Remove**, `p` **Preview**, and `q` **Back**. Leaving or selecting another location with unsaved edits asks whether to discard them. Removal requires confirmation and deletes configuration only. Preview requires a saved location without unsaved changes and a selected run; it uses the same delivery review and confirmation as the dashboard's delivery action. Saving a directory or drop-ins location enables delivery after subsequent successful targets; it does not deliver artifacts from existing runs. Shortcut letters are ordinary characters while editing a text field.

Use `projects deploy` to deliver an existing run, retry a failed delivery, or deliver to an instance. Preview the delivery, then run it without `--preview` to apply those actions:

```sh
./start.sh projects deploy <run> --to plugins-out --preview
./start.sh projects deploy <run> --to plugins-out
./start.sh projects deploy <run> --to paper-test --target iris:bukkit --preview
./start.sh projects deploy <run> --to paper-test --target iris:bukkit
```

The dashboard's delivery action presents saved destinations, then shows the same preview and asks for confirmation. With no destinations, choose **Add destination** or **Back**. After adding one, open delivery again to select it.

Delivery selects successful `runtime` artifacts, checks their saved hashes, and filters platform and Minecraft compatibility. APIs and libraries stay in the build run. Managed instance and drop-ins destinations accept at most one compatible target per project. Selecting multiple compatible targets from the same project makes automatic delivery to those drop-ins fail; deliver the intended target manually with `--target project:target`. Empty Minecraft compatibility lists accept any version; declared numeric ranges include both endpoints. Server-version ranges on combined server and Velocity jars apply to their server edition.

Drop-ins use `<project-id>.jar` for a project's first delivery and retain its existing managed filename for later deliveries, so subscribed instances replace the same jar across version updates. Export directories retain build filenames.

The preview lists installs, replacements, removals, and skipped incompatible artifacts. Delivery preserves unrelated files and refuses to overwrite an unmanaged jar or a managed jar changed outside Multiplexor. It replaces the recorded artifacts for the selected project or target, retaining other targets in an export directory. The destination's `.multiplexor-project-artifacts.json` tracks ownership and checksums. Multiplexor handles automatic and manual delivery after Gradle writes its build output.

Delivery prepares artifacts and retains rollback copies in the operating system's temporary directory. Temporary staging directories stay outside export folders, including cloud-synced destinations. Each finished file is promoted into its destination only after copying completes.

## Declare a Gradle project

Set up an existing Gradle root by previewing its declaration, applying it, and scanning it:

```sh
./start.sh projects init /path/to/Example --id example --name Example --java 25
./start.sh projects init /path/to/Example --id example --name Example --java 25 --apply
./start.sh projects scan /path/to/Example
```

The root must contain a Gradle wrapper and exactly one `build.gradle` or `build.gradle.kts`. Without `--apply`, initialization reads source files and reports candidate targets, exact file changes, and settings to review. It does not run Gradle or write files. `--apply` creates `gradle/multiplexor.gradle` and appends the appropriate Groovy or Kotlin apply statement to the root build file, preserving its existing content. Existing Multiplexor declarations are not overwritten. The CLI writes configuration only; run `projects scan` separately to register it. Add `--json` for the structured preview or result.

In **Projects**, press `i` or **CONVERT**, or choose **Convert Gradle project** from actions. Enter the root containing `gradlew` and `build.gradle` or `build.gradle.kts` to see the same preview. Confirming writes the declaration and then scans the project. Cancelling leaves its files unchanged.

Initialization recognizes these resource descriptors within a root or module:

| Descriptor under `src/main/resources/` | Platform |
|---|---|
| `plugin.yml`, `paper-plugin.yml` | Bukkit/Paper plugin |
| `fabric.mod.json` | Fabric |
| `META-INF/mods.toml` | Forge |
| `META-INF/neoforge.mods.toml` | NeoForge |
| `bungee.yml` | Bungee |
| `velocity-plugin.json` | Velocity |

Modules with Java, Kotlin, Scala, or Groovy sources and no runtime descriptor become library targets. Nested projects with their own wrapper are set up separately. Target declarations retain candidate directories; scanning keeps only directories belonging to configured Gradle projects and resolves their actual project paths, including renamed paths. Unincluded example and source folders are omitted from the registered targets.

Generated declarations use a separate sandbox for each target and allow targets to run in parallel within the build budget. During scanning, Gradle supplies the configured Java toolchain or source compatibility, the enabled archive task, and its exact output path. `--java <major>` supplies an explicit Java requirement. Each target includes its available `check` task and archive task: `remapJar` for Fabric, or `shadowJar`/`jar` for other modules, with the matching Forge reobfuscation task when present. Targets reserve 4096 MiB and two workers; edit their declarations to change those requirements.

Literal exact Minecraft versions from Fabric descriptors are retained. Other compatibility values require review in `minecraftVersions`; an empty list permits any version during delivery. Projects with custom packaging, version matrices, multiple runtime platforms in one module, local composite dependencies, or additional source inputs require explicit declarations for those settings. Use pure build/check tasks and keep delivery separate from Gradle tasks.

### Custom declarations

Apply the declaration from the root `build.gradle`:

```groovy
apply from: 'gradle/multiplexor.gradle'
```

The declaration contains a JSON-compatible map. For example, a plugin whose final build task produces the stated jar can declare:

```groovy
ext.multiplexor = [
    schema: 1,
    id: 'example',
    name: 'Example',
    sandbox: 'per-target',
    parallelTargets: true,
    sourceDependencies: ['volmlib'],
    sourceInputs: ['docs/example'],
    targets: [[
        id: 'bukkit',
        tasks: ['build'],
        arguments: [],
        java: 25,
        memoryMiB: 6144,
        workers: 2,
        dependsOn: [],
        artifacts: [[
            path: "build/libs/Example-${project.version}.jar",
            role: 'runtime',
            platforms: ['plugin'],
            minecraftVersions: ['26.1.2-26.3']
        ]]
    ]]
]
```

Set the map during configuration, `afterEvaluate`, or `gradle.projectsEvaluated` once the project's artifact names and matrix are available. Multiplexor supplies the metadata task; the project only supplies the map. Artifact paths must name the exact final files relative to the root, including remapping, shrinking, or packaging outputs.

| Field | Contract |
|---|---|
| `schema` | `1` |
| `id`, target `id` | Stable lowercase identifiers using letters, digits, dots, underscores, or hyphens; first character is a letter or digit |
| `name` | Display name |
| `sandbox` | `per-target` allows independently isolated targets; `project` runs at most one target from this project at a time |
| `parallelTargets` | Must be `true` with `per-target` to overlap targets from this project; `false` serializes them |
| `sourceDependencies` | Registered project IDs whose sources must be captured and copied with this project, including their transitive dependencies |
| `sourceInputs` | Optional unique file or directory paths relative to the registered source root; paths must stay below that root and cannot overlap project directories or other inputs |
| `tasks`, `arguments` | Explicit Gradle tasks and optional arguments; use pure build/check tasks |
| `java`, `memoryMiB`, `workers` | Required Java major and target resource requirements; defaults are 25, 4096 MiB, and 2 workers |
| `dependsOn` | Complete `project:target` keys that must succeed before this target runs |
| `artifactProperties` | Map from a Gradle property name to a dependency target that produces exactly one `api` artifact |
| Artifact `path`, `role` | Relative file path and `runtime`, `api`, or `library` role |
| Artifact `platforms` | Any of `plugin`, `fabric`, `forge`, `neoforge`, `velocity`, `bungee` |
| Artifact `minecraftVersions` | Exact dotted numeric versions or inclusive ranges; an empty list is unrestricted |

For example, a consumer can pair `dependsOn: ['wormholes:api']` with `artifactProperties: [wormholesApiJar: 'wormholes:api']`. To run checks for a module shared by several targets once per build, declare a target that runs those checks and add it to each consumer's `dependsOn`; Wormholes and Husk declare `core` this way. The manager passes the verified API path as a Gradle project property. Keep machine-specific output directories and server copies out of the declared tasks.

## Dashboard and storage

Open **PROJECTS** from the workspace card, choose **Projects dashboard** in Build & tuning, or run `./start.sh projects dashboard`. A project with one target appears as one direct checkbox row. Projects with multiple targets start collapsed in a tree with indentation and connectors. Two or more Fabric, Forge, or NeoForge targets for the same loader share a collapsible platform row with versions underneath; single loader targets stay directly under the project.

The dashboard omits a project from build choices when every target declares at least one artifact and every artifact has `role: 'library'`. Mixed projects retain all their targets. Required source dependencies, including VolmLib, are still captured and compiled automatically with their consumers. Standalone library builds remain available through the CLI; saved library jobs appear as inspectable history-only rows.

Use Right to expand a branch and Left to collapse it; Left on a leaf or collapsed branch focuses its parent. Enter or a disclosure click toggles a project or platform, while Enter on a target opens its actions. Press `m` or **MORE** to open actions at any tree level. Press `e` to expand all branches or `z` to collapse them all. The live output pane starts visible and follows the focused target. Press `t` to hide or show the pane. Tree width follows its labels when the panes sit side by side; in stacked layouts, a small tree leaves more rows for output. Log lines wrap within the pane.

Press Space or click a left checkbox to select one target or every buildable descendant of a project or platform, including collapsed rows. Checkboxes show `[ ]` for none, `[-]` for some, and `[X]` for all checked. Press `a` or click the all checkbox to check every listed buildable target, including collapsed branches and offscreen rows. Press `x`, or click the checked all checkbox, to clear the checks. The header shows the checked count, configured build limits, and whole-run elapsed time.

Elapsed time starts at submission, falling back to the start time if the submission time is unavailable, and includes queuing and preparation. Parallel jobs share one run timer. The total freezes on success, failure, or cancellation; interrupted runs use the last recorded heartbeat. The history menu shows the same duration when opened.

Press `b` or **BUILD**, then choose **Build N checked targets** to build the checked targets and their required dependencies. This is the default build choice when targets are checked. With no checks, the menu offers the focused target, its entire project, or **Every listed project and target**. The last choice selects only the dashboard's build catalog, excluding library-only projects. **Reuse verified artifacts** starts enabled; turn it off to run Gradle for every selected target. **Packaging** toggles between **Local** and **Compact**, starting at **Compact**. Choose these options before the build scope. Collapsing any branch preserves its checks. Checks survive refreshes, row reordering, and run-history changes. Targets removed from the dashboard build catalog lose their checks, and targets shown only in run history cannot be checked.

Press `p` or **LIMITS**, or choose **Build limits** from actions, to edit **Parallel builds**, **Total memory budget (MiB)**, and **Total Gradle workers**. Choose **Save limits** to save workspace defaults, or **Back** to discard the edits. Target requirements and the [run budget](/servermultiplexor/13-project-builds#build-isolation-and-limits) determine which targets can run together.

Checkboxes control build scope only. Each successful target automatically delivers compatible runtime artifacts to saved directory and drop-ins locations configured through **LOCATIONS** (`o`). Instance delivery and delivery of existing runs use the manual delivery action. **BACK**, `q`, or `Esc` returns to the previous view while builds continue. Build, limits, and location controls provide a Back action. Press `s` to scan a source folder or `i` / **CONVERT** to convert a Gradle project. The dashboard also offers run history, retry, cancellation, and delivery preview. See [Dashboard controls](/servermultiplexor/02-dashboard#project-builds).

Catalogs, build defaults, destinations, and run records live under `.manager-state/project-builds/` in the Multiplexor workspace. Source snapshots, target copies, artifacts, logs, and Gradle caches live under `~/.multiplexor/project-builds/<workspace-id>/`. Set `MULTIPLEXOR_BUILD_HOME` to choose the parent directory; the workspace-specific subdirectory is retained.

[All Multiplexor documentation](/servermultiplexor)
