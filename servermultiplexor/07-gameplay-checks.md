---
title: "07 - Gameplay checks"
description: "Mineflayer setup, scenarios, viewer feeds, reports, and scenario APIs"
published: true
date: 2026-09-21T00:00:00.000Z
tags: "servermultiplexor, testing"
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Run Mineflayer scenarios against managed instances to assert player-protocol behavior. The harness provides bounded actions, explicit assertions, run reports, and a temporary first-person viewer. Use [Swarms and sessions](/servermultiplexor/08-swarms-and-sessions) for coordinated or persistent populations.

[ServerMultiplexor](/servermultiplexor)

## Installation and protocol support

The gameplay harness is pinned under `MultiplexorApp/tool/mineflayer/`; `gameplay setup` installs it locally with npm. Offline preparation is restricted to stopped, isolated instances: `gameplay prepare` binds the server to loopback, disables online authentication and whitelisting, and removes spawn protection. It never weakens a shared instance. `--start` starts a stopped target, while `--stop-after` only stops an instance that the gameplay command itself started.

The harness package lock is checked in. Setup and launcher installs use `npm ci`; gameplay commands through either launcher refresh an installation when its installed lock is missing or older than the manifest or package lock. An installation failure stops the command with a nonzero exit code. Use `gameplay setup` to repair a damaged installation explicitly, then run `gameplay doctor --json`.

