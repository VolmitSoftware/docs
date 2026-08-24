---
title: "Commands & Permissions"
description: "React documentation: Commands & Permissions"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
The root command is `/react` (alias `/re`). Use `/react help [page]` or `/react ? [page]` for generated command help. Player help uses the shared 19-line panel: up to 17 entries at the root or 16 in a subtree with a Back row, while shorter trees print every entry. Console help remains flat and unpaginated. The permission root is `react.use`. `react.*` grants the full tree including shorthands.

## Permissions (`plugin.yml`)

| Permission | Default | Description |
|------------|---------|-------------|
| `react.use` | op | Use `/react` |
| `react.*` | op | All React commands. Includes `react.use` and `react.shorthands.*` |
| `react.shorthands.*` | op | All shorthand commands when tweak enabled |
| `react.shorthands.gms` | op | `/gms` |
| `react.shorthands.gmsp` | op | `/gmsp` |
| `react.shorthands.gmc` | op | `/gmc` |
| `react.shorthands.give` | op | React `/give` shorthand |
| `react.shorthands.more` | op | `/more` |
| `react.shorthands.rl` | op | `/rl` → server reload |
| `react.shorthands.custom` | op | Operator-configured custom shorthands |

Not declared in `plugin.yml` but enforced in code:

| Permission | Role |
|------------|------|
| `react.configurator` | Required (or op) for `/react config gui` |

Director subcommands do not have individual `plugin.yml` nodes. The root gate is `react.use` (or `react.*` / op).

Feature and tweak bypass nodes appear in config. Examples: `react.bypass.projectile-limit`, `react.secret.adapt.bypass`, `react.secret.iris.bypass`.

## Root: `/react`

| Subcommand | Aliases | Origin | Description |
|------------|---------|--------|-------------|
| `monitor` | `m`, `mon` | player | Toggle action-bar monitor |
| `monitoring-only` | `monitor-only`, `monitoring-mode`, `mo` | both | Toggle runtime-only suppression of gameplay features and every tweak while leaving monitoring, statistics, maps, actions, and commands available |
| `set-player-view-distance <distance>` | `vd`, `view-distance` | player | Set current world view and simulation distance. Values above 32 are clamped. The command does not reject negative values. Paper setters are required |
| `map [renderer=unknown]` | | player | Open the map selector, or give the selected React renderer map |
| `reload` | `rl` | both | Reload React |
| `version` | `v` | both | Show React version |

`/react monitoring-only` does not rewrite any feature or tweak TOML. The state survives `/react reload` in the current server process and resets on a full restart. Running the command again restores every feature and tweak currently allowed by its configuration and capability gates; config edits made while the mode is active take effect during that reconciliation.

## `/react config` (`cfg`)

The source also declares `c` for config. The `chunk` command declares the same alias. Director currently resolves `/react c` to `chunk`. Use `/react config` or `/react cfg` for configuration.

| Subcommand | Aliases | Origin | Description |
|------------|---------|--------|-------------|
| `gui` | `menu`, `editor` | player | Opens TOML config editor GUI (`react.configurator` or op) |
| `monitor` | `m`, `mon` | player | Opens action-bar monitor configuration GUI |

## `/react action` (`act`, `a`)

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `purge-chunks` | `pc` | Unload chunks in selected world/area |
| `purge-entities` | `pe` | Purge matching entities |
| `collect-garbage` | `gc` | Request JVM GC |
| `quarantine-hot-chunks` | `aqhc` | Isolate hottest sampled chunks |
| `trim-entities-by-age-priority` | `ateap` | Trim old low-priority entities |
| `hopper-network-normalize` | `ahnn` | Normalize hopper hotspots |
| `prewarm-critical-chunks` | `apcc` | Preload critical chunks |
| `incident-playbook` | `aip` | Queue full incident mitigation sequence |
| `audit` | `list`, `ls` | List actions and enabled state |

Parameters vary by action (world, radius, max entities/chunks, ages). Defaults come from each action’s TOML. See [09 - Actions Catalog](/react/09-actions-catalog).

## `/react chunk` (`c`)

| Subcommand | Aliases | Origin | Description |
|------------|---------|--------|-------------|
| `sample` | | player | Print sampler values for the current chunk |
| `worst` | `w` | player | Teleport to and inspect the worst sampled chunk |

## `/react environment` (`env`)

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `info` | `i` | Print platform, CPU, memory, storage, network-interface, display, sensor, GPU, and power information. Also POST a smaller server, platform, storage, memory, and CPU summary to `https://paste.bytecode.ninja/documents` and return its link |

