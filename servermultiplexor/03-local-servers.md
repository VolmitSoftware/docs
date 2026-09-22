---
title: "Local servers"
description: "Consumers, instances, runtime settings, backups, and workspace checks"
published: true
date: 2026-09-21T00:00:00.000Z
tags: "servermultiplexor"
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Manage local servers within the active consumer. Run commands through `./start.sh` on macOS/Linux or `.\start.ps1` on Windows; omitted instance names generally use the active instance.

## Consumers

| Command | Behavior |
|---------|--------------|
| `consumer list` | List the four profiles. |
| `consumer show` | Print the active profile (alias: `current`). |
| `consumer use <profile>` | Set the active profile. |
| `consumer path` | Print the active profile's root path (alias: `root`). |

## Instances

| Command | Behavior |
|---------|--------------|
| `instance list` | List instances in the active profile; the active one is tagged `(active)`. |
| `instance bulk <start\|stop\|restart\|delete> <name>... [--concurrency <1-8>] [--confirm <token>]` | Run on an explicit nonempty set in the active consumer; default concurrency `4`. Validate all targets first, skip ineligible states/locked deletions, and report each result. Start/restart are headless. Delete previews its exact `--confirm` token. Partial failure exits nonzero. |
| `instance current` | Print the active instance name. |
| `instance create <name> [--isolated]` | Create without a jar. `--isolated` excludes shared drop-ins, Iris packs, and plugin ops; Remote Pull also uses isolation. |
| `instance clone <source> <target>` | Copy an instance verbatim, then re-wire shared links. |
| `instance activate <name>` | Make this instance the default target. |
| `instance path [name]` | Print the on-disk path. Active instance if omitted. |
| `instance open [name]` | Open the instance folder in the host file manager. |
| `instance update <name> [--mc <v>] [--jar <path>] [--type <t>] [--loader <v>] [--installer <v>] [--auto-build]` | Prepare and validate the replacement before shutdown, create a backup, and apply the jar or installer payload. Restart and check readiness when the instance was running; restore the previous state on failure. |
| `instance safe-update <name> [--mc <v>] [--jar <path>] [--auto-build] [--type <t>] [--loader <v>] [--installer <v>] [--promote] [--cleanup] [--keep-staging] [--label <label>] [--timeout <s>]` | Prepare one immutable candidate, back up, and validate it on isolated loopback staging. `--promote` applies that exact candidate and verifies the original; otherwise staging is kept stopped. Promotion removes staging unless `--keep-staging`; `--cleanup` removes staging after a successful validation-only run. |
| `instance isolated [name] [true\|false]` | Read the flag (no value) or toggle it. Turning it off re-links shared Iris packs and merges shared ops. |
| `instance lock <name> [--pin <digits>]` | Lock the instance so it cannot be deleted or factory-reset. Prompts for a 4–12 digit PIN (or pass `--pin`). The PIN is stored salted+hashed in `.server-source` and survives factory reset. Settings stay editable. |
| `instance unlock <name> [--pin <digits>]` | Verify the PIN and unlock, re-enabling delete and factory reset. |
| `instance locked [name]` | Print `true`/`false` for the lock state. |
| `instance port [instance] [port]` | Read or set `server-port` in `server.properties`. |
| `instance motd-style [name\|--all]` | Apply the styled MOTD template (alias: `motd-style`). |
| `instance reset <name>` | Wipe worlds/config/plugins/mods/logs back to baseline. Keeps the launch artifacts and the isolated flag, and re-applies the styled MOTD for the server type. Refused while the instance is locked. |
| `instance delete <name>` | Delete the instance entirely (stops running processes first), automatically removing network membership and updating routes. Deleting a proxy or the last backend also removes its network definition. Refused while the instance is locked. |
| `instance delete-all [--force]` | Delete every instance in the active profile and clean up its networks automatically. Asks for `DELETE` confirmation unless `--force`. Locked instances are skipped and left untouched. |
| `instance delete-all --everywhere [--force]` | Wipe every instance across plugin/forge/fabric/neoforge and clean up networks in one call. Asks for a double y/N confirmation unless `--force`. Locked instances are skipped. |

## Create servers

