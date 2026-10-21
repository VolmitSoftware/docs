---
title: "Multiplexor: Project builds"
description: "Discover Gradle targets, build isolated source snapshots, and deliver verified artifacts"
published: true
date: 2026-10-21T16:00:00.000Z
tags: servermultiplexor, development, builds
editor: markdown
dateCreated: 2026-10-21T00:00:00.000Z
---

Multiplexor builds declared Gradle projects in separate working copies and records their artifacts, logs, and results. A project can expose plugins, loader and Minecraft version combinations, APIs, and libraries. Delivery uses a named destination selected separately from the build.

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

Scan a source directory containing the projects and their local dependencies. Discovery finds Gradle roots that contain a wrapper and `gradle/multiplexor.gradle`, reads their declarations in temporary source copies, and saves a catalog in the active Multiplexor workspace. Re-scan after editing build declarations, target versions, or build settings. Ordinary source edits are captured when a build starts.

Select a project by its ID or display name. `--target <id,...>` selects one or more target IDs separated by commas. Each ID must be non-empty and unique. Without `--target`, all targets in the selected project are selected. `--all` selects every registered project.

Use `--targets <project:target,...>` to select exact targets across projects, such as `iris:bukkit,biletools:bukkit`. Each complete key must be non-empty, unique, and present in the catalog. This option cannot be combined with a project argument, `--target`, `--all`, or `--all-targets`. Required artifact-producing targets are included automatically. `plan` lists the resulting targets without building them.

| Command | Form |
|---|---|
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
| Wormholes | `bukkit`, `api`, `proxy`, and one target per loader and Minecraft version |
| Husk | `bukkit` and one target per loader and Minecraft version; Forge 1.20.1 also serves NeoForge 1.20.1 |
| VolmLib | `library`, `native-common`, and one target per native server adapter |

`projects list --json` contains the exact target IDs, tasks, requirements, and artifact paths from the registered checkout. Install the JDKs and any native toolchains required by the selected targets. The Volmit Gradle wrappers run on Java 25; older Minecraft targets can also require Java 17 or 21 toolchains.

The wrapper uses the inherited `JAVA_HOME`, and Gradle resolves each project's compilation toolchains. The target's `java` metadata declares its requirement; it does not select the wrapper's Java executable.

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
| `--packaging <local\|compact>` | Select local or maximum-compression jar packaging | `local` |

Save workspace defaults or inspect the current limits:

```sh
./start.sh projects limits --jobs 4 --memory 16384 --workers 8
./start.sh projects limits
```

Each supplied setting replaces its saved value; omitted settings remain unchanged. New builds use the saved limits, with command-line build flags taking precedence. Retry retains the original run's limits.

A target starts when a job slot, its declared memory reservation, and its worker allocation fit. The worker allocation is capped by the run's total and passed to Gradle through `--max-workers`. Test-fork limits preserve lower project settings and are capped by the allocated Gradle workers. Memory reservations govern scheduling; they are not an operating-system memory limit.

`--changed` compares captured project and local dependency sources, additional source inputs, the target declaration, packaging mode, toolchain and host details, and dependency artifact hashes. Reuse also requires the saved artifact files to pass their recorded size and SHA-256 checks. A changed or missing input causes a build.

Local packaging passes `-PcompactRelease=false`; compact packaging passes `-PcompactRelease=true`. Local mode uses faster compression for the supported Volmit targets. Compact mode spends more work compressing release jars. Both run the declared tests, shrinking, and artifact-size checks. The mode applies to every target in the run and is recorded with the run.

Gradle task caching is enabled for builds in either packaging mode. Targets share a local task-output cache while retaining separate writable Gradle homes. Completed local builds supply reusable wrapper distributions and a read-only dependency-cache snapshot for later targets. Turning artifact reuse off still allows Gradle to reuse valid task outputs when it runs.

Only one project run is active per Multiplexor workspace. Its worker continues when the dashboard or invoking terminal closes. A failed target blocks its dependents while independent targets continue.

## Inspect and control runs

```sh
./start.sh projects status
./start.sh projects status <run> --json
./start.sh projects logs <run> --target iris:fabric-26.3 --follow
./start.sh projects cancel <run>
./start.sh projects retry <run> --wait
```

Status includes each target's state, current Gradle task, log path, and collected artifacts. Logs can be selected by the complete `project:target` key. Cancellation stops the run's active builds and prevents queued targets from starting.

Retry uses the previous run's captured source snapshot, additional source inputs, target declarations, and packaging mode. Use `--packaging local` or `--packaging compact` to select a different mode for the retry. Reuse applies the same full comparison as `--changed`: captured inputs, target declaration, packaging mode, toolchain and host details, and dependency artifact hashes must match. Successful artifacts are verified and copied into the new run; other targets rebuild. Use `build` to capture source edits, and `scan` first when declarations change.

## Named destinations

Register a directory for exported jars, a managed instance, or a consumer's drop-ins:

```sh
./start.sh projects destination plugins-out --path /path/to/pluginsOut
./start.sh projects destination paper-test --instance paper-test --platform plugin
./start.sh projects destination fabric-dropins --dropins --platform fabric --mc 26.3
./start.sh projects destinations --json
```