## `/react benchmark` (`bench`)

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `cpu-benchmark` | `cpu`, `processor` | CPU benchmark |
| `drive-benchmark` | `drive` | Storage benchmark |
| `memory-benchmark` | `mem`, `memory`, `ram` | Memory benchmark |
| `all-benchmark` | `all`, `full` | CPU, memory, and drive |

Only one benchmark run is accepted at a time. CPU and memory tests execute synthetic workloads. The drive test reads and writes under `plugins/React/benchmark/`. Scores are relative diagnostics, not absolute hardware ratings.

## `/react debug`

| Subcommand | Aliases | Origin | Description |
|------------|---------|--------|-------------|
| `entity-data` | `ed` | player | Raycast entity. Print priority and crowding diagnostics |

## `/react dev` (`developer`, `d`)

| Subcommand | Aliases | Origin | Description |
|------------|---------|--------|-------------|
| `test-all [radius=2]` | `ta` | player | Audit registries. Queue the direct action suite near the player. Radius is clamped to 0–6 |
| `verify` | `v`, `selftest` | both | Verify bridges, key samplers, lazy-gravity (PASS/FAIL) |

## `/react integration` (`int`)

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `status` | `s` | Peer-plugin health, heartbeats, optional correlation |

## `/react bridge` (`br`, `bridges`)

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `status` | `s`, `list` | List registered NMS bridges and resolution status |

Example: `/react bridge status`.

## `/react test` (`selftest`)

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `run [full=true] [json=true]` | `r` | Validation suite. `full` is currently report metadata and does not reduce the checks. JSON reports go to `plugins/React/test-reports/` |
| `loadtest <confirm> [players=1000] [duration=600]` | `load` | Two-pass synthetic load test on world 0. `confirm=true` is required |

Both test commands mutate their test world. `run` queues cleanup actions around world spawn. It creates and removes map-frame fixtures. It also spawns falling sand. `loadtest` generates heavy synthetic load. It currently does not bound `players` or `duration`. Run them only in a disposable isolated server. Or run them after you back up the target world. See [15 - Operator Runbooks & Smoke Tests](/react/15-operator-runbooks-smoke-tests).

## `/react web` (`w`)

| Subcommand | Description |
|------------|-------------|
| `pair <label> [role=viewer]` | After the embedded listener is live and bound, create and persist a bearer token, then report its RCT2 pairing payload and fingerprints. A disabled, starting, failed, stopped, or unbound listener creates no token. Players receive a click-to-copy action instead of the raw payload in chat; console and RCON receive raw text. Roles are `viewer`, `operator`, or `admin`. |
| `list` | List active token IDs, labels, and issue times. |
| `revoke <id>` | Revoke a token ID and persist the token store. |

Omitting `role` creates a viewer token. Token records without a role also resolve to viewer, so an old or incomplete record cannot inherit administrative authority. RCT2 carries `directUrl`, optional `relayUrl`, the server public key and full SHA-256 fingerprint, and the token ID/signature. It contains no confirmation word. When a wildcard listener has no `advertisedUrl`, React Web lets the operator replace the local fallback with the public port-forward or reverse-proxy URL before pairing. Direct-only pairing verifies the unauthenticated endpoint fingerprint before authenticated identity access or browser-local persistence.

| Role | Effective scopes |
|------|------------------|
| `viewer` | `read` |
| `operator` | `read`, `op:execute` |
| `admin` | `read`, `op:execute`, `admin`, `console:read`, `console:execute` |

Only admin tokens can read the full server-console tail/stream or execute a console command through the API. Pairing and revocation write to `plugins/React/web/audit.log`.

## Shorthand commands (tweak `shorthands`)

When the `shorthands` tweak is enabled, optional bare commands register. Set `enabled = true` in TOML; the constructor default is **off**. Built-in labels intentionally replace any matching bare command while the tweak is active, including labels supplied by EssentialsX, CMI, or vanilla. React restores the previous mappings when the tweak is disabled. Custom entries skip occupied labels unless `overrideExisting = true`.

| Command | Permission | Behavior |
|---------|------------|----------|
| `/gms` | `react.shorthands.gms` | Survival |
| `/gmsp` | `react.shorthands.gmsp` | Spectator |
| `/gmc` | `react.shorthands.gmc` | Creative |
| `/give` | `react.shorthands.give` | Item give with tab completion (may own bare `/give` while enabled) |
| `/more` | `react.shorthands.more` | Max stack of held item |
| `/rl` | `react.shorthands.rl` | Invokes server `/reload` |
| custom map keys | `react.shorthands.custom` or per-entry permission | Operator-defined shortcuts |

Configure in `plugins/React/tweak/shorthands.toml`. See [08 - Tweaks Catalog](/react/08-tweaks-catalog).
