---
title: "BileTools"
description: "Plugin hot-reload and deployment utility"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

BileTools watches the plugins directory and reloads changed jars. It also provides manual plugin lifecycle commands and optional remote deployment for development servers.

| | |
|---|---|
| Command | `/biletools` (`bile`, `bi`, `b`, `vomit`, `vom`) |
| Folia | Supported |
| Permission | `bile.use` |
| Runtime | Java 17+, Bukkit API 1.20.1+ |

> BileTools can load, unload, and **delete** plugin jars. The remote-deploy
> listener accepts jars over a socket. Treat `bile.use` as equivalent to console
> access. Use this plugin on a development server.
{.is-danger}

- [Installation *Requirements and setup*](/biletools/installation)
- [Commands and permissions *The `/bile` command tree*](/biletools/commands)
- [Configuration *Settings and defaults*](/biletools/configuration)
- [Hot reload behavior *Limits and restart guidance*](/biletools/hot-reload)
- [Remote deploy *Setup and security*](/biletools/remote-deploy)
{.links-list}

## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/BileTools*](https://github.com/VolmitSoftware/BileTools)
- [Releases *Download built jars*](https://github.com/VolmitSoftware/BileTools/releases/)
{.links-list}
