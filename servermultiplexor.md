---
title: "ServerMultiplexor"
description: "Local Minecraft server instances and automated gameplay checks"
published: true
date: 2026-09-10T05:37:02.419Z
tags: "servermultiplexor, testing"
editor: markdown
dateCreated: 2026-09-10T02:40:32.975Z
---

ServerMultiplexor manages local Minecraft server instances, cached server builds, and Mineflayer gameplay tests. Isolated instances exclude shared plugin drop-ins, Iris packs, and operator data. Gameplay reports prove protocol-visible behavior; they do not verify client rendering or sound.

## Windows startup

Run `.\start.ps1` from the ServerMultiplexor checkout in PowerShell. It compiles `multiplexor.exe` when source files change and resolves Dart packages before compilation. If Dart comes from Flutter, the launcher uses Flutter's cached Dart SDK directly. Native Windows runtime management does not require WSL, Git Bash, or tmux.

## macOS startup

Use `./start.sh` from the ServerMultiplexor checkout on macOS. It builds the extensionless `multiplexor` executable and keeps tmux for interactive runtime consoles. If tmux is missing and Homebrew is installed, the launcher runs `brew install tmux`. Both Apple Silicon and Intel macOS have executable build and test jobs in CI.

A failed compilation preserves the previous executable and removes the partial build. Launcher tests execute the script directly, matching normal command-line startup.

```bash
./start.sh --version
./start.sh --consumer plugin gameplay doctor --json
```

Linux also uses `./start.sh` and tmux. The PowerShell launcher and Windows tmux packages are not required on either platform.

## Mineflayer setup

Node.js 22 or newer and npm are required. The checked-in package lock fixes the harness dependency versions. Both launchers refresh missing or outdated installations before gameplay commands; explicit setup repairs an installation with `npm ci`. Installation failures stop the command with a nonzero exit code.

```powershell
.\start.ps1 gameplay setup
.\start.ps1 gameplay doctor --json
```

This harness pins Mineflayer 4.38.0 at commit `f603758e4228a7e61d1337526e6066e79308b976`, with protocol support through Minecraft 26.1. Minecraft 26.2 is unsupported by this dependency set. A successful doctor result verifies dependencies, not compatibility with every server version.

## Isolated gameplay checks

Use a distinct instance name for each investigation. These commands create a compatible Paper server, run bounded checks, and delete the disposable instance afterward:

```powershell
.\start.ps1 --consumer plugin server create gameplay-qa --type paper --mc 1.21.11 --auto-build --isolated
.\start.ps1 --consumer plugin gameplay run connect gameplay-qa --prepare --start --stop-after --json
.\start.ps1 --consumer plugin gameplay run command gameplay-qa --prepare --start --stop-after --command '/say qa-ready' --expect 'qa-ready' --json
.\start.ps1 --consumer plugin gameplay run effect gameplay-qa --prepare --start --stop-after --command '/effect give @s speed 10 0 true' --effect speed --json
.\start.ps1 --consumer plugin instance delete gameplay-qa
```

Preparation requires a stopped, isolated instance and enables offline authentication on loopback. `--stop-after` stops a server only when the same command started it. Do not use an existing shared instance for this workflow.

Set a custom port with `.\start.ps1 --consumer plugin instance port gameplay-qa 25579`. Startup preserves it when available; a conflict selects another free port starting at 25565. Windows address-in-use errors count as conflicts.

Each run prints a temporary loopback Prismarine Viewer URL. The JSON report and `viewer-<port>.json` record that URL and its closed state after cleanup. Reports live under `consumers/plugin-consumers/state/gameplay-tests/<instance>/`; the corresponding runtime log is under `state/runtime/`. Check both the report assertions and the server log.

## Source tests

From `MultiplexorApp`, run `dart pub get`, `dart analyze`, and `dart test`. If the Flutter `dart` launcher stalls, invoke its cached `bin/cache/dart-sdk/bin/dart.exe` directly. The root launchers do this automatically for compilation.

From `MultiplexorApp/tool/mineflayer`, run `npm ci`, `npm test`, and `npm run doctor`. Unit tests and dependency checks do not replace running a scenario against an actual server.

From the repository root, run `/bin/bash MultiplexorApp/tool/test_launcher.sh` to test the shell launcher with isolated tools and fixtures. CI runs it with macOS's `/bin/bash` and runs Mineflayer installation, tests, and diagnostics on both Apple Silicon and Intel macOS. The fixture suite does not start Minecraft or replace native runtime validation.
