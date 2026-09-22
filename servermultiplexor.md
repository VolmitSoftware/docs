---
title: Multiplexor
description: Local and Pterodactyl Minecraft servers, remote profiling, and gameplay tools
published: true
date: 2026-09-22T00:00:00.000Z
tags: servermultiplexor, tools
editor: markdown
dateCreated: 2026-09-10T02:40:32.975Z
---

Multiplexor manages local Minecraft servers and Pterodactyl fleets from one terminal dashboard or command line. It provides builds, backups, content management, Velocity networks, remote JProfiler captures, and automated gameplay tools.

| | |
|---|---|
| Platforms | Windows, macOS, Linux |
| Source launchers | `./start.sh` on macOS/Linux; `.\start.ps1` on Windows |
| Consumers | Plugin, Forge, Fabric, NeoForge; each has separate instances, drop-ins, and builds |
| Remote profiling | Requires Pterodactyl API access and SSH to the Wings host with Docker permissions |
| Gameplay tools | Node.js 22+ and npm; pinned Mineflayer supports Minecraft through 26.1, not 26.2 |

## Server management

- [00 - Visual guide *Screenshots, downloads, first server, remote setup, and updates*](/servermultiplexor/00-visual-guide)
- [01 - Installation and updates *Requirements, launchers, global options, and release updates*](/servermultiplexor/01-installation-and-updates)
- [02 - Dashboard and wizard *Monitoring, keyboard controls, and guided actions*](/servermultiplexor/02-dashboard)
- [03 - Local servers *Consumers, instances, runtime settings, backups, and diagnostics*](/servermultiplexor/03-local-servers)
- [04 - Builds and content *Server builds, drop-ins, addons, and managed downloads*](/servermultiplexor/04-builds-and-content)
- [05 - Remote servers *Accounts, Pterodactyl commands, file transfers, and Multiplexor Drive*](/servermultiplexor/05-remote-servers)
- [06 - Remote profiling *SSH setup, startup captures, runtime attachment, and live JProfiler sessions*](/servermultiplexor/06-remote-profiling)
- [09 - Proxy networks *Velocity, backend routing, and proxy plugins*](/servermultiplexor/09-proxy-networks)
{.links-list}

## Gameplay and development

- [07 - Gameplay checks *Scenarios, assertions, reports, and the live viewer*](/servermultiplexor/07-gameplay-checks)
- [08 - Swarms and sessions *Coordinated bots, workloads, and persistent players*](/servermultiplexor/08-swarms-and-sessions)
- [10 - Workspace and source *Storage layout, source builds, and validation commands*](/servermultiplexor/10-workspace-and-source)
- [11 - Scenario suites *Plugin fixtures, acceptance modules, and coverage*](/servermultiplexor/11-scenario-suites)
- [12 - Session observer *Optional Paper, Folia, and Velocity measurements*](/servermultiplexor/12-session-observer)
{.links-list}

## Downloads and source

- [Releases](https://github.com/VolmitSoftware/ServerMultiplexor/releases/latest)
- [Source](https://github.com/VolmitSoftware/ServerMultiplexor)
{.links-list}
