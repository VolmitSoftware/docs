---
title: "Operator Runbooks & Smoke Tests"
description: "React documentation: Operator Runbooks & Smoke Tests"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
These checks separate build, startup, reload, platform, and gameplay evidence. Commands that create fixtures, purge data, or generate synthetic load belong only on a disposable isolated server or a restored backup.

## Build gate

Run from `React/React` with Java 25:

```bash
./gradlew test
./gradlew build
./gradlew shadowJar
```

The current shaded artifact is `build/libs/React-2.0.0-26.2.jar`. A successful build does not prove plugin enable order, NMS resolution, Folia ownership, or gameplay behavior.

## Clean startup

1. Start an isolated Paper, Purpur, or Folia instance matching the artifact's target API.
2. Confirm React enables once.
3. Confirm React creates `plugins/React/config.toml` and the `core/`, `feature/`, `tweak/`, `action/`, and `sampler/` TOML trees.
4. Confirm React prints no uncaught exception.
5. Run `/react version`, `/react action audit`, `/react integration status`, and `/react bridge status`.
6. Join with `react.use`.
7. Toggle `/react monitor` and confirm the HUD updates.
8. Run `/react map`, select a local sampler, and confirm the map renders both held and in an item frame.
9. Stop the server normally.
10. Confirm React controllers and the ticker shut down without an ownership or drain error.

## Legacy JSON migration

1. Work from a copy of an existing React data folder that contains legacy JSON and no canonical TOML for the same ids.
2. Start React.
3. Confirm a timestamped ZIP appears under `plugins/React/migrations/backups/` before React removes migrated JSON.
4. Confirm the migration marker exists.
5. Confirm equivalent TOML files were written and startup completes with the expected values.
6. Restart once more and confirm migration does not repeat.

## Hotload and full reload

1. Change a reversible value such as `slowTickLogMode` in `config.toml` and confirm it applies without `/react reload`.
2. Change one active feature or tweak field and confirm the component restarts.
3. Toggle its `enabled` field and confirm activation changes.
4. Change `core/hotload.toml` and confirm watcher cadence or operator notification behavior changes.
5. Change a locale override and confirm valid text applies.
6. Introduce invalid TOML temporarily. Confirm the live global and localization snapshot stays active while React rejects the reload.
7. Run `/react reload`. Confirm the complete disable and enable lifecycle drains and React returns on the same version.
8. If React reports that the old ticker did not drain, restart the server. Do not retry reload.
9. Restore every edited value.

## PlaceholderAPI

1. Start PlaceholderAPI before React and run `/papi info react`.
2. Parse `%react_available%`, `%react_tps%`, `%react_mspt%`, and one `%react_sampler.<id>%` key twice. Allow one publisher cycle between reads.
3. Confirm an unknown key stays literal. Confirm an unavailable known value is `---`. Confirm a demanded sampler receives a value on the next snapshot.
4. Run `/papi reload` and confirm the persistent expansion stays registered.

## Maps and monitors

1. Configure a player monitor with `/react config monitor`. Reconnect and confirm `player-settings/<uuid>.json` restores it.
2. While monitoring, sneak and scroll to select a group. Double-sneak within 250 ms to lock it. Sneak-scroll again to select its head sampler.
3. Select a map normally and confirm the old main-hand item moves to inventory. Shift-click a second renderer and confirm the new map is added without replacing the held item.
4. Place adjacent cloned maps in item frames. Confirm distinct ids and megamap tiling when enabled.
5. Reload React and confirm inventory and framed maps repair during the startup boost.
6. Test absent and present peer plugins separately. Integration renderers are not selectable until their capability is present.

## Built-in runtime test commands

`/react test run`, `/react dev verify`, `/react dev test-all`, and `/react test loadtest` are not read-only diagnostics.

- `/react test run [full=true] [json=true]` always runs the same check set. It queues GC, quarantine, hopper normalization, entity trim/purge, and chunk purge around world 0 spawn. It creates and removes item-frame walls. It also spawns falling sand. The `full` value currently changes report metadata only.
- `/react dev verify` performs a live falling-block landing probe in addition to bridge and sampler checks.
- `/react dev test-all [radius=2]` queues the action suite in the executing player's world, including purge steps.
- `/react test loadtest true [players=1000] [duration=600]` runs two heavy passes on world 0. The current command does not bound `players` or `duration`.

If the instance is not disposable, back up the target world first. Use these commands only on a disposable isolated instance or a restored backup. Requested JSON reports are written under `plugins/React/test-reports/`. Keep them outside the repository if you need them for comparison.

## Fast fluids

1. Confirm `fast-fluids` is enabled. Confirm `/react bridge status` shows its core descriptors plus at least one valid fluid-tick route. Not every alternative route must resolve.
2. Spread and drain water on a 32×32 platform. Repeat with lava while `accelerateLava = true`. Then set it false and hotload the tweak.
3. Confirm bounded extra vanilla ticks accelerate the enabled paths. Confirm they do not force unloaded chunks or produce Folia ownership warnings.
4. Confirm `extraVanillaTicksPerEvent` clamps to 0–4, `maxExtraVanillaTicksPerServerTick` to 16–4096, and `maxBurstTicksPerLocationPerServerTick` to 1–16.
5. Test with an unavailable descriptor set. Confirm the tweak logs one passive warning and leaves vanilla fluid behavior intact.

React does not replace vanilla fluid registry entries. Repeated runtime bridge failures disable acceleration and retain vanilla behavior.

## Redstone guardrails

1. Build a repeatable redstone clock. Confirm `redstone`, `redstone-burst-rate`, and `redstone-tick-time` respond without an NMS redstone replacement.
2. Enable `redstone-clock-governor`. Place the clock away from players. Confirm transitions clamp after `maxTransitionsPerWindow` for `cooloffMS`.
3. With `onlyThrottleWithoutNearbyPlayers = true`, move inside `bypassWithinPlayerRadius` and confirm the nearby-player bypass.
4. Repeat near a region boundary on Folia and check the console for ownership errors.
5. Confirm Paper and Purpur native redstone settings stay authoritative. React observes and changes `BlockRedstoneEvent` current only when its governor engages.

## Platform matrix

For each supported artifact and server combination, record these as separate results:

| Gate | Evidence |
|---|---|
| Build | `./gradlew test` and `./gradlew build` |
| Startup | Plugin enable log and generated config tree |
| Descriptor bridge | `/react bridge status` plus affected feature behavior |
| Compiled hooks | Startup bridge class and gameplay path using furnace/brew, falling blocks, explosions, or hoppers |
| Paper/Purpur | Main-thread gameplay and clean reload/shutdown |
| Folia | Region-boundary gameplay with no cross-region access error |
| Visual | Held map, frame map, megamap, action-bar/title behavior |
| Integration | Peer absent, negotiating, healthy, and disabled states |

Do not treat one green category as proof of another.