| Command | Behavior |
|---------|--------------|
| `server create <name> --type <type> [--mc <v>] [--auto-build] [--isolated] [--mod-dropins] [--plugin-dropins] [--artifact <dropin.jar> ...]` | Wire `server.jar` from cache; `--auto-build` refreshes upstream first. Mohist tracks both drop-in sources by default; either flag alone tracks only that source, `--isolated` neither. Other isolated types accept repeated `--artifact` for one-time copies. |
| `server create <name> --jar <path> [--type label] [--isolated] [--mod-dropins] [--plugin-dropins] [--artifact <dropin.jar> ...]` | Wire an explicit jar. Mohist accepts the same persistent source choices; isolated instances accept one-time artifact copies. |
| `server create-many --types <a,b,c> [--prefix N] [--mc <v>] [--auto-build] [--isolated]` | Create up to four in parallel with distinct reserved ports. Names are `<type>` or `<prefix>-<type>`; each uses its type’s consumer. Skip collisions/resolution failures and continue the batch. |

Single `server create` and `build <type>` commands must run under the consumer that owns the selected server type. Use `--consumer fabric`, `--consumer forge`, or `--consumer neoforge` for modded types; plugin-family types use `plugin`. `server create-many` remains the cross-consumer batch command.

`<type>` is one of: `paper`, `purpur`, `folia`, `canvas`, `leaf`, `spigot`, `forge`, `mohist`, `fabric`, `neoforge`. `leaf` is a high-performance Paper fork. Mohist is a Forge/Bukkit hybrid owned by the `forge` consumer and launches directly from its downloaded jar. For `forge` / `neoforge`, an installer jar triggers args-file launch mode automatically.

## Runtime

### Settings and Java

Consumer settings supply defaults; `.multiplexor-runtime.env` stores instance overrides for Java, heap, JVM preset, and console settings. Use `--instance <name>` to change or reset only that instance. `JAVA_EXECUTABLE`, `HEAP_SIZE`, `JVM_PROFILE`, and `JVM_ARGS` environment variables take precedence.

Installation and startup check the selected Java executable against known Minecraft minimums. Loader/plugin requirements may be stricter; unknown Minecraft versions are marked unchecked. `runtime settings check --instance <name>` reports the effective executable and compatibility.

| Minecraft | Minimum Java |
|---|---|
| 1.17 | 16 |
| 1.18 | 17 |
| 1.20.5 and later 1.x | 21 |
| 26.x | 25 |

### Consoles and ports

| Platform | Runtime and controls |
|---|---|
| macOS/Linux | Named `tmux` sessions. `Tab` reaches the server, preserving Paper/Purpur/Folia/Canvas/Leaf JLine/Brigadier completion for commands and player names, including with minimal formatting. |
| Windows | Native background host in `multiplexor.exe`; no Git Bash, `sh`, `chmod`, or `tmux` dependency. The terminal grid shows live logs. Game-server commands use RCON; Velocity uses authenticated loopback host control. |

Windows grid controls: `Tab` selects the next console; left/right switch when input is empty. `Enter` sends the typed command. `Esc` or `Ctrl-C` returns to the dashboard without stopping servers. Without a TTY, console commands print log paths.

```powershell
.\multiplexor.exe runtime start demo --no-console
.\multiplexor.exe runtime consoles
```

Runtime logs: `consumers/<profile>/state/runtime/<instance>.log`. Minecraft also writes the instance's `logs/latest.log`.

Startup keeps an available configured port unless another running instance reserves it. Standalone conflicts select a free port from 25565; failed bind checks, including Windows address-in-use errors, exclude that port. Network proxy/backend ports stay fixed and conflicts fail startup.

### Commands

