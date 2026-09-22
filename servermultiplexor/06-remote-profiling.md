---
title: "Remote Profiling"
description: "Set up JProfiler startup captures, runtime attachment, and live profiling on Pterodactyl servers"
published: true
date: 2026-09-21T00:00:00.000Z
tags: "servermultiplexor, pterodactyl, profiling"
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Multiplexor profiles Java on remote Pterodactyl servers for analysis in JProfiler. Startup capture records before Minecraft and plugins initialize; attachment records an already-running workload from the moment it attaches. Both support timed snapshots or live JProfiler sessions.

## Requirements

Remote profiling requires Pterodactyl API access **and SSH access to the Wings Docker host**. Panel or SFTP access alone is insufficient.

| Requirement | Setup |
|---|---|
| Pterodactyl account | Save credentials with Client and Application API access to the target, power controls, and administrative startup settings. Enroll a separate Application key when the Client key cannot access administrative routes; see [Remote Servers](/servermultiplexor/05-remote-servers). |
| Wings host | SSH key access to the Linux host running the server container. If Wings runs in a VM on TrueNAS, use the VM's SSH address. The user needs Docker container inspection and command execution, directly or through passwordless sudo with `--sudo-docker`. |
| SSH trust | Trust the host key in the local known-hosts file. Multiplexor reuses SSH configuration/authentication; `--identity-file` selects an existing private-key file. |
| Container | Linux x86_64 or aarch64 with glibc. Startup capture requires a direct Java launch command. |
| Runtime attachment | A full JDK with `jcmd`, exactly one running JVM, permission to attach as its user and load an agent, and no JProfiler agent already loaded. |
| Workstation | JProfiler to inspect snapshots or control live sessions. Multiplexor downloads and verifies the remote agent; the server does not need the desktop application. |

## Configure the node

Save the SSH mapping once per Pterodactyl account and node, then check the target without changing it:

```bash
./start.sh remote profile host-set profiling-test --ssh-target minecraft-node --sudo-docker
./start.sh remote profile check profiling-test
```

`profiling-test` is a server selector; `minecraft-node` is a synthetic local SSH alias. `user@host` also works. Omit `--sudo-docker` when the SSH user can run Docker directly. API keys continue using the existing credential store. Host settings and capture state remain local workspace data; the verified agent cache is `.multiplexor/profiler-agents/`.

The Remote server card's **Profile** action (`j`) provides node setup, readiness checks, startup/attach capture, status, downloads, recovery, and live tunnels. The wizard asks before starting or gracefully restarting a server for startup recording.

## Record startup

For a stopped server, start a two-minute capture:

```bash
./start.sh remote profile start profiling-test --startup --duration 120s
./start.sh remote profile status profiling-test
```

Add `--restart` to authorize restarting an already-running server. Multiplexor stages the agent over SSH, temporarily adds it to the panel's Java startup command, and starts the server. Once the profiling launch is confirmed, it restores the original command so the next ordinary start does not enable profiling.

The remote JVM records and saves the snapshot even if Multiplexor closes. After recording finishes:

```bash
./start.sh remote profile fetch profiling-test --open
```

Fetch downloads `.jps` snapshots and matching capture logs; `--open` opens the latest snapshot through the local file association. Status checks actual capture readiness: elapsed time alone does not mark a capture complete.

## Attach to a running server

```bash
./start.sh remote profile start profiling-test --attach --duration 120s
```

Multiplexor uses the container's `jcmd` to load JProfiler without restarting or changing the startup command. Fetch after recording as above. Attachment captures only subsequent activity and cannot recover startup work that already happened. `--restart` cannot be combined with `--attach`.

## Live sessions

Replace the offline duration with `--live`, then open the tunnel:

```bash
./start.sh remote profile start profiling-test --startup --live
./start.sh remote profile live profiling-test
```

Use `--attach --live` for a running JVM, or add `--restart` for a live startup capture of a running server. Connect JProfiler to the printed localhost address, normally `127.0.0.1:8849`. `--port` selects the agent port and `--local-port` selects the tunnel port.

The SSH tunnel binds to localhost and needs no public profiler port. Keep the tunnel command open; `Ctrl-C` closes it while the server keeps running. JProfiler controls live recording and snapshot saving; `--duration` applies only to offline recording. Logs stay tied to the original container; live log collection lasts up to 24 hours plus five minutes of startup allowance.

## Finish or recover

Finishing a recording leaves the server running and the agent loaded until a normal restart. Restart before attaching again, or use live mode for repeated recordings in one JVM.

If an operation is interrupted before startup settings are restored, run:

```bash
./start.sh remote profile recover profiling-test
```

Recovery restores launch settings without restarting the server or unloading the agent. It preserves and reports another operator's concurrent startup edits for resolution.

## Commands

Prefix each command with `./start.sh`. Omit `--profile` to use the active Pterodactyl account.

| Command | Purpose |
|---|---|
| `remote profile host-set <server> --ssh-target <target> [--ssh-port <port>] [--identity-file <path>] [--known-hosts-file <path>] [--sudo-docker] [--profile <id>]` | Associate the server's node with a Docker-host SSH alias or `user@host`. Uses existing SSH authentication and trusted host keys; port defaults to 22. `--sudo-docker` requires passwordless sudo. |
| `remote profile check <server> [--profile <id>]` | Check Java, container platform, SSH access, and startup capture readiness without changing the server. |
| `remote profile start <server> (--startup\|--attach) [--duration <120s\|5m\|1h>] [--agent-dir <path>\|--agent-version <version>] [--config <path>] [--session-id <id>] [--live] [--port <port>] [--restart] [--profile <id>]` | Launch with JProfiler or attach to an already-running JVM. Startup mode preserves and restores the original command; `--restart` explicitly authorizes restarting a running server and cannot be combined with `--attach`. Offline recording defaults to 120 seconds; duration accepts 1 second through 24 hours. Downloads the verified Linux JProfiler 16.2 agent unless a version or extracted agent directory is supplied. `--config` supplies an advanced JProfiler session XML; `--session-id` selects its session (default 1). Live mode uses agent port 8849 by default; `--port` requires `--live`. |
| `remote profile status <server> [--profile <id>]` | Show the latest capture's durable phase, original-command restoration state, and remote snapshot directory. |
| `remote profile fetch <server> [--output <directory>] [--open] [--profile <id>]` | Download available `.jps` snapshots and server logs. Defaults to local capture storage; `--open` opens the latest downloaded snapshot through the OS file association. |
| `remote profile recover <server> [--profile <id>]` | Restore launch settings after an interrupted capture without overwriting another operator's startup edits. Does not restart the server or unload an agent from a running JVM. |
| `remote profile live <server> [--local-port <port>] [--profile <id>]` | Open a loopback SSH tunnel to an existing live capture (default local port 8849). Connect JProfiler to the printed address; Ctrl-C closes the tunnel while the server keeps running. |

[Remote Servers](/servermultiplexor/05-remote-servers) · [ServerMultiplexor](/servermultiplexor)
