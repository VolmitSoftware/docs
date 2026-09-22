---
title: "Proxy networks"
description: "Velocity networks, backend routing, forwarding, and proxy plugins"
published: true
date: 2026-09-21T00:00:00.000Z
tags: "servermultiplexor"
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Connect local plugin servers through a managed Velocity proxy. Multiplexor configures forwarding, coordinates startup and shutdown, and restores saved backend settings when a server leaves the network.

## Requirements and creation

Networks currently support the Local `plugin` consumer with Paper, Purpur, Folia, Canvas, and Leaf backends on Minecraft 1.19 or newer. Spigot, custom servers, mod consumers, and Remote backends are not supported. Velocity uses modern player forwarding and a generated secret shared with its backends. The proxy authenticates players; backends use offline authentication and bind to loopback so players cannot bypass the proxy from another machine.

Creation requires stopped backend instances. It creates a proxy instance named `<name>-proxy`, downloads Velocity unless `--jar` is supplied, assigns distinct backend ports, and preserves the backend settings it changes. Networks default to `127.0.0.1:25565`; use `--bind 0.0.0.0` for LAN access and connect with the host computer's address. `--offline` is restricted to isolated loopback QA and cannot expose an unauthenticated LAN proxy.

## Commands

| Command | Behavior |
|---------|--------------|
| `network list [--json]` | List network definitions in the plugin consumer. Bare `network` runs this command. |
| `network candidates [--json]` | List stopped, compatible backends that do not already belong to a network. |
| `network recover` | Restore the original files after an interrupted configuration operation. All affected instances must be stopped. |
| `network create <name> --members <a,b> --default <alias> [--proxy velocity] [--port <port>] [--bind <127.0.0.1\|0.0.0.0>] [--fallback <a,b>] [--jar <path>] [--proxy-version <version>] [--offline]` | Create the proxy and configure modern forwarding for the selected backends. Initial routing aliases match instance names. |
| `network add <name> <instance> [--alias <alias>] [--port <port>]` | Add a stopped compatible backend, with an optional routing alias and fixed backend port. |
| `network remove <name> <alias>` | Stop the network, detach any backend, restore its saved settings, and update routing references. Removing the last backend deletes the network definition. Instance files are retained. |
| `network configure <name> [--default <alias>] [--fallback <a,b>] [--port <port>] [--bind <127.0.0.1\|0.0.0.0>]` | Change entry/fallback routing and proxy listening settings. Use `--fallback none` to clear fallback servers. |
| `network start <name> [--timeout <seconds>]` | Validate configuration, start stopped backends, wait for readiness, then start the proxy. Already running members remain running. |
| `network stop <name>` | Stop the proxy before stopping its backends. |
| `network restart <name> [--timeout <seconds>]` | Stop and restart the network in dependency order. |
| `network status <name> [--json]` | Show network and process states, ports, connected players from the proxy, and detected issues. JSON `playersOnline` is `null` when unavailable. |
| `network check <name> [--json]` | Validate membership, forwarding configuration, and ports. |
| `network repair <name>` | Reapply managed network settings after configuration drift. Requires stopped members and an intact forwarding secret; preserves unrelated keys and original backend snapshots. |
| `network console <name>` | Open the proxy console. |
| `network plugins-sync <name>` | Copy Velocity plugin jars from `consumers/plugin-consumers/dropins/velocity/` into this stopped proxy. Backends may remain running. |
| `network delete <name> --confirm <name>` | Stop the network, restore backend network settings, and delete its definition, including when managed configuration has drifted. Retain backend worlds and proxy files. |

## Membership and configuration

| Operation | Rules |
|---|---|
| Add members, edit routing, repair | Stop the whole network first. |
| Remove a backend, delete an instance/network | Stops the network automatically. Removing the entry selects the first surviving fallback, then the first remaining backend. Removed aliases leave fallback and forced-host routes. |
| Delete proxy or last backend | Dissolves the network, retaining other instance files. Bulk deletion and workspace wipes also clean up membership. |
| Sync proxy plugins | Only the proxy must stop. Velocity has its own drop-in source; Bukkit jars are never copied into it. |
| Start | Ports stay fixed; conflicts fail startup. |
| Reset, clone, restore, update a member | Detach it first. Ordinary runtime controls and logs remain available for each process. |
| Fleet metrics | Proxy TPS/player counts are excluded to avoid counting players twice. |

Interrupted configuration blocks further network commands until `network recover` restores original files. The wizard offers recovery/retry if networks cannot load. All affected instances must be stopped.

Backups carrying active network forwarding metadata cannot be restored independently, even after detachment. Use a backup made before joining or after leaving the network.

After manual edits, stop the network, run `network check <name>`, then `network repair <name>` to reapply saved routing/forwarding. Repair preserves unrelated keys, original backend snapshots, and the existing secret; it never rotates the secret. Manually restore a missing/unreadable secret first.

## Connect two servers

```bash
./start.sh --consumer plugin server create lobby --type paper --mc 1.21.11 --auto-build
./start.sh --consumer plugin server create survival --type paper --mc 1.21.11 --auto-build
./start.sh --consumer plugin network create dev --members lobby,survival --default lobby
./start.sh --consumer plugin network check dev
./start.sh --consumer plugin network start dev
./start.sh --consumer plugin network status dev
```

Join `localhost:25565`, then use `/server survival`. Stop the network when finished:

```bash
./start.sh --consumer plugin network stop dev
```

To allow LAN players, stop the network and run `./start.sh --consumer plugin network configure dev --bind 0.0.0.0`. To return its servers to standalone use, run `./start.sh --consumer plugin network delete dev --confirm dev`. This stops the network and restores saved backend connection settings. To delete a server and its files, run `./start.sh --consumer plugin instance delete lobby`; its network membership and routes update automatically. `./start.sh instance delete-all --everywhere` wipes servers and cleans up their networks in one call, skipping PIN-locked instances.

[ServerMultiplexor documentation](/servermultiplexor)