| Command | Behavior |
|---------|--------------|
| `runtime watch [--once]` | Open the [live monitor](/servermultiplexor/02-dashboard) with fleet charts, clickable actions, and wizard flows through cards or `n` / `b` / `c`. `--once` prints one colorless, escape-free frame to stdout without requiring a TTY. |
| `runtime start [instance] [--no-console]` | Safely sync dropins and start the instance, then open its console unless `--no-console`: tmux on macOS/Linux, a native terminal view on Windows. Locally modified instance jars are preserved with a warning. |
| `runtime stop [instance] [--graceful\|--force]` | Send `stop` to game servers or `end` to Velocity, allowing up to five seconds before forcing termination. Commands use tmux on macOS/Linux, or RCON/native host control on Windows. `--graceful` is the default; `--force` skips the wait. Restart, delete, and reset use the same five-second stop policy. |
| `runtime restart [instance] [--no-console]` | Stop and start again, then open its console unless `--no-console`. |
| `runtime console [instance]` | Start the runtime if needed and open its console: tmux on macOS/Linux, native live logs and command input on Windows. |
| `runtime consoles` | Open all running consoles in a tmux grid on macOS/Linux or a native terminal grid on Windows. |
| `runtime consoles-lateral` | Open running consoles side-by-side using tmux on macOS/Linux or the native terminal view on Windows. |
| `runtime status [instance]` | Print the runtime state of one instance. |
| `runtime stats [instance]` | Show player count (`online/max`), names, state, CPU, memory, uptime, port, and version. Omit the instance to scan running servers across all consumers. CPU/MEM/UPTIME are `n/a` when unavailable. |
| `runtime states` | Print one line per instance: `name<TAB>state<TAB>port<TAB>pid<TAB>locked<TAB>isolated`. State is `stopped` / `starting` / `running` / `stopping` / `restarting`; the final two columns are `locked`/`unlocked` and `isolated`/`shared`. |
| `runtime metrics` | Print tab-separated per-instance metrics in the column order below. |
| `runtime list` | Print running instance names. |
| `runtime settings set-java <executable> [--instance <name>]` | Select the Java executable used for installation and startup. Paths containing spaces are supported. |
| `runtime settings check [--instance <name>]` | Inspect Java and check the known Minecraft minimum without starting a server. |
| `runtime settings show [--instance <name>]` | Print the active heap, JVM preset, and flags. |
| `runtime settings presets` | List available JVM presets (`aikar`, `vanilla`, `conservative`). |
| `runtime settings set-heap <2G\|4G\|...> [--instance <name>]` | Set JVM `-Xmx`. |
| `runtime settings set-preset <name> [--instance <name>]` | Apply a JVM preset's flags. |
| `runtime settings set-wrap <on\|off> [--instance <name>]` | Set macOS/Linux tmux wrapping; default `off` clips long lines at the pane edge. Applies next start; `logs/latest.log` is unchanged. |
| `runtime settings set-log-format <minimal\|default> [--instance <name>]` | Default `minimal` removes console `[HH:mm:ss INFO]` prefixes and suppresses TPS polling’s `RCON Client … started` / `… shutting down` lines in console and file. `default` restores bundled Log4j formatting and RCON lines. `logs/latest.log` always retains timestamps. Applies next start. |
| `runtime settings reset [--instance <name>]` | Reset consumer defaults, or remove only the named instance's overrides. |

Paper/Spigot/Purpur `/restart` is wired to a per-instance `multiplexor-restart.sh` on macOS/Linux or `multiplexor-restart.cmd` on Windows, so `/restart` re-enters Multiplexor instead of exiting permanently. While that script waits, the instance reports `restarting`.

### Metrics output

`runtime metrics` prints one tab-separated row per instance, with these ordered columns:

```text
name, state, port, locked, players, max, version, tps, isolated,
uptimeSeconds, cpuPercent, rssBytes, logPath, latencyMs, diskBytes,
networkRxBytes, networkTxBytes, memoryLimitBytes, diskLimitBytes,
networkRxPackets, networkTxPackets
```

Columns are append-only; readers may consume a shorter prefix. Unavailable values are `-`, never zero. Each dashboard sweep uses these metrics and derives per-second rates from consecutive samples.

| Measurement | Source and meaning |
|---|---|
| Players, version, latency | Concurrent Server List Pings; latency is round-trip time. Player counts need neither query nor RCON enabled. |
| TPS | Concurrent RCON queries on Paper-family servers started with RCON enabled; otherwise `-`. |
| Uptime, log | Whole seconds since launch; absolute runtime log path. |
| CPU, resident memory | One batched `ps` for tracked server PIDs. `cpuPercent` is BSD `ps %cpu`, a lifetime average. Human-readable stats use formats such as `4.2%` and `2.4G`. |
| Remote resource fields | Pterodactyl disk, network, memory-limit, and disk-limit counters. |
| Local network counters | One batched macOS `nettop` for tracked Java PIDs supplies byte/packet counters; unavailable on unsupported platforms. |

