---
title: "ServerMultiplexor"
description: "Local Minecraft server instances and automated gameplay checks"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "servermultiplexor, testing"
editor: markdown
dateCreated: 2026-09-10T02:40:32.975Z
---

ServerMultiplexor runs local Minecraft server instances, caches server builds, and drives Mineflayer bots against them. An isolated instance leaves out shared plugin drop-ins, Iris packs, and operator data, so a check starts from a known state.

| | |
|---|---|
| Platforms | Windows, macOS, Linux |
| Launcher | `.\start.ps1` on Windows, `./start.sh` on macOS and Linux |
| Gameplay harness | Mineflayer, needs Node.js 22 or newer |
| Minecraft support | Through 26.1. 26.2 is not supported by the pinned harness |
| Reports | `consumers/plugin-consumers/state/gameplay-tests/<instance>/` |

> A gameplay report proves protocol-visible behavior. It says nothing about client rendering, sound, or resource packs.
{.is-info}

## Start it

On Windows, run `.\start.ps1` from the ServerMultiplexor checkout in PowerShell. It compiles `multiplexor.exe` when the source changes. No WSL, Git Bash, or tmux required.

On macOS and Linux, run `./start.sh`. It builds the `multiplexor` executable and uses tmux for interactive runtime consoles; if tmux is missing and Homebrew is installed, it installs tmux for you.

```bash
./start.sh --version
./start.sh --consumer plugin gameplay doctor --json
```

## Set up Mineflayer

Node.js 22 or newer and npm are required. Both launchers repair a missing or outdated installation before any gameplay command, and a failed install stops the command with a nonzero exit code.

```powershell
.\start.ps1 gameplay setup
.\start.ps1 gameplay doctor --json
```

The harness pins Mineflayer 4.38.0 at commit `f603758e4228a7e61d1337526e6066e79308b976`, which supports protocol versions through Minecraft 26.1. A passing `doctor` result means the dependencies are present, not that they match your server version.

## Run an isolated gameplay check

Use a fresh instance name for each investigation. These commands create a Paper server, run bounded checks, and delete the instance afterwards.

```powershell
.\start.ps1 --consumer plugin server create gameplay-qa --type paper --mc 1.21.11 --auto-build --isolated
.\start.ps1 --consumer plugin gameplay run connect gameplay-qa --prepare --start --stop-after --json
.\start.ps1 --consumer plugin gameplay run command gameplay-qa --prepare --start --stop-after --command '/say qa-ready' --expect 'qa-ready' --json
.\start.ps1 --consumer plugin gameplay run effect gameplay-qa --prepare --start --stop-after --command '/effect give @s speed 10 0 true' --effect speed --json
.\start.ps1 --consumer plugin instance delete gameplay-qa
```

`--prepare` requires a stopped, isolated instance and enables offline authentication on loopback. `--stop-after` only stops a server the same command started. Do not run this against a shared instance.

Set a custom port with `.\start.ps1 --consumer plugin instance port gameplay-qa 25579`. Startup keeps it when it is free; a conflict picks another free port starting at 25565.

Each run prints a temporary loopback Prismarine Viewer URL, also recorded in the JSON report and in `viewer-<port>.json`. Reports land under `consumers/plugin-consumers/state/gameplay-tests/<instance>/` and the matching runtime log under `state/runtime/`. Read both: the report assertions and the server log.

## Source tests

From `MultiplexorApp`, run `dart pub get`, `dart analyze`, and `dart test`. If the Flutter `dart` launcher stalls, call its cached `bin/cache/dart-sdk/bin/dart` directly.

From `MultiplexorApp/tool/mineflayer`, run `npm ci`, `npm test`, and `npm run doctor`.

From the repository root, run `/bin/bash MultiplexorApp/tool/test_launcher.sh` to exercise the shell launcher against isolated tools and fixtures.

None of these start Minecraft. They do not replace running a scenario against an actual server.
