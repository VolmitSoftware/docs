---
title: "Multiplexor: Workspace and source"
description: "Workspace layout, source builds, validation, and release behavior"
published: true
date: 2026-09-25T00:00:00.000Z
tags: servermultiplexor, development
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

A workspace separates server instances, cached builds, shared content, and local state. Run development commands from the source checkout; use the root launcher for end-to-end checks.

## Workspace concepts

- **Consumer profile**: one of `plugin`, `forge`, `fabric`, `neoforge`. Each profile has its own instances, dropin sources, and build cache. The active profile is set with `consumer use`. Mohist is the explicit hybrid exception: it is Forge-owned and can subscribe to plugin-consumer dropins.
- **Instance**: one server install inside a consumer. Lives at `consumers/<profile>/instances/<name>` (or under `~/.multiplexor/instance-store/...` if the workspace path contains `[` or `]`). Metadata is in `.server-source` (type, launch mode, jar path, isolation, Mohist dropin sources, and lock state + hashed PIN).
- **Active instance**: the default target when an instance name is omitted. Set with `instance activate`.
- **Network**: one local Velocity proxy and a group of plugin-consumer backends. Players join the proxy address and switch routing names with `/server`. Each backend belongs to at most one network; unrelated standalone servers and multiple networks can coexist.
- **Dropins**: plugin or mod jars under `consumers/<profile>/dropins/plugins` or `consumers/<profile>/dropins/mods`. On `runtime start` and via the watcher, these jars are copied into subscribed instances. Mohist records whether it tracks Forge mods, plugin-consumer plugins, or both, placing them in separate `mods/` and `plugins/` folders. Automatic sync tracks the last synchronized SHA-256 per instance: it updates untouched jars but preserves and warns about unknown or locally modified jars. An explicit `plugins sync` or `mods sync` remains authoritative and replaces them.
- **Isolated instance**: opts out of all shared state: no dropin sync, no Iris pack symlink, no shared `ops.json` merge. Created with `server create --isolated` or toggled later with `instance isolated <name> true`.
- **Shared plugin data**: `consumers/plugin-consumers/shared-plugin-data/` holds Iris packs and a merged `ops.json` for non-isolated plugin instances.
- **Build cache**: `consumers/<profile>/builds/<type>/` holds versioned server jars. `server create --type ...` resolves jars from here; `--auto-build` refreshes from upstream first.
- **Content lockfile**: `consumers/<profile>/state/content-lock.yaml` tracks jars installed by `content install` so they can be updated, removed, and re-synced through the existing dropin pipeline.
- **Backup**: `consumers/<profile>/backups/<instance>/<backup-id>/` stores a restorable snapshot with checksums and a manifest. Backups are used manually and by `instance safe-update`.
- **Gameplay test**: a Mineflayer scenario run against an actual instance. Built-ins cover connection, command responses, and status effects; custom `.mjs` scenarios can assert any protocol-visible player behavior. Reports stay under ignored per-consumer state.
- **Remote profile**: non-secret Pterodactyl panel metadata in `.multiplexor/pterodactyl-profiles.yaml`. Client/Application bearer keys live in macOS Keychain under an exact profile+HTTPS-origin identity, never in the YAML file.
- **Remote link**: `.multiplexor-remote.json` inside a pulled, initially paired, or explicitly relinked Local instance records the exact remote account, immutable server identity, display name, Local consumer, and transfer timestamps. `remote push <local>` uses this identity instead of guessing from names.
- **Multiplexor Drive**: the local `~/Multiplexor Drive` folder containing one live folder for every accessible Pterodactyl server, grouped by remote account. Selecting Open folder for a remote server opens its folder here in Finder.

## Files and directories