## Backups

Backups require a stopped instance. A snapshot contains regular files, including copies of launch jars and shared data, so later build pruning cannot remove its dependencies. Verification checks the complete manifest, file sizes, and SHA-256 hashes before restore can stop or replace a target. Restore prepares the replacement beside the target and keeps the original directory until installation succeeds.

Updates and restores allow up to 60 seconds for a clean shutdown. If the server does not stop, the operation fails without force-killing it or taking a snapshot of a running world.

| Command | Behavior |
|---------|--------------|
| `backup create [instance] [--label <label>] [--include-logs]` | Snapshot a stopped instance into `consumers/<profile>/backups/<instance>/...`. Active instance if omitted. Logs are skipped unless `--include-logs`. |
| `backup list [instance\|--all]` | List backups in the active consumer. |
| `backup restore [instance] <backup-id> [--instance <name>]` | Verify the complete snapshot before stopping the target, then replace it with rollback on installation failure. Refused if locked. |
| `backup verify [instance] <backup-id> [--instance <name>]` | Verify the backup manifest and file checksums. |
| `backup delete [instance] <backup-id> [--instance <name>]` | Delete one backup. |
| `backup prune [instance] [--keep <n>]` | Keep the newest `n` backups per instance and delete older ones. Default `10`. |

## Instance configuration

| Command | Behavior |
|---------|--------------|
| `config localize [instance\|--all]` | Convert shared-config symlinks into per-instance copies so local edits stick. |
| `config status [instance]` | Print which config files are symlinked vs localized. |

## Workspace checks

| Command | Behavior |
|---------|--------------|
| `doctor` | Check workspace markers, consumer roots, active instances, key external tools (`dart`, `java`, `git`, `tmux`), duplicate configured ports, source metadata, and active-instance symlinks. Exits non-zero on hard failures. |
| `doctor --fix` | Recreate expected consumer directories and refresh active-instance links before checking. |
| `doctor --json` | Emit a machine-readable diagnostics payload. |

## Examples

Create, start headlessly, and monitor:

```bash
./start.sh server create lobby --type paper --auto-build
./start.sh runtime start lobby --no-console
./start.sh runtime watch
./start.sh runtime watch --once >> monitor.log
```

Create isolated, Leaf, hybrid, or parallel servers:

```bash
./start.sh server create vanilla-test --type purpur --isolated
./start.sh plugins copy vanilla-test --artifact Spark.jar --artifact ViaVersion.jar
./start.sh server create leaf --type leaf --auto-build
./start.sh --consumer forge server create hybrid --type mohist --auto-build --mod-dropins --plugin-dropins
./start.sh server create-many --types paper,purpur,canvas,spigot --mc 1.21.11 --auto-build
```

Operate on an explicit set; deletion requires the token printed by its preview:

```bash
./start.sh instance bulk start lobby survival --concurrency 4
./start.sh instance bulk stop lobby survival
./start.sh instance bulk delete lobby survival
./start.sh instance bulk delete lobby survival --confirm "DELETE lobby,survival"
```

Back up, validate an update on staging, or validate and promote it:

```bash
./start.sh runtime stop lobby
./start.sh backup create lobby --label before-plugin-test
./start.sh instance safe-update lobby --mc 1.21.11 --auto-build
./start.sh instance safe-update lobby --mc 1.21.11 --auto-build --promote
```

Set per-instance Java/heap, or protect against deletion and factory reset:

```bash
./start.sh runtime settings set-java /absolute/path/to/java --instance lobby
./start.sh runtime settings set-heap 6G --instance lobby
./start.sh runtime settings check --instance lobby
./start.sh instance lock lobby --pin 4827
./start.sh instance unlock lobby --pin 4827
```

Switch consumers and start Fabric:

```bash
./start.sh consumer use fabric
./start.sh server create modded --type fabric --mc 1.21.11 --auto-build
./start.sh runtime start modded
```

`./start.sh doctor` checks workspace setup. `./start.sh instance delete-all --everywhere` deletes instances across every consumer after double confirmation, skipping locked instances.

[ServerMultiplexor documentation](/servermultiplexor)