The destination list shows saved names, kinds, paths, platforms, and Minecraft compatibility. Run `projects destination` with an existing name and the complete desired settings to replace that configuration. Remove a saved destination with `projects destination <name> --remove`; this removes configuration only and leaves jars and ownership records at the destination unchanged. `--remove` cannot be combined with destination settings.

A directory can receive all runtime artifacts or filter them with `--platform` and `--mc`. A managed instance supplies its platform and Minecraft version from server metadata; it must be stopped and unlocked, including for preview. Drop-ins require a platform and exact Minecraft version. Their usual subscriptions and watcher behavior apply when jars change.

In the dashboard, **LOCATIONS** (`o`) lists saved destinations with their paths and filters. Select one for **Edit destination**, **Preview delivery from current run**, or **Remove configuration**. The editor keeps the name fixed and preselects current values. Use **Any Minecraft version** to clear an export's version filter, or **Read instance metadata** to take the instance version. Removal requires confirmation. **Add destination** saves a destination without delivering artifacts.

Preview a delivery, then run it without `--preview` to apply those actions:

```sh
./start.sh projects deploy <run> --to plugins-out --preview
./start.sh projects deploy <run> --to plugins-out
./start.sh projects deploy <run> --to paper-test --target iris:bukkit --preview
./start.sh projects deploy <run> --to paper-test --target iris:bukkit
```

The dashboard's delivery action presents saved destinations, then shows the same preview and asks for confirmation. With no destinations, choose **Add destination** or **Back**. After adding one, open delivery again to select it.

Delivery selects successful `runtime` artifacts, checks their saved hashes, and filters platform and Minecraft compatibility. APIs and libraries stay in the build run. Managed server destinations accept at most one compatible target per project; select `--target project:target` when more than one matches. Empty Minecraft compatibility lists accept any version; declared numeric ranges include both endpoints. Server-version ranges on combined server and Velocity jars apply to their server edition.

The preview lists installs, replacements, removals, and skipped incompatible artifacts. Delivery preserves unrelated files and refuses to overwrite an unmanaged jar or a managed jar changed outside Multiplexor. It replaces the recorded artifacts for the selected project or target, retaining other targets in an export directory. The destination's `.multiplexor-project-artifacts.json` tracks ownership and checksums. Gradle itself writes build output only; export and server delivery are explicit manager actions.

## Declare a Gradle project

Apply the declaration from the root `build.gradle`:

```groovy
apply from: 'gradle/multiplexor.gradle'
```

The declaration contains a JSON-compatible map. For example, a plugin whose final build task produces the stated packed jar can declare:

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
            path: "build/libs/Example-${project.version}-packed.jar",
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

For example, a consumer can pair `dependsOn: ['wormholes:api']` with `artifactProperties: [wormholesApiJar: 'wormholes:api']`. The manager passes the verified API path as a Gradle project property. Keep machine-specific output directories and server copies out of the declared tasks.

## Dashboard and storage

Open **PROJECTS** from the workspace card, choose **Projects dashboard** in Build & tuning, or run `./start.sh projects dashboard`. Projects form a tree with their targets underneath. Use Right to expand a project and Left to collapse it; Left on a target focuses its project. Focus a target to see its status and live log.

Press Space or click a left checkbox to select one target or every target in a project. A project shows `[-]` when some of its targets are checked. Press `a` or click the all checkbox to check every registered target, including collapsed projects and offscreen rows. Press `x`, or click the checked all checkbox, to clear the checks. The header shows the checked count and configured build limits.

Press `b` and choose **Build N checked targets** to build the checked targets and their required dependencies. This is the default build choice when targets are checked. With no checks, the menu offers the focused target, its entire project, or all registered targets. **Reuse verified artifacts** starts enabled; turn it off to run Gradle for every selected target. **Packaging** toggles between **Local** and **Compact**, starting at **Local**. Choose these options before the build scope. Collapsing a project preserves its checks. Checks survive refreshes, row reordering, and run-history changes. Removed catalog targets lose their checks, and targets shown only in run history cannot be checked.

Press `p`, or choose **Build limits** from actions, to edit **Parallel builds**, **Total memory budget (MiB)**, and **Total Gradle workers**. Choose **Save limits** to save workspace defaults, or **Back** to discard the edits. Target requirements and the [run budget](/servermultiplexor/13-project-builds#build-isolation-and-limits) determine which targets can run together.

Checkboxes control build scope only. Builds do not deliver artifacts automatically; manage named destinations through **LOCATIONS** (`o`), then select one when delivering artifacts. **BACK** (`q`) returns to the previous view while builds continue. The dashboard also offers source scanning, build limits, run history, retry, cancellation, and delivery preview. See [Dashboard controls](/servermultiplexor/02-dashboard#project-builds).

Catalogs, build defaults, destinations, and run records live under `.manager-state/project-builds/` in the Multiplexor workspace. Source snapshots, target copies, artifacts, logs, and Gradle caches live under `~/.multiplexor/project-builds/<workspace-id>/`. Set `MULTIPLEXOR_BUILD_HOME` to choose the parent directory; the workspace-specific subdirectory is retained.

[All Multiplexor documentation](/servermultiplexor)