```
consumers/<profile>/              # plugin-consumers, forge-mod-consumers, ...
  builds/<type>/                  # cached server jars
  backups/<instance>/              # restorable snapshots + manifest/checksums
  dropins/plugins or dropins/mods   # dropin jars (manual and content-managed)
  instances/<name>/                 # one server's worldroot
    .server-source                # type, launch mode, jar path, isolation/subscriptions
    .multiplexor-runtime.env       # per-instance Java/JVM/console overrides
    .multiplexor-remote.json      # durable link after pull, first new push, or --link
    .multiplexor-dropins.json     # last synchronized jar hashes
    .multiplexor-addons.json      # this instance's checked addons and jar hashes
    server.jar                    # symlink into builds/
    plugins/ or mods/             # Mohist can track both source kinds
  shared-plugin-data/             # plugin-only: iris packs + merged ops.json
  state/runtime/                  # tmux logs, pid files
  state/trends/                   # per-instance metric history for the monitor
  state/content-lock.yaml          # managed plugin/mod manifest
  state/gameplay-tests/             # ignored Mineflayer JSON reports
.multiplexor/addons.json            # optional custom checklist entries
.multiplexor/workspace.yaml         # workspace marker
.multiplexor/pterodactyl-profiles.yaml # non-secret remote panel metadata
.manager-state/pterodactyl/         # remote monitor trend history
MultiplexorApp/tool/mineflayer/      # pinned Mineflayer harness and scenarios
active-instance                   # symlink to the active instance
```

## Build and run

```bash
cd MultiplexorApp
dart pub get
dart analyze
dart test
dart run bin/main.dart
dart run tool/build_exe.dart
```

Build on the target operating system and architecture. Linux x64 and ARM64 use the same Dart commands as macOS. The build writes `../multiplexor` (`../multiplexor.exe` on Windows). The implementation is native Dart, with no shell backend. Workspace detection is location-independent; running in an empty folder creates the workspace layout. Use `./start.sh <command>` from the root for end-to-end checks, or `dart run MultiplexorApp/bin/main.dart` for direct development runs.

If a Flutter `dart` launcher stalls, use its cached `bin/cache/dart-sdk/bin/dart` (`dart.exe` on Windows). Both root launchers select this SDK automatically. On macOS, neither the Windows executable, PowerShell launcher, nor MSYS tooling is required.

## Validate source changes

Dart tests do not run the Node harness or launcher checks. Run these separately from the repository root:

```bash
(cd MultiplexorApp/tool/mineflayer && npm ci --no-audit --no-fund && npm test && npm run doctor -- --json)
/bin/bash MultiplexorApp/tool/test_launcher.sh darwin
/bin/bash MultiplexorApp/tool/test_launcher.sh linux
```

Run either shell suite on macOS or Linux. They use isolated temporary tools and fixtures for the selected platform, without installing dependencies or starting Minecraft. Linux checks cover apt-get, dnf, pacman, and noninteractive sudo. The Node suite selects only `test/**/*_test.mjs`, excluding local live-server probes. Neither suite replaces a scenario against an actual server; see [Gameplay checks](/servermultiplexor/07-gameplay-checks).

CI pins Dart 3.10.0 and Node 22 and checks macOS, Windows, and Linux. Both Apple Silicon and Intel macOS runners execute launcher tests, Mineflayer installation/tests/diagnostics, executable builds, and Dart tests. Linux x64 and ARM64 runners compile and test native executables; Linux also runs launcher and Mineflayer checks. Local checks cover only the current host. A Node or launcher failure blocks release even if executables compile.

## Release builds

Each successful branch push assigns a monotonically increasing semantic patch version, embeds it, uploads versioned Apple Silicon macOS, Intel macOS, Linux x64, Linux ARM64, and Windows archives as GitHub Actions artifacts retained for thirty days, and publishes a GitHub Release at the exact pushed commit. The newest default-branch push becomes the latest release. Other branches and superseded default-branch builds publish prereleases.

Linux archives use `linux-x64.tar.gz` and `linux-arm64.tar.gz` suffixes and contain an executable `multiplexor`. The x64 release builds on Ubuntu 22.04 and the ARM64 release on Ubuntu 24.04. Release archives include SHA-256 checksums for self-update verification.

The checked-in version remains the release baseline; CI adds no version commits. Explicit `v*` tag pushes must match that baseline and publish at the existing tag. Build with `tool/build_exe.dart --version <semver>` to enable release self-installation; see [Executable updates](/servermultiplexor/01-installation-and-updates#executable-updates).

## Parallel operations

Independent builds, repository syncs, addon preparation, Remote fleet polling, Drive checks, and transfer-file hashes use rolling pools of up to four workers. A completed operation frees its slot immediately. Port allocation and shared-watcher startup are coordinated; addon/transfer commit and rollback keep their required order. All started operations finish before failure cleanup.

[All Multiplexor documentation](/servermultiplexor)