The harness pins bleeding-edge [Mineflayer commit `f603758e`](https://github.com/PrismarineJS/mineflayer/commit/f603758e4228a7e61d1337526e6066e79308b976), which identifies itself as version 4.38.0 and requires Node 22+. It supports vanilla Java protocols through 26.1. Minecraft 26.2 and newer are outside its tested protocol range. Gameplay results prove protocol-visible behavior. They do not prove client rendering, resource packs, sound, camera behavior, client mods, or human feel.

For protocol QA with this dependency set, create an isolated 1.21.11 server instead of using a 26.2 or 26.3 instance. A passing doctor check verifies the harness installation; it does not make an unsupported server protocol compatible.

## Viewer and run ownership

Every gameplay run starts a first-person Prismarine web feed on a free loopback port. The reachable URL is printed as soon as the feed is ready, included under `viewer.url` in the JSON report, and written immediately to `state/gameplay-tests/<instance>/viewer-<port>.json`; the state file changes from `active` to `closed` when the run ends. Use `--viewer-port <port>` when a stable port is useful or `--no-viewer` only when the feed is intentionally unnecessary.

## Commands

| Command | What it does |
|---------|--------------|
| `gameplay setup` | Install the pinned Mineflayer, pathfinder, and Prismarine Viewer dependencies with `npm ci`. |
| `gameplay doctor [--json]` | Verify Node and the pinned gameplay dependency versions. |
| `gameplay list [--json]` | List built-in scenarios. |
| `gameplay prepare [instance] [--instance <name>]` | Prepare a stopped, isolated instance for loopback-only offline bot authentication. |
| `gameplay run <scenario> [instance] [flags]` | Run a built-in name or `.mjs` scenario. Supports `--scenario`, `--instance`, `--profiles-folder`, `--version`, `--auth`, `--startup-timeout`, `--connect-timeout`, `--assertion-timeout`, `--prepare`, `--start`, `--stop-after`, `--username`, `--timeout`, `--command`, `--expect`, `--effect`, `--viewer-port`, `--no-viewer`, `--no-op`, and `--json`. |

## Built-in scenarios

The built-in `connect` scenario validates login, spawn, position, health, and connection stability. `command` requires `--command` plus an `--expect` regular expression. `effect` optionally runs `--command` and requires the named `--effect`. `circle` walks one eight-block-radius lap beside the initial position; provide clear level terrain and `--timeout 120`. It checks observed angular progress, radius, elevation, and position jumps.

## Reports and feature coverage

Scenario reports record the installed plugin jar filenames and SHA-256 hashes, the scenario source hash, and the observed server version. To inspect Volmit feature coverage, run `node MultiplexorApp/tool/mineflayer/src/coverage.mjs consumers/plugin-consumers/state/gameplay-tests`. It reads the feature manifest in `tool/mineflayer/suites/volmit.json` and emits JSON with passed, failed, untested, or unsupported features. A second argument selects another manifest. Only the latest completed report for each feature and exact recorded server/plugin build set counts; failures on another build remain visible. Older reports without jar hashes have `plugins: null` and do not establish coverage for a known build. Missing scenarios remain untested; the manifest is a coverage target, not a claim that every listed scenario exists or passes.

The [Volmit suite guide](/servermultiplexor/11-scenario-suites) maps plugin features to executable scenarios, fixture requirements, and restart phases.

## Custom scenario API

Custom modules default-export `{ name, description, async run(context) }`. The context supplies `bot`, `step`, `expect`, `command`, `waitForEvent`, `waitForMessage`, abortable `sleep`, `waitUntil`, `signal`, and server metadata including the managed instance `directory`. `actions.walkRoute(points, {timeoutMs})`, `actions.walkCircle({center, radius, laps, clockwise, timeoutMs})`, and `actions.attackPlayer(otherBot, {hits, minimumHealth, timeoutMs})` use bounded actions and record observed outcomes. Coordinates are `{x,y,z}` objects. Circles need clear level routes; blocked terrain fails instead of teleporting past it. Combat requires a visible player within three blocks, a server damage event naming the attacking bot, and actual health loss.

`await context.connectActor(username)` returns another context on the same managed offline loopback target. Additional actors cannot reuse existing operator identities; the run owns all connections and fails on any unexpected kick or disconnect. Up to 32 actors including the primary are supported, subject to server capacity and login throttling. Cleanup disconnects every actor on success, failure, or interruption.

For an operation that deliberately disconnects its client, `await context.reconnectAfter(trigger, {timeoutMs})` waits for both the trigger and disconnect, then returns a new context for the same identity. The default deadline is 30 seconds, with a 120-second maximum. The trigger can wait for independent server-log evidence of completion before reconnection. Kicks, errors, missing disconnects, and subsequent unexpected disconnects still fail. Reports retain each connection and the primary viewer's closed/reopened sessions.

With the session observer installed, `await context.observe()` reads a fresh server snapshot. `context.transition(trigger, {worldName, worldId, timeoutMs, position, radius})` verifies a post-trigger server world identity and a loaded client chunk; specify a destination name or UUID. A respawn packet or matching dimension alone does not prove arrival. Missing or stale observations fail explicitly.

## Isolated gameplay checks

Use a fresh instance name for each investigation. These PowerShell commands create a Paper server, run bounded checks, and delete the instance afterward. On macOS or Linux, replace `.\start.ps1` with `./start.sh`.

```powershell
.\start.ps1 gameplay setup
.\start.ps1 gameplay doctor --json
.\start.ps1 --consumer plugin server create gameplay-qa --type paper --mc 1.21.11 --auto-build --isolated
.\start.ps1 --consumer plugin gameplay run connect gameplay-qa --prepare --start --stop-after --json
.\start.ps1 --consumer plugin gameplay run command gameplay-qa --prepare --start --stop-after --command '/say qa-ready' --expect 'qa-ready' --json
.\start.ps1 --consumer plugin gameplay run effect gameplay-qa --prepare --start --stop-after --command '/effect give @s speed 10 0 true' --effect speed --json
.\start.ps1 --consumer plugin instance delete gameplay-qa
```

Set a custom port with `.\start.ps1 --consumer plugin instance port gameplay-qa 25579`. Startup keeps it when free; a conflict selects another free port starting at 25565.

Reports live under `consumers/plugin-consumers/state/gameplay-tests/<instance>/`, and matching runtime logs under the consumer's `state/runtime/`. Inspect both the assertions and server log.

To use a downloaded server jar and exercise measured movement and combat:

```bash
./start.sh gameplay setup
./start.sh server create gameplay-qa --jar /absolute/path/paper-1.21.11.jar --type paper --isolated
./start.sh gameplay run connect gameplay-qa --prepare --start --stop-after
./start.sh gameplay run MultiplexorApp/tool/mineflayer/examples/circle-and-combat.mjs gameplay-qa --prepare --start --stop-after --timeout 180
```

The last scenario builds an isolated arena, walks a measured circle, and exchanges damage between two players. Harness installation and [source checks](/servermultiplexor/10-workspace-and-source) do not replace running a scenario against an actual server.
